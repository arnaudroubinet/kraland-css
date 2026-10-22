---
title: "Croix de fermeture lisible"
type: 'feature'
ticket: '5'
created: '2026-10-22'
status: 'in-progress'
baseline_revision: '061fd4af3547e14f85a26ac177071ca33ad47dd2'
route: 'full'
route_source: 'auto'
risk: 'low'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La croix de fermeture des modales d'ordre (`button.bootbox-close-button.close`, dans `.modal-body`) garde le style Bootstrap sur ordinateur : noire, opacité 0,2, environ 13 × 21 px, contraste 1,2:1 en sombre ; sur mobile, noire à opacité 0,7, sans couleur du thème.

**Approach:** Dans les modales d'ordre, sur ordinateur et mobile, la croix prend la couleur du texte du thème, sans voile d'opacité, un contraste ≥ 3:1 sur le fond de la modale et une zone de 44 × 44 px, à la même place (H2.6 ; CAP-3 ; Q25.4 : place native gardée).

## Boundaries & Constraints

**Always:** limité aux modales marquées `kr-order-modal` (socle du ticket 2.2) ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)` ou liste combinée pour une règle commune ; P1 option 4 : la règle mobile commune `body.mobile-mode .modal-header .close, body.mobile-mode .bootbox-close-button` (~l.6568) est réécrite pour ne plus viser les modales d'ordre, plutôt que surchargée ; contrastes vérifiés dans les 16 variantes avec `tests/e2e/lib/variantes.mjs`.

**Never:** déplacer la croix ; changer la croix des autres modales Bootbox ; toucher les pastilles, « Valider » ou l'onglet actif.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ordinateur | modale d'ordre, 768 à 1920 px | croix 44 × 44 px, couleur du texte du thème, opacité 1, ≥ 3:1 sur le fond de la modale | No error expected |
| Mobile | modale d'ordre, 375 et 767 px | idem | No error expected |
| Variantes | 16 variantes | ≥ 3:1 partout | No error expected |
| Touchée | toucher ou clic au centre de la croix | la modale se ferme sans valider (`elementFromPoint` renvoie la croix) | No error expected |
| Autre modale | `bootbox.confirm` hors ordre | croix inchangée | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` : règle mobile commune ~l.6566-6578 (`body.mobile-mode .modal-header .close, body.mobile-mode .bootbox-close-button` : 44 px, `opacity: 0.7 !important`, `z-index: 120`) ; `.bootbox-confirm .alert .close` (~l.1794, croix des alertes, hors périmètre) ; Bootstrap `.close` : `color: #000; opacity: .2; text-shadow: 0 1px 0 #fff; font-size: 21px`.
- Socle : `kr-order-modal` posé par `applyOrderModal` (template, section « MODAL PERSONNAGE MOBILE »).
- Tests : `tests/e2e/modale-ordre.mjs` (fragments `mobile`, `bureau`, `largeurs`, `seuil`, `variantes`), `tests/e2e/lib/variantes.mjs` (`CONTRASTE`, `parVariante`).

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/modale-ordre.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [ ] `kraland-theme.css` -- croix des modales d'ordre lisible sur les deux supports ; règle mobile commune réécrite sans viser les modales d'ordre
- [ ] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre dans chacune des 16 variantes, when elle s'ouvre, then la croix mesure 44 × 44 px et son contraste est ≥ 3:1
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT
