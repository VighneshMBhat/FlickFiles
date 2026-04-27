import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Star, PlayCircle, Folder } from 'lucide-react';

export default function FavoritesView() {
  const { favorites, setPreviewFile, toggleFavorite, batchDelete, triggerHaptic, setSelectedFiles, setView } = useApp();
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(new Set());

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    triggerHaptic([10]);
  };

  const handleBatchUnfavorite = () => {
    favorites.filter(f => selectedIds.has(f.id)).forEach(f => toggleFavorite(f));
    setIsSelecting(false);
    setSelectedIds(new Set());
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ padding: '24px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
          Favorites
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsSelecting(!isSelecting);
            setSelectedIds(new Set());
            triggerHaptic([15]);
          }}
          style={{ 
            fontSize: '14px', color: 'var(--accent-purple)', fontWeight: 600, 
            background: 'transparent', border: 'none', cursor: 'pointer' 
          }}
        >
          {isSelecting ? 'Cancel' : 'Select'}
        </motion.button>
      </div>

      <div style={{ padding: '0 20px 10px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          <Star size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>No favorites yet</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Double tap a card to favorite it</p>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '10px 20px 40px'
        }}>
          <AnimatePresence>
            {favorites.map((file, i) => {
              const isSelected = selectedIds.has(file.id);
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: Math.min(i * 0.05, 0.3) }}
                  onClick={() => isSelecting ? toggleSelect(file.id) : setPreviewFile(file)}
                  style={{
                    aspectRatio: '1', borderRadius: '14px', overflow: 'hidden',
                    background: 'var(--bg-surface)', position: 'relative',
                    cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    border: isSelecting && isSelected ? '2px solid var(--accent-purple)' : 'none'
                  }}
                >
                  {/* Image / Thumbnail */}
                  {file.type === 'image' || file.type === 'video' ? (
                    <img 
                      src={file.thumb} 
                      alt={file.name} 
                      style={{ 
                        width: '100%', height: '100%', objectFit: 'cover',
                        opacity: isSelecting && isSelected ? 0.6 : 1
                      }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Folder size={24} color="var(--text-secondary)" />
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelecting && (
                    <div style={{
                      position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: '50%',
                      background: isSelected ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
                      border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isSelected && <Star size={10} color="#fff" fill="#fff" />}
                    </div>
                  )}

                  {/* Video Icon overlay */}
                  {file.type === 'video' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                      <PlayCircle size={24} color="#fff" opacity={0.8} />
                    </div>
                  )}

                  {/* Star Badge (Hide if selecting) */}
                  {!isSelecting && (
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      <Star size={12} color="#fff" fill="#fff" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Batch Action Bar */}
      <AnimatePresence>
        {isSelecting && selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            style={{
              position: 'fixed', bottom: 100, left: 20, right: 20,
              background: 'rgba(30, 30, 45, 0.9)', backdropFilter: 'blur(10px)',
              borderRadius: '20px', padding: '16px', display: 'flex', gap: '12px',
              border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              zIndex: 1000
            }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBatchUnfavorite}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '14px', fontWeight: 600
              }}
            >
              Unfavorite
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                batchDelete(selectedIds);
                setIsSelecting(false);
                setSelectedIds(new Set());
              }}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                background: 'var(--accent-purple)', color: '#fff', fontSize: '14px', fontWeight: 600
              }}
            >
              Delete
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
