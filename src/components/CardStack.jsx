import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import FolderPanel from './FolderPanel';
import ConfirmModal from './ConfirmModal';
import StorageBar from './StorageBar';
import { FILE_TYPE_FILTERS, APP_SOURCES } from '../data/mockFiles';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/soundEngine';
import { Trash2, Check, ChevronUp, ChevronDown, LayoutGrid, X } from 'lucide-react';

export default function CardStack() {
  const {
    files, filteredFiles, asmrMode, favorites,
    moveToTrash, keepFile, permanentDelete, organizeFile, confirmDeletion,
    savedMB, activeSource, activeTypeFilter, setActiveTypeFilter,
    setPreviewFile, toggleFavorite,
    setView,
  } = useApp();

  const [folderPanelOpen, setFolderPanelOpen] = useState(false);
  const [pendingFolderFile, setPendingFolderFile] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingDeleteFile, setPendingDeleteFile] = useState(null);

  const formatSize = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const handleSwipeLeft = useCallback((file) => moveToTrash(file), [moveToTrash]);
  const handleSwipeRight = useCallback((file) => {
    if (asmrMode) soundEngine.whoosh('right');
    keepFile(file);
  }, [keepFile, asmrMode]);

  const handleSwipeDown = useCallback((file) => {
    if (confirmDeletion) {
      setPendingDeleteFile(file);
      setConfirmModalOpen(true);
    } else {
      permanentDelete(file);
    }
  }, [permanentDelete, confirmDeletion]);

  const handleSwipeUp = useCallback((file) => {
    if (asmrMode) soundEngine.folder();
    setPendingFolderFile(file);
    setFolderPanelOpen(true);
  }, [asmrMode]);

  const handleFolderSelect = useCallback((folder) => {
    if (pendingFolderFile) {
      organizeFile(pendingFolderFile, folder);
      setPendingFolderFile(null);
    }
    setFolderPanelOpen(false);
  }, [pendingFolderFile, organizeFile]);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteFile) { permanentDelete(pendingDeleteFile); setPendingDeleteFile(null); }
    setConfirmModalOpen(false);
  }, [pendingDeleteFile, permanentDelete]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteFile(null); setConfirmModalOpen(false);
  }, []);

  const visibleFiles = filteredFiles.slice(0, 3);
  const activeSourceData = APP_SOURCES.find(s => s.id === activeSource);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Storage bar */}
      <StorageBar />

      {/* Active source chip */}
      {activeSource !== 'all' && activeSourceData && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '6px 16px 0',
            display: 'flex', alignItems: 'center', gap: '8px',
            background: `${activeSourceData.color}10`,
            border: `1px solid ${activeSourceData.color}25`,
            borderRadius: '10px',
            padding: '7px 12px',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', flex: 1 }}>
            {activeSourceData.name}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: activeSourceData.color }}>
            {filteredFiles.length} files
          </span>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: '5px',
        padding: '8px 16px 4px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }} className="no-scrollbar">
        {FILE_TYPE_FILTERS.map(filter => {
          const isActive = activeTypeFilter === filter.id;
          return (
            <motion.button
              key={filter.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTypeFilter(filter.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '5px 11px',
                borderRadius: '8px',
                background: isActive ? 'rgba(79,124,255,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(79,124,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: isActive ? '#4f7cff' : 'var(--text-muted)',
                fontSize: '12px', fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '12px' }}>{filter.icon}</span>
              {filter.label}
            </motion.button>
          );
        })}

        {/* Grid toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setView('multiselect')}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 11px',
            borderRadius: '8px',
            background: 'rgba(157,107,255,0.12)',
            border: '1px solid rgba(157,107,255,0.3)',
            color: '#9d6bff',
            fontSize: '12px', fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          <LayoutGrid size={12} />
          Grid
        </motion.button>
      </div>

      {/* Card stack area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '0 16px',
      }}>

        {/* Saved counter */}
        {savedMB > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', top: '2px',
              background: 'rgba(0,217,126,0.12)',
              border: '1px solid rgba(0,217,126,0.25)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px', fontWeight: 700, color: '#00d97e',
              zIndex: 30,
            }}
          >
            ↓ Saved {formatSize(savedMB)}
          </motion.div>
        )}

        {/* Up arrow hint */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: savedMB > 0 ? '34px' : '4px',
            zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
            color: 'rgba(255,255,255,0.18)', fontSize: '10px', fontWeight: 500,
            pointerEvents: 'none',
          }}
        >
          <ChevronUp size={11} strokeWidth={2.5} />
          <span>Folder</span>
        </motion.div>

        {/* Cards */}
        <div style={{
          position: 'relative',
          width: '100%', maxWidth: '360px', height: '420px',
        }}>
          <AnimatePresence>
            {filteredFiles.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  style={{ fontSize: '52px' }}
                >
                  ✨
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '6px', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {files.length === 0 ? 'All Done!' : 'No Files Match'}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {files.length === 0
                      ? "You've reviewed all your files!"
                      : 'Try changing the filter above.'}
                  </p>
                </div>
              </motion.div>
            ) : (
              visibleFiles.map((file, index) => (
                <SwipeCard
                  key={file.id}
                  file={file}
                  index={index}
                  asmrMode={asmrMode}
                  isFavorite={favorites.some(f => f.id === file.id)}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onSwipeDown={handleSwipeDown}
                  onSwipeUp={handleSwipeUp}
                  onLongPress={(f) => setPreviewFile(f)}
                  onDoubleTap={(f) => toggleFavorite(f)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Down arrow hint */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '40px',
            zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
            color: 'rgba(255,255,255,0.16)', fontSize: '10px', fontWeight: 500,
            pointerEvents: 'none',
          }}
        >
          <span>Delete</span>
          <ChevronDown size={11} strokeWidth={2.5} />
        </motion.div>

        {/* Bottom gesture hint bar */}
        <div style={{
          position: 'absolute', bottom: '8px',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(7,7,16,0.7)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '5px 14px',
          }}>
            <Trash2 size={11} color="var(--accent-red)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Trash</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', opacity: 0.5, margin: '0 2px' }}>←  →</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 500 }}>Keep</span>
            <Check size={11} color="var(--accent-green)" />
            <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 2px' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '10px', opacity: 0.6 }}>2× tap ⭐</span>
          </div>
        </div>
      </div>

      <FolderPanel
        visible={folderPanelOpen}
        onSelect={handleFolderSelect}
        onClose={() => { setFolderPanelOpen(false); setPendingFolderFile(null); }}
      />
      <ConfirmModal
        visible={confirmModalOpen}
        file={pendingDeleteFile}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
