import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Trash2, Heart, Check, Grid, X } from 'lucide-react';

export default function MultiSelectView() {
  const {
    filteredFiles, selectedFiles, toggleSelectFile,
    selectAll, deselectAll, batchDelete, batchKeep,
    setView, setPreviewFile,
  } = useApp();

  const allSelected = filteredFiles.length > 0 && selectedFiles.size === filteredFiles.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Selection Header */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
            {selectedFiles.size} selected
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Tap to select, long-press to preview
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={allSelected ? deselectAll : selectAll}
          style={{
            background: allSelected ? 'rgba(61,126,255,0.2)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${allSelected ? 'rgba(61,126,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '10px',
            padding: '7px 14px',
            cursor: 'pointer',
            color: allSelected ? '#3d7eff' : '#fff',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </motion.button>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 12px 120px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        alignContent: 'start',
      }}>
        <AnimatePresence>
          {filteredFiles.map((file, i) => {
            const isSelected = selectedFiles.has(file.id);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => toggleSelectFile(file.id)}
                onContextMenu={(e) => { e.preventDefault(); setPreviewFile(file); }}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected
                    ? '3px solid #3d7eff'
                    : '3px solid transparent',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <img
                  src={file.thumb || file.image}
                  alt={file.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isSelected ? 'brightness(0.7)' : 'none',
                    transition: 'filter 0.2s ease',
                  }}
                />

                {/* Selection indicator */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0,
                    opacity: isSelected ? 1 : 0,
                  }}
                  style={{
                    position: 'absolute',
                    top: 6, right: 6,
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: '#3d7eff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <Check size={12} color="#fff" strokeWidth={3} />
                </motion.div>

                {/* File size badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 4, left: 4,
                  background: 'rgba(0,0,0,0.65)',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                }}>
                  {file.size >= 10 ? `${file.size.toFixed(0)}M` : `${file.size.toFixed(1)}M`}
                </div>

                {/* Video badge */}
                {file.type === 'video' && (
                  <div style={{
                    position: 'absolute',
                    top: 6, left: 6,
                    background: 'rgba(255,45,85,0.85)',
                    borderRadius: '6px',
                    padding: '1px 6px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    VIDEO
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Batch Actions Bar */}
      {selectedFiles.size > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '20px',
            right: '20px',
            display: 'flex',
            gap: '10px',
            zIndex: 50,
          }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={batchDelete}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ff3b5c, #ff6b6b)',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 32px rgba(255,59,92,0.4)',
            }}
          >
            <Trash2 size={18} />
            Delete {selectedFiles.size}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={batchKeep}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #00e676, #00c853)',
              border: 'none',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 32px rgba(0,230,118,0.4)',
            }}
          >
            <Heart size={18} />
            Keep {selectedFiles.size}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
