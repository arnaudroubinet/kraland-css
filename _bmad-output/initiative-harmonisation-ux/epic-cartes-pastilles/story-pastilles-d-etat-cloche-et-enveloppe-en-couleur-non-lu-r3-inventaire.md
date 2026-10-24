# Inventaire — Pastilles d'état : cloche et enveloppe en couleur « non lu » (R3)

Annexe du plan `story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-plan.md`. Relevé en lecture seule sur `601ab19` (feature/next). Les numéros de ligne sont ceux de cette révision ; l'implémenteur les revérifie avant d'écrire. Les valeurs calculées marquées « à mesurer » viennent de la lecture du CSS, pas d'une mesure CDP.

## 1. Rendu de base attendu (lecture du CSS, à mesurer)

Pastille remplie de la cloche (`.fa-bell ~ .badge.badge-danger`) et de l'enveloppe (`a[href*="kramail"] .badge`, `#badge`) :

| Propriété | Valeur de base | Source |
|---|---|---|
| fond | `--kr-badge-danger` = `#dc3545` = rgb(220, 53, 69), toutes variantes | l.801, jeton l.75 |
| texte | `--kr-white` (blanc) | l.802 |
| `border-color` | `--kr-badge-danger-border` = `#bd2130`, inerte : `.badge` de Bootstrap 3 n'a pas de bordure (largeur 0, à mesurer) | l.803, jeton l.76 |
| taille | `--kr-font-label` = 12 px. DESIGN.md parle de 10 px aujourd'hui : écart à confirmer par la mesure | l.717 ; mobile l.5631 et l.5734 |
| graisse | 700 (`.label, .badge`, et `.badge` de Bootstrap) | l.718 |
| rayon | `--kr-radius-full` = 9999 px | l.719 ; mobile l.5631 et l.5734 |
| animation de l'icône | `kr-bell-swing 1.5s ease-in-out infinite` sur `.fa-bell` et `.fa-envelope` quand la pastille est remplie | l.806-843 |

Pastille vide (`<span class="badge badge-danger"></span>`, `<span class="badge" id="badge"></span>`) : `display: none` par `.badge:empty` de Bootstrap 3.3.7. Aucune règle de la peau ne réécrit `display` sur ces pastilles (à mesurer avec Bootstrap réel).

Référence « NOUVEAU MESSAGE » du sous-forum (`.kr-topic-badge`, l.13594-13615) : fond `var(--kr-status-unread)`, texte `var(--kr-bg-surface)`, 12 px 700, rayon plein, retrait `1px 6px`, `letter-spacing: 0.04em`, `line-height: 1.5`.

`--kr-status-unread` vaut `var(--kr-highlight)` (l.170), sauf en Empire Brun clair : `#8a5a00` (l.187). En Kraland et Ruthvénie clairs, l'accent `#c41e3a` est voisin du rouge `#dc3545` (EXPERIENCE.md Q21 : 1,04:1 entre accent et `--kr-danger`). Le changement est donc presque invisible à l'œil dans ces deux variantes : seule une comparaison de valeurs exactes le prouve.

## 2. Règles CSS (`kraland-theme.css`)

### 2.1 Règle d'origine à réécrire (l.796-804, globale)

```css
/* Badge danger - notification alert always red on all themes */
.badge-danger,
.navbar-right a[href="kramail"] .badge:not(:empty),
.navbar-header-buttons-left a[href="kramail"] .badge:not(:empty),
.navbar-header-buttons-left a[href*="kramail"] .badge:not(:empty) {
  background-color: var(--kr-badge-danger) !important;
  color: var(--kr-white) !important;
  border-color: var(--kr-badge-danger-border) !important;
}
```

- Les trois `!important` existent déjà. Réécrire leurs valeurs n'en ajoute pas.
- Spécificités : `.badge-danger` (0,1,0) ; `.navbar-right a[href="kramail"] .badge:not(:empty)` (0,4,1) ; idem pour les deux sélecteurs `.navbar-header-buttons-left`. Le 4e (`a[href*="kramail"]`) couvre le 3e.
- `.badge-danger` n'existe pas dans Bootstrap 3 : la classe vient du site. Elle n'est portée que par la cloche (fixtures, §4).
- La règle est hors média : elle sert les deux supports à l'identique.

### 2.2 Règle commune `.label, .badge` (l.713-720, globale, non touchée)

`background-color: var(--kr-arm-bg, var(--kr-primary))`, `color: var(--kr-arm-ink, var(--kr-white))`, `border-color: var(--kr-primary-dark)`, `font-size: var(--kr-font-label)`, `font-weight: 700`, `border-radius: var(--kr-radius-full)`. Donne déjà 12 px 700 et le rayon plein à la cloche et à l'enveloppe.

### 2.3 Géométrie de la barre (mobile, non touchée)

- l.5630-5641, dans un bloc mobile imbriqué : `.navbar-header-buttons-left .badge, .navbar-header-buttons-right .badge` en `!important` : position absolue, `top/right: 6px`, `min-width/height: 16px`, `padding: 2px 4px`, `font-size: var(--kr-font-label)`, `line-height: 12px`, `border-radius: var(--kr-radius-full)`.
- l.5733-5743, bloc mobile : `.navbar-right .badge` en `!important` : position absolue, `top/right: 8px`, `min-width/height: 18px`, `padding: 2px 5px`, `font-size: var(--kr-font-label)`, `line-height: 14px`.
- Liens de la barre : l.5609-5623 (clones, 44 × 44 px, `color: var(--kr-white) !important` sur le lien, pas sur la pastille) ; l.5715-5725 (`.navbar-right > li > a`, 44 × 44 px).

La géométrie diffère de `.kr-topic-badge` (retrait, interligne). Elle reste : seules la couleur, la police et le rayon passent à la Pastille d'état (A2 du plan).

### 2.4 Animation (l.806-843, non touchée)

- `@keyframes kr-bell-swing` ;
- `.navbar-right .fa-bell, .navbar-right .fa-envelope { display: inline-block; transform-origin: 50% 0 }` ;
- l.826-829 : `.navbar-right a:has(.badge-danger:not(:empty)) .fa-bell, .navbar-right a:has(.badge:not(:empty)) .fa-envelope { animation: kr-bell-swing 1.5s ease-in-out infinite }` ;
- l.832-843 : même chose sous `@media (max-width: 767px)` pour `.navbar-header-buttons-left`.

Les sélecteurs de l'animation lisent `.badge-danger` : renommer ou retirer la classe dans la règle d'origine ne les touche pas, mais toute réécriture du sélecteur `.badge-danger` dans l'animation est hors périmètre.

### 2.5 Autres `.badge` (hors périmètre, égaux à la base)

| Ligne | Sélecteur | Rôle |
|---|---|---|
| l.922 | `html.kr-theme-enabled .btn:is(.btn-success, .btn-warning, .btn-danger) .badge` | badge dans un bouton d'état |
| l.962, l.978 | `.panel-success/warning/danger`, `.panel-info` › `.panel-heading .badge` | badge d'en-tête de panneau |
| l.1019-1023 | `.list-group-item.active > .badge`, `.nav-pills`, `.btn-primary .badge`, `.btn-info .badge`, `.panel-primary` | paire inverse |
| l.2495, l.13255, l.13282 | `.dashboard-section-header .badge` | compteur de groupe |
| l.5267 | pastilles du mini-profil | — |
| l.5505 | `.mobile-tab-bar.nav-tabs .badge` | marge |
| l.12766 | `top: auto` | neutralise `.btn .badge` |

### 2.6 `/report` (hors périmètre)

l.776-794 : `tr.bg-info` de `/report` en `--kr-status-unread`. Non touché. `/report` n'est jamais ouvert ni préchargé (AGENTS.md).

## 3. JS du template (`kraland-userscript-template.js`, lecture seule)

- l.1121-1201 : `moveHeaderButtons`, `InitQueue.register('moveHeaderButtons', …, 20)`. Ne tourne que si `body.mobile-mode`.
  - Parcourt `.navbar-right li` ; retient la cloche (`.fa-bell` hors `.dropdown`), le kramail (`.fa-envelope`) et la carte (`.fa-globe`).
  - Pose `data-moved-to-header` sur l'original ; `cloneNode(true)` dans `div.navbar-header-buttons-left`, inséré en tête de `.navbar-header` ; masque `.navbar-brand`.
  - Les originaux restent dans `.navbar-right`, dans le menu replié à 375 px (invisibles). Les clones sont visibles.
  - Le clone copie `id="badge"` : l'id est dupliqué à 375 px (`querySelectorAll('#badge')` renvoie 2 éléments).
  - Clone figé à l'init : une mise à jour ultérieure de la pastille d'origine n'est pas suivie (hors périmètre).
- Aucun `badge-danger` dans le template.
- l.6184 : `'fa-envelope': 'Nouveau message'` (libellé d'icône, sans rapport).
- l.8035 : `a[href*="kramail"]` dans la colonne de liens (sans rapport avec la pastille).

## 4. Emplois de `.badge-danger` et de `--kr-badge-danger*`

### 4.1 CSS

| Ligne | Emploi | Sort au ticket 5.4 |
|---|---|---|
| l.75 | `--kr-badge-danger: #dc3545` | reste (encore lu par l.10559) |
| l.76 | `--kr-badge-danger-border: #bd2130` | reste ; plus lu après 5.4, retrait laissé au sweep 5.6 (A5) |
| l.77 | `--kr-badge-pnj` | entrée 5, non touché |
| l.797 | `.badge-danger` (règle d'origine) | réécrit |
| l.801, l.803 | `var(--kr-badge-danger)`, `var(--kr-badge-danger-border)` | remplacés |
| l.826, l.839 | `a:has(.badge-danger:not(:empty)) .fa-bell` (animation) | non touché |
| l.10559 | `body.page-kramail-compose form[name="post_msg"] .kd-field.is-invalid { border-color: var(--kr-badge-danger, #dc3545) }` | hors liste : état d'erreur (blocage), égal à la base |

### 4.2 JS

Aucun emploi de `badge-danger` ni de `--kr-badge-danger` dans le template.

### 4.3 Fixtures (`tests/e2e/fixtures/`)

Pastilles vides, l.100-101 : `kramail-reception`, `kramail-envoi`, `kramail-lecture`, `kramail-nouveau`, `kramail-repondre`, `kramail-repondre-tous`, `kramail-transferer`, `kramail-corbeille` (.html). Structure :

```html
<li><a href="" onclick="javascript:openReport();return false;"><i class="fa fa-bell"></i><span class="badge badge-danger"></span></a></li>
<li><a href="kramail"><i class="fa fa-envelope"></i><span class="badge" id="badge"></span></a></li>
```

Pastilles remplies : `typographie-formes.html` l.26-27 (`!` pour la cloche, `3` pour l'enveloppe, `onclick="return false;"`). Aucune autre fixture ne porte de pastille remplie.

`sous-forum-debuter.html` : pas de cloche ; porte `.kr-topic-badge` « NOUVEAU MESSAGE » (référence de fond).

Bootstrap : les fixtures pointent `lib/bootstrap-3.3.7/css/bootstrap1.min.css` (kramail) ou l'URL absolue `http://www.kraland.org/lib/bootstrap-3.3.7/css/bootstrap1.min.css` (typographie-formes) ; `cartes-pastilles` sert le Bootstrap embarqué (`tests/e2e/vendor/`).

## 5. Suites qui figent ces couleurs

### 5.1 `tests/e2e/typographie-formes.mjs`

- l.109 : imports `AVANT_TICKET51/52/53`, `CARTES_TICKET51/52/53`.
- l.115 : `COMMIT_AVANT = 'd68ab55'`, surchargeable par `KR_SCRIPT_AVANT`.
- l.154-155, page `plateau` (`typographie-formes.html`, `/jouer/plateau`) : éléments `['badge', '#pastille-titre, #badge']` et `['cloche', '.fa-bell ~ .badge']`. `#badge` est l'enveloppe ; à 375 et 767 px, le clone mobile s'y ajoute. Variantes `kraland` et `empire-brun-dark`.
- l.263, `MESURE` : taille, graisse, couleur, fond, bordure des 4 côtés, texte.
- l.271, `relever()`.
- l.311, `largeurs()` : fragments `mobile` [375, 767] et `bureau` [768, 769, 1280].
- l.324 : contrôle « couleur, fond et bordures égaux au bundle de base », comparé à `avant`. Il casse sur `cloche` et `badge` (enveloppe) dès la réécriture : fond et texte changent. `#pastille-titre` (badge de panneau) ne change pas.
- l.1583-1584, `espacement` : base `62fd47d` avec `CARTES_TICKET53` si `AVANT_TICKET53`.
- l.1865-1867, `nettoyage` : masques empilés `CARTES_TICKET51`, `CARTES_TICKET52`, `CARTES_TICKET53` sur la base. Les pastilles du plateau y sont relevées : à vérifier au 1er passage.

### 5.2 Autres suites

| Suite | Lien | Attendu |
|---|---|---|
| `palette-nation.mjs` | cite `kr-status-unread` (garde du non lu, pastilles du sous-forum, filet de /report égaux à `d521cc8`) ; l.196 masques 5.1/5.2 ; l.280 `C('#pastille', '.badge', 'repos')` sur une fixture sans cloche | vert sans changement (à vérifier) |
| `report-non-lu.mjs` | fenêtre de la cloche 600 × 600 (l.223), lignes non lues de `/report` (fixture) | vert sans changement |
| `kramail-redaction.mjs` | fixtures kramail (pastilles vides), fragment `regression` comparé à la base | vert : pastilles vides invisibles des deux côtés |
| `fin-initialisation.mjs`, `jeu-identite.mjs` | fixtures kramail | vert |
| `forum-index.mjs` | l.731 : écart consigné du ticket 4.1 sur `.label, .badge` | vert, sans cloche remplie |
| `messages-v3.mjs` | `fa-envelope` dans les boutons de message | sans rapport |
| `cartes-pastilles.mjs` | fragments `kramail` et `bascule` sur `kramail-reception` (pastilles vides) | vert |

## 6. `tests/e2e/cartes-pastilles.mjs` (point d'extension)

- l.1-41 : en-tête et liste des fragments ; options `KR_SCRIPT`, `KR_SCRIPT_AVANT`, `KR_FRAG`.
- l.58 : `COMMIT_AVANT = '21fed8d'` ; `COMMIT_AVANT_53 = 'a7f0463'`.
- l.87-117 : `PAGES` ; l.118 `avecBootstrap(h)`.
- l.128 : `ouvrir({ nom, width, height = 667, variante, script, tactile })`, route Bootstrap vendor, `choisirVariante`, `prete` (l.178).
- Fragments : `kramail` l.355, `module` l.378, `forum` l.481, `lignes` l.573, `chevron` l.634, `bureau` l.704, `bascule` l.732, `groupes` l.883, `contraste` l.1096 (`TOUTES`, 16 variantes, `CONTRASTE`).
- Imports de `./lib/variantes.mjs` : `CONTRASTE`, `DOSSIER_MODALE_TICKET51`, `GROUPES_TICKET53 as G`, `PANNEAU_TICKET51`, `PASTILLE_TICKET52`, …

## 7. `tests/e2e/lib/variantes.mjs`

- l.329-382 : repères et masques 5.1 ; l.384-431 : 5.2 (dont `PASTILLE_TICKET52`) ; l.433-466 : 5.3 (`GROUPES_TICKET53`, `CARTES_TICKET53`, `AVANT_TICKET53 = bundle => !bundle.includes('body.mobile-mode .dashboard-group-title{')`).
- l.473 `poserJetonsRedefinis` ; l.480 `choisirVariante` ; `parVariante` ; l.503 `CONTRASTE()` (rgb, fond, texte, rapport, sonde, procheRgb).

## 8. Routeur (`tests/e2e/lib/router.mjs`)

- l.91 : entrée `cartes-pastilles`, `frags: [['carte'], ['module'], ['kramail'], ['forum'], ['lignes'], ['chevron'], ['bureau'], ['bascule'], ['groupes'], ['contraste']]`. Un nouveau fragment doit y être ajouté.
- KEYWORDS (l.137-196) :
  - `kramail|post_msg|…` vers `kramail`, et `(?<!sous-|sub)forum|kramail|…` vers `forum` : la règle d'origine (sélecteurs `a[href="kramail"]`) route vers `forum` et `kramail`, pas vers `cartes-pastilles` ni `typographie-formes` ;
  - `kr-topic-badge` est dans la regex des étiquettes (vers `typographie-formes`) ;
  - aucun mot-clé pour `badge-danger`, `kr-badge-danger`, `navbar`, `fa-bell`, `fa-envelope` ni `kr-bell-swing`.
- l.221 : `MAX_CITING = 3`. Décompte des citations (l.360) à `601ab19` :

| Repère | Suites qui le citent |
|---|---|
| `badge-danger` | 0 |
| `kr-badge-danger` | 0 |
| `kr-bell-swing` | 0 |
| `navbar-header-buttons-left` | 0 |
| `navbar-right` | 0 |
| `fa-bell` | 1 (typographie-formes) |
| `fa-envelope` | 1 (messages-v3) |
| `kr-status-unread` | 2 (palette-nation, report-non-lu) |
| `kr-bg-surface` | 3 (cartes-pastilles, modale-ordre, palette-nation) |
| `kr-topic-badge` | 3 (palette-nation, sous-forum, typographie-formes) |
| `kr-text-primary` | 3 |
| `navbar-header` | 5 (repère transverse) |

Conséquences : `kr-topic-badge` ne peut pas être cité par `cartes-pastilles` (4e suite). `kr-bg-surface` est déjà cité par `cartes-pastilles` : pas de nouvelle suite. `kr-status-unread` cité par `cartes-pastilles` ferait une 3e suite (limite). `fa-bell` et `badge-danger` cités par `cartes-pastilles` restent sous la limite.
