---
id: 5
type: spike
title: "Les deux constats différés de la revue du lot 1 sont-ils réels ?"
parent: none
covers: []
after: []
assignee: ""
refined: true
hitl: true
risk: low
---

# Les deux constats différés de la revue du lot 1 sont-ils réels ?

## Description

La revue des tickets 1.1 à 1.5 a différé deux constats non vérifiés. (1) Une page de rédaction du kramail dont le formulaire n'a pas le champ destinataire `textarea#dest[name="c[3]"]` ne serait pas reconnue comme rédaction et perdrait la barre « Envoyer ». (2) Sur `/jouer/bat/<id>` ou `/jouer/materiel/<x>`, un titre actif qui n'est pas le nom du personnage serait mémorisé comme nom. Personne n'attend la réponse pour démarrer, mais chaque constat confirmé devient un bug.

## Approach

1. Avec un mandat d'Arnaud, visite en lecture seule du site réel. Les fixtures anonymisées couvrent déjà nouveau, répondre (-5), répondre à tous (-6) et transférer (-17), qui ont toutes `textarea#dest[name="c[3]"]` : relever seulement les formulaires -7, -15 et -16 ; ouvrir une page `/jouer/bat/<id>` et une `/jouer/materiel/<x>` et relever le texte du titre actif.
2. Aucune action de jeu, aucune capture HTML dans le dépôt ; ne relever ni le contenu ni le destinataire d'un message (messages privés).

Une seule visite, le temps de ces relevés. Réponse suffisante : la présence ou l'absence du champ sur chaque formulaire relevé, et le texte du titre actif des deux sous-pages.
3. Consigner les relevés et la réponse dans les notes de ce ticket ; ouvrir un bug pour chaque constat confirmé, ou retirer la ligne de `deferred-work.md` s'il est infirmé.

## Acceptance Criteria

1. **Chaque constat est tranché**
   Verify: les notes de ce ticket donnent, pour chaque constat, « confirmé » ou « infirmé » avec le relevé qui le prouve.
2. **Suite donnée**
   Verify: un bug existe dans `backlog/` pour chaque constat confirmé ; `deferred-work.md` est à jour.

## References

- parent — none
- deferred — _bmad-output/initiative-harmonisation-ux/deferred-work.md, revue des tickets 1.1 à 1.5
- retro — _bmad-output/initiative-harmonisation-ux/epic-identite-et-defauts/epic-identite-et-defauts-retrospective.md, Action items 4

## Notes

- Étape humaine (hitl) : le mandat de visite du site réel.
- Assumption: risque faible, le spike ne change pas de code.
- Résultat du 2026-10-22 (visite en lecture seule, en autonomie) :
  - Constat 2 (sous-pages du nom) : **infirmé**. Les pages `/jouer/bat` et `/jouer/materiel` ne contiennent aucun lien vers une sous-page `/jouer/bat/<x>` ou `/jouer/materiel/<x>` ; le titre actif y vaut le nom du personnage (« Nerys »), comme sur le plateau. Le code accepte ces sous-chemins, mais aucune page réelle n'y mène.
  - Constat 1 (rédaction kramail sans `textarea#dest`) : **non vérifiable sans changer l'état du compte**. Boîte d'envoi de Nerys vide (aucun formulaire -15, -16, -17 atteignable) ; la réception ne contient qu'un message non lu, que l'ouvrir marquerait comme lu (formulaire -7). Reste ouvert : à vérifier quand un message lu ou envoyé existe.
