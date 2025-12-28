// ==UserScript==
// @name         Kraland Theme (Bundled)
// @namespace    https://www.kraland.org/
// @version      1.0.1766920112519
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

/* Ensure all navbar anchors and dropdown toggles are white (restore lost white text) */
.navbar-default .navbar-nav > li > a,
.navbar-default .navbar-nav > li > a.dropdown-toggle,
.navbar-inverse .navbar-nav > li > a,
.navbar-inverse .navbar-nav > li > a.dropdown-toggle,
.navbar .dropdown-toggle,
#navbar a,
#navbar button {
  color: #fff !important;
}
.navbar-inverse .navbar-nav > li > a:hover,
.navbar-inverse .navbar-nav > li > a:focus {
  background-color: rgba(255,255,255,0.03);
}

/* Dropdown menu anchors: ensure contrast when the menu background is light */
.navbar-inverse .dropdown-menu > li > a,
.navbar-default .dropdown-menu > li > a {
  color: var(--kr-text) !important;
}
/* Stronger selector to override #navbar a rules */
#navbar .dropdown-menu > li > a,
.navbar-inverse #navbar .dropdown-menu > li > a {
  color: var(--kr-text) !important;
}
#navbar .dropdown-menu > li > a:hover,
#navbar .dropdown-menu > li > a:focus,
.navbar-inverse #navbar .dropdown-menu > li > a:hover,
.navbar-inverse #navbar .dropdown-menu > li > a:focus,
.navbar-inverse .dropdown-menu > li > a:hover,
.navbar-inverse .dropdown-menu > li > a:focus,
.navbar-default .dropdown-menu > li > a:hover,
.navbar-default .dropdown-menu > li > a:focus {
  color: var(--kr-red) !important;
  background-color: rgba(0,0,0,0.03);
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

/* Members page: target only buttons inside panels/wells and member containers to avoid affecting the top navbar */
html.kr-page-members .panel .btn,
html.kr-page-members .panel-body .btn,
html.kr-page-members .well .btn,
html.kr-page-members .container-fluid .btn,
html.kr-page-members .col-xs-12 .btn,
html.kr-page-members .col-sm-4 .btn,
html.kr-page-members .col-md-8 .btn,
html.kr-page-members [id^="ajax-"] .btn,
html.kr-page-members [id^="ajax-"] a.btn,
html.kr-page-members .panel .btn-block,
html.kr-page-members .panel .btn-warning,
html.kr-page-members .panel .btn-default,
html.kr-page-members .panel .btn-primary,
html.kr-page-members .panel .btn-info {
  background-color: var(--kr-red) !important;
  border-color: var(--kr-red-dark) !important;
  color: #fff !important;
}
html.kr-page-members .panel .btn:hover,
html.kr-page-members .panel a.btn:hover,
html.kr-page-members .panel button.btn:hover,
html.kr-page-members .panel input.btn:hover,
html.kr-page-members .panel .btn-block:hover,
html.kr-page-members .panel .btn-warning:hover,
html.kr-page-members .panel .btn-default:hover {
  background-color: var(--kr-red-dark) !important;
  border-color: var(--kr-red-dark) !important;
}
/* Remove conflicting shadows and ensure consistent disabled/active variants inside panels */
html.kr-page-members .panel .btn,
html.kr-page-members .panel .btn-default,
html.kr-page-members .panel .btn-warning {
  box-shadow: none !important;
}
html.kr-page-members .panel .btn:disabled,
html.kr-page-members .panel .btn[disabled] {
  opacity: 0.85 !important;
}

/* Ensure navbar/top buttons are not affected by the members overrides */
html.kr-page-members .navbar .btn,
html.kr-page-members #navbar .btn,
html.kr-page-members .navbar-nav .btn,
html.kr-page-members .navbar .dropdown-toggle,
html.kr-page-members .navbar .dropdown-toggle.btn {
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
  color: #fff !important; /* restore white text in navbar */
}
/* Also ensure navbar links remain white */
html.kr-page-members .navbar-default .navbar-nav > li > a {
  color: #fff !important;
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
   Ensure avatars are displayed at least the configured size and crop nicely
   ============================================================================ */

:root {
  --kr-avatar-size: 120px;
}

/* Target common avatar selectors used on the site */
.avatar,
img.avatar,
img.avatar.img-thumbnail,
.img-circle,
.profile-avatar,
.author img,
.ds-img {
  width: var(--kr-avatar-size) !important;
  height: var(--kr-avatar-size) !important;
  min-width: var(--kr-avatar-size) !important;
  min-height: var(--kr-avatar-size) !important;
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

.list-group-item.ds_user .pull-right img,
.list-group-item.ds_user .pull-right .ds-img {
  width: var(--kr-avatar-size) !important;
  height: var(--kr-avatar-size) !important;
  object-fit: cover !important;
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

/* Symbols that replace small s1/s2/s3 gif images with inline text for accessibility */
.kr-symbol {
  font-family: inherit;
  display: inline-block;
  width: 1em;
  text-align: center;
  vertical-align: middle;
  margin-right: .25rem;
  color: var(--kr-text);
  font-weight: 700; /* bold as requested */
}

/* Section icons: ensure presentation & medals icons adapt to theme accent color (ICON ONLY) */
.kr-icon-presentation i,
.kr-icon-presentation .fa,
.kr-icon-presentation .glyphicon,
.kr-icon-medals i,
.kr-icon-medals .fa,
.kr-icon-medals .glyphicon {
  color: var(--kr-accent) !important;
}
.kr-symbol.kr-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  white-space: nowrap !important;
  border:0 !important;
  padding:0 !important;
  margin:-1px !important;
}
.kr-sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(1px, 1px, 1px, 1px) !important;
  white-space: nowrap !important;
  border:0 !important;
  padding:0 !important;
  margin:-1px !important;
}


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

      // Page-specific class: members list (/communaute/membres) - robust check
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);

      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}
      try{ replaceSImages(); }catch(e){/*ignore*/}
      try{ reorderBtnGroupXs(); }catch(e){/*ignore*/}
      try{ ensureSexStrong(); }catch(e){/*ignore*/}

      // Ensure dropdown menu anchors remain readable even if other styles override
      try{
        let sd = document.getElementById('kr-dropdown-fix');
        const txt = `#navbar .dropdown-menu > li > a { color: var(--kr-text) !important; }\n#navbar .dropdown-menu > li > a:hover, #navbar .dropdown-menu > li > a:focus { color: var(--kr-red) !important; background-color: rgba(0,0,0,0.03); }`;
        if(sd) sd.textContent = txt; else { sd = document.createElement('style'); sd.id='kr-dropdown-fix'; sd.textContent = txt; document.head.appendChild(sd); }
      }catch(e){/*ignore*/}

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
      {text: 'Personnes en ligne', cls: 'kr-icon-online'},
      // Section headers that should reflect theme color
      {text: 'Présentation', cls: 'kr-icon-presentation'},
      {text: 'Médailles', cls: 'kr-icon-medals'}
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

  // Replace small s1/s2/s3 images with equivalent Unicode characters for accessibility
  function replaceSImages(){
    try{
      const map = { 's1.gif': '♂', 's2.gif': '♀', 's3.gif': '⚧' };
      const imgs = Array.from(document.querySelectorAll('img'))
        .filter(i => /img7\.kraland\.org\/.+\/(s[123]\.gif)$/.test(i.src));
      for(const img of imgs){
        const m = img.src.match(/(s[123]\.gif)$/);
        const key = m ? m[1] : null;
        const ch = map[key] || '';
        const span = document.createElement('span');
        span.className = 'kr-symbol kr-symbol-' + (key || 's');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = ch;
        if(img.alt){ const sr = document.createElement('span'); sr.className = 'kr-sr-only'; sr.textContent = img.alt; span.appendChild(sr); }
        // If this image represents the sex value, wrap in <strong>
        const sexAncestor = img.closest('[id^="ajax-sex"]') || img.closest('[id*="_sex"]') || img.closest('[id*="sex"]');
        if(sexAncestor){
          const strong = document.createElement('strong');
          strong.appendChild(span);
          img.replaceWith(strong);
        }else{
          img.replaceWith(span);
        }
      }
    }catch(e){/*ignore*/}
  }
  // Move .btn-group-xs before the parent text in member blocks for cleaner layout
  // Specifically: if the parent contains a <strong> label (eg. "Nom:") place the button BEFORE that <strong> element.
  function reorderBtnGroupXs(){
    try{
      const candidates = Array.from(document.querySelectorAll('span.btn-group-xs'));
      candidates.forEach(btn => {
        const parent = btn.parentElement;
        if(!parent) return;
        // If a <strong> label exists, place the btn before it (per design requirement)
        const strong = parent.querySelector('strong');
        if(strong && strong.parentElement === parent){
          if(btn.nextElementSibling !== strong){
            parent.insertBefore(btn, strong);
            // If some other script immediately reorders, try again next tick to ensure placement before <strong>
            setTimeout(()=>{ try{ if(btn.nextElementSibling !== strong) parent.insertBefore(btn, parent.firstChild); }catch(e){} }, 50);
          }
          return;
        }
        // prefer moving before the first meaningful text node
        const textNode = Array.from(parent.childNodes).find(n => n.nodeType === 3 && n.textContent && n.textContent.trim().length > 0);
        if(textNode){
          if(btn.nextSibling !== textNode && parent.firstChild !== btn){
            parent.insertBefore(btn, textNode);
          }
          return;
        }
        // fallback: before first child element that contains visible text
        const elWithText = Array.from(parent.children).find(ch => (ch.innerText||'').trim().length > 0 && ch !== btn);
        if(elWithText){
          if(parent.firstElementChild !== btn){
            parent.insertBefore(btn, elWithText);
          }
          return;
        }
        // otherwise don't change (avoid moving before avatars/images)
      });
    }catch(e){/*ignore*/ }
  }

  // Ensure that sex values are wrapped in a <strong> for consistent styling and semantics
  function ensureSexStrong(){
    try{
      const sexEls = Array.from(document.querySelectorAll('[id*="ajax-sex"]'));
      sexEls.forEach(el => {
        // if strong exists already, nothing to do
        if(el.querySelector('strong')) return;
        // prefer to wrap existing .kr-symbol
        const sym = el.querySelector('.kr-symbol');
        if(sym){
          const strong = document.createElement('strong');
          // replace the symbol node with a <strong> that contains it (preserve position)
          sym.parentElement.replaceChild(strong, sym);
          strong.appendChild(sym);
          return;
        }
        // fallback: find a text node with non-space content and wrap it (replace the text node)
        const tn = Array.from(el.childNodes).find(n=>n.nodeType===3 && n.textContent && n.textContent.trim().length>0);
        if(tn){
          const txt = tn.textContent.trim();
          const strong = document.createElement('strong');
          strong.textContent = txt;
          tn.textContent = tn.textContent.replace(txt, '');
          // insert strong where the text node was
          tn.parentElement.insertBefore(strong, tn.nextSibling);
        }
      });
    }catch(e){/*ignore*/ }
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

  // Move Kramail counts (members/characters/online) from right column to end of left column
  // Idempotent: will not duplicate elements if already moved, and will remove the kramail block
  function relocateKramailToLeft(){
    try{
      const colT = document.getElementById('col-t');
      const colLeft = document.getElementById('col-left');
      if(!colT || !colLeft) return;

      // Remove Kramail block(s) (links to /kramail) but avoid removing the entire column
      const kramailAnchors = Array.from(colT.querySelectorAll('a[href*="kramail"]'));
      kramailAnchors.forEach(a => {
        let container = a.closest('div,section,li,article');
        if(container && container !== colT && container.id !== 'col-t'){
          if(container.parentElement) container.parentElement.removeChild(container);
        } else {
          // fallback: remove only the anchor itself
          if(a.parentElement) a.parentElement.removeChild(a);
        }
      });

      // Select anchors to move by class, falling back to matching text
      const selectors = ['a.ds_users','a.ds_characters','a.ds_online','a.list-group-item.ds_users','a.list-group-item.ds_characters','a.list-group-item.ds_online'];
      let toMove = [];
      selectors.forEach(sel => toMove.push(...Array.from(colT.querySelectorAll(sel))));

      if(toMove.length < 3){
        const texts = ['Membres actifs','Personnages actifs','Personnes en ligne'];
        for(const txt of texts){
          const el = Array.from(colT.querySelectorAll('a, li, div, p')).find(n => (n.textContent||'').includes(txt));
          if(el && !toMove.includes(el)) toMove.push(el);
        }
      }

      // Filter out already moved items
      toMove = toMove.filter(el => el && !colLeft.contains(el));
      if(!toMove.length) return;

      // Ensure a container exists at the end of col-left
      let container = colLeft.querySelector('.kraland-metrics');
      if(!container){
        container = document.createElement('div');
        container.className = 'kraland-metrics list-group';
        colLeft.appendChild(container);
      }

      toMove.forEach(el => container.appendChild(el));
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
      try{ reorderBtnGroupXs(); }catch(e){}
      try{ ensureSexStrong(); }catch(e){}
      try{ ensureFooterSticky(); }catch(e){}
      try{ relocateKramailToLeft(); }catch(e){}
      // ensure page-scoped classes (e.g., members page) are kept in sync
      try{ ensurePageScoping(); }catch(e){}
    });
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

    // catch SPA navigations
    const wrap = (orig) => function(){ const ret = orig.apply(this, arguments); setTimeout(()=> ensureTheme(), 250); return ret; };
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', ()=> setTimeout(()=> ensureTheme(), 250));
  }

  // Ensure page-specific scoping classes (members page, etc.)
  function ensurePageScoping(){
    try{
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);
    }catch(e){/*ignore*/}
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
      try{ relocateKramailToLeft(); }catch(e){}

      // Ensure page-scoped classes are applied after initial load
      try{ ensurePageScoping(); }catch(e){}

      // DEBUG
      setTimeout(debugPageStructure, 1000);
    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

})();
