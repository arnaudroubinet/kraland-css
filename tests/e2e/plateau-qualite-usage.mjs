// Test de la qualité d'usage du plateau (PLT-QU) : compétences nommées, pastilles par classes,
// actions et accès rapides en grilles, légendes tactiles, planchers de texte. Fixture locale, aucun réseau.
//
// Usage : npm run build && node tests/e2e/plateau-qualite-usage.mjs
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const html = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-qualite-usage.html'), 'utf8');
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const SETTLE_MS = 3600; // la page est masquée jusqu'à 3 s (anti-FOUC) puis le thème est posé

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 772 } });
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
await page.waitForTimeout(SETTLE_MS);
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
await page.waitForTimeout(300);
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
check('en-tête de groupe ≥ 11 px (12 px), statut ≥ 11 px (12 px)', () => { assert.ok(s.fonts.header >= 11 && s.fonts.status >= 11, JSON.stringify(s.fonts)); });
check('en-tête de groupe : fond surface + filet, plus d\'aplat saturé', () => { assert.notEqual(s.headerBg, 'rgb(122, 82, 64)'); assert.equal(s.headerBorder, '4px'); });
check('pas de débordement horizontal', () => assert.equal(s.overflowX, 0, `${s.overflowX} px`));

console.log('Idempotence (réinjection du script par-dessus un DOM déjà transformé)');
await page.evaluate((src) => {
  // eslint-disable-next-line no-eval
  (0, eval)(src);
  document.body.appendChild(document.createElement('span'));
}, userscript);
await page.waitForTimeout(2500);
const s2 = await snapshot();
check('aucun doublon de grille, de pastille ni de légende après réinjection', () => { assert.equal(s2.gridCount, 1); assert.equal(s2.quickCount, 1); assert.equal(s2.skills.length, 4); });
check('actions et accès rapides inchangés après réinjection', () => { assert.deepEqual(s2.gridTexts, ['Dormir', 'Prier', 'Pouvoir', 'Fouiller']); assert.deepEqual(s2.quickTexts, ['Agir', 'Matériel', 'Personnage', 'Bâtiments', 'Employés']); });
const dupes = await page.evaluate(() => [...document.querySelectorAll('#skills-panel a.kr-skill')].map(a => [a.querySelectorAll('.badge').length, a.querySelectorAll('.kr-skill-caption').length, a.querySelectorAll('img').length]));
check('1 pastille, 1 légende, 1 icône par compétence', () => assert.deepEqual(dupes, [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]));

console.log('Tactile et tablette large (hover: none, pointer: coarse) : 1180 px');
await page.setViewportSize({ width: 1180, height: 820 });
await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await page.waitForTimeout(1800);
const t = await snapshot();
check('légende du nom visible sans survol, ≥ 11 px', () => assert.ok(t.skills.every(k => k.captionDisplay !== 'none' && k.captionFont >= 11), JSON.stringify(t.skills.map(k => [k.captionDisplay, k.captionFont]))));
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
