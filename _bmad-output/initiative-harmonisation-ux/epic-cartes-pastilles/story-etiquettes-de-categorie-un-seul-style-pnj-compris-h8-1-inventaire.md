# Inventaire — Étiquettes de catégorie : un seul style, « PNJ » compris (H8.1)

Annexe du plan `story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-plan.md`. Relevé en lecture seule sur `59567f0` (feature/next), par grep et lecture : aucune mesure CDP. Les numéros de ligne sont ceux de cette révision ; l'implémenteur les revérifie avant d'écrire. « À mesurer » : valeur lue dans le CSS, à confirmer.

## 1. Familles (DESIGN.md)

| Famille | Fond | Texte | Forme |
|---|---|---|---|
| Étiquette de catégorie (`label-category`) | `var(--kr-arm-bg, var(--kr-primary))` | `var(--kr-arm-ink, var(--kr-white))` | 12 px (`--kr-font-label`), 700, `--kr-radius-full` |
| Pastille d'état (`badge-state`) | `--kr-status-unread` (= `--kr-highlight`, sauf Empire Brun clair `#8a5a00`, l.170/187) | `--kr-bg-surface` | idem |

Contraste arm-ink sur arm-bg (table DESIGN, Encre d'action) : Kraland sombre 4,53, Khanat sombre 4,57, Confédération clair 4,83. Ce sont les plus serrées. `--kr-arm-bg` n'est pas posé sur `:root` (repli `--kr-primary`) ; surcharges l.264, l.387. `--kr-arm-ink` : l.192, 265, 312, 337, 362, 388, 413, 439.

## 2. Étiquettes et pastilles restantes

| # | Élément | Famille | Règle CSS (rendu de base) | Origine | Fixtures | Sort 5.5 |
|---|---|---|---|---|---|---|
| 1 | `.label`, `.badge` (commun) | les deux | l.713-720 global : arm-bg / arm-ink, bordure primary-dark, 12 px 700, rayon plein ; liens l.763-768 | natif | toutes | modèle, non touché |
| 2 | « guilde » `label-default`, « [mod] » `label-info` | catégorie | l.713 | natif | typographie-formes l.53 (`#etiquette-rang`, `#etiquette-mod`) ; forum-index-rp l.71, 84, 109 ; forum-index-communaute l.65, 91 ; forum-racine-groupes l.70, 83, 108, 123, 136, 161 ; palette-nation l.96 (`#etiquette`, `#etiquette-lien`, `#pastille`) | égal à la base |
| 3 | « Arme en main » `label-primary` | catégorie | l.713 | natif | jeu-materiel l.132 | égal à la base |
| 4 | `.dashboard-card-pnj` « PNJ » | catégorie | l.2673-2687 global : `background: #c9302c` (PLT-10), blanc, 12 px 700, `2px 5px`, rayon plein, majuscules, absolu 8/8 | JS `buildCard` l.4359-4363, depuis `extractMemberData` l.4153 (`.btn-danger.xmini` → `isPNJ`) ; `transformDashboardToFlexCards` l.4386 via `applyDOMTransformations` (hors InitQueue, `isPlatoPage()`) | plateau-qualite-usage l.63, 67 (natif transformé) ; typographie-formes l.66 (synthétique) | réécrite en arm |
| 5 | `span.btn.btn-danger.xmini` « PNJ » natif | catégorie | aucune règle de couleur dans la peau : Bootstrap `.btn-danger` (`#d9534f`, survol `#c9302c`, bordure `#d43f3a`) ; tailles l.6220, 6312, 13133, 13152 ; exclu des boutons d'état l.902, 908, 909, 915-916 ; commentaire l.859-860 | natif | palette-nation-etats l.79 (`#pnj`) ; plateau-qualite-usage (avalé par le JS) | règle de catégorie ajoutée (A2) |
| 6 | `.forum-tags a` | catégorie (A1) | mobile seulement, l.8659-8686, tout en `!important` : conteneur flex gap 3px ; `.glyphicon` muted 8 px ; `a` `1px 4px`, 12 px 700, `--kr-text-secondary` sur `--kr-bg-hover`, rayon plein ; `a:active` bg-active. Pas de règle bureau | natif présumé (aucun JS) | typographie-formes l.74 seulement (synthétique) | réécrite en arm, `:active` en arm-hover |
| 7 | `span.tagforum` (tags natifs) | catégorie, rendu texte | mobile l.8426-8441 (text-secondary, 500) ; sous-forum mobile l.14111-14140 (« · #tag », `font-size:0`, liens 13 px, `pointer-events:none`) ; bureau l.11499 (masqué dans les sujets) | natif ; `ForumThread:HideTags` l.7333 masque `a[href*="forum/tags"]` | sous-forum-debuter l.98 (généré par script) | gardé (A4) |
| 8 | `.dashboard-section-header .badge` (compteur de groupe) | catégorie (A3) | global l.2496 (rgba .15, `--kr-text`, 1px, `2px 8px`, 12 px, rayon plein) ; bureau l.13256 et mobile l.13283 : border-strong, bg-active, text-primary | JS `extractGroupData` l.4073 (clone du `.badge` natif) | typographie-formes l.65 (`#pastille-groupe`) ; plateau-qualite-usage | réécrit en arm (bureau et mobile) |
| 9 | Compteurs de contact du kramail `a.list-group-item > .badge#badgeNNNN` | état | l.713 (arm) ; `.list-group-item.active > .badge` l.1020 paire inverse | natif (aucun JS) | 8 `kramail-*.html` l.144, 146 (`#badge1000`, `#badge2000`, vides) | ajoutés à la règle d'état l.797 |
| 10 | Cloche `.badge-danger`, enveloppe `#badge` | état | l.797-804 (5.4), liste combinée, `!important` | natif + clones `moveHeaderButtons` | typographie-formes l.26-27 ; kramail-* l.100-101 (vides, `openReport`) | non touché |
| 11 | `.label-success/-warning/-danger` | état | l.889, survol l.895 | natif | palette-nation-etats l.47-50 (`#lb-*`) | non touché |
| 12 | Pastilles de panneau | état ou arm | l.963 (panneau d'état), l.979 (`.panel-info`, arm), l.1020-1024 (paires inverses) | natif | typographie-formes l.51 (`#pastille-titre`) | non touché |
| 13 | `.kr-topic-badge` | état | l.13596, liste combinée | JS `ForumTopics:Status` l.5106-5117 | sous-forum-debuter | référence, non touché |
| 14 | `.kr-order-badge` | catégorie | arm (épopée 2, Q5) | JS l.9080-9110 | typographie-formes l.69 | égal à la base |
| 15 | Score de vote `.btn-success` | état (A8) | l.15152, mobile | natif | — | non touché |
| 16 | `.kr-stat-badge`, `.kr-skill-badge` (`is-level`, `is-zero`) | hors familles (Q30.1) | `--kr-level-bg/fg` l.165-166/186/233 ; l.12764-12790 bureau, l.12975-13000 mobile | JS `createBadge`/`createStatBadge` l.3474-3486, appelés l.8213 et l.8244 | générés sur typographie-formes | égal à la base |
| 17 | « ici » `.kr-room-here` | hors familles (Q30.1) | l.6773 mobile (level-bg / level-fg, majuscules) ; l.6689, l.6674, l.6767 | JS `buildRoom` l.2751-2755 (`initNavigationRow`, priorité 60) | générée sur typographie-formes (375) | égale à la base |
| 18 | Caractéristiques `btn btn-success alert12x mini` et leur `.badge` ; `.mobile-characteristic-badge` | hors CAP-6 (Q30.4) | l.923 (paire inverse bg-surface / `--kr-state`) | natif ; clones `initMiniProfile` l.1540 | typographie-formes l.40-41, plateau-qualite-usage l.30-31, … | égal à la base |
| 19 | `.mini.c1…c10` | non vérifié | l.115-116 (`#000 !important`) | natif | — | hors relevé, non touché |
| 20 | `.label-simple` (kramail) | libellé de menu, pas une étiquette | l.8945 | natif | kramail-* | non touché |

## 3. Recherches consignées absentes

- « article » : absent du CSS et des fixtures. Seule occurrence JS : `createElement('article')` (l.4885), qui n'est pas une étiquette.
- « Dernier sujet » : absent du CSS, du JS et des fixtures. « Dernier : » existe en texte (l.14018, l.14780).
- `forum-sujet.html` : aucune `.label` ni `.badge`. `sous-forum-debuter.html` : aucune `.label` ni `.badge` natifs (seulement `.kr-topic-badge` généré).
- `.xmini` : absent de forum-sujet, sous-forum-debuter et forum-index-rp. L'empreinte `#col-right` de `forum-index` n'en voit donc pas.
- Jetons morts : `--kr-badge-pnj` (`#d9534f`, l.77) et `--kr-badge-danger-border` (l.76). `--kr-badge-danger` (l.75) n'est lu qu'en l.10560 (`.kd-field.is-invalid`). Tous trois sont laissés au sweep 5.6.

## 4. Assertions qui figent ces couleurs

### 4.1 `tests/e2e/palette-nation.mjs`

- Garde PNJ l.1349-1356 (dans `verifierEtats`, l.1291), fragments `etats-mobile` (375) et `etats-bureau` (1280), 16 variantes (`parVariante`). Elle compare `couleur`, `fondPropre` et `bordure` de `#pnj` et `#piece` (`HORS5`, l.1231), au repos et au survol forcé (l.1256, l.1263), au bundle `BASELINE5 = 'd521cc8'` (l.1206 ; `KR_SCRIPT_AVANT5`).
- « Aucune couleur d'état de Bootstrap » (l.1345-1348) : exclut `HORS5`.
- Aucun masque sur ces contrôles. Les masques 51/52 ne sont posés qu'en `pages4` (l.196, base `6685df5`).
- `#etiquette`, `#etiquette-lien`, `#pastille` (`COMPOSANTS` l.278-280) : comparés à la paire de nation attendue. Ils restent verts.
- `#lb-*` (`PLEINS5` l.1227, contrôle l.1315) : couleur d'état, sans base.

### 4.2 `tests/e2e/typographie-formes.mjs`

- Contrôle couleurs : `largeurs()` l.312-338, check l.327-336.
  - Il compare `couleur`, `fond` et les 4 couleurs de bordure (`MESURE` l.262) à la base `COMMIT_AVANT = 'd68ab55'` (l.115 ; `KR_SCRIPT_AVANT`).
  - Masque l.318 : `AVANT_TICKET54(avant) ? CARTES_TICKET54 : ''`.
  - Fragments `mobile` [375, 767] (l.340), `bureau` [768, 769, 1280] (l.341).
  - Variantes : `kraland`, `empire-brun-dark` (l.148).
- Éléments (PAGES l.151-174) :
  - `label` `#etiquette-rang, #etiquette-mod` ;
  - `groupe` `.dashboard-section-header .badge` ;
  - `pnj` `.dashboard-card-pnj` ;
  - `tags` `.forum-tags a` (forum, mobile seulement) ;
  - `mod` `.label` (index-rp) ;
  - `sujet` `.kr-topic-badge` ;
  - `ici`, `stat`, `competence`, `cloche`, `badge`, `ordre`.
  - Rouges attendus sans masque 55 : `pnj`, `groupe`, `tags`.
- `espacement` (l.1581, base `62fd47d`) : géométrie seulement, masque 53. Pas touché par la couleur.
- `nettoyage` (l.1900, base `00b0786`) : toutes les propriétés calculées des éléments visibles. Masques empilés l.1871-1874 : GEL, BUG10, 51, 52, 53, sans 54. À vérifier au 1er passage : si ses pages portent PNJ, groupe ou tags, empiler 55 (et 54 s'il le faut).

### 4.3 `tests/e2e/cartes-pastilles.mjs`

- `ouvrir` (l.143-191) : pas de paramètre `css`, aucun masque posable. Couleurs comparées aux jetons sondés (`CONTRASTE`).
- Fragment `pastilles` (l.1185-1331) :
  - `hors` = `PASTILLES_TICKET54.horsListe` = `#pastille-titre`, `#pastille-groupe` ;
  - comparé à `601ab19` brut (l.1139, l.1242). Rougit avec le compteur de groupe réécrit.
- Fragment `groupes` (l.898-991) : `CONTENU_GROUPES` (l.814) ne relève que classes, texte et images, pas de couleur. La carte PNJ reste égale à `a7f0463`.
- Fragment `contraste` (l.1334) : titres de carte et de groupe seulement.

### 4.4 Autres suites

- `forum-index` (`hors-perimetre`, empreinte `#col-right`, base `81512a3`, masques jusqu'à 52) : `[mod]` inchangé ; pas de PNJ ni de tags. Attendu vert.
- `plateau-qualite-usage` : l.52 fond des `.kr-skill-badge`/`.kr-stat-badge` ; l.87 refuse `rgb(201, 48, 44)` (le `#c9302c` du PNJ) ; l.65-67 en-tête de section (police, fond, filet), pas le badge.
- `plateau-profil-mobile` : `.kr-skill-badge` et `.badge` en géométrie seulement (l.165-169).
- `sous-forum`, `jeu-identite`, `report-non-lu`, `kramail-redaction` : rien de figé en couleur sur la liste.

## 5. `tests/e2e/lib/variantes.mjs`

- `VARIANTES` l.19-21 (16 variantes ; importées `as TOUTES` par cartes-pastilles).
- Blocs : 5.1 l.329-382, 5.2 l.384-431, 5.3 l.433-466, 5.4 l.468-496.
  - `PASTILLES_TICKET54` l.475 ;
  - `CARTES_TICKET54` l.490, liste combinée, `!important` ;
  - `AVANT_TICKET54` l.496 : `a[href*=kramail] .badge:not(:empty){background-color:var(--kr-status-unread)!important`.
- `CONTRASTE` l.533. Le bloc 5.5 s'insère après l.496.
- Effet de 5.5 sur le détecteur `AVANT_TICKET54` : sa chaîne finit par le dernier sélecteur de la règle l.797, suivi de `{background-color:…`. Le sélecteur des compteurs de contact doit donc être placé en tête de liste. En fin de liste, le détecteur dirait « avant 5.4 » pour tout bundle postérieur à 5.5. À vérifier sur le bundle construit.

## 6. Routeur (`tests/e2e/lib/router.mjs`)

- Entrée `cartes-pastilles` l.91 : frags carte, module, kramail, forum, lignes, chevron, bureau, bascule, groupes, pastilles, contraste ; `needsBootstrap: true`.
- KEYWORDS :
  - l.168 : `dashboard-card-pnj`, `kr-skill-badge`, `kr-stat-badge`, `kr-topic-badge`, `kr-room-here`… vers `typographie-formes` ;
  - l.171 : `tagforum`… vers `typographie-formes` ;
  - l.190 : `badge-danger|kr-bell-swing|fa-bell\b` vers `cartes-pastilles`, `typographie-formes` (couvre le hunk l.797) ;
  - l.193 : `dashboard-section|…` vers `cartes-pastilles`, `plateau`, `typographie-formes` (couvre le compteur de groupe).
  - Aucun mot-clé pour `xmini`, `forum-tags`, `btn-danger`. Un hunk CSS sans mot-clé élargit au total.
- FILE_RULES :
  - l.121 : `plateau-(qualite-usage|minimal).html` vers `plateau`, `cartes-pastilles` ;
  - l.127 : `sous-forum-debuter.html` ;
  - l.130 : `kramail-reception.html` ;
  - l.131 : autres fixtures, règle « fixture » (suites citant le nom du fichier).
- `MAX_CITING = 3` (l.227). `TOKEN_RE` exige un tiret. `citedBy` lit les suites seules (`lib/` exclu). `addCited` (l.362-367) ne retient que les jetons précédés de `.`, `#` ou d'un guillemet.

Décompte (suites citant le jeton, `grep -l tests/e2e/*.mjs`, à `59567f0`) :

| Jeton | Suites | Après 5.5 si cartes-pastilles le cite en dur |
|---|---|---|
| `dashboard-card-pnj` | 1 (typographie-formes) | 2 |
| `forum-tags` | 1 (typographie-formes) | 2 |
| `btn-danger` | 1 (palette-nation) | 2 |
| `dashboard-section-header` | 2 (plateau-qualite-usage, typographie-formes) | 3 (limite) |
| `kr-arm-ink` | 3 (modale-ordre, palette-nation, report-non-lu) | 4 : transverse, à éviter |
| `kr-arm-bg` | 5 (forum-index, kramail-redaction, modale-ordre, palette-nation, report-non-lu) | déjà transverse |
| `kr-status-unread` | 2 (palette-nation, report-non-lu) ; cartes-pastilles passe par `variantes.mjs` | inchangé |
| `tagforum` | 4 (forum-index, palette-nation, sous-forum, typographie-formes) | déjà transverse |
| `label-default`, `badge1000`, `kr-badge-pnj` | 0 (fixtures seulement) | — |

`xmini`, `label`, `badge`, `pnj` (sans tiret) ne sont jamais des repères.
