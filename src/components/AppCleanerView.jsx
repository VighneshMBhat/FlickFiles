import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Trash2, 
  Brush,
  Database,
  Layers,
  Search,
  HardDrive,
  RefreshCw,
  LayoutGrid
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Technical data mock for the scanning effect
const MOCK_SCAN_LOGS = [
  "Analyzing /system/cache/temp...",
  "Found 1,242 residual log files",
  "Checking for duplicate media...",
  "Detected high-res video waste (2.4GB)",
  "Scanning application cache indices...",
  "Indexing thumbnail database...",
  "Checking temporary download fragments...",
  "Cleanable system data identified.",
  "Optimizing database clusters...",
  "Cleanup routine ready to execute."
];

const JUNK_CATEGORIES = [
  { id: 'cache', name: 'System Cache', icon: <Database size={18} />, size: '1.4 GB', color: 'var(--accent-blue)', desc: 'Temporary system files' },
  { id: 'residuals', name: 'Residual Data', icon: <Layers size={18} />, size: '840 MB', color: 'var(--accent-purple)', desc: 'Leftovers from deleted apps' },
  { id: 'duplicates', name: 'Media Waste', icon: <LayoutGrid size={18} />, size: '2.1 GB', color: 'var(--accent-green)', desc: 'Duplicate photos & videos' },
  { id: 'large', name: 'Large Files', icon: <HardDrive size={18} />, size: '4.2 GB', color: 'var(--accent-yellow)', desc: 'Files over 500MB' }
];

export default function AppCleanerView() {
  const { triggerHaptic, addToast } = useApp();
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'analyzed' | 'cleaning' | 'done'
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  
  const logTimer = useRef(null);

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
    setLogIndex(0);
    triggerHaptic([40, 20, 40]);
    
    // Scan animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus('analyzed');
            setTotalFound(8.5); // Mock 8.5 GB found
            addToast('System analysis complete!', 'info');
            triggerHaptic([30, 10, 30]);
          }, 800);
          return 100;
        }
        return prev + 1.5;
      });
      
      // Update logs randomly
      if (Math.random() > 0.85) {
        setLogIndex(prev => (prev + 1) % MOCK_SCAN_LOGS.length);
      }
    }, 40);
  };

  const startCleaning = () => {
    setStatus('cleaning');
    setProgress(0);
    triggerHaptic([100, 50, 100]);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus('done');
            addToast('System successfully optimized!', 'success');
            triggerHaptic([50, 20, 50, 20, 100]);
          }, 1000);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div style={{ 
      flex: 1, display: 'flex', flexDirection: 'column', 
      background: '#020205', position: 'relative', overflow: 'hidden' 
    }}>
      {/* Immersive technical background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-blue), transparent)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
        <div style={{ position: 'absolute', top: '0', left: '20%', width: '1px', height: '100%', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
      </div>

      <div style={{ flex: 1, padding: '32px 24px 120px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="no-scrollbar">
        
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: '14px', 
              background: 'rgba(61, 126, 255, 0.1)', border: '1px solid rgba(61, 126, 255, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Brush size={24} color="var(--accent-blue)" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', fontFamily: "'Space Grotesk', sans-serif" }}>
              Core Optimizer
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 500 }}>
            Advanced system-level scan & clean up
          </p>
        </div>

        {/* Main Scanner Hub */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '40px', padding: '60px 24px', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', position: 'relative', marginBottom: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          minHeight: '400px', justifyContent: 'center'
        }}>
          {/* Animated Background Pulse */}
          <AnimatePresence>
            {(status === 'scanning' || status === 'cleaning') && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ 
                  position: 'absolute', width: '300px', height: '300px', 
                  borderRadius: '50%', background: status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)', 
                  filter: 'blur(100px)', zIndex: 0 
                }}
              />
            )}
          </AnimatePresence>

          {/* Central Progress Ring */}
          <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
              <motion.circle 
                cx="110" cy="110" r="100" fill="none" 
                stroke={status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)'}
                strokeWidth="12" 
                strokeDasharray="628.3" 
                initial={{ strokeDashoffset: 628.3 }} 
                animate={{ strokeDashoffset: 628.3 - (628.3 * progress / 100) }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 20px ${status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)'}60)` }}
              />
            </svg>
            
            <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}>
                    <Search size={48} color="rgba(255,255,255,0.2)" />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '12px' }}>System Ready</p>
                  </motion.div>
                )}
                {status === 'scanning' && (
                  <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>{Math.round(progress)}%</span>
                    <p style={{ color: 'var(--accent-blue)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Analyzing...</p>
                  </motion.div>
                )}
                {status === 'analyzed' && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--accent-yellow)', letterSpacing: '-2px' }}>{totalFound}GB</span>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Cleanable Found</p>
                  </motion.div>
                )}
                {status === 'cleaning' && (
                  <motion.div key="clean" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '48px', fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>{Math.round(progress)}%</span>
                    <p style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>Cleaning Junk...</p>
                  </motion.div>
                )}
                {status === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <ShieldCheck size={56} color="var(--accent-green)" />
                    <p style={{ color: 'var(--accent-green)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '12px' }}>Optimized</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Technical Readout / Logs */}
          <div style={{ marginTop: '40px', width: '100%', maxWidth: '240px', height: '20px', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={logIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ 
                  color: status === 'idle' ? 'rgba(255,255,255,0.2)' : 'var(--accent-blue)', 
                  fontSize: '11px', fontWeight: 600, textAlign: 'center', 
                  fontFamily: 'monospace', textTransform: 'uppercase'
                }}
              >
                {status === 'idle' ? 'Core logic operational' : status === 'done' ? 'System Clean' : MOCK_SCAN_LOGS[logIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button Section */}
        <div style={{ marginBottom: '40px' }}>
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="btn-scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={startScan}
                style={{
                  width: '100%', padding: '24px', borderRadius: '24px',
                  background: 'linear-gradient(90deg, #1C448E 0%, var(--accent-blue) 100%)',
                  border: 'none', color: '#fff', fontSize: '18px', fontWeight: 800,
                  boxShadow: '0 10px 40px rgba(28, 68, 142, 0.4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                }}
              >
                <RefreshCw size={20} /> Full System Scan
              </motion.button>
            )}

            {status === 'analyzed' && (
              <motion.button
                key="btn-clean" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={startCleaning}
                style={{
                  width: '100%', padding: '24px', borderRadius: '24px',
                  background: 'linear-gradient(90deg, #00C853 0%, var(--accent-green) 100%)',
                  border: 'none', color: '#fff', fontSize: '18px', fontWeight: 800,
                  boxShadow: '0 10px 40px rgba(0, 200, 83, 0.4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                }}
              >
                <Zap size={20} fill="white" /> Clean up {totalFound}GB Now
              </motion.button>
            )}

            {status === 'done' && (
              <motion.button
                key="btn-reset" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                style={{
                  width: '100%', padding: '24px', borderRadius: '24px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '16px', fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                System Optimized. Run Again?
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Junk Categories (Only show in Analyzed/Cleaning/Done) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {JUNK_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ 
                width: 32, height: 32, borderRadius: '10px', background: `${cat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color
              }}>
                {cat.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>{cat.name}</h4>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{cat.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: cat.color }}>{status === 'done' ? '0' : cat.size.split(' ')[0]}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>{cat.size.split(' ')[1]}</span>
              </div>

              {/* Individual progress lines if scanning/cleaning */}
              {(status === 'scanning' || status === 'cleaning') && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', background: cat.color }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
