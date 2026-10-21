---
id: SPEC-harmonisation
companions:
  - lots-de-livraison.md
  - ../ux-harmonisation/DESIGN.md
  - ../ux-harmonisation/EXPERIENCE.md
  - ../ux-harmonisation/notes-implementation.md
  - ../../../AGENTS.md
sources:
  - sources/2026-10-19-harmonisation-ux-feuille-de-route.md
  - sources/2026-10-19-harmonisation-ux-lot1-identite-defauts.md
---

> **Contrat de référence.** Cette spec et les fichiers de `companions:` forment le contrat complet, vérifié pour la préservation, de ce qu'il faut construire, tester et valider. Les sources du frontmatter servent à la traçabilité.

# Harmonisation UX de la surcharge Kraland

## Why

La surcharge s'est construite page par page : un même élément change d'aspect, de taille, de couleur ou de place d'une page à l'autre, des styles débordent d'une page sur l'autre, et des textes sont illisibles dans certaines variantes. Arnaud joue Nerys sur ordinateur et sur téléphone ; il veut une surcharge cohérente au service de la boucle de jeu (plateau, ordres, déplacement, personnage, forum, kramail, notifications) dans les 16 variantes. Projet de loisir autour d'un jeu parodique : ton léger.

## Capabilities

- **CAP-1** Pages sans décor emprunté (H1.1, H1.2, accord du 2026-10-16)
  - **intent:** Hors des pages qu'ils servent, le joueur ne voit ni le décor des listes du forum ni la barre fixe d'envoi.
  - **success:** Sur mobile, Personnage et Cybermonde (`/map`, `/map/…`) montrent chaque icône et chaque valeur native une seule fois, sans « sujets », « messages », « → » ni bloc de compteurs ; aucun tableau hors forum ne perd de colonne ; le « ok » des Règles reste à côté de son champ ; les listes et la racine du forum, et la rédaction du kramail, gardent leur rendu jusqu'à CAP-6 et CAP-8.
- **CAP-2** Identité du personnage et section en cours (H1.3 à H1.6, R1)
  - **intent:** Sur toutes les pages de jeu, le joueur voit le nom du personnage qu'il joue et la section où il se trouve, reconnue à la même icône sur tous les écrans.
  - **success:** Le mini-profil mobile et le titre du panneau latéral sur ordinateur affichent le nom lu sur le plateau, le matériel ou les bâtiments, mémorisé pour Personnage et Employés ; un nom vide n'est jamais mémorisé, un autre personnage remplace la mémoire, un stockage indisponible laisse le titre natif sans erreur ; la section en cours (sous-chemins du plateau compris) est en demi-gras avec un filet primaire de 3 px, fond inchangé ; Agir `fa-bolt`, Matériel `fa-suitcase`, Personnage `fa-user`, Bâtiments `fa-home`, Employés `fa-users`, sur les deux supports.
- **CAP-3** Modale d'ordre lisible et sûre (H2.1 à H2.7, R2)
  - **intent:** Avant de valider un ordre, sur ordinateur comme sur mobile, le joueur lit l'ordre choisi, son coût, sa durée, ses chances et tout blocage ou avertissement.
  - **success:** Boutons « Annuler » et « Valider » ; blocages et avertissements en tête, fixés pendant le défilement, jamais repliés, seule l'aide se repliant derrière « ? Aide », lisible dans toutes les variantes ; coût, durée et potentiel en pastilles juste au-dessus des boutons ; « Valider » en couleur de nation sur mobile ; croix de fermeture ≥ 3:1 et 44×44 px ; onglet actif ≥ 4,5:1 sans halo bleu ; le tout tient quand le joueur change d'ordre ou que le contenu arrive plus tard.
- **CAP-4** Couleurs de nation et contrastes (H5.1 à H5.7, Q1, Q2, R3, R7)
  - **intent:** Dans chacune des 16 variantes, les couleurs viennent de la nation, une couleur vive signale toujours un état et tout texte coloré se lit.
  - **success:** Ni bleu Bootstrap ni rouge Kraland résiduel hors de la variante Kraland ; le clair est thémé comme le sombre ; texte coloré et texte posé sur la couleur de nation ≥ 4,5:1 dans les 16 variantes ; la primaire ne colore jamais de texte en sombre ; « non lu » d'une seule couleur, rouge réservé aux blocages ; jauges PV, PM et PP de même couleur sur les deux supports ; un seul anneau de focus ; liens en accent, soulignés au survol.
- **CAP-5** Même rôle, même taille, même forme (H3.1, H3.2, H6.1 à H6.3, H8.2, H11.1, H11.2)
  - **intent:** Un même rôle a la même taille de texte, le même bouton, le même rayon et le même espacement sur toutes les pages, ordinateur et mobile.
  - **success:** Titres de section 17 px, noms et valeurs 15 px, détails 13 px, texte courant 14 px sur ordinateur, rien sous 12 px sur mobile ; boutons 14 px (34 px de haut sur ordinateur, ≥ 44 px sur mobile), compacts en 12 px pour les votes et la pagination seulement ; rayons 4 px, 8 px et plein ; espacements de 4 à 32 px au pas de 4 ; étiquettes et pastilles en 12 px gras ; ligne d'objet mobile du Matériel : image, nom, charge.
- **CAP-6** Cartes de section et familles de pastilles (H4.1, R6, H8.1, R3)
  - **intent:** Chaque section mobile se présente dans la même carte, et chaque pastille dit par sa famille si elle signale un état ou une catégorie.
  - **success:** Jeu, forum, sous-forum (liste des sujets comprise) et kramail sur mobile : en-tête de 48 px dans la carte, titre 17 px gras couleur du texte ; pastilles d'état aux couleurs d'état, étiquettes de catégorie (article, guilde, mod, PNJ, Dernier sujet) en couleur de nation ; cloche et enveloppe en couleur « non lu ».
- **CAP-7** Forum : activité et repères (refonte de l'index H12.1, H12.2 à H12.4)
  - **intent:** Le joueur voit où les forums bougent, ouvre le dernier message en un geste, et chaque niveau du forum se présente de la même façon.
  - **success:** Index RP, HRP, Communauté et Débats, sur les deux supports : une ligne par forum dans l'ordre du jeu (nom, dernier message avec auteur et heure, flèche vers ce message, « N sujets · N messages »), sans description ni modérateurs, ligne entière cliquable ; la flèche et « premier non lu » mènent au message aussi sur mobile ; un seul bouton « ••• », kramail compris ; fil d'Ariane « Catégorie › Forum › Sujet » au sous-forum ; en-tête de sujet mobile aussi dans Communauté, Débats et Staff.
- **CAP-8** Kramail mobile (H13.1, R4)
  - **intent:** Sur mobile, le joueur sait dans quel dossier du kramail il est, et le bouton d'envoi ne couvre jamais sa saisie.
  - **success:** Réception, Envoi et Corbeille en onglets libellés, actif souligné ; Nouveau message, Contacts et « ••• » en boutons de 44 px ; « Envoyer » dans le flux sous le champ (48 px, couleur de nation), au forum comme au kramail ; plus aucune barre d'envoi fixe.
- **CAP-9** Notifications (H14.1 à H14.3, R5)
  - **intent:** Le joueur lit son rapport sans effort et en voit davantage d'un coup.
  - **success:** Sur ordinateur, la cloche ouvre un popup de 900×800 px en rendu ordinateur (texte 14 px, dates 13 px) sans charger `/report` à l'avance ; sur mobile, date au-dessus du texte, texte 15 px sur toute la largeur, filet non lu à gauche ; le sélecteur de personnage commence à 16 px du haut.
- **CAP-10** Plateau et confort mobile (H7.1, H9.1, H10.1)
  - **intent:** Le joueur voit le visage et le nom entier des personnages présents, touche la bonne cible du premier coup et ne lit aucun texte collé au bord.
  - **success:** Sur ordinateur, avatar de 70 px et nom sous l'avatar, en deux lignes au plus, quand la carte est étroite (≈ 1100 à 1500 px), sans changement au-delà ; sur mobile, toute cible hors texte courant fait au moins 44×44 px (48 px pour la croix) ou la ligne entière est touchable ; marge latérale de 16 px sur toutes les pages.

## Constraints

- Le code du lot 1 sur `feature/next` (`948d93f..5bf2984`) est la base des lots suivants ; pour H1.1, sa garde `:where(.page-forum, .page-forum-racine)` est retenue, et non la classe `kr-no-forum-tables` du ticket 1 de `bmad/ux-lot8` (décision d'Arnaud, 2026-10-20).
- P1 (tranché le 2026-10-21) : chaque épopée retire ou réécrit les règles anciennes du domaine qu'elle reprend et garde par page, en `:where(html.kr-page-x)`, ce qu'elle conserve (option 4 de la note d'options de cascade).
- P2 : les vérifications sur un vrai téléphone (Q17), avec un protocole fourni à Arnaud, précèdent les parties mobiles de CAP-3 et CAP-8.
- Ordinateur vérifié à 1280, 1440 et 1920 px, mobile à 375×667, sur au moins deux variantes contrastées ; toute règle de couleur est vérifiée dans les 16 variantes.
- Aucun nouveau composant sans validation d'Arnaud ; corriger l'existant avant d'ajouter.
- DESIGN.md et EXPERIENCE.md priment sur les maquettes de `mockups/`.

## Non-goals

- Lecteurs d'écran, ARIA, synthèse vocale, navigation non visuelle.
- Signal lu/non lu par forum sur l'index, lecture des forums en arrière-plan, tri par activité.
- Barre d'onglets sur ordinateur ; onglet plein écran ou popup 600×600 en rendu mobile pour les notifications.
- États propres au site (chargement, erreur de formulaire, liste vide, accès refusé, hors ligne).
- Tickets 2 à 8 de `bmad/ux-lot8` (bugs de l'audit P2) : backlog séparé.

## Success signal

- Arnaud joue les quatre parcours clés d'EXPERIENCE.md en Kraland clair et en Empire Brun sombre sans croiser d'élément qui change d'aspect ou de place d'une page à l'autre, et `npm run test:all` est vert avec au moins un test par décision livrée.

## Assumptions

- Q3 à Q33 et les valeurs `[ASSUMPTION]` de DESIGN.md et EXPERIENCE.md, non bloquantes, sont soumises à Arnaud au plan du lot qui les touche, avant d'être figées.
- H14.1 relève de CAP-9 seulement, bien que la feuille de route la cite aussi au lot 4.
- États propres au site hors périmètre (EXPERIENCE.md, State Patterns).
- Les tickets 2 à 8 de `bmad/ux-lot8` restent hors de cette spec ; seul l'accord de son ticket 1 y entre (CAP-1).
