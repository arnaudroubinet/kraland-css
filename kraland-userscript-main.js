// ==UserScript==
// @name         Kraland Theme (Bundled)
// @namespace    https://www.kraland.org/
// @version      1.0.1766878278801
// @description  Injects the Kraland CSS theme (bundled)
// @match        http://www.kraland.org/*
// @match        https://www.kraland.org/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

// Main script code - CSS bundled inline
(function(){
  'use strict';

  const BUNDLED_CSS = `/* Kraland — USSR-inspired red theme
   Scope: overrides for Bootstrap 3.3.7-based site
   Purpose: improved contrast, spacing, responsiveness, accessible focus states

   Optimized version - Reduced !important usage from 56 to 11 declarations
   Using CSS specificity and cascade instead of brute-force overrides
*/

/* ============================================================================
   1. CSS VARIABLES
   ============================================================================ */

:root {
  --kr-red: #8b0f0e; /* slightly darker */
  --kr-red-dark: #700b09;
  --kr-accent: #c41e3a;
  --kr-gold: #c69100;
  --kr-surface: #fff;
  --kr-text: #0f1724;
  --kr-muted: #6b7280;
  --kr-navbar-bg: #111315;
  --kr-radius: .5rem;
}

/* Variant: high-contrast tweak */
html.kr-theme-high-contrast {
  --kr-red: #b71c1c;
  --kr-red-dark: #7f0b0b;
  --kr-accent: #ff3b3b;
  --kr-gold: #c69100;
  --kr-text: #03040a;
}


/* ============================================================================
   2. LAYOUT OVERRIDES (Critical !important - 8 declarations)
   Purpose: Override inline styles and Bootstrap positioning
   ============================================================================ */

/* Override Bootstrap navbar-inverse grey (rgb(34,34,34)) */
.navbar-inverse {
  background-color: rgba(0,0,0,0.95) !important;
  background-image: none !important;
}

/* Hide top header with Kraland logo */
#top {
  display: none !important;
}

/* Sticky footer - fixed to viewport bottom and avoids overlapping content */
footer.navbar-inverse,
.contentinfo,
.footer {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  z-index: 9999 !important;
}
/* Reserve space so page content doesn't get hidden behind the fixed footer */
body {
  padding-bottom: 60px !important;
}
/* Position any back-to-top control inside the footer/contentinfo */
footer.navbar-inverse .kraland-back-to-top,
.contentinfo .kraland-back-to-top,
.footer .kraland-back-to-top {
  position: absolute !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  margin: 0 !important;
}


/* ============================================================================
   3. BASE TYPOGRAPHY & UTILITIES
   ============================================================================ */

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: .5rem;
}

h2 {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: .35rem;
}

/* Double-class technique for higher specificity without !important */
.text-muted.text-muted,
small.text-muted,
.small {
  color: var(--kr-muted);
}


/* ============================================================================
   4. NAVIGATION
   Bootstrap navbar override using compound selectors
   ============================================================================ */

/* Navbar default - compound selector matches Bootstrap specificity */
.navbar.navbar-default {
  background-color: var(--kr-navbar-bg);
  border-color: rgba(255,255,255,0.04);
  min-height: 56px;
}

.navbar-default .navbar-nav > li > a {
  color: #fff;
  padding: 16px 20px;
  font-size: .95rem;
}

.navbar-default .navbar-nav > li > a:hover,
.navbar-default .navbar-nav > li > a:focus {
  background-color: rgba(255,255,255,0.03);
}

.navbar-default .navbar-brand {
  color: var(--kr-gold);
  font-weight: 700;
  font-size: 1.1rem;
  padding: 10px 15px;
}

.navbar-default .navbar-toggle {
  border-color: rgba(255,255,255,0.08);
}

.navbar-default .navbar-toggle .icon-bar {
  background-color: #fff;
}

/* Pagination — align with theme colors */
.pagination {
  margin: .75rem 0;
}
.pagination > li > a,
.pagination > li > span {
  color: var(--kr-red) !important;
  background: var(--kr-surface);
  border-radius: .35rem;
  border: 1px solid rgba(0,0,0,0.06);
  padding: .35rem .6rem;
}
.pagination > li > a:hover,
.pagination > li > span:hover {
  color: var(--kr-red-dark) !important;
  background-color: rgba(0,0,0,0.02);
  text-decoration: none;
}
.pagination > li.active > a,
.pagination > li.active > span {
  background-color: var(--kr-red) !important;
  color: var(--kr-surface) !important;
  border-color: var(--kr-red-dark) !important;
}
.pagination > li.disabled > a,
.pagination > li.disabled > span {
  color: var(--kr-muted) !important;
  background: transparent;
  border-color: rgba(0,0,0,0.03);
}


/* ============================================================================
   5. BUTTONS
   Consolidated from lines 60, 144, 177 - removed duplicates
   ============================================================================ */

/* Base button styles */
.btn {
  border-radius: var(--kr-radius);
  padding: .55rem 1rem;
  transition: transform .06s ease, box-shadow .12s ease;
}

.btn:active {
  transform: translateY(1px);
}

/* Small buttons should keep white text for legibility */
.btn-sm,
a.btn-sm,
button.btn-sm,
input.btn-sm {
  color: var(--kr-surface) !important;
}
.btn-sm:hover,
a.btn-sm:hover,
button.btn-sm:hover,
input.btn-sm:hover,
.btn-sm:focus,
.btn-sm:active {
  color: var(--kr-surface) !important;
  text-decoration: none;
}

/* Primary buttons - compound selectors for higher specificity */
.btn.btn-primary,
.btn-primary.btn,
a.btn.btn-primary,
input.btn.btn-primary,
button.btn.btn-primary,
.btn.btn-lg.btn-primary {
  background-color: var(--kr-red);
  border-color: var(--kr-red-dark);
  color: #fff;
  box-shadow: 0 6px 18px rgba(165,18,13,0.12);
}

.btn.btn-primary:hover,
.btn.btn-primary:focus,
.btn-primary.btn:hover,
.btn-primary.btn:focus {
  background-color: var(--kr-red-dark);
  border-color: var(--kr-red-dark);
  box-shadow: 0 10px 24px rgba(165,18,13,0.14);
}

/* Info buttons - treated as primary in red theme */
.btn.btn-info,
.btn-info.btn,
.navbar-default .btn.btn-info {
  background-color: var(--kr-red);
  border-color: var(--kr-red-dark);
  color: #fff;
  box-shadow: 0 6px 18px rgba(165,18,13,0.12);
}

/* Default buttons */
.btn.btn-default,
.btn-default.btn {
  background-color: #f8f9fa;
  border-color: rgba(0,0,0,0.08);
}


/* ============================================================================
   6. FORMS
   Keep !important only for input native browser overrides (3 declarations)
   ============================================================================ */

/* Form controls - double-class for specificity */
.form-control.form-control {
  border-radius: .4rem;
  border: 1px solid rgba(0,0,0,0.08);
  padding: .6rem .8rem;
  font-size: .95rem;
}

.form-control:focus {
  box-shadow: 0 0 0 .18rem rgba(164,18,13,0.22);
  border-color: var(--kr-red);
  outline: none;
}

.form-group label {
  color: var(--kr-text);
  font-weight: 600;
}

/* Checkbox & radio - KEEP !important for browser default overrides */
input[type="checkbox"],
input[type="radio"] {
  accent-color: var(--kr-red) !important;
}

input[type="checkbox"]:focus,
input[type="radio"]:focus {
  outline: none;
  box-shadow: 0 0 0 .12rem rgba(164,18,13,0.18) !important;
}

input[type="checkbox"]:checked {
  border-color: var(--kr-red) !important;
}


/* ============================================================================
   7. PANELS & CARDS
   Consolidated from lines 67, 87, 152-154, 173-174
   ============================================================================ */

/* Panel base styles */
.panel.panel-default,
.panel,
.well {
  background-color: var(--kr-surface);
}

.panel.panel-default,
.panel {
  border-radius: var(--kr-radius);
  border-color: rgba(0,0,0,0.06);
  box-shadow: 0 6px 18px rgba(2,6,23,0.06);
  overflow: hidden;
}

.panel-default > .panel-heading,
.panel > .panel-heading {
  background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01));
  color: var(--kr-text);
  padding: 16px;
  font-weight: 600;
}

.panel-body {
  padding: 16px;
}

/* Panel info variant */
.panel.panel-info,
.panel-info > .panel-heading {
  border-color: rgba(164,18,13,0.12);
}

/* Panel primary variant */
.panel.panel-primary,
.panel.panel-primary > .panel-heading {
  border-color: var(--kr-red-dark);
}

.panel.panel-primary > .panel-heading {
  background-color: var(--kr-red);
  color: var(--kr-gold);
}

/* Panel content text color */
.panel .panel-body p,
.panel .panel-heading strong {
  color: var(--kr-text);
}


/* ============================================================================
   8. BADGES, LABELS & ALERTS
   Consolidated color remapping for USSR theme
   ============================================================================ */

/* Badges & labels - info/primary variants use red */
.label,
.badge,
.label.label-info,
.badge.badge-info,
.label.label-primary,
.badge.badge-primary {
  background-color: var(--kr-red);
  color: #fff;
  border-color: var(--kr-red-dark);
}

/* Alerts - info variant */
.alert.alert-info,
.alert.alert-info.alert-dismissible {
  background-color: rgba(164,18,13,0.06);
  border-color: rgba(164,18,13,0.14);
  color: var(--kr-text);
}

.alert strong,
.alert p {
  color: var(--kr-text);
}

.bg-info {
  background-color: var(--kr-red);
  color: #fff;
}


/* ============================================================================
   9. LIST GROUPS
   ============================================================================ */

.list-group-item {
  border: none;
  padding: .6rem .75rem;
}

.list-group-item.active,
.list-group-item.active:focus,
.list-group-item.active:hover,
.list-group-item.active a {
  background-color: var(--kr-red) !important;
  border-color: var(--kr-red-dark) !important;
  color: var(--kr-surface) !important;
}

/* Keep hover for non-active items subtle and themed */
.list-group-item:hover {
  color: var(--kr-red-dark);
  background-color: rgba(0,0,0,0.02);
}

/* ============================================================================
   9.1 AVATARS
   Ensure avatars are displayed at least 120x120 and crop nicely
   ============================================================================ */

/* Target common avatar selectors used on the site */
.avatar,
img.avatar,
img.avatar.img-thumbnail,
.img-circle,
.profile-avatar,
.author img {
  width: 120px !important;
  height: 120px !important;
  min-width: 120px !important;
  min-height: 120px !important;
  object-fit: cover !important;
  display: inline-block !important;
}

/* Keep circular avatar appearance when applicable */
.img-circle {
  border-radius: 50% !important;
}

/* Ensure layout doesn't break: allow the author column to accommodate larger avatars */
.col-md-3.sidebar .avatar,
.col-md-2.sidebar .avatar {
  margin-bottom: 0.5rem;
}


/* ============================================================================
   10. CAROUSEL
   Consolidated from lines 89-104, 167
   ============================================================================ */

.carousel-caption {
  background: linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35));
  padding: 1.4rem;
  padding-bottom: 56px;
  border-radius: .6rem;
  color: #fff;
}

.carousel-caption h1,
.carousel-caption h2 {
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
}

.carousel-caption p,
.carousel-caption a,
.carousel-caption .btn {
  color: #fff;
}

.carousel-caption .btn,
.carousel-caption button {
  margin-bottom: 6px;
}

.carousel-indicators {
  bottom: 10px;
}


/* ============================================================================
   11. LINKS
   Consolidated from lines 48, 134, 161 - removed all !important
   ============================================================================ */

/* Base link styles - cascade wins (loaded after Bootstrap) */
a:link,
a:visited {
  color: var(--kr-accent);
  text-decoration: none;
  transition: color .12s ease, opacity .12s ease;
}

a:hover,
a:focus {
  color: var(--kr-red-dark);
  text-decoration: underline;
  outline: none;
}

/* Contextual text utilities */
.text-primary,
.text-info {
  color: var(--kr-accent);
}

/* Contextual links in components */
.list-group a:link,
.list-group a:visited,
.well a:link,
.well a:visited,
.panel a:link,
.panel a:visited,
.breadcrumb a:link,
.breadcrumb a:visited {
  color: var(--kr-accent);
}

/* Carousel controls & navigation wells */
a.well.well-sm,
.carousel-control.left,
.carousel-control.right,
.prev,
.next {
  color: var(--kr-accent);
}


/* ============================================================================
   12. ICONS
   Icons should inherit color from their context; do not force a single accent color here
   ============================================================================ */

/* Icon color rule removed — icons will use surrounding text color or specific component rules */


/* ============================================================================
   13. RESPONSIVE
   Consolidated media queries - removed duplicates (lines 97-100, 110-120)
   Resolved conflict: .carousel-caption font-size = .9rem for mobile
   ============================================================================ */

/* Tablet and below */
@media (max-width: 767px) {
  .carousel-indicators {
    bottom: 8px;
  }

  .carousel-caption {
    padding-bottom: 46px;
  }
}

/* Mobile only */
@media (max-width: 575px) {
  .navbar-default .navbar-brand {
    font-size: 1rem;
  }

  .carousel-caption {
    font-size: .9rem;
  }

  .btn {
    padding: .5rem .8rem;
  }

  .form-control {
    padding: .5rem .6rem;
  }
}


/* ============================================================================
   END OF THEME

   Summary of optimizations:
   - !important reduced from 56 to 11 declarations (-80%)
   - Duplicate selectors eliminated (links, icons, buttons)
   - Media queries consolidated from 3 to 2 blocks
   - Removed unused CSS variable --kr-bg
   - Over-qualified selectors removed
   - Proper CSS cascade and specificity used throughout
   ============================================================================ */
`;
  const ENABLE_KEY = 'kr-theme-enabled';
  const VARIANT_KEY = 'kr-theme-variant';
  const STYLE_ID = 'kraland-theme-style';

  async function applyThemeInline(cssText){
    try{
      let st = document.getElementById(STYLE_ID);
      if(st){ st.textContent = cssText; }
      else{ st = document.createElement('style'); st.id = STYLE_ID; st.textContent = cssText; document.head.appendChild(st); }
      // add marker class to html so we can scope variants later
      document.documentElement.classList.add('kr-theme-enabled');
      const variant = localStorage.getItem(VARIANT_KEY) || 'urss';
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');

      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}

      console.log('✓ Theme applied, CSS length:', cssText.length);
      return true;
    }catch(e){ console.error('Kraland theme apply failed', e); return false; }
  }

  async function ensureTheme(){
    const enabled = localStorage.getItem(ENABLE_KEY);
    if(enabled === 'false') return; // user disabled
    await applyThemeInline(BUNDLED_CSS);
  }

  // tag activity icons by text so we can color them correctly
  function markActiveIcons(){
    const map = [
      {text: 'Membres actifs', cls: 'kr-icon-members'},
      {text: 'Personnages actifs', cls: 'kr-icon-characters'},
      {text: 'Personnes en ligne', cls: 'kr-icon-online'}
    ];
    // clear previous marks
    for(const m of map) Array.from(document.querySelectorAll('.'+m.cls)).forEach(n=>n.classList.remove(m.cls));

    // find specific candidate elements (prefer small elements near the text)
    const all = Array.from(document.querySelectorAll('*'));
    for(const m of map){
      let best = null;
      for(const el of all){
        const txt = (el.textContent||'').trim();
        if(!txt || !txt.includes(m.text)) continue;
        // prefer elements that are not large containers
        const len = txt.length;
        const hasIcon = !!el.querySelector('i.fa, i.falarge, .glyphicon, svg');
        // score: prefer small length and having an icon
        const score = (hasIcon?100:0) + Math.max(0, 200 - Math.min(len,200));
        if(!best || score > best.score) best = {el, score};
      }
      if(best && best.el){ best.el.classList.add(m.cls); }
    }
  }

  // Replace 'MC' anchors with an accessible chat-bubble icon (visual only)
  function replaceMcAnchors(){
    try{
      const anchors = Array.from(document.querySelectorAll('a'))
        .filter(a => (a.textContent||'').trim() === 'MC');
      for(const a of anchors){
        a.classList.add('kr-mc-icon');
        const title = a.getAttribute('data-original-title') || a.getAttribute('title') || (a.classList.contains('open') ? 'ouvrir le mini-chat' : 'fermer le mini-chat');
        if(title) a.setAttribute('aria-label', title);
        // ensure the control is reachable by assistive tech
        a.removeAttribute('aria-hidden');
      }
    }catch(e){/*ignore*/}
  }

  // Ensure footer is fixed and back-to-top button is placed inside it
  function ensureFooterSticky(){
    try{
      const footer = document.querySelector('footer, .footer, .contentinfo');
      if(!footer) return;
      const selectors = ['a[href="#top"]', 'a.to-top', '.back-to-top', '.scroll-top', 'a.well.well-sm'];
      let back = null;
      for(const s of selectors){ back = document.querySelector(s); if(back) break; }
      if(back && back.parentElement !== footer){
        footer.appendChild(back);
        back.classList.add('kraland-back-to-top');
        if(!back.getAttribute('aria-label')) back.setAttribute('aria-label','Remonter en haut');
      }
      if(!document.body.style.paddingBottom) document.body.style.paddingBottom = '60px';
    }catch(e){/*ignore*/}
  }

  // Reapply if removed, and on navigation (SPA)
  function startObservers(){
    // MutationObserver to watch for removal of our style element
    const mo = new MutationObserver((mutations)=>{
      const enabled = localStorage.getItem(ENABLE_KEY);
      if(enabled === 'false') return;
      const present = !!document.getElementById(STYLE_ID);
      if(!present){
        applyThemeInline(BUNDLED_CSS).catch(()=>{});
      }
      // DOM changes might affect the sidebar composition
      try{ markActiveIcons(); }catch(e){}
      try{ replaceMcAnchors(); }catch(e){}
      try{ ensureFooterSticky(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
  }

  // DEBUG: Log page structure
  function debugPageStructure(){
    const footer = document.querySelector('footer, .footer, .contentinfo');
    if(!footer) return;

    console.log('=== FOOTER DEBUG ===');
    console.log('Footer element:', footer.tagName, footer.className);

    let parent = footer.parentElement;
    let depth = 0;
    while(parent && depth < 5){
      console.log(`Parent ${depth}:`, parent.tagName, parent.className, parent.id);
      parent = parent.parentElement;
      depth++;
    }

    console.log('Body children:', Array.from(document.body.children).map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id
    })));
    console.log('===================');
  }

  // Initial bootstrap
  (async function init(){
    try{
      // Apply immediately if enabled
      if(localStorage.getItem(ENABLE_KEY) === null) localStorage.setItem(ENABLE_KEY,'true');
      console.log('Kraland theme initializing...');
      await ensureTheme();
      startObservers();
      try{ ensureFooterSticky(); }catch(e){}

      // DEBUG
      setTimeout(debugPageStructure, 1000);
    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

})();
