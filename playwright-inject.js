// Playwright prototype: inject local CSS file and capture before/after screenshots
// Usage: node playwright-inject.js
// Requires: npm i -D playwright

const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://www.kraland.org', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.resolve(__dirname, 'before.png'), fullPage: true });

  // inject theme CSS from disk
  const cssPath = path.resolve(__dirname, 'kraland-theme.css');
  await page.addStyleTag({ path: cssPath });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.resolve(__dirname, 'after.png'), fullPage: true });

  console.log('Screenshots saved: before.png, after.png');
  await browser.close();
})();