---
type: epic
title: "Kramail mobile"
parent: initiative-harmonisation-ux
covers: [CAP-8]
after: []
assignee: ""
risk: medium
---

# Kramail mobile

## Description

Sur mobile, le joueur sait dans quel dossier du kramail il est et le bouton d'envoi ne couvre jamais sa saisie, au forum comme au kramail.

## Outcome

Écrire un kramail ou une réponse sur téléphone sans gêne ; intent de CAP-8.

## Done when

1. Les critères success de CAP-8 tiennent ; plus aucune barre d'envoi fixe nulle part.
2. « Envoyer » vérifié clavier ouvert selon le résultat P2.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 7. Reprend le « ••• » posé par l'épopée 6. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-8
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 7
- ux — EXPERIENCE.md, kramail ; mockups/key-kramail-mobile.html

## Notes

- Waits on epic-modale-ordre because: résultat P2.
- Waits on epic-cartes-pastilles because: carte de section et onglets.
- Waits on epic-forum because: « ••• » commun.
- Open question: Q22, Q31 (EXPERIENCE.md) à trancher au plan.
- Decision: périmètre élargi par Arnaud (2026-10-23) : « Toute la partie kramail doit être revue pour utiliser le même thème que le forum. » Ordinateur et mobile, toutes les pages du kramail (liste des dossiers, lecture, rédaction, contacts) reprennent les composants du forum (liste des sujets, message de sujet, formulaire de réponse, carte de section, onglets, « ••• ») ; la palette privée `--kd-*` est remplacée par les jetons de l'épopée 3. À découper à l'inception de l'épopée.
