import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ visible, file, onConfirm, onCancel }) {
  const portalTarget = document.getElementById('app-container');

  const content = (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 200,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 201,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background: 'rgba(18, 18, 28, 0.98)',
              border: '1px solid rgba(255, 59, 92, 0.3)',
              borderRadius: '24px',
              padding: '28px 24px',
              width: '85%',
              maxWidth: '340px',
              boxShadow: '0 0 60px rgba(255, 59, 92, 0.2)',
              pointerEvents: 'all',
            }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255, 59, 92, 0.15)',
              border: '1px solid rgba(255, 59, 92, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <AlertTriangle size={24} color="#ff3b5c" />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, textAlign: 'center', color: '#fff', marginBottom: '8px' }}>
              Delete Permanently?
            </h2>

            {file && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '6px' }}>
                {file.name}
              </p>
            )}

            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '24px', lineHeight: 1.5 }}>
              This action cannot be undone. The file will be permanently removed.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ff3b5c, #ff6b6b)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 20px rgba(255, 59, 92, 0.4)',
                }}
              >
                Delete
              </motion.button>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return portalTarget ? ReactDOM.createPortal(content, portalTarget) : content;
}
