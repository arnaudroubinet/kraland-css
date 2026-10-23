// Couleurs de nation et contrastes (épopée 3, ticket 1, balle traçante) : jetons de rôle des 16 variantes et liens en couleur d'accent
// (H5.2, Q1, Q2, R7). Une vérification par ligne de la matrice du plan (story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent) :
//   jetons          les 15 jetons de DESIGN.md › Colors › Valeurs par variante (primary à btn-shadow), à 1 près par canal, dans les 16 variantes,
//                   à 375 × 667 et 1280 px ; lus sur une sonde avec les replis des règles qui les emploient (action-* : --kr-arm-*, sinon
//                   --kr-primary, --kr-primary-dark ou blanc) ;
//   liens au repos  lien posé sur le fond de page et lien dans un panneau : couleur --kr-text-accent (valeur de DESIGN.md), ≥ 4,5:1 sur leur
//                   fond effectif, non soulignés ;
//   survol          les mêmes liens survolés (1280 px) : couleur inchangée, soulignés ;
//   Empire Brun     en clair, lien en #8a5a00 au lieu de l'or #c69100 (2,82:1) ;
//   consommateurs   button.btn-primary et a.btn-primary (bordure et ombre au repos, fond au survol), alerte info du clair (fond, bordure) et
//                   entrée sans lien de la liste latérale survolée (texte ≥ 4,5:1) : valeurs des jetons de la variante, aucun rouge Kraland hors
//                   Kraland ;
//   primaire foncée texte posé sur --kr-primary-dark, qui prend la paire de survol d'action (--kr-arm-bg-hover, --kr-arm-ink-hover) : boutons
//                   primaires, croix des panneaux mobiles (.kr-mobile-close) et « tout voir » du changelog (.kr-changelog-view-all) survolés
//                   (16 variantes, 1280 px) : texte ≥ 4,5:1 sur son fond, fond et texte de la paire ;
//   alerte sombre   .alert-info des 8 variantes sombres : fond et bordure inchangés (rgb(122, 82, 64) à 0,15 et 0,3), repris au ticket 5 ;
//   largeurs        767, 768, 769, 1440 et 1920 px, Kraland et Empire Brun sombre : mêmes valeurs qu'à 375 et 1280 px ;
//   peau coupée     kr-theme-enabled = false : liens et boutons primaires Bootstrap natifs (#337ab7), aucun jeton de la surcharge.
// Ticket 2 (Q1, H5.1 ; plan story-boutons-primaires-et-texte-pose-sur-la-couleur-de-nation) : tout fond en couleur de nation prend la paire
// d'action et tout texte posé dessus l'encre assortie (repos : --kr-arm-bg / --kr-arm-ink ; survol, appui, primaire foncée : paire de survol) :
//   boutons         5 balises (button, a, label, span, input), états de classe (active, focus, disabled, attribut disabled), pseudo-classes
//                   forcées (:hover, :focus, :active), menu ouvert, ensemble désactivé (1280 px, 16 variantes) : fond, texte et bordure de la
//                   paire de l'état, ≥ 4,5:1, aucun bleu de Bootstrap en clair ; badge interne en paire inverse ;
//   composants      chaque élément de la liste du ticket présent dans la fixture (COMPOSANTS), 375 et 1280 px, 16 variantes : paire au repos,
//                   puis pseudo-classe forcée (survol sur ordinateur, appui sur mobile), ≥ 4,5:1 ; le « + » du sous-forum (créé par le
//                   template sur mobile depuis le titre à deux liens de la fixture) compris ;
//   balayage        fixtures de référence (report, plateau, sujet, sous-forum, index RP, réception du kramail), 375 et 1280 px, 16 variantes :
//                   tout texte visible dont le fond effectif est une couleur de nation ≥ 4,5:1, au repos et pseudo-classe forcée sur les
//                   éléments interactifs ; dossier actif du kramail en paire ; barre d'envoi fixe pressée (rédaction, mobile) en paire de survol.
// Ticket 3 (H5.6, Q2 ; plan story-texte-colore-lisible-plus-de-rouge-kraland-ni-de-bleu-bootst) : tout texte en primaire ou en primaire foncée
// passe à --kr-text-accent, rouge Kraland et bleu #2196F3 en dur remplacés par des jetons de la nation :
//   texte coloré    un échantillon par règle effective (TEXTES), dans sa page (fixtures synthétiques palette-nation-textes.html et
//                   palette-nation-accueil.html, sous-forum, réception et rédaction du kramail), 375 et 1280 px, 16 variantes, au repos ou
//                   pseudo-classe forcée (survol sur ordinateur, appui ou toucher sur mobile) : --kr-text-accent, ≥ 4,5:1, opacité
//                   comprise (modale du changelog, noire dans toutes les variantes : texte clair hérité de la modale) ;
//   sombre          balayage de ces pages et du sujet, repos, survol, appui et focus forcés : aucun texte en primaire ni en primaire foncée
//                   hors texte posé sur la couleur de nation ; liens des alertes info, avertissement et danger en accent ;
//   nations         .f1 à .f9 posées sur bg-surface, 8 variantes sombres : ≥ 4,5:1 ;
//   en dur          barre d'outils d'une confirmation, en-tête repliable, champ au focus, carte du forum, mini-chat, barre
//                   du kramail (DURS), 15 variantes hors Kraland : aucun rgb(139, 15, 14) ni #2196F3 calculé ; mini-chat en paire d'action,
//                   contour de la carte du forum au focus en accent ;
//   largeurs        767, 768, 769, 1440 et 1920 px, Kraland et Empire Brun sombre : mêmes couleurs qu'à 375 ou 1280 px.
// Ticket 4 (H5.3, Q26 ; plan story-mode-clair-theme-comme-le-sombre-bouton-standard) : une seule série de règles pour les deux modes, sur les
// jetons qui changent avec le mode :
//   composants      fixture synthétique palette-nation-composants.html, 375 et 1280 px, 16 variantes : en-tête et pied du panneau standard,
//                   en-têtes de tableau (Bootstrap, DataTables) en header-tint, bordure border-tint, texte text-primary (sur mobile, l'en-tête
//                   garde la carte mobile) ; onglets bordés de border-tint, actif sur bg-surface ; bouton standard (button, a, input, états de
//                   classe, menu ouvert, désactivés, « ? Aide », :hover, :active, :focus forcés) en bg-surface, survol et appui en header-tint,
//                   bordure border-tint, texte text-nation ≥ 4,5:1 ; hr masqué ; en clair, aucun gris de Bootstrap et --kr-text-secondary
//                   #636a77, ≥ 4,5:1 sur blanc, bg-page, header-tint et info-bg ;
//   pages           sujet, sous-forum, index RP, réception du kramail, plateau, 375 et 1280 px, 16 variantes : composants comparés au bundle
//                   d'avant le ticket (règles propres à la page gardées), texte des composants ≥ 4,5:1 ;
//   largeurs        767, 768, 769, 1440 et 1920 px, Kraland et Empire Brun sombre : mêmes valeurs qu'à 375 ou 1280 px.
// Hors de ces tickets, donc non vérifiés ici : en-têtes des panneaux d'état et alertes (ticket 5), focus (ticket 7), onglet actif et
// « Valider » de la modale d'ordre (ticket 2.6).
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/palette-nation.html) servie à /regles/avancees ; vrai Bootstrap 3.3.7 (tests/e2e/vendor) ;
// variantes ouvertes et contrastes mesurés par l'outil partagé (lib/variantes.mjs). Confinement réseau ; gestes : le survol à la souris et
// les pseudo-classes forcées par le protocole du navigateur (CSS.forcePseudoState), aucun clic, aucun envoi.
//
// Usage : npm run build && node tests/e2e/palette-nation.mjs   (ou npm run test:zone -- palette-nation)
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = mobile, bureau, largeurs, peau-coupee, balayage-mobile,
//           balayage-bureau, textes-mobile, textes-bureau, textes-largeurs, composants-mobile, composants-bureau, composants-largeurs,
//           composants-pages-mobile, composants-pages-bureau (vide = tout) ; KR_SCRIPT_AVANT (bundle d'avant le ticket 4, pages).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { frames, krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';
import { COMPOSANTS_TICKET4, CONTRASTE, TEXTE_SECONDAIRE_CLAIR, VARIANTES, VARIANTE_POSEE, choisirVariante, parVariante, poserJetonsRedefinis } from './lib/variantes.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const userscript = fs.readFileSync(process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js'), 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(here, 'fixtures/palette-nation.html'), 'utf8');
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(here, 'vendor');
if (!['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(VENDOR, f)))) { console.error('Bootstrap 3.3.7 / jQuery incomplets dans ' + VENDOR); process.exit(2); }
const SHOTS = process.env.KR_SHOTS || '';
const BASE = 'http://www.kraland.org';
const PAGE = BASE + '/regles/avancees';
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

// Jetons de DESIGN.md › Colors (tableaux « Couleur de nation et texte coloré », « Encre d'action », « Teintes, alerte info et ombre »), et
// expression lue sur la sonde. ABSENT : repli d'un jeton nouveau, pour qu'un jeton non déclaré se lise comme tel.
const ABSENT = 'rgb(1, 2, 3)';
const JETONS = [
  ['primary', 'var(--kr-primary)'],
  ['primary-strong', 'var(--kr-primary-dark)'],
  ['highlight', 'var(--kr-highlight)'],
  ['highlight-reverse', 'var(--kr-highlight-reverse)'],
  ['text-accent', `var(--kr-text-accent, ${ABSENT})`],
  ['text-nation', `var(--kr-text-nation, ${ABSENT})`],
  ['action-bg', 'var(--kr-arm-bg, var(--kr-primary))'],
  ['action-ink', 'var(--kr-arm-ink, var(--kr-white))'],
  ['action-bg-hover', 'var(--kr-arm-bg-hover, var(--kr-primary-dark))'],
  ['action-ink-hover', 'var(--kr-arm-ink-hover, var(--kr-white))'],
  ['header-tint', `var(--kr-header-tint, ${ABSENT})`],
  ['border-tint', `var(--kr-border-tint, ${ABSENT})`],
  ['info-bg', 'var(--kr-alert-info-bg)'],
  ['info-border', 'var(--kr-alert-info-border)'],
  ['btn-shadow', 'var(--kr-btn-shadow)']
];
// Valeurs de DESIGN.md, dans l'ordre de JETONS (hexadécimal sur 6 chiffres, 8 avec l'opacité).
const DESIGN = {
  kraland: ['#8b0f0e', '#6f0c0b', '#c41e3a', '#f6dde1', '#c41e3a', '#8b0f0e', '#8b0f0e', '#ffffff', '#6f0c0b', '#ffffff', '#f6ecec', '#ead4d4', '#f8f1f1', '#efdddd', '#8b0f0e1f'],
  'empire-brun': ['#5e3b2d', '#4b2f24', '#c69100', '#f6efd9', '#8a5a00', '#5e3b2d', '#5e3b2d', '#ffffff', '#4b2f24', '#ffffff', '#f2efee', '#e2dcd9', '#f5f3f2', '#e8e4e2', '#5e3b2d1f'],
  paladium: ['#d4af37', '#aa8c2c', '#044c17', '#d9e4dc', '#044c17', '#044c17', '#d4af37', '#1e1a15', '#aa8c2c', '#1e1a15', '#fcf9ef', '#f7f1db', '#fcfaf3', '#f9f4e3', '#d4af371f'],
  'theocratie-seelienne': ['#0033a0', '#002980', '#2d5fcb', '#e0e7f7', '#2d5fcb', '#0033a0', '#0033a0', '#ffffff', '#002980', '#ffffff', '#ebeff7', '#d1daee', '#f0f3f9', '#dbe2f2', '#0033a01f'],
  'paradigme-vert': ['#0b6623', '#09521c', '#063803', '#dae1d9', '#063803', '#0b6623', '#0b6623', '#ffffff', '#09521c', '#ffffff', '#ebf3ed', '#d3e3d7', '#f0f6f2', '#ddeae0', '#0b66231f'],
  'khanat-elmerien': ['#6a0dad', '#550a8a', '#7b4c9c', '#ebe4f0', '#7b4c9c', '#6a0dad', '#6a0dad', '#ffffff', '#550a8a', '#ffffff', '#f3ecf8', '#e4d3f0', '#f6f0fa', '#eaddf4', '#6a0dad1f'],
  'confederation-libre': ['#6b7280', '#565b66', '#475369', '#e3e5e9', '#475369', '#475369', '#6b7280', '#ffffff', '#565b66', '#ffffff', '#f3f4f5', '#e4e6e8', '#f6f7f7', '#eaebed', '#6b72801f'],
  'royaume-ruthvenie': ['#0a6b2d', '#085624', '#c41e3a', '#f6dde1', '#c41e3a', '#0a6b2d', '#0a6b2d', '#ffffff', '#085624', '#ffffff', '#ebf3ee', '#d3e4d9', '#f0f6f2', '#ddeae2', '#0a6b2d1f'],
  'kraland-dark': ['#c45252', '#8b0f0e', '#e07070', '#1a0505', '#e07070', '#e07070', '#b64c4c', '#f5f1ed', '#8b0f0e', '#f5f1ed', '#2a1f1f', '#ffffff14', '#371e1e', '#502727', '#c452521f'],
  'empire-brun-dark': ['#7a5240', '#5e3b2d', '#d4a574', '#1a0f0a', '#d4a574', '#d4a574', '#7a5240', '#ffffff', '#5e3b2d', '#ffffff', '#2a251f', '#ffffff14', '#2c221b', '#3a2b22', '#7a52401f'],
  'paladium-dark': ['#e6c76e', '#d4af37', '#4a9d5f', '#021a0a', '#4a9d5f', '#4a9d5f', '#e6c76e', '#1e1a15', '#d4af37', '#1e1a15', '#252015', '#ffffff14', '#39321e', '#574d2c', '#e6c76e1f'],
  'theocratie-seelienne-dark': ['#5a8fd9', '#2d5fcb', '#80b3ff', '#000d1f', '#80b3ff', '#80b3ff', '#5a8fd9', '#1e1a15', '#2d5fcb', '#f5f1ed', '#1a2438', '#ffffff14', '#1d2a44', '#283c5f', '#5a8fd91f'],
  'paradigme-vert-dark': ['#4d9c61', '#2a7a3d', '#70c784', '#021508', '#70c784', '#70c784', '#4d9c61', '#1e1a15', '#2a7a3d', '#f5f1ed', '#1a2820', '#ffffff14', '#182e1f', '#22412a', '#4d9c611f'],
  'khanat-elmerien-dark': ['#9966cc', '#7b4c9c', '#b794d9', '#1a0425', '#b794d9', '#b794d9', '#8659b3', '#f5f1ed', '#7b4c9c', '#f5f1ed', '#251a2d', '#ffffff14', '#2d1f39', '#402b53', '#9966cc1f'],
  'confederation-libre-dark': ['#9ca3af', '#6b7280', '#c2c9d6', '#0f1115', '#c2c9d6', '#c2c9d6', '#9ca3af', '#1e1a15', '#5f6673', '#f5f1ed', '#1f2228', '#ffffff14', '#2a2d32', '#3e4248', '#9ca3af1f'],
  'royaume-ruthvenie-dark': ['#4a9d61', '#2a7a3d', '#ff6b85', '#1a0408', '#ff6b85', '#ff6b85', '#4a9d61', '#1e1a15', '#2a7a3d', '#f5f1ed', '#1d2621', '#ffffff14', '#1c2e21', '#24412d', '#4a9d611f']
};
const attendu = (variante, jeton) => DESIGN[variante][JETONS.findIndex(([k]) => k === jeton)];
// Nuances de Kraland qu'aucune autre variante ne doit plus porter : primaire et primaire foncée (ancienne et nouvelle), accent inverse, bases de
// l'alerte info (164, 18, 13) et de l'ombre (165, 18, 13), primaire et fond d'action de Kraland sombre. L'accent #c41e3a n'en est pas :
// Royaume de Ruthvénie le partage.
const ROUGES_KRALAND = ['#8b0f0e', '#700b09', '#6f0c0b', '#f9d9de', '#f6dde1', '#a4120d', '#a5120d', '#c45252', '#b64c4c'];
const BOOTSTRAP_LIEN = '#337ab7';
const LARGEURS = [767, 768, 769, 1440, 1920];
const VARIANTES_LARGEURS = ['kraland', 'empire-brun-dark'];

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

// Couleurs calculées : « rgb(r, g, b) », « rgba(r, g, b, a) » ou « color(srgb r g b / a) » (color-mix(), composantes 0..1) -> [r, g, b, a].
const lire = s => {
  const n = (String(s).match(/-?\d*\.?\d+(?:e-?\d+)?/gi) || []).map(Number);
  const c = String(s).startsWith('color(srgb') ? [n[0] * 255, n[1] * 255, n[2] * 255] : n.slice(0, 3);
  return [...c, n.length > 3 ? n[3] : 1];
};
const hexa = h => { const v = h.slice(1); return [0, 2, 4].map(i => parseInt(v.slice(i, i + 2), 16)).concat(v.length === 8 ? parseInt(v.slice(6), 16) / 255 : 1); };
// Écart au plus grand canal (opacité ramenée à 0..255) : « à 1 près par canal ».
const ecart = (mesure, hex) => { const a = lire(mesure); const b = hexa(hex); return Math.max(...[0, 1, 2].map(i => Math.abs(a[i] - b[i])), Math.abs(a[3] - b[3]) * 255); };
const egal = (mesure, hex) => ecart(mesure, hex) <= 1 + 1e-9;
const memeCouleur = (a, b) => { const x = lire(a); const y = lire(b); return [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 1e-6) && Math.abs(x[3] - y[3]) <= 1e-6; };
const rougeKraland = mesure => ROUGES_KRALAND.find(h => { const a = lire(mesure); const b = hexa(h); return [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1); });
const vu = mesure => (mesure === ABSENT ? 'absent' : mesure);

const browser = await launchBrowser();

// Ouvre la fixture dans SON contexte : variante choisie avant le bundle (outil des 16 variantes), ou peau coupée ; mobile sous 768 px.
// `url` et `corps` : autre fixture servie à son chemin (balayage) ; `script` : bundle évalué ; `secondaire` : texte atténué du ticket 4 posé
// sur un bundle d'avant ce ticket.
async function ouvrir({ width, height, variante = 'kraland', theme = true, url = PAGE, corps = html, script = userscript, secondaire = false }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(url, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: corps }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  if (theme) { await context.addInitScript(choisirVariante, variante); } else { await context.addInitScript(() => localStorage.setItem('kr-theme-enabled', 'false')); }
  if (secondaire) { await context.addInitScript(poserJetonsRedefinis, TEXTE_SECONDAIRE_CLAIR); } // bundle d'avant le ticket 4 : texte atténué de Q26
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {} };
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, script);
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  await krReady(page, { ready: theme ? THEME_READY : null, label: `${theme ? variante : 'peau coupée'} ${width} px` });
  await styleSettled(page, 'body'); // transitions des liens (couleur, 0,12 s) finies
  await page.evaluate(CONTRASTE);
  return { context, page, denied, erreurs };
}

// Mesures au repos : jetons lus sur une sonde, liens, boutons primaires (bordure, ombre), alerte info, page active de la pagination.
const REPOS = liste => {
  const K = window.__krContraste;
  const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = getComputedStyle(i).color; i.remove(); return c; };
  const el = id => document.getElementById(id);
  const texte = e => { const s = getComputedStyle(e); return { couleur: s.color, trait: s.textDecorationLine, contraste: K.texte(e), fond: K.fond(e).map(Math.round).join(', '), fondPropre: s.backgroundColor }; };
  // Couleur d'une ombre calculée (« <couleur> 0px 6px 18px 0px »), la couleur en tête.
  const ombre = s => { const m = String(s).match(/^(rgba?\([^)]*\)|color\([^)]*\))/); return m ? m[1] : String(s); };
  const bouton = e => { const s = getComputedStyle(e); return { bordure: s.borderTopColor, ombre: ombre(s.boxShadow), brut: s.boxShadow }; };
  const alerte = getComputedStyle(el('alerte-info'));
  return {
    variantes: [...document.documentElement.classList].filter(c => c.startsWith('kr-theme-variant-')),
    peau: document.documentElement.classList.contains('kr-theme-enabled'),
    mobile: document.body.classList.contains('mobile-mode'),
    largeur: window.innerWidth,
    jetons: Object.fromEntries(liste.map(([k, e]) => [k, sonde(e)])),
    textePrimaire: sonde('var(--kr-text-primary)'),
    accentDeclare: getComputedStyle(document.documentElement).getPropertyValue('--kr-text-accent').trim(),
    liens: { page: texte(el('lien-page')), panneau: texte(el('lien-panneau')) },
    boutons: { button: bouton(el('bouton-primaire')), a: bouton(el('lien-bouton-primaire')) },
    alerte: { fond: alerte.backgroundColor, bordure: alerte.borderTopColor },
    pagination: texte(el('page-active'))
  };
};
// État d'un élément survolé (couleur, trait, fond, contraste du texte sur son fond effectif).
const ETAT = sel => {
  const e = document.querySelector(sel);
  const s = getComputedStyle(e);
  return { survole: e.matches(':hover'), couleur: s.color, trait: s.textDecorationLine, fond: s.backgroundColor, contraste: window.__krContraste.texte(e) };
};
const SURVOLS = { lienPage: '#lien-page', lienPanneau: '#lien-panneau', button: '#bouton-primaire', a: '#lien-bouton-primaire', liste: '#entree-liste', croix: '#croix-mobile', toutVoir: '#tout-voir' };

// ---------- Texte posé sur la couleur de nation (ticket 2) ----------
// Paires : au repos, fond --kr-arm-bg (repli --kr-primary) et encre --kr-arm-ink (repli blanc) ; au survol, à l'appui et sur la primaire
// foncée, --kr-arm-bg-hover (repli --kr-primary-dark) et --kr-arm-ink-hover (repli blanc) ; inverse (badge d'un bouton ou d'un titre
// actif) : fond de l'encre, texte du fond. « une » : l'une des deux paires, fond et encre de la même. « libre » : fond hors de la couleur
// de nation (survol d'accent de .btn-warning en sombre), texte ≥ 4,5:1 seulement.
const PAIRES = { repos: ['action-bg', 'action-ink'], survol: ['action-bg-hover', 'action-ink-hover'], inverse: ['action-ink', 'action-bg'] };
const BLEUS_BOOTSTRAP = ['#337ab7', '#286090', '#204d74', '#122b40', '#2e6da4'];
// Boutons primaires de la fixture : 5 balises, états de classe (paire attendue), pseudo-états forcés sur le bouton au repos.
const BALISES = ['button', 'a', 'label', 'span', 'input'];
const ETATS_CLASSE = [['', 'repos'], ['active', 'survol'], ['focus', 'survol'], ['disabled', 'repos'], ['attr-disabled', 'repos']];
const PSEUDOS = ['hover', 'focus', 'active'];
const BOUTONS = [
  ...BALISES.flatMap(b => ETATS_CLASSE.map(([e, paire]) => ({ sel: `#bp-${b}${e ? '-' + e : ''}`, quoi: `${b}${e ? '.' + e.replace('attr-disabled', '[disabled]') : ''}`, paire }))),
  { sel: '#bp-menu', quoi: 'menu ouvert', paire: 'survol' },
  { sel: '#bp-fieldset', quoi: 'fieldset[disabled]', paire: 'repos' },
  { sel: '#bp-badge', quoi: 'bouton à badge', paire: 'repos' }
];
// Composants posés sur la couleur de nation : sélecteur, nom, paire au repos (null : fond neutre au repos), quand le composant s'applique
// (sombre, mobile), état forcé (bureau / mobile : pseudo-classe forcée ; paire attendue, paireMobile si elle diffère sur mobile ; cible :
// élément qui reçoit la pseudo-classe, l'élément lui-même par défaut).
const TOUS = () => true;
const MOBILE = (sombre, mobile) => mobile;
const BUREAU = (sombre, mobile) => !mobile;
const SOMBRE = sombre => sombre;
const C = (sel, quoi, paire, quand = TOUS, etat = null) => ({ sel, quoi, paire, quand, etat });
const COMPOSANTS = [
  C('#titre-actif', 'titre actif de la liste latérale', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'une' }),
  C('#titre-actif-texte', 'texte du titre actif', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'une', cible: '#titre-actif' }),
  C('#titre-actif-badge', 'badge du titre actif', 'inverse', TOUS, { bureau: 'hover', mobile: 'active', paire: 'inverse', cible: '#titre-actif' }),
  C('#titre-actif-lien', 'lien dans un titre actif', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'une' }),
  C('#bandeau', 'bandeau .bg-primary', 'repos'),
  C('#info', '.bg-info', 'repos'),
  C('#etiquette', '.label', 'repos'),
  C('#etiquette-lien', '.label[href]', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'survol', paireMobile: 'une' }),
  C('#pastille', '.badge', 'repos'),
  C('#page-active', 'page active (a)', 'survol', TOUS, { bureau: 'hover', mobile: 'active', paire: 'une' }),
  C('#page-active-span', 'page active (span)', 'survol', TOUS, { bureau: 'hover', mobile: 'active', paire: 'une' }),
  C('#page-appui', 'page de la pagination pressée', null, MOBILE, { mobile: 'active', paire: 'survol' }),
  C('#page-courante', 'paginate_button.current', 'repos', (sombre, mobile) => sombre || mobile, { bureau: 'hover', paire: 'une' }),
  C('#pilule-active', '.nav-pills active', 'repos', TOUS, { bureau: 'hover', paire: 'une' }),
  C('#menu-actif', 'entrée active d\'un menu', 'repos', TOUS, { bureau: 'hover', paire: 'une' }),
  C('#onglet-modale', 'onglet actif d\'une modale', 'repos', MOBILE),
  C('#onglet-modale-autre', 'onglet de modale touché', null, MOBILE, { mobile: 'hover', paire: 'survol' }),
  C('#panneau-primaire', 'en-tête de .panel-primary', 'repos'),
  C('#pastille-carte', 'pastille d\'une carte du tableau de bord', 'repos', MOBILE),
  C('#action-carte', 'action d\'une carte touchée', null, MOBILE, { mobile: 'hover', paire: 'survol' }),
  C('#lien-flap', 'bouton du mini-chat', 'repos', MOBILE, { mobile: 'active', paire: 'une' }),
  C('#croix-mobile', 'croix des panneaux mobiles', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'survol', paireMobile: 'une' }),
  C('#tout-voir', '« tout voir » du changelog', 'repos', TOUS, { bureau: 'hover', mobile: 'active', paire: 'survol', paireMobile: 'une' }),
  C('#jouer', '« Jouer » de l\'accueil', 'repos', BUREAU, { bureau: 'hover', paire: 'survol' }),
  C('#carte-titre', 'titre d\'encart de carte', 'repos', SOMBRE),
  C('#carte-pied', 'pied d\'encart de carte', 'repos', SOMBRE),
  C('#bouton-alerte', '.btn-warning', 'repos', SOMBRE, { bureau: 'hover', mobile: 'active', paire: 'libre', paireMobile: 'une' }),
  C('#panneau-primaire-badge', 'badge de l\'en-tête de .panel-primary', 'inverse'),
  C('.forum-new-topic-fab', '« + » du sous-forum', 'repos', MOBILE, { mobile: 'active', paire: 'une' })
];

// À évaluer dans la page : pour chaque sélecteur, présence, visibilité, couleur, fond effectif, fond propre, bordure, contraste.
const MESURES = sels => {
  const K = window.__krContraste;
  return Object.fromEntries(sels.map(sel => {
    const e = document.querySelector(sel);
    if (!e) { return [sel, null]; }
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return [sel, { visible: r.width > 0 && r.height > 0 && s.visibility === 'visible', couleur: s.color, fond: `rgb(${K.fond(e).map(Math.round).join(', ')})`, fondPropre: s.backgroundColor, bordure: s.borderTopColor, ombre: s.boxShadow, contraste: K.texte(e) }];
  }));
};
// Panneaux primaires (en-tête, badge, corps repliable après l'en-tête ou le pied) : couleurs calculées de chaque élément (texte, fond,
// 4 bordures), pour y chercher le bleu de Bootstrap.
const PANNEAUX_PRIMAIRES = () => [...document.querySelectorAll('.panel-primary, .panel-primary *')].map(e => {
  const s = getComputedStyle(e);
  return [e.id || e.className, ['color', 'background-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'].map(k => [k, s.getPropertyValue(k)])];
});
// Sélection de texte (sombre) : couleur et fond de ::selection.
const SELECTION = () => {
  const K = window.__krContraste;
  const s = getComputedStyle(document.getElementById('selection'), '::selection');
  const f = K.rgb(s.backgroundColor);
  return { visible: true, couleur: s.color, fond: s.backgroundColor, contraste: f[3] > 0 ? K.rapport(K.rgb(s.color).slice(0, 3), f.slice(0, 3)) : 0 };
};

// Transitions et animations finies dans toute la page, puis une image.
async function stylesPoses(page) {
  await waitState(page, () => document.getAnimations().every(a => a.playState !== 'running' || a.effect.getComputedTiming().iterations === Infinity), null, { maxMs: 3000 });
  await frames(page, 1);
}
// Force la pseudo-classe `etat` (hover, focus, active) sur les éléments de `sels` par le protocole du navigateur (aucun geste, aucun clic),
// le temps de `mesure()`.
async function forcer(page, sels, etat, mesure) {
  const cdp = await page.context().newCDPSession(page);
  try {
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    const { root: doc } = await cdp.send('DOM.getDocument', { depth: 0 });
    const noeuds = [];
    for (const sel of sels) { noeuds.push(...(await cdp.send('DOM.querySelectorAll', { nodeId: doc.nodeId, selector: sel })).nodeIds); }
    for (const nodeId of noeuds) { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [etat] }); }
    await stylesPoses(page);
    const r = await mesure();
    for (const nodeId of noeuds) { await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] }); }
    await stylesPoses(page);
    return r;
  } finally { await cdp.detach(); }
}

// Mesures du ticket 2 dans une page de la fixture : boutons primaires (bureau), composants au repos et dans leur état forcé.
async function mesuresPaire(page, variante, mobile) {
  const sombre = variante.endsWith('-dark');
  const comps = COMPOSANTS.filter(c => c.quand(sombre, mobile));
  const r = { composants: await page.evaluate(MESURES, comps.map(c => c.sel)), etats: {} };
  if (sombre) { r.composants['::selection'] = await page.evaluate(SELECTION); }
  r.panneaux = await page.evaluate(PANNEAUX_PRIMAIRES);
  for (const pseudo of PSEUDOS) {
    const vises = comps.filter(c => c.etat && c.etat[mobile ? 'mobile' : 'bureau'] === pseudo);
    const cibles = [...new Set(vises.map(c => c.etat.cible || c.sel))];
    if (cibles.length) { Object.assign(r.etats, await forcer(page, cibles, pseudo, () => page.evaluate(MESURES, vises.map(c => c.sel)))); }
  }
  if (!mobile) {
    r.boutons = await page.evaluate(MESURES, [...BOUTONS.map(b => b.sel), '#bp-badge-pastille']);
    r.pseudos = {};
    const bases = BALISES.map(b => `#bp-${b}`);
    for (const pseudo of PSEUDOS) { r.pseudos[pseudo] = await forcer(page, bases, pseudo, () => page.evaluate(MESURES, bases)); }
  }
  return r;
}

const ecartsDePaire = (variante, quoi, m, paire) => {
  if (!m) { return [`${quoi} : absent`]; }
  if (!m.visible) { return [`${quoi} : invisible`]; }
  const faux = [];
  if (paire === 'libre') { return m.contraste >= 4.5 ? [] : [`${quoi} : ${m.contraste.toFixed(2)}:1 (${m.couleur} sur ${m.fond})`]; }
  const candidates = paire === 'une' ? ['repos', 'survol'] : [paire];
  const ok = candidates.some(p => egal(m.fond, attendu(variante, PAIRES[p][0])) && egal(m.couleur, attendu(variante, PAIRES[p][1])));
  if (!ok) { faux.push(`${quoi} : ${m.couleur} sur ${m.fond} au lieu de ${candidates.map(p => PAIRES[p].map(k => attendu(variante, k)).reverse().join(' sur ')).join(' ou ')} (${paire})`); }
  if (!(m.contraste >= 4.5)) { faux.push(`${quoi} : ${m.contraste.toFixed(2)}:1`); }
  return faux;
};

async function scenario({ variante, width, height, survol }) {
  const { context, page, denied, erreurs } = await ouvrir({ width, height, variante });
  const m = await page.evaluate(REPOS, JETONS);
  m.posee = await page.evaluate(VARIANTE_POSEE, variante);
  m.paire = await mesuresPaire(page, variante, width < 768);
  if (SHOTS && ['kraland', 'empire-brun', 'paladium', 'empire-brun-dark', 'paladium-dark'].includes(variante)) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `palette-nation-${width}-${variante}.png`), fullPage: true });
  }
  if (survol) {
    m.survols = {};
    for (const [k, sel] of Object.entries(SURVOLS)) {
      await page.hover(sel);
      await styleSettled(page, sel, { state: ':hover' });
      m.survols[k] = await page.evaluate(ETAT, sel);
    }
  }
  await context.close();
  m.erreurs = erreurs;
  m.denied = denied.filter(d => d.url.startsWith(BASE)).map(d => d.url);
  return m;
}

// ---------- Vérifications d'une variante à une largeur ----------
// Chaque vérification relève tous ses écarts avant d'échouer (message : la liste des écarts).
const sansEcart = faux => assert.deepEqual(faux, [], faux.join(' ; '));
function socle(tag, variante, m) {
  check(`${tag} ${variante} : variante posée, aucune exception, aucune requête vers le site hors fixture`, () => {
    assert.ok(m.posee, 'classes de html : ' + m.variantes.join(' '));
    assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
    assert.deepEqual(m.denied, [], 'requêtes refusées : ' + m.denied.join(' '));
  });
}
const ecartsJetons = (variante, m) => JETONS.filter(([k]) => !egal(m.jetons[k], attendu(variante, k))).map(([k]) => `${k} ${vu(m.jetons[k])} au lieu de ${attendu(variante, k)}`);
const ecartsLiens = (variante, m) => {
  const faux = [];
  for (const [ou, l] of Object.entries(m.liens)) {
    if (!memeCouleur(l.couleur, m.jetons['text-accent'])) { faux.push(`${ou} : ${l.couleur} au lieu de --kr-text-accent ${vu(m.jetons['text-accent'])}`); }
    if (!egal(l.couleur, attendu(variante, 'text-accent'))) { faux.push(`${ou} : ${l.couleur} au lieu de ${attendu(variante, 'text-accent')}`); }
    if (!(l.contraste >= 4.5)) { faux.push(`${ou} : ${l.contraste.toFixed(2)}:1 sur ${l.fond}`); }
    if (l.trait !== 'none') { faux.push(`${ou} : ${l.trait} au repos`); }
  }
  return faux;
};
function jetons(tag, variante, m) {
  check(`${tag} ${variante} : les 15 jetons de rôle égaux à DESIGN.md (primary à btn-shadow, à 1 près par canal)`, () => sansEcart(ecartsJetons(variante, m)));
}
function liensRepos(tag, variante, m) {
  check(`${tag} ${variante} : liens au repos (fond de page, panneau) en text-accent, ≥ 4,5:1, non soulignés`, () => sansEcart(ecartsLiens(variante, m)));
}
function empireBrun(tag, variante, m) {
  if (variante !== 'empire-brun') { return; }
  check(`${tag} ${variante} : liens en #8a5a00 (5,93:1), plus en or #c69100`, () => {
    sansEcart(Object.entries(m.liens).filter(([, l]) => !egal(l.couleur, '#8a5a00') || egal(l.couleur, '#c69100')).map(([ou, l]) => `${ou} : ${l.couleur}`));
  });
}
function survols(tag, variante, m) {
  check(`${tag} ${variante} : liens survolés, couleur inchangée (text-accent), soulignés, ≥ 4,5:1`, () => {
    const faux = [];
    for (const [k, ou] of [['lienPage', 'page'], ['lienPanneau', 'panneau']]) {
      const s = m.survols[k];
      if (!s.survole) { faux.push(`${ou} : survol non obtenu`); }
      if (!memeCouleur(s.couleur, m.liens[ou].couleur)) { faux.push(`${ou} : ${s.couleur} au survol au lieu de ${m.liens[ou].couleur} au repos`); }
      if (s.trait !== 'underline') { faux.push(`${ou} : ${s.trait} au survol`); }
      if (!(s.contraste >= 4.5)) { faux.push(`${ou} : ${s.contraste.toFixed(2)}:1 au survol`); }
    }
    sansEcart(faux);
  });
}
function consommateurs(tag, variante, m) {
  const sombre = variante.endsWith('-dark');
  check(`${tag} ${variante} : consommateurs des jetons redéfinis (bordure, ombre et fond au survol des boutons primaires,${sombre ? '' : ' alerte info,'} entrée de liste survolée ≥ 4,5:1), aucun rouge Kraland hors Kraland`, () => {
    const faux = [];
    const vus = [];
    const comparer = (quoi, mesure, jeton) => {
      vus.push([quoi, mesure]);
      if (!egal(mesure, attendu(variante, jeton))) { faux.push(`${quoi} ${mesure} au lieu de ${jeton} ${attendu(variante, jeton)}`); }
    };
    for (const k of ['button', 'a']) {
      comparer(`${k}.btn-primary : bordure`, m.boutons[k].bordure, 'primary-strong');
      comparer(`${k}.btn-primary : ombre`, m.boutons[k].ombre, 'btn-shadow');
      if (!m.survols[k].survole) { faux.push(`${k}.btn-primary : survol non obtenu`); }
      comparer(`${k}.btn-primary : fond au survol`, m.survols[k].fond, 'action-bg-hover');
    }
    // Alerte info : en sombre, la règle html[class*="-dark"] .alert-info garde son fond et sa bordure (alerteSombre, ticket 5).
    if (!sombre) {
      comparer('alerte info : fond', m.alerte.fond, 'info-bg');
      comparer('alerte info : bordure', m.alerte.bordure, 'info-border');
    }
    // Entrée de liste survolée : la règle de survol des entrées de liste (text-accent) en clair ; en sombre, la règle sombre des entrées de
    // liste (texte du thème, hors de ce ticket) l'emporte.
    const l = m.survols.liste;
    const texte = sombre ? m.textePrimaire : m.jetons['text-accent'];
    vus.push(['entrée de liste survolée', l.couleur]);
    if (!l.survole) { faux.push('entrée de liste : survol non obtenu'); }
    if (!memeCouleur(l.couleur, texte)) { faux.push(`entrée de liste survolée : ${l.couleur} au lieu de ${sombre ? '--kr-text-primary' : '--kr-text-accent'} ${vu(texte)}`); }
    if (!(l.contraste >= 4.5)) { faux.push(`entrée de liste survolée : ${l.contraste.toFixed(2)}:1`); }
    if (!variante.startsWith('kraland')) {
      vus.filter(([, c]) => rougeKraland(c)).forEach(([k, c]) => faux.push(`${k} ${c} : rouge Kraland ${rougeKraland(c)}`));
    }
    sansEcart(faux);
  });
}
// Texte posé sur la primaire foncée (décision de la boucle de revue 1) : fond et texte de la paire de survol d'action, texte ≥ 4,5:1.
const ecartsPaire = (variante, quoi, e, fond) => {
  const faux = [];
  if (!(e.contraste >= 4.5)) { faux.push(`${quoi} : ${e.contraste.toFixed(2)}:1 (${e.couleur} sur ${fond})`); }
  if (!egal(fond, attendu(variante, 'action-bg-hover'))) { faux.push(`${quoi} : fond ${fond} au lieu de action-bg-hover ${attendu(variante, 'action-bg-hover')}`); }
  if (!egal(e.couleur, attendu(variante, 'action-ink-hover'))) { faux.push(`${quoi} : texte ${e.couleur} au lieu de action-ink-hover ${attendu(variante, 'action-ink-hover')}`); }
  return faux;
};
// Boutons primaires (1280 px) : chaque balise et chaque état prend la paire de son état, bordure en primaire foncée, badge interne en paire
// inverse ; en clair, aucun bleu de Bootstrap calculé.
function boutonsPrimaires(tag, variante, m) {
  const p = m.paire;
  check(`${tag} ${variante} : boutons primaires (${BALISES.join(', ')} ; repos, .active, .focus, .disabled, [disabled], :hover, :focus, :active ; menu ouvert, fieldset[disabled]) : fond et texte de la paire de l'état, ≥ 4,5:1`, () => {
    const faux = BOUTONS.flatMap(b => ecartsDePaire(variante, b.quoi, p.boutons[b.sel], b.paire));
    for (const pseudo of PSEUDOS) { BALISES.forEach(b => faux.push(...ecartsDePaire(variante, `${b}:${pseudo}`, p.pseudos[pseudo][`#bp-${b}`], 'survol'))); }
    sansEcart(faux);
  });
  const tous = () => [...BOUTONS.map(b => [b.quoi, p.boutons[b.sel]]), ...PSEUDOS.flatMap(ps => BALISES.map(b => [`${b}:${ps}`, p.pseudos[ps][`#bp-${b}`]]))].filter(([, x]) => x);
  check(`${tag} ${variante} : boutons primaires, bordure en primaire foncée dans tous les états`, () => {
    sansEcart(tous().filter(([, x]) => !egal(x.bordure, attendu(variante, 'primary-strong'))).map(([q, x]) => `${q} : bordure ${x.bordure}`));
  });
  // Ombre : --kr-btn-shadow au repos, au survol et au focus ; ombre intérieure de Bootstrap à l'appui, en .active et menu ouvert ; aucune
  // désactivé.
  check(`${tag} ${variante} : boutons primaires, ombre --kr-btn-shadow au repos et au survol, intérieure pressés (:active, .active, menu ouvert), aucune désactivés`, () => {
    const attendue = q => (/disabled|fieldset/.test(q) ? 'none' : (/active|menu/.test(q) ? 'inset' : 'portée'));
    const vue = o => (o === 'none' ? 'none' : (o.includes('inset') ? 'inset' : 'portée'));
    sansEcart(tous().filter(([q, x]) => vue(x.ombre) !== attendue(q)).map(([q, x]) => `${q} : ombre ${x.ombre} au lieu de ${attendue(q)}`));
  });
  check(`${tag} ${variante} : badge d'un bouton primaire, paire inverse (texte --kr-arm-bg, fond --kr-arm-ink)`, () => sansEcart(ecartsDePaire(variante, 'badge', p.boutons['#bp-badge-pastille'], 'inverse')));
  if (!variante.endsWith('-dark')) {
    check(`${tag} ${variante} : boutons primaires, aucun bleu de Bootstrap (${BLEUS_BOOTSTRAP.join(', ')}) en fond, texte ou bordure`, () => {
      sansEcart(tous().flatMap(([q, x]) => [['fond', x.fondPropre], ['texte', x.couleur], ['bordure', x.bordure]].filter(([, c]) => BLEUS_BOOTSTRAP.some(h => egal(c, h))).map(([k, c]) => `${q} : ${k} ${c}`)));
    });
  }
}
// Composants posés sur la couleur de nation, au repos puis dans leur état forcé (survol sur ordinateur, appui sur mobile).
function composants(tag, variante, m, mobile) {
  const sombre = variante.endsWith('-dark');
  const comps = COMPOSANTS.filter(c => c.quand(sombre, mobile));
  check(`${tag} ${variante} : composants posés sur la couleur de nation au repos (${comps.filter(c => c.paire).length}${sombre ? ' et la sélection de texte' : ''}) : fond et texte de la paire, ≥ 4,5:1`, () => {
    const faux = comps.filter(c => c.paire).flatMap(c => ecartsDePaire(variante, c.quoi, m.paire.composants[c.sel], c.paire));
    if (sombre) { faux.push(...ecartsDePaire(variante, '::selection', m.paire.composants['::selection'], 'repos')); }
    sansEcart(faux);
  });
  check(`${tag} ${variante} : panneaux primaires (en-tête, badge, corps repliable), aucun bleu de Bootstrap #337ab7 calculé`, () => {
    sansEcart(m.paire.panneaux.flatMap(([q, props]) => props.filter(([, c]) => egal(c, '#337ab7')).map(([k, c]) => `${q} : ${k} ${c}`)));
  });
  const etats = comps.filter(c => c.etat && c.etat[mobile ? 'mobile' : 'bureau']);
  check(`${tag} ${variante} : composants ${mobile ? 'à l\'appui' : 'au survol'} (${etats.length}) : fond et texte de la paire, ≥ 4,5:1`, () => {
    sansEcart(etats.flatMap(c => ecartsDePaire(variante, `${c.quoi} (:${c.etat[mobile ? 'mobile' : 'bureau']})`, m.paire.etats[c.sel], (mobile && c.etat.paireMobile) || c.etat.paire)));
  });
}
// Survolés : croix des panneaux mobiles, « tout voir » et boutons primaires prennent la paire de survol dans les 16 variantes.
function texteSurPrimaireFoncee(tag, variante, m) {
  check(`${tag} ${variante} : survolés, paire de survol d'action et texte ≥ 4,5:1 (.kr-mobile-close, .kr-changelog-view-all, boutons primaires)`, () => {
    const faux = [];
    for (const [k, quoi] of [['button', 'button.btn-primary'], ['a', 'a.btn-primary'], ['croix', '.kr-mobile-close'], ['toutVoir', '.kr-changelog-view-all']]) {
      const s = m.survols[k];
      if (!s.survole) { faux.push(`${quoi} : survol non obtenu`); continue; }
      faux.push(...ecartsPaire(variante, quoi, s, s.fond));
    }
    sansEcart(faux);
  });
}
// Alerte info des 8 variantes sombres : règle html[class*="-dark"] .alert-info inchangée, jetons déclarés sans ce consommateur (ticket 5).
const ALERTE_SOMBRE = { fond: '#7a524026', bordure: '#7a52404c' }; // rgb(122, 82, 64) à 0,15 et à 0,3
function alerteSombre(tag, variante, m) {
  if (!variante.endsWith('-dark')) { return; }
  check(`${tag} ${variante} : alerte info, fond et bordure inchangés (rgb(122, 82, 64) à 0,15 et 0,3)`, () => {
    sansEcart(['fond', 'bordure'].filter(k => !egal(m.alerte[k], ALERTE_SOMBRE[k])).map(k => `${k} ${m.alerte[k]} au lieu de ${ALERTE_SOMBRE[k]}`));
  });
}

// ---------- Ordinateur et mobile, 16 variantes ----------
if (on('mobile')) {
  console.log('Mobile (375 × 667), 16 variantes : jetons de rôle, liens au repos, composants posés sur la couleur de nation (repos, appui), alerte info (sombre)');
  const res = await parVariante(variante => scenario({ variante, width: 375, height: 667, survol: false }));
  VARIANTES.forEach((v, i) => {
    socle('[375]', v, res[i]);
    jetons('[375]', v, res[i]);
    liensRepos('[375]', v, res[i]);
    empireBrun('[375]', v, res[i]);
    composants('[375]', v, res[i], true);
    alerteSombre('[375]', v, res[i]);
  });
}

if (on('bureau')) {
  console.log('Ordinateur (1280 × 720), 16 variantes : jetons de rôle, liens au repos et au survol, consommateurs des jetons redéfinis, texte sur la primaire foncée, boutons primaires et composants posés sur la couleur de nation');
  const res = await parVariante(variante => scenario({ variante, width: 1280, height: 720, survol: true }));
  VARIANTES.forEach((v, i) => {
    socle('[1280]', v, res[i]);
    jetons('[1280]', v, res[i]);
    liensRepos('[1280]', v, res[i]);
    empireBrun('[1280]', v, res[i]);
    survols('[1280]', v, res[i]);
    consommateurs('[1280]', v, res[i]);
    texteSurPrimaireFoncee('[1280]', v, res[i]);
    boutonsPrimaires('[1280]', v, res[i]);
    composants('[1280]', v, res[i], false);
    alerteSombre('[1280]', v, res[i]);
  });
}

// ---------- Largeurs : seuil et grands écrans, Kraland et Empire Brun sombre ----------
// Valeurs au repos (jetons, liens, boutons, alerte, page active de la pagination) comparées à celles de 375 et de 1280 px, mesurées dans le
// même fragment.
if (on('largeurs')) {
  console.log(`Largeurs ${LARGEURS.join(', ')} px contre 375 et 1280 px : ${VARIANTES_LARGEURS.join(' et ')}`);
  const cas = VARIANTES_LARGEURS.flatMap(variante => [375, 1280, ...LARGEURS].map(width => ({ variante, width, height: width < 768 ? 667 : 900 })));
  const res = await mapLimit(cas, c => scenario({ ...c, survol: c.width >= 768 }));
  const valeurs = m => JSON.stringify({ jetons: m.jetons, liens: Object.fromEntries(Object.entries(m.liens).map(([k, l]) => [k, [l.couleur, l.trait]])), boutons: m.boutons, alerte: m.alerte, pagination: [m.pagination.couleur, m.pagination.fondPropre] });
  const survolsLiens = m => JSON.stringify(['lienPage', 'lienPanneau'].map(k => [m.survols[k].couleur, m.survols[k].trait]));
  // Composants posés sur la couleur de nation (ticket 2) : mêmes valeurs au repos que la largeur de référence du même mode (375 ou 1280 px).
  const valeursPaire = m => JSON.stringify(Object.entries(m.paire.composants).map(([k, x]) => [k, x && [x.couleur, x.fond, x.visible]]));
  for (const variante of VARIANTES_LARGEURS) {
    const de = width => res[cas.findIndex(c => c.variante === variante && c.width === width)];
    check(`[largeurs] ${variante} : à 375 et 1280 px, jetons égaux à DESIGN.md, liens en text-accent, mêmes valeurs au repos aux deux largeurs`, () => {
      sansEcart([375, 1280].flatMap(w => [...ecartsJetons(variante, de(w)), ...ecartsLiens(variante, de(w))].map(x => `${w} px : ${x}`)));
      assert.equal(valeurs(de(1280)), valeurs(de(375)));
    });
    for (const width of LARGEURS) {
      const m = de(width);
      check(`[largeurs] ${variante} ${width} px (${width < 768 ? 'mobile' : 'ordinateur'}) : jetons et liens de DESIGN.md, mêmes valeurs qu'à 375 et 1280 px${width >= 768 ? ', liens survolés compris' : ''}, composants sur la couleur de nation comme à ${width < 768 ? 375 : 1280} px, aucune exception`, () => {
        assert.ok(m.posee, 'variante non posée');
        assert.equal(m.mobile, width < 768, 'mode mobile');
        assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
        assert.deepEqual(m.denied, [], 'requêtes refusées : ' + m.denied.join(' '));
        sansEcart([...ecartsJetons(variante, m), ...ecartsLiens(variante, m)]);
        assert.equal(valeurs(m), valeurs(de(375)), 'repos contre 375 px');
        assert.equal(valeurs(m), valeurs(de(1280)), 'repos contre 1280 px');
        if (width >= 768) { assert.equal(survolsLiens(m), survolsLiens(de(1280)), 'liens survolés contre 1280 px'); }
        assert.equal(valeursPaire(m), valeursPaire(de(width < 768 ? 375 : 1280)), `composants posés sur la couleur de nation contre ${width < 768 ? 375 : 1280} px`);
      });
    }
  }
}

// ---------- Balayage des fixtures de référence (ticket 2) ----------
// Tout élément visible portant du texte dont le fond effectif est une couleur de nation (primaire, primaire foncée, --kr-arm-bg,
// --kr-arm-bg-hover) : texte ≥ 4,5:1, au repos puis avec la pseudo-classe forcée sur les éléments interactifs (survol sur ordinateur, appui
// sur mobile). Dossiers du kramail (réception) : paire au repos ; barre d'envoi fixe pressée (rédaction, mobile) : paire de survol.
const FIXTURE = nom => fs.readFileSync(path.join(here, 'fixtures', nom), 'utf8');
const PAGES_BALAYAGE = [
  { nom: 'report', url: BASE + '/report/perso-000000', corps: FIXTURE('report-non-lu.html') },
  { nom: 'plateau', url: BASE + '/jouer/plateau', corps: FIXTURE('plateau-qualite-usage.html') },
  { nom: 'sujet', url: BASE + '/forum/sujet/messages-v3-329425-1', corps: FIXTURE('forum-sujet.html') },
  { nom: 'sous-forum', url: BASE + '/forum/hrp/debuter-20102', corps: FIXTURE('sous-forum-debuter.html') },
  { nom: 'index RP', url: BASE + '/forum/rp', corps: FIXTURE('forum-index-rp.html') },
  { nom: 'réception du kramail', url: BASE + '/kramail/personnage-fictif-2000-0', corps: FIXTURE('kramail-reception.html') }
];
const REDACTION = { nom: 'rédaction du kramail', url: BASE + '/kramail/post/nouveau-4-2000', corps: FIXTURE('kramail-nouveau.html') };
const INTERACTIFS = ['a', 'button', 'input', 'label', '.btn', '.paginate_button'];
const DOSSIERS = 'h1.page-header .pull-right > a.btn.btn-primary';
const BARRE = 'button.btn-primary.pull-right';
const CONTACTS = '.input-group-addon input.btn-primary';
const BALAYER = () => {
  const K = window.__krContraste;
  const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = K.rgb(getComputedStyle(i).color); i.remove(); return c; };
  const nation = ['var(--kr-primary)', 'var(--kr-primary-dark)', 'var(--kr-arm-bg, var(--kr-primary))', 'var(--kr-arm-bg-hover, var(--kr-primary-dark))'].map(sonde);
  const proche = (a, b) => [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1);
  const nom = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...e.classList].map(c => '.' + c).join('') + ' « ' + (e.value || e.textContent).trim().slice(0, 24) + ' »';
  const out = { vus: 0, faux: [] };
  for (const e of document.body.querySelectorAll('*')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'OPTION'].includes(e.tagName)) { continue; }
    const texte = e.tagName === 'INPUT' ? ['button', 'submit', 'reset'].includes(e.type) && e.value.trim() : [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!texte) { continue; }
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || s.visibility !== 'visible' || e.closest('[aria-hidden="true"]')) { continue; }
    const f = K.fond(e);
    if (!nation.some(n => proche(f, n))) { continue; }
    out.vus += 1;
    const c = K.texte(e);
    if (!(c >= 4.5)) { out.faux.push(`${nom(e)} : ${c.toFixed(2)}:1 (${s.color} sur rgb(${f.map(Math.round).join(', ')}))`); }
  }
  return out;
};
async function balayer(p, variante, width) {
  const mobile = width < 768;
  const { context, page, erreurs } = await ouvrir({ width, height: mobile ? 667 : 900, variante, url: p.url, corps: p.corps });
  const repos = await page.evaluate(BALAYER);
  const etat = await forcer(page, INTERACTIFS, mobile ? 'active' : 'hover', () => page.evaluate(BALAYER));
  const dossiers = p.nom === 'réception du kramail' ? await page.evaluate(MESURES, [DOSSIERS]) : null;
  await context.close();
  return { repos, etat, dossiers, erreurs };
}
function verifierBalayage(tag, cas, res) {
  for (const p of PAGES_BALAYAGE) {
    const lignes = cas.map((c, i) => [c, res[i]]).filter(([c]) => c.p === p);
    check(`${tag} ${p.nom} : texte ≥ 4,5:1 sur la couleur de nation au repos, 16 variantes (${lignes.reduce((n, [, r]) => n + r.repos.vus, 0)} éléments)`, () => {
      sansEcart(lignes.flatMap(([c, r]) => r.repos.faux.slice(0, 4).map(f => `${c.variante} ${f}`)));
    });
    check(`${tag} ${p.nom} : texte ≥ 4,5:1 sur la couleur de nation ${tag === '[375]' ? 'à l\'appui' : 'au survol'} des éléments interactifs, 16 variantes (${lignes.reduce((n, [, r]) => n + r.etat.vus, 0)} éléments)`, () => {
      sansEcart(lignes.flatMap(([c, r]) => r.etat.faux.slice(0, 4).map(f => `${c.variante} ${f}`)));
    });
    if (p.nom === 'réception du kramail') {
      check(`${tag} ${p.nom} : dossier actif (bouton primaire de l'en-tête) en paire au repos, 16 variantes`, () => {
        sansEcart(lignes.flatMap(([c, r]) => ecartsDePaire(c.variante, `${c.variante} dossier actif`, r.dossiers[DOSSIERS], 'repos')));
      });
    }
  }
}
for (const [frag, width] of [['balayage-mobile', 375], ['balayage-bureau', 1280]]) {
  if (!on(frag)) { continue; }
  const tag = `[${width}]`;
  console.log(`Balayage ${width} px, 16 variantes : ${PAGES_BALAYAGE.map(p => p.nom).join(', ')}${width < 768 ? ` ; barre d'envoi pressée (${REDACTION.nom})` : ''}`);
  const cas = PAGES_BALAYAGE.flatMap(p => VARIANTES.map(variante => ({ p, variante })));
  const res = await mapLimit(cas, c => balayer(c.p, c.variante, width), 16);
  verifierBalayage(tag, cas, res);
  if (width < 768) {
    const barres = await parVariante(async variante => {
      const { context, page } = await ouvrir({ width, height: 667, variante, url: REDACTION.url, corps: REDACTION.corps });
      const repos = await page.evaluate(MESURES, [BARRE, CONTACTS]);
      const appui = await forcer(page, [BARRE], 'active', () => page.evaluate(MESURES, [BARRE]));
      await context.close();
      return { repos: repos[BARRE], appui: appui[BARRE], contacts: repos[CONTACTS] };
    });
    check(`${tag} ${REDACTION.nom} : « + » des contacts (bouton primaire transparent sous 768 px) sans ombre, 16 variantes`, () => {
      sansEcart(VARIANTES.flatMap((v, i) => { const c = barres[i].contacts; return !c ? [`${v} : absent`] : (c.ombre === 'none' && lire(c.fondPropre)[3] === 0 ? [] : [`${v} : ombre ${c.ombre}, fond ${c.fondPropre}`]); }));
    });
    check(`${tag} ${REDACTION.nom} : barre d'envoi fixe en paire au repos et en paire de survol pressée, 16 variantes`, () => {
      sansEcart(VARIANTES.flatMap((v, i) => [...ecartsDePaire(v, `${v} au repos`, barres[i].repos, 'repos'), ...ecartsDePaire(v, `${v} pressée`, barres[i].appui, 'survol')]));
    });
  }
}

// ---------- Texte coloré, couleurs de nation, rouge Kraland et bleu en dur (ticket 3) ----------
// Pages : fixture synthétique des textes (sans classe de page), accueil synthétique, sous-forum, sujet, réception et rédaction du kramail.
const PAGES_TEXTES = [
  { nom: 'textes', url: PAGE, corps: FIXTURE('palette-nation-textes.html') },
  { nom: 'accueil', url: BASE + '/accueil', corps: FIXTURE('palette-nation-accueil.html') },
  ...PAGES_BALAYAGE.filter(p => ['sous-forum', 'sujet', 'réception du kramail'].includes(p.nom)),
  REDACTION
];
// Texte aujourd'hui en primaire : page, sélecteur (« ::before » : pseudo-élément), nom, quand (sombre, mobile), état forcé (chaîne : les deux
// supports ; objet : par support ; null : au repos). Attendu : --kr-text-accent, ≥ 4,5:1 sur son fond effectif. herite : modale du
// changelog, fond noir dans toutes les variantes : texte clair hérité de la modale (couleur de son parent, ou de l'élément pour un
// pseudo-élément), au lieu de l'accent.
const T = (page, sel, quoi, quand = TOUS, etat = null, o = {}) => ({ page, sel, quoi, quand, etat, ...o });
const CLAIR = sombre => !sombre;
const TEXTES = [
  T('textes', '#outil', 'barre d\'outils de l\'éditeur'),
  T('textes', '#outil', 'barre d\'outils de l\'éditeur survolée', TOUS, 'hover'),
  T('textes', '#page-lien', 'page de la pagination', CLAIR),
  T('textes', '#page-lien', 'page de la pagination survolée', TOUS, 'hover'),
  T('textes', '#page-span', 'page de la pagination (span) survolée', SOMBRE, 'hover'),
  T('textes', '#page-tableau', 'page de tableau survolée', SOMBRE, 'hover'),
  T('textes', '#lien-info', 'lien d\'une alerte info', SOMBRE),
  T('textes', '#lien-avertissement', 'lien d\'une alerte d\'avertissement', SOMBRE),
  T('textes', '#lien-danger', 'lien d\'une alerte de danger', SOMBRE),
  T('textes', '#menu-actif', 'entrée active du menu de la barre du haut', MOBILE),
  T('textes', '#menu-entree', 'entrée du menu de la barre du haut pressée', MOBILE, 'active'),
  T('textes', '#onglet-modale', 'onglet actif d\'une modale', MOBILE),
  T('textes', '#libelle-confirmation', 'libellé d\'une confirmation touché', MOBILE, 'hover'),
  T('textes', '#obligatoire', 'astérisque d\'un champ obligatoire', MOBILE),
  T('textes', '#repliable', 'en-tête repliable touché', MOBILE, 'hover'),
  T('textes', '#carrousel', 'flèche du carrousel', SOMBRE),
  T('textes', '#changelog-titre', 'titre du changelog', TOUS, null, { herite: true }),
  T('textes', '#changelog-entree::before', 'coche d\'une entrée du changelog', TOUS, null, { herite: true }),
  T('textes', '#version-titre', 'version de l\'historique du changelog', TOUS, null, { herite: true }),
  T('textes', '#version-entree::before', 'puce de l\'historique du changelog', TOUS, null, { herite: true }),
  T('accueil', '#compteur', 'compteur de l\'accueil'),
  T('accueil', '#compteur-icone', 'icône d\'un compteur de l\'accueil', BUREAU),
  T('accueil', '#ministre', 'nom de la carte ministérielle'),
  T('accueil', '#forum-categorie', 'catégorie du forum de l\'accueil', BUREAU),
  T('sous-forum', '.table > tbody > tr > td > a.nomargin', 'lien vers un forum pressé', MOBILE, 'active'),
  T('sous-forum', 'span.tagforum a', 'étiquette de forum pressée', MOBILE, 'active'),
  T('réception du kramail', 'h3[class$="title"]', 'titre du panneau du kramail', MOBILE),
  T('réception du kramail', '.kramail-character-option > div > span:first-child', 'coche du personnage actif', MOBILE),
  T('réception du kramail', 'h1.page-header .btn-default', 'dossier du kramail survolé', BUREAU, 'hover'),
  T('rédaction du kramail', 'span.required', 'astérisque d\'un champ obligatoire du kramail')
];
// Rouge Kraland et bleu en dur : élément, quand, état forcé ; propriétés lues : texte, fond, bordure, contour, ombre, surbrillance tactile.
const D = (page, sel, quoi, quand = TOUS, etat = null) => ({ page, sel, quoi, quand, etat });
const DURS = [
  D('textes', '#outil-modale', 'barre d\'outils d\'une confirmation pressée', MOBILE, 'active'),
  D('textes', '#repliable', 'en-tête repliable survolé', MOBILE, 'hover'),
  D('textes', '#nom', 'champ au focus', MOBILE, 'focus'),
  D('textes', '#carte-forum', 'carte du forum'),
  D('textes', '#carte-forum', 'carte du forum au focus', TOUS, 'focus'),
  D('textes', '#mini-chat', 'bouton du mini-chat', MOBILE),
  D('rédaction du kramail', '.editeur-text [role="toolbar"] .btn', 'barre d\'outils du kramail pressée', MOBILE, 'active')
];
const PROPS_DUR = ['color', 'background-color', 'border-top-color', 'outline-color', 'box-shadow', '-webkit-tap-highlight-color'];
const ROUGE_DUR = [139, 15, 14];
const BLEU_DUR = [33, 150, 243];
const PSEUDOS_TEXTES = ['hover', 'active', 'focus', 'focus-visible'];
// Balayage du sombre : éléments interactifs forcés ensemble (survol, appui, focus).
const CIBLES_BALAYAGE = [...INTERACTIFS, '.pagination > li > span'];
const NATIONS = ['#f1', '#f2', '#f3', '#f4', '#f5', '#f6', '#f7', '#f8', '#f9'];

// À évaluer dans la page : couleur du texte (ou du pseudo-élément), couleur héritée (parent, ou l'élément pour un pseudo-élément), fond effectif
// et contraste, l'opacité de l'élément et de ses ancêtres comptée dans celle du texte ; aucune exigence de visibilité (menus fermés).
const MESURES_TEXTE = sels => {
  const K = window.__krContraste;
  return Object.fromEntries(sels.map(sel => {
    const [base, pseudo] = sel.split('::');
    const e = document.querySelector(base);
    if (!e) { return [sel, null]; }
    const c = getComputedStyle(e, pseudo ? '::' + pseudo : null).color;
    const herite = getComputedStyle(pseudo ? e : e.parentElement).color;
    const f = K.fond(e);
    const t = K.rgb(c);
    let a = t[3];
    for (let x = e; x; x = x.parentElement) { a *= Number(getComputedStyle(x).opacity); }
    return [sel, { couleur: c, herite, fond: `rgb(${f.map(Math.round).join(', ')})`, contraste: K.rapport([0, 1, 2].map(i => t[i] * a + f[i] * (1 - a)), f) }];
  }));
};
const MESURES_DUR = ([sels, props]) => Object.fromEntries(sels.map(sel => {
  const e = document.querySelector(sel);
  if (!e) { return [sel, null]; }
  const s = getComputedStyle(e);
  return [sel, Object.fromEntries(props.map(p => [p, s.getPropertyValue(p)]))];
}));
// Balayage : texte (nœud texte, valeur d'un bouton, ::before ou ::after) en primaire ou en primaire foncée, hors texte posé sur la couleur
// de nation (primaire, primaire foncée, --kr-arm-bg, --kr-arm-bg-hover), qui relève du ticket 2, et hors couleurs de nation .f1 à .f9 (vérifiées à part :
// celle d'Empire Brun vaut la primaire de Paladium sombre).
const BALAYER_PRIMAIRE = () => {
  const K = window.__krContraste;
  const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = K.rgb(getComputedStyle(i).color); i.remove(); return c; };
  const proche = (a, b) => [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1);
  const primaires = ['var(--kr-primary)', 'var(--kr-primary-dark)'].map(sonde);
  const paires = [...primaires, ...['var(--kr-arm-bg, var(--kr-primary))', 'var(--kr-arm-bg-hover, var(--kr-primary-dark))'].map(sonde)];
  const nom = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...e.classList].map(c => '.' + c).join('') + ' « ' + (e.value || e.textContent).trim().slice(0, 24) + ' »';
  const out = { vus: 0, faux: [] };
  for (const e of document.body.querySelectorAll('*')) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'OPTION'].includes(e.tagName)) { continue; }
    const cas = [];
    if (e.tagName === 'INPUT' ? ['button', 'submit', 'reset'].includes(e.type) && e.value.trim() : [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) { cas.push(['', getComputedStyle(e).color]); }
    for (const w of ['::before', '::after']) { const p = getComputedStyle(e, w); if (!['none', 'normal', '""'].includes(p.content)) { cas.push([w, p.color]); } }
    if (!cas.length || /^f[1-9]$/.test(e.className)) { continue; }
    if (paires.some(n => proche(K.fond(e), n))) { continue; }
    out.vus += 1;
    for (const [w, c] of cas) { if (primaires.some(p => proche(K.rgb(c), p))) { out.faux.push(`${nom(e)}${w} : ${c}`); } }
  }
  return out;
};

async function texteScenario(p, variante, width) {
  const mobile = width < 768;
  const sombre = variante.endsWith('-dark');
  const { context, page, denied, erreurs } = await ouvrir({ width, height: mobile ? 667 : 900, variante, url: p.url, corps: p.corps });
  const etatDe = x => (x.etat && typeof x.etat === 'object' ? x.etat[mobile ? 'mobile' : 'bureau'] : x.etat) || null;
  const textes = TEXTES.filter(x => x.page === p.nom && x.quand(sombre, mobile));
  const durs = DURS.filter(x => x.page === p.nom && x.quand(sombre, mobile));
  const cle = x => x.sel + (etatDe(x) ? ':' + etatDe(x) : '');
  const sonde = expr => page.evaluate(e => { const i = document.createElement('i'); i.style.color = e; document.body.appendChild(i); const c = getComputedStyle(i).color; i.remove(); return c; }, expr);
  const r = { accent: await sonde('var(--kr-text-accent)'), surface: await sonde('var(--kr-bg-surface)'), textes: {}, durs: {}, balayage: [] };
  const mesurer = async etat => {
    const t = textes.filter(x => etatDe(x) === etat);
    const d = durs.filter(x => x.etat === etat);
    const mt = await page.evaluate(MESURES_TEXTE, t.map(x => x.sel));
    const md = await page.evaluate(MESURES_DUR, [d.map(x => x.sel), PROPS_DUR]);
    t.forEach(x => { r.textes[cle(x)] = mt[x.sel]; });
    d.forEach(x => { r.durs[x.sel + (x.etat ? ':' + x.etat : '')] = md[x.sel]; });
    if (sombre && etat !== 'focus-visible') { r.balayage.push([etat || 'repos', await page.evaluate(BALAYER_PRIMAIRE)]); }
  };
  await mesurer(null);
  if (p.nom === 'textes') {
    r.nations = await page.evaluate(MESURES_TEXTE, NATIONS);
    r.miniChat = (await page.evaluate(MESURES, ['#mini-chat']))['#mini-chat'];
  }
  for (const etat of PSEUDOS_TEXTES) {
    const avecBalayage = sombre && etat !== 'focus-visible';
    const cibles = [...new Set([...(avecBalayage ? CIBLES_BALAYAGE : []), ...textes.filter(x => etatDe(x) === etat).map(x => x.sel.split('::')[0]), ...durs.filter(x => x.etat === etat).map(x => x.sel)])];
    if (cibles.length) { await forcer(page, cibles, etat, () => mesurer(etat)); }
  }
  await context.close();
  return { ...r, erreurs, denied: denied.filter(d => d.url.startsWith(BASE)).map(d => d.url) };
}

const ecartsTextes = (variante, mobile, res) => {
  const sombre = variante.endsWith('-dark');
  const faux = [];
  for (const [i, p] of PAGES_TEXTES.entries()) {
    const r = res[i];
    for (const x of TEXTES.filter(t => t.page === p.nom && t.quand(sombre, mobile))) {
      const etat = (x.etat && typeof x.etat === 'object' ? x.etat[mobile ? 'mobile' : 'bureau'] : x.etat) || null;
      const m = r.textes[x.sel + (etat ? ':' + etat : '')];
      const quoi = `${x.quoi}${etat ? ` (:${etat})` : ''}`;
      if (!m) { faux.push(`${quoi} : absent`); continue; }
      if (x.herite) {
        if (!memeCouleur(m.couleur, m.herite)) { faux.push(`${quoi} : ${m.couleur} au lieu du texte hérité ${m.herite}`); }
      } else if (!memeCouleur(m.couleur, r.accent) || !egal(m.couleur, attendu(variante, 'text-accent'))) { faux.push(`${quoi} : ${m.couleur} au lieu de --kr-text-accent ${attendu(variante, 'text-accent')}`); }
      if (!(m.contraste >= 4.5)) { faux.push(`${quoi} : ${m.contraste.toFixed(2)}:1 sur ${m.fond}`); }
    }
  }
  return faux;
};
const couleursDe = s => (String(s).match(/rgba?\([^)]*\)|color\(srgb[^)]*\)/g) || []).map(lire);
const ecartsDurs = (variante, mobile, res) => {
  const sombre = variante.endsWith('-dark');
  const faux = [];
  for (const [i, p] of PAGES_TEXTES.entries()) {
    for (const x of DURS.filter(d => d.page === p.nom && d.quand(sombre, mobile))) {
      const m = res[i].durs[x.sel + (x.etat ? ':' + x.etat : '')];
      const quoi = `${x.quoi}${x.etat ? ` (:${x.etat})` : ''}`;
      if (!m) { faux.push(`${quoi} : absent`); continue; }
      for (const [k, v] of Object.entries(m)) {
        for (const c of couleursDe(v)) {
          if ([0, 1, 2].every(j => Math.abs(c[j] - ROUGE_DUR[j]) <= 1)) { faux.push(`${quoi} : ${k} ${v} (rouge Kraland)`); }
          if ([0, 1, 2].every(j => Math.abs(c[j] - BLEU_DUR[j]) <= 1)) { faux.push(`${quoi} : ${k} ${v} (#2196F3)`); }
        }
      }
    }
  }
  return faux;
};
function verifierTextes(tag, variante, res, mobile) {
  const sombre = variante.endsWith('-dark');
  const t = res[0];
  // Requêtes refusées : fixtures synthétiques seulement (les fixtures de référence demandent leurs polices, refusées par le confinement).
  check(`${tag} ${variante} : pages des textes colorés (${PAGES_TEXTES.map(p => p.nom).join(', ')}), aucune exception ; aucune requête vers le site hors fixture (textes, accueil)`, () => {
    sansEcart(res.flatMap((r, i) => [...r.erreurs.map(e => `${PAGES_TEXTES[i].nom} : exception ${e}`), ...(i < 2 ? r.denied : []).map(d => `${PAGES_TEXTES[i].nom} : requête ${d}`)]));
  });
  const n = TEXTES.filter(x => x.quand(sombre, mobile)).length;
  check(`${tag} ${variante} : texte coloré (${n} échantillons, repos et ${mobile ? 'appui ou toucher' : 'survol'}) en --kr-text-accent (changelog : texte hérité de la modale), ≥ 4,5:1`, () => sansEcart(ecartsTextes(variante, mobile, res)));
  if (sombre) {
    check(`${tag} ${variante} : aucun texte en primaire ni en primaire foncée (${PAGES_TEXTES.length} pages, repos, survol, appui et focus forcés ; ${res.reduce((s, r) => s + r.balayage.reduce((u, [, b]) => u + b.vus, 0), 0)} textes)`, () => {
      sansEcart(res.flatMap((r, i) => r.balayage.flatMap(([etat, b]) => b.faux.slice(0, 4).map(f => `${PAGES_TEXTES[i].nom} (${etat}) ${f}`))));
    });
    check(`${tag} ${variante} : couleurs de nation .f1 à .f9 ≥ 4,5:1 sur bg-surface`, () => {
      sansEcart(NATIONS.flatMap(s => { const m = t.nations[s]; return !m ? [`${s} : absent`] : [...(memeCouleur(m.fond, t.surface) ? [] : [`${s} : fond ${m.fond} au lieu de bg-surface ${t.surface}`]), ...(m.contraste >= 4.5 ? [] : [`${s} : ${m.couleur} à ${m.contraste.toFixed(2)}:1`])]; }));
    });
  }
  check(`${tag} ${variante} : ${mobile ? 'bouton du mini-chat en paire d\'action, ' : ''}contour de la carte du forum au focus en --kr-text-accent`, () => {
    const faux = mobile ? ecartsDePaire(variante, 'bouton du mini-chat', t.miniChat, 'repos') : [];
    const focus = t.durs['#carte-forum:focus'];
    if (!focus || !memeCouleur(focus['outline-color'], t.accent)) { faux.push(`carte du forum au focus : contour ${focus && focus['outline-color']} au lieu de ${t.accent}`); }
    sansEcart(faux);
  });
  if (variante !== 'kraland') {
    const nd = DURS.filter(x => x.quand(sombre, mobile)).length;
    check(`${tag} ${variante} : aucun rouge Kraland rgb(139, 15, 14) ni #2196F3 en dur (${nd} éléments : ${PROPS_DUR.join(', ')})`, () => sansEcart(ecartsDurs(variante, mobile, res)));
  }
}
for (const [frag, width] of [['textes-mobile', 375], ['textes-bureau', 1280]]) {
  if (!on(frag)) { continue; }
  const tag = `[${width}]`;
  console.log(`Texte coloré ${width} px, 16 variantes : ${PAGES_TEXTES.map(p => p.nom).join(', ')} ; couleurs de nation et balayage en sombre ; rouge et bleu en dur hors Kraland`);
  const cas = VARIANTES.flatMap(variante => PAGES_TEXTES.map(p => ({ p, variante })));
  const res = await mapLimit(cas, c => texteScenario(c.p, c.variante, width), 16);
  VARIANTES.forEach((v, i) => verifierTextes(tag, v, res.slice(i * PAGES_TEXTES.length, (i + 1) * PAGES_TEXTES.length), width < 768));
}
if (on('textes-largeurs')) {
  console.log(`Texte coloré, largeurs ${LARGEURS.join(', ')} px contre 375 et 1280 px : ${VARIANTES_LARGEURS.join(' et ')}`);
  const cas = VARIANTES_LARGEURS.flatMap(variante => [375, 1280, ...LARGEURS].flatMap(width => PAGES_TEXTES.map(p => ({ p, variante, width }))));
  const res = await mapLimit(cas, c => texteScenario(c.p, c.variante, c.width), 16);
  const de = (variante, width) => res.filter((r, i) => cas[i].variante === variante && cas[i].width === width);
  // Valeurs comparées, à plat (page, clé) pour nommer chaque écart : couleur des textes (leur fond peut changer avec la page : kramail sous
  // 769 px), propriétés des valeurs en dur, paire du mini-chat.
  const couleurs = o => Object.fromEntries(Object.entries(o || {}).map(([k, m]) => [k, m && m.couleur]));
  const valeurs = l => l.flatMap((r, i) => Object.entries({ accent: r.accent, ...couleurs(r.textes), ...r.durs, ...couleurs(r.nations), miniChat: r.miniChat && [r.miniChat.couleur, r.miniChat.fondPropre] })
    .map(([k, v]) => [`${PAGES_TEXTES[i].nom} ${k}`, JSON.stringify(v)]));
  const ecartsValeurs = (a, b) => { const m = new Map(b); return a.filter(([k, v]) => m.get(k) !== v).map(([k, v]) => `${k} : ${v} au lieu de ${m.get(k)}`); };
  for (const variante of VARIANTES_LARGEURS) {
    for (const width of LARGEURS) {
      const ref = width < 768 ? 375 : 1280;
      check(`[largeurs] ${variante} ${width} px : texte coloré, rouge et bleu en dur comme à ${ref} px, mêmes contrôles verts`, () => {
        const faux = [...ecartsTextes(variante, width < 768, de(variante, width)), ...(variante === 'kraland' ? [] : ecartsDurs(variante, width < 768, de(variante, width)))];
        sansEcart(faux);
        sansEcart(ecartsValeurs(valeurs(de(variante, width)), valeurs(de(variante, ref))).map(x => `contre ${ref} px, ${x}`));
      });
    }
  }
}

// ---------- Mode clair thémé comme le sombre, bouton standard (ticket 4) ----------
// Une seule série de règles pour les deux modes (H5.3), sur les jetons qui changent avec le mode : en-têtes et pieds du panneau standard,
// en-têtes de tableau (Bootstrap et DataTables) en header-tint, bordure border-tint, texte text-primary ; onglets bordés de border-tint,
// actif sur bg-surface ; bouton standard (« ? Aide » compris) en bg-surface, survol et appui en header-tint, bordure border-tint, texte
// text-nation ; hr masqué ; --kr-text-secondary à #636a77 en clair (Q26). Sur mobile, l'en-tête de panneau garde la carte mobile
// (bg-surface, sans bordure : règle propre au mobile, qui garde la main).
// Bundle d'avant le ticket 4 (commit de base du plan), sauf KR_SCRIPT_AVANT : comparaisons du tableau de bord et des pages de référence.
const BASELINE4 = '6685df5';
const avant4 = (() => {
  if (process.env.KR_SCRIPT_AVANT) { return fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, ''); }
  try { return execFileSync('git', ['show', `${BASELINE4}:kraland-userscript-main.user.js`], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, ''); } catch (_e) { return null; }
})();
const PAGE_COMPOSANTS = { nom: 'composants', url: PAGE, corps: FIXTURE('palette-nation-composants.html') };
// Élément, nom, fond attendu (tint : header-tint ; surface : bg-surface ; null : non vérifié), bordure vérifiée (haut, bas), texte attendu
// (primaire : text-primary ; nation : text-nation).
const E4 = (sel, quoi, fond, bord, texte) => ({ sel, quoi, fond, bord, texte });
const PANNEAUX4 = [
  E4('#entete', 'en-tête de panneau', 'tint', 'bas', 'primaire'),
  E4('#entete-titre', 'titre de l\'en-tête', null, null, 'primaire'),
  E4('#pied', 'pied de panneau', 'tint', 'haut', 'primaire'),
  E4('#th-tete', 'en-tête de tableau', 'tint', 'bas', 'primaire'),
  E4('#th-ligne', 'en-tête de ligne', 'tint', 'haut', 'primaire'),
  E4('#th-pied', 'pied de tableau', 'tint', 'haut', 'primaire'),
  E4('#dt-tete', 'en-tête DataTables trié', 'tint', 'bas', 'primaire'),
  E4('#dt-pied', 'pied DataTables', 'tint', 'haut', 'primaire'),
  E4('#onglets', 'barre d\'onglets', null, 'bas', null),
  E4('#onglet-actif', 'onglet actif', 'surface', 'haut', 'primaire'),
  E4('#onglet-inactif', 'onglet inactif', null, null, 'primaire')
];
// Bouton standard : repos et états qui gardent le fond de repos (focus, désactivé), états pressés (header-tint), pseudo-classes forcées sur
// button, a et input.
const BS_REPOS = [['#bs-button', 'button'], ['#bs-a', 'a'], ['#bs-input', 'input'], ['#bs-focus', '.focus'], ['#bs-disabled', '.disabled'], ['#bs-attr-disabled', '[disabled]'], ['#bs-fieldset', 'fieldset[disabled]'], ['#bs-aide', '« ? Aide »']];
const BS_APPUI = [['#bs-active', '.active'], ['#bs-menu', 'menu ouvert']];
const BS_BASES = ['#bs-button', '#bs-a', '#bs-input'];
const BS_PSEUDOS = [['hover', 'tint'], ['active', 'tint'], ['focus', 'surface']];
const SELS4 = [...PANNEAUX4.map(e => e.sel), ...BS_REPOS.map(([s]) => s), ...BS_APPUI.map(([s]) => s), '#separateur'];
// Gris de Bootstrap 3.3.7 de ces composants (en-têtes #f5f5f5, #333, #ddd ; bouton standard #ccc, #e6e6e6, #adadad, #8c8c8c, #d4d4d4 ;
// onglets #555, #eee) : aucun en clair.
const GRIS_BOOTSTRAP = ['#f5f5f5', '#dddddd', '#333333', '#cccccc', '#e6e6e6', '#adadad', '#8c8c8c', '#d4d4d4', '#555555', '#eeeeee'];
const SECONDAIRE_CLAIR = '#636a77';
const commeGris = c => { const a = lire(c); return a[3] > 0 && GRIS_BOOTSTRAP.find(h => { const b = hexa(h); return [0, 1, 2].every(i => Math.abs(a[i] - b[i]) <= 1); }); };
// Même couleur à 1 près par canal (opacité ramenée à 0..255).
const proche = (a, b) => { const x = lire(a); const y = lire(b); return [0, 1, 2].every(i => Math.abs(x[i] - y[i]) <= 1) && Math.abs(x[3] - y[3]) * 255 <= 1; };

const MESURES4 = sels => {
  const K = window.__krContraste;
  return Object.fromEntries(sels.map(sel => {
    const e = document.querySelector(sel);
    if (!e) { return [sel, null]; }
    const s = getComputedStyle(e);
    return [sel, { display: s.display, couleur: s.color, fondPropre: s.backgroundColor, haut: s.borderTopColor, bas: s.borderBottomColor, traits: [s.borderTopWidth, s.borderBottomWidth].map(parseFloat), contraste: K.texte(e) }];
  }));
};
// Jetons lus sur une sonde et contrastes du texte atténué sur blanc, bg-page, header-tint et info-bg.
const JETONS4 = absent => {
  const K = window.__krContraste;
  const sonde = expr => { const i = document.createElement('i'); i.style.color = expr; document.body.appendChild(i); const c = getComputedStyle(i).color; i.remove(); return c; };
  const j = { surface: sonde('var(--kr-bg-surface)'), primaire: sonde('var(--kr-text-primary)'), secondaire: sonde('var(--kr-text-secondary)'), page: sonde('var(--kr-bg-page)'), tint: sonde(`var(--kr-header-tint, ${absent})`), info: sonde('var(--kr-alert-info-bg)') };
  const opaque = c => { const x = K.rgb(c); return [0, 1, 2].map(i => x[i] * x[3] + 255 * (1 - x[3])); };
  j.contrastes = Object.fromEntries([['blanc', 'rgb(255, 255, 255)'], ['bg-page', j.page], ['header-tint', j.tint], ['info-bg', j.info]].map(([k, c]) => [k, K.rapport(opaque(j.secondaire), opaque(c))]));
  return j;
};

// Bouton de groupe du tableau de bord du plateau (bouton standard natif cloné par le template) : sa règle garde la main, rendu au repos et
// survolé identique au bundle d'avant le ticket (avant4, plus bas).
const TABLEAU = '#bs-tableau';
const mesurerTableau = async page => ({ repos: (await page.evaluate(MESURES4, [TABLEAU]))[TABLEAU], survol: (await forcer(page, [TABLEAU], 'hover', () => page.evaluate(MESURES4, [TABLEAU])))[TABLEAU] });

async function composantsScenario(variante, width) {
  const mobile = width < 768;
  let tableauAvant = null;
  if (avant4) {
    const a = await ouvrir({ width, height: mobile ? 667 : 900, variante, url: PAGE_COMPOSANTS.url, corps: PAGE_COMPOSANTS.corps, script: avant4, secondaire: true });
    tableauAvant = await mesurerTableau(a.page);
    await a.context.close();
  }
  const { context, page, denied, erreurs } = await ouvrir({ width, height: mobile ? 667 : 900, variante, url: PAGE_COMPOSANTS.url, corps: PAGE_COMPOSANTS.corps });
  const r = { posee: await page.evaluate(VARIANTE_POSEE, variante), mobile: await page.evaluate(() => document.body.classList.contains('mobile-mode')) };
  r.jetons = await page.evaluate(JETONS4, ABSENT);
  r.repos = await page.evaluate(MESURES4, SELS4);
  r.etats = {};
  for (const [pseudo] of BS_PSEUDOS) { r.etats[pseudo] = await forcer(page, BS_BASES, pseudo, () => page.evaluate(MESURES4, BS_BASES)); }
  r.onglet = (await forcer(page, ['#onglet-inactif'], 'hover', () => page.evaluate(MESURES4, ['#onglet-inactif'])))['#onglet-inactif'];
  r.tableau = { avant: tableauAvant, apres: await mesurerTableau(page) };
  if (SHOTS && ['kraland', 'paladium', 'empire-brun-dark'].includes(variante)) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `palette-nation-composants-${width}-${variante}.png`), fullPage: true });
  }
  await context.close();
  return { ...r, erreurs, denied: denied.filter(d => d.url.startsWith(BASE)).map(d => d.url) };
}

// Écarts d'un élément : fond, bordure, texte attendus, texte ≥ 4,5:1.
const ecarts4 = (variante, quoi, m, j, { fond, bord, texte }) => {
  if (!m) { return [`${quoi} : absent`]; }
  const faux = [];
  if (fond === 'tint' && !egal(m.fondPropre, attendu(variante, 'header-tint'))) { faux.push(`${quoi} : fond ${m.fondPropre} au lieu de header-tint ${attendu(variante, 'header-tint')}`); }
  if (fond === 'surface' && !proche(m.fondPropre, j.surface)) { faux.push(`${quoi} : fond ${m.fondPropre} au lieu de bg-surface ${j.surface}`); }
  if (bord && !egal(m[bord], attendu(variante, 'border-tint'))) { faux.push(`${quoi} : bordure ${bord} ${m[bord]} au lieu de border-tint ${attendu(variante, 'border-tint')}`); }
  if (texte === 'primaire' && !proche(m.couleur, j.primaire)) { faux.push(`${quoi} : texte ${m.couleur} au lieu de text-primary ${j.primaire}`); }
  if (texte === 'nation' && !egal(m.couleur, attendu(variante, 'text-nation'))) { faux.push(`${quoi} : texte ${m.couleur} au lieu de text-nation ${attendu(variante, 'text-nation')}`); }
  if (texte && !(m.contraste >= 4.5)) { faux.push(`${quoi} : ${m.contraste.toFixed(2)}:1 (${m.couleur})`); }
  return faux;
};
const BOUTON4 = fond => ({ fond, bord: 'haut', texte: 'nation' });
function verifierComposants(tag, variante, r) {
  const sombre = variante.endsWith('-dark');
  const mobile = r.mobile;
  check(`${tag} ${variante} : variante posée, aucune exception, aucune requête vers le site hors fixture (composants)`, () => {
    assert.ok(r.posee, 'variante non posée');
    assert.deepEqual(r.erreurs, [], 'exceptions : ' + r.erreurs.join(' | '));
    assert.deepEqual(r.denied, [], 'requêtes refusées : ' + r.denied.join(' '));
  });
  check(`${tag} ${variante} : en-têtes et pieds de panneau, en-têtes de tableau (Bootstrap, DataTables) en header-tint${mobile ? ' (en-tête de panneau : carte mobile en bg-surface)' : ''}, bordure border-tint, texte text-primary ≥ 4,5:1 ; onglets bordés de border-tint, actif sur bg-surface, survolé ≥ 4,5:1`, () => {
    const faux = PANNEAUX4.flatMap(e => ecarts4(variante, e.quoi, r.repos[e.sel], r.jetons, mobile && e.sel === '#entete' ? { ...e, fond: 'surface', bord: null } : e));
    faux.push(...ecarts4(variante, 'onglet inactif survolé', r.onglet, r.jetons, { bord: 'haut', texte: 'primaire' }));
    sansEcart(faux);
  });
  check(`${tag} ${variante} : bouton standard (button, a, input ; .focus, .disabled, [disabled], fieldset[disabled], « ? Aide » ; .active, menu ouvert ; :hover, :active, :focus) : fond bg-surface, survol et appui en header-tint, bordure border-tint, texte text-nation ≥ 4,5:1`, () => {
    const faux = [
      ...BS_REPOS.flatMap(([s, q]) => ecarts4(variante, q, r.repos[s], r.jetons, BOUTON4('surface'))),
      ...BS_APPUI.flatMap(([s, q]) => ecarts4(variante, q, r.repos[s], r.jetons, BOUTON4('tint'))),
      ...BS_PSEUDOS.flatMap(([ps, fond]) => BS_BASES.map(s => [ps, fond, s]).flatMap(([p, f, s]) => ecarts4(variante, `${s.replace('#bs-', '')}:${p}`, r.etats[p][s], r.jetons, BOUTON4(f))))
    ];
    sansEcart(faux);
  });
  check(`${tag} ${variante} : bouton de groupe du tableau de bord (règle propre) au repos et survolé comme avant le ticket (${BASELINE4})`, () => {
    const { avant, apres } = r.tableau;
    assert.ok(avant, `bundle « avant » introuvable (KR_SCRIPT_AVANT ou commit ${BASELINE4})`);
    sansEcart(['repos', 'survol'].flatMap(e => (!avant[e] || !apres[e] ? [`${e} : absent`] : ['couleur', 'fondPropre', 'haut', 'bas'].filter(k => !proche(apres[e][k], avant[e][k])).map(k => `${e} : ${k} ${apres[e][k]} au lieu de ${avant[e][k]}`))));
  });
  check(`${tag} ${variante} : hr masqué`, () => assert.equal(r.repos['#separateur'] && r.repos['#separateur'].display, 'none'));
  if (!sombre) {
    check(`${tag} ${variante} : aucun gris de Bootstrap (${GRIS_BOOTSTRAP.join(', ')}) en texte, fond ou bordure des en-têtes, onglets et boutons standard`, () => {
      // Texte : seulement sur un élément qui en porte (la barre d'onglets n'en a pas : texte du corps hérité).
      const sansTexte = PANNEAUX4.filter(e => !e.texte).map(e => e.sel);
      const mesures = [...Object.entries(r.repos).filter(([s]) => s !== '#separateur').map(([s, m]) => [s, m && sansTexte.includes(s) ? { ...m, couleur: 'rgba(0, 0, 0, 0)' } : m]), ...BS_PSEUDOS.flatMap(([p]) => Object.entries(r.etats[p]).map(([s, m]) => [`${s}:${p}`, m])), ['#onglet-inactif:hover', r.onglet]];
      // Bordure : seulement quand elle est tracée (une bordure d'épaisseur nulle prend la couleur du texte).
      const vues = m => ['couleur', 'fondPropre', ...(m.traits[0] > 0 ? ['haut'] : []), ...(m.traits[1] > 0 ? ['bas'] : [])];
      sansEcart(mesures.filter(([, m]) => m).flatMap(([s, m]) => vues(m).filter(k => commeGris(m[k])).map(k => `${s} : ${k} ${m[k]} (${commeGris(m[k])})`)));
    });
    check(`${tag} ${variante} : --kr-text-secondary ${SECONDAIRE_CLAIR}, ≥ 4,5:1 sur blanc, bg-page, header-tint et info-bg`, () => {
      const faux = egal(r.jetons.secondaire, SECONDAIRE_CLAIR) ? [] : [`text-secondary ${r.jetons.secondaire} au lieu de ${SECONDAIRE_CLAIR}`];
      Object.entries(r.jetons.contrastes).filter(([, c]) => !(c >= 4.5)).forEach(([k, c]) => faux.push(`sur ${k} : ${c.toFixed(2)}:1`));
      sansEcart(faux);
    });
  }
}
for (const [frag, width] of [['composants-mobile', 375], ['composants-bureau', 1280]]) {
  if (!on(frag)) { continue; }
  const tag = `[${width}]`;
  console.log(`Composants ${width} px, 16 variantes : en-têtes et pieds de panneau, en-têtes de tableau, onglets, bouton standard, hr, texte atténué du clair`);
  const res = await parVariante(variante => composantsScenario(variante, width));
  VARIANTES.forEach((v, i) => verifierComposants(tag, v, res[i]));
}
if (on('composants-largeurs')) {
  console.log(`Composants, largeurs ${LARGEURS.join(', ')} px contre 375 et 1280 px : ${VARIANTES_LARGEURS.join(' et ')}`);
  const cas = VARIANTES_LARGEURS.flatMap(variante => [375, 1280, ...LARGEURS].map(width => ({ variante, width })));
  const res = await mapLimit(cas, c => composantsScenario(c.variante, c.width));
  const valeurs = r => JSON.stringify({ jetons: { ...r.jetons, contrastes: undefined }, repos: r.repos, etats: r.etats, onglet: r.onglet }, (k, v) => (k === 'contraste' ? undefined : v));
  for (const variante of VARIANTES_LARGEURS) {
    const de = width => res[cas.findIndex(c => c.variante === variante && c.width === width)];
    for (const width of LARGEURS) {
      const ref = width < 768 ? 375 : 1280;
      check(`[largeurs] ${variante} ${width} px (${width < 768 ? 'mobile' : 'ordinateur'}) : composants comme à ${ref} px, aucune exception`, () => {
        const m = de(width);
        assert.equal(m.mobile, width < 768, 'mode mobile');
        assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
        assert.equal(valeurs(m), valeurs(de(ref)));
      });
    }
  }
}

// Pages de référence (sujet, sous-forum, index RP, réception du kramail, plateau), 375 et 1280 px, 16 variantes : chaque composant (en-tête
// et pied du panneau standard, en-tête de tableau, bouton standard, onglets) comparé au bundle d'avant le ticket (BASELINE4) : en sombre,
// inchangé sauf le fond et le texte du bouton standard, qui passent à bg-surface et text-nation (en clair, son texte venait de la règle des
// liens : text-accent) ; en clair, seule une valeur native de Bootstrap (un gris ; son blanc en fond du bouton standard et de l'onglet
// actif ; l'absence de fond d'un en-tête de tableau) peut devenir un jeton du ticket (header-tint, border-tint, text-primary, bg-surface, text-nation) ; une valeur transparente ou autre reste : une règle
// propre à la page garde la main. Texte ≥ 4,5:1 dans ces
// composants. Bundle d'avant : texte atténué du clair posé à #636a77 (TEXTE_SECONDAIRE_CLAIR), seul écart de jeton accepté.
const PAGES4 = PAGES_BALAYAGE.filter(p => ['sujet', 'sous-forum', 'index RP', 'réception du kramail', 'plateau'].includes(p.nom));
const SEL_COMPOSANTS4 = COMPOSANTS_TICKET4;
const RELEVER4 = sel => {
  const K = window.__krContraste;
  const nom = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + [...e.classList].map(c => '.' + c).join('') + ' « ' + (e.value || e.textContent).trim().slice(0, 24) + ' »';
  const visible = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width >= 1 && r.height >= 1 && s.visibility === 'visible' && !e.closest('[aria-hidden="true"]'); };
  const releves = [...document.querySelectorAll(sel)].map(e => {
    const s = getComputedStyle(e);
    return { nom: nom(e), standard: e.matches('.btn-default'), ongletActif: e.matches('.active > a'), th: e.tagName === 'TH', couleur: s.color, fondPropre: s.backgroundColor, haut: parseFloat(s.borderTopWidth) > 0 ? s.borderTopColor : 'aucune', bas: parseFloat(s.borderBottomWidth) > 0 ? s.borderBottomColor : 'aucune' };
  });
  const textes = [];
  for (const e of document.body.querySelectorAll('*')) {
    if (!e.closest(sel) || ['SCRIPT', 'STYLE', 'OPTION'].includes(e.tagName)) { continue; }
    const texte = e.tagName === 'INPUT' ? ['button', 'submit', 'reset'].includes(e.type) && e.value.trim() : [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (texte && visible(e)) { textes.push({ nom: nom(e), contraste: K.texte(e), couleur: getComputedStyle(e).color }); }
  }
  return { composants: releves, textes };
};
async function pages4(p, variante, width) {
  const mobile = width < 768;
  const res = {};
  for (const [cote, script] of [['avant', avant4], ['apres', userscript]]) {
    const { context, page, erreurs } = await ouvrir({ width, height: mobile ? 667 : 900, variante, url: p.url, corps: p.corps, script, secondaire: cote === 'avant' });
    res[cote] = { ...(await page.evaluate(RELEVER4, SEL_COMPOSANTS4)), jetons: await page.evaluate(JETONS4, ABSENT), erreurs };
    await context.close();
  }
  return res;
}
const ecartsPage4 = (variante, r) => {
  const sombre = variante.endsWith('-dark');
  const { avant, apres } = r;
  if (avant.composants.length !== apres.composants.length) { return [`${apres.composants.length} composants au lieu de ${avant.composants.length}`]; }
  const j = apres.jetons;
  const nouveaux = { couleur: [j.primaire, attendu(variante, 'text-nation')], fondPropre: [attendu(variante, 'header-tint'), j.surface], haut: [attendu(variante, 'border-tint')], bas: [attendu(variante, 'border-tint')] };
  // Valeur native de Bootstrap 3.3.7 : un de ses gris ; le blanc seulement en fond du bouton standard et de l'onglet actif ; transparent
  // seulement en fond d'un en-tête de tableau (Bootstrap ne lui en donne pas). Toute autre valeur vient d'une règle de la page : elle doit
  // rester. Limite : une règle de page qui poserait un fond transparent sur un th, battue par la règle commune, ne se distingue pas du natif.
  const natif = (c, k, x) => commeGris(c) || (k === 'fondPropre' && (x.standard || x.ongletActif) && proche(c, 'rgb(255, 255, 255)')) || (k === 'fondPropre' && x.th && lire(c)[3] === 0);
  const faux = [];
  avant.composants.forEach((a, i) => {
    const p = apres.composants[i];
    for (const k of ['couleur', 'fondPropre', 'haut', 'bas']) {
      if (a[k] === p[k] || (a[k] !== 'aucune' && p[k] !== 'aucune' && proche(a[k], p[k]))) { continue; }
      const nouveau = p[k] !== 'aucune' && nouveaux[k].some(c => (c.startsWith('#') ? egal(p[k], c) : proche(p[k], c)));
      if (p.standard && ['couleur', 'fondPropre'].includes(k) && nouveau) { continue; } // bouton standard : texte de la nation, fond bg-surface
      if (!sombre && a[k] !== 'aucune' && natif(a[k], k, a) && nouveau) { continue; }
      faux.push(`${p.nom} : ${k} ${p[k]} au lieu de ${a[k]}`);
    }
  });
  return faux;
};
for (const [frag, width] of [['composants-pages-mobile', 375], ['composants-pages-bureau', 1280]]) {
  if (!on(frag)) { continue; }
  const tag = `[${width}]`;
  console.log(`Composants des pages de référence ${width} px, 16 variantes : ${PAGES4.map(p => p.nom).join(', ')}, contre le bundle ${BASELINE4}`);
  console.log(`  info écart accepté et consigné : --kr-text-secondary ${SECONDAIRE_CLAIR} posé sur le bundle « avant » (Q26, ticket 4)`);
  check(`${tag} bundle « avant » disponible (KR_SCRIPT_AVANT ou commit ${BASELINE4})`, () => assert.ok(avant4, 'introuvable'));
  if (!avant4) { continue; }
  const cas = PAGES4.flatMap(p => VARIANTES.map(variante => ({ p, variante })));
  const res = await mapLimit(cas, c => pages4(c.p, c.variante, width), 16);
  for (const p of PAGES4) {
    const lignes = cas.map((c, i) => [c, res[i]]).filter(([c]) => c.p === p);
    check(`${tag} ${p.nom} : composants comme avant le ticket, sauf gris et blancs de Bootstrap passés aux jetons du ticket (clair) et fond et texte du bouton standard (sombre), 16 variantes (${lignes[0][1].apres.composants.length} composants), aucune exception`, () => {
      sansEcart(lignes.flatMap(([c, r]) => [...r.apres.erreurs.map(e => `exception ${e}`), ...ecartsPage4(c.variante, r).slice(0, 4)].map(f => `${c.variante} ${f}`)));
    });
    check(`${tag} ${p.nom} : texte des composants ≥ 4,5:1, 16 variantes (${lignes.reduce((n, [, r]) => n + r.apres.textes.length, 0)} textes)`, () => {
      sansEcart(lignes.flatMap(([c, r]) => r.apres.textes.filter(t => !(t.contraste >= 4.5)).slice(0, 4).map(t => `${c.variante} ${t.nom} : ${t.contraste.toFixed(2)}:1 (${t.couleur})`)));
    });
  }
}

// ---------- Peau coupée ----------
if (on('peau-coupee')) {
  console.log('Peau coupée (kr-theme-enabled = false), 375 et 1280 px : liens et boutons primaires Bootstrap natifs');
  const res = await mapLimit([375, 1280], async width => {
    const { context, page, denied, erreurs } = await ouvrir({ width, height: width < 768 ? 667 : 720, theme: false });
    const m = await page.evaluate(REPOS, JETONS);
    m.natifs = await page.evaluate(MESURES, ['#bouton-primaire', '#lien-bouton-primaire', '#bp-label', '#bp-span', '#bp-input']);
    await context.close();
    return { ...m, erreurs, denied: denied.filter(d => d.url.startsWith(BASE)).map(d => d.url) };
  });
  [375, 1280].forEach((width, i) => {
    const m = res[i];
    check(`[peau coupée] ${width} px : liens Bootstrap natifs (${BOOTSTRAP_LIEN}), boutons primaires natifs (#337ab7, texte blanc), ni surcharge ni jeton, aucune exception`, () => {
      assert.equal(m.peau, false, 'html.kr-theme-enabled posée');
      assert.deepEqual(m.variantes, []);
      assert.equal(m.accentDeclare, '', '--kr-text-accent déclaré');
      for (const [ou, l] of Object.entries(m.liens)) { assert.ok(egal(l.couleur, BOOTSTRAP_LIEN), `${ou} : ${l.couleur}`); }
      // Boutons primaires de Bootstrap 3.3.7 : fond #337ab7, texte blanc, bordure #2e6da4.
      sansEcart(Object.entries(m.natifs).filter(([, b]) => !(egal(b.fondPropre, '#337ab7') && egal(b.couleur, '#ffffff') && egal(b.bordure, '#2e6da4'))).map(([k, b]) => `${k} : ${b.couleur} sur ${b.fondPropre}, bordure ${b.bordure}`));
      assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
      assert.deepEqual(m.denied, [], 'requêtes refusées : ' + m.denied.join(' '));
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
