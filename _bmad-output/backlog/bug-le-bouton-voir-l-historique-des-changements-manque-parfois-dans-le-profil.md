---
id: 31
type: bug
title: "Le bouton « Voir l'historique des changements » manque parfois dans le profil"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P2
---

# Le bouton « Voir l'historique des changements » manque parfois dans le profil

## Description

Sur `/profil/interface`, le bouton `#kr-changelog-btn` est absent dans environ 1 chargement sur 7 quand la page est lente. Trouvé par le ticket backlog 22 (2026-10-30) : c'est la cause des rouges instables de `palette-nation#etats-mobile` et `typographie-formes#boutons`. Priorité de stabilisation des tests.

## Reproduction

1. Fixture du profil, page bridée (×20, comme dans le plan du ticket 22).
2. Attendre 20 s.
3. Constaté : 6 tours sur 42 sans bouton ; dans tous ces tours, `#kr-changelog-section` n'existait pas encore au DOMContentLoaded.
4. Attendu : le bouton apparaît dès que la section existe, quel que soit le moment.

## Cause Hypothesis

`addChangelogButton` (`kraland-userscript-template.js` ~l.10882) appelle `insertChangelogButton` une seule fois, au DOMContentLoaded ou 500 ms plus tard. Or `insertTampermonkeyThemeUI` (~l.8806) crée `#kr-changelog-section` par un essai toutes les 200 ms, parfois après ce moment. La recherche unique échoue alors sans nouvel essai.

## Acceptance Criteria

1. **Section posée en retard**
   **Given** `#kr-changelog-section` créée après DOMContentLoaded (jusqu'à plusieurs secondes)
   **Then** `#kr-changelog-btn` est présent une fois, dans la section
2. **Pas de doublon**
   **Given** une section déjà présente au DOMContentLoaded
   **Then** un seul bouton existe
3. **Hors profil inchangé**
   **Given** une page autre que `/profil/interface`
   **Then** aucun bouton ni attente ajoutée

## Notes

- Assumption : insérer le bouton là où `insertTampermonkeyThemeUI` crée la section, ou réessayer tant que la section manque (borne de temps), au choix de l'implémenteur.
- Test : fixture avec création retardée de la section ; contre-épreuve sur le bundle actuel (rouge attendu).
