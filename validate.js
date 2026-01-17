// Validate userscript compatibility using official tools
// Uses: userscript-meta (official metadata parser) and eslint
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'userscript-meta';
const { parse: parseScriptMetadata } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserscriptValidator {
  constructor(filePath) {
    this.filePath = filePath;
    this.content = fs.readFileSync(filePath, 'utf8');
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate userscript metadata using official userscript-meta parser
   */
  validateMetadata() {
    try {
      // Extract only the userscript header before the main code
      const headerMatch = this.content.match(/\/\/ ==UserScript==\n([\s\S]*?)\/\/ ==\/UserScript==/);
      if (!headerMatch) {
        this.errors.push('Invalid userscript header format');
        return null;
      }

      // Reconstruct minimal userscript for parsing
      const headerOnly = `// ==UserScript==\n${headerMatch[1]}// ==\/UserScript==\n`;
      const metadata = parseScriptMetadata(headerOnly);
      
      // Check required fields
      const required = ['name', 'namespace', 'version', 'match', 'grant'];
      required.forEach((field) => {
        if (!metadata[field] || (Array.isArray(metadata[field]) && metadata[field].length === 0)) {
          this.errors.push(`Missing required metadata: @${field}`);
        }
      });

      // Validate @run-at
      if (!metadata['run-at'] || (Array.isArray(metadata['run-at']) && metadata['run-at'].length === 0)) {
        this.warnings.push('Missing @run-at directive. Defaulting to document-idle');
      } else {
        const validRunAt = ['document-start', 'document-body', 'document-end', 'document-idle'];
        const runAt = Array.isArray(metadata['run-at']) ? metadata['run-at'][0] : metadata['run-at'];
        if (!validRunAt.includes(runAt)) {
          this.errors.push(`Invalid @run-at value: ${runAt}`);
        }
      }

      // Check for compatibility declarations
      if (!metadata['compatible'] || (Array.isArray(metadata['compatible']) && metadata['compatible'].length === 0)) {
        this.warnings.push('No @compatible directives. Consider adding them for better compatibility.');
      }

      // Check for deprecated GM_ API
      const deprecatedGMApi = this.content.match(/\bGM_\w+\(/g);
      if (deprecatedGMApi) {
        const uniqueApi = [...new Set(deprecatedGMApi)];
        this.errors.push(`Found deprecated GM_ API: ${uniqueApi.join(', ')}. Use GM.* instead.`);
      }

      // Check for @connect when using fetch/GM.xmlHttpRequest
      if ((this.content.includes('fetch(') || this.content.includes('GM.xmlHttpRequest')) &&
          (!metadata['connect'] || (Array.isArray(metadata['connect']) && metadata['connect'].length === 0))) {
        this.warnings.push('Script makes network requests but has no @connect directives.');
      }

      return metadata;
    } catch (e) {
      this.errors.push(`Failed to parse metadata: ${e.message}`);
      return null;
    }
  }

  /**
   * Check basic script structure
   */
  validateStructure() {
    // Check IIFE wrapper
    if (!this.content.includes('(function')) {
      this.warnings.push('Script should be wrapped in an IIFE (Immediately Invoked Function Expression)');
    }

    // Check use strict
    if (!this.content.includes("'use strict'")) {
      this.warnings.push('Script should include "use strict" for better error handling');
    }
  }

  /**
   * Run all validations
   */
  validate() {
    const metadata = this.validateMetadata();
    this.validateStructure();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      metadata: metadata,
    };
  }

  /**
   * Print results with color formatting
   */
  printResults(results) {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
    };

    console.log('\n' + colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.cyan + '       USERSCRIPT COMPATIBILITY VALIDATION (Official Tools)' + colors.reset);
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset + '\n');

    if (results.metadata) {
      console.log('Metadata:');
      const getMetaValue = (val) => {
        if (Array.isArray(val)) return val[0];
        return val;
      };
      console.log(`  Name:    ${getMetaValue(results.metadata.name) || 'N/A'}`);
      console.log(`  Version: ${getMetaValue(results.metadata.version) || 'N/A'}`);
      const matches = results.metadata.match;
      const matchCount = Array.isArray(matches) ? matches.length : (matches ? 1 : 0);
      console.log(`  Matches: ${matchCount} pattern(s)`);
      const grants = results.metadata.grant;
      const grantList = Array.isArray(grants) ? grants.join(', ') : (grants || 'none');
      console.log(`  Grants:  ${grantList}\n`);
    }

    if (results.errors.length > 0) {
      console.log(colors.red + `✗ ERRORS (${results.errors.length}):` + colors.reset);
      results.errors.forEach((e) => console.log(`  ✗ ${e}`));
      console.log();
    }

    if (results.warnings.length > 0) {
      console.log(colors.yellow + `⚠ WARNINGS (${results.warnings.length}):` + colors.reset);
      results.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
      console.log();
    }

    console.log(colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset);
    if (results.isValid) {
      console.log(colors.green + '✓ VALIDATION PASSED' + colors.reset);
    } else {
      console.log(colors.red + '✗ VALIDATION FAILED' + colors.reset);
    }
    console.log(colors.cyan + '═══════════════════════════════════════════════════════════════' + colors.reset + '\n');

    return results.isValid ? 0 : 1;
  }
}

// Main
const targetFile = process.argv[2] || path.join(__dirname, 'kraland-userscript-main.user.js');

if (!fs.existsSync(targetFile)) {
  console.error(`✗ File not found: ${targetFile}`);
  process.exit(1);
}

const validator = new UserscriptValidator(targetFile);
const results = validator.validate();
const exitCode = validator.printResults(results);

process.exit(exitCode);
