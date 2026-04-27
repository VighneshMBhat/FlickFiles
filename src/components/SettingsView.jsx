import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Shield, Moon, Sun, Info } from 'lucide-react';

function ToggleRow({ icon, label, sublabel, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '14px', marginBottom: '8px',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '12px',
        background: 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '1px' }}>{label}</p>
        {sublabel && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{sublabel}</p>}
      </div>
      <motion.div
        onClick={onChange}
        style={{
          width: 48, height: 26, borderRadius: '13px',
          background: value ? 'rgba(61,126,255,0.9)' : 'rgba(255,255,255,0.12)',
          position: 'relative', cursor: 'pointer',
          border: `1px solid ${value ? 'rgba(61,126,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
          transition: 'background 0.3s ease', flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'absolute', top: 2,
            width: 20, height: 20, borderRadius: '50%',
            background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>
    </div>
  );
}

export default function SettingsView() {
  const {
    asmrMode, setAsmrMode,
    confirmDeletion, setConfirmDeletion,
    darkMode, setDarkMode,
    savedMB, kept, organized, trash, favorites, swipeCount,
  } = useApp();

  const formatSize = (mb) => mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
        ⚙️ Settings
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        Customize your FlickFiles experience
      </p>

      {/* Stats card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(61,126,255,0.15), rgba(168,85,247,0.15))',
        border: '1px solid rgba(61,126,255,0.25)',
        borderRadius: '20px', padding: '18px', marginBottom: '24px',
      }}>
        <p style={{
          fontSize: '11px', fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
        }}>Session Stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Saved', value: formatSize(savedMB), color: '#00e676' },
            { label: 'Swipes', value: swipeCount, color: '#3d7eff' },
            { label: 'Kept', value: kept.length, color: '#ffd600' },
            { label: 'Trashed', value: trash.length, color: '#ff3b5c' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: stat.color, marginBottom: '2px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{
        fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
      }}>Preferences</p>

      <ToggleRow
        icon={asmrMode ? <Volume2 size={16} color="#3d7eff" /> : <VolumeX size={16} color="rgba(255,255,255,0.5)" />}
        label="ASMR Mode"
        sublabel="Play sounds on swipe gestures"
        value={asmrMode}
        onChange={() => setAsmrMode(v => !v)}
      />
      <ToggleRow
        icon={<Shield size={16} color={confirmDeletion ? '#ffd600' : 'rgba(255,255,255,0.5)'} />}
        label="Confirm Deletions"
        sublabel="Show modal before permanent delete"
        value={confirmDeletion}
        onChange={() => setConfirmDeletion(v => !v)}
      />
      <ToggleRow
        icon={darkMode ? <Moon size={16} color="#a855f7" /> : <Sun size={16} color="#ffd600" />}
        label="Dark Mode"
        sublabel="Use dark interface (recommended)"
        value={darkMode}
        onChange={() => setDarkMode(v => !v)}
      />

      <div style={{
        marginTop: '20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '14px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <Info size={16} color="rgba(255,255,255,0.35)" />
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>FlickFiles v2.0</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Gesture-based file cleaner prototype</p>
        </div>
      </div>
    </motion.div>
  );
}
