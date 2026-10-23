# Revue manuelle groupée

Doutes, décisions et validations à trancher par Arnaud à la fin du travail en autonomie (consigne du 2026-10-22). Chaque point porte l'option retenue en attendant, marquée comme hypothèse.

## Validations visuelles en attente (tickets `built`)

- Ticket 2.5, croix de fermeture lisible : captures du site réel dans `.tmp/captures/validation-2-5-croix/` ; sur ordinateur, l'image du titre de l'ordre se place 44 px plus à gauche (la zone de la croix lui réserve sa place).

- Ticket 2.4 (et nouveau placement des alertes du 2.3) : captures du site réel dans `.tmp/captures/validation-2-4-modale/` (`index.html`) ; pastilles dans le pied, alertes en tête de l'ordre, 375 et 1280 px, deux variantes.

- Tickets 2.2 et 2.3, modale d'ordre (libellés, alertes en tête, aide repliée) : captures du site réel dans `.tmp/captures/validation-2-2-2-3-modale/` (`index.html`) ; Dormir et Pouvoir, 375 et 1280 px, deux variantes. Pastilles pastel et « Valider » vert : tickets 2.4 et 2.6 à venir.

- Ticket 6.1, index du forum aligné sur le sous-forum : captures du site réel dans `.tmp/captures/validation-6-1-index-forum/` (`index.html`) ; 4 index, sous-forum et racine, 375 et 1440 px, Kraland clair et Empire Brun sombre.

## Tickets construits à marquer « fait »

- Backlog 3 : nom contenant « $ » (bug corrigé, sans validation visuelle requise).
- Backlog 2 : onglet de section actif sur mobile, même règle que l'ordinateur.
- Backlog 4 : tests de CAP-1 (décor CSS sur Cybermonde, « messages », zones de test).
- Backlog 5 (exploration) : constat 2 infirmé, constat 1 non vérifiable sans marquer un message lu ; à clore ou à reprendre quand un message lu ou envoyé existera.

## Décisions à confirmer

- Épopée 3 (prises en autonomie le 2026-10-23) : valeurs [ASSUMPTION] de DESIGN.md reprises (formules H5.2, couleurs d'état et jauges Q3, info qui suit la nation en sombre Q4) ; alertes à 12 % (fond) et 35 % (bordure) comme la maquette ; Q21 accepté (non-lu #c41e3a et danger #c62828 voisins en Kraland et Ruthvénie, distingués par le libellé et la forme) ; Q26 : text-secondary foncé à #636a77 en clair ; Q20 : pas de seuil non textuel pour les bordures décoratives ; texte aujourd'hui en primaire → text-accent (Ruthvénie clair passe du vert au rouge) ; Q16 : variante high-contrast laissée hors des 16 ; couleurs de nation .f4 à .f8 éclaircies jusqu'à 4,5:1 en sombre ; épopée 3 déclarée après l'épopée 2 (outil des 16 variantes) ; --kr-arm-ink-hover déclaré par 3.1, règles :focus de la modale à 3.7, fonds et halo de l'onglet actif au ticket 2.6.
- Ticket 2.5, croix de fermeture : zone de 44 × 44 px avec le glyphe calé dans le coin haut droit, pour garder le × à sa place native (Q25.4). Option retenue : oui ; alternative : glyphe centré dans la zone (le × se déplace d'environ 15 px vers la gauche et 11 px vers le bas sur ordinateur).
- Ticket 2.3, mobile : le bloc des alertes collé en haut du corps (au-dessus) recouvre la zone d'onglets, collante elle aussi, quand le corps défile. Option retenue : alertes prioritaires (R2 : « restent fixées en haut ») ; alternative : coller les alertes sous la zone d'onglets (moins de place pour le contenu).
- Tickets 2.3 et 2.4, placement (décidé en autonomie le 2026-10-22, à confirmer) : les pastilles coût, durée, potentiel sont dans le pied de la modale, toujours visibles au-dessus des boutons, et les alertes de blocage et d'avertissement remontent en tête de l'ordre, juste sous son titre (`h3`), avant les caractéristiques et les onglets, collées en haut au défilement. Raison : avec les alertes sous le titre de l'onglet (`h4`) et les pastilles dans le pied, l'avertissement de Dormir passait entièrement sous le pli à 375 × 667. Alternative : alertes sous le `h4` et pastilles en fin d'ordre (visibles seulement en fin de défilement).
- Ticket 2.4, potentiel (relevé réel du 2026-10-22) : le troisième segment de la ligne native vaut « Potentiel: … » ou « Automatique » (aucun jet) ; « Automatique » est montré comme pastille de potentiel.
- Ticket 2.3, mobile : à l'ouverture, la bande coût / durée collante recouvre le titre de Dormir et le « ? Aide » de Pouvoir (touchable après défilement). Repris par le ticket 2.4 (pastilles au-dessus des boutons) : bande retirée.
- Tickets de backlog 6, 7, 8 (créés en autonomie, critères complets, `refined: false`) : à approuver. 6 = trois modules des modales inactifs au démarrage réel (attend 2.3) ; 7 = fenêtre étroite au chargement qui arrête l'initialisation ; 8 = mode « start » de fin-initialisation à corriger.
- Épopée 2 : P2 (vrai téléphone) ne bloque que l'entrée 6 ; les entrées 2 à 5 livrent aussi le mobile, vérifié en émulation, avec un risque de reprise si le téléphone diverge. Alternative : tout attendre P2.
- Épopée 2, Q5 (pastilles coût, durée, potentiel) : style des étiquettes de catégorie, icône et valeur, 12 px gras.
- Épopée 2, Q25.2 : alertes de blocage et d'avertissement placées sous le titre de l'ordre (h4), dans l'onglet.
- Épopée 2, Q25.3 : aide repliée derrière « ? Aide » aussi sur ordinateur (maquette key-modale-ordre).
- Épopée 2, Q25.4 : croix de fermeture laissée à sa place native.
- Épopée 2 : croix ≥ 3:1 et onglet actif ≥ 4,5:1 vérifiés sur les deux supports (CAP-3 ne limite pas le support).
- Épopée 2 : l'outil de test des 16 variantes est créé par l'entrée 3 de l'épopée 2.
- Ticket 2.2, thème désactivé (peau coupée) : le socle de la modale d'ordre ne s'installe pas, la modale reste native (« Cancel » / « OK », aucun marquage), comme les modules récents (Kramail:Destinataires, index du forum). Option retenue : oui ; alternative : « Annuler » / « Valider » même thème désactivé.
- P2 à faire par toi : protocole `epic-modale-ordre/protocole-p2-vrai-telephone.md` (ticket 2.1, bloqué en attendant tes résultats) ; il conditionne le ticket 2.6.
- Ticket 6.1, fil d'Ariane de l'index sur mobile : construit à partir du bouton natif « Tous les forums » (« ⏪ Tous les forums › Jeu (RP) »), comme celui du sous-forum part de son bouton « ⏪ Jeu (RP) ». Option retenue : oui ; alternative : titre seul, sans fil d'Ariane (lecture stricte de H12.3).
- Ticket 6.1, index « Staff » : non traité (structure inconnue, hors des quatre index nommés). Option retenue : exclu.
- Ticket 6.1, ordinateur : colonnes Sujets et Messages conservées, comme Msg et Vus du sous-forum, plutôt que « N sujets · N messages » de la maquette h12. Option retenue : alignement sur le sous-forum, consigne du 2026-10-22.
- Ticket 6.1, forum sans message : compteurs « 0 sujets · 0 messages », ni dernier message ni bouton → (Q27). Option retenue : oui.
- Ticket 6.1, en-tête de l'index sur ordinateur : le bouton natif « Tous les forums » (icône seule, libellé en infobulle, posé au-dessus du titre) passe dans le titre, à droite, avec son libellé, comme les boutons « Jeu (RP) » et « nouveau sujet » du sous-forum. Option retenue : oui ; alternative : bouton natif laissé tel quel.
- Ticket 6.1, graisse du nom de forum sur l'index : normale (400), comme un sujet lu du sous-forum, où le gras signale le non-lu ; DESIGN.md donne 700 au jeton `forum-name`. Option retenue : 400.
- Ticket 6.1, icône de l'en-tête de section de l'index : la classe native `fa-comments-o` (nom Font Awesome 4) n'a pas de glyphe en Font Awesome 5, d'où son absence sur la capture ; elle prend le glyphe des en-têtes du sous-forum (`far fa-comments`). Option retenue : oui.
- Plan du ticket 6.1 approuvé en autonomie (checkpoint 1).
- Clore l'épopée 1 (`bmad-ticket`) : verdict de rétrospective « accepted-with-open-items ». Option retenue : laissée ouverte jusqu'à ta confirmation.
- Règle commune aux deux supports en liste combinée `@media (max-width: 767px), (min-width: 768px)` (note P1). Option retenue : oui.

## Hors autonomie

- Push et PR de `feature/next` : aucun push fait.

## Visites du site réel faites en autonomie (lecture seule)

- 2026-10-23 : captures de validation du ticket 2.5 (modale Dormir, 4 ouvertures annulées), variante restaurée.

- 2026-10-22 : lignes de coût natives de 8 ordres relevées (modales annulées), puis captures de validation du ticket 2.4 (16 ouvertures annulées), variante restaurée.

- 2026-10-22 : captures de validation des tickets 2.2 et 2.3 : modales Dormir et Pouvoir ouvertes puis annulées (16 ouvertures), variante restaurée.

- 2026-10-22 : modales d'ordre Dormir et Pouvoir ouvertes depuis le plateau puis fermées par « Cancel » (aucun ordre validé) ; squelette hors dépôt.

- 2026-10-22 : exploration backlog 5 : `/jouer/plateau`, `/jouer/bat`, `/jouer/materiel`, listes du kramail (réception, envoi) ; aucun message ouvert, aucun contenu relevé.

- 2026-10-22 : captures de validation du ticket 6.1 (index, sous-forum, racine), variante de thème restaurée ensuite.

- 2026-10-22 : squelette DOM natif (sans le thème) de `/forum/rp`, `/forum/hrp`, `/forum/communaute`, `/forum/debats` et du sous-forum Royaume de Ruthvénie ; aucun contenu de message relevé.
