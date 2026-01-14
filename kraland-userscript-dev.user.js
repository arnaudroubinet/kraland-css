// ==UserScript==
// @name         Kraland Theme - Dev Mode (Hot Reload)
// @namespace    http://www.kraland.org/dev/
// @version      1.0.dev
// @description  Charge dynamiquement le CSS et le JS depuis le serveur local pour le développement
// @match        http://www.kraland.org/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function (){
  'use strict';

  // Configuration du serveur de dev
  const DEV_SERVER = 'http://localhost:4848';
  const CSS_URL = `${DEV_SERVER}/kraland-theme.css`;
  const JS_URL = `${DEV_SERVER}/kraland-userscript-template.js`;

  // Clés de cache pour éviter les rechargements inutiles
  const CACHE_KEY_CSS = 'kr_dev_css_hash';
  const CACHE_KEY_JS = 'kr_dev_js_hash';
  const CACHE_KEY_CSS_CONTENT = 'kr_dev_css_content'; // Cache CSS content for instant injection

  // Intervalle de vérification (en ms)
  const CHECK_INTERVAL = 2000;

  // État du système
  let cssHash = '';
  let jsHash = '';
  let scriptLoaded = false;

  // ============================================
  // ANTI-FOUC: Hide page immediately if theme is enabled
  // This prevents the flash of unstyled content
  // ============================================
  (function antiFOUC(){
    try{
      const enabled = localStorage.getItem('kr-theme-enabled');
      if(enabled !== 'true') {return;} // Theme disabled, show page normally

      // Hide page immediately to prevent FOUC
      const hideStyle = document.createElement('style');
      hideStyle.id = 'kr-anti-fouc';
      hideStyle.textContent = 'html.kr-loading { visibility: hidden !important; }';
      (document.head || document.documentElement).appendChild(hideStyle);
      document.documentElement.classList.add('kr-loading');
    } catch (_e) { /* Ignore errors during FOUC prevention */ }
  })();

  // ============================================
  // IMMEDIATE CSS INJECTION (before any async code)
  // Use cached CSS from localStorage to prevent FOUC
  // ============================================
  (function injectCachedCSSImmediately(){
    try{
      const enabled = localStorage.getItem('kr-theme-enabled');
      if(enabled !== 'true') {return;} // Theme disabled

      const cachedCSS = localStorage.getItem(CACHE_KEY_CSS_CONTENT);
      if(!cachedCSS) {
        // No cache yet - reveal page anyway to avoid blank screen
        document.documentElement.classList.remove('kr-loading');
        return;
      }

      // Inject cached CSS immediately
      const st = document.createElement('style');
      st.id = 'kraland-theme-style';
      st.textContent = cachedCSS;

      const target = document.head || document.documentElement;
      if(target) {target.appendChild(st);}

      // Add variant class immediately
      const variant = localStorage.getItem('kr-theme-variant') || 'kraland';
      document.documentElement.classList.add('kr-theme-enabled');
      document.documentElement.classList.add('kr-theme-variant-' + variant);
      if(variant === 'high-contrast'){
        document.documentElement.classList.add('kr-theme-high-contrast');
      }

      // CSS is ready - reveal page
      document.documentElement.classList.remove('kr-loading');
    } catch (_e) {
      // On error, reveal page
      document.documentElement.classList.remove('kr-loading');
    }
  })();

  // Calcule un hash simple pour détecter les changements
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  // Charge et applique le CSS
  async function loadCSS() {
    return new Promise((resolve) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: CSS_URL,
          onload: function (response) {
            if (response.status !== 200) {
              console.warn('[Kraland Dev] Serveur de dev non disponible sur', CSS_URL);
              resolve(false);
              return;
            }

            const css = response.responseText;
            const newHash = simpleHash(css);

            // Ne recharge que si le contenu a changé
            if (newHash !== cssHash) {
              cssHash = newHash;
              localStorage.setItem(CACHE_KEY_CSS, newHash);
              // Cache CSS content for immediate injection on next page load
              localStorage.setItem(CACHE_KEY_CSS_CONTENT, css);

              let style = document.getElementById('kraland-theme-style');
              if (!style) {
                style = document.createElement('style');
                style.id = 'kraland-theme-style';
                document.head.appendChild(style);
              }
              style.textContent = css;

              console.log('[Kraland Dev] CSS rechargé (' + css.length + ' chars, hash: ' + newHash + ')');
              resolve(true);
            } else {
              resolve(false);
            }
          },
          onerror: function (error) {
            console.error('[Kraland Dev] Erreur lors du chargement du CSS:', error);
            resolve(false);
          }
        });
      } catch (error) {
        console.error('[Kraland Dev] Erreur lors du chargement du CSS:', error);
        resolve(false);
      }
    });
  }

  // Charge et exécute le JS
  async function loadJS() {
    return new Promise((resolve) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url: JS_URL,
          onload: function (response) {
            if (response.status !== 200) {
              console.warn('[Kraland Dev] Script non disponible sur', JS_URL);
              resolve(false);
              return;
            }

            let js = response.responseText;
            const newHash = simpleHash(js);

            // Pour le rechargement du JS, on doit recharger la page car on ne peut pas "décharger" le code
            if (scriptLoaded && newHash !== jsHash) {
              console.log('[Kraland Dev] JS modifié détecté - rechargement de la page nécessaire');
              localStorage.setItem(CACHE_KEY_JS, newHash);
              // Attendre un peu pour permettre au CSS de se charger d'abord
              setTimeout(() => {
                location.reload();
              }, 500);
              resolve(true);
              return;
            }

            if (!scriptLoaded) {
              jsHash = newHash;
              localStorage.setItem(CACHE_KEY_JS, newHash);

              // Remplace le placeholder CSS par une chaîne vide car on charge le CSS séparément
              js = js.replace('__CSS_CONTENT__', '/* CSS chargé séparément en mode dev */');

              // Crée un script inline pour exécuter le code
              const script = document.createElement('script');
              script.textContent = js;
              (document.head || document.documentElement).appendChild(script);

              scriptLoaded = true;
              console.log('[Kraland Dev] JS chargé (' + js.length + ' chars, hash: ' + newHash + ')');
              resolve(true);
            } else {
              resolve(false);
            }
          },
          onerror: function (error) {
            console.error('[Kraland Dev] Erreur lors du chargement du JS:', error);
            resolve(false);
          }
        });
      } catch (error) {
        console.error('[Kraland Dev] Erreur lors du chargement du JS:', error);
        resolve(false);
      }
    });
  }

  // Initialisation au chargement de la page
  async function init() {
    console.log('[Kraland Dev] Mode développement activé');
    console.log('[Kraland Dev] Serveur de dev:', DEV_SERVER);

    // Charge le JS en premier (document-start)
    await loadJS();

    // Charge le CSS
    await loadCSS();

    // Attend que le DOM soit prêt pour démarrer le watch
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startWatch);
    } else {
      startWatch();
    }
  }

  // Démarre la surveillance des changements
  function startWatch() {
    console.log('[Kraland Dev] Surveillance des changements activée (intervalle: ' + CHECK_INTERVAL + 'ms)');

    setInterval(async () => {
      // Vérifie le CSS en continu pour hot-reload
      await loadCSS();

      // Vérifie le JS (déclenchera un rechargement si modifié)
      await loadJS();
    }, CHECK_INTERVAL);
  }

  // Affiche des infos de débogage
  console.log('[Kraland Dev] Userscript de développement chargé');
  console.log('[Kraland Dev] CSS URL:', CSS_URL);
  console.log('[Kraland Dev] JS URL:', JS_URL);

  // Lance l'initialisation
  init();
})();
