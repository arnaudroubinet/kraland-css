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
//   primaire foncée texte posé sur --kr-primary-dark, qui prend la paire de survol d'action (--kr-arm-bg-hover, --kr-arm-ink-hover) : page
//                   active de la pagination au repos (8 variantes claires, 375 et 1280 px), boutons primaires, croix des panneaux mobiles
//                   (.kr-mobile-close) et « tout voir » du changelog (.kr-changelog-view-all) survolés (16 variantes, 1280 px) : texte ≥ 4,5:1
//                   sur son fond, fond et texte de la paire là où elle s'applique ;
//   alerte sombre   .alert-info des 8 variantes sombres : fond et bordure inchangés (rgb(122, 82, 64) à 0,15 et 0,3), repris au ticket 5 ;
//   largeurs        767, 768, 769, 1440 et 1920 px, Kraland et Empire Brun sombre : mêmes valeurs qu'à 375 et 1280 px ;
//   peau coupée     kr-theme-enabled = false : liens Bootstrap natifs (#337ab7), aucun jeton de la surcharge.
// Hors de ce ticket, donc non vérifiés ici : texte des boutons primaires au repos et tout texte posé sur la couleur de nation (ticket 2),
// liens des alertes en sombre et autres textes en primaire (ticket 3), en-têtes, onglets et bouton standard (ticket 4), alerte info du
// sombre (ticket 5), focus (ticket 7).
// Page = FIXTURE SYNTHÉTIQUE (tests/e2e/fixtures/palette-nation.html) servie à /regles/avancees ; vrai Bootstrap 3.3.7 (tests/e2e/vendor) ;
// variantes ouvertes et contrastes mesurés par l'outil partagé (lib/variantes.mjs). Confinement réseau ; seul geste : le survol à la souris,
// aucun clic, aucun envoi.
//
// Usage : npm run build && node tests/e2e/palette-nation.mjs   (ou npm run test:zone -- palette-nation)
// Options : KR_SCRIPT (bundle testé), KR_SHOTS=/dossier (captures hors dépôt), KR_FRAG = mobile, bureau, largeurs, peau-coupee (vide = tout).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { krReady, styleSettled, THEME_READY } from './lib/settle.mjs';
import { CONTRASTE, VARIANTES, VARIANTE_POSEE, choisirVariante, parVariante } from './lib/variantes.mjs';

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
  'confederation-libre': ['#6b7280', '#565b66', '#475369', '#e3e5e9', '#475369', '#6b7280', '#6b7280', '#ffffff', '#565b66', '#ffffff', '#f3f4f5', '#e4e6e8', '#f6f7f7', '#eaebed', '#6b72801f'],
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
async function ouvrir({ width, height, variante = 'kraland', theme = true }) {
  const mobile = width < 768;
  const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  const denied = await confineNetwork(context); // refus global EN PREMIER, routes de la fixture ensuite
  await context.route(PAGE, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/css/bootstrap1.min.css', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }));
  await context.route(BASE + '/lib/bootstrap-3.3.7/js/bootstrap.min.js', route => route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.js'), contentType: 'application/javascript' }));
  await context.route(BASE + '/lib/jquery-3.3.1/jquery-3.3.1.min.js', route => route.fulfill({ path: path.join(VENDOR, 'jquery.min.js'), contentType: 'application/javascript' }));
  if (theme) { await context.addInitScript(choisirVariante, variante); } else { await context.addInitScript(() => localStorage.setItem('kr-theme-enabled', 'false')); }
  await context.addInitScript(src => {
    window.GM = { xmlHttpRequest: () => {} };
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, userscript);
  const page = await context.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push(e.message));
  await page.goto(PAGE, { waitUntil: 'load' });
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

async function scenario({ variante, width, height, survol }) {
  const { context, page, denied, erreurs } = await ouvrir({ width, height, variante });
  const m = await page.evaluate(REPOS, JETONS);
  m.posee = await page.evaluate(VARIANTE_POSEE, variante);
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
// Page active de la pagination, au repos : en sombre, html[class*="-dark"] .pagination > .active > a (fond primaire, ticket 2) l'emporte.
function paginationActive(tag, variante, m) {
  if (variante.endsWith('-dark')) { return; }
  check(`${tag} ${variante} : page active de la pagination, paire de survol d'action, texte ≥ 4,5:1`, () => sansEcart(ecartsPaire(variante, 'page active', m.pagination, m.pagination.fondPropre)));
}
// Survolés : croix des panneaux mobiles et « tout voir » prennent la paire dans les 16 variantes ; boutons primaires en clair (en sombre,
// html[class*="-dark"] .btn-primary:hover et les règles E3 l'emportent : texte ≥ 4,5:1 seulement).
function texteSurPrimaireFoncee(tag, variante, m) {
  const sombre = variante.endsWith('-dark');
  check(`${tag} ${variante} : survolés, paire de survol d'action et texte ≥ 4,5:1 (.kr-mobile-close, .kr-changelog-view-all${sombre ? ' ; boutons primaires : texte ≥ 4,5:1 seulement' : ', boutons primaires'})`, () => {
    const faux = [];
    for (const [k, quoi, paire] of [['button', 'button.btn-primary', !sombre], ['a', 'a.btn-primary', !sombre], ['croix', '.kr-mobile-close', true], ['toutVoir', '.kr-changelog-view-all', true]]) {
      const s = m.survols[k];
      if (!s.survole) { faux.push(`${quoi} : survol non obtenu`); continue; }
      if (paire) { faux.push(...ecartsPaire(variante, quoi, s, s.fond)); } else if (!(s.contraste >= 4.5)) { faux.push(`${quoi} : ${s.contraste.toFixed(2)}:1 (${s.couleur} sur ${s.fond})`); }
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
  console.log('Mobile (375 × 667), 16 variantes : jetons de rôle, liens au repos, page active de la pagination (clair), alerte info (sombre)');
  const res = await parVariante(variante => scenario({ variante, width: 375, height: 667, survol: false }));
  VARIANTES.forEach((v, i) => {
    socle('[375]', v, res[i]);
    jetons('[375]', v, res[i]);
    liensRepos('[375]', v, res[i]);
    empireBrun('[375]', v, res[i]);
    paginationActive('[375]', v, res[i]);
    alerteSombre('[375]', v, res[i]);
  });
}

if (on('bureau')) {
  console.log('Ordinateur (1280 × 720), 16 variantes : jetons de rôle, liens au repos et au survol, consommateurs des jetons redéfinis, texte sur la primaire foncée');
  const res = await parVariante(variante => scenario({ variante, width: 1280, height: 720, survol: true }));
  VARIANTES.forEach((v, i) => {
    socle('[1280]', v, res[i]);
    jetons('[1280]', v, res[i]);
    liensRepos('[1280]', v, res[i]);
    empireBrun('[1280]', v, res[i]);
    survols('[1280]', v, res[i]);
    consommateurs('[1280]', v, res[i]);
    paginationActive('[1280]', v, res[i]);
    texteSurPrimaireFoncee('[1280]', v, res[i]);
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
  for (const variante of VARIANTES_LARGEURS) {
    const de = width => res[cas.findIndex(c => c.variante === variante && c.width === width)];
    check(`[largeurs] ${variante} : à 375 et 1280 px, jetons égaux à DESIGN.md, liens en text-accent, mêmes valeurs au repos aux deux largeurs`, () => {
      sansEcart([375, 1280].flatMap(w => [...ecartsJetons(variante, de(w)), ...ecartsLiens(variante, de(w))].map(x => `${w} px : ${x}`)));
      assert.equal(valeurs(de(1280)), valeurs(de(375)));
    });
    for (const width of LARGEURS) {
      const m = de(width);
      check(`[largeurs] ${variante} ${width} px (${width < 768 ? 'mobile' : 'ordinateur'}) : jetons et liens de DESIGN.md, mêmes valeurs qu'à 375 et 1280 px${width >= 768 ? ', liens survolés compris' : ''}, aucune exception`, () => {
        assert.ok(m.posee, 'variante non posée');
        assert.equal(m.mobile, width < 768, 'mode mobile');
        assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
        assert.deepEqual(m.denied, [], 'requêtes refusées : ' + m.denied.join(' '));
        sansEcart([...ecartsJetons(variante, m), ...ecartsLiens(variante, m)]);
        assert.equal(valeurs(m), valeurs(de(375)), 'repos contre 375 px');
        assert.equal(valeurs(m), valeurs(de(1280)), 'repos contre 1280 px');
        if (width >= 768) { assert.equal(survolsLiens(m), survolsLiens(de(1280)), 'liens survolés contre 1280 px'); }
      });
    }
  }
}

// ---------- Peau coupée ----------
if (on('peau-coupee')) {
  console.log('Peau coupée (kr-theme-enabled = false), 375 et 1280 px : liens Bootstrap natifs');
  const res = await mapLimit([375, 1280], async width => {
    const { context, page, denied, erreurs } = await ouvrir({ width, height: width < 768 ? 667 : 720, theme: false });
    const m = await page.evaluate(REPOS, JETONS);
    await context.close();
    return { ...m, erreurs, denied: denied.filter(d => d.url.startsWith(BASE)).map(d => d.url) };
  });
  [375, 1280].forEach((width, i) => {
    const m = res[i];
    check(`[peau coupée] ${width} px : liens Bootstrap natifs (${BOOTSTRAP_LIEN}), ni surcharge ni jeton, aucune exception`, () => {
      assert.equal(m.peau, false, 'html.kr-theme-enabled posée');
      assert.deepEqual(m.variantes, []);
      assert.equal(m.accentDeclare, '', '--kr-text-accent déclaré');
      for (const [ou, l] of Object.entries(m.liens)) { assert.ok(egal(l.couleur, BOOTSTRAP_LIEN), `${ou} : ${l.couleur}`); }
      assert.deepEqual(m.erreurs, [], 'exceptions : ' + m.erreurs.join(' | '));
      assert.deepEqual(m.denied, [], 'requêtes refusées : ' + m.denied.join(' '));
    });
  });
}

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
