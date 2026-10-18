// Kramail, champ « Destinataires » : format natif « Nom; Nom; » (le « ; » est le seul séparateur, un nom peut contenir une virgule),
// doublons, reprise d'une valeur déjà présente, repli des accents pour la recherche. Les pastilles, le clavier, l'annuaire et le blocage
// de l'envoi restent vérifiés de bout en bout par kramail-redaction (fragments dest-*, blocage-*, clavier…).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure, plain } from './lib/pure.mjs';

const { krKdSameKey, krKdFold, krKdFindMatch, krKdGroupTag, krKdSplitTyped, krKdDestValue, krKdChipsFromDest } = loadPure('destinataires');

test('saisie : « ; » sépare, la virgule non (nom avec virgule gardé entier)', () => {
  assert.deepEqual(plain(krKdSplitTyped('Dupont, Jean; Martin; Dur')), { names: ['Dupont, Jean', 'Martin'], rest: 'Dur' });
  assert.deepEqual(plain(krKdSplitTyped('A;B;C;')), { names: ['A', 'B', 'C'], rest: '' });
  assert.deepEqual(plain(krKdSplitTyped(' ; ;  Alice ;   bo')), { names: ['Alice'], rest: 'bo' });
  assert.deepEqual(plain(krKdSplitTyped('Alice;  ')), { names: ['Alice'], rest: '' });
  assert.deepEqual(plain(krKdSplitTyped('Le Roi, la Reine;')), { names: ['Le Roi, la Reine'], rest: '' });
});

test('valeur native de #dest : « Nom; » par pastille, rien sans pastille', () => {
  assert.equal(krKdDestValue(['Dupont, Jean', 'Martin']), 'Dupont, Jean; Martin; ');
  assert.equal(krKdDestValue([]), '');
});

test('reprise de #dest (retour arrière, brouillon) : sans doublon (casse, espaces), espaces internes réduits, virgules gardées', () => {
  assert.deepEqual(plain(krKdChipsFromDest('Dupont, Jean; Martin;  martin ;Le   Roi;;')), ['Dupont, Jean', 'Martin', 'Le Roi']);
  assert.deepEqual(plain(krKdChipsFromDest('')), []);
  assert.deepEqual(plain(krKdChipsFromDest(null)), []);
  // aller-retour : la valeur écrite se relit à l'identique
  const chips = ['Dupont, Jean', 'Élise', 'Le Roi'];
  assert.deepEqual(plain(krKdChipsFromDest(krKdDestValue(chips))), chips);
});

test('doublons : casse et espaces ignorés, accents comptés', () => {
  assert.equal(krKdSameKey('  Le   ROI '), 'le roi');
  assert.equal(krKdSameKey('Élise') === krKdSameKey('elise'), false);
});

test('recherche : accents et casse repliés, partie trouvée soulignée sur les caractères d\'origine, début du nom repéré', () => {
  const m = plain(krKdFindMatch('Élise Dupré', 'dupre'));
  assert.equal(m.chars.slice(m.start, m.end).join(''), 'Dupré');
  assert.equal(m.prefix, false);
  assert.equal(krKdFindMatch('Élise', 'eli').prefix, true);
  assert.equal(krKdFindMatch('Le Roi', 'e').prefix, false, 'trouvé au 2e caractère : pas le début du nom');
  assert.equal(krKdFindMatch('Élise', '  '), null);
  assert.equal(krKdFindMatch('Élise', 'xyz'), null);
  assert.equal(plain(krKdFold('Œuf é')).folded, 'œuf e');
});

test('groupes : « Membres » et « Membre » -> Membre, autres libellés tels quels', () => {
  assert.equal(krKdGroupTag(' Membres '), 'Membre');
  assert.equal(krKdGroupTag('membre'), 'Membre');
  assert.equal(krKdGroupTag('Plateau'), 'Plateau');
  assert.equal(krKdGroupTag(null), '');
});
