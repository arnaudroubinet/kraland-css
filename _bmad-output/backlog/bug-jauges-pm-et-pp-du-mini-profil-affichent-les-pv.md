---
id: 9
type: bug
title: "Sur mobile, les jauges PM et PP du mini-profil affichent la valeur des PV"
parent: none
covers: []
after: []
assignee: ""
refined: false
hitl: false
risk: low
severity: P2
---

# Sur mobile, les jauges PM et PP du mini-profil affichent la valeur des PV

## Description

Le mini-profil mobile lit les jauges du panneau du plateau avec `findGaugeInSection` (template, L1339-1385). Pour chaque type, la fonction prend le premier élément de `#player-vitals-section` dont le texte commence par le type ou contient « ␣PM␣ » ou « ␣PP␣ », et qui a au plus 2 enfants. Dans la structure réelle du panneau, cet élément est la `.col-sm-8.nopadding-right` : son texte commence par « PV » et elle a 2 `.row`.

Pour les PV, c'est donc ce conteneur qui est retenu, et non le bouton « PV 18 ». Pour PM et PP, le même conteneur est retenu (`text.includes(' PM ')`, `text.includes(' PP ')`). La valeur lue est alors le premier nombre du texte, et la largeur celle de la première `.progress-bar`, c'est-à-dire celles des PV.

Défaut antérieur au ticket 3.6 (jauges : une couleur par jauge), qui ne le corrige pas.

## Reproduction

1. Fixture `tests/e2e/fixtures/palette-nation-jauges.html` (squelette du panneau relevé en lecture seule le 2026-10-23 ; PV 18 à 60 %, PM 25 à 100 %, PP 45 à 30 %), servie à `/jouer/plateau`, bundle courant, 375 × 667, mobile.
2. Constaté (sonde du 2026-10-23, Kraland clair) : PV « 18/30 » à 60 %, PM « 18/30 » à 60 %, PP « 18/30 » à 60 %, en compact comme en complet. **Confirmé sur la fixture.**
3. Attendu : PV 18 à 60 %, PM 25 à 100 %, PP 45 à 30 %.

Les espaces entre balises de la fixture sont inventés : sur le site réel, le texte du conteneur commence aussi par « PV », donc le PV au moins passe par le conteneur. Pour PM et PP, l'effet dépend des espaces autour de « PM » et « PP » dans le texte réel. À vérifier en lecture seule sur `/jouer/plateau` à 375 px.

## Cause Hypothesis

La recherche par texte (`startsWith` / `includes`, au plus 2 enfants) attrape un ancêtre commun aux trois jauges. Il faudrait partir du bouton de la jauge (`alert141` PV, `alert142` PM, `alert143` PP) et de la `.progress` de la `.col-sm-8` qui le suit, puis lire la valeur dans le texte du bouton et le maximum dans les segments (`.sr-only` de la valeur et du reste).

## Acceptance Criteria

1. **Chaque jauge mobile montre sa propre valeur**
   **Given** la fixture palette-nation-jauges.html à 375 × 667
   **When** le mini-profil est plié puis déplié
   **Then** PV, PM et PP affichent chacune leur valeur, leur maximum et leur pourcentage
2. **Tests couvrent le cas trouvé et corrigé**
   **Given** une vérification des valeurs du mini-profil sur cette fixture
   **When** elle tourne
   **Then** elle passe, et échoue sur le bundle d'avant la correction
3. **Ou : aucun changement nécessaire, preuve à l'appui**
   **Given** un relevé en lecture seule du mini-profil sur le site réel
   **When** PM et PP y montrent leur propre valeur
   **Then** le ticket se ferme avec cette preuve, et la fixture est corrigée pour suivre le texte réel

## Boundaries

- Must not change: couleurs, tailles et formes des jauges (ticket 3.6) ; barres de PV des cartes de personnages.

## References

- parent — none
- plan — _bmad-output/initiative-harmonisation-ux/epic-palette-nation/story-jauges-une-couleur-par-jauge-identique-sur-ordinateur-et-mob-plan.md
