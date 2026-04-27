import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Home, Trash2, Star, PieChart, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'main', label: 'Home', icon: Home },
  { id: 'trash', label: 'Trash', icon: Trash2 },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'stats', label: 'Analytics', icon: PieChart },
  { id: 'appcleaner', label: 'App Cleaner', icon: Sparkles }
];

export default function BottomNav() {
  const { view, setView } = useApp();

  return (
    <div style={{
      padding: '12px 16px 24px',
      background: 'var(--bg-primary)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'relative',
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
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-bg"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'var(--border-active)',
                  borderRadius: '16px',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            
            <div style={{ position: 'relative', zIndex: 1, color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            
            <span style={{
              position: 'relative', zIndex: 1, fontSize: '11px', fontWeight: isActive ? 700 : 500,
              color: isActive ? '#fff' : 'var(--text-secondary)'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
