---
title: "Au démarrage réel sur téléphone, le défilement des onglets de modale ne s'installe pas et la chaîne des modales passe deux fois"
type: 'bugfix'
ticket: 6
created: '2026-10-28'
status: 'built'
baseline_revision: '22b5582c946bc879e45b9116cb9d70ebb039934e'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'orchestrator'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le bundle tourne au `@run-at document-start`. Sur téléphone, `innerWidth` vaut alors 980 px (meta viewport non analysée) : `initMobileFeatures` sort aussitôt et le défilement des onglets de modale (`initModalTabScroll`) ne s'installe jamais. Dans une fenêtre étroite sans émulation, `initModalTabScroll` garde `document.body`, encore absent, sans nouvel essai. À l'injection après `<body>`, `initCharacterModalMobile` est appelée deux fois (par `init()` et par `initMobileFeatures`) : la chaîne mobile de chaque modale passe deux fois (deux `.kr-tabs-indicator`). Les autres modules d'`initMobileFeatures` sont sans effet visible ou en doublon : la superposition, le bouton et le panneau des compétences sont en `display: none !important` en `body.mobile-mode` (TASK-1.6), et `MiniChat:FAB` fait foi pour le mini-chat.

**Approach:** Corriger à l'origine. `initMobileFeatures` ne fait rien quand le thème est coupé. Tant que le document est en cours d'analyse, elle se reporte au `DOMContentLoaded`, après la mise en forme du DOM et avant la file d'initialisation : la largeur et le DOM y sont prêts. Elle n'installe plus que le défilement des onglets. Celui-ci ne recentre qu'au changement d'onglet actif, sous un seul timer. `initCharacterModalMobile` n'est plus appelée que par `init()`. `createMobileOverlay`, `initMobileSkillsPanel` et `initMobileMiniChat` sont supprimées (code mort).

## Boundaries & Constraints

**Always:** thème coupé, aucun module mobile et le lien natif `#flap` reste intact ; chaque module s'installe une seule fois, quand la largeur et le DOM sont prêts ; rendu à l'injection au `DOMContentLoaded` inchangé, sauf la chaîne mobile des modales, qui passe une fois au lieu de deux ; ordinateur (≥ 768 px) inchangé ; `html[data-kr-ready]` toujours posé ; tests rouges sur le bundle de la base.

**Never:** try/catch qui masque une exception ; nouvel `!important` ; toucher au socle 2.2 (`watchOrderModal`), à `enableModalBackdropClick` ou aux défauts d'initialisation exclus par l'épopée (bouton palette, `insertChangelogButton`, `setTimeout` de 150 ms, rang de `.kr-mobile-overlay`) ; modifier `kraland-userscript-main.user.js` à la main.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Téléphone, document-start | plateau, 375 px émulé, largeur lue ≥ 768 au début | ni superposition, ni bouton ou croix des compétences, ni croix ajoutée à `#flap` ; le FAB ouvre le mini-chat ; modale : une `.kr-tabs-indicator`, un observateur de défilement des onglets, défilement au changement d'onglet actif, aucun au toucher d'un onglet non actif ; `data-kr-ready` | aucune exception |
| Fenêtre étroite, document-start | plateau, 375 px sans émulation (largeur réelle) | idem | aucune exception |
| Téléphone, DOMContentLoaded, load, différé | référence et injections tardives | idem (une seule chaîne mobile au lieu de deux) | aucune exception |
| Thème coupé, document-start | plateau, 375 px émulé, `kr-theme-enabled` à 'false' | lien `#flap` non détourné (hash posé), aucune croix ni superposition, aucun observateur de défilement des onglets | aucune exception |
| Ordinateur, document-start | plateau, 1280 px | ni défilement des onglets, ni chaîne mobile ; `data-kr-ready` | aucune exception |
| Fenêtre étroite avant body (backlog 7) | `/forum`, 375, 767 et 768 px | inchangé (`fenetre-etroite`) | aucune exception |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js`, MOBILE FEATURES : `initMobileFeatures` (garde de largeur lue trop tôt), `createMobileOverlay` (report du backlog 7), `initMobileSkillsPanel`, `initMobileMiniChat` (sans garde d'idempotence).
- `kraland-userscript-template.js`, MODAL PERSONNAGE MOBILE : `initCharacterModalMobile` (report du backlog 6), `initModalTabScroll` (garde `document.body` sans report).
- `kraland-userscript-template.js`, `init()` : `runDOMTransforms` et `runInitQueue` au `DOMContentLoaded`, autour de l'appel d'`initMobileFeatures`.
- `tests/e2e/demarrage-mobile.mjs` : `scenario` (moment `start` = bundle évalué avant `<html>`, largeur lue au début) ; reçoit le fragment `modules-mobiles`.
- `tests/e2e/modale-ordre.mjs` : contrôle « appel double », qui attendait deux indicateurs sur mobile.
- `tests/e2e/typographie-formes.mjs` : `nettoyage`, comparaison par chemin DOM à la base `6270c81`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/demarrage-plateau.html` -- plateau synthétique : panneau des compétences natif, `#flap` et son lien, modale à onglets dans un `<template>`, jQuery et Bootstrap -- fixture du fragment.
- [x] `tests/e2e/demarrage-mobile.mjs` -- options `modale` et `theme` de `scenario` (sondes `MutationObserver` et `scrollTo`, FAB relevé avant la modale par `visibility` et `elementFromPoint`, Bootbox insérée, onglet changé, toucher d'un onglet non actif, second changement) ; fragment `modules-mobiles` : moments start (émulé ou non), dcl, load, later, thème coupé, 1280 px ; `fenetre-etroite` ne compte plus la superposition -- AC 1 à 5.
- [x] `tests/e2e/lib/router.mjs` -- fragment `['modules-mobiles']` de `demarrage-mobile`.
- [x] `kraland-userscript-template.js` -- garde `isThemeEnabled()` et report d'`initMobileFeatures` au `DOMContentLoaded` ; appel de `initCharacterModalMobile` retiré ; `createMobileOverlay`, `initMobileSkillsPanel` et `initMobileMiniChat` supprimées ; `initModalTabScroll` filtré aux `li` de `.nav-tabs`, un seul timer, recentrage au seul changement d'onglet actif -- cause.
- [x] `tests/e2e/modale-ordre.mjs` -- un indicateur attendu au lieu de deux (contrôle renommé « écritures uniques ») -- AC 3.
- [x] `tests/e2e/typographie-formes.mjs` -- masque `MASQUE_MODULES_96` réduit à `.kr-mobile-overlay, .kr-tabs-indicator + .kr-tabs-indicator` (option `horsChemin` d'`EMPREINTES`) dans les comparaisons `nettoyage` et `bascule` à la base -- base d'avant le correctif.
- [x] `npm run build` -- bundle et `version.json`.

**Acceptance Criteria:**
- Given le bundle injecté avant `<body>` sur téléphone (largeur lue 980 puis 375), when le plateau se charge, then le défilement des onglets de modale est installé une fois, aucune superposition, croix ni bouton des compétences n'est ajouté, le FAB ouvre le mini-chat, et `html[data-kr-ready]` est posé.
- Given le même bundle à 375 px sans émulation, ou injecté au DOMContentLoaded, après load ou en différé, when le plateau se charge, then le résultat est le même.
- Given le bundle à 375 px, when une Bootbox à onglets est ajoutée au `<body>`, then elle porte une seule `.kr-tabs-indicator` ; l'en-tête des onglets défile vers l'onglet actif quand celui-ci change, et pas au toucher d'un onglet non actif.
- Given le thème coupé à 375 px, when le plateau se charge, then le lien natif `#flap` n'est pas détourné, aucune croix ni superposition n'est ajoutée et aucun défilement des onglets n'est installé.
- Given le bundle à 1280 px, when le plateau se charge, then aucun module mobile ne s'installe (inchangé).
- Given `demarrage-mobile` (`modules-mobiles`) et `modale-ordre` (`mobile`) lancées sur le bundle de la base, when elles tournent, then elles échouent ; sur le bundle corrigé, elles passent.

## Implementation Notes

- Reproduction (bundle de la base, `/tmp/wt96-base/bundle-base.user.js`, fragment `modules-mobiles`) : au document-start sur téléphone, superposition 0, panneau des compétences 0, croix du mini-chat 0, lien du mini-chat inactif, observateurs de défilement des onglets 0. À 375 px sans émulation : superposition 1, rien d'autre. Au DOMContentLoaded : 2 `.kr-tabs-indicator`. Le cas n'était pas couvert.
- Assumption: un seul report, celui d'`initMobileFeatures`, plutôt qu'un report par fonction. Le report est posé sur `readyState === 'loading'`, pas sur `!document.body` : à l'injection en fin de `<body>` (option `fin` de `typographie-formes`), `<body>` existe mais le DOM n'est pas mis en forme (`#skills-panel` absent).
- Assumption: `initModalTabScroll` perd sa garde `document.body` : son seul appelant attend le DOM. Une garde muette laissée là cacherait de nouveau le défaut.
- Assumption (revue, décision d'orchestration) : `MiniChat:FAB` fait foi pour le mini-chat ; `initMobileMiniChat` (croix et détournement du lien `#flap`) est supprimée. La superposition, le bouton et le panneau des compétences sont en `display: none !important` en `body.mobile-mode` (TASK-1.6) : `createMobileOverlay` et `initMobileSkillsPanel` sont supprimées. Leur CSS (`.kr-mobile-overlay`, `.kr-mobile-close`, `.kr-mobile-skills-toggle`, `.mobile-open`) reste : `palette-nation` mesure encore `.kr-mobile-close` sur sa fixture ; à retirer dans un ticket CSS.
- Assumption: le défilement des onglets mémorise le dernier onglet centré (`null` au départ) : une mutation d'un `li` ou l'ajout d'onglets (AJAX) ne recentre que si l'onglet actif a changé. Le retour tactile (`.active` sur les liens et les `.btn`, `addTouchFeedback`) est ignoré.
- Assumption: thème coupé, la chaîne mobile des modales (`initCharacterModalMobile`, posée par `init()`) tourne encore (un indicateur relevé) : hors du périmètre de ce ticket, non modifiée.
- Assumption: la chaîne mobile des modales passe une fois au lieu de deux. Le contrôle « appel double » de `modale-ordre` attend donc un indicateur ; les autres contrôles d'écriture unique du socle restent.
- Assumption: `nettoyage` compare au bundle `6270c81`, qui pose la superposition mobile et passe deux fois la chaîne des modales. Le masque `MASQUE_MODULES_96` sort ces deux éléments du chemin DOM et des mesures (même principe que `MASQUE_JAUGES_9`). Réduction mesurée : sans `.kr-mobile-overlay`, 50 FAIL ; sans le second indicateur, 4 FAIL ; sans les sélecteurs des compétences, 0 FAIL. Retrait : quand `COMMIT_NETTOYAGE` passe au-delà de 9.6.
- Fixture dans un fichier plutôt qu'en ligne : sinon `demarrage-mobile` aurait cité `panel-default`, `skills-panel`, `col-leftest` et `modal-content` en quatrième suite. Ces repères seraient devenus transverses et `router.test` rougissait (cas « carte du forum »).

## Plan Change Log

## Review Triage Log

1. Majeur, garde du thème absente d'`initMobileFeatures` (thème coupé : lien `#flap` détourné, croix ajoutée) -- patch : garde `isThemeEnabled()`, scénario « thème coupé » (contre-épreuve sans la garde : rouge).
2. Majeur, deux mini-chats mobiles concurrents -- patch : `MiniChat:FAB` fait foi, `initMobileMiniChat` supprimée ; contrôle « le FAB ouvre le mini-chat » (`visibility`, `elementFromPoint`) au lieu de la classe `mobile-open`.
3. Superposition, bouton et panneau des compétences masqués en `body.mobile-mode` -- patch : `createMobileOverlay` et `initMobileSkillsPanel` supprimées, masque réduit, énoncé du plan corrigé.
4. `initModalTabScroll` recentre sur toute mutation (retour tactile `.active`) -- patch : filtre sur `mutation.target` (`li` de `.nav-tabs`), un seul timer, recentrage au seul changement d'onglet actif ; contrôle à 375 px (contre-épreuve sans le filtre : rouge).
5. Moments `load` et `later` absents de `MODULES` -- patch.
6. OK, sans changement.
7. Sonde dépendante du texte `with-nav-tabs` -- patch : commentaire dans `demarrage-mobile.mjs`.
8. Énoncé du plan, modules restaurés -- patch : défilement des onglets et chaîne des modales.
9. OK, sans changement.
10. OK, sans changement.
11. OK, sans changement.

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/wt96-base/bundle-base.user.js KR_FRAG=modules-mobiles node tests/e2e/demarrage-mobile.mjs` -- expected: rouge
- `KR_SCRIPT=/tmp/wt96-base/bundle-base.user.js KR_FRAG=mobile node tests/e2e/modale-ordre.mjs` -- expected: rouge
- `npm run build` puis `npm run test:zone -- demarrage transitions modale-ordre parler typographie-formes plateau initialisation palette-nation` -- expected: VERT
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: exit 0

## Result

Provisoire (implémenteur, worktree `wt/9.6`, base `22b5582`, non commité), après les correctifs de la revue. Bundle de base : bundle versionné de la base, copié dans `/tmp/wt96-base/bundle-base.user.js`.

- Rouge avant : `modules-mobiles` 14 FAIL sur 27 sur le bundle de base. `modale-ordre` `mobile` 1 FAIL (chaîne mobile passée 2 fois).
- Contre-épreuves (template muté, rebâti, puis restauré) : sans la garde du thème, le scénario « thème coupé » rougit (observateur posé) ; sans le filtre des onglets, le contrôle du toucher rougit (2 défilements au toucher).
- Vert après : `modules-mobiles` 27 ok. `npm run build` VALIDATION PASSED.
- Zones, lancées une à une : `demarrage` 127 ok ; `modale-ordre` 371 ok ; `transitions` 112 ok ; `plateau` 1027 ok ; `initialisation` 205 ok ; `typographie-formes` 4432 ok. La zone `breakpoint` n'existe pas : `breakpoint-switch` passe par `transitions` et `plateau`.
- `npm run test:router` exit 0 (Routeur conforme) ; `npm run test:unit` 56/56 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement préexistant, `report-non-lu.mjs`).
- `test:all` non lancé (hors mandat).
