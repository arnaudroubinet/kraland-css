# Inventaire du ticket 6.7 : nettoyage de fin d'épopée (Refactor sweep)

Relevé factuel sur `810901f` (HEAD de `feature/next`, `810901ffda0988670d892021ef857a4d958b734a`), en lecture seule. Numéros de ligne de `810901f` sauf mention contraire. Aucun site réel, aucun Chrome 9222/9223, aucune suite e2e lancée pour ce relevé.

Comptes de départ :

- `grep -c '!important' kraland-theme.css` → 3290 ;
- `kraland-theme.css` : 15521 lignes ; `kraland-userscript-template.js` : 11256 lignes.

## 1. Entrées de `deferred-work.md` qui visent l'épopée 6

| # | Ligne | Origine | Objet | Constat sur `810901f` |
|---|-------|---------|-------|------------------------|
| E1 | l.45 | 4.8, A13 | Doublons : cartes de ligne du forum, 1re version (~l.7848 du plan 4.8) | Retirée par l'entrée 2 de l'épopée 5 (5.2). Il ne reste que le commentaire `kraland-theme.css` l.7911-7913 (« retirés à l'entrée 2 de l'épopée 5 »). Aucune déclaration. |
| E2 | l.45 et l.80 | 4.8 A13, puis 5.2 | 2e version des cartes de ligne (`:where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table …`) | Présente, l.8361-8570 environ (section commentée l.8361-8362). Depuis 6.1, `kr-page-forum-index` couvre RP, HRP, Communauté, Débats et la racine : la 2e version ne s'applique plus qu'à Staff et aux pages `/forum/*` hors fixtures. 5.2 l'a gardée parce qu'elle gagne sur Staff (A6). |
| E3 | l.54 | 4.9, A9 | Cellules du forum mobile en `padding-top: 3px` (l.8011 et l.8695 du plan 4.9) | Une seule occurrence restante : l.8496, `padding-top: 3px !important`, règle `… td:nth-child(4), … td:last-child` de la 2e version (E2), `@media (max-width: 767px)`. L'occurrence l.8011 du plan 4.9 a disparu avec la 1re version (E1). |
| E4 | l.54 | 4.9, A9 | Flèches de tri `::after` en `margin-left: 6px` (l.14109 et l.14114 du plan 4.9) | l.13904 (`body.page-forum.kr-subforum #topics thead th.sorting_desc::after`, `content: "\25BE"`) et l.13909 (`… th.sorting_asc::after`, `content: "\25B4"`), dans `@media (max-width: 767px)` ouvert l.13768. Sans `!important`. Cas mesurable : `sous-forum-debuter.html` émule DataTables et pose `sorting_asc` / `sorting_desc` sur les `th` (fixture l.162). Aucune suite ne lit aujourd'hui la marge du `::after`. |
| E5 | l.83 | 5.2 | Staff : chevron natif 10 × 14 px, croix d'alerte qui sort de 5 px | Inchangé. Index Staff exclu par 6.1 (`epic-forum.md`). |
| E6 | l.86 | 5.2, A8 | Racine en sombre : la dernière ligne, opaque à coins carrés, recouvre les coins bas de la carte | Inchangé. Deux options écrites (rayon bas sur la dernière ligne, ou `overflow: hidden` sur la carte), aucune tranchée. |
| E7 | l.91 | revue 5.2 | Accordéon ou modale `.panel-default` sur `/forum/*` | Aucune fixture du forum n'en contient. Vérification sur le site réel. |
| E8 | l.92 | revue 5.2 | Bascule 767 ↔ 768 du forum non couverte par `cartes-pastilles` | Couverte depuis 6.2 : `forum-activite.mjs`, fragment `seuil`, fonction `bascule` (l.428-447), sujet `#msg6801395` et index RP, dans le même onglet, rechargement compté, testé contre la base. |
| E9 | l.93 | revue 5.2 | Pages `/forum/*` hors fixtures | Épopée 9 (`epic-forum.md`). |
| E10 | l.121 | 5.5, A4 (D14) | `span.tagforum` | Décision d'Arnaud en attente ; `epic-forum.md` : non touché. |
| E11 | l.130 | 6.2 | Le correctif d'ancres ne retire plus que `#flap` ; ancres du kramail et du plateau non vérifiées | Comportement du vrai téléphone (largeur 981 à l'évaluation). Question en attente dans `revue-manuelle.md` (retirer le correctif en entier ?). |
| E12 | l.135 | 6.4 | Liens « lien » (`fa-link`) et « liste des messages » (`fa-th-list`) absents du sujet mobile | Choix produit d'Arnaud, en attente. |
| E13 | l.139 | 6.5 | Barre d'un message ouvert en z-index 991 au-dessus de la barre « Envoyer » (90) | Aucune fixture ne porte à la fois des messages et la barre « Envoyer ». À voir sur un vrai sujet, en lecture. |
| E14 | l.143 | 6.6 | Course du harnais sur les infobulles en mobile, peau coupée | Audit §4 : aucun contrôle restant n'y est exposé. |
| E15 | l.144 | 6.6 | `pathKey` ne garde que le `pathname` | Écarté par la revue 6.6 (cas improbable). |

Hors épopée 6, non repris : l.15 (survol des `list-group-item`), l.41-48 (médias du kramail, `.kramail-character-dropdown`), l.60 (`.form-control` 44 px), l.66-70 (défauts d'initialisation), l.74-75 (5.1), l.97-101 (5.3), l.106-124 (5.4, 5.5 hors D14). Les 19 autres déclarations de l'entrée l.54 (4.9) ne visent pas le forum.

## 2. Masques de test de l'épopée 6

### 2.1 Détecteurs sur les bases figées

Détecteurs de `tests/e2e/lib/variantes.mjs` : `AVANT_TICKET62` (`'align-content:center;align-items:baseline;gap:2px 6px;min-height:72px'`), `AVANT_TICKET63` (regex `GARDE_FIL_TICKET63`), `AVANT_TICKET64` (`':where(body.page-forum.kr-forum-sujet) #col-right .forum-thread-action-new{'`), `AVANT_TICKET65` (`'kr-more-glyph'`), `AVANT_TICKET66` (`'kr-forum-icon'`). « oui » = la base contient déjà le ticket (masque inerte).

| Base | Suite et constante | 6.2 | 6.3 | 6.4 | 6.5 | 6.6 |
|------|--------------------|-----|-----|-----|-----|-----|
| `81512a3` | `forum-index` `COMMIT_AVANT` | non | non | non | non | non |
| `0523d7f` | `forum-activite` `COMMIT_AVANT` | non | non | non | non | non |
| `5042afd` | `forum-activite` `COMMIT_FIL` | oui | non | non | non | non |
| `ef0e4d4` | `forum-activite` `COMMIT_ENTETE` | oui | oui | non | non | non |
| `1134ef9` | `forum-activite` `COMMIT_PLUS` | oui | oui | oui | non | non |
| `6ba0838` | `forum-activite` `COMMIT_LIGNE` | oui | oui | oui | oui | non |
| `21fed8d` | `cartes-pastilles` `COMMIT_AVANT` | non | non | non | non | non |
| `d953969` | `typographie-formes` `COMMIT_ECHELLE_FORUM` | non | non | non | non | non |
| `62fd47d` | `typographie-formes` `COMMIT_ESPACEMENT` | non | non | non | non | non |
| `00b0786` | `typographie-formes` `COMMIT_NETTOYAGE` | non | non | non | non | non |
| `6685df5` | `palette-nation` `BASELINE4` (`avant4`) | non | non | non | non | non (`kr-more-glyph` : 0 occurrence) |
| `origin/feature/next` = `810901f` | `kramail-redaction` `bundleAvant()` | oui | oui | oui | oui | oui |

### 2.2 Usages par suite (masques, détecteurs, options)

Comptes d'occurrences (`grep -oE` sur les noms) :

- `forum-index.mjs` : `AVANT_TICKET63` 3, `AVANT_TICKET64` 4, `AVANT_TICKET65` 3, `FIL_TICKET63` 2, `ENTETE_TICKET64` 3, `REPERES_ENTETE_TICKET64` 3, `PLUS_TICKET65` 3, `plusTicket65` 3, `EXCEPTION_TICKET66` 2. Pose l.95-114 (option `fil`), `sujetStandard` l.770, infos l.779-781.
- `forum-activite.mjs` : `AVANT_TICKET64` 2, `AVANT_TICKET66` 6, `ENTETE_TICKET64` 3, `LIGNE_TICKET66` 3, `ligneTicket66` 3, options `entete64` 4 et `ligne66` 10 ; repères `ACTIVITE_TICKET62`, `REPERES_FIL_TICKET63`, `REPERES_ENTETE_TICKET64`, `REPERES_PLUS_TICKET65`, `REPERES_LIGNE_TICKET66` (noms tenus hors de la suite, pas des masques). Pose l.145-160 ; infos l.460, l.512, l.772, l.1697.
- `cartes-pastilles.mjs` : `AVANT_TICKET62` 2, `LIGNE_INDEX_TICKET62` 2 (l.646, clé `base`), `AVANT_TICKET64` 2, `ORIGINE_TICKET64` 3 (l.519-520), `AVANT_TICKET65` 3, `PLUS_TICKET65` 3, `plusTicket65` 3, `plus65` 4 (l.191-197), `AVANT_TICKET66` 3, `LIGNE_TICKET66` 3, `ligneTicket66` 3, `ligne66` 4 (l.198-204).
- `typographie-formes.mjs` : masques `fil63`, `entete64`, `plus65`, `ligne66` dans `echelle-forum` (l.1201-1217) et `nettoyage` (l.1891-1914), `LIGNE_INDEX_TICKET62` dans `nettoyage`.
- `palette-nation.mjs` : `AVANT_TICKET65` 3, `PLUS_TICKET65` 3, `plusTicket65` 3, option `plus65` 4 (l.196-201), info l.1191, sur `avant4` (`6685df5`).
- `kramail-redaction.mjs` : `AVANT_TICKET65` 2, `PLUS_TICKET65` 3, `plusTicket65` 3. l.240-241 : `const PLUS_AVANT = AVANT && AVANT_TICKET65(AVANT) ? … : null;`. `AVANT` lit `origin/feature/next` = `810901f`, qui contient 6.5 : `PLUS_AVANT` vaut `null`, le masque n'est jamais posé. Le commentaire l.240 dit « il cesse d'être posé dès la fusion de 6.5 dans feature/next » : condition atteinte. Usages : l.241 (définition), l.1296 (info), l.1313 (liste `init` du bundle « avant »). Les masques des épopées 3 et 4 de la même suite (`ESPACEMENT_AVANT` l.237, etc.) sont inertes pour la même raison (base auto-référente, F3) ; ils relèvent de A4, pas de l'épopée 6.

### 2.3 Conditions de retrait écrites

Toutes les conditions 6.x (variantes.mjs l.567, l.613, l.902, l.1003, l.1075 ; forum-index l.95-110 ; forum-activite l.145-155 ; cartes-pastilles l.192, l.199, l.519 ; typographie-formes l.1202-1212, l.1893 ; palette-nation l.198 ; kramail-redaction l.240) disent : « quand la base X est réalignée sur un SHA qui contient 6.n ; réalignement porté par le sweep 6.7 ou par l'action A4 de la rétro 5 ».

Aucun ticket ne porte A4 : rien dans les `tickets.toml` de l'initiative (`grep` « masque », « réalign »). Rétro 5, A4 : « Plan d'extinction des masques des épopées 3, 4 et 5 dans `variantes.mjs` … À porter par un ticket. »

### 2.4 Bases propres à l'épopée 6 et bases partagées

- Propres à l'épopée 6 : les cinq bases de `forum-activite.mjs` (`0523d7f`, `5042afd`, `ef0e4d4`, `1134ef9`, `6ba0838`). La suite est née en 6.2 ; elle ne pose aucun masque des épopées 3 à 5. Ses contrôles comparent l'égalité à la base (relevé des fragments `ancres`, `lignes`, `seuil`, `bureau`, `fil`, `entete`, `plus`, `ligne`) ; aucune assertion n'exige une base sans le ticket (`grep` `notEqual`, `notDeepEqual`, « différent » : aucun résultat).
- Partagées avec les épopées 3 à 5 : `forum-index` `81512a3` (masques 3.x, 4.1 à 4.9, bug 10, 5.2, en plus des 6.x), `cartes-pastilles` `21fed8d`, `typographie-formes` `d953969`, `62fd47d`, `00b0786`, `palette-nation` `6685df5`. Les réaligner rend inertes aussi les masques 3/4/5 de ces suites : c'est le périmètre de A4.

### 2.5 Exception de comparaison (pas un masque de base)

`forum-index.mjs` l.322-326, `EXCEPTION_TICKET66` (`auteur du dernier message` : `color` ; `bouton →` : `width`, `height` ; `groupe du bouton →` : `width`, `height`, `transform`), employée l.533 pour la comparaison index ↔ sous-forum sur le bundle courant. Sans condition de retrait écrite. Elle tient tant que le sous-forum n'est pas aligné sur la Ligne de forum (Ask First 5 de 6.6 ; question « harmonisation du sous-forum » de `revue-manuelle.md`).

## 3. Règles CSS et fonctions JS mortes

### 3.1 Après 6.2 à 6.6

- Classes retirées du template par 6.2 à 6.6 (`git diff 0523d7f 810901f`, chaînes `a-b` retirées et non rajoutées) : `fa-ellipsis-v`, `forum-thread-mobile-breadcrumb`, `forum-thread-mobile-breadcrumb-bottom`. Aucune n'est encore ciblée par `kraland-theme.css` (0 occurrence) : les tickets ont retiré leurs règles.
- Fonctions retirées : deux `createBreadcrumb` locales, remplacées par `createForumBreadcrumb` (6.3, 6.4). Aucune fonction nommée du template sans appelant : les seuls noms vus une fois (`enhanceHomeRightColumn`, `initCommerceAccordion`, `initCommerceNameSwap`, `initForumCardsMobile`, `initMiniChatFAB`, `initPanelSectionsCollapse`, `injectCSSImmediately`) sont des expressions de fonction nommées passées à `InitQueue.register` ou des IIFE.
- Règles des composants 6.3 à 6.5 (`forum-mobile-breadcrumb*` l.14605-14647, `forum-thread-heading` l.4393 et l.13416, `forum-thread-top-bottom` l.13422, `kr-more` l.15212, `kr-more-glyph` l.15261) : toutes ciblent une classe posée par le template.
- Résultat : aucune règle CSS ni fonction JS morte imputable à 6.2-6.6.

### 3.2 Avant 6.2 (trouvées au passage, hors du relevé demandé)

| Classe | Lignes CSS | Producteur | `!important` |
|--------|-----------|------------|--------------|
| `forum-topic-stats-mobile` (et `.stats-sep`) | l.8705-8721 | posée par le template jusqu'à `ce0b012` (sous-forum L3), plus depuis | 9 |
| `forum-description-wrapper` | l.8459 (2e sélecteur d'une liste), l.8468 | jamais posée par le template (`git log -S`), absente des fixtures | 5 (règle l.8458-8465, partagée avec le 1er sélecteur, gardée), 1 (l.8469) |
| `forum-stats-wrapper` | l.8475 (3e sélecteur), l.8482, l.8488 (2e sélecteur) | idem | 1 (l.8483) |
| `forum-thread-detail`, `forum-thread-metadata` | l.11504, l.11514 (règles globales, hors média, ajoutées par `572caad`) | jamais posées par le template, absentes des fixtures ; peut-être natives sur des pages hors fixtures | 0 |

## 4. Course des infobulles en peau coupée (E14)

Mécanisme (plan 6.6, Implementation Notes l.306-313) : en injection à l'apparition de `<body>`, `observeTooltips` (template l.3941) pose un observateur ; `disableTooltips` (l.3912) ne retire `data-toggle`, `data-placement`, `title` et `data-original-title` que si `body.mobile-mode` est posé, après `DOMContentLoaded`.

Contrôles en peau coupée (`theme: false`) restants :

| Suite, lieu | Injection | Objet comparé | Exposé à la course ? |
|-------------|-----------|---------------|----------------------|
| `forum-activite.mjs` l.1719 (fragment `ligne`) | `debut: true` (corrigé en 6.6) | `outerHTML` de `#col-right`, icônes | non |
| `forum-index.mjs` l.835-855 (`peau-coupee`), fonction `COLONNE` l.823 | `<body>` | `innerHTML` de `#col-right` **après retrait des quatre attributs d'infobulle des deux côtés** (l.825), classe de page, cartes, `display` du tableau | non : les attributs sujets à la course sont retirés avant comparaison |
| `palette-nation.mjs` l.1631-1650 (`peau-coupee`) | `<body>` | couleurs des liens et des boutons primaires, jetons, variantes | non : aucun attribut d'infobulle lu |
| `palette-nation.mjs` l.598 (`largeurs`) | — | peau active (`theme` par défaut `true`) | non : pas en peau coupée |
| `forum-activite.mjs` l.282 (`ancres`) | `<body>` | hash, position du message | non |
| `messages-v3.mjs` l.228, l.335 | — | `SIGNATURE` l.203 : balise, `href`, `onclick`, texte | non |
| `modale-ordre.mjs` l.1371 | — | 1280 px (pas de `mobile-mode`) | non |

Conclusion : aucun contrôle restant ne compare un attribut d'infobulle en mobile peau coupée. Aucune modification de suite n'est nécessaire.

## 5. Routeur (MAX_CITING)

`tests/e2e/lib/router.mjs` l.261-262 : `MAX_CITING = 3`, `TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g` (jeton = au moins un tiret). Suites citantes, relevé sur les fichiers de `SUITES` :

| Jeton | Suites | Compte |
|-------|--------|--------|
| `kr-page-forum-index` | forum-index, jeu-identite, typographie-formes | 3 |
| `forum-mobile-breadcrumb` | sous-forum, forum-index, typographie-formes | 3 |
| `panel-default` | sous-forum, forum-index, jeu-identite | 3 |
| `kr-text-secondary` | forum-index, kramail-redaction, palette-nation | 3 |
| `forum-index-communaute` | forum-index, typographie-formes, cartes-pastilles | 3 |
| `page-forum` | sous-forum, forum-index, jeu-identite, cartes-pastilles | 4 (déjà transverse avant 6.7) |
| `kr-subforum`, `kr-forum-sujet` | forum-index | 1 |
| `kr-space-1` | typographie-formes | 1 |
| `kr-forum-icon`, `kr-more`, `forum-thread-mobile-breadcrumb`, `forum-topic-stats-mobile`, `forum-stats-wrapper`, `forum-description-wrapper` | — | 0 |

`sorting_asc` et `sorting_desc` n'ont pas de tiret : ce ne sont pas des jetons.

## 6. Questions en attente d'Arnaud qui touchent le sweep (`revue-manuelle.md`)

Compteurs sur ordinateur (6.1) ; liens du sujet mobile (6.4, E12) ; « ⏪ » retiré de l'index (6.3) ; repli « Catégorie » ; correctif d'ancres (E11) ; D14 (E10) ; Staff exclu (E2, E3, E5) ; Q27.5, Q27.6 ; O1 (fond de page teinté) ; harmonisation du sous-forum (« Nouveau sujet », flèche 34, `EXCEPTION_TICKET66`) ; coins bas de la racine (E6).
