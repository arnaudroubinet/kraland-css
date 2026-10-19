---
name: Kraland — surcharge harmonisée
status: final
sources:
  - ../../../etude-ux.md
  - ../../../AGENTS.md
  - .memlog.md
updated: 2026-10-19
---

# Kraland — surcharge harmonisée : expérience

Ce fichier dit comment la surcharge se comporte pour le joueur. L'apparence et les jetons (`{colors.…}`, `{typography.…}`, `{spacing.…}`, `{components.…}`) sont dans [DESIGN.md](DESIGN.md) ; les faits de code et les préalables d'implémentation, dans [notes-implementation.md](notes-implementation.md). Les identifiants renvoient à `.memlog.md`, qui fait foi : H1.1, H5.3… sont des décisions, et R1 à R7 des décisions prises après les relectures ; Q1 et Q2 sont des questions tranchées, les autres Q des questions ouvertes. `[ASSUMPTION]` marque une valeur ou une lecture non tranchée par Arnaud ; chaque cas est repris dans « Questions ouvertes ». Les maquettes, dans `mockups/` (sauf h07, restée dans `.working/`), sont liées aux sections qu'elles illustrent ; les documents priment sur les maquettes en cas de conflit.

## Foundation

- **Produit.** Une surcharge du site Kraland : userscript Tampermonkey et `kraland-theme.css`, sur le Bootstrap 3.3.7 et le jQuery du site. Le site n'est servi qu'en HTTP. La surcharge ne modifie ni le HTML ni le CSS d'origine ; elle les surcharge (AGENTS.md).
- **Supports.** Ordinateur (référence 1280×720) et mobile (référence 375×667), sur les mêmes pages ; points de rupture et mode mobile : « Responsive & Platform ». Vérification (décision d'Arnaud) : chaque règle se contrôle à 1280×720 et 375×667, sur au moins deux variantes contrastées (une claire, une sombre) ; contrastes de texte vérifiés dans les 16 variantes. Protocole et pièges (seuils N−1, N, N+1, mini-profil plié et déplié, `elementFromPoint`) : AGENTS.md. Autres largeurs et supports (360 et 320 px, 768 px exactement, paysage, tablette) : Q32.
- **Système d'interface.** Bootstrap 3 du site, plus les composants propres à la surcharge (forum, plateau, modales d'ordre). Ce fichier ne décrit que l'écart voulu ; ce qu'il ne cite pas garde son rendu actuel.
- **Cadre** (mission `etude-ux.md`, memlog). Point de vue du joueur, qui vient pour jouer : on part de la boucle de jeu, pas de l'arborescence du site. Aucun nouveau composant sans validation d'Arnaud ; on corrige l'existant avant d'ajouter. Cœur du sujet : couleurs, placement, ratios et proportions, cohérence d'une page à l'autre (un même élément a le même aspect et la même place partout). Références : le forum et le plateau (section « jouer » du site), révisables.
- **Variantes.** Huit nations, chacune en clair et en sombre (16 variantes), plus `high-contrast`, connue du JS seul (Q16). Une variante ne change que les couleurs : tailles, places, formes et comportements sont les mêmes dans les 16 (cœur du sujet ; H5.3). Chaque variante tire ses nuances de sa nation (H5.2). Jetons, valeurs par variante et contrastes : DESIGN.md, « Colors ».
- **Statut.** Ce document décrit l'état visé par l'harmonisation. Le code CSS ou JS, le PRD, les epics et les tickets attendent le feu vert explicite d'Arnaud. Aucune question bloquante ne reste : Q1 et Q2 sont validées ; Q6, Q13 et Q15 sont résolues respectivement par R5, R4 et R3. Les questions ouvertes n'empêchent pas de clore la phase UX.
- **Base factuelle.** Inventaire du 19 octobre 2026 (21 pages, deux supports, variantes `empire-brun-dark` et `kraland`, modales d'ordre, carte) et visite unique de `/report` : [.working/synthese-incoherences.md](.working/synthese-incoherences.md). Vérifications du memlog (source du nom du personnage, classes des alertes de la modale d'ordre) : [notes-implementation.md](notes-implementation.md).

## Information Architecture

La boucle de jeu d'abord, puis les pages secondaires.

### Boucle de jeu

| Étape | Surface | Atteinte depuis | Ce que le joueur y fait | Décisions |
|---|---|---|---|---|
| Notifications | `/report` : pop-up de 900×800 sur ordinateur (R5) ; sur téléphone, ouverture par la fonction native du site, non relevée (Q17) | **Cloche des notifications** (barre du haut) | lire le rapport du jour | H8.1, H8.2, H14.1 à H14.3, R3, R5 |
| Plateau | section Agir (`/jouer/plateau`) | barre du haut ; **Onglets de section** (mobile) ; **Boutons d'accès rapide** (ordinateur) | voir sa pièce, son personnage, qui est là | H1.3 à H1.6, H3.1, H6.1, H7.1, H11.1 |
| Ordres | **Modale d'ordre** | boutons d'action du plateau (Dormir, Prier, Pouvoir, Fouiller…) ; sur mobile, tuiles de la barre d'actions (Q24) | choisir un ordre, lire coût, durée et potentiel, valider ou annuler | H2.1 à H2.7, H6.1, R2 |
| Déplacement | **Croix directionnelle et pièces** (mobile) ; rendu actuel sur ordinateur | plateau | changer de pièce | H9.1, AGENTS.md |
| Personnage | Matériel, Personnage, Bâtiments, Employés | **Onglets de section** ; **Boutons d'accès rapide** | consulter objets, fiche, bâtiments, employés | H1.1, H1.4, H1.5, H3.1, H3.2, H4.1, H11.1, R1 |
| Forum | index (RP, HRP, Communauté, Débats), liste des sujets, sujet, rédaction | menus de forums de la barre du haut | suivre et écrire le RP | refonte de l'index (H12.1), H4.1, H12.2 à H12.4, R4, R6 |
| Kramail | dossiers Réception, Envoi, Corbeille ; lecture (Q22) ; rédaction | enveloppe de la barre du haut | lire et écrire aux autres personnages | H9.1, H12.2, H13.1, R3, R4 |

Liens dans la boucle :

- Le nom du personnage joué reste visible dans toutes les sections de jeu : **Mini-profil** sur mobile, **Panneau latéral du jeu** sur ordinateur (H1.3, H1.4, R1).
- On passe d'une section de jeu à l'autre par les **Onglets de section** (mobile) ou les **Boutons d'accès rapide** (ordinateur) ; la section en cours se voit de la même façon sur les deux supports (H1.5).
- Les boutons d'action du plateau ouvrent la **Modale d'ordre**, qui se referme sur le plateau.
- À l'index du forum, la ligne ouvre le forum ; sa flèche ouvre directement le dernier message (refonte de l'index). L'état lu/non lu s'affiche dans la liste des sujets.
- Le kramail s'ouvre sur un dossier ; sur mobile, les dossiers sont des onglets libellés (H13.1).

### Pages secondaires

Toutes reçoivent les règles communes de DESIGN.md (palette, typographie, rayons, grille, étiquettes, focus, liens). Elles n'ont pas de parcours propre.

| Page | Ce qui change | Décisions |
|---|---|---|
| Accueil | en sombre, compteurs en accent au lieu de la primaire | H5.6 |
| Règles | « ok » reste à côté du champ de recherche (pas de barre fixe) ; marge de 16 px | H1.2, H10.1 |
| Monde, Événements | boutons primaires à la couleur de la nation (21 boutons bleus en clair) ; boutons de 44 px sur mobile (38 px aujourd'hui) ; cibles et numéros de page ≥ 44 px (20×20 et 24 px aujourd'hui) ; marge de 16 px | H5.1, H6.2, H9.1, H10.1 |
| Citoyens | règles communes seulement ; aucun écart propre relevé à l'inventaire | — |
| Membres | cibles ≥ 44 px (34 px aujourd'hui) | H9.1 |
| Interface (`/profil/interface`) | « Sauvegarder » et « Importer » à 44 px sur mobile (39 px aujourd'hui) ; « Voir l'historique » en bouton standard ou primaire ; marge de 16 px | H5.5, H6.2, H10.1 |
| Aide | marge de 16 px | H10.1 |
| Contacts | boutons de Contacts et « Pas un contact » en style standard ou primaire ; cibles ≥ 44 px (icônes de 15 à 34 px de large aujourd'hui) | H5.5, H9.1 |
| Statistiques | marge de 16 px | H10.1 |
| Carte | titre de la ville à 16 px du bord sur mobile ; `[ASSUMPTION]` de même sur ordinateur, où le défaut a aussi été relevé | H10.1 |

## Voice and Tone

Micro-textes. La voix de marque est dans DESIGN.md, « Brand & Style ».

| À écrire | À éviter | Où | Décision |
|---|---|---|---|
| « Annuler » / « Valider » | « Cancel » / « OK » | modales d'ordre seulement ; les autres confirmations gardent leurs libellés | H2.1 |
| Le nom du personnage joué (« Nerys ») | « Personnage », « Employés » comme titre, sauf en repli quand le nom est inconnu | mini-profil, panneau latéral | H1.3, H1.4, R1 |
| « Agir », « Matériel », « Personnage », « Bâtiments », « Employés », chacun avec son icône | deux séries d'icônes | onglets de section, boutons d'accès rapide | H1.6 |
| « Réception », « Envoi », « Corbeille » en toutes lettres | icônes seules à deviner | dossiers du kramail, mobile | H13.1 |
| « 73 sujets · 694 messages » | « 73 · 694 » sans unité | index du forum | refonte de l'index |
| « Fée Con de la Gueuse · hier 23:33 » (auteur, heure relative ; forme exacte : Q27) | description et modérateurs sur l'index | index du forum | refonte de l'index, maquette h12 |
| « Jeu (RP) › Taverne › titre du sujet » | « ⏪ Jeu (RP) › Taverne » | fil d'Ariane du forum, mobile | H12.3 |
| « ••• » | « ⋮ » | bouton des autres actions | H12.2 |
| Icône et valeur | « → … sujets · » hors du forum | citoyenneté, page Personnage | H1.1 |
| Ton factuel et léger | dramatisation | partout | enjeu loisir (memlog), AGENTS.md |

Les autres libellés restent ceux du site ou de la surcharge actuelle (« ? Aide », « Répondre », « Nouveau sujet », « Envoyer », « NON LU », « NOUVEAU MESSAGE », « ici »).

## Component Patterns

Comportement. L'aspect est dans DESIGN.md, « Components », sous les mêmes noms et dans le même ordre.

| Composant | Où | Règles de comportement |
|---|---|---|
| **Bouton primaire** | partout | Porte l'action principale, celle qui engage (« Valider », « Envoyer »). Même couleur partout, quelle que soit la balise (H5.1). Taille normale ; jamais sous `{spacing.touch-target}` sur mobile (H6.2). |
| **Bouton standard** | partout | Actions secondaires ou réversibles (« Annuler », « ? Aide »). Une action ordinaire prend le style standard ou primaire, jamais une couleur d'état (H5.5). |
| **Bouton compact** | ordinateur | Réservé aux votes et à la pagination (H6.2). Sur mobile, ces mêmes boutons ont une cible de 44×44 (H9.1). |
| **Bouton « Envoyer »** | rédaction : forum (nouveau sujet, réponse), kramail | Sur mobile, sous le champ, dans le flux de la page : il suit le texte et ne recouvre jamais la saisie ; aucune barre fixe (R4). Hors rédaction, un bouton de validation reste à côté de son champ (« ok » des Règles, H1.2). |
| **Bouton « ••• »** | forum, kramail | Ouvre les actions secondaires d'un message ou d'une liste. Même glyphe partout (H12.2) ; 44 px sur mobile (H13.1). |
| **Onglets de section** | mobile : sections de jeu, dossiers du kramail | Un onglet par section ; l'onglet actif suit la page ouverte. Toucher un onglet ouvre sa section. Les dossiers du kramail utilisent le même composant (H13.1). |
| **Boutons d'accès rapide** | ordinateur, pages de jeu | Cinq boutons vers les sections de jeu ; celui de la section en cours porte le signal de l'onglet mobile actif (H1.5). |
| **Panneau latéral du jeu** | ordinateur : plateau, Matériel, Personnage, Bâtiments, Employés | Toujours titré du nom du personnage, quelle que soit la section (H1.4). Sur Personnage et Employés, dont le HTML ne porte pas le nom, le userscript reprend le dernier nom vu sur le plateau, le matériel ou les bâtiments, mémorisé localement ; s'il n'en connaît aucun, le titre natif reste (R1). |
| **Mini-profil** | mobile, pages de jeu | Affiche le nom du personnage joué sur toutes les pages de jeu (H1.3), avec la même source que le panneau latéral (R1). Se plie et se déplie au toucher (rendu actuel). |
| **Carte de section** | mobile : jeu, forum (liste des sujets du sous-forum comprise, R6), kramail | Le chevron signale une section repliable ; toucher l'en-tête (48 px, chevron compris) la plie ou la déplie, là où le repli existe (rendu actuel). La même carte sert sur toutes les pages (H4.1). |
| **En-tête de panneau et de tableau** | ordinateur ; tableaux des deux supports | Pas de comportement nouveau ; le même traitement en clair qu'en sombre (H5.3). |
| **Ligne d'objet** | Matériel | Même ordre sur les deux supports : image, nom, charge (H3.2). |
| **Ligne de citoyenneté** | Personnage | Icône et valeur, comme sur ordinateur. Le décor « → … sujets · » reste réservé aux pages du forum (H1.1). |
| **Modale d'ordre** | plateau | S'ouvre depuis un bouton d'action. Ordre de lecture, alertes, aide et boutons : détail sous le tableau. |
| **Pastilles coût, durée, potentiel** | modale d'ordre | Affichage seul, sans action, au même endroit sur les deux supports : juste au-dessus des boutons (H2.5). |
| **Alerte** | modales d'ordre, pages | Signale un blocage (`.alert-danger`) ou un avertissement (`.alert-warning`). Dans une modale d'ordre : voir **Modale d'ordre** (H2.3, R2). |
| **Pastille d'état** | cloche, enveloppe du kramail, liste des sujets | Signale quelque chose à regarder : « ! » (notifications nouvelles), pastille de l'enveloppe, « NON LU », « NOUVEAU MESSAGE » (H8.1), d'une seule couleur, celle du non-lu (R3). |
| **Étiquette de catégorie** | forum, plateau | Classe un élément (« article », « guilde », « mod », « PNJ », « Dernier sujet ») ; ne signale jamais un état (H8.1). |
| **Jauges PV, PM, PP** | mini-profil, plateau | Une jauge se reconnaît à sa couleur, la même sur les deux supports (H5.4). |
| **Carte de personnage** | plateau, personnages présents | Le nom ne se tronque plus : quand la carte est trop étroite pour le nom à côté de l'avatar, il passe dessous, deux lignes au plus ; sinon, la carte ne change pas (H7.1). L'avatar garde 70 px sur ordinateur. Sur mobile, chaque icône d'action est une cible de 44×44. |
| **Croix directionnelle et pièces** | plateau, mobile | Rendu actuel. Les pièces gardent l'ordre DOM natif ; une icône de pièce remplacée retombe sur l'URL d'origine (AGENTS.md). Toucher une direction ou une pièce lance le déplacement (action du site). Une direction indisponible n'a pas de lien. |
| **Ligne de forum** | index du forum : RP, HRP, Communauté, Débats | Toute la ligne ouvre le forum ; la flèche ouvre le dernier message. Ordre fixe du jeu (Taverne, Marché, Monde, empire, provinces, guilde…), jamais trié par activité. Aucun signal lu/non lu. Sur ordinateur, le menu latéral des forums reste en place. Maquette : [mockups/h12-index-forum.html](mockups/h12-index-forum.html). |
| **Ligne de sujet** | liste des sujets d'un forum | Porte l'état lu, non lu ou nouveau. Toute la ligne est la cible ; un sujet lu en partie mène au premier message non lu (rendu actuel). Sur mobile, la liste entre dans la **Carte de section** (R6). |
| **Fil d'Ariane** | forum, mobile : sous-forum, sujet | Un seul format, « Catégorie › Forum › Sujet » ; l'élément courant n'est pas un lien (H12.3). Pas de fil d'Ariane ajouté sur une page qui n'en a pas, sauf par l'extension de l'**En-tête de sujet** aux sujets de Communauté, Débats et Staff (H12.4). |
| **En-tête de sujet** | forum, mobile | Même en-tête pour les sujets RP, HRP, Communauté, Débats et Staff : fil d'Ariane, puis « Répondre » (si le sujet est ouvert) et « Nouveau sujet » (H12.4). |
| **Ligne de notification** | `/report` | Lecture seule. Une notification non lue garde son filet à gauche (H14.2), dans la couleur du non-lu (R3). Onglets Rapport et Combats, pagination : rendu actuel. |
| **Cloche des notifications** | barre du haut | Ouvre `/report` : sur ordinateur, un pop-up de 900×800, assez large pour le rendu ordinateur (R5) ; sur mobile, comme aujourd'hui. Jamais de préchargement. Sa pastille « ! » signale des notifications nouvelles (R3). |
| **Éditeur de rédaction** | forum, kramail, ordres | Rendu actuel ; sur mobile, « Envoyer » sous le champ (R4). Sur mobile, chaque outil et le champ Destinataires ont une cible de 44×44 (H9.1). |
| **Anneau de focus** | partout | Suit le focus clavier, sous une seule forme (H5.7). |
| **Lien** | partout | Garde sa couleur au survol et se souligne ; le focus clavier prend l'**Anneau de focus** (R7, H5.7). |

### Modale d'ordre, détail

- S'ouvre depuis un bouton d'action.
- Ordre de lecture : titre de l'ordre, alerte, aide, contenu, pastilles, boutons. L'alerte est en tête, sous le titre, et rien ne la recouvre (H2.3).
- Les alertes de blocage et d'avertissement restent fixées en haut du corps pendant le défilement et ne se replient jamais ; seule l'aide se replie derrière « ? Aide » (R2). « ? Aide » déplie l'aide (H2.4).
- L'en-tête et les onglets gardent leur place actuelle. L'onglet actif est lisible (H2.7).
- Seul « Valider » engage l'ordre ; « Annuler », et sur ordinateur la croix de 44×44, referment la modale sans rien engager (H2.1, H2.6). Une alerte ne désactive rien : « Valider » reste actif (H2.3).
- Sur mobile, « Valider » est pleine largeur sous « Annuler » (H2.2).
- Ordres à paramètres et points d'anatomie ouverts : Q25.

### Maquettes

- [mockups/h03-texte-mobile-materiel.html](mockups/h03-texte-mobile-materiel.html) : **Ligne d'objet**.
- [mockups/h04-entetes-section-mobile.html](mockups/h04-entetes-section-mobile.html) : **Carte de section**.
- [mockups/h05-clair-composants.html](mockups/h05-clair-composants.html) : **En-tête de panneau et de tableau**, **Bouton standard** en clair.
- [.working/h07-cartes-personnages.html](.working/h07-cartes-personnages.html) : **Carte de personnage**, proposition d'avant la reformulation de H7.1 ; son avatar de 56 px est écarté, seule la règle du tableau vaut.
- [mockups/key-modale-ordre.html](mockups/key-modale-ordre.html) : **Modale d'ordre**, **Alerte**, **Pastilles coût, durée, potentiel** ; image fixe, sans le maintien de l'alerte au défilement.
- [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html) : **Mini-profil**, **Onglets de section**, **Croix directionnelle et pièces**, **Carte de personnage**.
- [mockups/key-notifications-mobile.html](mockups/key-notifications-mobile.html) : **Ligne de notification**.
- [mockups/key-kramail-mobile.html](mockups/key-kramail-mobile.html) : **Onglets de section** des dossiers, **Bouton « ••• »**, **Carte de section**.

Surfaces construites sur les tableaux seuls : Q33.

## State Patterns

Le « non lu / nouveau » a la même couleur partout : cloche, enveloppe du kramail, liste des sujets, notifications (R3).

| Surface | État | Traitement | Décision |
|---|---|---|---|
| Cloche des notifications | notifications nouvelles | **Pastille d'état** « ! » en 12 px gras, couleur du non-lu | H8.1, H8.2, R3 |
| Enveloppe du kramail | messages non lus | **Pastille d'état**, couleur du non-lu | R3 |
| Notifications (`/report`) | ouverture | un seul chargement les marque toutes comme lues : jamais de préchargement | AGENTS.md, R5 |
| Notifications | non lue | filet `{colors.status-unread}` à gauche, conservé | H14.2, R3 |
| Notifications | arrivée sur la page | sélecteur de personnage à 16 px du haut, sans bande vide | H14.3 |
| Index du forum | activité d'un forum | aucun signal lu/non lu ; le dernier message (auteur, heure) dit l'activité ; l'ordre ne bouge pas | refonte de l'index |
| Liste des sujets | jamais ouvert, nouveaux messages, lu | trois icônes natives : `i.fa.fa-folder`, `i.fa.fa-folder-open:not(.far)`, `i.far.fa-folder-open` ; « NON LU » et « NOUVEAU MESSAGE » en **Pastille d'état**, filet de la même couleur | AGENTS.md, H8.1, R3 |
| Liste des sujets | sujet fermé | cadenas (rendu actuel) | — |
| Kramail | message lu, non lu | rendu actuel (action « Marquer lu/non lu ») | — |
| Onglets de section, Boutons d'accès rapide | section en cours | texte en demi-gras, filet primaire de 3 px, fond inchangé | H1.5, H13.1 |
| Carte de section | pliée, dépliée | chevron (rendu actuel du repli) | H4.1 |
| Mini-profil | plié, déplié | rendu actuel | — |
| Mini-profil, Panneau latéral du jeu | nom inconnu sur Personnage ou Employés (plateau, matériel et bâtiments jamais vus) | titre natif | R1 |
| Modale d'ordre | ordre bloqué ou avertissement, une alerte ou plusieurs | **Alerte** en tête, fixée en haut pendant le défilement ; « Valider » reste actif | H2.3, R2 |
| Modale d'ordre | aide repliée, dépliée | seule l'aide (`.alert-order`) se replie ; « ? Aide » lisible dans les 16 variantes | H2.4, R2 |
| Modale d'ordre | onglet actif (mobile) | couleur du texte (`{colors.text-primary}`), ≥ 4,5:1, sans halo bleu | H2.7 |
| Bouton primaire | survol | `{colors.action-bg-hover}` et `{colors.action-ink-hover}` : primaire foncée, encre ≥ 4,5:1 | H5.2, Q1 |
| Lien | repos, survol, focus | couleur `{colors.text-accent}` inchangée ; soulignement au survol ; anneau au focus clavier | R7 |
| Tous les contrôles | focus clavier | `{components.focus-ring}` | H5.7 |
| En-tête de sujet | sujet fermé | pas de « Répondre » ; « Nouveau sujet » reste (rendu actuel) | H12.4 |
| Croix directionnelle et pièces | direction indisponible ; pièce courante ; pièce verrouillée | pointillé sans lien ; « ici » ; cadenas (rendu actuel) | — |
| Carte de personnage | nom trop long pour la place à côté de l'avatar | nom sous l'avatar, deux lignes au plus | H7.1 |
| Variante | clair, sombre | mêmes composants aux couleurs de la nation, mêmes tailles, mêmes places | H5.3 |
| Bascule ordinateur / mobile | franchissement de 768 px | rendu actuel : la page se recharge, sauf pendant une saisie | — |
| États du site | chargement, erreur de formulaire, liste vide, accès refusé, hors ligne | `[ASSUMPTION]` rendu du site, hors de cette étude | — |

## Interaction Primitives

- **Toucher ou cliquer pour agir.** Aucun geste nouveau.
- **Ligne entière.** Une ligne de liste (sujet, forum de l'index) forme une seule cible ; la flèche « dernier message » est une cible à part (H9.1, refonte de l'index).
- **Plier, déplier.** Toucher l'en-tête d'une **Carte de section**, là où le repli existe (H4.1).
- **Autres actions.** « ••• » ouvre les actions secondaires (H12.2).
- **Engager un ordre.** Seul « Valider » engage ; « Annuler » et la croix referment la modale (H2.1, H2.6).
- **Envoyer.** En rédaction mobile, on descend jusqu'à « Envoyer », sous le champ, après la saisie (R4).
- **Clavier, ordinateur.** Le focus se voit partout (H5.7).
- **Menus sur tactile.** Un menu ou un panneau ouvert depuis un menu (« ••• », smileys, couleurs) doit rester au-dessus du voile `.dropdown-backdrop` que Bootstrap pose en z-index 990 (AGENTS.md).

## Accessibility Floor

Comportement. Contrastes et tailles chiffrés : DESIGN.md, « Colors » et « Typography ».

- **Périmètre : les joueurs voyants.** Lisibilité, contraste, taille du texte, cibles tactiles, hiérarchie visuelle, focus visible. **Hors périmètre** : lecteurs d'écran, ARIA, synthèse vocale, navigation non visuelle. Ce document ne les exige ni ne les promet.
- **Taille du texte.** Même hiérarchie sur les deux supports : `{typography.section-title}`, puis `{typography.name}`, puis `{typography.detail}` (H3.1, H11.1). Aucun titre plus petit que le texte courant ; rien sous 12 px sur les pages de jeu mobiles (H3.1). Étiquettes et pastilles en `{typography.label}` (H8.2). Notifications en 14 px dans le pop-up et 15 px sur mobile (H14.1).
- **Contraste.** Texte coloré et texte posé sur la couleur de nation ≥ 4,5:1 dans les 16 variantes (H5.6, Q1, Q2, R7) ; onglet actif de la modale ≥ 4,5:1 (H2.7). Croix de fermeture ≥ 3:1 (H2.6). « ? Aide » lisible dans toutes les variantes (H2.4). `[ASSUMPTION]` Anneau de focus ≥ 3:1, comme la croix. Texte atténué en clair : Q26. Combinaisons chiffrées : DESIGN.md, « Contrastes de référence ».
- **Cibles tactiles.** Sur mobile, toute cible fait au moins `{spacing.touch-target}`, ou la ligne entière est la cible ; seuls les liens au fil du texte font exception (H9.1). Touches de la croix directionnelle : `{spacing.touch-target-dpad}` (AGENTS.md) ; « Envoyer » : 48 px (R4). Les cibles à corriger sont relevées dans leurs composants (DESIGN.md) et dans « Pages secondaires ».
- **Hiérarchie visuelle.** Titres de section en couleur du texte (H4.1). Une couleur vive signale toujours un état (H5.5) ; le « non lu / nouveau » a une seule couleur et le rouge danger ne signale qu'un blocage (R3). La section en cours se voit (H1.5). Le nom du personnage joué reste visible (H1.3, H1.4, R1).
- **Lisibilité.** Marge latérale de 16 px sur mobile, aucun texte collé au bord (H10.1). Dans la modale d'ordre, rien ne recouvre l'alerte (H2.3, R2) ; en rédaction, rien ne recouvre la saisie (R4). Noms de personnages complets plutôt que tronqués (H7.1).
- **Focus visible.** Une seule forme, `{components.focus-ring}`, sur tous les contrôles, liens compris (H5.7, R7).

## Responsive & Platform

**Points de rupture.** Le mode mobile, c'est `body.mobile-mode`, posé par le JS sous 768 px de large, et `@media (max-width: 767px)` ; l'ordinateur, `@media (min-width: 768px)`. Règles complètes : AGENTS.md.

| Élément | Ordinateur | Mobile | Décision |
|---|---|---|---|
| Texte | courant `{typography.body}` ; grand titre `{typography.page-title}` | courant `{typography.body-mobile}` (`[ASSUMPTION]`, Q8) ; rien sous 12 px | H3.1, H11.1 |
| Boutons | `{components.button-primary}` et `{components.button-standard}` : 34 px de haut ; compact 12 px (`{typography.button-compact}`, votes, pagination) | `{spacing.touch-target}` de haut ; **Bouton « Envoyer »** de 48 px dans le flux (`{components.send-button}`) | H6.1, H6.2, R4 |
| Section en cours | **Boutons d'accès rapide** | **Onglets de section** | H1.5 |
| Nom du personnage | **Panneau latéral du jeu** | **Mini-profil** | H1.3, H1.4, R1 |
| En-têtes de section | **En-tête de panneau et de tableau** | **Carte de section** (48 px), liste du sous-forum comprise | H4.1, H5.3, H11.1, R6 |
| Modale d'ordre | croix de 44×44 | « Valider » pleine largeur sous « Annuler » ; onglet actif lisible | H2.2, H2.6, H2.7 |
| Cartes de personnages | avatar 70 px ; nom sous l'avatar quand la carte est trop étroite | nom 15 px ; icônes 44×44 | H7.1 |
| Index du forum | compteurs, dernier message et flèche (34 px) alignés à droite ; menu latéral conservé | une **Carte de section** ; lignes ≥ 72 px ; flèche 44 px | refonte de l'index |
| Sujet du forum | rendu actuel | **Fil d'Ariane** unique ; **En-tête de sujet** étendu à Communauté, Débats et Staff | H12.3, H12.4 |
| Kramail | rendu actuel (dossiers déjà libellés) | dossiers en **Onglets de section** ; boutons à icône de 44 px ; « Envoyer » dans le flux | H13.1, R4 |
| Notifications | pop-up de 900×800, rendu ordinateur : colonne de date, texte 14 px | texte 15 px, date au-dessus, texte pleine largeur | H14.1, H14.2, R5 |
| Marges et cibles | — | marge `{spacing.margin-mobile}` ; cibles ≥ `{spacing.touch-target}`, croix `{spacing.touch-target-dpad}` | H9.1, H10.1 |

Identiques sur les deux supports : hiérarchie du texte, avec titres 17 px, noms 15 px et détails 13 px (H3.1, H11.1) ; texte des boutons en 14 px (H6.2) ; signal de la section en cours, demi-gras et filet primaire de 3 px (H1.5) ; icônes des sections (H1.6) ; libellés de la modale d'ordre (H2.1) ; place de l'alerte et des pastilles (H2.3, H2.5, R2) ; dates des notifications en 13 px (H14.1) ; couleurs (H5.1 à H5.6, Q1, Q2) ; couleur du non-lu (R3) ; jauges (H5.4) ; focus (H5.7) ; liens (R7) ; rayons (H6.3) ; étiquettes en 12 px gras (H8.2) ; grille d'espacement (H11.2).

- **Pop-up des notifications.** Sur ordinateur, la cloche ouvre `/report` dans un pop-up de 900×800, par une redéfinition de la fonction native `openReport`, sans préchargement (R5). Plus large que 768 px, le pop-up prend le rendu ordinateur (colonne de date, texte 14 px) sans règle d'exception aux points de rupture. Le mobile garde la date au-dessus d'un texte en 15 px (H14.2).
- **Cartes de personnages.** La troncature suit la largeur de la carte, pas celle de la fenêtre. Constat, noms en 11 px, sur 49 noms : aucun tronqué à 1024 px de fenêtre, 28 à 1280 px, 10 à 1366 px, 2 à 1440 px, aucun dès 1512 px. Mesures à refaire avec les noms en 15 px (Q7).
- **Commerce, ordinateur.** Noms d'objets sur 3 lignes ou plus : Q19.
- **Vrai téléphone.** Les relevés mobiles viennent d'une émulation (375×667) ; écarts possibles sur un vrai téléphone : Q17 et [notes-implementation.md](notes-implementation.md).

## Inspiration & Anti-patterns

Références, interdits et options écartées.

- **Références.** Éléments repris comme modèles :
  - le signal de l'onglet mobile actif (demi-gras, filet primaire), repris par les boutons d'accès rapide (H1.5) et les dossiers du kramail (H13.1) ;
  - le fil d'Ariane et l'en-tête des sujets (H12.3, H12.4) ;
  - le « ••• » des messages du forum (H12.2) ;
  - la couleur de « Répondre » et « Envoyer » du forum, reprise par « Valider » (H2.2) ;
  - la paire `--kr-arm-*` de la croix, étendue à tout texte posé sur la couleur de nation (Q1) ;
  - l'« Envoyer » du forum dans le flux, repris par le kramail (R4) ;
  - le jeton actuel du non-lu, `--kr-status-unread`, étendu à la cloche et à l'enveloppe (R3) ;
  - les lignes de sujets entièrement touchables (H9.1) ;
  - les icônes des titres de panneaux du matériel et des bâtiments (H1.6).
- **Leçon de l'essai précédent** (mission). Une revue UX avait mal compris le besoin, n'avait pas retouché ce qui devait l'être, avait ajouté un fil d'Ariane dont personne n'avait besoin et avait perdu de vue le jeu. D'où les règles du cadre (« Foundation »).
- **Interdits, et options écartées à ne pas réintroduire :**
  - notifications : précharger `/report`, qui marquerait tout comme lu, y compris pour le pop-up de R5 (AGENTS.md) ; onglet plein écran ; pop-up de 600×600 en rendu mobile (R5) ;
  - section en cours (H1.5) : fond primaire plein, contour primaire, barre d'onglets sur ordinateur ;
  - modale d'ordre : alerte au-dessus des boutons ; « Valider » grisé ou désactivé pour signaler une alerte (H2.3) ; alerte de blocage ou d'avertissement repliée (R2) ;
  - en-têtes de section mobiles (H4.1) : option B, la bande plate du forum généralisée ;
  - cartes de personnages (H7.1) : avatar de 56 px au-dessus du nom partout ; refonte complète de la carte ; avatar réduit sur ordinateur ;
  - index du forum (refonte de l'index) : lecture des forums en arrière-plan pour calculer un état lu/non lu ; signal lu/non lu par forum ; tri par activité ; mise en avant d'un forum par récence ;
  - navigation : composant ajouté (fil d'Ariane, menu, barre) sans validation (mission, H12.3) ;
  - « Envoyer » (R4) : barre fixe en bas d'écran, par-dessus la saisie, au forum comme au kramail.

## Key Flows

Quatre parcours retenus par Arnaud. Protagoniste : Arnaud, qui joue Nerys.

### Parcours 1 — Le tour du matin (mobile)

Arnaud, qui joue Nerys, le matin, sur son téléphone. Maquettes : [mockups/key-notifications-mobile.html](mockups/key-notifications-mobile.html), [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html), [mockups/key-modale-ordre.html](mockups/key-modale-ordre.html).

1. Arnaud ouvre Kraland. Dans la barre du haut, la **Cloche des notifications** porte la **Pastille d'état** « ! », en 12 px gras, dans la couleur du non-lu, celle des sujets non lus (H8.1, H8.2, R3).
2. Il touche la cloche. Les notifications s'ouvrent ; ce chargement les marque toutes comme lues (comportement du site). Le sélecteur de personnage commence à 16 px du haut, sans bande vide (H14.3).
3. Il lit son rapport. Chaque **Ligne de notification** montre sa date au-dessus (13 px) et son texte sur toute la largeur (15 px) ; les non lues gardent leur filet à gauche, dans la couleur du non-lu (H14.1, H14.2, R3).
4. Il referme les notifications et revient au plateau. Le **Mini-profil** affiche « Nerys » (H1.3) ; dans les **Onglets de section**, Agir (`fa-bolt`) est actif, en demi-gras avec son filet primaire (H1.5, H1.6).
5. Il touche la tuile « Dormir » de la barre d'actions (rendu actuel, Q24). La **Modale d'ordre** s'ouvre : titre de l'ordre, puis l'avertissement « Attention ! … » de Dormir, en tête (H2.3). L'aide est repliée derrière le bouton « ? Aide », qui reste lisible (H2.4) ; l'onglet actif est lisible (H2.7) ; les **Pastilles coût, durée, potentiel** sont juste au-dessus des boutons (H2.5).
6. Il fait défiler le formulaire. L'avertissement reste fixé en haut du corps de la modale ; rien ne le replie (R2).
7. **Climax :** en bas, « Annuler », puis « Valider » sur toute la largeur, dans la couleur de la nation, comme « Répondre » au forum (H2.1, H2.2). L'avertissement est encore sous ses yeux : Arnaud sait ce qu'il valide. Il valide.

Échec : l'ordre est réservé à une vocation. L'alerte de blocage s'affiche en tête, sous le titre ; elle reste fixée pendant le défilement et ne se replie jamais (H2.3, R2). « Valider » reste actif. Arnaud lit l'alerte et referme avec « Annuler ».

Dépendances : le rendu mobile de la modale n'a été relevé qu'en émulation, et l'ouverture des notifications sur téléphone n'est pas relevée (Q17).

### Parcours 2 — Réponse RP au forum (ordinateur)

Arnaud, qui joue Nerys, plus tard dans la journée, sur ordinateur (1280×720). Il répond à la Taverne. Maquette : [mockups/h12-index-forum.html](mockups/h12-index-forum.html).

1. Il ouvre l'index Jeu (RP) depuis la barre du haut. Une **Ligne de forum** par forum, dans l'ordre du jeu ; le menu latéral des forums reste à gauche (refonte de l'index).
2. Sur la ligne Taverne, il lit à droite « 73 sujets · 694 messages », puis le dernier message : auteur en accent, heure relative, en 13 px. Aucun signal lu/non lu : l'heure suffit à voir que la Taverne a bougé.
3. Il clique sur la flèche de la Taverne (34 px). La flèche ouvre directement ce dernier message, sans passer par la liste des sujets.
4. Le sujet s'ouvre sur ce message : rendu actuel du sujet sur ordinateur, avec les règles communes (hiérarchie du texte H11.1, étiquettes en 12 px gras H8.2, liens R7).
5. Il clique sur « Répondre ». La page de rédaction s'ouvre (**Éditeur de rédaction**, rendu actuel sur ordinateur).
6. **Climax :** il écrit sa réponse et clique sur « Envoyer », un **Bouton primaire** de taille normale (14 px, 34 px de haut, H5.1, H6.2), de la même couleur que « Valider ». De l'index à sa réponse, Arnaud n'a jamais cherché son sujet.

Échec : aucun cas propre à la surcharge ; une erreur d'envoi garde le rendu du site. Variante : le dernier message de la Taverne est dans un autre sujet que celui d'Arnaud. La flèche y mène ; pour retrouver son sujet, Arnaud ouvre la Taverne par sa ligne et le repère dans la liste, où « NOUVEAU MESSAGE » le signale (H8.1, R3).

### Parcours 3 — Matériel et kramail (mobile)

Arnaud, qui joue Nerys, plus tard dans la journée, sur son téléphone. Maquette : [mockups/key-kramail-mobile.html](mockups/key-kramail-mobile.html).

1. Depuis le plateau, il touche l'onglet Matériel (`fa-suitcase`, H1.6), qui devient actif dans les **Onglets de section**.
2. Chaque section (Argent, Outils, Médicaments…) est une **Carte de section** : en-tête de 48 px, titre de 17 px en couleur du texte, icône et chevron (H4.1).
3. Il repère un objet par son image, puis par son nom en 15 px (« Lanterne ») ; la charge suit, alignée à droite, en 13 px atténué (« charge 1 » ; **Ligne d'objet**, H3.1, H3.2).
4. Il touche l'enveloppe de la barre du haut. Le kramail s'ouvre sur l'onglet « Réception », libellé et marqué de son filet, à côté d'« Envoi » et de « Corbeille » ; « Nouveau message », « Contacts » et « ••• » restent des boutons à icône de 44 px (H12.2, H13.1).
5. Il touche « Nouveau message ». La rédaction s'ouvre : champ Destinataires et **Éditeur de rédaction** au rendu actuel, avec des cibles d'au moins 44 px (H9.1).
6. **Climax :** il écrit à un autre personnage ; rien ne recouvre sa saisie. Sous le champ, le **Bouton « Envoyer »** (48 px, couleur de la nation) suit le texte dans la page (R4). Il y descend et envoie.

Échec : destinataire inconnu. Le champ Destinataires le signale comme aujourd'hui.

Dépendance : la saisie avec le clavier ouvert n'a pas été observée sur un vrai téléphone (Q17).

### Parcours 4 — Déplacement (mobile)

Arnaud, qui joue Nerys, sur son téléphone : il change de pièce. Maquette : [mockups/key-plateau-mobile.html](mockups/key-plateau-mobile.html).

1. Sur le plateau (onglet Agir), il voit le composant **Croix directionnelle et pièces** : les touches de la croix, la liste des pièces dans l'ordre natif, la pièce courante marquée « ici » (rendu actuel, AGENTS.md).
2. Il touche une direction (touche de 48 px au moins) ou une pièce de la liste (44 px au moins) (AGENTS.md, H9.1).
3. Le plateau se recharge dans la nouvelle pièce (comportement du site). Le **Mini-profil** affiche toujours « Nerys » (H1.3).
4. Il fait défiler jusqu'aux personnages présents. Chaque **Carte de personnage** montre l'avatar et le nom en 15 px (H3.1, H7.1) ; « PNJ » est une **Étiquette de catégorie** (H8.1, H8.2).
5. **Climax :** Arnaud lit chaque nom en entier et touche du premier coup l'icône qu'il vise, une cible de 44×44 (H7.1, H9.1).

Échec : direction indisponible. La touche est en pointillé et sans lien (rendu actuel) ; Arnaud choisit une pièce dans la liste.

## Notes pour l'implémentation

Faits de code et préalables à régler avant d'écrire le code : [notes-implementation.md](notes-implementation.md).

## Questions ouvertes

Chaque question garde son identifiant et commence par sa demande ; les questions tranchées sont citées dans « Foundation », au point Statut. Points ajoutés à partir des relectures : [review-rubric.md](review-rubric.md), [review-faisabilite.md](review-faisabilite.md), [review-joueur.md](review-joueur.md).

### Q3 · Valeurs des couleurs d'état (H5.5) et des jauges (H5.4)

1. Valider, sur une maquette claire et une sombre, les valeurs proposées dans DESIGN.md (`[ASSUMPTION]`, contrastes calculés).
2. Chiffrer le fond et la bordure de l'**Alerte** de blocage et d'avertissement. La maquette key-modale-ordre prend un fond à 12 % et une bordure à 35 % du danger sombre.

En sombre, PP `#ffa726` et l'avertissement `#ffb74d`, PV `#66bb6a` et le succès `#81c784` sont presque identiques.

### Q4 · Info : couleur de la nation ou ton par mode

L'info suit-elle la nation, ou prend-elle un ton par mode comme le prévoit H5.5 ? `[ASSUMPTION]` Elle suit la nation (H5.2). En sombre, formule proposée : primaire à 15 % pour le fond et 30 % pour la bordure, sur `bg-surface`. Avec elle, un lien en accent posé sur l'alerte info tombe à 3,81:1 en Paladium sombre.

### Q5 · Pastilles coût, durée, potentiel

Restent à trancher :

1. la famille : H8.1 n'en prévoit que deux ; `[ASSUMPTION]` style de l'étiquette de catégorie ;
2. les mots à côté des icônes : « 02:00 » près d'une horloge se lit comme une heure ;
3. la taille de la valeur : 12 ou 13 px.

Acquis : fond de nation et encre d'action (Q1). Relecture joueur : trois pastilles pleines au-dessus d'un « Valider » plein peuvent se lire comme des boutons.

### Q7 · Nom des cartes de personnages sur ordinateur

1. Quelle taille ? `[ASSUMPTION]` 15 px (H11.1).
2. Que faire au-delà de deux lignes ? `[ASSUMPTION]` Des points de suspension.

La troncature est à remesurer en 15 px à 1024, 1280, 1366, 1440 et 1920 px.

### Q8 · Texte courant mobile

Quelle taille ? `[ASSUMPTION]` 15 px (H3.1, H14.1) ; les messages du forum gardent 16 px. Les champs de saisie sont aujourd'hui en 16 px sur mobile (8 endroits du CSS), pour empêcher le zoom automatique de Safari iOS : l'échelle n'a pas de rôle « champ ».

### Q9 · Bouton compact

1. Quelle hauteur ? Elle n'est pas tranchée (votes : 22 px aujourd'hui).
2. Quelle couleur ? Un bouton de vote prend-il la couleur de succès, que H5.5 réserve aux votes, ou le style standard (une action ne prend jamais une couleur d'état) ? Relecture joueur : score en succès, boutons en standard.

### Q10 · Retrait des cartes de section mobiles

Quel retrait ? `[ASSUMPTION]` 8 px (maquettes h04, h12, key-plateau-mobile, key-kramail-mobile ; h03 pose la carte sans retrait). Le texte des cartes commence alors à 24 px du bord, le titre de page à 16 px ; le jeu, le forum et le sous-forum (R6) perdent 16 px de largeur. Autres options relevées : retrait de 8 px avec marge intérieure de 8 px, ou pas de retrait.

### Q11 · Grille de 4 px (H11.2)

1. Que deviennent 10 et 15 px ? `[ASSUMPTION]` 15 devient 16 ; 10 devient 8 ou 12 selon les espacements voisins.
2. Quel périmètre ? À borner : composants Bootstrap visés (`.panel-body`, `.panel-heading`, `.btn`, `.form-control`, cellules de tableau) ; gouttière de la grille comprise ou non (sur ordinateur, elle décale les colonnes du plateau).

### Q12 · Formes non citées par H6.3

Que deviennent les rayons asymétriques de la croix, les avatars et les images ? `[ASSUMPTION]` Leurs formes sont conservées.

### Q14 · Libellés des onglets mobiles et texte des jauges du mini-profil (11 px)

Quelle taille ? H3.1 impose au moins 12 px ; `[ASSUMPTION]` 12 px (maquettes key-plateau-mobile, key-kramail-mobile). À 375 px, un onglet fait 75 px et « Personnage » en 12 px demi-gras tient à peine ; à mesurer aussi à 360 px.

### Q16 · Variante `high-contrast`

Garder, retirer ou définir cette variante ? Elle est présente dans le JS (`CONFIG.THEME_VARIANTS`), sans règle CSS et absente du choix de `/profil/interface`. AGENTS.md annonce 9 variantes ; le code compte 8 nations × 2 modes + `high-contrast`.

### Q17 · Émulation et vrai téléphone

1. Vérifier sur téléphone, iOS et Android, avant d'implémenter les règles mobiles de la modale d'ordre et d'« Envoyer » : modale Dormir, ordre Parler, rédaction avec le clavier ouvert, ouverture et fermeture de `/report`.
2. Nommer le navigateur mobile de référence (relecture de faisabilité : Chrome Android n'accepte aucune extension).

Quatre fonctions mobiles sont peut-être inactives sur un vrai téléphone (memlog ; faits de code : [notes-implementation.md](notes-implementation.md)) ; l'émulation n'affiche pas de clavier.

### Q18 · Écarts relevés sans décision (rendu actuel conservé)

Ces écarts gardent-ils leur rendu actuel, ou faut-il en trancher certains ?

- page courante de la pagination (5 rendus) ;
- pagination à 44 px hors du forum (dix numéros ne tiennent pas sur 343 px ; le sous-forum a une pagination condensée « ‹ 1 2 3 … 15 › ») ;
- grand titre présent sur certaines pages et absent d'autres ;
- taille du titre de page mobile ;
- interlignage (19 valeurs) ;
- défilement horizontal de la carte (1017 px).

### Q19 · Commerce, Bâtiments, Employés

1. Commerce sur ordinateur : revérifier à 1280, 1440 et 1920 px les noms d'objets sur 3 lignes ou plus, supposés réglés par H11.1 (memlog).
2. Ces pages comptent-elles dans la boucle ? Gérer un bâtiment, ses stocks ou ses employés et acheter au commerce passe par des tableaux et des champs sans relevé mobile.

### Q20 · Contrastes non textuels

Quel seuil fixer pour les contrastes non textuels ? Aucun n'est fixé. Filet primaire de l'onglet actif : 2,10:1 en Paladium clair et 2,56:1 en Empire Brun sombre (le demi-gras double le signal). Bordure du bouton standard en clair : entre 1,13 et 1,41:1 sur blanc (relecture joueur : bouton peu reconnaissable).

### Q21 · Couleurs d'état proches des couleurs de nation

Que faire des voisinages ci-dessous ? Piste de la relecture joueur : un état se lit d'abord à son libellé et à sa forme.

- Kraland et Ruthvénie : accent `#c41e3a`, donc non-lu, voisin du danger `#c62828` (1,04:1) ; en Kraland clair, l'alerte info et une alerte de blocage pâle seraient deux roses voisins.
- Paradigme Vert et Ruthvénie : primaires vertes voisines du succès `#2e7d32`.
- Empire Brun clair : `#8a5a00` sert au texte coloré, au non-lu et à l'avertissement proposé.
- Paladium sombre : or voisin de l'avertissement sombre `#ffb74d`.
- Confédération Libre : primaire `#6b7280`, la valeur du texte atténué (`#9ca3af` en sombre, celle du texte indisponible en clair) : « Valider » et les étiquettes peuvent sembler désactivés.
- Kraland et Ruthvénie : anneau de focus rouge ; sur un champ, il peut se lire comme une erreur.

### Q22 · Étape non couverte : lire et répondre à un kramail

1. Faut-il des libellés visibles, au moins pour Répondre et Répondre à tous ?
2. Faut-il ajouter un parcours ?

Sur la page de lecture mobile, Réception, Répondre, Répondre à tous et Transférer sont des icônes seules, sans infobulle ; « Réception » y est un bouton primaire plein, un autre signal d'onglet actif que celui de H13.1.

### Q23 · Étape non couverte : plusieurs personnages

Ce cas entre-t-il dans le périmètre ? Si oui : même aspect et même place pour le personnage courant, et un parcours qui change de personnage. Kramail et notifications sont propres à chaque personnage. La surcharge a trois sélecteurs de personnage (liste du kramail mobile, bandeau de `/report`, carrousel de la modale d'ordre), sans règle commune ; le nom mémorisé de R1 peut être celui d'un autre personnage du compte.

### Q24 · Étape non couverte : tuiles d'action du plateau mobile

1. Rendu actuel ou alignement sur le bouton de taille normale (texte 14 px, rayon 4 px) ? `[ASSUMPTION]` Maquette key-plateau-mobile : libellés en 14 px, 64 px conservés.
2. Tuiles et croix doivent-elles être visibles sans défilement à l'arrivée sur le plateau ?

Dormir, Prier, Pouvoir, Fouiller… sont recopiés en tuiles (icône 24 px, libellé 12 px, 64 px de haut, sans rayon ; `createQuickActions`), sans composant.

### Q25 · Étape non couverte : ordres avec paramètres ; anatomie de la modale

1. Quelle taille et quelles règles pour le contenu de l'ordre (champs, cible, quantité, sélecteur de personnage) ? Les documents ne lui en donnent aucune.
2. Où placer les onglets par rapport à l'alerte ? La maquette key-modale-ordre met l'alerte au-dessus de l'onglet.
3. L'aide se replie-t-elle sur ordinateur, où elle est aujourd'hui dépliée ? `[ASSUMPTION]` La maquette montre « ? Aide » sur les deux supports.
4. Où placer la croix de 44×44 quand la modale n'a pas de titre Bootbox ?

### Q26 · Texte atténué et texte indisponible, mode clair

1. Le texte atténué est-il réservé aux surfaces blanches ? `[ASSUMPTION]` Oui : il fait 4,43:1 sur le fond de page, 4,17 à 4,59:1 sur les en-têtes teintés, 4,32 à 4,63:1 sur l'alerte info. Les relectures proposent de foncer le jeton (`#636a77` : ≥ 4,70:1 sur toutes ces surfaces).
2. `text-muted` est-il réservé aux éléments indisponibles (2,54:1 sur blanc) ? `[ASSUMPTION]` Oui, ce qui oblige à revoir chaque emploi actuel.

### Q27 · Index du forum : points ouverts

1. Heure relative, forme exacte : le site écrit « Aujourd'hui (HH:MM) » ou une date ; un calcul dépendrait du fuseau du serveur.
2. Forum sans dernier message ou sans accès : repli de la ligne et de la flèche.
3. Icône de chaque forum : lue dans la liste latérale native.
4. La flèche mène au dernier message du forum, la ligne de sujet au premier non lu.
5. Sur mobile, le titre de page et l'en-tête de carte répètent « Jeu (RP) » (maquette h12).
6. Description et modérateurs, retirés de l'index, restent-ils lisibles dans le sous-forum ?

### Q28 · Fil d'Ariane et barre du bas des sujets

1. Liens du fil d'Ariane en accent (R7) ou en couleur du texte ?
2. Cibles de 44 px (H9.1) ?
3. La barre « Répondre / Nouveau sujet » du bas des sujets suit-elle l'extension de H12.4 ?

Le fil d'Ariane des sujets a aujourd'hui ses liens en texte atténué, 13 px, sans hauteur minimale, sur le fond de page (4,43:1) ; celui du sous-forum a un lien de 44 px en couleur du texte.

### Q29 · Nom long du personnage

Troncature, ou deux lignes au plus comme H7.1 ? Sont concernés le mini-profil à 375 px (ligne partagée avec l'argent et l'horloge ; maquette key-plateau-mobile : points de suspension) et le titre du panneau latéral.

### Q30 · Éléments sans famille ni composant

1. Pastille de niveau (accent, `--kr-level-*`) : troisième famille ou étiquette de catégorie ?
2. Bouton à icône (Nouveau message, Contacts) : ligne propre ou variante du bouton standard ?
3. `.btn-primary` sans action (étiquettes d'Événements) : peints comme « Valider » ?
4. Caractéristiques (`btn-success`) et malus « -0 » : portent-ils un état (H5.5, H8.2) ?
5. Cercle et barre de PV des cartes : couleur par niveau de santé (un état) ou vert de la jauge (`[ASSUMPTION]` maquette key-plateau-mobile) ?
6. Boutons d'accès rapide, créés aussi sur mobile : masqués ?
7. En-têtes de carte sans icône native : aucune icône, ou une icône ajoutée (maquette key-plateau-mobile) ?

### Q31 · Kramail mobile : disposition et outils

1. Quelle disposition ? Trois onglets libellés et trois boutons de 44 px ne tiennent pas sur 343 px. `[ASSUMPTION]` Maquette key-kramail-mobile : onglets pleine largeur sous le titre et boutons à icône dessous.
2. « Nouveau message » libellé ?
3. Barres d'outils du kramail (18 boutons natifs, 4 groupes) et de l'ordre Parler alignées sur celle du forum (5 outils + Plus) ?

### Q32 · Largeurs, supports et fenêtres

1. 360 et 320 px : non vérifiés.
2. À 768 px exactement, des blocs mobiles écrits en `max-width: 768px` (dont la modale d'ordre) s'appliquent sans le mode mobile du JS.
3. Paysage et tablette passent en mode ordinateur sur écran tactile : dans le périmètre ?
4. Autres fenêtres natives sous 768 px (aperçu `help.php?p=prev`, 600×480) : rendu mobile ou ordinateur ?

### Q33 · Couverture des maquettes et des parcours

Confirmer les surfaces suivantes, construites sur les tableaux seuls, sans maquette ni parcours, ou leur ajouter des maquettes : Boutons d'accès rapide (H1.5), carte de personnage validée sur ordinateur (h07 montre la version écartée), sous-forum mobile dans sa carte (R6), index du forum sur mobile, En-tête de sujet étendu (H12.4), pages secondaires.

### Autres hypothèses de rédaction

Hypothèses sans question propre, et leur lieu :

- graisse 600 des noms (maquettes h03, h04) : DESIGN.md, « Typography » ;
- graisse 700 des titres de section sur ordinateur (reprise du mobile) : DESIGN.md, « Typography » ;
- style standard pour « ••• », la flèche de l'index et « Nouveau sujet » : DESIGN.md, « Components » (**Bouton « ••• »**, **Ligne de forum**, **En-tête de sujet**) ;
- fond des alertes en couleur d'état à faible opacité : DESIGN.md, « Components » (**Alerte**) ;
- formules de dérivation des nuances, en clair et en sombre : DESIGN.md, « Colors › Dériver une variante de sa nation » ;
- marge de 16 px de la Carte aussi sur ordinateur : DESIGN.md, « Layout & Spacing » ; ce fichier, « Pages secondaires » ;
- états du site (chargement, erreur, liste vide, accès refusé, hors ligne) au rendu du site : ce fichier, « State Patterns » ;
- anneau de focus ≥ 3:1 : ce fichier, « Accessibility Floor » ; DESIGN.md, « Contrastes de référence ».
