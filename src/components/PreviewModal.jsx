import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Star, Share2, Trash2, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PreviewModal() {
  const { previewFile, setPreviewFile, toggleFavorite, favorites, moveToTrash } = useApp();
  const [zoomed, setZoomed] = useState(false);

  if (!previewFile) return null;

  const isFav = favorites.some(f => f.id === previewFile.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: previewFile.name,
        text: `Check out this file: ${previewFile.name}`,
        url: previewFile.image,
      }).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {previewFile && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setPreviewFile(null); setZoomed(false); }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 300,
              background: 'rgba(0,0,0,0.92)',
              backdropFilter: 'blur(20px)',
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 301,
              display: 'flex',
              flexDirection: 'column',
              pointerEvents: 'none',
            }}
          >
            {/* Top bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              pointerEvents: 'all',
            }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{previewFile.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  {previewFile.size?.toFixed(1)} MB · {previewFile.format} · {previewFile.date}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => { setPreviewFile(null); setZoomed(false); }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} color="#fff" />
              </motion.button>
            </div>

            {/* Image */}
            <div
              onClick={() => setZoomed(z => !z)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                pointerEvents: 'all',
                cursor: zoomed ? 'zoom-out' : 'zoom-in',
              }}
            >
              <motion.img
                src={previewFile.image}
                alt={previewFile.name}
                animate={{ scale: zoomed ? 2 : 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                draggable={false}
                style={{
                  maxWidth: '95%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                }}
              />
            </div>

            {/* Bottom actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '20px',
              pointerEvents: 'all',
            }}>
              {[
                {
                  icon: <Trash2 size={20} />,
                  label: 'Delete',
                  color: '#ff3b5c',
                  bg: 'rgba(255,59,92,0.15)',
                  border: 'rgba(255,59,92,0.35)',
                  onClick: () => { moveToTrash(previewFile); setPreviewFile(null); },
                },
                {
                  icon: isFav ? <Heart size={20} fill="#ff3b5c" /> : <Heart size={20} />,
                  label: 'Favorite',
                  color: isFav ? '#ff3b5c' : '#fff',
                  bg: isFav ? 'rgba(255,59,92,0.2)' : 'rgba(255,255,255,0.08)',
                  border: isFav ? 'rgba(255,59,92,0.4)' : 'rgba(255,255,255,0.12)',
                  onClick: () => toggleFavorite(previewFile),
                },
                {
                  icon: zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />,
                  label: zoomed ? 'Zoom Out' : 'Zoom In',
                  color: '#fff',
                  bg: 'rgba(255,255,255,0.08)',
                  border: 'rgba(255,255,255,0.12)',
                  onClick: () => setZoomed(z => !z),
                },
                {
                  icon: <Share2 size={20} />,
                  label: 'Share',
                  color: '#3d7eff',
                  bg: 'rgba(61,126,255,0.15)',
                  border: 'rgba(61,126,255,0.35)',
                  onClick: handleShare,
                },
              ].map(btn => (
                <motion.button
                  key={btn.label}
                  whileTap={{ scale: 0.9 }}
                  onClick={btn.onClick}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    background: btn.bg,
                    border: `1px solid ${btn.border}`,
                    borderRadius: '16px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    color: btn.color,
                    minWidth: '68px',
                  }}
                >
                  {btn.icon}
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{btn.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
