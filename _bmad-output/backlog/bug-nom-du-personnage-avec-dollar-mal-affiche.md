---
id: 3
type: bug
title: "Un nom de personnage contenant « $ » est mal affiché dans le titre du panneau"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Un nom de personnage contenant « $ » est mal affiché dans le titre du panneau

## Description

Sur Personnage et Employés, le titre du panneau latéral prend le nom du personnage mémorisé. Si ce nom contient certaines suites commençant par « $ » (`$&`, `$'`, `` $` ``), le titre affiché est altéré. Le titre doit afficher le nom tel quel.

## Reproduction

1. Mémoriser le nom `Jo$&hn` (clé `kr-character-name`), par exemple en visitant le plateau d'un personnage de ce nom.
2. Ouvrir `/jouer/perso` sur ordinateur.
3. Constaté : le titre affiche `JoPersonnagehn`. Attendu : `Jo$&hn`.

Reproduit le 2026-10-22 hors navigateur : `'Personnage'.replace('Personnage', 'Jo$&hn')` donne `JoPersonnagehn`.

## Cause Hypothesis

Le remplacement du texte du titre passe le nom comme chaîne de remplacement : les motifs spéciaux de `replace` y sont interprétés (ticket 1.4, correction de revue `df0d75a`).

## Acceptance Criteria

1. **Le nom s'affiche tel quel**
   **Given** un nom mémorisé contenant `$&`, `$'` ou `` $` ``
   **When** Personnage ou Employés s'affiche
   **Then** le titre du panneau montre le nom exact, et l'espace avant un élément enfant du titre est conservé
   **And** le mini-profil, qui ne passe pas par ce remplacement, montre toujours le nom exact (non-régression)
2. **Tests couvrent le cas trouvé et corrigé**
   **Given** la suite `jeu-identite`
   **When** elle tourne
   **Then** un test sur un nom contenant `$&` passe, et échoue sur le bundle d'avant la correction
3. **Ou : aucun changement nécessaire, preuve à l'appui**
   **Given** la reproduction ci-dessus
   **When** elle est rejouée sur le code courant
   **Then** si le titre affiche déjà le nom exact, le ticket se ferme avec cette preuve, sans changement

## Boundaries

- Must not change: le repli sur le titre natif sans nom connu, la mémorisation du nom.

## References

- parent — none
- retro — _bmad-output/initiative-harmonisation-ux/epic-identite-et-defauts/epic-identite-et-defauts-retrospective.md, Action items 2

## Notes

- Assumption: on ignore si un nom de personnage Kraland peut contenir « $ » ; la correction est faite quand même, elle est triviale et sans effet sur les autres noms.
