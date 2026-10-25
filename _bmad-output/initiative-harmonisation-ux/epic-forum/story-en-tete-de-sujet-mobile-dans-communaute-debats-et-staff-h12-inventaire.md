# Inventaire — ticket 6.4 : en-tête de sujet mobile dans Communauté, Débats et Staff (H12.4)

Relevé sur `ef0e4d4df2d036034df11a9065625428393a1799`, le 2026-10-25. Le code cité (template, CSS, suites) est celui de ce SHA.

Conditions du relevé sur le site réel (mandat d'Arnaud : « Tu as le droit d'aller sur le site juste pas faire des actions ») :

- Chrome Kraland dédié (CDP 9223), piloté par `connectOverCDP`, un onglet à moi, fermé à la fin de chaque script. Jamais le 9222.
- Variante du compte : `kr-theme-variant-empire-brun-dark`, non modifiée.
- Chargeur de dev Tampermonkey actif (`[Kraland Dev] JS chargé`), template servi par `npm run serve` (4848), donc peau de `ef0e4d4`.
- Lecture seule : `page.goto` sur des URL de lecture et `evaluate` en lecture. Aucun clic, aucun formulaire, aucune cloche, aucun `/report`, aucune action de jeu.
- Natif lu par `resp.text()` + `DOMParser` sur la réponse du `goto`, sans requête en plus.
- Mobile émulé 375×667 (CDP, tactile) ; bureau 1280×720.

Notes brutes hors dépôt, dans `/tmp/kr64/` : `decouverte.json`, `sousforums.json`, `sujets.json`, `complement.json`, `tokens2.txt` ; scripts `decouverte.cjs`, `sousforums.cjs`, `sujets.cjs`, `complement.cjs`, `tokens2.mjs`. Aucune capture HTML brute, aucun message, aucun identifiant de session ni jeton dans ce document.

**Validation du relevé (hitl) :** à faire par Arnaud. Le build se fait sur ce relevé ; la validation est consignée au plan (Verification, Manual checks).

## 1. Relevé par catégorie

### 1.1 Index de catégorie

| Catégorie | Chemin | Statut | h1 | Entrée active `#col-left` |
|---|---|---|---|---|
| Jeu (RP) | `/forum/rp` | 200 | « Jeu (RP) » | « Jeu (RP) » |
| Jeu (HRP) | `/forum/hrp` | 200 | « Jeu (HRP) » | « Jeu (HRP) » |
| Communauté | `/forum/communaute` | 200 | « Communauté » | « Communauté » |
| Débats | `/forum/debats` | 200 | « Débats » | « Débats » |
| Staff | `/forum/staff` | 200, **« Accès Refusé à la Page ! »** (`div.alert.alert-danger.alert-dismissible`) | — | « Nouvelles » |

**Staff : aucun accès pour ce compte.** Aucun sujet Staff relevé. Selon l'open question de l'épopée, la fixture Staff suit la structure RP, avec l'hypothèse d'un parent `forum/staff/<slug>-<id>` et d'une entrée active « Staff ».

### 1.2 Sous-forums (slugs relevés)

- RP : `taverne-10101`, `marche-10102`, `monde-10103`, `royaume-de-ruthvenie-101118`, …
- HRP : `site-annonces-20101`, `debuter-20102`, `regles-20103`, `entracte-20104`, `bugs-20105`.
- Communauté : `bavardage-divers-30101`, `entraide-30102`, `loisirs-30103`, `jeux-30104`, `rencontres-rik-30105`.
- Débats : `politique-societe-40101`, `culture-40102`, `histoire-40103`, `sciences-40104`.

### 1.3 Sujets relevés

| Clé | Catégorie | Identifiant | État | Pagination |
|---|---|---|---|---|
| rp-ouvert | RP | 335123 | ouvert | vide |
| rp-ferme | RP | 329508 | fermé | vide |
| hrp-ouvert | HRP | 329448 | ouvert | vide |
| hrp-ferme | HRP | 334914 | fermé | vide |
| hrp-multipage | HRP | 256318, page 36 | fermé | 14 `li` |
| communaute-ouvert | Communauté | 328906, page 2 | ouvert | 14 `li` |
| communaute-ferme | Communauté | 275241 | fermé, `img.icon` dans le h1 | vide |
| entraide-ferme | Communauté (entraide) | 278078 | fermé | vide |
| debats-ouvert | Débats | 312800 | ouvert | 8 `li` |
| debats-multipage | Débats | 295275, page 2 | ouvert, alerte de modération `alert-warning alert-dismissible` | 14 `li` |
| debats-ferme | Débats | 275237 | fermé, `img.icon` dans le h1 | vide |

### 1.4 Structure native du sujet (identique dans les 4 catégories accessibles)

`#col-right` contient, dans l'ordre :

1. `h1.page-header` : `i.far.fa-comments` + texte du titre. Variante : un `img.icon` en plus (src `http://img7.kraland.org/s/*`, alt « [=!] »), vu sur communaute-ferme et debats-ferme.
2. `div.forum-top` (haut) :
   - `span` vide, ou `span > i.fa.fa-lock` si le sujet est fermé ;
   - `span` « Par <auteur> » ;
   - `span` « N messages » ;
   - `span.pull-right` (boutons, ci-dessous).
3. `div.center > ul.pagination` : **toujours présent**, vide (0 `li`) sur un sujet d'une page.
4. `ul.media-list.forum` (messages). Une alerte de modération peut précéder.
5. `div.center > ul.pagination` (bas), même règle.
6. `div.forum-top` (bas) : `span.pull-right` seul.

`.pull-right`, en haut et en bas, dans cet ordre :

| Élément | `href` / attribut | Icône | Libellé |
|---|---|---|---|
| `a.btn.btn-default` | `forum/<cat>/<slug>-<id>`, `title` = nom du forum | `i.fa.fa-backward` | nom du forum |
| `button.btn.btn-default` | `title="lien"` | `fa-link` | — |
| `a.btn.btn-default` | `forum/post/nouveau-sujet-1-<idforum>`, `title="nouveau sujet"` | `fa-comment` | — |
| `a.btn.btn-default` | `forum/post/repondre-2-<idsujet>`, `title="répondre"` | `fa-reply` | — |
| `a.btn.btn-default` | `forum/sujet/<slug>-<id>-999`, `title="liste des messages"` | `fa-th-list` | — |

Aucun `.btn-group` entre le h1 et les messages. `#col-left` porte l'entrée active de la catégorie (`.list-group-item.active`).

### 1.5 Sujet fermé

- Trouvé dans les 4 catégories accessibles (rp-ferme, hrp-ferme, hrp-multipage, communaute-ferme, entraide-ferme, debats-ferme).
- Marque : `i.fa.fa-lock` dans le premier `span` du `.forum-top` du haut, en haut seulement.
- **Le lien natif `forum/post/repondre-2-<id>` reste présent** sur tous les sujets fermés relevés, en haut et en bas (et le bouton « citer » des messages aussi), pour ce compte. Hypothèse : droits du compte (modération ou ancienneté) ; non vérifiable sans un autre compte.
- Conséquence : le commentaire du template (« absent si le sujet est fermé ») et la variante `locked` de `forum-mobile.mjs` (lien retiré, sans cadenas) décrivent un cas que ce compte ne voit pas.

### 1.6 Peau actuelle (`ef0e4d4`), mobile 375

| Page | Fil | Barre du haut | Barre du bas | Boutons natifs | Débordement X |
|---|---|---|---|---|---|
| RP, HRP (ouverts et fermés) | `forum-thread-mobile-breadcrumb` « Jeu (RP) › Taverne › … » | Répondre 175,3×44 r=4 px ; Nouveau sujet 157,7×44 | Répondre 151,3×44 ; Nouveau sujet 145,7×44 | masqués | 0 |
| Communauté, Débats (tous) | **aucun** | **aucune** | **aucune** | visibles : forum 179,2×46, lien 56×44, nouveau sujet 143,1×46, répondre 112,5×46, liste 56×44, en haut et en bas | 0 |

- RP et HRP fermés : « Répondre » est affiché (le lien natif existe, §1.5).
- RP/HRP : `.forum-top` du haut visible (méta, 375×35) ; h1 en style en ligne `!important`.
- hrp-multipage : h1 y=101 h=117 ; barre y=161 ; forum-top y=230 ; pagination y=283 h=88 ; pagination du bas y=4860 ; barre du bas y=4991 (même y que le forum-top du bas, h=44).
- Communauté/Débats : h1 natif (47 px), pagination visible sur les sujets multipages. **L4 confirmé :** le module rend la main avec `console.warn('[Forum Thread Mobile] Liens non trouvés')`.

### 1.7 Bureau 1280

Aucun fil, aucune barre ; les 10 boutons natifs visibles, dans toutes les catégories. Rien à changer.

### 1.8 Écarts avec la fixture `forum-sujet.html`

| Point | Site réel | `forum-sujet.html` |
|---|---|---|
| `.forum-top` du bas | présent (`.pull-right` seul) | **absent** (un seul `.forum-top`) |
| Pagination du bas | présente | **absente** |
| Pagination d'un sujet d'une page | présente, vide | 2 pages, en haut seulement |
| `#col-left` | entrée active de la catégorie | **vide** |
| Cadenas d'un sujet fermé | `span > i.fa.fa-lock` | absent |
| `img.icon` dans le h1 | possible | absent |
| Catégorie | rp, hrp, communaute, debats | hrp seulement (`site-annonces-20101`) |

`forum-mobile.mjs` construit sa propre page de sujet (`forumTop(first, locked)` l.100-107), avec pagination et `.forum-top` en haut et en bas ; sa variante `locked` retire le lien « répondre » sans poser de cadenas.

## 2. Règles actuelles

### 2.1 JS — ForumThread:MobileBreadcrumb (`kraland-userscript-template.js` l.7097-7331, priorité 25)

- Garde : `document.body.classList.contains('mobile-mode')` et chemin `/forum/sujet/`.
- `forumHeading = '.container h1.page-header'`, `forumTops = '.forum-top'`.
- Titre : premier nœud texte du h1 ; `cloneVisibleContent` garde les `<img>`.
- **Cause L4 :** `taverneLink = firstForumTop.querySelector('a[href*="forum/rp/"], a[href*="forum/hrp/"]')`. Absent : `console.warn` et retour, sans rien transformer.
- `newTopicLink = a[href*="nouveau-sujet"]` ; `replyLink = a[href*="post/repondre"]`.
- Catégorie en dur : `categoryName = 'Jeu (RP)' / 'Jeu (HRP)'`, `categoryUrl = 'forum/rp' / 'forum/hrp'`.
- `createBreadcrumb(isBottom)` : classe `forum-thread-mobile-breadcrumb` (le suffixe `-bottom` n'est jamais utilisé), tout en `style.cssText` ; liens en `text-secondary`, sans `min-height`.
- `createThreadActions(isBottom)` : `div.forum-thread-actions` (+ `forum-thread-actions-bottom`) ; `a.forum-thread-action.forum-thread-action-reply` (fa-reply, « Répondre ») seulement si `replyLink` ; `a.forum-thread-action.forum-thread-action-new` (fa-plus, « Nouveau sujet ») ; `href` recopiés.
- h1 vidé (`innerHTML = ''`), `cssText` `margin: 12px 16px !important; padding: 0 !important; background: transparent !important`, puis fil + barre.
- `.forum-top` d'index > 0 vidés, `cssText` `!important`, barre du bas.
- Premier `.forum-top` : méta gardée, `.pull-right` masqués par `action.parentElement.style.display = 'none'`.
- `.container h1.page-header + .row + .row .btn-group` masqué (absent du site relevé).

Autres repères du template :

- `createForumBreadcrumb(parents, currentText)` l.5410-5437, section « FIL D'ARIANE DU FORUM (H12.3) » (famille `forum-mobile-breadcrumb`, `-link`, `-label`, `-sep` aria-hidden, `-current`).
- `getActiveTitleLabel()` l.8384 (lit `#col-left .list-group-item.active`).
- `FORUM_MENUS` l.86-92 : `rp`, `hrp`, `communaute`, `debats`, `staff` (chemins).
- Classes de page l.863 : `page-forum` sur tout `/forum/*`, `page-forum-racine` sur `/forum`. **Aucune classe de page « sujet » n'est posée** : `.page-forum-sujet` n'existe que dans le CSS (l.11509, règle morte).
- `kr-page-forum-index` l.3760 ; `krForumIsIndexPath` l.110 (exclut staff).
- ForumThread:HideTags l.7334 (26), ForumHeader l.5441, ForumIndex l.5652, `isMobileMode` l.399.

### 2.2 CSS (`kraland-theme.css`)

- l.13338-13396, `@media (max-width: 767px)` « FORUM MOBILE : actions » :
  - `.forum-thread-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 12px }` ;
  - `.forum-thread-actions-bottom { margin: 12px 52px 16px 16px }` (N-1 : place du bouton « Remonter ») ;
  - `.forum-thread-action { display: flex; flex: 1 1 140px; min-height: 48px; padding: 0 14px; border: 2px solid var(--kr-primary); border-radius: var(--kr-radius-sm); font-size: var(--kr-font-button); font-weight: 600; … }` ;
  - `.forum-thread-action-reply { flex-grow: 2; background: var(--kr-arm-bg, var(--kr-primary)); color: var(--kr-arm-ink, var(--kr-white)) !important }`, plus `:hover` / `:active` en `!important` ;
  - `.forum-thread-action-new { background: transparent; color: var(--kr-text-primary, var(--kr-primary)) !important }`.
  - Mesure : 44 px de haut, rayon 4 px. Le `min-height: 48px` est battu par une règle mobile générique `min-height: 44px !important` (à confirmer au CDP pendant le build).
- l.13694-13730, bloc L2 du sous-forum : `.forum-subforum-actions-top/bottom .forum-thread-action { flex: 0 0 auto; min-height: 44px; padding: 0 16px; white-space: nowrap }`. **Le sous-forum partage `.forum-thread-action-new`** (son « Nouveau sujet »).
- l.14571-14615 : fil commun sous `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb*` (nowrap, lien `min-height: 44px` et `max-width: 50 %`, libellé en ellipse, courant tronqué). Le sujet n'a ni `kr-page-forum-index` ni `kr-subforum` : la garde ne l'atteint pas.
- l.2391-2413 : bouton standard `html.kr-theme-enabled .btn-default.btn-default:where(…)` (fond `--kr-bg-surface`, bordure `--kr-border-tint`, texte `--kr-text-nation`, survol `header-tint`).
- Bouton primaire : `.btn-primary` sur `--kr-arm-bg` / `--kr-arm-ink`. **Il n'existe aucun jeton `--kr-action-bg`** : « action-bg / action-ink » de DESIGN correspond aux jetons `--kr-arm-*`.
- Jetons : `--kr-text-nation` l.48, `--kr-border-tint` l.50, `--kr-bg-surface` l.54.
- Pagination mobile `.pagination li a` en 44×44 `!important` (l.4374+).
- `grep -c '!important' kraland-theme.css` = **3290**.

## 3. Doublons et défauts

- Deux fils d'Ariane coexistent : la famille commune (6.3) et `forum-thread-mobile-breadcrumb` (sujet, `cssText`, liens de 13 px sans hauteur minimale, 4,43:1 selon EXPERIENCE Q28).
- Catégorie écrite en dur et liste de catégories en dur (`forum/rp/`, `forum/hrp/`) : L4.
- Styles en ligne `!important` sur le h1 et les `.forum-top` : non surchargeables par la feuille (P1 option 4 interdit une règle concurrente ; il faut sortir ces styles du JS).
- « Nouveau sujet » transparent bordé en primaire, alors que DESIGN veut le bouton standard.
- `min-height: 48px` mort (battu par 44 px `!important`).

## 4. Assertions qui figent le rendu du sujet

| Suite | Lieu | Figé | Effet attendu de 6.4 |
|---|---|---|---|
| `forum-activite.mjs` | fragment `fil`, cas `casB` l.721-742 | sujet 375/767 égal à `5042afd`, conteneur `[R.filSujet]` | **doit changer** : le sujet passe à la famille commune ; le cas sujet sort de `casB` (il reste au bureau 768/769/1280) |
| `forum-activite.mjs` | `ancres`, `seuil`, `bureau` (sujet `#msg`) | hash, défilement égal à `0523d7f` | y du message à 375 peut bouger (h1 plus bas ou plus haut) : à mesurer au rouge avant |
| `forum-mobile.mjs` | F-01 l.226-256 | 2 « Répondre » ≥ 44, haut/bas, href natif ; 2 « Nouveau sujet » ; pas de recouvrement ; pas de débordement | vert attendu (comportement gardé) |
| `forum-mobile.mjs` | F-01 `locked` l.259-266 | 0 « Répondre », 2 « Nouveau sujet » | vert attendu |
| `forum-mobile.mjs` | N-1 l.665+ | barre du bas hors du bouton « Remonter » (marge droite 52 px) | vert attendu si `.forum-thread-actions-bottom` garde sa marge |
| `forum-mobile.mjs` | `MEASURE` | compte `.forum-thread-actions` | vert attendu |
| `messages-v3.mjs` | l.109-112, l.228-232 | page sujet construite en mémoire (`.forum-top`), messages | vert attendu (messages non touchés) |
| `typographie-formes.mjs` | `PAGES_FORUM.sujet` l.431-435 (`.forum-thread-action` mobile, `.forum-top .pull-right > .btn` bureau) | fragments `boutons` (`COMMIT_BOUTONS`), `echelle-forum` (`COMMIT_ECHELLE_FORUM = d953969`), `rayons` l.1246 (`COMMIT_RAYONS`, `.forum-thread-action` C4 m), `espacement` (`COMMIT_ESPACEMENT`), `nettoyage` (`COMMIT_NETTOYAGE = 00b0786`, sujet compris) | **rouges probables** sur le sujet mobile : couleurs de « Nouveau sujet », fil (classe, nombre d'éléments, styles), marges du h1. Masques à poser (§5.1) |
| `typographie-formes.mjs` | `sous-forum` l.1262, `['nouveau', '.forum-thread-action', 'C4', 'm']` | « Nouveau sujet » du sous-forum | vert exigé : le restyle ne doit pas atteindre le sous-forum |
| `sous-forum.mjs` | l.407 | deux « Nouveau sujet » du sous-forum | vert exigé (même raison) |
| `palette-nation.mjs` | page `sujet` l.630, `PAGES_BALAYAGE`, `PAGES4`, `PAGES5` | couleurs et contrastes du sujet | vert attendu si contraste ≥ 4,5:1 ; sinon constat |
| `lib/variantes.mjs` | l.93-101 (masque `font-size` de `.forum-thread-action`) ; l.591 `filSujet: 'forum-thread-mobile-breadcrumb'` ; l.592 `conteneurs` ; l.768 | repères du fil du sujet | `filSujet` reste comme repère de l'ancienne classe (contrôle « absente ») |
| `lib/router.test.mjs` | l.352, l.566-574 | routage des hunks ForumThread | cas à mettre à jour si `SECTIONS` change |

## 5. Compléments

### 5.1 Masques prévus (sur le bundle de base seulement)

- Détecteur `AVANT_TICKET64(src)` dans `lib/variantes.mjs` : chaîne minifiée propre au build 6.4 (par exemple la nouvelle garde du sujet), absente de `d68ab55`, `4d97496`, `d953969`, `5ff22d3`, `62fd47d`, `00b0786`, `0523d7f`, `5042afd` et `ef0e4d4`.
- `ENTETE_TICKET64` (CSS) : miroir littéral des déclarations nouvelles du « Nouveau sujet » de l'en-tête de sujet et de la hauteur, sous `@media (max-width: 767px)`, posé sur la base de `typographie-formes.mjs` (`echelle-forum`, `rayons`, `espacement`, `nettoyage`, `boutons` selon le rouge avant).
- `filSujetTicket64` (script d'init, `MutationObserver`) : remplace sur la base le fil `forum-thread-mobile-breadcrumb` par le DOM de la famille commune, nécessaire car `MESURE_TAILLES` et les empreintes comptent les éléments (leçon de 6.3).
- Condition de retrait en commentaire de chaque masque : « retirer quand les bases de comparaison de `typographie-formes.mjs` (`COMMIT_BOUTONS`, `COMMIT_ECHELLE_FORUM`, `COMMIT_RAYONS`, `COMMIT_ESPACEMENT`, `COMMIT_NETTOYAGE`) et de `forum-activite.mjs` (`COMMIT_AVANT`) sont réalignées sur un SHA qui contient 6.4 ; ce réalignement est porté par le sweep 6.7 ou par l'action A4 de la rétro 5 (tickets à venir) ».
- Seuls les masques effectivement rouges au rouge avant sont posés ; chaque masque a sa contre-épreuve (retiré → rouge).

### 5.2 Repères du routeur (relevé `TOKEN_RE` sur les fichiers de `SUITES`, `/tmp/kr64/tokens2.txt`)

`MAX_CITING = 3`. Seuls les fichiers de suite comptent (pas `lib/`).

| Repère | Suites citantes | Peut-on l'écrire dans `forum-activite.mjs` ? |
|---|---|---|
| `forum-thread-action` | 2 (forum-mobile, typographie-formes) | oui (passe à 3) ; préférer `lib/variantes.mjs` |
| `forum-thread-actions` | 1 | oui |
| `forum-thread-action-reply` | 1 | oui |
| `forum-thread-action-new` | 1 (sous-forum) | oui |
| `forum-thread-mobile-breadcrumb` | 0 | oui (déjà par `R.filSujet`) |
| `fa-lock` | 1 | oui |
| `kr-text-nation` | 2 | oui (passe à 3) |
| `forum-top` | **3** | **non** : par `lib/variantes.mjs` |
| `nouveau-sujet` | **3** | **non** |
| `forum-sujet` | **3** | **non** (déjà via `A.sujet`) |
| `forum-mobile-breadcrumb` | **3** | **non** (déjà via `R`) |
| `fa-backward` | **3** (forum-activite comprise) | déjà citant, sans effet |
| `fa-comments` | **3** | **non** |
| `media-list` | **3** | **non** |
| `site-annonces-20101` | **3** | **non** |
| `aria-hidden`, `min-height`, `forum-index-communaute` | **3** | **non** |
| `page-header`, `btn-default`, `pull-right`, `list-group-item`, `page-forum`, `mobile-mode` | > 3 (transverses) | sans effet |
| `forum-sujet-communaute`, `forum-sujet-debats`, `forum-sujet-staff`, `forum-sujet-ferme` | 0 | oui (noms de nouvelles fixtures) |

Le relevé est à refaire sur la suite finie : aucun jeton ne doit passer de 3 à 4.

### 5.3 Hors périmètre

- Index Staff (6.1) : chevron et croix d'alerte (deferred-work).
- Pages `/forum/*` hors fixtures (épopée 9).
- Messages du sujet (messages-v3), page de réponse (post/FAB), bureau.
- Focus clavier et ARIA nouveaux.
