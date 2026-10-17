// Test du repli des remplacements d'images (carte médiévale) : la source d'origine doit toujours revenir
// si la cible est absente ou invalide, sans boucle de requêtes. Aucun accès réseau réel : tout est simulé.
//
// Usage : npm run build && node tests/e2e/image-fallback.mjs
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { confineNetwork } from './lib/confinement.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const TARGET = 'http://www.kraland.org/jouer/plateau';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');
const BASE = 'http://img7.kraland.org/2/map';

// Fichiers qui existent sur le « serveur » simulé (le reste répond 404)
const EXISTING = new Set([
  `${BASE}/1/100.gif`, `${BASE}/5/100.gif`, // remplacement valide
  `${BASE}/1/55_1.gif`, // cas exact signalé : n'existe que dans /1/
  `${BASE}/1/101.gif`, `${BASE}/5/101.gif`, // image ajoutée dynamiquement
  `${BASE}/1b/102.gif`, `${BASE}/5/102.gif`, // variante /1b/ (sépia)
  `${BASE}/1/103.gif`, `${BASE}/5/103.gif`, // fond CSS valide
  `${BASE}/1/55_2.gif`, // fond CSS dont la cible n'existe pas
  `${BASE}/1/104.gif`, `${BASE}/5/104.gif`, // cible valide mais illisible (corps invalide)
  `${BASE}/1/105.gif`, `${BASE}/5/105.gif`, // changement de source par le site
  `${BASE}/1/106.gif`, `${BASE}/5/106.gif`,
  `${BASE}/1/200.gif`, `${BASE}/5/200.gif`, // cible valide mais lente (pré-test dépassé)
  `${BASE}/1/201.gif`, `${BASE}/5/201.gif` // fond CSS dont la cible est lente
]);
const SLOW = new Set([`${BASE}/5/200.gif`, `${BASE}/5/201.gif`]);
// 77.gif : absente partout. 104 : /5/ répond 200 avec un corps qui n'est pas une image.
const requests = {};

const html = `<!doctype html><html><head><meta charset="utf-8"><title>fixture</title></head><body>
<div id="zone">
  <img id="ok" src="${BASE}/1/100.gif" width="16" height="16">
  <img id="exact" src="${BASE}/1/55_1.gif" width="16" height="16">
  <img id="both" src="${BASE}/1/77.gif" width="16" height="16">
  <img id="sepia" src="${BASE}/1b/102.gif" width="16" height="16" style="filter: blur(0px)">
  <img id="bad" src="${BASE}/1/104.gif" width="16" height="16">
  <img id="resync" src="${BASE}/1/105.gif" width="16" height="16">
  <div id="bgok" style="width:20px;height:20px;background-image:url('${BASE}/1/103.gif')"></div>
  <div id="bgko" style="width:20px;height:20px;background-image:url('${BASE}/1/55_2.gif')"></div>
</div>
<script>
  window.__native = { errors: 0, loads: 0 };
  // Gestionnaires natifs du site : doivent survivre au remplacement
  for (const id of ['ok', 'exact', 'both']) {
    const el = document.getElementById(id);
    el.onerror = () => { window.__native.errors += 1; };
    el.onload = () => { window.__native.loads += 1; };
  }
</script>
</body></html>`;

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await confineNetwork(context); // refus global EN PREMIER (img7 routé ci-dessous)
await context.route(TARGET, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
await context.route('http://img7.kraland.org/**', async route => {
  const url = route.request().url();
  requests[url] = (requests[url] || 0) + 1;
  // cibles valides mais lentes (réseau lent) : plus longues que le délai du pré-test (3 s)
  if (SLOW.delete(url)) { await new Promise(r => setTimeout(r, 3800)); }
  if (url === `${BASE}/5/104.gif`) { return route.fulfill({ status: 200, contentType: 'image/gif', body: 'ceci n est pas une image' }); }
  if (EXISTING.has(url)) { return route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }); }
  return route.fulfill({ status: 404, contentType: 'text/html', body: 'not found' });
});
await context.addInitScript(({ src, base }) => {
  window.GM = { xmlHttpRequest: () => {} };
  localStorage.setItem('kr-medieval-map', 'true');
  const go = () => {
    // eslint-disable-next-line no-eval
    (0, eval)(src);
    // Images insérées pendant l'analyse du document (chemin « interception précoce »)
    const mk = (id, s) => { const i = document.createElement('img'); i.id = id; i.setAttribute('src', s); i.width = 16; i.height = 16; document.body.appendChild(i); };
    mk('early-ok', base + '/1/100.gif');
    mk('early-exact', base + '/1/55_1.gif');
    mk('early-both', base + '/1/77.gif');
  };
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript, base: BASE });
const page = await context.newPage();
await page.goto(TARGET, { waitUntil: 'load' });
await page.waitForTimeout(2500);

const state = (id) => page.evaluate((i) => {
  const el = document.getElementById(i);
  return {
    src: el.getAttribute('src'), applied: el.getAttribute('data-kr-medieval-applied'), failed: el.getAttribute('data-kr-medieval-failed'),
    original: el.getAttribute('data-kr-medieval-original-bg'), width: el.naturalWidth, filter: el.style.filter,
    bg: getComputedStyle(el).backgroundImage
  };
}, id);
const count = (u) => requests[u] || 0;

console.log('Remplacement valide');
const ok = await state('ok');
check('remplacement /1/ -> /5/ conservé', () => { assert.equal(ok.src, `${BASE}/5/100.gif`); assert.equal(ok.applied, 'true'); assert.ok(ok.width > 0); });
check('source d\'origine mémorisée avant remplacement', () => assert.equal(ok.original, `${BASE}/1/100.gif`));

console.log('Interception précoce (images insérées pendant le chargement)');
const earlyOk = await state('early-ok'); const earlyExact = await state('early-exact'); const earlyBoth = await state('early-both');
check('image précoce valide remplacée (/5/)', () => assert.equal(earlyOk.src, `${BASE}/5/100.gif`));
check('image précoce 55_1.gif : retour à /1/55_1.gif, affichée', () => { assert.equal(earlyExact.src, `${BASE}/1/55_1.gif`); assert.ok(earlyExact.width > 0); });
check('image précoce absente partout : original', () => assert.equal(earlyBoth.src, `${BASE}/1/77.gif`));

console.log('Cible absente (cas exact 55_1.gif)');
const exact = await state('exact');
check('retour à l\'URL originale /1/55_1.gif', () => assert.equal(exact.src, `${BASE}/1/55_1.gif`));
check('l\'image originale s\'affiche', () => assert.ok(exact.width > 0));
check('exclusion connue : AUCUNE requête n\'est partie vers /5/55_1.gif (comptage, pas de repli subi)', () => { assert.equal(count(`${BASE}/5/55_1.gif`), 0, 'requêtes vers /5/55_1.gif : ' + count(`${BASE}/5/55_1.gif`)); assert.ok(count(`${BASE}/1/55_1.gif`) >= 1); });
check('pas appliquée : ni remplacée ni marquée en échec (jamais tentée)', () => { assert.notEqual(exact.applied, 'true'); assert.notEqual(exact.failed, 'true'); });

console.log('Cible et original absents : pas de boucle');
const both = await state('both');
check('retour à l\'original (même absent)', () => assert.equal(both.src, `${BASE}/1/77.gif`));
const before = { a: count(`${BASE}/5/77.gif`), b: count(`${BASE}/1/77.gif`) };
await page.waitForTimeout(2500);
check(`requêtes stables après 2,5 s (cible ${before.a}, original ${before.b})`, () => { assert.equal(count(`${BASE}/5/77.gif`), before.a); assert.equal(count(`${BASE}/1/77.gif`), before.b); });
check('cible tentée au plus 2 fois, original au plus 3', () => { assert.ok(before.a <= 2, String(before.a)); assert.ok(before.b <= 3, String(before.b)); });

console.log('Cible illisible (200 mais pas une image)');
const bad = await state('bad');
check('retour à l\'original /1/104.gif', () => { assert.equal(bad.src, `${BASE}/1/104.gif`); assert.ok(bad.width > 0); });

console.log('Variante /1b/ et filtre');
const sepia = await state('sepia');
check('remplacement /1b/ -> /5/ avec sépia', () => { assert.equal(sepia.src, `${BASE}/5/102.gif`); assert.match(sepia.filter, /sepia/); });

console.log('Fonds CSS');
const bgok = await state('bgok');
const bgko = await state('bgko');
check('fond remplacé quand la cible existe', () => assert.ok(bgok.bg.includes('/5/103.gif'), bgok.bg));
check('fond d\'origine conservé quand la cible est absente', () => assert.ok(bgko.bg.includes('/1/55_2.gif'), bgko.bg));

console.log('Gestionnaires natifs');
const native = await page.evaluate(() => ({ errors: window.__native.errors, loads: window.__native.loads, kept: ['ok', 'exact', 'both'].every(i => typeof document.getElementById(i).onerror === 'function' && typeof document.getElementById(i).onload === 'function') }));
check('onerror/onload natifs toujours en place', () => assert.ok(native.kept));
check('le onload natif a bien été appelé (images chargées)', () => assert.ok(native.loads >= 2, String(native.loads)));

console.log('Idempotence (observateur et réinjection)');
const snapshot = JSON.stringify(requests);
await page.evaluate(() => {
  for (const id of ['ok', 'exact', 'both', 'sepia']) {
    const el = document.getElementById(id);
    el.setAttribute('src', el.getAttribute('src')); // même valeur
    el.setAttribute('data-test', String(Math.random()));
    el.style.setProperty('opacity', '0.99');
  }
});
await page.waitForTimeout(1500);
const exact2 = await state('exact'); const ok2 = await state('ok'); const both2 = await state('both');
check('états inchangés après mutations répétées', () => { assert.equal(exact2.src, `${BASE}/1/55_1.gif`); assert.equal(ok2.src, `${BASE}/5/100.gif`); assert.equal(both2.src, `${BASE}/1/77.gif`); });
const snap0 = JSON.parse(snapshot);
const grew = Object.keys(requests).filter(k => requests[k] - (snap0[k] || 0) > 1);
check(`au plus 1 requête de plus par URL (rechargement natif d'un src identique) : ${grew.length} dépassement`, () => assert.deepEqual(grew, []));
check('cibles absentes jamais retentées', () => { assert.equal(count(`${BASE}/5/77.gif`), before.a); assert.equal(count(`${BASE}/5/55_1.gif`), 0); });

console.log('Source changée par le site');
await page.evaluate((b) => { document.getElementById('resync').setAttribute('src', b + '/1/106.gif'); }, BASE);
await page.waitForTimeout(1500);
const resync = await state('resync');
check('nouvelle source traitée à son tour (/1/106 -> /5/106)', () => assert.equal(resync.src, `${BASE}/5/106.gif`));

console.log('Images ajoutées dynamiquement');
await page.evaluate((b) => {
  const zone = document.getElementById('zone');
  const mk = (id, src) => { const i = document.createElement('img'); i.id = id; i.src = src; i.width = 16; i.height = 16; zone.appendChild(i); };
  mk('dyn-ok', b + '/1/101.gif');
  mk('dyn-exact', b + '/1/55_1.gif');
  mk('dyn-both', b + '/1/88.gif');
}, BASE);
await page.waitForTimeout(2500);
const dynOk = await state('dyn-ok'); const dynExact = await state('dyn-exact'); const dynBoth = await state('dyn-both');
check('image dynamique valide remplacée', () => assert.equal(dynOk.src, `${BASE}/5/101.gif`));
check('image dynamique sans cible : original conservé et affiché', () => { assert.equal(dynExact.src, `${BASE}/1/55_1.gif`); assert.ok(dynExact.width > 0); });
check('image dynamique absente partout : original, sans boucle', () => assert.equal(dynBoth.src, `${BASE}/1/88.gif`));
const dyn1 = count(`${BASE}/1/88.gif`) + count(`${BASE}/5/88.gif`);
await page.waitForTimeout(1500);
check('aucune requête supplémentaire pour l\'image dynamique absente', () => assert.equal(count(`${BASE}/1/88.gif`) + count(`${BASE}/5/88.gif`), dyn1));
check('55_1.gif (précoce, initiale, dynamique) : toujours zéro requête vers /5/55_1.gif', () => assert.equal(count(`${BASE}/5/55_1.gif`), 0));

console.log('Pré-test trop lent (réseau lent) : une cible valide n\'est pas bannie');
await page.evaluate((b) => {
  const zone = document.getElementById('zone');
  const i = document.createElement('img'); i.id = 'slow'; i.width = 16; i.height = 16; i.src = b + '/1/200.gif'; zone.appendChild(i);
  const d = document.createElement('div'); d.id = 'bgslow'; d.style.cssText = `width:20px;height:20px;background-image:url('${b}/1/201.gif')`; zone.appendChild(d);
}, BASE);
await page.waitForTimeout(6000);
const slow = await state('slow'); const bgslow = await state('bgslow');
check('image lente : pas de bannissement (jamais marquée en échec), la cible /5/ finit par s\'afficher', () => { assert.notEqual(slow.failed, 'true'); assert.equal(slow.src, `${BASE}/5/200.gif`); assert.ok(slow.width > 0); });
check('fond lent : original conservé sans marque d\'échec après le délai', () => { assert.notEqual(bgslow.failed, 'true'); });
await page.evaluate((b) => { const d = document.getElementById('bgslow'); d.style.setProperty('background-image', `url('${b}/1/201.gif')`); d.style.setProperty('opacity', '0.99'); }, BASE);
await page.waitForTimeout(1500);
const bgslow2 = await state('bgslow');
check('fond lent : nouvelle tentative possible, la cible (désormais en cache navigateur) est appliquée', () => assert.ok(bgslow2.bg.includes('/5/201.gif'), bgslow2.bg));
check('la cible lente n\'a pas été relue en boucle', () => assert.ok(count(`${BASE}/5/200.gif`) <= 3, String(count(`${BASE}/5/200.gif`))));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
