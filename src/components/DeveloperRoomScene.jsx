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
    
    // Exact mapping of pause phases and transitions
    // Intro
    if (offset < 0.10) {
      vec.copy(pIntro);
      targetLookAt.copy(tIntro);
    }
    // Intro -> Projects
    else if (offset < 0.20) {
      const t = (offset - 0.10) / 0.10;
      vec.lerpVectors(pIntro, pProjects, t);
      targetLookAt.lerpVectors(tIntro, tProjects, t);
    }
    // Projects Lock (Center: 0.25)
    else if (offset < 0.30) {
      vec.copy(pProjects);
      targetLookAt.copy(tProjects);
    }
    // Projects -> Skills
    else if (offset < 0.40) {
      const t = (offset - 0.30) / 0.10;
      vec.lerpVectors(pProjects, pSkills, t);
      targetLookAt.lerpVectors(tProjects, tSkills, t);
    }
    // Skills Lock (Center: 0.45)
    else if (offset < 0.50) {
      vec.copy(pSkills);
      targetLookAt.copy(tSkills);
    }
    // Skills -> About
    else if (offset < 0.60) {
      const t = (offset - 0.50) / 0.10;
      vec.lerpVectors(pSkills, pAbout, t);
      targetLookAt.lerpVectors(tSkills, tAbout, t);
    }
    // About Lock (Center: 0.65)
    else if (offset < 0.70) {
      vec.copy(pAbout);
      targetLookAt.copy(tAbout);
    }
    // About -> Experience
    else if (offset < 0.75) {
      const t = (offset - 0.70) / 0.05;
      vec.lerpVectors(pAbout, pExperience, t);
      targetLookAt.lerpVectors(tAbout, tExperience, t);
    }
    // Experience Lock (Center: 0.80)
    else if (offset < 0.85) {
      vec.copy(pExperience);
      targetLookAt.copy(tExperience);
    }
    // Experience -> Contact
    else if (offset < 0.90) {
      const t = (offset - 0.85) / 0.05;
      vec.lerpVectors(pExperience, pContact, t);
      targetLookAt.lerpVectors(tExperience, tContact, t);
    }
    // Contact Lock
    else {
      vec.copy(pContact);
      targetLookAt.copy(tContact);
    }

    state.camera.position.lerp(vec, 0.05);
    currentLookAt.lerp(targetLookAt, 0.05);
    state.camera.lookAt(currentLookAt);
  });
  return null;
}

function NavListener() {
  const scroll = useScroll();

  useEffect(() => {
    const handleNavClick = (e) => {
      if (scroll && scroll.el) {
        const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
        const targetScroll = maxScroll * e.detail.offset;
        scroll.el.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    };
    window.addEventListener('nav-click', handleNavClick);
    return () => window.removeEventListener('nav-click', handleNavClick);
  }, [scroll]);

  return null;
}
function Overlays() {
  const sections = [
    { offset: 0.0, top: '50vh', width: '700px', left: '10%', right: 'auto', align: 'left', transform: 'translateY(-50%)' }, // Intro: Left
    { offset: 0.25, top: '325vh', width: '700px', left: 'auto', right: '10%', align: 'right', transform: 'translateY(-50%)' }, // Projects: Right
    { offset: 0.45, top: '545vh', width: '800px', left: '50%', right: 'auto', align: 'center', transform: 'translate(-50%, -50%)' }, // Skills: Center
    { offset: 0.65, top: '765vh', width: '700px', left: '10%', right: 'auto', align: 'left', transform: 'translateY(-50%)' }, // Education: Left
    { offset: 0.80, top: '930vh', width: '700px', left: 'auto', right: '10%', align: 'right', transform: 'translateY(-50%)' }, // Experience: Right
    { offset: 0.92, top: '1062vh', width: '600px', left: '50%', right: 'auto', align: 'center', transform: 'translate(-50%, -50%)' }, // Contact: Center
  ];

  const getContainerStyle = (index) => ({
    position: 'absolute',
    top: sections[index].top,
    left: sections[index].left,
    right: sections[index].right,
    transform: sections[index].transform,
    width: sections[index].width,
    zIndex: 10,
    pointerEvents: 'none'
  });

  return (
    <Scroll html style={{ width: '100vw' }}>
      {/* 1. Intro (Left) */}
      <div className="system-section" style={getContainerStyle(0)}>
        <h1 className="system-header">Kiran Lal K</h1>
        <div className="system-content-block" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Flutter Developer</h2>
          <div className="system-subtitle">Class: Mobile Engineer | Lvl: 24</div>
          <p className="system-body">
            With nearly 2 years of experience building scalable enterprise mobile applications. Experienced in developing cross-platform apps using Flutter, REST APIs, and Firebase. Strong background in offline-first architecture, B2B commerce platforms, and sales force automation tools.
          </p>
        </div>
      </div>

      {/* 2. Projects (Right) */}
      <div className="system-section" style={getContainerStyle(1)}>
        <h1 className="system-header right-align" style={{ alignSelf: 'flex-end' }}>Active Quests</h1>
        
        <div className="system-content-block right-align" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Rapidor Enterprise Sales Platform</h2>
          <div className="system-subtitle">Rank: S-Class</div>
          <p className="system-body">
            Developed features for smart catalogue management, fast order creation, and price updates. Implemented offline order creation with AutoSync to synchronize orders when connectivity returns. Built modules for offer management, product performance tracking, and communication. Integrated ERP systems including SAP, Tally, and QuickBooks.
          </p>
        </div>

        <div className="system-content-block right-align" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">PlaceOrder – B2B Marketplace</h2>
          <div className="system-subtitle">Rank: A-Class | ONDC Integrated</div>
          <p className="system-body">
            Contributed to a B2B marketplace enabling businesses to buy and sell products digitally. Implemented product browsing, order placement, and backend API integrations.
          </p>
        </div>

        <div className="system-content-block right-align" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Ezy Reports – Lifeex India</h2>
          <div className="system-subtitle">Rank: A-Class</div>
          <p className="system-body">
            Developed reporting application for medical sales representatives. Implemented doctor visit tracking, order reports, and activity logging.
          </p>
        </div>
      </div>

      {/* 3. Skills (Center) */}
      <div className="system-section" style={{ ...getContainerStyle(2), alignItems: 'center' }}>
        <h1 className="system-header" style={{ textAlign: 'center' }}>Abilities</h1>
        <div className="system-content-block" style={{ pointerEvents: 'auto', width: '100%', borderLeft: 'none', background: 'rgba(3, 8, 20, 0.85)', padding: '40px', borderRadius: '4px' }}>
          <div className="skills-grid">
            <div className="skill-item">
              <span className="skill-label">Languages</span>
              <span className="skill-value">Dart, Swift, Java, Python</span>
            </div>
            <div className="skill-item">
              <span className="skill-label">Frameworks</span>
              <span className="skill-value">Flutter, UIKit, SwiftUI (Basic)</span>
            </div>
            <div className="skill-item">
              <span className="skill-label">Mobile Dev</span>
              <span className="skill-value">REST API, JSON, Offline Storage, Push Notifications</span>
            </div>
            <div className="skill-item">
              <span className="skill-label">State Mgmt</span>
              <span className="skill-value">Provider, Riverpod</span>
            </div>
            <div className="skill-item">
              <span className="skill-label">Backend & DB</span>
              <span className="skill-value">Firebase Auth/Firestore, SQLite, ObjectBox, CoreData</span>
            </div>
            <div className="skill-item">
              <span className="skill-label">Tools & Patterns</span>
              <span className="skill-value">Git, Android Studio, Xcode, MVC, MVVM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Education (Left) */}
      <div className="system-section" style={getContainerStyle(3)}>
        <h1 className="system-header">Origins</h1>
        <div className="system-content-block" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Master's in Mobile Application Development</h2>
          <div className="system-subtitle">Cochin University of Science and Technology (CUSAT) | 2022-2024</div>
        </div>
        <div className="system-content-block" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Bachelor's in Computer Science</h2>
          <div className="system-subtitle">University of Calicut | 2019-2021</div>
        </div>
      </div>

      {/* 5. Experience (Right) */}
      <div className="system-section" style={getContainerStyle(4)}>
        <h1 className="system-header right-align" style={{ alignSelf: 'flex-end' }}>Combat Log</h1>
        <div className="system-content-block right-align" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Junior Software Engineer</h2>
          <div className="system-subtitle">AcelrTech (Rapidor) | May 2024 – Present</div>
          <p className="system-body">
            Develop enterprise mobile applications using Flutter for B2B commerce and sales automation platforms. Built modules including order management, merchandising, reporting, and returns workflows. Integrated REST APIs and Firebase services for authentication, notifications, and data synchronization. Implemented offline data caching and background synchronization for field sales usage. Improved UI performance and application stability across Android and iOS devices.
          </p>
        </div>
        <div className="system-content-block right-align" style={{ pointerEvents: 'auto' }}>
          <h2 className="system-title">Software Developer Intern</h2>
          <div className="system-subtitle">AcelrTech | Mar 2024 – May 2024</div>
          <p className="system-body">
            Contributed to production Flutter applications used by enterprise sales teams. Resolved 200+ issues related to UI rendering, API integration, and mobile builds.
          </p>
        </div>
      </div>

      {/* 6. Contact (Center) */}
      <div className="system-section" style={{ ...getContainerStyle(5), alignItems: 'center' }}>
        <h1 className="system-header" style={{ textAlign: 'center' }}>System Link</h1>
        <div className="system-content-block" style={{ pointerEvents: 'auto', display: 'flex', gap: '20px', borderLeft: 'none', background: 'rgba(3, 8, 20, 0.85)', padding: '40px', borderRadius: '4px' }}>
          <a href="mailto:kiranlalk123@gmail.com" className="sys-btn">Email Connection</a>
          <a href="https://linkedin.com/in/kiranlalk" target="_blank" rel="noreferrer" className="sys-btn">LinkedIn Portal</a>
        </div>
      </div>
    </Scroll>
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
