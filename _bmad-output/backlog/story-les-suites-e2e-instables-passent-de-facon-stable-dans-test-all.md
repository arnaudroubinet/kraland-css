---
id: 22
type: story
title: "Les suites e2e instables passent de façon stable dans `test:all`"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: medium
---

# Les suites e2e instables passent de façon stable dans `test:all`

## Description

Le contrôle `demarrage-mobile#desktop+pire-cas+m1+m-1+s1`, « au plus 4 documents en 6 s », échoue par intermittence : cinq `test:all` de l'épopée 9 et déjà la rétro 7. Rejoué seul, il passe. Ces faux FAIL brouillent la preuve de livraison et poussent à fusionner sur un `test:all` rouge.

Source : `revue-manuelle.md`, rétro 9 (point A5 « Le stabiliser ou le lancer à part ») ; tri du 2026-10-30 (« stabilité de `demarrage-mobile` »). En attendant ce ticket, la suite se lance à part (`npm run test:demarrage`), machine calme, et son résultat seul fait foi.

Le contrôle concerné (`tests/e2e/demarrage-mobile.mjs:248-252`) joue `/forum` et `/kramail` à 375 px avec une largeur fausse (980) jusqu'après le chargement (`lateViewport`), et compte les documents chargés pendant la fenêtre d'absence sous horloge simulée (`settle`, `QUIET_MS` 2500, `MAX_ROUNDS` 10, `MAX_SETTLE_MS` 25000, l.56-58).

## Périmètre élargi (2026-10-30)

Arnaud, 2026-10-30 : « La stabilisation des tests est toujours prioritaire. » Le ticket couvre tous les faux FAIL connus, verts rejoués seuls :
- `demarrage-mobile#…pire-cas…` (ci-dessus) ;
- `breakpoint-switch#nav-large` et `#nav-origine` : à 1100 px après bascule, barre de 60 px mesurée au lieu de 120, y compris dans un `test:all` sans autre charge (HEAD 2a41b35) ;
- `kramail-theme#confort` (bascule 767 > 768 > 767 ; fusions 9.12, 10.2, 10.3) ;
- `kramail-redaction#regression` et `#clavier+reseau` ;
- `palette-nation#etats-largeurs` et `#etats-mobile` ;
- `modale-ordre#largeurs` ; `croix-directionnelle#transitions` ; `cartes-pastilles#etiquettes` (décalage vertical de 10 px) ; `plateau-qualite-usage` (légendes, cibles tactiles) ;
- `test:all` qui rapporte un FAIL avec 0 contrôle en échec (2026-10-29).

Hypothèse commune : mesure prise avant que la mise en page soit stable (bascule de largeur, police, animation), sensible au temps réel sous concurrence 16. Les critères ci-dessous valent pour chaque suite de la liste ; une suite dont la cause est un vrai défaut du produit sort en ticket séparé.

## Acceptance Criteria

1. **Cause établie**
   **Given** les journaux des `test:all` rouges de l'épopée 9 et de la rétro 7
   **When** le contrôle est rejoué sous charge (suite en parallèle d'autres zones) et seul
   **Then** le plan consigne le nombre de documents observé à chaque échec et la cause (temps réel contre horloge simulée, charge, ou vrai défaut du garde-fou), avec une preuve
2. **Stable sous charge**
   **Given** l'arbre corrigé
   **When** `npm run test:all` tourne trois fois de suite, puis chaque suite de la liste cinq fois en parallèle d'autres zones
   **Then** chaque contrôle de la liste est vert à chaque tour
3. **Pas de faux vert**
   **Given** pour chaque contrôle stabilisé, une mutation du produit qu'il doit attraper (pour `pire-cas` : le témoin « boucle » et une mutation du garde-fou)
   **When** la suite tourne
   **Then** chacun la rend rouge
4. **Seuil intact**
   **Then** aucune borne ni tolérance n'est élargie (dont « au plus 4 documents » et la largeur de 375 px), aucun contrôle n'est retiré ni sauté, sauf décision écrite d'Arnaud ; `npm run test:router` est vert

## Boundaries

- Ne change rien au produit : `kraland-theme.css` et `kraland-userscript-template.js` restent intacts, sauf si le critère 1 prouve un vrai défaut du garde-fou ; dans ce cas, ticket séparé.
- Fixtures inchangées.

## References

- revue — _bmad-output/initiative-harmonisation-ux/revue-manuelle.md, rétro 9, A5
- retro — _bmad-output/initiative-harmonisation-ux/epic-plateau-confort-mobile/epic-plateau-confort-mobile-retrospective.md
- suite — tests/e2e/demarrage-mobile.mjs, fragment `pire-cas`
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : stabiliser ; en attendant, lancer à part.

- Constat du 2026-10-30 : `breakpoint-switch#nav-large` et `#nav-origine` échouent aussi dans un `test:all` sans autre charge (barre mesurée à 60 px au lieu de 120 à 1100 px après bascule), verts rejoués seuls. Même famille : mesure prise avant stabilisation de la mise en page.
