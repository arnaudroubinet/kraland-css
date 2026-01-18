// ==UserScript==
// @name         Kraland Theme - Migration (Old Version)
// @namespace    http://www.kraland.org/
// @version      1.0
// @description  [DEPRECATED] Please install the new version. Click to install.
// @match        http://www.kraland.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const NEW_SCRIPT_URL = 'https://github.com/arnaudroubinet/kraland-css/raw/main/kraland-userscript-main.user.js';
  
  // Create a persistent notification
  const notification = document.createElement('div');
  notification.id = 'kraland-migration-banner';
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff6b6b;
    color: white;
    padding: 15px 20px;
    text-align: center;
    z-index: 9999;
    font-weight: bold;
    font-size: 14px;
  `;
  
  notification.innerHTML = `
    ⚠️ <strong>Kraland Theme - Version obsolète</strong> | 
    <a href="${NEW_SCRIPT_URL}" target="_blank" style="color: white; text-decoration: underline;">Cliquez ici pour installer la nouvelle version</a> | 
    Puis désinstallez celle-ci dans Tampermonkey
  `;
  
  // Add banner as soon as DOM is ready
  if (document.body) {
    document.body.prepend(notification);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.prepend(notification);
    });
  }
  
  // Optional: Log message to console
  console.warn('⚠️ Kraland Theme: Vous utilisez une version obsolète. Veuillez installer la nouvelle version depuis: ' + NEW_SCRIPT_URL);
})();
