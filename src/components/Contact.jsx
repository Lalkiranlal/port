import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contact" style={{ textAlign: 'center', padding: '100px 10vw' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: '600px', margin: '0 auto' }}
        className="shadow-card"
      >
        <h2 className="deity-heading" style={{ fontSize: '2.5rem' }}>Establish Link</h2>
        <p style={{ color: 'var(--color-text-main)', marginBottom: '3rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
          The shadow realm is open. Whether you have a legendary quest, a question about system architecture, or just want to join the guild, I shall answer the call!
        </p>
        
        <a href="mailto:kirankumar2k1@gmail.com" className="shadow-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
          Transmit Signal
        </a>
        
        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <a href="https://github.com/kiranlalk" target="_blank" rel="noopener noreferrer" className="shadow-btn secondary" style={{ padding: '0.8rem 2rem' }}>
            GitHub Stats
          </a>
          <a href="https://linkedin.com/in/kiranlalk" target="_blank" rel="noopener noreferrer" className="shadow-btn secondary" style={{ padding: '0.8rem 2rem' }}>
            LinkedIn Profile
          </a>
        </div>
      </motion.div>
    </section>
  );
}
