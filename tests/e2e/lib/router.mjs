// Registre des suites e2e et routage des zones d'après git diff (utilisé par run.mjs, testé par router.test.mjs).
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');

// Registre : une suite = un fichier ; fragments = exécutions indépendantes (KR_FRAG) dont la somme rejoue la suite entière.
// Les fragments les plus longs sont lancés en premier (ordre de la liste).
const FORUM_FRAGS = [
  ['seuil-real-sombre'], ['seuil-real-clair'], ['seuil-fake-sombre'], ['seuil-fake-clair'],
  ['m2-real'], ['m2-fake'], ['s3-real'], ['s3-fake'], ['s3d-real'],
  ['m1-sombre'], ['m1-clair'], ['f01'], ['signature'], ['n1'], ['pied', 'desktop', 's3d-fake']
];
export const SUITES = [
  { name: 'forum-mobile', file: 'forum-mobile.mjs', zones: ['forum'], frags: FORUM_FRAGS, needsBootstrap: true },
  { name: 'demarrage-mobile', file: 'demarrage-mobile.mjs', zones: ['demarrage'],
    frags: [['moment-start'], ['moment-dcl'], ['moment-load'], ['moment-later'], ['desktop', 'pire-cas', 'm1', 'm-1', 's1']] },
  { name: 'breakpoint-switch', file: 'breakpoint-switch.mjs', zones: ['transitions', 'plateau'], frags: [['nav-large'], ['nav-origine'], ['widths']] },
  { name: 'croix-directionnelle', file: 'croix-directionnelle.mjs', zones: ['croix', 'plateau'],
    frags: [['etats'], ['clics'], ['m1'], ['themes'], ['transitions'], ['impossibles', 'ordre', 'natif']] },
  { name: 'plateau-profil-mobile', file: 'plateau-profil-mobile.mjs', zones: ['profil', 'plateau'] },
  { name: 'plateau-qualite-usage', file: 'plateau-qualite-usage.mjs', zones: ['plateau'] },
  // Menus Forum RP/HRP/Communauté/Débats/Staff : liste native à jour (fixtures inertes, route mutable). KR_CHROMIUM : navigateur local de repli.
  { name: 'menus-forums', file: 'menus-forums.mjs', zones: ['menus-forums'], frags: [['a'], ['b'], ['c'], ['d'], ['e'], ['f'], ['g'], ['h'], ['i'], ['j'], ['k'], ['l'], ['m'], ['n'], ['o']] },
  { name: 'map-exclusions', file: 'map-exclusions.mjs', zones: ['images'] },
  { name: 'image-fallback', file: 'image-fallback.mjs', zones: ['images'] },
  { name: 'audit-map-images', file: 'audit-map-images.mjs', zones: ['images'] },
  // Sous-forum « Débuter » (refonte variante A) : fixture du DOM réel, DataTables émulé. Fragments = lots du rapport UX (L0 à L6).
  { name: 'sous-forum', file: 'sous-forum.mjs', zones: ['sous-forum'], frags: [['l1-themes'], ['l1-redraw'], ['l2-themes'], ['l3-themes'], ['l4-themes'], ['l5-themes'], ['l3-liste'], ['l4-perm'], ['l5-pagination'], ['l6-desktop'], ['l6-themes'], ['l0'], ['l1-statuts'], ['l2-entete']] },
  // Messages du forum v3 (lecture, rédaction, édition ; mobile) : fixtures du DOM réel, vrai Bootstrap. Fragments = vues du rapport.
  { name: 'messages-v3', file: 'messages-v3.mjs', zones: ['messages'], frags: [['lecture-sombre'], ['lecture-clair'], ['redaction-sombre'], ['redaction-clair'], ['edition'], ['seuils'], ['transitions'], ['bureau'], ['themes'], ['confinement']], needsBootstrap: true }
];
export const ZONES = [...new Set(SUITES.flatMap(s => s.zones))];

// Zones touchées d'après un fichier ; null = inconnu (on élargit au total).
export const FILE_RULES = [
  [/^tests\/e2e\/run\.mjs$|^package\.json$|^tests\/e2e\/lib\//, 'all'],
  [/^tests\/e2e\/([\w-]+)\.mjs$/, m => SUITES.filter(s => s.file === m[1] + '.mjs').flatMap(s => s.zones)],
  [/^tests\/e2e\/fixtures\/plateau-/, ['plateau']],
  [/^tests\/e2e\/fixtures\/sous-forum-/, ['sous-forum']],
  [/^tests\/e2e\/fixtures\/map-inventory/, ['images']],
  [/^(README\.md|CLAUDE\.md|REPORT\.md|docs\/|\.claude\/|changelog\.json|version\.json|screenshots\/|start-server\.|\.serena\/|\.github\/)/, []],
  [/^(kraland-userscript-main\.user\.js|kraland-userscript\.user\.js|kraland-userscript-dev\.user\.js)$/, 'generated'] // fichiers générés : la source fait foi, sinon total
];
// Zones dont une suite vérifie la bascule mobile/desktop (breakpoint-switch) : tout mot-clé de bascule les vise TOUTES, en plus du démarrage.
const BASCULE_ZONES = ['demarrage', ...SUITES.filter(s => s.file === 'breakpoint-switch.mjs').flatMap(s => s.zones)];
// Mots-clés d'un hunk (CSS/JS) -> zone. Un hunk sans mot-clé reconnu élargit au total.
export const KEYWORDS = [
  [/forums-added|updateForum|kr-forums-|menus-forums/i, ['menus-forums']],
  [/kr-msg|kr-tool|kr-sender|messages-v3|forum-msg|media-list/i, ['messages']],
  [/(?<!sous-|sub)forum|kramail|bbcode|smiley|signature|repondre|répondre|nouveau-sujet|btn-toolbar|forum-thread/i, ['forum']],
  [/sous-forum|#topics|dataTable|kr-topic|kr-subforum|forums-cards|forum-card|permanent-topic|forum-mobile-breadcrumb|forum-new-topic/i, ['sous-forum']],
  [/medieval|map-image|carte|MEDIEVAL_MAP|image-fallback|fallback/i, ['images']],
  [/croix|dpad|directionnel|d-pad/i, ['croix']],
  [/mini-profil|mobile-mini-profile|profil/i, ['profil']],
  [/jauge/i, ['profil', 'plateau']], // SKILL : jauges -> plateau ; le mini-profil les affiche aussi
  [/breakpoint|resize|reload|RELOAD_|sessionStorage|isMobileDevice|mobile-mode/i, BASCULE_ZONES]
];

function gitLines(args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n'); } catch (_e) { return null; }
}

// `git` est injectable (tests du routeur : hunks de référence sans dépôt).
export function zonesFromDiff(baseRef, git = gitLines) {
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
  if (files === null) { return { zones: ZONES, reasons: ['git indisponible : total par prudence'], widened: true }; }
  files = [...new Set(files.filter(Boolean))];
  const zones = new Set();
  let widened = false;
  const generated = [];
  const widen = why => { widened = true; reasons.push(why); };
  for (const f of files) {
    if (f === 'kraland-theme.css' || f === 'kraland-userscript-template.js') {
      const diff = git(['diff', '-U0', ...diffArgs, '--', f]);
      const hunks = []; let cur = null;
      for (const l of diff || []) {
        if (l.startsWith('@@')) { cur = { head: l, body: '' }; hunks.push(cur); } else if (cur && /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l)) { cur.body += l + '\n'; }
      }
      if (!hunks.length) { widen(f + ' : diff illisible'); continue; }
      for (const h of hunks) {
        const hit = KEYWORDS.filter(([re]) => re.test(h.head + '\n' + h.body)).flatMap(k => k[1]);
        if (!hit.length) { widen(`${f} ${h.head.split('@@')[1].trim()} : aucune zone reconnue`); } else { hit.forEach(z => zones.add(z)); }
      }
      continue;
    }
    const rule = FILE_RULES.find(([re]) => re.test(f));
    if (!rule) { widen(f + ' : fichier inconnu'); continue; }
    const m = f.match(rule[0]);
    const z = typeof rule[1] === 'function' ? rule[1](m) : rule[1];
    if (z === 'generated') { generated.push(f); continue; }
    if (z === 'all') { widen(f + ' : touche le lanceur ou la configuration'); } else { z.forEach(x => zones.add(x)); }
  }
  // Un diff qui ne touche QUE des fichiers générés (build, résolution de conflit) : la source ne dit rien, on ne peut pas conclure -> total.
  const isDoc = f => FILE_RULES.some(([re, v]) => re.test(f) && Array.isArray(v) && v.length === 0);
  if (generated.length && !files.some(f => !generated.includes(f) && !isDoc(f))) { widen(generated.join(', ') + ' : seul le bundle généré a changé'); }
  if (widened) { return { zones: ZONES, reasons, widened: true, files }; }
  return { zones: [...zones], reasons, widened: false, files };
}

