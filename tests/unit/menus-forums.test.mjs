// Menus Forum : analyse de la liste latérale native (signaux de refus, destinations, doublons, exclusions) et fusion avec la liste mémorisée
// (date, refus conservés, borne de 7 jours, date future). Le relevé DOM (même origine, blocs de la peau, libellé sans décoration), le
// dessin du menu, le cache HTTP, le retour arrière et l'autre onglet restent vérifiés de bout en bout par menus-forums (fragments A à S).
// Signaux de refus : les fragments R et S ne rejouent plus de bout en bout que la classe « disabled » (plus un passage qui mêle les trois
// signaux) ; aria-disabled="true" et l'attribut disabled, qui ne changeaient que la détection, sont couverts ici scénario par scénario.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure, plain } from './lib/pure.mjs';

const P = loadPure('menus-forums');
const { krForumNormalizePath, krForumIsExcluded, krForumMenuForPath, krForumIsDisabledEntry, krForumAnalyzeSidebar, krForumParseStored,
  krForumMergeStored, krForumListState, FORUM_MENUS, FORUM_STALE_MS, FORUM_MAX_AGE_MS } = P;
const RP = FORUM_MENUS[0];
const HRP = FORUM_MENUS[1];
const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;

// Entrée relevée comme le fait parseSidebar : href brut, destination normalisée, attributs bruts, libellé.
const SIGNALS = {
  class: { cls: 'list-group-item disabled', aria: null, disabledAttr: false },
  aria: { cls: 'list-group-item', aria: 'true', disabledAttr: false },
  attr: { cls: 'list-group-item', aria: null, disabledAttr: true }
};
const on = (name, slug) => ({ href: `forum/rp/${slug}`, key: `/forum/rp/${slug}`, cls: 'list-group-item', aria: null, disabledAttr: false, name });
const off = (name, slug, how) => ({ ...on(name, slug), ...SIGNALS[how] });
const analyze = (entries, menu = RP) => plain(krForumAnalyzeSidebar(entries, menu));

const TAVERNE = ['Taverne', 'taverne-10101'];
const MARCHE = ['Marché', 'marche-10102'];
const MONDE = ['Monde', 'monde-10103'];
const ALPHA = ['Alpha', 'alpha-1'];
const BRAVO = ['Bravo', 'bravo-2'];

// Mémoire simulée d'une colonne : lecture (parse) -> fusion -> écriture, comme readStored / writeStored.
function column() {
  let raw = null;
  return {
    read: () => plain(krForumParseStored(raw)),
    write(res, at, now = at) {
      const record = krForumMergeStored(krForumParseStored(raw), res.forums, at, res.denied, res.active, now);
      if (record) { raw = JSON.stringify(record); }
      return !!record;
    },
    state: now => plain(krForumListState(krForumParseStored(raw), now))
  };
}

test('configuration des cinq menus : chemins, libellés de repli, raccourcis fixes, exclusion désactivée en HRP', () => {
  assert.deepEqual(plain(FORUM_MENUS).map(m => [m.id, m.path, m.staticCount, !!m.noExclusion]), [
    ['rp', '/forum/rp', 4, false], ['hrp', '/forum/hrp', 0, true], ['communaute', '/forum/communaute', 0, false],
    ['debats', '/forum/debats', 0, false], ['staff', '/forum/staff', 0, false]
  ]);
  assert.equal(FORUM_STALE_MS, DAY);
  assert.equal(FORUM_MAX_AGE_MS, 7 * DAY);
});

test('chemins : normalisation (barre finale, casse) et catégorie d\'une page', () => {
  assert.equal(krForumNormalizePath('/forum/RP/Taverne-10101//'), '/forum/rp/taverne-10101');
  assert.equal(krForumNormalizePath(null), '');
  assert.equal(krForumMenuForPath('/forum/rp').id, 'rp');
  assert.equal(krForumMenuForPath('/forum/RP/alpha-1/').id, 'rp');
  assert.equal(krForumMenuForPath('/forum/hrp/annonces-9').id, 'hrp');
  assert.equal(krForumMenuForPath('/forum/rpg'), null, 'préfixe sans barre : autre chemin');
  assert.equal(krForumMenuForPath('/forum'), null);
  assert.equal(krForumMenuForPath('/forum/sujet/un-1-1'), null);
});

test('exclusions exactes (Taverne, Marché, Monde, Communauté, Débats, Staff), sauf en HRP', () => {
  for (const n of ['Taverne', ' marché ', 'MONDE', 'Communauté', 'débats', 'Staff']) { assert.equal(krForumIsExcluded(RP, n), true, n); }
  for (const n of ['Taverne du port', 'Mondes', 'Marche']) { assert.equal(krForumIsExcluded(RP, n), false, n); }
  assert.equal(krForumIsExcluded(HRP, 'Taverne'), false);
});

test('signaux de refus : classe disabled, aria-disabled="true", attribut disabled ; un simple style n\'en est pas un', () => {
  for (const how of Object.keys(SIGNALS)) { assert.equal(krForumIsDisabledEntry(SIGNALS[how]), true, how); }
  assert.equal(krForumIsDisabledEntry({ cls: 'disabled' }), true);
  assert.equal(krForumIsDisabledEntry({ cls: '  list-group-item\tdisabled\n' }), true, 'jetons séparés par des blancs ASCII, comme classList');
  for (const cls of ['list-group-item', 'text-muted grey inactive', 'is-disabled', 'disabled-look', 'Disabled', '']) {
    assert.equal(krForumIsDisabledEntry({ cls, aria: null, disabledAttr: false }), false, cls);
  }
  for (const aria of ['false', 'TRUE', '', null]) { assert.equal(krForumIsDisabledEntry({ cls: 'list-group-item', aria, disabledAttr: false }), false, String(aria)); }
  assert.equal(krForumIsDisabledEntry({ cls: null, aria: null, disabledAttr: false }), false);
});

test('liste lue : destinations de la catégorie seulement, doublons par destination, exclusions, libellé vide ignoré', () => {
  const res = analyze([
    on(...TAVERNE), on(...ALPHA), { ...on('Alpha bis', 'alpha-1') }, on(...BRAVO), on('', 'vide-3'),
    { href: 'kramail', key: '/kramail', cls: 'list-group-item', aria: null, disabledAttr: false, name: 'Kramail' },
    { href: 'forum/hrp/autre-5', key: '/forum/hrp/autre-5', cls: 'list-group-item', aria: null, disabledAttr: false, name: 'Autre catégorie' },
    { href: 'forum/rp', key: '/forum/rp', cls: 'list-group-item', aria: null, disabledAttr: false, name: 'Jeu (RP)' }
  ]);
  assert.deepEqual(res, { ok: true, forums: [{ name: 'Alpha', url: 'forum/rp/alpha-1' }, { name: 'Bravo', url: 'forum/rp/bravo-2' }], denied: [],
    active: ['/forum/rp/taverne-10101', '/forum/rp/alpha-1', '/forum/rp/bravo-2'] });
});

test('source dégradée : aucun lien de la catégorie (ni actif ni désactivé) -> no-links, jamais une liste vide', () => {
  assert.deepEqual(analyze([]), { ok: false, reason: 'no-links' });
  assert.deepEqual(analyze([on('', 'vide-3')]), { ok: false, reason: 'no-links' });
  // désactivés hors catégorie seulement (Kramail, autre catégorie) : pas une preuve
  assert.deepEqual(analyze([{ href: 'kramail', key: '/kramail', ...SIGNALS.class, name: 'Kramail' }, { href: 'forum/hrp/a-5', key: '/forum/hrp/a-5', ...SIGNALS.class, name: 'A' }]), { ok: false, reason: 'no-links' });
});

test('liste de raccourcis fixes seuls (Taverne, Marché, Monde en RP) : liste vide VALIDE', () => {
  assert.deepEqual(analyze([on(...TAVERNE), on(...MARCHE), on(...MONDE)]).forums, []);
  assert.equal(analyze([on(...TAVERNE)]).ok, true);
});

test('même destination active ET désactivée : l\'entrée active prouve l\'accès, aucun refus', () => {
  for (const how of Object.keys(SIGNALS)) {
    const res = analyze([on(...ALPHA), off(...ALPHA, how), off(...BRAVO, how)]);
    assert.deepEqual(res.forums.map(f => f.name), ['Alpha'], how);
    assert.deepEqual(res.denied, ['/forum/rp/bravo-2'], how);
  }
});

// R (Q3) rejoué pour chaque signal : liste mixte, tout désactivé, source absente, accès rétabli. L'e2e R garde la classe de bout en bout.
for (const how of Object.keys(SIGNALS)) {
  test(`R (${how}) : un forum désactivé est retiré, tout désactivé vide la liste, une source absente ne réintroduit rien, l'accès rétabli revient`, () => {
    const col = column();
    let t = NOW;
    assert.ok(col.write(analyze([on(...TAVERNE), on(...MARCHE), on(...MONDE), on(...ALPHA), on(...BRAVO)]), t));
    assert.deepEqual(col.read().forums.map(f => f.name), ['Alpha', 'Bravo'], 'précondition');
    // liste mixte : Bravo devient inaccessible
    t += 1000;
    assert.ok(col.write(analyze([on(...ALPHA), off(...BRAVO, how)]), t));
    assert.deepEqual(col.read().forums.map(f => f.name), ['Alpha']);
    assert.equal(col.state(t).state, 'fresh');
    // tout désactivé : plus aucun forum, état « empty »
    t += 1000;
    const all = analyze([off(...ALPHA, how), off(...BRAVO, how)]);
    assert.deepEqual(all, { ok: true, forums: [], denied: ['/forum/rp/alpha-1', '/forum/rp/bravo-2'], active: [] });
    assert.ok(col.write(all, t));
    assert.deepEqual(col.read().forums, []);
    assert.deepEqual(col.state(t), { usable: true, state: 'empty' });
    // source absente : rien n'est écrit, la dernière liste connue (vide) reste
    assert.deepEqual(analyze([]), { ok: false, reason: 'no-links' });
    assert.deepEqual(col.state(t + 1000), { usable: true, state: 'empty' });
    // accès rétabli : Alpha et Bravo de nouveau lus, refus levés par les entrées actives
    t += 2000;
    assert.ok(col.write(analyze([on(...TAVERNE), on(...MARCHE), on(...MONDE), on(...ALPHA), on(...BRAVO)]), t));
    assert.deepEqual(col.read().forums.map(f => f.name), ['Alpha', 'Bravo']);
    assert.deepEqual(col.read().denied, []);
  });

  // S (M1) rejoué pour chaque signal : refus d'un raccourci fixe mémorisé, conservé sur source absente ou partielle, levé par une entrée active.
  test(`S (${how}) : Taverne refusée reste refusée (source absente, liste partielle), tout refusé, puis rétablie par une entrée active`, () => {
    const col = column();
    let t = NOW;
    col.write(analyze([on(...TAVERNE), on(...MARCHE), on(...MONDE), on(...ALPHA), on(...BRAVO)]), t);
    assert.deepEqual(col.read().denied, []);
    t += 1000;
    col.write(analyze([off(...TAVERNE, how), on(...MARCHE), on(...MONDE), on(...ALPHA), on(...BRAVO)]), t);
    assert.deepEqual(col.read().denied, ['/forum/rp/taverne-10101']);
    assert.deepEqual(col.read().forums.map(f => f.name), ['Alpha', 'Bravo']);
    // source absente : rien de nouveau, refus conservé
    assert.equal(analyze([]).ok, false);
    assert.deepEqual(col.read().denied, ['/forum/rp/taverne-10101']);
    // liste partielle sans Taverne : l'absence ne lève pas le refus
    t += 1000;
    col.write(analyze([on(...ALPHA)]), t);
    assert.deepEqual(col.read().denied, ['/forum/rp/taverne-10101']);
    // tout refusé : les trois raccourcis et les forums
    t += 1000;
    col.write(analyze([TAVERNE, MARCHE, MONDE, ALPHA, BRAVO].map(e => off(...e, how))), t);
    assert.deepEqual(col.read().denied.slice().sort(), ['/forum/rp/alpha-1', '/forum/rp/bravo-2', '/forum/rp/marche-10102', '/forum/rp/monde-10103', '/forum/rp/taverne-10101']);
    assert.deepEqual(col.state(t), { usable: true, state: 'empty' });
    // accès rétabli
    t += 1000;
    col.write(analyze([on(...TAVERNE), on(...MARCHE), on(...MONDE), on(...ALPHA), on(...BRAVO)]), t);
    assert.deepEqual(col.read().denied, []);
    assert.deepEqual(col.read().forums.map(f => f.name), ['Alpha', 'Bravo']);
  });
}

test('mémoire : entrée illisible ou d\'un ancien format ignorée ; refus absents = aucun refus ; JSON cassé remonte une exception', () => {
  assert.equal(krForumParseStored(null), null);
  assert.equal(krForumParseStored(''), null);
  assert.equal(krForumParseStored('[{"name":"Alpha"}]'), null, 'ancien tableau nu');
  assert.equal(krForumParseStored('{"v":1,"at":1,"forums":[]}'), null);
  assert.equal(krForumParseStored('{"v":2,"at":"1","forums":[]}'), null);
  assert.equal(krForumParseStored('{"v":2,"at":1,"forums":{}}'), null);
  assert.deepEqual(plain(krForumParseStored('{"v":2,"at":1,"forums":[]}')), { v: 2, at: 1, forums: [], denied: [] });
  assert.deepEqual(plain(krForumParseStored('{"v":2,"at":1,"forums":[],"denied":["/a",3,null,"/b"]}')).denied, ['/a', '/b']);
  assert.throws(() => krForumParseStored('{cassé'), err => err.name === 'SyntaxError');
});

test('fusion : une lecture plus ancienne n\'écrase pas une entrée plus récente (autre onglet), sauf entrée datée de plus de 60 s dans le futur', () => {
  const cur = { v: 2, at: NOW, forums: [{ name: 'Récent', url: 'forum/rp/r-1' }], denied: [] };
  assert.equal(krForumMergeStored(cur, [], NOW - 1, [], [], NOW), null);
  assert.equal(krForumMergeStored({ ...cur, at: NOW + 60000 }, [], NOW - 1, [], [], NOW), null, 'futur de 60 s : encore une référence');
  assert.deepEqual(plain(krForumMergeStored({ ...cur, at: NOW + 60001 }, [], NOW - 1, [], [], NOW)), { v: 2, at: NOW - 1, forums: [], denied: [] });
  assert.deepEqual(plain(krForumMergeStored(cur, [], NOW, [], [], NOW)), { v: 2, at: NOW, forums: [], denied: [] }, 'même date : écrite');
  assert.deepEqual(plain(krForumMergeStored(null, [{ name: 'A', url: 'u' }], NOW, null, null, NOW)), { v: 2, at: NOW, forums: [{ name: 'A', url: 'u' }], denied: [] });
});

test('fusion des refus : (mémorisés ∪ nouveaux) − destinations actives lues, sans doublon', () => {
  const cur = { v: 2, at: NOW - 10, forums: [], denied: ['/forum/rp/taverne-10101', '/forum/rp/monde-10103'] };
  assert.deepEqual(plain(krForumMergeStored(cur, [], NOW, ['/forum/rp/marche-10102', '/forum/rp/taverne-10101'], ['/forum/rp/monde-10103'], NOW)).denied,
    ['/forum/rp/taverne-10101', '/forum/rp/marche-10102']);
});

test('âge de la liste : fraîche < 24 h, ancienne jusqu\'à 7 jours, puis indisponible ; date future tolérée à 60 s ; refus gardés quel que soit l\'âge', () => {
  const st = (ageMs, forums = [{ name: 'A', url: 'u' }]) => plain(krForumListState({ v: 2, at: NOW - ageMs, forums, denied: ['/x'] }, NOW));
  assert.deepEqual(plain(krForumListState(null, NOW)), { usable: false, state: 'unavailable' });
  assert.deepEqual(st(0), { usable: true, state: 'fresh' });
  assert.deepEqual(st(DAY), { usable: true, state: 'fresh' });
  assert.deepEqual(st(DAY + 1), { usable: true, state: 'stale' });
  assert.deepEqual(st(2 * DAY), { usable: true, state: 'stale' });
  assert.deepEqual(st(6 * DAY), { usable: true, state: 'stale' });
  assert.deepEqual(st(7 * DAY), { usable: true, state: 'stale' });
  assert.deepEqual(st(7 * DAY + 1), { usable: false, state: 'unavailable' });
  assert.deepEqual(st(8 * DAY), { usable: false, state: 'unavailable' });
  assert.deepEqual(st(-60000), { usable: true, state: 'fresh' });
  assert.deepEqual(st(-60001), { usable: false, state: 'unavailable' });
  assert.deepEqual(st(DAY * 3, []), { usable: true, state: 'empty' });
});
