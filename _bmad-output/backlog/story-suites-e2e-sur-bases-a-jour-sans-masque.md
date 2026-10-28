---
id: 11
type: story
title: "Les suites e2e comparent à des bases à jour, sans masque de ticket ni course d'injection"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: medium
---

# Les suites e2e comparent à des bases à jour, sans masque de ticket ni course d'injection

## Description

Actions A2, A3 et A5 de la rétrospective de l'épopée 6 (F2, F3, F6). L'A4 de la rétrospective de l'épopée 5 n'avait pas été faite. Depuis, `tests/e2e/lib/variantes.mjs` est passé de 56 à 73 constantes `TICKET`/`AVANT` : les épopées 3 à 6 ont posé des masques sur des bases figées et partagées entre suites. Leurs conditions de retrait renvoient à « ticket A4 » : c'est ce ticket.

1. Bases partagées : `forum-index` `81512a3`, `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`, `62fd47d` et `00b0786`, `palette-nation` `6685df5`. Chaque base est réalignée sur un SHA récent, et les masques devenus inertes sont retirés, `FLECHES_TICKET67` compris.
2. `forum-activite` : ses cinq bases (`COMMIT_AVANT`, `_FIL`, `_ENTETE`, `_PLUS`, `_LIGNE`, à `810901f`) passent sur un SHA qui contient 6.7. La pose de `FLECHES_TICKET67` est retirée de `ouvrir`.
3. Course des infobulles en peau coupée mobile (section « Reports du ticket 6.6 » de `deferred-work.md`). Tout contrôle de peau coupée mobile qui compare du DOM injecte en début de document (option `debut` ou équivalent), comme `@run-at document-start`, au lieu de la correction locale du 6.6.

Un réalignement ne doit pas vider un contrôle. Toute décision d'un ticket encore prouvée seulement par une comparaison à une base d'avant ce ticket reçoit d'abord un contrôle absolu. C'est la leçon de la rétrospective de l'épopée 6, constat 6 du 6.7.

## Acceptance Criteria

1. **Aucun masque de ticket inerte**
   **Given** `tests/e2e/lib/variantes.mjs` et les suites qui le lisent
   **When** les bases sont réalignées
   **Then** chaque masque des épopées 3 à 6, plus `FLECHES_TICKET67`, est retiré, ou gardé avec une raison écrite et une condition de retrait qui nomme un événement à venir ; aucune condition ne renvoie plus à « ticket A4 »
2. **Couverture gardée**
   **Given** chaque base réalignée
   **When** `KR_SCRIPT` vaut le bundle de l'ancienne base
   **Then** la suite échoue avec au moins un FAIL nommé par décision de ticket concernée, ou le plan désigne le contrôle absolu qui couvre cette décision
3. **Injection en début de document pour la peau coupée mobile**
   **Given** les contrôles de peau coupée mobile qui comparent du DOM (relevé dans l'inventaire du plan)
   **When** ils tournent sous charge, avec la suite visée en parallèle d'autres zones
   **Then** ils injectent en début de document et restent verts sur deux tours ; une contre-épreuve (écart réel et retardé) les rend rouges
4. **Vert final**
   **Given** l'arbre fini
   **When** `npm run test:router`, `lint:css`, `lint:js` puis `npm run test:all` tournent
   **Then** tout est vert, et aucun jeton ne passe à 4 suites citantes (MAX_CITING)

## Boundaries

- Ne change rien au produit : `kraland-theme.css` et `kraland-userscript-template.js` restent intacts.
- Tolérances et seuils inchangés ; fixtures inchangées.
- Les bases auto-référentes de `kramail-redaction` et `cybermonde-carte` restent hors périmètre (question posée à Arnaud, action A9).

## References

- retro — _bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum-retrospective.md, A2, A3, A5 (F2, F3, F6)
- retro — _bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md, A4
- deferred — _bmad-output/initiative-harmonisation-ux/deferred-work.md, Reports du ticket 6.6
- backlog — story-mode-start-de-fin-initialisation-avant-body.md (id 8, même technique d'injection)
