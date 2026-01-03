// ==UserScript==
// @name         Kraland Theme (Bundled)
// @namespace    https://www.kraland.org/
// @version      1.0.1767483913268
// @description  Injects the Kraland CSS theme (bundled)
// @match        http://www.kraland.org/*
// @match        https://www.kraland.org/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Main script code - CSS bundled inline
(function(){
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================
  const CONFIG = {
    BUNDLED_CSS: `/* ============================================================================
   1. CSS VARIABLES
   ============================================================================ */

:root {
  --kr-primary: #8b0f0e;
  --kr-primary-dark: #700b09;
  --kr-gold: #C69100;
  --kr-highlight: #c41e3a;
  --kr-highlight-reverse: #f9d9de;
  --kr-surface: #fff;
  --kr-text: #0f1724;
  --kr-muted: #6b7280;
  --kr-navbar-bg: #111315;

  --kr-radius: .5rem;
  --kr-avatar-size: 120px;
}


/* ============================================================================
   Theme variants available via Tampermonkey UI
   Each variant sets a small set of CSS variables used throughout the theme
   ============================================================================ */

html.kr-theme-variant-empire-brun {
  --kr-primary: #5E3B2D;
  --kr-highlight: #C69100;
}

html.kr-theme-variant-paladium {
  --kr-primary: #D4AF37; 
  --kr-highlight: #044c17; 
}

html.kr-theme-variant-theocratie-seelienne {
  --kr-primary: #0033A0;
  --kr-highlight: #2d5fcb;
}

html.kr-theme-variant-paradigme-vert {
  --kr-primary: #0B6623;
  --kr-highlight: #063803;
}

html.kr-theme-variant-khanat-elmerien {
  --kr-primary: #6A0DAD;
  --kr-highlight: #7b4c9c;
}

html.kr-theme-variant-confederation-libre {
  --kr-primary: #6B7280;
  --kr-highlight: #475369;
}

html.kr-theme-variant-royaume-ruthvenie {
  --kr-primary: #0A6B2D;
  --kr-highlight: #C41E3A; 
}


/* ============================================================================
   2. LAYOUT OVERRIDES
   ============================================================================ */

/* Hide top header with Kraland logo */
#top {
  display: none !important;
}


html {
  height: 100%;
  min-height: 100%;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: 70px; 
}

/* Increase container width: remove 150px from each side */
.container {
  max-width: 1608px !important;
  width: 1608px !important;
}

/* Show skills panel (no longer collapsed by default) */
#skills-panel {
  display: block !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  border-radius: 5px !important;
  background-color: #fff !important;
}


/* ============================================================================
   3. NAVIGATION
   ============================================================================ */

.navbar-nav > li > a{
  color: #fff !important;
}


/* ============================================================================
   4. FORMS
   ============================================================================ */

.form-control.form-control {
  border-radius: .4rem;
  border: 1px solid rgba(0,0,0,0.08);
  padding: .6rem .8rem;
  font-size: .95rem;
}

.form-control:focus {
  box-shadow: 0 0 0 .18rem rgba(164,18,13,0.22);
  border-color: var(--kr-primary);
  outline: none;
}

.form-group label {
  color: var(--kr-text);
  font-weight: 600;
}

input[type="checkbox"],
input[type="radio"] {
  accent-color: var(--kr-primary) !important;
}

input[type="checkbox"]:focus,
input[type="radio"]:focus {
  outline: none;
  box-shadow: 0 0 0 .12rem rgba(164,18,13,0.18) !important;
}

input[type="checkbox"]:checked {
  border-color: var(--kr-primary) !important;
}

/* ============================================================================
   5. BADGES, LABELS & ALERTS
   Consolidated color remapping for theme
   ============================================================================ */

/* Badges & labels - info/primary variants use red */
.label,
.badge {
  background-color: var(--kr-primary);
  color: #fff;
  border-color: var(--kr-primary-dark);
}
.bg-info {
  background-color: var(--kr-primary);
  color: #fff;
}

/* Alerts - info variant */
.alert.alert-info {
  background-color: rgba(164,18,13,0.06);
  border-color: rgba(164,18,13,0.14);
  color: var(--kr-text);
}

.alert strong,
.alert p {
  color: var(--kr-text);
}


/* ============================================================================
   6. LIST GROUPS
   ============================================================================ */

.list-group-item {
  border: none;
  padding: .6rem .75rem;
}

.list-group-item.btn {
  border: none !important;
}

.list-group-item.active,
.list-group-item.active:focus,
.list-group-item.active:hover,
.list-group-item.active a {
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  color: var(--kr-surface) !important;
}

/* Keep hover for non-active items subtle and themed */
.list-group-item:hover {
  color: var(--kr-primary-dark);
  background-color: rgba(0,0,0,0.02);
}

/* ============================================================================
   7. AVATARS
   Ensure avatars are displayed at least the configured size and crop nicely
   ============================================================================ */
.img-circle {
  width: var(--kr-avatar-size);
  height: var(--kr-avatar-size);
  min-width: var(--kr-avatar-size);
  min-height: var(--kr-avatar-size);
  object-fit: cover;
  display: inline-block;
  border-radius: 50%;
}


/* Ensure layout doesn't break: allow the author column to accommodate larger avatars */
.col-md-3.sidebar .avatar,
.col-md-2.sidebar .avatar {
  margin-bottom: 0.5rem;
}

/* Align list-group user items with their avatar to prevent overflow */
.list-group a.list-group-item.ds_user,
.list-group-item.ds_user {
  position: relative;
  min-height: var(--kr-avatar-size) !important;
  padding-right: calc(var(--kr-avatar-size) + 1rem) !important;
  display: flex !important;
  align-items: center !important;
}

.list-group-item.ds_user .pull-right {
  position: absolute !important;
  right: .75rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}



/* ============================================================================
   8. CAROUSEL
   ============================================================================ */

.carousel-caption {
  background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35));
  padding: 1.4rem;
  padding-bottom: 56px;
  border-radius: .6rem;
  color: #fff;
}

.item img[class*="-slide"] {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}
a.carousel-control.left,
a.carousel-control.right{
   background-image: none;
}


/* ============================================================================
   9. LINKS
   ============================================================================ */

/*
  Pagination est utilisé dans les rapports
*/
.pagination > li.active > a{
  color: var(--kr-surface);
  background-color: var(--kr-primary-dark);
  border-color: var(--kr-primary-dark);
}
.pagination > li > a{
  color: var(--kr-primary);
}

.pagination > li.active > a:hover{
  color: var(--kr-surface);
  background-color: var(--kr-primary);
  border-color: var(--kr-primary);
}
.pagination > li > a:hover{
  color: var(--kr-primary);
}

/*
  .bg-primary est utilisé dans les rapports
*/
.bg-primary {
  background-color: var(--kr-primary) !important;
  color: var(--kr-surface) !important;
}

a:link,
a:visited {
  color: var(--kr-highlight);
  text-decoration: none;
  transition: color .12s ease, opacity .12s ease;
}

a:hover,
a:focus {
  color: var(--kr-primary-dark);
  text-decoration: underline;
  outline: none;
}

button.btn-primary,
a.btn-primary {
  background-color: var(--kr-primary);
  border-color: var(--kr-primary-dark);
  color: var(--kr-highlight-reverse);
  box-shadow: 0 6px 18px rgba(165,18,13,0.12);
}

button.btn-primary:hover,
button.btn-primary:focus,
a.btn-primary:hover,
a.btn-primary:focus {
  background-color: var(--kr-primary-dark);
}

/* ============================================================================
   HIDE UNWANTED HR ELEMENT
   Supprime la ligne horizontale bleue dans le liste des ordres de la fiche de personnage
   ============================================================================ */

hr[style*="border-top: 1px solid #337ab7"] {
  display: none !important;
}

/* ============================================================================
   10. FOOTER - BACK TO TOP
   Position the back-to-top button on the right side of the footer
   ============================================================================ */

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1030;
}

footer .container.white {
  position: relative;
}

.container.white .kraland-back-to-top {
  position: absolute;
  right: -5%;
  top: 50%;
  transform: translateY(-50%);
}

/* ============================================================================
   11. EDITEUR DE TEXTE
   Styles pour les boutons de l'éditeur BBCode
   ============================================================================ */

/* Style de base pour tous les boutons de l'éditeur, sauf la palette de couleurs */
.btn-toolbar .btn:not(.dropdown-menu *) {
  background-color: var(--kr-surface) !important;
  background-image: none !important;
  color: var(--kr-primary) !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-shadow: none !important;
}

.btn-toolbar .btn:not(.dropdown-menu *) i,
.btn-toolbar .btn:not(.dropdown-menu *) .fa,
.btn-toolbar .btn:not(.dropdown-menu *) .fas,
.btn-toolbar .btn:not(.dropdown-menu *) .far {
  color: inherit !important;
}`,
    ENABLE_KEY: 'kr-theme-enabled',
    VARIANT_KEY: 'kr-theme-variant',
    STYLE_ID: 'kraland-theme-style',
    THEME_VARIANTS: ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','high-contrast'],
    LOGO_MAP: {
      'kraland': 1, 'empire-brun': 2, 'paladium': 3, 'theocratie-seelienne': 4,
      'paradigme-vert': 5, 'khanat-elmerien': 6, 'confederation-libre': 7, 'royaume-ruthvenie': 8
    },
    SKILL_ICONS: {
      'Baratin': '9401', 'Combat Mains Nues': '9402', 'Combat Contact': '9403',
      'Combat Distance': '9404', 'Commerce': '9405', 'Démolition': '9406',
      'Discrétion': '9407', 'Éloquence': '9408', 'Falsification': '9409',
      'Foi': '9410', 'Informatique': '9411', 'Médecine': '9412',
      'Observation': '9413', 'Organisation': '9414', 'Pouvoir': '9415',
      'Séduction': '9416', 'Survie': '9417', 'Vol': '9418'
    },
    STAT_ICONS: {
      'FOR': '9402', 'VOL': '9415', 'CHA': '9416',
      'INT': '9412', 'GES': '9405', 'PER': '9413'
    }
  };

  // ============================================================================
  // UTILITAIRES
  // ============================================================================
  
  /** Exécute une fonction en silence (catch les erreurs) */
  function safeCall(fn) {
    try { fn(); } catch(e) { /* ignore */ }
  }

  /** Vérifie si le thème est activé */
  function isThemeEnabled() {
    return localStorage.getItem(CONFIG.ENABLE_KEY) === 'true';
  }

  /** Récupère la variante de thème actuelle */
  function getVariant() {
    return localStorage.getItem(CONFIG.VARIANT_KEY) || 'kraland';
  }

  /** Vérifie si on est sur la page /jouer */
  function isPlatoPage() {
    const path = location?.pathname || '';
    return path.indexOf('/jouer') === 0 && 
           path !== '/jouer/communaute' && 
           path !== '/jouer/communaute/membres';
  }

  /** Crée un badge numérique pour les icônes */
  function createBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = text;
    Object.assign(badge.style, {
      position: 'absolute', bottom: '-5px', right: '-5px',
      backgroundColor: '#d9534f', color: '#fff',
      borderRadius: '50%', width: '19px', height: '19px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: 'bold', border: '2px solid #fff'
    });
    return badge;
  }

  /** Crée un conteneur d'icône avec badge */
  function createIconContainer(iconUrl, altText, badgeText) {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'relative', display: 'inline-block',
      width: '32px', height: '32px'
    });

    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = altText;
    img.title = altText;
    Object.assign(img.style, { width: '32px', height: '32px', display: 'block' });
    container.appendChild(img);

    container.appendChild(createBadge(badgeText));
    return container;
  }

  // ============================================================================
  // INJECTION CSS IMMÉDIATE (avant tout code async)
  // ============================================================================
  (function injectCSSImmediately(){
    try {
      if (!isThemeEnabled()) return;
      
      const st = document.createElement('style');
      st.id = CONFIG.STYLE_ID;
      st.textContent = CONFIG.BUNDLED_CSS;
      (document.head || document.documentElement).appendChild(st);
      
      const variant = getVariant();
      document.documentElement.classList.add('kr-theme-enabled', 'kr-theme-variant-' + variant);
      if (variant === 'high-contrast') {
        document.documentElement.classList.add('kr-theme-high-contrast');
      }
    } catch(e) { console.error('CSS injection failed', e); }
  })();

  // ============================================================================
  // GESTION DU THÈME
  // ============================================================================
  
  async function applyThemeInline(cssText) {
    if (!isThemeEnabled()) return false;

    try {
      let st = document.getElementById(CONFIG.STYLE_ID);
      if (st) {
        st.textContent = cssText;
      } else {
        st = document.createElement('style');
        st.id = CONFIG.STYLE_ID;
        st.textContent = cssText;
        document.head.appendChild(st);
      }

      document.documentElement.classList.add('kr-theme-enabled');
      const variant = getVariant();
      
      // High contrast
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');
      
      // Variant classes
      CONFIG.THEME_VARIANTS.forEach(v => 
        document.documentElement.classList.remove('kr-theme-variant-' + v)
      );
      if (variant && variant !== 'disable') {
        document.documentElement.classList.add('kr-theme-variant-' + variant);
      }

      // Page members
      const isMembers = location?.pathname?.indexOf('/communaute/membres') === 0;
      document.documentElement.classList.toggle('kr-page-members', isMembers);

      return true;
    } catch(e) { 
      console.error('Theme apply failed', e); 
      return false; 
    }
  }

  async function ensureTheme() {
    if (!isThemeEnabled()) return;
    await applyThemeInline(CONFIG.BUNDLED_CSS);
  }

  function applyThemeVariant(variant, skipReload = false) {
    try {
      if (!variant || variant === 'disable') {
        localStorage.setItem(CONFIG.ENABLE_KEY, 'false');
        if (!skipReload) location.reload();
        return;
      }

      const wasDisabled = !isThemeEnabled();
      localStorage.setItem(CONFIG.ENABLE_KEY, 'true');
      localStorage.setItem(CONFIG.VARIANT_KEY, variant);

      if (wasDisabled && !skipReload) {
        location.reload();
        return;
      }

      // Switch variant sans reload
      CONFIG.THEME_VARIANTS.forEach(v => 
        document.documentElement.classList.remove('kr-theme-variant-' + v)
      );
      document.documentElement.classList.add('kr-theme-variant-' + variant);
      document.documentElement.classList.add('kr-theme-enabled');

      safeCall(() => applyThemeInline(CONFIG.BUNDLED_CSS));
      safeCall(() => replaceNavbarBrand());
    } catch(e) { console.error('applyThemeVariant error', e); }
  }

  function getThemeState() {
    if (localStorage.getItem(CONFIG.ENABLE_KEY) === null) {
      localStorage.setItem(CONFIG.ENABLE_KEY, 'false');
    }
    return isThemeEnabled();
  }

  // ============================================================================
  // TRANSFORMATIONS DOM
  // ============================================================================

  function applyDOMTransformations() {
    if (!isThemeEnabled()) return;

    const transforms = [
      markActiveIcons, replaceMcAnchors, replaceSImages, replaceNavbarBrand,
      reorderBtnGroupXs, ensureSexStrong, ensureFooterSticky, relocateKramailToLeft,
      restructurePlatoColumns, moveBtnGroupToCols, moveSkillsPanelToCols,
      transformToBootstrapGrid, nameLeftSidebarDivs, transformSkillsToIcons,
      transformStatsToNotifications, ensureEditorClasses, ensurePageScoping,
      ensurePlayerMainPanelRows, disableTooltips
    ];

    transforms.forEach(fn => safeCall(fn));
  }

  function disableTooltips() {
    document.querySelectorAll('[data-toggle="tooltip"]').forEach(el => {
      el.removeAttribute('data-toggle');
      el.removeAttribute('data-placement');
      el.removeAttribute('title');
      el.removeAttribute('data-original-title');
    });
    if (window.$ && window.$.fn && window.$.fn.tooltip) {
      window.$.fn.tooltip = function() { return this; };
    }
  }

  function markActiveIcons() {
    const markers = [
      { text: 'Membres actifs', cls: 'kr-icon-members' },
      { text: 'Personnages actifs', cls: 'kr-icon-characters' },
      { text: 'Personnes en ligne', cls: 'kr-icon-online' },
      { text: 'Présentation', cls: 'kr-icon-presentation' },
      { text: 'Médailles', cls: 'kr-icon-medals' }
    ];

    markers.forEach(m => 
      document.querySelectorAll('.' + m.cls).forEach(n => n.classList.remove(m.cls))
    );

    const all = Array.from(document.querySelectorAll('*'));
    markers.forEach(m => {
      let best = null;
      for (const el of all) {
        const txt = (el.textContent || '').trim();
        if (!txt.includes(m.text)) continue;
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        const score = (hasIcon ? 100 : 0) + Math.max(0, 200 - Math.min(txt.length, 200));
        if (!best || score > best.score) best = { el, score };
      }
      if (best?.el) best.el.classList.add(m.cls);
    });
  }

  function replaceMcAnchors() {
    Array.from(document.querySelectorAll('a'))
      .filter(a => (a.textContent || '').trim() === 'MC')
      .forEach(a => {
        a.classList.add('kr-mc-icon');
        const title = a.getAttribute('data-original-title') || a.getAttribute('title') || 
                      (a.classList.contains('open') ? 'ouvrir le mini-chat' : 'fermer le mini-chat');
        if (title) a.setAttribute('aria-label', title);
        a.removeAttribute('aria-hidden');
      });
  }

  function replaceNavbarBrand() {
    const brand = document.querySelector('.navbar-brand');
    if (!brand) return;

    const variant = getVariant();
    const idx = CONFIG.LOGO_MAP[variant] || 1;
    const url = `http://img7.kraland.org/2/world/logo${idx}.gif`;
    
    const existing = brand.querySelector('img.kr-logo');
    if (existing?.src?.includes(`logo${idx}.gif`)) return;

    brand.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'kr-logo';
    img.src = url;
    img.alt = 'Kraland';
    img.style.height = '28px';
    img.style.verticalAlign = 'middle';
    brand.appendChild(img);
  }

  function replaceSImages() {
    const map = { 's1.gif': '♂', 's2.gif': '♀', 's3.gif': '⚧' };
    const imgs = Array.from(document.querySelectorAll('img'))
      .filter(i => /img7\.kraland\.org\/.+\/(s[123]\.gif)$/.test(i.src));

    imgs.forEach(img => {
      const m = img.src.match(/(s[123]\.gif)$/);
      const key = m?.[1];
      const ch = map[key] || '';

      const span = document.createElement('span');
      span.className = 'kr-symbol kr-symbol-' + (key || 's');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = ch;

      if (img.alt) {
        const sr = document.createElement('span');
        sr.className = 'kr-sr-only';
        sr.textContent = img.alt;
        span.appendChild(sr);
      }

      const sexAncestor = img.closest('[id*="sex"]');
      if (sexAncestor) {
        const strong = document.createElement('strong');
        strong.appendChild(span);
        img.replaceWith(strong);
      } else {
        img.replaceWith(span);
      }
    });
  }

  function reorderBtnGroupXs() {
    document.querySelectorAll('span.btn-group-xs').forEach(btn => {
      const parent = btn.parentElement;
      if (!parent) return;

      const strong = parent.querySelector('strong');
      if (strong && strong.parentElement === parent && btn.nextElementSibling !== strong) {
        parent.insertBefore(btn, strong);
        return;
      }

      const textNode = Array.from(parent.childNodes)
        .find(n => n.nodeType === 3 && n.textContent?.trim().length > 0);
      if (textNode && btn.nextSibling !== textNode) {
        parent.insertBefore(btn, textNode);
      }
    });
  }

  function ensureSexStrong() {
    document.querySelectorAll('[id*="ajax-sex"]').forEach(el => {
      if (el.querySelector('strong')) return;

      const sym = el.querySelector('.kr-symbol');
      if (sym) {
        const strong = document.createElement('strong');
        sym.parentElement.replaceChild(strong, sym);
        strong.appendChild(sym);
        return;
      }

      const tn = Array.from(el.childNodes)
        .find(n => n.nodeType === 3 && n.textContent?.trim().length > 0);
      if (tn) {
        const txt = tn.textContent.trim();
        const strong = document.createElement('strong');
        strong.textContent = txt;
        tn.textContent = tn.textContent.replace(txt, '');
        tn.parentElement.insertBefore(strong, tn.nextSibling);
      }
    });
  }

  function ensureFooterSticky() {
    const footer = document.querySelector('footer, .footer, .contentinfo');
    if (!footer) return;

    const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
    let back = null;
    for (const s of selectors) {
      back = document.querySelector(s);
      if (back) break;
    }

    if (back) {
      back.classList.add('kraland-back-to-top');
      if (!back.getAttribute('aria-label')) back.setAttribute('aria-label', 'Remonter en haut');
      const whiteContainer = footer.querySelector('.container.white');
      if (whiteContainer) {
        whiteContainer.appendChild(back);
      } else if (back.parentElement !== footer) {
        footer.appendChild(back);
      }
    }

    if (!document.body.style.paddingBottom) {
      document.body.style.paddingBottom = '60px';
    }
  }

  function relocateKramailToLeft() {
    const colT = document.getElementById('col-t');
    const colLeft = document.getElementById('col-left');
    if (!colT || !colLeft) return;

    // Supprimer les blocs Kramail
    colT.querySelectorAll('a[href*="kramail"]').forEach(a => {
      const container = a.closest('div,section,li,article');
      if (container && container !== colT && container.id !== 'col-t') {
        container.remove();
      } else {
        a.remove();
      }
    });

    // Sélectionner les éléments à déplacer
    const selectors = ['.ds_users', '.ds_characters', '.ds_online'].map(c => `a${c}`);
    let toMove = [];
    selectors.forEach(sel => toMove.push(...colT.querySelectorAll(sel)));

    if (toMove.length < 3) {
      const texts = ['Membres actifs', 'Personnages actifs', 'Personnes en ligne'];
      texts.forEach(txt => {
        const el = Array.from(colT.querySelectorAll('a, li, div, p'))
          .find(n => n.textContent?.includes(txt));
        if (el && !toMove.includes(el)) toMove.push(el);
      });
    }

    toMove = toMove.filter(el => el && !colLeft.contains(el));
    if (!toMove.length) return;

    let container = colLeft.querySelector('.kraland-metrics');
    if (!container) {
      container = document.createElement('div');
      container.className = 'kraland-metrics list-group';
      colLeft.appendChild(container);
    }

    toMove.forEach(el => container.appendChild(el));
  }

  function restructurePlatoColumns() {
    if (!isPlatoPage()) return;

    const colLeft = document.getElementById('col-left');
    const colRight = document.getElementById('col-right');
    if (!colLeft || !colRight) return;

    const parent = colLeft.parentElement;
    if (!parent?.classList.contains('row')) return;

    let colLeftest = document.getElementById('col-leftest');
    if (!colLeftest) {
      colLeftest = document.createElement('div');
      colLeftest.id = 'col-leftest';
      colLeftest.className = 'col-md-1';
      parent.insertBefore(colLeftest, colLeft);
    }

    if (colRight.classList.contains('col-md-9')) {
      colRight.classList.remove('col-md-9');
      colRight.classList.add('col-md-8');
    }
  }

  function moveBtnGroupToCols() {
    if (!isPlatoPage()) return;

    const btnGroupXs = document.querySelector('.btn-group-xs.center');
    const colLeftest = document.getElementById('col-leftest');
    if (!btnGroupXs || !colLeftest || colLeftest.contains(btnGroupXs)) return;

    let wrapper = document.getElementById('col-leftest-stats');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'col-leftest-stats';
      wrapper.className = 'panel panel-body';
      colLeftest.appendChild(wrapper);
    }

    if (!wrapper.contains(btnGroupXs)) {
      wrapper.appendChild(btnGroupXs);
    }
  }

  function transformToBootstrapGrid() {
    const colLeftestStats = document.getElementById('col-leftest-stats');
    const skillsPanel = document.getElementById('skills-panel');

    if (colLeftestStats && !colLeftestStats.classList.contains('grid-transformed')) {
      const btnGroup = colLeftestStats.querySelector('.btn-group-xs');
      if (btnGroup) {
        const buttons = Array.from(btnGroup.querySelectorAll('a.btn'));
        if (buttons.length > 0) {
          colLeftestStats.innerHTML = '';
          const row = document.createElement('div');
          row.className = 'row';
          buttons.forEach(btn => {
            const col = document.createElement('div');
            col.className = 'col-md-6';
            col.appendChild(btn);
            row.appendChild(col);
          });
          colLeftestStats.appendChild(row);
          colLeftestStats.classList.add('grid-transformed');
        }
      }
    }

    if (skillsPanel && !skillsPanel.classList.contains('grid-transformed')) {
      const items = Array.from(skillsPanel.querySelectorAll('a.list-group-item'));
      if (items.length > 0) {
        skillsPanel.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'row';
        items.forEach(item => {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.appendChild(item);
          row.appendChild(col);
        });
        skillsPanel.appendChild(row);
        skillsPanel.classList.add('grid-transformed');
      }
    }
  }

  function moveSkillsPanelToCols() {
    const colLeft = document.getElementById('col-left');
    const colLeftest = document.getElementById('col-leftest');
    if (!colLeft || !colLeftest) return;

    const skillsPanelOld = colLeft.querySelector('.panel.panel-default');
    if (!skillsPanelOld) return;

    const panelBody = skillsPanelOld.querySelector('.panel-body');
    if (!panelBody || panelBody.id) return;

    panelBody.id = 'skills-panel';
    colLeftest.appendChild(panelBody);
    skillsPanelOld.remove();
  }

  function nameLeftSidebarDivs() {
    const colLeft = document.getElementById('col-left');
    if (!colLeft) return;

    const mainPanel = colLeft.querySelector('.panel.panel-body');
    if (mainPanel && !mainPanel.id) mainPanel.id = 'player-main-panel';

    const headerSection = colLeft.querySelector('.list-group');
    if (headerSection && !headerSection.id) headerSection.id = 'player-header-section';

    const vitalsSection = colLeft.querySelector('div.t.row');
    if (vitalsSection && !vitalsSection.id) vitalsSection.id = 'player-vitals-section';

    const allTDivs = Array.from(colLeft.querySelectorAll('div.t'));
    if (allTDivs.length > 0) {
      const actionsSection = allTDivs[allTDivs.length - 1];
      if (!actionsSection.id && actionsSection.querySelector('a.btn-primary')) {
        actionsSection.id = 'player-actions-section';
      }
    }
  }

  function transformSkillsToIcons() {
    const skillsPanel = document.getElementById('skills-panel');
    if (!skillsPanel || skillsPanel.dataset.iconsTransformed) return;

    skillsPanel.querySelectorAll('.list-group-item').forEach(item => {
      const heading = item.querySelector('.list-group-item-heading');
      const skillName = heading?.querySelector('.mini')?.textContent || '';
      const level = item.querySelector('.mention')?.textContent || '0';
      const iconCode = CONFIG.SKILL_ICONS[skillName];
      if (!iconCode) return;

      const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
      const originalClasses = item.className;
      item.className = originalClasses + ' btn btn-default mini';
      item.innerHTML = '';

      const iconContainer = createIconContainer(iconUrl, skillName, level);
      Object.assign(item.style, {
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '8px'
      });
      item.appendChild(iconContainer);
    });

    skillsPanel.dataset.iconsTransformed = '1';
  }

  function transformStatsToNotifications() {
    const colLeftestStats = document.getElementById('col-leftest-stats');
    if (!colLeftestStats || colLeftestStats.dataset.badgesTransformed) return;

    colLeftestStats.querySelectorAll('.col-md-6 > a.btn').forEach(statBtn => {
      const text = statBtn.textContent.trim();
      const match = text.match(/^([A-Z]+)/);
      const cleanStatName = match ? match[1] : text;
      const levelMatch = text.match(/(\d+)$/);
      const number = levelMatch ? levelMatch[1] : '0';

      while (statBtn.firstChild) statBtn.removeChild(statBtn.firstChild);

      const originalClasses = statBtn.className;
      statBtn.className = originalClasses + ' list-group-item ds_game';
      Object.assign(statBtn.style, {
        padding: '8px', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      });
      statBtn.title = cleanStatName;

      const iconCode = CONFIG.STAT_ICONS[cleanStatName];
      if (iconCode) {
        const iconUrl = `http://img7.kraland.org/2/mat/94/${iconCode}.gif`;
        const iconContainer = createIconContainer(iconUrl, cleanStatName, number);
        statBtn.appendChild(iconContainer);
      } else {
        // Fallback SVG
        const container = document.createElement('div');
        Object.assign(container.style, {
          position: 'relative', display: 'inline-block',
          width: '32px', height: '32px'
        });

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.style.display = 'block';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '32');
        rect.setAttribute('height', '32');
        rect.setAttribute('fill', '#f0f0f0');
        rect.setAttribute('stroke', '#ccc');
        svg.appendChild(rect);

        const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svgText.setAttribute('x', '16');
        svgText.setAttribute('y', '20');
        svgText.setAttribute('text-anchor', 'middle');
        svgText.setAttribute('font-size', '14');
        svgText.setAttribute('font-weight', 'bold');
        svgText.setAttribute('fill', '#333');
        svgText.textContent = cleanStatName.substring(0, 2).toUpperCase();
        svg.appendChild(svgText);

        container.appendChild(svg);
        container.appendChild(createBadge(number));
        statBtn.appendChild(container);
      }
    });

    colLeftestStats.dataset.badgesTransformed = '1';
  }

  function ensureEditorClasses() {
    const selectors = [
      '[id^="ajax-"] form#msg', '[id^="ajax-"] textarea',
      '.col-sm-10 form#msg', '.col-sm-10 textarea#message',
      'form[name="post_msg"]', 'textarea#message'
    ];
    
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      const root = el.tagName?.toLowerCase() === 'form' ? el : (el.closest('form') || el.parentElement);
      if (root && !root.classList.contains('editeur-text')) {
        root.classList.add('editeur-text');
      }
    });
  }

  function ensurePageScoping() {
    const isMembers = location?.pathname?.indexOf('/communaute/membres') === 0;
    document.documentElement.classList.toggle('kr-page-members', isMembers);
  }

  function ensurePlayerMainPanelRows() {
    const panel = document.getElementById('player-main-panel');
    if (!panel) return;

    Array.from(panel.children)
      .filter(child => child.tagName?.toLowerCase() === 'div')
      .forEach(div => {
        if (!div.classList.contains('row')) div.classList.add('row');
      });
  }

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  function insertToggleCSSButton() {
    if (document.getElementById('kr-toggle-css-btn')) return;

    const mapBtn = Array.from(document.querySelectorAll('a'))
      .find(a => a.getAttribute('onclick')?.includes('openMap'));
    if (!mapBtn) return;

    const mapLi = mapBtn.closest('li');
    if (!mapLi?.parentElement) return;

    const newLi = document.createElement('li');
    const toggleBtn = document.createElement('a');
    toggleBtn.href = '';
    toggleBtn.id = 'kr-toggle-css-btn';
    toggleBtn.innerHTML = '<i class="fa fa-palette"></i>';

    function updateTitle() {
      toggleBtn.title = isThemeEnabled() 
        ? 'Désactiver la surcharge CSS' 
        : 'Activer la surcharge CSS';
    }
    updateTitle();

    toggleBtn.addEventListener('click', e => {
      e.preventDefault();
      if (isThemeEnabled()) {
        applyThemeVariant('disable');
      } else {
        applyThemeVariant(getVariant());
      }
      return false;
    });

    newLi.appendChild(toggleBtn);
    mapLi.parentElement.insertBefore(newLi, mapLi);
  }

  function insertTampermonkeyThemeUI() {
    if (!location?.href?.includes('/profil/interface')) return;

    function tryInsert() {
      const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
      const target = headings.find(h => 
        h.textContent?.trim().toLowerCase().includes('thème de base')
      );
      if (!target) return false;
      if (document.getElementById('kr-tamper-theme')) return true;

      const themeOptions = [
        { value: 'disable', flag: 'f0', label: 'Désactiver la surcharge CSS' },
        { value: 'kraland', flag: 'f1', label: 'République de Kraland' },
        { value: 'empire-brun', flag: 'f2', label: 'Empire Brun' },
        { value: 'paladium', flag: 'f3', label: 'Paladium Corporation' },
        { value: 'theocratie-seelienne', flag: 'f4', label: 'Théocratie Seelienne' },
        { value: 'paradigme-vert', flag: 'f5', label: 'Paradigme Vert' },
        { value: 'khanat-elmerien', flag: 'f6', label: 'Khanat Elmérien' },
        { value: 'confederation-libre', flag: 'f7', label: 'Confédération Libre' },
        { value: 'royaume-ruthvenie', flag: 'f8', label: 'Royaume de Ruthvénie' }
      ];

      const radios = themeOptions.map(opt => `
        <div class="radio">
          <span class="lefticon"><img src="http://img7.kraland.org/2/world/${opt.flag}.png" width="15" height="10"></span>
          <label><input type="radio" name="kr-theme" value="${opt.value}"> ${opt.label}</label>
        </div>
      `).join('');

      const container = document.createElement('div');
      container.id = 'kr-tamper-theme';
      container.className = 'well kr-tamper-theme';
      container.innerHTML = `
        <h4>Thème Tampermonkey (Activez le thème de base officiel pour éviter les conflits)</h4>
        <form id="kr-tamper-theme-form" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-3 control-label">Choix</label>
            <div class="col-sm-9">${radios}</div>
          </div>
        </form>
      `;

      target.parentElement.insertBefore(container, target);

      const form = container.querySelector('#kr-tamper-theme-form');
      
      function syncUI() {
        if (!isThemeEnabled()) {
          const d = form.querySelector('input[value="disable"]');
          if (d) d.checked = true;
          return;
        }
        const v = getVariant();
        const el = form.querySelector(`input[value="${v}"]`);
        if (el) el.checked = true;
      }

      form.addEventListener('change', () => {
        const sel = form.querySelector('input[name="kr-theme"]:checked');
        if (!sel) return;
        const val = sel.value;

        const feedback = document.createElement('div');
        feedback.className = 'alert alert-success';
        feedback.textContent = val === 'disable' 
          ? 'Désactivation du thème...' 
          : 'Application du thème: ' + val;
        container.appendChild(feedback);

        setTimeout(() => applyThemeVariant(val), 300);
      });

      syncUI();
      return true;
    }

    if (!tryInsert()) {
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if (tryInsert() || attempts > 25) clearInterval(id);
      }, 200);
    }
  }

  // ============================================================================
  // OBSERVERS
  // ============================================================================

  function startObservers() {
    let domTransformationsApplied = false;

    const mo = new MutationObserver(() => {
      if (isThemeEnabled()) {
        if (!document.getElementById(CONFIG.STYLE_ID)) {
          applyThemeInline(CONFIG.BUNDLED_CSS).catch(() => {});
        }
        if (!domTransformationsApplied) {
          applyDOMTransformations();
          domTransformationsApplied = true;
        }
      }
      safeCall(insertToggleCSSButton);
    });

    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // SPA navigation
    const wrap = orig => function() {
      const ret = orig.apply(this, arguments);
      setTimeout(() => ensureTheme(), 250);
      return ret;
    };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => setTimeout(() => ensureTheme(), 250));
  }

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  (async function init() {
    try {
      const themeEnabled = getThemeState();

      // Nettoyage CSS orphelin
      const existingStyle = document.getElementById(CONFIG.STYLE_ID);
      if (!themeEnabled && existingStyle?.parentElement) {
        existingStyle.parentElement.removeChild(existingStyle);
      }

      // UI Controls (toujours)
      safeCall(insertToggleCSSButton);
      safeCall(insertTampermonkeyThemeUI);

      // Theme setup (si activé)
      if (themeEnabled) {
        await ensureTheme();

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', applyDOMTransformations, { once: true });
        } else {
          applyDOMTransformations();
        }
      }

      startObservers();

      // Déplacer le style à la fin du head pour la priorité
      setTimeout(() => {
        const st = document.getElementById(CONFIG.STYLE_ID);
        if (isThemeEnabled() && st?.parentElement) {
          st.parentElement.appendChild(st);
        } else if (!isThemeEnabled() && st?.parentElement) {
          st.parentElement.removeChild(st);
        }
      }, 1000);

      // Désactiver les tooltips périodiquement
      setInterval(disableTooltips, 2000);

    } catch(e) { 
      console.error('Kraland theme init failed', e); 
    }
  })();
})();
