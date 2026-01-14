// Build script - combines CSS into JS and updates userscript version
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.join(__dirname, 'kraland-theme.css');
const templatePath = path.join(__dirname, 'kraland-userscript-template.js');
const outputPath = path.join(__dirname, 'kraland-userscript-main.js');
const userscriptPath = path.join(__dirname, 'kraland-userscript.user.js');

console.log('Building kraland-userscript-main.js...');

// Read CSS
const css = fs.readFileSync(cssPath, 'utf8');
console.log(`✓ Read CSS (${css.length} chars)`);

// Read template
const template = fs.readFileSync(templatePath, 'utf8');
console.log('✓ Read template');
// Prepare timestamped version header to include in generated file
const timestamp = Date.now();
const version = `1.0.${timestamp}`;

// Prepend a userscript metadata header to the generated file so it is
// self-contained when installed directly. The timestamp is embedded in
// the `@version` field to help with cache-busting/release tracking.
const userscriptHeader = `// ==UserScript==\n// @name         Kraland Theme (Bundled)\n// @namespace    https://www.kraland.org/\n// @version      ${version}\n// @description  Injects the Kraland CSS theme (bundled)\n// @match        http://www.kraland.org/*\n// @match        https://www.kraland.org/*\n// @run-at       document-start\n// @grant        none\n// ==/UserScript==\n\n`;

// Replace placeholder and prepend header
// Escape backticks and $ in CSS for template literal, then replace the placeholder
const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
const output = userscriptHeader + template.replace("'__CSS_CONTENT__'", '`' + escapedCss + '`');

// Write output
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✓ Written to ${outputPath}`);

// Update userscript version with timestamp in the distributable .user.js
const userscript = fs.readFileSync(userscriptPath, 'utf8');
const updatedUserscript = userscript.replace(
  /@version\s+[\d.]+/,
  `@version      ${version}`
).replace(
  /kraland-userscript-main\.js\?v=\d+/,
  `kraland-userscript-main.js?v=${timestamp}`
);
fs.writeFileSync(userscriptPath, updatedUserscript, 'utf8');
console.log(`✓ Updated userscript version to ${version}`);

console.log('Build complete!');
