import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function HeroZ({ scroll, range }) {
  // Global scale for the entire hero section pushing towards camera
  const globalScale = useTransform(scroll, range, [1, 20]);
  const globalOpacity = useTransform(scroll, [range[0], range[0] + 0.15, range[1]], [1, 1, 0]);

  // Terminal shattering (elements drift apart on X/Y as they move closer in Z)
  const driftLeft = useTransform(scroll, range, [0, -600]);
  const driftRight = useTransform(scroll, range, [0, 600]);
  const driftUp = useTransform(scroll, range, [0, -500]);
  const driftDown = useTransform(scroll, range, [0, 500]);

  // Chassis scale: fades in from nothing and scales up slightly
  const chassisScale = useTransform(scroll, range, [0.5, 1.5]);
  const chassisOpacity = useTransform(scroll, [range[0], range[0] + 0.1], [0, 1]);
  
  return (
    <motion.div 
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        scale: globalScale, opacity: globalOpacity,
        transformStyle: 'preserve-3d', pointerEvents: 'none'
      }}
    >
      <div style={{ position: 'relative', width: '800px', height: '600px', transformStyle: 'preserve-3d' }}>
        
        {/* Terminal Header */}
        <motion.div 
          className="shadow-card"
          style={{ position: 'absolute', top: '50px', left: '100px', width: '600px', padding: '1rem', y: driftUp, x: driftLeft, zIndex: 3, background: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
          </div>
          <p style={{ color: 'var(--color-sunfire-orange)', fontFamily: 'monospace', margin: 0 }}>{">"} INITIATING Z-AXIS PROTOCOL...</p>
        </motion.div>

        {/* Name Title */}
        <motion.div 
          style={{ position: 'absolute', top: '150px', left: '120px', y: driftUp, x: driftRight, zIndex: 2 }}
        >
          <h1 className="deity-heading" style={{ fontSize: '5rem', margin: 0, whiteSpace: 'nowrap' }}>KIRAN LAL K</h1>
          <h2 style={{ color: 'var(--color-text-bright)', margin: 0, fontSize: '2rem', fontFamily: 'monospace' }}>SENIOR MOBILE ARCHITECT</h2>
        </motion.div>

        {/* Subtitle / Code Block */}
        <motion.div 
          className="shadow-card"
          style={{ position: 'absolute', top: '300px', left: '150px', width: '500px', x: driftLeft, y: driftDown, zIndex: 1, background: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <pre style={{ color: 'var(--color-text-main)', fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
            <span style={{ color: '#ff79c6' }}>import</span> {'{'} MobileHunter {'}'} <span style={{ color: '#ff79c6' }}>from</span> <span style={{ color: '#f1fa8c' }}>'@shadow-realm/core'</span>;{'\n\n'}
            <span style={{ color: '#8be9fd' }}>const</span> architect = <span style={{ color: '#ff79c6' }}>new</span> MobileHunter({'\n'}
            {'  '}layer: <span style={{ color: '#f1fa8c' }}>'system-level'</span>,{'\n'}
            {'  '}mode: <span style={{ color: '#f1fa8c' }}>'offline-first'</span>{'\n'}
            {'});'}
          </pre>
        </motion.div>
        
        {/* The 3D Smartphone Chassis revealed behind the terminal */}
        <motion.div
          style={{
            position: 'absolute', top: '50%', left: '50%', marginLeft: '-150px', marginTop: '-300px',
            width: '300px', height: '600px', border: '8px solid var(--color-mural-red)', borderRadius: '40px',
            boxShadow: '0 0 50px rgba(230,57,70,0.5)', zIndex: 0,
            opacity: chassisOpacity,
            scale: chassisScale
          }}
        >
          {/* Internal Grid to look techy */}
          <div style={{ width: '100%', height: '100%', background: 'rgba(15,15,15,0.9)', borderRadius: '32px', backgroundImage: 'linear-gradient(rgba(255,145,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '80%', height: '80%', border: '1px solid var(--color-sunfire-orange)', borderRadius: '16px', opacity: 0.5 }}></div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
