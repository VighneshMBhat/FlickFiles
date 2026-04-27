import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import TopBar from './components/TopBar';
import CardStack from './components/CardStack';
import TrashView from './components/TrashView';
import SettingsView from './components/SettingsView';
import ToastSystem from './components/ToastSystem';
import AppSourcesView from './components/AppSourcesView';
import StatsView from './components/StatsView';
import MultiSelectView from './components/MultiSelectView';
import FavoritesView from './components/FavoritesView';
import PreviewModal from './components/PreviewModal';
import BottomNav from './components/BottomNav';
import AppCleanerView from './components/AppCleanerView';
import { soundEngine } from './utils/soundEngine';

function BadgeToast() {
  const { newBadge } = useApp();

  return (
    <AnimatePresence>
      {newBadge && (
        <motion.div
          initial={{ y: -80, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -80, opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: 'rgba(13,13,26,0.95)',
            border: '1px solid rgba(255,204,0,0.35)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,204,0,0.1)',
            backdropFilter: 'blur(20px)',
            whiteSpace: 'nowrap',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '28px', lineHeight: 1 }}
          >
            {newBadge.icon}
          </motion.span>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#ffcc00', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '2px' }}>
              Badge Unlocked
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#eeeeff' }}>
              {newBadge.name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppInner() {
  const { view, asmrMode } = useApp();

  React.useEffect(() => {
    soundEngine.setEnabled(asmrMode);
  }, [asmrMode]);

  const viewTransition = { type: 'spring', stiffness: 380, damping: 32 };

  return (
    <div id="app-container" style={{
      width: '100%',
      height: '100svh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      maxWidth: '480px',
      position: 'relative',
    }}>
      {/* Subtle gradient mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, rgba(79,124,255,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 50% 35% at 80% 85%, rgba(157,107,255,0.06) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <TopBar />

        <AnimatePresence mode="wait">
          {view === 'main' && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <CardStack />
            </motion.div>
          )}
          {view === 'trash' && (
            <motion.div key="trash" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TrashView />
            </motion.div>
          )}
          {view === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <SettingsView />
            </motion.div>
          )}
          {view === 'sources' && (
            <motion.div key="sources" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <AppSourcesView />
            </motion.div>
          )}
          {view === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <StatsView />
            </motion.div>
          )}
          {view === 'favorites' && (
            <motion.div key="favorites" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <FavoritesView />
            </motion.div>
          )}
          {view === 'multiselect' && (
            <motion.div key="multiselect" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
              <MultiSelectView />
            </motion.div>
          )}
          {view === 'appcleaner' && (
            <motion.div key="appcleaner" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }}
              transition={viewTransition} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <AppCleanerView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
      <ToastSystem />
      <PreviewModal />
      <BadgeToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
