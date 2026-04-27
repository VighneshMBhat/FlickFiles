import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Trash2, X, User, Crown, HelpCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/soundEngine';

function FlickLogo() {
  return (
    <img src="/logo.png" alt="FlickFiles Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: '#000' }} />
  );
}

export default function TopBar() {
  const { asmrMode, setAsmrMode, view, setView, trash } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAsmrToggle = () => {
    const newVal = !asmrMode;
    setAsmrMode(newVal);
    if (newVal) soundEngine.pop();
  };

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 10px',
        position: 'relative', zIndex: 100
      }}>
        {/* Left Section: Back Button (if not main) + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {view !== 'main' && (
            <button 
              onClick={() => setView('main')}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                width: 36, height: 36, borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', outline: 'none', marginRight: '4px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FlickLogo />
            <span style={{
              fontSize: '22px', fontWeight: 800, color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px'
            }}>
              FlickFiles
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* ASMR Toggle */}
          <button 
            onClick={handleAsmrToggle}
            style={{
              background: asmrMode ? 'rgba(108, 77, 255, 0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${asmrMode ? 'rgba(108, 77, 255, 0.4)' : 'rgba(255,255,255,0.06)'}`,
              width: 40, height: 40, borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', outline: 'none', transition: 'all 0.2s ease', position: 'relative'
            }}
          >
            <Headphones size={18} color={asmrMode ? "var(--accent-purple)" : "var(--text-secondary)"} />
            {asmrMode ? (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 10, height: 10, borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  boxShadow: '0 0 8px var(--accent-purple)'
                }}
              />
            ) : (
              <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="8" y1="8" x2="32" y2="32" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          {/* Trash */}
          <button 
            onClick={() => setView('trash')}
            style={{
              background: view === 'trash' ? 'rgba(255, 59, 92, 0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${view === 'trash' ? 'rgba(255, 59, 92, 0.4)' : 'rgba(255,255,255,0.06)'}`,
              width: 40, height: 40, borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', outline: 'none', position: 'relative'
            }}
          >
            <Trash2 size={18} color={view === 'trash' ? "var(--accent-red)" : "var(--text-secondary)"} />
            {trash.length > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent-red)', color: '#fff',
                fontSize: '9px', fontWeight: 800, padding: '2px 5px',
                borderRadius: '6px', minWidth: '16px', textAlign: 'center'
              }}>
                {trash.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
