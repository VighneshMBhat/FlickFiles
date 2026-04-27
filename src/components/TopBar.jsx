import React from 'react';
import { motion } from 'framer-motion';
import { Settings, VolumeX, Volume2, ArrowLeft, Trash2, Layers, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Flat SVG Logo
function FlickLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
      <path d="M7 14L13 8L19 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 19L13 13L19 19" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f7cff"/>
          <stop offset="1" stopColor="#9d6bff"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconBtn({ children, onClick, active, color, badge }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      style={{
        width: 36, height: 36,
        borderRadius: '11px',
        background: active ? `${color}18` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {children}
      {badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 16, height: 16,
            borderRadius: '8px',
            background: '#f0365a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 800, color: '#fff',
            border: '2px solid var(--bg-primary)',
            padding: '0 3px',
          }}
        >{badge}</motion.span>
      )}
    </motion.button>
  );
}

export default function TopBar() {
  const { asmrMode, setAsmrMode, view, setView, files, trash, setActiveSource } = useApp();

  const handleBack = () => {
    if (view === 'main') setActiveSource('all');
    setView('main');
  };

  return (
    <div style={{
      padding: '14px 16px 10px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'relative', zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {view !== 'main' ? (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', padding: '7px 12px',
              cursor: 'pointer', color: 'var(--text-primary)',
              fontSize: '13px', fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            Back
          </motion.button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FlickLogo />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '18px', fontWeight: 700, letterSpacing: '-0.4px',
              color: 'var(--text-primary)',
            }}>
              Flick<span style={{ color: 'var(--accent-blue)' }}>Files</span>
            </span>
          </div>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* File count */}
        {view === 'main' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            padding: '4px 9px',
            fontSize: '12px', fontWeight: 600,
            color: 'var(--text-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {files.length}
          </div>
        )}

        <IconBtn onClick={() => setView('sources')} active={view === 'sources'} color="#9d6bff">
          <Layers size={15} color={view === 'sources' ? '#9d6bff' : 'var(--text-secondary)'} />
        </IconBtn>

        <IconBtn onClick={() => setView('stats')} active={view === 'stats'} color="#ffcc00">
          <Trophy size={15} color={view === 'stats' ? '#ffcc00' : 'var(--text-secondary)'} />
        </IconBtn>

        <IconBtn
          onClick={() => setView('trash')}
          active={trash.length > 0}
          color="#f0365a"
          badge={trash.length > 0 ? trash.length : null}
        >
          <Trash2 size={15} color={trash.length > 0 ? '#f0365a' : 'var(--text-secondary)'} />
        </IconBtn>

        {/* ASMR */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setAsmrMode(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: asmrMode ? 'rgba(79,124,255,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${asmrMode ? 'rgba(79,124,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '11px', padding: '7px 10px',
            cursor: 'pointer',
            color: asmrMode ? '#4f7cff' : 'var(--text-secondary)',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px',
          }}
        >
          {asmrMode ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>{asmrMode ? 'ON' : 'OFF'}</span>
        </motion.button>

        <IconBtn onClick={() => setView('settings')} active={view === 'settings'} color="#4f7cff">
          <Settings size={15} color={view === 'settings' ? '#4f7cff' : 'var(--text-secondary)'} />
        </IconBtn>
      </div>
    </div>
  );
}
