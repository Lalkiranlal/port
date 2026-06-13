import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function SkillsZ({ scroll, range }) {
  // Starts far away (scale 0), zooms in to scale 15 (flying past)
  const globalScale = useTransform(scroll, range, [0.1, 15]);
  // Fade in at start of range, fade out at end
  const globalOpacity = useTransform(scroll, [range[0], range[0]+0.1, range[1]-0.1, range[1]], [0, 1, 1, 0]);

  // Monoliths floating in 3D space
  const m1X = useTransform(scroll, range, [-200, -800]);
  const m2X = useTransform(scroll, range, [200, 800]);
  const m3Y = useTransform(scroll, range, [-200, -800]);

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
        
        {/* Monolith 1: Architecture */}
        <motion.div 
          className="shadow-card"
          style={{ position: 'absolute', top: '200px', left: '0', width: '250px', x: m1X, zIndex: 1, transform: 'rotateY(15deg)', background: 'rgba(15,15,15,0.9)', border: '1px solid var(--color-sunfire-orange)' }}
        >
          <h3 style={{ color: 'var(--color-sunfire-orange)', margin: '0 0 1rem 0' }}>Clean Architecture</h3>
          <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Domain-driven design, repository pattern, isolating business logic from UI frameworks.</p>
        </motion.div>

        {/* Monolith 2: State */}
        <motion.div 
          className="shadow-card"
          style={{ position: 'absolute', top: '300px', right: '0', width: '250px', x: m2X, zIndex: 2, transform: 'rotateY(-15deg)', background: 'rgba(15,15,15,0.9)', border: '1px solid var(--color-mural-red)' }}
        >
          <h3 style={{ color: 'var(--color-mural-red)', margin: '0 0 1rem 0' }}>State & Reactivity</h3>
          <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem' }}>BLoC, Provider, Riverpod, Redux. Ultra-smooth state propagation without rebuilding the tree.</p>
        </motion.div>

        {/* Monolith 3: Offline First */}
        <motion.div 
          className="shadow-card"
          style={{ position: 'absolute', top: '50px', left: '250px', width: '300px', y: m3Y, zIndex: 3, transform: 'rotateX(15deg)', background: 'rgba(15,15,15,0.9)', border: '1px solid #ffbd2e' }}
        >
          <h3 style={{ color: '#ffbd2e', margin: '0 0 1rem 0', textAlign: 'center' }}>Offline-First Engine</h3>
          <pre style={{ color: 'var(--color-text-main)', fontSize: '0.8rem', background: '#0a0a0a', padding: '1rem', borderRadius: '8px' }}>
            {`{
  "sync_queue": [
    {
      "mutation": "INSERT_ORDER",
      "status": "PENDING_NETWORK",
      "payload": { "id": "ORD-77X" }
    }
  ]
}`}
          </pre>
        </motion.div>

      </div>
    </motion.div>
  );
}
