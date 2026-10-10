// Test des transitions mobile/desktop (PLT-01, 02, 03) — sans rien installer de plus :
// utilise le paquet `playwright` déjà présent dans devDependencies et un Chromium déjà téléchargé.
//
// Usage : npm run build && npm run test:transitions
// Option : KR_FIXTURE=/chemin/page-capturee.html pour tester sur une page plateau réelle
//          (les vérifications .mobile-tab-bar / .mobile-mini-profile sont alors activées).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const fixturePath = process.env.KR_FIXTURE || path.join(root, 'tests/e2e/fixtures/plateau-minimal.html');
const realFixture = Boolean(process.env.KR_FIXTURE);
const html = fs.readFileSync(fixturePath, 'utf8');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

const SETTLE_MS = 1800; // anti-rebond du script (400 ms) + rechargement + initialisation
const TARGET = 'http://www.kraland.org/jouer/plateau';

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log('  ok   ' + name);
  } catch (e) {
    failures += 1;
    console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]);
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1512, height: 772 } });
await context.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
await context.addInitScript(({ src }) => {
  window.GM = { xmlHttpRequest: () => {} };
  // eslint-disable-next-line no-eval
  const go = () => (0, eval)(src);
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript });
const page = await context.newPage();

const snap = () => page.evaluate(() => ({
  w: window.innerWidth,
  mobile: document.body.classList.contains('mobile-mode'),
  tabBar: Boolean(document.querySelector('.mobile-tab-bar')),
  miniProfile: Boolean(document.querySelector('.mobile-mini-profile')),
  marker: window.__krMarker === 1,
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  residues: Array.from(document.querySelectorAll('[style]')).filter(e => /padding-left:\s*0px\s*!important/.test(e.getAttribute('style'))).length,
  y: window.scrollY
}));

async function resizeTo(width, height = 772) {
  await page.evaluate(() => { window.__krMarker = 1; });
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(SETTLE_MS);
  return snap();
}

await page.goto(TARGET, { waitUntil: 'load' });
await page.waitForTimeout(1500);

// 1. Suite de largeurs : rechargement si et seulement si le seuil 768 est franchi
console.log('Transitions de largeur');
let previousMobile = false;
for (const width of [1512, 2560, 375, 1512, 767, 768, 767, 1280, 1024, 800]) {
  const s = await resizeTo(width);
  const expectMobile = width < 768;
  const crossed = expectMobile !== previousMobile;
  check(`${width}px : mode ${expectMobile ? 'mobile' : 'desktop'}`, () => assert.equal(s.mobile, expectMobile));
  check(`${width}px : ${crossed ? 'rechargement' : 'pas de rechargement'} (${previousMobile ? 'mobile' : 'desktop'} -> ${expectMobile ? 'mobile' : 'desktop'})`, () => assert.equal(s.marker, !crossed));
  if (!expectMobile) {
    check(`${width}px : aucun résidu de style mobile inline`, () => assert.equal(s.residues, 0));
    check(`${width}px : pas de débordement horizontal`, () => assert.ok(s.scrollWidth <= s.clientWidth, `${s.scrollWidth} > ${s.clientWidth}`));
  }
  if (realFixture && expectMobile) {
    check(`${width}px : barre d'onglets et mini-profil présents`, () => assert.ok(s.tabBar && s.miniProfile));
  }
  if (realFixture && !expectMobile) {
    check(`${width}px : pas de barre d'onglets mobile`, () => assert.ok(!s.tabBar && !s.miniProfile));
  }
  previousMobile = expectMobile;
}

// 1 bis. Jauges PV/PM/PP (PLT-07, choix A) : les deux segments natifs sont conservés, même rendu desktop et mobile.
// Valeurs de la fixture : PV 20 (reste 7, SYNTHÉTIQUE), PM 25 (reste 0), PP 0 (reste 150) — voir le commentaire de la fixture.
console.log('Jauges PV/PM/PP');
const gaugeSnap = gaugePage => gaugePage.evaluate(() => {
  const out = {};
  document.querySelectorAll('.progress[data-kr-gauge]').forEach(p => {
    const ok = p.querySelector('.progress-bar-success');
    const warn = p.querySelector('.progress-bar-warning');
    const track = p.getBoundingClientRect().width;
    out[p.dataset.krGauge] = {
      ratio: track ? ok.getBoundingClientRect().width / track : 0,
      restRatio: track ? warn.getBoundingClientRect().width / track : 0,
      restShown: getComputedStyle(warn).display !== 'none' && warn.getBoundingClientRect().height > 0,
      restBg: getComputedStyle(warn).backgroundImage,
      color: getComputedStyle(ok).backgroundColor,
      title: p.getAttribute('title')
    };
  });
  const mini = {};
  document.querySelectorAll('.mobile-gauge-compact').forEach(g => {
    const f = g.querySelector('.mobile-gauge-compact-fill');
    const r = g.querySelector('.mobile-gauge-compact-rest');
    const bar = g.querySelector('.mobile-gauge-compact-bar').getBoundingClientRect().width;
    const type = ['pv', 'pm', 'pp'].find(t => f.classList.contains(t));
    mini[type] = {
      fill: f.getBoundingClientRect().width / bar,
      rest: r.getBoundingClientRect().width / bar,
      color: getComputedStyle(f).backgroundColor,
      value: g.querySelector('.mobile-gauge-compact-value').textContent.trim()
    };
  });
  const fullHeaders = Array.from(document.querySelectorAll('.mobile-gauge-full-header')).map(h => h.textContent.replace(/\s+/g, ' ').trim());
  return { native: out, mini, fullHeaders, legend: document.querySelectorAll('.kr-gauge-legend').length };
});
const expectedGauge = { pv: [20 / 27, 7 / 27], pm: [1, 0], pp: [0, 1] };
const gaugeResults = {};
for (const width of [1512, 375]) {
  // Contexte dédié, thème activé (le reste de la suite tourne avec le thème désactivé par défaut)
  const gaugeContext = await browser.newContext({ viewport: { width, height: 772 } });
  await gaugeContext.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await gaugeContext.addInitScript(({ src }) => {
    window.localStorage.setItem('kr-theme-enabled', 'true');
    window.GM = { xmlHttpRequest: () => {} };
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (document.body) { go(); return; }
    new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
  }, { src: userscript });
  const gaugePage = await gaugeContext.newPage();
  await gaugePage.goto(TARGET, { waitUntil: 'load' });
  await gaugePage.waitForTimeout(SETTLE_MS);
  const g = await gaugeSnap(gaugePage);
  if (process.env.KR_SHOTS) {
    await gaugePage.screenshot({ path: path.join(process.env.KR_SHOTS, `jauges-${width}.png`) });
  }
  await gaugeContext.close();
  gaugeResults[width] = g;
  for (const type of ['pv', 'pm', 'pp']) {
    const [v, r] = expectedGauge[type];
    check(`${width}px : jauge ${type.toUpperCase()} segment valeur = ${v.toFixed(2)}`, () => assert.ok(g.native[type] && Math.abs(g.native[type].ratio - v) < 0.01, JSON.stringify(g.native[type])));
    check(`${width}px : jauge ${type.toUpperCase()} segment reste conservé = ${r.toFixed(2)}`, () => assert.ok(g.native[type].restShown && Math.abs(g.native[type].restRatio - r) < 0.01, JSON.stringify(g.native[type])));
    check(`${width}px : jauge ${type.toUpperCase()} reste hachuré (couleur unique)`, () => assert.match(g.native[type].restBg, /repeating-linear-gradient/));
  }
  check(`${width}px : PP à 0 garde son segment restant plein (natif)`, () => assert.ok(g.native.pp.ratio === 0 && g.native.pp.restRatio > 0.99));
  check(`${width}px : trois couleurs de thème distinctes pour la valeur`, () => assert.equal(new Set([g.native.pv.color, g.native.pm.color, g.native.pp.color]).size, 3));
  check(`${width}px : infobulle valeur / reste`, () => assert.match(g.native.pv.title, /PV : 20 .*reste jusqu'au maximum : 7/));
  check(`${width}px : légende visible`, () => assert.ok(g.legend >= 1));
}
{
  const d = gaugeResults[1512];
  const m = gaugeResults[375];
  check('mêmes couleurs de valeur en desktop et en mobile', () => assert.deepEqual(['pv', 'pm', 'pp'].map(t => d.native[t].color), ['pv', 'pm', 'pp'].map(t => m.native[t].color)));
  check('375px : mini-profil, proportions natives (PV 74 % + reste 26 %, PM 100 %, PP 0 % + reste 100 %)', () => {
    assert.ok(Math.abs(m.mini.pv.fill - 20 / 27) < 0.02 && Math.abs(m.mini.pv.rest - 7 / 27) < 0.02, JSON.stringify(m.mini.pv));
    assert.ok(m.mini.pm.fill > 0.98 && m.mini.pm.rest < 0.02, JSON.stringify(m.mini.pm));
    assert.ok(m.mini.pp.fill === 0 && m.mini.pp.rest > 0.98, JSON.stringify(m.mini.pp));
  });
  check('375px : mini-profil, mêmes couleurs de valeur que les jauges natives', () => assert.deepEqual(['pv', 'pm', 'pp'].map(t => m.mini[t].color), ['pv', 'pm', 'pp'].map(t => m.native[t].color)));
  check('375px : mini-profil, valeur affichée et aucun maximum inventé', () => {
    assert.equal(m.mini.pv.value, '20');
    assert.equal(m.fullHeaders.join('|'), 'PV 20 · reste 7|PM 25 · reste 0|PP 0 · reste 150');
  });
}

// 2. Défilement restauré après rechargement
console.log('Défilement');
await resizeTo(1512);
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(200);
const afterScroll = await resizeTo(375);
check('défilement restauré après desktop -> mobile (±40 px)', () => {
  assert.equal(afterScroll.marker, false, 'la page aurait dû se recharger');
  assert.ok(Math.abs(afterScroll.y - 600) <= 40, `scrollY = ${afterScroll.y}`);
});
const backScroll = await resizeTo(1512);
check('défilement restauré après mobile -> desktop (±40 px)', () => assert.ok(Math.abs(backScroll.y - 600) <= 40, `scrollY = ${backScroll.y}`));

// 3. Saisie en cours : pas de rechargement, bandeau proposé, texte conservé
console.log('Saisie en cours');
await page.fill('#champ-saisie', 'texte en cours de rédaction');
const typing = await resizeTo(375);
const bannerShown = await page.evaluate(() => Boolean(document.getElementById('kr-resize-banner')));
const typed = await page.inputValue('#champ-saisie');
check('pas de rechargement avec une saisie en cours', () => assert.equal(typing.marker, true));
check('bandeau « Recharger » affiché', () => assert.ok(bannerShown));
check('texte saisi conservé', () => assert.equal(typed, 'texte en cours de rédaction'));
await resizeTo(1512);
const bannerGone = await page.evaluate(() => !document.getElementById('kr-resize-banner'));
check('bandeau retiré au retour dans le mode chargé', () => assert.ok(bannerGone));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
