import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("Navigating to http://localhost:5174 ...");
  await page.goto('http://localhost:5174');
  
  // Wait for loading to finish (cube loader)
  console.log("Waiting for loader to finish (7 seconds)...");
  await page.waitForTimeout(7000);
  
  const getWindows = async () => {
    return await page.evaluate(() => {
      const els = document.querySelectorAll('.system-window');
      return Array.from(els).map(el => {
        const text = el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : '';
        const rect = el.getBoundingClientRect();
        return {
          text,
          opacity: el.style.opacity,
          display: el.style.display,
          transform: el.style.transform,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        };
      });
    });
  };
  
  const initial = await getWindows();
  console.log("INITIAL WINDOWS:", initial);
  
  console.log("Clicking 'Projects' in navbar...");
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('nav-click', { detail: { offset: 0.35 } }));
  });
  
  // Wait for scroll animation
  await page.waitForTimeout(2000);
  
  const afterClick = await getWindows();
  console.log("AFTER CLICK WINDOWS:", afterClick);
  
  await browser.close();
})();
