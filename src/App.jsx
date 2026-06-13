import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from './components/Loader';
import DeveloperRoomScene from './components/DeveloperRoomScene';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Code, Zap, BookOpen, Briefcase, Mail } from 'lucide-react';

function VerticalNavigation({ isMobile }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const sections = [
    { label: 'Summary', offset: 0.0, icon: <User size={isMobile ? 22 : 16} /> },
    { label: 'Projects', offset: 0.25, icon: <Code size={isMobile ? 22 : 16} /> },
    { label: 'Skills', offset: 0.45, icon: <Zap size={isMobile ? 22 : 16} /> },
    { label: 'Education', offset: 0.65, icon: <BookOpen size={isMobile ? 22 : 16} /> },
    { label: 'Experience', offset: 0.80, icon: <Briefcase size={isMobile ? 22 : 16} /> },
    { label: 'Contact', offset: 0.92, icon: <Mail size={isMobile ? 22 : 16} /> }
  ];

  React.useEffect(() => {
    const handleScrollUpdate = (e) => {
      const scrollOffset = e.detail.offset;
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

  const desktopStyle = {
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
  };

  const mobileStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95vw',
    maxWidth: '500px',
    padding: '15px 10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '50px',
    background: 'rgba(3, 8, 20, 0.9)', 
    backdropFilter: 'blur(16px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
  };

  return (
    <motion.div 
      style={isMobile ? mobileStyle : desktopStyle}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {sections.map((sec, idx) => (
        <div 
          key={sec.label}
          onClick={() => handleNav(sec.offset, idx)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: isMobile ? '35px' : '20px',
            width: isMobile ? '35px' : 'auto',
          }}
        >
          {/* Framer Motion LayoutId Bubble for perfect responsiveness */}
          {activeIndex === idx && (
            <motion.div
              layoutId="nav-bubble"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'absolute',
                width: isMobile ? '45px' : '30px',
                height: isMobile ? '45px' : '30px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }}
            />
          )}

          {/* Section Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeIndex === idx ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
            transition: 'color 0.3s ease'
          }}>
            {sec.icon}
          </div>

          {/* Expandable Text (Hidden completely on Mobile) */}
          <AnimatePresence>
            {!isMobile && isHovered && (
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div style={{ width: '100vw', height: '100vh', background: '#020202', overflow: 'hidden', position: 'relative' }}>
        {!loading && <VerticalNavigation isMobile={isMobile} />}
        <Canvas
          camera={{ position: [0, 10, 40], fov: isMobile ? 105 : 60 }}
          gl={{ powerPreference: "high-performance", antialias: false }} // postprocessing handles AA
        >
          {/* We only render the 3D scene when loading is complete so animations sync properly */}
          {!loading && <DeveloperRoomScene isMobile={isMobile} />}
        </Canvas>
      </div>
    </>
  );
}

export default App;
