/* global AbortSignal, atob, Blob, URL */
// Audit réseau des images de carte (img7.kraland.org/2/map) : compare les noms EXACTS de map/1 et map/1b
// avec les variantes cibles du remplacement « carte médiévale » (map/5) et calcule les exclusions.
//
// Source d'inventaire : les index Apache officiels du serveur d'images (http://img7.kraland.org/2/map/ et
// chaque sous-dossier). Aucune plage numérique devinée, aucun nom relevé sur le plateau.
//
// Commandes :
//   node tests/e2e/audit-map-images.mjs                 hors ligne : relit l'inventaire figé, recalcule et vérifie les exclusions
//   node tests/e2e/audit-map-images.mjs --online        audit réseau (GET seulement), met à jour l'inventaire figé et le rapport
//   node tests/e2e/audit-map-images.mjs --online --deep GET aussi sur TOUTES les variantes de la matrice (lent, ~9000 requêtes)
//   options : --concurrency N (défaut 3)  --delay MS (défaut 120)  --no-write
//             --base URL (index à auditer, défaut img7)  --skip-overrides (ne sonde pas les cibles imgur)
//             --cache FICHIER  --cache-ttl HEURES (défaut 24)  --refresh
//
// CACHE : par défaut AUCUN cache disque. Chaque exécution --online relit le serveur (cache en mémoire, limité à
// l'exécution). Un cache disque n'existe que si on passe --cache FICHIER (conseillé : un fichier du scratch,
// $TMPDIR/…) ; chaque entrée est datée et ignorée au-delà de --cache-ttl heures ; --refresh ignore toutes les
// lectures du cache (il est ensuite réécrit avec les valeurs fraîches).
//
// Règles de décision (jamais d'exclusion sur une erreur temporaire) :
//   - « absent »   : HTTP 404 confirmé par deux lectures concordantes (une erreur réseau ou un 5xx n'est JAMAIS « absent ») ;
//   - « invalide » : HTTP 200 mais le MOTEUR D'IMAGE (Chromium via Playwright, Image()) n'affiche pas le contenu ;
//   - « inconnu »  : erreur réseau, 403, 429, 5xx, délai dépassé, ou moteur indisponible : relancé 2 fois, sinon
//                    laissé « inconnu », jamais transformé en exclusion ; l'audit sort avec le code 2 s'il en reste.
//   - la signature / dimensions / octet de fin (signatureInfo) ne sont qu'un diagnostic affiché : elles ne décident
//     jamais d'une validité (elles se trompent dans les deux sens, cf. fichiers forgés de tests/e2e/map-exclusions.mjs).
//   - une exclusion exige une SOURCE valide (affichée par le moteur) ET une cible confirmée absente ou invalide.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const INVENTORY_PATH = path.join(root, 'tests/e2e/fixtures/map-inventory.json');
const REPORT_PATH = path.join(root, 'docs/AUDIT-MAP-IMAGES.md');
const DEFAULT_BASE = 'http://img7.kraland.org/2/map/';
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('--base', DEFAULT_BASE).replace(/\/?$/, '/');
const TARGET = '5';
const SOURCES = ['1', '1b']; // variantes remplacées par map/5 (règle générale de computeReplacement)

/** Dossier de travail temporaire : le scratch du profil ($TMPDIR), jamais un /tmp système en dur */
export const scratchDir = () => process.env.TMPDIR || os.tmpdir();

// ---------------------------------------------------------------------------------------------
// Fonctions pures (réutilisées par le test hors ligne)
// ---------------------------------------------------------------------------------------------

/** Extrait les entrées d'un index Apache : { dirs: [...], files: [{ name, size, date }] } */
export function parseIndex(html) {
  const dirs = []; const files = [];
  const re = /<img src="[^"]*" alt="\[[^\]]*\]"> <a href="([^"?][^"]*)">[^<]*<\/a>\s*(\d{2}-\w{3}-\d{4} \d{2}:\d{2})?\s*([\d.]+[KMG]?|-)?/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith('/') || href.startsWith('?')) { continue; }
    if (href.endsWith('/')) { dirs.push(href.slice(0, -1)); } else { files.push({ name: decodeURIComponent(href), date: m[2] || null, size: m[3] || null }); }
  }
  return { dirs, files };
}

/** DIAGNOSTIC seulement (jamais décisif) : signature, dimensions et fin de fichier GIF / PNG / JPEG.
 *  Ce n'est PAS un décodage : un PNG « en-tête + IEND » sans données passe, un GIF sans octet de fin 0x3B échoue
 *  alors que le moteur l'affiche. La validité vient de decodeWithEngine(). */
export function signatureInfo(buf) {
  if (!buf || buf.length < 12) { return { ok: false, reason: 'trop court' }; }
  const b = buf;
  if (b.slice(0, 3).toString('latin1') === 'GIF' && /^GIF8[79]a$/.test(b.slice(0, 6).toString('latin1'))) {
    const w = b.readUInt16LE(6); const h = b.readUInt16LE(8);
    if (!w || !h) { return { ok: false, reason: 'gif sans dimensions' }; }
    if (b[b.length - 1] !== 0x3b) { return { ok: false, reason: 'gif sans marqueur de fin' }; }
    return { ok: true, type: 'gif', w, h };
  }
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    const w = b.readUInt32BE(16); const h = b.readUInt32BE(20);
    if (!w || !h) { return { ok: false, reason: 'png sans dimensions' }; }
    if (!b.slice(b.length - 8, b.length - 4).equals(Buffer.from('IEND'))) { return { ok: false, reason: 'png sans IEND' }; }
    return { ok: true, type: 'png', w, h };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    if (b[b.length - 2] !== 0xff || b[b.length - 1] !== 0xd9) { return { ok: false, reason: 'jpeg sans marqueur de fin' }; }
    return { ok: true, type: 'jpeg' };
  }
  return { ok: false, reason: 'signature inconnue (' + b.slice(0, 16).toString('latin1').replace(/[^\x20-\x7e]/g, '.') + ')' };
}

/** Exclusions déterministes par variante source : noms dont la cible map/5 est confirmée absente ou invalide */
export function computeExclusions(results) {
  const out = {};
  for (const s of SOURCES) {
    const names = Object.keys(results[s] || {}).filter(n => {
      const r = results[s][n];
      // la source doit elle-même être une vraie image affichée par le moteur, sinon il n'y a rien à remplacer ;
      // la cible doit être confirmée absente (404 x2) ou invalide (moteur), jamais « inconnue »
      return r.source && r.source.status === 'present' && r.target && (r.target.status === 'absent' || r.target.status === 'invalide');
    });
    out[s] = names.sort();
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Réseau
// ---------------------------------------------------------------------------------------------
const online = flag('--online');
const deep = flag('--deep');
const concurrency = Number(opt('--concurrency', 3));
const delayMs = Number(opt('--delay', 120));
const cachePath = opt('--cache', null);
const cacheTtlMs = Number(opt('--cache-ttl', 24)) * 3600 * 1000;
const refresh = flag('--refresh');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export async function get(url, attempts = 3, retryDelay = 600) {
  let last = null;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { method: 'GET', headers: { 'user-agent': 'kraland-css-audit (lecture seule, faible concurrence)' }, signal: AbortSignal.timeout(20000), redirect: 'follow' });
      const buf = Buffer.from(await res.arrayBuffer());
      if (res.status === 404 || res.status === 200) { return { status: res.status, type: res.headers.get('content-type') || '', buf }; }
      last = { error: 'HTTP ' + res.status };
    } catch (e) { last = { error: String(e.cause && e.cause.code || e.message) }; }
    await sleep(retryDelay * (i + 1) ** 2);
  }
  return last;
}

/** Décodage RÉEL par le moteur d'image de Chromium (Playwright) : le contenu est affiché dans un <img> (blob).
 *  Retourne { ok, w, h } ; ok vaut false si le moteur refuse l'image (PNG vide, page HTML…). */
export async function decodeWithEngine(page, buf, mime) {
  return page.evaluate(async ({ b64, type }) => {
    const bin = atob(b64); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) { bytes[i] = bin.charCodeAt(i); }
    const url = URL.createObjectURL(new Blob([bytes], { type }));
    try {
      return await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ ok: img.naturalWidth > 0 && img.naturalHeight > 0, w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ ok: false, w: 0, h: 0 });
        img.src = url;
      });
    } finally { URL.revokeObjectURL(url); }
  }, { b64: Buffer.from(buf).toString('base64'), type: mime || '' });
}

let enginePromise = null;
/** Lance Chromium (déjà installé avec Playwright) une seule fois ; retourne { browser, page }, ou null si indisponible */
export async function engine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      try {
        const { launchBrowser } = await import('./lib/navigateur.mjs');
        const browser = await launchBrowser();
        const page = await browser.newPage();
        await page.goto('about:blank');
        return { browser, page };
      } catch (e) { console.error('Moteur d\'image indisponible : ' + e.message); return null; }
    })();
  }
  return enginePromise;
}
export async function closeEngine() {
  if (enginePromise) { const e = await enginePromise; if (e) { await e.browser.close(); } enginePromise = null; }
}

/** Statut d'une URL : present | absent | invalide | inconnu (+ détail) ; 404 confirmé par 2 lectures ;
 *  cache = { [url]: {…, at} } ; une entrée plus vieille que ttlMs, ou refreshAll = true, est relue sur le serveur */
export async function probe(url, cache, { ttlMs = cacheTtlMs, refreshAll = refresh, retryDelay = 600 } = {}) {
  const hit = cache[url];
  if (!refreshAll && hit && hit.status !== 'inconnu' && hit.at && Date.now() - hit.at < ttlMs) { return hit; }
  const r = await get(url, 3, retryDelay);
  let out;
  if (r.error) { out = { status: 'inconnu', detail: r.error }; }
  else if (r.status === 404) {
    const r2 = await get(url, 2, retryDelay);
    out = r2.error ? { status: 'inconnu', detail: 'seconde lecture : ' + r2.error } : r2.status === 404 ? { status: 'absent', http: 404 } : { status: 'inconnu', detail: 'lectures discordantes 404 puis ' + r2.status };
  } else {
    const sig = signatureInfo(r.buf);
    const sigTxt = sig.ok ? sig.type : sig.reason;
    const eng = await engine();
    if (!eng) { out = { status: 'inconnu', detail: 'moteur d\'image indisponible (aucune validation, aucune exclusion)', bytes: r.buf.length }; }
    else if (!/^image\//i.test(r.type)) { out = { status: 'invalide', http: 200, detail: 'type MIME ' + r.type + ' (signature : ' + sigTxt + ')', bytes: r.buf.length }; }
    else {
      const dec = await decodeWithEngine(eng.page, r.buf, r.type.split(';')[0]);
      out = dec.ok
        ? { status: 'present', http: 200, type: sig.type || r.type, w: dec.w, h: dec.h, bytes: r.buf.length }
        : { status: 'invalide', http: 200, detail: 'le moteur n\'affiche pas ce contenu (signature : ' + sigTxt + ') (' + r.type + ')', bytes: r.buf.length };
    }
  }
  // « inconnu » n'est jamais réutilisé (le test ci-dessus l'écarte) ; chaque entrée est datée pour le TTL
  cache[url] = { ...out, at: Date.now() };
  return cache[url];
}

async function pool(items, worker) {
  let i = 0;
  const run = async () => { while (i < items.length) { const k = i; i += 1; await worker(items[k], k); await sleep(delayMs); } };
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, run));
}

async function listing(dir) {
  const r = await get(BASE + (dir ? dir + '/' : ''));
  if (r.error || r.status !== 200) { throw new Error('index illisible : ' + BASE + dir + ' → ' + (r.error || r.status)); }
  return parseIndex(r.buf.toString('latin1'));
}

function overridesFromTemplate() {
  const src = fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8');
  const block = src.match(/MEDIEVAL_MAP_OVERRIDES: \{([\s\S]*?)\n {4}\},/);
  const map = {};
  if (block) { for (const m of block[1].matchAll(/'([^']+)': '([^']+)'/g)) { map[m[1]] = m[2]; } }
  return map;
}

async function runOnline() {
  // cache : mémoire seule (limité à cette exécution) sauf --cache FICHIER explicite
  const cache = cachePath && fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
  const saveCache = () => { if (cachePath) { fs.writeFileSync(cachePath, JSON.stringify(cache)); } };
  console.log('Cache : ' + (cachePath ? cachePath + ' (TTL ' + opt('--cache-ttl', 24) + ' h' + (refresh ? ', --refresh : lectures du cache ignorées' : '') + ')' : 'mémoire seule, limité à cette exécution'));
  console.log('Inventaire : index officiels Apache de ' + BASE);
  const rootIdx = await listing('');
  const variants = rootIdx.dirs;
  console.log('Variantes trouvées (' + variants.length + ') : ' + variants.join(', '));
  const lists = {};
  for (const v of variants) { lists[v] = await listing(v); await sleep(delayMs); }
  const inv = { generatedAt: new Date().toISOString(), source: BASE, variants: {}, rootFiles: rootIdx.files.map(f => f.name) };
  for (const v of variants) { inv.variants[v] = { files: lists[v].files.map(f => f.name), subdirs: lists[v].dirs }; }
  // Matrice de présence (d'après les index) : nom source → variantes qui ont le même nom exact
  const matrix = {};
  for (const s of SOURCES) { matrix[s] = {}; for (const n of inv.variants[s].files) { matrix[s][n] = variants.filter(v => inv.variants[v].files.includes(n)); } }
  inv.matrix = matrix;
  // Vérification réseau : chaque source et sa cible map/5 au nom exact
  const results = { 1: {}, '1b': {} };
  const jobs = [];
  for (const s of SOURCES) { for (const n of inv.variants[s].files) { jobs.push([s, n]); } }
  let done = 0;
  await pool(jobs, async ([s, n]) => {
    const src = await probe(BASE + s + '/' + n, cache);
    const tgt = await probe(BASE + TARGET + '/' + n, cache);
    results[s][n] = { source: src, target: tgt, inListing5: inv.variants[TARGET].files.includes(n) };
    done += 1;
    if (done % 100 === 0) { console.log('  … ' + done + '/' + jobs.length); saveCache(); }
  });
  saveCache();
  // Mode profond : tous les autres couples (source, variante) de la matrice
  if (deep) {
    const others = variants.filter(v => v !== TARGET && !SOURCES.includes(v));
    const dj = [];
    for (const s of SOURCES) { for (const n of inv.variants[s].files) { for (const v of others) { if (inv.variants[v].files.includes(n)) { dj.push([v, n]); } } } }
    inv.deep = {}; let dd = 0;
    await pool(dj, async ([v, n]) => { inv.deep[v + '/' + n] = await probe(BASE + v + '/' + n, cache); dd += 1; if (dd % 200 === 0) { console.log('  … profond ' + dd + '/' + dj.length); saveCache(); } });
    saveCache();
  }
  // Mappings explicites (imgur) : la source existe-t-elle, la cible s'affiche-t-elle ?
  inv.overrides = {};
  const ov = flag('--skip-overrides') ? {} : overridesFromTemplate();
  await pool(Object.entries(ov), async ([srcUrl, tgtUrl]) => {
    const name = srcUrl.replace(BASE, '');
    inv.overrides[srcUrl] = { target: tgtUrl, sourceInListing: Boolean(inv.variants[name.split('/')[0]] && inv.variants[name.split('/')[0]].files.includes(name.split('/')[1])), targetProbe: await probe(tgtUrl, cache) };
  });
  saveCache();
  await closeEngine();
  inv.results = results;
  inv.exclusions = computeExclusions(results);
  return inv;
}

export function summarize(inv) {
  const tally = (arr) => arr.reduce((a, x) => { a[x] = (a[x] || 0) + 1; return a; }, {});
  const totals = {};
  for (const s of SOURCES) {
    const r = Object.values(inv.results[s]);
    totals[s] = {
      noms: r.length,
      sourceStatuts: tally(r.map(x => x.source.status)),
      cibleStatuts: tally(r.map(x => x.target.status)),
      remplaçables: r.filter(x => x.source.status === 'present' && x.target.status === 'present').length,
      exclusions: inv.exclusions[s].length,
      inconnus: r.filter(x => x.source.status === 'inconnu' || x.target.status === 'inconnu').length,
      incohérencesIndex: Object.entries(inv.results[s]).filter(([, x]) => x.inListing5 !== (x.target.status === 'present' || x.target.status === 'invalide')).length
    };
  }
  return totals;
}

function writeReport(inv, totals) {
  const L = [];
  L.push('# Audit réseau des images de carte (map/1, map/1b → map/5)', '');
  L.push('Généré par `node tests/e2e/audit-map-images.mjs --online` le ' + inv.generatedAt + '. Ne pas éditer à la main.', '');
  L.push('## Source d\'inventaire', '');
  L.push('Index Apache officiels du serveur d\'images, accessibles en GET sans authentification :', '');
  L.push('- `' + inv.source + '` (liste des variantes) puis un index par variante (`' + inv.source + '<variante>/`).');
  L.push('- Aucune plage numérique devinée ; aucun nom relevé sur le plateau. `robots.txt` absent (404) : rien n\'interdit la lecture, la concurrence reste faible (3 requêtes, pause 120 ms).', '');
  L.push('## Couverture', '');
  const vs = Object.keys(inv.variants);
  L.push('Variantes présentes dans l\'index racine (' + vs.length + ') : ' + vs.map(v => '`' + v + '` (' + inv.variants[v].files.length + ' fichiers)').join(', ') + '.', '');
  L.push('- **Par les index seulement (toutes variantes)** : la matrice de présence compare les NOMS de `map/1` (' + inv.variants['1'].files.length + ') et `map/1b` (' + inv.variants['1b'].files.length + ') aux ' + vs.length + ' variantes. Détail dans `tests/e2e/fixtures/map-inventory.json` (clé `matrix`). C\'est un inventaire de noms, pas une lecture d\'images.');
  L.push('- **Lecture réelle image par image (GET + affichage par le moteur Chromium)** : chaque nom de `map/1` et de `map/1b` dans sa variante source ET dans la variante cible `map/5` (noms exacts, suffixes compris : `55_1.gif`…), soit ' + (inv.variants['1'].files.length + inv.variants['1b'].files.length) + ' sources et autant de cibles. Ce sont les seules variantes concernées par les règles de remplacement (`/2/map/1/` et `/2/map/1b/` → `/2/map/5/`). Les images de `map/5` qui n\'ont pas de homologue dans `map/1` ou `map/1b` ne sont pas lues.');
  L.push(inv.deep ? '- **Mode profond** exécuté : tous les autres couples (nom, variante) de la matrice ont aussi été lus.' : '- Les ' + (vs.length - 3) + ' autres variantes (`' + vs.filter(v => v !== '5' && !SOURCES.includes(v)).join('`, `') + '`) NE SONT PAS lues image par image (aucune règle ne les remplace) : elles ne sont connues que par les index. `--deep` les lit.', '');
  L.push('', '### Matrice map/1 → toutes les variantes (d\'après les index)', '', '| Variante | Noms de map/1 présents | Noms de map/1 absents | Noms de map/1b présents | Noms de map/1b absents |', '|---|---|---|---|---|');
  for (const v of vs) {
    const p1 = inv.variants['1'].files.filter(n => inv.variants[v].files.includes(n)).length;
    const pb = inv.variants['1b'].files.filter(n => inv.variants[v].files.includes(n)).length;
    L.push('| `' + v + '`' + (v === TARGET ? ' (cible)' : '') + ' | ' + p1 + ' | ' + (inv.variants['1'].files.length - p1) + ' | ' + pb + ' | ' + (inv.variants['1b'].files.length - pb) + ' |');
  }
  L.push('', '## Totaux calculés', '');
  L.push('| Source | Noms | Sources valides | Cibles map/5 valides | Cibles absentes (404) | Cibles invalides | Remplaçables | Exclusions | Inconnus | Écarts index/réseau |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const s of SOURCES) { const t = totals[s]; L.push('| map/' + s + ' | ' + t.noms + ' | ' + (t.sourceStatuts.present || 0) + ' | ' + (t.cibleStatuts.present || 0) + ' | ' + (t.cibleStatuts.absent || 0) + ' | ' + (t.cibleStatuts.invalide || 0) + ' | ' + t.remplaçables + ' | ' + t.exclusions + ' | ' + t.inconnus + ' | ' + t.incohérencesIndex + ' |'); }
  L.push('');
  const badSrc = SOURCES.flatMap(s => Object.entries(inv.results[s]).filter(([, x]) => x.source.status !== 'present').map(([n, x]) => 'map/' + s + '/' + n + ' : ' + x.source.status + (x.source.detail ? ' (' + x.source.detail + ')' : '')));
  L.push('Sources qui ne sont pas des images valides : ' + (badSrc.length ? '\n\n' + badSrc.map(x => '- ' + x).join('\n') : 'aucune.'), '');
  const unknown = SOURCES.flatMap(s => Object.entries(inv.results[s]).filter(([, x]) => x.source.status === 'inconnu' || x.target.status === 'inconnu').map(([n, x]) => 'map/' + s + '/' + n + ' : ' + JSON.stringify([x.source.detail, x.target.detail].filter(Boolean))));
  L.push('Erreurs temporaires non résolues (jamais exclues) : ' + (unknown.length ? '\n\n' + unknown.map(x => '- ' + x).join('\n') : 'aucune.'), '');
  L.push('## Mappings explicites (MEDIEVAL_MAP_OVERRIDES, hôte externe)', '');
  const ov = Object.entries(inv.overrides);
  const ovTally = ov.reduce((a, [, v]) => { a[v.targetProbe.status] = (a[v.targetProbe.status] || 0) + 1; return a; }, {});
  L.push(ov.length + ' mappings : cibles ' + JSON.stringify(ovTally) + '. Sources présentes dans l\'index officiel : ' + ov.filter(([, v]) => v.sourceInListing).length + '/' + ov.length + '.', '');
  const ovBad = ov.filter(([, v]) => v.targetProbe.status !== 'present');
  L.push(ovBad.length ? 'À examiner :\n\n' + ovBad.map(([k, v]) => '- ' + k + ' → ' + v.target + ' : ' + v.targetProbe.status + (v.targetProbe.detail ? ' (' + v.targetProbe.detail + ')' : '')).join('\n') : 'Toutes les cibles s\'affichent dans le moteur.', '');
  L.push('Les mappings explicites gardent la priorité sur la règle générale ; une cible externe en échec reste couverte par le repli d\'exécution.', '');
  L.push('## Exclusions déterministes (source valide, cible map/5 absente ou invalide)', '');
  for (const s of SOURCES) { L.push('### map/' + s + ' (' + inv.exclusions[s].length + ')', '', '`' + inv.exclusions[s].join('` `') + '`', ''); }
  L.push('Ces listes sont reprises dans `kraland-userscript-template.js` (`CONFIG.MEDIEVAL_ABSENT_IN_TARGET`) : plus de requête voué à l\'échec vers `map/5`. Le repli d\'exécution (retour à l\'URL d\'origine si le chargement échoue) est conservé : une image qui disparaîtrait plus tard reste protégée.', '');
  L.push('## Méthode de validation et cache', '');
  L.push('- Validité d\'une image : affichage réel par le moteur d\'image de Chromium (Playwright, `Image()` sur un blob de l\'octet reçu). La signature, les dimensions et l\'octet de fin ne sont qu\'un diagnostic affiché dans le détail ; ils ne décident jamais (régressions forgées dans `tests/e2e/map-exclusions.mjs`).');
  L.push('- Absence : HTTP 404 lu deux fois. Une erreur réseau, un 403, 429, 5xx ou un délai dépassé donne « inconnu » et ne produit jamais d\'exclusion.');
  L.push('- Cache : aucun cache disque par défaut ; chaque exécution relit le serveur. `--cache FICHIER` active un cache daté (TTL `--cache-ttl`, 24 h par défaut), `--refresh` l\'ignore. Les tests `tests/e2e/map-exclusions.mjs` prouvent qu\'un changement serveur est pris en compte à la relance.', '');
  L.push('## Limites', '');
  L.push('- L\'inventaire est celui des index Apache à la date ci-dessus ; une image ajoutée ensuite au serveur n\'est pas dans la liste d\'exclusions (elle est donc simplement tentée, avec repli).');
  L.push('- Une exclusion signifie « absente ou invalide à la date de l\'audit » : relancer `--online` pour la mettre à jour.');
  L.push('- Les arrière-plans CSS : la feuille du thème ne contient aucun `url()` distant (uniquement des `data:`) ; les arrière-plans posés en ligne par le site passent par la même règle `computeReplacement` + pré-test avant remplacement.');
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, L.join('\n') + '\n');
}

export function exclusionsInTemplate() {
  const src = fs.readFileSync(path.join(root, 'kraland-userscript-template.js'), 'utf8');
  const out = {};
  const block = src.match(/MEDIEVAL_ABSENT_IN_TARGET: \{([\s\S]*?)\n {4}\},/);
  for (const s of SOURCES) {
    const arr = block ? block[1].match(new RegExp("'" + s + "': \\[([\\s\\S]*?)\\]")) : null;
    out[s] = arr ? [...arr[1].matchAll(/'([^']+)'/g)].map(x => x[1]).sort() : [];
  }
  return out;
}

/** Exécute un audit complet contre BASE et retourne { inv, totals } (utilisé aussi par les tests) */
export { runOnline };

if (import.meta.url === 'file://' + process.argv[1]) {
  if (online) {
    const inv = await runOnline();
    const totals = summarize(inv);
    console.log(JSON.stringify(totals, null, 2));
    if (!flag('--no-write')) {
      fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inv));
      writeReport(inv, totals);
      console.log('Inventaire figé : ' + path.relative(root, INVENTORY_PATH) + '\nRapport : ' + path.relative(root, REPORT_PATH));
    }
    const unknown = SOURCES.reduce((n, s) => n + totals[s].inconnus, 0);
    const tpl = exclusionsInTemplate();
    const same = SOURCES.every(s => JSON.stringify(tpl[s]) === JSON.stringify(inv.exclusions[s]));
    console.log('Exclusions du template identiques au résultat : ' + (same ? 'oui' : 'NON (mettre à jour CONFIG.MEDIEVAL_ABSENT_IN_TARGET)'));
    if (unknown > 0) { console.log(unknown + ' nom(s) « inconnu(s) » : relancer l\'audit ; aucune exclusion posée pour eux.'); process.exit(2); }
  } else {
    const inv = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
    const totals = summarize(inv);
    console.log('Inventaire figé du ' + inv.generatedAt);
    console.log(JSON.stringify(totals, null, 2));
    const calc = computeExclusions(inv.results);
    const tpl = exclusionsInTemplate();
    const same = SOURCES.every(s => JSON.stringify(tpl[s]) === JSON.stringify(calc[s]));
    console.log('Exclusions du template identiques à celles de l\'inventaire figé : ' + (same ? 'oui' : 'NON'));
    process.exit(same ? 0 : 1);
  }
}
