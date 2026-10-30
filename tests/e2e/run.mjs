// Lanceur des suites e2e : parallèle, ciblé par zone, sans dépendance (Node + playwright déjà présent).
//
//   node tests/e2e/run.mjs all                  le total, en parallèle (à lancer UNE fois en fin de travail), tests unitaires du cœur pur en tête
//   node tests/e2e/run.mjs zone forum croix     seulement les zones citées (npm run test:zone -- forum croix)
//   node tests/e2e/run.mjs changed [--base REF] zones et unités déduites de git diff (npm run test:changed) ; doute = total ; routeur modifié = test:router en plus ;
//                                               template ou tests/unit/ modifié = tests unitaires (npm run test:unit) en plus
//   node tests/e2e/run.mjs red forum            preuve ROUGE ciblée : réussit seulement si la zone ÉCHOUE (npm run test:red -- forum)
//   node tests/e2e/run.mjs list                 zones, suites et fragments
//
// Variables : KR_CONCURRENCY (défaut min(16, CPU - 2), voir CONCURRENCE PAR DÉFAUT ci-dessous), KR_LOGDIR (défaut $TMPDIR/kraland-e2e/<horodatage>, jamais dans le dépôt),
//             KR_SCRIPT (bundle testé), KR_SAVE_DURATIONS=1 (après une exécution verte, réécrit tests/e2e/durations.json : ordre plus longs d'abord),
//             KR_SHARED_BROWSER=0 (un Chromium par fragment au lieu du navigateur partagé, voir NAVIGATEUR PARTAGÉ ci-dessous), KR_BOOTSTRAP_DIR
//             (dossier du vrai Bootstrap 3.3.7 + jQuery 3.3.1 ; défaut : tests/e2e/vendor/, embarqué dans le dépôt. Si le dossier, par défaut ou indiqué,
//             est incomplet, les fragments « real » font échouer le lanceur en exit 2, jamais un faux vert).
// Chaque fragment a son journal, son dossier de captures (KR_SHOTS), son TMPDIR et ses propres contextes de navigateur ; seul le processus
// Chromium est partagé (NAVIGATEUR PARTAGÉ ci-dessous). Aucun port fixe.
//
// CONCURRENCE PAR DÉFAUT (lot H) : min(16, CPU - 2), au moins 1 ; KR_CONCURRENCY la remplace toujours. Pourquoi : un fragment attend
// surtout le navigateur (images, minuteries, rAF), pas le processeur : à concurrence 16, test:all n'occupe qu'environ 9 cœurs en moyenne
// (mesure du lot H sur 18 cœurs, user+sys / durée murale). Doubler la concurrence de 8 à 16 divise la durée par ~1,8 (55 s -> 29-33 s) pour
// +5 % de durée cumulée. Au-delà de 16, la contention mange le gain (24 : 25-30 s, mais +25 % de durée cumulée et moins de marge quand dev
// et qa lancent la suite en même temps). « CPU - 2 » laisse deux cœurs au système et au lanceur sur une petite machine (4 cœurs -> 2).
// Le plafond tient dans [1, 32] (KR_CONCURRENCY hors de cet intervalle : refus, exit 2).
//
// NAVIGATEUR PARTAGÉ (lot H, levier 3) : run.mjs lance UN serveur Chromium (headless shell) et passe son adresse aux fragments
// (KR_BROWSER_WS) ; chaque fragment s'y connecte par lib/navigateur.mjs et y ouvre ses propres contextes (isolation, exceptions : voir
// l'en-tête de lib/navigateur.mjs). Gain mesuré : -19 à -30 % de RSS au pic, -2,5 à -6 % de CPU, durée identique.
//   - Fermeture : à la fin, en cas d'échec, d'exception ou de signal (SIGINT, SIGTERM, SIGHUP : fragments arrêtés, navigateur fermé,
//     exit 130 / 143 / 129). Aucun Chromium orphelin.
//   - Résilience : si le navigateur partagé meurt ou se déconnecte (surveillance du processus et d'une connexion témoin), les fragments
//     en cours sont arrêtés, le navigateur est relancé UNE fois et ces fragments sont rejoués (leur premier journal est gardé :
//     <fragment>.perdu-g<génération>.log). Une seconde perte arrête tout : RÉSULTAT : ÉCHEC, avec la cause ; jamais de faux vert
//     (en mode red, une perte du navigateur rend la preuve NON CONCLUANTE, exit 2, au lieu d'un faux « ROUGE confirmé »).
//   - Échappement : KR_SHARED_BROWSER=0 -> un Chromium par fragment, comme avant (diagnostic d'un doute sur le partage).
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const E2E = 'tests/e2e';
const DEFAULT_BOOTSTRAP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'vendor');

import { SUITES, ZONES, zonesFromDiff, orderLongestFirst, pickUnits } from './lib/router.mjs';
import { sharedDisabled } from './lib/navigateur.mjs';

// Tests unitaires du cœur pur (lot F : node --test tests/unit/, sans navigateur, < 1 s). Lancés avant les fragments par `all`, et par
// `changed` quand le template ou tests/unit/ change (ou en cas d'élargissement). Un échec rend le résultat ÉCHEC.
function runUnitTests() {
  const t0 = Date.now();
  const t = spawnSync(process.execPath, ['--test', '--test-reporter=spec', 'tests/unit/'], { cwd: root, encoding: 'utf8' });
  const out = (t.stdout || '') + (t.stderr || '');
  const count = k => { const m = out.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')); return m ? Number(m[1]) : NaN; };
  const bad = t.status !== 0 || !(count('pass') > 0) || count('fail') !== 0;
  console.log(`Tests unitaires (node --test tests/unit/) : ${bad ? 'ÉCHEC' : 'ok'}, ${count('pass')} ok, ${count('fail')} FAIL en ${((Date.now() - t0) / 1000).toFixed(1)} s${bad ? '\n' + out : ''}`);
  return bad;
}

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

function runUnit(unit, logDir, extraEnv = {}, onSpawn = () => {}) {
  const safe = unit.id.replace(/[^\w.-]+/g, '_');
  const shots = path.join(logDir, 'shots', safe);
  const tmp = path.join(logDir, 'tmp', safe);
  fs.mkdirSync(shots, { recursive: true });
  fs.mkdirSync(tmp, { recursive: true });
  const logFile = path.join(logDir, safe + '.log');
  const out = fs.openSync(logFile, 'w');
  const t0 = Date.now();
  const env = { ...process.env, ...unit.env, KR_SHOTS: process.env.KR_SHOTS ? shots : '', KR_COSTS: process.env.KR_COSTS ? path.join(tmp, 'costs.json') : '', TMPDIR: tmp };
  delete env.KR_BROWSER_WS; // jamais une adresse héritée de l'extérieur : seulement celle du navigateur partagé de CE lanceur
  Object.assign(env, extraEnv);
  return new Promise(resolve => {
    // Groupe de processus propre (detached) : arrêter un fragment arrête aussi ses sous-processus (audit-map-images en lance un).
    const child = spawn(process.execPath, [path.join(root, E2E, unit.file)], { cwd: root, stdio: ['ignore', out, out], env, detached: true });
    onSpawn(child);
    child.on('close', (code, signal) => {
      fs.closeSync(out);
      const text = fs.readFileSync(logFile, 'utf8');
      const ok = (text.match(/^\s*ok\b/gm) || []).length;
      const fail = (text.match(/^\s*FAIL\b/gm) || []).length;
      resolve({ ...unit, code: code === null ? `signal ${signal}` : code, ok, fail, ms: Date.now() - t0, logFile });
    });
  });
}

// Navigateur partagé (NAVIGATEUR PARTAGÉ dans l'en-tête) : un serveur Chromium par génération ; une génération perdue n'est relancée qu'une fois.
const shared = { on: false, gen: 0, server: null, watcher: null, ws: null, lost: new Map(), relaunching: null, fatal: null, closing: false, replayed: 0, onLost: () => {}, resume: () => {} };
async function startShared() {
  const { chromium } = await import('playwright');
  // Signaux gérés par run.mjs (fragments arrêtés AVANT le navigateur) ; Playwright tue quand même ses navigateurs à la sortie du processus.
  const server = await chromium.launchServer({ headless: true, handleSIGINT: false, handleSIGTERM: false, handleSIGHUP: false });
  const gen = shared.gen + 1;
  const proc = server.process();
  const lost = why => onSharedLost(gen, why);
  proc.once('exit', (code, signal) => lost(`processus Chromium ${proc.pid} terminé (${signal || 'code ' + code})`));
  const watcher = await chromium.connect(server.wsEndpoint(), { timeout: 30000 });
  watcher.once('disconnected', () => lost('connexion témoin coupée'));
  Object.assign(shared, { gen, server, watcher, ws: server.wsEndpoint() });
  console.log(`Navigateur partagé : Chromium pid ${proc.pid}, génération ${gen} (KR_SHARED_BROWSER=0 : un navigateur par fragment).`);
}
function killShared() {
  try { shared.server && shared.server.process() && shared.server.process().kill('SIGKILL'); } catch (_e) { /* déjà mort */ }
}
/** Signal à tout le groupe d'un fragment (lancé detached) ; repli sur le seul processus. */
function killGroup(child, signal) {
  try { process.kill(-child.pid, signal); } catch (_e) { try { child.kill(signal); } catch (_e2) { /* déjà mort */ } }
}
async function stopShared() {
  if (!shared.server) { return; }
  shared.closing = true;
  await Promise.race([(async () => {
    await shared.watcher.close().catch(() => {});
    await shared.server.close().catch(() => {});
  })(), new Promise(r => setTimeout(r, 5000))]);
  killShared(); // filet : un serveur qui n'a pas fermé en 5 s est tué
}
function onSharedLost(gen, why) {
  if (shared.closing || gen !== shared.gen || shared.lost.has(gen)) { return; }
  shared.lost.set(gen, why);
  killShared();
  if (shared.lost.size > 1) {
    shared.fatal = `navigateur partagé perdu une seconde fois (génération ${gen} : ${why}) après une relance : arrêt, fragments en cours et restants NON joués`;
    console.log(`\nÉCHEC : ${shared.fatal}. Relancer test:all ; diagnostic : KR_SHARED_BROWSER=0.`);
    shared.onLost(null);
    return;
  }
  console.log(`\nNavigateur partagé perdu (génération ${gen} : ${why}) : fragments en cours arrêtés, relance unique, puis rejeu de ces fragments.`);
  shared.onLost(gen);
  shared.relaunching = startShared().then(() => { shared.relaunching = null; shared.resume(); }, e => {
    shared.relaunching = null;
    shared.fatal = `relance du navigateur partagé impossible : ${e.message.split('\n')[0]}`;
    console.log(`\nÉCHEC : ${shared.fatal}. Diagnostic : KR_SHARED_BROWSER=0.`);
    shared.resume();
  });
}

async function runAll(units, concurrency, logDir) {
  const results = [];
  const queue = orderLongestFirst(units.filter(u => !u.skip), readDurations());
  const replay = []; // fragments touchés par une perte du navigateur partagé : rejoués en tête
  const live = new Set();
  let next = 0;
  // Sortie non nulle sans contrôle en échec (exception, délai dépassé) : signalée, sinon le fragment se lit « FAIL (…, 0 FAIL) » sans cause.
  const report = r => process.stdout.write(`  ${r.code === 0 && !r.fail ? 'ok  ' : 'FAIL'} ${r.id} (${(r.ms / 1000).toFixed(0)} s, ${r.ok} ok, ${r.fail} FAIL${typeof r.code === 'number' && r.code !== 0 && !r.fail ? `, interrompu : sortie ${r.code}` : ''})\n`);
  await new Promise(done => {
    const launch = u => {
      const entry = { unit: u, gen: shared.on ? shared.gen : 0, child: null };
      live.add(entry);
      runUnit(u, logDir, shared.on ? { KR_BROWSER_WS: shared.ws } : {}, c => { entry.child = c; }).then(async r => {
        // Un échec peut arriver juste avant que la perte du navigateur soit vue (la connexion du fragment tombe en même temps) : on laisse
        // à la surveillance le temps de conclure avant de trancher. Un vert, lui, a joué toutes ses vérifications : il est gardé.
        if (shared.on && (r.code !== 0 || r.fail) && !shared.lost.has(entry.gen)) { await new Promise(res => setTimeout(res, 1500)); }
        live.delete(entry);
        const touched = shared.on && shared.lost.has(entry.gen) && (r.code !== 0 || r.fail);
        if (touched && !shared.fatal) {
          const kept = r.logFile.replace(/\.log$/, `.perdu-g${entry.gen}.log`);
          fs.renameSync(r.logFile, kept);
          shared.replayed += 1;
          process.stdout.write(`  REJEU ${r.id} : navigateur partagé perdu pendant le fragment (premier journal : ${kept})\n`);
          replay.push(u);
        } else {
          if (touched) { r.lostBrowser = true; }
          results.push(r); report(r);
        }
        pump();
      });
    };
    const pump = () => {
      if (shared.fatal) { if (!live.size) { done(); } return; }
      if (shared.relaunching) { return; } // reprise par shared.resume() une fois le navigateur relancé
      while (live.size < concurrency && (replay.length || next < queue.length)) { launch(replay.length ? replay.shift() : queue[next++]); }
      if (!live.size && next >= queue.length) { done(); }
    };
    // gen = null : perte fatale, tout s'arrête ; sinon seuls les fragments de la génération perdue.
    shared.onLost = gen => { for (const e of live) { if ((gen === null || e.gen === gen) && e.child) { killGroup(e.child, 'SIGTERM'); } } };
    shared.live = live;
    shared.resume = pump;
    pump();
  });
  // Perte fatale : les fragments jamais joués sont des ÉCHECS (jamais un faux vert par omission).
  const notRun = shared.fatal ? [...replay, ...queue.slice(next)] : [];
  shared.notRun = notRun.length;
  for (const u of notRun) { results.push({ ...u, code: 'non lancé', ok: 0, fail: 0, ms: 0, logFile: '(non lancé : navigateur partagé perdu)' }); }
  for (const u of units.filter(x => x.skip)) { results.push({ ...u, code: null, ok: 0, fail: 0, ms: 0, skipped: true }); }
  return results;
}

// `extra` : échecs hors suites e2e (test du routeur, tests unitaires) ; ils entrent dans l'unique ligne RÉSULTAT, pas dans `bad` (e2e seul).
function summarize(results, wallMs, logDir, extra = []) {
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
  const failedUnits = results.filter(x => !x.skipped && (x.code !== 0 || x.fail > 0));
  for (const r of failedUnits) { lines.push(`  -> journal en échec${typeof r.code === 'number' && r.code !== 0 && !r.fail ? ` (interrompu : sortie ${r.code})` : ''} : ${r.logFile}`); }
  const stopped = failedUnits.filter(r => typeof r.code === 'number' && r.code !== 0 && !r.fail).length;
  lines.push(`Total : ${totalOk} ok, ${totalFail} FAIL${stopped ? `, ${stopped} fragment(s) interrompu(s)` : ''} en ${(wallMs / 1000).toFixed(0)} s (concurrence ${results.concurrency}). Journaux : ${logDir}`);
  const causes = [...(bad ? ['suites e2e'] : []), ...extra];
  lines.push(causes.length ? `RÉSULTAT : ÉCHEC${extra.length ? ` (${causes.join(', ')})` : ''}` : 'RÉSULTAT : VERT');
  return { text: lines.join('\n'), bad, totalOk, totalFail };
}

const args = process.argv.slice(2);
const cmd = args.shift() || 'all';
const requested = process.env.KR_CONCURRENCY;
const defaultConcurrency = cpus => Math.max(1, Math.min(16, cpus - 2)); // CONCURRENCE PAR DÉFAUT, voir l'en-tête
const concurrency = requested === undefined ? defaultConcurrency(os.cpus().length) : Number(requested);
if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 32) { console.error('KR_CONCURRENCY doit être un entier entre 1 et 32.'); process.exit(2); }

if (cmd === 'list') {
  console.log('Zones : ' + ZONES.join(', '));
  for (const s of SUITES) { console.log(`  ${s.name.padEnd(24)} zones: ${s.zones.join(',')}${s.frags ? `  fragments: ${s.frags.map(f => f.join('+')).join(' | ')}` : ''}`); }
  process.exit(0);
}

let zones = ZONES;
let changed = null;
let routerBad = false;
let unitBad = false;
let expectRed = false;
if (cmd === 'all') {
  unitBad = runUnitTests();
} else if (cmd === 'zone' || cmd === 'red') {
  zones = args.filter(a => !a.startsWith('--'));
  expectRed = cmd === 'red';
  const unknown = zones.filter(z => !ZONES.includes(z));
  if (!zones.length || unknown.length) { console.error(`Zone attendue parmi : ${ZONES.join(', ')}${unknown.length ? ` (inconnue : ${unknown.join(', ')})` : ''}`); process.exit(2); }
} else if (cmd === 'changed') {
  const i = args.indexOf('--base');
  changed = zonesFromDiff(i >= 0 ? args[i + 1] : null);
  const r = changed;
  zones = r.zones;
  console.log('Fichiers modifiés : ' + (r.files && r.files.length ? r.files.join(', ') : '(aucun)'));
  r.reasons.forEach(x => console.log('  - ' + x));
  if (r.routerTest) {
    // Routeur ou registre modifié : son test (sans navigateur, < 1 s) passe avant tout fragment.
    const t = spawnSync(process.execPath, [path.join(root, E2E, 'lib/router.test.mjs')], { cwd: root, encoding: 'utf8' });
    routerBad = t.status !== 0;
    console.log(`Test du routeur : ${routerBad ? 'ÉCHEC' : 'ok'}${routerBad ? '\n' + t.stdout + t.stderr : ''}`);
  }
  if (r.unitTest) { unitBad = runUnitTests(); }
  if (r.widened) { console.log('INCERTITUDE : élargi au total (toutes les zones).'); } else if (!zones.length && !r.units.length) {
    console.log('Aucune zone testable touchée : rien à lancer' + (r.routerTest || r.unitTest ? ' (hors tests du routeur ou unitaires).' : '.'));
    process.exit(routerBad || unitBad ? 1 : 0);
  } else { console.log('Zones choisies : ' + (zones.join(', ') || '(aucune)') + (r.units.length ? ' ; unités : ' + r.units.join(', ') : '')); }
} else if (cmd !== 'all') {
  console.error('Usage : run.mjs all | zone <z...> | changed [--base REF] | red <zone> | list'); process.exit(2);
}

const logDir = process.env.KR_LOGDIR || fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'kraland-e2e-'));
if (path.resolve(logDir).startsWith(root + path.sep)) { console.error('KR_LOGDIR ne doit pas être dans le dépôt : ' + logDir); process.exit(2); }
fs.mkdirSync(logDir, { recursive: true });
const units = changed && !changed.widened ? pickUnits(buildUnits(ZONES, process.env), changed) : buildUnits(zones, process.env);
if (units.some(u => u.missingBootstrap)) { console.error('Fichiers Bootstrap 3.3.7 et jQuery introuvables ou incomplets dans ' + (process.env.KR_BOOTSTRAP_DIR || DEFAULT_BOOTSTRAP_DIR) + ' (attendus : bootstrap.min.css, bootstrap.min.js, jquery.min.js ; défaut tests/e2e/vendor, surcharge KR_BOOTSTRAP_DIR). Aucun fragment ignoré silencieusement.'); process.exit(2); }
const unmeasured = units.filter(u => !Number.isFinite(readDurations()[u.id])).map(u => u.id);
console.log(`${units.length} fragment(s), concurrence ${concurrency}, plus longs d'abord (${path.relative(root, DURATIONS_FILE)})${unmeasured.length ? ` ; sans durée mesurée, lancés en tête : ${unmeasured.join(', ')}` : ''}, journaux dans ${logDir}`);
const t0 = Date.now();
// Navigateur partagé : lancé ici seulement (après les vérifications qui peuvent sortir), fermé sur TOUS les chemins de sortie.
let stopping = false;
async function shutdown(code, why) {
  if (stopping) { return; }
  stopping = true;
  if (why) { console.error(`\n${why} : arrêt des fragments en cours et du navigateur partagé.`); }
  shared.fatal = shared.fatal || (why || 'arrêt'); // plus aucun fragment lancé
  shared.onLost(null);
  // Laisse aux fragments le temps de fermer leurs propres navigateurs (gestionnaire SIGTERM de Playwright) avant le SIGKILL du filet.
  const alive = () => [...(shared.live || [])].filter(e => e.child && e.child.exitCode === null && e.child.signalCode === null);
  for (let i = 0; i < 50 && alive().length; i++) { await new Promise(r => setTimeout(r, 100)); }
  await stopShared();
  process.exit(code);
}
process.on('exit', () => { // dernier filet, synchrone : fragments encore vivants (et leurs sous-processus), puis navigateur partagé
  shared.closing = true;
  for (const e of shared.live || []) { if (e.child) { killGroup(e.child, 'SIGKILL'); } }
  killShared();
});
for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) { process.on(sig, () => { shutdown(code, `Signal ${sig}`); }); }
process.on('uncaughtException', e => { console.error(e); shutdown(2, 'Erreur du lanceur'); });
process.on('unhandledRejection', e => { console.error(e); shutdown(2, 'Erreur du lanceur'); });
if (!sharedDisabled() && units.some(u => !u.skip)) {
  shared.on = true;
  try { await startShared(); } catch (e) {
    console.error(`Navigateur partagé : lancement impossible (${e.message.split('\n')[0]}). Rien n'est joué ; diagnostic : KR_SHARED_BROWSER=0.`);
    await shutdown(2);
  }
} else if (sharedDisabled()) { console.log('Navigateur partagé désactivé (KR_SHARED_BROWSER=0) : un Chromium par fragment.'); }
const results = await runAll(units, concurrency, logDir);
results.concurrency = concurrency;
shared.closing = true;
await stopShared();
const sharedCauses = shared.fatal ? ['navigateur partagé perdu'] : [];
if (shared.lost.size) {
  console.log(`\nNavigateur partagé : ${shared.lost.size} perte(s) [${[...shared.lost].map(([g, w]) => `génération ${g} : ${w}`).join(' ; ')}], ${shared.replayed} fragment(s) rejoué(s)${shared.fatal ? ` ; ${shared.fatal} ; ${shared.notRun} fragment(s) non lancé(s), comptés en ÉCHEC` : ', tous rejoués sur le navigateur relancé'}.`);
}
const sum = summarize(results, Date.now() - t0, logDir, [...(routerBad ? ['test du routeur'] : []), ...(unitBad ? ['tests unitaires du cœur pur'] : []), ...sharedCauses]);
console.log(sum.text);
if (process.env.KR_SAVE_DURATIONS === '1' && !expectRed) {
  if (sum.bad || shared.fatal) { console.log('Durées NON enregistrées : exécution en échec.'); } else { saveDurations(results); console.log('Durées enregistrées dans ' + path.relative(root, DURATIONS_FILE) + ' (à committer).'); }
}
if (expectRed) {
  if (shared.fatal) { console.log('PREUVE NON CONCLUANTE : le navigateur partagé est tombé, l\'échec ne vient pas forcément du défaut. Relancer.'); process.exit(2); }
  if (sum.bad) { console.log('ROUGE confirmé : la zone échoue comme attendu (preuve rouge OK).'); process.exit(0); }
  console.log('PAS ROUGE : la zone passe, le test ne prouve rien avant le correctif.'); process.exit(1);
}
process.exit(sum.bad || routerBad || unitBad || shared.fatal ? 1 : 0);
