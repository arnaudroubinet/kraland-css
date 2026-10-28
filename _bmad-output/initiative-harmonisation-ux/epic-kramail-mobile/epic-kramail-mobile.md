---
type: epic
title: "Kramail : même thème que le forum, ordinateur et mobile"
parent: initiative-harmonisation-ux
covers: [CAP-8]
after: []
assignee: ""
risk: high
---

# Kramail : même thème que le forum, ordinateur et mobile

## Description

Toutes les pages du kramail (listes Réception, Envoi et Corbeille, lecture d'un message ou d'un fil, rédaction, contacts) reprennent, sur ordinateur et sur mobile, les composants du forum construits aux épopées 5 et 6 : la liste reprend la liste des sujets du sous-forum, la lecture le message d'un sujet, la rédaction le formulaire de réponse ; carte de section, en-tête, onglets et « ••• » sont communs. La palette privée `--kd-*` disparaît au profit des jetons de rôle de l'épopée 3. Sur mobile, le joueur sait dans quel dossier il est et « Envoyer » ne couvre jamais sa saisie, au forum comme au kramail.

## Outcome

Lire et écrire un kramail se fait dans le même décor que le forum, sur ordinateur comme sur téléphone ; intent de CAP-8, élargi par Arnaud le 2026-10-23.

## Done when

1. Les critères success de CAP-8 tiennent sur mobile : Réception, Envoi et Corbeille en onglets libellés, actif souligné ; Nouveau message, Contacts et « ••• » en boutons de 44 px ; « Envoyer » dans le flux sous le champ (48 px, couleur de nation), au forum comme au kramail ; plus aucune barre d'envoi fixe.
2. Sur les deux supports, chaque page du kramail (trois listes, lecture d'un message et d'un fil, rédaction, contacts) utilise les composants du forum nommés en Description (onglets sur mobile seulement), et ni `kraland-theme.css` ni le template ne contiennent plus de variable `--kd-*`.
3. « Envoyer » vérifié clavier ouvert sur un vrai téléphone par Arnaud (P2, point E), au kramail et au forum.
4. PR fusionnée sur `feature/next`, bundle et `version.json` régénérés, `npm run test:all` vert avec au moins un test par décision livrée.
5. Vérifié à 1280, 1440 et 1920 px et à 375×667, sur Kraland clair et Empire Brun sombre au moins, toute règle de couleur dans les 16 variantes ; fixtures synthétiques créées par l'épopée, aucune capture HTML brute dans le dépôt.

## Boundaries

Lot 7. Une seule unité, la surcharge. Le kramail reprend les composants du forum tels que les épopées 5 et 6 les ont livrés : il ne les modifie que pour les rendre applicables au kramail, sans changer le rendu du forum, sauf « Envoyer » (CAP-8, forum compris). Hors périmètre : les Non-goals de la spec (dont la barre d'onglets sur ordinateur), le contenu des messages, le champ Destinataires dans son comportement (`Kramail:Destinataires` garde sa logique, seul son habillage change), la marge latérale de 16 px et les cibles hors kramail et forum (épopée 9).

## References

- spec — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/spec-harmonisation.md, CAP-8, Constraints (P1, P2)
- lots — _bmad-output/initiative-harmonisation-ux/spec-harmonisation/lots-de-livraison.md, lot 7
- ux — ux-harmonisation/DESIGN.md › Components (Onglets de section, Bouton « Envoyer », Bouton « ••• », Carte de section, Éditeur de rédaction) ; EXPERIENCE.md, Kramail, Parcours 3, Q22, Q31 ; mockups/key-kramail-mobile.html
- P2 — epic-modale-ordre/protocole-p2-vrai-telephone.md, point E (résultat du 2026-10-23)
- composants du forum — epic-cartes-pastilles/tickets.toml (5.1, 5.2), epic-forum/tickets.toml (6.3, 6.4, 6.5), Messages:V3 et formulaire `form.kr-editor` (template, feuille l.15016-15469)
- rétro — epic-forum/epic-forum-retrospective.md, actions A1, A5, A8, A9

## Notes

- Waits on epic-modale-ordre because: résultat P2 (2.1, point E vérifié le 2026-10-23).
- Waits on epic-cartes-pastilles because: carte de section (5.1) et liste des sujets du sous-forum dans la carte (5.2).
- Waits on epic-forum because: « ••• » commun (6.5), fil d'Ariane et en-tête de sujet (6.3, 6.4).
- Waits on epic-palette-nation because: jetons de rôle (3.1).
- Decision: périmètre élargi par Arnaud (2026-10-23) : « Toute la partie kramail doit être revue pour utiliser le même thème que le forum. » Ordinateur et mobile, toutes les pages du kramail (liste des dossiers, lecture, rédaction, contacts) reprennent les composants du forum (liste des sujets, message de sujet, formulaire de réponse, carte de section, onglets, « ••• ») ; la palette privée `--kd-*` est remplacée par les jetons de l'épopée 3. À découper à l'inception de l'épopée.
- Decision: inception complète en autonomie (2026-10-28), 10 entrées dans l'ordre de construction : 1 balle traçante (gardes de page, suite `kramail-theme.mjs`, onglets de dossiers et boutons de 44 px) ; 2 lecture d'un message et d'un fil, entrée la moins sûre ; 3 en-tête du kramail ; 4 listes des dossiers ; 5 rédaction ; 6 palette `--kd-*` retirée ; 7 « Envoyer » dans le flux ; 8 contacts ; 10 refactor sweep ; 9 vrai téléphone et captures (hitl), après le sweep. Au-delà de huit entrées : une seule lane, un seul propriétaire, pas de scission proposée.
- Decision: entrées chaînées par collision (suite `kramail-theme.mjs` et sa zone dans le routeur créées par l'entrée 1 ; sections kramail de la feuille l.8842-11406 ; modules `Kramail:*` du template), pas seulement par dépendance fonctionnelle (2026-10-28).
- Decision: entrées 1 à 8 chaînées une à une (une seule lane) ; les prérequis vers 5.2, 6.3 et 6.4 sont portés par l'entrée 1 via 6.5 ; l'entrée 9 passe après le sweep pour que téléphone et captures portent sur le code final, et tient lieu de vérification de clôture (validation du brouillon, 2026-10-28).
- Decision: P1 option 4 pour toutes les entrées : chaque entrée retire ou réécrit les règles kramail qu'elle remplace, sans les battre ; aucun nouvel `!important` ; gardes en `:where(html.x)` (2026-10-28).
- Decision: l'entrée « Envoyer clavier ouvert » devient hitl (entrée 9) : P2 a donné son résultat le 2026-10-23 (point E : la barre fixe couvre le champ, option B d'Arnaud) ; reste à vérifier le correctif sur le téléphone d'Arnaud (2026-10-28).
- Assumption: gardes de page posées sur `<html>` (`kr-page-kramail`, `kr-page-kramail-liste`, `kr-page-kramail-lecture`, `kr-page-kramail-compose` ; `kr-page-contacts` à l'entrée 8), à côté des classes `body.page-kramail*` existantes, retirées au sweep une fois sans lecteur.
- Assumption: la rédaction est reconnue par `form[name="post_msg"]` sous `/kramail/post/`, et plus par `textarea#dest[name="c[3]"]` (report du lot 1, rédaction jamais classée) ; une lecture n'a pas ce formulaire.
- Assumption: Q31.1, onglets pleine largeur sous le titre et boutons à icône dessous (maquette key-kramail-mobile) ; Q31.2, « Nouveau message » en bouton à icône libellé par son infobulle, non libellé ; Q31.3, barre d'outils du kramail alignée sur celle du forum (5 outils et « Plus »).
- Assumption: Q22.1, Répondre et Répondre à tous libellés en tête du message, les autres actions dans « ••• » ; Q22.2, pas de nouveau parcours.
- Assumption: les fixtures de fil et de message lu depuis l'Envoi (entrée 2) et de Contacts (entrée 8) suivent une structure relevée en lecture seule sur le site réel par l'agent.
- Assumption: sur ordinateur (entrée 4), les dossiers gardent leurs boutons natifs restylés en boutons standards, l'actif en bouton primaire (Non-goal : barre d'onglets sur ordinateur).
- Assumption: la suite `kramail-theme.mjs` a une base figée sur un SHA (proposition de l'A9 de la rétro 6) et injecte le userscript en début de document (A5) ; `kramail-redaction.mjs` garde sa base jusqu'à la décision d'Arnaud sur A9.
- Assumption: la page Contacts est `/contacts`, hors du chemin `/kramail` ; sa fixture est créée sur la structure relevée en lecture seule sur le site réel, sous le mandat de lecture d'Arnaud.
- Source conflict: EXPERIENCE.md › État lu/non lu, kramail — « rendu actuel » vs décision du 2026-10-23, la liste reprend celle des sujets (signal « non lu » de `--kr-status-unread`) ; l'entrée 4 applique la décision du 2026-10-23.
- Source conflict: CAP-8 (spec) — périmètre mobile seul vs décision d'Arnaud du 2026-10-23 (ordinateur et mobile, toutes les pages) ; texte de spec proposé à l'orchestrateur, non écrit ici.
- Open question: A1 de la rétro 6, le Done when 4 est-il rempli par le push sur `feature/next` ou faut-il une fusion vers main ?
- Open question: D11, correctif d'ancres mobile limité à `#flap` ; aucune suite ne vérifie une ancre du kramail. Le sweep s'y plie.
- Open question: Q31.1 à Q31.3 et Q22.1 sont des hypothèses ; la spec demande leur validation par Arnaud au plan (« aucun nouveau composant sans validation »), avant les entrées 1, 2 et 5.
- Open question: la spec doit-elle porter CAP-8 élargi, ou la Decision du 2026-10-23 suffit-elle ?
