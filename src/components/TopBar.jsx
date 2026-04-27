import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Settings, X, User, Crown, HelpCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/soundEngine';

function FlickLogo() {
  return (
    <img src="/logo.png" alt="FlickFiles Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: '#000' }} />
  );
}

export default function TopBar() {
  const { asmrMode, setAsmrMode, view, setView } = useApp();
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

          {/* Settings */}
          <button 
            onClick={() => setView('settings')}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              width: 40, height: 40, borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', outline: 'none'
            }}
          >
            <Settings size={18} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                position: 'relative', width: '280px', height: '100%',
                background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', paddingTop: '20px'
              }}
            >
              <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FlickLogo />
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>Menu</span>
                </div>
                <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#fff', fontWeight: 600 }}>
                  <User size={18} color="var(--accent-blue)" /> Profile
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: 'rgba(157, 107, 255, 0.1)', border: '1px solid rgba(157, 107, 255, 0.3)', color: '#fff', fontWeight: 600 }}>
                  <Crown size={18} color="var(--accent-yellow)" /> Upgrade to Pro
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <HelpCircle size={18} /> Support
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <Info size={18} /> About FlickFiles
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
