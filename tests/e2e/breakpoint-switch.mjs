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
const backTyping = await snap();
check('E2 : 0 résidu de style mobile après saisie -> 375 -> 1512', () => assert.equal(backTyping.residues, 0));
check('E2 : body.mobile-mode jamais posé sans rechargement', () => assert.equal(backTyping.mobile, false));

// 4. E1 : hauteur de barre recalculée au redimensionnement (barre à 14 entrées, sans rechargement)
console.log('Barre de navigation au redimensionnement');
const navHtml = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-navbar-large.html'), 'utf8');
const navContext = await browser.newContext({ viewport: { width: 1512, height: 800 } });
await navContext.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: navHtml }));
await navContext.addInitScript(({ src }) => {
  window.GM = { xmlHttpRequest: () => {} };
  // Thème actif (sinon la feuille de style n'est pas injectée et la barre n'est pas fixe)
  localStorage.setItem('kr-theme-enabled', 'true');
  localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
  // eslint-disable-next-line no-eval
  const go = () => (0, eval)(src);
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript });
const navPage = await navContext.newPage();

const measureNav = () => navPage.evaluate(() => {
  const nav = document.querySelector('nav.navbar');
  const navRect = nav.getBoundingClientRect();
  const items = Array.from(nav.querySelectorAll('.navbar-nav > li')).filter(li => li.getBoundingClientRect().height > 0);
  return {
    w: window.innerWidth,
    barHeight: Math.round(navRect.height),
    paddingTop: Math.round(parseFloat(getComputedStyle(document.body).paddingTop)),
    visible: items.length,
    outside: items.filter(li => li.getBoundingClientRect().bottom > navRect.bottom + 1).length
  };
});

async function navResize(width, height = 800) {
  await navPage.setViewportSize({ width, height });
  await navPage.waitForTimeout(SETTLE_MS);
  return measureNav();
}

const direct = {};
async function directLoad(width, height = 800) {
  if (direct[width]) { return direct[width]; }
  const p = await navContext.newPage();
  await p.setViewportSize({ width, height });
  await p.goto(TARGET, { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { document.title = 'direct'; });
  direct[width] = await p.evaluate(() => {
    const nav = document.querySelector('nav.navbar');
    return { barHeight: Math.round(nav.getBoundingClientRect().height) };
  });
  await p.close();
  return direct[width];
}

async function runNavSequence(label, start, steps) {
  await navPage.setViewportSize({ width: start, height: 800 });
  await navPage.goto(TARGET, { waitUntil: 'load' });
  await navPage.waitForTimeout(1500);
  await navPage.evaluate(() => { window.__krMarker = 1; });
  for (const width of steps) {
    const m = await navResize(width);
    const ref = await directLoad(width);
    const reloaded = await navPage.evaluate(() => window.__krMarker !== 1);
    if (reloaded) {
      // Un rechargement (seuil 768) remet le marqueur à zéro : on le repose
      await navPage.evaluate(() => { window.__krMarker = 1; });
    }
    if (width >= 768) {
      check(`${label} : ${width}px barre = chargement direct (${m.barHeight} vs ${ref.barHeight} px, ±1)`, () => assert.ok(Math.abs(m.barHeight - ref.barHeight) <= 1));
      check(`${label} : ${width}px entrées toutes dans la barre (${m.visible} visibles)`, () => assert.equal(m.outside, 0));
      check(`${label} : ${width}px padding-top du body = hauteur de barre (${m.paddingTop} vs ${m.barHeight})`, () => assert.ok(Math.abs(m.paddingTop - m.barHeight) <= 1));
    }
  }
}

await runNavSequence('900 -> 1280 -> 1100', 900, [1280, 1100]);
await runNavSequence('991 -> 992', 991, [992, 991, 992]);
await runNavSequence('1100 -> 900 -> 1512', 1100, [900, 1512]);
await runNavSequence('1512 -> 1100 -> 1360 -> 1000', 1512, [1100, 1360, 1000]);

// iPad : rotation 820x1180 -> 1180x820 (émulation)
await navPage.setViewportSize({ width: 820, height: 1180 });
await navPage.goto(TARGET, { waitUntil: 'load' });
await navPage.waitForTimeout(1500);
const landscape = await navResize(1180, 820);
const landscapeRef = await directLoad(1180, 820);
check(`rotation 820x1180 -> 1180x820 : barre = chargement direct (${landscape.barHeight} vs ${landscapeRef.barHeight} px)`, () => assert.ok(Math.abs(landscape.barHeight - landscapeRef.barHeight) <= 1));
check('rotation 820x1180 -> 1180x820 : 14 entrées sur 14 dans la barre', () => assert.ok(landscape.visible === 14 && landscape.outside === 0, `${landscape.visible} visibles, ${landscape.outside} hors barre`));
check(`rotation : padding-top du body = hauteur de barre (${landscape.paddingTop} vs ${landscape.barHeight})`, () => assert.ok(Math.abs(landscape.paddingTop - landscape.barHeight) <= 1));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
