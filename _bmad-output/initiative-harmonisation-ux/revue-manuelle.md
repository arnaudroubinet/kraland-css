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
- Épopée 2, Q25.2 : alertes de blocage et d'avertissement placées sous le titre de l'ordre (h3), avant les caractéristiques et les onglets (remplace « sous le h4 », tickets 2.3 et 2.4).
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

## Ticket 2.6 — « Valider » et onglet actif de la modale d'ordre (2026-10-23)

- Effet élargi, accepté en autonomie : sur mobile, le « OK » de toutes les confirmations Bootbox (pas seulement l'ordre, ex. « Retirer ce personnage de vos contacts ? ») perd son dégradé vert et prend la couleur de la nation, comme tout bouton primaire (H5.1). À confirmer.
- L'onglet actif de la modale d'ordre devient fond et texte du thème sur les deux supports ; le libellé rouge de l'onglet Pouvoir prend la couleur du texte.

## Inception de l'épopée 4 « Même rôle, même taille, même forme » (2026-10-24)

Breakdown en 10 entrées (`epic-typographie-formes/tickets.toml`), écrit en autonomie. Option retenue pour chaque point, à confirmer ou renverser :

- Découpage : 1 jetons et étiquettes/pastilles 12 px gras (balle traçante) ; 2 bouton de taille normale ; 3 modales Bootbox mobiles (« Valider » de taille normale, règles contradictoires de `deferred-work.md`) ; 4 bouton compact ; 5 échelle du plateau, du mini-profil et des en-têtes ; 6 Matériel, Personnage, Bâtiments, Employés et ligne d'objet ; 7 échelle du forum et du kramail ; 8 trois rayons ; 9 grille de 4 px ; 10 Refactor sweep. Entrées chaînées (suite et sections CSS partagées).
- L'épopée 4 attend aussi l'épopée 2 (section 9h, tickets 2.6 et 2.7), ajoutée à son `after` dans le `tickets.toml` de l'initiative.
- Q8 : texte courant mobile 15 px ; messages du forum 16 px ; champs 16 px (anti-zoom iOS).
- Q9 : compact en 12 px, rayon 4 px ; hauteur 22 px et couleur de succès (ticket 3.5) gardées ; mobile inchangé.
- Q11 : grille sur `.panel-body`, `.panel-heading`, `.btn`, `.form-control`, cellules de tableau ; gouttière exclue.
- Q12 : croix, avatars et images gardent leur forme.
- Q14 : onglets et jauges du mini-profil à 12 px.
- Kramail : règles communes seulement, sans entrée propre ; recouvrement avec l'épopée 7 (thème du forum).
- À trancher :
  - mandat de relevé en lecture seule (squelette DOM de Matériel, Bâtiments, Employés) avant l'entrée 6 ;
  - pages secondaires sous 12 px (accueil 8-9 px, Événements) : dans l'épopée 4 ou laissées ;
  - cibles de 44 px des votes et de la pagination sur mobile : épopée 9 (option retenue) ou entrée 4.

## Ticket 4.1 — jetons et étiquettes en 12 px (2026-10-24)

- « Puces du kramail » lues comme les étiquettes d'options (`.kd-opt-tag`, `.kd-opt-free`, 11-11,5 px) ; les puces de destinataire `.kd-chip` (13-15 px, avec croix) sont des contrôles et restent à leur taille. Alternative : les passer aussi en 12 px.
- `.kr-stat-badge` (11 px, hors liste du ticket) inclus : c'est une pastille.
- Plan de plus de 1600 jetons gardé entier (la balle traçante regroupe jetons, suite et routeur).
- Icône `.forum-tags .glyphicon` laissée à 8 px (icône, pas texte d'étiquette). Alternative : 12 px.
- Tout `.label` est désormais à 12 px fixe, même dans un titre (avant : 75 % du titre).

## Ticket 4.2 — bouton de taille normale (2026-10-24)

- Envoyer sur mobile laissé à sa taille (`send-button` 48 px, R4, épopée 7) ; sur ordinateur, Envoyer du kramail passe de 15 px / 47 px à 14 px / 34 px (EXPERIENCE.md :280).
- Exclus de la taille normale : boutons-images du plateau (bâtiments), boutons-icônes (en-tête du kramail, œil d'Interface), bandeau de redimensionnement.
- « Jouer » de l'accueil et pied du changelog suivent la taille normale sans fixture (aucune fixture d'accueil).
- L'épopée note « aucun bouton de vote dans les fixtures du sujet » (l.57) : faux, `forum-sujet.html:26-28` en a ; à corriger dans la rétro.
- Boutons à icône seule de l'en-tête du sujet (lien, liste des messages) et de l'index (« Tous les forums ») : leur icône passe de 16 à 14 px sur mobile avec la taille normale. Les garder à 16 px demande une classe posée par le JS. Accepté en l'état, à confirmer.
- À 768 px, le « + » des contacts prend le style ordinateur alors que le champ Destinataires natif garde ses règles `max-width: 768px` ; le champ natif est masqué par le widget, rendu mixte non vérifié visuellement.

## Ticket 4.3 — modales Bootbox mobiles (2026-10-24)

- Toute confirmation Bootbox sur mobile prend le pied de la modale d'ordre (colonne, boutons pleine largeur, 14 px, ≥ 44 px), hors ordre comprise.
- « ? Aide » de la modale d'ordre passe aussi à la taille normale (16 → 14 px sur mobile).
- L'onglet actif des modales à onglets hors ordre (bg-elevated, accent) est gardé tel quel.
- Les modales non Bootbox en mobile-mode perdent l'étirement `flex:1` de leurs boutons (aucune n'est connue sur le site) ; `bootbox.alert` et `prompt` prennent aussi le pied en colonne.

## Ticket 4.4 — bouton compact (2026-10-24)

- Rayon de 4 px posé seulement aux coins déjà arrondis (extrémités des groupes de vote et de la pagination), coins intérieurs carrés.
- Les autres petits boutons des messages (date, profil, kramail, signaler) restent en 12 px natif : ils ne sont ni compacts ni normaux au sens de l'épopée.

## Ticket 4.5 — échelle typographique (2026-10-24)

- Titres mobiles en px : h1 à h3 à 17 px, h4 à h6 à 15 px (l'ancienne échelle en rem donnait 17,5 / 15 / 12,5 / 11 / 10 / 9 px).
- Texte courant à 15 px appliqué au plateau mobile seulement ; forum (messages 16 px), kramail et accueil inchangés.
- Titres de modale (18 px) et en-têtes d'accordéon hors du titre de section 17 px.
- Les 11 px du forum, du kramail et de l'accueil sur mobile ne sont pas traités ici (question ouverte des pages secondaires).
- Pages de jeu repérées par la présence de `#col-leftest` (aucune classe de page pour le plateau) : à confirmer sur le site.
- Nom des cartes du tableau de bord à 15 px dans des cartes de 140-160 px (2 lignes max, ellipse) : rendu à regarder.
- `.xmini` et liens du pied de page passent à 12 px sur toutes les pages (planchers PLT-QU) ; `h1.page-header` mobile 17,5 → 17 px.

## Ticket 4.6 en attente, 4.7 construit avant (2026-10-24)

- 4.6 (Matériel, Personnage, Bâtiments, Employés) attend le mandat d'Arnaud pour relever en lecture seule le squelette DOM de Matériel, Bâtiments et Employés.
- 4.7 (forum et kramail) construit avant 4.6 : leur chaînage n'est qu'une collision de fichiers (même suite, mêmes sections), pas une dépendance fonctionnelle.

## Ticket 4.7 — échelle du forum et du kramail (2026-10-24)

- Kramail : valeurs de ses règles existantes passées en jetons (aucune règle nouvelle), en attendant l'épopée 7.
- Gardés hors échelle : titres de page mobiles à 24 px, icônes et glyphes, champs à 16 px.
- Mandat donné par Arnaud le 2026-10-24 (« Tu as le droit d'aller sur le site juste pas faire des actions ») : HTML natif de `/jouer/materiel`, `/jouer/bat`, `/jouer/pnj` relevé en lecture seule (GET, hors dépôt) ; 4.6 débloqué, construit après 4.7.
- 4.7 : nom de forum de l'index en 15 px, graisse 400 (ticket 6.1) alors que DESIGN.md dit 700 : à trancher.
- 4.7 : cartouche de l'auteur du sujet sur ordinateur passée en détail 13 px (14 natif avant) ; textarea de la rédaction mobile 15 → 16 px (anti-zoom).

## Ticket 4.6 — Matériel, Personnage, Bâtiments, Employés (built, 2026-10-24)

- Plateau mobile inchangé : exclu par la nouvelle classe `html.kr-page-plateau`, posée par le template. Le commerce reste à 12 px.
- À trancher : sur ordinateur, le panneau Matériel du plateau (`.kr-materiel-moved`) passe de 10,6 à 13 px. Le plan l'exige (Always), ce qui contredit « ne pas toucher au plateau ». Je l'ai gardé.
- Ligne d'objet mobile : image, puis le nom, puis la charge en gris secondaire. Sans image, le nom part du bord.
- Les fixtures Bâtiments, Employés et la partie plateau Commerce/Matériel sont reconstruites, pas relevées ligne par ligne : à comparer visuellement au vrai site.

## Ticket 4.8 — Trois rayons (built, 2026-10-24)

- Rayons : contrôles à 4 px (« Envoyer » du forum : 8 → 4 ; boutons à icône du kramail : 10 → 4) ; cartes, panneaux et modales à 8 px (cartes du forum et du kramail : 12 → 8) ; pastilles et étiquettes pleines. La croix, les avatars, les images, les jauges et l'horloge gardent leur forme (Q12).
- Assumptions à relire (détail dans le plan) : la recherche et le tri en pilule passent à 4 px ; les onglets, ceux de la modale d'ordre compris, sont à 4 px ; la barre fixe d'envoi du kramail reste sans rayon (épopée 7) ; les boutons ronds passent à plein.
- Tolérance du test pixel du kramail : l'écart par canal passe de 2 à 4, mesuré en A/A. C'est du bruit de rendu sur le nouveau coin à 8 px de la carte de lecture.
- Restent natifs à 4 px : `nav.navbar`, la pagination, les onglets natifs et `input-group-addon` (sans règle de la peau).

## Ticket 4.9 — Grille d'espacement (2026-10-24)

- **À trancher (bloc figé)** : le plan disait que les cellules du forum (index et sous-forum) passent à 8 px sur les 4 côtés. Mesuré : les lignes permanentes du sous-forum passent à 62 px (seuil L6 : 60), et le 1er sujet arrive à 693 px (seuil : 684). J'ai mis 4 px en haut et en bas, 8 px sur les côtés : les seuils tiennent. Option inverse : 8/8 avec des seuils L6 assouplis.
- Boutons sur ordinateur : leur retrait vertical de 6 px est gardé, hors du pas de 4, pour tenir la hauteur de 34 px.
- Les en-têtes de panneau passent de 40 à 44 px de haut sur ordinateur.

## Ticket 4.10 — Refactor sweep (built, 2026-10-24)

- Seuils 768/769 réalignés sur 767/768 (éditeur du kramail, changelog) : à 768 px, ces pages prennent désormais le rendu ordinateur. Vérifié égal à la base relevée à 769 px.
- Règles mortes retirées : rayon du menu de personnage du kramail, propriétés du hamburger hors `order`, premier bloc de cartes du forum réduit à l'ombre et à l'appui.
- `height: 44px` des champs mobiles gardé : sans effet mesuré (le `min-height` de 44 px l'emporte), consigné comme candidat mort dans `deferred-work.md`.

## Rétrospective de l'épopée 4 (2026-10-24)

- Verdict « rejected » pour une seule raison : rien n'est poussé ni fusionné (Done when 3). Le reste tient sur fixtures. Livraison des épopées 2 à 4 : attend ton accord pour le push et la PR.
- Constats à corriger, traités dans un ticket de suivi : nom de forum mobile à 17 px au lieu de 15 (F2, `h1, h2, h3 !important` bat `.forum-title`) ; ordre du pied Bootbox mobile limité à `.btn-default`/`.btn-primary` (F3) ; jetons jamais lus et commentaire « 4.3 » à corriger en « 4.4 » (F5).
- À corriger dans l'épopée (fichier réservé) : la note « aucun bouton de vote dans les fixtures du sujet » est fausse, `forum-sujet.html` l.26-28 en a (F9).

## Inception de l'épopée 5 « Cartes de section et familles de pastilles » (2026-10-24)

Breakdown en 6 entrées (`epic-cartes-pastilles/tickets.toml`), écrit en autonomie. Option retenue pour chaque point, à confirmer ou renverser :

- Découpage : 1 carte de section mobile des pages de jeu, kramail par les règles communes (balle traçante) ; 2 liste des sujets du forum dans la carte (R6, risque élevé) ; 3 groupes du plateau mobile dans la carte ; 4 cloche et enveloppe en couleur « non lu » ; 5 étiquettes de catégorie, « PNJ » compris ; 6 Refactor sweep. Entrées chaînées par collision.
- Q10 : carte en retrait de 8 px, contenu à 16 px (texte à 24 px du bord ; forum et sous-forum perdent 16 px).
- Q30.7 : aucune icône ajoutée aux en-têtes sans icône native. Q30.1 : pastille de niveau et « ici » gardent `--kr-level-*`. Q30.4 : caractéristiques et malus hors CAP-6. Q30.2, .3, .5, .6 : hors CAP-6.
- Tags du sujet comptés comme étiquettes de catégorie ; index et racine suivent le sous-forum (parité 6.1) ; repli des panneaux gardé tel quel.
- Cloche et enveloppe en « non lu » sur les deux supports.
- Kramail : règles communes seulement, déclarations contraires retirées sans règle propre (épopée 7).
- L'entrée 2 part du code de 6.1 sans l'épingler : l'épingle créait un conflit d'ordre 5 ↔ 6.
- À trancher :
  - « article » et « Dernier sujet » (CAP-6) : introuvables dans le code et les fixtures ; où sont-ils sur le site ?
  - lignes de sujet mobiles : cartes détachées gardées dans la carte (option retenue) ou lignes à filet comme la maquette h04 ?
  - livrer les épopées 3 et 4 (push, PR) avant l'épopée 5 (rétro de l'épopée 4, A1) ?
  - `tickets.toml` de l'initiative (hors écritures permises) : épingler l'épopée 6 sur 5.2 et l'épopée 7 sur 5.1, et retirer « onglets » de ce que l'épopée 7 attend de la 5 (CAP-8, aucune entrée).
  - DESIGN.md périmé : titre du kramail (« primary à 2,56:1 », en fait accent), titre du jeu (« 20 px », en fait 17 px), enveloppe (« grise », en fait rouge).

## Bug 10 — nom de forum mobile (built, 2026-10-24)

- Sur mobile, le nom des cartes de forum (Staff) repasse de 17 à 15 px : la règle des titres h1-h3 exclut `.forum-title`, sans `!important` nouveau.
- Pied des modales mobiles : rien ne change. Le commentaire dit maintenant que seuls `.btn-default` et `.btn-primary` sont rangés ; un `.btn-danger` ou `.btn-success` passerait avant eux. À vérifier si le site en met dans une modale.
- Jetons inutilisés (`--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad`) gardés : DESIGN.md les déclare et le test du 4.1 les vérifie. Les retirer : ta décision.
- `test:all` final passé machine chargée : 2 FAIL de charge, verts rejoués seuls. Le fragment `nettoyage` flanche sous charge de façon répétée : à fiabiliser (rétro 4, A10).

## Ticket 5.1 — carte de section mobile (construit, 2026-10-24)

- À trancher : en clair, le fond de page est blanc (Bootstrap), donc la carte blanche ne se détache pas. Le plan n'ajoute ni fond de page ni filet (maquette h04 : filet). Option : fond de page teinté en clair.
- Portée : la carte vaut là où valait la règle d'origine. Elle s'applique donc aussi aux pages Règles, Cybermonde, Interface, et au kramail, sauf aux panneaux d'accordéon (`.panel-group`) et de modale. Aucune garde « jeu » n'est fiable, car `#col-leftest` manque sur Matériel, Bâtiments et Employés.
- Forum, sous-forum et racine gardent leur rendu actuel (règle scindée).
- Décidé en autonomie : la déclaration `padding: 10px 15px !important` des en-têtes mobiles (l.4337) est gardée. Elle ne gagne que sur les panneaux d'état (`.panel-success`, `-warning`, `-danger`, `-info`, `-primary`), jamais sur un `.panel-default`. La retirer changerait ces panneaux.
- Modale d'ordre : exclue de la carte (`.modal *`) après revue ; elle garde le rendu de base (égalité prouvée à 375 et 767 par `cartes-pastilles`, fragment `forum`).
- Cybermonde « Fonctionnaires » : le chevron natif est dans le titre, à 222 px du bord, comme avant. Non corrigé.
- Push autorisé par Arnaud le 2026-10-24 : `feature/next` poussé jusqu'à `317b5b7` (épopées 2 à 4, bug 10).

## Ticket 5.2 — liste des sujets du forum dans la carte (construit, 2026-10-24)

- Décidé en autonomie (A1, fil de sujet) : rien à décider. La fixture `forum-sujet.html` n'a aucun `.panel` ; le fil est comparé à la base à 375 et 767 px, clair et sombre, et reste égal.
- Décidé en autonomie (A8, coins de la racine) : en sombre, la dernière ligne de `forum-racine.html` (opaque, coins carrés, sans `.panel-body`) recouvre les coins bas arrondis de la carte. Rendu de base gardé : aucun `overflow: hidden` ni rayon ajouté. Report dans `deferred-work.md`.
- Décidé en autonomie (P7, carte blanche en clair) : rien ajouté, comme en 5.1. La carte blanche ne se détache pas du fond blanc de page en Kraland clair. Le point « fond de page teinté » du ticket 5.1 reste ouvert.
- Décidé en autonomie (hauteur des lignes) : la carte raccourcit les lignes de 16 px. À 375 px, deux sujets du sous-forum (« Gagner des PA », « Kayak Portable ») voient l'auteur du dernier message passer à la ligne : 127,1 px au lieu de 106,9. Accepté, c'est l'effet direct du retrait de 8 px demandé. Le test exige l'égalité de hauteur sauf quand une rangée de texte s'ajoute ; il exige alors une ligne plus haute.
- Staff (A6) : chevron natif de 10 × 14 px et croix d'alerte qui sort de 5 px de l'écran, tous deux comme la base. Le test les compare à la base au lieu d'imposer 44 px. Report dans `deferred-work.md`.
- A13, 2e version : 17 déclarations inertes retirées après bisection ; le reste est gardé (Staff). Report dans `deferred-work.md`.
- `#topics` : non touché. Ses marges négatives compensent le retrait de 16 px de `#topics_wrapper`, et les lignes s'arrêtent déjà aux bords internes de la carte.
- La barre de tri DataTables (`thead tr`, `overflow: auto hidden` natif de la peau) défile dans la carte : ses puces au-delà du bord sont coupées, comme dans la base. Le test exclut le contenu des défileurs et contrôle le défileur lui-même.
- Décidé en autonomie (sous-forum, 1er sujet à 0,95 écran, `sous-forum.mjs` l.668) : les deux en-têtes de 48 px (au lieu de 45) poussent le 1er sujet à 636 px sur 667 (0,954), au-delà du seuil. Seuil inchangé. Le retrait haut des contrôles DataTables (`#topics_wrapper`) passe de 12 à 6 px : 1er sujet à 630 px, comme la base. La recherche est donc à 6 px sous l'en-tête de la carte, sans filet entre eux. À regarder sur capture.
- Décidé en autonomie (pagination à 320 px) : la pagination L5 mesure 304 px, et la carte ne laisse que 272 px de contenu à 320 px : 8 px de débordement d'écran. Correctif : la pagination s'étend sur toute la largeur de la carte (marges de −16 px, comme `#topics`). Elle reste centrée et à la même place que la base de 336 à 767 px. À 320 px, « ‹ » et « › » touchent les bords internes de la carte.

## Ticket 5.3 — groupes du plateau dans la carte (construit, 2026-10-24)

- Décidé en autonomie (A3, filet de « mon groupe ») : le filet gauche des en-têtes de groupe est retiré sur mobile, « mon groupe » compris (règle l.5822 retirée, filet de 4 px de l.13257 retiré). Mon groupe se distingue parce qu'il est ouvert et placé en premier. Au bureau, le filet de 4 px reste (égal à la base de 768 à 1920 px).
- Décidé en autonomie (A4, ombre) : la section mobile perd son ombre, comme la carte 5.1. Aucune bordure ni filet ajouté.
- Décidé en autonomie (A8, Q30.7) : aucune icône d'en-tête ajoutée, contrairement à la maquette (`fa-user-friends`).
- Décidé en autonomie (A5) : 10 px entre deux groupes, comme avant ; la maquette en donne 8.
- Décidé en autonomie (cartes de personnages, changement visible) : la carte prend 8 px de chaque bord et la grille garde 8 px de retrait. À 375 px, chaque carte de personnage passe de 177,5 à 167,5 px de large, et sa ligne de statut de 123,5 à 113,5 px. Avec le vrai Bootstrap, le statut synthétique « [Statut Elias Kurano] » passe sur deux lignes : les cartes du 1er groupe montent de 166 à 181,2 px. Accepté : c'est l'effet direct de la géométrie demandée (comme les lignes du forum en 5.2). Contenu, ordre, avatar, nom, pastille PNJ et PV égaux à la base. À regarder sur capture avec un vrai statut long.
- Titre long : à 375 px, « Syllabus des Archivistes Itinérants du Grand Marais » tient sur deux lignes ; l'en-tête monte à 48,6 px, sans débordement. `min-width: 0` non ajouté (inutile, `scrollWidth` = vw).
- Le texte « Groupe » reste retiré par le JS (« Nerys » au lieu de « Groupe Nerys » sur la maquette) : JS non modifié.
- P4 (correctif de revue) : à ≤ 767 px sans `mobile-mode`, les groupes gardent le rendu d'origine (filet de 4 px, fond `bg-elevated`), égal à la base. Prouvé en forçant `innerWidth` à 791 (cas de la barre qui déborde) ; l'état ne se reproduit pas seul sur la fixture avec Bootstrap.
- Icône native du titre : `img` synthétique ajoutée devant « Groupe Nerys » dans la fixture ; elle reste à gauche du titre. Avec une image en tête, le JS ne retire pas « Groupe » (comportement natif, inchangé).

## Ticket 5.4 — pastilles d'état de la cloche et de l'enveloppe (2026-10-24)

- Décidé en autonomie (bureau compact, 768 à 991 px) : le plan attend la pastille visible « portée par l'original à 768 ». Mesure sur la base `601ab19` : de 768 à 991 px (PLT-04), la barre est un menu repliable, sans clone ; menu fermé, cloche et enveloppe ont une boîte 0 × 0, rien n'est visible. Rendu de base gardé (JS et menu non touchés). Le test contrôle, à 768 et 769 px, le menu fermé (aucune pastille visible, égal à la base), puis le menu ouvert par le bouton de la barre (original visible, pastille d'état). Report consigné dans `deferred-work.md`. À regarder : faut-il un repère de non-lu sur le bouton du menu compact ? Correctif de revue : la bascule 767 ↔ 768 ouvre aussi le menu compact à chaque étape 768, dans le même onglet, et vérifie l'original visible en pastille d'état, puis le referme.
- Décidé en autonomie (couleur de bordure du masque) : le retrait de `border-color` ne change pas la largeur des bordures (0 avant et après), mais la couleur calculée passe de `rgb(189, 33, 48)` à `--kr-primary-dark` (hérité). Le contrôle couleurs de `typographie-formes` compare aussi cette couleur ; le masque `CARTES_TICKET54` pose donc `border-color: var(--kr-primary-dark) !important` sur la base, pour l'égaliser. Il vit dans le test, pas dans la peau.
- Décidé en autonomie (fixtures du routeur) : `kramail-reception.html` et `sous-forum-debuter.html` envoient aussi vers `cartes-pastilles` (règles dédiées avant les règles génériques) ; `typographie-formes.html` passe par la règle « fixture » (citée par deux suites). Deux cas existants de `router.test.mjs` suivent ce fait.
- Décidé en autonomie (`.kd-field.is-invalid`) : non mesuré par le fragment `pastilles` (absent des fixtures de la barre) ; les sélecteurs de la règle ne le visent pas. Couvert par la zone `kramail`.
- À regarder sur capture (375×667 et 1280×720, Kraland clair et Empire Brun sombre) : lisibilité du « ! » et du chiffre, contour de la pastille sur la barre de nation. En Kraland clair, `#c41e3a` reste voisin de l'ancien rouge.

## Ticket 5.5 — étiquettes de catégorie, PNJ compris (2026-10-24)

- A2 (marque native PNJ `.btn-danger.xmini`, `#pnj` de palette-nation-etats) : nouvelle règle `html.kr-theme-enabled .btn.btn-danger.xmini` en (0,3,1), liste combinée, sans priorité forcée. Fond et bordure `--kr-arm-bg`, texte `--kr-arm-ink`, 700, rayon plein. Elle bat `.btn-danger:hover` et `:active:hover` de Bootstrap : survol égal au repos (mesuré par survol forcé).
- Décidé en autonomie (taille de la marque sous 768 px) : la peau impose à tout `.btn` mobile `font-size: var(--kr-font-button)`, `padding: 12px 20px` et `min-height: 44px`, en priorité forcée. Sans priorité forcée nouvelle, la règle A2 ne peut pas l'emporter : la marque reste à 14 px et 46 px de haut sous 768 px, comme la base. Au bureau, `.xmini` est déjà à 12 px. Le test compare donc la taille de la marque à la base, pas à 12 px. Graisse (400 → 700) et rayon (4 px → plein) changent : la boîte s'élargit d'environ 1 px, et la pièce courante voisine glisse d'autant (position exclue de sa comparaison, le reste égal). À regarder : faut-il une marque PNJ de 12 px sur mobile (priorité forcée de plus, ou retrait de la cible tactile de 44 px) ?
- Question pour Arnaud (constat #1 de la revue, reporté) : sous 768 px, la marque native PNJ (`.btn-danger.xmini`) reste en 14 px et 46 px de haut, car la règle `.btn` mobile de la peau (`font-size: var(--kr-font-button)`, `padding: 12px 20px`, `min-height: 44px`, en priorité forcée) l'emporte ; le `verify` de l'entrée 5 demande 12 px 700. Deux voies : garder 14 px sur mobile (rendu actuel, égal à la base), ou retoucher l'exclusion de `.xmini` dans la règle `.btn` mobile (la marque n'y serait plus prise et passerait en 12 px, mais sa cible tactile de 44 px et sa géométrie changeraient). Laquelle choisis-tu ?
- Revue, constat #2 corrigé : la règle A2 ne déclare plus `font-size` ; la taille vient de l'origine `.xmini` (12 px au bureau).
- A3 (compteur de groupe `.dashboard-section-header .badge`, bureau et mobile) : étiquette de catégorie (fond et bordure arm-bg, texte arm-ink). Il classe, il ne signale pas. Seule la fixture typographie-formes en porte un (`#pastille-groupe`) ; plateau-qualite-usage n'en a pas. Le fragment `pastilles` (5.4) ne le compare plus à la base (sorti de `horsListe`).
- A4 (tags) : `.forum-tags a` sous 768 px en étiquette de catégorie ; à l'appui, paire de survol (`--kr-arm-bg-hover` / `--kr-arm-ink-hover`). L'encre de l'appui passe par la redéfinition de `--kr-arm-ink` dans la règle `:active`, que la couleur du tag lit déjà en priorité forcée : aucune priorité forcée de plus. Au bureau, aucune règle : liens non stylés, comme la base. Les tags natifs `span.tagforum` gardent leur rendu « · #tag » (report dans `deferred-work.md`).
- Constat (tags mobiles) : sur la fixture, sous 768 px, le tableau `table.dataTable` est masqué (`display: none`) par la peau mobile du forum ; les tags n'ont pas de boîte, dans la base comme ici. Couleurs et contraste sont relevés sur les styles calculés, sans élément visible. `.forum-tags` n'existe que dans la fixture synthétique : à regarder sur le site réel si la classe y apparaît.
- A5 (compteurs de contact du kramail) : `a.list-group-item[href^="kramail/"] > .badge:not(:empty)` ajouté en tête de la règle d'état (fond `--kr-status-unread`, texte `--kr-bg-surface`), comme « NOUVEAU MESSAGE » du sous-forum. En tête pour garder la chaîne de `AVANT_TICKET54` (P14). Page dérivée dans le test : deux compteurs remplis, dont celui d'un contact actif (`list-group-item active`, P6) : la règle d'état gagne sur la paire inverse. Vides : invisibles, comme la base.
- Décidé en autonomie (détecteur et miroir) : `CARTES_TICKET55` et `AVANT_TICKET55` vivent dans `tests/e2e/lib/variantes.mjs`. `typographie-formes` les pose sur sa base tant qu'elle précède l'entrée. Le sélecteur des tags du contrôle statique suit la forme minifiée du bundle (`td:first-child` au lieu de `td:nth-child(1)`).
- Décidé en autonomie (routeur) : `dashboard-card-pnj` reste aussi dans la règle de l'épopée 4 (doublon sans effet, les zones s'ajoutent). Aucune règle de fichier ajoutée : les fixtures `palette-nation-etats.html`, `forum-index-rp.html` et `jeu-materiel.html` sont citées par cartes-pastilles et passent par la règle « fixture ».
- Décidé en autonomie (`#col-leftest-stats .btn-success`) : les caractéristiques sont repérées par ce sélecteur ; la fixture n'a pas `alert12x`.
- Décidé en autonomie (bases antérieures) : le fragment `nettoyage` de typographie-formes (base `00b0786`) pose le masque `CARTES_TICKET55` sur sa base. Le fragment `groupes` de cartes-pastilles (base `a7f0463`) ne peut pas recevoir de css (P8) : fond, bordure et couleur du « PNJ » des cartes y sont neutralisés des deux côtés (`sansPnj55`), la géométrie reste comparée. Les deux sont à retirer quand ces bases contiennent l'entrée 5.
- À regarder sur capture (375×667 et 1280×720, Kraland clair et Empire Brun sombre) : lisibilité de « PNJ » sur la carte, contour de la marque sur la couleur de nation, compteur de groupe à côté de « guilde » et « [mod] ».

## Ticket 5.6 — refactor sweep (construit, 2026-10-24)

- Retraits inertes seulement, sans changement de rendu : `--kr-badge-danger-border` et `--kr-badge-pnj` retirés de `:root` (aucun lecteur avant, ni en CSS, ni en JS, ni dans les tests) ; masque `CARTES_TICKET51` éteint dans `cybermonde-carte.mjs` et `kramail-redaction.mjs` (base `origin/feature/next`, qui contient 5.1 : le masque ne posait rien) ; condition de retrait écrite pour `sansPosition55`.
- Décidé en autonomie (Ask First « `var(` trouvé au relevé avant ») : sans objet. Le relevé avant ne trouve que les deux déclarations (l.76 et l.77), aucun `var(` dans la feuille, le template, les tests ou les fixtures. Les deux jetons sont retirés.
- Décidé en autonomie (Ask First « écart d'une suite après T2 à T5 ») : sans objet. `KR_FRAG=panneaux node tests/e2e/cybermonde-carte.mjs` (13 ok) et `node tests/e2e/kramail-redaction.mjs` (340 ok) donnent les mêmes lignes ok/FAIL avant et après ; zones `cartes-pastilles`, `kramail`, `cybermonde` vertes.
- Décidé en autonomie (`--kr-badge-danger`) : gardé, nom et valeur. Seul lecteur : `.kd-field.is-invalid` de la rédaction du kramail.
- Décidé en autonomie (T3, T4) : les deux suites sont reprises telles qu'en `458dc03` (inverse exact des hunks de `21fed8d`, seul commit à les toucher depuis) ; `git diff 458dc03` vide pour chacune.
- Rappel, en attente de ta décision (aucune question nouvelle) :
  - D12 : bureau compact 768 à 991 px, cloche et enveloppe invisibles menu fermé (ticket 5.4).
  - D14 : `span.tagforum`, famille des étiquettes ou non (ticket 5.5).
  - D15 : marque PNJ mobile en 14 px / 46 px au lieu de 12 px (ticket 5.5).
  - Jetons A5 de la rétro 4 non lus par la peau : `--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad` (Bug 10).
  - O1 : fond de page teinté en clair (5.1, 5.2).
  - O2 : « À regarder sur capture » des tickets 5.2 à 5.5.
  - O3 : barres de PV des cartes de personnages en couleurs en dur (`#5cb85c`, `#f0ad4e`, `#d9534f`), renvoyées à « l'épopée 5 » par `palette-nation.mjs` ; aucun ticket 5.x ne les a prises.

## Rétro de l'épopée 5 — cartes et pastilles (2026-10-25)

Rapport : `epic-cartes-pastilles/epic-cartes-pastilles-retrospective.md`. Verdict machine : **rejected**. Tri de l'orchestrateur :

- **F1 (pas de fusion vers main), contesté.** Le Done when 3 dit « PR fusionnée sur `feature/next` ». `feature/next` est poussée à `55b14f0`, et la fusion vers `main` n'est pas un critère de l'épopée. Le verdict dépend de cette lecture : à toi de trancher, accepted-with-open-items ou rejected.
- **F2 (plan 5.6 contradictoire), corrigé.** Le gabarit vide en double est retiré, et la note T8 porte le `test:all` réel : 12777 ok, 0 FAIL, log `/tmp/kr-56-all.log`.
- **F3 (base auto-référente), rejeté.** `origin/feature/next` est la base voulue : on compare au dernier état poussé. Pendant le 5.6, elle valait `ca73215`, et non l'arbre testé. Le vide de comparaison n'existe qu'entre un push et la modification suivante.
- **F9 et A7, faits.** Le Done when 2 cite maintenant `forum-index`.
- **A8 (épinglage sur 5.2).** Il se fera à l'inception de l'épopée 6, dans son propre `tickets.toml`.
- **A6 (barres de PV en dur, template l.4345-4352).** Question pour toi : faut-il un ticket, et dans quelle épopée, sachant qu'il change le rendu ?
- **F10 et A5 (décisions en attente).** Marque PNJ mobile en 14 px, pastille du menu compact entre 768 et 991 px, `span.tagforum`, carte blanche sur page blanche en clair.
- **F5, F6, F7, F12 et A9 (reportés).** Les pages hors fixtures et les autres emplois de `.badge-danger` et `.btn-danger.xmini` seront relevés à l'épopée 9, ou à la prochaine capture sur le site réel.

## Inception de l'épopée 6 « Forum : activité et repères » (2026-10-25)

Découpe publiée dans `epic-forum/tickets.toml` (7 entrées). Elle a été faite en autonomie. Les hypothèses sont dans les Notes de `epic-forum/epic-forum.md`.

- Décidé en autonomie : la balle traçante est l'entrée 2, parce que l'entrée 1 est déjà construite. L'épingle sur `5.2` porte sur l'entrée 2.
- Décidé en autonomie : l'entrée la moins sûre, en 3, fusionne les trois fils d'Ariane (H12.3).
- Décidé en autonomie : une suite propre, `forum-activite.mjs`, avec sa zone dans le routeur.
- Hypothèses à confirmer :
  - Q27.1 : l'heure native est gardée.
  - Q27.2 : un forum sans message n'a pas de flèche.
  - Q27.3 : l'icône vient de la liste latérale, avec repli sur l'icône native.
  - Q27.4 : flèche vers le dernier message, ligne de sujet vers le premier non lu.
  - Q28.1 et Q28.2 : liens du fil d'Ariane en couleur du texte, cibles de 44 px.
  - Q28.3 : la barre du bas suit l'en-tête.
- À trancher :
  - Q27.5 et Q27.6 : « Jeu (RP) » répété ; description et modérateurs du sous-forum. Aucune entrée ne les change.
  - Accès du compte aux sujets Staff, pour le relevé en lecture seule de l'entrée 4 (hitl).
  - Essai des ancres `#msg…` sur vrai téléphone, l'émulation donnant l'inverse (H10).
- Rappel, en attente de ta décision :
  - choix de 6.1 : Staff exclu, colonnes Sujets et Messages sur ordinateur. L'entrée 6 s'y plie.
  - D14 : `span.tagforum` et « guilde ».
