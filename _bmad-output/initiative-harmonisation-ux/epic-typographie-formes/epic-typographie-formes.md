---
type: epic
title: "Même rôle, même taille, même forme"
parent: initiative-harmonisation-ux
covers: [CAP-5]
after: []
assignee: ""
risk: high
---

# Même rôle, même taille, même forme

## Description

Un même rôle a même texte, même bouton, même rayon et même espacement sur toutes les pages, ordinateur et mobile.

## Outcome

Les pages se lisent et se touchent de la même façon ; intent de CAP-5.

## Done when

1. Les critères success de CAP-5 tiennent sur les pages de jeu, du forum et du kramail.
2. « Valider » de la modale (18 px, 52 px de haut sur mobile) suit la taille normale.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 4. Traite les boutons (≥ 44 px sur mobile) ; les autres cibles tactiles restent à l'épopée 9. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-5
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 4
- ux — DESIGN.md, Typography, Layout & Spacing, Shapes
- faits — notes-implementation.md, Listes à établir avant le CSS

## Notes

- Waits on epic-identite-et-defauts because: P1.
- Waits on epic-palette-nation because: jetons de couleur.
- Waits on epic-modale-ordre because: section 9h de la modale d'ordre (tickets 2.6 et 2.7), reprise par l'entrée 3.
- Open question: Q8, Q9, Q11, Q12, Q14 (EXPERIENCE.md) : options retenues en Assumption ci-dessous (2026-10-24), à confirmer par Arnaud.
- Decision: inception faite en autonomie (bmad-ticket, 2026-10-24) : 10 entrées dans `tickets.toml` ; balle traçante = entrée 1 (jetons d'échelle, étiquettes et pastilles en 12 px gras, suite `typographie-formes.mjs` et sa zone dans le routeur) ; puis l'entrée la moins sûre, le bouton de taille normale (entrée 2) ; « Refactor sweep » en entrée 10. À confirmer : revue-manuelle.md.
- Decision: entrées 1 à 9 chaînées par collision, non par dépendance fonctionnelle : suite `typographie-formes.mjs` partagée (une suite propre à l'épopée, `palette-nation.mjs` n'est pas allongée, rétro de l'épopée 3, F1) et mêmes sections de `kraland-theme.css` réécrites (2026-10-24).
- Decision: les règles mobiles contradictoires des modales Bootbox reportées par `deferred-work.md` et « Valider » de taille normale (Done when 2) forment l'entrée 3 ; l'épopée 4 attend donc aussi l'épopée 2 (section 9h, tickets 2.6 et 2.7), ajoutée à son `after` dans le `tickets.toml` de l'initiative (2026-10-24).
- Decision: prérequis d'épopée épinglés sur l'entrée 1 : `1.7` (note P1) et `3.8` (nettoyage de l'épopée 3, dernier ticket à réécrire les boutons) plutôt que `3.1` (2026-10-24).
- Decision: aucune règle `:focus` (ticket 3.7 abandonné, décision d'Arnaud) ; boutons d'au moins 44 px sur mobile gardés ; kramail sans entrée propre : il reçoit les règles communes (entrées 1, 2, 7, 8, 9), sa reprise au thème du forum revient à l'épopée 7, qui pourra remplacer ces règles sans réintroduire d'autres tailles ou rayons (2026-10-24).
- Decision: chaque plan consigne son rouge avant sur le bundle de sa base, puis une contre-épreuve ; P1 option 4 : retirer ou réécrire, ne pas battre (rétros des épopées 2, A2, et 3, F4) (2026-10-24).
- Assumption: Q8 : texte courant mobile 15 px ; messages du forum gardés à 16 px ; champs gardés à 16 px (anti-zoom Safari iOS), pas de rôle « champ ».
- Assumption: Q9 : bouton compact en 12 px et rayon 4 px, hauteur (22 px, `.btn-xs` natif) et couleur (ticket 3.5 : votes en succès plein sur ordinateur) de la base conservées ; sur mobile, votes et pagination gardent leurs valeurs de la base, leurs cibles relevant de l'épopée 9 (H9.1).
- Assumption: Q11 : périmètre de la grille de 4 px = `.panel-body`, `.panel-heading`, `.btn`, `.form-control`, cellules de tableau ; gouttière de la grille Bootstrap exclue ; 15 → 16, 10 → 8 ou 12 selon les voisins.
- Assumption: Q12 : rayons asymétriques de la croix, avatars et images conservés.
- Assumption: Q14 : libellés des onglets de section et texte des jauges du mini-profil à 12 px, mesurés à 360 et 375 px.
- Assumption: les règles communes (étiquettes, boutons, en-têtes de 17 px, rayons, grille) valent sur toutes les pages ; le plancher de 12 px et l'échelle sont vérifiés sur les pages de jeu, le forum et le kramail (Done when 1) ; pages secondaires vérifiées seulement là où une fixture existe (Interface : `palette-nation-profil`).
- Constat (inventaire du 2026-10-24, lecture seule) : Bootstrap 3 fixe `html` à 10 px, donc 1 rem = 10 px (h4 mobile à 1.1rem = 11 px) ; aucune règle explicite ne pose « Valider » à 18 px, le 52 px vient de ~l.7693 : à mesurer au rouge avant de l'entrée 3 ; aucune fixture Matériel, Bâtiments, Employés ; aucun bouton de vote dans les fixtures du sujet.
- Open question: entrée 6 (hitl) : les fixtures de Matériel, Bâtiments et Employés demandent un squelette DOM relevé sur le site réel en lecture seule ; mandat d'Arnaud à donner avant l'entrée 6.
- Open question: tailles sous 12 px des pages secondaires (accueil 8 et 9 px, Événements, etc.) : dans le périmètre de l'épopée 4 (CAP-5 dit « rien sous 12 px sur mobile ») ou laissées en l'état faute de fixture ?
- Open question: votes et pagination sur mobile : leur cible de 44 px reste-t-elle à l'épopée 9 (hypothèse retenue) ou entre-t-elle dans l'entrée 4 ?
