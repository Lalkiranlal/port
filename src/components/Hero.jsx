import React, { useRef, useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { generateOrganicHairPaths } from '../utils/hairGenerator';
import awakeningImg from '../assets/awakening.png';

export default function Hero({ bootComplete }) {
  const containerRef = useRef(null);
  const imageControls = useAnimation();
  const hairControls = useAnimation();
  
  useEffect(() => {
    if (bootComplete) {
      // 1. Shaking emergence sequence for the image
      imageControls.start("emerge").then(() => {
        // 2. Blast hair down from the image
        hairControls.start("grow");
      });
    }
  }, [bootComplete, imageControls, hairControls]);

  // Start hair around the feet of the character in the image
  const hairPaths = useMemo(() => generateOrganicHairPaths(400, 500, 0, 1500, 7, 25, 0.008), []);

  return (
    <section id="about" ref={containerRef} style={{ position: 'relative', minHeight: '150vh' }}>
      
      {/* Absolute Container for Image and Hair Sequence */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        
        {/* The Breath-taking Anime Awakening Image */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            marginLeft: '-300px',
            width: '600px',
            height: '600px',
            maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)',
            filter: 'drop-shadow(0 0 50px rgba(230, 57, 70, 0.5))'
          }}
          variants={{
            initial: { opacity: 0, scale: 0.2, filter: "brightness(0)" },
            emerge: { 
              opacity: 1, 
              scale: [0.5, 1.1, 0.95, 1], 
              filter: ["brightness(0)", "brightness(2)", "brightness(1)"],
              x: [0, -10, 10, -5, 5, 0], // violent shake
              y: [0, 10, -10, 5, -5, 0],
              transition: { duration: 2.5, ease: "easeOut" }
            }
          }}
          initial="initial"
          animate={imageControls}
        >
          <img src={awakeningImg} alt="Demon Fairy Awakening" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>

        {/* The Hair Waterfall shooting from the image */}
        <svg viewBox="0 0 800 1500" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1500px', overflow: 'visible' }}>
          {hairPaths.map((path, i) => (
            <motion.path
              key={`hair-${i}`}
              d={path}
              stroke={i % 2 === 0 ? "var(--color-sunfire-orange)" : "var(--color-mural-red)"}
              strokeWidth={i % 3 === 0 ? "3" : "1.5"}
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,145,0,0.8))' }}
              variants={{
                initial: { pathLength: 0, opacity: 0 },
                grow: { 
                  pathLength: 1, 
                  opacity: 1,
                  transition: { duration: 2.5, ease: "easeInOut", delay: i * 0.1 } 
                }
              }}
              initial="initial"
              animate={hairControls}
            />
          ))}
        </svg>
      </div>

      <motion.div 
        style={{ textAlign: 'center', maxWidth: '800px', zIndex: 1, position: 'relative', marginTop: '70vh', margin: '70vh auto 0 auto' }}
        initial={{ opacity: 0, y: 30 }}
        animate={bootComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1, delay: 2.5 }} // Wait for image emergence
      >
        <span className="deity-sub">System Online</span>
        
        <h1 className="deity-heading">Kiran Lal K</h1>
        
        <h3 style={{ color: 'var(--color-sunfire-orange)', margin: '1rem 0 2rem 0', fontSize: '1.8rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Shadow Architect & Mobile Hunter
        </h3>
        
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem', color: 'var(--color-text-main)' }}>
          I forge highly scalable enterprise applications using the dark arts of offline-first architecture. Fusing intense performance with striking aesthetics to build system-level mobile experiences that dominate the B2B commerce landscape.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#projects" className="shadow-btn">
            View Quest Log
          </a>
          <a href="#contact" className="shadow-btn secondary">
            Initiate Raid
          </a>
        </div>
      </motion.div>
    </section>
  );
}
