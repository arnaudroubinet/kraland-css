---
title: 'Refactor sweep'
type: 'refactor'
ticket: '8'
created: '2026-10-21'
status: 'built'
baseline_revision: 'a1ae6d5f9e5afdbd6fd6bd947eedefc753b1a35e'
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

**Problem:** Le code de l'épopée 1 garde des restes sans effet : un objet intermédiaire redondant, un nom de variable d'avant le changement, une règle CSS morte dans la zone des accès rapides, des commentaires de test mal placés ou périmés.

**Approach:** Nettoyage sans aucun changement de comportement, fixé au démarrage par une relecture du code de l'épopée (commits du lot 1 hors carte de Cybermonde).

</frozen-after-approval>

## Implementation Notes

Périmètre retenu : (1) `findNavigationLinks` parcourt `KR_GAME_SECTIONS` sans objet intermédiaire ; (2) variable `btn` renommée `section` dans `addQuickAccessButtons` ; (3) règle morte `.kr-quick-access-buttons .col-xs-6` supprimée (aucun `.col-xs-6` créé dans ce conteneur, grille sans row/col) ; (4) en-tête de `jeu-identite.mjs` : bloc `hors-forum-js` remonté avec les autres fragments, `cybermonde-ville.html` ajoutée à la liste des fixtures ; (5) commentaire périmé sur « l'ancien code du mini-profil » corrigé.
Écartés : unifier `:where(body.page-…)` et `body:where(…)` des gardes de la barre « Envoyer » (change la spécificité, pas un nettoyage) ; constats différés de la revue des tickets 1.1 à 1.5 (vérifications de bugs, tickets séparés, voir `deferred-work.md`).

## Verification

**Commands:**
- `npm run build`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:all` -- expected: 0 erreur, aucun FAIL

## Review Triage Log

Passe quick du 2026-10-21 : 1 low, patch — commentaire « Patterns à chercher… » laissé au-dessus de `const links = []` après la suppression de `patterns` ; reformulé et placé au-dessus de la boucle. Aucun changement de comportement relevé. Vérification : lint 0 erreur, `test:unit` 55/55, `test:all` 4219 ok, 0 FAIL.
