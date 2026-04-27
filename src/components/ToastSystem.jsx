import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Trash2, Heart, FolderOpen, RotateCcw, X, Star } from 'lucide-react';

const TOAST_ICONS = {
  trash: <Trash2 size={16} />,
  keep: <Heart size={16} />,
  folder: <FolderOpen size={16} />,
  delete: <Trash2 size={16} />,
  restore: <RotateCcw size={16} />,
  favorite: <Star size={16} />,
  info: null,
};

const TOAST_COLORS = {
  trash: 'rgba(255, 59, 92, 0.15)',
  delete: 'rgba(255, 59, 92, 0.15)',
  keep: 'rgba(0, 230, 118, 0.15)',
  folder: 'rgba(61, 126, 255, 0.15)',
  restore: 'rgba(255, 214, 0, 0.15)',
  favorite: 'rgba(255, 214, 0, 0.15)',
  info: 'rgba(255, 255, 255, 0.08)',
};

const TOAST_BORDER = {
  trash: 'rgba(255, 59, 92, 0.4)',
  delete: 'rgba(255, 59, 92, 0.4)',
  keep: 'rgba(0, 230, 118, 0.4)',
  folder: 'rgba(61, 126, 255, 0.4)',
  restore: 'rgba(255, 214, 0, 0.4)',
  favorite: 'rgba(255, 214, 0, 0.4)',
  info: 'rgba(255,255,255,0.15)',
};

export default function ToastSystem() {
  const { toasts, removeToast, undoLastAction } = useApp();

  return (
    <div style={{
      position: 'absolute', bottom: '90px', left: '50%',
      transform: 'translateX(-50%)', zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      gap: '8px', alignItems: 'center',
      pointerEvents: 'none',
      width: '90%', maxWidth: '360px',
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              pointerEvents: 'all',
              background: TOAST_COLORS[toast.type] || TOAST_COLORS.info,
              border: `1px solid ${TOAST_BORDER[toast.type] || TOAST_BORDER.info}`,
              backdropFilter: 'blur(16px)',
              borderRadius: '14px', padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
              {TOAST_ICONS[toast.type]}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, flex: 1, color: 'var(--text-primary)' }}>
              {toast.message}
            </span>
            {toast.type === 'trash' && toast.fileId && (
              <button
                onClick={() => { undoLastAction(toast.fileId); removeToast(toast.id); }}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none', borderRadius: '8px',
                  padding: '3px 8px', color: '#fff',
                  fontSize: '11px', fontWeight: 600,
                  cursor: 'pointer', flexShrink: 0,
                }}
              >Undo</button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer',
                padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0,
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
