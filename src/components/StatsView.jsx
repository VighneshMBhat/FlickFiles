import React from 'react';
import { motion } from 'framer-motion';
import { BADGES } from '../data/mockFiles';
import { useApp } from '../context/AppContext';
import { Trophy, Zap, Target } from 'lucide-react';

export default function StatsView() {
  const { stats, savedMB, swipeCount, kept, trash, organized, favorites } = useApp();

  const formatSize = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const unlockedBadges = BADGES.filter(b => b.requirement(stats));
  const lockedBadges = BADGES.filter(b => !b.requirement(stats));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 20px 100px',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
        🏆 Stats & Achievements
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
        Your cleaning journey at a glance
      </p>

      {/* Main Stats */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(61,126,255,0.18), rgba(168,85,247,0.12))',
        border: '1px solid rgba(61,126,255,0.3)',
        borderRadius: '24px',
        padding: '24px 20px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: -40, right: -40,
          width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '16px',
            background: 'linear-gradient(135deg, #3d7eff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={24} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {formatSize(savedMB)}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              Total space saved
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
          {[
            { v: swipeCount, label: 'Swipes', color: '#3d7eff' },
            { v: kept.length, label: 'Kept', color: '#00e676' },
            { v: trash.length, label: 'Trashed', color: '#ff3b5c' },
            { v: favorites.length, label: 'Favorites', color: '#ffd600' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '14px',
              padding: '12px 8px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.v}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <p style={{
        fontSize: '12px', fontWeight: 700,
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '12px',
      }}>
        🎖️ Unlocked ({unlockedBadges.length}/{BADGES.length})
      </p>

      {unlockedBadges.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {unlockedBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,214,0,0.12), rgba(255,150,0,0.06))',
                border: '1px solid rgba(255,214,0,0.3)',
                borderRadius: '18px',
                padding: '16px 14px',
                textAlign: 'center',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                style={{ fontSize: '32px', marginBottom: '8px' }}
              >
                {badge.icon}
              </motion.div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{badge.name}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{badge.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <Target size={32} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>Start swiping to unlock badges!</p>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <>
          <p style={{
            fontSize: '12px', fontWeight: 700,
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '12px',
          }}>
            🔒 Locked
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {lockedBadges.map(badge => (
              <div
                key={badge.id}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '18px',
                  padding: '16px 14px',
                  textAlign: 'center',
                  opacity: 0.45,
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px', filter: 'grayscale(1)' }}>
                  {badge.icon}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>{badge.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{badge.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
