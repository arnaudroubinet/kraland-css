---
title: 'Plateau mobile : cibles des cartes, des groupes, du mini-profil et de la croix'
type: 'feature'
ticket: '5'
created: '2026-10-29'
status: 'built'
baseline_revision: '724c5c11a5242d164000fc5616057bbc8e3938e4'
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

**Problem:** sur le plateau mobile, les actions des cartes de personnage font 26 × 26 px et les boutons de groupe 28 × 28 px. Le bouton réglages du mini-profil (32 px), la grille d'actions et les accès rapides n'ont pas de plancher explicite. La croix et les pièces ont des tailles en dur (50 px) au lieu des jetons. Le repli des deux accordéons (groupes du plateau, sections des bâtiments) n'anime pas le padding : la hauteur saute en fin de repli.

**Approach:** réécrire les règles d'origine de la peau en `--kr-touch-target` (44 px) et `--kr-touch-target-dpad` (≥ 48 px, 50 px gardés), sans nouvel `!important`. Laisser les actions de carte passer à la ligne. Ajouter le padding aux transitions des deux accordéons.

## Boundaries & Constraints

**Always:** mobile seulement (`@media (max-width: 767px)`, `body.mobile-mode`) ; bureau (768, 769, 1280 px) égal à la base ; pièces dans l'ordre DOM natif ; tuiles d'action à 64 px (Q24.1) ; cibles ≥ 44 × 44 (croix ≥ 48 × 48), mesurées par boîte et `elementFromPoint` ; Kraland clair et Empire Brun sombre.

**Never:** nouvel `!important` ; changement du HTML natif ; édition du bundle à la main ; modification hors de `kraland-theme.css`, du template, des tests et des fixtures.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Carte à une action | plateau-cartes-noms, 320 à 767 px | action 44 × 44, dans la carte | No error expected |
| Carte à trois actions | 320 et 375 px | actions 44 × 44, passage à la ligne, aucun débordement | No error expected |
| Groupes | `.dashboard-group-buttons .btn` | 44 × 44, aucun chevauchement | No error expected |
| Mini-profil | plié et déplié, 375 et 700 px | bouton de gestion ≥ 44 × 44, touchable | No error expected |
| Croix | jeton par défaut, 56 px, 40 px | touches 50, 56, 50 ; pavé 3·t + 4 ; pièces ≥ 44 à droite | No error expected |
| Repli d'accordéon | groupe ou section, 320, 375, 767 px | hauteur à l'instant 0 = hauteur dépliée, puis non croissante | No error expected |
| Bureau | 768, 769, 1280 px | boîtes des cibles égales à la base | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` -- `makeGroupCollapsible` : état initial des groupes posé sans animation.
- `kraland-theme.css` -- 4c (grille des groupes, transition), 4q (actions des cartes), 4r (boutons de groupe), mini-profil, `.building-section-content`, CX2 (croix et pièces), `.kr-action-grid` et `.kr-quick-access-buttons` mobiles.
- `tests/e2e/confort-mobile.mjs` -- nouveau fragment `plateau` (cibles, tuiles, repli, bureau).
- `tests/e2e/croix-directionnelle.mjs` -- nouveau fragment `jeton` (lecture de `--kr-touch-target-dpad`).
- `tests/e2e/lib/variantes.mjs` -- feuille miroir `CIBLES_TICKET95` et prédicat `AVANT_TICKET95`.
- `tests/e2e/plateau-qualite-usage.mjs`, `tests/e2e/typographie-formes.mjs` -- feuille miroir posée sur leurs bundles de base.
- `tests/e2e/cartes-pastilles.mjs` -- `MOBILE` des contrôles statiques : média mobile, seul ou combiné avec `prefers-reduced-motion: reduce`.
- `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs` -- routage des sélecteurs touchés.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-theme.css` -- cibles en jetons, `flex-wrap: wrap` des actions, planchers, transitions du padding, croix en `--kr-touche-croix` -- réécriture à l'origine.
- [x] `tests/e2e/confort-mobile.mjs` -- fragment `plateau` -- couvre la matrice (sauf la croix).
- [x] `tests/e2e/croix-directionnelle.mjs` -- fragment `jeton` -- couvre la ligne « Croix ».
- [x] `tests/e2e/lib/variantes.mjs`, `plateau-qualite-usage.mjs`, `typographie-formes.mjs` -- masque miroir conditionné à la base -- écart accepté, tout autre écart détecté.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs` -- nouveaux fragments et règle de routage.

**Acceptance Criteria:**
- Given le bundle de base, when les fragments `plateau` et `jeton` tournent, then ils échouent ; given le bundle courant, then ils passent.
- Given une base postérieure à l'entrée, when les suites de comparaison tournent, then la feuille miroir ne s'applique pas.

## Implementation Notes

- Croix : `body.mobile-mode .kr-nav-v2` porte `--kr-touche-croix: max(var(--kr-touch-target-dpad), 50px)`. Pavé, colonnes, rangées et touches lisent ce jeton. Les pièces (`a.kr-room`) passent à `min-height: var(--kr-touch-target)`.
- Actions des cartes : `width`, `height` et `min-height` en `var(--kr-touch-target)`. L'`!important` existant du `min-height` est gardé, la valeur est réécrite. `flex-wrap: wrap` ajouté à `.dashboard-card-actions`.
- Boutons de groupe : même réécriture, `!important` existants gardés.
- Mini-profil : la règle `.mobile-mini-profile-settings` (32 px) est morte : aucun élément ne porte cette classe. Supprimée avec son `:hover`. Le vrai bouton, `.mobile-mini-profile-manage-btn`, mesure déjà 44 × 45.
- Grille d'actions et accès rapides : `min-height: var(--kr-touch-target)` ajouté au bloc mobile.
- Repli : la transition de `.dashboard-cards-grid` était invalide sur la base (`var(--transition-normal) ease-in-out` donne deux fonctions de temps ; valeur calculée `all 0s`). `ease-in-out` retiré, `padding` ajouté. `.building-section-content` reçoit aussi `padding`.
- `!important` de la peau : 3188 (base 3203, règle morte retirée ; aucun nouveau).
- Masque : `CIBLES_TICKET95` (actions 44, `flex-wrap`, boutons de groupe 44) posé sur un bundle de base si `AVANT_TICKET95` (le bundle ne contient pas `--kr-touche-croix`). Prédicat : courant false, 724c5c1 true, e203f87 true.
- Fragment `plateau`, page `cartes-trois` : la première carte reçoit trois liens (fa-user, fa-envelope, fa-eye) au lieu d'un.
- Assumption (auto-approuvée) : les lignes de pièces suivent la rangée de la croix (50 px) ; seule la pièce reçoit le plancher de 44 px.
- Assumption (auto-approuvée) : la structure native d'une carte à plusieurs actions est supposée (liens frères dans `div[style*="height:59px"]`).
- Assumption (auto-approuvée) : le ticket cite le bouton réglages à 32 px ; le bouton de gestion réel fait foi.

- Revue : `makeGroupCollapsible` coupe la transition de la grille (`style.transition = 'none'`), pose `collapsed`, force un calcul de style (`offsetHeight`), puis rend la transition. Le groupe replié est à 0 px dès sa première image.
- Revue : bloc `@media (max-width: 767px) and (prefers-reduced-motion: reduce)` : `transition: none` sur les deux accordéons.
- Revue : fragment `plateau` complété : chargement (`transitionrun` sur la grille, hauteur à la première image), mouvement réduit (option de contexte `reducedMotion: 'reduce'`, même émulation que `emulateMedia`, posée avant le chargement), bouton de gestion exigé dans l'état déplié, bascule 767 -> 768 -> 767 px.

## Plan Change Log

## Review Triage Log

Revue indépendante quick (coordinateur) : 1 haute, 9 autres constats.

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | (haute) Transition des groupes devenue valide : au chargement, les groupes repliés se replient sous les yeux en 0,3 s (saut d'environ 180 px) | Corrigé à l'origine dans `makeGroupCollapsible` : état initial posé sans animation | Contrôle de chargement (aucun `transitionrun`, hauteur 0 à la première image) : mutant sans le correctif 12 FAIL, vert 0 FAIL |
| 2 | Pas de `prefers-reduced-motion` | Bloc mobile `transition: none` sur les deux accordéons | Contrôle en mouvement réduit : base 2 FAIL (bâtiments ; la grille de la base n'a aucune transition), mutant sans le bloc 4 FAIL, vert |
| 3 | `max-height: 5000px` : temps mort en début de repli | Accepté, consigné dans revue-manuelle.md | Aucun changement |
| 4 | `REPLI` ne couvre pas le chargement | Couvert par le contrôle du point 1 | Voir 1 |
| 5 | Bouton de gestion du mini-profil non exigé dans l'état déplié | Exigé à 375 et 700 px | Vert |
| 6 | Planchers de la grille d'actions et des accès rapides non prouvés | Consigné dans Result | Aucun changement |
| 7 | Doute « contact au survol » faux | Corrigé dans revue-manuelle.md : 2,2 px par côté, écart de 8 px | Aucun changement de code |
| 8 | Nom `--kr-touche-croix` | Gardé | Aucun changement |
| 9 | Dépendance de `AVANT_TICKET95` au nom du jeton | Ajoutée à la description de l'entrée 12 de tickets.toml | Aucun changement de code |
| 11 | (passage des zones après correctif) Contrôles statiques de cartes-pastilles (`module`, `groupes`) : le bloc de mouvement réduit sort du média mobile accepté | `MOBILE` accepte le média mobile combiné avec `prefers-reduced-motion: reduce` | Rejoués seuls : 37 ok et 125 ok ; mutant du bloc en média global -> 1 FAIL (contrôle toujours actif) |
| 10 | Pas d'aller-retour 767 -> 768 -> 767 px | Ajouté au fragment `plateau`, boîtes égales à l'état initial ; chaque changement de largeur recharge la page | Vert en 9.5 et en base ; défaut de la base décrit par la revue non reproduit, reporté en D9.1 |

## Verification

**Commands:**
- `npm run build`, `npm run lint:css`, `npm run lint:js` -- codes de sortie 0.
- `npm run test:unit`, `npm run test:router`, `diff -r .hermes/skills .claude/skills` -- verts, diff vide.
- `KR_FRAG=plateau node tests/e2e/confort-mobile.mjs` et `KR_FRAG=jeton node tests/e2e/croix-directionnelle.mjs` -- rouges avec `KR_SCRIPT=/tmp/kr95/base.user.js`, verts sans.
- `npm run test:zone -- croix plateau profil cartes-pastilles confort-mobile typographie-formes palette-nation demarrage`, après la revue : 10490 ok, 8 FAIL.
  - cartes-pastilles#module (1) et #groupes (1) : contrôle statique du média mobile (constat 11), corrigé ; rejoués seuls : 37 ok, 125 ok.
  - breakpoint-switch#nav-large (2) et #nav-origine (3), demarrage-mobile#desktop+pire-cas+m1+m-1+s1 (1) : faux FAIL de charge (concurrence 16), déjà vus avant la revue. Rejoués seuls : 37 ok, 33 ok, 27 ok, 0 FAIL.
  - Avant la revue : 10473 ok, 6 FAIL, les mêmes faux FAIL de charge.

## Result

Livré dans le worktree wt/9.5 (base 724c5c1), non commité. Revue indépendante quick faite par le coordinateur, correctifs appliqués (voir Review Triage Log).

- Fichiers : `kraland-userscript-template.js` (après la revue), `kraland-theme.css`, `tests/e2e/confort-mobile.mjs`, `tests/e2e/croix-directionnelle.mjs`, `tests/e2e/lib/variantes.mjs`, `tests/e2e/plateau-qualite-usage.mjs`, `tests/e2e/typographie-formes.mjs`, `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs` ; générés par `npm run build` : `kraland-userscript-main.user.js`, `version.json`. Aucune fixture modifiée.
- Mesures de 320 à 767 px : actions de carte 44 × 44 (base 26), boutons de groupe 44 × 44 (base 28), bouton de gestion du mini-profil 44 × 45 (inchangé).
- Rouge : `KR_SCRIPT=/tmp/kr95/base.user.js KR_FRAG=plateau node tests/e2e/confort-mobile.mjs` -> 40 FAIL (cibles, repli des deux accordéons) ; `KR_SCRIPT=/tmp/kr95/base.user.js KR_FRAG=jeton node tests/e2e/croix-directionnelle.mjs` -> 16 FAIL (jeton à 56 px).
- Vert : `KR_FRAG=plateau node tests/e2e/confort-mobile.mjs` -> 150 ok, 0 FAIL après la revue (768, 769 et 1280 px égaux à la base ; chargement, mouvement réduit et bascule compris ; 132 ok avant la revue) ; `KR_FRAG=jeton node tests/e2e/croix-directionnelle.mjs` -> 192 ok, 0 FAIL.
- Rouge après la revue : `KR_SCRIPT=/tmp/kr95/base.user.js KR_FRAG=plateau` -> 42 FAIL ; mutant sans le correctif de chargement (`/tmp/kr95/mut/chargement.user.js`) -> 12 FAIL ; mutant sans le bloc de mouvement réduit (`/tmp/kr95/mut/mouvement.user.js`) -> 4 FAIL.
- Contre-épreuves par mutation du bundle (/tmp/kr95/mut/) : sans `flex-wrap` -> 4 FAIL (cartes-trois à 320 et 375) ; croix à 50 px en dur -> 32 FAIL ; repli sans padding, bâtiments -> 6 FAIL ; grille -> 6 FAIL.
- Masque `CIBLES_TICKET95` : sans lui, le premier passage des zones donnait 20 FAIL attendus (plateau-qualite-usage#cartes 8, typographie-formes#boutons 4, #nettoyage 8 : cibles 44 au lieu de 26 et 28). Avec lui, rejoués seuls : cartes 286 ok, boutons 412 ok, nettoyage 425 ok, 0 FAIL. Prédicat : courant false, 724c5c1 true, e203f87 true (il se retire seul).
- `npm run test:zone -- croix plateau profil cartes-pastilles confort-mobile typographie-formes palette-nation demarrage` : 10473 ok, 6 FAIL, tous temporels sous charge (concurrence 16) : breakpoint-switch#nav-large (2) et #nav-origine (1), barre bureau 1000 et 1100 px ; demarrage-mobile#desktop+pire-cas+m1+m-1+s1 (3), comptage de documents en 6 s. Rejoués seuls : 37 ok, 33 ok et 27 ok, 0 FAIL. Aucun ne mesure les éléments touchés.
- `!important` de la peau : 3188 (base 3203) ; aucun nouveau.
- Commandes : `npm run build` (validation passée), `npm run lint:css` (0), `npm run lint:js` (0, un avertissement préexistant dans report-non-lu.mjs ; aucun nouveau), `npm run test:unit` (57 pass), `npm run test:router` (conforme), `diff -r .hermes/skills .claude/skills` (vide).

### Doutes (aussi dans revue-manuelle.md)

- Planchers de 44 px de `.kr-action-grid > .btn` et des accès rapides non prouvés : aucune fixture n'affiche la grille d'actions en mobile, et les accès rapides font déjà 44 px sur la base. Aucun rouge possible.
- `max-height: 5000px` : temps mort en début de repli, accepté.
- D9.1 : défaut de la base après un aller-retour 767 -> 768 -> 767 px, non reproduit sur fixture (la page se recharge à chaque changement de largeur) ; reporté.

- Accordéon des groupes jamais animé sur la base (transition invalide) ; il s'anime maintenant sur 0,3 s au clic, pas au chargement, et pas en mouvement réduit.
- Règle `.mobile-mini-profile-settings` morte, supprimée ; le bouton réel faisait déjà 44 px.
- Grille d'actions masquée en mobile : plancher sans effet visible. Accès rapides déjà à 44 px.
- Structure native d'une carte à plusieurs actions non relevée (variante de test supposée).
- Lignes de pièces au rythme de la croix (50 px), pièce plancher 44 px.
- `transform: scale(1.1)` au survol : 2,2 px par côté, écart de 8 px entre actions, sans contact.
- `node_modules` du worktree : lien symbolique non suivi, à ne pas commiter.

Clôture (orchestrateur, 2026-10-29) : revue quick du coordinateur faite, commité (`0045caa`) et fusionné sur `feature/next` (`cb73530`) ; `test:all` : 16489 ok, 3 FAIL (attribués ci-dessus et dans `revue-manuelle.md`, section 9.5), puis 16492 ok, 0 FAIL, journal `/private/tmp/kr-testall-95b.log` (03:33, arbre déduit de l'heure).
