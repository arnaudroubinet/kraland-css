// Identité du personnage (lot 1) : sections du jeu, section active, nom lu sur le plateau, au matériel ou aux bâtiments, et résolution R1 (cœur pur « identite »).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure, plain } from './lib/pure.mjs';

const { KR_GAME_SECTIONS, krActiveGameSection, krCharacterNameFromPage, krPageClasses, krResolveCharacterName } = loadPure('identite');

test('sections : libellés, URL, icônes (H1.6)', () => {
  assert.deepEqual(plain(KR_GAME_SECTIONS).map(s => [s.label, s.url, s.icon]), [
    ['Agir', '/jouer/plateau', 'fa-bolt'], ['Matériel', '/jouer/materiel', 'fa-suitcase'],
    ['Personnage', '/jouer/perso', 'fa-user'], ['Bâtiments', '/jouer/bat', 'fa-home'], ['Employés', '/jouer/pnj', 'fa-users']]);
});

test('section active, sous-chemins du plateau compris', () => {
  assert.equal(krActiveGameSection('/jouer/plateau/200002-11211-13-7956839652'), '/jouer/plateau');
  assert.equal(krActiveGameSection('/jouer/perso'), '/jouer/perso');
  assert.equal(krActiveGameSection('/forum/rp'), null);
  assert.equal(krActiveGameSection('/jouer/plateaux'), null);
});

test('classes de page : pages secondaires (épopée 9, entrée 4) avec la marge mobile, Contacts et forum exclus', () => {
  const sec = ['kr-page-secondaire', 'kr-marge-mobile'];
  ['/regles/base', '/monde/evenements', '/monde/citoyens', '/map', '/map/cybermonde', '/map/ville/x', '/communaute/membres',
    '/communaute/membres/krabot-1-644', '/communaute/stats', '/profil/interface'].forEach(p => assert.deepEqual(plain(krPageClasses(p)), sec, p));
  ['/contacts', '/communaute', '/profil', '/profil/interfaces', '/mondes', '/forum/rp', '/report', '/help'].forEach(p => assert.deepEqual(plain(krPageClasses(p)), [], p));
  assert.deepEqual(plain(krPageClasses('/aide')), ['kr-page-aide', 'kr-marge-mobile']);
  assert.deepEqual(plain(krPageClasses('/jouer/plateau')), ['kr-page-jeu', 'kr-marge-mobile']);
});

test('nom lu seulement sur plateau, matériel, bâtiments', () => {
  assert.equal(krCharacterNameFromPage('/jouer/plateau', ' Nerys '), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/plateau/200002-11211-13-7956839652', 'Nerys'), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/materiel', 'Nerys'), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/bat', 'Nerys'), 'Nerys');
  assert.equal(krCharacterNameFromPage('/jouer/perso', 'Personnage'), null);
  assert.equal(krCharacterNameFromPage('/jouer/pnj', 'Employés'), null);
  assert.equal(krCharacterNameFromPage('/jouer/plateau', '   '), null);
});

test('résolution et mémoire (R1)', () => {
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Nerys', null)), { name: 'Nerys', store: true });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Nerys', 'Nerys')), { name: 'Nerys', store: false });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', 'Syllabus', 'Nerys')), { name: 'Syllabus', store: true });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/perso', 'Personnage', 'Nerys')), { name: 'Nerys', store: false });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/pnj', 'Employés', null)), { name: null, store: false });
  assert.deepEqual(plain(krResolveCharacterName('/jouer/plateau', '   ', null)), { name: null, store: false });
});
