import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Home, PieChart, Brush, Settings } from 'lucide-react';

const TABS = [
  { id: 'main', label: 'Home', icon: Home },
  { id: 'appcleaner', label: 'Cleaner', icon: Brush },
  { id: 'stats', label: 'Analytics', icon: PieChart },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function BottomNav() {
  const { view, setView } = useApp();

  return (
    <div style={{
      padding: '12px 16px 24px',
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      zIndex: 50,
    }}>
      {TABS.map((tab) => {
        const isActive = view === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
              background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none',
              padding: '8px 12px', borderRadius: '16px', position: 'relative',
              flex: 1,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-bg"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(108, 77, 255, 0.1)',
                  borderRadius: '16px',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            <div style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span style={{
              position: 'relative', zIndex: 1, fontSize: '10px', fontWeight: isActive ? 700 : 500,
              color: isActive ? '#fff' : 'var(--text-secondary)',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
