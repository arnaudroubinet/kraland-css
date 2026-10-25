# Inventaire — ticket 6.3 : un seul fil d'Ariane « Catégorie › Forum › Sujet » pour l'index, le sous-forum et le sujet (H12.3)

Relevé sur `5042afd186d0d1dd73002257030c768b85dbd2ee`, le 2026-10-25. Le bundle mesuré est `kraland-userscript-main.user.js`, construit à ce SHA.

Conditions du relevé :

- navigateur : Chromium de Playwright (`tests/e2e/lib/navigateur.mjs`), avec `confineNetwork` ;
- Bootstrap 3.3.7 et jQuery 3.3.1 de `tests/e2e/vendor/` ;
- injection body : bundle évalué dès que `document.body` existe ;
- variante `kraland`, sauf au §1.6 (16 variantes) ;
- `kr-theme-enabled` à `true`, vérifié par `krReady(…, THEME_READY)`.

Scripts hors dépôt, dans `/tmp/kr63/` :

- `mesure.mjs` : modes `base`, `variantes`, `bascule`, `regles`, `post` et `essai` ;
- `citants.mjs` : relevé `TOKEN_RE` ;
- `proto-suffixe.js` et `proto.user.js` : bundle prototype (§5.2) ;
- résultats bruts : `variantes.json`, `bascule.json`, `regles.json`, `proto-*.log`. `base.json` a été réécrit par le run du prototype : les chiffres de la base sont ceux de ce document.

Toutes les mesures sont faites sur fixtures. Aucun site réel, aucune cloche, aucun `/report`, aucun Chrome 9222/9223.

Pages mesurées (clé de `mesure.mjs`, chemin servi, fixture) :

| Clé | Chemin | Fixture | Remarque |
|---|---|---|---|
| `rp` | `/forum/rp` | `forum-index-rp.html` | h1 « Jeu (RP) », entrée active « Jeu (RP) » dans `#col-left` |
| `communaute` | `/forum/communaute` | `forum-index-communaute.html` | — |
| `debuter` | `/forum/hrp/debuter-20102` | `sous-forum-debuter.html` | `#col-left` sans entrée active |
| `debuterNatif` | idem | `sous-forum-debuter.html`, dont le `#col-left` est remplacé en mémoire par `forum-colonne-native-hrp.html` | entrée active « Jeu (HRP) » |
| `debuterLong` | idem | `debuterNatif`, titre remplacé par un titre de 86 caractères | — |
| `debuterLibelle` | idem | `debuterNatif`, entrée active renommée « Hors Jeu » | contre-épreuve L4 |
| `rpLibelle` | `/forum/rp` | `forum-index-rp.html`, entrée active renommée « Rôle Jeu » | contre-épreuve L4 |
| `sujet` | `/forum/sujet/messages-v3-329425-1` | `forum-sujet.html` | `#col-left` vide |
| `reponse` | `/forum/post/repondre-2-329425` | `typographie-forum-redaction.html`, h1 remplacé en mémoire par la structure « réelle capturée » de `forum-mobile.mjs` l.129-131 (2 liens, dont `forum/hrp/site-annonces-20101`) | branche post |
| `regles` | `/regles/avancees` | `palette-nation.html` (h1 à 2 liens, l.59) | branche post/FAB hors forum |

## 1. Mesures de la base

### 1.1 Index (`rp`, `communaute`)

| Largeur | Conteneurs | Texte du fil | Lien | Séparateur et courant | h1 |
|---|---|---|---|---|---|
| 375, 767 | 1 `div.forum-mobile-breadcrumb`, dans `H1.page-header` | « ⏪ Tous les forums › Jeu (RP) » / « … › Communauté » (icône `i.fa.fa-backward`) | 97,3×44 ; `rgb(15,23,36)` ; 13 px, poids 400 ; contraste 17,97 ; `elementFromPoint` au centre → le lien | `rgb(99,106,119)` ; 13 px, poids 500 (hérité du h1) ; hauteur 14,3 ; contraste 5,44 | marges 12/16, bordure 0 |
| 768, 769, 1280 | 0 | — | — | — | h1 du bureau (marge haute 40, bordure basse 1) |

Le courant de l'index est le texte du h1 natif (`titleText`), pas l'entrée active de `#col-left`.

### 1.2 Sous-forum (`debuter`, `debuterNatif`)

| Largeur | Conteneurs | Texte du fil | Lien | h1 |
|---|---|---|---|---|
| 375, 767 | 1 `div.forum-mobile-breadcrumb` | « ⏪ Jeu (HRP) › Débuter » : clone du lien natif `a[href="forum/hrp"]`, icône `fa-backward` comprise | 70,3×44 ; mêmes couleur, taille, graisse et contraste que l'index ; `elementFromPoint` → le lien | style en ligne `margin: 12px 16px !important; padding: 0 !important; background: transparent !important` (posé par `transformSubforumHeader`) |
| 768, 769, 1280 | 0 | — | — | h1 du bureau |

Entrée active (L4) :

- `debuter` : `getActiveTitleLabel()` = `''` (aucune entrée active dans la fixture) ;
- `debuterNatif` : « Jeu (HRP) ».

### 1.3 Titre long (`debuterLong`, 375)

Le courant passe à la ligne : boîte 343×28,6, sur deux lignes. Le conteneur fait 76,6 de haut (lien 44, puis courant). Il n'y a pas de troncature. C'est le **rouge avant** de « tronqué sur une ligne ».

### 1.4 Libellé de catégorie changé (`debuterLibelle`, `rpLibelle`, 375)

Le fil ne change pas : « ⏪ Jeu (HRP) › Débuter » et « ⏪ Tous les forums › Jeu (RP) ». Les deux fils lisent le lien natif ou le h1, jamais `#col-left`. C'est le **rouge avant** de la contre-épreuve L4.

### 1.5 Sujet (`sujet`)

| Largeur | Conteneurs | Rendu |
|---|---|---|
| 375, 767 | 1 `forum-thread-mobile-breadcrumb` (autre classe), styles en `cssText` | `flex-wrap: nowrap`, `gap: 12px`, `margin-bottom: 16px` ; texte « Jeu (HRP) › Site & Annonces › Royaume de Ruthvénie : fixture » ; pas de « ⏪ » ; contraste 5,44 |
| 768, 769, 1280 | 0 | — |

La catégorie y est écrite en dur (« Jeu (RP) » ou « Jeu (HRP) », selon le lien). Ce fil est hors périmètre : il revient à l'entrée 6.4.

### 1.6 Contraste dans les 16 variantes (`rp`, `debuterNatif`, `sujet`, 375)

Mesure : `CONTRASTE()` de `lib/variantes.mjs`, couleur du texte sur le fond opaque le plus proche.

| Variantes | Lien | Séparateur et courant |
|---|---|---|
| 8 claires | 17,97 | 5,44 |
| `kraland-dark` | 16,73 | 7,87 |
| `empire-brun-dark` | 16,9 | 8,28 |
| `paladium-dark` | 17,35 | 9,79 |
| `theocratie-seelienne-dark` | 16,88 | 9,22 |
| `paradigme-vert-dark` | 16,93 | 9,93 |
| `khanat-elmerien-dark` | 16,46 | 8,48 |
| `confederation-libre-dark` | 15,81 | 10,01 |
| `royaume-ruthvenie-dark` | 17 | 10,01 |

L'index et le sous-forum ont les mêmes valeurs. Le minimum est 5,44 : tout passe déjà le seuil de 4,5:1. Le contrôle de contraste est une non-régression. Il n'a donc pas de rouge avant : sa preuve est la contre-épreuve (couleur du courant mutée).

### 1.7 Bascule dans le même onglet (`rp`, `debuterNatif`, non tactile)

768 → 767 → 768 → 767 : le fil est présent à 767, absent à 768, puis de nouveau présent à 767. Chaque passage du seuil recharge la page (garde-fou de 1 200 ms, écart de 1 300 ms dans les suites).

### 1.8 Branche post/FAB de `transformForumHeader` (h1 à au moins 2 liens, sans `#topics`)

| Page | 375 | 768 |
|---|---|---|
| `reponse` | fil `div.forum-mobile-breadcrumb` en `cssText` : « Site & Annonces › FIXTURE sujet de test > Réponse » ; aucun FAB (chemin `/forum/post/`) ; h1 en style en ligne `!important` | rien |
| `regles` | fil en `cssText` et FAB `forum-new-topic-fab` « + » (contraste 9,67) | rien |

La branche a encore un emploi : la page de réponse du forum. Elle n'est donc pas retirée par ce ticket.

Balayage statique des fixtures dont le h1 a au moins 2 liens : `kramail-*` (exclues par `/kramail`), `palette-nation.html` et `sous-forum-debuter.html`.

## 2. Règles en jeu

### 2.1 CSS (`kraland-theme.css`, compte `!important` = 3292)

Bloc du sous-forum, l.13694-13723, sous `@media (max-width: 767px)` :

- `body.page-forum.kr-subforum .container h1.page-header { border-bottom: 0 !important }` ;
- `body.page-forum.kr-subforum .forum-mobile-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 0 0 4px; color: var(--kr-text-secondary); font-size: var(--kr-font-detail) }` ;
- `…-link { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0; color: var(--kr-text-primary) !important; font-weight: 400; text-decoration: none }` ;
- `…-sep, …-current { color: var(--kr-text-secondary) }` ;
- `.forum-subforum-head`, `.forum-subforum-title` (24 px).

Bloc de l'index, l.14584-14621, sous `@media (max-width: 767px)` :

- `:where(html.kr-page-forum-index) #col-right > h1.page-header { margin: 12px 16px !important; padding: 0 !important; border-bottom: 0 !important; background: transparent !important }` ;
- `#col-right > .alert-dismissible { padding-right: 35px !important }` ;
- les mêmes règles que le sous-forum pour `.forum-mobile-breadcrumb`, `-link`, `-sep`, `-current`, `.forum-subforum-head`, `.forum-subforum-title`, préfixées par `:where(html.kr-page-forum-index) #col-right`.

Le commentaire l.14584 cite « ⏪ Tous les forums › Jeu (RP) ».

### 2.2 Cascade du lien (mode `regles`, CDP, `rp` et `debuterNatif`, 375)

Règles appliquées à `a.forum-mobile-breadcrumb-link`, de la plus faible à la plus forte :

- `a` et `a:link, a:visited { color: var(--kr-text-accent) }` : sans `!important`, spécificité (0,1,1) au plus ;
- `a:not(.list-group-item), button, .btn… { min-height: 44px !important }`, en mobile ;
- la règle de la famille : `color: var(--kr-text-primary) !important`.

Aucune autre règle n'apporte un `color` en `!important` sur ce lien. Le `!important` de couleur ne bat donc rien. Une règle de famille en `:where(…) #col-right .forum-mobile-breadcrumb-link`, de spécificité (1,1,0), dépasse `a:link` (0,1,1) sans `!important`. Si on le retire des deux copies, le compte passe à 3290. Le CDP du build doit le confirmer.

### 2.3 JS (`kraland-userscript-template.js`, lignes de `5042afd`)

- **ForumHeader:MobileBreadcrumb**, l.5409-5627, priorité 25 (l.5624) :
  - `transformSubforumHeader`, l.5434-5470 :
    - `back = backLink.cloneNode(true)` (l'icône `fa-backward` est gardée), classe `forum-mobile-breadcrumb-link` ;
    - séparateur `span.forum-mobile-breadcrumb-sep` (`aria-hidden`, « › ») ;
    - courant `span.forum-mobile-breadcrumb-current`, qui reçoit `titleText` ;
    - tête `.forum-subforum-head`, avec `span.forum-subforum-title` et `createNewTopicAction(…, 'forum-subforum-actions-top')` ;
    - `forumHeading.style.cssText` en `!important` ;
  - `transformForumHeader` : il faut au moins 2 liens dans `.container h1`. Si `#topics` existe et que le chemin n'est pas `/forum/post/`, il appelle `transformSubforumHeader`. Sinon, c'est la branche l.5512-5621 : fil en `cssText`, FAB `forum-new-topic-fab` (l.5575) sauf sous `/forum/post/`, puis `forumHeading.innerHTML = ''` et `cssText` `!important`.
- **ForumIndex:Presentation**, l.5629-5707, priorité 26 (l.5706) :
  - `ALL_FORUMS_LABEL = 'Tous les forums'` ;
  - `createBreadcrumb(allLink, titleText)`, l.5658 : lien avec `i.fa.fa-backward` et « Tous les forums », séparateur, courant ;
  - `transformHeader` : en mobile, `heading.replaceChildren(createBreadcrumb(…), head)`, puis `allLink.parentElement.remove()` ; au bureau, le bouton passe dans le h1 ;
  - la page est gardée par `kr-page-forum-index`.
- **ForumThread:MobileBreadcrumb**, l.7093-7327, priorité 25 (l.7325) : classe `forum-thread-mobile-breadcrumb` (l.7162), `cssText`, catégorie en dur. Hors périmètre (6.4).
- **IDENTITÉ DU PERSONNAGE (règle R1)**, l.8365 :
  - `findActiveTitleTextNode()` (l.8373) lit `#col-left .list-group-item.active`, nœud texte seul ;
  - `getActiveTitleLabel()` (l.8380) rend `''` si l'entrée n'existe pas ;
  - ces deux fonctions sont au premier niveau de l'IIFE, hissées : tout module peut les appeler ;
  - `applyCharacterIdentity` ne réécrit ce titre que sur `/jouer/perso` et `/jouer/pnj`. Le forum lit donc le libellé natif.
- **MENUS FORUM DYNAMIQUES**, l.4512 : `captureForumSidebar` lit la liste latérale. Celle-ci reste dans le DOM et lisible après l'initialisation (mesuré à 375 sur `debuterNatif` et `rp`).
- Ordre des modules : `ForumTopics:Status` (24) pose `body.kr-subforum` si `#topics` existe et que la page porte `page-forum` (l.5154-5165). Il tourne avant les deux fils (25 et 26).

## 3. Doublons

- Les règles CSS du fil existent deux fois, mot pour mot, avec deux gardes différentes : l.13700-13723 (sous-forum) et l.14597-14621 (index). Les deux `color: … !important` du lien en font partie.
- Le JS a deux fonctions qui construisent la même structure : `transformSubforumHeader` l.5440-5450 et `createBreadcrumb` l.5658. La troisième implémentation, en `cssText`, sert la page de réponse (§1.8). La quatrième, `ForumThread:MobileBreadcrumb`, est celle du sujet (6.4).
- Les règles `.forum-subforum-head` et `.forum-subforum-title` sont aussi en double. Elles sont hors du fil, donc hors périmètre ; on les garde telles quelles (§5.3).

## 4. Assertions qui figent le rendu touché

| Suite | Lieu | Ce qui est figé | Effet attendu de 6.3 |
|---|---|---|---|
| `forum-index.mjs` | `ENTETES` l.223-247, l.416 | `fil.texte` = textes des enfants joints, `Tous les forums › X` | vert : l'icône n'a pas de texte |
| `forum-index.mjs` | `COMPOSANTS_MOBILE` l.251-271 | parité de style index / sous-forum | vert si les deux pages gardent la même règle |
| `forum-index.mjs` | l.490 | bureau | vert (fil absent) |
| `forum-index.mjs` | hors-périmètre l.643+, l.737-758, `COMMIT_AVANT = '81512a3'` (l.77) | sous-forum et sujet égaux au bundle « avant » : `EMPREINTE` (l.586) compte **tous** les éléments de `#col-right`, `display: none` compris, et relève leur boîte arrondie | **rouge** : 412 éléments au lieu de 413 (icône retirée) ; masque DOM et CSS nécessaire |
| `sous-forum.mjs` | `HEADER` l.372-404, `checkHeader` l.406-414, fragment `l2-entete` (375 et 700) | lien `forum/hrp` qui contient /Jeu \(HRP\)/, courant « Débuter », 0 FAB, 0 bouton « + » seul | vert (prototype : 1098 ok) |
| `typographie-formes.mjs` | `PAGES_FORUM` l.1014 ; rôle « fil d'Ariane » l.1030, l.1043 | `.forum-mobile-breadcrumb` à 13 px | vert |
| `typographie-formes.mjs` | `echelle-forum` l.1187-1205, `COMMIT_ECHELLE_FORUM = 'd953969'` (l.1006) | `MESURE_TAILLES` : liste de tous les éléments de `#col-right` et de leur taille, comparée à la base masquée | **rouge** : « nombre d'éléments », index RP et sous-forum à 375, 2 variantes (4 FAIL) |
| `typographie-formes.mjs` | `nettoyage`, `COMMIT_NETTOYAGE = '00b0786'` (l.1660), `PAGES_NETTOYAGE` l.1681 (`sous-forum`, Staff, racine, sujet, rédaction) | styles calculés égaux à la base à 375, 767, 768, 769 et 1280 | **rouge** : sous-forum 375 et 767, 2 variantes (4 FAIL), voir §5.2 |
| `typographie-formes.mjs` | l.1306 | `.forum-new-topic-fab` (h1 en mémoire) | vert (branche post gardée) |
| `palette-nation.mjs` | l.299 `C('.forum-new-topic-fab', …)` ; pages l.628-635 (sous-forum, index RP) ; bases `BASELINE4`/`BASELINE5` | couleurs des composants | vert (prototype : 1354 ok, exit 0) |
| `forum-activite.mjs` | fragments `ancres`, `parcours`, `lignes`, `seuil`, `bureau` ; `COMMIT_AVANT = '0523d7f'` | lignes d'index, ancres, bureau | vert attendu : le fil n'est ni mesuré ni dans `#col-right` des lignes. À vérifier au 1er `test:zone` |

## 5. Compléments

### 5.1 Repères cités (relevé `TOKEN_RE` de `lib/router.mjs`, `MAX_CITING = 3`)

Nombre de suites qui citent chaque repère aujourd'hui :

- **0** : `forum-thread-mobile-breadcrumb`, `elementFromPoint` ;
- **1** : `forum-mobile-breadcrumb-link`, `-sep`, `-current` (forum-index) ; `kr-subforum` ; `text-overflow` ; `typographie-forum-redaction` ; `forum-colonne-native-hrp` ; `forum-subforum-head` ;
- **2** : `forum-subforum-title` ; `fa-backward` ; `repondre-2-329425` ; `overflow-x` ;
- **3**, interdits en clair dans une 4e suite : `forum-mobile-breadcrumb` ; `aria-hidden` ; `site-annonces-20101` ; `kr-page-forum-index` ; `forum-new-topic-fab` ; `min-height` ; `kr-text-*` ; `forum-sujet` ; `forum-index-communaute` ;
- **4 ou plus** (déjà transverses) : `page-forum`, `white-space`, `list-group-item`, `col-left`, `min-width`, `page-header`, `col-right`, `forum-index-rp`, `sous-forum-debuter`, `messages-v3-329425-1`, `debuter-20102`.

Pour le routage, on a relevé ce qui suit :

- `KEYWORDS` l.164 envoie `forum-mobile-breadcrumb` et `forum-new-topic` vers `sous-forum`, et l.182 envoie `forum-mobile-breadcrumb` vers `typographie-formes`. `forum-activite` n'y est pas.
- Dans `SECTIONS`, `^MODULE : ForumHeader:` et `^MODULE : ForumIndex:` envoient vers `['forum', 'sous-forum']`, et `^IDENTITÉ DU PERSONNAGE` vers `['plateau', 'profil']`.
- La règle de fichier l.135 envoie `sous-forum-debuter.html` vers `sous-forum`, `cartes-pastilles` et `forum-activite`.
- `router.test.mjs` l.96 a un cas `hunk('body.page-forum.kr-subforum .forum-mobile-breadcrumb {', …)`, qui attend `typographie-formes`. Le modèle d'un cas `forum-activite` est l.522-539.

### 5.2 Prototype (bundle de `5042afd`, plus un suffixe)

Le prototype est `proto.user.js` : le bundle HEAD suivi de `proto-suffixe.js`. Le suffixe fait trois choses :

- un `MutationObserver` retire `.fa-backward` du fil ;
- il met `getActiveTitleLabel()` (repli : texte du lien natif) au lien du sous-forum, et `getActiveTitleLabel()` au courant de l'index ;
- il injecte la CSS suivante :

```css
@media (max-width: 767px) {
  :is(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb { flex-wrap: nowrap; }
  :is(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb-link { flex: 0 0 auto; white-space: nowrap; }
  :is(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb-current { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
```

Une première version écrivait `html :where(html.x)`. Elle ne correspondait jamais : il aurait fallu un `html` descendant de `html`. Elle a donné de faux écarts (`flex-wrap: wrap`).

Un autre point vaut pour la suite : une feuille d'essai ajoutée au `<head>` peut perdre à spécificité égale contre la peau.

Mesures du prototype, à 375 :

- lien du sous-forum 58×44, lien de l'index 91,3×44 ; `elementFromPoint` tombe sur les liens ;
- titre long tronqué sur une ligne : courant 273,6×14,3, `scrollWidth` 505 pour `clientWidth` 274, conteneur de 44 ;
- « Hors Jeu » repris dans le fil du sous-forum, « Rôle Jeu » au courant de l'index ;
- sujet inchangé ;
- à 768 et au-delà, aucun fil.

Suites contre le prototype (`KR_SCRIPT=/tmp/kr63/proto.user.js`) :

- `sous-forum.mjs` : exit 0, 1098 ok ;
- `forum-index.mjs` : exit 1, 2 FAIL. Les deux sont « [kraland|empire-brun-dark] sous-forum 375 px : sans html.kr-page-forum-index, rendu identique au bundle « avant » (413 éléments de #col-right) », avec « éléments : 412 au lieu de 413 ».
- `typographie-formes.mjs`, fragments `echelle-forum`, `rayons`, `espacement`, `nettoyage` et `mobile` : exit 1, 3245 ok, 8 FAIL :
  - `echelle-forum`, index RP et sous-forum, 375, 2 variantes : « nombre d'éléments » ;
  - `nettoyage`, sous-forum, 375 et 767, 2 variantes : « 5 élément(s) sur 357 : div.forum-mobile-breadcrumb flex-wrap nowrap au lieu de wrap ; a.forum-mobile-breadcrumb-link flex-shrink 0 au lieu de 1, inline-size 58.0312px au lieu de 70.3281px, … ; span.forum-mobile-breadcrumb-current min-inline-size 0px au lieu de auto, min-width 0px au lieu de auto, overflow-block hidden au lieu de visible ; 1.1.0.1.0.0.0.0 absent du bundle testé ».
- `palette-nation.mjs` : exit 0, 1354 ok.

Ces chiffres sont une prévision. Le bundle construit au build doit les confirmer au 1er `test:zone`.

Un masque CSS ne peut pas retirer un élément. Or `EMPREINTE` et `MESURE_TAILLES` comptent les éléments `display: none`. Il faut donc un masque DOM, posé sur la base, qui retire l'icône du fil. Il s'ajoute au masque CSS des déclarations nouvelles.

### 5.3 Hors périmètre relevé

- La branche post/FAB (§1.8) : elle sert encore la page de réponse.
- `forumHeading.style.cssText` du sous-forum et les `!important` du h1 de l'index : ils portent sur l'en-tête, pas sur le fil (M8, chantier H6.3).
- Les doublons `.forum-subforum-head` et `.forum-subforum-title`.
- Le fil du sujet (6.4).
