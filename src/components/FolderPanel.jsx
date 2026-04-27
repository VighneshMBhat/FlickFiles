import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FOLDERS } from '../data/mockFiles';

export default function FolderPanel({ visible, onSelect, onClose }) {
  const portalTarget = document.getElementById('app-container');

  const content = (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 101,
              background: 'rgba(18, 18, 28, 0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '12px 20px 40px',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 20px',
            }} />

            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', textAlign: 'center', color: '#fff' }}>
              📁 Move to Folder
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {FOLDERS.map(folder => (
                <motion.button
                  key={folder.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(folder)}
                  style={{
                    background: `linear-gradient(135deg, ${folder.color}18, ${folder.color}08)`,
                    border: `1px solid ${folder.color}40`,
                    borderRadius: '16px',
                    padding: '18px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{folder.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{folder.name}</span>
                </motion.button>
              ))}

              {/* Add folder button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect({ id: 'new', name: 'New Folder', icon: '📂' })}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  padding: '18px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  gridColumn: 'span 2',
                }}
              >
                <span style={{ fontSize: '24px' }}>➕</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Add Folder</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return portalTarget ? ReactDOM.createPortal(content, portalTarget) : content;
}
