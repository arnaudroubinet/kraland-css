---
title: "Sur mobile, la croix des destinataires et le bouton Contacts du kramail sont sous 44 px"
type: 'bugfix'
ticket: '21'
created: '2026-10-31'
status: 'built'
baseline_revision: '5195461493e80c2133da8ab44fa71cfc449016f8'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/.claude/skills/tester-kraland-css/SKILL.md'
  - '{project-root}/_bmad-output/backlog/bug-sur-mobile-la-croix-des-destinataires-et-le-bouton-contacts-du-kramail-sont-sous-44-px.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Dans la rédaction du kramail sur mobile (≤ 767 px), la croix qui retire un destinataire (`.kd-chip-x`, 34 × 32) et le bouton « Contacts » (`.kd-contacts`, 40 px de haut) sont sous la cible tactile de 44 px : tailles posées en dur dans le bloc mobile de `kraland-theme.css` (l.10624-10652 à la base).

**Approach:** CSS seul, bloc mobile. Croix : boîte de 44 × 44 autour du même dessin (padding 6 px / 5 px, marges négatives qui gardent la pastille à 34 px et le glyphe en place, fond de survol limité à la zone de contenu). Rangées des pastilles espacées de 10 px pour que les cibles de deux rangées ne se chevauchent pas. « Contacts » : 44 px de haut, posé à `top: -44px`, dans la ligne du libellé (44 px). Bureau inchangé. Test nouveau dans `kramail-theme#confort` (5 points de 44 × 44 et absence de recouvrement, Nouveau, Répondre, Répondre à tous, Transférer, 320 / 375 / 767, clair et Empire Brun sombre, bascule) ; les mesures figées à 40 px et 34 × 32 de `kramail-redaction` passent à 44.

</frozen-after-approval>

## Implementation Notes

Route oneshot : moins de 100 lignes, CSS d'un seul bloc et trois suites de tests.

- `kraland-theme.css` (bloc « Mobile : Contacts au bout du libellé ») : `.kd-flow` `gap: 10px 6px` ; `.kd-chip-x` `width/height: var(--kr-touch-target)`, `margin: -6px -5px`, `padding: 6px 5px`, `background-clip: content-box`, focus `outline-offset: -7px` ; `.kd-contacts` `top: calc(-1 * var(--kr-touch-target))`, `height: var(--kr-touch-target)`. Aucun changement JS.
- Croix : la boîte déborde de 5 px la pastille en haut et en bas, de 4 px à droite (bordure de 1 px), et couvre les 5 derniers pixels du nom de sa propre pastille (fond transparent au repos, texte visible). Gap horizontal de 6 px : pas de recouvrement de la pastille voisine.
- Premier essai sans changer le gap : `repondre-tous` à 320 / 375 rouge (cibles de deux croix de rangées voisines superposées sur 4 px). D'où le `row-gap` de 10 px ; le champ grandit de 4 px par rangée supplémentaire (y compris quand la saisie passe seule à la ligne).
- « Contacts » touche désormais le haut du champ (écart de 2 px à la base).
- `tests/e2e/kramail-theme.mjs` (confort) : `mesurerBoutonsDest` pose une pastille au clavier sur Nouveau et Transférer (annuaire vide routé), sauf en bascule (un champ rempli retient le rechargement 767 → 768 : constaté, `body.mobile-mode` resté à 768) ; `RECOUVREMENTS_DEST` liste tout élément coupé hors ancêtres, hors la pastille du bouton et hors le libellé (texte du libellé compris dans la vérification).
- `tests/e2e/kramail-redaction.mjs` : Contacts 44 px, croix 44 × 44 sur mobile.
- `tests/e2e/typographie-formes.mjs` (nettoyage) : `IGNORER_ONGLETS` renommé `IGNORER_NETTOYAGE`, entrées géométriques des trois éléments sous `body.mobile-mode` seulement ; appliqué aussi aux comparaisons de la bascule Nouveau.

## Verification

- `KR_FRAG=confort node tests/e2e/kramail-theme.mjs` -- base 5195461 (premier état du test) : 391 ok, 29 FAIL ; après revue : 438 ok, 0 FAIL ; `KR_SCRIPT=<bundle 5195461>` : 408 ok, 30 FAIL.
- `KR_FRAG=dest-1280,dest-375,dest-320 node tests/e2e/kramail-redaction.mjs` -- 75 ok ; `KR_SCRIPT=<bundle 5195461>` sur dest-375,dest-320 : 4 FAIL.
- `KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs` -- vert.
- `npm run test:zone -- kramail typographie-formes cartes-pastilles confort-mobile`, `npm run test:router`, `lint:css`, `lint:js`, `test:unit`, puis `caffeinate -ims npm run test:all` : 19310 ok, 0 FAIL, RÉSULTAT : VERT.

## Review Triage Log

Revue quick (1 sous-agent, inspection), 7 constats : 3 patch, 4 low consignés dans revue-manuelle.md.

- low, consigné : anneau de focus de la croix plus haut de 1 px en haut et en bas (offset unique pour des paddings 6/5). Visible au clavier seulement ; le corriger demanderait un autre mécanisme (box-shadow ou paddings égaux, qui changeraient le survol).
- low, consigné : anneau de focus de « Contacts » qui mord sur 3 px de la bordure du champ au lieu de 1 px (le bouton touche le champ). Choix de mise en page à trancher par Arnaud.
- medium, patch : `RECOUVREMENTS_DEST` ne pouvait pas voir un recouvrement entre « Contacts » et le champ (ancêtre écarté). La boîte du champ est maintenant comparée à part. Mutant `top: -40px` : rouge (« .kd-contacts [0] sur champ .kd-field »).
- medium, patch : aucune croix n'était mesurée en bascule. Répondre (prérempli) est ajouté à la bascule de confort : 438 ok.
- low, patch : la bascule de `typographie-formes#nettoyage` recevait aussi les exclusions de la barre d'onglets (ticket 19). Elle ne reçoit plus que `IGNORER_KD`.
- low, patch : commentaire de l.1972 complété (IGNORER_KD).
- low, consigné : toucher la fin du nom (5 px) retire le destinataire. C'est un arbitrage produit, pas un défaut.

- Decision (orchestrateur, 2026-10-31) : cible de 44 px de la croix retenue même si elle prend les 5 derniers pixels du nom (retrait rattrapable en ressaisissant le destinataire) ; Contacts collé au champ et anneau de focus de 3 px sur sa bordure acceptés ; pas de ligne de libellé à 46 px.
