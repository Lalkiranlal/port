import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html, Billboard } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom, Noise } from '@react-three/postprocessing';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import * as THREE from 'three';

import bgWallImg from '../assets/bg_wall.png';
import mgTreeImg from '../assets/mg_tree.png';
import mgHologramImg from '../assets/mg_hologram.png';
import mgShelfImg from '../assets/mg_shelf.png';
import fgDeskImg from '../assets/fg_desk.png';
import fgParticlesImg from '../assets/fg_particles.png';
import nameLogoImg from '../assets/name_logo.png';

// Digit by Digit Typewriter Effect Component
function TypewriterText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

// 1. The 10-Layer Epic Shadow Monarch Diorama
function StorybookDiorama() {
  const [bgTex, treeTex, holoTex, shelfTex, deskTex, partTex] = useLoader(THREE.TextureLoader, [bgWallImg, mgTreeImg, mgHologramImg, mgShelfImg, fgDeskImg, fgParticlesImg]);

  [bgTex, treeTex, holoTex, shelfTex, deskTex, partTex].forEach(tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
  });

  return (
    <group>
      {/* L0: Background Wall (Z=-100). Scaled down slightly for better resolution. */}
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[300, 168]} />
        <meshBasicMaterial map={bgTex} depthWrite={false} />
      </mesh>

      {/* L1: Secondary Mist / Background Overlay (Z=-80) */}
      <mesh position={[0, -20, -80]}>
        <planeGeometry args={[200, 150]} />
        <meshBasicMaterial map={partTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} opacity={0.6} />
      </mesh>

      {/* L2: Distant Left Pillar (Z=-70) */}
      <mesh position={[-40, -10, -70]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial map={shelfTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L3: Experience Tree / Main Statue (Z=-60). Offset Right. */}
      <mesh position={[25, 0, -60]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial map={treeTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L4: Distant Magic Runes (Z=-50). Offset Left. */}
      <mesh position={[-30, 20, -50]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial map={holoTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} opacity={0.5} />
      </mesh>

      {/* L5: About Me Pillar (Z=-40). Offset Left. */}
      <mesh position={[-25, 0, -40]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial map={shelfTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L6: Ground Aura Extradition (Z=-30) */}
      <mesh position={[0, -20, -30]}>
        <planeGeometry args={[150, 150]} />
        <meshBasicMaterial map={deskTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} opacity={0.7} />
      </mesh>

      {/* L7: Skills Hologram (Z=-20). Offset Right. */}
      <mesh position={[25, 5, -20]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial map={holoTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L8: Right Foreground Statue (Z=-10). Offset Right */}
      <mesh position={[40, -15, -10]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial map={treeTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L9: Intro Desk / Ground Source (Z=0). Center. */}
      <mesh position={[0, -10, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial map={deskTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>

      {/* L10: Foreground Particles (Z=20). */}
      <mesh position={[0, 0, 20]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial map={partTex} blending={THREE.AdditiveBlending} transparent={true} depthWrite={false} />
      </mesh>
    </group>
  );
}

// 2. The 3D Camera Controller (6 Sequential Anchors)
function CameraController() {
  const scroll = useScroll();
  const vec = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3(0, 0, -80);

  // The 6 Anchor Positions for the Camera Flight Path
  const pStart = new THREE.Vector3(0, 0, 40);
  const pIntro = new THREE.Vector3(0, 5, 20);
  const pProjects = new THREE.Vector3(5, 2, 5);
  const pSkills = new THREE.Vector3(5, 2, -10);
  const pAbout = new THREE.Vector3(0, 2, -25);
  const pExperience = new THREE.Vector3(5, 2, -45);
  const pContact = new THREE.Vector3(0, 2, -60);

  // Define HTML node positions (what the camera looks at)
  const tIntro = new THREE.Vector3(-5, 0, 0);
  const tProjects = new THREE.Vector3(15, -2, -10);
  const tSkills = new THREE.Vector3(20, 0, -25);
  const tAbout = new THREE.Vector3(-15, 0, -35); // Brought closer (was -20, 0, -40)
  const tExperience = new THREE.Vector3(15, 0, -55); // Brought closer (was 20, 0, -60)
  const tContact = new THREE.Vector3(0, 0, -80);

  useFrame((state) => {
    const offset = scroll.offset;
    const targetLookAt = new THREE.Vector3();

    // Smoothly interpolate scroll offset for camera movement
    if (offset < 0.15) {
      const t = offset / 0.15;
      vec.lerpVectors(new THREE.Vector3(0, 10, 40), pIntro, t);
      targetLookAt.lerpVectors(new THREE.Vector3(0, -5, 0), tIntro, t);
    }
    else if (offset < 0.20) {
      vec.copy(pIntro);
      targetLookAt.copy(tIntro);
    }
    else if (offset < 0.35) {
      const t = (offset - 0.20) / 0.15;
      vec.lerpVectors(pIntro, pProjects, t);
      targetLookAt.lerpVectors(tIntro, tProjects, t);
    }
    else if (offset < 0.40) {
      vec.copy(pProjects);
      targetLookAt.copy(tProjects);
    }
    else if (offset < 0.55) {
      const t = (offset - 0.40) / 0.15;
      vec.lerpVectors(pProjects, pSkills, t);
      targetLookAt.lerpVectors(tProjects, tSkills, t);
    }
    else if (offset < 0.60) {
      vec.copy(pSkills);
      targetLookAt.copy(tSkills);
    }
    else if (offset < 0.75) {
      const t = (offset - 0.60) / 0.15;
      vec.lerpVectors(pSkills, pAbout, t);
      targetLookAt.lerpVectors(tSkills, tAbout, t);
    }
    else if (offset < 0.80) {
      vec.copy(pAbout);
      targetLookAt.copy(tAbout);
    }
    else if (offset < 0.95) {
      const t = (offset - 0.80) / 0.15;
      vec.lerpVectors(pAbout, pExperience, t);
      targetLookAt.lerpVectors(tAbout, tExperience, t);
    }
    else if (offset < 0.98) {
      vec.copy(pExperience);
      targetLookAt.copy(tExperience);
    }
    else {
      const t = (offset - 0.98) / 0.02;
      vec.lerpVectors(pExperience, pContact, t);
      targetLookAt.lerpVectors(tExperience, tContact, t);
    }

    state.camera.position.lerp(vec, 0.05);
    currentLookAt.lerp(targetLookAt, 0.05);
    state.camera.lookAt(currentLookAt);
  });

  return null;
}

// 3. The 3D UI Overlay Engine (Parallax Cards)
function AnimatedGlassNode({ position, width = '500px', children }) {
  // Refactored to be a TRUE 3D object in space. No opacity hiding needed!
  return (
    <Billboard position={position}>
      <Html transform distanceFactor={15} center>
        <div 
          className="system-window hud-container" 
          style={{ 
            width, 
            pointerEvents: 'auto'
          }}
        >
          {/* Deep Background Layer (Inner Parallax) */}
          <div style={{
            position: 'absolute',
            top: '-20%', left: '-20%', width: '140%', height: '140%',
            backgroundImage: `url(${mgHologramImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            zIndex: -1
          }} />
          
          {/* Hovering Foreground Layer (The Text) */}
          <div style={{ position: 'relative' }}>
            {children}
          </div>
        </div>
      </Html>
    </Billboard>
  );
}

function NavListener() {
  const scroll = useScroll();
  useEffect(() => {
    const handleNav = (e) => {
      if (scroll.el) {
        // Correct scroll target calculation based on max scrollable height
        const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
        const targetScroll = maxScroll * e.detail.offset;
        scroll.el.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    };
    window.addEventListener('nav-click', handleNav);
    return () => window.removeEventListener('nav-click', handleNav);
  }, [scroll]);
  return null;
}

function Overlays() {
  return (
    <group>
      {/* 1. Intro (0.00 - 0.25) -> Expanded range */}
      <AnimatedGlassNode position={[-5, 0, 0]} startRange={0.0} endRange={0.25} width="600px">
        <p className="hud-subtitle">Professional Summary</p>
        <p className="hud-text">
          <TypewriterText text="Flutter Developer with nearly 2 years of experience building scalable enterprise mobile applications. Experienced in developing cross-platform apps using Flutter, REST APIs, and Firebase. Strong background in offline-first architecture, B2B commerce platforms, and sales force automation tools. Proven ability to build production mobile apps used by field sales teams and enterprise clients." speed={15} />
        </p>
      </AnimatedGlassNode>

      {/* 2. Projects (0.25 - 0.45) -> Expanded range */}
      <AnimatedGlassNode position={[15, -2, -10]} startRange={0.25} endRange={0.45} width="600px">
        <h2 className="hud-title" style={{ color: '#ffbd2e' }}>Projects</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Rapidor Enterprise Sales Platform</h3>
            <ul style={{ color: 'var(--color-text-main)', paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li>Developed features for smart catalogue management, fast order creation, and price updates.</li>
              <li>Implemented offline order creation with AutoSync to synchronize orders when connectivity returns.</li>
              <li>Built modules for offer management, product performance tracking, and communication.</li>
              <li>Integrated ERP systems including SAP, Tally, and QuickBooks.</li>
            </ul>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>PlaceOrder – B2B Marketplace</h3>
            <ul style={{ color: 'var(--color-text-main)', paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li>Contributed to a B2B marketplace enabling businesses to buy and sell products digitally.</li>
              <li>Implemented product browsing, order placement, and backend API integrations.</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Ezy Reports – Lifeex India</h3>
            <ul style={{ color: 'var(--color-text-main)', paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li>Developed reporting application for medical sales representatives.</li>
              <li>Implemented doctor visit tracking, order reports, and activity logging.</li>
            </ul>
          </div>
        </div>
      </AnimatedGlassNode>

      {/* 3. Skills (0.45 - 0.65) */}
      <AnimatedGlassNode position={[20, 0, -25]} startRange={0.45} endRange={0.65} width="550px">
        <h2 className="hud-title" style={{ color: '#ffbd2e' }}>Technical Skills</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          <div><strong style={{color: '#fff'}}>Languages:</strong> <span style={{color: '#00f0ff'}}>Dart, Swift, Java, Python</span></div>
          <div><strong style={{color: '#fff'}}>Frameworks:</strong> <span style={{color: '#00f0ff'}}>Flutter, UIKit, SwiftUI (Basic)</span></div>
          <div><strong style={{color: '#fff'}}>Mobile Dev:</strong> <span style={{color: '#00f0ff'}}>REST API, JSON Parsing, Offline Storage, Push Notifications</span></div>
          <div><strong style={{color: '#fff'}}>State Mgmt:</strong> <span style={{color: '#00f0ff'}}>Provider, Riverpod (Basic)</span></div>
          <div><strong style={{color: '#fff'}}>Backend:</strong> <span style={{color: '#00f0ff'}}>Firebase Auth, Firestore, Cloud Messaging</span></div>
          <div><strong style={{color: '#fff'}}>Databases:</strong> <span style={{color: '#00f0ff'}}>SQLite, ObjectBox, CoreData</span></div>
          <div><strong style={{color: '#fff'}}>Tools:</strong> <span style={{color: '#00f0ff'}}>Git, GitHub, Android Studio, Xcode, Test Flight</span></div>
          <div><strong style={{color: '#fff'}}>Architecture:</strong> <span style={{color: '#00f0ff'}}>MVC, MVVM</span></div>
        </div>
      </AnimatedGlassNode>

      {/* 4. Education (About Me replaced with Education) (0.65 - 0.80) */}
      <AnimatedGlassNode position={[-15, 0, -35]} startRange={0.65} endRange={0.80} width="550px">
        <h2 className="hud-title" style={{ color: '#ffbd2e' }}>Education</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Master's in Mobile Application Development</h3>
          <p style={{ color: 'var(--color-text-main)', margin: '0' }}>Cochin University of Science and Technology (CUSAT)<br/>2022 – 2024</p>
        </div>
        <div>
          <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Bachelor's in Computer Science</h3>
          <p style={{ color: 'var(--color-text-main)', margin: '0' }}>University of Calicut<br/>2019 – 2022</p>
        </div>
      </AnimatedGlassNode>

      {/* 5. Experience (0.80 - 0.92) */}
      <AnimatedGlassNode position={[15, 0, -55]} startRange={0.80} endRange={0.92} width="600px">
        <h2 className="hud-title" style={{ color: '#ffbd2e' }}>Professional Experience</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Junior Software Engineer <span style={{color: '#fff', fontSize: '0.9rem'}}>(May 2024 – Present)</span></h3>
            <p style={{ color: '#ffbd2e', margin: '0 0 10px 0', fontSize: '0.9rem' }}>AcelrTech (Rapidor)</p>
            <ul style={{ color: 'var(--color-text-main)', paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li>Develop enterprise mobile applications using Flutter for B2B commerce and sales automation platforms.</li>
              <li>Built modules including order management, merchandising, reporting, and returns workflows.</li>
              <li>Integrated REST APIs and Firebase services for authentication, notifications, and data synchronization.</li>
              <li>Implemented offline data caching and background synchronization for field sales usage.</li>
              <li>Improved UI performance and application stability across Android and iOS devices.</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#00f0ff', margin: '0 0 5px 0' }}>Software Developer Intern <span style={{color: '#fff', fontSize: '0.9rem'}}>(Mar 2024 – May 2024)</span></h3>
            <p style={{ color: '#ffbd2e', margin: '0 0 10px 0', fontSize: '0.9rem' }}>AcelrTech (Rapidor)</p>
            <ul style={{ color: 'var(--color-text-main)', paddingLeft: '20px', margin: 0, fontSize: '0.95rem' }}>
              <li>Contributed to production Flutter applications used by enterprise sales teams.</li>
              <li>Resolved 200+ issues related to UI rendering, API integration, and mobile builds.</li>
            </ul>
          </div>
        </div>
      </AnimatedGlassNode>

      {/* 6. Contact (0.92 - 1.0) */}
      <AnimatedGlassNode position={[0, 0, -80]} startRange={0.92} endRange={1.0} width="400px">
        <h2 className="hud-title" style={{ color: '#ffbd2e' }}>SYSTEM CONNECTION</h2>
        <p className="hud-text" style={{ textAlign: 'center' }}>
          Email: kiranlalk123@gmail.com<br/>
          Phone: +91 8137852521<br/>
          LinkedIn: linkedin.com/in/kiranlalk<br/>
          Location: Kerala, India
        </p>
      </AnimatedGlassNode>
    </group>
  );
}

export default function DeveloperRoomScene() {
  return (
    <>
      <color attach="background" args={['#020202']} />
      <ambientLight intensity={0.5} />
      <ScrollControls pages={12} damping={0.25}>
        <CameraController />
        <StorybookDiorama />
        <Overlays />
        <NavListener />
      </ScrollControls>

      {/* High-Performance Post-Processing for 2D Diorama */}
      <EffectComposer disableNormalPass multisampling={0}>
        {/* Soft, magical bloom to enhance the 2D layered assets */}
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.8} />
      </EffectComposer>
    </>
  );
}
