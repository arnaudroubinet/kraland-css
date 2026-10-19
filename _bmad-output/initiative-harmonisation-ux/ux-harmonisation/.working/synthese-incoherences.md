# Synthèse des incohérences (inventaire du 2026-10-19)

Périmètre relevé : 21 pages (jeu : plateau, matériel, personnage, bâtiments, employés ; forum : index RP et HRP, sous-forum, sujet ; kramail : réception, lecture, rédaction ; secondaires : accueil, événements, citoyens, règles, membres, interface, aide, contacts, statistiques), modales d'ordre (Dormir, Pouvoir) et carte. Ordinateur 1280×720 et mobile 375×667, variantes `empire-brun-dark` (sombre) et `kraland` (claire). Notifications (`/report`) pas encore visitées.

Les captures et relevés bruts restent hors du dépôt. Les valeurs ci-dessous sont des styles calculés (`getComputedStyle`), ordinateur et variante sombre sauf mention.

## 1. Typographie et proportions

- Mobile, pages de jeu : la part du texte visible à 12 px ou moins atteint 87 % sur le plateau, 52 % sur le matériel (10 et 11 px), 41 % à 11 px sur le personnage, 44 % sur les bâtiments, 45 % sur les employés. Le forum et le kramail lisent à 15–16 px (sujet : 96 % à 16 px).
- Mobile, matériel : titre de section ≈ 20–22 px, nom d'objet ≈ 10–11 px, soit un rapport de 2 pour 1 inversé par rapport à l'importance.
- Ordinateur, plateau : 33 % du texte à 11 px. Cartes de personnages à deux par ligne dans 360 px : avatar ≈ 70 px, nom à 11 px tronqué.

## 2. Couleurs

- Variante claire : `.btn-primary` reste bleu Bootstrap (#337ab7, #286090) sur les étiquettes et champs-boutons : 21 éléments sur Événements, boutons `mini` du personnage. La variante sombre les reprend.
- Couleurs sémantiques Bootstrap brutes dans les deux variantes : barres PV/PM vertes et PP orange (ordinateur), pastille « PNJ » rouge #c9302c, votes verts, boutons de contacts (rouge, orange, cyan, vert), « Pas un contact » orange, encadré jaune « Engagés aujourd'hui », bouton cyan « Voir l'historique » du userscript.
- Variantes claires d'autres nations : seules la primaire et la couleur d'accent changent, le reste reste rouge Kraland. En `paradigme-vert`, les boutons Dormir/Prier, « Réception » du kramail et la page courante de la pagination d'Événements restent rouges (#700b09, #f9d9de).
- Variante sombre : le titre de section du kramail mobile utilise la couleur primaire comme texte, contraste 2,56:1.
- Modale d'ordre : action principale brune sur ordinateur, verte sur mobile ; encadré « Aide » bleu très clair, texte blanc illisible.

## 3. Panneaux et en-têtes

- Ordinateur : en-têtes de panneau homogènes partout (14 px, 10/15 px de marge interne, 39 px de haut).
- Mobile : trois styles d'en-tête de section. Jeu : carte arrondie détachée du contenu, 54 px. Forum : bande pleine largeur avec icône, 43–45 px. Kramail : carte arrondie, titre coloré, 50 px.
- Titre de page : grand titre de 36 px sur forum, kramail, interface, contacts, statistiques. Absent sur les pages de jeu, événements, règles, accueil, membres, aide, où l'en-tête du panneau latéral joue ce rôle.
- Panneau latéral du jeu : titré « nom du personnage » (plateau, matériel, bâtiments), « Personnage » (personnage) ou « Employés » (employés).

## 4. Boutons, listes, étiquettes, tableaux

- `.btn-default` : 14 px sur 11 pages, 12 px sur 6 ; marge interne 6/12 ou 5/5 ; rayon 3, 4 ou 5 px.
- `.btn-primary` : 12, 14 ou 15 px ; hauteur 30, 34 ou 47 px.
- `.list-group-item` : 14 px sur 15 pages, 12 px sur 5, 13 px sur 1.
- Étiquettes : 9, 10,5 ou 15 px. Pastilles d'état du forum (« NON LU », « NOUVEAU MESSAGE » : ambre, capitales) à côté d'étiquettes de catégorie (« article », « guilde », « mod » : brun, minuscules) et de la pastille « PNJ » (rouge Bootstrap).
- En-têtes de tableau : marge interne 8/8 ou 10/18 px.
- Modale d'ordre : boutons « Cancel » / « OK » en anglais ; « OK » fait 46×34 px sur ordinateur ; sur mobile, « Cancel » est au-dessus de « OK ». Coût et durée en ligne de texte sur ordinateur, en pastilles pastel sur mobile.

## 5. Comportement mobile

- Défaut : sur le personnage, les lignes de « Citoyenneté » reçoivent « → … sujets · », le style mobile des listes de forum (`kraland-theme.css:7642-7670`, règles gardées par `body.mobile-mode` seul ; le doublon de `:8327-8352` est gardé par `body.page-forum`).
- Défaut : le mini-profil mobile affiche « Personnage » au lieu du nom du personnage (plateau, matériel, personnage).
- Défaut : sur les règles, le bouton « ok » de la recherche devient une barre fixe de 56 px en bas de l'écran, qui masque le texte. C'est le style du bouton « Envoyer » de la rédaction, posé par une section non gardée.
- Cibles tactiles sous 44 px : plateau 58 sur 181 (icônes 26–28 px des cartes de personnages), contacts 42 sur 62, rédaction kramail 22 sur 31 (barre BBCode 40×40 px), événements 16 sur 85.
- Gouttières : la ligne d'informations d'un sujet et le titre de la carte touchent le bord gauche (x = 0) ; la carte défile horizontalement (1017 px de large).

## Causes repérées dans le code

- Le mode clair n'a pas de règle globale pour les panneaux, `.btn-default`, les tableaux ni les onglets : ils gardent le rendu Bootstrap, sauf règle de page. Le mode sombre, lui, les reprend tous.
- Aucun jeton de typographie (32 tailles différentes) ; 3 % des espacements passent par un jeton ; 36 rayons différents.
- Plusieurs sections propres à une page ne sont pas gardées et s'appliquent à tout le site en mobile (forum RP v1, liste DataTables, nouveau sujet…).
- La modale d'ordre garde du bleu Bootstrap figé (`#428bca`, `#3071a9`).
- Côté JS : nom « Personnage » écrit en dur ; icônes des sections de jeu différentes entre ordinateur et mobile ; trois fils d'Ariane, deux formes de « Nouveau sujet », deux formes de « Autres actions ».

Détails : rapports d'analyse hors dépôt (CSS et JS), cités par numéro de ligne dans les hypothèses.

## Ordre proposé pour les hypothèses

1. Défauts du personnage sur mobile (fuite du style du forum, nom du mini-profil, titre du panneau latéral).
2. Modale d'ordre (libellés, action principale, coût et durée, aide).
3. Taille du texte des pages de jeu sur mobile, et proportions titre/contenu.
4. Palette : `.btn-primary` en variante claire, couleurs sémantiques accordées au thème, primaire employée comme texte en sombre.
5. En-têtes de section mobiles unifiés.
6. Deux tailles de boutons, attribuées par rôle.
7. Cartes de personnages du plateau (proportion avatar/nom).
8. Pastilles d'état et étiquettes de catégorie.
9. Cibles tactiles mobiles.
10. Gouttières et alignements.
11. Notifications, après la visite unique de `/report`.
