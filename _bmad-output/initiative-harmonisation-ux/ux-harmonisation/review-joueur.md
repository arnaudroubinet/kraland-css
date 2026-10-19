---
type: review
lens: joueur
reviewed:
  - DESIGN.md
  - EXPERIENCE.md
date: 2026-10-19
---

# Revue joueur : harmonisation UX (DESIGN.md, EXPERIENCE.md)

Relecture adversariale du point de vue d'un joueur de Kraland Interactif, sur ordinateur et sur mobile. Documents relus : `DESIGN.md` et `EXPERIENCE.md` (brouillons du 2026-10-19), `.memlog.md` (décisions d'Arnaud), maquettes de `.working/`, mission `etude-ux.md`. Aucun accès au site. Pour ancrer les constats, quelques lectures du dépôt (template JS, CSS, fixtures de test) ; les références `fichier:ligne` renvoient à l'état du 2026-10-19.

Cadre respecté : corriger l'existant, aucun nouveau composant (les manques sont posés en questions pour Arnaud), accessibilité limitée aux joueurs voyants. Les options écartées par Arnaud (alerte au-dessus des boutons, « Valider » grisé, tri par activité, lecture des forums en arrière-plan, etc.) ne sont pas reproposées.

## Verdict global

**Bonne base, pas encore prête à implémenter telle quelle.**

Les deux documents suivent fidèlement le memlog, partent bien de la boucle de jeu et règlent de vrais irritants : texte de 10 à 11 px sur les pages de jeu mobiles, « Cancel / OK », aide illisible en sombre, bleu Bootstrap, alerte recouverte, icônes de 26 px. Une fois ces règles appliquées, le joueur lira mieux et se trompera moins de bouton.

Trois zones restent fragiles vues du joueur :

1. **La modale d'ordre**, cœur de la boucle, est décrite par morceaux (H2.1 à H2.7) sans vérification de l'ensemble. Son seul garde-fou, l'alerte, peut être hors de vue au moment de « Valider ».
2. **Les couleurs d'état.** Le « non lu », aujourd'hui porté par un seul jeton, éclate en plusieurs couleurs. La règle « une couleur vive signale un état » se heurte aux couleurs de six nations sur huit, dont Kraland, la variante par défaut.
3. **Le mobile n'a été vu qu'en émulation.** Vrai téléphone, clavier ouvert, zoom iOS sur les champs, 360 px, paysage et tablette restent à vérifier, alors que trois des quatre parcours sont sur mobile.

S'y ajoutent des trous de boucle que les parcours ne couvrent pas : lire et répondre à un kramail, jouer plusieurs personnages, les tuiles d'action du plateau mobile, les ordres à paramètres.

**Constats : 1 critical, 7 high, 14 medium, 9 low.**

## Critical

### C1. Modale d'ordre : l'alerte peut être hors de vue quand le joueur valide

- **Où.** DESIGN « Modale d'ordre » ; EXPERIENCE « Modale d'ordre », « Alerte », parcours 1 (cas d'échec) ; décisions H2.3, H2.4, H2.5.
- **Problème.** Depuis H2.3, l'alerte est le seul signal d'un ordre impossible ou risqué, puisque « Valider » reste actif. Deux mécanismes existants peuvent la cacher.
  - *Repli.* « ? Aide » est construit en repliant le **premier** `.alert` de la modale (`makeAlertCollapsible`, `kraland-userscript-template.js:9149`), sans distinguer aide et blocage. Dès que l'alerte de blocage est le premier `.alert` du DOM (ordre sans aide, ou alerte remontée en JS pour appliquer H2.3), c'est elle qui est repliée sous « ? Aide », donc invisible par défaut. Les documents traitent « Alerte » et « Aide » comme deux blocs, sans dire comment les distinguer ni que l'alerte ne se replie jamais.
  - *Défilement.* Sur mobile, la modale est faite de zones collantes : sélecteur de personnage et titre en haut, onglets en haut, pastilles de coût collées au-dessus des boutons, boutons en bas (`kraland-theme.css:1440-1510`). Seul le milieu défile. Une alerte « juste sous le titre », dans ce milieu, glisse sous les onglets dès que le joueur fait défiler le formulaire, alors que les pastilles et « Valider » restent toujours à l'écran. La lecture naturelle « je lis le coût, je valide » se fait sans l'alerte. C'est vraisemblablement la cause du défaut relevé en H2.3 (alerte recouverte par les pastilles collantes). Sur ordinateur, la modale entière défile : même question pour les ordres longs.
- **Piste.** Écrire noir sur blanc : seule l'aide se replie ; une alerte de blocage ou d'avertissement ne se replie jamais. Relever dans le HTML natif ce qui les distingue (classe `.alert-*` ?). Question pour Arnaud : sur mobile, l'alerte peut-elle se placer dans l'en-tête collant existant, sous le titre de l'ordre, pour rester à l'écran jusqu'à « Valider » (au prix de quelques lignes de formulaire visibles en moins) ? Vérifier à 375×667 avec l'aide dépliée et sur l'ordre Parler (zone de saisie portée à 8 lignes, `kraland-userscript-template.js:9195-9203`). Ajouter au parcours 1 un échec « avertissement » (l'ordre passe, avec une conséquence), pas seulement « blocage ».

## High

### H1. « Non lu » : un signal aujourd'hui cohérent, éclaté en plusieurs couleurs

- **Où.** DESIGN « Rôles » (`status-unread` : « ne sert pas à : pastilles »), « Palette d'états », « Pastille d'état », « Ligne de sujet » ; EXPERIENCE « State Patterns » ; Q4, Q15 ; décision H8.1.
- **Problème.** Aujourd'hui, un seul jeton, `--kr-status-unread`, porte le non-lu : pastilles « NON LU » et « NOUVEAU MESSAGE » (`kraland-theme.css:13485-13495`), filet du sous-forum, filet et teinte de la date sur `/report` (`kraland-theme.css:646-657`). C'était un choix d'Arnaud (option B : « le filet a la couleur du non lu du forum »). L'inventaire a relevé ces pastilles « ambre » : c'est l'accent d'Empire Brun sombre (`#d4a574`), la variante relevée, pas une couleur d'état ; en Kraland, elles sont rouges (`#c41e3a`). Les documents passent les pastilles en alerte (ambre, commune aux nations) et gardent le filet en accent : sur une même ligne de sujet, deux couleurs pour un même état, partout sauf en Empire Brun clair. S'y ajoutent :
  - le « ! » de la cloche en danger, ce qui étire le danger au-delà des blocages ;
  - le badge de l'enveloppe du kramail (`span.badge#badge`, gris Bootstrap), que rien ne traite ;
  - un accent qui sert aussi à l'auteur du dernier message, aux liens et à l'anneau de focus : un filet « non lu » en accent ne se distingue pas d'une simple mise en valeur.
- **Piste.** Rendre Q15 bloquante. Un seul jeton « non lu » pour pastilles, filets, teinte de `/report` et badges de la barre du haut (cloche, enveloppe) : garder `--kr-status-unread` partout, ou tout passer en alerte, mais pas un mélange. Décider si « ! » signale « nouveau » (même jeton) ou un danger.

### H2. « Une couleur vive signale un état » ne tient pas dans six nations sur huit

- **Où.** DESIGN « Brand & Style » (troisième parti pris), « Palette d'états », « Variantes de nation », Q2, Q3 ; H5.5.
- **Problème.** La palette d'états est commune aux nations, mais plusieurs couleurs de nation sont voisines d'une couleur d'état :
  - Kraland (`#8b0f0e`, accent `#c41e3a`) et l'accent de Ruthvénie (`#C41E3A`) : des rouges voisins du danger `#c62828` ;
  - Paradigme Vert (`#0B6623`) et Ruthvénie (`#0A6B2D`) : des verts voisins du succès `#2e7d32` ;
  - Empire Brun : Q2 propose `#8a5a00` pour le texte et l'anneau, exactement la valeur de l'alerte ; Paladium sombre (`#e6c76e`) : un or voisin de l'alerte sombre `#ffb74d` ;
  - Confédération Libre : la primaire claire `#6B7280` est la valeur du texte atténué, la primaire sombre `#9ca3af` celle du texte « indisponible seulement » du mode clair. « Valider », les étiquettes et le filet d'onglet auront l'air désactivés.

  Exemple dans la boucle : en Kraland clair, l'alerte d'info (primaire à 6 %, `#f8f1f1`) et l'alerte de blocage (danger à faible opacité, selon l'hypothèse de DESIGN) sont deux roses pâles, sous un « Valider » rouge foncé. La couleur ne distingue pas l'aide d'un blocage.
- **Piste.** Reformuler le parti pris : un état se lit d'abord à son texte et à sa forme (libellé, filet, bordure) ; sa couleur ne sert jamais à une action. C'est déjà la règle du code pour le non-lu : « jamais par la couleur seule » (`kraland-theme.css:13486`). Contrôler Q3 nation par nation (écart de teinte entre état et nation). Question pour Arnaud : la primaire grise de Confédération Libre convient-elle pour l'action principale ?

### H3. « Envoyer » : barre fixe ou bouton dans le flux, la règle se contredit

- **Où.** DESIGN « Barre Envoyer » ; EXPERIENCE « Barre Envoyer », « Interaction Primitives » (Envoyer), Q13 ; H1.2, H6.2.
- **Problème.** H1.2 cite « réponse » parmi les pages à barre fixe, et H6.2 assimile l'« Envoyer » de rédaction à la barre fixe. Or l'éditeur du forum a été remis dans le flux exprès : « plus de barre fixe qui recouvre la saisie » (`kraland-theme.css:14799-14813`, bouton de 48 px). Le kramail garde la barre fixe (réserve de 70 px, `kraland-theme.css:10256-10260`). EXPERIENCE liste « nouveau sujet, réponse, kramail », puis renvoie la réponse du forum à Q13. Appliquée à la lettre, la règle réintroduit sur le forum un défaut déjà corrigé ; laissée en l'état, le même geste a deux places selon qu'on écrit un RP ou un kramail.
- **Piste.** Passer Q13 en bloquante et l'élargir : une seule réponse pour le forum et le kramail. Le précédent du forum plaide pour le bouton dans le flux ; vérifier le kramail clavier ouvert sur un vrai téléphone (H4) avant de trancher.

### H4. Mobile vu seulement en émulation : vrai téléphone et clavier ouvert non vérifiés

- **Où.** EXPERIENCE « Responsive & Platform » (Vrai téléphone), Q17 ; parcours 1 et 3 ; memlog (hypothèse sur l'émulation).
- **Problème.**
  - Q17 : `initMobileFeatures` lit `window.innerWidth` dès le démarrage (`kraland-userscript-template.js:9945-9946`), alors que le bundle s'exécute en `document-start` (`build.js:79`), où la largeur vaut 980 px avant la meta viewport (commentaire G-01, `kraland-userscript-template.js:660-663`). Les améliorations mobiles de la modale d'ordre (pastilles, « ? Aide », « Valider » renforcé : `enhanceCharacterModal`) dépendent en plus d'un observateur posé seulement si `document.body` existe à ce moment (`kraland-userscript-template.js:8749-8770`). H2.2, H2.4, H2.5 et H2.7 ont été décidées sur un rendu qu'un téléphone ne produit peut-être pas. Le test de démarrage le dit lui-même : « Émulation mobile Chromium (viewport meta honorée), pas un vrai téléphone » (`tests/e2e/demarrage-mobile.mjs:2`).
  - Clavier : le climax du parcours 3 (« la barre Envoyer reste en place pendant toute la saisie ») n'est pas observable en émulation, qui n'affiche pas de clavier. Sur iOS Safari et sur Chrome Android récent, un élément fixé en bas d'écran passe en général sous le clavier. Le code ne suit la zone visible que pour les ordres à zone de saisie (`trackOrderModalViewport`, `kraland-userscript-template.js:8775`).
  - Q17 est classée non bloquante, alors que le parcours 1 en dépend entièrement.
- **Piste.** Passer Q17 en bloquante pour les règles mobiles de la modale d'ordre et pour le parcours 3. Faire un passage court sur un vrai téléphone, iOS et Android : modale Dormir, ordre Parler, rédaction d'un kramail clavier ouvert. Réécrire les parcours d'après ce qui est vu.

### H5. Zoom iOS : l'échelle de texte n'a pas de rôle « champ de saisie »

- **Où.** DESIGN « Typography » (`body-mobile` 15 px) ; EXPERIENCE « Responsive & Platform » (texte courant 15 px) ; Q8.
- **Problème.** Le CSS met aujourd'hui les champs à 16 px sur mobile pour éviter le zoom iOS, à huit endroits (`kraland-theme.css:945`, `1215`, `1710`, `4273`, `8120`, `8143`…) : sélecteur de personnage et zone de saisie des ordres, `.form-control` en général. L'échelle décidée n'a pas de taille de 16 px, sauf les messages du forum. Aligner les champs sur le « texte courant 15 px » ferait zoomer Safari iOS à chaque toucher d'un champ : rédaction du kramail, réponse RP, ordre Parler, recherche des règles.
- **Piste.** Ajouter à DESIGN le rôle « champ de saisie, mobile : 16 px, jamais moins », et le citer dans « Éditeur de rédaction », « Modale d'ordre » et « Do's and Don'ts ».

### H6. Lire et répondre à un kramail : trou de boucle, actions en icônes seules

- **Où.** EXPERIENCE « Boucle de jeu » (Kramail : lecture), parcours 3 ; H12.2, H13.1. Aucune règle pour la page de lecture.
- **Problème.** Le parcours 3 écrit un nouveau message. Le cas le plus fréquent, lire un kramail reçu et y répondre, n'est pas parcouru. Sur la page de lecture mobile, Réception, Répondre, Répondre à tous et Transférer sont des icônes seules : la peau efface même le mot « Réception » (`kraland-userscript-template.js:5950-5966`) et retire les infobulles sur mobile (`disableTooltips`, `kraland-userscript-template.js:3802-3823`). Seule l'icône distingue « Répondre » de « Répondre à tous ». Dans un jeu politique, un « répondre à tous » sur un kramail confidentiel a un coût en jeu. Sur cette page, « Réception » est aussi un bouton primaire plein : un autre signal d'« actif » que l'onglet souligné de H13.1.
- **Piste.** Question pour Arnaud : étendre à la page de lecture la logique de H13.1 (libellés visibles, au moins pour Répondre et Répondre à tous) et le même signal d'actif ? Ajouter un parcours « lire et répondre à un kramail (mobile) ».

### H7. Joueur à plusieurs personnages : non couvert hors des pages de jeu

- **Où.** EXPERIENCE « Liens dans la boucle » (« le nom du personnage joué reste visible dans toutes les sections de jeu ») ; H1.3, H1.4 ; parcours (un seul personnage).
- **Problème.** Le kramail et les notifications sont propres à chaque personnage, et la modale d'ordre s'ouvre sur un sélecteur de personnage. La peau a déjà trois sélecteurs différents : liste déroulante du kramail mobile (`initKramailCharacterSwitcher`, `kraland-userscript-template.js:5514`), bandeau à liste de `/report` (celui de H14.3), carrousel en tête de la modale d'ordre (`kraland-userscript-template.js:9435-9438`, `9463`). Aucun n'est décrit. H1.3 et H1.4 répondent à « quel personnage je joue » sur les pages de jeu seulement, alors que c'est en écrivant un kramail ou en lisant un rapport que se tromper de personnage coûte le plus.
- **Piste.** Question pour Arnaud : le joueur à plusieurs personnages est-il dans le périmètre ? Si oui : même aspect et même place pour le personnage courant sur le kramail, `/report` et la modale d'ordre (composants existants, à harmoniser), et un parcours qui change de personnage.

## Medium

### M1. Pastilles coût, durée, potentiel : style, mots et taille

- **Où.** DESIGN « Pastilles coût, durée, potentiel » (Q5) ; H2.5, H8.2.
- **Problème.** Q5 propose le style de l'étiquette de catégorie : fond primaire plein, juste au-dessus d'un « Valider » lui aussi primaire plein. Trois pilules couleur d'action collées au bouton ressemblent à des boutons et diluent l'action principale. Les pastilles actuelles remplacent les mots « Coût », « Durée », « Potentiel » par des icônes (`formatFooterAsBadges`, `kraland-userscript-template.js:9217-9245`). Étendues à l'ordinateur (H2.5), elles retirent au joueur de bureau des mots qu'il lit aujourd'hui, et « 01:00 » à côté d'une horloge se lit comme une heure. Enfin, H8.2 les met en 12 px, la plus petite taille du système, pour l'information qui décide de l'ordre.
- **Piste.** Style neutre (surface surélevée, texte du thème, bordure), pas la couleur d'action. Garder le mot ou une abréviation (« Coût 10 MØ », « Durée 01:00 », « Potentiel PER + Discrétion = 1 »). Question pour Arnaud : la valeur en 13 px plutôt qu'en 12 ?

### M2. Tuiles d'action du plateau mobile : absentes des composants

- **Où.** DESIGN « Components » (absentes) ; EXPERIENCE parcours 1, étape 5 (« Dormir, un bouton d'au moins 44 px ») ; H6.2, H6.3.
- **Problème.** Sur mobile, Dormir, Prier, Pouvoir, Fouiller… sont recopiés en tuiles sur une rangée : icône de 24 px, libellé de 12 px, 64 px de haut, sans rayon (`createQuickActions`, `kraland-userscript-template.js:1522` ; `kraland-theme.css:4952-5008`). C'est la commande la plus touchée de la boucle, et aucun composant ne la décrit. Le code l'appelle « actions rapides », les documents appellent « Boutons d'accès rapide » les cinq sections sur ordinateur : un implémenteur peut confondre les deux. Appliquer H6.2 et H6.3 à la lettre (14 px, 44 px, rayon de 4 px) change ces tuiles sans décision ; ne rien faire laisse des libellés à 12 px malgré « bouton normal 14 px ».
- **Piste.** Ajouter la tuile d'action au tableau des composants (rendu actuel ou ajusté, à faire trancher). Renommer « Boutons d'accès rapide » en « Boutons de section (ordinateur) ».

### M3. Modale d'ordre : anatomie ambiguë

- **Où.** DESIGN « Modale d'ordre » ; EXPERIENCE « Modale d'ordre » (« L'en-tête et les onglets gardent leur place actuelle »).
- **Problème.**
  - Les onglets n'ont pas de place dans l'ordre de lecture (titre, alerte, aide, contenu, pastilles, boutons). L'alerte va-t-elle au-dessus des onglets ou dans le panneau de l'onglet ? Le contenu se recharge en Ajax (`kraland-userscript-template.js:9414`) : une alerte sortie du panneau peut rester celle de l'ordre précédent.
  - « ? Aide » n'existe que sur mobile (`makeAlertCollapsible` ne s'exécute qu'en mode mobile). L'anatomie le place sans préciser le support : appliquée à l'ordinateur, elle replierait une aide que le joueur de bureau lit aujourd'hui sans clic. H2.4 ne décide que du style.
  - Croix de 44×44 sur ordinateur (H2.6) : si la modale n'a pas de titre Bootbox (le titre de l'ordre est un `h3` du corps), Bootbox insère la croix en flottant en tête du corps, avec une marge de −10 px (`tests/e2e/vendor/parler/bootbox.min.js`). À 44×44, elle empiète sur la rangée sélecteur et titre, là où H2.3 place l'alerte.
  - Le contenu de l'ordre (champs, cible, quantité, sélecteur de personnage) n'a ni taille de texte ni règle : H3.1 cite des pages, pas la modale.
- **Piste.** Compléter l'anatomie : place des onglets ; alerte attachée à l'onglet actif ; « ? Aide » sur mobile seulement, sauf décision contraire ; place réservée à la croix ; tailles du contenu (texte 15 px, champs 16 px, voir H5).

### M4. Défilement et placement du plateau mobile : non mesurés

- **Où.** EXPERIENCE parcours 1 et 4, « Responsive & Platform » ; DESIGN « Layout & Spacing ».
- **Problème.** Plusieurs décisions agrandissent le mobile : texte de 11-12 à 15 px sur 87 % du plateau, cibles de 44 px, en-têtes de 48 px, cartes en retrait, lignes de forum d'au moins 72 px, date au-dessus du texte dans `/report`. Le tout sous un en-tête collant de 56 px et une barre d'onglets collante d'environ 50 à 55 px (`kraland-theme.css:93`, `5020-5023`, `5130-5138`) : un sixième de l'écran pris en permanence. Aucun relevé avant/après de la longueur des pages. L'ordre des blocs du plateau mobile (mini-profil, tuiles d'action, croix, pièces, personnages présents) n'est pas traité, alors que le placement est au cœur du sujet. Chaque déplacement recharge le plateau (parcours 4) : à chaque pièce, le joueur redescend à la croix, puis aux personnages.
- **Piste.** Mesurer à 375×667, avant et après, la hauteur du plateau, du matériel et de `/report`, et la position de la croix et de la première tuile d'action à l'arrivée. Question pour Arnaud : faut-il une règle « tuiles d'action et croix visibles sans défilement à l'arrivée sur le plateau » ?

### M5. Largeurs et supports non couverts : 360 et 320 px, paysage, tablette

- **Où.** EXPERIENCE « Responsive & Platform » (Vérification à 1280×720 et 375×667), « Foundation ».
- **Problème.**
  - 360 px (courant sur Android) et 320 px ne sont pas vérifiés, alors que les tests de la croix tournent déjà à 320, 375, 390, 430 et 700 px (`tests/e2e/croix-directionnelle.mjs:22`). À 375 px, un onglet de section fait 75 px et son libellé se coupe par points de suspension (`kraland-theme.css:5073-5082`) : « Personnage » en 12 px gras tient à peine ; en 13 px, ou à 360 px, il sera coupé (Q14).
  - Paysage et tablette : la plupart des téléphones récents, une fois tournés, dépassent 768 px et passent en mode ordinateur sur écran tactile (boutons de 34 px, votes de 22 px), après rechargement. À 768 px exactement (iPad mini en portrait), plusieurs blocs mobiles du CSS, dont celui de la modale d'ordre, s'appliquent sans le mode mobile du JS : ils sont écrits en `max-width: 768px` (`kraland-theme.css:1426`, `1730`, `9930`, `11582`).
- **Piste.** Ajouter 360 et 320 px à la vérification des règles mobiles ; trancher Q14 en mesurant « Personnage ». Question pour Arnaud : le paysage et la tablette sont-ils dans le périmètre ?

### M6. Rangée du kramail mobile (H13.1) : ne tient pas en une ligne

- **Où.** DESIGN « Onglets de section » ; EXPERIENCE « Onglets de section », parcours 3, étape 4 ; H13.1.
- **Problème.** Trois onglets libellés (Réception, Envoi, Corbeille) et trois boutons de 44 px (Nouveau message, Contacts, « ••• ») dépassent les 343 px utiles. La rangée vit aujourd'hui dans l'en-tête de la page, à côté du titre, qui porte le nom du personnage (`kraland-userscript-template.js:5810-5825`). « Même composant que les sections du jeu » ne dit pas la disposition : deux rangées, défilement horizontal (comme la barre du jeu) ou libellés coupés.
- **Piste.** Préciser la disposition (par exemple, onglets sur une rangée pleine largeur, boutons à icône sur la rangée du titre) et la vérifier à 360 px.

### M7. Fil d'Ariane (H12.3) : la référence a les défauts que la règle veut éviter

- **Où.** DESIGN « Fil d'Ariane » ; EXPERIENCE « Fil d'Ariane » ; H12.3.
- **Problème.** Le fil « des sujets » réel a tous ses liens en texte atténué, en 13 px, sans hauteur minimale (`kraland-userscript-template.js:6958-7046`), sur un en-tête transparent, donc probablement sur le fond de page : 4,43:1 en clair, sous la cible de 4,5:1. Le fil du sous-forum, lui, a un lien de 44 px de haut en couleur du texte (`kraland-theme.css:13587-13596`). La décision décrit le format des sujets avec « élément courant atténué », ce que l'implémentation ne fait pas. Reprendre « le format des sujets » tel quel retire au sous-forum sa cible de 44 px et le rend moins lisible.
- **Piste.** Décrire le format visé plutôt que renvoyer à l'implémentation : liens en couleur du texte, cibles d'au moins 44 px de haut (H9.1), seul l'élément courant atténué, sur une surface où le texte atténué passe 4,5:1.

### M8. Index du forum : la flèche, le parcours 2 et la redite du titre

- **Où.** EXPERIENCE parcours 2, « Ligne de forum » ; maquette `.working/h12-index-forum.html`.
- **Problème.**
  - La flèche de l'index mène au dernier message du forum ; la ligne de sujet du sous-forum mène au premier message non lu (`kraland-userscript-template.js:4964-5025`). Deux raccourcis voisins, deux sens. Le parcours 2 suppose que le dernier message de la Taverne est dans le sujet que joue Arnaud ; sinon, il atterrit ailleurs et saute les messages non lus des autres sujets.
  - Maquette mobile : « Jeu (RP) » en titre de page (22 px), puis de nouveau en en-tête de carte, avec un chevron qui replie toute la liste. Environ 55 px de redite en haut de l'écran, et un repli sans usage.
  - Description et modérateurs quittent l'index : restent-ils lisibles dans le sous-forum ? Sinon, l'information disparaît du site.
- **Piste.** Ajouter au parcours 2 le cas « dernier message dans un autre sujet ». Question pour Arnaud : sur l'index, carte sans en-tête quand celui-ci répète le titre de page ? Vérifier où se lisent description et modérateurs.

### M9. Cartes de personnages : une règle par largeur de fenêtre

- **Où.** DESIGN « Carte de personnage » ; EXPERIENCE « Responsive & Platform », Q7 ; H7.1.
- **Problème.** La règle se déclenche sur une plage de fenêtre (≈ 1100 à 1500 px) mesurée avec des noms en 11 px. En 15 px (H11.1, Q7), les noms longs (« Fée Con de la Gueuse », « Rejeton de Lilith ») déborderont aussi au-delà de 1500 px, et le zoom du navigateur déplace la plage. La troncature que H7.1 supprime reviendra hors de la plage.
- **Piste.** Exprimer la règle par la place disponible (« quand le nom ne tient pas à côté de l'avatar »), pas par la fenêtre. Remesurer en 15 px à 1024, 1280, 1366, 1440 et 1920 px.

### M10. Cartes de section en retrait : le texte ne commence plus à 16 px

- **Où.** DESIGN « Layout & Spacing » (retrait de 8 px) ; H10.1 ; Q10.
- **Problème.** Retrait de 8 px plus marge intérieure de 16 px : le texte des cartes commence à 24 px du bord, le titre de page à 16 px. H10.1 promet un « texte qui commence au même endroit partout ». Le jeu et le forum, aujourd'hui à 16 px, passeraient à 24 px et perdraient 16 px de largeur de lecture (listes de sujets, matériel).
- **Piste.** Trancher Q10 avant l'implémentation : retrait de 8 px et marge intérieure de 8 px, ou pas de retrait. Vérifier l'alignement du titre et du contenu sur une maquette.

### M11. Texte atténué en clair : une contrainte de placement invérifiable

- **Où.** DESIGN « Contrastes de référence » et hypothèse « jamais sur le fond de page ni sur un en-tête teinté ».
- **Problème.** Le texte atténué fait 4,43:1 sur le fond de page et 4,17 à 4,59:1 sur les en-têtes teintés. Il est déjà posé hors des surfaces blanches : fil d'Ariane des sujets (M7), cellule de date des notifications non lues, teintée à 14 % (`kraland-theme.css:655-657`). L'hypothèse demande de vérifier chaque placement, page par page, pour chaque nation.
- **Piste.** Choisir un texte atténué un peu plus foncé, qui passe 4,5:1 sur le fond de page et sur les teintes, plutôt qu'une règle de placement.

### M12. Caractéristiques, compétences, malus : absents des documents

- **Où.** Aucun des deux documents ; H5.5, H8.2.
- **Problème.** Les caractéristiques (FOR, VOL, CHA, GES, INT, PER, boutons natifs `btn-success`) et les compétences se consultent avant un ordre, puisque le potentiel en dépend (« PER + Discrétion »). On les trouve sur le plateau, dans le mini-profil déplié et dans le panneau de compétences mobile (`kraland-userscript-template.js:1413-1450`). Aucune règle ne les cite. S'ils restent verts, H5.5 les ferait passer en style standard ; si leur couleur ou le « -0 » du malus signale un état, l'information se perd. H8.2 fait aussi passer ce malus de 15 à 12 px.
- **Piste.** Question pour Arnaud : la couleur des caractéristiques et le malus portent-ils un état ? Classer chaque élément (état, catégorie, action) avant d'appliquer H5.5 et H8.2.

### M13. Notifications sur mobile : retour au plateau et critère du popup

- **Où.** EXPERIENCE parcours 1, étapes 2 à 4 ; Q6.
- **Problème.** La cloche appelle `openReport()` du site, qui ouvre une fenêtre séparée (popup de 600×600 sur ordinateur). Si le téléphone ouvre lui aussi un onglet séparé, « il revient au plateau » veut dire fermer cet onglet ou en changer : l'étape n'est pas décrite. Pour Q6, un critère du type « fenêtre ouverte par le site » vaudrait aussi sur téléphone et y appliquerait les règles ordinateur (colonne de date), à l'inverse de H14.2.
- **Piste.** Relever sur un téléphone comment s'ouvre `/report` et compléter l'étape 4. Pour Q6, retenir un critère qui exclut le téléphone.

### M14. Trois barres d'outils pour un même geste d'écriture

- **Où.** DESIGN et EXPERIENCE « Éditeur de rédaction » (« rendu actuel (forum, kramail, ordres) ») ; H9.1.
- **Problème.** Le forum mobile a une rangée « 5 outils + Plus » (`kraland-theme.css:14834`) ; le kramail, les 18 boutons natifs en 4 groupes qui passent à la ligne, avec des cibles de 40 px validées auparavant (`kraland-theme.css:10264-10269`) ; l'ordre Parler, sa propre barre. H9.1 passe le kramail à 44 px, ce qui peut ajouter une rangée au-dessus du champ, clavier ouvert. Le « rendu actuel » fige une incohérence que la mission demande de corriger.
- **Piste.** Question pour Arnaud : aligner la barre du kramail, et celle de Parler, sur celle du forum (composant existant) ?

## Low

### L1. Anneau de focus rouge sur les champs

- **Où.** DESIGN « Anneau de focus » (H5.7).
- **Problème.** L'accent de Kraland (`#c41e3a`), de Ruthvénie (`#C41E3A`) et leurs accents sombres (`#e07070`, `#ff6b85`) sont rouges. Un champ de saisie montre son anneau aussi au toucher et au clic : un anneau rouge autour de la réponse RP se lit comme une erreur.
- **Piste.** Vérifier en Kraland clair sur le champ de réponse. Question pour Arnaud si le doute se confirme, H5.7 étant décidée.

### L2. Bouton standard peu reconnaissable

- **Où.** DESIGN « Bouton standard » (H5.3).
- **Problème.** En clair, la bordure à 18 % (`#ead4d4`) fait environ 1,4:1 sur blanc. En sombre, le fond du bouton est celui de la carte et la bordure est à 8 %. « Annuler », « ? Aide », « Voir l'historique » risquent de se lire comme du texte coloré plutôt que comme des boutons.
- **Piste.** Vérifier sur la maquette h05 que le bouton se reconnaît sans survol ; sinon, bordure plus marquée.

### L3. Jauges sombres voisines des états

- **Où.** DESIGN « Jauges » (Q3).
- **Problème.** En sombre, PP `#ffa726` et alerte `#ffb74d`, PV `#66bb6a` et succès `#81c784` sont presque identiques.
- **Piste.** Écarter les teintes au moment de valider Q3.

### L4. « Nouveau message » reste une icône seule

- **Où.** H13.1 ; parcours 3, étape 5.
- **Problème.** H13.1 libelle les dossiers pour ne plus « deviner les icônes », mais laisse en icône seule l'action d'écriture, la principale du kramail.
- **Piste.** Question pour Arnaud.

### L5. Éléments `.btn-primary` non cliquables peints comme « Valider »

- **Où.** H5.1 (21 éléments d'Événements, « étiquettes et champs-boutons »).
- **Problème.** Le site pose `.btn-primary` sur des étiquettes. En couleur de nation, elles ressembleront à l'action principale.
- **Piste.** Repérer les `.btn-primary` sans lien ni action et leur donner le style d'étiquette.

### L6. « Succès : votes » est ambigu

- **Où.** DESIGN « Palette d'états » (H5.5).
- **Problème.** Le score d'un message est une information (pastille non tactile, `kraland-theme.css:14608-14616`) ; les boutons de vote sont des actions. Peindre ces boutons en succès contredirait H5.5.
- **Piste.** Écrire : score en succès, boutons de vote en bouton compact standard.

### L7. Barre du bas des sujets oubliée par H12.4

- **Où.** DESIGN et EXPERIENCE « En-tête de sujet ».
- **Problème.** « Répondre / Nouveau sujet » existe aussi en bas du sujet (`createThreadActions`, `kraland-userscript-template.js:7054-7102`) ; H12.4 ne cite que l'en-tête.
- **Piste.** Étendre les deux barres à Communauté, Débats et Staff.

### L8. Pagination à 44 px hors du forum

- **Où.** H9.1 (Événements, `/report`).
- **Problème.** Dix numéros de 44 px ne tiennent pas sur une ligne de 343 px. Le sous-forum a déjà une pagination condensée « ‹ 1 2 3 … 15 › » (`kraland-theme.css:14180`).
- **Piste.** Reprendre ce motif existant ailleurs.

### L9. Bâtiments, employés, commerce : pages d'action sans parcours

- **Où.** EXPERIENCE « Boucle de jeu » (Personnage) ; Q19.
- **Problème.** Le parcours 3 ne fait que lire le matériel. Gérer un bâtiment, ses stocks ou ses employés, et acheter au commerce, passe par des tableaux et des champs que rien ne décrit sur mobile (largeur des tableaux, champs, boutons). Q19 ne traite que le commerce sur ordinateur.
- **Piste.** Question pour Arnaud : ces pages comptent-elles dans la boucle ? Si oui, un relevé mobile avant l'implémentation.

## Questions pour Arnaud

Manques possibles, posés en questions (aucun nouveau composant proposé) :

1. (C1) Sur mobile, l'alerte d'un ordre peut-elle se placer dans l'en-tête collant existant de la modale, sous le titre, pour rester visible jusqu'à « Valider » ?
2. (H1) Quel jeton unique pour tout ce qui signale « non lu » : pastilles, filets, teinte de `/report`, badges de la cloche et de l'enveloppe ?
3. (H2) La primaire grise de Confédération Libre convient-elle pour l'action principale ?
4. (H3) « Envoyer » : barre fixe ou bouton dans le flux, avec une seule réponse pour le forum et le kramail ?
5. (H6) Page de lecture du kramail : libellés visibles pour Répondre, Répondre à tous et Transférer ?
6. (H7) Le joueur à plusieurs personnages est-il dans le périmètre ?
7. (M1) Pastilles de l'ordre : style neutre plutôt que primaire, avec leurs mots ?
8. (M2) Tuiles d'action mobiles : rendu actuel ou alignement sur le bouton normal ?
9. (M4) Faut-il que tuiles d'action et croix soient visibles sans défilement à l'arrivée sur le plateau ?
10. (M5) Le paysage et la tablette sont-ils dans le périmètre ?
11. (M8) Sur l'index du forum, carte sans en-tête quand celui-ci répète le titre de page ?
12. (M12) La couleur des caractéristiques et le malus portent-ils un état ?
13. (M14) Barre d'outils du kramail et de Parler alignée sur celle du forum ?
14. (L4) « Nouveau message » du kramail avec un libellé ?
15. (L9) Bâtiments, employés et commerce font-ils partie de la boucle à couvrir ?

## Vérifications à prévoir avant l'implémentation

- Vrai téléphone, iOS et Android : modale Dormir avec et sans alerte, ordre Parler, rédaction d'un kramail clavier ouvert, ouverture de `/report` (C1, H4, M13).
- 360 et 320 px pour toutes les règles mobiles, et 768 px exactement (M5).
- Longueur des pages du plateau, du matériel et de `/report`, avant et après, à 375×667 (M4).
- Couleurs d'état et couleurs de nation côte à côte dans les 8 nations, en clair et en sombre (H1, H2, Q3).
