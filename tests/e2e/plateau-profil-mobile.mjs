// Test du profil mobile DÉPLIÉ (PLT-QU, correctif C1) : 6 caractéristiques + 18 compétences = 24 cellules,
// clonées par le script depuis le DOM transformé (aucune fixture qui cache le style inline du clone).
// Fixture locale dérivée de plateau-qualite-usage.html (structure du site réel, aucune donnée réelle, aucun réseau).
//
// Usage : npm run build && node tests/e2e/plateau-profil-mobile.mjs
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
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const SETTLE_MS = 3600;

const SKILLS = ['Baratin', 'Combat Mains Nues', 'Combat Contact', 'Combat Distance', 'Commerce', 'Démolition',
  'Discrétion', 'Éloquence', 'Falsification', 'Foi', 'Informatique', 'Médecine',
  'Observation', 'Organisation', 'Pouvoir', 'Séduction', 'Survie', 'Vol'];
const LEVELS = [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 11];
const STATS = ['FOR', 'VOL', 'CHA', 'GES', 'INT', 'PER'];

// Fixture : on remplace les 4 compétences et 2 caractéristiques de la fixture par les 18 + 6 du jeu réel
const base = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-qualite-usage.html'), 'utf8');
const skillsHtml = SKILLS.map((n, i) => `<a class="list-group-item ds_game alert11${i + 1}" href="#"><h4 class="list-group-item-heading"><span class="mini">${n}</span> <span class="mention">${LEVELS[i]}</span></h4></a>`).join('\n');
const statsHtml = STATS.map((n, i) => `<div class="col-md-6"><a class="btn btn-success alert12${i + 1} mini" href="#">${n} ${i + 2}</a></div>`).join('\n');
const html = base
  .replace(/<a class="list-group-item ds_game alert111"[\s\S]*?alert114[\s\S]*?<\/a>/, skillsHtml)
  .replace(/<div class="btn-group-xs">[\s\S]*?<\/div><\/div>/, `<div class="row">${statsHtml}</div></div>`);

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });
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

const measure = () => page.evaluate(() => {
  const R = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; };
  const mp = document.querySelector('.mobile-mini-profile');
  const cells = [...document.querySelectorAll('.mobile-mini-profile-characteristics > *, .mobile-mini-profile-skills > *')];
  const skillsBox = document.querySelector('.mobile-mini-profile-skills');
  const statsBox = document.querySelector('.mobile-mini-profile-characteristics');
  return {
    exists: Boolean(mp),
    cls: mp ? mp.className : '',
    mobile: document.body.classList.contains('mobile-mode'),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    mp: mp ? R(mp) : null,
    detailsH: mp ? R(mp.querySelector('.mobile-mini-profile-details')).h : null,
    skillsBox: skillsBox ? { rect: R(skillsBox), scrollH: skillsBox.scrollHeight, clientH: skillsBox.clientHeight, overflowY: getComputedStyle(skillsBox).overflowY, cols: getComputedStyle(skillsBox).gridTemplateColumns.split(' ').length } : null,
    statsBox: statsBox ? { cols: getComputedStyle(statsBox).gridTemplateColumns.split(' ').length, scrollW: statsBox.scrollWidth, clientW: statsBox.clientWidth } : null,
    nStats: document.querySelectorAll('.mobile-mini-profile-characteristics > *').length,
    nSkills: document.querySelectorAll('.mobile-mini-profile-skills > *').length,
    cells: cells.map((c) => {
      const cap = c.querySelector('.kr-skill-caption');
      const img = c.querySelector('img, svg');
      const badge = c.querySelector('.badge');
      const cs = getComputedStyle(c);
      const capCs = cap ? getComputedStyle(cap) : null;
      return {
        label: c.getAttribute('aria-label'),
        hasHref: c.getAttribute('href'),
        inline: c.getAttribute('style'),
        rect: R(c),
        padL: parseFloat(cs.paddingLeft), padR: parseFloat(cs.paddingRight), minW: cs.minWidth,
        scrollW: c.scrollWidth, clientW: c.clientWidth,
        cap: cap ? { text: cap.textContent, font: parseFloat(capCs.fontSize), rect: R(cap), lines: Math.round(R(cap).h / parseFloat(capCs.lineHeight)), scrollW: cap.scrollWidth, clientW: cap.clientWidth, display: capCs.display } : null,
        img: img ? R(img) : null,
        badge: badge ? R(badge) : null,
        badgePos: badge ? getComputedStyle(badge).position : null
      };
    }),
    clicks: window.__clicks
  };
});

const overlaps = (cells) => {
  const bad = [];
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = i + 1; j < cells.length; j += 1) {
      const a = cells[i].rect; const b = cells[j].rect;
      const ix = Math.min(a.r, b.r) - Math.max(a.x, b.x); const iy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
      if (ix > 0.5 && iy > 0.5) { bad.push(`${i}/${j}`); }
    }
  }
  return bad;
};

async function runWidth(width, expectedSkillCols) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(TARGET, { waitUntil: 'load' });
  await page.waitForTimeout(SETTLE_MS);
  console.log(`Profil mobile ${width} px`);

  // --- replié ---
  const closed = await measure();
  check('mode mobile, mini-profil replié', () => { assert.ok(closed.mobile && closed.exists); assert.ok(/collapsed/.test(closed.cls)); });
  check('replié : détails masqués (hauteur 0)', () => assert.ok(closed.detailsH < 1, String(closed.detailsH)));

  // --- déplié ---
  await page.tap('.mobile-mini-profile-header');
  await page.waitForTimeout(900);
  const s = await measure();
  await page.screenshot({ path: path.join(process.env.TMPDIR || '/tmp', `profil-deplie-${width}.png`), fullPage: false });
  check('état déplié', () => assert.ok(/expanded/.test(s.cls)));
  check('6 caractéristiques + 18 compétences clonées (24)', () => { assert.equal(s.nStats, 6); assert.equal(s.nSkills, 18); assert.equal(s.cells.length, 24); });
  check('noms des 24 cellules : 6 caractéristiques puis 18 compétences', () => {
    assert.deepEqual(s.cells.map((c) => c.cap && c.cap.text), [...STATS, ...SKILLS]);
  });
  check(`${expectedSkillCols} colonnes de compétences`, () => assert.equal(s.skillsBox.cols, expectedSkillCols));
  check('6 colonnes de caractéristiques, sans débordement', () => { assert.equal(s.statsBox.cols, 6); assert.ok(s.statsBox.scrollW <= s.statsBox.clientW + 1); });
  check('padding .btn 12px 20px et min-width 64 px neutralisés sur les clones', () => assert.ok(s.cells.every((c) => c.padL <= 4 && c.padR <= 4 && c.minW === '0px'), JSON.stringify(s.cells.map((c) => [c.padL, c.minW]).slice(0, 3))));
  check('plus de style inline sur les clones', () => assert.ok(s.cells.every((c) => !c.inline), JSON.stringify(s.cells.map((c) => c.inline).filter(Boolean).slice(0, 2))));
  check('aucun chevauchement entre les 24 cellules', () => assert.deepEqual(overlaps(s.cells), []));
  check('aucune cellule ne déborde du conteneur ni de l\'écran', () => assert.ok(s.cells.every((c) => c.rect.x >= 0 && c.rect.r <= width + 0.5)));
  check('contenu de chaque cellule dans sa boîte (pas de débordement)', () => assert.ok(s.cells.every((c) => c.scrollW <= c.clientW + 1), JSON.stringify(s.cells.filter((c) => c.scrollW > c.clientW + 1).map((c) => c.cap.text))));
  check('légendes ≥ 11 px et visibles', () => assert.ok(s.cells.every((c) => c.cap && c.cap.display !== 'none' && c.cap.font >= 11)));
  check('légendes : mots entiers (aucun mot coupé ni tronqué)', () => assert.ok(s.cells.every((c) => c.cap.scrollW <= c.cap.clientW + 1), JSON.stringify(s.cells.filter((c) => c.cap.scrollW > c.cap.clientW + 1).map((c) => c.cap.text))));
  check('légendes sur 2 lignes au plus', () => assert.ok(s.cells.every((c) => c.cap.lines <= 2), JSON.stringify(s.cells.filter((c) => c.cap.lines > 2).map((c) => [c.cap.text, c.cap.lines]))));
  check('légende dans la cellule', () => assert.ok(s.cells.every((c) => c.cap.rect.x >= c.rect.x - 0.5 && c.cap.rect.r <= c.rect.r + 0.5 && c.cap.rect.b <= c.rect.b + 0.5)));
  check('nom complet accessible (aria-label) sur les 24 cellules', () => assert.ok(s.cells.every((c) => c.label && c.label.length > 3), JSON.stringify(s.cells.map((c) => c.label).slice(0, 8))));
  check('icônes intégrales (32 px) dans leur cellule', () => assert.ok(s.cells.every((c) => c.img && c.img.w >= 31.5 && c.img.h >= 31.5 && c.img.x >= c.rect.x - 0.5 && c.img.r <= c.rect.r + 0.5 && c.img.y >= c.rect.y - 0.5 && c.img.b <= c.rect.b + 0.5)));
  check('pastille au coin bas-droit de l\'icône, dans la cellule', () => assert.ok(s.cells.every((c) => c.badge && c.badgePos === 'absolute' && c.badge.x >= c.rect.x - 0.5 && c.badge.r <= c.rect.r + 0.5 && c.badge.y >= c.rect.y - 0.5 && c.badge.b <= c.rect.b + 0.5 && c.badge.x + c.badge.w / 2 >= c.img.x + c.img.w / 2 && c.badge.y + c.badge.h / 2 >= c.img.y + c.img.h / 2), JSON.stringify(s.cells.filter((c) => !(c.badge.r <= c.rect.r + 0.5)).map((c) => c.cap.text))));
  check('pastille hors de la légende', () => assert.ok(s.cells.every((c) => c.badge.b <= c.cap.rect.y + 0.5 || c.badge.r <= c.cap.rect.x + 0.5 || c.badge.x >= c.cap.rect.r - 0.5), JSON.stringify(s.cells.filter((c) => c.badge.b > c.cap.rect.y + 0.5).map((c) => c.cap.text))));
  check('toutes les rangées visibles : panneau à la hauteur de son contenu', () => {
    assert.ok(s.skillsBox.scrollH <= s.skillsBox.clientH + 1, `${s.skillsBox.scrollH} > ${s.skillsBox.clientH}`);
    assert.notEqual(s.skillsBox.overflowY, 'auto');
    const last = Math.max(...s.cells.map((c) => c.rect.b));
    assert.ok(last <= s.mp.b + 0.5, `dernière cellule ${last} > panneau ${s.mp.b}`);
  });
  check('panneau déplié non coupé (détails = contenu)', () => assert.ok(s.detailsH >= s.skillsBox.rect.b - s.skillsBox.rect.y + 100));
  check('pas de débordement horizontal', () => assert.equal(s.overflowX, 0, `${s.overflowX} px`));

  // --- gestionnaires natifs : le clic sur une cellule clonée atteint le gestionnaire du site, sans replier le panneau ---
  await page.tap('.mobile-mini-profile-skills > *:nth-child(2)');
  await page.waitForTimeout(300);
  const after = await measure();
  check('clic sur un clone : gestionnaire natif atteint, panneau toujours déplié', () => { assert.ok((after.clicks.alert112 || 0) >= 1, JSON.stringify(after.clicks)); assert.ok(/expanded/.test(after.cls)); });

  // --- repli puis redépli (transitions) ---
  await page.tap('.mobile-mini-profile-header');
  await page.waitForTimeout(900);
  const folded = await measure();
  check('repli : classe collapsed, détails masqués', () => { assert.ok(/collapsed/.test(folded.cls)); assert.ok(folded.detailsH < 1, String(folded.detailsH)); });
  await page.tap('.mobile-mini-profile-header');
  await page.waitForTimeout(900);
  const again = await measure();
  check('redépli : mêmes 24 cellules, 0 chevauchement', () => { assert.equal(again.cells.length, 24); assert.deepEqual(overlaps(again.cells), []); });
}

await runWidth(375, 4);
await runWidth(700, 6);

// >= 768 : le mini-profil n'existe pas (mode desktop), compétences du panneau latéral inchangées
await page.setViewportSize({ width: 768, height: 900 });
await page.goto(TARGET, { waitUntil: 'load' });
await page.waitForTimeout(SETTLE_MS);
console.log('Profil à 768 px (desktop inchangé)');
const d = await measure();
check('768 : mode desktop, pas de mini-profil', () => { assert.ok(!d.mobile); assert.ok(!d.exists); });
const desk = await page.evaluate(() => [...document.querySelectorAll('#skills-panel a.kr-skill')].map((a) => a.getAttribute('style')));
check('768 : 18 compétences du panneau latéral sans style inline', () => { assert.equal(desk.length, 18); assert.ok(desk.every((x) => !x)); });

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
