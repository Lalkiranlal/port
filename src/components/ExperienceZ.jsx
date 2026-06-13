import React from 'react';
import { motion, useTransform } from 'framer-motion';

const experiences = [
  {
    id: 1,
    role: "Senior Mobile Architect",
    company: "Rapidor",
    period: "2021 - Present",
    desc: "Led the migration to an offline-first architecture for B2B commerce. Built custom local-first DB adapters reducing load times by 80%."
  },
  {
    id: 2,
    role: "Mobile App Developer",
    company: "Tech Solutions",
    period: "2019 - 2021",
    desc: "Developed highly scalable cross-platform apps using Flutter. Integrated WebRTC for real-time fleet communication."
  },
  {
    id: 3,
    role: "Software Engineer",
    company: "Startup Inc",
    period: "2017 - 2019",
    desc: "Built native Android experiences. Focused on UI performance and reactive state management using Kotlin Coroutines."
  }
];

export default function ExperienceZ({ scroll, range }) {
  const span = range[1] - range[0];
  const step = span / experiences.length;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
      {experiences.map((exp, i) => {
        const pStart = range[0] + i * step;
        const pEnd = pStart + step;
        const pFocus = pStart + (step * 0.8);

        // Scale from very small (0.1) -> 1 -> huge (15)
        const scale = useTransform(scroll, [pStart, pFocus, pEnd], [0.1, 1, 15]);
        const opacity = useTransform(scroll, [pStart, pStart+0.02, pFocus, pEnd], [0, 1, 1, 0]);

        // Drifting effect (alternate left and right so they don't block each other completely)
        const yOffset = i % 2 === 0 ? -50 : 50;
        const xOffset = i % 2 === 0 ? 100 : -100;

        return (
          <motion.div 
            key={exp.id}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              scale, opacity, transformStyle: 'preserve-3d'
            }}
          >
            <motion.div 
              className="shadow-card"
              style={{
                width: '600px', background: 'rgba(15,15,15,0.9)', 
                border: '1px solid var(--color-mural-red)', padding: '2rem',
                y: yOffset, x: xOffset
              }}
            >
              <h2 style={{ color: 'var(--color-mural-red)', margin: '0 0 10px 0', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>{exp.role}</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: 'var(--color-text-bright)', fontSize: '1.2rem', fontFamily: 'monospace' }}>{exp.company}</span>
                <span style={{ color: 'var(--color-sunfire-orange)', fontFamily: 'monospace' }}>{exp.period}</span>
              </div>
              <p style={{ color: 'var(--color-text-main)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                {exp.desc}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
