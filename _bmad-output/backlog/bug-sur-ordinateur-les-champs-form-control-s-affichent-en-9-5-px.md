---
id: 14
type: bug
title: "Sur ordinateur, les champs `.form-control` s'affichent en 9,5 px"
parent: none
covers: []
after: []
assignee: ""
refined: false
hitl: false
risk: medium
severity: P2
---

# Sur ordinateur, les champs `.form-control` s'affichent en 9,5 px

## Description

Sur ordinateur (≥ 768 px), le texte des champs `input` et `select` `.form-control` s'affiche en 9,5 px au lieu des 14 px natifs de Bootstrap. C'est très visible sur le sélecteur de personnage de `/report`, mesuré dans le popup 900×800. La règle en cause est globale : tous les `input` et `select` `.form-control` hors mobile sont touchés. Le mobile n'est pas touché (16 px). Constaté au ticket 8.5 ; défaut antérieur à l'épopée.

L'étendue relevée dans la feuille de style est dans Notes.

## Reproduction

1. Fixture `report-non-lu.html` (servie à `/report/perso-000000`), vrai Bootstrap 3.3.7, bundle construit depuis 49d31df.
2. Fenêtre de 900×800, rendu ordinateur, Kraland clair.
3. Lire le `font-size` calculé du sélecteur de personnage (`select.form-control`).
4. Constaté : 9,5 px (hauteur 34 px). La règle gagnante est la règle globale des champs de la peau, en `0.95rem`.
5. Attendu : 14 px, comme sans la peau (mesuré peau coupée sur la même fixture).
6. À 375 px : 16 px, attendu et inchangé.

## Cause Hypothesis

La règle globale des champs exprime sa taille et son retrait en rem, comme si 1 rem valait 16 px. Avec Bootstrap 3, 1 rem vaut 10 px. Aucune règle ordinateur ne la bat, alors que le mobile a sa propre taille en `!important`.

## Acceptance Criteria

1. **Champs à 14 px sur ordinateur**
   **Given** une page de fixture avec un `select.form-control` et un `input.form-control` (le sélecteur de personnage de `report-non-lu` compris)
   **When** la page est rendue à 768 et 1280 px, en Kraland clair et en Empire Brun sombre
   **Then** le `font-size` calculé de chaque champ vaut 14 px (`--kr-font-body`), et un `textarea.form-control` reste à 14 px
2. **Mobile inchangé**
   **Given** les mêmes fixtures
   **When** elles sont rendues à 375 et 767 px
   **Then** les champs `.form-control` gardent leurs 16 px, et leur retrait reste celui d'avant le correctif
3. **Tests couvrent le cas**
   **Given** une suite e2e sur fixture
   **When** elle tourne
   **Then** elle mesure la taille calculée des champs à 768 et 1280 px dans les deux variantes et à 375 px, passe sur le correctif, et échoue sur le bundle de 2bdc8e1 (contre-épreuve par `KR_SCRIPT`)
4. **Ou : aucun changement nécessaire, avec preuve**
   **Given** la reproduction
   **When** elle est rejouée sur le code courant
   **Then** les champs sont déjà à 14 px sur ordinateur, avec la mesure notée dans Notes — ce critère remplace 1 à 3

## Boundaries

- Must not change : tailles et retraits mobiles des champs (16 px, cibles tactiles), taille du `textarea` (14 px), rayon et bordure des champs, échelle typographique de DESIGN.md.
- Seuils : vérifier 767, 768 et 769 px, et la bascule dans les deux sens dans le même onglet.

## References

- parent — none
- revue — _bmad-output/initiative-harmonisation-ux/revue-manuelle.md, section « Ticket 8.5 — captures des notifications (2026-10-29) », défaut « Sélecteur de personnage à 9,5 px sur ordinateur »
- design — _bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md, typographie (texte courant 14 px ; l'échelle n'a pas de rôle « champ », Q8)

## Notes

- Étendue relevée dans `kraland-theme.css` (lecture du 2026-10-29, `feature/next` à 2bdc8e1) :
  - La règle globale `.form-control.form-control` (section « 4. FORMS », ~l.642) pose `font-size: .95rem` et `padding: .6rem .8rem`. Bootstrap 3 pose `font-size: 10px` sur `html` et la peau ne le change pas : 1 rem vaut 10 px. Le texte fait donc 9,5 px, et le retrait 6 px × 8 px au lieu de 6 px × 12 px natifs.
  - Aucune règle ordinateur ne rattrape la taille d'un `input` ou d'un `select` `.form-control` : les seules surcharges de taille (16 px `!important`, ~l.9843 et règles des modales) sont dans `@media (max-width: 767px)`.
  - `textarea.form-control.form-control` (~l.678) pose `1.4rem !important`, soit 14 px : le champ de rédaction n'a pas le défaut, par coïncidence avec la base de 10 px.
  - Halos de focus en rem : `.18rem` (~l.673, 1,8 px) et `.12rem` (~l.698, 1,2 px). Même base, effet minime.
  - Les autres `font-size` en rem (modale d'ordre `.bootbox-confirm` ~l.1362-2163, légende du carrousel ~l.4390-4396) sont toutes dans `@media (max-width: 767px)`. Elles se calculent aussi sur 10 px, mais sont hors de ce ticket (mobile inchangé).
- Captures et mesures hors dépôt : `/Users/arnaud/kraland-css-captures/8.5/` (`popup-900x800-notifications-kraland.png`, `popup-900x800-notifications-empire-brun-dark.png`, `mesures.txt` : lignes « peau 900 » et « native 900 »). Scripts `mesure.mjs` et `mesure2.mjs` : chemins du worktree `kraland-css-wt85` en dur.
- Assumption: le défaut vaut pour toute largeur ≥ 768 px, déduit de la règle globale ; mesuré à 900 px seulement (`mesures.txt`). Le critère 1 le mesure à 768 et 1280 px.
- Open question: `.input-sm` (12 px) et `.input-lg` (18 px) de Bootstrap sont aussi battus par la règle globale, de spécificité plus forte. Aucun emploi connu dans les fixtures. À vérifier au plan.
- Assumption: la taille attendue sur ordinateur est 14 px (`--kr-font-body`, valeur native de Bootstrap). DESIGN.md n'a pas de rôle « champ ».
- Assumption: severity P2 (lisibilité dégradée sur tous les champs ordinateur, contournement par le zoom) et risk medium (règle globale : tous les formulaires ordinateur changent de rendu).
- Open question: le retrait `.6rem .8rem` (6 px × 8 px au lieu de 6 px × 12 px natifs) suit-il la même correction, ou reste-t-il tel quel ? À trancher au plan, avec les captures avant/après.
- Open question: les halos de focus en rem (1,8 px et 1,2 px) sont-ils voulus à cette taille ? Hors critère sauf décision.
- Open question: les tailles en rem des règles mobiles (modale d'ordre, carrousel) valent elles aussi 10 px par rem. Constat à reporter dans `_bmad-output/initiative-harmonisation-ux/deferred-work.md` si confirmé, pas à corriger ici.
- Risque medium : la passe manuelle d'Arnaud sur quelques formulaires ordinateur (kramail, forum, modale d'ordre) sert de contrôle hors critères.
