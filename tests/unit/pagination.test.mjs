// Pagination compacte du sous-forum en mobile (lot L5) : séquence affichée d'après les numéros natifs de DataTables et la page courante.
// Le masquage dans le DOM, le « … » natif et le retour au bureau restent vérifiés de bout en bout par sous-forum (l5-pagination-*).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPure, plain } from './lib/pure.mjs';

const { krCompactPageLayout } = loadPure('pagination');

// Rendu lisible : numéros visibles, « … » à chaque saut (comme le joueur le voit).
function shown(nums, current) {
  const layout = plain(krCompactPageLayout(nums, current));
  assert.equal(layout.length, nums.length);
  const out = [];
  layout.forEach((l, i) => {
    if (l.hidden) { assert.equal(l.gapBefore, false, 'un bouton masqué ne porte jamais de « … »'); return; }
    if (l.gapBefore) { out.push('…'); }
    out.push(nums[i]);
  });
  return out.join(' ');
}

test('début de liste : 1 2 3 … dernière', () => {
  assert.equal(shown([1, 2, 3, 4, 5, 15], 1), '1 2 3 … 15');
  assert.equal(shown([1, 2, 3, 4, 5, 15], 2), '1 2 3 … 15');
});

test('milieu : première … courante … dernière', () => {
  assert.equal(shown([1, 7, 8, 9, 15], 8), '1 … 8 … 15');
  assert.equal(shown([1, 3, 4, 5, 15], 4), '1 … 4 … 15');
  assert.equal(shown([1, 2, 3, 4, 5, 15], 3), '1 … 3 … 15');
});

test('fin de liste : 1 … avant-avant-dernière, avant-dernière, dernière', () => {
  assert.equal(shown([1, 11, 12, 13, 14, 15], 15), '1 … 13 14 15');
  assert.equal(shown([1, 11, 12, 13, 14, 15], 14), '1 … 13 14 15');
});

test('peu de pages : tout reste visible, sans « … »', () => {
  assert.equal(shown([1], 1), '1');
  assert.equal(shown([1, 2], 2), '1 2');
  assert.equal(shown([1, 2, 3], 2), '1 2 3');
  assert.equal(shown([1, 2, 3, 4], 1), '1 2 3 4');
  assert.equal(shown([1, 2, 3, 4], 4), '1 2 3 4');
});

test('aucun bouton courant : la première page fait foi', () => {
  assert.equal(shown([1, 2, 3, 4, 5, 15], null), '1 2 3 … 15');
});

test('liste native sans la page 1 (fenêtre décalée) : la page 1 reste la référence, la fenêtre est réduite à la courante', () => {
  assert.equal(shown([7, 8, 9, 15], 8), '8 … 15');
});

test('propriétés sur toutes les combinaisons (2 à 30 pages, toute page courante, fenêtre native de 5) : première, courante et dernière visibles, « … » exactement aux sauts', () => {
  for (let total = 2; total <= 30; total += 1) {
    for (let cur = 1; cur <= total; cur += 1) {
      // Fenêtre native de DataTables 1.10 (full_numbers, 7 boutons) : 1 … c-1 c c+1 … total, ou 1-5 … total, ou 1 … total-4..total
      let nums;
      if (total <= 7) { nums = Array.from({ length: total }, (_, i) => i + 1); } else if (cur <= 4) { nums = [1, 2, 3, 4, 5, total]; } else if (cur >= total - 3) { nums = [1, total - 4, total - 3, total - 2, total - 1, total]; } else { nums = [1, cur - 1, cur, cur + 1, total]; }
      const layout = plain(krCompactPageLayout(nums, cur));
      const visible = nums.filter((_, i) => !layout[i].hidden);
      for (const must of [1, cur, total]) { assert.ok(visible.includes(must), `${total} pages, courante ${cur} : ${must} visible`); }
      assert.ok(visible.length <= 5, `${total} pages, courante ${cur} : au plus 5 numéros visibles (${visible.join(' ')})`);
      visible.forEach((n, k) => {
        const i = nums.indexOf(n);
        assert.equal(layout[i].gapBefore, k > 0 && n - visible[k - 1] > 1, `${total}/${cur} : « … » avant ${n}`);
      });
    }
  }
});
