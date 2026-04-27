import React from 'react';
import { motion } from 'framer-motion';
import { TOTAL_STORAGE_GB, USED_STORAGE_GB } from '../data/mockFiles';
import { useApp } from '../context/AppContext';

export default function StorageBar() {
  const { savedMB } = useApp();

  const savedGB = savedMB / 1024;
  const currentUsed = Math.max(0, USED_STORAGE_GB - savedGB);
  const percentage = (currentUsed / TOTAL_STORAGE_GB) * 100;
  const freedPerc = (savedGB / TOTAL_STORAGE_GB) * 100;

  const getColor = () => {
    if (percentage > 85) return '#f0365a';
    if (percentage > 70) return '#ffcc00';
    return '#00d97e';
  };

  return (
    <div style={{ padding: '8px 16px 4px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '10px 14px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Storage
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {savedMB > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontSize: '10px', fontWeight: 700, color: '#00d97e',
                  background: 'rgba(0,217,126,0.12)',
                  border: '1px solid rgba(0,217,126,0.2)',
                  borderRadius: '6px', padding: '2px 7px',
                }}
              >
                ↓ {savedMB >= 1024 ? `${(savedMB/1024).toFixed(1)} GB` : `${savedMB.toFixed(0)} MB`} freed
              </motion.span>
            )}
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              {currentUsed.toFixed(1)} / {TOTAL_STORAGE_GB} GB
            </span>
          </div>
        </div>

        {/* Bar track */}
        <div style={{
          height: '5px',
          borderRadius: '3px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <motion.div
            initial={{ width: `${(USED_STORAGE_GB / TOTAL_STORAGE_GB) * 100}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{
              height: '100%',
              borderRadius: '3px',
              background: `linear-gradient(90deg, ${getColor()}, ${getColor()}bb)`,
            }}
          />
          {savedGB > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${freedPerc}%`, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
              style={{
                position: 'absolute',
                right: `${100 - (USED_STORAGE_GB / TOTAL_STORAGE_GB) * 100}%`,
                top: 0, height: '100%',
                borderRadius: '3px',
                background: 'rgba(0,217,126,0.3)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
