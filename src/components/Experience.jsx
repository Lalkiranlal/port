import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { generateOrganicHairPaths } from '../utils/hairGenerator';

const experiences = [
  {
    role: "Senior Mobile Hunter",
    company: "Rapidor",
    period: "January 2024 - Present",
    points: [
      "Architected offline-first B2B commerce app with Hive and custom AutoSync engine.",
      "Rebuilt legacy Xamarin application in Flutter, improving maintainability.",
      "Integrated secure API interactions with ERP systems (SAP, Tally, QuickBooks)."
    ]
  },
  {
    role: "SDE 1 (Flutter)",
    company: "Lifeex India",
    period: "March 2023 - November 2023",
    points: [
      "Spearheaded development of EzyReports, an internal reporting tool for medical sales.",
      "Streamlined doctor visit logs and activity tracking into a responsive Flutter interface."
    ]
  },
  {
    role: "SDE 1 (Flutter)",
    company: "Rofabs",
    period: "March 2022 - January 2023",
    points: [
      "Led full lifecycle development of Flutter projects from concept through deployment.",
      "Collaborated with cross-functional teams to deliver performant mobile solutions."
    ]
  }
];

export default function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Generate 7 organic hair paths straight down X=0
  const hairPaths = useMemo(() => generateOrganicHairPaths(0, 0, 0, 1500, 7, 15, 0.008), []);

  return (
    <section id="experience" ref={containerRef} style={{ position: 'relative' }}>
      
      {/* Absolute SVG for Organic Timeline at X=0 */}
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
              style={{ pathLength, filter: 'drop-shadow(0 0 5px rgba(255,145,0,0.6))' }} 
            />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <h2 className="deity-heading" style={{ fontSize: '3rem', textAlign: 'center' }}>Legendary Quests</h2>
        
        <div className="timeline-container" style={{ paddingLeft: '4rem', marginTop: '4rem' }}>
          {experiences.map((exp, index) => (
            <TimelineCard key={index} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ exp, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 85%", "center center"]
  });

  // Smooth unfurling entrance
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.div 
      ref={cardRef} 
      className="exp-item-container shadow-card"
      style={{ scale, opacity, x, marginBottom: '4rem' }}
    >
      <span className="deity-sub" style={{ fontSize: '1rem', marginBottom: '0.5rem', borderBottom: 'none' }}>
        {exp.period}
      </span>
      <h3 style={{ margin: 0, color: 'var(--color-sunfire-orange)', fontSize: '1.8rem' }}>{exp.role}</h3>
      <p style={{ color: 'var(--color-text-main)', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', letterSpacing: '1px' }}>
        @ {exp.company}
      </p>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {exp.points.map((point, i) => (
          <li key={i} style={{ marginBottom: '1rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontSize: '1.1rem' }}>
            <span style={{ color: 'var(--color-mural-red)', marginRight: '8px' }}>▸</span> {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
