---
id: 23
type: bug
title: "Sur mobile, la partie vide des jauges se distingue à peine du fond"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# Sur mobile, la partie vide des jauges se distingue à peine du fond

## Description

Sur mobile, la piste des jauges du mini-profil (`#f5f5f5` en clair, bg-elevated en sombre) est posée sur bg-surface et s'en distingue à peine (contraste ≈ 1,09:1). La partie vide d'une jauge se voit mal : une jauge basse paraît presque absente.

Source : `revue-manuelle.md`, point « Ticket 3.6, piste des jauges sur mobile », option « un filet de 1 px en border-tint autour de la piste » ; tri du 2026-10-30 (« piste des jauges mobiles : filet de 1 px en border-tint »).

## Reproduction

1. Fixture `tests/e2e/fixtures/plateau-qualite-usage.html` (ou `plateau-minimal.html`), viewport 375×667, mode mobile ; mini-profil plié puis déplié.
2. Mesurer `background-color` de `.mobile-gauge-compact-bar` et `.mobile-gauge-full-bar` et celui du fond bg-surface sous elles, en Kraland clair et en Empire Brun sombre.
3. Relevé du 3.6 : ≈ 1,09:1. La valeur exacte par variante n'est pas consignée.
4. Attendu : un filet de 1 px en `--kr-border-tint` borde chaque piste.

## Cause Hypothesis

Pas de défaut de cascade : la piste n'a ni bordure ni ombre. `kraland-theme.css:5236-5242` (`.mobile-gauge-compact-bar`, 6 px de haut) et `kraland-theme.css:5309-5315` (`.mobile-gauge-full-bar`, 12 px) ne posent que `background: var(--kr-gauge-track) !important`. Le jeton vaut `#f5f5f5` en clair (`kraland-theme.css:150`) et `var(--kr-bg-elevated)` en sombre (`kraland-theme.css:267`). `--kr-border-tint` vaut `color-mix(in srgb, var(--kr-primary) 18%, #fff)` en clair (`kraland-theme.css:49`) et `var(--kr-border-default)` en sombre (`kraland-theme.css:249`).

## Acceptance Criteria

1. **Filet de 1 px**
   **Given** le mini-profil plié et déplié à 375×667 et à 700 px de large, en Kraland clair et en Empire Brun sombre
   **When** on lit le style calculé de `.mobile-gauge-compact-bar` et `.mobile-gauge-full-bar`
   **Then** chaque piste porte un filet de 1 px de la couleur calculée de `--kr-border-tint`, sur tout son tour
2. **Remplissage inchangé**
   **Given** les jauges PV, PM et PP
   **Then** la largeur relative et la couleur du remplissage sont celles de la base ; la hauteur extérieure de la piste ne change pas de plus de 2 px (filet compris), et le remplissage reste dans la piste
3. **Contraste du filet mesuré**
   **Given** les deux variantes
   **Then** le contraste du filet avec bg-surface est consigné dans le plan (aucun seuil imposé, la décision porte sur la présence du filet)
4. **Seuils et bureau**
   **Given** les largeurs 767 et 768 px, et 1280×720
   **Then** à 767 px le critère 1 tient ; à 768 et 1280 px les jauges du panneau sont celles de la base

## Notes

- Assumption : type bug (lisibilité) plutôt que story ; le correctif reste une règle CSS dans le bloc mobile.
- Assumption : le filet peut être une bordure ou une ombre interne ; la piste garde son `overflow: hidden` et son rayon.
- Decision: 2026-10-30 — orchestrateur, sur mandat d'Arnaud (« je vais suivre ta recommandation ») : filet de 1 px en border-tint autour de la piste.
