import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Trash2, Check, FolderOpen, Star, Image } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { SWIPE_THRESHOLD } from '../data/mockFiles';

const DRAG_SNAP_DURATION = { type: 'spring', stiffness: 300, damping: 30 };

function formatSize(mb) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}

export default function SwipeCard({
  file, onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp,
  index, asmrMode, onLongPress, onDoubleTap, isFavorite,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [dragging, setDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showFavFlash, setShowFavFlash] = useState(false);

  const longPressTimer = useRef(null);
  const lastTap = useRef(0);
  const constraintRef = useRef(null);

  const rotate = useTransform(x, [-300, 300], [-22, 22]);
  const trashOpacity = useTransform(x, [-SWIPE_THRESHOLD * 0.5, -SWIPE_THRESHOLD * 2], [0, 1]);
  const keepOpacity = useTransform(x, [SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD * 2], [0, 1]);
  const deleteOpacity = useTransform(y, [SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD * 2], [0, 1]);
  const folderOpacity = useTransform(y, [-SWIPE_THRESHOLD * 0.5, -SWIPE_THRESHOLD * 2], [0, 1]);

  const handlePointerDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) onLongPress(file);
    }, 500);
  }, [file, onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const diff = now - lastTap.current;
    if (diff < 300 && onDoubleTap) {
      onDoubleTap(file);
      setShowFavFlash(true);
      setTimeout(() => setShowFavFlash(false), 600);
    }
    lastTap.current = now;
  }, [file, onDoubleTap]);

  const handleDragStart = () => {
    setDragging(true);
    handlePointerUp(); // Cancel long-press on drag
  };

  const handleDragEnd = async (_, info) => {
    setDragging(false);
    const dx = info.offset.x;
    const dy = info.offset.y;
    const vx = info.velocity.x;
    const vy = info.velocity.y;

    const isHoriz = Math.abs(dx) > Math.abs(dy);
    const swipeDir = isHoriz
      ? (dx > 0 ? 'right' : 'left')
      : (dy > 0 ? 'down' : 'up');

    const dist = isHoriz ? Math.abs(dx) : Math.abs(dy);
    const vel = isHoriz ? Math.abs(vx) : Math.abs(vy);

    if (dist > SWIPE_THRESHOLD || vel > 500) {
      await animateOut(swipeDir);
    } else {
      controls.start({ x: 0, y: 0, transition: DRAG_SNAP_DURATION });
    }
  };

  const animateOut = async (direction) => {
    const dist = 800;
    const isSilent = !asmrMode;
    const duration = isSilent ? 0.18 : 0.35;

    switch (direction) {
      case 'left':
        if (asmrMode) soundEngine.trash();
        await controls.start({ x: -dist, opacity: 0, transition: { duration } });
        onSwipeLeft(file);
        break;
      case 'right':
        if (asmrMode) soundEngine.whoosh('right');
        await controls.start({ x: dist, opacity: 0, transition: { duration } });
        onSwipeRight(file);
        break;
      case 'down':
        await controls.start({ y: dist, opacity: 0, transition: { duration } });
        onSwipeDown(file);
        break;
      case 'up':
        await controls.start({ y: -dist * 0.3, transition: { duration: 0.15 } });
        controls.start({ x: 0, y: 0, transition: DRAG_SNAP_DURATION });
        onSwipeUp(file);
        break;
    }
  };

  const zIndex = 10 + (3 - index);
  const scale = 1 - index * 0.04;
  const translateY = index * 10;

  return (
    <div
      ref={constraintRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex,
      }}
    >
    <motion.div
      drag
      dragConstraints={constraintRef}
      dragElastic={0.35}
      style={{
        x, y, rotate,
        position: 'absolute',
        width: '100%',
        height: '100%',
        scale,
        translateY: index === 0 ? 0 : translateY,
        cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        WebkitTouchCallout: 'none',
      }}
      animate={controls}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTap={handleTap}
      className="no-select"
    >
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '28px', overflow: 'hidden', position: 'relative',
        background: '#1a1a28',
        boxShadow: index === 0
          ? '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 10px 30px rgba(0,0,0,0.4)',
      }}>
        {/* Blurred background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${file.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(28px) brightness(0.3) saturate(1.4)',
          transform: 'scale(1.2)',
        }} />

        {/* Loading state */}
        {!imgLoaded && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#1a1a28',
          }}>
            <Image size={32} color="rgba(255,255,255,0.2)" />
          </div>
        )}

        {/* Main image */}
        <img
          src={file.image}
          alt={file.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'contain',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        {/* Gradient overlay bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        }} />

        {/* Favorite star badge */}
        {isFavorite && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,214,0,0.25)',
              border: '2px solid rgba(255,214,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Star size={18} fill="#ffd600" color="#ffd600" />
          </motion.div>
        )}

        {/* Source badge */}
        {file.source && file.source !== 'all' && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px', padding: '4px 10px',
            fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.75)',
            zIndex: 10, textTransform: 'capitalize',
          }}>
            {file.source}
          </div>
        )}

        {/* Double-tap favorite flash */}
        {showFavFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 20, pointerEvents: 'none',
            }}
          >
            <Star size={80} fill="#ffd600" color="#ffd600" style={{ filter: 'drop-shadow(0 0 30px rgba(255,214,0,0.6))' }} />
          </motion.div>
        )}

        {/* File info */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '24px 22px',
        }}>
          <p style={{
            fontSize: '17px', fontWeight: 700, color: '#fff',
            marginBottom: '6px', letterSpacing: '-0.3px',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}>{file.name}</p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
              fontSize: '12px', fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.1)',
              padding: '3px 8px', borderRadius: '6px',
            }}>{formatSize(file.size)}</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              {file.format}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>
              {file.date}
            </span>
          </div>
        </div>

        {/* Swipe overlays */}
        <motion.div style={{
          position: 'absolute', inset: 0, opacity: trashOpacity,
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(255,59,92,0.85), rgba(200,20,60,0.7))',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          paddingLeft: '32px',
        }} className="no-select">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '8px',
            }}>
              <Trash2 size={28} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Trash</span>
          </div>
        </motion.div>

        <motion.div style={{
          position: 'absolute', inset: 0, opacity: keepOpacity,
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(0,230,118,0.85), rgba(0,180,90,0.7))',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          paddingRight: '32px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '8px',
            }}>
              <Check size={30} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Keep</span>
          </div>
        </motion.div>

        <motion.div style={{
          position: 'absolute', inset: 0, opacity: deleteOpacity,
          borderRadius: '28px',
          background: 'linear-gradient(to top, rgba(255,59,92,0.9), rgba(150,0,40,0.7))',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: '40px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Delete Forever</span>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <Trash2 size={28} color="white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        <motion.div style={{
          position: 'absolute', inset: 0, opacity: folderOpacity,
          borderRadius: '28px',
          background: 'linear-gradient(to bottom, rgba(61,126,255,0.9), rgba(30,80,200,0.7))',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '40px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <FolderOpen size={28} color="white" strokeWidth={2} />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>Move to Folder</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
}
