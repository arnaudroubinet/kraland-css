---
title: 'Spike : relevé en lecture seule du vrai /accueil, mobile 375 et ordinateur'
type: 'chore'
ticket: 1
created: '2026-10-30'
status: 'built'
baseline_revision: 'a2c1d92c7f5f031a88c5b7b64c7da96645dd2465'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/epic-accueil-mobile/epic-accueil-mobile.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/epic-plateau-confort-mobile/spike-releve-des-pages-mobiles-hors-fixtures-marge-cibles-et-carte-plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** l'entrée 2 (fixture réaliste) et l'entrée 3 (refonte mobile) visent un accueil connecté dont on ne connaît ni la structure réelle, ni les écarts mesurés à E10.1-E10.4 : marge du texte, cibles sous 44 px, titres hors 17 px, cartes de section.

**Approach:** relever en lecture seule le vrai /accueil connecté (mandat d'Arnaud), par le Chrome dédié (CDP 9223, chargeur dev sur 4848), à 375×667 et 320 px en émulation mobile et tactile, puis à 1280, 1440 et 1920 px. Le relevé donne l'inventaire des blocs, les mesures et un squelette DOM assaini pour la fixture, plus une proposition de cartes bloc par bloc.

## Boundaries & Constraints

**Always:** une page `ctx.newPage()` dans `browser.contexts()[0]`, fermée à la fin, sans toucher aux autres onglets ; émulation par `setViewportSize` et CDP (`setDeviceMetricsOverride`, tactile, UA mobile), coupée à la fin ; seul acte de navigation : `goto` sur /accueil ; route qui bloque toute URL `/report` ; captures, scripts et squelettes hors dépôt (`/Users/arnaud/kraland-css-captures/10.1/`).

**Never:** aucune action de jeu, aucun clic (cloche, croix, pagination, onglets du ministère, formulaires `#reconnect` et `#exit`) ; jamais `/report` ; aucune écriture de `localStorage` ; aucun HTML brut ni capture dans le dépôt ; aucun jeton, cookie, identifiant ni message privé relevé ; aucune action git ; code et tests intouchés.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Session ouverte | `#exit` présent | relevé complet | aucune |
| Session absente | formulaire de connexion | arrêt et signalement | aucune mesure |
| Cloche active | `.fa-bell + .badge` | aucun GET `/report`, route de blocage | journal des requêtes bloquées |
| Bloc masqué sur mobile | `display: none` | noté absent, mesuré sur ordinateur | aucune |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.11501-11807 -- bloc mobile `.page-accueil` : 28 règles s'appliquent à 375 (`.row`, `#col-t`, `#col-left`, `#col-right`, `.accueil-play-btn`, `.ds_user`, `.accueil-forum-section`, `.kraland-metrics`, `#player-header-section`) ; flex en colonne et `order` en `!important`.
- `kraland-theme.css` l.11179-11495 -- bloc ordinateur : 23 règles s'appliquent à 1280 (`#player-header-section`, `.kraland-metrics`, `.ds_user`, `#myCarousel`).
- `kraland-theme.css` l.6919-6930 -- marge mobile `:where(html.kr-marge-mobile)` (`body`, `.container > .row`, `footer`) : ne touche pas l'accueil (pas de classe `kr-marge-mobile`, D9.4).
- `kraland-userscript-template.js` l.307-319 -- `KR_PAGE_CLASSES`, sans motif d'accueil ; l.2128-2165 « Bienvenue » ; l.2170-2210 `Homepage:RightColumn` (bouton « Jouer » injecté après `.ds_user`, `<hr>` retirés, `h4` « Forum » et `.ds_forum` enveloppés dans `.accueil-forum-section`) ; l.3825-3850 `transformMinisterialAlert`, qui cherche une `.alert.alert-dismissible` absente du vrai accueil ce jour.
- Outils hors dépôt : `travail/commun.cjs` (ouverture, émulation, route `/report`, fermeture), `releve.cjs` (blocs, marge du texte par `Range.getClientRects`, cibles par boîte, `elementFromPoint` après `scrollTo`, titres, cartes, règles `.page-accueil` appliquées), `squelette.cjs` (squelette assaini), `sonde.cjs` (styles ciblés) ; résultats dans `travail/releve.json`.

## Tasks & Acceptance

**Execution:**
- [x] `npm run serve` déjà lancé (PID 89573, non arrêté) ; il sert le code de HEAD (sha identiques au dépôt pour `kraland-theme.css`, `kraland-userscript-template.js` et le bundle) ; `[Kraland Dev] JS chargé` vu.
- [x] Session ouverte vérifiée (`#exit`, `.ds_user`, `accueil-play-btn`) ; cloche active (badge « ! ») : aucune requête `/report` sur les cinq passes.
- [x] Relevé à 375×667, 320×667 (mobile, DPR 2, tactile, UA iPhone), 1280×720, 1440×900, 1920×1080 ; captures pleine page et écran.
- [x] Squelettes assainis à 1280 et 375 dans `structure/`.

**Acceptance Criteria:**
- Given le relevé, when on lit la note, then chaque bloc a sa structure, son premier texte, ses textes à moins de 16 px, ses cibles sous 44 px avec leur taille, ses titres, et une proposition de carte.
- Given le mandat, when on relit le journal, then aucune visite de `/report`, aucun clic, aucune écriture de `localStorage`, aucun fichier brut dans le dépôt.

## Implementation Notes

- Premier passage du 2026-10-29 : la page lue montrait l'accueil déconnecté (formulaire de connexion, pas de `#exit`). Relevé repris le 2026-10-30, session ouverte par Arnaud. Un onglet `about:blank` laissé par un script planté a été fermé par son identifiant de cible.
- **Thème** : un seul, celui actif, Empire Brun sombre (`kr-theme-variant-empire-brun-dark`). Kraland clair demande d'écrire `localStorage['kr-theme-variant']` : non fait, sans l'accord d'Arnaud. Le spike 9.3 avait trouvé des mesures identiques entre les deux variantes, à 1 px près.
- **Rendu natif** : non relevé. La route de Playwright ne voit pas les requêtes du chargeur dev, qui passent par l'extension, et la piste `kr-theme-enabled` écrit dans `localStorage`. La structure native se lit quand même dans le squelette : seuls « Bienvenue », `a.accueil-play-btn` et l'enveloppe `.accueil-forum-section` sont injectés.
- **Carrousel** : `kr-hide-carousel` est posé (réglage local d'Arnaud) ; `#myCarousel` est en `display: none` sur les cinq largeurs ; il n'a pas été vu affiché sur ordinateur.
- Contenu du jour : 4 nouvelles, 6 onglets du ministère, aucun bandeau `.alert-info`.

## Result

/accueil connecté relevé à 375, 320, 1280, 1440 et 1920 px, Empire Brun sombre, avec userscript. Aucune visite de `/report`, aucun clic, `localStorage` intact, page et émulation fermées.

Résumé : sur mobile, aucun bloc n'est une carte. Les cinq blocs visibles sont collés aux deux bords (L 0, R 0, rayon 0) et leur contenu est à 12-15 px. Il n'y a pas de débordement (`scrollWidth` 375 et 320). Seules 2 cibles sur 18 sont sous 44 px. Les titres sont à 11 et 15 px, et plusieurs textes descendent à 10-12 px. La carte ministérielle et le carrousel n'existent pas sur mobile : `#col-right` est entièrement masqué. Sur ordinateur, quatre blocs sont déjà des cartes (rayon 8, bordure 1 px).

### Inventaire des blocs (ordre DOM natif)

`#content.container > .row` contient trois colonnes, dans cet ordre DOM :

1. `#col-left.col-md-3.sidebar`
   - `div.mini-submenu` (masqué) ;
   - **Nouvelles** `#player-header-section.list-group` :
     - en-tête `span.list-group-item.active` « Nouvelles » + `span#slide-submenu.pull-right` « × » (title « Replier ») ;
     - `.panel.panel-default > .panel-body.panel-news > ul.demo` (téléscripteur, `height: 81px; overflow-y: hidden`) ;
     - 4 `li.news-item > table > tr > td` : image 40×40, `br`, `small.text-muted` (date `11/10`, `fa-calendar-o`) ; `td` : titre de 20 à 45 caractères + `a > i.fa-external-link-alt` vers `/forum/sujet/…` ;
     - `.panel-footer > ul.pagination.pull-right` (`a.prev`, `a.next`, chevrons ; masqué sur mobile) ;
   - **Compteurs** `.kraland-metrics.list-group` : 3 `a.list-group-item` (`ds_users kr-icon-members`, `ds_characters kr-icon-characters`, `ds_online kr-icon-online`) avec `h3.pull-right > i.fa-users` masqué, `h4.list-group-item-heading.count` (431, 331, 38), `p.list-group-item-text` (« Membres actifs », « Personnages actifs », « Personnes en ligne »).
2. `#col-right.col-md-6`
   - **Carte ministérielle** `.panel.panel-default` : `.panel-heading > h3.panel-title` « Message du Ministre de l'Information » (`i.fa-bullhorn`) + `span.pull-right.clickable > i.glyphicon-chevron-up` ; `.panel-body > ul#myTab.nav.nav-pills.nav-tabs` (6 `li > a[data-toggle=tab]`, drapeau 50×35 par nation) ; `#myTabContent.tab-content` (6 `div#empireN.tab-pane.fade`, une `.in.active`) ; chaque volet contient `p`, `center` (`b`, `font`, `u`, `img.img-responsive` externe, lien parfois), `div.genmsg` « Ce message a été modifié le … » ;
   - **Carrousel** `#myCarousel.carousel.slide` : 4 `.item` (`img.first-slide`…, `.carousel-caption > h1, p, a.btn.btn-lg.btn-primary` « Jouez ! », `span.mention.xmini` en `position: fixed`), indicateurs, `a.left|right.carousel-control`.
3. `#col-t.col-md-3`
   - **Bienvenue** `a.list-group-item.ds_user` : `div.pull-right > img.img-circle.ds-img` 50×50, `h4.list-group-item-heading.count` (« Bienvenue » + nom), `p.list-group-item-text` vide ;
   - **Jouer** `a.accueil-play-btn` (injecté) : `i.fa-play` + « Jouer » ;
   - **Forum** `.accueil-forum-section` (enveloppe injectée) :
     - `h4.center` « Forum » ;
     - 4 `a.list-group-item.ds_forum` ; le premier est `/aide` : `h3.pull-right > i.fa.falarge.fa-medkit`, `h4.count` « A l'aide ! », `p` « Bug ? Problème ? » ;
     - les trois autres portent `div.label.label-success|warning|danger` (« Dernier sujet lancé », « Dernier sujet actif », « Sujet le plus actif créé ce mois ») + `p.list-group-item-text` (`i.fa-comments|fa-calendar-alt|fa-circle`, titre jusqu'à 70 caractères).

Hors colonnes :

- le pied `footer.navbar-inverse` : `.footer-quote`, ligne « Mentions légales | Defkra 5 | Généré en … », `a.kraland-back-to-top`, `.kraland-css-version` ;
- les formulaires cachés `#reconnect` et `#exit`, avec jeton.

| Bloc | Mobile 375/320 | Ordinateur 1280-1920 |
|---|---|---|
| Jouer | 1er (`order: -2`), 375×48 | colonne droite, sous Bienvenue, 275×34 |
| Bienvenue | 2e (`order: -1`), 375×120 | colonne droite, en tête, carte rayon 8 |
| Forum | 3e, 375×205 | colonne droite, carte rayon 8 |
| Compteurs | 4e (`order: -1` dans `#col-left`), 3 tuiles de 125×75 | colonne gauche, grille de tuiles |
| Nouvelles | 5e, 375×164, 1 nouvelle visible sur 4 | colonne gauche, en tête, carte rayon 8 |
| Carte ministérielle | **absente** (`#col-right` en `display: none`) | colonne centrale, `.panel`, en-tête 44 px, titre 17 px |
| Carrousel | absent | masqué par `kr-hide-carousel` (réglage local) |
| Bandeau `.alert-info` | absent ce jour | absent ce jour |

Classes à 375 et 320 : `html.kr-theme-enabled.kr-theme-variant-empire-brun-dark.kr-hide-carousel`, `body.mobile-mode.page-accueil` ; ni `kr-page-accueil`, ni `kr-marge-mobile`. Sur ordinateur, `body.page-accueil`.

### Findings (375×667 ; 320 identique sauf mention)

Mesures en px depuis le bord gauche (L) et droit (R) de l'écran ; cible = largeur × hauteur.

**F1 Mise en page.** `#content` a un padding de 0, `.row` est en flex colonne avec une marge de 0. Les cinq blocs vont de 0 à 375, sans rayon ni bordure latérale, avec des séparateurs de 1 px. Aucune carte de section : les cartes ministérielle, Nouvelles et Forum d'ordinateur perdent leur rayon sur mobile. `scrollWidth` vaut 375 (320 à 320) : aucun débordement.

**F2 Jouer** (`a.accueil-play-btn`). Bandeau plein écran de 375×48, rayon 0, fond accent, texte centré 14 px gras en capitales, L 173. Ce n'est pas le bouton de 4.2 : il n'a ni marge de 8 px ni rayon.

**F3 Bienvenue** (`a.ds_user`). Flex en ligne, padding 12, hauteur 120. L'avatar rond de 56×56 est à L 12, sous la marge. Le texte « Bienvenue Thanaël » est centré, 14 px gras, L 151 (L 123 à 320). `p` est vide.

**F4 Forum** (`.accueil-forum-section`).
- Titre `h4.center` « FORUM » : 15 px gras, en capitales, couleur atténuée (`rgb(184,169,151)`), L 12, hauteur 29. Il n'est pas à 17 px et pas de la couleur du texte.
- Lignes `a.ds_forum` : 375×44-47, padding 12, donc un texte de L 12 à R 12. Les titres longs sont coupés par une ellipse (`nowrap`, `overflow: hidden`).
- Tailles : `h4.count` « A L'AIDE ! » à 14 px ; `p` à 12 px ; étiquettes `.label` à 12 px.
- Défaut visible : l'icône `fa-medkit` de 50 px recouvre « Bug ? Problème ? » sur la ligne `/aide` (capture 375).

**F5 Compteurs** (`.kraland-metrics`). Trois tuiles de 125×75, padding 12, texte centré. Valeurs `h4.count` à 14 px gras en accent ; libellés `p` à 12 px en capitales, sur deux lignes. « Personnes en ligne » est à R 14 (R 15 à 320). Il n'y a pas d'en-tête.

**F6 Nouvelles** (`#player-header-section`).
- En-tête `span.list-group-item.active` « NOUVELLES » : **11 px**, en capitales, fond accent, hauteur 46, L 15.
- Croix `span#slide-submenu` : **27×26**, atteinte au centre (`elementFromPoint`) ; la ligne d'en-tête n'est pas touchable aux bords.
- Image de la nouvelle à L 12 ; date `small.text-muted` à **10,2 px**, L 12 ; titre à 12 px, L 52.
- Lien `td > a` (icône seule) : **32×44**, atteint ; la ligne de 57 px n'est pas touchable aux bords.
- Téléscripteur : 1 nouvelle visible sur 4 (`ul.demo` de 81 px) ; pagination masquée.
- Il n'y a pas de carte : le bloc va de L 0 à R 0, et `.panel-body` a un padding de 0.

**F7 Cibles.** 18 cibles visibles, 2 sous 44 px (F6). « Jouer », Bienvenue, les 4 lignes du forum, les 3 tuiles, les liens du pied (44 de haut) et la barre (44×44, menu 48×48) passent. `a.kraland-back-to-top` (36×44, `position: fixed`) n'est pas compté : il est invisible en haut de page, à vérifier en 10.3 après défilement.

**F8 Titres et échelle.** Aucun titre de bloc n'est à 17 px : « Nouvelles » est à 11 px, « Forum » à 15 px, le nom à 14 px. Sous 12 px : la date des nouvelles (10,2 px) et la ligne « Généré en » du pied (10 px, commune). À 12 px : textes des nouvelles, libellés des compteurs, lignes et étiquettes du forum.

**F9 Pied (commun).** `.footer-quote` à 28 px, L 9 R 9 à 375 (L 15-17 à 320). La ligne « Généré en » est à R 0. C'est le même défaut que F9 du spike 9.3 : `:where(html.kr-marge-mobile) body.mobile-mode > footer` le corrige dès que l'accueil reçoit `kr-marge-mobile`.

**F10 Ordinateur (1280, 1440, 1920).**
- Aucun débordement.
- Trois colonnes : gauche 305/348/465, centre 610/696/930, droite 305/348/465.
- Cartes : Nouvelles (rayon 8, en-tête de 31 px à 13 px), carte ministérielle (en-tête 44, titre 17 px gras), Bienvenue, Forum (rayon 8).
- 12 cibles sous 44 px, hors périmètre : liens d'icône des nouvelles 16×17, pagination 40×34, croix 25×19, chevron du ministère 15×21, « Jouer » 275×34, liens du pied 14 de haut.
- À 1920, `#col-left` commence à 30 px (règles ≥ 1920, ordinateur, à laisser intactes).

**F11 Règles appliquées.** 28 règles `.page-accueil` du bloc mobile à 375, toutes en `(max-width: 767px)` : aucune règle d'accueil hors media ne s'applique. Sur ordinateur, 23 règles en `(min-width: 768px)`. `transformMinisterialAlert` n'agit pas : le message du ministre est un `.panel`, pas une `.alert` ; `kr-ministerial-card` est absent du DOM.

### Réponses aux questions ouvertes de l'épopée

**Blocs en carte de section (proposition).**

| Bloc | Proposition | Raison |
|---|---|---|
| Jouer | pas de carte : bouton de 4.2 en pleine largeur dans la marge (8 ou 16 px), hauteur ≥ 44 | action seule, sans titre |
| Bienvenue | carte sans en-tête, contenu à 16 px | avatar à 12 px ; pas de titre de section |
| Forum | carte avec en-tête « Forum » 48 px, 17 px, couleur du texte | titre et liste : forme exacte de la carte de 5.1 |
| Compteurs | carte sans en-tête, tuiles gardées dedans | une tuile propre à l'accueil serait un nouveau composant (accord d'Arnaud requis) |
| Nouvelles | carte avec en-tête « Nouvelles » 48 px, 17 px ; croix portée à 44×44 ou retirée | structure déjà `.list-group` + `.panel.panel-default`, proche de 5.1 |
| Carte ministérielle | hors carte tant qu'elle reste masquée sur mobile ; si Arnaud la veut, c'est déjà un `.panel-default` (liste commune de 5.1) | aujourd'hui absente sur mobile |

**Carrousel.** Absent sur mobile (`#col-right` masqué) et masqué sur ordinateur par `kr-hide-carousel`. Rien à faire en 10.3. **Point neuf pour Arnaud :** le même masquage de `#col-right` retire aussi le **message du ministre** sur mobile, et l'épopée ne le savait pas. Faut-il le garder absent ou le faire revenir ? S'il revient, il faut masquer le seul `#myCarousel`, avec 6 onglets de drapeaux à 50×35 à rendre touchables.

**Ordre mobile.** L'ordre actuel est confirmé : Jouer, Bienvenue, Forum, Compteurs, Nouvelles. Rien dans le relevé ne pousse à le changer. Seul défaut : « Nouvelles » est le seul contenu éditorial, et il arrive en dernier, sous les compteurs. À trancher par Arnaud, sinon l'ordre est gardé (E10.5).

**A2 pour /accueil.** Le relevé confirme l'écart : aucun texte n'est à 16 px des bords, la marge du contenu est de 12 à 15 px. La décision par défaut de l'épopée tient.

### Recommandation de découpage de 10.3

Les écarts sont peu nombreux et homogènes :

- 5 blocs visibles ;
- 2 cibles sous 44 px ;
- aucun débordement ;
- une règle de marge commune qui couvre déjà le pied.

**Ne pas redécouper 10.3.** L'entrée tient en une session : classe de page et marge, cartes pour Forum, Nouvelles, Bienvenue et Compteurs, bouton « Jouer », titres à 17 px, croix des nouvelles, textes à 12 px ou plus.

Il faut en sortir deux décisions, à trancher par Arnaud avant 10.3 :

- le message du ministre revient-il sur mobile ? Si oui, cela fait une entrée à part, après 10.3 (onglets, images externes, carrousel à séparer) ;
- le chevauchement de l'icône du forum (F4) est-il corrigé en 10.3 ? C'est un défaut d'existant ; il se règle avec la carte.

### Pour la fixture 10.2

Squelettes assainis : `/Users/arnaud/kraland-css-captures/10.1/structure/squelette-1280.txt` et `squelette-375-mobile.txt`. Ils donnent les balises, les classes, les attributs utiles et les boîtes, sans `value` ni jeton ; les `input hidden` sont masqués.

La fixture reproduit la structure **native**, sans « Bienvenue », sans `a.accueil-play-btn` et sans `.accueil-forum-section`, que le userscript injecte. Elle doit contenir :

- les `<hr>` que `Homepage:RightColumn` retire ;
- le `h4` « Forum » et les 4 `.ds_forum` en enfants directs de `#col-t` ;
- 4 nouvelles ;
- le `.panel` du ministre avec 6 onglets ;
- le carrousel à 4 diapositives ;
- un titre de forum long (70 caractères) ;
- la cloche avec badge.

Les `<hr>` ne sont pas vus, puisqu'ils sont retirés avant la lecture : leur position est à reprendre de `Homepage:RightColumn`.

Clôture : spike en revue ; aucune revue indépendante faite.

## Verification

**Manual checks (if no CLI):**
- `/Users/arnaud/kraland-css-captures/10.1/accueil_{375,320,1280,1440,1920}_empire-brun-sombre_userscript{,_ecran}.png` -- captures pleine page et écran.
- `/Users/arnaud/kraland-css-captures/10.1/travail/releve.json` -- blocs, marge, cibles avec `elementFromPoint`, titres, cartes et règles appliquées par largeur ; `requetesReport` vide sur les cinq passes.
- `git status` -- seuls ce plan et `revue-manuelle.md` changent.
