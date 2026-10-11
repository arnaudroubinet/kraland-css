// Lanceur des suites e2e : parallèle, ciblé par zone, sans dépendance (Node + playwright déjà présent).
//
//   node tests/e2e/run.mjs all                  le total, en parallèle (à lancer UNE fois en fin de travail)
//   node tests/e2e/run.mjs zone forum croix     seulement les zones citées (npm run test:zone -- forum croix)
//   node tests/e2e/run.mjs changed [--base REF] zones déduites de git diff (npm run test:changed) ; doute = total
//   node tests/e2e/run.mjs red forum            preuve ROUGE ciblée : réussit seulement si la zone ÉCHOUE (npm run test:red -- forum)
//   node tests/e2e/run.mjs list                 zones, suites et fragments
//
// Variables : KR_CONCURRENCY (défaut min(8, CPU/2)), KR_LOGDIR (défaut $TMPDIR/kraland-e2e/<horodatage>, jamais dans le dépôt),
//             KR_SCRIPT (bundle testé), KR_BOOTSTRAP_DIR (vrai Bootstrap 3.3.7 + jQuery : sans lui les fragments « real » sont signalés SKIP).
// Chaque fragment a son journal, son dossier de captures (KR_SHOTS) et son TMPDIR : aucune ressource partagée, aucun port fixe.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const E2E = 'tests/e2e';

// Registre : une suite = un fichier ; fragments = exécutions indépendantes (KR_FRAG) dont la somme rejoue la suite entière.
// Les fragments les plus longs sont lancés en premier (ordre de la liste).
const FORUM_FRAGS = [
  ['seuil-real-sombre'], ['seuil-real-clair'], ['seuil-fake-sombre'], ['seuil-fake-clair'],
  ['m2-real'], ['m2-fake'], ['s3-real'], ['s3-fake'], ['s3d-real'],
  ['m1-sombre'], ['m1-clair'], ['f01'], ['signature'], ['n1'], ['pied', 'desktop', 's3d-fake']
];
const SUITES = [
  { name: 'forum-mobile', file: 'forum-mobile.mjs', zones: ['forum'], frags: FORUM_FRAGS, needsBootstrap: true },
  { name: 'demarrage-mobile', file: 'demarrage-mobile.mjs', zones: ['demarrage'],
    frags: [['moment-start'], ['moment-dcl'], ['moment-load'], ['moment-later'], ['desktop', 'pire-cas', 'm1', 'm-1', 's1']] },
  { name: 'breakpoint-switch', file: 'breakpoint-switch.mjs', zones: ['transitions', 'plateau'], frags: [['nav-large'], ['nav-origine'], ['widths']] },
  { name: 'croix-directionnelle', file: 'croix-directionnelle.mjs', zones: ['croix', 'plateau'],
    frags: [['etats'], ['clics'], ['m1'], ['themes'], ['transitions'], ['impossibles', 'ordre', 'natif']] },
  { name: 'plateau-profil-mobile', file: 'plateau-profil-mobile.mjs', zones: ['profil', 'plateau'] },
  { name: 'plateau-qualite-usage', file: 'plateau-qualite-usage.mjs', zones: ['plateau'] },
  { name: 'map-exclusions', file: 'map-exclusions.mjs', zones: ['images'] },
  { name: 'image-fallback', file: 'image-fallback.mjs', zones: ['images'] },
  { name: 'audit-map-images', file: 'audit-map-images.mjs', zones: ['images'] }
];
const ZONES = [...new Set(SUITES.flatMap(s => s.zones))];

// Zones touchées d'après un fichier ; null = inconnu (on élargit au total).
const FILE_RULES = [
  [/^tests\/e2e\/run\.mjs$|^package\.json$|^tests\/e2e\/lib\//, 'all'],
  [/^tests\/e2e\/([\w-]+)\.mjs$/, m => SUITES.filter(s => s.file === m[1] + '.mjs').flatMap(s => s.zones)],
  [/^tests\/e2e\/fixtures\/plateau-/, ['plateau']],
  [/^tests\/e2e\/fixtures\/map-inventory/, ['images']],
  [/^(README\.md|CLAUDE\.md|REPORT\.md|docs\/|\.claude\/|changelog\.json|version\.json|screenshots\/|start-server\.|\.serena\/|\.github\/)/, []],
  [/^(kraland-userscript-main\.user\.js|kraland-userscript\.user\.js|kraland-userscript-dev\.user\.js)$/, []] // fichiers générés : la source fait foi
];
// Mots-clés d'un hunk (CSS/JS) -> zone. Un hunk sans mot-clé reconnu élargit au total.
const KEYWORDS = [
  [/forum|kramail|bbcode|smiley|signature|repondre|répondre|nouveau-sujet|btn-toolbar|forum-thread/i, 'forum'],
  [/medieval|map-image|carte|MEDIEVAL_MAP|image-fallback|fallback/i, 'images'],
  [/croix|dpad|directionnel|d-pad/i, 'croix'],
  [/mini-profil|mobile-mini-profile|jauge|profil/i, 'profil'],
  [/breakpoint|resize|reload|RELOAD_|sessionStorage|isMobileDevice|mobile-mode/i, 'demarrage']
];

function gitLines(args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n'); } catch (_e) { return null; }
}

function zonesFromDiff(baseRef) {
  const reasons = [];
  let files = [];
  let diffArgs;
  if (baseRef) { files = gitLines(['diff', '--name-only', baseRef]); diffArgs = [baseRef]; } else {
    const work = gitLines(['diff', '--name-only', 'HEAD']);
    const untracked = gitLines(['ls-files', '--others', '--exclude-standard']);
    files = work === null ? null : [...work, ...(untracked || [])];
    diffArgs = ['HEAD'];
    if (files && files.filter(Boolean).length === 0) {
      const mb = ['origin/feature/next', 'origin/main'].map(r => gitLines(['merge-base', 'HEAD', r])).find(l => l && l[0]);
      if (mb) { diffArgs = [mb[0].trim()]; files = gitLines(['diff', '--name-only', diffArgs[0]]); reasons.push('arbre propre : comparaison avec ' + diffArgs[0].slice(0, 9)); }
    }
  }
  if (files === null) { return { zones: ZONES, reasons: ['git indisponible : total par prudence'], widened: true }; }
  files = [...new Set(files.filter(Boolean))];
  const zones = new Set();
  let widened = false;
  const widen = why => { widened = true; reasons.push(why); };
  for (const f of files) {
    if (f === 'kraland-theme.css' || f === 'kraland-userscript-template.js') {
      const diff = gitLines(['diff', '-U0', ...diffArgs, '--', f]);
      const hunks = []; let cur = null;
      for (const l of diff || []) {
        if (l.startsWith('@@')) { cur = { head: l, body: '' }; hunks.push(cur); } else if (cur && /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l)) { cur.body += l + '\n'; }
      }
      if (!hunks.length) { widen(f + ' : diff illisible'); continue; }
      for (const h of hunks) {
        const hit = KEYWORDS.filter(([re]) => re.test(h.head + '\n' + h.body)).map(k => k[1]);
        if (!hit.length) { widen(`${f} ${h.head.split('@@')[1].trim()} : aucune zone reconnue`); } else { hit.forEach(z => zones.add(z)); }
      }
      continue;
    }
    const rule = FILE_RULES.find(([re]) => re.test(f));
    if (!rule) { widen(f + ' : fichier inconnu'); continue; }
    const m = f.match(rule[0]);
    const z = typeof rule[1] === 'function' ? rule[1](m) : rule[1];
    if (z === 'all') { widen(f + ' : touche le lanceur ou la configuration'); } else { z.forEach(x => zones.add(x)); }
  }
  if (widened) { return { zones: ZONES, reasons, widened: true, files }; }
  return { zones: [...zones], reasons, widened: false, files };
}

function buildUnits(zones, env) {
  const units = [];
  for (const s of SUITES.filter(x => x.zones.some(z => zones.includes(z)))) {
    if (!s.frags) { units.push({ suite: s.name, id: s.name, file: s.file, env: {} }); continue; }
    for (const frag of s.frags) {
      const real = frag.some(f => /(^|-)real($|-)/.test(f));
      const unit = { suite: s.name, id: `${s.name}#${frag.join('+')}`, file: s.file, env: { KR_FRAG: frag.join(',') } };
      if (real && (!env.KR_BOOTSTRAP_DIR || !['bootstrap.min.css', 'bootstrap.min.js', 'jquery.min.js'].every(f => fs.existsSync(path.join(env.KR_BOOTSTRAP_DIR, f))))) { unit.missingBootstrap = true; }
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
  const queue = units.filter(u => !u.skip);
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
if (units.some(u => u.missingBootstrap)) { console.error('KR_BOOTSTRAP_DIR doit contenir les fichiers Bootstrap 3.3.7 et jQuery pour les tests forum avec vraie cascade. Aucun fragment ignoré silencieusement.'); process.exit(2); }
console.log(`${units.length} fragment(s), concurrence ${concurrency}, journaux dans ${logDir}`);
const t0 = Date.now();
const results = await runAll(units, concurrency, logDir);
results.concurrency = concurrency;
const sum = summarize(results, Date.now() - t0, logDir);
console.log(sum.text);
if (expectRed) {
  if (sum.bad) { console.log('ROUGE confirmé : la zone échoue comme attendu (preuve rouge OK).'); process.exit(0); }
  console.log('PAS ROUGE : la zone passe, le test ne prouve rien avant le correctif.'); process.exit(1);
}
process.exit(sum.bad ? 1 : 0);
