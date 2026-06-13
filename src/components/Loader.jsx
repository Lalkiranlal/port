import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import bgWallImg from '../assets/bg_wall.png';
import mgTreeImg from '../assets/mg_tree.png';
import mgHologramImg from '../assets/mg_hologram.png';
import mgShelfImg from '../assets/mg_shelf.png';
import fgDeskImg from '../assets/fg_desk.png';
import fgParticlesImg from '../assets/fg_particles.png';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1200); // 1.2s for massive zoom animation
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 5) + 2);
      });
    }, 250); // Slowed down to increase animation duration

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ scale: 1, opacity: 1 }}
      animate={{ 
        scale: progress === 100 ? 50 : 1, // Massive Zoom-in at 100%
        opacity: progress === 100 ? 0 : 1 
      }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#020202', zIndex: 9999, display: 'flex', 
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div className="cube-scene">
        <div className="cube">
          <div className="cube-face front" style={{ backgroundImage: `url(${bgWallImg})` }}></div>
          <div className="cube-face back" style={{ backgroundImage: `url(${mgTreeImg})` }}></div>
          <div className="cube-face right" style={{ backgroundImage: `url(${mgHologramImg})` }}></div>
          <div className="cube-face left" style={{ backgroundImage: `url(${mgShelfImg})` }}></div>
          <div className="cube-face top" style={{ backgroundImage: `url(${fgDeskImg})` }}></div>
          <div className="cube-face bottom" style={{ backgroundImage: `url(${fgParticlesImg})` }}></div>
        </div>
      </div>

      {/* User requested ONLY the cube to be shown */}
    </motion.div>
  );
}
