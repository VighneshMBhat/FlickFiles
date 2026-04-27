import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/soundEngine';
import { 
  Folder, Image as ImageIcon, Video, Smartphone, FileText, Music, 
  ArrowDownCircle, TrendingUp, Trash2, Check, Star,
  FolderPlus, Plus, X, AlertTriangle
} from 'lucide-react';

// Circular Progress Component
function CircularProgress({ percentage, color }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 76, height: 76 }}>
      <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="38" cy="38" r={radius}
          stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none"
        />
        <circle
          cx="38" cy="38" r={radius}
          stroke={color} strokeWidth="8" fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{percentage}%</span>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Used</span>
      </div>
    </div>
  );
}

const FILTERS = [
  { id: 'all', label: 'All', icon: Folder },
  { id: 'image', label: 'Photos', icon: ImageIcon },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'screenshot', label: 'Screenshots', icon: Smartphone },
  { id: 'document', label: 'Docs', icon: FileText },
  { id: 'audio', label: 'Audio', icon: Music },
];

export default function CardStack() {
  const {
    files, filteredFiles, asmrMode, swipeSound, favorites,
    moveToTrash, keepFile, activeTypeFilter, setActiveTypeFilter,
    savedMB, setView, permanentDelete, organizeFile,
    folders, createFolder, toggleFavorite
  } = useApp();

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null);
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const formatSize = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(1)} MB`;
  };

  const handleSwipeLeft = useCallback((file) => {
    if (asmrMode) soundEngine.whoosh('left', swipeSound);
    moveToTrash(file);
  }, [moveToTrash, asmrMode, swipeSound]);

  const handleSwipeRight = useCallback((file) => {
    if (asmrMode) soundEngine.whoosh('right', swipeSound);
    keepFile(file);
  }, [keepFile, asmrMode, swipeSound]);

  const handleSwipeIntent = useCallback((direction, fileId) => {
    setActiveFileId(fileId);
    if (direction === 'up') {
      setIsCreatingFolder(false);
      setNewFolderName('');
      setFolderModalOpen(true);
    } else if (direction === 'down') {
      setDeleteModalOpen(true);
    }
  }, []);

  const handleMoveToFolder = (folder) => {
    if (activeFileId) {
      const file = filteredFiles.find(f => f.id === activeFileId);
      if (file) organizeFile(file, folder);
    }
    setFolderModalOpen(false);
    setActiveFileId(null);
    setIsCreatingFolder(false);
  };

  const handleCreateAndMove = () => {
    if (!newFolderName.trim()) return;
    const newFolder = createFolder(newFolderName.trim());
    handleMoveToFolder(newFolder);
  };

  const confirmDelete = () => {
    if (activeFileId) {
      const file = filteredFiles.find(f => f.id === activeFileId);
      if (file) permanentDelete(file);
    }
    setDeleteModalOpen(false);
    setActiveFileId(null);
  };

  // Background cards logic for the stack effect
  const renderBackgroundCards = () => {
    const bgCards = [];
    // Show up to 4 background cards
    for (let i = 1; i <= Math.min(4, filteredFiles.length - 1); i++) {
      const isLeft = i % 2 !== 0;
      const offset = Math.ceil(i / 2) * 20;
      const rotation = isLeft ? -5 - (i * 2) : 5 + (i * 2);
      const xPos = isLeft ? -offset - 10 : offset + 10;
      
      // Select glow color based on position
      const glowColor = isLeft ? (i > 1 ? '#FF3B5C' : '#9D6BFF') : (i > 2 ? '#FFD600' : '#00E676');

      bgCards.push(
        <motion.div
          key={`bg-${i}`}
          style={{
            position: 'absolute',
            width: '100%', height: '100%',
            background: 'var(--bg-surface)',
            borderRadius: '24px',
            border: `1px solid rgba(255,255,255,0.05)`,
            boxShadow: `0 0 20px ${glowColor}40`,
            zIndex: -i,
            top: 0, left: 0, right: 0, bottom: 0,
          }}
          animate={{ x: xPos, y: i * 8, rotate: rotation, scale: 1 - i * 0.05, opacity: 1 - i * 0.15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      );
    }
    return bgCards;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px', display: 'flex', flexDirection: 'column' }} className="no-scrollbar">
        {/* Storage Overview */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ 
            background: 'var(--bg-card)', borderRadius: '20px', padding: '20px',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
                STORAGE OVERVIEW
              </span>
              <div style={{ 
                background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.2)',
                padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <ArrowDownCircle size={12} color="#00E676" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#00E676' }}>{formatSize(savedMB)} freed</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <CircularProgress percentage={82} color="var(--accent-purple)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>52.4 GB</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>/ 64 GB</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <TrendingUp size={14} color="#00E676" />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>4 MB freed today</span>
                </div>
                {/* Linear Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, #3D7EFF, #6C4DFF)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ 
          display: 'flex', gap: '10px', padding: '20px', overflowX: 'auto', flexShrink: 0,
          WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
        }} className="no-scrollbar">
          {FILTERS.map(f => {
            const isActive = activeTypeFilter === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTypeFilter(isActive ? 'all' : f.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: isActive ? 'rgba(108, 77, 255, 0.15)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--accent-purple)' : 'var(--border)'}`,
                  padding: '8px 16px', borderRadius: '12px', whiteSpace: 'nowrap',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--accent-purple)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Saved MB Banner */}
        {savedMB > 0 && (
          <div style={{ padding: '0 20px 20px', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(90deg, rgba(0,230,118,0.05), transparent)',
              border: '1px solid rgba(0,230,118,0.15)', borderRadius: '16px',
              padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <ArrowDownCircle size={32} color="#00E676" strokeWidth={1.5} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#00E676' }}>You saved {formatSize(savedMB)}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Awesome! Keep cleaning</div>
                </div>
              </div>
              <button 
                onClick={() => setView('stats')}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  padding: '8px 12px', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                }}
              >
                <TrendingUp size={14} /> View Analytics
              </button>
            </div>
          </div>
        )}

        {/* Card Stack Area - Flex 1 to push elements to bottom */}
        <div style={{ 
          position: 'relative', flex: 1, minHeight: '340px', width: '100%', 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          perspective: 1000
        }}>
          {filteredFiles.length > 0 ? (
            <div style={{ position: 'relative', width: '85%', height: '100%', zIndex: 10 }}>
              {renderBackgroundCards()}
              
              <AnimatePresence>
                <SwipeCard
                  key={filteredFiles[0].id}
                  file={filteredFiles[0]}
                  index={0}
                  asmrMode={asmrMode}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onSwipeUp={() => handleSwipeIntent('up', filteredFiles[0].id)}
                  onSwipeDown={() => handleSwipeIntent('down', filteredFiles[0].id)}
                  onDoubleTap={(file) => {
                    toggleFavorite(file);
                    setTimeout(() => keepFile(file), 500);
                  }}
                  isFavorite={favorites.some(f => f.id === filteredFiles[0].id)}
                />
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>All clean!</p>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>No more files to review.</p>
            </div>
          )}
        </div>


        {/* Hints & Actions */}
        <div style={{ padding: '24px 20px 85px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Swipe <span style={{ color: 'var(--accent-red)' }}>left</span> to trash, <span style={{ color: 'var(--accent-green)' }}>right</span> to keep
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            padding: '12px 24px', borderRadius: '30px', width: '100%', maxWidth: '320px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
              ← <Trash2 size={16} color="var(--accent-red)" /> Trash
            </div>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
              Keep <Check size={16} color="var(--accent-green)" />
            </div>
            <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
              2× tap <Star size={16} color="var(--accent-yellow)" />
            </div>
          </div>
        </div>
      </div>

      {/* Folder Selection Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {folderModalOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { setFolderModalOpen(false); setActiveFileId(null); }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              />
              <motion.div
                initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  width: '100%', maxWidth: '400px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
                  borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))', position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderPlus size={20} color="var(--accent-blue)" /> Move to Folder
                  </h3>
                  <button onClick={() => { setFolderModalOpen(false); setActiveFileId(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                  {folders.map(folder => (
                    <button
                      key={folder.id} onClick={() => handleMoveToFolder(folder)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)', border: 'none', color: '#fff', fontWeight: 600,
                        cursor: 'pointer', flexShrink: 0
                      }}
                    >
                      <Folder size={18} color={folder.color || "var(--text-secondary)"} /> {folder.name}
                    </button>
                  ))}
                  
                  {isCreatingFolder ? (
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px',
                      background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '12px'
                    }}>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreateAndMove()}
                        style={{
                          flex: 1, background: 'transparent', border: 'none', outline: 'none',
                          color: '#fff', fontSize: '15px', padding: '8px', fontWeight: 500
                        }}
                      />
                      <button
                        onClick={handleCreateAndMove}
                        disabled={!newFolderName.trim()}
                        style={{
                          background: 'var(--accent-blue)', color: '#fff', border: 'none',
                          padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: newFolderName.trim() ? 'pointer' : 'not-allowed',
                          opacity: newFolderName.trim() ? 1 : 0.5
                        }}
                      >
                        Create
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsCreatingFolder(true)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px',
                        background: 'rgba(108, 77, 255, 0.1)', border: '1px dashed rgba(108, 77, 255, 0.4)', color: 'var(--accent-purple)', fontWeight: 600,
                        cursor: 'pointer', marginTop: '8px', flexShrink: 0
                      }}
                    >
                      <Plus size={18} /> Add Folder
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal via Portal */}
      {createPortal(
        <AnimatePresence>
          {deleteModalOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { setDeleteModalOpen(false); setActiveFileId(null); }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  width: '100%', maxWidth: '320px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '24px', padding: '24px', position: 'relative', textAlign: 'center'
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: 'rgba(255, 59, 92, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <AlertTriangle size={28} color="var(--accent-red)" />
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '18px' }}>Delete permanently?</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                  This file will be completely removed. This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => { setDeleteModalOpen(false); setActiveFileId(null); }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                      border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--accent-red)',
                      border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
