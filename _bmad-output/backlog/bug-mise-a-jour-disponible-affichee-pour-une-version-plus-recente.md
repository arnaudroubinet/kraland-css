---
id: 17
type: bug
title: "« Mise à jour disponible » s'affiche quand la version installée est plus récente"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: false
risk: low
severity: P3
---

# « Mise à jour disponible » s'affiche quand la version installée est plus récente

## Description

Le pied de page affiche la version courante du thème et la dernière version publiée (`version.json`). Le module `displayVersionInfo` ajoute « ⚠️ (mise à jour disponible) » dès que les deux diffèrent. Une version installée plus récente que la version publiée (bundle de `feature/next`, servi en local) est donc signalée comme périmée. Relevé par l'orchestrateur pendant l'épopée 10 (2026-10-30).

## Reproduction

1. Installer un bundle construit après la dernière publication (`1.0.<timestamp>` plus grand que celui de `version.json` publié).
2. Ouvrir une page du site, regarder le pied de page.
3. Constaté : « dernière version 1.0.<plus petit> ⚠️ (mise à jour disponible) ».
4. Attendu : aucun avertissement quand la version installée est égale ou plus récente.

## Cause Hypothesis

`kraland-userscript-template.js:7874` compare les chaînes avec `data.version !== currentVersion` au lieu de comparer les numéros de version.

## Acceptance Criteria

1. **Version publiée plus récente**
   **Given** une version installée `1.0.100` et une version publiée `1.0.200`
   **Then** l'avertissement « mise à jour disponible » s'affiche
2. **Version installée égale ou plus récente**
   **Given** une version installée `1.0.200` et une version publiée `1.0.200` ou `1.0.100`
   **Then** aucun avertissement ne s'affiche
3. **Mode développement inchangé**
   **Given** `CURRENT_VERSION` resté à `__USERSCRIPT_VERSION__`
   **Then** l'affichage « mode développement » est identique à la base

## Notes

- Assumption : comparaison numérique segment par segment (`1.0.<timestamp>`) ; une version publiée illisible ne produit pas d'avertissement.
- Test : unitaire si la comparaison est extraite en fonction pure, sinon fixture avec `fetch` de `version.json` intercepté.
