// Test du démarrage fiable (G-01) : aucune boucle de rechargement, quel que soit le moment d'exécution du script.
// Pages = FIXTURES inertes (aucun réseau Kraland). Émulation mobile Chromium (viewport meta honorée), pas un vrai téléphone.
//
// Le défaut : exécuté au tout début du document (@run-at document-start d'un bundle), window.innerWidth vaut 980
// (largeur par défaut avant la meta viewport). La peau se croyait « desktop », puis voyait 375 et rechargeait en boucle.
//
// Usage : npm run build && npm run test:demarrage
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');

const PAGES = {
  '/forum': 'FIXTURE index forum',
  '/kramail': 'FIXTURE kramail',
  '/forum/sujet/1-20101': 'FIXTURE sujet',
  '/forum/post/saisie': 'FIXTURE saisie en cours'
};
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

const browser = await chromium.launch({ headless: true });

// moment : 'start' (document-start), 'dcl' (DOMContentLoaded), 'load' (après load), 'later' (différé 600 ms, chargeur asynchrone)
// lateViewport : simule le pire cas où la largeur reste fausse (980) jusqu'après le chargement -> la garde doit plafonner.
async function scenario({ moment, width, route, lateViewport = false, blockStorage = false }) {
  const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  let documents = 0;
  await context.route('http://www.kraland.org/**', r => {
    const u = new URL(r.request().url());
    if (!PAGES[u.pathname]) { return r.fulfill({ status: 204, body: '' }); }
    if (r.request().resourceType() === 'document') { documents += 1; }
    return r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: HTML(PAGES[u.pathname]) });
  });
  await context.addInitScript(({ src, when, late, blocked }) => {
    window.GM = { xmlHttpRequest: () => {} };
    if (blocked) {
      // Stockage inaccessible (navigation privée stricte, cookies bloqués) : tout accès à sessionStorage lève SecurityError
      Object.defineProperty(window, 'sessionStorage', { configurable: true, get() { throw new window.DOMException('denied', 'SecurityError'); } });
    }
    window.__krSeenWidth = window.innerWidth;
    if (late) {
      // Pire cas : largeur annoncée 980 pendant tout le chargement, 375 ensuite (meta appliquée tardivement)
      const real = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'innerWidth') || Object.getOwnPropertyDescriptor(window, 'innerWidth');
      let ready = false;
      window.addEventListener('load', () => { setTimeout(() => { ready = true; window.dispatchEvent(new Event('resize')); }, 100); });
      Object.defineProperty(window, 'innerWidth', { configurable: true, get() { return ready ? real.get.call(window) : 980; } });
    }
    // eslint-disable-next-line no-eval
    const go = () => (0, eval)(src);
    if (when === 'start') { go(); }
    else if (when === 'dcl') { document.addEventListener('DOMContentLoaded', go); }
    else if (when === 'load') { window.addEventListener('load', go); }
    else { window.addEventListener('load', () => setTimeout(go, 600)); }
  }, { src: userscript, when: moment, late: lateViewport, blocked: blockStorage });
  const page = await context.newPage();
  await page.goto('http://www.kraland.org' + route, { waitUntil: 'load' });
  await page.waitForTimeout(6000);
  const after6 = documents;
  await page.waitForTimeout(2000);
  // Si la page recharge encore (boucle), le contexte d'exécution disparaît : on le note au lieu de planter.
  const state = await page.evaluate(() => ({
    mobile: document.body.classList.contains('mobile-mode'),
    w: window.innerWidth,
    seen: window.__krSeenWidth,
    banner: document.getElementById('kr-resize-banner') ? document.getElementById('kr-resize-banner').textContent : null
  })).catch(() => ({ mobile: false, w: 0, seen: 'page encore en rechargement', banner: null }));
  await context.close();
  return { documents: after6, stable: documents === after6, ...state };
}

console.log('Démarrage : nombre de documents chargés en 6 s (attendu : 1)');
for (const moment of ['start', 'dcl', 'load', 'later']) {
  for (const width of [375, 700]) {
    for (const route of Object.keys(PAGES)) {
      const s = await scenario({ moment, width, route });
      check(`${moment} · ${width} px · ${route} : 1 seul document`, () => assert.equal(s.documents, 1, `${s.documents} documents (innerWidth vu à l'exécution : ${s.seen})`));
      check(`${moment} · ${width} px · ${route} : mode mobile appliqué`, () => assert.equal(s.mobile, true));
    }
  }
}

console.log('Desktop 1280 : pas de rechargement, pas de mode mobile');
for (const moment of ['start', 'dcl', 'later']) {
  const s = await scenario({ moment, width: 1280, route: '/forum' });
  check(`${moment} · 1280 px : 1 seul document`, () => assert.equal(s.documents, 1, `${s.documents} documents`));
  check(`${moment} · 1280 px : pas de mode mobile`, () => assert.equal(s.mobile, false));
}

console.log('Pire cas : largeur fausse (980) jusqu\'après le chargement -> garde-fou plafonné');
for (const route of ['/forum', '/kramail']) {
  const s = await scenario({ moment: 'start', width: 375, route, lateViewport: true });
  check(`${route} : au plus 4 documents en 6 s`, () => assert.ok(s.documents <= 4, `${s.documents} documents`));
  check(`${route} : la boucle s'arrête (nombre stable ensuite)`, () => assert.equal(s.stable, true));
}

console.log('m1 : sessionStorage inaccessible -> aucun rechargement automatique, bandeau manuel');
for (const route of ['/forum', '/kramail']) {
  const s = await scenario({ moment: 'start', width: 375, route, lateViewport: true, blockStorage: true });
  check(`${route} : 1 seul document (le plafond ne peut pas être suivi : pas de rechargement auto)`, () => assert.equal(s.documents, 1, `${s.documents} documents`));
  check(`${route} : bandeau manuel « Recharger » affiché`, () => assert.ok(s.banner && s.banner.includes('Recharger'), String(s.banner)));
}
{
  const s = await scenario({ moment: 'start', width: 375, route: '/forum', blockStorage: true });
  check('stockage inaccessible, démarrage normal : 1 document, mode mobile, aucun bandeau', () => { assert.equal(s.documents, 1); assert.equal(s.mobile, true); assert.equal(s.banner, null); });
}

console.log('s1 : texte du bandeau selon le motif réel');
{
  const cap = await scenario({ moment: 'start', width: 375, route: '/forum', lateViewport: true });
  check('plafond atteint sans saisie : le bandeau ne prétend pas qu\'une saisie est en cours', () => { assert.ok(cap.banner, 'pas de bandeau'); assert.ok(!/saisie/i.test(cap.banner), cap.banner); assert.ok(cap.banner.includes('Recharger'), cap.banner); });
  const typing = await scenario({ moment: 'start', width: 375, route: '/forum/post/saisie', lateViewport: true });
  check('saisie réellement en cours : bandeau « Terminez votre saisie » et aucun rechargement', () => { assert.equal(typing.documents, 1, `${typing.documents} documents`); assert.ok(typing.banner && /Terminez votre saisie/.test(typing.banner), String(typing.banner)); });
}

await browser.close();
if (failures) {
  console.log(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log('\nTous les contrôles passent');
