---
title: "Nom du personnage dans le mini-profil et le panneau latéral (H1.3, H1.4, R1)"
ticket: 4
status: done
---

## Code Review

### 2026-10-20

Revue des commits a6ccd2e..5bf2984 (tickets 1.1 à 1.5) ; ce ticket : 2 patch, 2 defer.

- [x] [Review][Patch] Mini-profil sans nom quand aucun nom n'est connu et que le titre actif n'a pas de nœud texte direct (avant : « Personnage ») ; repli `|| 'Personnage'` [kraland-userscript-template.js:1243]
- [x] [Review][Patch] Remplacement du titre : `textNode.data = name` perd l'espace qui sépare le texte d'un élément enfant ; remplacer seulement le texte rogné [kraland-userscript-template.js:8246]
- [x] [Review][Defer] Sous-chemins /jouer/bat/<id> et /jouer/materiel/<x> acceptés comme source du nom : un libellé actif qui n'est pas le nom serait mémorisé [kraland-userscript-template.js:296-305] — deferred: non vérifié ; à trancher en relevant le titre actif de ces sous-pages réelles (si vrai : medium)
- [x] [Review][Defer] Une seule clé kr-character-name pour tous les personnages et comptes : nom périmé jusqu'à la prochaine page plateau, matériel ou bâtiments [kraland-userscript-template.js:8220] — deferred: limite acceptée par R1, question ouverte Q23 (EXPERIENCE.md)
