---
title: 'Un nom de personnage contenant « $ » est mal affiché dans le titre du panneau'
type: 'bugfix'
ticket: '3'
created: '2026-10-22'
status: done
baseline_revision: '8b2152f293fdbedbe9ea74c17cf6a7dae3165170'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur Personnage et Employés, le titre du panneau prend le nom mémorisé par `replace` avec une chaîne de remplacement : `$&`, `$'` et `$\`` y sont interprétés (`Jo$&hn` affiche `JoPersonnagehn`).

**Approach:** Remplacer le texte du titre par une fonction de remplacement, qui insère le nom tel quel ; test sur un nom contenant `$&`, avec un élément enfant dans le titre.

</frozen-after-approval>

## Implementation Notes

Oneshot : une ligne dans `applyCharacterIdentity` et deux scénarios dans le fragment `nom` de `jeu-identite.mjs`.

## Verification

**Commands:**
- `npm run build && KR_FRAG=nom node tests/e2e/jeu-identite.mjs` -- expected: rouge sur le bundle d'avant, vert après
- `npm run lint:js`, `npm run test:all` -- expected: 0 erreur, RÉSULTAT : VERT

## Review Triage Log

Passe quick du 2026-10-22 : 2 low, patch.
- low, patch — la conservation des blancs autour du libellé n'était pas testée (fixture sans blanc, mesure rognée) : scénario sur un titre natif entouré de sauts de ligne et tabulations, mesure du nœud texte brut ; contre-épreuve `textNode.data = name` : rouge.
- low, patch — motif `$$` absent du test et des commentaires : ajouté (`Ca$$h`).

Vérification : contre-épreuve sur le bundle d'avant (`JoPersonnagehn`) : rouge ; fragment `nom` vert ; `lint:js` 0 erreur ; `test:all` vert.
