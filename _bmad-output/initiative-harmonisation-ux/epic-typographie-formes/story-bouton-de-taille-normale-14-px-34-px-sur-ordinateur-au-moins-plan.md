---
title: "Bouton de taille normale : 14 px, 34 px sur ordinateur, au moins 44 px sur mobile"
type: 'feature'
ticket: '2'
created: '2026-10-24'
status: 'built'
baseline_revision: '4d97496'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les boutons n'ont pas une taille normale commune (H6.1, H6.2, `.memlog.md:46-47`) : sur ordinateur les boutons de jeu `.mini` sont à 12 px, Interface (Sauvegarder, Importer en `.btn-sm`) à 12 px / 30 px, Envoyer du kramail à 15 px / 47 px ; sur mobile la règle globale pose `.btn` à 16 px et `.btn-xs/-sm/-lg` à 32/38/50 px de haut (Interface 39 px, Événements 38 px, sous 44 px).

**Approach:** Tout bouton primaire et standard de la liste ci-dessous prend, par les jetons de 4.1 et un nouveau jeton de hauteur, 14 px et 34 px de haut sur ordinateur, 14 px et au moins 44 px de haut sur mobile (DESIGN.md `button-primary` :93, `button-standard` :103 ; EXPERIENCE.md :91, :207, :219, :280). Les exclusions gardent leurs valeurs de la base.

## Boundaries & Constraints

**Always:**
- Liste visée : `.btn` primaires et standard (`.btn-primary`, `.btn-default`, toute balise : `a`, `button`, `input[type=button|submit]`) des pages de jeu (boutons d'action `.kr-action-grid > .btn`, accès rapide `.kr-quick-access-buttons > .btn`, Dormir/Prier/Pouvoir/Fouiller en `.mini`), forum (en-tête du sujet et du sous-forum, Répondre), kramail (en-tête de liste, « + » des contacts, Ajouter/Effacer `.kd-msg-btn`, Envoyer sur ordinateur), Interface (Sauvegarder, Importer, « Voir l'historique »), accueil (`.accueil-play-btn`), pied du changelog.
- Exclusions (valeurs de la base gardées, mesurées égales au bundle `4d97496`) : groupes de boutons `.btn-group-xs` des stats et `.kr-icon-cell` ; `.dashboard-group-buttons` ; barres BBCode (toutes) ; croix directionnelle ; flèches de l'index et du sous-forum ; votes, date et groupe `.btn-group-xs` des messages ; pagination (4.4) ; modales Bootbox et `.modal` (4.3) ; boutons-icônes (en-tête du kramail `font-size:0`, `restoreBtn` œil, template:2088-2091) ; boutons-images du plateau (bâtiments) ; Envoyer sur mobile (`send-button` 48 px, R4, épopée 7) ; `#kr-resize-banner`.
- Jeton `--kr-button-height: 34px` sur `:root` à côté de `--kr-touch-target` ; tailles via `var(--kr-font-button)`, `var(--kr-button-height)`, `var(--kr-touch-target)`.
- P1 option 4 : réécrire les règles existantes (`kraland-theme.css` l.4605-4634 mobile global, règles de page listées au Code Map), ne pas ajouter de règle qui les bat ; mobile `@media (max-width: 767px)`, bureau `(min-width: 768px)` ; ne pas toucher aux couleurs, rayons (4.8) ni à l'espacement hors effet de la hauteur (4.9).
- Rouge avant sur le bundle de base, contre-épreuve pour chaque contrôle nouveau.

**Never:** réduire une cible tactile sous 44 px sur mobile ; règle `:focus` ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ordinateur | boutons de la liste, 768, 769, 1280, 1440, 1920 px, Kraland clair et Empire Brun sombre | font-size 14px, hauteur 34 px (± 0,5) | n/a |
| Ordinateur tactile | `pointer: coarse` ≥ 768 (l.13301) | min-height 44 gardé | n/a |
| Mobile | boutons de la liste, 375, 767 px | font-size 14px, hauteur ≥ 44 px | n/a |
| Exclusions | éléments exclus, mêmes largeurs | font-size, hauteur, padding égaux au bundle de base | n/a |
| Bascule | un onglet 767 → 768 → 767 | tailles du bon côté à chaque pas | n/a |

</frozen-after-approval>

## Code Map

- `kraland-theme.css:22-43` -- jetons `:root` de 4.1 (`--kr-font-button` 14 l.31, `--kr-touch-target` 44 l.42) : ajouter `--kr-button-height: 34px`.
- Mobile global (bloc `@media (max-width:767px)` ouvert l.4037) : 4605 `a:not(.list-group-item), button, .btn, input[…]` min-height 44 !i ; 4613 `.btn` padding 12px 20px, 16px !i ; 4618 `.btn-xs` 32/14px ; 4624 `.btn-sm` 38/14px ; 4630 `.btn-lg` 50/18px. `.btn` → `var(--kr-font-button)` ; `.btn-sm` et `.btn-lg` réécrits ou retirés pour la taille normale ; `.btn-xs` n'atteint que des exclusions ou des compacts : garder sa règle sauf si un bouton de la liste la porte (le prouver par mesure). Les exclusions héritent aujourd'hui de ces règles : vérifier qu'elles gardent leurs valeurs.
- Pages : 606/612 (`min-width:3840px`) `#player-actions-section .btn` 13px ; 13278 (≥768) `.kr-action-grid > .btn, .kr-quick-access-buttons > .btn` min-height 34, line-height 1.2 ; 13301 (≥768 coarse) 44 ; 13319 (≤767) 44 ; kramail 9451 `#topics_wrapper .btn-group .btn` 44/14 ; 10141 (≥769) « + » 32 px/16 px ; 10191 (≥769) Envoyer padding 12px 32px, 15px ; 10331 (≤768) en-tête de rédaction ; 10387 (≤768) `.input-group-addon .btn` 18px ; 11354 (≥768) `.kd-msg-btn` 26 px/13 px ; 11619 (≤767) `.kd-msg-btn` 40 px ; forum 15243 (≤767) Répondre/••• 44/14 ; 15273 `.pull-right .btn-success` 36 px (vérifier : si c'est un score ou vote → exclusion) ; 11844 `.kr-changelog-footer button` ; 12174 / 12431 `.accueil-play-btn` 15/18px.
- Exclusions (Explore) : 2416/2432/6037 tableau de bord ; BBCode 9821-9869, 10215-10238, 10413-10560, 10701/10739, 11134-11158, 11363-11411, 13535-13679, 15380-15435, 15504-15509 ; icônes de cellule 12934/13093/13224 ; flèches 14930/14944/15038/15050, 14186/14200/14585/14597 ; pagination 8991, 9273, 14457-14490 ; votes 15166 ; en-tête du kramail 9101-9180 ; Bootbox ~1189-2174, 6894, 7036, 7148, 7202 ; Envoyer mobile 9977, 15464.
- Template : `:8714`/`:8717` Sauvegarder/Importer en `.btn-sm` (taille par le CSS, aucun style en ligne à changer) ; `:2088-2091` `restoreBtn` (exclusion, bouton-icône).
- Fixtures : `plateau-qualite-usage.html:49-53` (Dormir, Prier, Fouiller, Pouvoir `.mini`) ; `forum-sujet.html:10-14` (en-tête), :26-28 (votes, exclusion) ; `sous-forum-debuter.html:36` ; `kramail-nouveau.html` (« + », Envoyer, Smileys/Couleurs `.btn-xs` = BBCode, exclusion) ; `palette-nation-profil.html` sous `/profil/interface` (Sauvegarder, Importer, « Voir l'historique » insérés par le template).
- Tests à suivre : `plateau-profil-mobile.mjs:154` (libellé du padding 12px 20px) ; `messages-v3.mjs:251` (Répondre `w >= 80`, sensible au padding) ; `sous-forum.mjs:408` (largeur 140-260) ; `kramail-redaction.mjs:977-979` (`.kd-msg-btn` ≥ 40 / ≥ 24, compatible) ; `forum-mobile.mjs`, `modale-ordre.mjs:1005,1021`, `croix-directionnelle.mjs`, `forum-index.mjs:370` doivent rester verts.
- Suite : `tests/e2e/typographie-formes.mjs` (310 l.) : nouveau fragment `boutons` sur le modèle de `largeurs()` (l.215) avec sa table de pages et sélecteurs (visés / exclus), mesure `getBoundingClientRect().height` en plus de `MESURE` (l.167) ; base des exclusions = bundle de `4d97496` (constante distincte de `COMMIT_AVANT` = d68ab55) ; fragment ajouté à `tests/e2e/lib/router.mjs:73` ; mot-clé l.139 complété par `kr-action-grid|kr-quick-access-buttons|kd-msg-btn` (pas `btn`, trop large).

## Tasks & Acceptance

**Execution:**
- [ ] `typographie-formes.mjs` fragment `boutons` (+ bascule si besoin), routeur -- rouge sur la base pour les visés, vert pour les exclusions.
- [ ] `kraland-theme.css` -- jeton de hauteur ; règles mobiles globales et règles de page réécrites.
- [ ] Suites existantes ajustées là où elles figent un ancien padding ou une ancienne taille ; écart voulu consigné en commentaire.
- [ ] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` tourne, then 0 FAIL ; chaque bouton de la liste mesuré à 14 px / 34 px (ordinateur) et 14 px / ≥ 44 px (mobile), chaque exclusion égale à la base.

## Implementation Notes

- Mobile global : `.btn` en `var(--kr-font-button)` ; règles `.btn-sm` (38/14) et `.btn-lg` (50/18) retirées (taille normale), `.btn-xs` gardée (n'atteint aucun bouton de la liste).
- Exclusions qui héritaient du 16 px de la règle globale, fixées à `16px !important` pour garder la base : `.kr-icon-cell.btn`, Envoyer mobile, date des messages (son `font-size: 12px` n'a jamais pris effet).
- En-tête de rédaction du kramail (retour Réception) : règle sortie du bloc `max-width: 768px` vers `max-width: 767px`, 768 est ordinateur.
- Interface : nouveau bloc ≥ 768 `#kr-sync-section .btn` (aucune règle à réécrire n'existait pour les `.btn-sm` du bureau).
- Écart consigné (forum-index, hors-perimetre) : boutons d'en-tête du sujet (`.forum-top .pull-right > .btn`) et de l'index (`#col-right > .pull-right > .btn`, « Tous les forums ») en 14 px sur mobile. Neutralisé sur le bundle « avant » par `BOUTONS_TICKET42` (`tests/e2e/lib/variantes.mjs`). Le CSS ne distingue pas un bouton à icône seule d'un bouton à texte : l'icône « Tous les forums » suit donc la taille normale.
- Suite : doublure `.mini { font-size: 12px }` (taille native du site, sa feuille n'est pas servie) sur la fixture du plateau, sans quoi la base passe déjà.
- Après revue :
  - « + » des contacts : règle mobile sortie du bloc `max-width: 768px` vers `max-width: 767px`, en `var(--kr-font-button)`. La règle ordinateur passe de `min-width: 769px` à 768. Il est mesuré dans son champ natif rendu visible (page `contacts` de la suite).
  - Actions mobiles « Répondre » / « Nouveau sujet » (`.forum-thread-action`, en-tête du sujet et du sous-forum déplacé par le JS) : 15 px vers `var(--kr-font-button)`. Elles sont mesurées sur mobile. Sur mobile, l'en-tête natif du sujet est masqué, celui de la réception est fait de boutons-icônes `font-size: 0` (exclusion), et le « + » de la liste de réception est masqué : aucun visé mobile pour eux.
  - Modales (exclusion 4.3) : « ? Aide » (`.kr-order-help-toggle`) fixé à `16px !important` sur mobile. Les boutons de la modale Dormir et d'une confirmation avec barre BBCode sont comparés au bundle de base.
  - `#player-actions-section .btn` (≥ 3840) : padding vertical retiré, 34 px (sonde ponctuelle). `.kr-changelog-footer button` : hauteur et padding d'ordinateur dans `@media (min-width: 768px)`, le padding global revient à la base.
- Non mesuré par la suite : `#player-actions-section` ≥ 3840 px. La règle ≤ 767 des actions et accès rapides (`--kr-touch-target`) est masquée par le min-height 44 `!important` global (contre-épreuve sans effet, attendu).

## Plan Change Log

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | « + » des contacts à 18 px sur mobile et 18/44 à 768 px | medium | patch | Règle l.10373-10388 (≤768) non réécrite, ≥769 ne couvre pas 768. |
| 2 | Boutons-icônes de l'en-tête du sujet et de l'index passent de 16 à 14 px sur mobile | low | reject (consigné) | Écart réel mais icône 2 px plus petite ; le CSS ne distingue pas icône seule et texte (`:has` ne voit pas les nœuds texte), le corriger demande une classe posée par le JS. Soumis à Arnaud dans revue-manuelle.md. |
| 3 | En-têtes du sujet, du sous-forum et du kramail mesurés sur ordinateur seulement | medium | patch | `PAGES_BOUTONS` : support 'bureau' seul pour ces clés ; critère mobile non prouvé. |
| 4 | `.btn` du corps d'une modale passe de 16 à 14 px sur mobile sans contrôle d'exclusion | medium | patch | Règle globale l.4621 ; `.bootbox-confirm .btn-toolbar .btn` l.1444 sans taille propre ; aucune modale dans `PAGES_BOUTONS`. |
| 5 | Boutons d'action à ≥ 3840 px ≈ 34,8 px | low | patch | `#player-actions-section .btn` (1,1,0) garde padding 8px 14px. Correction directe. |
| 6 | `.kr-changelog-footer button` : taille posée en global | low | patch | Règle hors media query, contraire à AGENTS.md. Correction directe. |

## Verification

**Commands:**
- `npm run build` ; `KR_FRAG=boutons node tests/e2e/typographie-formes.mjs` ; `npm run test:zone -- typographie-formes plateau forum sous-forum kramail modale-ordre` (zones réelles : voir `tests/e2e/lib/router.mjs`) ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, lint 0 erreur. (`test:all` : orchestrateur, machine calme.)

**Results (2026-10-24, arbre de travail sur 4d97496, non commité) :**
- `KR_FRAG=boutons,boutons-bascule` : 332 ok / 0 FAIL ; sur le bundle de base 4d97496 : 60 FAIL, tous sur des visés, exclusions vertes.
- Contre-épreuves (copie mutée du CSS, bundle jetable) : 14 mutations rouges (2 à 12 FAIL chacune), dont 3 exclusions et la règle déplacée à 768. Deux restent vertes, chacune masquée par un `!important` : `.kr-action-grid` ≤ 767 par la règle globale 44, `height` seule de `.kd-msg-btn` mobile par son `min-height` (la mutation des deux lignes est rouge).
- `npm run test:zone -- typographie-formes plateau forum sous-forum kramail modale-ordre messages profil croix palette-nation` : 0 FAIL après consignation de l'écart forum-index ; `npm run test:router` conforme ; `lint:css` 0, `lint:js` 0 erreur.
- `npm run test:all` : 6566 ok / 0 FAIL, VERT (charge 2,1).

## Result

Jeton `--kr-button-height: 34px` ; règle mobile globale `.btn` en `var(--kr-font-button)`, règles `.btn-sm`/`.btn-lg` mobiles retirées ; boutons de jeu (actions, accès rapide), forum (actions mobiles `.forum-thread-action`), kramail (« + », Envoyer sur ordinateur, `.kd-msg-btn`), Interface (Sauvegarder, Importer), accueil et changelog en 14 px / 34 px (ordinateur), 14 px / ≥ 44 px (mobile) ; exclusions héritant du 16 px global fixées à leur valeur de base (cellules d'icône, Envoyer mobile, date des messages, « ? Aide » de la modale). Fragments `boutons` et `boutons-bascule` de `typographie-formes.mjs` : visés rouges sur 4d97496, exclusions égales à la base, contre-épreuves rouges. Revue quick : 6 constats, 5 patchés, 1 rejeté et soumis à Arnaud (icônes seules à 14 px sur mobile). `npm run test:router` conforme, lint 0 erreur, `npm run test:all` 6650 ok, 0 FAIL (machine calme).
