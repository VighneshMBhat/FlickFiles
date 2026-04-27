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
  { id: 'cache', name: 'System Cache', icon: <Database size={16} />, size: '1.4 GB', color: 'var(--accent-blue)', desc: 'Temp files' },
  { id: 'residuals', name: 'Residual Data', icon: <Layers size={16} />, size: '840 MB', color: 'var(--accent-purple)', desc: 'App leftovers' },
  { id: 'duplicates', name: 'Media Waste', icon: <LayoutGrid size={16} />, size: '2.1 GB', color: 'var(--accent-green)', desc: 'Duplicates' },
  { id: 'large', name: 'Large Files', icon: <HardDrive size={16} />, size: '4.2 GB', color: 'var(--accent-yellow)', desc: 'Files >500MB' }
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

      <div style={{ flex: 1, padding: '12px 20px 100px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header Section - Compact inline */}
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: '12px', 
            background: 'rgba(61, 126, 255, 0.1)', border: '1px solid rgba(61, 126, 255, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Brush size={20} color="var(--accent-blue)" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>
              Core Optimizer
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontWeight: 500, margin: 0 }}>
              Advanced system-level scan & clean up
            </p>
          </div>
        </div>

        {/* Main Scanner Hub - Compact */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '28px', padding: '24px 20px', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', position: 'relative', marginBottom: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          flex: 1, justifyContent: 'center', minHeight: 0
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
                  position: 'absolute', width: '200px', height: '200px', 
                  borderRadius: '50%', background: status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)', 
                  filter: 'blur(80px)', zIndex: 0 
                }}
              />
            )}
          </AnimatePresence>

          {/* Central Progress Ring */}
          <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
              <motion.circle 
                cx="80" cy="80" r="72" fill="none" 
                stroke={status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)'}
                strokeWidth="10" 
                strokeDasharray="452.4" 
                initial={{ strokeDashoffset: 452.4 }} 
                animate={{ strokeDashoffset: 452.4 - (452.4 * progress / 100) }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 15px ${status === 'cleaning' ? 'var(--accent-green)' : 'var(--accent-blue)'}60)` }}
              />
            </svg>
            
            <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}>
                    <Search size={28} color="rgba(255,255,255,0.2)" />
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px' }}>System Ready</p>
                  </motion.div>
                )}
                {status === 'scanning' && (
                  <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{Math.round(progress)}%</span>
                    <p style={{ color: 'var(--accent-blue)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px' }}>Analyzing...</p>
                  </motion.div>
                )}
                {status === 'analyzed' && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-yellow)', letterSpacing: '-1px' }}>{totalFound}GB</span>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px' }}>Cleanable Found</p>
                  </motion.div>
                )}
                {status === 'cleaning' && (
                  <motion.div key="clean" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{Math.round(progress)}%</span>
                    <p style={{ color: 'var(--accent-green)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '2px' }}>Cleaning Junk...</p>
                  </motion.div>
                )}
                {status === 'done' && (
                  <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <ShieldCheck size={30} color="var(--accent-green)" />
                    <p style={{ color: 'var(--accent-green)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px' }}>Optimized</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Technical Readout / Logs */}
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '220px', height: '18px', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={logIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ 
                  color: status === 'idle' ? 'rgba(255,255,255,0.2)' : 'var(--accent-blue)', 
                  fontSize: '10px', fontWeight: 600, textAlign: 'center', 
                  fontFamily: 'monospace', textTransform: 'uppercase'
                }}
              >
                {status === 'idle' ? 'Core logic operational' : status === 'done' ? 'System Clean' : MOCK_SCAN_LOGS[logIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Button Section */}
        <div style={{ marginBottom: '12px', flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.button
                key="btn-scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={startScan}
                style={{
                  width: '100%', padding: '18px', borderRadius: '20px',
                  background: 'linear-gradient(90deg, #1C448E 0%, var(--accent-blue) 100%)',
                  border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800,
                  boxShadow: '0 8px 30px rgba(28, 68, 142, 0.4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                <RefreshCw size={18} /> Full System Scan
              </motion.button>
            )}

            {status === 'analyzed' && (
              <motion.button
                key="btn-clean" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.98 }}
                onClick={startCleaning}
                style={{
                  width: '100%', padding: '18px', borderRadius: '20px',
                  background: 'linear-gradient(90deg, #00C853 0%, var(--accent-green) 100%)',
                  border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800,
                  boxShadow: '0 8px 30px rgba(0, 200, 83, 0.4)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                <Zap size={18} fill="white" /> Clean up {totalFound}GB Now
              </motion.button>
            )}

            {status === 'done' && (
              <motion.button
                key="btn-reset" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                style={{
                  width: '100%', padding: '18px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                System Optimized. Run Again?
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Junk Categories - Compact 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexShrink: 0 }}>
          {JUNK_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px',
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: 28, height: 28, borderRadius: '8px', background: `${cat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color, flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</h4>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>{cat.desc}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: cat.color }}>{status === 'done' ? '0' : cat.size.split(' ')[0]}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>{cat.size.split(' ')[1]}</span>
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
