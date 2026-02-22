// Build script - combines CSS into JS and updates userscript version
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
// import { minify } from 'terser';
// import { minify as minifyCSS } from 'csso';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.join(__dirname, 'kraland-theme.css');
const templatePath = path.join(__dirname, 'kraland-userscript-template.js');
const outputPath = path.join(__dirname, 'kraland-userscript-main.user.js');
const userscriptPath = path.join(__dirname, 'kraland-userscript.user.js');
const versionJsonPath = path.join(__dirname, 'version.json');

console.log('Building kraland-userscript-main.user.js...');

// Get current git branch
let currentBranch = 'main';
try {
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { 
    cwd: __dirname,
    encoding: 'utf-8'
  }).trim();
  console.log(`✓ Current git branch: ${currentBranch}`);
} catch (e) {
  console.warn('⚠ Could not determine git branch, using default: main');
}

// Determine CSS_URL based on git branch
let cssUrl;
let changelogUrl;
if (currentBranch === 'main') {
  cssUrl = 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/main/kraland-theme.css';
  changelogUrl = 'https://raw.githubusercontent.com/arnaudroubinet/kraland-css/main/changelog.json';
} else {
  // For development branches, use localhost
  cssUrl = 'http://localhost:4848/workspace/kraland-css/kraland-theme.css';
  changelogUrl = 'http://localhost:4848/workspace/kraland-css/changelog.json';
}
console.log(`✓ CSS URL: ${cssUrl}`);
console.log(`✓ Changelog URL: ${changelogUrl}`);
let css = fs.readFileSync(cssPath, 'utf8');
console.log(`✓ Read CSS (${css.length} chars)`);

// Minify CSS - DISABLED
console.log('⚙ Skipping CSS minification (disabled for debugging)...');
// const minifiedCSS = minifyCSS(css);
// css = minifiedCSS.css;
console.log(`✓ CSS not minified (${css.length} chars)`);

// Read template
const template = fs.readFileSync(templatePath, 'utf8');
console.log('✓ Read template');
// Prepare timestamped version header to include in generated file
const timestamp = Date.now();
const version = `1.0.${timestamp}`;

// Prepend a userscript metadata header to the generated file so it is
// self-contained when installed directly. The timestamp is embedded in
// the `@version` field to help with cache-busting/release tracking.
// Compatible with Tampermonkey and Violentmonkey
const userscriptHeader = `// ==UserScript==\n// @name         Kraland Theme (Bundled)\n// @namespace    http://www.kraland.org/\n// @version      ${version}\n// @description  Injects the Kraland CSS theme (bundled) - Works with Tampermonkey & Violentmonkey\n// @match        http://www.kraland.org/*\n// @run-at       document-start\n// @grant        none\n// @grant        GM.xmlHttpRequest\n// @connect      raw.githubusercontent.com\n// @compatible   chrome tampermonkey\n// @compatible   firefox tampermonkey\n// @compatible   edge tampermonkey\n// @compatible   firefox violentmonkey\n// @compatible   chrome violentmonkey\n// ==/UserScript==\n\n`;

// Anti-FOUC: tiny self-contained script injected BEFORE the main IIFE.
// Uses opacity:0 instead of visibility:hidden because visibility can be
// overridden by child elements with explicit visibility:visible.
// Inline style on <html> is the fastest way to hide — no extra DOM element.
const cloakScript = `// Anti-FOUC cloak
if(localStorage.getItem('kr-theme-enabled')==='true'){
  document.documentElement.style.setProperty('opacity','0','important');
}
`;

// Replace placeholder and prepend header
// Escape backticks and $ in CSS for template literal, then replace the placeholder
const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
let output = userscriptHeader + cloakScript + template.replace("'__CSS_CONTENT__'", '`' + escapedCss + '`');

// Replace version and URLs placeholders in the template
output = output.replace('__USERSCRIPT_VERSION__', version);
output = output.replace("'https://raw.githubusercontent.com/YOUR_USERNAME/kraland-css/main/changelog.json'", `'${changelogUrl}'`);

// Minify JavaScript - DISABLED
console.log('⚙ Skipping JavaScript minification (disabled for debugging)...');
const jsCode = output.substring(userscriptHeader.length);
console.log(`✓ JavaScript not minified (${jsCode.length} chars)`);

// Write output
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✓ Written to ${outputPath}`);

// Update userscript version with timestamp in the distributable .user.js
const userscript = fs.readFileSync(userscriptPath, 'utf8');
const updatedUserscript = userscript.replace(
  /@version\s+[\d.]+/,
  `@version      ${version}`
).replace(
  /kraland-userscript-main\.user\.js\?v=\d+/,
  `kraland-userscript-main.user.js?v=${timestamp}`
);
fs.writeFileSync(userscriptPath, updatedUserscript, 'utf8');
console.log(`✓ Updated userscript version to ${version}`);

// Generate version.json
const versionJson = {
  version: version,
  timestamp: timestamp,
  buildDate: new Date().toISOString()
};
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2), 'utf8');
console.log(`✓ Generated version.json with version ${version}`);

console.log('Build complete!');
