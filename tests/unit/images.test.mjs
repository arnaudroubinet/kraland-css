// Carte médiévale : correspondance /2/map/1/ et /2/map/1b/ -> /2/map/5/, exceptions explicites, noms absents de la cible, exclusions.
// Les tables réelles (CONFIG.MEDIEVAL_*), le prétest, le repli sur l'original et les plafonds de tentatives restent vérifiés de bout en
// bout par image-fallback et map-exclusions (requêtes comptées, images décodées).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure } from './lib/pure.mjs';

const { krMapImageName, krMapIsNoReplace, krMapReplacementFor } = loadPure('images');
const IMG = 'http://img7.kraland.org/2/map';
const ABSENT = { 1: new Set(['55_1.gif', '108.gif']), '1b': new Set(['12.gif']) };
const isAbsent = (variant, src) => ABSENT[variant].has(krMapImageName(src));
const OVERRIDES = { [`${IMG}/1/54.gif`]: 'https://i.imgur.com/yQaUb2q.png', [`${IMG}/1/108.gif`]: 'https://i.imgur.com/externe.png' };
const replace = src => krMapReplacementFor(src, OVERRIDES, isAbsent);

test('nom de fichier : sans chemin, paramètres ni ancre', () => {
  assert.equal(krMapImageName(`${IMG}/1/55_1.gif?v=2#x`), '55_1.gif');
  assert.equal(krMapImageName(`${IMG}/1b/7.gif#a?b`), '7.gif');
  assert.equal(krMapImageName('104.gif'), '104.gif');
});

test('règle générale : /1/ et /1b/ -> /5/, suffixes compris, reste de l\'URL intact', () => {
  assert.equal(replace(`${IMG}/1/104.gif`), `${IMG}/5/104.gif`);
  assert.equal(replace(`${IMG}/1/106_2.gif?x=1`), `${IMG}/5/106_2.gif?x=1`);
  assert.equal(replace(`${IMG}/1b/104.gif`), `${IMG}/5/104.gif`);
});

test('exception explicite : la cible externe gagne, même sur un nom absent de la cible', () => {
  assert.equal(replace(`${IMG}/1/54.gif`), 'https://i.imgur.com/yQaUb2q.png');
  assert.equal(replace(`${IMG}/1/108.gif`), 'https://i.imgur.com/externe.png');
});

test('nom absent de la variante cible : pas de remplacement (aucune requête vouée à l\'échec), par variante', () => {
  assert.equal(replace(`${IMG}/1/55_1.gif`), null);
  assert.equal(replace(`${IMG}/1/55_1.gif?cache=1`), null, 'paramètres ignorés pour le nom');
  assert.equal(replace(`${IMG}/1b/12.gif`), null);
  assert.equal(replace(`${IMG}/1/12.gif`), `${IMG}/5/12.gif`, 'absent en 1b seulement : remplacé en 1');
  assert.equal(replace(`${IMG}/1b/55_1.gif`), `${IMG}/5/55_1.gif`, 'absent en 1 seulement : remplacé en 1b');
});

test('hors carte ou source vide : pas de remplacement', () => {
  for (const src of ['', null, undefined, `${IMG}/5/104.gif`, `${IMG}/2/104.gif`, 'http://img7.kraland.org/2/world/logo2.gif', `${IMG}/10/104.gif`]) {
    assert.equal(replace(src), null, String(src));
  }
});

test('exclusions explicites (NO_REPLACE) : URL exacte seulement', () => {
  const noReplace = { [`${IMG}/1/200.gif`]: true };
  assert.equal(krMapIsNoReplace(`${IMG}/1/200.gif`, noReplace), true);
  assert.equal(krMapIsNoReplace(`${IMG}/1/200.gif?x`, noReplace), false);
  assert.equal(krMapIsNoReplace(`${IMG}/1/201.gif`, noReplace), false);
  assert.equal(krMapIsNoReplace(`${IMG}/1/200.gif`, undefined), false);
});
