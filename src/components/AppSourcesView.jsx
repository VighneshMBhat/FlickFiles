import React from 'react';
import { motion } from 'framer-motion';
import { APP_SOURCES } from '../data/mockFiles';
import { useApp } from '../context/AppContext';
import { ChevronRight, Zap } from 'lucide-react';

// Flat SVG icons for each app
function AppIcon({ id, color, size = 22 }) {
  const s = size;
  switch (id) {
    case 'whatsapp':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill={color} opacity="0.15"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke={color} strokeWidth="1.5" fill="none"/>
          <path d="M8.5 9.5c.5 1 1.5 2.5 2.5 3.5s2.5 2 3.5 2.5c.3.15.7.05.9-.2l.4-.5c.2-.25.5-.3.8-.15l2 1c.3.15.35.55.1.75-.8.7-2 1.1-3 .65-2-.9-5-3.9-5.9-5.9C9.4 9.7 9.8 8.5 10.5 7.7c.2-.25.6-.2.75.1l1 2c.15.3.1.63-.15.83l-.5.4c-.25.2-.35.6-.1.9z" fill={color}/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.12"/>
          <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5"/>
          <circle cx="17.5" cy="6.5" r="1" fill={color}/>
        </svg>
      );
    case 'snapchat':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <path d="M12 2c-3 0-5 2-5 5v1.5c-.7.2-1.5.6-2 1 .8.2 1.5.6 2 1.2-.3.8-1 1.6-2.5 2 .4.3 1 .5 2 .6-.5.8-1.5 1.5-1.5 1.5s1 .2 2.5-.3c.5.5 1.2 1.5 2.5 1.5s2-1 2.5-1.5c1.5.5 2.5.3 2.5.3s-1-.7-1.5-1.5c1-.1 1.6-.3 2-.6-1.5-.4-2.2-1.2-2.5-2 .5-.6 1.2-1 2-1.2-.5-.4-1.3-.8-2-1V7c0-3-2-5-5-5z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
          <path d="M7 12l3 3 7-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.5 11.5l4.5 4 8-9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill={color} fillOpacity="0.12"/>
          <path d="M4 4l16 16M4 20L20 4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    case 'camera':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="15" rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
          <circle cx="12" cy="13.5" r="3.5" stroke={color} strokeWidth="1.5"/>
          <path d="M8 6l1.5-3h5L16 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="18" cy="9" r="1" fill={color}/>
        </svg>
      );
    case 'screenshots':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
          <rect x="8" y="6" width="8" height="5" rx="1.5" fill={color} fillOpacity="0.3"/>
          <path d="M8 14h8M8 17h5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    case 'downloads':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
          <path d="M12 7v7M9 11l3 3 3-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 17h8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );
    case 'recorder':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="15" height="16" rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5"/>
          <path d="M17 9l5-3v12l-5-3V9z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="9" cy="12" r="2.5" fill={color} fillOpacity="0.5"/>
        </svg>
      );
    default: // 'all'
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.4"/>
          <rect x="13" y="2" width="9" height="9" rx="2.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4"/>
          <rect x="2" y="13" width="9" height="9" rx="2.5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4"/>
          <rect x="13" y="13" width="9" height="9" rx="2.5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.4"/>
        </svg>
      );
  }
}

export default function AppSourcesView() {
  const { setActiveSource, setView, files } = useApp();

  const getFileCount = (sourceId) => {
    if (sourceId === 'all') return files.length;
    return files.filter(f => f.source === sourceId).length;
  };

  const handleSelect = (sourceId) => {
    setActiveSource(sourceId);
    setView('main');
  };

  return (
    <div style={{
      flex: 1, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      padding: '16px 16px 0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)',
          marginBottom: '4px', fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.4px',
        }}>
          App Cleaner
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Pick an app to review and clean its files.
        </p>
      </div>

      {/* Smart clean banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,124,255,0.12), rgba(157,107,255,0.08))',
        border: '1px solid rgba(79,124,255,0.2)',
        borderRadius: '14px',
        padding: '12px 14px',
        marginBottom: '14px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'rgba(79,124,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Zap size={17} color="#4f7cff" />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1px' }}>Smart Clean</p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Swipe through an app's files to free up space instantly
          </p>
        </div>
      </div>

      {/* App list */}
      <div style={{
        flex: 1, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '6px',
        paddingBottom: '32px',
      }}>
        {APP_SOURCES.map((source, i) => {
          const count = getFileCount(source.id);
          const disabled = count === 0;
          return (
            <motion.button
              key={source.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, type: 'spring', stiffness: 320, damping: 28 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => !disabled && handleSelect(source.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '14px',
                padding: '12px 14px',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.35 : 1,
                textAlign: 'left', width: '100%',
              }}
            >
              {/* Flat icon */}
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: `${source.color}12`,
                border: `1px solid ${source.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AppIcon id={source.id} color={source.color} size={22} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {source.name}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {source.description}
                </p>
              </div>

              {/* Count + arrow */}
              {count > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span style={{
                    background: `${source.color}20`,
                    border: `1px solid ${source.color}30`,
                    borderRadius: '7px', padding: '3px 8px',
                    fontSize: '12px', fontWeight: 700, color: source.color,
                  }}>
                    {count}
                  </span>
                  <ChevronRight size={15} color="var(--text-muted)" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
