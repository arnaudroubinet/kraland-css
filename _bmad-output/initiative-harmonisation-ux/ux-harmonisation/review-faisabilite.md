---
type: review
title: Relecture « faisabilité en surcharge »
status: draft
created: 2026-10-19
updated: 2026-10-19
relit:
  - DESIGN.md
  - EXPERIENCE.md
---

# Relecture « faisabilité en surcharge »

Question posée : pour chaque règle de [DESIGN.md](DESIGN.md) et d'[EXPERIENCE.md](EXPERIENCE.md), la surcharge (CSS injecté et JS du userscript, sans toucher au HTML ni au CSS du site) peut-elle la tenir, et comment ?

Méthode : lecture seule de `kraland-theme.css`, de `kraland-userscript-template.js`, des fixtures `tests/e2e/fixtures/`, des analyses CSS et JS hors dépôt et du memlog. Aucun accès au site, aucun build, aucun test. « Lnnn » renvoie au template JS, « l.nnn » à `kraland-theme.css`. Une déduction tirée du code sans observation au rendu est marquée (non vérifié). Les contrastes cités ont été recalculés (formule WCAG).

## Verdict global

**Réalisable en surcharge, avec réserves.**

- Sur 43 décisions et propositions relues (annexe A) : 17 se font en CSS seul, 16 en CSS avec un appui du JS (classe de page, marquage, critère), 10 en JS, dont 5 qui restructurent le DOM (H2.3, H2.5, refonte de l'index, H12.3, H12.4).
- Un point bloque : le nom du personnage n'a pas de source connue sur deux des cinq pages de jeu (C1).
- Deux règles contredisent les points de rupture d'AGENTS.md : la plage de 1100 à 1500 px des cartes de personnages (H8) et les règles « ordinateur » du popup `/report`, large de 600 px (H9).
- Le risque principal n'est pas une règle isolée, mais la cascade existante : 48 % de `!important`, des sections sans garde, des styles en ligne `!important` posés par le JS. Les règles transverses (typographie, rayons, grille, en-têtes) doivent d'abord la neutraliser, sinon le forum et le plateau régressent (H3, H6).
- La modale d'ordre est la zone la plus fragile : contenu chargé en Ajax, améliorations JS réservées au mobile et appliquées une seule fois (H1, H2).
- La palette, les jetons, le focus, les étiquettes et les rayons se font surtout en CSS, sans risque particulier au-delà de leur périmètre.
- Conformes à AGENTS.md : aucune règle ne précharge `/report`, la refonte de l'index garde la liste latérale native, l'ordre DOM des pièces ne change pas (annexe B).

Constats : 1 critical, 10 high, 15 medium, 15 low.

## Constats

### Critical

#### C1. Nom du personnage : aucune source sur les pages Personnage et Employés

- **Où.** DESIGN « Layout & Spacing › Places fixes », composants **Mini-profil** et **Panneau latéral du jeu** ; EXPERIENCE « Component Patterns », « Voice and Tone », parcours 1 et 4 ; H1.3, H1.4.
- **Problème.** La règle « toujours titré du nom du personnage, quelle que soit la section » suppose que la page porte ce nom. Le titre natif du panneau latéral (`#player-header-section > .list-group-item.active`) vaut le nom sur le plateau, le matériel et les bâtiments, mais « Personnage » sur `/jouer/perso` et « Employés » sur `/jouer/pnj` (synthèse, §3). Le JS le sait : il écrit « Personnage » en dur, parce que ce sélecteur « retourne l'onglet de navigation actif (ex : "Employés") au lieu du nom » (L1203-1205). Ni les analyses ni le code n'indiquent une autre source du nom sur ces deux pages. Un nom mémorisé depuis le plateau serait faux après un changement de personnage : un compte peut en avoir plusieurs (sélecteur du `/report`, liste du kramail). Lire une autre page en arrière-plan ajouterait une requête au site.
- **Proposition.** Avant l'implémentation, relever sur le HTML natif de `/jouer/perso` et `/jouer/pnj` (fixture, ou visite sur mandat d'Arnaud) un élément qui porte le nom ou un identifiant du personnage : lien de l'avatar, `alt` d'une image, en-tête de la fiche. Ensuite, au choix d'Arnaud :
  - (a) lire cette source ;
  - (b) mémoriser le nom par identifiant de personnage, seulement si cet identifiant figure sur la page, et garder le titre natif sinon ;
  - (c) limiter H1.3 et H1.4 aux trois pages qui portent le nom.

  Préciser aussi le sort d'un nom long dans l'en-tête du mini-profil à 375 px, qui partage la ligne avec l'argent et l'horloge.

### High

#### H1. Modale d'ordre : le JS actuel ne peut pas porter H2.3, H2.4 et H2.5

- **Où.** DESIGN **Modale d'ordre**, **Pastilles coût, durée, potentiel**, **Alerte** ; EXPERIENCE « Component Patterns », « State Patterns », Q17 ; H2.3, H2.4, H2.5.
- **Problème.**
  - Les fonctions qui marquent la structure, replient l'aide et créent les pastilles ne tournent qu'en mobile : `transformOrderModalStructure` (L9025-9028), `makeAlertCollapsible` (L9149-9151), `formatFooterAsBadges` (L9217-9219). Sur ordinateur, H2.3 (alerte en tête), H2.4 (« ? Aide ») et H2.5 (pastilles) demandent donc du JS neuf.
  - Le contenu de la modale arrive en Ajax (sonde `parler-viewport.mjs`). Les améliorations passent une seule fois, 150 ms après l'insertion de la modale (L8756-8759). L'observateur de contenu ne réapplique que la grille des onglets et la barre d'outils (L9417-9426). Le drapeau `structureTransformed` empêche tout second marquage (L9028). Si le contenu arrive après 150 ms, ou change quand le joueur choisit un autre ordre, l'alerte n'est pas remontée et les pastilles ne sont pas créées.
  - Les observateurs ne sont posés que si `document.body` existe quand `init()` s'exécute (L8766, L8859, L9859), avant le DOMContentLoaded. C'est le risque Q17. Il touche aussi l'ordinateur, par la fermeture au clic sur le fond (`enableModalBackdropClick`), et il toucherait tout nouveau module posé de la même façon.
- **Proposition.** Faire de la modale d'ordre un module InitQueue (donc lancé après le DOMContentLoaded), commun aux deux supports, idempotent et relancé par un observateur du `.bootbox-body` à chaque changement de contenu. Les réglages propres au mobile restent derrière `mobile-mode`. Traiter Q17 comme bloquante pour H2 : ce déplacement la règle sans attendre un essai sur téléphone.

#### H2. Modale d'ordre : alerte, aide et titre de l'ordre ne sont pas situés dans le DOM natif

- **Où.** DESIGN **Modale d'ordre** (« titre, Alerte, bouton « ? Aide », contenu… ») ; EXPERIENCE « Component Patterns », parcours 1 (échec) ; H2.3, H2.4.
- **Problème.** Les documents séparent l'alerte (blocage, avertissement) de l'aide, sans dire comment les reconnaître. Le JS actuel replie derrière le bouton « Aide » la **première** `.alert` de la modale (L9153), quelle qu'elle soit. Si un ordre place l'alerte de blocage avant l'aide, elle disparaît derrière le bouton : H2.3 l'interdit (« jamais recouverte »). Le « titre de l'ordre » n'a pas d'élément désigné : le seul titre repéré par le JS est le premier `h3` du corps, marqué `kraland-character-title` (L9037-9043), et rien ne dit que c'est le titre de l'ordre. L'anatomie cite « ? Aide » sans préciser le support, alors que ce bouton n'existe qu'en mobile. Aucune fixture ne reproduit une modale d'ordre native : la sonde Parler a un « intérieur synthétique NON natif ».
- **Proposition.** Construire une fixture synthétique fidèle de deux ou trois modales d'ordre (Dormir, Pouvoir, un ordre réservé à une vocation). Écrire ensuite dans EXPERIENCE le critère de chaque bloc (par exemple alerte = `.alert-danger` ou `.alert-warning`, aide = `.alert-info`, à confirmer sur la fixture) et l'élément qui sert de titre. Dire si l'aide se replie aussi sur ordinateur.

#### H3. Règles transverses contre une cascade à 48 % de `!important`

- **Où.** DESIGN « Typography », « Shapes », « Layout & Spacing », composants **Carte de section** et **En-tête de panneau et de tableau** ; H3.1, H4.1, H5.3, H6.1 à H6.3, H11.1, H11.2.
- **Problème.** Le CSS compte 3 367 déclarations `!important` sur 7 072. Plusieurs sections titrées « accueil », « plateau », « forum » ou « nouveau sujet » n'ont aucune garde, s'appliquent à toutes les pages mobiles et sont entièrement en `!important` : PHASE 3, 4 et 5 (l.3810-4415), forum RP 1re version (l.7466-7747), nouveau sujet (l.9406-9688). Une règle nouvelle écrite avec une garde `:where(html.x)`, de spécificité nulle, perd contre elles. Les sections récentes surenchérissent déjà (« Spécificité haute : règles desktop existantes en !important », l.14250). Les documents ne disent ni dans quel ordre procéder, ni s'il faut retirer les anciennes sections ou les battre.
- **Proposition.** Prévoir une étape préalable : garder par page, ou retirer, les sections sans garde (d'abord PHASE 3, 4, 5 et la 1re version du forum), avec un contrôle page par page (AGENTS.md : retirer une règle peut révéler un défaut natif). Fixer une règle d'écriture : `!important` seulement contre une règle ancienne nommée. Ordonner les chantiers : jetons et couleurs, puis rayons et focus, puis typographie, puis espacements.

#### H4. Carte de section (H4.1) sur le sous-forum : conflit avec la liste pleine largeur

- **Où.** DESIGN **Carte de section** (« pour le jeu, le forum et le kramail ») ; maquette h04 (exemple « Sujets permanents ») ; Q10 ; H4.1.
- **Problème.** La maquette h04 met la liste des sujets du sous-forum dans une carte en retrait de 8 px. La refonte du sous-forum (« variante A », zone de référence) étend au contraire le tableau des sujets sur toute la largeur : `width: calc(100% + 32px)` et marges de −16 px (l.13711-13720), lignes plates à filet bas, chevrons natifs de 44 px en marge négative (l.14049-14055). Carte en retrait et liste pleine largeur s'excluent. La suite `sous-forum.mjs` fige le rendu actuel.
- **Proposition.** Trancher : soit la liste entre dans la carte (lignes en retrait ; la refonte du sous-forum est reprise et ses tests mis à jour), soit le sous-forum est exempté de H4.1, en tout ou pour la seule liste des sujets. Écrire la réponse dans DESIGN, à côté de Q10.

#### H5. Typographie des pages de jeu mobiles (H3.1) : ni garde de page, ni correspondance des rôles

- **Où.** DESIGN « Typography » (règles et tableau des rôles) ; EXPERIENCE « Accessibility Floor », « Responsive & Platform » ; H3.1, et H11.1 au bureau.
- **Problème.**
  - La cause citée par DESIGN, l'échelle mobile des titres, est globale : `h1` à `h6` en `rem` et `!important` (l.4379-4384), sur toutes les pages mobiles, forum et kramail compris. La changer pour le seul jeu demande une garde de page, or le JS ne pose aucune classe pour `/jouer/*` (analyse JS, §3.2).
  - Les rôles (« nom et valeur », « détail », « titre de section ») ne sont reliés à aucun élément du DOM natif. Sur le plateau, 87 % du texte fait 12 px ou moins. Le passage à 17, 15 et 13 px touche le mini-profil (plié, 72 px de haut), les onglets, les légendes de compétences sur deux lignes dans des cellules de 44 px, les cartes de personnages et les jauges (Q14). Le plateau est une référence.
  - Même flou au bureau pour H11.1 : « les h4 de 18 px passent à 15 px », alors que l'accueil emploie aussi des `h4` de 10 à 20 px (l.11785-11898).
- **Proposition.** Poser une classe `html.kr-page-jouer` (JS), écrire la nouvelle échelle sous `:where(html.kr-page-jouer)`, et ajouter à DESIGN une table « rôle → sélecteur » pour les cinq pages de jeu : titre de panneau, `h4.list-group-item-heading`, `.mention`, `.mini`, légendes, jauges. Contrôler le mini-profil plié et déplié à 375 et 700 px (AGENTS.md).

#### H6. Marge de 16 px (H10.1) : le JS met à zéro, en ligne et en `!important`, les marges des conteneurs mobiles

- **Où.** DESIGN « Layout & Spacing › Marge latérale mobile » et « Grille » ; EXPERIENCE « Accessibility Floor › Lisibilité » ; H10.1, H11.2.
- **Problème.** En mobile, `applyMobileCriticalStyles` (L604-636) pose en style en ligne `!important` : `padding-left` et `padding-right` à 0 sur tout `[class*="col-"]`, `.container` et `.container-fluid` ; `margin-left` et `margin-right` à 0 sur `.row` ; marge, remplissage nuls et largeur de 100 % sur `.dashboard`. Aucune feuille de style ne bat un style en ligne `!important`. La voie naturelle, une marge sur les conteneurs, est donc fermée. La marge doit venir des éléments internes, page par page, ou d'une modification de cette fonction, qui tourne sur toutes les pages mobiles, forum et plateau compris, même peau coupée (analyse JS, §8.5). Parmi les pages à corriger, Règles, Interface, Statistiques, Aide et Carte n'ont pas de classe de page ; l'index du forum n'a que la classe générale du forum.
- **Proposition.** Choisir explicitement : (a) une marge sur les enfants des conteneurs, sous des classes de page à créer ; ou (b) une gouttière mobile en jeton, appliquée par le JS (16 px au lieu de 0), avec un contrôle des zones de référence. Mentionner cette contrainte dans DESIGN.

#### H7. Grille de 4 px (H11.2) : périmètre non borné

- **Où.** DESIGN « Layout & Spacing › Grille » ; Q11 ; H11.2.
- **Problème.** « Les 10 et 15 px de Bootstrap deviennent 8, 12 ou 16 » peut viser les gouttières de la grille (`.container`, `.row`, `[class*="col-"]` à 15 px), les composants (`.panel-body` 15 px, `.panel-heading` 10 et 15 px, `.btn` et `.form-control` 6 et 12 px, `.list-group-item`, cellules de tableau 8 px) ou seulement les règles de la peau (670 espacements écrits en dur). Au bureau, toucher la gouttière de la grille décale toutes les mises en page, dont les colonnes du plateau en pourcentages (l.449-502, PLT-QU). « 10 devient 8 ou 12 selon les voisins » laisse le choix au développeur, élément par élément. En mobile, H6 s'ajoute.
- **Proposition.** Borner H11.2 dans DESIGN : liste des composants Bootstrap concernés et valeur cible de chacun. Exclure la gouttière de la grille, ou la traiter à part avec Arnaud. Remplacer « selon les voisins » par une table.

#### H8. Cartes de personnages (H7.1) : une plage de largeur de fenêtre contraire aux points de rupture

- **Où.** DESIGN « Layout & Spacing › Points de rupture », **Carte de personnage** ; EXPERIENCE « Responsive & Platform », « State Patterns » ; Q7 ; H7.1.
- **Problème.** « Entre ≈ 1100 et 1500 px de large » se traduit par `@media (min-width: 1100px) and (max-width: 1500px)`, une requête bureau en `max-width`, que la convention d'AGENTS.md interdit. Les bornes sont approximatives : le protocole N−1, N, N+1 n'a pas de N. Elles ont été mesurées avec des noms en 11 px, que H11.1 et Q7 passent à 15 px. La troncature ne suit pas la largeur de fenêtre de façon régulière (0 nom tronqué à 1024 px, 28 à 1280 px, 0 dès 1512 px) : sa vraie cause est la largeur de la carte.
- **Proposition.** Exprimer la règle sur la carte, pas sur la fenêtre : mise en page intrinsèque (avatar et nom en `flex-wrap`, le nom passe dessous quand il lui reste moins de N px, `-webkit-line-clamp: 2`) ou requête de conteneur sur la carte. Plus de requête bureau en `max-width`, et plus de plage à remesurer.

#### H9. Popups de moins de 768 px ouverts depuis l'ordinateur : règles « ordinateur » sous le seuil mobile

- **Où.** EXPERIENCE « Responsive & Platform › Popup des notifications », **Ligne de notification** ; DESIGN **Ligne de notification** ; Q6 ; H14.1, H14.2.
- **Problème.** Le popup `/report` fait 600 px : le JS y pose `body.mobile-mode` et `@media (max-width: 767px)` s'applique. H14.1 lui donne pourtant les règles « ordinateur ». Les écrire demande des styles d'ordinateur dans la requête mobile, ou hors requête : les deux contredisent AGENTS.md (« les styles mobile et desktop doivent toujours être dans leur media query respective »). `window.opener` ne suffit sans doute pas comme critère : sur téléphone, la même fonction native ouvre probablement un onglet, qui a lui aussi un `window.opener` (non vérifié). D'autres fenêtres natives sont dans le même cas, comme l'aperçu `help.php?p=prev` (600×480) ; l'aide `help` (800×480) passe, elle, en ordinateur.
- **Proposition.** Faire trancher Arnaud :
  - (a) le popup suit les règles mobiles : aucune exception, mais H14.1 et H14.2 sont à reformuler ;
  - (b) une exception écrite dans AGENTS.md : classe `html.kr-popup-bureau` posée par le JS quand `screen.width >= 768` et `innerWidth < 768`, seule garde des règles du popup.

  Étendre Q6 aux autres fenêtres natives.

#### H10. Le correctif d'ancres mobile retire `#msg…` : flèche « dernier message » et « premier non lu »

- **Où.** EXPERIENCE **Ligne de forum** (« la flèche ouvre le dernier message »), **Ligne de sujet** (« mène au premier message non lu »), parcours 2 ; refonte de l'index (H12.1).
- **Problème.** Dès l'évaluation du script, si `innerWidth < 768` et que l'URL porte une ancre autre que `#top`, le JS retire l'ancre et remonte la page en haut (L2783-2808). Les liens « premier non lu » et « dernier message » du sous-forum mènent à `#msgNNN` (analyse JS, §8.6) ; la flèche de l'index en fera probablement autant. En émulation (largeur posée avant la navigation, comme dans le protocole de vérification), le joueur arrive en haut du sujet. Sur téléphone, la largeur vaut 980 à ce moment et le correctif ne fait rien. Le comportement dépend donc de l'appareil, et la vérification à 375×667 montrerait l'inverse de la réalité.
- **Proposition.** Réduire le correctif à son but déclaré (`#flap`, L2783), ou exclure `#msg\d+`. Vérifier ensuite les deux liens en mobile.

### Medium

#### M1. Survol du bouton primaire : deux paires sous 4,5:1

- **Où.** DESIGN `components.button-primary` (`background-hover: primary-strong`), **Bouton primaire** (« encre de survol = `--kr-arm-ink-hover` actuel »), « Dériver une variante claire » ; EXPERIENCE « State Patterns » ; H5.2.
- **Problème.**
  - Paladium clair : la primaire foncée proposée vaut `#aa8c2c`, mais aucune `--kr-arm-ink-hover` n'existe en clair. Le repli du code actuel est le blanc (l.6166-6167, 13265-13266) : 3,23:1.
  - Confédération Libre sombre : `primary-strong` vaut `#6b7280` ; avec l'encre de survol `#f5f1ed`, 4,30:1. C'est pourquoi CX2 y définit `--kr-arm-bg-hover: #5f6673` (5,14:1, l.349).
- **Proposition.** Écrire le survol comme le code existant, `var(--kr-arm-bg-hover, var(--kr-primary-dark))` et `var(--kr-arm-ink-hover, …)`, et ajouter `--kr-arm-ink-hover: #1e1a15` à Paladium clair. Ajouter les paires de survol au tableau « Contrastes de référence ».

#### M2. Texte posé sur la couleur de nation (Q1) : plus de couples que les trois composants cités

- **Où.** DESIGN « Texte posé sur la couleur de nation », **Étiquette de catégorie** ; EXPERIENCE Q1.
- **Problème.** La proposition vise les boutons primaires, la barre « Envoyer » et les étiquettes. Le CSS pose aussi du texte sur la primaire ailleurs :
  - `.list-group-item.active`, titre des listes latérales, en `--kr-surface`, qui reste blanc en sombre (l.740-747) ;
  - `.bg-primary`, bandeau du sélecteur du `/report` (l.1974-1977) ;
  - page active de la pagination (l.1951-1955) ;
  - onglets et menus actifs en sombre, en `--kr-text-inverse` (l.2689-2745) : 2,81:1 en Empire Brun sombre ;
  - dossiers du kramail (l.8733-8770) et onglets de la modale (l.985, 6602) ;
  - bouton « Jouer » de l'accueil, `#fff !important` (l.11831, 12088).

  En Paladium clair, le blanc sur `#D4AF37` fait 2,10:1 dans tous ces cas ; en Paladium sombre, 1,65:1.
- **Proposition.** Énoncer Q1 comme une règle de jetons (« tout fond `--kr-primary` porte `--kr-arm-ink` ») et joindre cette liste comme périmètre d'implémentation.

#### M3. Texte en couleur de nation : tous les liens, et 47 déclarations

- **Où.** DESIGN « Mode sombre : la primaire ne sert jamais de texte », « Texte en couleur de nation, mode clair » ; EXPERIENCE Q2 ; H5.6.
- **Problème.** Q2 cite l'auteur du dernier message, l'anneau de focus et le bouton standard. Or tous les liens du site sont en accent (`a:link`, l.1979-1983) : en Empire Brun clair, chaque lien fait 2,82:1. En sombre, les liens survolés passent en primaire (l.3147-3150), et 47 déclarations écrivent `color: var(--kr-primary)` ou `var(--kr-primary-dark)` ; H5.6 cite trois cas. Remplacer `--kr-highlight` par `#8a5a00` en Empire Brun clair changerait aussi ses usages décoratifs (pastille de niveau, liseré de la pièce courante).
- **Proposition.** Créer un jeton de texte coloré (par exemple `--kr-text-accent`), défini par variante (l'accent, ou `#8a5a00` et `#044c17` pour les deux cas de Q2), employé pour tous les textes colorés, liens compris. `--kr-highlight` reste décoratif. L'audit des 47 déclarations fait partie de H5.6.

#### M4. Texte atténué : une hypothèse invérifiable, qu'un jeton remplace

- **Où.** DESIGN « Contrastes de référence » et l'hypothèse qui suit (« jamais sur le fond de page ni sur un en-tête teinté »).
- **Problème.** `--kr-text-secondary` (`#6b7280`) est employé 95 fois. Garantir qu'aucun de ces textes n'est posé sur `#f5f5f5` ou sur une teinte de H5.3 (4,17 à 4,59:1) n'est ni tenable ni vérifiable.
- **Proposition.** Foncer le jeton en clair : `#636a77` donne au moins 4,70:1 sur le blanc, sur `#f5f5f5` et sur les 8 teintes d'en-tête. L'hypothèse devient inutile.

#### M5. Jauges (H5.4) : repérage au bureau et couleurs des cartes

- **Où.** DESIGN « Jauges (H5.4) », **Jauges PV, PM, PP** ; EXPERIENCE **Jauges PV, PM, PP** ; H5.4.
- **Problème.** Au bureau, PV et PM ont la même couleur Bootstrap, donc sans doute la même classe : aucun sélecteur CSS ne les distingue (non vérifié). Le mini-profil les repère par leur texte, « PV », « PM », « PP » (L1229-1240). Sur le plateau, le cercle et la barre de PV des cartes de personnages sont colorés par niveau de santé, en dur dans le JS : vert, or, orange, rouge et rouge foncé (L4098-4104), puis vert, jaune et rouge (L4239-4245). C'est un signal d'état (H5.5), que « une couleur par jauge » effacerait.
- **Proposition.** Marquer les jauges natives par le JS (`kr-gauge-pv`, `-pm`, `-pp`, d'après leur texte). Faire dire à Arnaud si le cercle et la barre des cartes gardent leur couleur par niveau (avec la palette d'états) ou prennent le vert de la jauge.

#### M6. Palette d'états (H5.5) : les classes natives servent à la fois aux états et aux actions

- **Où.** DESIGN « Palette d'états » ; EXPERIENCE « Pages secondaires » (Contacts, Interface) ; H5.5.
- **Problème.** Les boutons de Contacts (rouge, orange, cyan, vert) et « Pas un contact » portent les classes contextuelles de Bootstrap (`.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-success`), comme les votes, qui sont un état. Une règle globale ne peut pas les séparer, et la page Contacts n'a pas de classe de page. « Voir l'historique » est un bouton du userscript (L10830-10883).
- **Proposition.** Des règles par page, avec une classe de page Contacts à créer, et une modification du bouton du userscript. Dans DESIGN, la liste des actions ordinaires concernées.

#### M7. Mode clair thémé (H5.3) : des règles globales sur toutes les pages

- **Où.** DESIGN « Teintes du mode clair (H5.3) », **En-tête de panneau et de tableau**, **Bouton standard** ; H5.3.
- **Problème.** Aucune règle claire ne vise aujourd'hui `.panel-heading`, `th`, `.btn-default` ni `.nav-tabs` : les ajouter change toutes les pages, dont le bureau du sous-forum (L6, l.14251-14413) et les panneaux du plateau. Les en-têtes DataTables portent les flèches de tri ; le kramail emploie le style DataTables par défaut (`table.display`), où ces flèches sont des images de fond qu'une déclaration `background` efface (non vérifié). Le périmètre des panneaux n'est pas dit : `.panel-default` seul, ou aussi `.panel-primary`, `.panel-info`… ?
- **Proposition.** Écrire `background-color`, jamais `background`. Borner la règle à `.panel-default` et aux tableaux `.table`. Recenser les règles sombres non chromatiques à reprendre (L15).

#### M8. Boutons (H6.1 à H6.3) : quels éléments sont des « boutons » ?

- **Où.** DESIGN « Typography » (bouton, bouton compact), « Shapes », **Bouton primaire**, **Bouton standard**, **Bouton compact** ; H6.1, H6.2, H6.3.
- **Problème.** « Normale partout, 34 px » doit épargner les `.btn-group-xs` natifs des caractéristiques (devenus des cellules d'icônes), la barre BBCode, la croix, les flèches de l'index et les boutons à icône du kramail. Passer tous les `.btn` à 4 px casse les jonctions des `.btn-group`, dont Bootstrap annule les rayons internes. Le JS pose aussi des styles en ligne que le CSS ne peut pas battre : rayon de 8 px `!important` sur les onglets de la modale (L9005), rayons et marges des fils d'Ariane et du sélecteur du kramail (`cssText`, L5396-5712 et L6961-7036), boutons de 11 px de la section « Mémorisation » de l'interface (L1991).
- **Proposition.** Ajouter à DESIGN une liste fermée des boutons concernés et des exclusions. Prévoir dans le chantier H6.3 la reprise des styles en ligne du JS. Garder les sélecteurs de groupe de Bootstrap (`:first-child`, `:last-child`).

#### M9. H1.1 : garder par page la section du forum change toutes les tables mobiles hors forum

- **Où.** EXPERIENCE **Ligne de citoyenneté** ; H1.1.
- **Problème.** Le décor « → … sujets · » vient de la 1re version du forum (l.7466-7747), écrite pour `body.mobile-mode .panel-default .table`, sans garde de page. La 2e version (`body.page-forum`, l.8158-8429) la double sur le forum. Garder la 1re par `page-forum` règle H1.1, mais toutes les tables `.panel-default` des pages mobiles hors forum perdent alors leur mise en cartes (Événements, Membres, Contacts, Statistiques…) et retrouvent leur rendu natif, peut-être plus large que 375 px.
- **Proposition.** Contrôler ces pages dans la même tâche que H1.1, ou garder une mise en cartes générique sans les suffixes du forum.

#### M10. Classes de page et gardes : un prérequis absent des documents

- **Où.** EXPERIENCE « Responsive & Platform » ; AGENTS.md (« une garde de page ajoutée à un sélecteur s'écrit `:where(html.x)` ») ; H1.2, H3.1, H5.5, H9.1, H10.1, H12.1.
- **Problème.** Plusieurs règles visent une page précise. Le JS ne pose de classe que pour l'accueil, le forum, le kramail et les événements (sur `body`), les membres et le `/report` (sur `html`). Rien pour `/jouer/*`, la rédaction du forum (`/forum/post/`), l'index du forum, Contacts, Règles, Interface, Aide, Statistiques ni la Carte. Le mode clair n'a pas de classe, et `html:not([class*="-dark"])` ajoute de la spécificité. La file InitQueue tourne aussi peau coupée : un nouveau module doit tester lui-même que la peau est active.
- **Proposition.** Un lot préalable : classes `html.kr-page-*` pour ces pages, garde de mode clair `:where(html:not([class*="-dark"]))`, test de la peau active dans chaque nouveau module.

#### M11. Règles communes aux deux supports et convention « jamais en global »

- **Où.** EXPERIENCE « Responsive & Platform » (« Identiques sur les deux supports… ») ; DESIGN « Brand & Style » ; AGENTS.md.
- **Problème.** Rayons, étiquettes, focus, jauges et grille sont « identiques sur les deux supports ». AGENTS.md demande que les styles mobile et bureau restent chacun dans leur requête, jamais en global. Le code contourne déjà la question de deux façons : des paires dupliquées (PLT-QU, l.12999-13186) et une requête vraie à toute largeur, `(max-width: 767px), (min-width: 768px)` (l.13487).
- **Proposition.** Fixer dans AGENTS.md la forme d'une règle commune : hors requête (exception assumée), ou le motif de la l.13487.

#### M12. Barre « Envoyer » fixe pendant la saisie : le clavier virtuel peut la masquer

- **Où.** EXPERIENCE **Barre « Envoyer »** (« fixe en bas de l'écran pendant la saisie »), « Interaction Primitives », parcours 3 ; DESIGN **Barre « Envoyer »** ; H1.2.
- **Problème.** Safari iOS, et Chrome Android depuis sa version 108, ne redimensionnent que le viewport visuel à l'ouverture du clavier : un élément `position: fixed; bottom: 0` (l.9617-9631) reste alors sous le clavier. Le CSS seul ne tient donc pas la promesse ; le résultat dépend du navigateur mobile cible (L9). L'émulation Chromium ne simule pas de clavier : le protocole de vérification ne le verra pas.
- **Proposition.** Suivre `visualViewport`, comme la modale d'ordre (L8775-8810), ou reformuler la règle (« en bas de la page de rédaction, visible clavier fermé »).

#### M13. Refonte de l'index du forum : faisable en JS, quatre points à préciser

- **Où.** DESIGN **Ligne de forum** ; EXPERIENCE **Ligne de forum**, parcours 2, « Interdits » ; maquette h12 ; refonte de l'index.
- **Problème.**
  - Au bureau, c'est une transformation neuve : aujourd'hui, seul le mobile remplace le tableau (module `ForumCards:MobileTransform`, L4656-4853), et ce module tourne même peau coupée.
  - La carte mobile actuelle est un seul lien englobant (L4778) : une flèche distincte demande une ligne à lien étiré (`::after`), comme les lignes du sous-forum (l.13883-13958).
  - « Heure relative » : le natif écrit déjà « Aujourd'hui (HH:MM) » ou une date (L4763-4765). Calculer « il y a 2 h » côté client dépendrait du fuseau du serveur.
  - L'icône de chaque forum n'est pas dans le tableau natif, mais dans la liste latérale native (`span.lefticon > i`, fixtures `forum-colonne-native-*.html`), source de vérité selon AGENTS.md.
- **Proposition.** Écrire dans DESIGN : libellé de date natif reformaté, sans calcul ; icône lue dans la liste latérale par correspondance d'URL, avec une icône de repli ; un seul module pour les deux supports, actif seulement avec la peau.

#### M14. « Annuler » / « Valider » (H2.1) : la méthode choisie peut toucher d'autres fenêtres

- **Où.** EXPERIENCE « Voice and Tone » ; H2.1.
- **Problème.** Le site charge Bootbox 4.4.0, dont la locale `fr` libelle la confirmation « D'accord », pas « Valider ». `setDefaults` et `setLocale` agiraient sur toutes les Bootbox, alertes et confirmations du kramail comprises, et passeraient par `unsafeWindow` (bac à sable ouvert par `@grant GM.xmlHttpRequest`). Le périmètre n'est pas écrit : modales d'ordre seulement, ou toutes les confirmations ?
- **Proposition.** Réécrire les libellés dans le DOM (`[data-bb-handler="confirm"]`, `[data-bb-handler="cancel"]`) des seules modales d'ordre, dans le module de H1. Écrire le périmètre dans EXPERIENCE.

#### M15. Vérification : les fixtures manquent pour la plupart des zones touchées

- **Où.** EXPERIENCE « Responsive & Platform › Vérification », « Foundation › Base factuelle » ; AGENTS.md (« préférer les fixtures », mandat explicite pour le site réel).
- **Problème.** Les fixtures couvrent le kramail, un sous-forum (Débuter), le plateau (structure réduite), la liste latérale du forum et le `/report`. Rien pour la modale d'ordre native, l'index du forum, la page d'un sujet en dehors des sondes de tests, Personnage, Matériel, Bâtiments, Employés, ni les pages secondaires. Les relevés de l'inventaire sont hors dépôt et ne peuvent pas y entrer bruts. Plusieurs suites figent des valeurs que les décisions changent : filet du `/report` sur la cellule de date (`report-non-lu.mjs`), planchers de 11 px du plateau (`plateau-qualite-usage.mjs`), pleine largeur du sous-forum (`sous-forum.mjs`).
- **Proposition.** Chiffrer dans le futur plan la création de fixtures synthétiques (structure relevée, données fictives) pour chaque zone touchée, et la mise à jour des suites, chacune avec sa contre-épreuve.

### Low

#### L1. Croix de 44×44 au bureau (H2.6) : position quand la modale n'a pas de titre

- **Où.** DESIGN **Modale d'ordre** ; H2.6.
- **Problème.** Sans titre, Bootbox 4.4 place la croix dans le corps, avec `margin-top: -10px` en ligne. Agrandie à 44×44, elle peut chevaucher le premier bloc (sélecteur de personnage).
- **Proposition.** Vérifier sur la fixture de H2 ; réserver la place de la croix.

#### L2. Notifications mobiles (H14.2) : le filet « non lu » est sur la cellule de date

- **Où.** DESIGN **Ligne de notification** ; H14.2.
- **Problème.** Le filet et le fond teinté sont posés sur `td:first-child` (l.654-658). Si la date passe au-dessus du texte, le filet ne couvre plus que la ligne de la date.
- **Proposition.** En mobile, porter le filet sur la ligne (`tr` en bloc) et mettre à jour `report-non-lu.mjs`. Le reste se fait en CSS seul : la date est déjà la première cellule.

#### L3. Bande vide du `/report` (H14.3) : une marge globale

- **Où.** H14.3.
- **Problème.** La bande vient du `padding-top: 60px` du `body` (l.412-419), prévu pour une barre de navigation que le `/report` n'a pas, et du `margin: 10px` en ligne du bandeau. Les autres fenêtres sans barre ont sans doute le même défaut.
- **Proposition.** Correction en CSS sous `html.kr-page-report` ; noter les autres fenêtres lors du prochain inventaire.

#### L4. En-tête de sujet étendu (H12.4) : libellés de catégorie en dur

- **Où.** DESIGN **En-tête de sujet** ; H12.4.
- **Problème.** Le JS ne reconnaît que les liens `forum/rp/` et `forum/hrp/`, et n'écrit que « Jeu (RP) » ou « Jeu (HRP) » (L6932, L6947-6953).
- **Proposition.** Lire le titre de la catégorie dans la liste latérale native (`#col-left .list-group > .list-group-item.active`), comme le veut AGENTS.md.

#### L5. « ••• » (H12.2) : un glyphe texte, pas une icône

- **Où.** DESIGN **Bouton « ••• »** ; H12.2.
- **Problème.** Le « ••• » du forum est du texte (L7229-7236) ; le kramail emploie `fa-ellipsis-v` (L5830, L5975). Une icône `fa-ellipsis-h` ne serait pas identique.
- **Proposition.** Reprendre le même glyphe texte dans les deux boutons du kramail.

#### L6. Boutons d'accès rapide (H1.5, H1.6) : présents aussi en mobile

- **Où.** DESIGN **Boutons d'accès rapide** ; H1.5.
- **Problème.** Ils sont créés sans test de mode (L8162-8198) et stylés en mobile (l.13035-13058) : ils peuvent coexister avec les onglets (non vérifié). Leur état actif n'existe pas encore.
- **Proposition.** Dire dans DESIGN s'ils sont masqués en mobile. Poser l'état actif par le JS, avec le test de chemin des onglets (L1696-1703).

#### L7. Icônes de 44×44 des cartes en mobile (H7.1, H9.1)

- **Où.** DESIGN **Carte de personnage** ; EXPERIENCE parcours 4.
- **Problème.** Les cartes vont par deux, environ 170 px de large : la rangée d'icônes tient jusqu'à trois icônes de 44 px (deux dans la maquette h07). Au-delà, elle passe à la ligne.
- **Proposition.** Relever le nombre maximal d'actions par personnage et prévoir le retour à la ligne.

#### L8. Anneau de focus unique (H5.7)

- **Où.** DESIGN **Anneau de focus** ; H5.7.
- **Problème.** `a:hover, a:focus { outline: none }` est global (l.1986-1991), avec dix autres `outline: none`. Un anneau décalé de 2 px est rogné dans les conteneurs à `overflow` (barre d'onglets défilante, puces de tri).
- **Proposition.** Employer `:focus-visible`, retirer les `outline: none`, et un décalage négatif dans ces conteneurs.

#### L9. Dépendances navigateur

- **Où.** DESIGN « Colors » (mélanges sRGB) ; EXPERIENCE « Responsive & Platform › Vrai téléphone ».
- **Problème.** Les règles s'appuieront sur `color-mix()` (déjà employé, l.654-658 et jetons `--kd-*`), `:has()` (48 emplois), `:focus-visible`, `-webkit-line-clamp`, peut-être les requêtes de conteneur (H8), et sur le CSS imbriqué déjà présent. Tous existent sur les navigateurs récents qui acceptent un gestionnaire de userscripts. Le navigateur mobile cible n'est pas nommé, alors que Chrome Android n'accepte aucune extension.
- **Proposition.** Nommer le navigateur mobile de référence dans EXPERIENCE. Aucun repli à prévoir au-delà.

#### L10. « Rien ne recouvre une information » : quelle portée ?

- **Où.** EXPERIENCE « Accessibility Floor › Lisibilité ».
- **Problème.** Sans limite, la règle vise aussi les éléments fixes existants : barre de navigation, onglets collants, barre « Envoyer », bouton « Remonter », bouton « MC » de 56×56.
- **Proposition.** La limiter à la modale d'ordre (H2.3), ou lister les éléments fixes admis.

#### L11. Croix et pièces au « rendu actuel » contre le plancher de 12 px

- **Où.** DESIGN **Croix directionnelle et pièces** ; H3.1, H8.2.
- **Problème.** La pastille « ici » fait 10,5 px (l.6390-6403) : le « rendu actuel » contredit « rien sous 12 px » et « pastilles en 12 px ».
- **Proposition.** Une exception écrite, ou le passage à 12 px dans la tâche de H3.1.

#### L12. Dossiers du kramail en onglets (H13.1) à 375 px

- **Où.** DESIGN **Onglets de section** ; EXPERIENCE parcours 3 ; H13.1.
- **Problème.** Trois onglets libellés et trois boutons de 44 px ne tiennent pas sur une ligne utile de 343 px. Les libellés et l'état actif existent dans le natif (texte des boutons, `.btn-primary` sur le dossier courant).
- **Proposition.** Préciser la disposition : deux rangées, ou barre défilante comme pour le jeu, collante ou non.

#### L13. Étiquettes et pastilles (H8.1) : classes natives partagées

- **Où.** DESIGN **Étiquette de catégorie**, **Pastille d'état** ; H8.1.
- **Problème.** `.label` et `.badge` servent à la fois aux catégories, aux compteurs d'état et aux pastilles de niveau (l.629-634, 661-668).
- **Proposition.** Une liste fermée « élément → famille » dans DESIGN.

#### L14. Carte de section (H4.1) : icône et chevron

- **Où.** DESIGN **Carte de section** ; EXPERIENCE **Carte de section**.
- **Problème.** Certains en-têtes natifs n'ont pas d'icône. Le repli posé par le JS ne vaut que pour les panneaux Bâtiment, Commerce et Matériel (L2422-2475) ; ailleurs, le repli est natif (`span.clickable`) ou absent.
- **Proposition.** Écrire « icône native si elle existe, sinon aucune » et « chevron seulement si la section se replie ».

#### L15. « Une variante ne change que les couleurs »

- **Où.** EXPERIENCE « Variantes de nation ».
- **Problème.** Des règles sombres changent autre chose que la couleur, par exemple `hr` masqué en sombre seulement (l.3115-3117).
- **Proposition.** Recenser les propriétés non chromatiques des 263 sélecteurs `-dark` avant d'écrire leurs équivalents clairs (H5.3).

## Annexe A. Faisabilité décision par décision

Moyen : **CSS** (CSS seul) ; **CSS+JS** (CSS avec une classe, un marquage ou un critère posé par le JS) ; **JS** (libellés, icônes, texte) ; **JS-DOM** (restructuration du DOM).

| Décision | Faisable | Moyen | Remarque, constats liés |
|---|---|---|---|
| H1.1 citoyenneté sans décor du forum | oui | CSS | garde de la 1re version du forum ; M9 |
| H1.2 barre « Envoyer » réservée à la rédaction | oui | CSS+JS | classe de page pour `/forum/post/` ; M10, M12 |
| H1.3 nom dans le mini-profil | bloqué sur 2 pages sur 5 | JS | C1 |
| H1.4 nom en titre du panneau latéral | bloqué sur 2 pages sur 5 | JS | C1 |
| H1.5 section en cours (accès rapide) | oui | CSS+JS | classe d'état posée par le JS ; L6 |
| H1.6 une série d'icônes | oui | JS | deux tableaux (L1627-1633, L8170-8176) ; icônes FA5 disponibles |
| H2.1 « Annuler » / « Valider » | oui | JS | M14 |
| H2.2 « Valider » à la couleur de la nation (mobile) | oui | CSS | battre le dégradé de 9d (l.1848-1851) ; M2 |
| H2.3 alerte en tête | sous réserve | JS-DOM | H1, H2 |
| H2.4 « ? Aide » en bouton standard | oui en mobile ; bureau à définir | CSS+JS | H1, H2 |
| H2.5 pastilles au-dessus des boutons, deux supports | sous réserve | JS-DOM | création au bureau, relance après Ajax ; H1 |
| H2.6 croix de 44×44 au bureau | oui | CSS | L1 |
| H2.7 onglet actif lisible (mobile) | oui | CSS | battre 9c et 9d (l.1525-1543, 1783-1790) ; H3 |
| H3.1 typographie des pages de jeu mobiles | sous réserve | CSS+JS | classe de page, table des rôles ; H5, H3 |
| H3.2 ligne d'objet image, nom, charge | oui | CSS | `order` dans le flex de PHASE 4 (l.4145-4152), DOM du Matériel à confirmer |
| H4.1 carte de section unique | sous réserve (sous-forum) | CSS+JS | icônes et chevrons ; H4, L14 |
| H5.1 primaire pour toutes les balises | oui | CSS | étendre l.1993-2006, PLT-10 et E3 à `label`, `span`, `input` ; M2 |
| H5.2 nuances claires dérivées de la nation | oui | CSS | `color-mix()` ou valeurs fixes ; M1 |
| H5.3 composants thémés en clair | sous réserve | CSS | M7, L15 |
| H5.4 une couleur par jauge | sous réserve | CSS+JS | M5 |
| H5.5 palette d'états réservée aux états | sous réserve | CSS+JS | M6, M10 |
| H5.6 primaire jamais en texte (sombre) | oui | CSS | 47 déclarations ; M3 |
| H5.7 focus unique | oui | CSS | L8 |
| H6.1 boutons de jeu en 14 px | oui | CSS | contrôle 992 à 1280 px ; M8 |
| H6.2 deux tailles de bouton | sous réserve | CSS+JS | M8 |
| H6.3 trois rayons | sous réserve | CSS+JS | rayons en ligne du JS ; M8 |
| H7.1 nom des cartes sous l'avatar | oui, autrement écrit | CSS | H8, L7 |
| H8.1 deux familles | oui | CSS | M2, L13 |
| H8.2 étiquettes en 12 px gras | oui | CSS+JS | boutons de 11 px du JS (L1991) |
| H9.1 cibles de 44 px | oui | CSS+JS | classes de page ; M10 |
| H10.1 marge de 16 px | sous réserve | CSS+JS | H6, M10 |
| H11.1 hiérarchie du bureau | sous réserve | CSS+JS | ciblage des `h4` ; H5 |
| H11.2 grille de 4 px | à borner | CSS+JS | H7, H6 |
| Refonte de l'index du forum | oui | JS-DOM | M13, H10 |
| H12.2 « ••• » partout | oui | JS | L5 |
| H12.3 un seul fil d'Ariane | oui | JS-DOM | trois implémentations à fusionner (L5313-5348, L5394-5500, L6958-7047) ; M8 |
| H12.4 en-tête de sujet étendu | oui | JS-DOM | L4 |
| H13.1 dossiers du kramail en onglets | oui | CSS+JS | L12 |
| H14.1 notifications en 14 et 15 px | sous réserve (popup) | CSS+JS | H9 |
| H14.2 date au-dessus du texte | oui | CSS | L2 |
| H14.3 bande vide supprimée | oui | CSS | L3 |
| Q1 (proposition) paire `--kr-arm-*` | oui | CSS | M2 |
| Q2 (proposition) textes d'Empire Brun et Paladium clairs | oui | CSS | M3 |

## Annexe B. Conventions d'AGENTS.md

| Convention | État dans les documents |
|---|---|
| Mobile `@media (max-width: 767px)`, bureau `@media (min-width: 768px)` | contredite par H7.1 (H8) et par le popup `/report` (H9) ; forme des règles communes à fixer (M11) |
| Garde de page `:where(html.x)` | non traitée ; classes de page à créer (M10) |
| Ne jamais précharger `/report` | respectée (« Interdits ») ; vérification sur fixture seulement (M15) |
| Liste latérale native des forums, source de vérité | respectée (menu conservé) ; à employer aussi pour les icônes de l'index et les catégories (M13, L4) |
| Ordre DOM natif des pièces, repli des icônes | respecté (croix au rendu actuel) |
| Lecture seule et mandat pour le site réel | contrainte forte pour la vérification (M15) |
