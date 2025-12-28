// ==UserScript==
// @name         Kraland Theme (Bundled)
// @namespace    https://www.kraland.org/
// @version      1.0.1766960538954
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
  --kr-primary: #8b0f0e; /* slightly darker */
  --kr-primary-dark: #700b09;
  --kr-gold: #C69100;
  --kr-highlight: #c41e3a;
  --kr-surface: #fff;
  --kr-text: #0f1724;
  --kr-muted: #6b7280;
  --kr-navbar-bg: #111315;
  --kr-radius: .5rem;
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
  color: var(--kr-primary) !important;
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
  color: var(--kr-primary) !important;
  background: var(--kr-surface);
  border-radius: .35rem;
  border: 1px solid rgba(0,0,0,0.06);
  padding: .35rem .6rem;
}
.pagination > li > a:hover,
.pagination > li > span:hover {
  color: var(--kr-primary-dark) !important;
  background-color: rgba(0,0,0,0.02);
  text-decoration: none;
}
.pagination > li.active > a,
.pagination > li.active > span {
  background-color: var(--kr-primary) !important;
  color: var(--kr-surface) !important;
  border-color: var(--kr-primary-dark) !important;
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
  background-color: var(--kr-primary);
  border-color: var(--kr-primary-dark);
  color: #fff;
  box-shadow: 0 6px 18px rgba(165,18,13,0.12);
}

.btn.btn-primary:hover,
.btn.btn-primary:focus,
.btn-primary.btn:hover,
.btn-primary.btn:focus {
  background-color: var(--kr-primary-dark);
  border-color: var(--kr-primary-dark);
  box-shadow: 0 10px 24px rgba(165,18,13,0.14);
}

/* Info buttons - treated as primary in red theme */
.btn.btn-info,
.btn-info.btn,
.navbar-default .btn.btn-info {
  background-color: var(--kr-primary);
  border-color: var(--kr-primary-dark);
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
  background-color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  color: #fff !important;
}
html.kr-page-members .panel .btn:hover,
html.kr-page-members .panel a.btn:hover,
html.kr-page-members .panel button.btn:hover,
html.kr-page-members .panel input.btn:hover,
html.kr-page-members .panel .btn-block:hover,
html.kr-page-members .panel .btn-warning:hover,
html.kr-page-members .panel .btn-default:hover {
  background-color: var(--kr-primary-dark) !important;
  border-color: var(--kr-primary-dark) !important;
}

/* Specifically target ajax-inserted editor toolbars inside member pages and make their buttons white with red text */
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn,
html.kr-page-members [id^="ajax-"] .btn-toolbar a.btn,
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn-default {
  background-color: var(--kr-surface) !important;
  color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  background-image: none !important;
  box-shadow: none !important;
}
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn i,
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn .fa,
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn .fas,
html.kr-page-members [id^="ajax-"] .btn-toolbar .btn .far {
  color: inherit !important;
}

/* Super specific fallback to ensure editor buttons inside ajax containers get Kramail-like styling even if site CSS loads after our stylesheet */
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar a.btn,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn-default,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn {
  background-color: var(--kr-surface) !important;
  color: var(--kr-primary) !important;
  border-color: var(--kr-primary-dark) !important;
  background-image: none !important;
  box-shadow: none !important;
}
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn i,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn .fa,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn .fas,
html.kr-theme-enabled.kr-theme-enabled.kr-page-members [id^="ajax-"] .btn-toolbar .btn .far {
  color: inherit !important;
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
  border-color: var(--kr-primary);
  outline: none;
}

.form-group label {
  color: var(--kr-text);
  font-weight: 600;
}

/* Checkbox & radio - KEEP !important for browser default overrides */
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
  border-color: var(--kr-primary-dark);
}

.panel.panel-primary > .panel-heading {
  background-color: var(--kr-primary);
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
  background-color: var(--kr-primary);
  color: #fff;
  border-color: var(--kr-primary-dark);
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
  background-color: var(--kr-primary);
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

/* Contextual text utilities */
.text-primary,
.text-info {
  color: var(--kr-highlight);
}

/* Contextual links in components */
..list-group a:link,
.list-group a:visited,
.well a:link,
.well a:visited,
.panel a:link,
.panel a:visited,
.breadcrumb a:link,
.breadcrumb a:visited {
  color: var(--kr-highlight);
}

/* Carousel controls & navigation wells */
a.well.well-sm,
.carousel-control.left,
.carousel-control.right,
.prev,
.next {
  color: var(--kr-highlight);
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
  color: var(--kr-highlight) !important;
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
   POST EDITOR — unify toolbar & textarea inside .col-sm-10
   Ensure the toolbar buttons, dropdowns and the message textarea share
   the same size, border and color for improved visual consistency.
   This is scoped to the theme being enabled (html.kr-theme-enabled) to
   avoid unintended changes outside the editor.
   ============================================================================ */

html.kr-theme-enabled .col-sm-10 .btn-toolbar,
html.kr-theme-enabled .col-sm-10 textarea#message,
html.kr-theme-enabled .col-sm-10 .btn-group,
html.kr-theme-enabled .col-sm-10 .dropdown-menu {
  background: var(--kr-surface);
  color: var(--kr-text);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: .4rem;
}

/* Make toolbar buttons match form-control sizing and tone */
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn {
  padding: .55rem .8rem;
  min-height: 40px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: .95rem;
  background-color: var(--kr-surface);
  color: var(--kr-primary) !important; /* white button with red text */
  border: 1px solid rgba(0,0,0,0.06);
}

/* Ensure any nested text/icon inherits the red color */
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn * {
  color: var(--kr-primary) !important;
} 

/* Ensure textarea visually matches the toolbar */
html.kr-theme-enabled .col-sm-10 textarea#message {
  padding: .6rem;
  min-height: 40px; /* matches toolbar button min-height for visual parity */
  resize: vertical;
  font-size: .95rem;
}

/* Make dropdown content match the editor tone */
html.kr-theme-enabled .col-sm-10 .dropdown-menu {
  background: var(--kr-surface);
  border: 1px solid rgba(0,0,0,0.06);
  padding: .5rem;
}

/* Icon color and precise centering */
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* ensure consistent vertical centering */
  padding: .35rem .6rem;
  background-color: var(--kr-surface) !important; /* force white background to override members red rules */
  border-color: rgba(0,0,0,0.06) !important;
  color: var(--kr-primary) !important;
}
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn.btn-default {
  background-color: var(--kr-surface) !important;
  color: var(--kr-primary) !important;
}

html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn i,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn .fa,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn .far,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn .fas {
  display: inline-block;
  line-height: normal;
  font-size: 1.05rem; /* slightly larger to match visual weight */
  color: inherit !important; /* inherit red from button text */
}

html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn:hover i,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn:focus i {
  color: var(--kr-primary-dark) !important;
}

html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn:hover,
html.kr-theme-enabled .col-sm-10 .btn-toolbar .btn:focus {
  background-color: rgba(165,18,13,0.03);
  color: var(--kr-primary-dark);
}

/* small buttons adjust */
html.kr-theme-enabled .col-sm-10 .btn.btn-xs {
  height: 34px;
  padding: .3rem .5rem;
}

/* --------------------------------------------------------------------------
   Shared editor class: \`.editeur-text\`
   Apply the same rules as the Kramail editor to any container marked with
   \`.editeur-text\` (members signature editors, kramail editors, etc.)
   -------------------------------------------------------------------------- */
html.kr-theme-enabled .editeur-text .btn-toolbar,
html.kr-theme-enabled .editeur-text textarea,
html.kr-theme-enabled .editeur-text .btn-group,
html.kr-theme-enabled .editeur-text .dropdown-menu {
  background: var(--kr-surface);
  color: var(--kr-text);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: .4rem;
}

html.kr-theme-enabled .editeur-text .btn-toolbar .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: .35rem .6rem;
  background-color: var(--kr-surface) !important; /* force white background */
  color: var(--kr-primary) !important;               /* red text on white */
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-shadow: none !important;
}
html.kr-theme-enabled .editeur-text .btn-toolbar .btn i,
html.kr-theme-enabled .editeur-text .btn-toolbar .btn .fa,
html.kr-theme-enabled .editeur-text .btn-toolbar .btn .far,
html.kr-theme-enabled .editeur-text .btn-toolbar .btn .fas {
  display: inline-block;
  line-height: normal;
  font-size: 1.05rem;
  color: inherit !important; /* icons inherit red */
}

html.kr-theme-enabled .editeur-text .btn-toolbar .btn:hover i,
html.kr-theme-enabled .editeur-text .btn-toolbar .btn:focus i {
  color: var(--kr-primary-dark) !important;
}

html.kr-theme-enabled .editeur-text .btn-toolbar .btn:hover,
html.kr-theme-enabled .editeur-text .btn-toolbar .btn:focus {
  background-color: rgba(165,18,13,0.03) !important;
  color: var(--kr-primary-dark) !important;
}

/* small buttons adjust */
html.kr-theme-enabled .editeur-text .btn.btn-xs {
  height: 34px;
  padding: .3rem .5rem;
}

/* ============================================================================
   MEMBERS: signature editor — make toolbar/buttons behave like Kramail
   Target dynamic signature containers inserted by AJAX (id starts with ajax-s)
   ============================================================================ */

html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] textarea,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-group,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .dropdown-menu {
  background: var(--kr-surface);
  color: var(--kr-text);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: .4rem;
}

html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: .35rem .6rem;
  background-color: var(--kr-surface) !important; /* force white background to override members red rules */
  color: var(--kr-primary) !important; /* red text on white */
  border: 1px solid rgba(0,0,0,0.06) !important;
}
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn.btn-default {
  background-color: var(--kr-surface) !important;
  color: var(--kr-primary) !important;
}

/* Extra specificity: when a form#msg is inserted via AJAX, ensure toolbar buttons are white with red text */
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] form#msg .btn-toolbar .btn,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] form#msg .btn-toolbar .btn.btn-default {
  background: var(--kr-surface) !important;
  background-color: var(--kr-surface) !important;
  background-image: none !important;
  background-clip: padding-box !important;
  color: var(--kr-primary) !important;
  -webkit-text-fill-color: var(--kr-primary) !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-shadow: none !important;
}
/* Ensure nested nodes inherit red */
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn * {
  color: var(--kr-primary) !important;
}

html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn i,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn .fa,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn .far,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn .fas {
  display: inline-block;
  line-height: normal;
  font-size: 1.05rem;
  color: inherit !important; /* icons inherit red from button text */
}

html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn:hover i,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn:focus i {
  color: var(--kr-primary-dark) !important;
}

html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn:hover,
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar .btn:focus {
  background-color: rgba(165,18,13,0.03);
  color: var(--kr-primary-dark);
}

/* Keep image smileys intact (don't recolor img elements) */
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn-toolbar img {
  color: initial !important;
  filter: none !important;
}

/* small buttons adjust */
html.kr-theme-enabled.kr-page-members [id^="ajax-s"] .btn.btn-xs {
  height: 34px;
  padding: .3rem .5rem;
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
  // known theme slugs for persistence and class management
  const THEME_VARIANTS = ['kraland','empire-brun','paladium','theocratie-seelienne','paradigme-vert','khanat-elmerien','confederation-libre','royaume-ruthvenie','high-contrast'];

  async function applyThemeInline(cssText){
    try{
      let st = document.getElementById(STYLE_ID);
      if(st){ st.textContent = cssText; }
      else{ st = document.createElement('style'); st.id = STYLE_ID; st.textContent = cssText; document.head.appendChild(st); }
      // add marker class to html so we can scope variants later
      document.documentElement.classList.add('kr-theme-enabled');
      const variant = (localStorage.getItem(VARIANT_KEY) || 'kraland');
      // apply high contrast flag if requested
      document.documentElement.classList.toggle('kr-theme-high-contrast', variant === 'high-contrast');
      // ensure variant class is present and others removed so persistence works across pages
      try{
        THEME_VARIANTS.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
        if(variant && variant !== 'disable') document.documentElement.classList.add('kr-theme-variant-'+variant);
      }catch(e){}

      // Page-specific class: members list (/communaute/membres) - robust check
      const isMembers = (location && ( (location.pathname && location.pathname.indexOf('/communaute/membres') === 0) || (location.href && location.href.indexOf('/communaute/membres') !== -1) ));
      document.documentElement.classList.toggle('kr-page-members', !!isMembers);

      // tag activity icons (members / characters / online) so we can style them
      try{ markActiveIcons(); }catch(e){/*ignore*/}
      try{ replaceMcAnchors(); }catch(e){/*ignore*/}
      try{ replaceSImages(); }catch(e){/*ignore*/}
      try{ replaceNavbarBrand(); }catch(e){/*ignore*/}
      try{ reorderBtnGroupXs(); }catch(e){/*ignore*/}
      try{ ensureSexStrong(); }catch(e){/*ignore*/}

      // Ensure dropdown menu anchors remain readable even if other styles override
      try{
        let sd = document.getElementById('kr-dropdown-fix');
        const txt = `#navbar .dropdown-menu > li > a { color: var(--kr-text) !important; }\n#navbar .dropdown-menu > li > a:hover, #navbar .dropdown-menu > li > a:focus { color: var(--kr-primary) !important; background-color: rgba(0,0,0,0.03); }`;
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

  // Map theme variant slug to logo index used on img7 (logo1.gif..logo8.gif)
  function getLogoIndexForVariant(variant){
    try{
      const map = {
        'kraland': 1,
        'empire-brun': 2,
        'paladium': 3,
        'theocratie-seelienne': 4,
        'paradigme-vert': 5,
        'khanat-elmerien': 6,
        'confederation-libre': 7,
        'royaume-ruthvenie': 8
      };
      return map[variant] || 1;
    }catch(e){ return 1; }
  }

  // Replace the navbar brand text with the themed logo image (logoX.gif)
  function replaceNavbarBrand(){
    try{
      const brand = document.querySelector('.navbar-default .navbar-brand, .navbar .navbar-brand, #navbar .navbar-brand, .navbar-brand');
      if(!brand) return;
      const variant = (localStorage.getItem(VARIANT_KEY) || 'kraland');
      const idx = getLogoIndexForVariant(variant);
      const url = 'http://img7.kraland.org/2/world/logo' + idx + '.gif';
      const existing = brand.querySelector('img.kr-logo');
      if(existing && existing.src && existing.src.indexOf('logo'+idx+'.gif') !== -1) return; // already set
      // remove existing content but keep attributes
      try{ while(brand.firstChild) brand.removeChild(brand.firstChild); }catch(e){}
      const img = document.createElement('img');
      img.className = 'kr-logo';
      img.src = url;
      img.alt = 'Kraland';
      img.style.height = '28px';
      img.style.verticalAlign = 'middle';
      brand.appendChild(img);
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
      // style dynamically inserted signature editors
      try{ styleSignatureEditors(); }catch(e){}
      try{ ensureEditorClasses(); }catch(e){}
      try{ aggressiveScanEditors(); }catch(e){}
      // Ensure navbar brand uses the correct logo for the current variant
      try{ replaceNavbarBrand(); }catch(e){}
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

  // Apply a theme variant chosen by the user via Tampermonkey UI
  function applyThemeVariant(variant){
    try{
      // Known variants (shared constant)
      const variants = THEME_VARIANTS.slice();

      if(!variant || variant === 'disable'){
        // Disable theme: clear enabled flag and remove our style element
        localStorage.setItem(ENABLE_KEY, 'false');
        localStorage.removeItem(VARIANT_KEY);
        const st = document.getElementById(STYLE_ID);
        if(st && st.parentElement) st.parentElement.removeChild(st);
        document.documentElement.classList.remove('kr-theme-enabled');
        // remove any variant classes we previously set
        variants.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
        return;
      }

      // enable
      localStorage.setItem(ENABLE_KEY, 'true');
      // store the exact slug so it persists across page loads
      localStorage.setItem(VARIANT_KEY, variant);

      // remove all variant classes then add the requested one
      THEME_VARIANTS.forEach(v => document.documentElement.classList.remove('kr-theme-variant-'+v));
      try{ document.documentElement.classList.add('kr-theme-variant-'+variant); }catch(e){}

      // Reapply inline style and theme variables
      try{ applyThemeInline(BUNDLED_CSS); }catch(e){}

      // ensure any remaining theme markers are correct
      document.documentElement.classList.add('kr-theme-enabled');
    }catch(e){console.log('applyThemeVariant error', e);}  
  }

  // Insert a small UI control on /profil/interface to let the user choose a Tampermonkey theme
  function insertTampermonkeyThemeUI(){
    try{
      if(!(location && location.href && location.href.indexOf('/profil/interface') !== -1)) return;
      // attempt immediate insertion, falling back to polling/observer if the page builds content later
      function tryInsert(){
        try{
          const headings = Array.from(document.querySelectorAll('h4, h3, h2'));
          const target = headings.find(h => (h.textContent||'').trim().toLowerCase().indexOf('thème de base') !== -1);
          if(!target) return false;
          if(document.getElementById('kr-tamper-theme')) return true; // already present

          const container = document.createElement('div');
          container.id = 'kr-tamper-theme';
          container.className = 'well kr-tamper-theme';
          container.innerHTML = `
            <h4>Thème Tampermonkey (Activez le thème de base officiel pour éviter les conflits)</h4>
            <form id="kr-tamper-theme-form" class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-3 control-label">Choix</label>
                <div class="col-sm-9">
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f0.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="disable"> Désactiver la surcharge CSS</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f1.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="kraland"> République de Kraland</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f2.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="empire-brun"> Empire Brun</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f3.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="paladium"> Paladium Corporation</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f4.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="theocratie-seelienne"> Théocratie Seelienne</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f5.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="paradigme-vert"> Paradigme Vert</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f6.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="khanat-elmerien"> Khanat Elmérien</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f7.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="confederation-libre"> Confédération Libre</label></div>
                  <div class="radio"><span class="lefticon"><img src="http://img7.kraland.org/2/world/f8.png" width="15" height="10"></span><label> <input type="radio" name="kr-theme" value="royaume-ruthvenie"> Royaume de Ruthvénie</label></div>
                </div>
              </div>
            </form>
          `;

          target.parentElement.insertBefore(container, target);

          const form = container.querySelector('#kr-tamper-theme-form');
          function syncUI(){
            const enabled = localStorage.getItem(ENABLE_KEY);
            if(enabled === 'false'){
              const d = form.querySelector('input[value="disable"]'); if(d) d.checked = true;
              return;
            }
            const v = (localStorage.getItem(VARIANT_KEY) || 'kraland');
            const mapped = v === 'urss' ? 'kraland' : v;
            const el = form.querySelector('input[value="'+mapped+'"]');
            if(el) el.checked = true;
          }

          form.addEventListener('change', function(e){
            try{
              const sel = form.querySelector('input[name="kr-theme"]:checked');
              if(!sel) return;
              const val = sel.value;
              if(val === 'disable') applyThemeVariant('disable'); else applyThemeVariant(val);
              try{ const t = document.createElement('div'); t.className='alert alert-success'; t.textContent='Thème appliqué: '+val; container.appendChild(t); setTimeout(()=> t.parentElement && t.parentElement.removeChild(t), 1400); }catch(e){}
            }catch(er){console.log('kr-theme form change error', er);}        
          });

          // initialize UI
          syncUI();
          return true;
        }catch(e){ return false; }
      }

      if(!tryInsert()){
        // try a few times
        let attempts = 0;
        const id = setInterval(()=>{
          attempts++;
          if(tryInsert() || attempts > 25) clearInterval(id);
        }, 200);
      }

    }catch(e){console.log('insertTampermonkeyThemeUI error', e);}  
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
      try{ styleSignatureEditors(); }catch(e){}
      try{ aggressiveScanEditors(); }catch(e){}
      try{ observeEditorInsertions(); }catch(e){}
      try{ injectPageContextScript(); }catch(e){}

      // Ensure page-scoped classes are applied after initial load
      try{ ensurePageScoping(); }catch(e){}
      try{ insertTampermonkeyThemeUI(); }catch(e){}

      // DEBUG
      setTimeout(debugPageStructure, 1000);
      // Start periodic editor checks for first 60s to catch late AJAX inserts or missed wrappers
      try{ startPeriodicEditorChecks(); }catch(e){}
      // Move our style element to the end of the <head> after a short delay so it takes precedence over late-loading site CSS
      try{ setTimeout(()=>{ const st = document.getElementById(STYLE_ID); if(st && st.parentElement) st.parentElement.appendChild(st); }, 1000); }catch(e){}      // ensure color pickers show correctly after init
      try{ setTimeout(fixColorButtons, 500); }catch(e){};
      // wrap AJAX update helpers used by the site so we can re-style dynamic inserts
      try{
        // If updateAjax exists now, wrap immediately; otherwise poll until defined
        function wrapUpdateFns(){
          try{
            if(window.updateAjax && typeof window.updateAjax === 'function' && !window._kr_wrapped_updateAjax){
              const _u = window.updateAjax;
              window.updateAjax = function(){ const r = _u.apply(this, arguments); setTimeout(styleSignatureEditors, 50); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(ensureEditorClasses, 60); setTimeout(ensureEditorClasses, 220); setTimeout(ensureEditorClasses, 620); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); return r; };
              window._kr_wrapped_updateAjax = true;
            }
            if(window.updateAjaxPost && typeof window.updateAjaxPost === 'function' && !window._kr_wrapped_updateAjaxPost){
              const _up = window.updateAjaxPost;
              window.updateAjaxPost = function(){ const r=_up.apply(this, arguments); setTimeout(styleSignatureEditors, 50); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(ensureEditorClasses, 60); setTimeout(ensureEditorClasses, 220); setTimeout(ensureEditorClasses, 620); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); return r; };
              window._kr_wrapped_updateAjaxPost = true;
            }
          }catch(e){}
        }
        wrapUpdateFns();
        const _wrapInterval = setInterval(()=>{ wrapUpdateFns(); if(window._kr_wrapped_updateAjax && window._kr_wrapped_updateAjaxPost) clearInterval(_wrapInterval); }, 200);
      }catch(e){}

      // click delegation fallback: when anchors with inline updateAjax are clicked, schedule the styling
      try{
        document.addEventListener('click', function(e){
          try{
            const a = e.target.closest && e.target.closest('a[href^="javascript:updateAjax"], a[href^="javascript:updateAjaxPost"]');
            if(a){ setTimeout(styleSignatureEditors, 60); setTimeout(styleSignatureEditors, 200); setTimeout(styleSignatureEditors, 600); setTimeout(aggressiveScanEditors, 80); setTimeout(aggressiveScanEditors, 240); setTimeout(aggressiveScanEditors, 640); }
          }catch(er){}
        }, true);
      }catch(e){}

    }catch(e){ console.error('Kraland theme init failed', e); }
  })();

  // Apply inline styles to signature editor toolbars inserted by AJAX so buttons are white with red text
  function styleSignatureEditors(){
    try{
      // Find editors inserted by AJAX as well as editors present directly on the page (Kramail new post)
      const editors = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, form#msg, form[name="post_msg"], form'))
        .filter(f => f && (f.querySelector('.btn-toolbar') || f.querySelector('textarea#message, textarea[name="message"], textarea[name="msg"], textarea#msg, textarea')));
      console.log('styleSignatureEditors: found editors', editors.length);
      editors.forEach(form => {
        if(form.getAttribute('data-kr-styled') === '1') { console.log('styleSignatureEditors: already styled'); return; }
        form.setAttribute('data-kr-styled', '0');
        let attempts = 0;
        const apply = () => {
          attempts++;
          const btns = Array.from(form.querySelectorAll('.btn-toolbar .btn'));
          console.log('styleSignatureEditors: attempt', attempts, 'btns', btns.length);
          if(btns.length){
            btns.forEach(b => {
              try{
                // Skip buttons that appear to be color swatches/pickers: either they or their descendants already have a non-transparent background color.
                const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                const btnHasBg = (function(){
                  try{
                    const cs = getComputedStyle(b);
                    if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                    const child = Array.from(b.querySelectorAll('*')).find(el=>{
                      const c = getComputedStyle(el);
                      return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                    });
                    return !!child;
                  }catch(e){ return false; }
                })();
                // If this is a known color-button, remove any white background we may have previously set so the palette shows correctly
                if(isColorButton){
                  try{
                    // Restore or enforce the color swatch background (read from inline 'background' or from addtag color name)
                    const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                    const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                    if(mRgb){
                      b.style.setProperty('background-color', mRgb[0], 'important');
                      b.style.removeProperty('background-image');
                    }else{
                      // fallback: map common color names to approximate rgb
                      const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                      const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                      if(mm && map[mm[1].toLowerCase()]){
                        b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important');
                        b.style.removeProperty('background-image');
                      }
                    }
                  }catch(e){}
                }
                if(!btnHasBg && !isColorButton){
                  b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                  b.style.setProperty('background-image', 'none', 'important');
                }
                b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                b.style.setProperty('box-shadow', 'none', 'important');
                const icons = b.querySelectorAll('i, .fa, .fas, .far');
                icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
              }catch(e){ console.log('styleSignatureEditors: apply error', e); }
            });
            // ensure the form is tagged so CSS rules for editors apply
            try{ form.classList.add('editeur-text'); }catch(e){}
            form.setAttribute('data-kr-styled', '1');
            console.log('styleSignatureEditors: applied to form', form.id || form.parentElement.id);
            try{ setTimeout(fixColorButtons, 20); }catch(e){}
            return;
          }
          if(attempts < 8) setTimeout(apply, 150);
          else console.log('styleSignatureEditors: giving up after attempts', attempts);
        };
        apply();
      });
      // Also apply to standalone toolbars that are not inside a form (e.g., Kramail new post)
      try{
        const pageToolbars = Array.from(document.querySelectorAll('.btn-toolbar'));
        pageToolbars.forEach(tb => {
          try{
            // Consider only toolbars that appear near a message input/textarea
            const nearInput = tb.closest('form') || tb.closest('[id^="ajax-"]') || (tb.nextElementSibling && (tb.nextElementSibling.matches && tb.nextElementSibling.matches('textarea, input'))) || (tb.parentElement && /(message|Votre message|Message)/i.test(tb.parentElement.textContent || ''));
            if(!nearInput) return;
            const btns = Array.from(tb.querySelectorAll('.btn'));
            if(!btns.length) return;
            btns.forEach(b => {
              try{
                const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                const btnHasBg = (function(){ try{ const cs = getComputedStyle(b); if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true; const child = Array.from(b.querySelectorAll('*')).find(el=>{ const c = getComputedStyle(el); return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent'; }); return !!child; }catch(e){ return false; } })();
                if(isColorButton){
                  try{
                    const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                    const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                    if(mRgb){ b.style.setProperty('background-color', mRgb[0], 'important'); b.style.removeProperty('background-image'); }
                    else{
                      const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                      const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                      if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                    }
                  }catch(e){}
                }
                if(!btnHasBg && !isColorButton){
                  b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                  b.style.setProperty('background-image', 'none', 'important');
                }
                b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                b.style.setProperty('box-shadow', 'none', 'important');
                b.setAttribute('data-kr-styled','1');
                const f = b.closest('form'); if(f) f.classList.add('editeur-text');
                const icons = b.querySelectorAll('i, .fa, .fas, .far'); icons.forEach(i=> i.style.setProperty('color','inherit','important'));
              }catch(e){}
            });
            try{ setTimeout(fixColorButtons, 20); }catch(e){}
          }catch(e){}
        });
      }catch(e){}
    }catch(e){console.log('styleSignatureEditors: error', e);}  

  // After styling passes, ensure color selector buttons show their real colors (override any earlier white !important)
  function fixColorButtons(){
    try{
      const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)', white:'rgb(255,255,255)'};
      const els = Array.from(document.querySelectorAll('a[href*="addtag("]'));
      els.forEach(b => {
        try{
          const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
          const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
          if(mm && map[mm[1].toLowerCase()]){
            b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important');
            b.style.setProperty('background-image', 'none', 'important');
            b.setAttribute('data-kr-styled','1');
          }
        }catch(e){}
      });
    }catch(e){}
  }

  // Ensure aggressive scans and observers call fixColorButtons as well


  // Aggressive interval-based scan to catch editors inserted by AJAX when other hooks miss them
  function aggressiveScanEditors(){
    try{
      console.log('aggressiveScanEditors: start');
      let attempts = 0;
      const maxAttempts = 30; // ~6s at 200ms interval
      const id = setInterval(() => {
        attempts++;
        const newBtns = Array.from(document.querySelectorAll('[id^="ajax-"] .btn-toolbar .btn:not([data-kr-styled])'));
        if(newBtns.length){
          console.log('aggressiveScanEditors: found', newBtns.length);
          newBtns.forEach(b => {
            try{
              // Detect known color buttons and skip forcing their background; also remove any white bg we previously applied
              const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
              const btnHasBg = (function(){
                  try{
                    const cs = getComputedStyle(b);
                    if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                    const child = Array.from(b.querySelectorAll('*')).find(el=>{
                      const c = getComputedStyle(el);
                      return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                    });
                    return !!child;
                  }catch(e){ return false; }
                })();
              if(isColorButton){
                try{
                  const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                  const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                  if(mRgb){
                    b.style.setProperty('background-color', mRgb[0], 'important');
                    b.style.removeProperty('background-image');
                  }else{
                    const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                    const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                    const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                    if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                  }
                }catch(e){}
              }
              if(!btnHasBg && !isColorButton){
                b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                b.style.setProperty('background-image', 'none', 'important');
              }
              b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
              b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
              b.style.setProperty('box-shadow', 'none', 'important');
              b.setAttribute('data-kr-styled', '1');
              const f = b.closest('form'); if(f) f.classList.add('editeur-text');
              const icons = b.querySelectorAll('i, .fa, .fas, .far');
              icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
            }catch(e){console.log('aggressiveScanEditors: apply error', e);} 
          });
          try{ setTimeout(fixColorButtons, 20); }catch(e){}
        }
        if(attempts >= maxAttempts || newBtns.length === 0 && attempts > 3) { console.log('aggressiveScanEditors: clearing after attempts', attempts, 'found', newBtns.length); clearInterval(id); }
      }, 200);
    }catch(e){console.log('aggressiveScanEditors: error', e);} 
  }

  // Periodic starter to re-run scans for a short period to catch late updates
  function startPeriodicEditorChecks(){
    try{
      let ticks = 0;
      const pid = setInterval(()=>{
        ticks++;
        try{ aggressiveScanEditors(); }catch(e){}
        if(ticks > 60) clearInterval(pid);
      }, 1000);
    }catch(e){}
  }

  // Observer that reacts to inserted nodes with id^="ajax-" and immediately applies inline styles
  function observeEditorInsertions(){
    try{
      const applyImmediate = (root)=>{
        try{
          const containers = [];
          if(root.matches && root.matches('[id^="ajax-"]')) containers.push(root);
          containers.push(...Array.from(root.querySelectorAll('[id^="ajax-"]')));
          containers.forEach(c => {
            try{
              const btns = Array.from(c.querySelectorAll('.btn-toolbar .btn'));
              if(btns.length){
                btns.forEach(b => {
                  try{
                    // Detect known color buttons and skip forcing their background; also remove any white bg we previously applied
                    const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                    const btnHasBg = (function(){
                      try{
                        const cs = getComputedStyle(b);
                        if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                        const child = Array.from(b.querySelectorAll('*')).find(el=>{
                          const c = getComputedStyle(el);
                          return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                        });
                        return !!child;
                      }catch(e){ return false; }
                    })();
                    if(isColorButton){ try{ b.style.removeProperty('background-color'); b.style.removeProperty('background-image'); }catch(e){} }
                    if(!btnHasBg && !isColorButton){
                      b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                      b.style.setProperty('background-image', 'none', 'important');
                    }
                    b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                    b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                    b.style.setProperty('box-shadow', 'none', 'important');
                    b.setAttribute('data-kr-styled','1');
                    const f = b.closest('form'); if(f) f.classList.add('editeur-text');
                    const icons = b.querySelectorAll('i, .fa, .fas, .far');
                    icons.forEach(i => i.style.setProperty('color', 'inherit', 'important'));
                  }catch(e){}
                });
              }
            }catch(e){}
          });
        }catch(e){}
      };

      const m = new MutationObserver((mutations)=>{
        for(const mu of mutations){
          for(const n of Array.from(mu.addedNodes || [])){
            if(n.nodeType !== 1) continue;
            try{ applyImmediate(n); }catch(e){}
          }
        }
      });
      m.observe(document.body || document.documentElement, { childList: true, subtree: true });
      // apply to existing ajax containers on load
      try{ applyImmediate(document); }catch(e){}
    }catch(e){/*ignore*/}
  }
  // Inject a small script into the page context so we can apply inline '!important' styles
  // at the exact moment the site inserts AJAX content (more robust: retry + append to multiple roots)
  function injectPageContextScript(){
    try{
      if(document.getElementById('kr-injected-editor-style')) return;

      function makeScript(){
        const s = document.createElement('script');
        s.id = 'kr-injected-editor-style';
        s.type = 'text/javascript';
        s.textContent = `(function(){
          try{
            window.__kr_editor_injected = true;
            console.log('kr: page-context script initialized');
          }catch(e){}

          function applyToContainer(c){
            try{
              if(!c) return;
              const btns = c.querySelectorAll('.btn-toolbar .btn');
              if(!btns || !btns.length) return;
              btns.forEach(function(b){
                try{
                  // Detect known color buttons and skip forcing their background; also remove any white bg we may have previously set
                  const isColorButton = (function(){ try{ const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || ''; const m = href.match(/addtag\('\s*([^']+?)\s*'/i); return !!(m && /^(yellow|orange|fuchsia|red|olive|lightgreen|green|teal|lightblue|blue|navy|purple|indigo|maroon|brown|gray|darkgray|black|white)$/i.test(m[1])); }catch(e){return false;} })();
                  const btnHasBg = (function(){
                      try{
                        const cs = getComputedStyle(b);
                        if(cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent' && cs.backgroundColor !== 'rgb(255, 255, 255)') return true;
                        const child = Array.from(b.querySelectorAll('*')).find(function(el){
                          const c = getComputedStyle(el);
                          return c && c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent';
                        });
                        return !!child;
                      }catch(e){ return false; }
                    })();
                  if(isColorButton){
                    try{
                      const inlineBg = b.style.getPropertyValue('background') || b.style.getPropertyValue('background-color') || '';
                      const mRgb = inlineBg.match(/rgb\([^)]*\)/);
                      if(mRgb){
                        b.style.setProperty('background-color', mRgb[0], 'important');
                        b.style.removeProperty('background-image');
                      }else{
                        const href = (b.getAttribute && (b.getAttribute('href') || b.getAttribute('onclick'))) || '';
                        const mm = href.match(/addtag\('\s*([^']+?)\s*'/i);
                        const map = { yellow:'rgb(244,172,0)', orange:'rgb(247,116,0)', fuchsia:'rgb(237,97,97)', red:'rgb(213,0,0)', olive:'rgb(128,128,0)', lightgreen:'rgb(33,156,90)', green:'rgb(0,111,0)', teal:'rgb(0,128,128)', lightblue:'rgb(85,119,188)', blue:'rgb(43,43,228)', navy:'rgb(0,0,128)', purple:'rgb(128,0,128)', indigo:'rgb(75,0,130)', maroon:'rgb(128,0,0)', brown:'rgb(94,67,45)', gray:'rgb(128,128,128)', darkgray:'rgb(90,90,90)', black:'rgb(0,0,0)' };
                        if(mm && map[mm[1].toLowerCase()]){ b.style.setProperty('background-color', map[mm[1].toLowerCase()], 'important'); b.style.removeProperty('background-image'); }
                      }
                    }catch(e){}
                  }
                  if(!btnHasBg && !isColorButton){
                    b.style.setProperty('background-color', getComputedStyle(document.documentElement).getPropertyValue('--kr-surface') || '#fff', 'important');
                    b.style.setProperty('background-image', 'none', 'important');
                  }
                  b.style.setProperty('color', getComputedStyle(document.documentElement).getPropertyValue('--kr-primary') || '#8b0f0e', 'important');
                  b.style.setProperty('border', '1px solid rgba(0,0,0,0.06)', 'important');
                  b.style.setProperty('box-shadow', 'none', 'important');
                  b.setAttribute('data-kr-styled','1');
                  try{ var f = b.closest('form'); if(f) f.classList.add('editeur-text'); }catch(e){}
                  const icons = b.querySelectorAll('i, .fa, .fas, .far');
                  icons.forEach(function(i){ try{ i.style.setProperty('color','inherit','important'); }catch(e){} });
                }catch(e){/*ignore*/}
              });
              try{ setTimeout(fixColorButtons, 20); }catch(e){}
            }catch(e){/*ignore*/}
          }

          function wrap(fnName){
            try{
              if(window[fnName] && !window['_kr_wrapped_'+fnName]){
                const orig = window[fnName];
                window[fnName] = function(){
                  const r = orig.apply(this, arguments);
                  setTimeout(function(){
                    try{
                      var id = arguments && arguments[0] ? arguments[0] : null;
                      if(id){ var c = document.getElementById(id); if(c) applyToContainer(c); }
                    }catch(e){}
                    try{ Array.from(document.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer); }catch(e){}
                  }, 10);
                  return r;
                };
                window['_kr_wrapped_'+fnName] = true;
                console.log('kr: wrapped', fnName);
              }
            }catch(e){/*ignore*/}
          }

          wrap('updateAjax');
          wrap('updateAjaxPost');

          var mo = new MutationObserver(function(muts){
            for(var mu of muts){
              for(var n of Array.from(mu.addedNodes || [])){
                try{
                  if(n && n.nodeType === 1){
                    if(n.id && n.id.indexOf('ajax-') === 0) applyToContainer(n);
                    else if(n.querySelector && n.querySelector('[id^="ajax-"]')) Array.from(n.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer);
                  }
                }catch(e){}
              }
            }
          });
          mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

          // initial pass
          try{ Array.from(document.querySelectorAll('[id^="ajax-"]')).forEach(applyToContainer); }catch(e){}
        })();`;
        return s;
      }

      // Try to append immediately and retry a few times if needed
      let attempts = 0;
      const maxAttempts = 40; // ~10s
      const tryAppend = () => {
        try{
          if(document.getElementById('kr-injected-editor-style')) return true;
          const s = makeScript();
          try{ (document.head || document.documentElement).appendChild(s); }catch(e){ try{ document.documentElement.appendChild(s); }catch(e){} }
          if(document.getElementById('kr-injected-editor-style')){ console.log('kr: injected script into page context'); return true; }
        }catch(e){/*ignore*/}
        return false;
      };

      if(tryAppend()) return;
      const int = setInterval(()=>{
        attempts++;
        if(tryAppend()){ clearInterval(int); }
        else if(attempts >= maxAttempts){ clearInterval(int); console.log('kr: failed to inject page-context script after attempts'); }
      }, 250);
    }catch(e){console.log('injectPageContextScript error', e);} 
  }  }

  // Tag any editor containers with `.editeur-text` so CSS can target them uniformly
  function ensureEditorClasses(){
    try{
      const candidates = Array.from(document.querySelectorAll('[id^="ajax-"] form#msg, [id^="ajax-"] textarea, .col-sm-10 form#msg, .col-sm-10 textarea#message, form[name="post_msg"], textarea#message'));
      console.log('ensureEditorClasses: candidates', candidates.length);
      candidates.forEach(el => {
        try{
          const root = el.tagName && el.tagName.toLowerCase() === 'form' ? el : (el.closest('form') || el.parentElement);
          if(root && !root.classList.contains('editeur-text')){
            root.classList.add('editeur-text');
            // also mark to avoid reprocessing
            root.setAttribute('data-kr-styled', root.getAttribute('data-kr-styled') || '0');
            console.log('ensureEditorClasses: tagged', root.id || root.parentElement && root.parentElement.id || 'no-id');
          }
        }catch(e){}
      });
    }catch(e){ console.log('ensureEditorClasses error', e); }
  }

  // ensureSignatureEditors is also invoked from the MutationObserver to catch dynamic insertions
  // Add to startObservers' MO callback earlier (we already trigger styleSignatureEditors() on init)
  

})();
