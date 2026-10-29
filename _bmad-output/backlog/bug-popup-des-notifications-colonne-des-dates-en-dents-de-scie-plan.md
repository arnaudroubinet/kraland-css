---
title: 'Popup des notifications : colonne des dates en dents de scie'
type: 'bugfix'
ticket: '15'
created: '2026-10-29'
status: 'built'
baseline_revision: '5638f29605ed1066236ea7ff2791c204b91d2013'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: ''
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur ordinateur (≥ 768 px, popup 900×800 compris), le texte de la date d'une ligne non lue de `/report` commence à 12 px du bord de sa cellule (retrait de 8.1 après le filet de 4 px), celui d'une ligne lue à 5 px (retrait natif). La colonne des dates avance et recule d'une ligne à l'autre.

**Approach:** Donner à la cellule de date de toutes les lignes (lues comme non lues) le même retrait de `--kr-space-3` (12 px) sur ordinateur, par une règle `:where(html.kr-page-report)` dans le bloc `@media (min-width: 768px)`. Filet, teinte, tailles et mobile inchangés (décisions de l'orchestrateur du 2026-10-29 dans le ticket). Le décalage vertical de 1 px du texte n'est corrigé que s'il vient de la même règle ; sinon il est consigné.

</frozen-after-approval>

## Implementation Notes

Oneshot : une règle CSS de 3 lignes et un contrôle e2e, avec un masque conditionné à la base.

- `kraland-theme.css` (bloc `@media (min-width: 768px)` de `/report`, ~l.818) : nouvelle règle `:where(html.kr-page-report) table > tbody > tr > td:first-child:not(:only-child) { padding-left: var(--kr-space-3); }`. Spécificité (0,2,4), au-dessus de `.table > tbody > tr > td` de Bootstrap (0,1,3). Aucun `!important`. Elle vise les cellules de date (lignes à deux cellules) ; la ligne non lue à cellule unique garde son retrait de 12 px par la règle de 8.1, et la ligne lue à cellule unique garde le retrait natif (hors colonne des dates, hors périmètre).
- La règle de 8.1 (`tr.bg-info > td:first-child`) n'est pas modifiée : son `padding-left` reste nécessaire pour la ligne non lue à cellule unique.
- Décalage vertical de 1 px : il ne vient pas de la règle du retrait. Il vient des tailles de 8.1 (date à 13 px par `td:first-child:not(:only-child) { font-size: var(--kr-font-detail) }`, texte à 14 px), avec la même hauteur de ligne relative. Il touche les lignes lues et non lues ; le changer toucherait les tailles (Boundaries du ticket). Non corrigé, consigné dans `revue-manuelle.md`. La comparaison à la base du fragment `confort` le confirme : les ordonnées des dates lues sont identiques avant et après (seule l'abscisse change, 5 → 12).
- `tests/e2e/report-non-lu.mjs` : relevé `dateTexte` (boîte du texte de la date par `Range`) dans `MESURE` ; contrôle « bug 15 » dans `verifier`, sur ordinateur seulement (popup, bureau, bascule) : retrait de 12 px (± 0,5) pour toutes les dates, avec au moins une ligne lue et une non lue.
- Masque du fragment `confort` : la comparaison ordinateur (768, 900×800, 1280, bascules) à la base `COMMIT_AVANT_910` (8420e3a) remplace l'abscisse des dates des lignes lues par `x` (ordonnée gardée). Il ne s'applique que si le bundle de base ne contient pas la règle du correctif (`td:first-child:not(:only-child){padding-left:var(--kr-space-3)}`) : il disparaît de lui-même au recalage de `COMMIT_AVANT_910` sur une base corrigée, et le commentaire demande son retrait à ce moment.
- `tests/e2e/lib/router.mjs` non modifié : le fichier de suite est déjà routé vers `report`.

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/baseb15.user.js KR_FRAG=popup,bureau,bascule node tests/e2e/report-non-lu.mjs` (bundle de 5638f29) -- attendu : rouge sur le seul contrôle « bug 15 »
- `npm run build && node tests/e2e/report-non-lu.mjs` -- attendu : vert
- `npm run test:zone -- report cloche confort-mobile typographie-formes palette-nation cartes-pastilles` -- attendu : 0 FAIL
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- attendu : exit 0

## Result

Implémenteur, base 5638f29, non commité (worktree `wt/b15`). Revue quick non lancée : revue indépendante laissée à l'orchestrateur.

- Rouge avant : `KR_SCRIPT=/tmp/baseb15.user.js KR_FRAG=popup,bureau,bascule node tests/e2e/report-non-lu.mjs` (bundle de 5638f29) : 46 FAIL, tous sur le contrôle « bug 15 » (popup 16, bureau 24, bascule 6) ; message : « retrait des dates : lue 5, non lue 12, … ».
- Vert après : `npm run build` VALIDATION PASSED ; `node tests/e2e/report-non-lu.mjs` : exit 0, 1174 ok / 0 FAIL.
- Contre-épreuves : bundle muté (retrait à 11 px) : 40 FAIL « bug 15 » (popup et bureau) ; masque forcé à faux : 12 FAIL dans `confort` (« 15/10 (20:32) @ 12,111 » au lieu de « @ 5,111 » : abscisse seule, ordonnée identique).
- `npm run test:zone -- report cloche confort-mobile typographie-formes palette-nation cartes-pastilles` : RÉSULTAT VERT, 10358 ok / 0 FAIL en 660 s (report 1174, cloche 179, palette-nation 1372, typographie-formes 4419, cartes-pastilles 2302, confort-mobile 912).
- `npm run test:router` exit 0 (« Routeur conforme ») ; `npm run test:unit` exit 0 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement préexistant `no-loop-func`, l.97 de `report-non-lu.mjs`, identique à la base).
- `!important` : 3180, comme la base.
- Masque : abscisse des dates lues dans la comparaison ordinateur de `report-non-lu#confort`, conditionné à une base sans le correctif ; retrait au recalage de `COMMIT_AVANT_910`.
- Doutes dans `revue-manuelle.md`, section « Bug 15 » : décalage vertical de 1 px non corrigé (cause : tailles de 8.1) ; ligne lue à cellule unique laissée à 5 px.
- `test:all` non lancé (hors mandat).
