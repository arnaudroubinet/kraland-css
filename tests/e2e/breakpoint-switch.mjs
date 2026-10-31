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
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { clockQuiet, installClock, krReady, resizeViewport, runClock, waitState } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const fixturePath = process.env.KR_FIXTURE || path.join(root, 'tests/e2e/fixtures/plateau-minimal.html');
const realFixture = Boolean(process.env.KR_FIXTURE);
const html = fs.readFileSync(fixturePath, 'utf8');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

const RESIZE_QUIET_MS = 900; // anti-rebond du script (400 ms) + marge ; état stable pendant cette durée = redimensionnement traité
const ABSENCE_QUIET_MS = 1800; // assertions d'ABSENCE de rechargement : fenêtre longue (un rechargement tardif, écart minimal de 1,2 s entre deux, doit rester visible)
// Ces deux fenêtres se jouent en temps SIMULÉ (lot D, lib/settle.mjs : installClock, clockQuiet) : l'horloge de la page avance de
// quietMs par pas de 100 ms, les minuteries du script (anti-rebond, restauration du défilement) s'exécutent sans être attendues ; un
// départ de document (rechargement) relance la fenêtre sur le document suivant.
const TARGET = 'http://www.kraland.org/jouer/plateau';

// Fragmentation (exécution parallèle) : KR_FRAG = widths, nav-large, nav-origine, nav-tardif ; vide = tout jouer.
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);

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

const browser = await launchBrowser();
const context = await browser.newContext({ viewport: { width: 1512, height: 772 } });
// Refus global EN PREMIER. Logo du thème refusé VOLONTAIREMENT (image cassée + alt, comme la référence AVANT sous
// puits DNS) : un GIF 1 x 1 rétrécit la marque et supprime le cas « barre sur deux lignes à 1000 px » de nav-origine.
await confineNetwork(context);
await installClock(context); // horloge simulée AVANT l'injection du script
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

// Sonde de stabilité d'un redimensionnement : largeur, document (__krDocId change à chaque rechargement ; performance.timeOrigin est
// figé par l'horloge simulée), mode, marqueur, bandeau, défilement
const snapProbe = () => page.evaluate(() => ({
  w: window.innerWidth, doc: window.__krDocId, mobile: document.body ? document.body.classList.contains('mobile-mode') : null,
  marker: window.__krMarker === 1, banner: Boolean(document.getElementById('kr-resize-banner')), y: Math.round(window.scrollY),
  sw: document.documentElement.scrollWidth, ready: document.readyState
}));

async function resizeTo(width, height = 772, quietMs = RESIZE_QUIET_MS) {
  await page.evaluate(() => { window.__krMarker = 1; });
  await resizeViewport(page, width, height); // événement resize distribué : l'anti-rebond part dans la fenêtre simulée qui suit
  // On attend que l'état (largeur, mode, marqueur, document, bandeau) reste identique pendant quietMs simulées : RESIZE_QUIET_MS (900 ms,
  // anti-rebond du script 400 ms + marge) quand un rechargement est attendu ; ABSENCE_QUIET_MS (1,8 s, comme avant) quand on affirme qu'il
  // n'y en a PAS. Un rechargement change le document ; son absence laisse l'état stable.
  return clockQuiet(page, snapProbe, { quietMs, label: `redimensionnement ${width}px` }).then(() => snap());
}

if (frag('widths')) {
  await page.goto(TARGET, { waitUntil: 'load' });
  await krReady(page, { label: 'chargement plateau' });

  // 1. Suite de largeurs : rechargement si et seulement si le seuil 768 est franchi
  console.log('Transitions de largeur');
  let previousMobile = false;
  for (const width of [1512, 2560, 375, 1512, 767, 768, 767, 1280, 1024, 800]) {
    const expectMobile = width < 768;
    const crossed = expectMobile !== previousMobile;
    const s = await resizeTo(width, 772, crossed ? RESIZE_QUIET_MS : ABSENCE_QUIET_MS);
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
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); // défilement appliqué (deux images)
  const afterScroll = await resizeTo(375);
  check('défilement restauré après desktop -> mobile (±40 px)', () => {
    assert.equal(afterScroll.marker, false, 'la page aurait dû se recharger');
    assert.ok(Math.abs(afterScroll.y - 600) <= 40, `scrollY = ${afterScroll.y}`);
  });
  const backScroll = await resizeTo(1512);
  check('défilement restauré après mobile -> desktop (±40 px)', () => {
    assert.equal(backScroll.marker, false, 'la page aurait dû se recharger');
    assert.ok(Math.abs(backScroll.y - 600) <= 40, `scrollY = ${backScroll.y}`);
  });

  // 3. Saisie en cours : pas de rechargement, bandeau proposé, texte conservé
  console.log('Saisie en cours');
  await page.fill('#champ-saisie', 'texte en cours de rédaction');
  const typing = await resizeTo(375, 772, ABSENCE_QUIET_MS);
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
}

// 4. E1 : hauteur de barre recalculée au redimensionnement (barre à 14 entrées, sans rechargement)
console.log('Barre de navigation au redimensionnement');
// Deux fixtures de barre, les deux conservées :
//  - plateau-navbar-large.html : reproduit Bootstrap 3 tel que le site le livre (`.navbar-nav > li > a { line-height: 20px }`,
//    padding 20 px) → barre = 60 px, comme MESURÉ sur le vrai site à 1512, 1280 et 1180 ; contrôle strict (±1 px) ;
//  - plateau-navbar-large-origine.html : fixture d'origine (bb4fc09), SANS line-height Bootstrap : la hauteur de ligne
//    « normal » dépend de la police, donc la barre fait 57 à 58 px au lieu de 60 dès que la police passe à 13 px. Ce
//    n'est pas une barre réelle ; on garde le cas pour prouver que le script ne casse rien dans ce cas (14 entrées dans la
//    barre, barre = chargement direct, jamais de chevauchement : padding du body ≥ barre, écart ≤ 3 px).
async function navSuite(fixtureFile, strict) {
  console.log('Barre de navigation au redimensionnement — ' + fixtureFile + (strict ? ' (Bootstrap réaliste, strict ±1 px)' : ' (fixture d\'origine, tolérance 0 à +3 px)'));
  const navHtml = fs.readFileSync(path.join(root, 'tests/e2e/fixtures', fixtureFile), 'utf8');
  const paddingOk = (m) => strict ? Math.abs(m.paddingTop - m.barHeight) <= 1 : (m.paddingTop - m.barHeight >= 0 && m.paddingTop - m.barHeight <= 3);
  const navContext = await browser.newContext({ viewport: { width: 1512, height: 800 } });
  await confineNetwork(navContext);
  await installClock(navContext); // horloge simulée AVANT l'injection du script
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
    await resizeViewport(navPage, width, height);
    await clockQuiet(navPage, () => navPage.evaluate(() => ({ w: window.innerWidth, doc: window.__krDocId, ready: document.readyState, bar: Math.round(document.querySelector('nav.navbar').getBoundingClientRect().height), pad: getComputedStyle(document.body).paddingTop })), { quietMs: RESIZE_QUIET_MS, label: `barre ${width}px` });
    return measureNav();
  }

  const direct = {};
  async function directLoad(width, height = 800) {
    if (direct[width]) { return direct[width]; }
    const p = await navContext.newPage();
    await p.setViewportSize({ width, height });
    await p.goto(TARGET, { waitUntil: 'load' });
    await krReady(p, { label: `chargement direct ${width}px` });
    await p.evaluate(() => { document.title = 'direct'; });
    direct[width] = await p.evaluate(() => {
      const nav = document.querySelector('nav.navbar');
      const a = nav.querySelector('.navbar-nav > li > a');
      const cs = a ? getComputedStyle(a) : null;
      return { barHeight: Math.round(nav.getBoundingClientRect().height), link: cs ? `${cs.paddingLeft} ${cs.paddingRight} ${cs.fontSize}` : null };
    });
    await p.close();
    return direct[width];
  }

  async function runNavSequence(label, start, steps) {
    await navPage.setViewportSize({ width: start, height: 800 });
    await navPage.goto(TARGET, { waitUntil: 'load' });
    await krReady(navPage, { label: 'chargement barre' });
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
        check(`${label} : ${width}px padding-top du body = hauteur de barre (${m.paddingTop} vs ${m.barHeight})`, () => assert.ok(paddingOk(m)));
      }
    }
  }

  await runNavSequence('900 -> 1280 -> 1100', 900, [1280, 1100]);
  await runNavSequence('991 -> 992', 991, [992, 991, 992]);
  await runNavSequence('1100 -> 900 -> 1512', 1100, [900, 1512]);
  await runNavSequence('1512 -> 1100 -> 1360 -> 1000', 1512, [1100, 1360, 1000]);

  // Constat A (QA du lot E) : barre compactée de 992 à 1439 px (liens 7 px de marge, police 13 px), retour à l'existant dès 1440 px
  // (15 px, 14 px) ; aucune autre suite ne lisait ces règles (mutant sur la règle >= 1440 resté vert). Chargement direct, styles calculés
  // du premier lien de la barre, de part et d'autre du seuil 1440.
  if (strict) {
    for (const [width, want] of [[1280, '7px 7px 13px'], [1439, '7px 7px 13px'], [1440, '15px 15px 14px'], [1512, '15px 15px 14px']]) {
      const ref = await directLoad(width);
      check(`barre ${width}px : liens ${width < 1440 ? 'compactés' : 'à l\'existant'} (marges et police ${want})`, () => assert.equal(ref.link, want));
    }
  }
  // iPad : rotation 820x1180 -> 1180x820 (émulation)
  await navPage.setViewportSize({ width: 820, height: 1180 });
  await navPage.goto(TARGET, { waitUntil: 'load' });
  await krReady(navPage, { label: 'chargement barre' });
  const landscape = await navResize(1180, 820);
  const landscapeRef = await directLoad(1180, 820);
  check(`rotation 820x1180 -> 1180x820 : barre = chargement direct (${landscape.barHeight} vs ${landscapeRef.barHeight} px)`, () => assert.ok(Math.abs(landscape.barHeight - landscapeRef.barHeight) <= 1));
  check('rotation 820x1180 -> 1180x820 : 14 entrées sur 14 dans la barre', () => assert.ok(landscape.visible === 14 && landscape.outside === 0, `${landscape.visible} visibles, ${landscape.outside} hors barre`));
  check(`rotation : padding-top du body = hauteur de barre (${landscape.paddingTop} vs ${landscape.barHeight})`, () => assert.ok(paddingOk(landscape)));
  await navContext.close();
}
// 5. Ticket backlog 32 : la barre change de rangées APRÈS la mesure de chargement, sans redimensionnement. Logo du thème refusé
// seulement APRÈS la mesure de chargement (réseau lent) : tant que l'image n'est pas réglée, la marque fait 16 px ;
// l'erreur affiche le texte de remplacement (68 px) et la barre passe de 1 à 2 rangées à 1100 px. Puis une entrée ajoutée après le marqueur.
async function navTardif() {
  console.log('Barre de navigation qui change de rangées après le chargement (logo tardif, entrée ajoutée)');
  const navHtml = fs.readFileSync(path.join(root, 'tests/e2e/fixtures/plateau-navbar-large.html'), 'utf8');
  async function ouvrir(width) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    await confineNetwork(ctx);
    let lacher;
    const logoLache = new Promise(r => { lacher = r; });
    await ctx.route(/\/2\/world\/logo\d+\.gif$/, async route => { await logoLache; await route.abort(); });
    await installClock(ctx);
    await ctx.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: navHtml }));
    await ctx.addInitScript(({ src }) => {
      window.GM = { xmlHttpRequest: () => {} };
      localStorage.setItem('kr-theme-enabled', 'true');
      localStorage.setItem('kr-theme-variant', 'empire-brun-dark');
      // eslint-disable-next-line no-eval
      const go = () => (0, eval)(src);
      if (document.body) { go(); return; }
      new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
    }, { src: userscript });
    const p = await ctx.newPage();
    await p.goto(TARGET, { waitUntil: 'domcontentloaded' });
    // Le marqueur attend le load, donc le logo : on lâche le logo quand la mesure de chargement (rAF + 200 ms simulées) est passée,
    // 1 s simulée après le départ et deux vraies images plus tard. État relevé juste avant : logo en attente, marque étroite.
    await p.waitForFunction(() => document.querySelector('img.kr-logo') && performance.now() > 1000, null, { timeout: 15000 });
    await p.evaluate(() => window.__krRealFrame().then(() => window.__krRealFrame()));
    const auLacher = await p.evaluate(() => { const i = document.querySelector('img.kr-logo'); return { attente: !i.complete, bar: Math.round(document.querySelector('nav.navbar').getBoundingClientRect().height) }; });
    lacher();
    await krReady(p, { label: `barre tardive ${width}px` });
    // Logo réglé (erreur reçue), sans lever d'erreur : la mesure qui suit tranche
    await waitState(p, () => { const i = document.querySelector('img.kr-logo'); return Boolean(i && i.complete); }, null, { maxMs: 8000 });
    return { ctx, p, auLacher };
  }
  const mesure = p => p.evaluate(() => {
    const nav = document.querySelector('nav.navbar');
    const r = nav.getBoundingClientRect();
    const items = Array.from(nav.querySelectorAll('.navbar-nav > li')).filter(li => li.getBoundingClientRect().height > 0);
    return {
      bar: Math.round(r.height), pad: Math.round(parseFloat(getComputedStyle(document.body).paddingTop)),
      bas: Math.round(Math.max(0, ...items.map(li => li.getBoundingClientRect().bottom))),
      outside: items.filter(li => li.getBoundingClientRect().bottom > r.bottom + 1).length,
      inlinePad: document.body.style.getPropertyValue('padding-top'), inlineMax: nav.style.getPropertyValue('max-height')
    };
  });
  const stable = (p, label) => clockQuiet(p, () => mesure(p), { quietMs: RESIZE_QUIET_MS, label });
  // Mutations de style de la barre et du corps pendant 1 s simulée, page stable : 0 attendu (pas de remesure en boucle)
  async function mutationsStyle(p) {
    await p.evaluate(() => {
      window.__krStyleMut = 0;
      const o = new MutationObserver(m => { window.__krStyleMut += m.length; });
      o.observe(document.querySelector('nav.navbar'), { attributes: true, attributeFilter: ['style'] });
      o.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    });
    await runClock(p, 1000);
    return p.evaluate(() => window.__krStyleMut);
  }

  {
    const { ctx, p, auLacher } = await ouvrir(1100);
    const m = await stable(p, 'logo tardif 1100px');
    check(`logo tardif 1100px : scénario produit (logo en attente après la mesure de chargement, barre ${auLacher.bar} px, puis entrées jusqu'à ${m.bas} px)`, () => assert.ok(auLacher.attente && m.bas > auLacher.bar + 20));
    check(`logo tardif 1100px : entrées toutes dans la barre (bas ${m.bas}, barre ${m.bar})`, () => assert.equal(m.outside, 0));
    check(`logo tardif 1100px : padding-top du body = hauteur de barre (${m.pad} vs ${m.bar}, ±1)`, () => assert.ok(Math.abs(m.pad - m.bar) <= 1 && m.bar >= m.bas - 1));
    const n = await mutationsStyle(p);
    check(`logo tardif 1100px : aucune mutation de style de la barre ni du corps en 1 s stable (${n})`, () => assert.equal(n, 0));
    await ctx.close();
  }
  {
    const { ctx, p } = await ouvrir(1280);
    const avant = await stable(p, 'entrée ajoutée 1280px (avant)');
    await p.evaluate(() => {
      const ul = document.querySelector('nav.navbar .navbar-nav');
      for (let i = 0; i < 8; i++) { const li = document.createElement('li'); li.innerHTML = `<a href="/ajout${i}">Entrée ajoutée ${i}</a>`; ul.appendChild(li); }
    });
    const m = await stable(p, 'entrée ajoutée 1280px');
    check(`entrée ajoutée 1280px : la barre gagne une rangée (barre ${avant.bar} px, bas des entrées ${m.bas} px)`, () => assert.ok(m.bas > avant.bar + 20, `bas des entrées ${m.bas}`));
    check(`entrée ajoutée 1280px : entrées toutes dans la barre (bas ${m.bas}, barre ${m.bar})`, () => assert.equal(m.outside, 0));
    check(`entrée ajoutée 1280px : padding-top du body = hauteur de barre (${m.pad} vs ${m.bar}, ±1)`, () => assert.ok(Math.abs(m.pad - m.bar) <= 1));
    const n = await mutationsStyle(p);
    check(`entrée ajoutée 1280px : aucune mutation de style de la barre ni du corps en 1 s stable (${n})`, () => assert.equal(n, 0));
    await ctx.close();
  }
  for (const width of [900, 375]) {
    const { ctx, p } = await ouvrir(width);
    const m = await stable(p, `logo tardif ${width}px`);
    check(`logo tardif ${width}px : ni padding-top ni max-height en ligne (« ${m.inlinePad} », « ${m.inlineMax} »)`, () => assert.deepEqual([m.inlinePad, m.inlineMax], ['', '']));
    await ctx.close();
  }
}

if (frag('nav-large')) { await navSuite('plateau-navbar-large.html', true); }
if (frag('nav-origine')) { await navSuite('plateau-navbar-large-origine.html', false); }
if (frag('nav-tardif')) { await navTardif(); }

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
