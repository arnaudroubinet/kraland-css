---
type: epic
title: "Plateau et confort mobile"
parent: initiative-harmonisation-ux
covers: [CAP-10]
after: []
assignee: ""
risk: medium
---

# Plateau et confort mobile

## Description

Le joueur voit visage et nom entier des personnages présents, touche la bonne cible du premier coup, ne lit aucun texte collé au bord. Dernière épopée : elle vérifie aussi le Success signal de la spec.

## Outcome

Plateau lisible sur portable et pages mobiles confortables ; intent de CAP-10 et Success signal de la spec.

## Done when

1. Les critères success de CAP-10 tiennent ; cartes de personnages vérifiées de 1100 à 1500 px.
2. Arnaud joue les quatre parcours clés en Kraland clair et Empire Brun sombre.
3. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
4. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 9. Cibles hors boutons (les boutons sont à l'épopée 4) et marge latérale de toutes les pages. Non-goals : ceux de la spec.

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-10
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 9
- ux — DESIGN.md, Carte de personnage, détail ; Layout & Spacing (marge mobile)
- faits — notes-implementation.md, Marges mobiles, Cartes de personnages

## Notes

- Waits on epic-identite-et-defauts because: P1.
- Waits on epic-typographie-formes because: tailles de bouton.
- Waits on epic-forum, epic-kramail-mobile, epic-notifications because: la marge et les cibles touchent leurs pages.
- Open question: Q7, Q20, Q24, Q29, Q32 (EXPERIENCE.md) à trancher au plan.
- Decision: inception complète en autonomie (2026-10-28). Douze entrées dans l'ordre de construction (`tickets.toml`) : 1 balle traçante, marge de 16 px des pages de jeu et de l'Aide (template, feuille, classes de page, aide de mesure `lib/marges.mjs`, suite `confort-mobile.mjs`, routeur) ; 2 entrée la moins sûre, carte de personnage selon sa largeur (H7.1) ; 3 spike de relevé des pages hors fixtures ; 4 pages secondaires ; 5 cibles du plateau mobile ; 6 bug du démarrage mobile ; 7 couleurs des PV (bloquée) ; 8 forum ; 9 kramail ; 10 notifications ; 11 parcours et captures (hitl) ; 12 Refactor sweep.
- Decision: prérequis d'épopée épinglés par entrée : P1 sur `1.7` (entrées 1 et 2, les autres l'héritent par 1 ou 2) ; tailles de bouton sur `4.2` (entrées 4 et 5) ; pages du forum finies sur `6.7` (entrée 8) ; kramail et notifications sur leur épopée entière, `epic-kramail-mobile` (entrée 9) et `epic-notifications` (entrée 10), à remplacer par l'entrée qui livre la page finie quand ces épopées seront découpées.
- Decision: les entrées 8, 9 et 10 mesurent dans la suite de leur page avec l'aide de l'entrée 1, pour ne pas partager `confort-mobile.mjs` et pouvoir partir dès que leur épopée est finie.
- Decision: le report « `initModalTabScroll` et `initMobileFeatures` au document-start » devient l'entrée 6, un bug à critères complets (`refine = true`), indépendant des autres lanes ; il reprend aussi l'appel double d'`initCharacterModalMobile` (défauts d'initialisation du 2026-10-24).
- Assumption: la marge se mesure sur le texte (aucun nœud texte visible à moins de 16 px du bord) ; les cartes de section restent à 8 px des bords, leur contenu à 16 px (H4.1, Q10).
- Assumption: H7.1 par requête de conteneur ou mise en page intrinsèque (notes-implementation.md) ; nom en 15 px et points de suspension au-delà de deux lignes (Q7.1, Q7.2) ; plage remesurée en 15 px à 1024, 1100, 1280, 1366, 1440, 1500 et 1920 px.
- Assumption: Q24.1, tuiles d'action du plateau mobile gardées à 64 px (déjà ≥ 44 px) ; leur libellé reste à l'épopée 4.
- Assumption: Q29, comportement du nom long du mini-profil livré par 1.4 gardé (ellipse à 375 px, nom entier à 700 px, `jeu-identite`) ; l'épopée ne le change pas.
- Assumption: Q32.1, 320 px ajouté aux largeurs mobiles des entrées de marge et de cibles ; 360 px non visé.
- Assumption: le spike 3 se fait sous le mandat de lecture du site réel d'Arnaud (navigation libre, aucune action de jeu, jamais `/report`) ; sans ce mandat, il devient hitl.
- Assumption: le cercle et la barre de PV (rétro 5, A6) sont rangés ici parce qu'ils touchent la carte de personnage (Q30.5) ; l'entrée 7 reste bloquée par son `unknown` jusqu'au choix d'Arnaud.
- Assumption: les captures de validation des épopées 5 et 6 (rétro 5, A10 ; rétro 6, A8) sont faites avec celles de cette épopée, dans l'entrée 11, placée avant le sweep puisque le sweep ne change pas le rendu.
- Assumption: rétro 4, A5, prise par les entrées 1 et 5 (`--kr-margin-mobile`, `--kr-touch-target-dpad` consommés) et par le sweep (jetons non lus).
- Open question: Q20, seuil des contrastes non textuels (direction indisponible de la croix en pointillé, bordure des cibles) : aucun seuil fixé ; l'épopée n'en ajoute pas.
- Open question: Q24.2, tuiles et croix visibles sans défilement à l'arrivée sur le plateau ? Non livré sans décision d'Arnaud.
- Open question: Q32.2 à Q32.4 (768 px exact, paysage et tablette, fenêtres natives sous 768 px) : hors des entrées tant qu'Arnaud ne les met pas dans le périmètre.
- Decision: `tests/e2e/lib/router.mjs` et `router.test.mjs` sont un point de fusion accepté, comme `version.json` et le bundle : les entrées qui y ajoutent une zone ou un fragment ne sont pas chaînées pour lui ; au rebase, reprendre la base puis réappliquer l'ajout.
- Decision: défauts d'initialisation du 2026-10-24 hors de l'entrée 6 : place du bouton palette, `insertChangelogButton` et `setTimeout` de 150 ms de la modale d'ordre hors `InitQueue`, rang de `.kr-mobile-overlay` ; ils ne touchent ni les cibles ni la marge.
- Assumption: Q28.2, liens du fil d'Ariane du forum à 44 px (H9.1) mesurés par l'entrée 8 s'ils ne le sont pas déjà par l'épopée 6.
- Open question: Q30.6, accès rapides masqués sur mobile ? L'entrée 5 garde le rendu actuel et leur donne seulement un plancher de 44 px.
- Open question: Staff (chevron natif de 10×14 px, croix d'alerte hors écran, report 5.2) reste hors de l'entrée 8 tant que l'alignement de Staff attend Arnaud.
