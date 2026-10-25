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
check('Notifications /report (kr-page-report) : zone report, suite -> report-non-lu seule ; fixture -> report-non-lu et palette-nation (balayage)', () => {
  assert.deepEqual(route('kraland-theme.css', hunk('html.kr-page-report table > tbody > tr.bg-info {', 'html.kr-page-report table > tbody > tr.bg-info { color: inherit; }')).zones, ['report']);
  const t = route(T, hunk('function applyVariant() {', "document.documentElement.classList.toggle('kr-page-report', isReport);"));
  assert.deepEqual(t.zones, ['report']);
  assert.equal(t.widened, false);
  const f = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/report-non-lu.html': [] }), readWith({}));
  assert.equal(f.widened, false);
  assert.deepEqual(f.units, ['report-non-lu', 'palette-nation']);
  assert.deepEqual(zonesOf('report-non-lu.mjs'), ['report']);
});
check('couleurs de nation : déclaration d\'un jeton de rôle (même citant palette-nation) ou emploi var(--kr-…) sans composant : total ; fixture -> palette-nation et forum-activite', () => {
  assert.deepEqual(zonesOf('palette-nation.mjs'), ['palette-nation']);
  const theme = [
    ':root {', '  --kr-primary: #8b0f0e;', '  --kr-primary-dark: color-mix(in srgb, var(--kr-primary) 80%, #000);', '  --kr-text-accent: var(--kr-highlight); /* palette-nation */', '}',
    'html.kr-theme-variant-paladium {', '  --kr-arm-ink: #1e1a15;', '  --kr-arm-ink-hover: #1e1a15;', '}',
    'html[class*="-dark"] {', '  --kr-alert-info-bg: color-mix(in srgb, var(--kr-primary) 15%, var(--kr-bg-surface));', '}'
  ].join('\n');
  for (const [quoi, h] of [
    [':root', hunkAt(3, '  --kr-primary-dark: color-mix(in srgb, var(--kr-primary) 80%, #000);', '  --kr-text-accent: var(--kr-highlight); /* palette-nation */')],
    ['Paladium clair', hunkAt(8, '  --kr-arm-ink-hover: #1e1a15;')],
    ['sombre', hunkAt(11, '  --kr-alert-info-bg: color-mix(in srgb, var(--kr-primary) 15%, var(--kr-bg-surface));')]
  ]) {
    const d = route('kraland-theme.css', h, theme);
    assert.equal(d.widened, true, `${quoi} : ${d.reasons.join(' ; ')}`);
    assert.ok(d.zones.includes('palette-nation'), quoi);
  }
  assert.equal(route('kraland-theme.css', hunk('.x {', '.rien-de-connu { color: var(--kr-text-accent); }')).widened, true);
  const f = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/palette-nation.html': [] }), readWith({}));
  assert.equal(f.widened, false);
  // fixture lue aussi par forum-activite (épopée 6, entrée 3 : page hors forum /regles/avancees, fragment fil)
  assert.deepEqual(sorted(f.units), ['forum-activite', 'palette-nation']);
});

check('typographie et formes : déclaration d\'un jeton d\'échelle sur :root : total ; fixture -> typographie-formes et cartes-pastilles', () => {
  assert.deepEqual(zonesOf('typographie-formes.mjs'), ['typographie-formes']);
  const theme = [':root {', '  --kr-radius: .5rem;', '  --kr-font-label: 12px;', '  --kr-space-1: 4px;', '}'].join('\n');
  const d = route('kraland-theme.css', hunkAt(3, '  --kr-font-label: 12px;'), theme);
  assert.equal(d.widened, true, d.reasons.join(' ; '));
  const f = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/typographie-formes.html': [] }), readWith({}));
  assert.equal(f.widened, false);
  assert.deepEqual(sorted(f.units), ['cartes-pastilles', 'typographie-formes'], JSON.stringify(f.units)); // fixture lue aussi par cartes-pastilles (épopée 5, entrée 4)
});
check('typographie et formes : composant mesuré -> typographie-formes (en plus des zones du composant)', () => {
  const u = route('kraland-theme.css', hunk('.kr-nav-v2 .kr-room-here {', '  font-size: var(--kr-font-label);'));
  assert.equal(u.widened, false, u.reasons.join(' ; '));
  assert.deepEqual(u.zones, ['typographie-formes']);
  const s = route('kraland-theme.css', hunk('.kr-topic-badge {', '.kr-topic-badge { font-size: 13px; }'));
  assert.equal(s.widened, false);
  assert.deepEqual(sorted(s.zones), ['sous-forum', 'typographie-formes']);
  const k = route('kraland-theme.css', hunk('.kd-opt-tag {', '.kd-opt-tag { font-weight: 600; }'));
  assert.ok(k.zones.includes('typographie-formes') && k.zones.includes('kramail'), k.zones.join(', '));
});
check('typographie et formes : échelle du forum et du kramail (fil d\'Ariane, cartouche, date d\'un kramail lu, aide des destinataires) -> typographie-formes', () => {
  for (const h of [
    hunk('body.page-forum.kr-subforum .forum-mobile-breadcrumb {', '    font-size: var(--kr-font-detail);'),
    hunk('body.mobile-mode ul.media-list.forum > li.media.kr-msg .user-info > .cartouche {', '    font-size: var(--kr-font-detail);'),
    hunk('.kramail-msg-date {', '    font-size: var(--kr-font-detail) !important;'),
    hunk('body.page-kramail-compose form[name="post_msg"] .kd-help {', '    font-size: var(--kr-font-detail);'),
    hunk('  .forum-title {', '    font-size: var(--kr-font-forum-name);'),
    hunk('@media (max-width: 767px) {', '  :is(h1, h2, h3):where(:not(.forum-title)) { font-size: var(--kr-font-section-title) !important; }'),
    hunk('  body.page-kramail-compose form[name="post_msg"] .kd-warn {', '    font-size: var(--kr-font-body-mobile);')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('typographie-formes'), d.zones.join(', '));
  }
  // Classes exactes : un titre de page ou un conteneur au nom voisin ne lance pas le fragment par ce mot-clé.
  for (const h of [
    hunk('  body.page-forum.kr-subforum .forum-subforum-title {', '    font-size: 24px;'),
    hunk('  body.page-forum .panel-default .table > tbody > tr > .forum-description-wrapper {', '    padding: 0;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.ok(!d.zones.includes('typographie-formes'), d.zones.join(', '));
  }
});
check('typographie et formes : détails de ligne des pages de jeu, objets déplacés du Matériel, garde du plateau (ticket 6) -> typographie-formes et plateau', () => {
  for (const h of [
    hunk(':where(body:has(#col-leftest)) .list-group-item-text {', '    font-size: var(--kr-font-detail) !important;'),
    hunk('  .kr-materiel-moved .panel-body a.list-group-item {', '    font-size: var(--kr-font-detail);'),
    hunk('  :where(html:not(.kr-page-plateau) body:has(#col-leftest)) #col-right .dashboard > .well {', '    font-size: var(--kr-font-detail);')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('typographie-formes') && d.zones.includes('plateau'), d.zones.join(', '));
  }
});
check('classe de page du plateau posée par le template (ticket 6) -> typographie-formes et plateau', () => {
  const d = route(T, hunk('function applyVariant() {', "document.documentElement.classList.toggle('kr-page-plateau', krActiveGameSection(location.pathname) === '/jouer/plateau');"));
  assert.equal(d.widened, false, d.reasons.join(' ; '));
  assert.ok(d.zones.includes('typographie-formes') && d.zones.includes('plateau'), d.zones.join(', '));
});
check('typographie et formes : bouton compact (pagination du sujet, pages du sous-forum, votes) -> typographie-formes', () => {
  for (const h of [
    hunk(':where(body.page-forum) .center > ul.pagination:not(:has(select)) > li > :is(a, span) {', '    font-size: var(--kr-font-button-compact);'),
    hunk('html body.page-forum.kr-subforum:not(.mobile-mode) .panel-default tbody > tr > td:first-child > ul.pagination:not(:first-of-type) > li:first-child > a {', '    border-top-left-radius: var(--kr-radius-sm);'),
    hunk(':where(body.page-forum) ul.media-list.forum > li.media > .media-body > .pull-right > .btn-group-xs[id^="ajax-"] > .btn {', '    font-size: var(--kr-font-button-compact);')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('typographie-formes'), d.zones.join(', '));
  }
});
check('typographie et formes : rayons (ticket 8) -> typographie-formes et kramail', () => {
  for (const h of [
    hunk('  .kr-rayon-fictif {', '    border-radius: var(--kr-radius-sm);'),
    hunk('  .kr-rayon-fictif {', '    border-top-left-radius: var(--kr-radius-md) !important;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('typographie-formes') && d.zones.includes('kramail'), d.zones.join(', '));
  }
});
check('typographie et formes : grille d\'espacement (ticket 9) -> typographie-formes, forum, sous-forum, kramail, plateau, modale-ordre, cybermonde', () => {
  for (const h of [
    hunk('  .kr-espace-fictif {', '    padding: var(--kr-space-2) var(--kr-space-4) !important;'),
    hunk('  .kr-espace-fictif {', '    gap: var(--kr-space-1);'),
    hunk('.kr-espace-fictif {', '    margin-bottom: var(--kr-space-6);')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.deepEqual(sorted(d.zones), ['cybermonde', 'forum', 'kramail', 'modale-ordre', 'plateau', 'sous-forum', 'typographie-formes']);
  }
});
check('typographie et formes : nettoyage (ticket 10), ligne de média seule -> total ; carte du forum -> forum, sous-forum, typographie-formes', () => {
  for (const ligne of ['@media (max-width: 767px) {', '@media (min-width: 768px) {']) {
    const d = route('kraland-theme.css', hunkAt(1727, ligne));
    assert.equal(d.widened, true, `${ligne} : ${d.reasons.join(' ; ')}`);
  }
  const d = route('kraland-theme.css', hunk('  :where(html:not(.kr-page-forum-index)) body.mobile-mode:where(.page-forum, .page-forum-racine) .panel-default .table > tbody > tr {', '    box-shadow: var(--kr-shadow-sm) !important;'));
  assert.equal(d.widened, false, d.reasons.join(' ; '));
  assert.ok(d.zones.includes('forum'), d.zones.join(', '));
  for (const u of ['sous-forum', 'typographie-formes']) { assert.ok(d.units.includes(u), `${u} absente : ${d.units.join(', ')}`); }
});
check('typographie et formes : échelle (en-têtes, noms, onglets et jauges du mini-profil) -> typographie-formes', () => {
  for (const h of [
    hunk('.dashboard-card-name {', '  font-size: var(--kr-font-name);'),
    hunk('  .mobile-tab-label {', '    font-size: var(--kr-font-label) !important;'),
    hunk('  .mobile-mini-profile-gauges-compact {', '    font-size: var(--kr-font-label) !important;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('typographie-formes'), d.zones.join(', '));
  }
});
check('composants génériques (en-tête de panneau, .panel-title, titre d\'élément de liste) -> toutes les zones qui les rendent', () => {
  const attendues = ['forum', 'sous-forum', 'kramail', 'modale-ordre', 'cybermonde', 'palette-nation', 'plateau', 'profil', 'typographie-formes', 'cartes-pastilles'];
  for (const h of [
    hunk('  body.page-forum .panel-default > .panel-heading h3 {', '    font-size: var(--kr-font-section-title) !important;'),
    hunk('  .panel-title {', '    font-size: var(--kr-font-section-title);'),
    hunk('  .panel-body h4.list-group-item-heading {', '    font-weight: 600;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    for (const z of attendues) { assert.ok(d.zones.includes(z), `${z} absente : ${d.zones.join(', ')}`); }
  }
});

check('module « Panel Sections Collapse » (building-section, accordion-icon) -> cartes-pastilles', () => {
  for (const h of [
    hunk('  body.mobile-mode .building-section-header .accordion-icon {', '    margin-left: auto;'),
    hunk('  body.mobile-mode .building-section-content.collapsed {', '    padding-top: 0;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('cartes-pastilles'), d.zones.join(', '));
  }
});
check('panneaux du forum, du sous-forum et de la racine -> cartes-pastilles, en plus du forum (carte de section, épopée 5, entrée 2)', () => {
  for (const h of [
    hunk('  body.page-forum .panel-default > .panel-heading {', '    margin-bottom: 0 !important;'),
    hunk('  body.page-forum-racine .panel-default > .panel-body {', '    padding: 0 !important;'),
    hunk('  body.page-forum.kr-subforum .panel-default > .panel-heading {', '    min-height: 48px;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    assert.ok(d.zones.includes('cartes-pastilles') && d.zones.includes('forum'), d.zones.join(', '));
  }
  assert.ok(!route('kraland-theme.css', hunk('  body.page-forum .forum-msg {', '    margin: 0;')).zones.includes('cartes-pastilles'), 'forum hors panneau');
});
check('groupes du plateau (dashboard-section, grille, titre, chevron) -> cartes-pastilles, plateau et typographie-formes (épopée 5, entrée 3)', () => {
  for (const h of [
    hunk('  body.mobile-mode .dashboard-section {', '    margin: 0 var(--kr-space-2) 10px;'),
    hunk('  body.mobile-mode .dashboard-cards-grid.collapsed {', '    padding-top: 0;'),
    hunk('  body.mobile-mode .dashboard-group-title {', '    font-weight: 700;'),
    hunk('  body.mobile-mode .dashboard-section-header-accordion .accordion-icon {', '    margin-left: auto;')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    for (const z of ['cartes-pastilles', 'plateau', 'typographie-formes']) { assert.ok(d.zones.includes(z), `${z} absente : ${d.zones.join(', ')}`); }
  }
  for (const f of ['tests/e2e/fixtures/plateau-qualite-usage.html', 'tests/e2e/fixtures/plateau-minimal.html']) {
    assert.deepEqual(sorted(zonesFromDiff('REF', fakeGit({ [f]: [] }), readWith({})).zones), ['cartes-pastilles', 'plateau'], f);
  }
  assert.deepEqual(zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/plateau-navbar-large.html': [] }), readWith({})).zones, ['plateau']);
});
check('pastilles d\'état de la barre (épopée 5, entrée 4) : règle réécrite -> cartes-pastilles et typographie-formes ; fixtures lues', () => {
  // Sans le mot-clé, les lignes citant kramail n'envoient que vers forum et kramail (P8).
  for (const h of [
    hunk('html.kr-page-report table > tbody > tr.bg-info > td:first-child {', '@media (max-width: 767px), (min-width: 768px) {', '  .badge-danger,',
      '  .navbar-right a[href="kramail"] .badge:not(:empty),', '  .navbar-header-buttons-left a[href*="kramail"] .badge:not(:empty) {',
      '    background-color: var(--kr-status-unread) !important;', '    color: var(--kr-bg-surface) !important;', '  }'),
    hunk('@media (max-width: 767px), (min-width: 768px) {', '  .badge-danger,')
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    for (const z of ['cartes-pastilles', 'typographie-formes']) { assert.ok(d.zones.includes(z), `${z} absente : ${d.zones.join(', ')}`); }
  }
  for (const [f, z] of [['tests/e2e/fixtures/kramail-reception.html', ['cartes-pastilles', 'kramail']], ['tests/e2e/fixtures/sous-forum-debuter.html', ['cartes-pastilles', 'forum-activite', 'sous-forum']]]) {
    assert.deepEqual(sorted(zonesFromDiff('REF', fakeGit({ [f]: [] }), readWith({})).zones), z, f);
  }
  const t = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/typographie-formes.html': [] }), readWith({}));
  assert.deepEqual(sorted(t.units), ['cartes-pastilles', 'typographie-formes'], JSON.stringify(t.units)); // règle « fixture » : suites qui la citent
});
check('étiquettes de catégorie (épopée 5, entrée 5) : marque native PNJ, tags et compteurs de contact -> cartes-pastilles, typographie-formes, palette-nation ; fixtures lues', () => {
  for (const [h, zones] of [
    [hunk('@media (max-width: 767px), (min-width: 768px) {', '  html.kr-theme-enabled .btn.btn-danger.xmini {', '    background-color: var(--kr-arm-bg, var(--kr-primary));', '  }'), ['cartes-pastilles', 'typographie-formes', 'palette-nation']],
    [hunk('  body.page-forum table.dataTable tbody td:nth-child(1) .forum-tags a {', '    color: var(--kr-arm-ink, var(--kr-white)) !important;', '  }'), ['cartes-pastilles', 'typographie-formes', 'palette-nation']],
    [hunk('.dashboard-card-pnj {', '  background: var(--kr-arm-bg, var(--kr-primary));', '}'), ['cartes-pastilles', 'typographie-formes', 'palette-nation']],
    [hunk('@media (max-width: 767px), (min-width: 768px) {', '  a.list-group-item[href^="kramail/"] > .badge:not(:empty),', '  .badge-danger,'), ['cartes-pastilles', 'typographie-formes']]
  ]) {
    const d = route('kraland-theme.css', h);
    assert.equal(d.widened, false, d.reasons.join(' ; '));
    for (const z of zones) { assert.ok(d.zones.includes(z), `${z} absente : ${d.zones.join(', ')}`); }
  }
  for (const f of ['palette-nation-etats.html', 'forum-index-rp.html', 'jeu-materiel.html']) {
    const t = zonesFromDiff('REF', fakeGit({ [`tests/e2e/fixtures/${f}`]: [] }), readWith({}));
    assert.ok(t.units.includes('cartes-pastilles'), `${f} : ${JSON.stringify(t.units)}`);
  }
});
check('cartes-pastilles enregistrée (12 fragments, Bootstrap embarqué)', () => {
  const s = SUITES.find(x => x.name === 'cartes-pastilles');
  assert.ok(s, 'suite absente du registre');
  assert.deepEqual(s.frags.map(f => f[0]), ['carte', 'module', 'kramail', 'forum', 'lignes', 'chevron', 'bureau', 'bascule', 'groupes', 'pastilles', 'etiquettes', 'contraste']);
  assert.equal(s.needsBootstrap, true);
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
check('sous-forum lu en partie (kr-topic-newmsg, navigation intelligente du titre) : zone sous-forum, fragments l7-nouveau et l8-raccourci', () => {
  const r = route('kraland-theme.css', hunk('.x {', 'body.kr-subforum #topics tr.kr-topic-newmsg { border-left: 4px solid; }'));
  assert.equal(r.widened, false);
  assert.deepEqual(sorted(r.zones), ['sous-forum']);
  const t = route(T, hunk('function smartLink(link, iconHref) {', "row.classList.toggle('kr-topic-newmsg', newMessages);"));
  assert.equal(t.widened, false);
  assert.deepEqual(sorted(t.zones), ['sous-forum']);
  const frags = SUITES.find(s => s.name === 'sous-forum').frags.flat();
  assert.ok(frags.includes('l7-nouveau') && frags.includes('l8-raccourci'), frags.join(','));
});
check('index des forums (ForumCards, forums-cards-container) : zone sous-forum (les cartes y sont testées)', () => {
  const r = route(T, hunk('function findForumsTable() {', "return Array.from(document.querySelectorAll('table.table')); // forums-cards-container"));
  assert.equal(r.widened, false);
  assert.ok(r.zones.includes('sous-forum'));
});
check('index du forum (html.kr-page-forum-index) : zone forum, suite forum-index (zones forum et sous-forum) lancée', () => {
  assert.deepEqual(sorted(zonesOf('forum-index.mjs')), ['forum', 'sous-forum']);
  const r = route('kraland-theme.css', hunk('.x {', ':where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr { display: flex; }'));
  assert.equal(r.widened, false);
  assert.ok(r.zones.includes('forum'), r.zones.join(','));
  assert.ok(r.units.includes('forum-index'), r.units.join(','));
});
check('module des sujets permanents ou Cybermonde modifié : suite jeu-identite lancée (fragment hors-forum-js, ticket 4 du backlog)', () => {
  assert.ok(zonesOf('jeu-identite.mjs').includes('sous-forum') && zonesOf('jeu-identite.mjs').includes('cybermonde'), zonesOf('jeu-identite.mjs').join(','));
  const r = route(T, hunk('function enrichPermanentTopicsStats() {', "statsWrapper.className = 'permanent-topic-stats';"));
  // pickUnits retient toute suite dont une zone est choisie : jeu-identite suit donc ces deux hunks
  assert.ok(r.zones.includes('sous-forum'), 'sujets permanents : ' + r.zones.join(','));
  const c = route('kraland-theme.css', hunk('.x {', ':where(body.page-cybermonde) .kr-cybermonde-monde { left: 0; }'));
  assert.ok(c.zones.includes('cybermonde'), 'Cybermonde : ' + c.zones.join(','));
  const choisies = units => pickUnits(units, r).map(u => u.suite).concat(pickUnits(units, c).map(u => u.suite));
  assert.ok(choisies([{ id: 'jeu-identite#hors-forum-js', suite: 'jeu-identite' }]).filter(x => x === 'jeu-identite').length === 2, 'jeu-identite non retenue');
});
check('hunk commun forum + sous-forum : les deux zones', () => {
  const r = route('kraland-theme.css', hunk('.x {', '.forum-thread-action-new, body.kr-subforum .kr-topic-unread { margin: 0; }'));
  assert.deepEqual(sorted(r.zones), ['forum', 'sous-forum']);
});
check('fixture du sous-forum modifiée : zones sous-forum, cartes-pastilles et forum-activite', () => {
  const r = zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/sous-forum-debuter.html': [] }));
  assert.equal(r.widened, false);
  // fixture lue aussi par cartes-pastilles (épopée 5, entrée 4) et forum-activite (épopée 6, entrée 2 : parcours « premier non lu »)
  assert.deepEqual(sorted(r.zones), ['cartes-pastilles', 'forum-activite', 'sous-forum']);
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
  assert.ok(routerText.includes("['s-2'], ['s-3']] },"));
  const r = viaRouter(routerText.replace("['s-2'], ['s-3']] },", "['s-2'], ['s-3'], ['t']] },"));
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
  const r = viaRouter(routerText.replace("['s-2'], ['s-3']] },", "['s-2']] },"));
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
check('template, hunk sans mot-clé dans le module ForumIndex (index du forum) : forum + sous-forum + forum-activite', () => {
  const t = tpl(['MODULE : ForumIndex:Presentation — index du forum', ['  function d() {', '    return 4;', '  }']]);
  const r = route(T, hunkAt(at(t, 'return 4'), '    const n = 4;'), t);
  assert.equal(r.widened, false, r.reasons.join(' ; '));
  assert.deepEqual(sorted(r.zones), ['forum', 'forum-activite', 'sous-forum']);
});
check('modale d\'ordre : module des modales, repères du socle et .bootbox-confirm -> modale-ordre + parler ; fixtures -> modale-ordre ; harnais Bootbox -> les deux', () => {
  assert.deepEqual(zonesOf('modale-ordre.mjs'), ['modale-ordre']);
  const t = tpl(['MODAL PERSONNAGE MOBILE - INTERACTIONS UX/UI', ['  function e() {', '    return 5;', '  }']]);
  const r = route(T, hunkAt(at(t, 'return 5'), '    const n = 5;'), t);
  assert.equal(r.widened, false, r.reasons.join(' ; '));
  assert.deepEqual(sorted(r.zones), ['modale-ordre', 'parler']);
  assert.deepEqual(sorted(route('kraland-theme.css', hunk('.x {', '.kr-order-modal .modal-footer .btn { margin: 0; }')).zones), ['modale-ordre', 'parler']);
  const css = route('kraland-theme.css', hunkAt(2, '  padding: 0;'), '.bootbox-confirm .modal-footer {\n  margin: 0;\n}');
  assert.equal(css.widened, false, css.reasons.join(' ; '));
  assert.deepEqual(sorted(css.zones), ['modale-ordre', 'parler']);
  assert.deepEqual(zonesFromDiff('REF', fakeGit({ 'tests/e2e/fixtures/modale-ordre/dormir.html': [] })).zones, ['modale-ordre']);
  assert.deepEqual(sorted(zonesFromDiff('REF', fakeGit({ 'tests/e2e/vendor/parler/bootbox.min.js': [] })).zones), ['modale-ordre', 'parler']);
});
check('activité du forum (épopée 6, entrée 2) : ligne de l\'index mobile, correctif « FIX MOBILE » et fichier de suite -> forum-activite', () => {
  assert.deepEqual(zonesOf('forum-activite.mjs'), ['forum-activite']);
  const css = route('kraland-theme.css', hunk('.x {', ':where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr { min-height: 72px; }'));
  assert.equal(css.widened, false, css.reasons.join(' ; '));
  assert.ok(css.zones.includes('forum-activite') && css.zones.includes('forum'), css.zones.join(','));
  assert.ok(css.units.includes('forum-index'), css.units.join(','));
  const t = tpl(['FIX MOBILE : Empêcher le scroll automatique vers #flap (mini-chat)', ['  if (x) {', '    return 6;', '  }']]);
  const sansMot = route(T, hunkAt(at(t, 'return 6'), '    const n = 6;'), t);
  assert.equal(sansMot.widened, false, sansMot.reasons.join(' ; '));
  assert.deepEqual(sansMot.zones, ['forum-activite']);
  const mot = route(T, hunk('function x() {', "  if (window.location.hash === '#flap') { history.scrollRestoration = 'manual'; }"));
  assert.equal(mot.widened, false, mot.reasons.join(' ; '));
  assert.ok(mot.zones.includes('forum-activite'), mot.zones.join(','));
  const suite = zonesFromDiff('REF', fakeGit({ 'tests/e2e/forum-activite.mjs': [] }));
  assert.equal(suite.widened, false);
  assert.deepEqual(suite.zones, []);
  assert.deepEqual(sorted(suite.units), ['confinement-reseau', 'forum-activite']);
});
check('fil d\'Ariane du forum (épopée 6, entrée 3) : règle CSS fusionnée, section commune et module ForumHeader -> forum-activite', () => {
  assert.ok(SUITES.find(s => s.file === 'forum-activite.mjs').frags.some(f => f.includes('fil')), 'fragment fil');
  const css = route('kraland-theme.css', hunk('.x {', ':where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb-current { min-width: 0; }'));
  assert.equal(css.widened, false, css.reasons.join(' ; '));
  assert.ok(css.zones.includes('forum-activite'), css.zones.join(','));
  const t = tpl(['FIL D\'ARIANE DU FORUM (H12.3)', ['  function f() {', '    return 7;', '  }']], ['MODULE : ForumHeader:MobileBreadcrumb', ['  function g() {', '    return 8;', '  }']]);
  const section = route(T, hunkAt(at(t, 'return 7'), '    const n = 7;'), t);
  assert.equal(section.widened, false, section.reasons.join(' ; '));
  assert.deepEqual(sorted(section.zones), ['forum', 'forum-activite', 'sous-forum']);
  const entete = route(T, hunkAt(at(t, 'return 8'), '    const n = 8;'), t);
  assert.equal(entete.widened, false, entete.reasons.join(' ; '));
  assert.deepEqual(sorted(entete.zones), ['forum', 'forum-activite', 'sous-forum']);
  const mot = route(T, hunk('function x() {', '  return createForumBreadcrumb([], titre);'));
  assert.ok(mot.zones.includes('forum-activite'), mot.zones.join(','));
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
  const ids = pickUnits(all, { zones: ['parler'], units: ['menus-forums#s-1', 'image-fallback'] }).map(u => u.id);
  assert.deepEqual(ids, ['parler-viewport#transitions', 'parler-viewport#fallback', 'parler-viewport#ajax+bureau', 'menus-forums#s-1', 'image-fallback']);
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
for (const [name, expected] of [['pagination', ['sous-forum']], ['rechargement', BASCULE], ['menus-forums', ['menus-forums']], ['images', ['images']], ['destinataires', ['kramail']], ['identite', ['plateau', 'profil']]]) {
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
