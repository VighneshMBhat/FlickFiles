import React from 'react';
import { motion } from 'framer-motion';
import { APP_SOURCES } from '../data/mockFiles';
import { useApp } from '../context/AppContext';
import { ChevronRight, Zap, Database, Image as ImageIcon, Video, Box } from 'lucide-react';

function RealAppIcon({ id, size = 32 }) {
  let src = '';
  switch (id) {
    case 'whatsapp': src = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'; break;
    case 'instagram': src = 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'; break;
    case 'snapchat': src = 'https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg'; break;
    case 'telegram': src = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'; break;
    case 'twitter': src = 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg'; break;
    case 'camera':
      return <div style={{ width: size, height: size, background: 'linear-gradient(135deg, #FF9500, #FF5E3A)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon color="#fff" size={size*0.6} /></div>;
    case 'screenshots':
      return <div style={{ width: size, height: size, background: 'linear-gradient(135deg, #AF52DE, #5E5CE6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box color="#fff" size={size*0.6} /></div>;
    case 'downloads':
      return <div style={{ width: size, height: size, background: 'linear-gradient(135deg, #FFD600, #FF9500)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database color="#fff" size={size*0.6} /></div>;
    case 'recorder':
      return <div style={{ width: size, height: size, background: 'linear-gradient(135deg, #FF2D55, #FF375F)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Video color="#fff" size={size*0.6} /></div>;
    default:
      return <div style={{ width: size, height: size, background: 'linear-gradient(135deg, #3d7eff, #2f5edb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database color="#fff" size={size*0.6} /></div>;
  }
  
  // Use filter invert for Twitter/X logo to make it white in dark mode
  const filter = id === 'twitter' ? 'invert(1)' : 'none';
  return <img src={src} alt={id} style={{ width: size, height: size, objectFit: 'contain', filter, dropShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />;
}

function StatPill({ icon, text, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      background: `rgba(255,255,255,0.06)`,
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: '8px', padding: '3px 8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {React.cloneElement(icon, { size: 12, color })}
      <span style={{ fontSize: '11px', fontWeight: 600, color: '#eeeeff' }}>{text}</span>
    </div>
  );
}

export default function AppSourcesView() {
  const { setActiveSource, setView, files } = useApp();

  const getSourceStats = (sourceId) => {
    const sourceFiles = sourceId === 'all' ? files : files.filter(f => f.source === sourceId);
    const count = sourceFiles.length;
    const totalMB = sourceFiles.reduce((acc, f) => acc + f.size, 0);
    const images = sourceFiles.filter(f => f.type === 'image').length;
    const videos = sourceFiles.filter(f => f.type === 'video').length;
    return { count, totalMB, images, videos };
  };

  const handleSelect = (sourceId) => {
    setActiveSource(sourceId);
    setView('main');
  };

  return (
    <div style={{
      flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header Area */}
      <div style={{ padding: '20px 20px 0', zIndex: 10 }}>
        <h2 style={{
          fontSize: '28px', fontWeight: 800, color: '#fff',
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.5px',
          marginBottom: '8px'
        }}>
          System Scanner
        </h2>

        {/* Smart clean banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(79,124,255,0.2), rgba(157,107,255,0.15))',
          border: '1px solid rgba(157,107,255,0.3)',
          borderRadius: '20px', padding: '16px',
          margin: '16px 0 20px', display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '14px',
            background: 'linear-gradient(135deg, #4f7cff, #9d6bff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(79,124,255,0.4)'
          }}>
            <Zap size={24} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px', letterSpacing: '0.2px' }}>AI Deep Clean</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              Select an app below to isolate and destroy cache clutter.
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable App List */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px',
        padding: '0 20px 40px',
        WebkitOverflowScrolling: 'touch', // smoother scroll on iOS
        scrollBehavior: 'smooth'
      }} className="no-scrollbar">
        {APP_SOURCES.map((source, i) => {
          const stats = getSourceStats(source.id);
          const disabled = stats.count === 0;

          // If disabled, we still show the mockup description just for visual flavor,
          // otherwise we show our live calculated stats
          const displayDesc = disabled ? source.description : `${stats.count} files found • App Data`;

          return (
            <motion.button
              key={source.id}
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 350, damping: 25 }}
              whileTap={{ scale: disabled ? 1 : 0.96 }}
              onClick={() => !disabled && handleSelect(source.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: disabled ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '24px', padding: '18px',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.35 : 1,
                textAlign: 'left', width: '100%',
                position: 'relative', overflow: 'hidden',
                boxShadow: disabled ? 'none' : '0 10px 30px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(12px)'
              }}
            >
              {/* Subtle background glow if active */}
              {!disabled && (
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.04,
                  background: `linear-gradient(135deg, transparent, ${source.color}, transparent)`
                }} />
              )}

              {/* Real App Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: '16px',
                background: disabled ? 'rgba(255,255,255,0.05)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: disabled ? 'none' : '0 8px 16px rgba(0,0,0,0.1)'
              }}>
                <RealAppIcon id={source.id} size={34} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>
                    {source.name}
                  </p>
                  <p style={{ 
                    fontSize: '13px', fontWeight: 800, 
                    color: disabled ? 'var(--text-muted)' : source.color,
                    background: disabled ? 'transparent' : `${source.color}15`,
                    padding: disabled ? '0' : '4px 10px',
                    borderRadius: '10px'
                  }}>
                    {stats.totalMB > 0 ? `${stats.totalMB.toFixed(1)} MB` : 'Clean'}
                  </p>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {displayDesc}
                </p>

                {/* Sub-stats pills */}
                {!disabled && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    {stats.images > 0 && <StatPill icon={<ImageIcon />} text={stats.images} color="#00d97e" />}
                    {stats.videos > 0 && <StatPill icon={<Video />} text={stats.videos} color="#f0365a" />}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
