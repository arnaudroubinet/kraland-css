# Revue manuelle groupée

Doutes, décisions et validations à trancher par Arnaud à la fin du travail en autonomie (consigne du 2026-10-22). Chaque point porte l'option retenue en attendant, marquée comme hypothèse.

## Validations visuelles en attente (tickets `built`)

- Ticket 3.1, jetons de couleur et liens en couleur d'accent : captures de la fixture dans `.tmp/captures/validation-3-1-jetons/` (Kraland, Empire Brun et Paladium, clair et sombre, 375 et 1280 px). Sur le site, changements visibles : liens d'Empire Brun clair en brun `#8a5a00` au lieu de l'or ; survol des liens sans changement de couleur, souligné ; nuances du clair tirées de chaque nation (plus de rouge Kraland hors Kraland). Aucune visite du site réel pour ce ticket.

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

- Ticket 3.5, palette d'états réservée aux états (décidé en autonomie le 2026-10-23) :
  - lien dans une alerte (info comprise) : couleur du texte de l'alerte (`text-primary`), souligné. En couleur d'accent, il tombait à 3,80:1 en Paladium sombre sur l'alerte info (Q4) et à 4,30:1 sur l'avertissement à 12 %. Alternative : accent partout sauf Paladium sombre ;
  - info pleine (`.btn-info`, `.label-info`, `.bg-info`) : paire d'action de la nation, comme les boutons primaires ; `.text-info` en `text-accent` ; panneau info et alerte info en `--kr-alert-info-*`. DESIGN.md ne donne que la teinte de l'alerte info ;
  - pièce courante du plateau : la règle sombre `.btn-warning` (couleur de nation, ticket 3.2) ne vise plus que le lien natif `.btn-warning` à image de pièce (`img[src*="/bat/bat"]`) ; en clair, la pièce garde l'orange de Bootstrap (hors périmètre). Les autres `.btn-warning` prennent la couleur d'avertissement ;
  - marque PNJ native (`.btn-danger.xmini`) exclue des boutons de danger (épopée 5) ;
  - fonds `.bg-success/-warning/-danger` : couleur d'état pleine, texte `bg-surface` (plus de pastel de Bootstrap). Aucun emploi relevé sur les fixtures ;
  - score des messages sur mobile : teinte de succès à 12 % (fond) et 35 % (bordure), texte du thème, comme une alerte (il était vert translucide) ; votes sur ordinateur : bouton de succès plein ;
  - alerte info de l'accueil : fond `--kr-alert-info-bg` (et bordure `--kr-alert-info-border` sur ordinateur) au lieu de `bg-elevated`, filet primaire gardé ; en sombre, la règle en dur `rgb(122, 82, 64)` la battait jusqu'ici ;
  - en sombre, la bordure `border-default` ne vise plus que les alertes sans type (aide de la modale d'ordre sur ordinateur) : posée sur toute `.alert`, elle battait la bordure des alertes info et d'état ;
  - en-tête des panneaux info de la modale d'ordre sur ordinateur (tableau des actions) : teinte info de la nation au lieu du bleu de Bootstrap (clair) et de `bg-elevated` (sombre) ;
  - boutons de la page Contacts et « Pas un contact » : non relevés (ni fixture ni classe de page). Ils prennent les règles communes des boutons d'état ; à vérifier, reporté (`deferred-work.md`).

- Ticket 3.4, mode clair thémé comme le sombre, bouton standard (décidé en autonomie le 2026-10-23) :
  - Confédération Libre clair : `text-nation` (sa primaire `#6b7280`) ne fait que 4,38:1 sur `header-tint`, le fond du bouton standard survolé ou pressé. Option retenue : la variante prend son accent `#475369` (7,04:1), comme Paladium (Q2) ; DESIGN.md mis à jour. Alternative : garder la primaire au repos et ne foncer que le survol et l'appui ;
  - « Annuler » de la modale d'ordre mobile : fond `bg-elevated` → `bg-surface`, comme « ? Aide » (en sombre seulement ; en clair les deux sont blancs). Son texte reste `text-secondary` (règle propre à la modale) ;
  - bouton standard en sombre : survol `bg-active` → `header-tint` (`bg-elevated`), focus `bg-hover` → `bg-surface`, bordure des états `border-strong` → `border-default`, selon la matrice du plan (une seule règle pour les deux modes) ;
  - effets visibles en clair : en-têtes, pieds et en-têtes de tableau teintés de la nation, onglets bordés de la teinte, bouton standard au texte de la nation (il était en accent, par la règle des liens, sur les `a.btn-default`), `hr` masqués partout (séparateurs du plateau et séparateur des filtres d'Événements, `body.page-evenements #col-left form hr`, compris), texte atténué un peu plus foncé.

- Ticket 3.3, texte coloré en accent, rouge et bleu en dur (décidé en autonomie le 2026-10-23) :
  - modale du changelog (point résolu, décision à confirmer) : son fond est noir dans les 16 variantes, où l'accent du clair tombait de 2,01:1 (Paladium) à 3,55:1 (Théocratie Seelienne). Option retenue : titre, version et puces y gardent le texte clair de la modale (hérité) au lieu de l'accent, ≥ 4,5:1 dans les 16 variantes. Alternative : modale sur la surface claire du thème en clair, avec l'accent ;
  - flèche du carrousel en sombre : opacité passée de 0,7 à 1 (à 0,7, l'accent tombait à 3,4:1 en Kraland sombre) ;
  - alerte d'avertissement en sombre : fond passé de 15 % à 8 % d'ambre. Avec 15 %, le lien en accent tombait à 4,36:1 en Kraland sombre et à 4,04:1 en Paladium sombre. Avec 8 %, il passe à 5,02:1 et 4,65:1. Les 12 % prévus pour les alertes (maquette) feraient retomber Paladium sombre à 4,30:1 : à arbitrer au ticket 3.5 ;
  - boutons génériques de la barre BBCode : fond passé de `--kr-surface` (blanc dans les 16 variantes) à `--kr-bg-surface`. En sombre, l'accent sur blanc tombait entre 1,66:1 et 3,34:1 ; le clair ne change pas ;
  - couleurs de nation `.f1` à `.f9` en sombre : déjà toutes ≥ 6,26:1 sur `bg-surface` et `bg-elevated` dans les 8 variantes sombres, donc aucune valeur changée ; le contrôle est ajouté ;
  - effets visibles en clair : ces textes passent du vert au rouge en Royaume de Ruthvénie, de l'or au vert en Paladium et au brun `#8a5a00` en Empire Brun.
- Ticket 3.2, texte posé sur la couleur de nation (décidé en autonomie le 2026-10-23) :
  - fond et encre changent ensemble : tout fond en couleur de nation prend la paire d'action. Au repos, c'est `--kr-arm-bg` / `--kr-arm-ink` ; au survol, à l'appui et sur la primaire foncée, `--kr-arm-bg-hover` / `--kr-arm-ink-hover`. Effets visibles :
    - en clair, le texte des boutons primaires passe du rose (accent inverse) au blanc, et à l'encre sombre en Paladium ;
    - en Kraland et Khanat Elmérien sombres, ces fonds prennent la teinte d'action (`#b64c4c`, `#8659b3`) des boutons et de la croix ;
    - en Empire Brun sombre, le texte passe de `#f5f1ed` à blanc ;
  - les règles sombres E3 et PLT-10, qui recopiaient en dur les valeurs des variables, sont remplacées par les variables ;
  - « fin du bleu Bootstrap » étendue à tous les éléments bleus de ces composants : états des boutons primaires, badge interne, `.dropdown-menu > .active`, `.nav-pills`, pagination au focus, `.label[href]` survolé, `.panel-primary`, texte et badge du titre actif des listes ;
  - `.btn-warning` en sombre, peint en couleur de nation : son fond passe aussi en `--kr-arm-bg`. Avec la seule encre, le texte tombait à 4,00:1 en Kraland sombre et à 3,64:1 en Khanat Elmérien sombre. Le choix de sa couleur (état ou nation) revient au ticket 3.5 ;
  - plan approuvé en autonomie (checkpoint 1), gardé en un seul plan malgré sa taille (un seul objectif).
- Ticket 3.1, jetons de couleur (décidé en autonomie le 2026-10-23) :
  - nuances du clair calculées par une formule (`color-mix`, une par nuance, Kraland compris), plutôt que 56 valeurs recopiées ; Kraland clair change d'un cran, comme les tableaux de DESIGN.md (primaire foncée `#700b09` → `#6f0c0b`, accent inverse `#f9d9de` → `#f6dde1`) ;
  - le texte survolé des entrées sans lien des listes latérales (`.list-group-item:hover`, en primaire foncée) passe en couleur d'accent dès 3.1, sinon il tomberait à 2,9:1 en Paladium clair ; les entrées-liens gardent le survol de Bootstrap (`#555`, sans soulignement), avant comme après ;
  - question : les entrées-liens des listes latérales doivent-elles suivre R7 (accent et soulignement au survol) comme les liens du texte ? Option retenue en attendant : non, ce sont des entrées de navigation (rendu actuel gardé) ;
  - texte posé sur la primaire foncée (boucle de revue 1) : la page active de la pagination, le survol des boutons primaires, celui de la croix des panneaux mobiles et celui de « tout voir » prennent la paire de survol d'action dès 3.1. Sinon, en Paladium clair, la nouvelle primaire foncée `#aa8c2c` mettrait leur texte blanc à 3,23:1 (le texte des boutons primaires survolés est blanc : la règle de Bootstrap l'emporte sur l'accent inverse ; le repli garde ce blanc). Seule exception laissée au ticket 3.2 : l'état pressé de la barre d'envoi fixe, bref, et que R4 retire ;
  - alerte info en sombre (boucle de revue 1) : jetons déclarés, mais fond et bordure actuels gardés jusqu'au ticket 3.5. Avec la teinte de la nation, les liens d'alerte, en primaire jusqu'au ticket 3.3, tomberaient sous 4,5:1 dans 3 variantes sombres ; en couleur d'accent, Paladium sombre tomberait à 3,80:1 (Q4) ;
  - jetons et règles de lien réécrits à leur place, globaux comme avant ; la liste combinée vaut pour les règles nouvelles ;
  - plan approuvé en autonomie (checkpoint 1), gardé en un seul plan malgré sa taille (environ 2 100 jetons, un seul objectif).
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
- Ticket 3.6, jauges du panneau sur ordinateur : chaque barre a deux segments, la valeur (`.progress-bar-success`) et le reste (`.progress-bar-warning`, largeurs complémentaires dans le relevé). La valeur prend la couleur de la jauge ; le reste devient transparent et laisse voir la piste, comme sur mobile. Le « #f0ad4e de PP » de DESIGN.md était ce reste (PP à 0 dans le relevé). Option retenue : reste fondu dans la piste ; alternative : reste dans une teinte claire de la couleur de la jauge. La valeur est le 1er segment, quelle que soit sa classe (danger ou warning compris) ; les segments suivants sont transparents.
- Ticket 3.6, piste des jauges sur mobile : la piste (`#f5f5f5` en clair, bg-elevated en sombre) posée sur bg-surface s'en distingue à peine (≈ 1,09:1) ; la partie vide de la jauge se voit mal. Point de validation visuelle pour toi. Option : un filet de 1 px en border-tint autour de la piste.

## Hors autonomie

- Push et PR de `feature/next` : aucun push fait.

## Visites du site réel faites en autonomie (lecture seule)

- 2026-10-23 : `/jouer/plateau` à 1280 px (Chrome dédié, CDP 9223), squelette du DOM des jauges du panneau seulement (classes, largeurs en ligne), relevé hors dépôt ; aucun clic, aucune action de jeu, variante non modifiée.

- 2026-10-23 : captures de validation du ticket 2.5 (modale Dormir, 4 ouvertures annulées), variante restaurée.

- 2026-10-22 : lignes de coût natives de 8 ordres relevées (modales annulées), puis captures de validation du ticket 2.4 (16 ouvertures annulées), variante restaurée.

- 2026-10-22 : captures de validation des tickets 2.2 et 2.3 : modales Dormir et Pouvoir ouvertes puis annulées (16 ouvertures), variante restaurée.

- 2026-10-22 : modales d'ordre Dormir et Pouvoir ouvertes depuis le plateau puis fermées par « Cancel » (aucun ordre validé) ; squelette hors dépôt.

- 2026-10-22 : exploration backlog 5 : `/jouer/plateau`, `/jouer/bat`, `/jouer/materiel`, listes du kramail (réception, envoi) ; aucun message ouvert, aucun contenu relevé.

- 2026-10-22 : captures de validation du ticket 6.1 (index, sous-forum, racine), variante de thème restaurée ensuite.

- 2026-10-22 : squelette DOM natif (sans le thème) de `/forum/rp`, `/forum/hrp`, `/forum/communaute`, `/forum/debats` et du sous-forum Royaume de Ruthvénie ; aucun contenu de message relevé.

### Racine du forum /forum et /forum/ — validation visuelle
La racine reprend les lignes des index sur ordinateur et mobile ; tous les groupes RP, HRP, etc. restent visibles. Vérifier noms, compteurs et accès au dernier message. Revue indépendante sans constat restant ; contre-épreuve rouge et tests sur fixtures verts. Pas de changement publié sur la modale ou la palette dans cette livraison.

## Ticket 3.7 — focus clavier : abandonné (2026-10-23)

- Décision d'Arnaud : « Pas de focus clavier. On ne gère pas les handicapés. » Ticket abandonné, diff annulé (copie hors dépôt : `/tmp/kr-37-annule/`). Les effets de focus existants (halos rouge, bleu, orange, contours kramail) restent tels quels.
- Prérequis retirés : 3.8 n'attend plus 3.7 ; l'épopée 4 n'attend plus « anneau de focus ».
- Hypothèse conservée : les contrastes de texte et les cibles tactiles de 44 px restent (lisibilité, usage au doigt).
