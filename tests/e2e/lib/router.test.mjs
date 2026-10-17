// Test du routeur `test:changed` (zonesFromDiff) sur des hunks de référence, sans dépôt ni navigateur : npm run test:router
// Principe : le routeur doit être CONSERVATEUR. Un mot-clé touche toutes les zones dont une suite vérifie le comportement visé.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { URL } from 'node:url';
import { SUITES, zonesFromDiff, orderLongestFirst } from './router.mjs';

const zonesOf = file => SUITES.filter(s => s.file === file).flatMap(s => s.zones);
const BASCULE = [...new Set(['demarrage', ...zonesOf('breakpoint-switch.mjs')])];

// Faux git : une liste de fichiers et, par fichier, un diff -U0 construit à partir des lignes ajoutées.
function fakeGit(files) {
  return args => {
    if (args[0] === 'diff' && args.includes('--name-only')) { return Object.keys(files).concat(''); }
    if (args[0] === 'diff') {
      const f = args[args.length - 1];
      return ['diff --git a/' + f + ' b/' + f, '--- a/' + f, '+++ b/' + f, ...(files[f] || [])];
    }
    return [];
  };
}
const hunk = (head, ...added) => ['@@ -10,0 +10,' + added.length + ' @@ ' + head, ...added.map(l => '+' + l)];
const route = (file, lines) => zonesFromDiff('REF', fakeGit({ [file]: lines }));
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
check('suite sous-forum.mjs modifiée : zone sous-forum', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/sous-forum.mjs': [] }));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['sous-forum']);
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
check('durations.json versionné : chaque fragment du registre a une durée, aucune durée orpheline', () => {
  const doc = JSON.parse(fs.readFileSync(new URL('../durations.json', import.meta.url), 'utf8'));
  const ids = SUITES.flatMap(s => s.frags ? s.frags.map(f => `${s.name}#${f.join('+')}`) : [s.name]);
  assert.deepEqual(ids.filter(id => !Number.isFinite(doc.durations[id])), [], 'fragments sans durée');
  assert.deepEqual(Object.keys(doc.durations).filter(id => !ids.includes(id)), [], 'durées orphelines');
});

console.log(failures ? `${failures} échec(s)` : 'Routeur conforme');
process.exit(failures ? 1 : 0);
