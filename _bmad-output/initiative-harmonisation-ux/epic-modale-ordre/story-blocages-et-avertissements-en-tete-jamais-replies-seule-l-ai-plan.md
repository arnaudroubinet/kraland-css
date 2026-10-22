---
title: "Blocages et avertissements en tête, jamais repliés ; seule l'aide se replie"
type: 'feature'
ticket: '3'
created: '2026-10-22'
status: 'in-progress'
baseline_revision: '440a9d7d117a529acd8f9225edc4b5fb30d13111'
route: 'full'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
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
- [ ] `tests/e2e/lib/` -- outil des 16 variantes (liste, ouverture par variante, calcul de contraste) -- partagé
- [ ] `tests/e2e/modale-ordre.mjs` (+ fixture d'un ordre sans alerte si besoin) -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [ ] `kraland-userscript-template.js` -- rangement des alertes et repli de l'aide dans le socle, deux supports ; `makeAlertCollapsible` retirée de la chaîne mobile ou réécrite
- [ ] `kraland-theme.css` -- position collante des alertes, style de « ? Aide », règles mobiles remplacées
- [ ] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre à 375 ou 1280 px, when elle s'ouvre puis que son contenu est remplacé, then aucun blocage ni avertissement n'est replié et un seul « ? Aide » existe
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

**Manual checks (if no CLI):**
- Site réel, lecture seule : modales Dormir et Pouvoir ouvertes puis annulées, 375 et 1280 px, deux variantes ; captures hors dépôt pour la revue manuelle.
