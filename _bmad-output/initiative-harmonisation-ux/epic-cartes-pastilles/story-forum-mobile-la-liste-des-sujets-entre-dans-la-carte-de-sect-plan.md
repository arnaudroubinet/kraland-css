---
title: 'Forum mobile : la liste des sujets entre dans la carte de section'
type: 'feature'
ticket: '2'
created: '2026-10-24'
status: 'built'
baseline_revision: '21fed8db809dc149e1909add198926ef5ddda33e'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/mockups/h04-entetes-section-mobile.html'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, les panneaux du forum (sous-forum, index, racine) n'ont pas de carte. Le panneau est transparent et collé aux bords. L'en-tête du sous-forum et de l'index est une bande transparente de 45 px avec un filet bas ; celui de la racine est une pastille détachée (fond surface, rayon 8, 12 px au-dessus de la liste). Les lignes de sujet vont d'un bord à l'autre de l'écran. L'entrée 5.1 a posé la carte de section sur les pages de jeu et le kramail, et a gardé le forum égal à la base. DESIGN.md › Carte de section et R6 demandent la même carte au forum : en-tête de 48 px, liste dans la carte, 8 px des bords. La ligne de sujet garde son rendu actuel (DESIGN.md l.512, EXPERIENCE.md l.113).

**Approach:** La garde forum de la carte 5.1 tombe : la carte vaut aussi pour le forum, et la copie gardée « jusqu'à l'entrée 2 » ne garde plus que l'accordéon et les modales. Les règles du forum qui battent la carte (l.8329-8356, `#topics` l.13846, hauteurs d'en-tête l.14178 et l.14651) sont réécrites en place, sans `!important` nouveau. Les lignes de sujet, pastilles, filets et liens étirés ne changent pas. Les doublons A13 sont retirés un par un, chacun mesuré. Les suites qui figent la pleine largeur sont mises à jour. Les comparaisons à des bases figées reçoivent un masque `CARTES_TICKET52`.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi (§1 mesures, §2 règles, §3 doublons, §4-5 tests). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire la déclaration d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau. Une déclaration déjà en `!important` le garde avec sa nouvelle valeur. Une déclaration ajoutée est sans `!important` : vérifier par CDP qu'aucune règle `!important` ne la bat. Retirer une déclaration peut révéler un défaut natif : mesurer après chaque retrait.
- Mobile en `@media (max-width: 767px)`, ordinateur en `(min-width: 768px)`, aucune règle mobile globale. Garde de page en `:where(html.x)` ou `body.x:where(…)`, sans changer la spécificité des sélecteurs réécrits.
- Carte : les valeurs de la 5.1, sans en inventer. Panneau `--kr-bg-surface`, rayon `--kr-radius-md`, `margin-left/right: var(--kr-space-2)`. En-tête `min-height: 48px`, retrait `0 var(--kr-space-4)`, `margin-bottom: 0`. Titre `--kr-font-section-title` 700 `--kr-text-primary`.
- Ligne de sujet gardée telle quelle :
  - icônes d'état natives dans leurs 3 états (`i.fa.fa-folder`, `i.fa.fa-folder-open:not(.far)`, `i.far.fa-folder-open`), masquées ou visibles comme aujourd'hui ;
  - `fa-lock` visible ; pastilles `.kr-topic-badge` (NON LU, NOUVEAU MESSAGE) ;
  - filet gauche de 4 px en `--kr-status-unread` sur `tr.kr-topic-unread` / `.kr-topic-newmsg` ;
  - lien étiré `a::after` : toute la ligne répond au lien, sauf le filet de 4 px qui répond au `tr` (base) ;
  - hauteurs, retraits, flèche → (≥ 44×44), filets bas, rayon 0.
- Parité index/sous-forum du ticket 6.1 (`COMPOSANTS_MOBILE` de `forum-index.mjs`) : les deux côtés changent ensemble et la parité reste verte.
- Le contenu `.panel-heading` natif reste en place : icône à gauche, chevron natif `span.pull-right.clickable` 44×44, qui replie. Aucun chevron ajouté (racine sans chevron : rien à ajouter).
- À 768, 769, 1280, 1440 et 1920 px : tout égal à la base.
- Les masques sont posés sur le bundle de base seulement, empilables avec `CARTES_TICKET51`. Chaque masque porte sa condition de retrait en commentaire. Les repères cités par une 4e suite passent dans `lib/variantes.mjs` (MAX_CITING = 3).

**Ask First:**
- Toute bordure, ombre ou filet ajouté à la carte, ou tout changement du fond de page clair (carte blanche sur blanc, revue manuelle 5.1).
- Tout changement visible d'un fil de sujet (`forum-sujet.html`) autre que la carte de ses panneaux (A1).
- Tout `overflow: hidden` sur le panneau (couperait les menus et la pagination).
- Toute déclaration retirée qui change le rendu des lignes au-delà de l'ombre et du `scale` A13 (A4).
- Graisse du nom de forum (400 ou 700) et cellules 4/8 ou 8/8 : questions ouvertes, valeurs actuelles gardées.

**Never:**
- Règle `:focus`. Modification du template JS. Lignes d'index ≥ 72 px, marge latérale de 16 px, cibles hors en-tête (épopées 6 et 9). Lignes de sujet en cartes détachées. Accordéon `.panel-group` et modales (familles `exclus` égales à la base).
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur). Site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sous-forum | sous-forum-debuter à 375 et 767 | `#fx-permanents` et `#fx-sujets` : carte x 8, largeur vw − 16, fond surface, rayon 8 ; en-tête ≥ 48 px sans filet ; lignes dans la carte (x ≥ 8, r ≤ vw − 8) ; contrôles DataTables dans la carte | aucun débordement horizontal (`scrollWidth` = vw) |
| Ligne de sujet | lignes lues et non lues des deux tableaux | pastille, filet de 4 px `status-unread`, icônes d'état et cadenas comme la base ; tap au centre, en haut, en bas, à droite → lien ; flèche → ≥ 44×44 | hauteurs de ligne égales à la base |
| Index | forum-index-rp, forum-index-communaute, Staff (`/forum/staff`) | même carte que le sous-forum ; parité 6.1 verte | Staff : ses lignes en cartes A13 restent (A6) |
| Racine | forum-racine (sans corps ni chevron), forum-racine-groupes (corps, chevron) | même carte ; plus de pastille détachée (mb 0) ; thead « Forum » visible ; lignes dans la carte, corps 0 (A7) | racine : carte sans `.panel-body`, coins bas par la dernière ligne (A8) |
| Chevron | sous-forum, index, racine-groupes | 44×44 dans l'en-tête, dans la carte ; 1 tap replie, 2e tap déplie | repli : carte réduite à l'en-tête |
| Fil de sujet | forum-sujet à 375 | panneaux en carte (A1) ; messages inchangés | Ask First si autre chose change |
| Thèmes | 16 variantes | titre ≥ 4,5:1 sur `bg-surface` | sombre : coins bas arrondis |
| Seuils | 767 / 768 / 769, bascule dans les deux sens | carte à 767, base à 768 et 769 | état du repli sans fuite |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-inventaire.md`.
- `kraland-theme.css` (lignes de `21fed8d`, à revérifier) :
  - l.7831-7860 : copie forum + accordéon + modales (« jusqu'à l'entrée 2 ») ;
  - l.7862-7892 : carte 5.1, garde `:where(:not(.page-forum, .page-forum-racine))` ;
  - l.7894-7908 : A13 1re version (ombre, `:active` `scale`) ;
  - l.8326-8354 : forum mobile (panneau, en-tête, corps, titre) en `!important`, sans `mobile-mode` ;
  - l.8356-8596 : A13 2e version ; l.8603-8769 : `table.dataTable` ;
  - l.13846 : `#topics` en marges négatives ; l.13925-14100 : lignes `#topics` (inchangées) ;
  - l.14176-14190 : en-tête et chevron du sous-forum ; l.14192-14307 : permanents L4 (inchangés) ;
  - l.14651-14667 : en-tête, titre, chevron de l'index et de la racine ; l.14671-14692 : thead de la racine ;
  - l.4353 / l.9844 : `.panel-body` mobile (corps de la racine-groupes) ; l.2873 : corps sombre.
- Tests :
  - `tests/e2e/cartes-pastilles.mjs` : harnais `ouvrir`, fragments `carte`, `forum`, `bureau`, `bascule`, `contraste`, contrôle statique l.299-306 ;
  - `tests/e2e/lib/variantes.mjs` l.328-382 : `CARTE_TICKET51`, `REGLES_CARTE_TICKET51`, `CARTES_TICKET51`, `AVANT_TICKET51` ;
  - `tests/e2e/forum-index.mjs` : `COMPOSANTS_MOBILE` l.248-270, pleine largeur l.355-360, empreinte l.581-613 ;
  - `tests/e2e/sous-forum.mjs` : l.636, 646, 656, 668, 674 ;
  - `tests/e2e/typographie-formes.mjs` : `rayons` l.1205-1253, `nettoyage` l.1642-1700 et 1861-1866 ;
  - `tests/e2e/palette-nation.mjs` `pages4` l.1125-1150 ;
  - `tests/e2e/lib/router.mjs` (l.37, 146, 148, 174, 210) et `router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/cartes-pastilles.mjs` : le fragment `forum` passe de « égal à la base » au contrôle de carte. Contrôles : panneaux à 375 et 767, en clair et en sombre, sur sous-forum, index RP, Staff, racine et racine-groupes (fixtures ajoutées). Ajouter un fragment `lignes` : géométrie, pastilles, filet, icônes, cadenas et cibles `elementFromPoint` égaux à la base, x compris dans la carte. Contrôle de repli au chevron. Fil de sujet : messages égaux à la base. Les sélecteurs de forum vont dans `variantes.mjs` (MAX_CITING). Rouge avant sur le bundle de `21fed8d` (KR_SCRIPT, `kr-theme-enabled` vérifié avant toute mesure).
- [x] `kraland-theme.css` l.7831-7860 : retirer `:where(.page-forum, .page-forum-racine)` de la liste ; garder l'accordéon et les modales, mêmes déclarations. Commentaire « jusqu'à l'entrée 2 » mis à jour. Familles `exclus` égales à la base.
- [x] `kraland-theme.css` l.7862-7892 : retirer la garde `:where(:not(.page-forum, .page-forum-racine))` sans changer la spécificité (Design Notes). Mettre à jour `CARTE_TICKET51` / `REGLES_CARTE_TICKET51` du contrôle statique, ou les dédoubler en `…_TICKET52` (au choix, consigné).
- [x] `kraland-theme.css` l.8326-8354, réécriture en place :
  - panneau : retirer `background: transparent` ; garder `border: none` et `box-shadow: none` seulement s'ils égalent la carte 5.1 ;
  - en-tête : retirer fond transparent, `border-bottom` (A2), `border-radius: 0` et `padding: 12px 16px` (la carte donne `0 16px`) ; `margin-bottom: 0` gardé ;
  - corps : `padding: 0` gardé, sélecteur étendu à `body.page-forum-racine .panel-default > .panel-body` dans la même liste (A7) ;
  - titre : `color: var(--kr-text-accent)` retiré, taille et graisse gardées.
  Mesurer le sous-forum, l'index, Staff, la racine et le fil après chaque retrait.
- [x] `kraland-theme.css` l.14178 et l.14651 : `min-height: 44px` passe à `48px` dans les deux règles (parité). Chevron l.14184 et l.14661 : `margin` gardée ; vérifier que la cible 44×44 tient dans la carte (A5).
- [x] `kraland-theme.css` l.13846 (`#topics`) : localiser par CDP la compensation des marges négatives. Réécrire en place ce qu'il faut pour que les lignes s'arrêtent aux bords internes de la carte. Lignes, contrôles DataTables et `scrollWidth` mesurés.
- [x] A13, un par un, chacun mesuré avant et après :
  - (a) 1re version ombre, l.7899-7902 : retrait (A4) ;
  - (b) 1re version `:active` `scale(0.98)`, l.7905-7907 : retrait (A4) ;
  - (c) 2e version, l.8356-8596 : gardée tant qu'elle gagne sur Staff (A6). Retirer seulement les déclarations inertes sur toutes les fixtures, Staff compris. Reste consigné dans `deferred-work.md` A13 ;
  - (d) `table.dataTable`, l.8603-8769 : hors A13, non touché.
- [x] `tests/e2e/lib/variantes.mjs` : masque `CARTES_TICKET52` (miroir littéral des réécritures) et détecteur `AVANT_TICKET52` (chaîne minifiée relevée dans le bundle construit, absente de la base et non touchée par les entrées 3 à 6). Masque empilable avec `CARTES_TICKET51`, posé sur le bundle de base des suites rouges seulement. Condition de retrait : « quand le bundle de base contient l'entrée 5.2 ».
- [x] Suites existantes, après le 1er `test:changed` :
  - `forum-index.mjs` l.355-360 : réécrire en « lignes dans la carte » (x ≥ panneau.x, r ≤ panneau.r, 1re ligne sous l'en-tête) ;
  - `forum-index.mjs`, empreinte l.581-613 : masque ;
  - `typographie-formes.mjs` `nettoyage` : masque ;
  - `palette-nation.mjs` `pages4` : masque ;
  - `sous-forum.mjs` l.668 : vérifier, sans changer le seuil sans Ask First ;
  - `COMPOSANTS_MOBILE` : ajouter fond et marges latérales du panneau si absents.
  Aucune valeur codée en dur nouvelle hors contrôles de carte. Liste au Plan Change Log.
- [x] `tests/e2e/lib/router.mjs` : vérifier que `test:changed` sur `kraland-theme.css` (section forum) choisit `cartes-pastilles`. Sinon, ajouter la zone aux mots-clés forum (l.146, 148) et un cas dans `router.test.mjs`.
- [x] `npm run build`, contre-épreuves, lint.

**Acceptance Criteria:**
- Given sous-forum, index RP, Communauté, Staff, racine et racine-groupes à 375 et 767 px, when la suite tourne, then chaque panneau est une carte à 8 px de chaque bord, avec fond surface et rayon 8. L'en-tête mesure au moins 48 px, sans filet, avec le titre en 17 px 700 `text-primary`. Les lignes sont dans la carte, sans écart sous l'en-tête, et `scrollWidth` = vw.
- Given une ligne de sujet lue, non lue ou à nouveau message, when on la compare à la base, then hauteur, retraits, pastille, filet de 4 px, icônes d'état, cadenas et flèche → sont égaux. Un tap au centre, en haut, en bas et à droite atteint le lien.
- Given un chevron natif, when on le tape deux fois, then la carte se réduit à l'en-tête puis revient, et la cible fait au moins 44×44 dans la carte.
- Given les 16 variantes, when on mesure le titre sur `bg-surface`, then le contraste est ≥ 4,5:1.
- Given `forum-index.mjs`, when la parité 6.1 tourne, then elle est verte.
- Given 768, 769, 1280, 1440 et 1920 px, when on compare au bundle de base, then tout le forum est égal. La bascule 767 ↔ 768 dans le même onglet donne la carte d'un côté, la base de l'autre.
- Given l'accordéon et les modales, when on compare à la base à 375 et 767, then tout est égal.
- Given `kraland-theme.css`, when un contrôle statique lit les règles réécrites, then on ne trouve aucun `!important` nouveau, aucune règle mobile globale, et ni `--kr-text-accent` ni `background: transparent` dans les règles forum ciblées.
- Given `npm run test:router`, then vert.

## Implementation Notes

- Assumptions, tranchées par le planificateur :
  - A1 (sans source) : le fil de sujet (`body.page-forum` seule) suit la carte. Il porte les mêmes règles l.8329-8356, et une garde pour l'exclure demanderait une classe de page qui n'existe pas. Les messages ne changent pas : Ask First sinon.
  - A2 (DESIGN prime sur h04) : pas de filet sous l'en-tête. La carte de DESIGN et de la 5.1 n'en a pas, alors que h04 en dessine un. Les lignes gardent leur filet bas.
  - A3 (précédent du kramail en 5.1) : corps à 0, la liste touche les bords internes de la carte.
  - A4 (rendu actuel = lignes à filet) : l'ombre et le `scale` de la 1re version sont retirés. Ils ne valent aujourd'hui que pour les permanents et Staff, et les lignes `#topics` et l'index n'en ont pas. Le retour au tap reste le fond `:active` (l.8389, l.14168).
  - A5 (sans source) : le chevron garde `margin: 0 -12px 0 auto`. Avec un retrait de 16 px, la cible de 44×44 finit à 4 px du bord interne de la carte, donc à 12 px de l'écran, comme la base relative à son panneau.
  - A6 (périmètre) : Staff n'a pas `kr-page-forum-index`, et ses lignes restent les cartes A13 de la 2e version, désormais dans la carte de section. L'alignement sur l'index relève d'un autre ticket : consigné dans `deferred-work.md`.
  - A7 (index et racine suivent le sous-forum, épopée) : la racine-groupes perd son corps de 16 px.
  - A8 (sans source) : `forum-racine.html` n'a pas de `.panel-body`. Ses coins bas viennent du rayon du panneau ; vérifier en sombre qu'aucune ligne ne dépasse les coins arrondis. Si elles dépassent, Ask First plutôt qu'un `overflow: hidden`.
  - A9 (note d'épopée périmée) : l'Open question « cartes détachées ou filet » est tranchée par la mesure, puisque la base est déjà à filet. La note est mise à jour au Plan Change Log, pas dans l'épopée.
- Pièges :
  - P1 : l.8329-8356 n'exigent pas `mobile-mode`, sont en `!important` à la même spécificité que la carte et viennent après elle. Toute carte écrite avant perd ; seule la réécriture de ces origines marche.
  - P2 : les déclarations sans `!important` de la carte 5.1 (marges latérales l.7868, `min-height` l.7879, rayon du dernier corps l.7893) perdent contre les `!important` du forum sur la même propriété, d'où l.14178 et l.14651 à réécrire.
  - P3 : L4 (0,5,5 et plus) et `#col-right` (1,x,x) battent toute règle de carte en `body.mobile-mode…`. Ne pas toucher les lignes par la carte.
  - P4 : `#topics` sort de sa boîte par marges négatives (l.13846). Une fois dans la carte, il déborderait de 16 px.
  - P5 : la racine n'a pas `page-forum` mais porte `kr-page-forum-index`. Staff a `page-forum` sans `kr-page-forum-index`. La branche `.page-forum-racine` de la 1re version ne sert jamais.
  - P6 : en sombre, le corps a un fond surface (l.2873) ; en clair, il est transparent. Vérifier les coins bas dans les deux cas.
  - P7 : en clair, la carte est blanche sur une page blanche, comme en 5.1. Rien n'est ajouté (Ask First).
  - P8 : l'index et la racine n'ont aucune ligne non lue dans les fixtures. Le filet non lu ne se vérifie qu'au sous-forum.
  - P9 : MAX_CITING. `page-forum`, `kr-page-forum-index`, `panel-default`, `fx-permanents`, `kr-text-primary` et `kr-bg-surface` sont déjà à 3 suites : ne pas les écrire en clair dans une 4e.
  - P10 : faux FAIL sous charge (rétro 4, F10). Rejouer la suite seule, machine calme, `kr-theme-enabled` vérifié.
  - P11 : masques empilés (F6). Le masque 5.2 se pose avec celui de la 5.1 sur les bases antérieures à `317b5b7` (`00b0786`, `81512a3`, `5ff22d3`).
- Décisions de construction (2026-10-24, détail dans `revue-manuelle.md`, « Ticket 5.2 ») :
  - A1 sans objet : `forum-sujet.html` n'a aucun `.panel`, le fil reste égal à la base (contrôlé à 375 et 767, clair et sombre).
  - A8 : en sombre, la dernière ligne opaque de la racine recouvre les coins bas arrondis. Rendu de base gardé, sans `overflow: hidden` ni rayon ; reporté dans `deferred-work.md`.
  - P7 : rien ajouté, comme en 5.1.
  - Hauteur des lignes : la carte retire 16 px de largeur ; à 375 px, « Gagner des PA » et « Kayak Portable » passent de 106,9 à 127,1 px (auteur à la ligne). Accepté. Le fragment `lignes` exige l'égalité de hauteur sauf si une rangée de texte s'ajoute (rangées regroupées à 4 px près), et alors une ligne plus haute ; la largeur égale ou réduite du retrait, l'ancrage (gauche, droite ou centré) conservé.
  - Staff (A6) : chevron natif de 10 × 14 px et croix d'alerte comme la base ; le contrôle du chevron compare à la base sous 44 px, sinon exige 44 × 44. Reporté dans `deferred-work.md`.
  - A13 (c) : 17 déclarations inertes retirées après bisection, le reste gardé pour Staff, reporté. La règle vidée « Ajouter "sujets · " » (`::after` vide) est retirée.
  - `#topics` (l.13846) : non touché. Ses marges négatives compensent le retrait de 16 px de `#topics_wrapper` ; les lignes s'arrêtent déjà aux bords internes de la carte. La barre de tri (`thead tr`, `overflow: auto hidden`) défile, comme la base : le contrôle exclut le contenu des défileurs.
  - `sous-forum.mjs` l.668 (seuil 0,95 inchangé) : les en-têtes de 48 px poussaient le 1er sujet à 636/667. `#topics_wrapper` passe de `padding: 12px 16px 4px` à `6px 16px 4px` : 630 px, comme la base.
  - Pagination L5 à 320 px : 304 px de boutons dans 272 px de contenu, 8 px hors écran. `.dataTables_paginate` passe à `flex: 0 0 calc(100% + 32px)` et `margin: 8px -16px 0` (réécriture en place, `!important` existant) : largeur de la carte, même position que la base de 336 à 767 px.
  - Contrôle statique : `CARTE_TICKET51` / `REGLES_CARTE_TICKET51` dédoublés en `CARTE_TICKET52` / `REGLES_CARTE_TICKET52` (`variantes.mjs`), la 5.1 inchangée pour les bases antérieures.
  - Routeur : les mots-clés forum et sous-forum restent tels quels (y ajouter la zone cassait 7 tests). Un mot-clé dédié (panneaux de `page-forum`, `page-forum-racine`, `kr-page-forum-index`, `kr-subforum`) choisit `cartes-pastilles`, avec un cas dans `router.test.mjs`.

## Plan Change Log

- 2026-10-24, construction :
  - `kraland-theme.css`, en plus des tâches : `#topics_wrapper` retrait haut 12 → 6 px et pagination du sous-forum à la largeur de la carte (Implementation Notes) ; règle vidée `td:nth-child(2)::after` retirée.
  - Suites modifiées : `cartes-pastilles.mjs` (fragments `forum`, `lignes`, `chevron`), `forum-index.mjs` (« lignes dans la carte » au lieu de « pleine largeur » ; `COMPOSANTS_MOBILE` : fond et marges latérales du panneau ; masques `CARTES_TICKET51` puis `CARTES_TICKET52` sur le bundle « avant » de `hors-perimetre`), `typographie-formes.mjs` (`nettoyage` : masque `CARTES_TICKET52` empilé), `palette-nation.mjs` (`pages4` : masques 5.1 puis 5.2 sur le bundle d'avant, option `cartes`), `lib/variantes.mjs` (repères, masque, détecteur), `lib/router.mjs` et `router.test.mjs` (fragments `lignes`, `chevron`, mot-clé des panneaux du forum), skill `tester-kraland-css` (deux copies).
  - `sous-forum.mjs` : inchangé, seuils et tolérances compris.
  - Masque `CARTES_TICKET52` : valeurs littérales (titre en 17 px), car `--kr-font-section-title` n'existe pas dans la base `81512a3`.
  - `test:changed` non lancé : il s'élargit au total (`variantes.mjs` modifié, capture non suivie à la racine), ce qui équivaut à `test:all`, réservé à l'orchestrateur. Remplacé par les zones `cartes-pastilles forum sous-forum typographie-formes palette-nation`, puis `cybermonde kramail`.
  - Note d'épopée (A9) : l'Open question « cartes détachées ou filet » est tranchée par la mesure (lignes à filet), non reportée dans l'épopée.
- 2026-10-24, après revue :
  - `cartes-pastilles.mjs`, fragment `chevron` : sous-forum (2 chevrons), index RP et racine-groupes (1 chevron chacun), à 375 et 767 px, clair et sombre. Les fixtures de l'index et de la racine n'embarquent pas le repli natif (main.js du site) : il est recopié de `sous-forum-debuter.html` et posé après chargement sur ces deux pages. Contre-épreuve : chevron poussé de 12 px (marge −24 px) : 16 FAIL. Le fragment passe sur la base `21fed8d` : il contrôle le repli et la place du chevron, que la base remplit déjà ; la carte reste contrôlée par `forum`.
  - Fragment `contraste` : `sous-forum` et `index-rp` ajoutés (titre ≥ 4,5:1 sur son fond, 16 variantes). Rouge sur la base : 16 FAIL (coins de l'index).
  - `controlerCarte` : l'exemption « chevron de base sous 44 px » ne vaut plus que pour Staff (paramètre `chevronNatif`) ; ailleurs, 44 × 44 exigé.
  - `forum-index.mjs` : « lignes dans la carte » exige aussi une carte à 8 px au moins des bords de l'écran ; rouge sur la base `21fed8d` (4 FAIL, RP et Communauté, clair et sombre). Commentaire d'en-tête mis à jour.
  - `typographie-formes.mjs`, fragments `rayons` et `espacement` (K7, K8) : inchangés, car ils ne contrôlent le forum qu'au bureau.

## Design Notes

Spécificités à préserver :

| Règle | Avant | Après |
|---|---|---|
| copie l.7831 (accordéon, modales) | `body.mobile-mode .panel-default:where(…)` (0,2,1) | inchangé, branche forum retirée |
| carte l.7864 | `body.mobile-mode:where(:not(…)) .panel-default:where(:not(…))` (0,2,1) | `body.mobile-mode .panel-default:where(:not(.panel-group > *, .modal *))` (0,2,1) |
| forum l.8329 / 8336 / 8347 / 8351 | (0,2,1) / (0,3,1) / (0,3,1) / (0,3,2) | identiques ; l.8347 reçoit une 2e branche `body.page-forum-racine …` (0,3,1) |
| l.14178 / l.14651 | (0,4,1) / (1,2,0) | identiques, valeur seule |

Pourquoi réécrire l.8329-8356 au lieu de les retirer en bloc : `padding: 0` du corps et `margin-bottom: 0` de l'en-tête restent nécessaires. Le titre garde sa taille par ces règles sur Staff et le fil.

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- cartes-pastilles forum sous-forum typographie-formes palette-nation` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js`. Attendu : 0 FAIL, codes de sortie lus séparément. Pas de `test:all` (orchestrateur).
- Rouge avant : extraire hors dépôt le bundle de `21fed8d`, puis `KR_SCRIPT=<ce bundle> node tests/e2e/cartes-pastilles.mjs`. FAIL attendus :
  - retrait latéral 0 ;
  - fond du panneau transparent ;
  - en-tête de 45 ou 44 px, avec filet (sous-forum, index) ou pastille mb 12 (racine) ;
  - lignes pleine largeur ;
  - corps de 16 px (racine-groupes) ;
  - ombre des permanents.
  Verts : `lignes` hors x, `bureau`, `exclus`, `contraste`.
- Contre-épreuves sur des copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - garde `:where(:not(.page-forum, …))` remise (forum sans carte) ;
  - `background: transparent` remis l.8329 ;
  - `border-bottom` remis à l'en-tête ;
  - `min-height` 44 remis sur l.14178 seule (parité 6.1 rouge) ;
  - marges négatives de `#topics` remises (débordement) ;
  - `border-left-color` non lu retiré (ligne de sujet) ;
  - `a::after` retiré (cible) ;
  - une règle mobile appliquée à 768 ;
  - accordéon retiré de la copie l.7831 (`exclus` rouge).
- Largeurs : 375×667, 767, 768, 769, 1280, 1440, 1920. Géométrie en Kraland clair et en Empire Brun sombre, contraste dans les 16 variantes.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, en clair et en sombre : sous-forum (déplié, puis replié par le chevron), index RP, Staff, racine, racine-groupes, fil de sujet. Regarder les coins de la carte, le chevron, les pastilles et le filet non lu. Vérifier que la pagination et la recherche DataTables ne sont pas coupées.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css l.7841-7856, l.8317-8338 | Accordéon ou modale `.panel-default` posé sur une page `/forum/*` prend désormais la copie (fond surface, rayon md) au lieu du rendu forum de la base | plausible | defer | aucune fixture du forum avec modale ou accordéon ; deferred-work.md et revue-manuelle.md |
| 2 | quick | cartes-pastilles.mjs l.615 | Repli au chevron testé sur le sous-forum seul ; matrice : sous-forum, index, racine-groupes | fondé | patch (fixed) | — |
| 3 | quick | cartes-pastilles.mjs l.723 | Contraste 16 variantes non mesuré sur le forum | fondé | patch (fixed) | fragment `contraste` sur `['bat', 'reception']` |
| 4 | quick | cartes-pastilles.mjs l.698 | Bascule 767 ↔ 768 non étendue au forum | fondé | defer | le forum recharge au changement de seuil (sous-forum.mjs l.924) |
| 5 | quick | forum-index.mjs l.358 | « Lignes dans la carte » passe aussi sur la base | fondé | patch (fixed) | panneau et lignes de 0 à vw dans la base |
| 6 | quick | forum-index.mjs l.5 | Commentaire d'en-tête périmé (« pleine largeur ») | fondé | patch (fixed) | — |
| 7 | quick | cartes-pastilles.mjs `controlerCarte` | Exemption « chevron de base sous 44 px » valable pour toute la famille forum, pas Staff seul | fondé | patch (fixed) | — |
| 8 | quick | garde `:not(.page-forum…)` retirée | Toutes les pages `/forum/*` (réponse, recherche, modération) entrent dans la carte, non vérifiées hors fixtures | plausible | defer | cohérent avec le plan ; à regarder sur capture (revue-manuelle.md) |
| 9 | quick | Plan Change Log | Fragments `rayons` et `espacement` (K7, K8) inchangés sans mention | fondé | patch (fixed) | ils ne contrôlent le forum qu'au bureau |
| 10 | quick | l.13743, l.13800, l.14281 | Réécritures `#topics_wrapper` et pagination L5 hors tâches | rejeté | — | justifiées, sans effet de bord à 320/375/767 ; consignées |

## Result

- Construit sur `21fed8d`. Revue quick : 10 constats, 6 corrigés, 3 reportés (deferred-work.md), 1 rejeté.
- Gates : `npm run build`, `lint:css`, `lint:js`, `test:router` verts ; skills identiques ; `npm run test:all` : 11310 ok, 1 FAIL de charge (`demarrage-mobile#desktop`, « /forum : au plus 4 documents en 6 s », charge ~19), vert rejoué seul (`KR_FRAG=desktop node tests/e2e/demarrage-mobile.mjs`).
- Suite `cartes-pastilles` : 896 ok ; rouge avant sur `21fed8d` ; contre-épreuves toutes rouges.
