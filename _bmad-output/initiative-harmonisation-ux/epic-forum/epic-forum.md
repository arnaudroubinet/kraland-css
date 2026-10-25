---
type: epic
title: "Forum : activité et repères"
parent: initiative-harmonisation-ux
covers: [CAP-7]
after: []
assignee: ""
risk: high
---

# Forum : activité et repères

## Description

Le joueur voit où les forums bougent, ouvre le dernier message en un geste, et chaque niveau du forum se présente pareil. Pose le bouton « ••• » commun, kramail compris.

## Outcome

Le tour des forums se fait depuis l'index ; intent de CAP-7.

## Done when

1. Les critères success de CAP-7 tiennent pour RP, HRP, Communauté et Débats, sur les deux supports.
2. Sur mobile, la flèche « dernier message » et « premier non lu » mènent au message (ancre `#msg…` conservée).
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 6. La barre d'envoi du forum reste à l'épopée 7. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-7
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 6
- ux — EXPERIENCE.md, Ligne de forum, Fil d'Ariane, En-tête de sujet ; mockups/h12-index-forum.html
- faits — notes-implementation.md, Ancres sur mobile

## Notes

- Waits on epic-cartes-pastilles because: carte de section du forum mobile (5.2).
- Open question: Q27, Q28 (EXPERIENCE.md) à trancher au plan.
- Decision: inception complète en autonomie (2026-10-25). Découpe en 7 entrées dans l'ordre de construction : 1 index aligné sur le sous-forum (construite) ; 2 balle traçante, index mobile dans la carte de section de 5.2 et ancres #msg… conservées ; 3 fil d'Ariane unique (H12.3), entrée la moins sûre ; 4 en-tête de sujet mobile dans Communauté, Débats et Staff (H12.4) ; 5 bouton « ••• » commun (H12.2) ; 6 ligne de forum et repères de Q27 ; 7 refactor sweep. Publication dans `tickets.toml`.
- Decision: prérequis d'épopée épinglé sur l'entrée 2 : `5.2` (carte de section du forum mobile). L'entrée 1, construite avant 5.2, ne peut pas le porter sans créer un order_conflict (rétro de l'épopée 5, A8) (2026-10-25).
- Decision: entrées 2 à 7 chaînées par collision (suite `forum-activite.mjs` créée par l'entrée 2, section « INDEX DU FORUM » de la feuille, modules ForumHeader/ForumIndex/ForumThread), pas par dépendance fonctionnelle ; la suite propre à l'épopée a sa zone dans le routeur, `cartes-pastilles.mjs` n'est pas allongée (2026-10-25).
- Decision: P1 option 4 pour toutes les entrées : réécrire l'origine, ne pas battre ; aucun nouvel `!important` ; aucun focus clavier ; le kramail ne prend que le glyphe et la taille du « ••• » ici, son thème du forum reste à l'épopée 7 (2026-10-25).
- Assumption: la balle traçante est l'entrée 2 et non l'entrée 1, déjà construite.
- Assumption: Q27.1, l'heure native « Aujourd'hui (HH:MM) » est gardée, pas d'heure relative.
- Assumption: Q27.2, un forum sans dernier message n'a ni flèche ni case vide ; un forum sans accès est déjà retiré par la liste latérale (fait du site).
- Assumption: Q27.3, l'icône de la ligne est lue dans la liste latérale par correspondance d'URL, repli sur l'icône native (M13).
- Assumption: Q27.4, la flèche de l'index mène au dernier message et la ligne de sujet du sous-forum au premier non lu ; les deux gardent leur ancre sur mobile.
- Assumption: Q28.1 et Q28.2, liens du fil d'Ariane en couleur du texte, cibles de 44 px.
- Assumption: Q28.3, la barre « Répondre / Nouveau sujet » du bas suit l'en-tête H12.4.
- Assumption: la catégorie du fil d'Ariane et de l'en-tête de sujet est lue dans l'entrée active de la liste latérale native (L4), plus écrite en dur.
- Assumption: l'index Staff reste exclu de la présentation de l'index (choix de 6.1 en attente d'Arnaud) ; le sweep rejette les reports propres à l'index Staff (chevron natif, croix d'alerte) avec cette raison, mais l'en-tête de sujet (entrée 4) couvre bien les sujets Staff, comme le dit CAP-7.
- Assumption: sur ordinateur, l'entrée 6 applique la Ligne de forum de DESIGN.md sauf là où une décision d'Arnaud sur 6.1 (colonnes Sujets et Messages gardées) dit autrement.
- Assumption: `span.tagforum` n'est pas touché tant que D14 n'est pas tranchée ; « guilde » ne prend l'Étiquette de catégorie qu'avec D14.
- Assumption: les pages `/forum/*` hors fixtures (réponse, nouveau sujet, recherche, modération) restent relevées à l'épopée 9 (tri de la rétro 5, F5 et A9).
- Assumption: le `needs` de l'épopée 7 sur le « ••• » commun sera épinglé sur 6.5 à l'inception de l'épopée 7.
- Open question: Q27.5 et Q27.6, répétition de « Jeu (RP) » entre titre de page et en-tête de carte, lisibilité de la description et des modérateurs dans le sous-forum ; non tranchées, aucune entrée ne les change.
- Open question: le relevé en lecture seule de la structure des sujets Communauté, Débats et Staff (entrée 4, hitl) suppose l'accès du compte à Staff ; sans accès, la fixture Staff suit la structure RP.
- Open question: le correctif d'ancres H10 est vérifié en émulation pour les deux largeurs lues à l'évaluation (980 et 375) ; un essai sur vrai téléphone reste à faire par Arnaud.
- Decision: l'entrée 1 (index aligné sur le sous-forum, refonte H12.1) est avancée en tête de l'initiative, avant les épopées 3 à 5 ; elle reprend les composants existants du sous-forum plutôt que la carte de section de l'épopée 5 (Arnaud, 2026-10-22).
- Decision: inception partielle, les autres entrées de l'épopée seront planifiées plus tard (2026-10-22).
- Decision: le `verify` de l'entrée 3 est amendé : même rendu à l'index et au sous-forum ; le fil du sujet reste égal à la base, il revient à l'entrée 4 (revue quick de 6.3, constat 2, 2026-10-25).
- Constat du 2026-10-22 (site réel, 1440 et 375 px) : l'index montre description, modérateurs, compteurs sans libellé sur mobile, en-tête de section répété et en couleur de nation, petite flèche sans bouton ; le sous-forum a fil d'Ariane, en-têtes à icône, lignes pleine largeur et bouton → au bout de chaque ligne.
