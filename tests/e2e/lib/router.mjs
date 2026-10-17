// Registre des suites e2e et routage des zones d'après git diff (utilisé par run.mjs, testé par router.test.mjs).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

// Registre : une suite = un fichier ; fragments = exécutions indépendantes (KR_FRAG) dont la somme rejoue la suite entière.
// L'ordre de lancement ne dépend PAS de cette liste : run.mjs lance les plus longs d'abord d'après tests/e2e/durations.json (orderLongestFirst).
// Le routeur relit ce bloc (constantes en MAJUSCULES déclarées avant SUITES, puis SUITES jusqu'à la ligne « ]; ») dans l'ancienne et la
// nouvelle version du fichier : garder cette forme (données littérales, sans appel de fonction) pour que l'ajout d'un fragment ne lance que lui.
const FORUM_FRAGS = [
  ['seuil-real-sombre'], ['seuil-real-clair'], ['seuil-fake-sombre'], ['seuil-fake-clair'],
  ['m2-real'], ['m2-fake'], ['s3-real'], ['s3-fake'], ['s3d-real'],
  ['m1-sombre'], ['m1-clair'], ['f01'], ['signature'], ['n1'], ['pied', 'desktop', 's3d-fake']
];
export const SUITES = [
  { name: 'parler-viewport', file: 'parler-viewport.mjs', zones: ['parler'] },
  { name: 'forum-mobile', file: 'forum-mobile.mjs', zones: ['forum'], frags: FORUM_FRAGS, needsBootstrap: true },
  { name: 'demarrage-mobile', file: 'demarrage-mobile.mjs', zones: ['demarrage'],
    frags: [['moment-start'], ['moment-dcl'], ['moment-load'], ['moment-later'], ['desktop', 'pire-cas', 'm1', 'm-1', 's1']] },
  { name: 'breakpoint-switch', file: 'breakpoint-switch.mjs', zones: ['transitions', 'plateau'], frags: [['nav-large'], ['nav-origine'], ['widths']] },
  { name: 'croix-directionnelle', file: 'croix-directionnelle.mjs', zones: ['croix', 'plateau'],
    frags: [['etats'], ['clics'], ['m1'], ['themes'], ['transitions'], ['impossibles', 'ordre', 'natif']] },
  { name: 'plateau-profil-mobile', file: 'plateau-profil-mobile.mjs', zones: ['profil', 'plateau'] },
  { name: 'plateau-qualite-usage', file: 'plateau-qualite-usage.mjs', zones: ['plateau'] },
  // Menus Forum RP/HRP/Communauté/Débats/Staff : liste native à jour (fixtures inertes, route mutable). KR_CHROMIUM : navigateur local de repli.
  { name: 'menus-forums', file: 'menus-forums.mjs', zones: ['menus-forums'], frags: [['a'], ['b'], ['c'], ['d'], ['e'], ['f'], ['g'], ['h'], ['i'], ['j'], ['k'], ['l'], ['m'], ['n'], ['o'], ['p'], ['q'], ['r'], ['s']] },
  { name: 'map-exclusions', file: 'map-exclusions.mjs', zones: ['images'] },
  { name: 'image-fallback', file: 'image-fallback.mjs', zones: ['images'] },
  { name: 'audit-map-images', file: 'audit-map-images.mjs', zones: ['images'] },
  // Sous-forum « Débuter » (refonte variante A) : fixture du DOM réel, DataTables émulé. Fragments = lots du rapport UX (L0 à L6).
  { name: 'sous-forum', file: 'sous-forum.mjs', zones: ['sous-forum'], frags: [['l1-themes'], ['l1-redraw'], ['l2-themes'], ['l3-themes'], ['l4-themes'], ['l5-themes'], ['l3-liste'], ['l4-perm'], ['l5-pagination-socle'], ['l5-pagination-m2-mobile'], ['l5-pagination-m2-bureau'], ['l5-pagination-viewport'], ['l6-desktop'], ['l6-themes'], ['l0'], ['l1-statuts'], ['l2-entete']] },
  // Messages du forum v3 (lecture, rédaction, édition ; mobile) : fixtures du DOM réel, vrai Bootstrap. Fragments = vues du rapport.
  { name: 'messages-v3', file: 'messages-v3.mjs', zones: ['messages'], frags: [['lecture-sombre'], ['lecture-clair'], ['redaction-sombre'], ['redaction-clair'], ['edition'], ['seuils'], ['transitions'], ['bureau'], ['themes'], ['confinement']], needsBootstrap: true },
  // Kramail rédaction (barre d'outils fidèle, champ Destinataires) : fixtures anonymisées du DOM réel, autres pages Kramail comparées au bundle de feature/next.
  { name: 'kramail-redaction', file: 'kramail-redaction.mjs', zones: ['kramail'], frags: [['regression'], ['themes'], ['reponses-repondre'], ['reponses-tous'], ['reponses-transferer'], ['dest-1280'], ['dest-375'], ['dest-320'], ['barre'], ['blocage-1280'], ['blocage-375'], ['blocage-320'], ['clavier', 'reseau', 'envoi', 'repli', 'libelle', 'indicatif']] },
  // Garde du confinement réseau : refus effectif d'une sonde hors local (lib/confinement.mjs) et chaque contexte de suite confiné (lecture statique).
  { name: 'confinement-reseau', file: 'confinement-reseau.mjs', zones: ['confinement'] }
];
export const ZONES = [...new Set(SUITES.flatMap(s => s.zones))];
const GARDE_CONFINEMENT = 'confinement-reseau'; // relancée dès qu'un fichier de suite change (nouveau contexte non confiné ?)

// Ordre de lancement : plus longs d'abord (ordonnancement LPT), d'après les durées mesurées (secondes par id d'unité, tests/e2e/durations.json).
// Une unité sans durée connue (fragment nouveau ou renommé) passe EN TÊTE : on ne sait pas si elle est longue, et la lancer tôt évite qu'elle
// allonge la fin de la suite. À durée égale ou inconnue, l'ordre du registre est conservé (tri stable).
export function orderLongestFirst(units, durations = {}) {
  const known = u => Number.isFinite(durations[u.id]);
  return units.map((u, i) => ({ u, i })).sort((a, b) => {
    if (known(a.u) !== known(b.u)) { return known(a.u) ? 1 : -1; }
    if (known(a.u) && durations[b.u.id] !== durations[a.u.id]) { return durations[b.u.id] - durations[a.u.id]; }
    return a.i - b.i;
  }).map(x => x.u);
}

// Zones touchées d'après un fichier. Valeurs spéciales : 'all' (total), 'generated' (bundle : la source fait foi), 'lint' (outillage :
// lint seul, aucune suite), 'registry' (router.mjs : diff du registre), 'router-test' (test du routeur seul), 'package' (package.json :
// clés comparées), 'suite' (fichier de suite : cette suite et celles qui l'importent).
export const FILE_RULES = [
  [/^tests\/e2e\/run\.mjs$|^package-lock\.json$/, 'all'],
  [/^tests\/e2e\/lib\/router\.mjs$/, 'registry'],
  [/^tests\/e2e\/lib\/router\.test\.mjs$/, 'router-test'],
  [/^package\.json$/, 'package'],
  [/^tests\/e2e\/lib\//, 'all'],
  [/^tests\/e2e\/[\w-]+\.mjs$/, 'suite'],
  [/^tests\/e2e\/fixtures\/plateau-/, ['plateau']],
  [/^tests\/e2e\/fixtures\/parler\//, ['parler']],
  [/^tests\/e2e\/vendor\/parler\//, ['parler']],
  [/^tests\/e2e\/fixtures\/sous-forum-/, ['sous-forum']],
  [/^tests\/e2e\/fixtures\/map-inventory/, ['images']],
  [/^tests\/e2e\/fixtures\/kramail-/, ['kramail']],
  [/^tests\/e2e\/fixtures\//, 'fixture'], // autre fixture : les suites qui citent son nom de fichier (aucune -> total)
  [/^tests\/e2e\/durations\.json$/, []], // durées mesurées : changent l'ordre de lancement, jamais le résultat d'une vérification
  [/^(README\.md|CLAUDE\.md|AGENTS\.md|REPORT\.md|docs\/|\.claude\/|changelog\.json|version\.json|screenshots\/|start-server\.|\.serena\/|\.github\/)/, []],
  // Outillage : aucun effet sur le bundle ni sur les suites (configuration du lint, attributs git, agents, ancien script de migration non testé).
  [/^(\.gitattributes|\.gitignore|\.hermes\/|_bmad\/|_bmad-output\/|eslint\.config\.js|\.stylelintignore|\.stylelintrc\.json|\.mcp\.json|skills-lock\.json|validate\.js|kraland-userscript-main\.js)$|^(\.hermes|_bmad|_bmad-output)\//, 'lint'],
  [/^(kraland-userscript-main\.user\.js|kraland-userscript\.user\.js|kraland-userscript-dev\.user\.js)$/, 'generated'] // fichiers générés : la source fait foi, sinon total
];
// package.json : clés sans effet sur l'exécution des suites (rien à lancer si seules elles changent). Toute autre clé (scripts, dépendances,
// type...) élargit au total.
const PACKAGE_INERT_KEYS = ['name', 'version', 'description', 'author', 'license', 'keywords', 'repository', 'homepage', 'bugs', 'private', 'contributors'];

// Zones dont une suite vérifie la bascule mobile/desktop (breakpoint-switch) : tout mot-clé de bascule les vise TOUTES, en plus du démarrage.
const BASCULE_ZONES = ['demarrage', ...SUITES.filter(s => s.file === 'breakpoint-switch.mjs').flatMap(s => s.zones)];
// Mots-clés d'un hunk (CSS/JS) -> zone. Un hunk sans mot-clé reconnu (ni dans son module englobant, voir SECTIONS) élargit au total.
export const KEYWORDS = [
  [/kr-order-viewport|kr-order-visible|trackOrderModalViewport|visualViewport/i, ['parler']],
  [/forums-added|updateForum|kr-forums-|menus-forums/i, ['menus-forums']],
  [/kr-msg|kr-tool|kr-sender|messages-v3|forum-msg|media-list/i, ['messages']],
  [/(?<!sous-|sub)forum|kramail|bbcode|smiley|signature|repondre|répondre|nouveau-sujet|btn-toolbar|forum-thread/i, ['forum']],
  [/kramail|post_msg|\.kd-|kd-natif|btn-toolbar|Destinataires/i, ['kramail']],
  [/sous-forum|#topics|dataTable|kr-topic|kr-subforum|forums-cards|forum-card|permanent-topic|forum-mobile-breadcrumb|forum-new-topic|forum-thread-action-new/i, ['sous-forum']],
  [/medieval|map-image|carte|MEDIEVAL_MAP|image-fallback|fallback/i, ['images']],
  [/croix|dpad|directionnel|d-pad/i, ['croix']],
  [/mini-profil|mobile-mini-profile|profil/i, ['profil']],
  [/jauge/i, ['profil', 'plateau']], // SKILL : jauges -> plateau ; le mini-profil les affiche aussi
  [/breakpoint|resize|reload|RELOAD_|sessionStorage|isMobileDevice|mobile-mode/i, BASCULE_ZONES]
];
// Modules du template (titre de section de premier niveau : « // ====… » puis « // TITRE ») -> zones des suites qui les vérifient.
// Un hunk du template est rattaché au module qui l'englobe : ses zones s'AJOUTENT à celles des mots-clés du hunk. Un module absent de
// cette table est transverse (utilitaires, thème, transformations DOM, en-tête...) : un hunk sans mot-clé y élargit au total.
export const SECTIONS = [
  [/^MENUS FORUM DYNAMIQUES/, ['menus-forums']],
  [/^(FORUM TOPICS|SOUS-FORUM|MOBILE FORUM (PERMANENT )?TOPICS)\b/, ['sous-forum']],
  [/^MODULE : ForumHeader:/, ['forum', 'sous-forum']],
  [/^MODULE : Kramail:/, ['forum', 'kramail']],
  [/^MODULE : (ForumThread|Messages):/, ['forum', 'messages']],
  [/^CX2 : CROIX DIRECTIONNELLE/, ['croix']],
  [/^TASK-1\.4 - MINI-PROFIL/, ['profil']]
];
// Repère de classe ou d'id cité par une suite : le hunk qui le touche lance aussi les suites qui le citent (au plus MAX_CITING suites :
// au-delà, le repère est transverse, ex. mobile-mode, et les mots-clés en décident). S'ajoute aux zones, ne remplace jamais l'élargissement.
const MAX_CITING = 3;
const TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g;

function gitLines(args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).split('\n'); } catch (_e) { return null; }
}
function readWorktree(f) {
  try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch (_e) { return null; }
}

// Bloc du registre d'un texte de router.mjs : { suites, rest } (rest = le fichier sans le bloc), ou null si illisible.
export function registryOf(text) {
  if (typeof text !== 'string') { return null; }
  const lines = text.split('\n');
  const start = lines.findIndex(l => /^export const SUITES = \[/.test(l));
  if (start < 0) { return null; }
  const end = lines.findIndex((l, i) => i > start && /^\];\s*$/.test(l));
  if (end < 0) { return null; }
  const taken = new Set();
  const decls = [];
  for (let i = 0; i < start; i++) {
    if (!/^const [A-Z][A-Z0-9_]* = \[/.test(lines[i])) { continue; }
    let j = i;
    while (j < start && !/\];\s*$/.test(lines[j])) { j += 1; }
    for (let k = i; k <= j; k++) { taken.add(k); }
    decls.push(lines.slice(i, j + 1).join('\n'));
    i = j;
  }
  for (let k = start; k <= end; k++) { taken.add(k); }
  const code = decls.join('\n') + '\n' + lines.slice(start, end + 1).join('\n').replace(/^export /, '') + '\nSUITES;';
  try {
    const suites = JSON.parse(JSON.stringify(vm.runInNewContext(code, Object.create(null), { timeout: 1000 })));
    if (!Array.isArray(suites) || !suites.every(s => s && typeof s.name === 'string')) { return null; }
    return { suites, rest: lines.filter((_l, k) => !taken.has(k)).join('\n') };
  } catch (_e) { return null; }
}

// Unités à lancer pour un diff de registre : suite ajoutée ou dont les propriétés changent -> la suite ; fragment ajouté ou redécoupé -> ce
// fragment seul ; suite ou fragment retiré -> rien (plus rien à lancer).
export function registryUnits(before, after) {
  const units = []; const reasons = [];
  const old = new Map(before.map(s => [s.name, s]));
  const props = s => JSON.stringify(Object.keys(s).filter(k => k !== 'frags').sort().map(k => [k, s[k]]));
  for (const s of after) {
    const p = old.get(s.name);
    if (!p) { units.push(s.name); reasons.push(`registre : suite ajoutée ${s.name}`); continue; }
    if (props(p) !== props(s) || !p.frags !== !s.frags) { units.push(s.name); reasons.push(`registre : suite ${s.name} modifiée`); continue; }
    if (!s.frags) { continue; }
    const had = new Set(p.frags.map(f => f.join('+')));
    for (const f of s.frags.filter(x => !had.has(x.join('+')))) { units.push(`${s.name}#${f.join('+')}`); reasons.push(`registre : fragment ajouté ${s.name}#${f.join('+')}`); }
  }
  for (const p of before.filter(x => !after.some(s => s.name === x.name))) { reasons.push(`registre : suite retirée ${p.name} (rien à lancer)`); }
  return { units, reasons };
}

// Sections de premier niveau du template : [{ line (1-based), title }]. Un en-tête est une boîte « // ====… », une ou plusieurs lignes de
// commentaire (la première est le titre), « // ====… » ; la ligne de fermeture n'ouvre jamais une autre boîte.
function templateSections(text) {
  const out = [];
  const lines = (text || '').split('\n');
  const bar = l => /^ {2}\/\/ ={5,}\s*$/.test(l);
  for (let i = 0; i < lines.length; i++) {
    if (!bar(lines[i])) { continue; }
    let j = i + 1;
    while (j < lines.length && j - i <= 12 && /^ {2}\/\/ /.test(lines[j]) && !bar(lines[j])) { j += 1; }
    if (j > i + 1 && j < lines.length && bar(lines[j])) { out.push({ line: i + 2, title: lines[i + 1].replace(/^ {2}\/\/ /, '').trim() }); i = j; }
  }
  return out;
}
// Sélecteur de la règle CSS qui englobe la ligne `at` (1-based) : texte des lignes qui précèdent l'accolade ouvrante non fermée.
function cssSelectorAt(lines, at) {
  let depth = 0;
  for (let i = Math.min(at, lines.length) - 1, n = 0; i >= 0 && n < 400; i--, n++) {
    const l = lines[i].replace(/\/\*.*?\*\//g, '');
    depth += (l.match(/\}/g) || []).length - (l.match(/\{/g) || []).length;
    if (depth < 0) {
      const sel = [l.split('{')[0]];
      for (let j = i - 1; j >= 0 && j > i - 30; j--) {
        const t = lines[j].trim();
        if (!t || /[;{}]$/.test(t) || /\*\/$/.test(t)) { break; }
        sel.unshift(t);
      }
      return sel.join(' ');
    }
  }
  return '';
}

// `git` est injectable (tests du routeur : hunks de référence sans dépôt) ; `readNew` donne le contenu « après » d'un fichier (défaut : arbre
// de travail ; le rejeu d'historique passe `git show <commit>:<f>`). Résultat : zones + unités explicites (id de fragment ou nom de suite).
export function zonesFromDiff(baseRef, git = gitLines, readNew = readWorktree) {
  const reasons = [];
  let files = [];
  let diffArgs;
  if (baseRef) { files = git(['diff', '--name-only', baseRef]); diffArgs = [baseRef]; } else {
    const work = git(['diff', '--name-only', 'HEAD']);
    const untracked = git(['ls-files', '--others', '--exclude-standard']);
    files = work === null ? null : [...work, ...(untracked || [])];
    diffArgs = ['HEAD'];
    if (files && files.filter(Boolean).length === 0) {
      const mb = ['origin/feature/next', 'origin/main'].map(r => git(['merge-base', 'HEAD', r])).find(l => l && l[0]);
      if (mb) { diffArgs = [mb[0].trim()]; files = git(['diff', '--name-only', diffArgs[0]]); reasons.push('arbre propre : comparaison avec ' + diffArgs[0].slice(0, 9)); }
    }
  }
  if (files === null) { return { zones: ZONES, units: [], reasons: ['git indisponible : total par prudence'], widened: true }; }
  files = [...new Set(files.filter(Boolean))];
  const readOld = f => { const l = git(['show', `${diffArgs[0]}:${f}`]); return l === null ? null : l.join('\n'); };
  const zones = new Set();
  const units = new Set();
  let widened = false;
  let routerTest = false;
  const lint = [];
  const generated = [];
  const widen = why => { widened = true; reasons.push(why); };
  // Repères cités par chaque suite (lecture paresseuse, contenu « après »).
  let citing = null;
  const suiteTexts = () => SUITES.map(s => ({ s, text: readNew('tests/e2e/' + s.file) || '' }));
  const citedBy = () => {
    if (citing) { return citing; }
    citing = new Map();
    for (const { s, text } of suiteTexts()) { for (const t of new Set(text.match(TOKEN_RE) || [])) { if (!citing.has(t)) { citing.set(t, new Set()); } citing.get(t).add(s.name); } }
    return citing;
  };
  const addCited = text => {
    const toks = new Set();
    for (const m of text.matchAll(/[.#]([A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+)/g)) { toks.add(m[1]); }
    for (const m of text.matchAll(/['"`]([A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+)/g)) { toks.add(m[1]); }
    for (const t of toks) { const by = citedBy().get(t); if (by && by.size <= MAX_CITING) { by.forEach(n => { units.add(n); }); } }
  };
  for (const f of files) {
    if (f === 'kraland-theme.css' || f === 'kraland-userscript-template.js') {
      const diff = git(['diff', '-U0', ...diffArgs, '--', f]);
      const hunks = []; let cur = null;
      for (const l of diff || []) {
        const m = l.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
        if (m) { cur = { head: l, body: '', start: Number(m[1]), count: m[2] === undefined ? 1 : Number(m[2]) }; hunks.push(cur); } else if (cur && /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l)) { cur.body += l + '\n'; }
      }
      if (!hunks.length) { widen(f + ' : diff illisible'); continue; }
      const text = readNew(f);
      const lines = text === null ? [] : text.split('\n');
      const sections = f.endsWith('.js') ? templateSections(text) : [];
      for (const h of hunks) {
        const where = h.head.split('@@')[1].trim();
        const own = h.head + '\n' + h.body;
        const hit = new Set(KEYWORDS.filter(([re]) => re.test(own)).flatMap(k => k[1]));
        // Module englobant : sections dont la portée couvre le hunk (celle d'avant son début et celles qui s'ouvrent dedans).
        let context = '';
        if (f.endsWith('.js')) {
          const last = h.start + Math.max(h.count, 1) - 1;
          const inScope = sections.filter((s, i) => s.line <= last && (i + 1 >= sections.length || sections[i + 1].line > h.start));
          const known = inScope.map(s => SECTIONS.find(([re]) => re.test(s.title)));
          if (!hit.size && !(inScope.length && known.every(Boolean))) {
            widen(`${f} ${where} : aucune zone reconnue (module transverse : ${inScope.map(s => s.title).join(' / ') || 'en-tête'})`); continue;
          }
          known.filter(Boolean).forEach(k => k[1].forEach(z => hit.add(z)));
        } else {
          // Hunk de déclarations seules : la règle englobante dit quel composant est touché. Un mot-clé de bascule (mobile-mode...) n'y suffit
          // pas : c'est une portée, pas un composant.
          context = cssSelectorAt(lines, h.start);
          if (!hit.size) { KEYWORDS.filter(([re, z]) => z !== BASCULE_ZONES && re.test(context)).flatMap(k => k[1]).forEach(z => hit.add(z)); }
          if (!hit.size) { widen(`${f} ${where} : aucune zone reconnue (règle « ${context.slice(0, 60)} »)`); continue; }
        }
        hit.forEach(z => zones.add(z));
        addCited(own + '\n' + context);
      }
      continue;
    }
    const rule = FILE_RULES.find(([re]) => re.test(f));
    if (!rule) { widen(f + ' : fichier inconnu'); continue; }
    const z = rule[1];
    if (z === 'generated') { generated.push(f); continue; }
    if (z === 'all') { widen(f + ' : touche le lanceur ou les dépendances'); continue; }
    if (z === 'lint') { lint.push(f); continue; }
    if (z === 'router-test') { routerTest = true; continue; }
    if (z === 'registry') {
      routerTest = true;
      const before = registryOf(readOld(f)); const after = registryOf(readNew(f));
      if (!before || !after) { widen(f + ' : registre illisible'); continue; }
      const r = registryUnits(before.suites, after.suites);
      r.units.forEach(u => units.add(u)); reasons.push(...r.reasons);
      if (before.rest !== after.rest) { reasons.push(f + ' : logique du routeur modifiée -> test du routeur (aucune vérification e2e n\'en dépend)'); }
      continue;
    }
    if (z === 'package') {
      let before; let after;
      try { before = JSON.parse(readOld(f)); after = JSON.parse(readNew(f)); } catch (_e) { widen(f + ' : illisible'); continue; }
      const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
      const live = changed.filter(k => !PACKAGE_INERT_KEYS.includes(k) && k !== 'scripts');
      // Scripts : run.mjs lance les suites par `node`, sans npm. Un alias « node tests/e2e/<suite>.mjs » ajouté ou modifié lance cette suite ;
      // un script retiré ne lance rien ; tout autre script (build, lint, test:all...) élargit au total.
      if (changed.includes('scripts')) {
        const bs = before.scripts || {}; const as = after.scripts || {};
        for (const k of [...new Set([...Object.keys(bs), ...Object.keys(as)])].filter(x => bs[x] !== as[x])) {
          const m = String(as[k] ?? bs[k]).match(/^node tests\/e2e\/([\w-]+\.mjs)$/);
          const suites = m ? SUITES.filter(s => s.file === m[1]).map(s => s.name) : [];
          if (!m || (as[k] !== undefined && !suites.length)) { live.push('scripts.' + k); } else if (as[k] === undefined) { reasons.push(`${f} : alias ${k} retiré (rien à lancer)`); } else { suites.forEach(u => units.add(u)); reasons.push(`${f} : alias ${k} -> ${suites.join(', ')}`); }
        }
      }
      if (live.length) { widen(`${f} : ${live.join(', ')} modifié(s)`); } else { reasons.push(`${f} : ${changed.join(', ') || 'aucune clé'} sans effet sur les suites`); }
      continue;
    }
    if (z === 'fixture') {
      const base = path.posix.basename(f);
      const users = suiteTexts().filter(({ text }) => text.includes(base)).map(({ s }) => s.name);
      if (users.length) { users.forEach(u => units.add(u)); reasons.push(`${f} : fixture citée par ${users.join(', ')}`); } else { widen(f + ' : fixture citée par aucune suite'); }
      continue;
    }
    if (z === 'suite') {
      // Une suite ne vérifie qu'elle-même : on la lance, avec celles qui importent le fichier (map-exclusions importe audit-map-images).
      const name = f.slice('tests/e2e/'.length);
      const users = suiteTexts().filter(({ s, text }) => s.file === name || new RegExp(`(from|import\\()\\s*['"]\\./${name.replace(/\./g, '\\.')}['"]`).test(text)).map(({ s }) => s.name);
      if (!users.length) {
        if (readNew(f) === null) { reasons.push(f + ' : supprimé, aucune suite ne l\'utilise'); } else { widen(f + ' : script e2e hors registre'); }
        continue;
      }
      users.forEach(u => units.add(u));
      units.add(GARDE_CONFINEMENT);
      continue;
    }
    z.forEach(x => zones.add(x));
  }
  if (lint.length) { reasons.push('outillage, lint seul : ' + lint.join(', ')); }
  // Un diff qui ne touche QUE des fichiers générés (build, résolution de conflit) : la source ne dit rien, on ne peut pas conclure -> total.
  const isInert = f => FILE_RULES.some(([re, v]) => re.test(f) && ((Array.isArray(v) && v.length === 0) || v === 'lint'));
  if (generated.length && !files.some(f => !generated.includes(f) && !isInert(f))) { widen(generated.join(', ') + ' : seul le bundle généré a changé'); }
  if (widened) { return { zones: ZONES, units: [], reasons, widened: true, files, routerTest }; }
  return { zones: [...zones], units: [...units], reasons, widened: false, files, routerTest };
}

// Unités (de buildUnits) retenues par un résultat de zonesFromDiff : zone choisie, ou id/suite cité explicitement.
export function pickUnits(allUnits, r) {
  const zonesOf = new Map(SUITES.map(s => [s.name, s.zones]));
  return allUnits.filter(u => (zonesOf.get(u.suite) || []).some(z => r.zones.includes(z)) || r.units.includes(u.id) || r.units.includes(u.suite));
}
