---
title: 'Refactor sweep — épopée modale d’ordre'
type: 'refactor'
ticket: '7'
created: '2026-10-23'
status: 'built'
baseline_revision: 'd75496464a43b520ccd6386782366c0858a84a32'
route: 'full'
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

**Problem:** L'épopée 2 laisse du code mort ou provisoire autour de la modale d'ordre (classe `kr-btn-primary-enhanced` posée mais plus stylée, règle de pied sans cible, champ de test jamais vérifié), un bleu Bootstrap en dur sur les groupes du sélecteur de personnage mobile, et un test instable (opacité de la croix mesurée pendant le fondu).

**Approach:** Nettoyage sans changement de rendu hors les deux points voulus (optgroup en jeton, test stabilisé) ; les règles mobiles partagées avec les autres modales Bootbox (`flex: 2` des alert/dialog, onglet actif bg-elevated, 1205, 6955) restent en place.

## Boundaries & Constraints

**Always:** P1 option 4 (réécrire ou retirer, pas battre) ; mobile `@media (max-width: 767px)` ; `!important` gardé là où la règle voisine l'exige ; supprimer une règle seulement après avoir montré qu'elle n'a aucune cible (fixture et JS : quel code crée l'élément) ; vérifier le rendu après chaque suppression (AGENTS.md) ; contre-épreuve pour chaque test ajouté ou modifié (`KR_SCRIPT`, bundles mutés hors dépôt).

**Never:** changer le rendu des confirmations, alertes ou dialogues Bootbox hors ordre ; toucher au lien de l'aide `.alert-order` en sombre (renvoyé au 3.3) ; toucher au focus (3.7 abandonné) ; retirer `KR_SCRIPT` ni les gardes de non-régression (`makeAlertCollapsible`, pastilles, bande collante) ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Groupes du sélecteur | mobile 375 et 767 px, sélecteur de personnage avec optgroups PJ / PNJ créés par `groupSelectOptions`, 16 variantes | libellé du groupe en `--kr-text-accent`, aucun #428bca, ≥ 4,5:1 | n/a |
| Croix de la modale | 16 variantes, 375 et 1280 px | opacité mesurée après la fin du fondu : 1 ; 3 passages consécutifs verts | n/a |
| Modale d'ordre et hors ordre | 375, 767, 768, 1280 px | rendu calculé identique à la base pour les boutons, le pied et les onglets | n/a |

</frozen-after-approval>

## Code Map

- `kraland-theme.css:1953-1958` -- `.bootbox-confirm .kraland-modal-header select optgroup { color: #428bca !important }` (9d « UX #6 », effectif < 768 px) : passer à `var(--kr-text-accent)`.
- `kraland-theme.css:2023-2027` -- `.modal-footer > div` : probablement sans cible (aucun `div` dans le pied natif ni posé par le JS) ; retirer si confirmé.
- `kraland-theme.css:1999-2011` -- pied en colonne des confirmations : effectif hors ordre, garder.
- `kraland-userscript-template.js:9577-9597` `enhanceOkButton` -- lignes 9587-9589 (`okButton` + ajout de `kr-btn-primary-enhanced`) mortes ; la pose de `kr-btn-secondary-subtle` sur « Annuler » reste. Mettre à jour le commentaire « Bouton OK renforcé » (~9731).
- `kraland-userscript-template.js:9601-9645` `groupSelectOptions` -- crée les optgroups (mobile).
- `tests/e2e/modale-ordre.mjs:513-545` `CROIX` -- l.533 opacité effective lue pendant le fondu `.fade` ; attendre la fin des animations comme `VALIDER` (l.558). `deferred-work.md` l.31-32.
- `tests/e2e/modale-ordre.mjs:553, 586` -- champ `renforce` jamais vérifié : retirer ; l.43 et l.612 : alléger le texte historique, garder les gardes vert/bleu.
- `tests/e2e/fixtures/modale-ordre/` -- aucune fixture n'a de sélecteur de personnage : en ajouter un à une fixture existante ou nouvelle (structure native de l'en-tête, noms inventés) pour couvrir la matrice, sans changer les contrôles existants.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/modale-ordre.mjs` + fixture -- contrôle optgroup rouge sur la base ; `CROIX` attend le fondu ; `renforce` retiré.
- [x] `kraland-theme.css` -- optgroup en jeton ; `.modal-footer > div` retiré si sans cible.
- [x] `kraland-userscript-template.js` -- lignes mortes d'`enhanceOkButton`, commentaire.
- [x] `deferred-work.md` -- marquer l'entrée de la croix (l.31-32) comme traitée par ce plan, sans réécrire les autres entrées.

**Acceptance Criteria:**
- Given la base `d75496464a43b520ccd6386782366c0858a84a32`, when on compare les styles calculés du pied, des boutons et des onglets (modale d'ordre et hors ordre, 375/767/768/1280 px), then ils sont identiques.

## Implementation Notes

- Fixture : `tests/e2e/fixtures/modale-ordre/selecteur.html` (nouvelle), rangée `.row` + `select` aux noms inventés (2 PJ, 2 PNJ), insérée par la suite avant le `h3` de Dormir (`AVEC_SELECTEUR`). Structure NON relevée sur le site (aucune capture disponible) : seule forme que `transformOrderModalStructure` reconnaît ; dit dans l'en-tête de la fixture. Modale ouverte en plus, après les mesures existantes (aucun contrôle existant modifié).
- Contrôle optgroup (`GROUPES`, `groupesLisibles`) : 375 et 767 px (scénarios en mobile-mode) et 16 variantes à 375 px (18 contrôles). Rouge sur la base : « Personnages Joueurs : bleu rgb(66, 139, 202) ».
- `.modal-footer > div` : une seule cible, la rangée `div.kr-order-badges` (showOrderCosts) ; ses trois déclarations (display, gap, justify-content) étaient toutes battues par 9f (0,3,0). Retirée, commentaire de 9f mis à jour. Aucune autre `div` dans le pied (Bootbox 4.4.0 n'y met que les boutons).
- `CROIX` est async et attend `getAnimations()` de la croix et de chacun de ses ancêtres. `enhanceOkButton` garde son nom (pose seulement `kr-btn-secondary-subtle`).
- Comparaison des styles calculés (script hors dépôt, toutes propriétés calculées + boîte) : pied, boutons, rangée et pastilles, `li` et `a` des onglets ; Dormir, Pouvoir, hors ordre ; 375 (mobile), 767, 768, 1280 px ; kraland et empire-brun-dark. Base contre base : identiques (92 568 valeurs). Base contre après : seul écart, la classe `kr-btn-primary-enhanced` absente de « Valider »/« OK » sous 768 px (attendu).
- Contre-épreuves (`KR_SCRIPT`, bundles mutés hors dépôt, fragment mobile) : croix à opacité 0,9 → rouge ; optgroup en #777 → rouge ; fondu `.modal.fade` de 1,5 s → ancienne suite rouge (effective 0.2267), nouvelle suite verte.

## Plan Change Log

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Règle optgroup dans `@media (max-width: 768px)`, hors convention, effective à 768 px | false | reject | Le bloc l.1926 est imbriqué dans `@media (max-width: 767px)` ouvert l.1160 (comptage des accolades) : intersection, effective < 768 px seulement. Le « 768 » imbriqué est cosmétique et préexistant. |
| 2 | `Promise.all(getAnimations().map(a => a.finished))` rejette (AbortError) si une transition est annulée : la suite s'arrête au lieu d'un FAIL nommé (`CROIX`, et `VALIDER`) | low | patch | Réel : `Animation.finished` rejette à l'annulation ; `CROIX` attend toute la chaîne des ancêtres. Correctif direct : tolérer l'annulation. |

## Verification

**Commands:**
- `npm run build` ; `node tests/e2e/modale-ordre.mjs` (3 fois, croix stable) ; `npm run test:parler` ; `node tests/e2e/palette-nation.mjs` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, router conforme, lint 0 erreur. (`test:all` : orchestrateur, machine calme.)

**Result (2026-10-24, after review patch):** build ok ; modale-ordre 358 contrôles verts 3 fois de suite ; parler-viewport 78 ok 0 FAIL ; palette-nation 0 FAIL ; `test:router` conforme ; lint:css et lint:js 0 erreur ; `npm run test:all` 6066 ok, 0 FAIL (machine calme).
