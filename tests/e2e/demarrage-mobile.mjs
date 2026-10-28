// Test du démarrage fiable (G-01) : aucune boucle de rechargement, quel que soit le moment d'exécution du script.
// Pages = FIXTURES inertes (aucun réseau Kraland). Émulation mobile Chromium (viewport meta honorée), pas un vrai téléphone.
//
// Le défaut : exécuté au tout début du document (@run-at document-start d'un bundle), window.innerWidth vaut 980
// (largeur par défaut avant la meta viewport). La peau se croyait « desktop », puis voyait 375 et rechargeait en boucle.
//
// Usage : npm run build && npm run test:demarrage
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
// Diagnostic : KR_DOCS=1 affiche, en fin d'exécution, le nombre de documents et la stabilité de chaque scénario ; KR_SCENARIOS=1 joue
// les scénarios en série.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { launchBrowser } from './lib/navigateur.mjs';
import { confineNetwork } from './lib/confinement.mjs';
import { mapLimit } from './lib/parallele.mjs';
import { installClock, runClock } from './lib/settle.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const VENDOR = path.join(here, 'vendor');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

const PAGES = {
  '/forum': 'FIXTURE index forum',
  '/kramail': 'FIXTURE kramail',
  '/forum/sujet/1-20101': 'FIXTURE sujet',
  '/forum/post/saisie': 'FIXTURE saisie en cours'
};
// Plateau synthétique (entrée 9.6, fixtures/demarrage-plateau.html) : panneau des compétences natif, mini-chat #flap et son lien, jQuery
// et Bootstrap embarqués (tests/e2e/vendor) en fin de page, comme le site ; modale à onglets dans un <template>. Aucune donnée réelle.
const HTML_PAGES = { '/jouer/plateau': fs.readFileSync(path.join(here, 'fixtures', 'demarrage-plateau.html'), 'utf8') };
const HTML = title => `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title></head><body><nav class="navbar navbar-inverse"><div class="container"><a class="navbar-brand" href="/">Kraland</a></div></nav>
<div id="content" class="container"><div class="row"><div class="col-md-12"><h1>${title}</h1><p style="height:1500px">aucune donnée réelle</p>${title.includes('saisie') ? '<textarea id="champ" autofocus rows="3"></textarea>' : ''}</div></div></div></body></html>`;

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

// Fragmentation (exécution parallèle) : KR_FRAG = identifiants séparés par des virgules ; vide = tout jouer.
// Identifiants : moment-start, moment-dcl, moment-load, moment-later, desktop, pire-cas, m1, m-1, s1, fenetre-etroite, modules-mobiles.
const FRAG = (process.env.KR_FRAG || '').split(',').map(x => x.trim()).filter(Boolean);
const frag = id => FRAG.length === 0 || FRAG.includes(id);

const QUIET_MS = 2500;
const MAX_ROUNDS = 10; // 10 fenêtres de QUIET_MS = 25 s simulées (ancienne borne MAX_SETTLE_MS)
const MAX_SETTLE_MS = 25000; // borne en temps réel, en plus
const pause = ms => new Promise(r => setTimeout(r, ms));
// Fenêtre d'absence sous horloge simulée (lot D, lib/settle.mjs : installClock, runClock). Pour chaque document : on attend (temps réel)
// qu'il soit chargé, puis on avance l'horloge de QUIET_MS par pas de 100 ms. Toutes les minuteries de la page (anti-rebond 400 ms du
// script, largeur tardive du pire cas, chargeur différé de 600 ms, écart minimal de 1 200 ms du garde-fou) s'exécutent donc dans la
// fenêtre, sans l'attendre. Stable = une fenêtre complète sans départ de document, script déjà injecté au début de la fenêtre.
// Un départ (rechargement) relance une fenêtre sur le document suivant ; une boucle de rechargement ne se calme jamais : après
// MAX_ROUNDS fenêtres, échec explicite (stable = false), jamais un faux vert. Le témoin « boucle » (fragment pire-cas) le prouve.
async function settle(page, getDocs) {
  const t0 = Date.now();
  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    let st = null;
    while (!(st && st.complete)) {
      if (Date.now() - t0 > MAX_SETTLE_MS) { return { documents: getDocs(), stable: false }; }
      if (st !== null || round > 0) { await pause(20); }
      st = await page.evaluate(() => ({ complete: document.readyState === 'complete' && window.__krLeaving === false, ran: window.__krScriptRan === true })).catch(() => ({ complete: false }));
    }
    const before = getDocs();
    const { left } = await runClock(page, QUIET_MS);
    if (!left && st.ran && getDocs() === before) { return { documents: before, stable: true }; }
  }
  return { documents: getDocs(), stable: false };
}

const browser = await launchBrowser();

// moment : 'start' (document-start), 'dcl' (DOMContentLoaded), 'load' (après load), 'later' (différé 600 ms, chargeur asynchrone)
// lateViewport : simule le pire cas où la largeur reste fausse (980) jusqu'après le chargement -> la garde doit plafonner.
// emulate = false : fenêtre d'ordinateur étroite, sans émulation mobile (largeur réelle dès le début du document, avant <body>).
// modale : après la stabilité, une Bootbox à onglets est ajoutée au <body>, puis l'onglet actif change ; observateurs du défilement des
// onglets comptés (MutationObserver dont le rappel lit .panel.with-nav-tabs, posé avant le bundle) et appels de scrollTo sur l'en-tête ;
// puis un toucher sur un onglet non actif (retour tactile .active sur le lien), puis un second changement d'onglet actif.
// theme = false (avec modale) : thème coupé (kr-theme-enabled à 'false').
async function scenario({ moment, width, route, lateViewport = false, blockStorage = false, readOnlyStorage = false, src = userscript, emulate = true, modale = false, theme = true }) {
  const context = await browser.newContext(emulate ? { viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { viewport: { width, height: 800 } });
  let documents = 0;
  await confineNetwork(context); // refus global EN PREMIER
  await installClock(context); // horloge simulée AVANT l'injection du script (minuteries simulées dès le début du document)
  await context.route('http://www.kraland.org/**', r => {
    const u = new URL(r.request().url());
    if (u.pathname.startsWith('/lib/bootstrap') || u.pathname.startsWith('/lib/jquery')) {
      const file = u.pathname.endsWith('.css') ? 'bootstrap.min.css' : (u.pathname.includes('jquery') ? 'jquery.min.js' : 'bootstrap.min.js');
      return r.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(VENDOR, file)) });
    }
    if (!PAGES[u.pathname] && !HTML_PAGES[u.pathname]) { return r.fulfill({ status: 204, body: '' }); }
    if (r.request().resourceType() === 'document') { documents += 1; }
    return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML_PAGES[u.pathname] || HTML(PAGES[u.pathname]) });
  });
  await context.addInitScript(({ code, when, late, blocked, readOnly, probes }) => {
    window.GM = { xmlHttpRequest: () => {} };
    if (probes) {
      // Thème activé (désactivé par défaut) sauf scénario « thème coupé »
      localStorage.setItem('kr-theme-enabled', probes.theme ? 'true' : 'false');
      const Native = window.MutationObserver;
      window.__krTabObs = [];
      window.__krScrolls = 0;
      window.MutationObserver = class extends Native {
        // La sonde dépend du texte « with-nav-tabs » dans le rappel de l'observateur (initModalTabScroll) : le garder en ligne dans le rappel
        constructor(cb) { super(cb); this.__krTabs = String(cb).includes('with-nav-tabs'); }
        observe(target, options) { if (this.__krTabs) { window.__krTabObs.push(target); } return super.observe(target, options); }
      };
      const nativeScrollTo = window.Element.prototype.scrollTo;
      window.Element.prototype.scrollTo = function () { if (this.matches('.panel-heading')) { window.__krScrolls += 1; } return nativeScrollTo.apply(this, arguments); };
    }
    window.__krWrites = { set: 0, removed: [], keys: [] };
    if (readOnly) {
      // Stockage lisible mais écriture refusée (ancien Safari privé, quota nul) : getItem répond, setItem lève QuotaExceededError
      const proto = Object.getPrototypeOf(window.sessionStorage);
      const realRemove = proto.removeItem;
      const realSet = proto.setItem;
      // Storage.prototype est partagé avec localStorage : on ne refuse / ne compte que sessionStorage
      proto.setItem = function (key) {
        if (this !== window.sessionStorage) { return realSet.apply(this, arguments); }
        window.__krWrites.set += 1; window.__krWrites.keys.push(String(key));
        throw new window.DOMException('quota', 'QuotaExceededError');
      };
      proto.removeItem = function (key) {
        if (this === window.sessionStorage) { window.__krWrites.removed.push(String(key)); }
        return realRemove.apply(this, arguments);
      };
    }
    if (blocked) {
      // Stockage inaccessible (navigation privée stricte, cookies bloqués) : tout accès à sessionStorage lève SecurityError
      Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new window.DOMException('denied', 'SecurityError'); } });
    }
    window.__krSeenWidth = window.innerWidth;
    window.__krBodyAtStart = !!document.body;
    if (late) {
      // Pire cas : largeur annoncée 980 pendant tout le chargement, 375 ensuite (meta appliquée tardivement)
      const real = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'innerWidth') || Object.getOwnPropertyDescriptor(window, 'innerWidth');
      let ready = false;
      window.addEventListener('load', () => { setTimeout(() => { ready = true; window.dispatchEvent(new Event('resize')); }, 100); });
      Object.defineProperty(window, 'innerWidth', { configurable: true, get() { return ready ? real.get.call(window) : 980; } });
    }
    // eslint-disable-next-line no-eval
    const go = () => { (0, eval)(code); window.__krScriptRan = true; };
    if (when === 'start') { go(); }
    else if (when === 'dcl') { document.addEventListener('DOMContentLoaded', go); }
    else if (when === 'load') { window.addEventListener('load', go); }
    else { window.addEventListener('load', () => setTimeout(go, 600)); }
  }, { code: src, when: moment, late: lateViewport, blocked: blockStorage, readOnly: readOnlyStorage, probes: modale && { theme } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') { errors.push(m.text()); } });
  await page.goto('http://www.kraland.org' + route, { waitUntil: 'load' });
  // Fenêtre d'absence en temps simulé (voir settle ci-dessus) : QUIET_MS = 2,5 s simulées sans nouveau document, > écart minimal
  // entre deux rechargements 1 200 ms + anti-rebond 400 ms. Une boucle de rechargement ne se calme jamais : échec explicite.
  const stableResult = await settle(page, () => documents);
  const after6 = stableResult.documents;
  // FAB du mini-chat (MiniChat:FAB), relevé avant la modale : après un clic, #flap visible et au premier plan au centre de l'écran
  await page.evaluate(() => {
    const fab = document.querySelector('.mini-chat-fab'); const flap = document.getElementById('flap');
    if (!fab || !flap) { window.__krFab = null; return; }
    fab.click();
    const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    window.__krFab = { visibility: getComputedStyle(flap).visibility, auCentre: !!hit && flap.contains(hit) };
    fab.click();
  }).catch(() => {});
  if (modale) {
    await page.evaluate(() => { const m = document.createElement('div'); m.className = 'bootbox modal'; m.appendChild(document.getElementById('kr-modale-onglets').content.cloneNode(true)); document.body.appendChild(m); window.__krModale = m; }).catch(() => {});
    await runClock(page, 500);
    await page.evaluate(() => { const li = window.__krModale.querySelectorAll('.nav-tabs > li'); li[0].classList.remove('active'); li[2].classList.add('active'); }).catch(() => {});
    await runClock(page, 500);
    // Toucher sur un onglet non actif : le retour tactile pose .active sur le lien, sans changer l'onglet actif
    await page.evaluate(() => { window.__krAvantToucher = window.__krScrolls; window.__krModale.querySelectorAll('.nav-tabs > li')[1].firstElementChild.dispatchEvent(new Event('touchstart')); }).catch(() => {});
    await runClock(page, 300);
    await page.evaluate(() => { const a = window.__krModale.querySelectorAll('.nav-tabs > li')[1].firstElementChild; window.__krLienTouche = a.classList.contains('active'); a.dispatchEvent(new Event('touchend')); }).catch(() => {});
    await runClock(page, 800);
    await page.evaluate(() => { window.__krApresToucher = window.__krScrolls; const li = window.__krModale.querySelectorAll('.nav-tabs > li'); li[2].classList.remove('active'); li[1].classList.add('active'); }).catch(() => {});
    await runClock(page, 500);
  }
  // Si la page recharge encore (boucle), le contexte d'exécution disparaît : on le note au lieu de planter.
  const state = await page.evaluate(() => ({
    mobile: document.body.classList.contains('mobile-mode'),
    w: window.innerWidth,
    seen: window.__krSeenWidth,
    bodyAtStart: window.__krBodyAtStart,
    ready: document.documentElement.hasAttribute('data-kr-ready'),
    overlay: document.querySelectorAll('body > .kr-mobile-overlay').length,
    skillsToggles: document.querySelectorAll('.kr-mobile-skills-toggle').length,
    // croix du panneau des compétences : toutes les croix mobiles, hors celle du mini-chat
    skillsClose: document.querySelectorAll('.kr-mobile-close').length - document.querySelectorAll('#flap .kr-mobile-close').length,
    chatClose: document.querySelectorAll('#flap .kr-mobile-close').length,
    chatFab: window.__krFab,
    // Lien natif #flap : sans détournement, le clic pose le hash
    lienHash: (() => { const a = document.querySelector('a[href="#flap"]'); if (!a) { return null; } a.click(); return location.hash; })(),
    modale: window.__krModale ? {
      indicateurs: window.__krModale.querySelectorAll('.kr-tabs-indicator').length,
      observateurs: window.__krTabObs.filter(t => t === window.__krModale).length,
      defilements: window.__krAvantToucher,
      lienTouche: window.__krLienTouche,
      toucher: window.__krApresToucher - window.__krAvantToucher,
      second: window.__krScrolls - window.__krApresToucher
    } : null,
    banner: document.getElementById('kr-resize-banner') ? document.getElementById('kr-resize-banner').textContent : null,
    writes: window.__krWrites,
    probeLeft: (() => { try { return window.sessionStorage.getItem('kr-breakpoint-probe'); } catch (_e) { return null; } })()
  })).catch(() => ({ mobile: false, w: 0, seen: 'page encore en rechargement', banner: null, writes: null }));
  await context.close();
  return { documents: after6, stable: stableResult.stable && documents === after6, errors, ...state };
}

// Scénarios indépendants (chacun son contexte, lib/parallele.mjs) lancés en parallèle (lot D) ; les titres et vérifications
// s'affichent ensuite dans l'ordre de déclaration, à l'identique d'une exécution en série.
const plan = [];
const section = title => plan.push({ title });
const queue = (opts, verify) => plan.push({ opts, verify });

section('Démarrage : nombre de documents chargés jusqu\'à la stabilité (attendu : 1)');
for (const moment of ['start', 'dcl', 'load', 'later'].filter(m => frag('moment-' + m))) {
  for (const width of [375, 700]) {
    for (const route of Object.keys(PAGES)) {
      queue({ moment, width, route }, s => {
        check(`${moment} · ${width} px · ${route} : 1 seul document`, () => assert.equal(s.documents, 1, `${s.documents} documents (innerWidth vu à l'exécution : ${s.seen})`));
        check(`${moment} · ${width} px · ${route} : mode mobile appliqué`, () => assert.equal(s.mobile, true));
      });
    }
  }
}

section('Desktop 1280 : pas de rechargement, pas de mode mobile');
for (const moment of ['start', 'dcl', 'later'].filter(() => frag('desktop'))) {
  queue({ moment, width: 1280, route: '/forum' }, s => {
    check(`${moment} · 1280 px : 1 seul document`, () => assert.equal(s.documents, 1, `${s.documents} documents`));
    check(`${moment} · 1280 px : pas de mode mobile`, () => assert.equal(s.mobile, false));
  });
}

section('Pire cas : largeur fausse (980) jusqu\'après le chargement -> garde-fou plafonné');
for (const route of ['/forum', '/kramail'].filter(() => frag('pire-cas'))) {
  queue({ moment: 'start', width: 375, route, lateViewport: true }, s => {
    check(`${route} : au plus 4 documents en 6 s`, () => assert.ok(s.documents <= 4, `${s.documents} documents`));
    check(`${route} : la boucle s'arrête (nombre stable ensuite)`, () => assert.equal(s.stable, true));
  });
}
// Témoin de la fenêtre d'absence sous horloge simulée : un script SANS garde-fou qui recharge en boucle (minuterie nue) doit être
// déclaré instable. Deux rythmes : l'écart minimal du produit (1 200 ms + 100) et juste sous QUIET_MS (2 400 ms).
for (const every of [1300, 2400].filter(() => frag('pire-cas'))) {
  queue({ moment: 'start', width: 375, route: '/forum', src: `setTimeout(function () { location.reload(); }, ${every});` }, s => {
    check(`témoin horloge simulée : une boucle de rechargement toutes les ${every} ms est détectée (jamais stable)`, () => { assert.equal(s.stable, false, `${s.documents} documents, déclaré stable`); assert.ok(s.documents >= 3, `${s.documents} documents`); });
  });
}

section('m1 : sessionStorage inaccessible -> aucun rechargement automatique, bandeau manuel');
for (const route of ['/forum', '/kramail'].filter(() => frag('m1'))) {
  queue({ moment: 'start', width: 375, route, lateViewport: true, blockStorage: true }, s => {
    check(`${route} : 1 seul document (le plafond ne peut pas être suivi : pas de rechargement auto)`, () => assert.equal(s.documents, 1, `${s.documents} documents`));
    check(`${route} : bandeau manuel « Recharger » affiché`, () => assert.ok(s.banner && s.banner.includes('Recharger'), String(s.banner)));
  });
}
if (frag('m1')) {
  queue({ moment: 'start', width: 375, route: '/forum', blockStorage: true }, s => {
    check('stockage inaccessible, démarrage normal : 1 document, mode mobile, aucun bandeau', () => { assert.equal(s.documents, 1); assert.equal(s.mobile, true); assert.equal(s.banner, null); });
  });
}

section('m-1 : sessionStorage lisible mais écriture refusée (QuotaExceededError) -> aucune boucle, bandeau manuel');
for (const route of ['/forum', '/kramail'].filter(() => frag('m-1'))) {
  queue({ moment: 'start', width: 375, route, lateViewport: true, readOnlyStorage: true }, s => {
    check(`${route} : 1 seul document, stable (largeur tardive avant la meta, écriture refusée)`, () => { assert.equal(s.documents, 1, `${s.documents} documents`); assert.equal(s.stable, true); });
    check(`${route} : bandeau manuel « Recharger » affiché, sans parler de saisie`, () => { assert.ok(s.banner && s.banner.includes('Recharger') && !/saisie/i.test(s.banner), String(s.banner)); });
    check(`${route} : seule la clé de sonde dédiée est écrite (aucune autre donnée touchée)`, () => { assert.ok(s.writes, 'pas de relevé'); assert.deepEqual([...new Set(s.writes.keys)], ['kr-breakpoint-probe']); });
  });
}
if (frag('m-1')) {
  queue({ moment: 'start', width: 375, route: '/forum', readOnlyStorage: true }, s => {
    check('écriture refusée, démarrage normal : 1 document, mode mobile, aucun bandeau', () => { assert.equal(s.documents, 1); assert.equal(s.mobile, true); assert.equal(s.banner, null); });
  });
}
if (frag('m-1')) {
  queue({ moment: 'start', width: 375, route: '/forum', lateViewport: true }, s => {
    check('stockage normal : la clé de sonde est retirée (rien ne reste)', () => assert.equal(s.probeLeft, null));
  });
}

section('Fenêtre d\'ordinateur étroite, bundle avant <body>, sans émulation mobile : initialisation complète (backlog 7)');
for (const width of [375, 767].filter(() => frag('fenetre-etroite'))) {
  queue({ moment: 'start', width, route: '/forum', emulate: false }, s => {
    check(`${width} px : bundle exécuté avant <body>, largeur réelle`, () => { assert.equal(s.bodyAtStart, false); assert.equal(s.seen, width); });
    check(`${width} px : aucune exception`, () => assert.deepEqual(s.errors, []));
    check(`${width} px : html[data-kr-ready] posé`, () => assert.equal(s.ready, true));
    check(`${width} px : 1 seul document, mode mobile`, () => { assert.equal(s.documents, 1); assert.equal(s.mobile, true); });
  });
}
if (frag('fenetre-etroite')) {
  queue({ moment: 'start', width: 768, route: '/forum', emulate: false }, s => {
    check('768 px : html[data-kr-ready] posé, pas de mode mobile (inchangé)', () => { assert.deepEqual(s.errors, []); assert.equal(s.ready, true); assert.equal(s.mobile, false); });
  });
}

section('Plateau : défilement des onglets et chaîne des modales installés une fois quand la largeur et le DOM sont prêts (entrée 9.6)');
// Ressources du thème refusées par le confinement (logos, version.json) : erreurs de chargement attendues, hors du relevé
const exceptions = s => s.errors.filter(e => !e.startsWith('Failed to load resource'));
const MODULES = [
  { moment: 'start', emulate: true, tag: 'document-start, téléphone (980 px lus, puis 375)' },
  { moment: 'start', emulate: false, tag: 'document-start, fenêtre de 375 px sans émulation' },
  { moment: 'dcl', emulate: true, tag: 'DOMContentLoaded, téléphone (référence)' },
  { moment: 'load', emulate: true, tag: 'après load, téléphone' },
  { moment: 'later', emulate: true, tag: 'différé de 600 ms, téléphone' }
];
for (const m of MODULES.filter(() => frag('modules-mobiles'))) {
  queue({ moment: m.moment, width: 375, route: '/jouer/plateau', emulate: m.emulate, modale: true }, s => {
    check(`${m.tag} : préconditions (largeur lue au début du document ${m.emulate ? '≥ 768' : '375'}, mode mobile), aucune exception, html[data-kr-ready] posé`, () => {
      assert.ok(m.emulate ? s.seen >= 768 : s.seen === 375, `largeur lue au début : ${s.seen}`);
      assert.equal(s.mobile, true);
      assert.deepEqual(exceptions(s), []);
      assert.equal(s.ready, true);
    });
    check(`${m.tag} : ni superposition, ni bouton ni croix du panneau des compétences, ni croix ajoutée au mini-chat`, () => assert.deepEqual([s.overlay, s.skillsToggles, s.skillsClose, s.chatClose], [0, 0, 0, 0], JSON.stringify(s)));
    check(`${m.tag} : le FAB ouvre le mini-chat (#flap visible, au premier plan au centre)`, () => assert.deepEqual(s.chatFab, { visibility: 'visible', auCentre: true }, JSON.stringify(s.chatFab)));
    check(`${m.tag} : modale à onglets, chaîne mobile passée une fois (une .kr-tabs-indicator), défilement des onglets installé une fois et actif`, () => {
      assert.ok(s.modale, 'pas de relevé de la modale');
      assert.deepEqual([s.modale.indicateurs, s.modale.observateurs], [1, 1], JSON.stringify(s.modale));
      assert.ok(s.modale.defilements >= 1, 'aucun défilement de l\'en-tête des onglets');
    });
    check(`${m.tag} : un toucher sur un onglet non actif ne fait pas défiler ; le changement d'onglet actif recentre`, () => {
      assert.equal(s.modale.lienTouche, true, 'retour tactile .active absent du lien touché');
      assert.deepEqual([s.modale.toucher, s.modale.second], [0, 1], JSON.stringify(s.modale));
    });
  });
}
if (frag('modules-mobiles')) {
  queue({ moment: 'start', width: 375, route: '/jouer/plateau', modale: true, theme: false }, s => {
    check('document-start, téléphone, thème coupé : lien natif #flap non détourné (hash posé), aucune croix ni superposition, aucun défilement des onglets', () => {
      assert.deepEqual(exceptions(s), []);
      assert.equal(s.lienHash, '#flap');
      assert.equal(s.chatClose + s.skillsClose, 0, JSON.stringify(s));
      assert.equal(s.overlay, 0);
      assert.equal(s.modale && s.modale.observateurs, 0, JSON.stringify(s.modale));
    });
  });
  queue({ moment: 'start', width: 1280, route: '/jouer/plateau', modale: true }, s => {
    check('document-start, 1280 px : ni défilement des onglets ni chaîne mobile (inchangé), html[data-kr-ready] posé', () => {
      assert.deepEqual(exceptions(s), []);
      assert.equal(s.ready, true);
      assert.equal(s.mobile, false);
      assert.deepEqual([s.overlay, s.chatClose, s.modale && s.modale.indicateurs, s.modale && s.modale.observateurs], [0, 0, 0, 0], JSON.stringify(s));
    });
  });
}

section('s1 : texte du bandeau selon le motif réel');
if (frag('s1')) {
  queue({ moment: 'start', width: 375, route: '/forum', lateViewport: true }, cap => {
    check('plafond atteint sans saisie : le bandeau ne prétend pas qu\'une saisie est en cours', () => { assert.ok(cap.banner, 'pas de bandeau'); assert.ok(!/saisie/i.test(cap.banner), cap.banner); assert.ok(cap.banner.includes('Recharger'), cap.banner); });
  });
  queue({ moment: 'start', width: 375, route: '/forum/post/saisie', lateViewport: true }, typing => {
    check('saisie réellement en cours : bandeau « Terminez votre saisie » et aucun rechargement', () => { assert.equal(typing.documents, 1, `${typing.documents} documents`); assert.ok(typing.banner && /Terminez votre saisie/.test(typing.banner), String(typing.banner)); });
  });
}

const results = await mapLimit(plan, step => (step.opts ? scenario(step.opts) : null));
for (const [i, step] of plan.entries()) {
  if (step.title) { console.log(step.title); } else { step.verify(results[i]); }
}
if (process.env.KR_DOCS) { console.log(JSON.stringify(plan.map((p, i) => p.opts ? [p.opts.moment, p.opts.width, p.opts.route, p.opts.lateViewport || false, results[i].documents, results[i].stable] : null).filter(Boolean))); }

await browser.close();
if (failures) {
  console.log(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log('\nTous les contrôles passent');
