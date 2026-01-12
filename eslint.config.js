import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        fetch: 'readonly',
        location: 'readonly',
        history: 'readonly',
        navigator: 'readonly',
        MutationObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        Node: 'readonly',
        Event: 'readonly',
        getComputedStyle: 'readonly',
        // Tampermonkey/Greasemonkey globals
        GM_addStyle: 'readonly',
        GM_setValue: 'readonly',
        GM_getValue: 'readonly',
        GM_deleteValue: 'readonly',
        GM_listValues: 'readonly',
        GM_xmlhttpRequest: 'readonly',
        GM_info: 'readonly',
        unsafeWindow: 'readonly',
        // jQuery (si utilisé dans Kraland)
        $: 'readonly',
        jQuery: 'readonly',
        // Bootstrap (si utilisé)
        bootstrap: 'readonly'
      }
    },
    rules: {
      // Qualité du code
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off', // Autorisé pour le debug
      'no-debugger': 'warn',
      
      // Bonnes pratiques
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-with': 'error',
      
      // Style (cohérence)
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'comma-dangle': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      
      // Performance
      'no-loop-func': 'warn',
      'no-caller': 'error',
      
      // Variables
      'no-undef': 'error',
      'no-shadow': 'warn',
      'no-redeclare': 'error'
    }
  },
  {
    files: ['build.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly'
      }
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        require: 'readonly',
        process: 'readonly',
        getComputedStyle: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules/**',
      'kraland-userscript-main.js', // Fichier généré
      'eslint.config.js', // Fichier de config ESLint lui-même
      'screenshots/**',
      'images/**',
      'demos/**',
      'docs/**'
    ]
  }
];
