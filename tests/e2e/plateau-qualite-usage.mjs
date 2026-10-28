// Test de la qualité d'usage du plateau (PLT-QU) : compétences nommées, pastilles par classes,
// actions et accès rapides en grilles, légendes tactiles, planchers de texte. Fixture locale, aucun réseau.
//
// Fragment cartes (épopée 9, entrée 2, H7.1) : carte de personnage selon sa propre largeur ; fixture synthétique de 49 noms
// (plateau-cartes-noms.html), vrai Bootstrap 3.3.7, 768 à 1920 px, seuil de carte 199/200/201 px, Kraland clair et Empire Brun sombre ;
// 1512 et 1920 px et mobile 375 / 700 / 767 comparés au bundle de base ; bascule 767 -> 768 -> 767 px dans le même onglet.
//
// Usage : npm run build && node tests/e2e/plateau-qualite-usage.mjs
// Options : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal) ; KR_SCRIPT_AVANT (bundle de base
// du fragment cartes, défaut : git show e203f87) ; KR_FRAG = usage, cartes (vide = tout).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { frames, krReady, styleSettled, THEME_READY, waitState } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-qualite-usage.html'), 'utf8');
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const on = name => FRAG.length === 0 || FRAG.includes(name);

const browser = await launchBrowser();

// ---------- cartes : carte de personnage selon sa propre largeur (épopée 9, entrée 2) ----------
const SEUIL_CARTE = 200; // en dessous, le nom passe sous l'avatar
const VARIANTES = ['kraland', 'empire-brun-dark'];
const BUREAUX = [768, 769, 900, 1024, 1100, 1280, 1366, 1440, 1500, 1512, 1920];
const VENDOR = process.env.KR_BOOTSTRAP_DIR || path.join(root, 'tests/e2e/vendor');
const sansEntete = s => s.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

async function ouvrirCartes(src, { width, height = 800, variante }) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await confineNetwork(ctx);
  const noms = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-cartes-noms.html'), 'utf8')
    .replace('</head>', '<link rel="stylesheet" href="/lib/bootstrap-3.3.7/css/bootstrap.min.css"></head>');
  await ctx.route('http://www.kraland.org/**', route => {
    const u = new URL(route.request().url());
    if (u.pathname === '/jouer/plateau') { return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: noms }); }
    if (u.pathname.startsWith('/lib/bootstrap')) { return route.fulfill({ path: path.join(VENDOR, 'bootstrap.min.css'), contentType: 'text/css' }); }
    return route.abort();
  });
  await ctx.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
  await ctx.addInitScript(({ s, v }) => {
    window.GM = { xmlHttpRequest: () => {} };
    localStorage.setItem('kr-theme-enabled', 'true');
    localStorage.setItem('kr-theme-variant', v);
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(s);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { s: src, v: variante });
  const p = await ctx.newPage();
  await p.goto(TARGET, { waitUntil: 'load' });
  await krReady(p, { ready: THEME_READY, label: `cartes ${width} px ${variante}` });
  return { ctx, p };
}

const mesurerCartes = p => p.evaluate(() => {
  const box = el => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(x => Math.round(x * 2) / 2); };
  return {
    variante: [...document.documentElement.classList].find(c => c.startsWith('kr-theme-variant-')) || '',
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    cartes: [...document.querySelectorAll('.dashboard-card')].map(c => {
      const n = c.querySelector('.dashboard-card-name');
      const nc = c.querySelector('.dashboard-card-name-container');
      const a = c.querySelector('.dashboard-card-avatar');
      const nr = n.getBoundingClientRect(); const ar = a.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        nom: n.textContent.trim(), cw: c.getBoundingClientRect().width, inner: c.clientWidth,
        carte: box(c), avatar: box(a), boiteNom: box(n), conteneur: nc.getBoundingClientRect().width, entete: nc.parentElement.getBoundingClientRect().width,
        gaucheNom: Math.round(nc.firstElementChild.getBoundingClientRect().left * 2) / 2, drapeau: !!nc.querySelector('img'),
        gaucheStatut: c.querySelector('.dashboard-card-status') ? Math.round(c.querySelector('.dashboard-card-status').getBoundingClientRect().left * 2) / 2 : null,
        lignes: nr.height / parseFloat(cs.lineHeight), deborde: n.scrollWidth > n.clientWidth + 1, sw: n.scrollWidth, clw: n.clientWidth,
        dessous: nr.top >= ar.bottom - 1, taille: cs.fontSize,
        styles: [getComputedStyle(c).containerType, getComputedStyle(c).containerName, cs.overflowWrap, getComputedStyle(nc).flexBasis, getComputedStyle(nc).padding].join('|')
      };
    })
  };
});

async function cartesDe(src, opts) {
  const { ctx, p } = await ouvrirCartes(src, opts);
  const m = await mesurerCartes(p);
  await ctx.close();
  return m;
}

const vide = l => assert.equal(l.length, 0, l.slice(0, 6).join(' | '));

function verifierCartes(m, etiquette) {
  check(`${etiquette} : 49 cartes, variante ${m.variante}`, () => assert.equal(m.cartes.length, 49));
  check(`${etiquette} : avatars de 70×70`, () => assert.ok(m.cartes.every(c => c.avatar[2] === 70 && c.avatar[3] === 70), JSON.stringify([...new Set(m.cartes.map(c => c.avatar.slice(2).join('×')))])));
  check(`${etiquette} : noms en 15 px`, () => assert.ok(m.cartes.every(c => c.taille === '15px')));
  check(`${etiquette} : aucun nom ne déborde en largeur`, () => vide(m.cartes.filter(c => c.deborde).map(c => `${c.nom} ${c.sw}/${c.clw} carte ${c.cw}${c.dessous ? ' dessous' : ''}`)));
  check(`${etiquette} : deux lignes de nom au plus`, () => vide(m.cartes.filter(c => c.lignes > 2.05).map(c => `${c.nom} ${c.lignes.toFixed(2)}`)));
  check(`${etiquette} : nom sous l'avatar seulement sous ${SEUIL_CARTE} px de carte`, () => vide(m.cartes.filter(c => c.dessous !== (c.cw < SEUIL_CARTE)).map(c => `${c.nom} ${c.cw}px dessous=${c.dessous}`)));
  check(`${etiquette} : nom dessous sur toute la largeur de l'en-tête de la carte`, () => vide(m.cartes.filter(c => c.dessous && Math.abs(c.conteneur - c.entete) > 1).map(c => `${c.nom} ${c.conteneur}/${c.entete}`)));
  // Nom dessous aligné sur le statut : bord gauche du bloc du nom (drapeau compris quand il existe) = bord gauche du statut, ±1 px.
  for (const [libelle, avec] of [['avec drapeau', true], ['sans drapeau', false]]) {
    check(`${etiquette} : nom dessous ${libelle}, bord gauche égal à celui du statut`, () => {
      const l = m.cartes.filter(c => c.dessous && c.drapeau === avec && c.gaucheStatut !== null);
      if (m.cartes.some(c => c.dessous)) { assert.ok(l.length > 0, `aucune carte étroite ${libelle}`); }
      vide(l.filter(c => Math.abs(c.gaucheNom - c.gaucheStatut) > 1).map(c => `${c.nom} ${c.gaucheNom}/${c.gaucheStatut}`));
    });
  }
  check(`${etiquette} : pas de débordement horizontal`, () => assert.equal(m.overflowX, 0));
}

const memesBoites = (m, base, garde = () => true) => {
  const ecarts = [];
  m.cartes.forEach((c, i) => {
    const b = base.cartes[i];
    if (!garde(c, b)) { return; }
    for (const k of ['carte', 'avatar', 'boiteNom']) { if (JSON.stringify(c[k]) !== JSON.stringify(b[k])) { ecarts.push(`${c.nom} ${k} ${c[k]} / ${b[k]}`); } }
  });
  return ecarts;
};

if (on('cartes')) {
  const avant = sansEntete(process.env.KR_SCRIPT_AVANT ? fs.readFileSync(process.env.KR_SCRIPT_AVANT, 'utf8')
    : execFileSync('git', ['show', 'e203f87:kraland-userscript-main.user.js'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));
  for (const variante of VARIANTES) {
    console.log(`Cartes de personnage selon leur largeur (${variante})`);
    for (const width of BUREAUX) {
      const m = await cartesDe(userscript, { width, variante });
      verifierCartes(m, `${width} px ${variante}`);
      if (width === 1512 || width === 1920) {
        const base = await cartesDe(avant, { width, variante });
        // Égal à la base : toute carte d'au moins SEUIL_CARTE px dont le nom tenait déjà dans sa ligne à la base.
        check(`${width} px ${variante} : cartes ≥ ${SEUIL_CARTE} px égales à la base`, () => vide(memesBoites(m, base, (c, b) => c.cw >= SEUIL_CARTE && !b.deborde)));
      }
    }
    for (const width of [375, 700, 767]) {
      const m = await cartesDe(userscript, { width, height: 667, variante });
      const base = await cartesDe(avant, { width, height: 667, variante });
      check(`mobile ${width} px ${variante} : cartes, avatars et noms égaux à la base`, () => { assert.equal(m.cartes.length, base.cartes.length); assert.deepEqual(memesBoites(m, base), []); });
      // Styles de la règle du ticket (conteneur, coupure, bloc du nom) égaux à la base : une règle sortie de son média rougit à toute largeur mobile.
      check(`mobile ${width} px ${variante} : conteneur, coupure et bloc du nom égaux à la base`, () => vide(m.cartes.filter((c, i) => c.styles !== base.cartes[i].styles).map(c => `${c.nom} ${c.styles} / ${base.cartes[m.cartes.indexOf(c)].styles}`)));
    }
    console.log(`Bascule 767 -> 768 -> 767 px dans le même onglet (${variante})`);
    {
      const directs = { 767: await cartesDe(avant, { width: 767, height: 667, variante }), 768: await cartesDe(userscript, { width: 768, height: 667, variante }) };
      const { ctx, p } = await ouvrirCartes(userscript, { width: 767, height: 667, variante });
      const mobile767 = await p.evaluate(() => document.body.classList.contains('mobile-mode'));
      check(`bascule ${variante} : 767 px au chargement en mode mobile`, () => assert.ok(mobile767));
      for (const [w, mobile] of [[768, false], [767, true]]) {
        await p.waitForTimeout(1300); // écart minimal entre deux rechargements de bascule
        const charge = p.waitForEvent('load', { timeout: 8000 }).catch(() => null);
        await p.setViewportSize({ width: w, height: 667 });
        await charge;
        const etat = await waitState(p, m => document.body && document.body.classList.contains('mobile-mode') === m, mobile, { maxMs: 10000 });
        await krReady(p, { ready: THEME_READY, label: `bascule ${w} px ${variante}` });
        await frames(p);
        const m = await mesurerCartes(p);
        check(`bascule ${variante} : ${w} px, body.mobile-mode ${mobile ? 'remis' : 'levé'}`, () => assert.ok(etat));
        if (!mobile) { verifierCartes(m, `bascule ${w} px ${variante}`); }
        check(`bascule ${variante} : ${w} px égal au chargement direct${mobile ? ' de la base' : ''}`, () => { assert.equal(m.cartes.length, directs[w].cartes.length); vide(memesBoites(m, directs[w])); });
      }
      await ctx.close();
    }
    console.log(`Seuil de carte 199 / 200 / 201 px, transitions dans le même onglet (${variante})`);
    const { ctx, p } = await ouvrirCartes(userscript, { width: 1440, variante });
    for (const w of [201, 199, 200, 199, 201]) {
      await p.evaluate(px => document.querySelectorAll('.dashboard-cards-grid').forEach(g => { g.style.gridTemplateColumns = `repeat(auto-fill, ${px}px)`; }), w);
      await frames(p);
      const m = await mesurerCartes(p);
      check(`carte de ${w} px ${variante} : nom ${w < SEUIL_CARTE ? 'sous' : 'à côté de'} l'avatar`, () => { assert.ok(m.cartes.every(c => Math.round(c.cw) === w), [...new Set(m.cartes.map(c => c.cw))].join('/')); assert.ok(m.cartes.every(c => c.dessous === (w < SEUIL_CARTE))); });
      check(`carte de ${w} px ${variante} : aucun nom ne déborde, deux lignes au plus`, () => assert.ok(m.cartes.every(c => !c.deborde && c.lignes <= 2.05)));
    }
    await ctx.close();
  }
}

if (!on('usage')) {
  await browser.close();
  console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
  process.exit(failures === 0 ? 0 : 1);
}

const context = await browser.newContext({ viewport: { width: 1512, height: 772 } });
await confineNetwork(context); // refus global EN PREMIER (version.json : refusé ; img7 routé ci-dessous)
await context.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
await context.route('http://img7.kraland.org/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
await context.addInitScript(({ src }) => {
  window.GM = { xmlHttpRequest: () => {} };
  localStorage.setItem('kr-theme-enabled', 'true');
  localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
  // eslint-disable-next-line no-eval
  const go = () => (0, eval)(src);
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);

const snapshot = () => page.evaluate(() => {
  const rect = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, r: r.right, b: r.bottom }; };
  const skills = [...document.querySelectorAll('#skills-panel a.kr-skill')];
  const grid = document.querySelector('#player-actions-section .kr-action-grid');
  const quick = document.querySelector('.kr-quick-access-buttons');
  const gridBtns = grid ? [...grid.children] : [];
  const quickBtns = quick ? [...quick.children] : [];
  const cs = (sel) => { const e = document.querySelector(sel); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const badgeColors = [...document.querySelectorAll('.kr-skill-badge, .kr-stat-badge')].map(b => getComputedStyle(b).backgroundColor);
  return {
    skills: skills.map(s => ({ aria: s.getAttribute('aria-label'), title: s.title, alt: s.querySelector('img') && s.querySelector('img').alt, label: s.getAttribute('data-kr-label'), tab: s.tabIndex, toggle: s.hasAttribute('data-toggle'), badge: s.querySelector('.badge') && s.querySelector('.badge').className, inlineBadgeStyle: s.querySelector('.badge') && s.querySelector('.badge').getAttribute('style'), caption: s.querySelector('.kr-skill-caption') && s.querySelector('.kr-skill-caption').textContent, rect: rect(s), badgeRect: rect(s.querySelector('.badge')), after: getComputedStyle(s, '::after').display === 'none' ? 'hidden' : 'visible', afterDisplay: getComputedStyle(s, '::after').display, captionDisplay: getComputedStyle(s.querySelector('.kr-skill-caption')).display, captionFont: parseFloat(getComputedStyle(s.querySelector('.kr-skill-caption')).fontSize) })),
    statLabels: [...document.querySelectorAll('#col-leftest-stats a.kr-stat')].map(s => s.getAttribute('aria-label')),
    badgeColors,
    gridCount: document.querySelectorAll('.kr-action-grid').length,
    quickCount: document.querySelectorAll('.kr-quick-access-buttons').length,
    quickRows: document.querySelectorAll('.kr-quick-access-buttons .row, .kr-quick-access-buttons [class*="col-"]').length,
    gridTexts: gridBtns.map(b => b.textContent.trim()), gridRects: gridBtns.map(rect),
    gridAttrs: gridBtns.map(b => ({ href: b.getAttribute('href'), cls: [...b.classList].filter(c => /^alert/.test(c)).join(' ') })),
    hrInGrid: grid ? grid.querySelectorAll('hr').length : -1,
    hrInSection: document.querySelectorAll('#player-actions-section > hr').length,
    quickTexts: quickBtns.map(b => b.textContent.trim()), quickRects: quickBtns.map(rect), quickHrefs: quickBtns.map(b => b.getAttribute('href')),
    fonts: { header: cs('.dashboard-section-header'), status: cs('.dashboard-card-status') },
    headerBg: getComputedStyle(document.querySelector('.dashboard-section-header')).backgroundColor,
    headerBorder: getComputedStyle(document.querySelector('.dashboard-section-header')).borderLeftWidth,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
});

await page.goto(TARGET, { waitUntil: 'load' });
await krReady(page, { ready: THEME_READY, label: 'chargement plateau' });
let s = await snapshot();

console.log('Compétences nommées (desktop 1512)');
check('4 compétences transformées', () => assert.equal(s.skills.length, 4));
check('aria-label « Nom — niveau N » sur chaque compétence', () => assert.deepEqual(s.skills.map(k => k.aria), ['Baratin — niveau 0', 'Combat Mains Nues — niveau 2', 'Vol — niveau 11', 'Pouvoir — niveau 0']));
check('title identique (infobulle native) et alt = nom', () => { assert.deepEqual(s.skills.map(k => k.title), s.skills.map(k => k.aria)); assert.deepEqual(s.skills.map(k => k.alt), ['Baratin', 'Combat Mains Nues', 'Vol', 'Pouvoir']); });
check('title conservé malgré disableTooltips (data-toggle retiré)', () => { assert.ok(s.skills.every(k => !k.toggle)); assert.equal(s.skills[2].title, 'Vol — niveau 11'); });
check('cellule focusable au clavier (lien natif)', () => assert.ok(s.skills.every(k => k.tab >= 0)));
check('caractéristiques nommées', () => assert.deepEqual(s.statLabels, ['FOR : 3', 'VOL : 0']));

console.log('Pastilles : classes et couleurs');
check('is-zero pour le niveau 0, is-level pour 2 et 11', () => assert.deepEqual(s.skills.map(k => /is-zero/.test(k.badge) ? 'zero' : /is-level/.test(k.badge) ? 'level' : '?'), ['zero', 'level', 'level', 'zero']));
check('plus aucun style inline sur les pastilles', () => assert.ok(s.skills.every(k => !k.inlineBadgeStyle)));
check('ni rouge #c9302c ni bleu #0069d9 sur un état normal', () => assert.ok(s.badgeColors.every(c => c !== 'rgb(201, 48, 44)' && c !== 'rgb(0, 105, 217)'), s.badgeColors.join(' ')));
check('niveau ≥ 1 et niveau 0 de couleurs différentes', () => assert.notEqual(s.skills[1].badge, s.skills[0].badge));
check('pastille dans la boîte de sa cellule', () => assert.ok(s.skills.every(k => k.badgeRect.r <= k.rect.r + 0.5 && k.badgeRect.b <= k.rect.b + 0.5 && k.badgeRect.x >= k.rect.x - 0.5 && k.badgeRect.y >= k.rect.y - 0.5)));

console.log('Étiquette au survol et au focus (pointeur précis)');
check('étiquette masquée au repos, légende masquée', () => assert.ok(s.skills.every(k => k.after === 'hidden' && k.captionDisplay === 'none')));
await page.hover('#skills-panel a.kr-skill >> nth=1');
await styleSettled(page, '#skills-panel a.kr-skill', { index: 1, state: ':hover' }); // au lieu de 300 ms
const hovered = await page.evaluate(() => { const e = document.querySelectorAll('#skills-panel a.kr-skill')[1]; return { v: getComputedStyle(e, '::after').display === 'none' ? 'hidden' : 'visible', c: getComputedStyle(e, '::after').content }; });
check('étiquette « Nom · N » visible au survol', () => { assert.equal(hovered.v, 'visible'); assert.ok(hovered.c.includes('Combat Mains Nues · 2'), hovered.c); });
await page.mouse.move(700, 600);
await page.focus('#skills-panel a.kr-skill >> nth=2');
await page.keyboard.press('Shift+Tab');
await page.keyboard.press('Tab');
const focused = await page.evaluate(() => { const e = document.activeElement; return { skill: e.classList.contains('kr-skill'), v: getComputedStyle(e, '::after').display === 'none' ? 'hidden' : 'visible', fv: e.matches(':focus-visible') }; });
check('étiquette visible au focus clavier (:focus-visible)', () => { assert.ok(focused.skill && focused.fv); assert.equal(focused.v, 'visible'); });

console.log('Actions de jeu en grille (2 colonnes égales)');
check('une seule grille, 4 actions dans le DOM réel', () => { assert.equal(s.gridCount, 1); assert.deepEqual(s.gridTexts, ['Dormir', 'Prier', 'Pouvoir', 'Fouiller']); });
check('séparateur d\'origine hors de la grille', () => { assert.equal(s.hrInGrid, 0); assert.equal(s.hrInSection, 1); });
const cols = (rects) => [...new Set(rects.map(r => Math.round(r.x)))];
check('2 colonnes, largeurs égales (±1 px)', () => { assert.equal(cols(s.gridRects).length, 2); assert.ok(Math.max(...s.gridRects.map(r => r.w)) - Math.min(...s.gridRects.map(r => r.w)) <= 1); });
check('hauteur homogène par rangée', () => { assert.ok(Math.abs(s.gridRects[0].h - s.gridRects[1].h) <= 1 && Math.abs(s.gridRects[2].h - s.gridRects[3].h) <= 1); });
check('liens, classes et attributs d\'origine intacts', () => { assert.deepEqual(s.gridAttrs, [{ href: '#', cls: 'alert11' }, { href: '#', cls: 'alert12' }, { href: '#', cls: 'alert14' }, { href: '#', cls: 'alert1103' }]); });
await page.evaluate(() => document.querySelectorAll('#player-actions-section a.btn').forEach(a => a.click()));
const clicks = await page.evaluate(() => window.__clicks);
check('gestionnaires d\'origine toujours actifs (clic simulé sur la fixture, aucune action réelle)', () => assert.deepEqual(clicks, { alert11: 1, alert12: 1, alert14: 1, alert1103: 1 }));

console.log('Accès rapides en grille alignée sur les actions');
check('5 accès rapides, sans row/col imbriqués, destinations d\'origine', () => { assert.deepEqual(s.quickTexts, ['Agir', 'Matériel', 'Personnage', 'Bâtiments', 'Employés']); assert.equal(s.quickRows, 0); assert.deepEqual(s.quickHrefs, ['/jouer/plateau', '/jouer/materiel', '/jouer/perso', '/jouer/bat', '/jouer/pnj']); });
check('mêmes bords gauches (≤ 1 px) et mêmes largeurs que la grille d\'actions', () => {
  assert.ok(Math.abs(s.quickRects[0].x - s.gridRects[0].x) <= 1, `${s.quickRects[0].x} vs ${s.gridRects[0].x}`);
  assert.ok(Math.abs(s.quickRects[1].x - s.gridRects[1].x) <= 1);
  assert.ok(Math.abs(s.quickRects[0].w - s.gridRects[0].w) <= 1);
});
check('nombre impair : la dernière commande reste alignée à gauche', () => assert.ok(Math.abs(s.quickRects[4].x - s.quickRects[0].x) <= 1));

console.log('Textes et en-têtes');
check('en-tête de groupe ≥ 12 px, statut ≥ 12 px', () => { assert.ok(s.fonts.header >= 12 && s.fonts.status >= 12, JSON.stringify(s.fonts)); });
check('en-tête de groupe : fond surface + filet, plus d\'aplat saturé', () => { assert.notEqual(s.headerBg, 'rgb(122, 82, 64)'); assert.equal(s.headerBorder, '4px'); });
check('pas de débordement horizontal', () => assert.equal(s.overflowX, 0, `${s.overflowX} px`));

console.log('Idempotence (réinjection du script par-dessus un DOM déjà transformé)');
await page.evaluate((src) => {
  // Le nouvel InitQueue reposera html[data-kr-ready] après ses tâches différées : condition au lieu de 2,5 s
  document.documentElement.removeAttribute('data-kr-ready');
  // eslint-disable-next-line no-eval
  (0, eval)(src);
  document.body.appendChild(document.createElement('span'));
}, userscript);
await krReady(page, { label: 'réinjection plateau' });
const s2 = await snapshot();
check('aucun doublon de grille, de pastille ni de légende après réinjection', () => { assert.equal(s2.gridCount, 1); assert.equal(s2.quickCount, 1); assert.equal(s2.skills.length, 4); });
check('actions et accès rapides inchangés après réinjection', () => { assert.deepEqual(s2.gridTexts, ['Dormir', 'Prier', 'Pouvoir', 'Fouiller']); assert.deepEqual(s2.quickTexts, ['Agir', 'Matériel', 'Personnage', 'Bâtiments', 'Employés']); });
const dupes = await page.evaluate(() => [...document.querySelectorAll('#skills-panel a.kr-skill')].map(a => [a.querySelectorAll('.badge').length, a.querySelectorAll('.kr-skill-caption').length, a.querySelectorAll('img').length]));
check('1 pastille, 1 légende, 1 icône par compétence', () => assert.deepEqual(dupes, [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]));

console.log('Tactile et tablette large (hover: none, pointer: coarse) : 1180 px');
await page.setViewportSize({ width: 1180, height: 820 });
await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
// Au lieu de 1,8 s : redimensionnement distribué et règles (hover: none) appliquées (légendes affichées), borné sans erreur
await frames(page);
await waitState(page, () => window.matchMedia('(hover: none)').matches && [...document.querySelectorAll('#skills-panel .kr-skill-caption')].every(c => getComputedStyle(c).display !== 'none'), null, { maxMs: 3000 });
await frames(page);
const t = await snapshot();
check('légende du nom visible sans survol, ≥ 12 px', () => assert.ok(t.skills.every(k => k.captionDisplay !== 'none' && k.captionFont >= 12), JSON.stringify(t.skills.map(k => [k.captionDisplay, k.captionFont]))));
check('légendes = noms des compétences', () => assert.deepEqual(t.skills.map(k => k.caption), ['Baratin', 'Combat Mains Nues', 'Vol', 'Pouvoir']));
check('plus d\'étiquette de survol (remplacée par la légende)', () => assert.ok(t.skills.every(k => k.afterDisplay === 'none')));
check('aucun chevauchement entre cellules voisines (légendes comprises)', () => {
  const boxes = t.skills.map(k => k.rect);
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i]; const b = boxes[j];
      const ix = Math.max(0, Math.min(a.r, b.r) - Math.max(a.x, b.x)); const iy = Math.max(0, Math.min(a.b, b.b) - Math.max(a.y, b.y));
      assert.ok(ix * iy < 1, `cellules ${i} et ${j}`);
    }
  }
});
check('cibles tactiles ≥ 44 px pour les commandes', () => assert.ok(t.gridRects.every(r => r.h >= 44) && t.quickRects.every(r => r.h >= 44)));
check('pas de débordement horizontal à 1180', () => assert.equal(t.overflowX, 0));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
