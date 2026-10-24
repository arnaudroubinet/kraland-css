---
title: 'Groupes du plateau mobile dans la carte de section'
type: 'feature'
ticket: '3'
created: '2026-10-24'
status: 'built'
baseline_revision: 'a7f0463d8bd16fd099edc14677a62d81913724d9'
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
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-groupes-du-plateau-mobile-dans-la-carte-de-section-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-carte-de-section-mobile-des-pages-de-jeu-kramail-par-les-reg-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/mockups/key-plateau-mobile.html'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur le plateau mobile, les groupes (`.dashboard-section`, accordion posé par le JS) ne suivent pas la carte de section. La section va d'un bord à l'autre (x 0), avec une ombre. L'en-tête mesure 23 px, avec un retrait `3px 8px` et un filet gauche primaire (3 px pour « mon groupe », 4 px pour les autres). Le titre est en 12 px 600, en capitales. Le chevron est posé en absolu à 15 px du bord. La grille a un retrait `8px 6px`. Une fois repliée, elle garde 16 px de retrait : la section repliée fait 39 px. Les entrées 5.1 et 5.2 ont posé la carte sur les `.panel-default`, mais les groupes ne sont pas des panneaux et n'en profitent pas. DESIGN.md › Carte de section et la maquette key-plateau-mobile demandent la même carte : 8 px des bords, en-tête de 48 px, titre 17 px 700, chevron à droite, cartes de personnages dans la carte.

**Approach:** Réécrire en place les règles mobiles du bloc « DASHBOARD MOBILE » (l.5754-5838) et la règle mobile des en-têtes de groupe (l.13257), sans aucun `!important` nouveau. Une seule règle est ajoutée, pour le titre de groupe : aucune origine mobile n'existe pour lui. Le JS (accordéon, état initial, ordre DOM) ne change pas. La fixture `plateau-qualite-usage.html` passe à un `.dashboard` natif de deux groupes, pour que `transformDashboardToFlexCards` et l'accordéon tournent comme sur le site. Le fragment `groupes` de `cartes-pastilles.mjs` contrôle la carte. Les suites qui figent la fixture ou le rendu reçoivent le masque `CARTES_TICKET53`.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi : §1 mesures de base, §2 règles, §3 JS, §4 fixtures, §5 tests. Tout écart va au Plan Change Log, avec sa raison.
- P1, option 4 : réécrire la déclaration d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau. Une déclaration ajoutée est sans `!important` : vérifier par CDP qu'aucune règle `!important` ne la bat (l.4318 : la grille est en `!important` sur `grid-template-columns` et `gap` seulement). Retirer une déclaration peut révéler un défaut natif : mesurer après chaque retrait.
- Mobile en `@media (max-width: 767px)` et `body.mobile-mode`. Ordinateur en `(min-width: 768px)`. Aucune règle mobile globale. Garde de page éventuelle en `:where(html.x)`. La spécificité des sélecteurs réécrits ne change pas (Design Notes).
- Valeurs de la carte de la 5.1, sans en inventer :
  - section : fond `--kr-bg-surface`, rayon `--kr-radius-md`, `margin-left/right: var(--kr-space-2)` ;
  - en-tête : `min-height: 48px`, retrait `0 var(--kr-space-4)` ;
  - titre : `--kr-font-section-title`, 700, `--kr-text-primary`.
  Aucun rayon littéral non nul (fragment `rayons`).
- JS intact :
  - « mon groupe » ouvert, les autres groupes fermés au chargement ;
  - un tap sur l'en-tête plie ou déplie ; un tap sur `.dashboard-group-buttons` ne plie pas ;
  - Entrée et Espace ; `aria-expanded`.
- Ordre DOM natif des groupes et des cartes de personnages conservé. Contenu des cartes inchangé : pastille de niveau (Q30.1), « PNJ » (entrée 5), PV, statut.
- Aucune icône ajoutée (Q30.7, hypothèse de l'épopée). Une icône native présente dans le titre (`img`) reste à gauche du titre.
- Inchangés : badge de l'en-tête (`formes`), boutons de groupe et leur taille de 28 px (épopée 9), règle `:focus-visible` existante (l.13277).
- À 768, 769, 1280, 1440 et 1920 px : tout est égal à la base, filet gauche de 4 px compris.
- Mini-profil plié et déplié à 375 et 700 px égal à la base, sur `plateau-minimal` et sur `plateau-qualite-usage`.
- Masques posés sur le bundle de base seulement, empilables avec `CARTES_TICKET51` et `CARTES_TICKET52`. Chaque masque porte sa condition de retrait en commentaire. Les sélecteurs de groupe passent dans `lib/variantes.mjs` (MAX_CITING = 3).

**Ask First:**
- Toute bordure, ombre ou filet ajouté à la carte. Tout retour du filet gauche « mon groupe » (A3).
- Tout changement du JS : texte « Groupe » retiré du titre, état initial, structure de l'en-tête.
- Toute icône d'en-tête, ce qui veut dire trancher Q30.7 autrement.
- Tout changement visible des cartes de personnages autre que leur position dans la carte.
- Un contrôle d'une autre suite qui casse pour une raison autre que la fixture étendue ou la carte.

**Never:**
- Règle `:focus`. Modification du template JS.
- Marge latérale de 16 px. Cibles hors en-tête, dont les boutons de groupe de 28 px (épopée 9). CAP-8.
- `btn-group-xs` dans la fixture des groupes : `plateau-profil-mobile` dérive la fixture par regex.
- Données réelles dans la fixture : noms et structure synthétiques, aucune capture brute.
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur). Site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mon groupe | plateau-qualite-usage étendue, 375 et 767, clair et sombre | section : x 8, largeur vw − 16, fond surface, rayon 8, sans ombre. En-tête ≥ 48 px, retrait 16, sans filet. Titre 17 px 700 `text-primary`, sans capitales. Chevron dans le flux, bord droit à 16 px du bord de la carte. Grille ouverte, cartes à 8 px des bords de la carte | `scrollWidth` = vw |
| Autre groupe | même page | fermé au chargement : section réduite à son en-tête (48 px), aucune carte touchable, cartes toujours dans le DOM | — |
| Accordéon | tap sur l'en-tête de chaque groupe, deux fois | ferme puis ouvre, `aria-expanded` suit, chevron tourné | défiler par `scrollTo`, puis `elementFromPoint` = en-tête avant le tap |
| Boutons de groupe | tap sur un `a.btn` de l'en-tête | l'état du groupe ne change pas | — |
| Titre long | groupe au nom long | l'en-tête grandit (≥ 48 px), sans débordement | `scrollWidth` = vw |
| Ordre | les deux groupes | ordre des sections et des cartes = base | — |
| Mini-profil | plateau-minimal et plateau-qualite-usage, 375 et 700, plié et déplié | égal à la base | — |
| Thèmes | 16 variantes | titre ≥ 4,5:1 sur `bg-surface` | — |
| Seuils | 767 / 768 / 769, bascule 767 ↔ 768 dans les deux sens, même onglet | carte à 767 ; base à 768 et 769 | aucun état replié visible à 768 |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-groupes-du-plateau-mobile-dans-la-carte-de-section-inventaire.md`.
- `kraland-theme.css` (lignes de `a7f0463`, à revérifier) :
  - l.2444 `.dashboard-section` et l.2451 `.dashboard-section-header` : globaux, servent aussi l'ordinateur, non touchés ;
  - l.2489 `.dashboard-group-title` : global, capitales ;
  - l.3171 `.dashboard-section` en sombre : non touché ;
  - l.4318 : grille mobile en `!important` (colonnes et écart seulement) ;
  - l.5754-5810 : accordéon (en-tête, `:active`, chevron, grille, `.collapsed`) ;
  - l.5815 : section (mb 10) ;
  - l.5822 : en-tête « mon groupe » (fond `bg-hover`, filet de 3 px) ;
  - l.5830 : grille (2 colonnes, retrait `8px 6px`) ;
  - l.6047-6066 : boutons de groupe mobiles, non touchés ;
  - l.13231 : en-tête ordinateur, non touché ; l.13257 : en-tête mobile (fond `bg-elevated`, filet de 4 px) ; l.13277 : `:focus-visible`, non touché.
- `kraland-userscript-template.js` (lecture seule) :
  - l.2242-2346 : accordéon, priorité 70 ;
  - l.4051 : `extractGroupData` ;
  - l.4386 : `transformDashboardToFlexCards`.
- `tests/e2e/fixtures/plateau-qualite-usage.html` : section prébâtie, à remplacer (annexe §4).
- Tests :
  - `tests/e2e/cartes-pastilles.mjs` : `ouvrir` l.109, `controlerCarte` l.244, `COMMIT_AVANT` l.49, fragments `contraste` et `bascule` ;
  - `tests/e2e/lib/variantes.mjs` l.328-438 : repères et masques 5.1 et 5.2, `poserJetonsRedefinis` ;
  - `typographie-formes.mjs` : `nettoyage` (masques l.1865), `formes` l.159-160 et l.312-337, `rayons` ;
  - `plateau-qualite-usage.mjs`, `plateau-profil-mobile.mjs` (regex l.42-44), `fin-initialisation.mjs` l.83, `palette-nation.mjs` l.196 et l.629 ;
  - `tests/e2e/lib/router.mjs` (mots-clés l.162-183) et `router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/plateau-qualite-usage.html` (A1) : remplacer la section prébâtie par un `.dashboard` de deux `.panel` natifs, comme `extractGroupData` les lit :
  - « Groupe Nerys », avec membres, qui devient « mon groupe » ;
  - un second groupe au nom long ;
  - chacun avec un `a.btn` dans le `.panel-title` et deux membres, dont un PNJ.
  Le premier `.dashboard-section-header` de la page reste un en-tête de groupe. Garder le reste de la fixture tel quel. Vérifier que la regex de `plateau-profil-mobile` (l.42-44) trouve toujours son bloc.
- [x] `tests/e2e/cartes-pastilles.mjs`, fragment `groupes` :
  - base `COMMIT_AVANT_53 = 'a7f0463'`, surchargeable par `KR_SCRIPT_AVANT` (A6) ;
  - contrôles à 375 et 767, en Kraland clair et Empire Brun sombre, selon la matrice : géométrie de la carte, en-tête, titre, chevron, cartes à 8 px, second groupe fermé, accordéon dans les deux sens, boutons sans effet, titre long, ordre DOM égal à la base ;
  - mini-profil plié et déplié à 375 et 700 égal à la base ;
  - 768, 769, 1280, 1440 et 1920 égaux à la base ; bascule 767 ↔ 768.
  Étendre `contraste` à la page des groupes (16 variantes). Les sélecteurs vont dans `variantes.mjs`. Rouge avant sur le bundle de `a7f0463` (KR_SCRIPT, `kr-theme-enabled` vérifié avant toute mesure).
- [x] `kraland-theme.css`, réécriture en place :
  - l.5754, en-tête d'accordéon : ajouter `min-height: 48px` et `padding: 0 var(--kr-space-4)` ;
  - l.5772, chevron : retirer `position`, `right` et `top` ; `transform: rotate(0deg)` ; ajouter `margin-left: auto` (comme le module, l.6389) ;
  - l.5786 : `transform: rotate(-180deg)` ;
  - l.5805, `.collapsed` : ajouter `padding-top: 0` et `padding-bottom: 0` (comme le module, 5.1) ;
  - l.5815, section : `margin: 0 var(--kr-space-2) 10px`, `background: var(--kr-bg-surface)`, `box-shadow: none` (A4, A5) ;
  - l.5822 : règle retirée, ses deux déclarations deviennent sans objet (A3) ;
  - l.5830, grille : `padding: var(--kr-space-2)` (A2) ;
  - l.13257, en-tête mobile : `background: var(--kr-bg-surface)`, `border-left` retiré, `color` gardé.
  Mesurer les deux groupes après chaque retrait.
- [x] `kraland-theme.css`, bloc 4d : ajouter `body.mobile-mode .dashboard-group-title` avec `font-size: var(--kr-font-section-title)`, `font-weight: 700`, `text-transform: none`, `letter-spacing: normal` (A7). C'est la seule règle nouvelle : la règle d'origine (l.2489) sert aussi l'ordinateur. Titre long : si `scrollWidth` > vw, ajouter `min-width: 0` à cette règle.
- [x] `tests/e2e/lib/variantes.mjs` :
  - masque `CARTES_TICKET53`, miroir littéral des réécritures, en valeurs littérales si un jeton manque dans une base ancienne (précédent 5.2) ;
  - détecteur `AVANT_TICKET53` : chaîne minifiée relevée dans le bundle construit, absente de la base et non touchée par les entrées 4 à 6. Exemple : `.dashboard-section-header-accordion .accordion-icon{position:absolute`, présente dans la base et absente après (vérifier).
  Condition de retrait : « quand le bundle de base contient l'entrée 5.3 ».
- [x] Suites existantes, après le 1er passage des zones :
  - `typographie-formes.mjs` `nettoyage` : masque empilé (l.1865) ;
  - `palette-nation.mjs` (contraste plateau l.629) : masque ou relevé « inchangé » ;
  - `plateau-qualite-usage.mjs` : en-tête de 12 px au moins, fond ≠ rgb(122,82,64), filet de 4 px au bureau, idempotence. Attendu vert sans changement ;
  - `fin-initialisation.mjs` l.83 : attendu vert (pliage synchrone) ;
  - `plateau-profil-mobile.mjs` : attendu vert ;
  - sections prébâties d'autres fixtures, dont `typographie-echelle.html` l.129 (grille, repliée en mobile) : elles prennent la carte. Leurs suites reçoivent un masque, ou un relevé « inchangé » (annexe §4).
  Aucune valeur codée en dur nouvelle hors contrôles de carte. Liste au Plan Change Log.
- [x] `tests/e2e/lib/router.mjs` : mot-clé `dashboard-section|dashboard-cards-grid|dashboard-group-title|accordion-icon` vers `cartes-pastilles`, `plateau` et `typographie-formes`, avec un cas dans `router.test.mjs`. Fixture `plateau-*` : déjà vers `plateau` (l.119) ; y ajouter `cartes-pastilles` si `test:changed` ne la choisit pas. Skill `tester-kraland-css` mis à jour dans les deux copies si le routage change (`diff -r` vide).
- [x] `npm run build`, contre-épreuves, lint.

**Acceptance Criteria:**
- Given plateau-qualite-usage étendue à 375 et 767 px, en clair et en sombre, when la suite tourne, then chaque groupe est une carte :
  - à 8 px de chaque bord, fond surface, rayon 8, sans ombre ;
  - en-tête ≥ 48 px, sans filet, titre en 17 px 700 `text-primary` sans capitales ;
  - chevron à 16 px du bord droit de la carte ;
  - cartes de personnages à 8 px des bords de la carte, `scrollWidth` = vw.
- Given le chargement, when on lit les groupes, then « mon groupe » est ouvert et le second groupe fermé, réduit à un en-tête de 48 px.
- Given un en-tête visible (`elementFromPoint` vérifié), when on le tape deux fois, then le groupe change d'état puis revient, `aria-expanded` suit. Un tap sur un bouton de groupe ne change rien.
- Given les groupes et les cartes, when on compare à la base, then l'ordre DOM et le contenu des cartes sont égaux.
- Given le mini-profil plié et déplié à 375 et 700 px, when on compare à la base, then il est égal.
- Given les 16 variantes, when on mesure le titre sur `bg-surface`, then le contraste est ≥ 4,5:1.
- Given 768, 769, 1280, 1440 et 1920 px, when on compare à la base, then les groupes sont égaux. La bascule 767 ↔ 768 donne la carte d'un côté, la base de l'autre, dans les deux sens.
- Given `kraland-theme.css`, when un contrôle statique lit les règles touchées, then il ne trouve ni `!important` nouveau, ni règle mobile globale, ni rayon littéral.
- Given `npm run test:router`, then vert.

## Implementation Notes

- Assumptions, tranchées par le planificateur :
  - A1 (sans source, recommandé) : la fixture passe à un `.dashboard` natif de deux panneaux, plutôt qu'à des sections prébâties avec grille. Seule la chaîne native prouve l'ordre DOM issu de `buildCard`. Repli possible : sections prébâties, `mygroup` + grille + second groupe ; à consigner si choisi.
  - A2 (maquette `.cards { padding: 8px }` et verify du ticket, contre Q10 « contenu à 16 px ») : la grille garde 8 px sur les quatre côtés. Les cartes sont des tuiles, pas du texte.
  - A3 (DESIGN › Carte de section et maquette, sans filet) : le filet gauche des en-têtes mobiles est retiré, « mon groupe » compris. Mon groupe se distingue parce qu'il est ouvert et placé en premier. Le filet de 4 px reste au bureau (l.13231, `plateau-qualite-usage.mjs`).
  - A4 (parité avec la carte 5.1, sans ombre) : l'ombre de section est retirée sur mobile.
  - A5 (sans source) : l'écart entre deux groupes reste à 10 px (mb actuel). La maquette en donne 8 ; Q10 ne fixe que les bords.
  - A6 (sans source) : la base du fragment `groupes` est `a7f0463`, dans une constante dédiée. `COMMIT_AVANT` (`21fed8d`) reste celle des fragments 5.1 et 5.2.
  - A7 (maquette « Groupe Nerys » en casse normale ; JS non modifiable) : le titre perd ses capitales et son espacement de lettres. Il reste « Nerys », car le JS retire « Groupe ».
  - A8 (Q30.7, hypothèse de l'épopée) : aucune icône ajoutée, contrairement à la maquette (`fa-user-friends` en `[ASSUMPTION]`).
  - A9 (sans source) : l'écart de l'en-tête reste à 5 px (global). La maquette donne 12 px entre une icône et le titre, mais il n'y a pas d'icône.
- Pièges :
  - P1 : l.5822 (0,3,1) bat l.13257 (0,1,0) pour « mon groupe ». Réécrire seulement l.13257 laisse le filet de 3 px et le fond `bg-hover` sur le premier groupe.
  - P2 : la grille repliée garde son retrait vertical. Sans `padding-top/bottom: 0` sur `.collapsed`, la section repliée fait 48 + 16 px. La règle `.collapsed` (0,3,1) bat la grille (0,2,1) sans `!important`.
  - P3 : la carte 5.1 vise `.panel-default` ; les groupes ne sont pas des panneaux. Ne pas fusionner dans `REGLES_CARTE_TICKET52`, dont le sélecteur est sérialisé tel quel.
  - P4 : l.13257 n'exige pas `mobile-mode`. Elle vaut aussi quand `mobile-mode` est absent à 767 px (plateau-minimal avec `isMobile` : la barre de navigation déborde, `innerWidth` passe à 791). Vérifier que ce cas reste égal à la base.
  - P5 : le chevron de la fixture fait 0×0, car la police FA n'est pas chargée. Mesurer son bord droit, pas sa largeur.
  - P6 : le second en-tête est sous le pli à 375×667 (y ≈ 778). Défiler par `scrollTo`, puis vérifier `elementFromPoint` avant le tap. `scrollIntoView` fait défiler même un conteneur `overflow: hidden`. « Couvert » n'est pas « invisible ».
  - P7 : `fin-initialisation` exige qu'aucune mutation ne suive l'init. La fixture native ajoute la transformation du dashboard ; elle reste synchrone au DOMContentLoaded.
  - P8 : `plateau-profil-mobile` dérive la fixture par regex (l.42-44, `btn-group-xs`). Aucun `btn-group-xs` dans les groupes.
  - P9 : MAX_CITING. `kr-bg-surface` et `kr-text-primary` sont déjà à 3 suites, `dashboard-section-header` à 2. Les sélecteurs de groupe vont dans `variantes.mjs`.
  - P10 : boutons de groupe à 28 px, sous les 44 px. Hors périmètre (épopée 9), consigné dans `deferred-work.md`, sans correctif.
  - P11 : faux FAIL sous charge. Rejouer la suite seule, machine calme, `kr-theme-enabled` vérifié.
  - P12 : `.dashboard.dashboard-flex` (l.2437) ne correspond à rien, car le JS crée `div.dashboard-flex` dans `.dashboard`. Ne pas s'y fier pour l'écart entre groupes.

- Décisions de construction (2026-10-24) :
  - Cartes de personnages : avec 8 px de bord et 8 px de grille, chaque carte perd 10 px à 375 px (167,5 contre 177,5). Avec le vrai Bootstrap, le statut synthétique « [Statut Elias Kurano] » passe sur deux lignes ; les cartes du 1er groupe montent de 166 à 181,2 px. Accepté : effet direct de la géométrie demandée. Consigné dans `revue-manuelle.md`.
  - Titre long : « Syllabus des Archivistes Itinérants du Grand Marais » passe sur deux lignes à 375 px. L'en-tête monte à 48,6 px, sans débordement (`scrollWidth` = vw) ; `min-width: 0` non ajouté. Le contrôle du second groupe replié exige un en-tête ≥ 47,5 px et une carte égale à l'en-tête, plutôt qu'un en-tête de 48 px exact (matrice : « l'en-tête grandit »). Aucune tolérance modifiée. Correctifs de revue : `min-height` calculé ≥ 48 px vérifié sur chaque en-tête, quel que soit le titre ; le groupe au titre d'une ligne fait 48 px (± tolérance existante de `pres`) à 375 et 767 px ; à 375 px, le titre long fait plus d'une ligne (sommets distincts de ses boîtes de texte), l'en-tête dépasse 48 px, sans troncature (`scrollWidth` ≤ `clientWidth` du titre).
  - Bootstrap 3.3.7 est lié à la fixture par `avecBootstrap` dans le fragment, pour que la cascade de `.panel`, `.btn` et `.btn-group` soit réelle (la base mesure 34 px d'en-tête avec Bootstrap).
  - Détecteur `AVANT_TICKET53` : `body.mobile-mode .dashboard-group-title{` (règle nouvelle). L'exemple du plan, `position:absolute` en tête de règle du chevron, n'est pas en tête de règle dans le minifié.
  - P4 (correctif de revue) : la règle mobile l.13262 est réécrite en place en deux sélecteurs gardés, sans `!important` ni règle concurrente plus spécifique. `:where(body:not(.mobile-mode))` garde la déclaration d'origine (filet de 4 px, `bg-elevated`) ; `:where(body.mobile-mode)` porte la carte (fond surface, sans filet). Spécificité inchangée (0,1,0). Sans `mobile-mode`, le rendu reste celui de la base. Preuve : page `groupes-nu` du fragment `groupes` (plateau-qualite-usage, Bootstrap, 767 px, `innerWidth` lu à 791 par script d'init comme quand la barre déborde) : `mobile-mode` absent, média mobile valide, groupes égaux à la base. Sans `innerWidth` forcé, la fixture garde `mobile-mode` : l'état ne se reproduit pas naturellement.

  - Icône native du titre (correctif de revue) : la fixture porte une `img` synthétique de 16 × 16 (`http://img7.kraland.org/2/groupe-icone.gif`, servie par la route img7 du fragment) avant « Groupe Nerys ». Le JS garde alors « Groupe » (le 1er nœud texte du fragment est l'espace avant l'image) : comportement natif, égal à la base. Le contrôle vérifie l'icône dans l'en-tête et à gauche du texte du titre.

## Plan Change Log

- 2026-10-24 (construction) : suites existantes touchées par la carte des groupes, après le 1er passage des zones.
  - `typographie-formes.mjs` `nettoyage` : `CARTES_TICKET53` empilé après `CARTES_TICKET52` sur la base (plateau, champ et composants à 375 et 767 px : hauteurs de page différentes de 21,5 px avant masque, 12 FAIL).
  - `typographie-formes.mjs` `espacement` : la base `62fd47d` reçoit `CARTES_TICKET53` (relevé principal et mini-profil plié/déplié). Avant masque, 6 FAIL : cartes de personnages de 160,2 px au lieu de 145 (statut sur deux lignes, cartes plus étroites).
  - Sans changement, verts : `palette-nation` (tous fragments), `plateau-qualite-usage` (35 ok), `fin-initialisation` (start, dcl, contre-preuves), `plateau-profil-mobile`, `breakpoint-switch`, `croix-directionnelle`, `jeu-identite`, autres fragments de `typographie-formes` et de `cartes-pastilles`. Fixtures prébâties (`typographie-echelle.html`, `typographie-formes.html`, `palette-nation-*.html`) : aucun masque nécessaire.
  - Masque `CARTES_TICKET53` en valeurs littérales (8 px, 16 px, 48 px), seul `var(--kr-bg-surface)` reste en jeton.
  - `test:changed` non lancé : `test:zone` sur les 5 zones du plan l'a remplacé.
- 2026-10-24 (correctifs de revue) :
  - `kraland-theme.css` : en-têtes de groupe mobiles gardés par `:where(body:not(.mobile-mode))` (rendu d'origine) et `:where(body.mobile-mode)` (carte).
  - Fixture `plateau-qualite-usage.html` : `img` synthétique dans le titre du 1er groupe.
  - `cartes-pastilles.mjs` `groupes` : mesures `min-height`, lignes et troncature du titre, icônes ; contrôles min-height, titre d'une ligne à 48 px, titre long à 375 px, icône à gauche ; page `groupes-nu` (option `innerWidth` de la définition de page, posée par script d'init) et contrôle sans `mobile-mode` à 767 px.
  - Contre-épreuves, toutes rouges : sans garde (2 FAIL, sans mobile-mode), sans `min-height` (20), titre en `white-space: nowrap` (4), icône à droite par `float: right` (22).
  - `npm run test:zone -- cartes-pastilles plateau typographie-formes palette-nation initialisation` : 69 fragments, 7954 ok, 2 FAIL en 760 s. `breakpoint-switch#nav-origine` (barre à 992 px) et `croix-directionnelle#transitions` sont verts rejoués seuls (exit 0) : charge de la machine. `npm run test:router` : conforme. `lint:css` et `lint:js` : exit 0.

## Design Notes

Spécificités à préserver :

| Règle | Avant | Après |
|---|---|---|
| l.5754 en-tête d'accordéon | `body.mobile-mode .dashboard-section-header-accordion` (0,2,1) | identique, + `min-height`, `padding` |
| l.5772 / l.5786 chevron | (0,3,1) / (0,4,1) | identiques, sans position absolue |
| l.5805 `.collapsed` | (0,3,1) | identique, + retrait vertical 0 |
| l.5815 section | (0,2,1) | identique, + marges, fond, ombre |
| l.5822 mon groupe | (0,3,1) | retirée |
| l.5830 grille | (0,2,1) | identique, retrait 8 |
| l.13257 en-tête mobile | `.dashboard-section-header, .dashboard-section-header-accordion` (0,1,0) | identique, fond surface, sans filet |
| titre (nouvelle) | — | `body.mobile-mode .dashboard-group-title` (0,2,1), bat l.2489 (0,1,0) |

Pourquoi une règle de titre nouvelle : l.2489 (capitales) et l.13133 (12 px) servent aussi l'en-tête au bureau ou le badge. Les réécrire changerait l'ordinateur ou le badge (`formes`).

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- cartes-pastilles plateau typographie-formes palette-nation initialisation` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js`. Attendu : 0 FAIL, codes de sortie lus séparément. `test:changed` seulement s'il ne s'élargit pas au total. Pas de `test:all` (orchestrateur).
- Rouge avant : extraire hors dépôt le bundle de `a7f0463` (`git show a7f0463:kraland-userscript-main.user.js`), puis lancer `KR_SCRIPT=<ce bundle> KR_FRAG=groupes node tests/e2e/cartes-pastilles.mjs` sur la fixture étendue. FAIL attendus :
  - section en x 0, avec ombre ;
  - en-tête de 23 px, avec filet ;
  - titre en 12 px 600, en capitales ;
  - chevron en absolu à 15 px ;
  - grille en `8px 6px` ;
  - groupe replié de 39 px.
  Verts : état initial, accordéon, boutons, ordre, mini-profil, bureau.
- Contre-épreuves sur des copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - chevron en absolu remis ;
  - `min-height` de l'en-tête retiré ;
  - l.5822 remise (filet de « mon groupe ») ;
  - `padding` 0 de `.collapsed` retiré ;
  - marges latérales de la section retirées ;
  - ordre de deux cartes inversé ;
  - état initial inversé (`isMyGroup` nié) ;
  - règle de titre appliquée à 768.
- Largeurs : 375×667, 700, 767, 768, 769, 1280, 1440, 1920, avec la bascule 767 ↔ 768 dans les deux sens. Géométrie en Kraland clair et Empire Brun sombre. Contraste dans les 16 variantes.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, en clair et en sombre : mon groupe ouvert, second groupe fermé puis ouvert, titre long, mini-profil déplié au-dessus des groupes. Regarder les coins de la carte, le chevron, la grille et les boutons de groupe.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css l.13262-13267 | Cas P4 (≤ 767 px sans `mobile-mode`) : filet et `bg-elevated` perdus, sans le reste de la carte ; état hybride, différent de la base | fondé | patch (fixed) | règle sans garde `mobile-mode` ; template l.606-637 pose `mobile-mode` sur `innerWidth` |
| 2 | quick | cartes-pastilles.mjs l.863, l.912 | Groupe replié au titre long : passe à 375 px même sans `min-height: 48px` | fondé | patch (fixed) | titre sur deux lignes, 48,6 px |
| 3 | quick | cartes-pastilles.mjs l.914-918 | « Titre long, l'en-tête grandit » ne vérifie ni le passage à la ligne ni la hauteur | fondé | patch (fixed) | un `nowrap` tronqué passerait (`overflow: hidden`) |
| 4 | quick | fixture plateau-qualite-usage | Icône native `img` du titre, à gauche du titre : exigence du plan non testée | fondé | patch (fixed) | seul `i.fa-users`, dans le bouton |
| 5 | quick | tickets.toml entrée 3, `verify` | Cite la suite `plateau-qualite-usage` à 375/767 ; contrôles mobiles dans `cartes-pastilles` | rejeté | — | écart voulu par le plan, consigné au Plan Change Log |

## Result

- Construit sur `a7f0463`. Revue quick : 5 constats, 4 corrigés, 1 rejeté.
- Gates (machine calme) : `npm run build`, `lint:css`, `lint:js`, `test:router` verts ; skills identiques ; `npm run test:all` : 11524 ok, 0 FAIL en 305 s.
- Fragment `groupes` de `cartes-pastilles` : 117 ok ; rouge avant sur `a7f0463` ; contre-épreuves toutes rouges.
