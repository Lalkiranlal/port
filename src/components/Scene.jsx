import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Starfield() {
  const ref = useRef();
  // Generate random points in a sphere
  const sphere = random.inSphere(new Float32Array(5000), { radius: 10 });

  useFrame((state, delta) => {
    if (ref.current) {
      // Move particles towards the camera (positive Z)
      ref.current.position.z += delta * 2;
      
      // Loop the starfield so we never run out of stars
      if (ref.current.position.z > 5) {
        ref.current.position.z = -5;
      }
      
      // Slight rotation for dynamic feel
      ref.current.rotation.z -= delta / 10;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ff5722" // Sunfire orange tint
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Scene() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050505', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Starfield />
      </Canvas>
    </div>
  );
}
