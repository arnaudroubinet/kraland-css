// Build script - combines CSS into JS and updates userscript version
const fs = require('fs');
const path = require('path');

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
console.log(`✓ Read template`);

// Replace placeholder
const output = template.replace('__CSS_CONTENT__', css.replace(/`/g, '\\`').replace(/\$/g, '\\$'));

// Write output
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✓ Written to ${outputPath}`);

// Update userscript version with timestamp
const timestamp = Date.now();
const version = `1.0.${timestamp}`;
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
