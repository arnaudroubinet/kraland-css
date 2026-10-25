# Inventaire : Ligne de forum, icône lue dans la liste latérale, forum sans message, compteurs et flèche sur ordinateur (Q27)

Annexe du plan `story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m-plan.md` (épopée forum, entrée 6). Relevé en lecture seule
sur `6ba0838558613990b297b68eb22a3984a2c99674`. Les numéros de ligne sont ceux de cette base : à revérifier au build.

## 1. Relevé

### 1.1 Ligne native de l'index (fixtures, aucune icône dans le tableau)

Tableau `#col-right .panel-default table.table`, une ligne par forum :

| Cellule | Contenu natif |
|---|---|
| `td:nth-child(1)` | `p.nomargin > a[href="forum/rp/taverne-10101"]` (nom) ; `p.nomargin.tagforum` (description) ; `span.tagforum` (modérateurs, `i.fa-gavel`, `span.label`) |
| `td:nth-child(2)` | `td.center`, nombre de sujets |
| `td:nth-child(3)` | `td.center`, nombre de messages |
| `td:nth-child(4)` | `a.nomargin` (auteur, parfois précédé d'un `img.icon`) ; `p.nomargin.mini > span.btn-group.btn-group-xs > a.btn.btn-default[href="forum/sujet/…#msgN"] > i.fa.fa-arrow-right`, puis l'heure en texte nu (« Hier (13:20) », « Aujourd'hui (09:05) », « 19/10 (21:43) ») |

Forum sans message : `td:nth-child(2)` et `(3)` à `0`, `td:nth-child(4)` vide (`<td></td>`), aucun `span.tagforum` de description.

La ligne native **n'a aucune icône de forum**. « Repli sur l'icône native » (ticket) ne peut donc rien poser : voir Ask First 2 du plan.

### 1.2 Liste latérale native (source de vérité, AGENTS.md)

`#col-left .list-group` : un `span.list-group-item.active` (titre de catégorie, sans `href`), puis
`a.list-group-item[href="forum/rp/…"] > span.lefticon > i.far.fa-…` suivi du libellé en texte nu. Le template peut y insérer une
`span.lefticon > img` (l.8541, drapeaux du formulaire de la peau, hors `#col-left` des fixtures).

### 1.3 Correspondance URL ↔ liste latérale dans les fixtures

Clé de comparaison prévue : `krForumNormalizePath(new URL(href, document.baseURI).pathname)` des deux côtés (cœur pur l.94).

| Fixture | Lignes de l'index (href du nom) | Entrées de la liste latérale | Absentes de la liste | En trop dans la liste |
|---|---|---|---|---|
| `forum-index-rp.html` (`/forum/rp`, servi aussi à `/forum/hrp`, `/forum/debats`, `/forum/staff`) | taverne-10101, marche-10102, royaume-d-essai-10104, les-cadets-d-essai-10107 (0/0, td4 vide) | les 4 mêmes : `far fa-comments`, `far fa-gem`, `far fa-flag`, `far fa-handshake` | aucune | aucune |
| `forum-index-communaute.html` (`/forum/communaute`) | annonces-30101, clubs-30102, archives-30103 (0/0, td4 vide) | les 3 mêmes : `far fa-newspaper`, `far fa-smile`, `far fa-folder` | aucune | aucune |
| `forum-racine-groupes.html` (`/forum`) | 1er groupe : `forum/rp/…` (4 forums, Cadets 0/0) ; 2e groupe : `forum/hrp/taverne-10101`, `forum/hrp/marche-10102`, `forum/hrp/royaume-d-essai-10104`, `forum/hrp/les-cadets-d-essai-10107` | les 4 forums RP (mêmes icônes que l'index RP) | **les 4 du 2e groupe** (cas naturel d'URL absente) | aucune |
| `forum-racine.html` (`/forum`) | taverne-10101, marche-10102 | **aucune liste** (`#col-left` sans `.list-group` de forums ; `span.lefticon` présent seulement dans `span.tagforum` des modérateurs) | toutes | — |
| `forum-colonne-native-rp.html` (fragment `#col-left` seul, composé en mémoire avec l'index RP) | — | taverne-10101 `far fa-comments`, marche-10102 `far fa-gem`, monde-10103 `far fa-circle` | royaume-d-essai-10104, les-cadets-d-essai-10107 | monde-10103 (aucune ligne) |
| `forum-colonne-native-hrp.html` | — | site-annonces-20101 `far fa-flag`, debuter-20102 `fa fa-paper-plane`, regles, entracte, bugs | — | — |
| `sous-forum-debuter.html` | (sous-forum, hors périmètre) | liste sans `lefticon` | — | — |

Cas à composer en mémoire, sans nouvelle fixture :
- entrée désactivée : `class="list-group-item disabled"` ou `aria-disabled="true"` sur l'entrée Marché de l'index RP (`krForumIsDisabledEntry`, l.119) ;
- icône image : `span.lefticon > i` de Taverne remplacé par `img[src="data:image/svg+xml;base64,…"]` (même schéma que `img.icon` de Corvin) ;
- entrée sans `span.lefticon` : libellé seul sur Royaume ;
- `#col-left` retiré : aucune liste ;
- composition index RP + `forum-colonne-native-rp.html` (URL absentes et entrée en trop) ;
- `href` absolu (`http://www.kraland.org/forum/rp/taverne-10101`) ou avec `?`/`#` sur une entrée : même clé normalisée.

### 1.4 Code relu (template)

- l.80-125, bloc pur `menus-forums` : `FORUM_MENUS`, `krForumNormalizePath`, `krForumMenuForPath`, `krForumIsIndexPath` (racine et index RP, HRP, Communauté, Débats ; Staff exclu), `krForumIsDisabledEntry`. Aucun ajout prévu au cœur pur.
- l.3147 `isThemeEnabled` ; l.3759-3760 `kr-page-forum-index` posée dans `applyThemeInline` (peau active seulement) ; l.3734 `kr-theme-enabled`.
- l.3883-3895 `applyDOMTransformations` (peau active seulement), 1re transformation `window.captureForumSidebar` (lecture de la liste avant la peau, l.4739).
- l.4535-4760, IIFE des menus : `destinationKey`, `labelOf`, `DECORATIONS` (l.4555) **privés**, inaccessibles au module de l'index.
- l.5672-5733, module `ForumIndex:Presentation` : `labelRows(table)` (`data-kr-unit` sur `cells[1]`, `cells[2]` ; `aria-label` de `cells[3] .btn-group > a.btn`), `transformHeader`, `initForumIndex()` qui sort sans `kr-page-forum-index`. `InitQueue.register('ForumIndex:Presentation', initForumIndex, 26)`. Point d'accroche de l'icône.
- l.11131-11200 : `InitQueue.run()` tourne même peau coupée ; la garde `kr-page-forum-index` du module suffit (classe absente sans peau).
- `ForumCards:MobileTransform` (l.4767+, priorité 15) et `PermanentTopics:Icons` (l.5340, 25) excluent l'index.
- Aucune occurrence de `kr-forum-icon`, `kr-forum-row` dans le template, la feuille ou les suites.

## 2. Règles CSS en jeu (`kraland-theme.css`, section « INDEX DU FORUM », l.14561-14995)

Sélecteur de base : `:where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr` (spécificité (1,2,2)).

### 2.1 Commun (`@media (max-width: 767px), (min-width: 768px)`)

- l.14573 `td:first-child > .tagforum` masqué (D14 : non touché) ;
- l.14577-14581 `i.fa-comments-o` de l'en-tête de section, `::before "\f086"`.

### 2.2 Mobile (`@media (max-width: 767px)`)

- l.14725 `tr` : flex wrap, `min-height: 72px`, `align-content: center` (6.2), `padding: 10px 56px 10px 12px !important` ;
- l.14774-14776 `td:nth-child(1)`, `td:nth-child(4)`, `td:first-child > p:not(.tagforum)` en `display: contents !important` : un enfant de `td1` devient élément flex de la ligne ;
- l.14781 `td a:not(.btn)` : réinitialisation de la règle de toucher (`display: block !important`…) ;
- l.14791 nom : `order: 1`, `flex: 1 1 0 !important`, `--kr-text-primary`, `--kr-font-forum-name`, 400 ; l.14803 lien étiré `::after` inset 0, z-index 1 ;
- l.14811 auteur `td:nth-child(4) > a.nomargin` : `order: 7`, `--kr-text-primary`, 600, `pointer-events: none`, `::before "Dernier : "` (l.14820), `::after` virgule (l.14826) ;
- l.14832 `p.mini` : `order: 8` ; l.14840 `.btn-group` absolu à droite, 8 px, 44 × 44, z-index 2 ; l.14854 `a.btn` 44, bordure `--kr-border-strong`, fond transparent, `--kr-text-primary`, 16 px ;
- l.14872-14885 compteurs : `order` 11 et 12, `::after attr(data-kr-unit)`, « · » ;
- l.14889 `tr:active`.

Effet attendu d'une icône insérée dans `td1` : élément flex de la ligne (via `display: contents`), sans `order` déclaré donc `order: 0`, placé avant le nom (`order: 1`). Une règle d'icône mobile doit fixer `flex: 0 0 auto` et rester sur la rangée du nom ; sinon la ligne passe de 3 à 4 rangées.

### 2.3 Ordinateur (`@media (min-width: 768px)`, l.14893-14995)

- l.14897 `td` : `padding: var(--kr-space-1) var(--kr-space-2) !important`, `vertical-align: middle !important` ;
- l.14902 `p:not(.tagforum)` inline ; l.14907 nom `--kr-text-primary !important`, `--kr-font-forum-name !important`, 400 `!important`, `line-height: 1.35` ; l.14914 survol souligné ;
- l.14919-14925 `td2`, `td3` : `tabular-nums`, `text-align: right !important`, `nowrap`, `--kr-font-detail` ; couleur héritée (aucune déclaration) ; l.14927 `thead th2/th3` à droite ;
- l.14935 auteur : `display: block`, `color: var(--kr-text-primary) !important`, 700 `!important`, `--kr-font-detail !important` ;
- l.14942 `p.mini` : block, `margin: 0 !important`, `--kr-text-secondary !important`, `--kr-font-detail !important`, `nowrap` ;
- l.14950 `td4` : `position: relative`, `padding-right: 52px !important` ; **aucun `text-align`** : auteur et heure à gauche de la cellule ;
- l.14955 `.btn-group` : absolu, `top: 50%`, `right: 10px`, `width: 32px`, `height: 32px`, `transform: translateY(-50%)` ;
- l.14967 `a.btn` : `inline-flex !important`, `width: 32px !important`, `height: 32px !important`, `min-width: 32px !important`, `padding: 0 !important`, bordure `--kr-border-strong !important`, `--kr-radius-sm !important`, fond transparent `!important`, `--kr-text-primary !important`, `font-size: 14px !important` ; l.14982 survol : bordure primaire, `--kr-bg-hover`.

Réécritures en place prévues (P1 option 4, compte `!important` inchangé ou en baisse) : l.14937 (couleur de l'auteur), l.14950 (`text-align` ajouté sans `!important`, aucune règle concurrente connue à vérifier au CDP), l.14955 et l.14967 (32 → 34). Nouvelles règles de l'icône, sans `!important`, dans chacun des deux médias.

Autres repères : l.8443 `:where(html:not(.kr-page-forum-index)) … span.tagforum > .lefticon` (hors index) ; l.7794 `.lefticon` du formulaire de la peau ; `--kr-text-accent` déclaré l.47 (`var(--kr-highlight)`), `#8a5a00` en Empire Brun clair l.183, redéfini dans les 16 variantes (`JETONS_REDEFINIS`, `lib/variantes.mjs` l.30).

Compte de base : `grep -c '!important' kraland-theme.css` = **3290**.

## 3. Défauts constatés

| # | Défaut | Support | Origine |
|---|---|---|---|
| D1 | Aucune icône de forum sur la ligne ; la liste latérale en porte une par forum | les deux | HTML natif (Q27.3, M13) |
| D2 | Flèche « dernier message » de 32 px (DESIGN : 34 px) | ordinateur | l.14955, l.14967 |
| D3 | Auteur en `--kr-text-primary` (DESIGN : `{colors.text-accent}`) | ordinateur | l.14937 |
| D4 | Auteur et heure alignés à gauche dans la cellule (DESIGN : alignés à droite avec la flèche) | ordinateur | l.14950 (aucun `text-align`) |
| D5 | Compteurs en colonnes à couleur héritée (DESIGN : « N sujets · N messages » en `text-secondary`) | ordinateur | décision 6.1 (revue-manuelle l.86), non confirmée par Arnaud (l.366) : Ask First 1 |

Constats sans défaut : forum sans message déjà sans flèche ni contenu (td4 vide, mobile 72 px, `forum-index.mjs` l.420 et l.500) ; heure native gardée (texte nu de `p.mini`).

## 4. Assertions qui figent le rendu touché

| Suite | Lieu | Figé | Effet attendu du ticket |
|---|---|---|---|
| `forum-activite.mjs` | `lignes` l.357 (base `0523d7f`, 375 et 767) | lignes à 3 rangées égales au bundle de base ; forum sans message à 72 px | icône dans la ligne : boîtes et rangées diffèrent de la base → masque (§5.1) ; 72 px gardés |
| `forum-activite.mjs` | `seuil` l.428 (768, 769) | égal à la base | icône, flèche 34, auteur accent, alignement → masque |
| `forum-activite.mjs` | `bureau` l.476 (768, 769, 1280 ; index RP et racine) | lignes et flèches égales à la base | flèche 34, auteur, alignement, icône → masque |
| `forum-activite.mjs` | `fil` l.604 (base `5042afd`) | bureau 768/769/1280 égal à la base, index compris | idem si l'index y est relevé → masque selon le rouge avant |
| `forum-index.mjs` | `mobile` l.386 | ordre nom, « Dernier : auteur, heure », compteurs | inchangé (l'`i` n'a pas de texte) ; à vérifier |
| `forum-index.mjs` | `mobile` l.447 « même rendu que le sous-forum » (`COMPOSANTS_MOBILE` l.271) | nom, auteur, flèche, compteurs égaux au sous-forum | inchangé (mobile non touché hors icône) |
| `forum-index.mjs` | `bureau` l.470, l.478, l.482 « auteur en gras, heure atténuée », l.490 « bouton → au bout de la ligne », l.500 `texte === "${nom} 0 0"`, l.506 | colonnes, gras, position de la flèche, forum sans message | l.482 et l.490 restent vrais ; l.500 inchangé (texte vide de l'icône) |
| `forum-index.mjs` | `bureau` l.523 « même rendu que le sous-forum » (`COMPOSANTS_BUREAU` l.294 : `auteur du dernier message` `color`, `bouton →` `width`/`height`, `cellule du dernier message`) | auteur `--kr-text-primary`, flèche 32 px comme au sous-forum | **diverge** (accent, 34 px, `text-align`) : écart nommé et consigné (Ask First 5) |
| `forum-index.mjs` | `hors-perimetre` l.670 (base `81512a3`) | pages sans `kr-page-forum-index` égales à « avant » ; racine à groupes l.686, l.702 | inchangé si l'icône reste sous la garde ; Staff, sous-forum, sujet inchangés |
| `forum-index.mjs` | `peau-coupee` l.826, l.840 | `#col-right` identique à la page native | inchangé ; aucune `.kr-forum-icon` |
| `cartes-pastilles.mjs` | `lignes` l.632 (base `21fed8d`, 375 et 767, index RP, Communauté, racine à groupes) | `egal.icones` (`tr i` et visibilité), `boites.icones`, hauteur, cibles (centre, bords) égaux à la base | **rouge** : un `i` de plus par ligne → masque DOM et CSS |
| `cartes-pastilles.mjs` | `forum` l.540 (mobile, `comparer`) | panneaux, en-têtes, corps égaux à la base | rouge si la hauteur d'une ligne change → masque |
| `cartes-pastilles.mjs` | `bureau` l.765 (768, 769, 1280, 1440, 1920) | panneaux, en-têtes, titres et corps égaux à la base | rouge si la flèche de 34 px grandit la ligne → masque |
| `typographie-formes.mjs` | `echelle-forum` l.1156, miroir l.1193-1219 (base `d953969`, index RP 375, 768, 1280) | taille de chaque élément de `#col-right`, **nombre d'éléments** compris | **rouge** : `span.kr-forum-icon` et son `i` en plus → masque DOM |
| `typographie-formes.mjs` | `echelle-forum` `INDEX_ROLES` l.1027 | nom 15 px / 400, compteur 13 px, auteur 13 px | inchangé |
| `typographie-formes.mjs` | `espacement` l.1596 (base `62fd47d`, `index-rp` l.1499) | retraits et positions des cas E | à vérifier au rouge avant (icône et `text-align` peuvent déplacer un cas) |
| `typographie-formes.mjs` | `nettoyage` l.1931 (base `00b0786`) | `racine` (`forum-racine.html`, sans liste : aucune icône), `staff` (exclu) | inchangé attendu |
| `typographie-formes.mjs` | `bureau`, `mobile` (`index-rp` l.166, `.label`) | étiquettes | inchangé |
| `palette-nation.mjs` | balayage `PAGES_BALAYAGE` l.639 (index RP, absolu) | textes sur fond de nation ≥ 4,5:1 | vert attendu ; l'auteur n'est pas sur un fond de nation |
| `jeu-identite.mjs` | l.297, l.345-356 `MESURE_INDEX` | 4 lignes, `display: flex`, aucun décor de carte sur une ligne native réinsérée | inchangé (aucune cellule ajoutée) |
| `menus-forums.mjs` | lecture de la liste latérale | liste et menus | inchangé : la liste n'est que lue (Never) |

## 5. Masques et repères

### 5.1 Masques prévus (sur la base seulement, si `AVANT_TICKET66(base)`)

`AVANT_TICKET66 = bundle => !bundle.includes('kr-forum-icon')` : chaîne absente de toutes les bases citées (`0523d7f`, `5042afd`, `ef0e4d4`,
`1134ef9`, `21fed8d`, `81512a3`, `d953969`, `62fd47d`, `00b0786`, `d68ab55`, `6ba0838`…), à revérifier au build sur chaque base par
`git show <sha>:kraland-userscript-main.user.js | grep -c kr-forum-icon` = 0.

Deux pièces, dans `lib/variantes.mjs` :
- `LIGNE_TICKET66` : feuille miroir en valeurs littérales des déclarations du ticket (icône mobile et ordinateur, flèche 34 px, auteur `--kr-text-accent`, `text-align: right` de `td4`), mêmes sélecteurs et médias ; `!important` permis dans le miroir là où la base force la valeur (masque de test, pas le produit) ;
- `ligneTicket66()` : script d'initialisation qui pose sur la base, après `ForumIndex:Presentation`, la même `span.kr-forum-icon[aria-hidden="true"]` clonée de la liste latérale, avec la même clé d'URL.

| Suite | Fragment | Masque | Condition de retrait |
|---|---|---|---|
| `forum-activite.mjs` | `lignes`, `seuil`, `bureau` (base `0523d7f`) | `LIGNE_TICKET66` + `ligneTicket66` | quand `COMMIT_AVANT` est réaligné sur un SHA qui contient 6.6 ; réalignement porté par le sweep 6.7 ou l'action A4 de la rétro 5 (tickets à venir) |
| `forum-activite.mjs` | `fil` (base `5042afd`), si le rouge avant le montre | idem | quand `COMMIT_FIL` est réaligné (sweep 6.7 ou A4) |
| `cartes-pastilles.mjs` | `lignes`, `forum`, `bureau` (base `21fed8d`) | idem | quand `COMMIT_AVANT` est réaligné (sweep 6.7 ou A4) |
| `typographie-formes.mjs` | `echelle-forum` (base `d953969`), `espacement` (base `62fd47d`) si le rouge avant le montre | idem, ajoutés aux listes existantes l.1211 | quand `COMMIT_ECHELLE_FORUM` / `COMMIT_ESPACEMENT` sont réalignés (sweep 6.7 ou A4) |
| `forum-index.mjs` | aucun masque : l.523 reçoit une exception nommée (Ask First 5), pas un masque | — | — |
| `palette-nation.mjs`, `jeu-identite.mjs`, `menus-forums.mjs` | aucun attendu | — | — |

Un masque n'est posé que si le rouge avant le rend nécessaire : rouge sans lui, vert avec lui (preuve par masque). Jamais
« quand le bundle de base contient l'entrée ».

### 5.2 Repères du routeur (`tests/e2e/lib/router.mjs`)

`MAX_CITING = 3` (l.258). `TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g` (l.259). Seuls les fichiers de `SUITES` comptent
(pas `lib/variantes.mjs`). Relevé sur `6ba0838` (script hors dépôt `/tmp/kr66/tok.mjs`) :

| Jeton | Suites qui le citent | Règle pour 6.6 |
|---|---|---|
| `kr-forum-icon` | 0 | nouveau ; écrit en clair dans `lib/variantes.mjs` seulement ; routé par un mot-clé `KEYWORDS` |
| `lefticon` | 0 | libre (≤ 3 après ajout dans `forum-activite`) ; préférer `lib/variantes.mjs` |
| `kr-page-forum-index` | **3** (forum-index, jeu-identite, typographie-formes) | jamais en clair dans `forum-activite.mjs` (déjà `A.classeIndex`) |
| `kr-text-secondary` | **3** (forum-index, kramail-redaction, palette-nation) | jamais en clair dans une autre suite |
| `forum-index-communaute` | **3** (forum-index, typographie-formes, cartes-pastilles) | jamais en clair dans `forum-activite.mjs` (déjà `A.indexCommunaute`) |
| `forum-racine-groupes` | 3 (forum-index, cartes-pastilles, forum-activite) | déjà cité par forum-activite : sans effet |
| `forum-colonne-native-rp` | 1 (menus-forums) | libre ; préférer `lib/variantes.mjs` |
| `forum-colonne-native-hrp` | 2 | libre |
| `data-kr-unit` | 1 | libre |
| `list-group` | 2 | ne pas l'ajouter à une 2e suite de plus |
| `list-group-item`, `kr-text-accent`, `forum-index-rp`, `btn-group`, `col-left`, `col-right`, `kr-theme-enabled`, `sous-forum-debuter` | > 3 | transverses : sans effet |
| `fa-arrow-right`, `tagforum`, `far`, `fa-gem` | 0 | libres |

Mot-clé prévu : `[/kr-forum-icon/, ['forum-activite', 'cartes-pastilles', 'typographie-formes']]` (le mot-clé `forum` existant
`(?<!sous-|sub)forum` ajoute déjà la zone `forum`). Un hunk CSS `:where(html.kr-page-forum-index) … tbody > tr` route déjà vers
`forum-activite` (l.209) ; un hunk du module `ForumIndex:` route vers `forum`, `sous-forum`, `forum-activite` (`SECTIONS` l.231).
Fragment `['ligne']` ajouté à `forum-activite` dans `SUITES` (l.98) ; cas dans `router.test.mjs` (mot-clé, section, fragment).
Relevé refait sur les suites finies : aucun jeton ne passe de 3 à 4.

### 5.3 Hors périmètre

`span.tagforum` (D14), graisse du nom (400 contre 700, revue-manuelle l.89), sous-forum (flèche 32 px, Msg/Vus), Staff, liste latérale
et menus (`menus-forums`), « N sujets · N messages » sur ordinateur (Ask First 1), mobile hors icône (auteur, flèche 44, compteurs).
