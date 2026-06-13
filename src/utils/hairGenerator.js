export function generateOrganicHairPaths(startX, startY, endX, endY, numStrands = 7, amplitude = 20, frequency = 0.005) {
  const paths = [];
  const lengthY = Math.abs(endY - startY);
  
  for (let s = 0; s < numStrands; s++) {
    // Deterministic offset based on strand index
    const offsetX = (s - numStrands/2) * 8; 
    const phase = s * (Math.PI / 3);
    const strandFreq = frequency * (1 + (s % 3) * 0.1);
    const strandAmp = amplitude * (1 + (s % 2) * 0.5);
    
    let path = `M ${startX + offsetX} ${startY}`;
    
    for (let i = 0; i <= lengthY; i += 20) {
      const currentY = startY + i;
      const progress = i / lengthY; // 0 to 1
      // Use easing for the horizontal shift: slow at start, faster in middle
      const easeProgress = progress * progress * (3 - 2 * progress); // smoothstep
      const targetBaseX = startX + (endX - startX) * easeProgress;
      
      const waveX = Math.sin((i * strandFreq) + phase) * strandAmp;
      
      path += ` L ${targetBaseX + waveX + (offsetX * (1 - easeProgress))} ${currentY}`;
    }
    paths.push(path);
  }
  return paths;
}
