// Test HORS LIGNE des exclusions de la carte médiévale, sur l'inventaire figé (tests/e2e/fixtures/map-inventory.json).
// Aucun accès réseau : les images sont simulées d'après l'inventaire. L'audit en ligne se lance à part :
//   node tests/e2e/audit-map-images.mjs --online
//
// Usage : npm run build && node tests/e2e/map-exclusions.mjs
// Option : KR_SCRIPT=/chemin/script.user.js pour tester un autre fichier (défaut : bundle principal).
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { parseIndex, checkImageBytes, computeExclusions, exclusionsInTemplate, INVENTORY_PATH } from './audit-map-images.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const inv = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
const scriptPath = process.env.KR_SCRIPT || path.join(root, 'kraland-userscript-main.user.js');
const userscript = fs.readFileSync(scriptPath, 'utf8').replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/, '');
const BASE = 'http://img7.kraland.org/2/map';
const GIF = Buffer.from('R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 'base64');

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

console.log('Outils de l\'audit (fonctions pures)');
check('parseIndex lit un index Apache (fichiers avec suffixe, dossiers)', () => {
  const html = '<pre><img src="/icons/back.gif" alt="[DIR]"> <a href="/2/map/">Parent Directory</a>   -\n<img src="/icons/folder.gif" alt="[DIR]"> <a href="1b/">1b/</a>   04-Mar-2012 13:31  -\n<img src="/icons/image2.gif" alt="[IMG]"> <a href="55_1.gif">55_1.gif</a>                  04-Mar-2012 13:31  845   \n</pre>';
  const r = parseIndex(html);
  assert.deepEqual(r.dirs, ['1b']);
  assert.deepEqual(r.files.map(f => f.name), ['55_1.gif']);
});
check('checkImageBytes accepte un GIF valide', () => assert.equal(checkImageBytes(GIF).ok, true));
check('checkImageBytes refuse une page d\'erreur servie en HTTP 200', () => assert.equal(checkImageBytes(Buffer.from('<html><body>Erreur 404 personnalisée</body></html>')).ok, false));
check('checkImageBytes refuse un GIF tronqué', () => assert.equal(checkImageBytes(GIF.subarray(0, GIF.length - 3)).ok, false));
check('une erreur temporaire n\'est JAMAIS une exclusion', () => {
  const ex = computeExclusions({ 1: { 'a.gif': { target: { status: 'inconnu' } }, 'b.gif': { target: { status: 'absent' } }, 'c.gif': { target: { status: 'present' } }, 'd.gif': { target: { status: 'invalide' } } }, '1b': {} });
  assert.deepEqual(ex['1'], ['b.gif', 'd.gif']);
});

console.log('Inventaire figé');
const names1 = inv.variants['1'].files; const names1b = inv.variants['1b'].files; const files5 = new Set(inv.variants['5'].files);
check('inventaire issu des index officiels (16 variantes dont 1, 1b, 5)', () => { assert.ok(inv.source.startsWith('http://img7.kraland.org/2/map/')); for (const v of ['1', '1b', '5']) { assert.ok(inv.variants[v].files.length > 400, v); } });
check('aucune erreur temporaire dans l\'audit figé (0 inconnu)', () => { for (const s of ['1', '1b']) { assert.ok(Object.values(inv.results[s]).every(r => r.source.status !== 'inconnu' && r.target.status !== 'inconnu')); } });
check('chaque nom de map/1 et map/1b a un résultat (source et cible lues)', () => { assert.equal(Object.keys(inv.results['1']).length, names1.length); assert.equal(Object.keys(inv.results['1b']).length, names1b.length); });
check('toutes les sources sont de vraies images décodables', () => { for (const s of ['1', '1b']) { assert.ok(Object.values(inv.results[s]).every(r => r.source.status === 'present')); } });
check('index et lectures concordent (nom listé dans map/5 ⇔ cible lue)', () => { for (const s of ['1', '1b']) { for (const [n, r] of Object.entries(inv.results[s])) { assert.equal(files5.has(n), r.target.status === 'present' || r.target.status === 'invalide', s + '/' + n); } } });
check('suffixes : 55_1.gif absent de map/5, exclu pour map/1', () => { assert.ok(names1.includes('55_1.gif') && !files5.has('55_1.gif')); assert.ok(inv.exclusions['1'].includes('55_1.gif')); });
check('exclusions = absences/invalidités confirmées, ni plus ni moins', () => { for (const s of ['1', '1b']) { const attendu = Object.entries(inv.results[s]).filter(([, r]) => r.target.status === 'absent' || r.target.status === 'invalide').map(([n]) => n).sort(); assert.deepEqual(inv.exclusions[s], attendu); } });
check('exclusions du template = exclusions de l\'inventaire figé', () => { const t = exclusionsInTemplate(); assert.deepEqual(t['1'], inv.exclusions['1']); assert.deepEqual(t['1b'], inv.exclusions['1b']); });
check('aucun nom exclu n\'existe pourtant dans map/5', () => { for (const s of ['1', '1b']) { assert.ok(inv.exclusions[s].every(n => !files5.has(n))); } });
check('les 28 exclusions historiques (NO_REPLACE) sont toutes confirmées absentes', () => {
  const src = fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8');
  const nr = [...src.match(/MEDIEVAL_NO_REPLACE: \{([\s\S]*?)\n {4}\},/)[1].matchAll(/map\/(1b|1)\/([^']+)': true/g)].map(m => [m[1], m[2]]);
  assert.equal(nr.length, 28);
  assert.ok(nr.every(([v, n]) => inv.exclusions[v].includes(n)));
});

console.log('Comportement dans le script (images simulées d\'après l\'inventaire)');
const requests = {};
const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="zone"></div></body></html>';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const exists = (url) => { const m = url.match(/\/2\/map\/([^/]+)\/([^/?#]+)$/); return Boolean(m && inv.variants[m[1]] && inv.variants[m[1]].files.includes(decodeURIComponent(m[2]))); };
await context.route('http://www.kraland.org/jouer/plateau', route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
await context.route('http://img7.kraland.org/**', route => { const u = route.request().url(); requests[u] = (requests[u] || 0) + 1; return exists(u) ? route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }) : route.fulfill({ status: 404, contentType: 'text/html', body: 'not found' }); });
await context.route('https://i.imgur.com/**', route => route.fulfill({ status: 200, contentType: 'image/gif', body: GIF }));
await context.addInitScript(({ src }) => {
  window.GM = { xmlHttpRequest: () => {} };
  localStorage.setItem('kr-medieval-map', 'true');
  // eslint-disable-next-line no-eval
  const go = () => (0, eval)(src);
  if (document.body) { go(); return; }
  new MutationObserver((m, o) => { if (document.body) { o.disconnect(); go(); } }).observe(document, { childList: true, subtree: true });
}, { src: userscript });
const page = await context.newPage();
await page.goto('http://www.kraland.org/jouer/plateau', { waitUntil: 'load' });
await page.waitForTimeout(800);

// Échantillons : toutes les exclusions, 40 noms remplaçables par variante (dont suffixes), 3 noms inconnus de l'inventaire
const overrideMap = Object.fromEntries([...fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8').match(/MEDIEVAL_MAP_OVERRIDES: \{([\s\S]*?)\n {4}\},/)[1].matchAll(/'([^']+)': '([^']+)'/g)].map(m => [m[1], m[2]]));
const overridden = new Set(Object.keys(overrideMap));
const sample = [];
for (const s of ['1', '1b']) {
  inv.exclusions[s].forEach(n => sample.push({ s, n, kind: overridden.has(`${BASE}/${s}/${n}`) ? 'surcharge' : 'exclu' }));
  const ok = Object.entries(inv.results[s]).filter(([n, r]) => r.target.status === 'present' && !overridden.has(`${BASE}/${s}/${n}`)).map(([n]) => n);
  const withSuffix = ok.filter(n => /_/.test(n)).slice(0, 10);
  [...withSuffix, ...ok.filter(n => !withSuffix.includes(n)).filter((_, i) => i % Math.ceil(ok.length / 30) === 0)].slice(0, 40).forEach(n => sample.push({ s, n, kind: 'remplaçable' }));
}
['9999991.gif', '9999992_1.gif'].forEach(n => sample.push({ s: '1', n, kind: 'inconnu' }));
await page.evaluate(({ items, base }) => {
  const zone = document.getElementById('zone');
  items.forEach((it, i) => { const img = document.createElement('img'); img.id = 'i' + i; img.width = 8; img.height = 8; img.src = `${base}/${it.s}/${it.n}`; zone.appendChild(img); });
}, { items: sample, base: BASE });
await page.waitForTimeout(6000);
const finals = await page.evaluate((n) => Array.from({ length: n }, (_, i) => { const e = document.getElementById('i' + i); return { src: e.getAttribute('src'), w: e.naturalWidth }; }), sample.length);
const bad = (kind, f) => sample.map((it, i) => ({ it, r: finals[i] })).filter(x => x.it.kind === kind && !f(x.it, x.r)).map(x => `${x.it.s}/${x.it.n} → ${x.r.src}`);
check(`exclus (${sample.filter(x => x.kind === 'exclu').length}) : URL d'origine conservée et affichée`, () => assert.deepEqual(bad('exclu', (it, r) => r.src === `${BASE}/${it.s}/${it.n}` && r.w > 0), []));
check(`mappings explicites (${sample.filter(x => x.kind === 'surcharge').length}) : la cible externe garde la priorité sur l'exclusion`, () => assert.deepEqual(bad('surcharge', (it, r) => r.src === overrideMap[`${BASE}/${it.s}/${it.n}`] && r.w > 0), []));
check('exclus : AUCUNE requête vers map/5 (requête vouée à l\'échec évitée)', () => { const hits = sample.filter(x => x.kind === 'exclu').filter(it => requests[`${BASE}/5/${it.n}`]); assert.equal(hits.length, 0, hits.slice(0, 3).map(h => h.n).join(',')); });
check(`remplaçables (${sample.filter(x => x.kind === 'remplaçable').length}) : remplacés par map/5, suffixes compris`, () => assert.deepEqual(bad('remplaçable', (it, r) => r.src === `${BASE}/5/${it.n}` && r.w > 0), []));
check('nom inconnu de l\'inventaire : tenté une fois puis retour à l\'original (repli d\'exécution conservé)', () => {
  assert.deepEqual(bad('inconnu', () => true), []);
  // l'original n'existe pas non plus : on vérifie seulement l'absence de boucle
  for (const it of sample.filter(x => x.kind === 'inconnu')) { assert.ok((requests[`${BASE}/5/${it.n}`] || 0) <= 2, it.n); assert.ok((requests[`${BASE}/${it.s}/${it.n}`] || 0) <= 3, it.n); }
});
const total = Object.values(requests).reduce((a, b) => a + b, 0);
await page.waitForTimeout(2000);
check('aucune requête supplémentaire après stabilisation (pas de boucle)', () => assert.equal(Object.values(requests).reduce((a, b) => a + b, 0), total));

await browser.close();
console.log(failures === 0 ? '\nTous les contrôles passent.' : `\n${failures} contrôle(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
