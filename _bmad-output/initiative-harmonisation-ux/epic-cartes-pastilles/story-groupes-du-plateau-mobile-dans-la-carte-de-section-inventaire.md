# Entrée 5.3 : inventaire des groupes du plateau mobile (règles, JS, fixtures, tests)

Annexe du plan `story-groupes-du-plateau-mobile-dans-la-carte-de-section-plan.md`. Relevé sur `a7f0463` (bundle commité, Bootstrap 3.3.7 embarqué), en lecture seule.

Mesures : script hors dépôt `/tmp/mesure53/mesure.mjs`, sortie `/tmp/mesure53/resultats.json`, `kr-theme-enabled` vérifié. Le script mesure une copie de `plateau-qualite-usage.html` dont la section prébâtie est remplacée par un `.dashboard` de deux panneaux natifs : « Groupe Nerys » (Nerys, Elias Kurano) et « Groupe Syllabus » (Syllabus en PNJ, Bob). Les lignes citées sont celles de `a7f0463` ; l'implémenteur les revérifie.

## 1. Mesures de la base (375 et 767 px ; Kraland clair, Empire Brun sombre identique hors couleurs)

| Élément | Mesure |
|---|---|
| Parents | `.dashboard-flex`, `.dashboard`, `.container-fluid`, `#col-right` : x 0, retrait 0 (`#col-right` : mb 15) |
| Section | x 0, largeur vw. Rayon 8, `overflow: hidden`, ombre `0 2px 4px rgba(0,0,0,.08)`, mb 10. Fond rgb(255,255,255) en clair, rgb(30,26,21) en sombre |
| En-tête « mon groupe » | 23,1 px, retrait `3px 8px`, écart 5, 12 px, rayon 0, sans filet bas. Fond `bg-hover` : rgba(0,0,0,.02) en clair, rgba(255,255,255,.03) en sombre. Filet gauche de 3 px primaire : rgb(139,15,14) en clair, rgb(122,82,64) en sombre |
| En-tête autre groupe | idem, fond `bg-elevated` (blanc en clair, rgb(42,37,31) en sombre), filet gauche de 4 px |
| Titre | 12 px, 600, capitales, espacement de lettres 0,5 px, hauteur de ligne 17,14 px, `text-primary` : rgb(15,23,36) en clair, rgb(245,241,237) en sombre. Texte « Nerys » / « Syllabus » : le JS retire « Groupe » |
| Chevron | absolu, `right: 15px`, centré. Boîte 0×0, car la police FA n'est pas chargée dans la fixture. `text-secondary`, tourné de −180° quand le groupe est ouvert |
| Grille ouverte | retrait `8px 6px`, écart 8, 2 colonnes (177,5 px à 375), hauteur 182. Cartes de 166 px, en x 6 et x 191,5 |
| Grille repliée | max-height 0, opacité 0, hauteur 16 px (retrait vertical gardé). Section repliée : 39,1 px. Cartes toujours dans le DOM |
| État initial | « mon groupe » ouvert (`.expanded`), second groupe fermé (grille `.collapsed`) |
| Débordement | `scrollWidth` = vw |
| 768 px | pas de `mobile-mode`, pas d'accordéon. Sections en x 45, largeur 645, grille en retrait 12, 3 colonnes |

Tap sur le second en-tête à 375×667 : sans effet, `elementFromPoint` null. L'en-tête est à y ≈ 778, sous le pli, sans défilement. C'est le piège d'AGENTS.md, pas un défaut : défiler par `scrollTo`, puis vérifier `elementFromPoint`.

## 2. Règles en jeu

Mobile = `@media (max-width: 767px)`, avec ou sans `body.mobile-mode` selon la ligne.

| Ligne | Sélecteur (abrégé) | Déclarations | Statut mesuré | Cible 5.3 |
|---|---|---|---|---|
| 2437 | `.dashboard.dashboard-flex` | flex colonne, écart 15 | ne correspond à rien (le JS crée `div.dashboard-flex` dans `.dashboard`) | non touché |
| 2444 | `.dashboard-section` (global) | fond `--kr-surface`, rayon md, `overflow: hidden`, ombre | appliqué | non touché (sert le bureau) |
| 2451 | `.dashboard-section-header` (global) | fond arm, retrait `3px 8px`, 9 px 600, flex, centré, écart 5 | retrait, flex et écart appliqués | non touché |
| 2463-2487 | `.dashboard-group-buttons` et `.btn` (globaux) | flex, écart 6 ; boutons translucides | — | non touché |
| 2489 | `.dashboard-group-title` (global) | `flex: 1`, capitales, espacement 0,5 px | appliqué | battu par la règle de titre mobile nouvelle |
| 2495 | `.dashboard-section-header .badge` | — | suite `formes` | non touché |
| 2747 | grille, mobile | minmax(140px), écart 8 | battu par l.5830 | non touché |
| 2809 | `.dashboard-section-header` en `(min-width: 3840px)` | 11 px, `5px 10px` | hors mobile | non touché |
| 3171 | `html[class*="-dark"] .dashboard-section` | fond `bg-surface` | appliqué en sombre | non touché |
| 4318 | grille, mobile (ouvert l.4084) | `repeat(3,1fr) !important`, `gap: 8px !important` | battu par l.5830 (`!important`, plus spécifique) | non touché |
| 5754 | `body.mobile-mode .dashboard-section-header-accordion` | `position: relative`, curseur, sélection, tap, transition | appliqué | + `min-height: 48px`, `padding: 0 var(--kr-space-4)` |
| 5765 | idem `:active` | fond `overlay-light-05` | retour au tap | non touché |
| 5772 | idem `.accordion-icon` | absolu, `right: 15px`, `top: 50%`, `translateY(-50%) rotate(0)`, transition, `text-secondary`, 14 px, `pointer-events: none` | appliqué | sans position absolue ; `rotate(0deg)` ; `margin-left: auto` |
| 5786 | idem `.expanded .accordion-icon` | `translateY(-50%) rotate(-180deg)` | appliqué | `rotate(-180deg)` |
| 5793 | `body.mobile-mode .dashboard-cards-grid` | `overflow: hidden`, transitions, max-height 5000, opacité 1 | appliqué | non touché |
| 5805 | idem `.collapsed` | max-height 0, opacité 0, marge 0, `pointer-events: none` | retrait vertical gardé (16 px) | + `padding-top: 0`, `padding-bottom: 0` |
| 5815 | `body.mobile-mode .dashboard-section` | mb 10 | appliqué | `margin: 0 var(--kr-space-2) 10px` ; fond `bg-surface` ; `box-shadow: none` |
| 5822 | `body.mobile-mode .dashboard-section-mygroup .dashboard-section-header` | fond `bg-hover`, filet gauche de 3 px primaire | bat l.13257 (0,3,1 contre 0,1,0) | retirée |
| 5830 | `body.mobile-mode .dashboard-cards-grid` | grille, `repeat(2,1fr) !important`, `gap: 8px !important`, retrait `8px 6px`, fond transparent | appliqué | `padding: var(--kr-space-2)` |
| ~5842 | `body.mobile-mode .dashboard-card` | fond `bg-hover`, bordure, rayon md | cartes | non touché |
| 6047-6066 | `body.mobile-mode .dashboard-group-buttons` et `.btn` | centré ; `.btn + .btn` mt 0 `!important` ; 28×28 `!important` | cibles de 28 px | non touché (épopée 9) |
| 6389 | `.building-section-header .accordion-icon` (5.1) | `margin-left: auto`, sans position absolue | modèle du chevron | référence |
| 13110 / 13133 | `.dashboard-section-header`, bureau / mobile | 12 px | appliqué (badge et boutons en héritent) | non touché |
| 13231-13255 | en-tête bureau | filet gauche de 4 px primaire, fond `bg-elevated`, `text-primary` ; boutons, badge | bureau | non touché |
| 13257 | `.dashboard-section-header, .dashboard-section-header-accordion` (mobile, sans `mobile-mode`) | filet gauche de 4 px, fond `bg-elevated`, `text-primary` | autres groupes | fond `bg-surface`, filet retiré, couleur gardée |
| 13264 / 13270 | boutons et badge, mobile | bordure, fond `bg-active`, `text-primary` | — | non touché |
| 13277 | `.dashboard-section-header-accordion:focus-visible` | contour de 2 px, retrait −2 | focus clavier existant | non touché (aucune règle `:focus` ajoutée) |
| 2385-2400 | `.btn-default`, hors `.dashboard-group-buttons *` | — | — | non touché |
| ~7862-7892 | carte 5.1 et 5.2 sur `.panel-default` | — | ne vise pas les groupes (ce ne sont pas des `.panel`) | non touché ; ne pas fusionner dans `REGLES_CARTE_TICKET52` |

Jetons : `--kr-font-section-title` 17px (l.28), `--kr-radius-md` 8px (l.32), `--kr-space-2` 8px (l.35), `--kr-space-4` 16px (l.37). `--kr-surface` et `--kr-bg-surface` valent #fff en clair (l.14 et l.54) ; les variantes sombres redéfinissent `--kr-bg-surface`.

## 3. JS (lecture seule, aucune modification)

- `transformDashboardToFlexCards()`, l.4386 :
  - tourne sur `isPlatoPage()` (chemin `/jouer…`, hors communauté) ;
  - prend les `.dashboard > .panel` dont le titre contient « groupe » ; le 1er groupe avec membres devient `mygroup` ;
  - construit `div.dashboard-section(.dashboard-section-mygroup | .dashboard-section-others)` ;
  - l'en-tête contient `div.dashboard-group-buttons` (si des `a.btn` existent), puis `span.dashboard-group-title` (titre sans « Groupe ») ;
  - suit `div.dashboard-cards-grid(.dashboard-cards-large)`, construite par `buildCard` ;
  - le contenu de `.dashboard` est remplacé par `div.dashboard-flex`.
  Appelée par `applyDOMTransformations` (l.3880), au DOMContentLoaded (l.11243), avant l'accordéon (vérifié par la sonde).
- `extractGroupData(panel)`, l.4051 :
  - titre = `.panel-heading .panel-title` (texte, `img`, badge) ; `a.btn` du titre clonés ;
  - membres = `.panel-body table tr`, avec `td:first-child a.list-group-item.ds_game` et `td:last-child div[style*="height:59px"]`.
  Membre (`extractMemberData`) : `img.pull-left`, `.list-group-item-heading`, `.list-group-item-text`, `.btn-danger.xmini` (PNJ), `.mention.pull-right` (monde, PV, barre de PV).
- Accordéon, l.2242-2346, `InitQueue.register('initGroupsAccordion', …, 70)` :
  - seulement si `body.mobile-mode` ; sur chaque `.dashboard-section` qui a un en-tête et un `.dashboard-group-title` ;
  - `makeGroupCollapsible` sort si l'en-tête ou la grille manque ; ajoute `dashboard-section-header-accordion`, `role="button"`, `tabindex="0"`, `aria-expanded` ;
  - `isExpanded = isMyGroup` : grille `.collapsed` sinon, en-tête `.expanded` si ouvert ;
  - ajoute `<i class="fa fa-chevron-down accordion-icon">` en fin d'en-tête ;
  - clic (ignoré dans `.dashboard-group-buttons`), Entrée et Espace.
- Ordre de l'en-tête : boutons, titre (`flex: 1`), chevron. Le chevron dans le flux finit donc au bord droit du retrait.

## 4. Fixtures

- `plateau-qualite-usage.html` (81 lignes) :
  - une section prébâtie dans `#col-right > .container-fluid` : `.dashboard-section > .dashboard-section-header > span.dashboard-group-title` « Groupe d'essai », plus une `.dashboard-card` avec statut ;
  - ni grille, ni `mygroup`, donc aucun accordéon aujourd'hui ;
  - suit `<div class="row t" style="height: 1500px">` ;
  - contient aussi `#col-leftest-stats .btn-group-xs`, les compétences de `#col-left`, les actions Dormir, Prier, Pouvoir et Fouiller, et le script `__clicks`.
- Second groupe, ce qu'il faut (A1) :
  - remplacer la section par `<div class="dashboard">` de deux `.panel.panel-default` ;
  - chaque panneau : `.panel-heading > .panel-title` « Groupe … », avec un `a.btn` (`href="#"`) ;
  - corps `.panel-body > table > tr` par membre : `td > a.list-group-item.ds_game` (`img.pull-left`, `.list-group-item-heading`, `.list-group-item-text`, `.btn-danger.xmini` pour un PNJ) et `td > div[style*="height:59px"]` (`.mention.pull-right`) ;
  - second groupe au nom long, pour l'en-tête sur deux lignes.
  Contraintes : aucun `btn-group-xs` ; noms synthétiques ; le premier `.dashboard-section-header` de la page reste un en-tête de groupe ; la route de la fixture garde un chemin `/jouer…`. Gabarit : copie de la sonde (`/tmp/mesure53`), hors dépôt.
- Sections prébâties d'autres fixtures, non touchées :
  - `typographie-echelle.html` l.129, avec grille, sans `mygroup`, repliée en mobile : elle prend la carte 5.3 ;
  - `typographie-formes.html` l.64 ;
  - `palette-nation-composants.html` l.79 (en-tête avec boutons) ;
  - `palette-nation-jauges.html` l.95.
  Celles qui ont une grille et un titre prennent l'accordéon et la carte : relever leurs suites (masque ou « inchangé »).
- `jeu-plateau-objets.html` : sans dashboard.

## 5. Mini-profil et tests

- `plateau-minimal.html` (48 lignes) : sans dashboard, `#player-header-section`, `textarea`, contenu de 4000 px. Sert à `jeu-identite`, `breakpoint-switch` et `nettoyage`.
  Piège : à 767 px avec `isMobile`, la barre de navigation déborde (jusqu'à 791 px). `innerWidth` passe à 791 et `mobile-mode` n'est jamais posé ; la base fait de même. Avec `plateau-qualite-usage`, `mobile-mode` est posé à 767.
- Mini-profil (`.mobile-mini-profile`, template l.1407-1581) : `collapsed` / `expanded` au clic. Testé plié et déplié à 375 et 700 par `plateau-profil-mobile.mjs` (contrôle à 768) et `typographie-formes.mjs` l.176 et l.347, sur `plateau-qualite-usage`.
- Assertions qui figent ce rendu :
  - `typographie-formes.mjs` :
    - `nettoyage` (l.1642-2000, base `00b0786`, pages plateau, champ et composants à 375 et 767) : casse sûrement. Masques empilés l.1865 (GEL, BUG10, `CARTES_TICKET51`, `CARTES_TICKET52`) : ajouter `CARTES_TICKET53` et `AVANT_TICKET53` ;
    - `formes` (l.159-160, l.312-337) : badge de l'en-tête et `.dashboard-card-pnj` sur `typographie-formes.html`, de 375 à 1280, contre `d68ab55`, sans masque. Ne pas changer le badge ;
    - `boutons` (l.454-455) : `.dashboard-group-buttons .btn` contre `4d97496`. Toute règle de bouton de groupe garde `:where(html.kr-page-plateau)` ;
    - `rayons` (l.1204-1465) : contrôle statique, aucun rayon littéral non nul (jetons redéfinis à 7 et 11) ;
    - `echelle` : risque faible (`SEL_TITRES` ne vise que `.panel`).
  - `plateau-qualite-usage.mjs` : bureau seulement (1512, et 1180 en tactile). Premier en-tête ≥ 12 px, fond ≠ rgb(122,82,64), `borderLeftWidth === '4px'`, `overflowX` 0, idempotence par réinjection. Aucun test mobile.
  - `palette-nation.mjs` : contraste du plateau à 375 et 1280 dans les 16 variantes (l.629) ; `pages4` exclut les boutons de groupe ; masques l.196.
  - `plateau-profil-mobile.mjs` (375 et 700, contrôle à 768) : dérive la fixture par regex (l.42-44, `<div class="btn-group-xs">…</div></div>`).
  - `fin-initialisation.mjs` l.83 (`plateau-qualite-usage`, 375 et 1280, modes `start` et `dcl`) : aucune mutation pendant `WINDOW_MS`.
  - `cartes-pastilles.mjs` : aucune page de dashboard aujourd'hui. Risques sur `.accordion-icon` : RELEVE l.212, chevron l.357-365, bureau l.683. Harnais réutilisable :
    - `COMMIT_AVANT = '21fed8d'` (l.49), surchargeable par `KR_SCRIPT_AVANT` ; `KR_FRAG` ;
    - MOBILES [375, 767], BUREAUX de 768 à 1920, variantes kraland et empire-brun-dark ;
    - `ouvrir({nom, width, height, variante, script, tactile})` (l.109) ;
    - `controlerCarte` (l.244, valeurs en dur).
- `tests/e2e/lib/variantes.mjs` (l.328-438) :
  - repères et masques 5.1 : `PANNEAU_TICKET51`, `CARTE_TICKET51` (l.341), `REGLES_CARTE_TICKET51`, `CARTES_TICKET51` (l.367), `AVANT_TICKET51` (l.382) ;
  - repères et masques 5.2 : `CARTE_TICKET52`, `REGLES_FORUM_TICKET52`, `VALEURS_FORUM_TICKET52`, `CARTES_TICKET52` (l.412), `AVANT_TICKET52` (l.431) ;
  - pose sur la base : `poserJetonsRedefinis` (l.438) ou concaténation ;
  - utilisateurs : `typographie-formes` l.1865, `palette-nation` l.196, `forum-index` l.94 et l.738, `kramail-redaction` l.240, `cybermonde-carte` l.354.
- Routeur (`lib/router.mjs`) :
  - MAX_CITING = 3 (l.215) : décompte sur les fichiers de suite de SUITES seulement, tokens `[A-Za-z][\w]*(-[\w]+)+` ;
  - mots-clés : l.162 (`dashboard-card-name`…), l.168 (`kr-page-plateau` vers `typographie-formes` et plateau), l.181 (`building-section|accordion-icon` vers `cartes-pastilles`), l.183 (`mobile-mode` vers BASCULE_ZONES) ; fixtures `plateau-*` vers `plateau` (l.119) ;
  - aucun mot-clé pour `dashboard-section` ;
  - zones : `cartes-pastilles`, `plateau` (`breakpoint-switch`, `croix-directionnelle`, `plateau-profil-mobile`, `plateau-qualite-usage`, `jeu-identite`), `typographie-formes`, `palette-nation`, `initialisation` (`fin-initialisation`).
- Citations actuelles par suite :

| Token | Suites |
|---|---|
| `dashboard-section` | 0 |
| `dashboard-cards-grid` | 0 |
| `dashboard-section-mygroup` | 0 |
| `dashboard-group-title` | 0 |
| `dashboard-group-buttons` | 1 |
| `accordion-icon` | 1 |
| `dashboard-section-header` | 2 |
| `kr-bg-surface` | 3 |
| `kr-text-primary` | 3 |
| `mobile-mode` | 16 |

`npm run test:router` à `a7f0463` : « Routeur conforme ».
