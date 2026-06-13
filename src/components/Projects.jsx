import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Zap, Crosshair } from 'lucide-react';
import { generateOrganicHairPaths } from '../utils/hairGenerator';

const projects = [
  {
    title: "Rapidor Base",
    icon: <Shield size={24} />,
    points: [
      "Forged features for smart catalogue management, fast order creation, and price updates.",
      "Summoned offline order creation with AutoSync to synchronize orders when connectivity returns.",
      "Integrated sacred ERP systems including SAP, Tally, and QuickBooks."
    ],
    tags: ["Flutter", "Offline-First", "ERP API", "AutoSync"]
  },
  {
    title: "PlaceOrder Guild",
    icon: <Zap size={24} />,
    points: [
      "Contributed to a mythical B2B marketplace enabling merchants to trade digitally.",
      "Implemented product scrying, order placement, and backend API incantations."
    ],
    tags: ["Flutter", "ONDC", "REST APIs", "E-Commerce"]
  },
  {
    title: "EzyReports Scouter",
    icon: <Crosshair size={24} />,
    points: [
      "Developed advanced tracking systems for medical representatives.",
      "Implemented visit tracking, order runes, and activity logging."
    ],
    tags: ["Flutter", "Reporting", "Activity Tracking"]
  }
];

export default function Projects() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Adding spring for smoother parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Left column moves UP slightly as we scroll down
  const y1 = useTransform(smoothProgress, [0, 1], [150, -150]);
  // Right column moves DOWN slightly as we scroll down
  const y2 = useTransform(smoothProgress, [0, 1], [-150, 150]);

  // Continuous thread drawing down the left side
  const threadDraw = useTransform(smoothProgress, [0, 1], [0, 1]);
  
  // Generate 7 organic hair paths straight down X=0
  const hairPaths = useMemo(() => generateOrganicHairPaths(0, 0, 0, 1500, 7, 15, 0.008), []);

  return (
    <section id="projects" ref={sectionRef} style={{ position: 'relative' }}>
      
      {/* Absolute SVG for Continuous Hair Thread at X=0 */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '100%', 
        maxWidth: '800px', 
        height: '100%', 
        zIndex: 0, 
        pointerEvents: 'none' 
      }}>
        <svg viewBox="0 0 800 1500" preserveAspectRatio="xMidYMin slice" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {hairPaths.map((path, i) => (
            <motion.path 
              key={i} 
              d={path} 
              stroke={i % 2 === 0 ? "var(--color-sunfire-orange)" : "var(--color-mural-red)"} 
              strokeWidth={i % 3 === 0 ? "3" : "1.5"} 
              fill="none" 
              style={{ pathLength: threadDraw, filter: 'drop-shadow(0 0 5px rgba(255,145,0,0.6))' }} 
            />
          ))}
        </svg>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <h2 className="deity-heading" style={{ fontSize: '3rem' }}>System Logs</h2>
      </div>
      
      <div className="projects-parallax-container" style={{ position: 'relative', zIndex: 1, paddingLeft: '2rem' }}>
        {/* Left Column */}
        <motion.div className="parallax-column" style={{ y: y1 }}>
          <ProjectCard project={projects[0]} />
          <ProjectCard project={projects[2]} />
        </motion.div>

        {/* Right Column */}
        <motion.div className="parallax-column" style={{ y: y2 }}>
          <ProjectCard project={projects[1]} />
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="shadow-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--color-sunfire-orange)' }}>
          {project.icon}
        </div>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--color-text-bright)' }}>{project.title}</h3>
      </div>
      
      <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem', flex: 1 }}>
        {project.points.map((point, i) => (
          <li key={i} style={{ marginBottom: '1rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontSize: '1.1rem' }}>
            <span style={{color: 'var(--color-mural-red)', marginRight: '8px'}}>|</span> {point}
          </li>
        ))}
      </ul>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {project.tags.map((tag, i) => (
          <span key={i} style={{ padding: '4px 12px', background: 'rgba(255, 145, 0, 0.1)', border: '1px solid var(--color-sunfire-orange)', color: 'var(--color-sunfire-orange)', fontSize: '0.9rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
