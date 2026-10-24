---
title: "Modales Bootbox mobiles : « Valider » de taille normale et règles contradictoires retirées"
type: 'feature'
ticket: '3'
created: '2026-10-24'
status: 'built'
baseline_revision: '8631c45'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, les boutons du pied des modales Bootbox ne suivent pas la taille normale du ticket 4.2 : « Valider » 16 px / 52 px, « Annuler » 16 px / 50 px (`kraland-theme.css` l.7685, l.7702), et des règles mobiles contradictoires (`flex: 1` l.7039 et l.7696, `flex: 2` l.7702, pied en colonne l.2016, 56 px l.1746) restent en place, battues par la section 9h (tickets 2.6, 2.7) pour la modale d'ordre seulement (deferred-work.md l.34-38).

**Approach:** Sur mobile, « Valider » et « Annuler » de toute modale Bootbox (ordre Dormir, Pouvoir, confirmation hors ordre) prennent la taille normale (14 px, ≥ 44 px, jetons de 4.1/4.2) ; les règles contradictoires sont retirées ou réécrites pour ne garder qu'un modèle de pied, celui de 9h (colonne, pleine largeur, ordre natif Annuler puis Valider), au lieu d'être battues ; couleurs (paire arm, Annuler `kr-btn-secondary-subtle`) et aspect de l'onglet actif conservés.

## Boundaries & Constraints

**Always:**
- Mobile = `@media (max-width: 767px)` ; ordinateur inchangé ; à 768 px le pied n'est pas en colonne.
- Chaque règle listée par le ticket est retirée de `kraland-theme.css` ou gardée avec sa raison écrite dans Implementation Notes.
- Assumption : le modèle de pied de 9h (colonne, pleine largeur) vaut pour toute confirmation Bootbox sur mobile, hors ordre comprise (le pied `.bootbox-confirm` est déjà en colonne, l.2016).
- Assumption : la règle de l'onglet actif de MODAL PERSONNAGE MOBILE (l.7215-7224, bg-elevated / text-accent) sert les modales à onglets hors ordre ; elle est gardée avec sa raison, ses couleurs restant celles de la base partout.
- Assumption : « ? Aide » de la modale d'ordre (bouton standard) suit aussi la taille normale ; la fixation à 16 px du ticket 4.2 (l.2086-2090, commentaire « modales : 4.3 ») est retirée.
- P1 option 4 : retirer ou réécrire, ne pas ajouter de règle qui bat ; rouge avant sur `8631c45`, contre-épreuve pour chaque contrôle nouveau.

**Never:** cible tactile sous 44 px ; règle `:focus` ; toucher aux barres BBCode et à la croix de fermeture des modales (exclusions de 4.2) ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ordre mobile | Dormir, Pouvoir, 375 et 767 px | Valider et Annuler 14 px, ≥ 44 px ; Valider pleine largeur sous Annuler ; paire arm | n/a |
| Hors ordre mobile | `bootbox.confirm` « Retirer ce personnage de vos contacts ? », 375 et 767 px | OK et Annuler 14 px, ≥ 44 px ; même modèle de pied | n/a |
| Seuil | 768 px (et 769) | pied pas en colonne ; boutons comme la base | n/a |
| Onglet actif | modale d'ordre, 16 variantes | couleurs égales à la base | n/a |
| Viewport | `parler-viewport.mjs` (390×160 à 1280×720) | Valider visible et cliquable | n/a |

</frozen-after-approval>

## Code Map

- Bloc mobile-mode `@media (max-width: 767px)` ouvert l.6765 : l.7031 `body.mobile-mode .modal-footer` (flex, gap, padding) ; l.7039 `body.mobile-mode .modal-footer .btn` (0,2,1) `flex:1; min-height:48px; max-height:48px; font-size:16px; padding:12px 20px…` tous `!important` ; l.7051/7055 `order`.
- MODAL PERSONNAGE MOBILE (commentaire l.7077, media l.7079) : l.7215-7224 onglet actif (garder, voir Assumption) ; l.7670 pied sticky ; l.7685 `body.mobile-mode .bootbox.modal .modal-footer .btn` (0,4,1) `min-height:50px; font-size:16px; font-weight:600; border-radius:8px…` ; l.7696 `.btn-default` `flex:1; order:1` ; l.7702 `.btn-primary` `flex:2; order:2; min-height:52px` (source des 52 px).
- Bloc externe `@media (max-width: 767px)` l.1188-2050 (les `max-width: 768px` l.1674-1940 et l.1954-1993 y sont imbriqués, donc déjà < 768) : l.1734 `.bootbox-confirm .kraland-modal-footer` ; l.1746 `.kraland-modal-footer .btn` `min-height:56px; font-size:16px` ; l.2016 `.bootbox-confirm .modal-footer` en colonne ; l.2042 règle morte (`font-size:1rem`) battue par les `!important`.
- Section 9h l.2187-2222 : l.2200-2209 pied de la modale d'ordre (colonne, `flex:none`, `width:100%`, `margin-left:0`) ; l.2212-2222 onglet actif. Si le modèle vaut pour toute Bootbox, élargir le sélecteur de 9h ou retirer les `flex` contradictoires plutôt qu'ajouter.
- Fixation 4.2 : l.2082-2090 `.kr-order-form .kr-order-help-toggle { font-size:16px !important }`.
- Jetons : `--kr-font-button` l.31, `--kr-touch-target` l.42. Règle globale mobile `.btn` l.4628 (0,1,0).
- JS : `applyOrderModal` template:9112-9115 ; `transformOrderModalStructure` :9436 (ajoute `kraland-modal-footer` à tout pied Bootbox, :9479) ; `enhanceOkButton` :9577 (Annuler `kr-btn-secondary-subtle`). Aucun style en ligne sur les boutons du pied.
- Tests : `tests/e2e/modale-ordre.mjs` `VALIDER` l.564-597 / `valide()` l.628-642 (largeur, dessous, paire arm ; pas de taille) ; ajouter taille et hauteur à 375/767 et « pied pas en colonne » à 768, pour Dormir, Pouvoir (`enOrdre(POUVOIR)` l.862) et hors ordre (`HORS_ORDRE` l.93, l.890, contrôles l.1055-1062). `tests/e2e/typographie-formes.mjs` l.365-370 : pages `modale-ordre` et `modale-bbcode` ; passer les boutons du pied en `vises` (mobile) et garder les autres boutons (`.modal .btn` hors pied : BBCode, croix) en `exclus`, base = `8631c45` (constante à côté de `COMMIT_BOUTONS` l.55). `npm run test:parler` (`tests/e2e/parler-viewport.mjs`) doit rester vert.
- `_bmad-output/initiative-harmonisation-ux/deferred-work.md` l.34-38 : ajouter le status de reprise par ce ticket.

## Tasks & Acceptance

**Execution:**
- [x] Tests (modale-ordre, typographie-formes) -- rouges sur `8631c45`.
- [x] `kraland-theme.css` -- règles contradictoires retirées ou réécrites, tailles en jetons, fixation « ? Aide » retirée.
- [x] deferred-work.md -- status.
- [x] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` et `npm run test:parler` tournent, then 0 FAIL et chaque règle listée est absente ou justifiée.

## Implementation Notes

Sort de chaque règle listée (numéros de ligne de `8631c45`) :
- l.7039 `body.mobile-mode .modal-footer .btn` : `flex: 1`, `min-height: 48px`, `max-height: 48px`, `font-size: 16px` et `padding` retirés ; la taille vient de la règle mobile `.btn` (14 px, 12px 20px) et de la cible de 44 px. Restent graisse, rayon, `box-sizing`, interligne. Effet de bord accepté : un pied de modale non Bootbox en mobile-mode perd l'étirement `flex: 1` et passe à la taille normale (aucune fixture ne contient de telle modale ; le site utilise Bootbox).
- l.7051 / l.7055 `order: 2` / `order: 1` (toute modale en mobile-mode) : gardées, hors liste du ticket ; pour Bootbox elles reproduisent l'ordre natif (« Annuler » puis « Valider »), donc ne contredisent pas 9h.
- l.7685 `body.mobile-mode .bootbox.modal .modal-footer .btn` : `min-height: 50px` et `font-size: 16px` retirés ; marge, graisse 600, rayon 8 px, transition et bordure gardés (aspect, hors taille).
- l.7696 `.btn-default { flex: 1; order: 1 }` et l.7702 `.btn-primary { flex: 2; order: 2; min-height: 52px }` : retirées entièrement.
- l.1746 `.bootbox-confirm .kraland-modal-footer .btn` : `min-height: 56px` et `font-size: 16px` retirés ; rayon gardé (rayons : ticket 4.8).
- l.2016 `.bootbox-confirm .modal-footer` : `flex-direction: column` retiré (porté désormais par 9h pour toute Bootbox) ; `display: flex` et `gap` gardés, car ils font du pied une boîte flex sous 768 px sans body.mobile-mode (fenêtre rétrécie), où l.7031 / l.7670 ne s'appliquent pas. Bloc déjà sous `max-width: 767px` (l.1188), aucune réécriture de media query nécessaire.
- l.2042 `.bootbox-confirm .modal-footer .btn` : `min-height`, `font-size: 1rem` et `padding` (morts, battus par les `!important` de la règle mobile `.btn`) retirés ; `min-width`, rayon et graisse gardés (encore effectifs sans mobile-mode).
- l.2086-2090 fixation 4.2 de « ? Aide » à 16 px : retirée ; « ? Aide » suit la règle mobile `.btn` (14 px).
- l.7215-7224 onglet actif de MODAL PERSONNAGE MOBILE (bg-elevated / text-accent) : gardée (Assumption) ; elle sert les modales à onglets hors ordre, et 9h la bat pour la modale d'ordre, couleurs inchangées.
- Section 9h : sélecteur du pied élargi de `.bootbox.kr-order-modal` à `.bootbox.modal` (même spécificité (0,5,2)) : un seul modèle de pied (colonne, pleine largeur, ordre natif) pour toute Bootbox sous 768 px ; `flex: none` retiré (plus aucune règle ne pose de flex sur ces boutons) ; commentaire mis à jour. Aucune règle ajoutée.

Tests : `modale-ordre.mjs` mesure taille et hauteur d'« Annuler » / « Valider » et la direction du pied (`VALIDER`), contrôle `piedNormal` pour Dormir, Pouvoir et hors ordre à 375, 767 (14 px, ≥ 44 px, colonne, « Valider » pleine largeur sous « Annuler ») et 768, 769, 1280, 1440, 1920 (pied pas en colonne). `typographie-formes.mjs` : pages `modale-ordre` et `modale-bbcode` avec boutons du pied (et « ? Aide ») en `vises` sur mobile, boutons hors pied (barre BBCode, croix) en `exclus` sur mobile et tous les boutons en `exclus` sur ordinateur, base `COMMIT_MODALES = '8631c45'` (`KR_SCRIPT_AVANT_MODALES`).

## Plan Change Log

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Commentaire 9h : « aucune autre règle ne pose d'ordre » faux | low | patch | Règles `order` l.7036-7042 gardées par le plan. Correction directe. |
| 2 | Commentaire l.7019 « boutons pleine largeur » périmé hors Bootbox | low | patch | `flex:1` retiré de `body.mobile-mode .modal-footer .btn`. Correction directe. |
| 3 | Fenêtre rétrécie sous 768 sans mobile-mode non vérifiée | medium | patch | Fragment `largeurs` appelle `valide` seul ; les retraits de l.2016/l.2042 sont justifiés par ce cas. |
| 4 | Deux lignes vides d'affilée vers l.7676 | low | patch | Reste du retrait. Suppression directe. |

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- modale-ordre typographie-formes` ; `npm run test:parler` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, lint 0 erreur. (`test:all` : orchestrateur, machine calme.)

**Résultats (arbre de travail sur `8631c45`, 2026-10-24) :**
- Rouge avant (bundle de `8631c45`) : modale-ordre 2 FAIL (375 et 767 px : « Annuler » 16px/50 px, « Valider » 16px/52 px) ; typographie-formes 8 FAIL (pied 16px/50-52 px, « ? Aide » 16px/48,8 px, 375 et 767 px, deux pages, deux variantes).
- Vert après : `npm run test:zone -- modale-ordre typographie-formes` 952 ok / 0 FAIL ; `npm run test:parler` 78 ok / 0 FAIL ; `npm run test:router` conforme ; `npm run lint:css` 0 ; `npm run lint:js` 0 erreur (1 avertissement préexistant, report-non-lu.mjs) ; `npm run test:all` VERT, 6583 ok / 0 FAIL (charge 2,25).
- Contre-épreuves (bundles mutés hors dépôt) : pied 16 px -> rouge (modale-ordre, typographie-formes) ; hors ordre seul 16 px -> rouge « hors ordre » ; pied 40 px -> rouge ; hors ordre en ligne -> rouge « pied pas en colonne » ; pied en colonne à partir de 768 px -> rouge « pied en colonne » à 768 et 769 ; « ? Aide » 16 px -> rouge typographie-formes ; padding de la barre BBCode changé -> rouge exclusions hors-pied.

## Result

Sur mobile, « Valider » et « Annuler » de toute Bootbox (Dormir, Pouvoir, hors ordre) et « ? Aide » en 14 px / ≥ 44 px ; règles contradictoires retirées (`flex:1`, `flex:2`, 48/50/52/56 px, 16 px, colonne l.2016, règle morte l.2042) ; section 9h seul modèle de pied, sélecteur élargi à `.bootbox.modal` à spécificité égale ; `order` et onglet actif de MODAL PERSONNAGE MOBILE gardés avec leur raison ; fixation « ? Aide » retirée ; deferred-work.md l.34-38 soldée. Rouge sur 8631c45 (modale-ordre 2 FAIL, typographie-formes 8 FAIL), contre-épreuves rouges. Revue quick : 4 constats patchés (2 commentaires, ligne vide, contrôle du pied en redimensionnement sans mobile-mode). `npm run test:parler` 78 ok, `npm run test:router` conforme, lint 0 erreur, `npm run test:all` 6663 ok, 0 FAIL.
