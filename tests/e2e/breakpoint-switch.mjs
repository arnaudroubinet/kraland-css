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
import { domQuiet, probeQuiet } from './lib/settle.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const fixturePath = process.env.KR_FIXTURE || path.join(root, 'tests/e2e/fixtures/plateau-minimal.html');
const realFixture = Boolean(process.env.KR_FIXTURE);
const html = fs.readFileSync(fixturePath, 'utf8');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

const RESIZE_QUIET_MS = 900; // anti-rebond du script (400 ms) + marge ; état stable pendant cette durée = redimensionnement traité
const ABSENCE_QUIET_MS = 1800; // assertions d'ABSENCE de rechargement : fenêtre longue (un rechargement tardif, écart minimal de 1,2 s entre deux, doit rester visible)
const TARGET = 'http://www.kraland.org/jouer/plateau';

// Fragmentation (exécution parallèle) : KR_FRAG = widths, gauges, nav-large, nav-origine ; vide = tout jouer.
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

// Sonde de stabilité d'un redimensionnement : largeur, document (timeOrigin change à chaque rechargement), mode, marqueur, bandeau, défilement
const snapProbe = () => page.evaluate(() => ({
  w: window.innerWidth, doc: performance.timeOrigin, mobile: document.body ? document.body.classList.contains('mobile-mode') : null,
  marker: window.__krMarker === 1, banner: Boolean(document.getElementById('kr-resize-banner')), y: Math.round(window.scrollY),
  sw: document.documentElement.scrollWidth, ready: document.readyState
}));

async function resizeTo(width, height = 772, quietMs = RESIZE_QUIET_MS) {
  await page.evaluate(() => { window.__krMarker = 1; });
  await page.setViewportSize({ width, height });
  // On attend que l'état (largeur, mode, marqueur, document, bandeau) reste identique pendant quietMs : RESIZE_QUIET_MS (900 ms, anti-rebond
  // du script 400 ms + marge) quand un rechargement est attendu ; ABSENCE_QUIET_MS (1,8 s, comme avant) quand on affirme qu'il n'y en a PAS.
  // Un rechargement change le document ; son absence laisse l'état stable.
  return probeQuiet(snapProbe, { quietMs, label: `redimensionnement ${width}px` }).then(() => snap());
}

if (frag('widths')) {
  await page.goto(TARGET, { waitUntil: 'load' });
  await domQuiet(page, { quietMs: 600, label: 'chargement plateau' });

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

if (frag('gauges')) {
  // 1 bis. Jauges PV/PM/PP (PLT-07, choix A) : les deux segments natifs sont conservés, même rendu desktop et mobile.
  // Valeurs de la fixture : PV 20 (écart au max 7, SYNTHÉTIQUE), PM 25 (0), PP 0 (150) — voir le commentaire de la fixture.
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
    // Une légende dans un parent à overflow masqué dont la boîte ne la recouvre pas (max-height 0 du mini-profil replié) n'est pas visible
    const clipped = (el, r) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (ps.overflow !== 'visible' || ps.overflowY !== 'visible') {
          const pr = p.getBoundingClientRect();
          if (r.bottom <= pr.top + 0.5 || r.top >= pr.bottom - 0.5) { return true; }
        }
      }
      return false;
    };
    const legends = Array.from(document.querySelectorAll('.kr-gauge-legend')).map(l => {
      const cs = getComputedStyle(l);
      const r = l.getBoundingClientRect();
      return { inMini: !!l.closest('.mobile-mini-profile'), shown: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0 && !clipped(l, r), fontSize: parseFloat(cs.fontSize), text: l.textContent.replace(/\s+/g, ' ').trim() };
    });
    return { native: out, mini, fullHeaders, legend: legends.length, legends };
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
    await gaugePage.waitForTimeout(ABSENCE_QUIET_MS);
    const g = await gaugeSnap(gaugePage);
    if (width < 768) {
      // Mini-profil replié : la légende n'est pas visible ; après dépliage elle doit l'être (C3)
      g.collapsedLegends = g.legends;
      await gaugePage.evaluate(() => document.querySelector('.mobile-mini-profile-header').click());
      await gaugePage.waitForTimeout(500);
      g.legends = (await gaugeSnap(gaugePage)).legends;
    }
    if (process.env.KR_SHOTS) {
      await gaugePage.screenshot({ path: path.join(process.env.KR_SHOTS, `jauges-${width}.png`) });
    }
    await gaugeContext.close();
    gaugeResults[width] = g;
    for (const type of ['pv', 'pm', 'pp']) {
      const [v, r] = expectedGauge[type];
      check(`${width}px : jauge ${type.toUpperCase()} segment valeur = ${v.toFixed(2)}`, () => assert.ok(g.native[type] && Math.abs(g.native[type].ratio - v) < 0.01, JSON.stringify(g.native[type])));
      check(`${width}px : jauge ${type.toUpperCase()} segment écart au max conservé = ${r.toFixed(2)}`, () => assert.ok(g.native[type].restShown && Math.abs(g.native[type].restRatio - r) < 0.01, JSON.stringify(g.native[type])));
      check(`${width}px : jauge ${type.toUpperCase()} écart au max hachuré (couleur unique)`, () => assert.match(g.native[type].restBg, /repeating-linear-gradient/));
    }
    check(`${width}px : PP à 0 garde son segment écart au max plein (natif)`, () => assert.ok(g.native.pp.ratio === 0 && g.native.pp.restRatio > 0.99));
    check(`${width}px : trois couleurs de thème distinctes pour la valeur`, () => assert.equal(new Set([g.native.pv.color, g.native.pm.color, g.native.pp.color]).size, 3));
    check(`${width}px : infobulle valeur / écart au max`, () => assert.match(g.native.pv.title, /PV : 20 .*écart au max : 7/));
    check(`${width}px : légende réellement visible${width < 768 ? ' après dépliage du mini-profil' : ''}, sens des segments lisible, ≥ ${width < 768 ? 11 : 12} px`, () => {
      const shown = g.legends.filter(l => l.shown);
      // Desktop : une seule légende (celle des jauges natives). Mobile : celle du mini-profil déplié, plus celle des jauges natives du plateau.
      if (width < 768) {
        assert.ok(shown.some(l => l.inMini), JSON.stringify(g.legends));
        assert.ok(g.collapsedLegends.filter(l => l.inMini).every(l => !l.shown), 'légende du mini-profil visible alors qu\'il est replié : ' + JSON.stringify(g.collapsedLegends));
      } else {
        assert.equal(shown.length, 1, JSON.stringify(g.legends));
      }
      for (const l of shown) {
        assert.match(l.text, /valeur.*écart au maximum/);
        assert.ok(!/reste/.test(l.text) && l.fontSize >= (width < 768 ? 11 : 12), JSON.stringify(l));
      }
    });
  }
  {
    const d = gaugeResults[1512];
    const m = gaugeResults[375];
    check('mêmes couleurs de valeur en desktop et en mobile', () => assert.deepEqual(['pv', 'pm', 'pp'].map(t => d.native[t].color), ['pv', 'pm', 'pp'].map(t => m.native[t].color)));
    check('375px : mini-profil, proportions natives (PV 74 % + écart au max 26 %, PM 100 %, PP 0 % + écart au max 100 %)', () => {
      assert.ok(Math.abs(m.mini.pv.fill - 20 / 27) < 0.02 && Math.abs(m.mini.pv.rest - 7 / 27) < 0.02, JSON.stringify(m.mini.pv));
      assert.ok(m.mini.pm.fill > 0.98 && m.mini.pm.rest < 0.02, JSON.stringify(m.mini.pm));
      assert.ok(m.mini.pp.fill === 0 && m.mini.pp.rest > 0.98, JSON.stringify(m.mini.pp));
    });
    check('375px : mini-profil, mêmes couleurs de valeur que les jauges natives', () => assert.deepEqual(['pv', 'pm', 'pp'].map(t => m.mini[t].color), ['pv', 'pm', 'pp'].map(t => m.native[t].color)));
    check('375px : mini-profil, valeur affichée et aucun maximum inventé', () => {
      assert.equal(m.mini.pv.value, '20');
      assert.equal(m.fullHeaders.join('|'), 'PV 20 · écart au max 7|PM 25 · écart au max 0|PP 0 · écart au max 150');
    });
  }
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
    await probeQuiet(() => navPage.evaluate(() => ({ w: window.innerWidth, doc: performance.timeOrigin, ready: document.readyState, bar: Math.round(document.querySelector('nav.navbar').getBoundingClientRect().height), pad: getComputedStyle(document.body).paddingTop })), { quietMs: RESIZE_QUIET_MS, label: `barre ${width}px` });
    return measureNav();
  }

  const direct = {};
  async function directLoad(width, height = 800) {
    if (direct[width]) { return direct[width]; }
    const p = await navContext.newPage();
    await p.setViewportSize({ width, height });
    await p.goto(TARGET, { waitUntil: 'load' });
    await domQuiet(p, { quietMs: 600, label: `chargement direct ${width}px` });
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
    await domQuiet(navPage, { quietMs: 600, label: 'chargement barre' });
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

  // iPad : rotation 820x1180 -> 1180x820 (émulation)
  await navPage.setViewportSize({ width: 820, height: 1180 });
  await navPage.goto(TARGET, { waitUntil: 'load' });
  await domQuiet(navPage, { quietMs: 600, label: 'chargement barre' });
  const landscape = await navResize(1180, 820);
  const landscapeRef = await directLoad(1180, 820);
  check(`rotation 820x1180 -> 1180x820 : barre = chargement direct (${landscape.barHeight} vs ${landscapeRef.barHeight} px)`, () => assert.ok(Math.abs(landscape.barHeight - landscapeRef.barHeight) <= 1));
  check('rotation 820x1180 -> 1180x820 : 14 entrées sur 14 dans la barre', () => assert.ok(landscape.visible === 14 && landscape.outside === 0, `${landscape.visible} visibles, ${landscape.outside} hors barre`));
  check(`rotation : padding-top du body = hauteur de barre (${landscape.paddingTop} vs ${landscape.barHeight})`, () => assert.ok(paddingOk(landscape)));
  await navContext.close();
}
if (frag('nav-large')) { await navSuite('plateau-navbar-large.html', true); }
if (frag('nav-origine')) { await navSuite('plateau-navbar-large-origine.html', false); }

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
