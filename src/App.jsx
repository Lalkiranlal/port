import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from './components/Loader';
import DeveloperRoomScene from './components/DeveloperRoomScene';
import nameLogoImg from './assets/name_logo.png';

function TopNavigation() {
  const handleNav = (targetOffset) => {
    window.dispatchEvent(new CustomEvent('nav-click', { detail: { offset: targetOffset } }));
  };

  const navItemStyle = {
    cursor: 'pointer',
    color: '#00f0ff',
    fontFamily: 'var(--font-heading)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '0 0 5px rgba(0, 240, 255, 0.5)',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw',
      padding: '20px 40px', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 100, // On top of canvas
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <img
          src={nameLogoImg}
          alt="Kiran Lal K"
          style={{ height: '30px', filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8))', mixBlendMode: 'screen', cursor: 'pointer' }}
          onClick={() => handleNav(0.0)}
        />
      </div>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div style={navItemStyle} onClick={() => handleNav(0.0)}>Summary</div>
        <div style={navItemStyle} onClick={() => handleNav(0.25)}>Projects</div>
        <div style={navItemStyle} onClick={() => handleNav(0.45)}>Skills</div>
        <div style={navItemStyle} onClick={() => handleNav(0.65)}>Education</div>
        <div style={navItemStyle} onClick={() => handleNav(0.80)}>Experience</div>
        <div style={navItemStyle} onClick={() => handleNav(0.92)}>Contact</div>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div style={{ width: '100vw', height: '100vh', background: '#020202', overflow: 'hidden', position: 'relative' }}>
        {!loading && <TopNavigation />}
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
