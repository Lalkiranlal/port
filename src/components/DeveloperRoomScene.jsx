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

// System Decode Text Effect
const DecodeText = ({ text, className, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

  const startDecode = () => {
    if (hasAnimated) return;
    setHasAnimated(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((letter, index) => {
          if (letter === ' ') return ' ';
          if (index < iterations) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3; // speed of decode
    }, 30);
  };

  return (
    <motion.span
      className={className}
      onViewportEnter={() => setTimeout(startDecode, delay)}
      viewport={{ once: true, amount: 0.8 }}
    >
      {displayText}
    </motion.span>
  );
};

// Constellation Timeline Component (Aries & Experience)
const ConstellationTimeline = ({ nodes, pathData, starCoords, height = '400px' }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: height, marginTop: '2rem' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', overflow: 'visible', zIndex: -1 }}>
        <motion.path
          d={pathData}
          stroke="var(--color-sys-blue)"
          strokeWidth="0.5"
          fill="transparent"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ filter: 'drop-shadow(0 0 5px var(--color-sys-blue))' }}
        />

      </svg>
      {nodes.map((node, i) => (
        <motion.div key={`text-${i}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.4 }}
          style={{
            position: 'absolute',
            left: `${starCoords[i].x}%`,
            top: `${starCoords[i].y}%`,
            color: '#fff',
            textShadow: '0 5px 10px rgba(0,0,0,1), 0 0 15px rgba(0,0,0,0.8)',
            minWidth: '280px',
            pointerEvents: 'auto',
            transform: 'translate(-10px, -10px)', /* Center the star on the line */
            zIndex: 20
          }}
        >
          {/* The Star Shape */}
          <div style={{
            width: '20px', height: '20px',
            background: '#00f0ff',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            boxShadow: '0 0 20px #00f0ff',
            position: 'absolute',
            top: '0', left: '0',
            zIndex: 20
          }} />

          <div style={{ paddingLeft: '35px' }}>
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              <DecodeText text={node.label} />
            </strong>
            <br />
            <span style={{ color: '#00f0ff', fontSize: '1.05rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', textShadow: '0 2px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.8)' }}>
              <DecodeText text={node.sub} delay={200} />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

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

  // Dispatch current scroll offset to window for the VerticalNavigation component
  useFrame(() => {
    if (scroll) {
      window.dispatchEvent(new CustomEvent('scroll-update', { detail: { offset: scroll.offset } }));
    }
  });

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

  const variantsLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const variantsRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const variantsCenter = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: (width) => ({
      width: width,
      transition: { duration: 1.2, delay: 0.5, ease: 'easeOut' }
    }),
  };

  return (
    <Scroll html style={{ width: '100vw' }}>
      {/* 1. Intro (Left) */}
      <motion.div className="system-section" style={getContainerStyle(0)} variants={variantsLeft} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <motion.h1 className="system-header" variants={itemVariants}><DecodeText text="Kiran Lal K" /></motion.h1>
        <motion.div className="system-content-block" style={{ pointerEvents: 'auto' }} variants={itemVariants}>
          <h2 className="system-title"><DecodeText text="Flutter Developer" delay={100} /></h2>
          <div className="system-subtitle"><DecodeText text="Class: Mobile Engineer | Lvl: 24" delay={200} /></div>
          <p className="system-body">
            With nearly 2 years of experience building scalable enterprise mobile applications. Experienced in developing cross-platform apps using Flutter, REST APIs, and Firebase. Strong background in offline-first architecture, B2B commerce platforms, and sales force automation tools.
          </p>
        </motion.div>
      </motion.div>

      {/* 2. Projects (Right) */}
      <motion.div className="system-section" style={getContainerStyle(1)} variants={variantsRight} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }}>
        <motion.h1 className="system-header right-align" style={{ alignSelf: 'flex-end' }} variants={itemVariants}><DecodeText text="Active Quests" /></motion.h1>

        <motion.div className="system-content-block right-align" style={{ pointerEvents: 'auto' }} variants={itemVariants}>
          <h2 className="system-title"><DecodeText text="Rapidor Enterprise Sales Platform" delay={100} /></h2>
          <div className="system-subtitle"><DecodeText text="B2B Commerce & SFA" delay={200} /></div>
          <p className="system-body">
            Developed features for smart catalogue management, fast order creation, and price updates. Implemented offline order creation with AutoSync to synchronize orders when connectivity returns. Built modules for offer management, product performance tracking, and communication. Integrated ERP systems including SAP, Tally, and QuickBooks.
          </p>
        </motion.div>

        <motion.div className="system-content-block right-align" style={{ pointerEvents: 'auto' }} variants={itemVariants}>
          <h2 className="system-title"><DecodeText text="PlaceOrder – B2B Marketplace" delay={100} /></h2>
          <div className="system-subtitle"><DecodeText text="ONDC Integrated Platform" delay={200} /></div>
          <p className="system-body">
            Contributed to a B2B marketplace enabling businesses to buy and sell products digitally. Implemented product browsing, order placement, and backend API integrations.
          </p>
        </motion.div>

        <motion.div className="system-content-block right-align" style={{ pointerEvents: 'auto' }} variants={itemVariants}>
          <h2 className="system-title"><DecodeText text="Ezy Reports – Lifeex India" delay={100} /></h2>
          <div className="system-subtitle"><DecodeText text="Medical Sales Reporter" delay={200} /></div>
          <p className="system-body">
            Developed reporting application for medical sales representatives. Implemented doctor visit tracking, order reports, and activity logging.
          </p>
        </motion.div>
      </motion.div>

      {/* 3. Skills (Center) */}
      <motion.div className="system-section" style={{ ...getContainerStyle(2), alignItems: 'center' }} variants={variantsCenter} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <motion.h1 className="system-header" style={{ textAlign: 'center' }} variants={itemVariants}><DecodeText text="Abilities" /></motion.h1>
        <motion.div className="system-content-block" style={{ pointerEvents: 'auto', width: '100%', borderLeft: 'none', background: 'rgba(3, 8, 20, 0.85)', padding: '40px', borderRadius: '4px' }} variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      {/* 4. Education (Left) */}
      <motion.div className="system-section" style={getContainerStyle(3)} variants={variantsLeft} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <motion.h1 className="system-header" variants={itemVariants}><DecodeText text="Origins" /></motion.h1>
        <ConstellationTimeline
          nodes={[
            { label: "10th Standard", sub: "VMHSS School, Palakkad" },
            { label: "Higher Secondary", sub: "GBHSS, Palakkad" },
            { label: "Bachelor's in CS", sub: "University of Calicut | 2019-2021" },
            { label: "Master's in Mobile Dev", sub: "CUSAT | 2022-2024" }
          ]}
          pathData="M 30 10 L 10 40 L 50 65 L 70 95"
          starCoords={[{ x: 30, y: 10 }, { x: 10, y: 40 }, { x: 50, y: 65 }, { x: 70, y: 95 }]}
          height="600px"
        />
      </motion.div>

      {/* 5. Experience (Right) */}
      <motion.div className="system-section" style={getContainerStyle(4)} variants={variantsRight} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <motion.h1 className="system-header right-align" style={{ alignSelf: 'flex-end' }} variants={itemVariants}><DecodeText text="Combat Log" /></motion.h1>
        <ConstellationTimeline
          nodes={[
            { label: "Junior Software Engineer", sub: "AcelrTech (Rapidor) | May 2024 – Present\nDevelop enterprise mobile applications using Flutter for B2B commerce and sales automation platforms.\nIntegrated REST APIs and Firebase services for authentication, notifications, and data synchronization.\nImplemented offline data caching and background synchronization for field sales usage." },
            { label: "Software Developer Intern", sub: "AcelrTech | Mar 2024 – May 2024\nContributed to production Flutter applications used by enterprise sales teams.\nResolved 200+ issues related to UI rendering, API integration, and mobile builds." }
          ]}
          pathData="M 80 20 L 20 80"
          starCoords={[{ x: 80, y: 20 }, { x: 20, y: 80 }]}
          height="500px"
        />
      </motion.div>

      {/* 6. Contact (Center) */}
      <motion.div className="system-section" style={{ ...getContainerStyle(5), alignItems: 'center' }} variants={variantsCenter} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.8 }}>
        <motion.h1 className="system-header" style={{ textAlign: 'center' }} variants={itemVariants}><DecodeText text="System Link" /></motion.h1>
        <motion.div className="system-content-block" style={{ pointerEvents: 'auto', display: 'flex', gap: '20px', borderLeft: 'none', background: 'rgba(3, 8, 20, 0.85)', padding: '40px', borderRadius: '4px' }} variants={itemVariants}>
          <a href="mailto:kiranlalk123@gmail.com" className="sys-btn">Email Connection</a>
          <a href="https://linkedin.com/in/kiranlalk" target="_blank" rel="noreferrer" className="sys-btn">LinkedIn Portal</a>
        </motion.div>
      </motion.div>
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
