// Chargeur du cœur pur : il échoue franchement sur un bloc absent, dupliqué, non fermé, imbriqué ou impur (condition 2 d'Elisabeth, R3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadPure, pureBlocks, forbiddenRefs, TEMPLATE } from './lib/pure.mjs';

const BLOCKS = ['pagination', 'rechargement', 'menus-forums', 'images', 'destinataires'];
const text = fs.readFileSync(TEMPLATE, 'utf8');
const block = (name, body) => `  // @kr-pure-begin ${name}\n${body}\n  // @kr-pure-end\n`;
const ok = '  function f() { return 1; }';

test('le template porte exactement les blocs purs attendus, chacun une fois', () => {
  assert.deepEqual([...pureBlocks(text).keys()].sort(), [...BLOCKS].sort());
});

test('chaque bloc se charge dans un contexte vide et n\'expose que des déclarations', () => {
  for (const name of BLOCKS) {
    const api = loadPure(name);
    assert.ok(Object.keys(api).length > 0, name);
  }
});

test('bloc absent : erreur franche', () => {
  assert.throws(() => loadPure('inexistant'), /absent/);
  assert.throws(() => loadPure('pagination', { text: text.replace(/ {2}\/\/ @kr-pure-begin pagination[\s\S]*?\/\/ @kr-pure-end\n/, '') }), /absent/);
  // balise d'ouverture seule retirée : la fermeture devient orpheline
  assert.throws(() => loadPure('pagination', { text: text.replace('// @kr-pure-begin pagination', '// bloc retiré') }), /sans ouverture/);
});

test('bloc dupliqué : erreur franche', () => {
  assert.throws(() => pureBlocks(block('a', ok) + block('a', ok)), /dupliqué/);
  assert.throws(() => loadPure('images', { text: text + block('images', ok) }), /dupliqué/);
});

test('bloc non fermé, fermeture orpheline, imbrication, balise illisible : erreur franche', () => {
  assert.throws(() => pureBlocks(`  // @kr-pure-begin a\n${ok}\n`), /jamais fermé/);
  assert.throws(() => pureBlocks(`${ok}\n  // @kr-pure-end\n`), /sans ouverture/);
  assert.throws(() => pureBlocks(`  // @kr-pure-begin a\n  // @kr-pure-begin b\n${ok}\n  // @kr-pure-end\n  // @kr-pure-end\n`), /non fermé/);
  assert.throws(() => pureBlocks('  // @kr-pure-begin\n'), /illisible/);
  const unclosed = text.replace(/(\/\/ @kr-pure-begin destinataires[\s\S]*?)\n {2}\/\/ @kr-pure-end/, '$1');
  assert.throws(() => loadPure('destinataires', { text: unclosed }), /non fermé|jamais fermé/);
});

test('bloc impur (référence au navigateur, au stockage, à l\'heure) : refusé à la lecture et à l\'exécution', () => {
  assert.deepEqual(forbiddenRefs('  function f() { return document.body; }'), ['document']);
  assert.deepEqual(forbiddenRefs('  function f() { return Date.now() + sessionStorage.length; }'), ['sessionStorage', 'Date']);
  // Mention dans un commentaire ou une chaîne : pas une référence
  assert.deepEqual(forbiddenRefs('  // lit window.location\n  function f() { return \'document\'; }'), []);
  assert.throws(() => loadPure('a', { text: block('a', '  function f() { return window.innerWidth; }') }), /impur.*window/);
  // Contexte vide : même une référence non listée échoue à l'appel (aucun global du navigateur ni de Node)
  const api = loadPure('a', { text: block('a', '  function f() { return process.pid; }') });
  assert.throws(() => api.f(), err => err.name === 'ReferenceError');
});
