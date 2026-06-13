import React, { useEffect } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: "Rapidor B2B Commerce",
    desc: "Offline-first mobile commerce architecture. AutoSync engine handling millions of offline mutations.",
    badge: "3",
    color: "var(--color-sunfire-orange)"
  },
  {
    id: 2,
    title: "Shadow Logistics Hub",
    desc: "Real-time fleet tracking system with WebSockets and extreme high-frequency state updates.",
    badge: "9+",
    color: "var(--color-mural-red)"
  },
  {
    id: 3,
    title: "Neural Engine Dashboard",
    desc: "Data-heavy analytics rendering at 60fps natively across Android and iOS using Flutter.",
    badge: "!",
    color: "#ffbd2e"
  }
];

export default function ProjectsZ({ scroll, range }) {
  // We divide the overall range into subranges for each project.
  const span = range[1] - range[0];
  const step = span / projects.length;

  // Mouse tilt effect (X, Y gyroscope)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
      {projects.map((proj, i) => {
        const pStart = range[0] + i * step;
        const pEnd = pStart + step;
        const pFocus = pStart + (step * 0.8); // when it reaches scale 1
        
        // Scale maps from 0.05 (far) -> 1 (focus) -> 10 (pass lens)
        const scale = useTransform(scroll, [pStart, pFocus, pEnd], [0.05, 1, 10]);
        // Opacity fades in quickly, holds, then fades out as it passes lens
        const opacity = useTransform(scroll, [pStart, pStart+0.02, pFocus, pEnd], [0, 1, 1, 0]);
        const explodeZ = useTransform(scroll, [pFocus, pEnd], [0, 500]);

        return (
          <motion.div 
            key={proj.id}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              scale, opacity, transformStyle: 'preserve-3d', perspective: '1200px'
            }}
          >
            <div style={{ textAlign: 'center', position: 'absolute', top: '10%', width: '100%' }}>
              <h2 className="deity-heading" style={{ fontSize: '3rem', opacity: i === 0 ? 1 : 0.5 }}>PROJECT EXPLORATION</h2>
            </div>

            {/* Exploded Device Container */}
            <motion.div 
              style={{ 
                position: 'relative', width: '300px', height: '600px', 
                rotateX, rotateY, transformStyle: 'preserve-3d'
              }}
            >
              {/* Layer 1: Background Canvas / Chassis */}
              <motion.div 
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'var(--color-bg-dark)', border: `2px solid ${proj.color}`, borderRadius: '32px',
                  boxShadow: `0 0 30px ${proj.color}`,
                  translateZ: -50, z: useTransform(explodeZ, v => -v)
                }}
              />

              {/* Layer 2: Core UI / App Layout */}
              <motion.div 
                style={{
                  position: 'absolute', top: '20px', left: '15px', width: '270px', height: '560px',
                  background: 'rgba(15,15,15,0.8)', border: `1px solid ${proj.color}`, borderRadius: '20px',
                  backdropFilter: 'blur(8px)', padding: '20px', boxSizing: 'border-box',
                  translateZ: 20, z: 0
                }}
              >
                <div style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
                <div style={{ width: '100%', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <div style={{ flex: 1, height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                </div>
                
                <div style={{ marginTop: '40px' }}>
                  <h4 style={{ color: 'var(--color-text-bright)', margin: '0 0 8px 0' }}>{proj.title}</h4>
                  <p style={{ color: 'var(--color-text-main)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>
                    {proj.desc}
                  </p>
                </div>
              </motion.div>

              {/* Layer 3: Floating Assets / Action Buttons */}
              <motion.div 
                style={{
                  position: 'absolute', bottom: '40px', right: '-20px', width: '60px', height: '60px',
                  background: proj.color, borderRadius: '50%',
                  boxShadow: `0 10px 30px ${proj.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  translateZ: 100, z: explodeZ
                }}
              >
                <span style={{ color: '#000', fontWeight: 'bold', fontSize: '24px' }}>+</span>
              </motion.div>

              {/* Floating Notification Badge */}
              <motion.div 
                style={{
                  position: 'absolute', top: '10px', right: '0px', width: '30px', height: '30px',
                  background: 'var(--color-text-bright)', borderRadius: '50%',
                  boxShadow: '0 5px 15px rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  translateZ: 120, z: useTransform(explodeZ, v => v * 1.5)
                }}
              >
                <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>{proj.badge}</span>
              </motion.div>

            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
