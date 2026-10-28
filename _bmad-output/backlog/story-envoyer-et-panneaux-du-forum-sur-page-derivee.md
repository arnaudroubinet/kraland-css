---
id: 12
type: story
title: "Sur le forum, « Envoyer » reste atteignable sous la barre d'un message ouvert, et accordéons et modales gardent leur peau"
parent: none
covers: []
after: [11]
assignee: ""
refined: true
hitl: false
risk: low
---

# Sur le forum, « Envoyer » reste atteignable sous la barre d'un message ouvert, et accordéons et modales gardent leur peau

## Description

Action A4 de la rétrospective de l'épopée 6 (F5), qui reprend les reports D7 et D13 de `deferred-work.md`. Aucune fixture ne porte ces cas. Le sweep 6.7 les a jugés faisables sur une page dérivée en mémoire.

- D13 : depuis 6.5, sur mobile, la barre d'un message ouvert est en z-index 991, pour passer au-dessus de `.dropdown-backdrop` (990). La barre « Envoyer » fixe du sujet (`:where(body.page-forum) button.btn-primary.pull-right`) est en z-index 90. La barre ouverte peut donc couvrir « Envoyer ».
- D7 : un `.panel-group` (accordéon) ou une modale `.panel-default` posés sur une page `/forum/*` pourraient prendre le fond, le rayon ou l'en-tête de la carte de section du forum (épopée 5).

## Acceptance Criteria

1. **« Envoyer » atteignable**
   **Given** un sujet mobile dérivé en mémoire, à 375 et 767 px, avec un formulaire de réponse (barre « Envoyer » fixe) et un message dont la barre « ••• » est ouverte
   **When** on relève `elementFromPoint` au centre de « Envoyer »
   **Then** c'est « Envoyer » ou un de ses descendants ; sinon la peau est corrigée (P1 option 4, aucun nouvel `!important`), ou, si la correction demande un choix produit, le recouvrement est mesuré et consigné en question à Arnaud
2. **Accordéon et modale hors carte de section**
   **Given** une page `/forum/*` dérivée, avec un `.panel-group` et une modale Bootstrap `.panel-default`, sur mobile et ordinateur
   **When** elle est rendue
   **Then** leur fond, leur rayon et leur en-tête sont ceux des panneaux hors forum (même page sans la garde de forum, ou valeurs de la base mesurées au plan), pas ceux de la carte de section
3. **Contre-épreuves**
   **Given** un bundle muté où la barre ouverte couvre « Envoyer », puis un autre où la carte de section s'applique à tout `.panel-default`
   **When** les contrôles tournent
   **Then** chacun échoue

## Boundaries

- Fixtures synthétiques et pages dérivées en mémoire seulement ; aucun relevé du site réel exigé.
- Ne change ni l'ordre des actions du message ni le « ••• » de 6.5, sauf pour corriger le recouvrement.

## References

- retro — _bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum-retrospective.md, A4 (F5)
- deferred — _bmad-output/initiative-harmonisation-ux/deferred-work.md, D7, D13, Reports du ticket 6.5
