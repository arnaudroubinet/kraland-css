---
title: 'Carte de section mobile des pages de jeu ; kramail par les règles communes'
type: 'feature'
ticket: '1'
created: '2026-10-24'
status: 'built'
baseline_revision: '458dc03fcf73d2bd963b9d2f18edd6d75d8a4b3e'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/mockups/h04-entetes-section-mobile.html'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, l'en-tête de chaque `.panel-default` des pages de jeu est une carte détachée : 50,7 px, 12 px au-dessus de son contenu, rayon propre, panneau transparent collé aux bords. Le kramail suit la même règle, mais son titre est en couleur d'accent. DESIGN.md › Carte de section (H4.1, maquette h04 option A) demande un en-tête de 48 px et le contenu dans la même carte : fond `bg-surface`, rayon md, 8 px des bords, titre 17 px gras en couleur du texte.

**Approach:** La règle commune des panneaux mobiles (l.7831-7853) est réécrite en place en carte de section. Les pages du forum (entrée 2) gardent ses valeurs actuelles, par une garde de page de spécificité nulle. Les règles du module de repli passent dans le média mobile et placent leur chevron dans les 48 px. Le kramail perd seulement ses déclarations contraires (retrait, fond, couleur d'accent). Une suite `cartes-pastilles.mjs`, reprise par les entrées 2 et 3, porte la preuve.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi : règles, statuts mesurés, cibles. Tout écart est consigné au Plan Change Log avec sa raison.
- P1 option 4 : réécrire la déclaration d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau. Une déclaration déjà en `!important` le garde, avec la nouvelle valeur. Une déclaration ajoutée est sans `!important` : vérifier qu'aucune règle `!important` ne la bat (piège de la simulation : l.4352 battait le repli).
- Mobile en `@media (max-width: 767px)`, ordinateur en `(min-width: 768px)`, aucune règle mobile globale. Garde de page en `:where(…)`, spécificité nulle. La spécificité des sélecteurs réécrits reste celle de la base : (0,2,1), (0,3,1), (0,3,2).
- Carte (DESIGN.md › Carte de section) : en-tête d'au moins 48 px (`min-height: 48px` ; aucun jeton de 48 px hors croix directionnelle, précédent l.6244), retrait `0 var(--kr-space-4)`, `margin-bottom: 0`. Panneau à fond `--kr-bg-surface`, rayon `--kr-radius-md`, `margin-left/right: var(--kr-space-2)`. Corps à 16 px (inchangé). Titre `--kr-font-section-title` 700 `--kr-text-primary`. Jetons, pas de littéraux (sauf 48 px).
- Icône native du titre à gauche, telle quelle. Chevron du module sur Bâtiment, Commerce, Matériel ; chevron natif ailleurs s'il existe. Aucun ajouté (Q30.7). Chaque chevron tient dans l'en-tête de 48 px, à 16 px du bord droit.
- Forum (`body.page-forum`, `body.page-forum-racine`) égal à la base, propriété par propriété, à 375 et 767 px.
- À 768, 769, 1280, 1440 et 1920 px : tout égal à la base.
- Masques des suites existantes : feuille miroir et détecteur dans `tests/e2e/lib/variantes.mjs`, posés sur le bundle de base seulement. Chaque masque porte sa condition de retrait en commentaire.

**Ask First:**
- Toute bordure, ombre ou filet de séparation ajouté à la carte, ou tout changement du fond de page clair (A6).
- Toute page qui perd la carte hors forum, ou tout changement visible d'une modale d'ordre autre que la carte (A3).
- Tout `overflow: hidden` sur le panneau.
- Si `padding: 10px 15px` (l.4337) gagne sur un élément mesuré (tâche 3).

**Never:**
- Règle `:focus`. Kramail au-delà des règles communes (épopée 7). Forum, sous-forum, index et racine (entrée 2). Groupes de l'accordéon du plateau, `.panel-group` (entrée 3). Lignes d'index ≥ 72 px (épopée 6). Onglets (CAP-8). Marge latérale de 16 px et cibles tactiles hors en-tête (épopée 9). Icône ajoutée.
- Modifier le template JS : le module garde son comportement.
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur). Site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Panneau de jeu | jeu-materiel, jeu-batiments, jeu-employes à 375 et 767 | carte x 8, largeur vw − 16, en-tête 48 px, corps 16 px dans la même boîte, rayon 8 | titre long : l'en-tête grandit (`min-height`), pas de débordement horizontal |
| Sans corps | jeu-perso (Citoyenneté, Maladies) | carte réduite à l'en-tête de 48 px, 4 coins à 8 px | aucune icône ajoutée |
| Module | bâtiments (1er panneau), plateau Commerce et Matériel, Cybermonde Bâtiments | chevron à 16 px du bord droit, centré ; un tap sur l'en-tête replie : carte de 48 px, corps de 0 px ; un 2e tap déplie | le chevron natif reste masqué |
| Kramail | réception, envoyés à 375 et 767 | même carte, titre text-primary, corps 0 (lignes pleine largeur de la carte) | aucune règle propre au kramail ajoutée |
| Forum | sous-forum, index RP, racine | égal à la base | garde `:where(…)` |
| Thèmes | 16 variantes | titre ≥ 4,5:1 sur `bg-surface` | sombre : coins bas arrondis (A7) |
| Seuils | 767 / 768 / 769, bascule dans les deux sens dans le même onglet | carte à 767 ; base à 768 et 769 ; état du repli sans fuite à 768 | n/a |

</frozen-after-approval>

## Code Map

- Inventaire complet : annexe `story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg-inventaire.md` (sections 2 et 4).
- `kraland-theme.css` :
  - l.7831-7853 : règle commune (panneau, en-tête, titre), cœur du ticket ;
  - l.6370-6420 : module, global hors média ;
  - l.4337-4343 : `.panel-heading` mobile, `padding: 10px 15px` battu ;
  - l.4352-4354 : `.panel-body` mobile ;
  - l.8949-8966 : kramail (panneau, en-tête mort, titre) ;
  - l.8289-8316 : forum, à ne pas toucher ;
  - l.2873 : corps sombre ; l.9813 : `.panel-body` mobile non important.
- `kraland-userscript-template.js` l.2522-2575 : module `Panel Sections Collapse`, lecture seule.
- Tests :
  - nouveau `tests/e2e/cartes-pastilles.mjs`, modèle de harnais `ouvrir` de `typographie-formes.mjs` : confinement, fixtures par URL, Bootstrap embarqué, `choisirVariante`, `krReady(THEME_READY)`, `styleSettled` ;
  - `tests/e2e/lib/router.mjs` : registre `SUITES`, KEYWORDS (`/panel-heading|panel-title|list-group-item-heading/` → 9 zones), `MAX_CITING = 3` ; `tests/e2e/lib/router.test.mjs` ;
  - `tests/e2e/lib/variantes.mjs` : modèles `RAYONS_TICKET48`/`AVANT_TICKET48`, `ESPACEMENT_TICKET49`/`AVANT_TICKET49`, `VARIANTES` (16) ;
  - suites qui figent ces en-têtes : `typographie-formes.mjs` (fragments `rayons`, `espacement`, `echelle` ; un autre chantier y touche le fragment `nettoyage`, ne pas se fier à ses numéros de ligne), `kramail-redaction.mjs` (`bundleAvant()`, fragment `regression`), `cybermonde-carte.mjs`, `modale-ordre.mjs`, `palette-nation.mjs`, `jeu-identite.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/cartes-pastilles.mjs` -- créer la suite (fragments `carte`, `module`, `kramail`, `forum`, `bureau`, `bascule`, `contraste`) ; l'enregistrer au routeur (zone `cartes-pastilles`, `needsBootstrap: true`), l'ajouter aux 9 zones du mot-clé `panel-heading`, plus un mot-clé `/building-section|accordion-icon/` ; cas dans `router.test.mjs` -- rouge avant sur `317b5b7` (KR_SCRIPT, `kr-theme-enabled` vérifié avant toute mesure).
- [x] `kraland-theme.css` l.7831-7853 -- scinder en deux, sans changer la spécificité (Design Notes). (a) Les 3 règles actuelles, inchangées, gardées `body.mobile-mode:where(.page-forum, .page-forum-racine)`, commentaire « jusqu'à l'entrée 2 ». (b) La carte, gardée `body.mobile-mode:where(:not(.page-forum, .page-forum-racine))`. Commentaires « sans garde de page jusqu'au lot 5, H4.1 » mis à jour -- forum égal à la base.
- [x] `kraland-theme.css` l.4337 -- relevé CDP de la déclaration `padding` sur toutes les fixtures mobiles, par mutation sentinelle. Si elle ne gagne nulle part, la retirer, flex et `gap` gardés. Sinon, Ask First -- A12 de 4.9 soldé.
- [x] `kraland-theme.css` l.6370-6420 -- déplacer dans `@media (max-width: 767px)`. `.accordion-icon` : `position: absolute; right: 12px; top: 50%; transform` remplacés par `margin-left: auto` ; rotation seule pour `.expanded`. Repli : `padding-top/bottom: 0` (sans `!important`) et garde `:where(:not(.building-section-content.collapsed))` sur l.4352 -- carte repliée de 48 px.
- [x] `kraland-theme.css` l.8949-8966 -- retirer `margin: 0` et `background: transparent` du panneau, la règle d'en-tête morte (l.8956-8960) et `color: var(--kr-text-accent)` du titre -- kramail par les règles communes.
- [x] `kraland-theme.css` carte -- coins bas : `… .panel-default > .panel-body:last-child` à `border-radius: 0 0 var(--kr-radius-md) var(--kr-radius-md)` dans la carte (b) (A7).
- [x] `tests/e2e/lib/variantes.mjs` -- masque `CARTES_TICKET51` (miroir littéral des réécritures) et `AVANT_TICKET51` (détecteur sur une chaîne minifiée de la garde `:not(.page-forum,.page-forum-racine)`, relevée dans le bundle construit). Poser le masque sur le bundle de base des suites rouges seulement. Condition de retrait : « quand le bundle de base de la suite contient l'entrée 5.1 », le détecteur l'éteint de lui-même.
- [x] Suites existantes -- après le 1er `test:changed`, chaque suite rouge passe au masque, sans valeurs codées en dur. Liste au Plan Change Log.
- [x] `npm run build`, contre-épreuves, lint.

**Acceptance Criteria:**
- Given les 6 fixtures du ticket et regles, cybermonde, kramail-envoi, when la suite tourne à 375 et 767 px, then chaque panneau est à 8 px de chaque bord. L'en-tête mesure au moins 48 px, contient le titre et le chevron, et le corps suit sans écart dans la même boîte. Les rayons sont de 8 px. Le titre est en 17 px 700 `text-primary`.
- Given les 16 variantes, when la suite mesure le titre sur `bg-surface`, then le contraste est ≥ 4,5:1, et les 4 coins de la carte sont arrondis en sombre.
- Given un panneau du module, when on tape son en-tête deux fois, then la carte passe à 48 px puis revient à sa hauteur, dans les deux sens, sans débordement.
- Given sous-forum, index RP et racine à 375 et 767, when on compare au bundle de `317b5b7`, then géométrie, couleurs et rayons sont égaux.
- Given 768, 769, 1280, 1440 et 1920 px, when on compare au bundle de base, then les en-têtes et panneaux sont égaux. La bascule 767 ↔ 768 dans le même onglet donne la carte d'un côté, la base de l'autre.
- Given `kraland-theme.css`, when un contrôle statique lit les règles réécrites, then on ne trouve aucun `!important` nouveau, aucune règle mobile globale, ni `--kr-text-accent` ou `margin: 0` dans les règles du kramail ciblées.

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : la carte garde le rayon de 8 px aux 4 coins de l'en-tête (déclaration inchangée). Sans corps (Personnage) ou replié, la carte reste ronde en bas. Avec corps, les coins bas de l'en-tête sont de la même couleur que le panneau, donc invisibles. Un rayon « haut seulement » rendait carrés les panneaux sans corps.
  - A2 : pas de filet entre l'en-tête et le contenu. La maquette h04 en a un ; DESIGN.md › Carte de section n'en fixe pas, et le ticket ne le vérifie pas. À trancher par Arnaud (revue-manuelle).
  - A3 : la carte garde la portée d'origine de la règle commune, forum exclu (précédent A7 de 4.9). Reçoivent aussi la carte : règles, Cybermonde (dont « Bâtiments » du module), Interface, toutes les pages du kramail, panneaux `.panel-default` des modales d'ordre. Raison : une garde « pages de jeu » n'a pas de repère commun. `#col-leftest` manque sur jeu-materiel, jeu-batiments et jeu-employes. Exclure ces pages les ferait revenir au rendu natif, pas à la base.
  - A4 : le forum garde la règle commune actuelle, par une scission de l'origine. Raison : la racine (`page-forum-racine`, sans `page-forum`) tient son fond, sa marge et son rayon de cette règle. Exclure le forum de la carte seule changerait la racine. Les déclarations neuves (marge latérale, `min-height`) fuiraient sur `/forum/…`. L'entrée 2 réécrit ou retire la copie du forum.
  - A5 : le corps du kramail reste à 0 (l.8974). Les lignes du tableau portent leur propre retrait et touchent les bords de la carte. Les 16 px de Q10 valent pour un contenu en texte libre ; le reste du kramail relève de l'épopée 7.
  - A6 : en clair, la carte blanche est posée sur une page blanche. `--kr-bg-page` n'est posé qu'en sombre, et la base a déjà des en-têtes blancs sur blanc. Aucun fond de page ni bordure n'est ajouté ; le retrait de 8 px et le titre portent la carte. À consigner dans revue-manuelle.md (à trancher).
  - A7 : en sombre, `.panel-body` porte le fond surface (l.2873, global) avec des coins carrés qui débordent du panneau arrondi. Le dernier corps de la carte prend le rayon bas md, déclaration neuve sans concurrent. Pas d'`overflow: hidden` : il couperait les menus déroulants.
  - A8 : en-tête en `min-height: 48px`, pas en `height`. Un titre qui passe à la ligne, ou des boutons dans l'en-tête, l'agrandissent au lieu de déborder.
  - A9 : la cible tactile du chevron natif (`span.pull-right.clickable`) n'est pas agrandie. L'entrée 2 la fixe pour le forum (≥ 44×44) ; pour le jeu, c'est hors vérification de l'entrée 1, signalé en deferred-work.
- Simulation (bundle reconstruit hors dépôt, annexe section 4) : la cible tient sur les 13 fixtures. En-tête de 48 px, carte à x 8, pas de débordement. Forum égal à la base ; 768 et 1280 égaux à la base. Repli à 48 px seulement avec la garde de l.4352.
- Pièges :
  - Le module ne marque que le 1er en-tête dont le titre contient le nom. Seul « Bâtiments Privés » est marqué ; les titres de jeu-materiel ne contiennent ni « Matériel » ni « Commerce ».
  - Les classes du module persistent après la bascule vers 768 : vérifier qu'un panneau replié à 767 ne reste pas replié à 768. La base se comporte de même ; on mesure l'égalité, on ne corrige pas.
  - jeu-materiel : un `.panel-default.well` sans en-tête (mb 15 par `.well`) prend fond et retrait de la carte.
  - La règle d'en-tête du kramail est déjà battue partout : la retirer ne change rien. Seuls `margin`, `background` et la couleur du titre bougent. Le panneau prend alors mb 16 (l.4334).
  - MAX_CITING : si la nouvelle suite porte un repère (`panel-default`, `page-kramail`, `building-section-header`…) à 4 suites, il devient transverse. Ses sélecteurs vont alors dans `variantes.mjs` (précédent F7 de l'épopée 4). Vérifier les décomptes avec `router.test.mjs`.
  - Masques empilés (F6) : `kramail-redaction#regression` compare au bundle d'`origin/feature/next`. Le masque devient inerte après la fusion ; le détecteur doit le prouver.
  - Base capturée sans peau sous charge (F10) : vérifier `kr-theme-enabled` avant chaque capture de base, et faire la preuve finale machine calme.
  - DESIGN.md › Aujourd'hui est périmé (jeu « 20 px dans 54 px » ; kramail « primary »). La source est la mesure de l'annexe.
- Implémentation (2026-10-24) :
  - l.4337, décision par mutation sentinelle (délégation de l'appelant, sans Ask First) : `padding: 3px 7px` posé sur la déclaration, 27 fixtures mobiles à 375 et 767 px. La déclaration gagne seulement sur les en-têtes de `.panel-success`, `-warning`, `-danger`, `-info` et `-primary` (fixtures palette-nation.html et palette-nation-etats.html, « Panneau de succès »…). Aucun `.panel-default` n'est touché. Décision : la déclaration est gardée, inchangée. La retirer changerait ces panneaux d'état, hors portée de l'entrée.
  - Modale d'ordre (dormir, pouvoir ; 375 et 767) : 1re version, le panneau `with-nav-tabs panel-default` prenait une demi-carte (marge 8, fond surface, `min-height` 48, en-tête à 58 px sans retrait, règle bootbox plus forte). Constat de revue : les modales sont exclues de la carte par `.modal *` dans `:where(:not(.panel-group > *, .modal *))`. Spécificité inchangée. Elles reçoivent les règles d'avant (rattachées aux sélecteurs du forum). Géométrie égale à la base, prouvée par le fragment `forum` de `cartes-pastilles` (pages `modale-dormir` et `modale-pouvoir`, racine `.bootbox`).
  - Accordéon (`.panel-group`, kramail-repondre, typographie-echelle) : ses panneaux portent `panel-default`. La carte les exclut par `:where(:not(.panel-group > *, .modal *))` ; ils reçoivent les règles d'avant (rattachés aux sélecteurs du forum). Rendu égal à la base, prouvé par le fragment `forum` (pages `repondre` et `echelle`, racine `.panel-group`).
  - Pages exclues (famille `exclus`) : ordonnées relatives au haut de la racine, car le contenu en carte au-dessus décale l'ordonnée absolue. Un élément sans boîte (corps replié) s'écrit `sans boîte`.
  - Cybermonde « Fonctionnaires » : le chevron natif est DANS le h3 (`<h3 class="panel-title">Fonctionnaires <span class="clickable pull-right">`), à 222 px du bord et de hauteur 0, comme dans la base. Le contrôle du chevron ne vise que les enfants directs de l'en-tête. Hors vérification.
  - Repères transverses : `border-radius` et `var(--kr-text-primary)` seraient passés à 4 suites. Ils sont dans `variantes.mjs` (`RACCOURCIS_TICKET51`, `TEXTE_TICKET51`, `PANNEAU_TICKET51`).
  - Rouge avant (`KR_SCRIPT` = bundle de `317b5b7`) : 93 FAIL (carte 28, module 16, kramail 8, bascule 6, contraste 32, statique 3). FAIL vus : fond transparent, retrait latéral, écart de 12 px, chevron à 12 px, repli à 94,7 px, titre du kramail en accent. `forum` et `bureau` verts. Écart avec la Verification : `contraste` est rouge sur la base, par les coins seulement (coins carrés en sombre) ; le contraste des titres est vert partout, kramail compris (accent ≥ 4,5:1).
  - Vert après : `cartes-pastilles` 487 ok, 0 FAIL ; après revue, 519 ok, 0 FAIL (kramail 18, module 37, carte 56, contraste 96, bascule 16, forum 56, bureau 240).
  - `npm run test:zone -- cartes-pastilles typographie-formes kramail cybermonde modale-ordre palette-nation plateau` (1er passage, avant masques) : 8000 ok, 47 FAIL, tous dus à l'entrée (Plan Change Log). Après masques : chaque fragment rejoué seul, 0 FAIL.
  - `npm run test:changed` : 10966 ok, 0 FAIL (VERT). `npm run test:router` : conforme. `npm run lint:css` : 0. `npm run lint:js` : 0 (un avertissement préexistant dans `report-non-lu.mjs`).
  - Après revue : `npm run test:zone -- cartes-pastilles typographie-formes kramail cybermonde modale-ordre palette-nation plateau` : 8079 ok, 0 FAIL. `npm run test:changed` : 10996 ok, 2 FAIL dans `breakpoint-switch#nav-large` (barre de 120 px au lieu de 60 à 1100, sans lien avec l'entrée) ; rejoué seul : 37 ok, 0 FAIL (faux FAIL sous charge). `npm run test:router` : conforme. `npm run lint:css` : 0. `npm run lint:js` : 0 (même avertissement préexistant).
  - Contre-épreuves (`KR_SCRIPT` = copie mutée, suite `cartes-pastilles`), toutes rouges : marge basse de l'en-tête à 12 (50 FAIL) ; garde retirée (13 FAIL, dont 12 forum) ; accent remis au kramail (9) ; garde de l.4352 retirée (8, « carte 80 px ») ; règle du module hors média (1, statique) ; chevron en `absolute`/`right: 12px` (27) ; rayon bas retiré (71) ; `min-height: 44px` (58) ; règle mobile appliquée à 768 (30, bureau) ; exclusion `.modal *` retirée (8, `modale-dormir` et `modale-pouvoir`) ; exclusion `.panel-group > *` retirée (8, `echelle` 4 et `repondre` 4).
  - Preuve finale machine calme et `test:all` : non faits (hors mandat de l'implémenteur).

## Plan Change Log

- 2026-10-24, implémentation :
  - Accordéon exclu de la carte par `:where(:not(.panel-group > *))` (spécificité inchangée). Ses panneaux sont ajoutés aux 3 règles du forum, mêmes déclarations : rendu égal à la base.
  - Chevron Cybermonde « Fonctionnaires » (dans le h3) hors contrôle (Implementation Notes).
  - Repères à 4 suites déplacés dans `variantes.mjs` (`PANNEAU_TICKET51`, `TEXTE_TICKET51`, `RACCOURCIS_TICKET51`, `REGLES_CARTE_TICKET51`, `REGLES_KRAMAIL_TICKET51`).
  - Miroir `CARTES_TICKET51` : kramail limité à `:where(:not(.panel-group > *))` ; chevron du module avec `top` et `right` à `auto` (les déclarations retirées).
  - Masques posés sur le bundle de base (`AVANT_TICKET51`) des suites rouges au 1er `test:zone` :
    - `kramail-redaction#regression` (`CARTES_AVANT`, captures de réception et d'envoi) ;
    - `cybermonde-carte#panneaux` (paramètre `css` de `open()`, panneaux à 375 px) ;
    - `typographie-formes#nettoyage` (`ouvrirNettoyage`, champ, modale d'ordre, réception, composants).
  - Attendus mis à jour, sans masque (comparaison à une valeur, pas à une base) :
    - `palette-nation` (textes) : échantillon « titre du panneau du kramail » retiré ; le titre n'est plus en `--kr-text-accent` (entrée). Le balayage « aucun texte en primaire » le couvre toujours ;
    - `DECLARATIONS_ESPACEMENT_TICKET49` : sélecteur mobile `.panel-body` devenu `.panel-body:where(:not(.building-section-content.collapsed))` (garde de l.4352).
  - Skill `tester-kraland-css` : ligne de zone `cartes-pastilles` ajoutée (deux copies, `diff -r` vide).
  - Décision l.4337 (`.panel-heading` du mobile), par mutation sentinelle : `padding: 3px 7px` posé, 27 fixtures à 375 et 767 px. La déclaration ne gagne que sur les en-têtes de `.panel-success`, `-warning`, `-danger`, `-info` et `-primary` (palette-nation). Aucun `.panel-default` touché. Déclaration gardée, inchangée.
- 2026-10-24, après revue :
  - Modales exclues de la carte : l'exclusion devient `:where(:not(.panel-group > *, .modal *))` sur les 4 sélecteurs (spécificité inchangée). `.panel-default:where(.panel-group > *, .modal *)` est ajouté aux règles du forum (panneau, en-tête, titre). Rendu des modales égal à la base. Le miroir `CARTE_TICKET51` porte la même exclusion.
  - `AVANT_TICKET51` passe à un repère que les entrées 2 et 3 ne touchent pas : absence de `.building-section-content.collapsed{opacity:0;padding-top:0` dans le bundle. Vérifié : bundle courant `false`, 458dc03 `true`, 00b0786 `true`.
  - `REGLES_KRAMAIL_TICKET51` : `margin-right` et `margin-bottom` ajoutés (raccourci et 4 côtés).
  - Libellés statiques précisés : liste exacte des déclarations réécrites de la carte ; kramail « sans marge (raccourci et 4 côtés), fond ni --kr-text-accent ».
  - Fragment `forum` de `cartes-pastilles` : famille `exclus` ajoutée (`repondre`, `echelle`, `modale-dormir`, `modale-pouvoir`), comparée à la base sous sa racine. Le fragment `bureau` ne la lit pas. Modale ouverte par `bootbox.confirm` sur plateau.html, avec les fichiers natifs de vendor/parler.
  - `DOSSIER_MODALE_TICKET51` (`modale-ordre`) ajouté à `variantes.mjs` : sans lui, le repère passait à 4 suites.
  - Reportés par le coordinateur, non traités : chevron Cybermonde, transition de repli.

## Design Notes

Scission de l'origine (l.7831-7853), spécificité de chaque sélecteur inchangée :

```css
/* Forum : valeurs actuelles, jusqu'à l'entrée 2 */
body.mobile-mode:where(.page-forum, .page-forum-racine) .panel-default { /* 3 déclarations inchangées */ }
/* … > .panel-heading et … > .panel-heading h3 : idem */
/* Carte de section (H4.1) */
body.mobile-mode:where(:not(.page-forum, .page-forum-racine)) .panel-default {
  background: var(--kr-bg-surface) !important; border: none !important; box-shadow: none !important;
  margin-left: var(--kr-space-2); margin-right: var(--kr-space-2);
}
body.mobile-mode:where(:not(.page-forum, .page-forum-racine)) .panel-default > .panel-heading {
  /* fond, bordure, rayon, align-items inchangés */ padding: 0 var(--kr-space-4) !important; margin-bottom: 0 !important; min-height: 48px;
}
```

La carte est une seule boîte : le panneau porte le fond et le rayon ; l'en-tête et le corps sont posés dessus, sans écart.

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- cartes-pastilles typographie-formes kramail cybermonde modale-ordre palette-nation plateau` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, codes de sortie lus séparément. (`test:all` : orchestrateur.)
- Rouge avant : bundle de `317b5b7` extrait hors dépôt, `KR_SCRIPT=<ce bundle> node tests/e2e/cartes-pastilles.mjs`. FAIL attendus : hauteur (50,7), écart (12), retrait latéral (0), fond du panneau, couleur du titre du kramail, chevron du module à 12 px, repli à 95 px. Verts : `forum`, `bureau`, `contraste` hors kramail.
- Contre-épreuves (copies mutées du bundle, `KR_SCRIPT`). Chacune doit donner au moins un FAIL nommé :
  - `margin-bottom` de l'en-tête remis à 12 ;
  - garde `:where(:not(.page-forum, …))` retirée (forum touché) ;
  - `color: var(--kr-text-accent)` remis au kramail ;
  - garde de l.4352 retirée (repli à 80 px) ;
  - règles du module remises hors média, ou `.accordion-icon` à `right: 12px` ;
  - rayon bas du corps retiré (sombre) ;
  - `min-height` passé à 44 px ;
  - une règle mobile appliquée à 768.
- Largeurs : 375×667, 767, 768, 769, 1280, 1440, 1920. Variantes : Kraland clair et Empire Brun sombre pour la géométrie ; les 16 variantes pour le contraste.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, en clair et en sombre : jeu-batiments, jeu-perso, jeu-plateau-objets (replié et déplié), kramail-reception, modale-ordre/dormir. Regarder la carte (coins, chevron, titre), et vérifier qu'aucun menu déroulant n'est coupé.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css l.7864-7888, l.7177-7187 | Modale d'ordre : demi-carte (marge et fond pris, en-tête bootbox plus fort), ni base ni carte ; Ask First « changement visible d'une modale d'ordre » | fondé | patch (fixed) | `modale-ordre/dormir.html:17` ; décision d'orchestrateur : exclure les modales de la carte (`:where(:not(.modal *))`), rendu de la base gardé |
| 2 | quick | cartes-pastilles.mjs l.632 | Chevron « Fonctionnaires » du Cybermonde hors de la règle Always (dans le `h3`, à ~222 px du bord), non contrôlé | fondé | defer | identique à la base ; deferred-work.md et revue-manuelle.md |
| 3 | quick | lib/variantes.mjs l.433 | `AVANT_TICKET51` repose sur une garde du forum que l'entrée 2 retirera | fondé | patch (fixed) | repère stable à prendre |
| 4 | quick | plan, tâche 3 | Décision sur l.4337 absente du Plan Change Log | fondé | patch (fixed) | règle « tout écart au Plan Change Log » |
| 5 | quick | cartes-pastilles.mjs l.613, `PAGES` | Exclusion de l'accordéon non testée | fondé | patch (fixed) | aucune fixture à accordéon comparée à la base |
| 6 | quick | cartes-pastilles.mjs l.755, variantes.mjs l.406-410 | Contrôle statique : libellé trop large ; `margin-right`/`margin-bottom` absents de `REGLES_KRAMAIL_TICKET51` | fondé | patch (fixed) | — |
| 7 | quick | module, ~l.6407-6412 | Retrait du repli sans transition | fondé | defer | UX mineure ; revue-manuelle.md |
| 8 | quick | l.7838-7892 | Gardes `body.mobile-mode:where(...)` au lieu de `:where(html.x)` | rejeté | — | spécificité nulle, forme prévue par les Design Notes |

## Result

- Construit sur `458dc03`. Revue quick : 8 constats, 5 corrigés, 2 reportés (deferred-work.md), 1 rejeté.
- Gates (machine calme, charge 4) : `npm run build`, `lint:css`, `lint:js`, `test:router` verts ; skills identiques ; `npm run test:all` : 10998 ok, 0 FAIL en 312 s.
- Suite `cartes-pastilles` : 519 ok ; contre-épreuves : 8 FAIL chacune.
