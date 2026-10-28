---
title: "Au démarrage réel de la page, trois modules des modales ne s'installent pas"
type: 'bugfix'
ticket: 6
created: '2026-10-28'
status: 'built'
baseline_revision: '882f62a8947635485340955855c45e9f92a07de4'
route: 'full'
route_source: 'auto'
risk: medium
review: ''
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le bundle tourne au `@run-at document-start`, avant `<body>`. `initCharacterModalMobile` et `enableModalBackdropClick` n'observent `document.body` que s'il existe, sans nouvel essai : au démarrage réel, le suivi de la fenêtre de Parler (`trackOrderModalViewport`), la mise en forme mobile des modales (`enhanceCharacterModal`) et la fermeture au clic sur le fond (`enableModalBackdropClick`) ne s'installent pas. Seul le socle du ticket 2.2 a reçu un report.

**Approach:** Corriger à l'origine, à l'image du socle 2.2 : quand `<body>` manque, poser l'observateur des modales au `DOMContentLoaded`. Un seul observateur porte les trois actions de `initCharacterModalMobile` (suivi de Parler, socle, chaîne mobile) ; `enableModalBackdropClick` reçoit le même report.

## Boundaries & Constraints

**Always:** comportement identique à l'injection après `<body>` (même observateur, même ordre : suivi, socle, chaîne mobile à 150 ms) ; report par la même fonction au `DOMContentLoaded` (un seul écouteur si `initCharacterModalMobile` est appelé deux fois) ; avertissement de Dormir jamais replié (ticket 2.3) ; tests avec injection avant `<body>` dans `modale-ordre` et `parler-viewport`, rouges sur le bundle de base.

**Never:** changer le socle du ticket 2.2 (`watchOrderModal`, `applyOrderModal`), l'envoi natif des ordres, le rendu ordinateur hors fermeture au clic sur le fond ; toucher `createMobileOverlay` (bug 7) ou `tests/e2e/fin-initialisation.mjs` (backlog 8) ; nouvel `!important`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dormir, 375 px, document-start | bundle avant `<body>`, viewport non lue (980 px) | `data-structure-transformed`, pied `kraland-modal-footer`, grille d'onglets ; avertissement sous le titre, jamais replié | No error expected |
| Parler, 390 px, document-start | idem, ordre avec `textarea#message` | `kr-order-viewport` et `--kr-order-visible-height` à la hauteur visible ; « Valider » atteignable à 390 × 320 | No error expected |
| Clic sur le fond, 375 et 1280 px, document-start | Bootbox `backdrop: "static"` | option passée à `true` ; un vrai clic sur le fond ferme la modale | No error expected |
| 1280 px, document-start | ordinateur | chaîne mobile non étendue | No error expected |
| Injection après `<body>` | cas déjà couvert | inchangé (observateur enregistré deux fois sur mobile, comme avant) | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js`, « MODAL PERSONNAGE MOBILE » : `watchOrderModalsOfBody` (report du socle 2.2, ne posait que `watchOrderModal`) devient `watchModalsOfBody` (suivi, socle, chaîne mobile) ; `initCharacterModalMobile` l'appelle, ou le reporte au `DOMContentLoaded`.
- `kraland-userscript-template.js`, « MODAL BACKDROP CLICK TO CLOSE » : `enableModalBackdropClick`, garde `if (document.body)` sans report.
- `kraland-userscript-template.js`, `init()` : `enableModalBackdropClick()` et `initCharacterModalMobile()` appelés après `await ensureTheme()`, `<body>` absent au document-start ; `initMobileFeatures` rappelle `initCharacterModalMobile` si `innerWidth < 768`.
- `tests/e2e/modale-ordre.mjs` : `debutDeDocument` / `verifierDebut` (option `debut`, fragments `mobile` et `bureau`).
- `tests/e2e/parler-viewport.mjs` : `open()` (injection au `body`), fragments `transitions`, `fallback`, `ajax`, `bureau`.
- `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs` : fragments de `parler-viewport`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/modale-ordre.mjs` -- mesures de `debutDeDocument` après la chaîne mobile et la levée de `backdrop: "static"` (attente bornée à 3 s) ; contrôles « bug 6 » : chaîne mobile (375 px) ou non étendue (1280 px), vrai clic sur le fond qui ferme Dormir -- AC 1, 2, 3
- [x] `tests/e2e/parler-viewport.mjs` -- option `debut` de `open()` (script en tête de `<head>`, injection dès `<html>`) et fragment `debut` -- AC 1, 3
- [x] `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs` -- fragment `['debut']` de `parler-viewport` (unité à part : pas de durée orpheline)
- [x] `kraland-userscript-template.js` -- `watchModalsOfBody` reporté au `DOMContentLoaded` ; même report dans `enableModalBackdropClick` -- cause
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given le bundle injecté avant `<body>` à 375 px, when une modale d'ordre puis celle de Parler s'ouvrent, then mise en forme mobile, suivi de la fenêtre de Parler et fermeture au clic sur le fond agissent comme après `<body>`
- Given la chaîne mobile installée au document-start, when Dormir s'ouvre, then l'avertissement reste sous le titre, visible, jamais replié
- Given `modale-ordre` (`mobile`, `bureau`) et `parler-viewport` (`debut`), when elles tournent sur le bundle de base, then elles échouent ; sur le bundle corrigé, elles passent

## Implementation Notes

- Reproduction (bundle de base, option `debut`, 375 px) : `body.mobile-mode` présent, socle 2.2 actif, mais `data-structure-transformed`, `kraland-modal-footer`, grille d'onglets absents ; option `backdrop` restée `"static"` (375 et 1280 px) ; Parler : ni `kr-order-viewport` ni `--kr-order-visible-height`. Les trois modules du ticket sont bien inactifs.
- Décision : `watchOrderModalsOfBody` remplacé par `watchModalsOfBody`, qui porte les trois actions ; le chemin avec `<body>` présent garde un observateur par appel (deux sur mobile, `indicateurs: 2` toujours attendu par la suite).
- Décision : `enableModalBackdropClick` garde son observateur et ses états en fermeture ; seul `observe` est reporté.
- Assumption: la fermeture au clic sur le fond s'active désormais aussi sur ordinateur au démarrage réel ; c'est le comportement après `<body>` (AC 1), donc voulu.
- Assumption: AC 4 (preuve P2) écartée : le point B de P2 n'a pas de résultat, et la fixture prouve le défaut.
- Assumption: `debut` de Parler est un fragment à part dans le routeur, pour ne pas renommer l'unité `ajax+bureau` (durée mesurée).
- Contrôle du fond : premier point (du bas vers le haut) où `elementFromPoint` rend la modale elle-même, puis `page.mouse.click` (appui et relâchement au même endroit).
- Hors périmètre, constaté : au document-start, `innerWidth` vaut 980 px sur téléphone, donc `initMobileFeatures` ne s'exécute pas (overlay, panneau de compétences, mini-chat, `initModalTabScroll`) ; `initModalTabScroll` a la même garde `if (document.body)` sans report. À trier avec le bug 7.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-userscript-template.js `watchModalsOfBody` | Avec `<body>` présent, même chaîne qu'avant (suivi de Parler, socle, `enhanceCharacterModal` à 150 ms) ; sans `<body>`, la chaîne complète est posée au DOMContentLoaded | sans défaut | none | `modale-ordre` mobile,bureau 3 FAIL sur la base, vert après |
| 2 | quick | kraland-userscript-template.js `enableModalBackdropClick` | Report au DOMContentLoaded ; actif sur ordinateur au démarrage réel comme à l'injection après `<body>` | sans défaut | none | contrôle « clic sur le fond ferme Dormir » |
| 3 | quick | kraland-userscript-template.js `initModalTabScroll` | Même garde `document.body` sans report, hors périmètre du ticket | réel, hors périmètre | defer | deferred-work.md |

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/wt6-base/bundle-base.user.js KR_FRAG=mobile,bureau node tests/e2e/modale-ordre.mjs` -- expected: rouge sur les contrôles « bug 6 »
- `KR_SCRIPT=/tmp/wt6-base/bundle-base.user.js KR_FRAG=debut node tests/e2e/parler-viewport.mjs` -- expected: rouge
- `npm run build && npm run test:zone -- modale-ordre parler` -- expected: VERT
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: conformes, 0 erreur

## Result

Provisoire, worktree `wt/6`, base `882f62a`. Bundle de base : `npm run build` sur la base, copié dans `/tmp/wt6-base/bundle-base.user.js`.

- Rouge avant (bundle de base) : `modale-ordre` `mobile,bureau` 3 FAIL sur 75 (375 px : chaîne mobile absente, `backdrop` `"static"` ; 1280 px : `backdrop` `"static"`) ; `parler-viewport` `debut` 2 FAIL sur 8 (mise en forme absente, fenêtre non suivie).
- Vert après : mêmes commandes, 75 ok et 8 ok ; `npm run test:zone -- modale-ordre parler` VERT, 457 ok (modale-ordre 371, parler-viewport 86).
- AC 2 : contrôle « document-start (ticket 2.3) » à 375 px vert, mesuré après la chaîne mobile : avertissement de Dormir sous le titre, jamais replié.
- `npm run test:changed` : élargi au total (module transverse « MODAL BACKDROP CLICK TO CLOSE »), VERT, 13844 ok, 0 FAIL ; `test:unit` 56 ok.
- `npm run test:router` : conforme (exit 0) ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement préexistant, `report-non-lu.mjs`).
