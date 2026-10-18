// Rechargement au franchissement du seuil mobile/desktop : journal des rechargements, plafond, écart minimal, décision et texte du bandeau.
// La largeur réelle, le stockage refusé ou en lecture seule, la saisie en cours et le rechargement lui-même restent vérifiés de bout en
// bout par demarrage-mobile et breakpoint-switch (vraie transition de largeur, horloge simulée pour les fenêtres d'absence).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure, plain } from './lib/pure.mjs';

const { krRecentReloads, krReloadAllowedByLog, krBreakpointAction, krReloadBannerText, RELOAD_WINDOW_MS, RELOAD_MAX_COUNT, RELOAD_MIN_GAP_MS } = loadPure('rechargement');
const NOW = 1_800_000_000_000;

test('garde-fou : 10 rechargements par minute au plus, 1,2 s d\'écart au moins', () => {
  assert.equal(RELOAD_WINDOW_MS, 60000);
  assert.equal(RELOAD_MAX_COUNT, 10);
  assert.equal(RELOAD_MIN_GAP_MS, 1200);
});

test('journal : seules les dates numériques de la dernière minute comptent (ni futures, ni anciennes, ni valeurs étrangères)', () => {
  assert.deepEqual(plain(krRecentReloads([NOW - 59999, NOW - 60000, NOW - 1, NOW, NOW + 1, '123', null, NOW - 30000], NOW)), [NOW - 59999, NOW - 1, NOW, NOW - 30000]);
  assert.deepEqual(plain(krRecentReloads({ length: 2 }, NOW)), []);
  assert.deepEqual(plain(krRecentReloads(null, NOW)), []);
  assert.deepEqual(plain(krRecentReloads('[1,2]', NOW)), []);
});

test('plafond : 9 rechargements récents autorisent le 10e, 10 l\'interdisent', () => {
  const log = n => Array.from({ length: n }, (_, i) => NOW - 50000 + i * 2000);
  assert.equal(krReloadAllowedByLog(log(9), NOW), true);
  assert.equal(krReloadAllowedByLog(log(10), NOW), false);
  assert.equal(krReloadAllowedByLog(log(11), NOW), false);
});

test('écart minimal : un rechargement à moins de 1,2 s du précédent est refusé, à 1,2 s il passe', () => {
  assert.equal(krReloadAllowedByLog([], NOW), true);
  assert.equal(krReloadAllowedByLog([NOW - 1199], NOW), false);
  assert.equal(krReloadAllowedByLog([NOW - 1200], NOW), true);
  assert.equal(krReloadAllowedByLog([NOW - 5000, NOW - 100], NOW), false, 'le DERNIER rechargement fait foi');
});

test('décision : pas de franchissement -> bandeau retiré, sans sonder la saisie ni le stockage', () => {
  const never = () => { throw new Error('ne doit pas être appelé'); };
  assert.equal(krBreakpointAction(false, never, never), 'hide');
});

test('décision : saisie en cours -> bandeau « input », sans sonder le stockage (aucune écriture de sonde)', () => {
  const never = () => { throw new Error('ne doit pas être appelé'); };
  assert.equal(krBreakpointAction(true, () => true, never), 'input');
});

test('décision : garde-fou atteint ou stockage refusé -> bandeau « guard » ; sinon rechargement', () => {
  assert.equal(krBreakpointAction(true, () => false, () => false), 'guard');
  assert.equal(krBreakpointAction(true, () => false, () => true), 'reload');
});

test('texte du bandeau selon la raison ; raison inconnue = texte du garde-fou', () => {
  assert.equal(krReloadBannerText('input'), 'La mise en page s\'adaptera au prochain rechargement. Terminez votre saisie avant de recharger. ');
  assert.equal(krReloadBannerText('guard'), 'La mise en page s\'adaptera au prochain rechargement. Rechargez la page quand vous le souhaitez. ');
  assert.equal(krReloadBannerText('autre'), krReloadBannerText('guard'));
  assert.equal(krReloadBannerText(undefined), krReloadBannerText('guard'));
});
