---
title: "Blocages et avertissements en tête, jamais repliés ; seule l'aide se replie"
type: 'feature'
ticket: '3'
created: '2026-10-22'
status: 'built'
baseline_revision: '440a9d7d117a529acd8f9225edc4b5fb30d13111'
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

**Problem:** Dans une modale d'ordre, le script mobile replie la première `.alert` venue : il cache l'avertissement de Dormir (`alert-warning`, placé avant les onglets) et laisse le blocage de Pouvoir (`alert-danger`) sous l'aide ; sur ordinateur rien n'est replié ni déplacé ; le bouton « Aide » est bleu clair (`#e3f2fd`, 1:1 en sombre).

**Approach:** Sur ordinateur et mobile, les blocages et avertissements passent en tête du corps de l'onglet, juste sous le titre de l'ordre (`h4`), restent visibles quand le corps défile et ne sont jamais repliés ; seule l'aide (`alert-order`) se replie derrière « ? Aide », au style d'un bouton standard (même fond qu'« Annuler », texte du thème) ; « Valider » reste actif (H2.3, R2, H2.4 ; Q25.2, Q25.3 tranchées par défaut).

## Boundaries & Constraints

**Always:** comportement porté par le socle de la modale d'ordre (ticket 2.2) : idempotent, réappliqué quand le contenu de `#ajax-order` est remplacé, actif aussi quand le bundle tourne avant `<body>` ; P1 option 4 : les règles et la fonction mobiles qu'il remplace (`makeAlertCollapsible`, règles `.bootbox-confirm .kr-alert-toggle`) sont retirées ou réécrites, pas surchargées ; contrastes vérifiés dans les 16 variantes (`kraland` et les 15 classes `kr-theme-variant-*`) par un outil partagé créé dans `tests/e2e/lib/` ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)`.

**Never:** désactiver « Valider » ; changer le texte natif des alertes ; toucher les pastilles (entrée 4), la croix (entrée 5), « Valider » mobile et l'onglet actif (entrée 6) ; réactiver le reste de la chaîne mobile au démarrage réel (bug 6 du backlog).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dormir | avertissement avant les onglets, aide dans l'onglet | avertissement déplacé sous le `h4`, visible, jamais replié ; aide repliée derrière « ? Aide » | No error expected |
| Pouvoir | aide puis blocage dans l'onglet | blocage sous le `h4`, avant l'aide repliée | No error expected |
| Défilement | corps de la modale défilé jusqu'en bas | blocage ou avertissement toujours visible et non recouvert (`elementFromPoint`) | No error expected |
| « ? Aide » | toucher ou clic | l'aide se déplie, puis se replie ; `aria-expanded` suit | No error expected |
| Sans alerte | ordre sans blocage ni avertissement | seule l'aide repliée, rien d'autre ne change | No error expected |
| Contenu remplacé | autre ordre chargé | même rangement sur le nouveau contenu, un seul « ? Aide » | No error expected |
| Contrastes | 16 variantes | « ? Aide » ≥ 4,5:1 ; texte des alertes ≥ 4,5:1 | No error expected |
| Supports | 375, 767, 768, 769, 1280, 1440, 1920 px | même comportement | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js`, section « MODAL PERSONNAGE MOBILE » : socle `applyOrderModal` (~l.8998), `watchOrderModal` (~l.9009), `watchOrderModalsOfBody` (~l.9022) — point d'accroche ; `makeAlertCollapsible` (~l.9397+, garde mobile, replie la première `.alert`, crée `button.kr-alert-toggle` « Aide ») à remplacer ; `enhanceCharacterModal` l'appelle (chaîne mobile).
- `kraland-theme.css` : `.bootbox-confirm .kr-alert-toggle` (~l.1734-1756, mobile, fond `#e3f2fd`) et règles d'alertes de la modale (~l.935-1941, mobile seulement) à réécrire ; bouton standard du thème : fond et bordure d'« Annuler » (`.modal-footer .btn-default`).
- Structure native : voir le plan du ticket 2.2 (Code Map) et `tests/e2e/fixtures/modale-ordre/` (`dormir.html`, `pouvoir.html`).
- Tests : `tests/e2e/modale-ordre.mjs` (fragments `mobile`, `bureau`, `largeurs`, `seuil` ; options `debut`), à étendre ; outil des 16 variantes à créer (`tests/e2e/lib/`), réutilisable par les épopées suivantes.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/lib/` -- outil des 16 variantes (liste, ouverture par variante, calcul de contraste) -- partagé
- [x] `tests/e2e/modale-ordre.mjs` (+ fixture d'un ordre sans alerte si besoin) -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-userscript-template.js` -- rangement des alertes et repli de l'aide dans le socle, deux supports ; `makeAlertCollapsible` retirée de la chaîne mobile ou réécrite
- [x] `kraland-theme.css` -- position collante des alertes, style de « ? Aide », règles mobiles remplacées
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre à 375 ou 1280 px, when elle s'ouvre puis que son contenu est remplacé, then aucun blocage ni avertissement n'est replié et un seul « ? Aide » existe
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

- Fichiers : `kraland-userscript-template.js` (socle : `arrangeOrderAlerts` appelé par `applyOrderModal`, `toggleOrderHelp` délégué sur la modale dans `watchOrderModal` ; `makeAlertCollapsible` et son appel retirés de la chaîne mobile) ; `kraland-theme.css` (section 9e en liste combinée `@media (max-width: 767px), (min-width: 768px)` ; règles `.bootbox-confirm .kr-alert-*` et `@keyframes slide-down` retirées ; règle 7 réécrite) ; `tests/e2e/lib/variantes.mjs` (nouveau : `VARIANTES`, `choisirVariante`, `VARIANTE_POSEE`, `parVariante`, `CONTRASTE`) ; `tests/e2e/modale-ordre.mjs` (168 contrôles, fragment `variantes`) ; fixtures Dormir et Pouvoir (croix de l'aide en `data-dismiss="alert"`, motif Bootstrap, attribut réel non relevé) ; `tests/e2e/lib/router.mjs` (fragment `variantes`) ; ligne de zone du skill `tester-kraland-css` (deux copies, `diff -r` vide) ; bundle et `version.json`.
- Décision : un bloc `div.kr-order-alerts` sous le `h4` (collant, `top: -15px`, `z-index: 111`, `clear: both`, fond `--kr-bg-surface`) plutôt que chaque alerte collante : plusieurs alertes s'empilent sans se chevaucher, et le fond opaque empêche le contenu de transparaître sous les teintes d'état du mode sombre (15 %). Alertes déplacées dans l'ordre du document ; sans `h4`, bloc en tête de l'onglet ; sans onglet actif, rien n'est déplacé, mais l'aide se replie quand même. `top` vaut moins le padding du corps (15 px sur les deux supports) : collé, le bloc touche le bord haut du corps, sans bande de contenu au-dessus ; sous 768 px sans `body.mobile-mode` (fenêtre rétrécie sans rechargement), la règle 9c ôte ce padding, d'où `top: 0` dans ce cas. `clear: both` : le bloc commence sous le lien flottant « [?] » du titre, que la règle mobile des cibles tactiles (PHASE 5, `min-height: 44px`) rend plus haut que le `h4` (relevé sur le site réel : Pouvoir, 375 px, lien à moitié recouvert).
- Décision : `z-index: 111`, au-dessus des zones collantes de la chaîne mobile (onglets 100, titre 110, coût et durée 90). Conséquence sur mobile : corps défilé, le bloc couvre la zone d'onglets collante, laissée telle quelle.
- Décision : « ? Aide » = `button.btn.btn-default.kr-order-help-toggle` (fond d'« Annuler » ; texte `--kr-text-primary`), libellé constant « Aide » avec l'icône `fa-question-circle`, état porté par `aria-expanded` ; aide repliée par l'attribut `hidden`. Écouteur délégué : il sert aussi les contenus remplacés ou recopiés par la chaîne mobile. Un « ? Aide » qui n'est plus suivi de son aide (aide retirée par sa croix, `data-dismiss="alert"`) est retiré au passage suivant du socle.
- Décision (P1 option 4) : la règle mobile `.bootbox-confirm .alert` teintait toutes les alertes en information ; la teinte ne vaut plus que pour l'aide (`.bootbox-confirm .alert-order`). Blocages et avertissements reprennent leur couleur d'état sur mobile, comme sur ordinateur (Bootstrap en clair, thème en sombre). Effet : texte de l'avertissement en clair sur mobile 4,37:1 avant, 4,54:1 après.
- Contrastes mesurés par l'outil (375 et 1280 px) : « ? Aide » 17,97:1 en clair, 13,22 à 14,56:1 en sombre ; avertissement 4,54:1 et blocage 4,53:1 dans les 8 variantes claires (couleurs natives de Bootstrap), au moins 11,30:1 en sombre ; aide dépliée au moins 14,51:1.
- Limites : (1) à 375 × 667, à l'ouverture, le texte de l'avertissement de Dormir dépasse le pli d'environ 24 px (447 à 506 px pour un pli à 482 px : titre, puis lien « [?] » de 44 px dégagé) ; le contrôle de défilement exige donc, en haut, que la partie visible ne soit pas recouverte, et le texte entier visible au milieu et en bas ; à 320 × 568 ou en paysage, il est sous le pli à l'ouverture, puis collé dès le premier défilement (suite de Q25.2) ; (2) sur mobile, la bande collante coût et durée (`.kraland-action-footer`, `bottom: 72px`, entrée 4) recouvre encore le `h4` de Dormir et « ? Aide » de Pouvoir à l'ouverture ; « ? Aide » se touche après défilement ; (3) en clair, 4,53 et 4,54:1 passent de peu ; les couleurs d'état relèvent de l'épopée palette (Q3).
- Vérification : bundle d'avant (HEAD 2a50aaa) 58 ok, 103 FAIL sur 161 (suite avant le contrôle du lien « [?] ») ; bundle après 168 ok. Contre-épreuves sur copies mutées du bundle hors dépôt, toutes rouges : sans position collante 9 FAIL ; sans `z-index` 3 FAIL (mobile) ; fond transparent 4 FAIL (sombre) ; aide non repliée 41 ; `aria-expanded` figé 7 ; alertes non déplacées 41 ; texte hors thème 16 (clair) ; sans `btn-default` 32 ; socle mobile seulement 54 ; sans écouteur 7 ; correctifs de revue : bouton orphelin gardé 7 (croix de l'aide), repli après le test d'onglet 7 (sans onglet actif), `top: 0` 9 (bord haut), sans la règle sans `mobile-mode` 1 (transition 769 -> 767) ; sans `clear: both` 2 (lien « [?] » recouvert à 375 et 767 px). `test:parler` 78 ok ; `test:router` conforme ; `test:unit` 56/56 ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant dans `report-non-lu.mjs`) ; `test:all` VERT, 4509 ok, 0 FAIL (avant les correctifs de revue) ; après eux, `npm run test:zone -- modale-ordre parler` VERT (168 et 78 ok), eslint et stylelint des fichiers touchés à 0.
- Non fait : vérification manuelle sur le site réel (pas de mandat dans cette session) ; captures de revue sur fixtures hors dépôt (`KR_SHOTS`).

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

**Manual checks (if no CLI):**
- Site réel, lecture seule : modales Dormir et Pouvoir ouvertes puis annulées, 375 et 1280 px, deux variantes ; captures hors dépôt pour la revue manuelle.

## Review Triage Log

Passe quick du 2026-10-22 : 5 patch, 2 renvoyés à la revue manuelle, 1 constat du site réel.
- medium, patch — « ? Aide » orphelin si la croix native de l'aide (`data-dismiss="alert"`) la retire : bouton retiré quand il n'est plus suivi de son aide ; contrôle de fermeture par la croix à chaque largeur.
- low, patch — aide non repliée sans `.tab-pane.active` : repli fait avant ce test ; contrôle ajouté.
- low, patch — bande de 15 px au-dessus des alertes collées : `top: -15px` (et `top: 0` quand `mobile-mode` manque sous 767 px, transition dans le même onglet).
- low, patch — retouche hors périmètre du bloc 9d : annulée.
- low, patch — en-tête de la suite périmé : réécrit.
- renvoyé — sur mobile, le bloc d'alertes recouvre la zone d'onglets collante (revue-manuelle.md).
- renvoyé — « ? Aide » de Pouvoir sous la bande coût / durée à l'ouverture (repris par 2.4).
- site réel — le bloc d'alertes chevauchait le lien « [?] » du titre à 375 px (lien de 44 px par la règle des cibles tactiles) : `clear: both` ; contrôle `elementFromPoint` ; contre-épreuve rouge. Effet : avertissement de Dormir à cheval sur le pli à l'ouverture à 375 × 667 (revue-manuelle.md, Q25.2).

Vérification : `modale-ordre.mjs` 168 ok ; `test:parler` 78 ok ; `test:router` conforme ; `lint:css`, `lint:js` 0 erreur ; `test:all` 4530 ok, 0 FAIL. Site réel (lecture seule, modales annulées) : Dormir et Pouvoir, 375 et 1280 px, Kraland clair et Empire Brun sombre : « Annuler » / « Valider », alerte sous le titre et visible, aide repliée derrière un seul « ? Aide ». Captures : `.tmp/captures/validation-2-2-2-3-modale/` (hors git).

Suite donnée au ticket 2.4 (2026-10-22) : le bloc des alertes est déplacé juste après le `h3` du formulaire (avant les caractéristiques et les onglets) pour que l'avertissement de Dormir reste entier à l'ouverture avec les pastilles dans le pied de la modale ; décision prise en autonomie, consignée dans revue-manuelle.md.
