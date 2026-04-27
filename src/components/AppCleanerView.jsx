import React from 'react'; // v2-fix-bar-persistence
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Zap, 
  ChevronRight, 
  ShieldCheck, 
  PieChart, 
  MessageSquare, 
  Camera, 
  Send, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Video,
  Wand2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12.031 2c-5.506 0-9.989 4.478-9.99 9.984a9.965 9.965 0 001.332 4.988L2 22l5.174-1.357a9.959 9.959 0 004.857 1.259h.005c5.507 0 9.99-4.478 9.991-9.985A9.957 9.957 0 0012.031 2zm5.71 14.15c-.247.695-1.233 1.272-1.701 1.353-.467.08-1.066.124-3.155-.717-2.673-1.076-4.402-3.8-4.536-3.98-.133-.18-1.085-1.442-1.085-2.753 0-1.31.685-1.956.931-2.22.247-.265.541-.331.721-.331h.525c.168 0 .393-.063.613.468.22.531.753 1.838.818 1.971.066.133.11.287.022.463-.088.176-.133.287-.265.441-.132.155-.278.346-.396.464-.132.132-.27.276-.117.541.153.264.68 1.118 1.458 1.81.996.886 1.835 1.161 2.099 1.294.264.132.418.11.573-.066.155-.176.662-.772.839-1.037.176-.265.353-.221.595-.133.242.088 1.543.729 1.808.86.265.132.441.198.507.309.066.111.066.64-.181 1.335z"/>
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const SnapchatLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2c-.88 0-1.72.16-2.5.45-2.24.84-3.5 2.8-3.5 5.55 0 2 .5 3 1.5 4.5-.5.5-1.5 1.5-1.5 2.5 0 1 1.5 1.5 3 1.5.5 1.5 0 2.5-1.5 3.5.5 1 3 1 4.5.5 1.5.5 4 0 4.5-.5-1.5-1-2-2-1.5-3.5 1.5 0 3-.5 3-1.5 0-1-1-2-1.5-2.5 1-1.5 1.5-2.5 1.5-4.5 0-2.75-1.26-4.71-3.5-5.55C13.72 2.16 12.88 2 12 2z"/>
  </svg>
);

const TelegramLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.91-1.27 4.85-2.1 5.82-2.5 2.77-1.13 3.35-1.32 3.73-1.32.08 0 .27.02.39.12.1.08.13.19.14.27.01.06.01.24 0 .38z"/>
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.482h2.039L6.486 3.24H4.298l13.311 17.395z"/>
  </svg>
);

export default function AppCleanerView() {
  const { setView, triggerHaptic, addToast } = useApp();
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [isCleaned, setIsCleaned] = React.useState(false);
  const [selectedApp, setSelectedApp] = React.useState(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setIsCleaned(false);
    triggerHaptic([30, 50, 30]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setIsCleaned(true);
            addToast('Deep Scan Complete!', 'info');
            triggerHaptic([20, 10, 20, 10, 30]);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const apps = [
    { name: 'WhatsApp', sub: '842 images', size: '1.2 GB', progress: 65, color: '#25D366', icon: <WhatsAppLogo /> },
    { name: 'Instagram', sub: '214 images', size: '680 MB', progress: 45, color: '#E4405F', icon: <InstagramLogo /> },
    { name: 'Snapchat', sub: '156 images', size: '420 MB', progress: 30, color: '#FFFC00', icon: <div style={{ color: '#000' }}><SnapchatLogo /></div> },
    { name: 'Telegram', sub: '532 images', size: '1.8 GB', progress: 80, color: '#0088cc', icon: <TelegramLogo /> },
    { name: 'Twitter / X', sub: '89 images', size: '210 MB', progress: 20, color: '#ffffff', icon: <XLogo /> },
    { name: 'Camera Roll', sub: '1,204 images', size: '4.2 GB', progress: 75, color: '#FF9500', icon: <ImageIcon size={20} /> },
    { name: 'Documents', sub: '367 files', size: '890 MB', progress: 40, color: '#AF52DE', icon: <FileText size={20} /> },
    { name: 'Downloads', sub: '78 files', size: '2.1 GB', progress: 55, color: '#5AC8FA', icon: <Download size={20} /> },
    { name: 'Videos', sub: '12 videos', size: '3.4 GB', progress: 70, color: '#FF3B30', icon: <Video size={20} /> },
  ];

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '20px',
    marginBottom: '12px',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#05070A', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!selectedApp ? (
          <motion.div
            key="app-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0 20px 100px',
            }}
          >
            {/* Header */}
            <div style={{ marginTop: '24px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: '14px', 
                  background: 'linear-gradient(135deg, #4A90E2 0%, #1C448E 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(28, 68, 142, 0.4)'
                }}>
                  <Wand2 size={24} color="#fff" />
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                  App Cleaner
                </h1>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.5, maxWidth: '85%' }}>
                Select an app to analyze and clean up its generated junk, cache, and media files.
              </p>

              {/* Decorative phone icon */}
              <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.8, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
                <div style={{ position: 'relative', width: 80, height: 140, borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                   <div style={{ position: 'absolute', inset: '10px', background: 'radial-gradient(circle at center, rgba(74,144,226,0.2) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wand2 size={32} color="#4A90E2" style={{ filter: 'drop-shadow(0 0 10px #4A90E2)' }} />
                   </div>
                </div>
              </div>
            </div>

            {/* Hero Action Card */}
            <div style={{ 
              ...cardStyle, 
              marginTop: '24px',
              background: 'linear-gradient(135deg, rgba(28, 68, 142, 0.3) 0%, rgba(5, 7, 10, 0.5) 100%)',
              border: '1px solid rgba(74, 144, 226, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: 56, height: 56, borderRadius: '50%', background: 'rgba(74, 144, 226, 0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74, 144, 226, 0.3)'
                  }}>
                    <Zap size={28} color="#4A90E2" fill={isScanning ? "none" : "#4A90E2"} style={{ animation: isScanning ? 'pulse 1s infinite' : 'none' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0 }}>
                      {isScanning ? 'Deep Scanning...' : isCleaned ? 'Deep Scan Complete' : 'Deep Scan Ready'}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>
                      {isScanning ? `Analyzing files...` : 'Instantly free up space by reviewing duplicate media.'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startScan}
                  disabled={isScanning}
                  style={{
                    background: isScanning ? 'rgba(255,255,255,0.05)' : 'linear-gradient(90deg, #1C448E 0%, #4A90E2 100%)',
                    border: 'none', borderRadius: '12px', padding: '12px 20px',
                    color: '#fff', fontWeight: 700, fontSize: '14px', cursor: isScanning ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: isScanning ? 'none' : '0 8px 20px rgba(74, 144, 226, 0.3)',
                    opacity: isScanning ? 0.7 : 1
                  }}
                >
                  {isScanning ? `${scanProgress}%` : isCleaned ? 'Scan Again' : 'Start Scan'} 
                  {!isScanning && <ArrowRight size={16} />}
                </motion.button>
              </div>

              {isScanning && (
                <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div 
                    style={{ height: '100%', background: 'linear-gradient(90deg, #1C448E, #4A90E2)', width: `${scanProgress}%` }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                  />
                </div>
              )}
            </div>

            {/* App List */}
            <div style={{ marginTop: '12px' }}>
              {apps.map((app, index) => (
                <motion.div
                  key={app.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    triggerHaptic([15]);
                    setSelectedApp(app);
                  }}
                  style={{
                    ...cardStyle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: '12px', background: `${app.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${app.color}30`
                    }}>
                      <div style={{ color: app.color }}>{app.icon}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, margin: 0 }}>{app.name}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>{app.sub}</p>
                    </div>
                  </div>



                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: app.color, fontSize: '14px', fontWeight: 700 }}>{app.size}</span>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>
        ) : (
          <AppDetail 
            app={selectedApp} 
            isScanning={isScanning}
            onBack={() => { triggerHaptic([10]); setSelectedApp(null); }} 
            onClean={() => {
              triggerHaptic([30, 50, 100]);
              addToast(`Cleaned ${selectedApp.size} from ${selectedApp.name}!`, 'success');
              setSelectedApp(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AppDetail({ app, onBack, onClean, isScanning }) {
  const [items, setItems] = React.useState([
    { id: 'cache', name: 'System Cache', size: '420 MB', selected: true },
    { name: 'Residual Files', size: '120 MB', selected: true },
    { name: 'Duplicate Images', size: '280 MB', selected: false },
    { name: 'Old Video Clips', size: '1.4 GB', selected: false },
  ]);

  const toggleItem = (index) => {
    const next = [...items];
    next[index].selected = !next[index].selected;
    setItems(next);
  };

  const totalSelected = items
    .filter(i => i.selected)
    .reduce((acc, i) => acc + (i.size.includes('GB') ? parseFloat(i.size) * 1024 : parseFloat(i.size)), 0);

  return (
    <motion.div
      key="app-detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px 100px', overflowY: 'auto', overflowX: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <motion.button 
          whileTap={{ scale: 0.9 }} 
          onClick={onBack}
          style={{ 
            width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff'
          }}
        >
          <ChevronRight size={22} style={{ transform: 'rotate(180deg)' }} />
        </motion.button>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>Analysis Detail</h2>
      </div>

      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '32px', padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginBottom: '24px', position: 'relative'
      }}>
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: `radial-gradient(circle, ${app.color}15 0%, transparent 70%)`, pointerEvents: 'none', borderRadius: '32px' }} />

        <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Inner glow pulse */}
          {isScanning && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: app.color, filter: 'blur(50px)', zIndex: 0 }}
            />
          )}
          
          <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)', zIndex: 1 }}>
            <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="14" />
            <motion.circle 
              cx="110" cy="110" r="80" fill="none" stroke={app.color} strokeWidth="14" 
              strokeDasharray="502.6" initial={{ strokeDashoffset: 502.6 }} animate={{ strokeDashoffset: 502.6 - (502.6 * app.progress / 100) }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 15px ${app.color}90)` }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: app.color, marginBottom: '12px' }}
            >
              {app.icon}
            </motion.div>
            <motion.span 
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: '#fff', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}
            >
              {app.size}
            </motion.span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px', fontWeight: 600 }}>Occupied</span>
          </div>
        </div>

        <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginTop: '28px', marginBottom: '8px' }}>{app.name}</h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Storage usage breakdown</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, idx) => (
          <motion.div
            key={item.name}
            onClick={() => toggleItem(idx)}
            whileTap={{ scale: 0.98 }}
            style={{
              background: item.selected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${item.selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
              borderRadius: '20px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: 20, height: 20, borderRadius: '6px', 
                background: item.selected ? app.color : 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}>
                {item.selected && <Zap size={12} color={app.color === '#ffffff' ? '#000' : '#fff'} fill="currentColor" />}
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: 0 }}>{item.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>{item.selected ? 'Selected for cleaning' : 'Tap to select'}</p>
              </div>
            </div>
            <span style={{ color: item.selected ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 700 }}>{item.size}</span>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClean}
        style={{
          marginTop: '32px', width: '100%', padding: '20px', borderRadius: '20px',
          background: `linear-gradient(90deg, ${app.color} 0%, ${app.color}dd 100%)`,
          border: 'none', color: app.color === '#ffffff' ? '#000' : '#fff', fontSize: '16px', fontWeight: 800,
          boxShadow: `0 10px 30px ${app.color}30`, cursor: 'pointer'
        }}
      >
        Clean Now ({totalSelected >= 1024 ? (totalSelected/1024).toFixed(1) + ' GB' : totalSelected.toFixed(0) + ' MB'})
      </motion.button>
    </motion.div>
  );
}

