// Pied de page : « mise à jour disponible » seulement si la version publiée (version.json) est plus récente que l'installée (backlog 17).
// Versions « 1.0.<horodatage> » comparées segment par segment ; une version illisible ne produit pas d'avertissement.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure } from './lib/pure.mjs';

const { krIsUpdateAvailable } = loadPure('version');

test('version publiée plus récente : avertissement', () => {
  assert.equal(krIsUpdateAvailable('1.0.100', '1.0.200'), true);
  assert.equal(krIsUpdateAvailable('1.0.1761900000000', '1.0.1761986400000'), true);
  assert.equal(krIsUpdateAvailable('1.0.999', '1.1.0'), true);
});

test('version installée égale ou plus récente : aucun avertissement', () => {
  assert.equal(krIsUpdateAvailable('1.0.200', '1.0.200'), false);
  assert.equal(krIsUpdateAvailable('1.0.200', '1.0.100'), false);
  // comparaison numérique, pas alphabétique : « 9 » < « 10 »
  assert.equal(krIsUpdateAvailable('1.0.10', '1.0.9'), false);
  assert.equal(krIsUpdateAvailable('1.0.9', '1.0.10'), true);
});

test('segments manquants comptés comme 0', () => {
  assert.equal(krIsUpdateAvailable('1.0', '1.0.0'), false);
  assert.equal(krIsUpdateAvailable('1.0', '1.0.1'), true);
});

test('version publiée ou installée illisible : aucun avertissement', () => {
  for (const bad of [undefined, null, '', 'abc', '1.0.x', '1..2', 'v1.0.300', 300]) {
    assert.equal(krIsUpdateAvailable('1.0.100', bad), false, String(bad));
    assert.equal(krIsUpdateAvailable(bad, '1.0.200'), false, String(bad));
  }
});
