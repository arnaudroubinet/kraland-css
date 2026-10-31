---
id: 33
type: bug
title: "`kramail-redaction#regression` échoue parfois sur du bruit d'anticrénelage à 375 px"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P2
---

# `kramail-redaction#regression` échoue parfois sur du bruit d'anticrénelage à 375 px

## Description

`test:all` sur la fusion du ticket 32 (b02a9ec, machine calme, 2026-10-31) : 19015 ok, 1 FAIL, « lecture 375 px : rendu identique avant / après ». Le fragment rejoué seul est vert 3 fois sur 3. Le ticket 22 l'avait vu vert 5 fois sur 5 sans correctif. Priorité de stabilisation des tests.

## Reproduction

1. `npm run test:all` (concurrence 16), ou le fragment `KR_FRAG=regression node tests/e2e/kramail-redaction.mjs` en boucle sous charge.
2. Constaté (journal copié dans `~/kraland-css-captures/flakes/kramail-redaction_regression.log`) : `{"pixels":32,"maxCanal":2,"first":[[26,291],[27,291],[28,291]]}`, captures de 52800 et 52787 octets.
3. Attendu : un bruit d'écart ≤ 2 sur un canal n'échoue pas ; une vraie différence (écart > 4, dimensions, voile sur la page) échoue toujours.

## Cause Hypothesis

Calibrage de `PIX_MAX_PIXELS = 20` (`tests/e2e/kramail-redaction.mjs` ~l.112) fait sur « lecture 1280 » et le coin arrondi de la carte. À 375 px, une ligne de bruit de 32 pixels (x 26 et plus, y 291 : probablement le bord d'un texte ou d'un coin arrondi fractionnaire) dépasse la borne en nombre, pas en écart.

## Acceptance Criteria

1. **Bruit toléré**
   **Given** deux captures A/A (même bundle) de « lecture 375 » sous charge
   **Then** le fragment est vert sur au moins 30 passes
2. **Régression encore détectée**
   **Given** un bundle muté qui change une couleur (écart > 4) ou une hauteur de 1 px sur la lecture à 375 px
   **Then** le fragment est rouge
3. **Calibrage consigné**
   **Given** la nouvelle borne
   **Then** le commentaire de calibrage cite la mesure A/A (nombre de passes, maximum de pixels et d'écart, zone)

## Notes

- Assumption : borne fondée sur l'écart (≤ 2) plutôt que sur le nombre de pixels, ou nombre relevé par zone bornée ; au choix de l'implémenteur après mesure A/A.
- Même mécanisme possible sur les autres fragments de comparaison pixel : à relever pendant la mesure, sans les traiter ici.
