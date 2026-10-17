// Lanceur des suites e2e : parallèle, ciblé par zone, sans dépendance (Node + playwright déjà présent).
//
//   node tests/e2e/run.mjs all                  le total, en parallèle (à lancer UNE fois en fin de travail)
//   node tests/e2e/run.mjs zone forum croix     seulement les zones citées (npm run test:zone -- forum croix)
//   node tests/e2e/run.mjs changed [--base REF] zones déduites de git diff (npm run test:changed) ; doute = total
//   node tests/e2e/run.mjs red forum            preuve ROUGE ciblée : réussit seulement si la zone ÉCHOUE (npm run test:red -- forum)
//   node tests/e2e/run.mjs list                 zones, suites et fragments
//
// Variables : KR_CONCURRENCY (défaut min(8, CPU/2)), KR_LOGDIR (défaut $TMPDIR/kraland-e2e/<horodatage>, jamais dans le dépôt),
//             KR_SCRIPT (bundle testé), KR_SAVE_DURATIONS=1 (après une exécution verte, réécrit tests/e2e/durations.json : ordre plus longs d'abord),
//             KR_BOOTSTRAP_DIR
//             (dossier du vrai Bootstrap 3.3.7 + jQuery 3.3.1 ; défaut : tests/e2e/vendor/, embarqué dans le dépôt. Si le dossier, par défaut ou indiqué,
//             est incomplet, les fragments « real » font échouer le lanceur en exit 2, jamais un faux vert).
// Chaque fragment a son journal, son dossier de captures (KR_SHOTS) et son TMPDIR : aucune ressource partagée, aucun port fixe.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const E2E = 'tests/e2e';
const DEFAULT_BOOTSTRAP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'vendor');

import { SUITES, ZONES, zonesFromDiff, orderLongestFirst } from './lib/router.mjs';

// Durées mesurées par fragment (secondes), versionnées : elles fixent l'ordre de lancement (plus longs d'abord). Mise à jour EXPLICITE seulement
// (KR_SAVE_DURATIONS=1, après une exécution verte) : une exécution ordinaire ne modifie jamais le dépôt.
const DURATIONS_FILE = path.join(root, E2E, 'durations.json');
function readDurations() {
  try { return JSON.parse(fs.readFileSync(DURATIONS_FILE, 'utf8')).durations || {}; } catch (_e) { return {}; }
}
function saveDurations(results) {
  let doc = {};
  try { doc = JSON.parse(fs.readFileSync(DURATIONS_FILE, 'utf8')); } catch (_e) { doc = {}; }
  const merged = { ...(doc.durations || {}) };
  for (const r of results.filter(x => !x.skipped)) { merged[r.id] = Math.max(1, Math.round(r.ms / 1000)); }
  const known = new Set(buildUnits(ZONES, process.env).map(u => u.id)); // fragments retirés ou renommés : leur durée part
  const durations = Object.fromEntries(Object.keys(merged).filter(k => known.has(k)).sort().map(k => [k, merged[k]]));
  const out = { _comment: doc._comment || 'Durées murales mesurées par fragment (secondes). Lues par run.mjs pour lancer les plus longs d\'abord ; mises à jour par KR_SAVE_DURATIONS=1 npm run test:all (exécution verte seulement).', durations };
  fs.writeFileSync(DURATIONS_FILE, JSON.stringify(out, null, 2) + '\n');
}

function buildUnits(zones, env) {
  const units = [];
  for (const s of SUITES.filter(x => x.zones.some(z => zones.includes(z)))) {
    if (!s.frags) { units.push({ suite: s.name, id: s.name, file: s.file, env: {} }); continue; }
    for (const frag of s.frags) {
      const real = frag.some(f => /(^|-)real($|-)/.test(f));
      const unit = { suite: s.name, id: `${s.name}#${frag.join('+')}`, file: s.file, env: { KR_FRAG: frag.join(',') } };
      const bsDir = env.KR_BOOTSTRAP_DIR || DEFAULT_BOOTSTRAP_DIR;
      if (real && !['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(bsDir, f)))) { unit.missingBootstrap = true; }
      units.push(unit);
    }
  }
  return units;
}

function runUnit(unit, logDir) {
  const safe = unit.id.replace(/[^\w.-]+/g, '_');
  const shots = path.join(logDir, 'shots', safe);
  const tmp = path.join(logDir, 'tmp', safe);
  fs.mkdirSync(shots, { recursive: true });
  fs.mkdirSync(tmp, { recursive: true });
  const logFile = path.join(logDir, safe + '.log');
  const out = fs.openSync(logFile, 'w');
  const t0 = Date.now();
  return new Promise(resolve => {
    const child = spawn(process.execPath, [path.join(root, E2E, unit.file)], {
      cwd: root, stdio: ['ignore', out, out],
      env: { ...process.env, ...unit.env, KR_SHOTS: process.env.KR_SHOTS ? shots : '', KR_COSTS: process.env.KR_COSTS ? path.join(tmp, 'costs.json') : '', TMPDIR: tmp }
    });
    child.on('close', code => {
      fs.closeSync(out);
      const text = fs.readFileSync(logFile, 'utf8');
      const ok = (text.match(/^\s*ok\b/gm) || []).length;
      const fail = (text.match(/^\s*FAIL\b/gm) || []).length;
      resolve({ ...unit, code, ok, fail, ms: Date.now() - t0, logFile });
    });
  });
}

async function runAll(units, concurrency, logDir) {
  const results = [];
  const queue = orderLongestFirst(units.filter(u => !u.skip), readDurations());
  const state = { running: 0, next: 0 };
  await new Promise(done => {
    const launch = u => {
      state.running += 1;
      runUnit(u, logDir).then(r => {
        results.push(r); state.running -= 1;
        process.stdout.write(`  ${r.code === 0 && !r.fail ? 'ok  ' : 'FAIL'} ${r.id} (${(r.ms / 1000).toFixed(0)} s, ${r.ok} ok, ${r.fail} FAIL)\n`);
        pump();
      });
    };
    const pump = () => {
      while (state.running < concurrency && state.next < queue.length) { launch(queue[state.next++]); }
      if (state.running === 0 && state.next >= queue.length) { done(); }
    };
    pump();
  });
  for (const u of units.filter(x => x.skip)) { results.push({ ...u, code: null, ok: 0, fail: 0, ms: 0, skipped: true }); }
  return results;
}

function summarize(results, wallMs, logDir) {
  const lines = ['', 'Résumé par suite (somme des fragments) :'];
  let totalOk = 0; let totalFail = 0; let bad = false;
  for (const name of [...new Set(results.map(r => r.suite))]) {
    const rs = results.filter(r => r.suite === name);
    const ok = rs.reduce((a, r) => a + r.ok, 0); const fail = rs.reduce((a, r) => a + r.fail, 0);
    const failed = rs.some(r => !r.skipped && (r.code !== 0 || r.fail > 0));
    const skipped = rs.filter(r => r.skipped).length;
    const cpu = rs.reduce((a, r) => a + r.ms, 0);
    totalOk += ok; totalFail += fail; bad = bad || failed;
    lines.push(`  ${failed ? 'FAIL' : 'ok  '} ${name.padEnd(24)} ${String(ok).padStart(4)} ok  ${String(fail).padStart(3)} FAIL  (${rs.length} fragment${rs.length > 1 ? 's' : ''}, ${(cpu / 1000).toFixed(0)} s cumulées)${skipped ? `  [${skipped} fragment(s) SKIP : ${rs.find(r => r.skipped).skip}]` : ''}`);
  }
  for (const r of results.filter(x => !x.skipped && (x.code !== 0 || x.fail > 0))) { lines.push(`  -> journal en échec : ${r.logFile}`); }
  lines.push(`Total : ${totalOk} ok, ${totalFail} FAIL en ${(wallMs / 1000).toFixed(0)} s (concurrence ${results.concurrency}). Journaux : ${logDir}`);
  lines.push(bad ? 'RÉSULTAT : ÉCHEC' : 'RÉSULTAT : VERT');
  return { text: lines.join('\n'), bad, totalOk, totalFail };
}

const args = process.argv.slice(2);
const cmd = args.shift() || 'all';
const requested = process.env.KR_CONCURRENCY;
const concurrency = requested === undefined ? Math.min(8, Math.floor(os.cpus().length / 2) || 1) : Number(requested);
if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 32) { console.error('KR_CONCURRENCY doit être un entier entre 1 et 32.'); process.exit(2); }

if (cmd === 'list') {
  console.log('Zones : ' + ZONES.join(', '));
  for (const s of SUITES) { console.log(`  ${s.name.padEnd(24)} zones: ${s.zones.join(',')}${s.frags ? `  fragments: ${s.frags.map(f => f.join('+')).join(' | ')}` : ''}`); }
  process.exit(0);
}

let zones = ZONES;
let expectRed = false;
if (cmd === 'zone' || cmd === 'red') {
  zones = args.filter(a => !a.startsWith('--'));
  expectRed = cmd === 'red';
  const unknown = zones.filter(z => !ZONES.includes(z));
  if (!zones.length || unknown.length) { console.error(`Zone attendue parmi : ${ZONES.join(', ')}${unknown.length ? ` (inconnue : ${unknown.join(', ')})` : ''}`); process.exit(2); }
} else if (cmd === 'changed') {
  const i = args.indexOf('--base');
  const r = zonesFromDiff(i >= 0 ? args[i + 1] : null);
  zones = r.zones;
  console.log('Fichiers modifiés : ' + (r.files && r.files.length ? r.files.join(', ') : '(aucun)'));
  r.reasons.forEach(x => console.log('  - ' + x));
  if (r.widened) { console.log('INCERTITUDE : élargi au total (toutes les zones).'); } else if (!zones.length) { console.log('Aucune zone testable touchée : rien à lancer.'); process.exit(0); } else { console.log('Zones choisies : ' + zones.join(', ')); }
} else if (cmd !== 'all') {
  console.error('Usage : run.mjs all | zone <z...> | changed [--base REF] | red <zone> | list'); process.exit(2);
}

const logDir = process.env.KR_LOGDIR || fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'kraland-e2e-'));
if (path.resolve(logDir).startsWith(root + path.sep)) { console.error('KR_LOGDIR ne doit pas être dans le dépôt : ' + logDir); process.exit(2); }
fs.mkdirSync(logDir, { recursive: true });
const units = buildUnits(zones, process.env);
if (units.some(u => u.missingBootstrap)) { console.error('Fichiers Bootstrap 3.3.7 et jQuery introuvables ou incomplets dans ' + (process.env.KR_BOOTSTRAP_DIR || DEFAULT_BOOTSTRAP_DIR) + ' (attendus : bootstrap.min.css, bootstrap.min.js, jquery.min.js ; défaut tests/e2e/vendor, surcharge KR_BOOTSTRAP_DIR). Aucun fragment ignoré silencieusement.'); process.exit(2); }
const unmeasured = units.filter(u => !Number.isFinite(readDurations()[u.id])).map(u => u.id);
console.log(`${units.length} fragment(s), concurrence ${concurrency}, plus longs d'abord (${path.relative(root, DURATIONS_FILE)})${unmeasured.length ? ` ; sans durée mesurée, lancés en tête : ${unmeasured.join(', ')}` : ''}, journaux dans ${logDir}`);
const t0 = Date.now();
const results = await runAll(units, concurrency, logDir);
results.concurrency = concurrency;
const sum = summarize(results, Date.now() - t0, logDir);
console.log(sum.text);
if (process.env.KR_SAVE_DURATIONS === '1' && !expectRed) {
  if (sum.bad) { console.log('Durées NON enregistrées : exécution en échec.'); } else { saveDurations(results); console.log('Durées enregistrées dans ' + path.relative(root, DURATIONS_FILE) + ' (à committer).'); }
}
if (expectRed) {
  if (sum.bad) { console.log('ROUGE confirmé : la zone échoue comme attendu (preuve rouge OK).'); process.exit(0); }
  console.log('PAS ROUGE : la zone passe, le test ne prouve rien avant le correctif.'); process.exit(1);
}
process.exit(sum.bad ? 1 : 0);
