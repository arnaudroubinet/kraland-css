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
