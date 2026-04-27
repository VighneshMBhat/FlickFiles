import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { 
  Wind, MousePointer2, 
  ImageOff, Activity, Sparkles
} from 'lucide-react';

// Reusable Bento Box Component
function BentoBox({ children, title, icon, color, span = 1, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        gridColumn: `span ${span}`,
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(30px)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120,
        background: color, filter: 'blur(80px)', opacity: 0.15, zIndex: 0
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: '12px', background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color
        }}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', opacity: 0.6, letterSpacing: '0.5px' }}>{title}</span>
      </div>
      <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}

// Custom Switch Component
function ModernSwitch({ enabled, onToggle, label, icon }) {
  return (
    <div 
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ color: enabled ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>
          {icon}
        </div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: enabled ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s' }}>{label}</span>
      </div>
      <div style={{
        width: 48, height: 26, borderRadius: 13,
        background: enabled ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)',
        padding: '3px', position: 'relative', transition: 'all 0.3s'
      }}>
        <motion.div
          animate={{ x: enabled ? 22 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        />
      </div>
    </div>
  );
}

// Custom Pill Selector
function PillSelector({ options, value, onChange, color }) {
  return (
    <div style={{ 
      display: 'flex', background: 'rgba(255,255,255,0.05)', 
      borderRadius: '16px', padding: '4px', gap: '4px' 
    }}>
      {options.map(opt => (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1, padding: '10px 4px', borderRadius: '12px', fontSize: '12px',
            fontWeight: 700, textAlign: 'center', cursor: 'pointer',
            background: value === opt.value ? (color || 'var(--accent-purple)') : 'transparent',
            color: value === opt.value ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: value === opt.value ? `0 4px 12px ${color}40` : 'none'
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}

export default function SettingsView() {
  const { 
    hapticFeedback, setHapticFeedback, 
    swipeSound, setSwipeSound, 
    animationSpeed, setAnimationSpeed,
    autoEmptyTrash, setAutoEmptyTrash,
    triggerHaptic
  } = useApp();

  return (
    <div style={{ 
      flex: 1, overflowY: 'auto', background: '#050508', 
      paddingBottom: '140px', position: 'relative' 
    }}>
      {/* Immersive background orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '300px', height: '300px', background: 'var(--accent-purple)', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '-10%', width: '250px', height: '250px', background: 'var(--accent-blue)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />

      <div style={{ padding: '40px 24px 32px' }}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: '36px', fontWeight: 900, color: '#fff', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-1.5px' }}
        >
          Settings
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.1 }}
          style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginTop: '4px' }}
        >
          Fine-tune your experience
        </motion.p>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', 
        gap: '20px', padding: '0 20px' 
      }}>
        
        {/* Cleaning Logic */}
        <BentoBox title="Engine" icon={<Activity />} color="var(--accent-green)" delay={0.1}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: 600 }}>Empty Trash</p>
          <PillSelector 
            color="var(--accent-green)"
            value={autoEmptyTrash} 
            onChange={setAutoEmptyTrash}
            options={[
              { label: 'Off', value: 'never' },
              { label: '7d', value: '7days' },
              { label: '30d', value: '30days' }
            ]}
          />
        </BentoBox>

        {/* Animation Speed */}
        <BentoBox title="Motion" icon={<Wind />} color="var(--accent-blue)" delay={0.2}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: 600 }}>Swipe Speed</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Slow', value: 'slow' },
              { label: 'Medium', value: 'medium' },
              { label: 'Fast', value: 'fast' }
            ].map((opt) => (
              <div 
                key={opt.value}
                onClick={() => { setAnimationSpeed(opt.value); triggerHaptic([5]); }}
                style={{ 
                  padding: '12px', borderRadius: '16px', 
                  background: animationSpeed === opt.value ? 'rgba(61, 126, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${animationSpeed === opt.value ? 'rgba(61, 126, 255, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                  color: animationSpeed === opt.value ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontSize: '13px', fontWeight: 700, textAlign: 'center', transition: 'all 0.2s'
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </BentoBox>

        {/* Sensory */}
        <BentoBox title="Sensory" icon={<Sparkles />} color="var(--accent-purple)" span={2} delay={0.3}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <ModernSwitch 
                label="Haptics" 
                enabled={hapticFeedback} 
                onToggle={() => setHapticFeedback(!hapticFeedback)}
                icon={<MousePointer2 size={16} />}
              />
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '8px' }}>Physical feedback on swipe</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>Audio Profile</p>
              <PillSelector 
                color="var(--accent-purple)"
                value={swipeSound} 
                onChange={setSwipeSound}
                options={[
                  { label: 'Def', value: 'default' },
                  { label: 'Pop', value: 'pop' },
                  { label: 'Arc', value: 'arcade' }
                ]}
              />
            </div>
          </div>
        </BentoBox>

      </div>
    </div>
  );
}
