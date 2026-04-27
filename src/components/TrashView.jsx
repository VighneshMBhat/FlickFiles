import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

function formatSize(mb) {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}

export default function TrashView() {
  const { trash, restoreFromTrash, emptyTrash, restoreAllTrash } = useApp();

  const totalSize = trash.reduce((sum, f) => sum + f.size, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        flex: 1, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        padding: '20px 20px 40px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          🗑️ Trash
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          {trash.length} items · {formatSize(totalSize)}
        </p>
      </div>

      {/* Bulk Actions */}
      {trash.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={restoreAllTrash}
            style={{
              flex: 1, padding: '12px',
              borderRadius: '14px',
              background: 'rgba(61,126,255,0.12)',
              border: '1px solid rgba(61,126,255,0.3)',
              color: '#3d7eff', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <RotateCcw size={15} />
            Restore All
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={emptyTrash}
            style={{
              flex: 1, padding: '12px',
              borderRadius: '14px',
              background: 'rgba(255,59,92,0.12)',
              border: '1px solid rgba(255,59,92,0.3)',
              color: '#ff3b5c', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <AlertTriangle size={15} />
            Empty All
          </motion.button>
        </div>
      )}

      {trash.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          color: 'rgba(255,255,255,0.25)',
        }}>
          <Trash2 size={56} strokeWidth={1} />
          <p style={{ fontSize: '16px', fontWeight: 500 }}>Trash is empty</p>
          <p style={{ fontSize: '13px', textAlign: 'center', maxWidth: '220px', lineHeight: 1.5 }}>
            Swipe left on files to move them here
          </p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <AnimatePresence>
            {trash.map((file) => {
              // Time-delayed deletion indicator
              const timeInTrash = Date.now() - file.trashedAt;
              const daysLeft = Math.max(0, 30 - Math.floor(timeInTrash / (1000 * 60 * 60 * 24)));

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', padding: '12px 14px',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: '10px',
                    overflow: 'hidden', flexShrink: 0, background: '#1a1a28',
                  }}>
                    <img
                      src={file.thumb || file.image}
                      alt={file.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px', fontWeight: 600, color: '#fff',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: '3px',
                    }}>{file.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                        {formatSize(file.size)}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: 600,
                        color: daysLeft <= 7 ? '#ff3b5c' : 'rgba(255,255,255,0.3)',
                        background: daysLeft <= 7 ? 'rgba(255,59,92,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${daysLeft <= 7 ? 'rgba(255,59,92,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '1px 6px', borderRadius: '6px',
                      }}>
                        {daysLeft}d left
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => restoreFromTrash(file.id)}
                    style={{
                      background: 'rgba(61,126,255,0.15)',
                      border: '1px solid rgba(61,126,255,0.35)',
                      borderRadius: '10px',
                      width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <RotateCcw size={14} color="#3d7eff" />
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
