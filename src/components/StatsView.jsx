import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronDown, Zap, Flame } from 'lucide-react';

export default function StatsView() {
  const { savedMB, swipeCount, trash } = useApp();
  const [timeRange, setTimeRange] = React.useState('This Month');
  const [showMenu, setShowMenu] = React.useState(false);

  const formatSize = (mb) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  const usedStorage = 52.4;
  const totalStorage = 64;

  const cardStyle = {
    background: 'linear-gradient(180deg, #1A2235 0%, #101623 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  };

  const ranges = ['This Month', 'Last Month', 'Last 3 Months', 'All Time'];

  // Simulate data changes based on range
  const displaySavedMB = timeRange === 'This Month' ? savedMB : 
                        timeRange === 'Last Month' ? 1240.5 :
                        timeRange === 'Last 3 Months' ? 3850.2 : 8420.0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0px 20px 150px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 600, color: '#fff', margin: '16px 0 24px', letterSpacing: '0.5px', flexShrink: 0 }}>
        Analytics
      </h2>

      {/* Data Saved Card with Predictive Trend */}
      <div style={{ position: 'relative', marginBottom: '20px', flexShrink: 0, zIndex: 10 }}>
        <div style={{ position: 'absolute', top: -14, left: '6%', right: '6%', height: 20, background: '#131A2A', borderRadius: '20px 20px 0 0', border: '1px solid rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: -7, left: '3%', right: '3%', height: 20, background: '#161F30', borderRadius: '20px 20px 0 0', border: '1px solid rgba(255,255,255,0.04)' }} />
        
        <div style={{ ...cardStyle, marginTop: 0, marginBottom: 0, paddingBottom: '0', overflow: showMenu ? 'visible' : 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>Data Saved</p>
              <h3 style={{ color: '#fff', fontSize: '36px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
                {formatSize(displaySavedMB)}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>in total</p>
            </div>
            
            <div style={{ position: 'relative' }}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {timeRange} <ChevronDown size={14} style={{ transform: showMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </motion.div>

              {showMenu && (
                <>
                  <div 
                    onClick={() => setShowMenu(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                      background: '#1A2235', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px', padding: '8px', zIndex: 100, minWidth: '140px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }}
                  >
                    {ranges.map(range => (
                      <div
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setShowMenu(false);
                        }}
                        style={{
                          padding: '10px 12px', borderRadius: '10px', fontSize: '13px',
                          color: timeRange === range ? '#fff' : 'rgba(255,255,255,0.6)',
                          background: timeRange === range ? 'rgba(255,255,255,0.05)' : 'transparent',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {range}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div style={{ height: 120, marginTop: 10, position: 'relative', marginHorizontal: '-24px' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" style={{ overflow: 'visible', width: 'calc(100% + 48px)', marginLeft: '-24px' }}>
              <defs>
                <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(80, 180, 255, 0.1)" />
                  <stop offset="30%" stopColor="rgba(100, 200, 255, 1)" />
                  <stop offset="70%" stopColor="rgba(100, 200, 255, 1)" />
                  <stop offset="100%" stopColor="rgba(80, 180, 255, 0.1)" />
                </linearGradient>
                <linearGradient id="glowLineSub" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(80, 150, 255, 0.05)" />
                  <stop offset="50%" stopColor="rgba(80, 150, 255, 0.4)" />
                  <stop offset="100%" stopColor="rgba(80, 150, 255, 0.05)" />
                </linearGradient>
              </defs>

              <path d="M0,90 Q50,105 100,65 T200,65 T300,20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="1 6" strokeLinecap="round" />
              <path d="M0,70 Q50,85 100,45 T200,45 T300,5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="1 4" strokeLinecap="round" />
              
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeInOut" }}
                d="M0,80 Q50,95 100,55 T200,55 T250,32.5" fill="none" stroke="url(#glowLine)" strokeWidth="3" 
                style={{ filter: 'drop-shadow(0px 6px 12px rgba(80, 180, 255, 0.6))' }} 
              />
              
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeInOut", delay: 0.1 }}
                d="M0,100 Q50,115 100,75 T200,75 T300,30" fill="none" stroke="url(#glowLineSub)" strokeWidth="1.5" 
              />
              
              <g style={{ filter: 'drop-shadow(0 0 6px #fff)' }}>
                <circle cx="95" cy="56.5" r="3.5" fill="#fff" />
                <circle cx="195" cy="56.5" r="3.5" fill="#fff" />
                <circle cx="250" cy="32.5" r="3" fill="#fff" filter="drop-shadow(0 0 8px rgba(100, 200, 255, 1))" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Feature 3: Cleaning Streak Tracker */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: 44, height: 44, minWidth: 44, minHeight: 44, flexShrink: 0,
            borderRadius: '14px', background: 'rgba(255, 107, 0, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 107, 0, 0.3)',
            boxShadow: 'inset 0 0 10px rgba(255, 107, 0, 0.2), 0 0 15px rgba(255, 107, 0, 0.2)'
          }}>
            <Flame size={24} color="#FF6B00" strokeWidth={2.5} style={{ filter: 'drop-shadow(0 0 8px rgba(255, 107, 0, 0.8))' }} />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '2px', fontWeight: 500 }}>Cleaning Streak</p>
            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>5 Days</h3>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: i < 5 ? '#FF6B00' : 'rgba(255,255,255,0.1)', boxShadow: i < 5 ? '0 0 8px rgba(255, 107, 0, 0.6)' : 'none' }} />
              <span style={{ fontSize: '10px', color: i < 5 ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 1: Storage Radar (Donut Chart) & Sphere */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px', flexShrink: 0 }}>
        
        {/* Sphere widget (Reused) */}
        <div style={{ ...cardStyle }}>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '20px' }}>Storage Overview</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, margin: 0 }}>{usedStorage}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>Used</p>
            </div>
            <div style={{
              position: 'relative', width: 120, height: 120, minWidth: 120, minHeight: 120, flexShrink: 0,
              borderRadius: '50%', background: 'radial-gradient(130% 130% at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.8) 100%)',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15), inset 10px 0 40px rgba(60,130,255,0.3), 0 10px 30px rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '75%', background: 'linear-gradient(180deg, #4A90E2 0%, #1C448E 100%)', borderBottomLeftRadius: '60px', borderBottomRightRadius: '60px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -12, left: -5, right: -5, height: 24, background: '#5BA0E8', borderRadius: '50%', boxShadow: 'inset 0 0 15px rgba(255,255,255,0.4), 0 5px 15px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)' }} />
              </div>
              <div style={{ position: 'absolute', top: 5, left: '15%', width: '70%', height: '25%', background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)', borderRadius: '50%', transform: 'rotate(-10deg)', filter: 'blur(1px)' }} />
              <div style={{ position: 'absolute', bottom: 15, right: 10, width: '25%', height: '40%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%', transform: 'rotate(-40deg)', filter: 'blur(2px)' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 600, margin: 0 }}>{totalStorage} GB</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>Total</p>
            </div>
          </div>
        </div>

        {/* Feature 1 & 5 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
          {/* Storage Radar */}
          <div style={{ ...cardStyle, marginBottom: 0, padding: '20px' }}>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>Storage Radar</p>
            <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto', marginBottom: '16px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4A90E2" strokeWidth="3" strokeDasharray="60, 100" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="25, 100" strokeDashoffset="-60" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF6B00" strokeWidth="3" strokeDasharray="15, 100" strokeDashoffset="-85" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Media</span>
                <span style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>85%</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#4A90E2' }}>●</span> Video</span> <span style={{ color: '#fff' }}>31 GB</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}><span style={{ color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#A855F7' }}>●</span> Photo</span> <span style={{ color: '#fff' }}>15 GB</span></div>
            </div>
          </div>

          {/* Feature 5: Duplicate Density */}
          <div style={{ ...cardStyle, marginBottom: 0, padding: '20px' }}>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>Density</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {Array.from({ length: 25 }).map((_, i) => {
                const val = Math.random();
                const bg = val > 0.85 ? '#FF3B5C' : val > 0.6 ? '#FF9800' : val > 0.3 ? '#4A90E2' : 'rgba(255,255,255,0.06)';
                return <div key={i} style={{ aspectRatio: '1/1', background: bg, borderRadius: '3px', boxShadow: val > 0.85 ? '0 0 6px rgba(255, 59, 92, 0.6)' : 'none' }} />
              })}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '12px', textAlign: 'center' }}>Duplicate hotzones</p>
          </div>
        </div>
      </div>

      {/* Two columns stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', flexShrink: 0 }}>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Files Cleaned</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#fff', fontSize: '32px', fontWeight: 700, margin: 0 }}>{swipeCount}</h3>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(90,160,255,0.8), rgba(30,70,140,1))', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' }}>Total cleaned</p>
        </div>
        <div style={{ ...cardStyle, marginBottom: 0 }}>
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Biggest Clean</p>
          <h3 style={{ color: '#fff', fontSize: '26px', fontWeight: 700, margin: 0 }}>1.12 GB</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '6px' }}>Mar 10, 2024</p>
        </div>
      </div>
    </motion.div>
  );
}
