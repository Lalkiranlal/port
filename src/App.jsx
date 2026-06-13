import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from './components/Loader';
import DeveloperRoomScene from './components/DeveloperRoomScene';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Code, Zap, BookOpen, Briefcase, Mail } from 'lucide-react';

function VerticalNavigation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sections = [
    { label: 'Summary', offset: 0.0, icon: <User size={16} /> },
    { label: 'Projects', offset: 0.25, icon: <Code size={16} /> },
    { label: 'Skills', offset: 0.45, icon: <Zap size={16} /> },
    { label: 'Education', offset: 0.65, icon: <BookOpen size={16} /> },
    { label: 'Experience', offset: 0.80, icon: <Briefcase size={16} /> },
    { label: 'Contact', offset: 0.92, icon: <Mail size={16} /> }
  ];

  // Listen for scroll updates from the 3D scene to move the bubble automatically
  React.useEffect(() => {
    const handleScrollUpdate = (e) => {
      const scrollOffset = e.detail.offset;
      // Find the closest section to the current scroll offset
      let closestIdx = 0;
      let minDiff = Infinity;
      sections.forEach((sec, idx) => {
        const diff = Math.abs(sec.offset - scrollOffset);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    };
    window.addEventListener('scroll-update', handleScrollUpdate);
    return () => window.removeEventListener('scroll-update', handleScrollUpdate);
  }, []);

  const handleNav = (targetOffset, idx) => {
    setActiveIndex(idx);
    window.dispatchEvent(new CustomEvent('nav-click', { detail: { offset: targetOffset } }));
  };

  return (
    <motion.div 
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '20px',
        padding: '20px 10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The glowing moving bubble */}
      <motion.div
        animate={{ y: activeIndex * 40 }} // 20px gap + 20px node height = 40px step
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}
      />

      {sections.map((sec, idx) => (
        <div 
          key={sec.label}
          onClick={() => handleNav(sec.offset, idx)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: '20px'
          }}
        >
          {/* Section Icon */}
          <div style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
            transition: 'color 0.3s ease'
          }}>
            {sec.icon}
          </div>

          {/* Expandable Text */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  left: '35px',
                  whiteSpace: 'nowrap',
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '0.9rem',
                  textShadow: activeIndex === idx ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                }}
              >
                {sec.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div style={{ width: '100vw', height: '100vh', background: '#020202', overflow: 'hidden', position: 'relative' }}>
        {!loading && <VerticalNavigation />}
        <Canvas
          camera={{ position: [0, 10, 40], fov: 60 }}
          gl={{ powerPreference: "high-performance", antialias: false }} // postprocessing handles AA
        >
          {/* We only render the 3D scene when loading is complete so animations sync properly */}
          {!loading && <DeveloperRoomScene />}
        </Canvas>
      </div>
    </>
  );
}

export default App;
