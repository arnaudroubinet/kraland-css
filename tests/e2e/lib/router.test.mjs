// Test du routeur `test:changed` (zonesFromDiff) sur des hunks de référence, sans dépôt ni navigateur : npm run test:router
// Principe : le routeur doit être CONSERVATEUR. Un mot-clé touche toutes les zones dont une suite vérifie le comportement visé.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { URL } from 'node:url';
import { SUITES, SECTIONS, PURE_BLOCKS, zonesFromDiff, orderLongestFirst, registryOf, pickUnits, templateSections, pureBlocks } from './router.mjs';

const zonesOf = file => SUITES.filter(s => s.file === file).flatMap(s => s.zones);
const BASCULE = [...new Set(['demarrage', ...zonesOf('breakpoint-switch.mjs')])];

// Faux git : une liste de fichiers et, par fichier, un diff -U0 construit à partir des lignes ajoutées ; `old` = contenus avant (git show).
function fakeGit(files, old = {}) {
  return args => {
    if (args[0] === 'diff' && args.includes('--name-only')) { return Object.keys(files).concat(''); }
    if (args[0] === 'diff') {
      const f = args[args.length - 1];
      return ['diff --git a/' + f + ' b/' + f, '--- a/' + f, '+++ b/' + f, ...(files[f] || [])];
    }
    if (args[0] === 'show') { const f = args[1].replace(/^[^:]*:/, ''); return f in old ? old[f].split('\n') : null; }
    return [];
  };
}
const hunk = (head, ...added) => ['@@ -10,0 +10,' + added.length + ' @@ ' + head, ...added.map(l => '+' + l)];
const hunkAt = (start, ...added) => ['@@ -' + start + ',0 +' + start + ',' + added.length + ' @@', ...added.map(l => '+' + l)];
// Contenu « après » : `news` pour les fichiers donnés, le vrai dépôt pour les suites (repères cités), rien sinon.
const realSuite = f => { try { return /^tests\/e2e\/[\w-]+\.mjs$/.test(f) ? fs.readFileSync(new URL('../../../' + f, import.meta.url), 'utf8') : null; } catch (_e) { return null; } };
const readWith = news => f => (f in news ? news[f] : realSuite(f));
const route = (file, lines, text = '') => zonesFromDiff('REF', fakeGit({ [file]: lines }), readWith({ [file]: text }));
const sorted = z => [...z].sort();

let failures = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); } catch (e) { failures += 1; console.log('  FAIL ' + name + '\n       ' + e.message.split('\n')[0]); }
}

const T = 'kraland-userscript-template.js';
console.log('Routeur test:changed');
check('viewport des ordres et fixture Parler : zone parler', () => {
  assert.deepEqual(route(T, hunk('function trackOrderModalViewport(modal) {', "modal.classList.add('kr-order-viewport');")).zones, ['parler']);
  assert.deepEqual(zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/parler/model-form.html': [] })).zones, ['parler']);
  assert.deepEqual(zonesOf('parler-viewport.mjs'), ['parler']);
});

check('la bascule est visée par demarrage ET par les zones de breakpoint-switch', () => {
  assert.ok(zonesOf('breakpoint-switch.mjs').length >= 2, 'breakpoint-switch doit porter au moins deux zones');
  assert.ok(BASCULE.includes('demarrage') && BASCULE.includes('transitions'));
});
check('commentaire ajouté sur la ligne qui crée kr-resize-banner : demarrage + transitions + plateau', () => {
  const r = route(T, hunk('function showResizeBanner() {', "    banner.id = 'kr-resize-banner'; // bandeau proposé quand une saisie est en cours"));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), sorted(BASCULE));
});
for (const [mot, ligne] of [
  ['breakpoint', 'const BREAKPOINT = 768; // breakpoint'],
  ['resize', "window.addEventListener('resize', onResize); // resize"],
  ['reload', 'location.reload(); // reload'],
  ['mobile-mode', "document.body.classList.add('mobile-mode'); // mobile-mode"]
]) {
  check(`mot-clé « ${mot} » : demarrage + transitions + plateau`, () => {
    const r = route(T, hunk('InitQueue.register(', ligne));
    assert.equal(r.widened, false);
    assert.deepEqual(sorted(r.zones), sorted(BASCULE));
  });
}
check('mot-clé « jauge » : profil ET plateau (SKILL : jauges -> plateau)', () => {
  const r = route('kraland-theme.css', hunk('/* jauges */', '.jauge-pv { height: 8px; } /* jauge */'));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['plateau', 'profil']);
});
check('mot-clé « mini-profil » : toujours profil', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.mobile-mini-profile { margin: 0; }'));
  assert.ok(r.zones.includes('profil'));
});
check('mot-clé forum : forum seul (pas d\'élargissement inutile)', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.forum-thread { margin: 0; }'));
  assert.deepEqual(r.zones.length ? sorted(r.zones) : [], ['forum']);
  assert.equal(r.widened, false);
});
check('sous-forum (#topics, kr-topic-unread, dataTable) : zone sous-forum seule, pas d\'élargissement', () => {
  const r = route('kraland-theme.css', hunk('.x {', 'body.kr-subforum #topics tr.kr-topic-unread { border-left: 4px solid; }'));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['sous-forum']);
});
check('index des forums (ForumCards, forums-cards-container) : zone sous-forum (les cartes y sont testées)', () => {
  const r = route(T, hunk('function findForumsTable() {', "return Array.from(document.querySelectorAll('table.table')); // forums-cards-container"));
  assert.equal(r.widened, false);
  assert.ok(r.zones.includes('sous-forum'));
});
check('hunk commun forum + sous-forum : les deux zones', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.forum-thread-action-new, body.kr-subforum .kr-topic-unread { margin: 0; }'));
  assert.deepEqual(sorted(r.zones), ['forum', 'sous-forum']);
});
check('fixture du sous-forum modifiée : zone sous-forum', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/sous-forum-debuter.html': [] }));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['sous-forum']);
});
check('suite sous-forum.mjs modifiée : cette suite seule (+ garde du confinement), pas les autres suites de sa zone', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/sous-forum.mjs': [] }));
  assert.equal(r.widened, false);
  assert.deepEqual(r.zones, []);
  assert.deepEqual(sorted(r.units), ['confinement-reseau', 'sous-forum']);
});
check('script importé par une autre suite (audit-map-images.mjs) : lui ET la suite qui l\'importe (map-exclusions)', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/audit-map-images.mjs': [] }));
  assert.equal(r.widened, false);
  assert.ok(r.units.includes('audit-map-images') && r.units.includes('map-exclusions'), r.units.join(','));
});
check('script e2e hors registre et importé par aucune suite : élargi au total', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/nouveau-script.mjs': [] }), readWith({ 'tests/e2e/nouveau-script.mjs': '// script' }));
  assert.equal(r.widened, true);
});
check('hunk sans mot-clé reconnu : élargi au total', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.rien-de-connu { margin: 0; }'));
  assert.equal(r.widened, true);
});
check('diff du seul bundle généré : élargi au total (jamais « rien à lancer »)', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'kraland-userscript-main.user.js': [] }));
  assert.equal(r.widened, true);
  assert.ok(r.zones.length > 0);
});
check('bundle + source reconnue : la source précise les zones, sans élargir', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'kraland-userscript-main.user.js': [], 'kraland-theme.css': hunk('.x {', '.forum-thread { margin: 0; }') }));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['forum']);
});
check('documentation seule : rien à lancer (pas d\'élargissement)', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'README.md': [] }));
  assert.equal(r.widened, false);
  assert.equal(r.zones.length, 0);
});
check('durées mesurées (tests/e2e/durations.json) seules : rien à lancer (elles ne changent que l\'ordre)', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/durations.json': [] }));
  assert.equal(r.widened, false);
  assert.equal(r.zones.length, 0);
});

console.log('Lot G : diff du registre, package.json, outillage, module englobant, repères cités');
const ROUTER = 'tests/e2e/lib/router.mjs';
const routerText = fs.readFileSync(new URL('./router.mjs', import.meta.url), 'utf8');
const viaRouter = (after, before = routerText) => zonesFromDiff('REF', fakeGit({ [ROUTER]: [] }, { [ROUTER]: before }), readWith({ [ROUTER]: after }));
check('registre lisible dans le router.mjs versionné (sinon tout ajout de fragment élargirait au total)', () => {
  const reg = registryOf(routerText);
  assert.ok(reg, 'registryOf a rendu null');
  assert.deepEqual(reg.suites.map(s => s.name), SUITES.map(s => s.name));
  assert.deepEqual(reg.suites.find(s => s.name === 'forum-mobile').frags, SUITES.find(s => s.name === 'forum-mobile').frags);
});
check('fragment ajouté au registre : ce fragment SEUL (pas d\'élargissement), test du routeur demandé', () => {
  assert.ok(routerText.includes("['r'], ['s']] },"));
  const r = viaRouter(routerText.replace("['r'], ['s']] },", "['r'], ['s'], ['t']] },"));
  assert.equal(r.widened, false, r.reasons.join(' ; '));
  assert.deepEqual(r.zones, []);
  assert.deepEqual(r.units, ['menus-forums#t']);
  assert.equal(r.routerTest, true);
});
check('fragment d\'une constante partagée (FORUM_FRAGS) ajouté : ce fragment seul', () => {
  const r = viaRouter(routerText.replace("['f01'], ['signature']", "['f01'], ['nouveau'], ['signature']"));
  assert.equal(r.widened, false);
  assert.deepEqual(r.units, ['forum-mobile#nouveau']);
});
check('suite ajoutée au registre : cette suite seule', () => {
  const r = viaRouter(routerText.replace('export const SUITES = [\n', "export const SUITES = [\n  { name: 'nouvelle', file: 'nouvelle.mjs', zones: ['nouvelle'] },\n"));
  assert.equal(r.widened, false);
  assert.deepEqual(r.units, ['nouvelle']);
});
check('zones d\'une suite modifiées dans le registre : la suite entière', () => {
  const r = viaRouter(routerText.replace("zones: ['images'] },\n  { name: 'image-fallback'", "zones: ['images', 'plateau'] },\n  { name: 'image-fallback'"));
  assert.equal(r.widened, false);
  assert.deepEqual(r.units, ['map-exclusions']);
});
check('fragment retiré du registre : rien à lancer', () => {
  const r = viaRouter(routerText.replace("['r'], ['s']] },", "['r']] },"));
  assert.equal(r.widened, false);
  assert.deepEqual([r.zones, r.units], [[], []]);
});
check('logique du routeur modifiée hors registre : test du routeur seul, aucune suite e2e', () => {
  const r = viaRouter(routerText.replace('const MAX_CITING = 3;', 'const MAX_CITING = 4;'));
  assert.equal(r.widened, false);
  assert.deepEqual([r.zones, r.units], [[], []]);
  assert.equal(r.routerTest, true);
});
check('registre illisible (identifiant hors registre dans SUITES) : élargi au total', () => {
  const r = viaRouter(routerText.replace("{ name: 'parler-viewport'", '{ name: nomCalcule'));
  assert.equal(r.widened, true);
});
check('test du routeur seul modifié : aucune suite e2e, test du routeur demandé', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/lib/router.test.mjs': [] }));
  assert.deepEqual([r.widened, r.zones, r.units, r.routerTest], [false, [], [], true]);
});
const PKG = JSON.stringify({ name: 'kraland-css', version: '1.0.0', type: 'module', scripts: { build: 'node build.js', 'test:croix': 'node tests/e2e/croix-directionnelle.mjs' }, devDependencies: { playwright: '^1.51.0' } }, null, 2);
const viaPkg = after => zonesFromDiff('REF', fakeGit({ 'package.json': [] }, { 'package.json': PKG }), readWith({ 'package.json': JSON.stringify(after, null, 2) }));
const pkg = () => JSON.parse(PKG);
check('package.json hors scripts et dépendances (version, description) : rien à lancer', () => {
  const r = viaPkg({ ...pkg(), version: '1.0.1', description: 'autre' });
  assert.deepEqual([r.widened, r.zones, r.units], [false, [], []]);
});
check('package.json : alias de suite ajouté (node tests/e2e/<suite>.mjs) -> cette suite seule', () => {
  const p = pkg(); p.scripts['test:parler'] = 'node tests/e2e/parler-viewport.mjs';
  const r = viaPkg(p);
  assert.equal(r.widened, false);
  assert.deepEqual(r.units, ['parler-viewport']);
});
check('package.json : alias de suite retiré -> rien à lancer', () => {
  const p = pkg(); delete p.scripts['test:croix'];
  assert.deepEqual([viaPkg(p).widened, viaPkg(p).units], [false, []]);
});
check('package.json : autre script (build) ou dépendance modifiés -> total', () => {
  const p = pkg(); p.scripts.build = 'node build.js --x';
  assert.equal(viaPkg(p).widened, true);
  const q = pkg(); q.devDependencies.playwright = '^1.60.0';
  assert.equal(viaPkg(q).widened, true);
  assert.equal(zonesFromDiff('REF', fakeGit({ 'package-lock.json': [] })).widened, true);
});
for (const f of ['.gitattributes', '.hermes/skills/x/SKILL.md', '_bmad/config.toml', 'eslint.config.js', '.stylelintignore']) {
  check(`outillage ${f} : lint seul (rien à lancer, pas d'élargissement)`, () => {
    const r = zonesFromDiff('REF', fakeGit({ [f]: [] }));
    assert.deepEqual([r.widened, r.zones, r.units], [false, [], []]);
    assert.ok(r.reasons.some(x => /lint seul/.test(x)));
  });
}
check('outillage + bundle généré seul : toujours total (la source ne dit rien)', () => {
  assert.equal(zonesFromDiff('REF', fakeGit({ 'eslint.config.js': [], 'kraland-userscript-main.user.js': [] })).widened, true);
});
const BAR = '  // ' + '='.repeat(40);
const tpl = (...sections) => sections.flatMap(([title, body]) => [BAR, '  // ' + title, '  // détail du module', BAR, ...body]).join('\n');
const TPL = tpl(['UTILITAIRES', ['  function a() {', '    return 1;', '  }']], ['MENUS FORUM DYNAMIQUES (RP, HRP)', ['  // Source native : la liste latérale', '  function b() {', '    return 2;', '  }']], ['MODULE : Kramail:Destinataires — rédaction', ['  function c() {', '    return 3;', '  }']]);
const at = (text, needle) => text.split('\n').findIndex(l => l.includes(needle)) + 1;
check('template, hunk sans mot-clé dans le module des menus : zone menus-forums (module englobant, pas total)', () => {
  const r = route(T, hunkAt(at(TPL, 'return 2'), '    const n = 2;'), TPL);
  assert.equal(r.widened, false, r.reasons.join(' ; '));
  assert.deepEqual(r.zones, ['menus-forums']);
});
check('template, en-tête sur plusieurs lignes : la ligne de fermeture n\'ouvre pas une section (« Source native » n\'est pas un module)', () => {
  const r = route(T, hunkAt(at(TPL, 'Source native'), '  // commentaire'), TPL);
  assert.deepEqual(r.zones, ['menus-forums']);
});
check('template, hunk sans mot-clé dans un module Kramail : forum + kramail', () => {
  const r = route(T, hunkAt(at(TPL, 'return 3'), '    const n = 3;'), TPL);
  assert.deepEqual(sorted(r.zones), ['forum', 'kramail']);
});
check('template, hunk sans mot-clé dans un module transverse (UTILITAIRES) : élargi au total', () => {
  assert.equal(route(T, hunkAt(at(TPL, 'return 1'), '    const n = 1;'), TPL).widened, true);
});
check('template, mot-clé dans un module connu : zones du mot-clé ET du module (menus + bascule)', () => {
  const r = route(T, hunkAt(at(TPL, 'return 2'), '    location.reload();'), TPL);
  assert.deepEqual(sorted(r.zones), sorted(['menus-forums', ...BASCULE]));
});
check('template, hunk à cheval sur un module connu et un module transverse sans mot-clé : total', () => {
  assert.equal(route(T, ['@@ -1,0 +' + at(TPL, 'return 1') + ',' + (at(TPL, 'return 2') - at(TPL, 'return 1') + 1) + ' @@', '+    x();'], TPL).widened, true);
});
const CSS = ['.forum-thread-action-new {', '  margin: 0;', '}', '', 'body.mobile-mode .navbar .rien {', '  padding: 0;', '}', '', 'body.kr-subforum #topics td {', '  color: red;', '}'].join('\n');
check('faux négatif corrigé : déclaration de .forum-thread-action-new -> forum ET sous-forum (sous-forum.mjs vérifie ce bouton)', () => {
  const r = route('kraland-theme.css', hunkAt(2, '  padding: 4px;'), CSS);
  assert.equal(r.widened, false, r.reasons.join(' ; '));
  assert.deepEqual(sorted(r.zones), ['forum', 'sous-forum']);
  assert.ok(r.units.includes('sous-forum'));
});
check('faux négatif corrigé : sélecteur .forum-thread-action-new dans le hunk -> sous-forum aussi', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.forum-thread-action-new { gap: 4px; }'));
  assert.ok(r.zones.includes('sous-forum') && r.zones.includes('forum'), r.zones.join(','));
});
check('CSS, déclaration seule dans une règle du sous-forum : zone sous-forum (règle englobante)', () => {
  const r = route('kraland-theme.css', hunkAt(10, '  border: 0;'), CSS);
  assert.equal(r.widened, false);
  assert.ok(r.zones.includes('sous-forum'));
});
check('CSS, déclaration seule dans une règle portée par mobile-mode sans composant connu : total (une portée n\'est pas un composant)', () => {
  assert.equal(route('kraland-theme.css', hunkAt(6, '  margin: 0;'), CSS).widened, true);
});
check('repère cité par une suite (kr-topic-unread, cité par sous-forum.mjs) : la suite qui le cite est lancée', () => {
  const r = route(T, hunk('function x() {', "row.classList.add('kr-topic-unread');"));
  assert.ok(r.units.includes('sous-forum'), r.units.join(','));
});
check('repère cité par plus de 3 suites (mobile-mode) : ignoré, les mots-clés décident (seul le garde-fou de fin d\'initialisation suit tout hunk du template)', () => {
  const r = route(T, hunk('function x() {', "document.body.classList.add('mobile-mode');"));
  assert.deepEqual(r.units, ['fin-initialisation']);
});
check('template modifié : garde-fou de fin d\'initialisation lancé ; CSS seul : non', () => {
  assert.ok(route(T, hunk('function x() {', "row.classList.add('kr-topic-unread');")).units.includes('fin-initialisation'));
  assert.ok(!route('kraland-theme.css', hunkAt(10, '  border: 0;'), CSS).units.includes('fin-initialisation'));
});
check('fixture citée par une suite (forum-colonne-native-rp.html -> menus-forums) ; fixture citée par aucune : total', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/forum-colonne-native-rp.html': [] }));
  assert.deepEqual([r.widened, r.units], [false, ['menus-forums']]);
  assert.equal(zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/orpheline.html': [] })).widened, true);
});
check('pickUnits : zones choisies + unités explicites, sans doublon', () => {
  const all = SUITES.flatMap(s => s.frags ? s.frags.map(f => ({ id: `${s.name}#${f.join('+')}`, suite: s.name })) : [{ id: s.name, suite: s.name }]);
  const ids = pickUnits(all, { zones: ['parler'], units: ['menus-forums#s', 'image-fallback'] }).map(u => u.id);
  assert.deepEqual(ids, ['parler-viewport', 'menus-forums#s', 'image-fallback']);
});

console.log('Tests unitaires du cœur pur (lot F)');
check('tests/unit/ (tests ou chargeur) : tests unitaires seuls, aucune suite e2e, pas d\'élargissement', () => {
  for (const f of ['tests/unit/pagination.test.mjs', 'tests/unit/lib/pure.mjs', 'tests/unit/nouveau.test.mjs']) {
    const r = zonesFromDiff('REF', fakeGit({ [f]: [] }));
    assert.equal(r.widened, false, f);
    assert.equal(r.unitTest, true, f);
    assert.deepEqual(r.zones, [], f);
    assert.deepEqual(r.units, [], f);
    assert.equal(r.routerTest, false, f);
  }
});
check('template modifié (cœur pur ou module) : tests unitaires relancés en plus des zones', () => {
  const r = route(T, hunk('function krCompactPageLayout(nums, current) {', '    // sous-forum : pagination compacte'));
  assert.equal(r.unitTest, true);
  assert.ok(r.zones.includes('sous-forum'));
});
check('ni template ni tests/unit/ : pas de tests unitaires (README, durées) ; élargissement au total : tests unitaires compris', () => {
  assert.equal(zonesFromDiff('REF', fakeGit({ 'README.md': [] })).unitTest, false);
  assert.equal(zonesFromDiff('REF', fakeGit({ 'tests/e2e/durations.json': [] })).unitTest, false);
  assert.equal(zonesFromDiff('REF', fakeGit({ 'tests/e2e/sous-forum.mjs': [] })).unitTest, false);
  const w = zonesFromDiff('REF', fakeGit({ 'fichier-inconnu.txt': [] }));
  assert.equal(w.widened, true);
  assert.equal(w.unitTest, true);
  assert.equal(zonesFromDiff('REF', () => null).unitTest, true, 'git indisponible');
});
// Template réel : les titres et les blocs du cœur pur que le routeur doit reconnaître (un renommage par rechercher-remplacer les casse).
const REAL_TPL = fs.readFileSync(new URL('../../../' + T, import.meta.url), 'utf8');
check('template réel : chaque règle de SECTIONS reconnaît au moins un titre de section', () => {
  const titles = templateSections(REAL_TPL).map(s => s.title);
  const orphan = SECTIONS.filter(([re]) => !titles.some(t => re.test(t))).map(([re]) => String(re));
  assert.deepEqual(orphan, [], 'règle(s) sans titre dans le template (titre renommé ?)');
});
check('template réel : chaque bloc @kr-pure-begin a ses zones dans PURE_BLOCKS, et réciproquement', () => {
  const names = pureBlocks(REAL_TPL).map(b => b.name);
  assert.deepEqual([...names].sort(), Object.keys(PURE_BLOCKS).sort());
  assert.equal((REAL_TPL.match(/^\s*\/\/ @kr-pure-begin\b/gm) || []).length, names.length, 'bloc non fermé ou mal écrit');
});
for (const [name, expected] of [['pagination', ['sous-forum']], ['rechargement', BASCULE], ['menus-forums', ['menus-forums']], ['images', ['images']], ['destinataires', ['kramail']]]) {
  check(`cœur pur, hunk sans mot-clé dans le bloc « ${name} » : ${expected.join(' + ')}, pas d'élargissement`, () => {
    const b = pureBlocks(REAL_TPL).find(x => x.name === name);
    assert.ok(b, 'bloc introuvable');
    const r = route(T, hunkAt(b.start + 1, '  // x'), REAL_TPL);
    assert.equal(r.widened, false, r.reasons.join(' ; '));
    assert.deepEqual(sorted(r.zones), sorted(expected));
    assert.equal(r.unitTest, true);
    if (name === 'images') { assert.ok(['image-fallback', 'map-exclusions'].every(s => SUITES.find(x => x.name === s).zones.includes('images'))); }
  });
}
check('cœur pur : hunk qui déborde du bloc dans l\'en-tête CŒUR PUR (transverse) sans mot-clé : total', () => {
  const b = pureBlocks(REAL_TPL)[0];
  assert.equal(route(T, ['@@ -1,0 +' + (b.start - 2) + ',3 @@', '+  // x'], REAL_TPL).widened, true);
});
check('cœur pur : bloc inconnu de PURE_BLOCKS (renommé) : total', () => {
  const renamed = REAL_TPL.replace('@kr-pure-begin pagination', '@kr-pure-begin pagination2');
  const b = pureBlocks(renamed).find(x => x.name === 'pagination2');
  assert.equal(route(T, hunkAt(b.start + 1, '  // x'), renamed).widened, true);
});

console.log('Ordre de lancement (plus longs d\'abord)');
const U = ids => ids.map(id => ({ id }));
check('durées connues : ordre décroissant, quel que soit l\'ordre du registre', () => {
  assert.deepEqual(orderLongestFirst(U(['a', 'b', 'c']), { a: 5, b: 420, c: 30 }).map(u => u.id), ['b', 'c', 'a']);
});
check('unité sans durée mesurée : en tête (prudence), dans l\'ordre du registre', () => {
  assert.deepEqual(orderLongestFirst(U(['a', 'n1', 'b', 'n2']), { a: 5, b: 50 }).map(u => u.id), ['n1', 'n2', 'b', 'a']);
});
check('durées égales ou fichier absent : ordre du registre conservé (tri stable)', () => {
  assert.deepEqual(orderLongestFirst(U(['a', 'b', 'c']), { a: 7, b: 7, c: 7 }).map(u => u.id), ['a', 'b', 'c']);
  assert.deepEqual(orderLongestFirst(U(['a', 'b', 'c'])).map(u => u.id), ['a', 'b', 'c']);
});
check('aucune unité perdue ni dupliquée', () => {
  const ids = SUITES.flatMap(s => s.frags ? s.frags.map(f => `${s.name}#${f.join('+')}`) : [s.name]);
  const out = orderLongestFirst(U(ids), { [ids[3]]: 1, [ids[0]]: 99 }).map(u => u.id);
  assert.deepEqual([...out].sort(), [...ids].sort());
});
check('durations.json versionné : aucune durée orpheline (une durée MANQUANTE n\'échoue pas : le fragment est lancé en tête)', () => {
  const doc = JSON.parse(fs.readFileSync(new URL('../durations.json', import.meta.url), 'utf8'));
  const ids = SUITES.flatMap(s => s.frags ? s.frags.map(f => `${s.name}#${f.join('+')}`) : [s.name]);
  const missing = ids.filter(id => !Number.isFinite(doc.durations[id]));
  if (missing.length) { console.log(`  info sans durée mesurée (lancés en tête, rien à faire ; KR_SAVE_DURATIONS=1 npm run test:all pour les mesurer) : ${missing.join(', ')}`); }
  assert.deepEqual(Object.keys(doc.durations).filter(id => !ids.includes(id)), [], 'durées orphelines (fragment retiré ou renommé) : les retirer de tests/e2e/durations.json');
});

console.log(failures ? `${failures} échec(s)` : 'Routeur conforme');
process.exit(failures ? 1 : 0);
