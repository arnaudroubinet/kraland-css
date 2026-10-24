# Inventaire — ticket 6.2 : index mobile dans la carte de section ; la flèche et « premier non lu » mènent au message

Relevé sur `0523d7fb5893686272ec0755fefe63ba1a0d52b4` (bundle `kraland-userscript-main.user.js` du dépôt, construit à ce SHA), le 2026-10-25. Chromium de Playwright (`tests/e2e/lib/navigateur.mjs`), `confineNetwork`, Bootstrap 3.3.7 et jQuery 3.3.1 de `tests/e2e/vendor/`, variante `empire-brun-dark`, `kr-theme-enabled` à `true` vérifié par `krReady(…, THEME_READY)` (sauf ligne « peau coupée »). Scripts hors dépôt : `/tmp/mesure62/mesure.mjs` (et `extra.mjs`, `extra2.mjs`, `racine.mjs`, `ac.mjs`, `bascule.mjs`, `peau.mjs`), résultats bruts dans `/tmp/mesure62/resultats.json`. Fixtures seules, aucun site réel, aucune cloche, aucun `/report`.

Deux modes d'injection du bundle, comme dans les suites existantes :

- **body** : bundle évalué dès que `document.body` existe (harnais `open` de `forum-index.mjs`). La meta viewport est déjà lue : `innerWidth` = largeur émulée (375, 767…) à l'évaluation.
- **début** : script ajouté en tête de `<head>`, avant la meta viewport, et bundle évalué dès que `document.documentElement` existe (mode `debut` de `modale-ordre.mjs`). `window.__krInjection` relevé : `{ body: false, largeur: 981 }` à 375 et 767 px. C'est l'état d'un vrai téléphone (G-01, H10) ; la valeur exacte est 981, pas 980.

Trois bundles comparés pour les ancres, tous dérivés du bundle de `0523d7f` par remplacement de la condition minifiée `window.innerWidth<768&&window.location.hash&&"#top"!==window.location.hash` (offset 39524) :

- **courant** : inchangé ;
- **sans** : condition remplacée par `!1` (correctif retiré) ;
- **flap** : condition remplacée par `"#flap"===window.location.hash` (sans test de largeur).

## 1. Mesures de la base

### 1.1 Ancres `#msg…` du fil de sujet (`forum-sujet.html` servi à `/forum/sujet/messages-v3-329425-1`, hauteur 667)

`a[name="msg6801393"]` (2e message) et `a[name="msg6801395"]` (3e et dernier message, en bas de page). « msg » = `li.media` qui suit l'ancre (`li.media.well.kr-msg` en mobile). `top` = `getBoundingClientRect().top` après `krReady` + 900 ms.

| Bundle | Injection | Largeur | Ancre | `location.hash` | scrollY | haut / bas du message | Constat |
|---|---|---|---|---|---|---|---|
| natif (sans userscript) | — | 375 | 1393 / 1395 | gardé | 957 / 1099 | 0..547 / 425..627 | le navigateur place l'ancre |
| courant | body (375) | 375 | 1393 / 1395 | **vide** | **0 / 0** | 1031..1734 / 1749..2103 | **H10 reproduit** : ancre retirée, haut de page |
| courant | body (767) | 767 | 1393 / 1395 | **vide** | **0 / 0** | 903..1526 / 1541..1896 | idem au seuil −1 |
| courant | body | 768 / 1280 | 1393 / 1395 | gardé | 694 / 613 | 13..405 ; 425..588 / 33..405 ; 425..588 | bureau correct |
| courant | début (981) | 375 | 1393 / 1395 | gardé | 1031 / 1580 | 0..703 / 169..523 | correctif inerte (vrai téléphone) |
| courant | début (981) | 767 | 1393 / 1395 | gardé | 903 / 1356 | 0..623 / 185..540 | idem |
| sans | body et début | 375 | 1393 / 1395 | gardé | 1031 / 1580 | 0..703 / 169..523 | les deux injections donnent le même résultat |
| sans | body et début | 767 | 1393 / 1395 | gardé | 903 / 1356 | 0..623 / 185..540 | idem |
| sans | body et début | 768 / 1280 | 1393 / 1395 | gardé | 694 / 613 | comme courant | bureau inchangé |
| flap | body et début | 375 à 1280 | 1393 / 1395 | gardé | comme « sans » | comme « sans » | `#msg` jamais touché |

Hauteur du document à 375 px : 2247 (défilement maximal 1580). Le 3e message est donc au défilement maximal : son haut est à 169 px, dans la fenêtre, et non à 0.

Barre fixe : en mobile (375, `sans`, les deux injections) et au bureau (768, 1280), `nav.navbar.navbar-inverse.nomargin` est en `position: fixed` en haut, avec un bas à 60 px (mobile, 768) ou 52 px (1280). `elementFromPoint` à 10 px sous le haut du message ancré à 0 renvoie `div.navbar-header` (ou `.navbar-collapse` au bureau) : **l'en-tête du message (auteur, date) est sous la barre**. `scroll-padding-top` = `auto` ; aucune règle `scroll-padding` ou `scroll-margin` ne vise les ancres (seule `scroll-margin-bottom: 72px` l.13576, hors sujet). Ce recouvrement existe aussi au bureau dans la base : c'est un constat, pas un écart introduit par 6.2.

### 1.2 Peau coupée (`kr-theme-enabled` = `false`, injection body)

| Bundle | Largeur | `kr-theme-enabled` | hash | scrollY |
|---|---|---|---|---|
| courant | 375 | absent | **vide** | **0** |
| courant | 1280 | absent | gardé | 606 |
| sans | 375 | absent | gardé | 1011 |
| sans | 1280 | absent | gardé | 606 |

Le correctif tourne même peau coupée : aucune garde `isThemeEnabled()` avant le template l.2885.

### 1.3 Mini-chat `#flap` (fixture `forum-sujet.html` complétée en mémoire)

Fixture complétée dans le script seulement : `<a id="lien-flap" href="#flap">MC</a>` et un `div#flap` en `position: fixed; right: -300px` après le pied de page. Aucune fixture du dépôt n'a de `#flap` ; `palette-nation.html` a seulement le lien `#lien-flap`. `main.css` natif (non embarqué) : `#flap:target { right: 10px }`. URL ouverte : `…#flap`.

| Bundle | Injection | Largeur | hash | scrollY | `#flap` calculé |
|---|---|---|---|---|---|
| natif | — | 375 / 1280 | `#flap` | 0 | `right: -300px`, visible, hors fenêtre (pas de `main.css`) |
| courant | body (375) | 375 | **vide** | 0 | `.mini-chat-overlay`, `visibility: hidden`, `right: -375px`, `left: 0` |
| courant | début (981) | 375 | `#flap` | 0 | identique |
| courant | body / début | 1280 | `#flap` | 0 | inchangé (natif) |
| sans | body / début | 375 | `#flap` | 0 | identique au courant |
| sans | body / début | 1280 | `#flap` | 0 | inchangé |
| flap | body / début | 375 | vide | 0 | identique |
| flap | body / début | **1280** | **vide** | 0 | **retire `#flap` au bureau** |

Constats :

- Sur mobile, le retrait de `#flap` n'a **aucun effet mesurable** : aucun défilement (élément fixe) ; le mini-chat reste caché, par le CSS (`#flap { position: fixed !important; right: -100% !important }` l.4422-4434, plus fort que `:target`) et par le JS (`initMiniChatFAB`, l.4982 : `visibility: hidden`, classe `mini-chat-overlay`).
- Le bundle « flap » sans test de largeur **retire `#flap` au bureau**. Il casserait l'ouverture native du mini-chat par `:target` (`accueil#flap`). Le test de largeur doit donc rester sur la branche `#flap`.

### 1.4 Bascule au seuil dans le même onglet (`forum-sujet.html#msg6801395`, contexte non tactile, injection body)

768 → 767 → 768, 1 400 ms entre deux redimensionnements (garde-fou de 1 200 ms), relevé 5,7 s après chaque redimensionnement. Chaque franchissement recharge la page (`docs` = 1, 2, 3).

| Bundle | Étape | `innerWidth` | hash | scrollY | haut de l'ancre |
|---|---|---|---|---|---|
| courant | 768 (ouverture) | 768 | gardé | 694 | 425 |
| courant | 767 (rechargé, mobile) | 767 | **vide** | 694 | 847 (hors fenêtre) |
| courant | 768 (rechargé) | 768 | **vide** | 659 | 460 |
| sans | 768 | 768 | gardé | 694 | 425 |
| sans | 767 | 767 | gardé | 694 | 847 (hors fenêtre) |
| sans | 768 | 768 | gardé | 659 | 460 |

Après rechargement, `restoreScrollAfterReload` (template l.817-832) remet le défilement en pixels (`saved.y`). Il ne tient pas compte de l'ancre : en mobile, le document est plus long et le message sort de la fenêtre. Ce comportement vaut avec ou sans correctif. Le correctif ne fait qu'effacer l'ancre ; sans lui, l'ancre survit aux deux bascules.

### 1.5 Lignes de l'index (bundle courant, injection body, hauteur 667 en mobile, 900 au bureau)

`tr` = `#col-right .panel-default table.table > tbody > tr`. « centre » et « flèche » : `elementFromPoint` au centre de la ligne et de la flèche, après `window.scrollTo`.

| Fixture | Largeur | Panneau (x, w) | En-tête (h) | Lignes (h) | `min-height` | Flèche (w×h, r) | Centre → | Flèche → |
|---|---|---|---|---|---|---|---|---|
| forum-index-rp | 375 | 8, 359 | 48 | 85,9 ×3 ; **64,7** (Les Cadets d'Essai, sans message) | 0px | 44×44, r 359 (8 du bord interne) | lien du forum | `…#msg6900001..3` |
| forum-index-rp | 767 | 8, 751 | 48 | 85,9 ×3 ; **64,7** | 0px | 44×44, r 751 | lien du forum | `#msg` |
| forum-index-rp | 768 / 769 | 30, 675 / 676 | 43,7 | 46,6 ; 46,1 ; 46,1 ; 28,8 | 0px | 32×32 | `TD` | `#msg` |
| forum-index-rp | 1280 | 334, 883 | 43,7 | 46,6 ; 46,1 ; 46,1 ; 28,8 | 0px | 32×32 | `TD` | `#msg` |
| forum-index-communaute | 375 / 767 | 8, 359 / 751 | 48 | 85,9 ×2 ; **64,7** (Archives d'essai) | 0px | 44×44 | lien du forum | `#msg6900101/102` |
| forum-index-communaute | 768 / 769 / 1280 | — | 43,7 | 46,6 ; 46,1 ; 28,8 | 0px | 32×32 | `TD` | `#msg` |
| forum-racine-groupes (`/forum`) | 375 / 767 | — | — | 85,9 ×3 ; **64,7** ; 85,9 ×3 ; **64,7** | — | — | — | — |
| forum-racine (`/forum`) | 375 / 767 | — | — | 139,6 ×2 | — | — | — | — |
| forum-index-rp servi à `/forum/staff` | 375 / 767 | — | — | 313,8 ; 313,8 ; 295,8 ; 206,3 (375) | — | — | — | — |

Constats :

- La carte de section (5.2) est déjà en place : panneau à 8 px des bords, en-tête de 48 px, lignes dans la carte.
- La flèche fait déjà 44×44 et pointe vers `#msg`. Le centre de la ligne mène au forum.
- **Seul écart à DESIGN (ligne ≥ 72 px)** : un forum sans dernier message mesure 64,7 px, sur l'index et sur la racine. Les lignes à 3 rangées font 85,9 px.
- La racine porte `kr-page-forum-index` et reprend la règle de ligne : elle suit l'index. Staff ne la porte pas (cartes A13, hors périmètre).
- Bureau : la ligne n'est pas étirée (centre → `TD`), flèche de 32 px. C'est la base, hors périmètre.

### 1.6 Essai de `min-height: 72px` (feuille injectée dans la page, sans `!important`, `forum-index-rp`, 375)

| Variante | Lignes à 3 rangées | Ligne sans message : h, haut du nom, haut des compteurs, marge basse |
|---|---|---|
| `min-height: 72px` seul | 85,9 (inchangées) | 72 ; 10 ; 41 ; 12,8 (espace réparti entre les rangées : `align-content: normal` = étirement) |
| + `align-content: center` | 85,9 (inchangées) | 72 ; 13,7 ; 39,2 ; 14,7 (bloc de texte centré) |
| + `align-content: flex-start` | 85,9 (inchangées) | 72 ; 10 ; 35,5 ; 18,3 (texte en haut) |

`min-height` calculé : `72px` ; `box-sizing: border-box` (72 inclut le retrait de 10 + 10 et le filet bas de 1 px). Aucune autre règle ne pose de `min-height` sur `tr` de l'index (§2).

### 1.7 « Premier non lu » du sous-forum (`sous-forum-debuter.html`, `/forum/hrp/debuter-20102`)

À 375 et 1280 px, 3 sujets lus en partie portent `data-smart-redirect="first-unread"` et un titre en `…-1#msgNNN` : « Discussion sur la modération… » (`#msg6743899`), « Déplacement bâtiment architecte » (`#msg6698444`), « Gagner des PA » (`#msg6698133`). Les autres sujets ont leur lien de page 1. Le lien est donc correct dans la base. Le défaut est à l'arrivée sur le sujet (§1.1), pas dans le lien.

Hauteurs mobiles des lignes de sujet (375) : 44 (permanents), 86,7 à 127,1 (`#topics`). Elles sont hors périmètre et inchangées.

## 2. Règles en jeu

| Lieu (`0523d7f`) | Sélecteur / code | Déclarations | Statut mesuré | Cible 6.2 |
|---|---|---|---|---|
| template l.2882-2907 (section « FIX MOBILE : Empêcher le scroll automatique vers #flap ou autres ancres », premier niveau de l'IIFE, hors InitQueue, commit `3eae982`) | `if (window.innerWidth < 768 && window.location.hash && window.location.hash !== '#top') { … }` | `history.scrollRestoration = 'manual'`, `replaceState` sans hash, `scrollTo(0, 0)` immédiat, au `DOMContentLoaded` et au `load` ; restauration du mode après 500 ms | retire tout hash ≠ `#top` si la largeur à l'évaluation est < 768 (§1.1, §1.2) ; inerte à 981 (§1.1) ; aucun effet visible sur `#flap` (§1.3) | condition réduite à `window.innerWidth < 768 && window.location.hash === '#flap'` ; corps inchangé |
| CSS l.14684 | `@media (max-width: 767px)` des lignes de l'index | — | englobe l.14697-14869 | inchangé |
| CSS l.14701-14717 | `:where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr` (1,3,3) | `position: relative; display: flex !important; flex-direction: row !important; flex-wrap: wrap; align-items: baseline; gap: 2px 6px; margin: 0 !important; padding: 10px 56px 10px 12px !important; border…; background: var(--kr-bg-surface) !important; overflow: visible !important; cursor: pointer` | sans `min-height` ; ligne sans message 64,7 | `min-height: 72px` et `align-content: center` ajoutés, sans `!important` |
| CSS l.14814 / l.14828 | `… > p.mini .btn-group` / `… .btn-group > a.btn` | 44×44 `!important`, `position: absolute; top: 50%; translateY(-50%)` | 44×44, centrée verticalement | inchangé (centrée dans la ligne de 72 aussi) |
| CSS l.14754 | réinitialisation des liens `td a:not(.btn)` | `min-height: 0 !important` | ne vise pas `tr` | inchangé |
| CSS l.14863 | `… > tbody > tr:active` | fond `bg-hover` | — | inchangé |
| CSS l.14185 | `html body.page-forum.kr-subforum.mobile-mode .panel-default table.table > tbody > tr` | `min-height: 44px !important` | sous-forum seulement | hors périmètre |
| CSS l.8539, l.8558 | A13 2e version, `:where(html:not(.kr-page-forum-index)) body.page-forum …` | hauteurs de 20 px `!important` | exclut l'index | hors périmètre |
| CSS l.4422-4442 | `#flap`, `#flap.mobile-open`, `a[href*="#flap"]` (mobile) | `position: fixed !important; right: -100% !important; …` | bat `#flap:target` natif | inchangé |
| template l.4982 (`initMiniChatFAB`) | `#flap` en `visibility: hidden`, `.mini-chat-overlay` | — | §1.3 | inchangé |
| template l.817-832 (`restoreScrollAfterReload`) | `scrollTo(0, saved.y)` à 0, 150, 400, 900, 1800 ms | — | §1.4 : défilement en pixels après bascule | inchangé (Ask First si l'ancre doit primer) |
| template l.5066-5140 (`smartLink`, module SOUS-FORUM) | titre ← lien `…-1#msgNNN` de l'icône `i.fa.fa-folder-open:not(.far)` | `data-smart-redirect="first-unread"` | §1.7 correct | inchangé |

Compte `!important` de `kraland-theme.css` à `0523d7f` : **3292** (`grep -c '!important' kraland-theme.css`). Attendu après 6.2 : 3292.

## 3. Doublons

- Aucun doublon de la règle de ligne de l'index : la 2e version A13 (l.8356 et suivantes) est exclue par `:where(html:not(.kr-page-forum-index))`. L'ancienne présentation en cartes de l'index (`.forums-cards-container`, `.forum-card`) n'est plus créée (6.1, `sous-forum.mjs` l.40-46).
- Deux mécanismes touchent le défilement après chargement : le correctif d'ancres (l.2895-2903) et `restoreScrollAfterReload` (l.817-832). Ils ne se recouvrent qu'après une bascule de seuil (§1.4). 6.2 ne touche que le premier.

## 4. Assertions qui figent le rendu touché

| Suite | Lieu | Ce qui est figé | Effet attendu de 6.2 |
|---|---|---|---|
| `tests/e2e/cartes-pastilles.mjs` | fragment `lignes` l.616-660, base `COMMIT_AVANT = '21fed8d'` (l.78), harnais `ouvrir` l.170 sans feuille de masque | hauteur de chaque ligne égale à la base quand le nombre de rangées de texte est égal (l.645-648), sur `DE('forum')` (index RP, Communauté, racine, racine-groupes, Staff, sous-forum) à 375 et 767 | **rouge** sur « Les Cadets d'Essai » (index RP) et sur les 2 lignes sans message de racine-groupes : 72 contre 64,7. Masque nécessaire sur le bundle de base. |
| `tests/e2e/forum-index.mjs` | `LIGNES` l.143-219 ; `COMPOSANTS_MOBILE` l.251-271 (parité de la ligne d'index avec `#topics` : display, flex-wrap, align-items, gaps, retraits, filets, fond, position, rayons, **sans** `min-height` ni `align-content`) ; l.355-361 (lignes dans la carte) ; l.379-388 (flèche ≥ 44, `ligne.r − fleche.r ≤ 12`, `#msg`, centre, `aria-label`) ; hors-périmètre l.581-613 (empreinte de sous-forum, sujet et Staff contre `81512a3`) | ligne, flèche, parité | vert attendu : `min-height` et `align-content` ne sont pas comparés ; l'index n'est pas dans l'empreinte ; la flèche reste centrée. À vérifier. |
| `tests/e2e/sous-forum.mjs` | `forumIndex()` l.40-46 (index synthétique, 3 lignes avec flèche) ; l.540 (flèche 44×44 centrée à ±8 px, `#msg`) ; l.1090, l.1173-1174, l.1208-1230 (lien « premier non lu ») | flèche et lien du sous-forum | vert attendu (lignes à 3 rangées > 72 ; liens inchangés). |
| `tests/e2e/palette-nation.mjs` | l.291 `#lien-flap` (couleurs du bouton du mini-chat, mobile) | couleurs | non touché |
| `tests/e2e/typographie-formes.mjs`, `palette-nation.mjs` `pages4` | tailles et couleurs de l'index | pas de hauteur de ligne | vert attendu, à vérifier |
| `tests/e2e/demarrage-mobile.mjs` l.115-122, `modale-ordre.mjs` l.136-170 | injection à 980/981 | aucune ancre | non touché ; précédents du mode « début » |

Aucune suite ne relève `location.hash` à l'arrivée sur un sujet. Le défaut H10 n'est couvert par aucun test aujourd'hui (`grep -l "location.hash" tests/e2e/*.mjs` : rien).

## 5. Compléments

- **Routeur** (`tests/e2e/lib/router.mjs`, 486 lignes) :
  - `SUITES` l.37 (`forum-index`, zones `forum`, `sous-forum`) ;
  - `KEYWORDS` l.147-200 : `kr-page-forum-index` est reconnu par `(?<!sous-|sub)forum` (zone `forum`) et par le mot-clé des panneaux l.161 (`cartes-pastilles`, si `.panel` suit). Aucun mot-clé ne reconnaît `location.hash`, `scrollRestoration`, `flap`, `#msg` ni `smart-redirect` ;
  - `SECTIONS` l.204-215 : la section « FIX MOBILE : … » est absente, donc transverse. Un hunk de ce correctif sans mot-clé élargit au total ;
  - `MAX_CITING = 3` (l.232).
- **Repères déjà cités par 3 suites** (ne pas écrire en clair dans `forum-activite.mjs` ; passer par `lib/variantes.mjs`) : `kr-page-forum-index`, `page-forum`, `panel-default`, `fx-permanents`, `kr-text-primary`, `kr-bg-surface`, `.kr-topic-badge`, `forum-sujet.html`.
- **Masques existants** (`tests/e2e/lib/variantes.mjs` l.360-431) : `CARTES_TICKET51/52`, `AVANT_TICKET51/52`. Leur condition de retrait (« quand le bundle de base contient l'entrée 5.x ») ne se déclenche jamais, car la base est un SHA figé (rétro 5, F4, action A4).
- **Jeton** : aucun jeton de 72 px. DESIGN.md l.172 (`min-height-mobile: 72px`) et l.462 (« ligne de forum ≥ 72 px sur mobile ») donnent la valeur littérale.
- **Fichiers sans `#flap`** : aucune fixture du dépôt n'a d'élément `#flap`. La suite devra compléter une fixture en mémoire (§1.3), sans écrire de nouvelle fixture brute.
