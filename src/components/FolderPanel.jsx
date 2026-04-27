import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export default function FolderPanel({ visible, onSelect, onClose }) {
  const { folders, createFolder } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const portalTarget = document.getElementById('app-container');

  const handleCreate = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      const folder = createFolder(newFolderName.trim());
      onSelect(folder);
      setIsCreating(false);
      setNewFolderName('');
    }
  };

  const handleClose = () => {
    setIsCreating(false);
    setNewFolderName('');
    onClose();
  };

  const content = (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'absolute', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            }}
          />
          {/* Panel */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 101,
              background: 'rgba(13, 13, 26, 0.95)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
              padding: '12px 20px 40px', backdropFilter: 'blur(20px)',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 40, height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px',
            }} />

            <h3 style={{
              fontSize: '20px', fontWeight: 800, marginBottom: '20px', textAlign: 'center', color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Move to Folder
            </h3>

            {isCreating ? (
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '14px 16px', color: '#fff', fontSize: '15px',
                    outline: 'none', width: '100%'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setIsCreating(false)} style={{
                    flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                    color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'
                  }}>Cancel</button>
                  <button type="submit" disabled={!newFolderName.trim()} style={{
                    flex: 1, padding: '12px', borderRadius: '12px', background: '#4f7cff',
                    color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer',
                    opacity: newFolderName.trim() ? 1 : 0.5
                  }}>Create</button>
                </div>
              </form>
            ) : (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                maxHeight: '400px', overflowY: 'auto'
              }} className="no-scrollbar">
                {folders.map(folder => (
                  <motion.button
                    key={folder.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelect(folder)}
                    style={{
                      background: `linear-gradient(135deg, ${folder.color}15, ${folder.color}05)`,
                      border: `1px solid ${folder.color}30`,
                      borderRadius: '16px', padding: '16px',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{folder.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{folder.name}</span>
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsCreating(true)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    borderRadius: '16px', padding: '16px',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '8px',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Plus size={20} color="var(--text-secondary)" />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Add Folder</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return portalTarget ? ReactDOM.createPortal(content, portalTarget) : content;
}
