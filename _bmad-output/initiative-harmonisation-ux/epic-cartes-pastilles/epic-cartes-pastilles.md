---
type: epic
title: "Cartes de section et familles de pastilles"
parent: initiative-harmonisation-ux
covers: [CAP-6]
after: []
assignee: ""
risk: medium
---

# Cartes de section et familles de pastilles

## Description

Chaque section mobile se présente dans la même carte, et chaque pastille dit par sa famille si elle signale un état ou une catégorie.

## Outcome

Le joueur reconnaît une section et le sens d'une pastille d'un coup d'œil ; intent de CAP-6.

## Done when

1. Les critères success de CAP-6 tiennent sur le jeu, le forum, le sous-forum et le kramail.
2. La suite `sous-forum` est mise à jour pour R6 (fin de la pleine largeur).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 5. Applique la couleur « non lu » de l'épopée 3 à la cloche et à l'enveloppe. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-6
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 5
- ux — DESIGN.md, Components (Carte de section, Étiquette de catégorie, Pastille d'état) ; mockups/h04-entetes-section-mobile.html

## Notes

- Waits on epic-palette-nation because: couleurs d'état et « non lu ».
- Waits on epic-typographie-formes because: titres 17 px et rayons.
- Open question: Q10, Q30 (EXPERIENCE.md) à trancher au plan.
- Decision (2026-10-24, autonomie) : breakdown en 6 entrées (`tickets.toml`). Balle traçante = entrée 1 (carte de section mobile des pages de jeu, kramail par les règles communes, suite `cartes-pastilles.mjs` et sa zone dans le routeur) ; entrée la moins sûre ensuite = entrée 2 (R6, risque élevé) ; Refactor sweep en dernier.
- Decision (2026-10-24, autonomie) : entrées 1 à 5 chaînées par collision (suite `cartes-pastilles.mjs`, sections mobiles des panneaux et des pastilles de `kraland-theme.css`), pas par dépendance fonctionnelle ; rien ne se construit en parallèle.
- Decision (2026-10-24, autonomie) : épingles 4.10 et 3.8 sur l'entrée 1 (titres 17 px, rayons, jetons de couleur) ; 3.5 sur les entrées 4 et 5 (couleur « non lu » unique, marque PNJ native exclue des boutons d'état).
- Decision (2026-10-24, autonomie) : l'entrée 2 prend le code du ticket 6.1 (déjà bâti sur `feature/next`) comme base, hors `after` : épingler 6.1 créerait un `order_conflict` (l'épopée 6 vient après la 5) et un cycle 5 ↔ 6.
- Decision (2026-10-24, Arnaud) : aucune règle `:focus`, aucun focus clavier.
- Decision (2026-10-24, Arnaud) : le kramail prend le thème du forum à l'épopée 7 ; l'épopée 5 ne lui donne que les règles communes et ne retire que ses déclarations contraires à la carte, sans règle propre.
- Assumption: Q10 — carte en retrait de 8 px des bords, contenu à 16 px de marge intérieure (texte à 24 px du bord ; forum et sous-forum perdent 16 px de largeur).
- Assumption: Q30.7 — aucune icône ajoutée aux en-têtes de carte qui n'en ont pas nativement (Citoyenneté, Maladies, Commerce et Matériel du plateau).
- Assumption: Q30.1 — pastille de niveau (`.kr-stat-badge`, `.kr-skill-badge`) et « ici » de la croix gardent `--kr-level-*`, hors familles état et catégorie.
- Assumption: Q30.4 — caractéristiques `btn-success` et malus « -0 » hors CAP-6, rendu inchangé.
- Assumption: Q30.2, Q30.3, Q30.5, Q30.6 — hors CAP-6 (épopées 7 et 9, ou plus tard).
- Assumption: les tags du sujet (`.forum-tags`) sont des étiquettes de catégorie.
- Assumption: index et racine du forum suivent le sous-forum dans la carte (parité du ticket 6.1).
- Assumption: repli des panneaux de jeu gardé tel quel : chevron du module « Panel Sections Collapse » sur Bâtiment, Commerce, Matériel, chevron natif ailleurs, aucun repli ajouté.
- Assumption: cloche et enveloppe passent en couleur « non lu » sur les deux supports, pas seulement sur mobile.
- Assumption: le bug 10 du backlog (nom de forum mobile à 17 px) reste indépendant de l'épopée.
- Source conflict: DESIGN.md › Components, Carte de section — dit le titre du kramail en primary à 2,56:1 et le titre du jeu à 20 px dans une carte de 54 px ; trouvé : titre du kramail en text-accent (~l.8958), titre du jeu déjà à 17 px 700 text-primary (~l.7845), en-tête détaché.
- Source conflict: DESIGN.md › Components, Pastille d'état — dit l'enveloppe du kramail grise ; trouvé : même règle rouge que la cloche (`--kr-badge-danger` #dc3545, ~l.797-803).
- Source conflict: Done when 2 — cite la suite `sous-forum` pour R6 ; l'assertion de pleine largeur est dans `forum-index.mjs` (~l.355-357), `sous-forum.mjs` n'en a pas.
- Source conflict: CAP-6 success — cite les étiquettes « article » et « Dernier sujet » ; absentes du CSS, du JS et des fixtures.
- Open question: où apparaissent « article » et « Dernier sujet » sur le site ? L'entrée 5 les relève en lecture seule (mandat du 2026-10-24) ou les consigne absentes.
- Open question: lignes de sujet du forum mobile, aujourd'hui cartes détachées avec un écart de 8 px : les garder dans la carte (option retenue, « rendu actuel », R6) ou en faire des lignes à filet, comme la maquette h04 ?
- Open question: confirmer Q10 (retrait de 8 px) et Q30.1, Q30.4 (niveau, « ici », caractéristiques hors familles).
- Open question: rétro de l'épopée 4, A1 — livrer les épopées 3 et 4 (push, PR) avant de démarrer l'épopée 5 ?
- Open question: le `tickets.toml` de l'initiative reste à mettre à jour (hors écritures permises) : l'`after` de l'épopée 6 sur l'épopée entière (« carte de section mobile », `unpinned_after`) devient l'entrée 5.2 ; celui de l'épopée 7 (« carte de section et onglets ») devient 5.1 pour la carte, les onglets relevant de CAP-8 et d'aucune entrée de l'épopée 5.
