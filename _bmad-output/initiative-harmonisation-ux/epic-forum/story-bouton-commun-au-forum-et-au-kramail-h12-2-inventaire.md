# Inventaire — ticket 6.5 : bouton « ••• » commun au forum et au kramail (H12.2)

Relevé sur `1134ef9d30a4ac36f00abd6af80a19d0dcf68721`, le 2026-10-25. Le code cité (template, CSS, suites, fixtures) est celui de ce SHA ; les numéros de ligne sont à revérifier au build.

Conditions du relevé : lecture du dépôt seulement. Aucun accès au site réel, aucun Chrome 9222/9223, aucun test lancé. Le comportement de Bootstrap 3.3.7 est lu dans `tests/e2e/vendor/`.

## 1. Relevé des trois boutons

### 1.1 Forum : « ••• » de Messages:V3 (sujet mobile)

- Module `Messages:V3`, InitQueue priorité 27, `kraland-userscript-template.js` l.7295-7398.
- Condition : `isMessagesView()` (classe `body.mobile-mode`, `innerWidth < 768`, chemin `/forum/`). `enhancePosts()` sur `/forum/sujet/` seulement.
- DOM créé, un par message (l.7333 environ) :
  ```html
  <button type="button" class="btn btn-default kr-msg-more" aria-expanded="false" aria-label="Autres actions">
    <span aria-hidden="true">•••</span>
  </button>
  ```
  Ajouté à la fin de `bar` = `li.media.kr-msg > .media-body > .pull-right`.
- Ce n'est pas un menu déroulant. Le clic bascule `kr-msg-open` sur le `li` et met `aria-expanded` à jour. Les actions secondaires (`kr-msg-secondary`, `data-kr-label` : Profil, Kramail, Signaler, Lien du message) apparaissent en ligne, sous les actions.
- Le « Lien du message » des secondaires est le lien du message (par message). Ce n'est pas le lien « lien » (`fa-link`, `button title="lien"`) de la `.pull-right` du `.forum-top`, qui concerne le sujet (§5.3).
- Aucun `data-toggle`, donc le data-api de Bootstrap ne pose aucun `.dropdown-backdrop` pour ce bouton.

### 1.2 Kramail, réception : clone du « + » (Kramail:MobileEnhancer)

- Module `Kramail:MobileEnhancer`, priorité 32, l.5998-6110. Condition : mobile-mode et `/kramail`.
- Source native (`kramail-reception.html`) : `#topics thead th .btn-group` avec `button.btn.btn-default.dropdown-toggle[data-toggle=dropdown]` « + » et 4 items.
- Le module clone ce `.btn-group`, lui ajoute `kramail-actions-mobile` (l.6030) et le place dans `h1.page-header .pull-right`, à côté de Réception, Envoi, Corbeille, Nouveau et Contacts.
- l.6036 : `toggleBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';`.
- Bascule manuelle de `.open` sur le clone, avec `preventDefault` et `stopPropagation`. Un clic sur le document referme. Le data-api de Bootstrap ne reçoit jamais l'événement : aucun `.dropdown-backdrop` aujourd'hui.
- Menu : `ul.dropdown-menu` natif cloné. « Tout sélectionner » (`#allbox` recâblé), marquer lu, important, supprimer (`.alertdel`). Ce sont des actions de jeu : aucun clic sur ces items, même en fixture, sauf « Tout sélectionner », qui ne fait rien côté serveur.

### 1.3 Kramail, lecture : kebab (Kramail:PostMobileEnhancer)

- Module `Kramail:PostMobileEnhancer`, priorité 33, l.6113-6380. Condition : `/kramail/post/`.
- Source native (`kramail-lecture.html`) : `.forum-top .pull-right` avec 8 `a.btn` (Réception, Répondre, Répondre à tous, Transférer, Signaler, Supprimer `alertdel`, Nouveau, Contacts).
- Le module déplace les 4 premiers `a.btn` dans un nouveau `span.pull-right` du h1. Il crée `div.btn-group.kramail-post-kebab` (l.6176) > `button.btn.btn-default.dropdown-toggle`.
- l.6181 : `kebabToggle.innerHTML = '<i class="fas fa-ellipsis-v"></i>';`.
- Menu : `ul.dropdown-menu.dropdown-menu-right[role=menu]`, items Signaler, Supprimer, Nouveau message, Contacts, avec `<i>` et `<span class="label-simple">`. Les attributs `alertdel` et `onclick` sont recopiés.
- Bascule manuelle de `.open`, comme au §1.2. L'ancienne `.pull-right` reçoit `kramail-actions-moved` ; CSS l.9355 : `.forum-top:has(.kramail-actions-moved) { display: none !important }`.

### 1.4 Écarts entre les trois

| | Forum (sujet) | Kramail réception | Kramail lecture |
|---|---|---|---|
| Classe d'accroche | `kr-msg-more` | `kramail-actions-mobile` (sur le groupe) | `kramail-post-kebab` (sur le groupe) |
| Contenu | `span[aria-hidden]` « ••• » | `i.fas.fa-ellipsis-v` | `i.fas.fa-ellipsis-v` |
| `aria-label` | « Autres actions » | aucun | aucun |
| `aria-expanded` | oui | non | non |
| Ouverture | secondaires en ligne (`kr-msg-open`) | `.open` manuel, menu déroulant | `.open` manuel, menu déroulant |
| Taille mobile | 48 × 44 (min-width 48) | 44 × 44 | 44 × 44 |
| Couleurs | `--kr-bg-surface`, bordure `--kr-border-strong`, texte `--kr-text-primary` (tout `!important`) | `--kr-bg-surface`, bordure `--kr-border-default`, texte `--kr-text-primary` (`!important`) | idem réception |
| Glyphe | texte 14 px, graisse 700, `letter-spacing: 1px` | icône 18 px | icône 18 px |

Aucune fonction commune. Aucune classe commune. Trois DOM différents.

## 2. Règles actuelles

### 2.1 JS

- Fonction modèle d'une section de premier niveau : `createForumBreadcrumb(parents, currentText)`, section « FIL D'ARIANE DU FORUM (H12.3) », l.5408-5437, portée de l'IIFE extérieure. La fonction commune du « ••• » se place juste après.
- `isMobileMode()` l.399. `getActiveTitleLabel()` l.8280 (non concerné).
- Le bouton « Plus » de l'éditeur (`kr-tools-plus`) n'est pas un « ••• » : hors périmètre.

### 2.2 CSS (`kraland-theme.css`)

- Bouton standard global, l.2397-2416, sans `!important`, spécificité (0,3,1) :
  - repos et focus : `html.kr-theme-enabled .btn-default.btn-default:where(:not(.dashboard-group-buttons *))` → `--kr-bg-surface`, `--kr-border-tint`, `--kr-text-nation` ;
  - survol, `:active`, `.active` et `.open > .dropdown-toggle` → fond `--kr-header-tint` ;
  - désactivé → comme le repos.
- Forum, Messages V3, `@media (max-width: 767px)` ouvert l.15003 :
  - l.15163-15185 : `body.mobile-mode ul.media-list.forum > li.media.kr-msg > .media-body > .pull-right .btn`. En `!important` : `display: inline-flex`, `min-width: 44px`, `height: 44px`, `padding: 0 12px`, `border: 1px solid var(--kr-border-strong)`, `border-radius: var(--kr-radius-sm)`, `background: var(--kr-bg-surface)`, `color: var(--kr-text-primary)`, `font-size: 14px`, `line-height: 1.2`. Ces trois couleurs battent le bouton standard ;
  - l.15187 : `.btn i` à 16 px ;
  - l.15217-15223 : `.kr-msg-more { order: 5; margin-left: auto !important; min-width: 48px !important; letter-spacing: 1px; font-weight: 700 }` ;
  - l.15226 : secondaires masqués hors `kr-msg-open` ;
  - l.15230-15240 : secondaires ouverts (order 10, flex 50 %, `::after { content: attr(data-kr-label) }`). Aucun `position` ni `z-index` ;
  - l.15151 : saut de ligne par `::after`.
- Kramail mobile, `@media (max-width: 767px)` ouvert l.8257 :
  - l.8862 : `body.page-kramail h1.page-header` en flex colonne `!important` ;
  - l.8873 : `.pull-right` en flex, gap 8 ;
  - l.8885-8904 : `… .pull-right > a.btn` et `… .pull-right > .btn-group > .btn` à 44 × 44 `!important`, `font-size: 0 !important; line-height: 0 !important`, rayon sm, fond `--kr-bg-surface`, bordure `--kr-border-default`, texte `--kr-text-primary` ;
  - l.8906-8910 : `> i` à `font-size: 18px !important; line-height: 1 !important`. Sans règle pour un `span`, le glyphe texte hériterait de `font-size: 0` : invisible ;
  - l.8927 : `.btn-group` en `position: relative !important`, 44 × 44 ;
  - l.8934-8968 : `.dropdown-menu` (min-width 260, right 0, rayon md, ombre). Pas de `z-index` : celui de Bootstrap, 1000. Items `min-height: 44px` ; `.label-simple` 15 px.
- l.9355 : `.forum-top:has(.kramail-actions-moved)` masqué.
- Exemples existants de couches au-dessus d'un voile : l.7671 (bootbox, voile 1049), l.11196 (menus de kramail-compose à 1050), l.13540 (smileys, relatif, z-index 1000).
- Compte : `grep -c '!important' kraland-theme.css` = 3290 (des lignes, pas des déclarations : un sélecteur ajouté à une règle `!important` existante ne change pas le compte).

### 2.3 Bootstrap 3.3.7 (vendor)

- Sur tactile (`'ontouchstart' in document.documentElement`), `Dropdown.prototype.toggle` insère `div.dropdown-backdrop` par `insertAfter($(this))`, juste après le toggle, avant le menu. Son clic appelle `clearMenus`.
- `.dropdown-backdrop` : `position: fixed; inset 0; z-index: 990`. `.dropdown-menu` : z-index 1000.
- Le voile n'est créé que par le data-api ou par `$(x).dropdown('toggle')`. Les trois boutons actuels n'y passent pas. Un voile peut exister pourtant, laissé par un autre menu Bootstrap de la page (barre de navigation) : c'est le cas que vise le ticket.
- Kramail : voile et menu sont frères dans le `.btn-group` (relatif, sans z-index), donc dans le même contexte d'empilement : 1000 > 990, le menu passe au-dessus si aucun ancêtre ne crée un contexte plus bas (à mesurer).
- Forum : un voile fixe à 990 couvre les secondaires (aucun z-index). Sur la base, `elementFromPoint` au centre du premier secondaire rendra le voile : rouge attendu.

## 3. Doublons et défauts

- D1 : trois implémentations du même bouton, sans fonction ni classe communes (H12.2, L5).
- D2 : `fa-ellipsis-v` (⋮) au kramail contre « ••• » texte au forum. `fa-ellipsis-h` ne serait pas identique (L5).
- D3 : le « ••• » du forum n'a pas le style standard : bordure `--kr-border-strong` et texte `--kr-text-primary` au lieu de `--kr-border-tint` et `--kr-text-nation`, par la règle générique `!important` l.15163.
- D4 : le « ••• » du forum fait 48 px de large (l.15219), les autres 44.
- D5 : le kramail n'a pas d'`aria-label` sur ses deux « ••• » (icône seule).
- D6 : `font-size: 0` sur les boutons du h1 du kramail : tout glyphe texte doit recevoir une taille explicite.
- D7 : les secondaires du forum n'ont aucune couche : un `.dropdown-backdrop` résiduel les couvre.

## 4. Assertions qui figent le rendu des pages touchées

| Suite | Lieu | Figé | Effet attendu |
|---|---|---|---|
| `messages-v3.mjs` | SIGNATURE (exclut `kr-msg-more`, `kr-tools-plus`) ; READ `more: q('button.kr-msg-more')` ; contrôles l.242-267 (actions sous le texte, ≥ 44 sans recouvrement, secondaires masqués, `aria-expanded` false, `.click()` puis 4 secondaires ≥ 44 sous le « ••• », fermeture) | DOM et géométrie du « ••• » | vert si `kr-msg-more` reste et que le bouton garde 44 px de haut ; la largeur 48 → 44 change la position des secondaires : à vérifier |
| `messages-v3.mjs` | fragment `themes` l.528-545 | contraste du « ••• » sur 16 thèmes | couleur `--kr-text-nation` : vert attendu, contre-épreuve |
| `typographie-formes.mjs` | `PAGES_BOUTONS.sujet` l.431 (`${MESSAGE} > .pull-right .kr-msg-more`, mobile) | couleurs du bouton | rouge sur la base (bordure, texte) : masque sur la base |
| `typographie-formes.mjs` | `PAGES_BOUTONS.reception` (exclut `h1.page-header .pull-right .btn` en mobile) | — | sans effet |
| `typographie-formes.mjs` | `rayons` l.1251 `['plus', '.kr-msg-more', 'C4', 'm']`, l.1270 `['actions', '.kramail-actions-mobile > .btn', 'C4', 'm']`, l.1276 `['menu', '.kramail-post-kebab > .btn', 'C4', 'm']` | rayon sm | vert si les accroches restent |
| `typographie-formes.mjs` | l.1310 menus : clic `.kramail-actions-mobile > .dropdown-toggle`, puis `.kramail-actions-mobile .dropdown-menu` K8 | ouverture du menu | vert si la bascule est inchangée |
| `typographie-formes.mjs` | l.1824-1839 `ETAT_NETTOYAGE` : « `.dropdown-backdrop` présent » interdit à l'état prêt | aucun voile au repos | le nouveau contrôle doit retirer son voile simulé ; aucun voile au chargement |
| `typographie-formes.mjs` | `echelle-forum` (COMMIT_ECHELLE_FORUM d953969, `PAGES_FORUM` sujet, reception, lecture ; `MESURE_TAILLES` compte les éléments) | tailles de police et nombre d'éléments | `i` → `span` change le compte et la taille (18 → 14) au kramail : masque DOM sur la base |
| `typographie-formes.mjs` | `espacement` (COMMIT_ESPACEMENT 62fd47d, l.1494-1499 sujet, reception, lecture) | largeurs et écarts | 48 → 44 au forum : masque probable |
| `typographie-formes.mjs` | `nettoyage` (COMMIT_NETTOYAGE 00b0786, sujet ; reception `m: true` l.1698-1700) | empreinte nettoyée | masque probable |
| `typographie-formes.mjs` | `boutons` (COMMIT_BOUTONS 4d97496) | couleurs des boutons | voir `PAGES_BOUTONS.sujet` |
| `lib/variantes.mjs` | l.769 `['plus', '.kr-msg-more', 'E', 'm', [...SAUF('margin-left', ...ECARTS_TICKET49), 'droite']]` | espacement du « ••• » | `min-width` 48 → 44 change `droite` : à vérifier au rouge avant |
| `kramail-redaction.mjs` | fragment `regression` l.1282 : réception, envoi, corbeille, lecture à 1280, 375, 320 ; captures pleine page au pixel contre le bundle « avant » = `origin/feature/next` ou `feature/next` (sauf `KR_SCRIPT_AVANT`) | rendu pixel | rouge à 375 et 320 sur réception et lecture (glyphe) : masque si `AVANT_TICKET65(AVANT)`, sur le modèle `ECHELLE_FORUM_AVANT` l.231 (CSS) plus un masque DOM |
| `kramail-redaction.mjs` | l.455, l.461 : clic sur `.dropdown-backdrop` | fermeture des menus de rédaction | sans effet (autres menus) |
| `cartes-pastilles.mjs` | COMMIT_AVANT 21fed8d ; page reception (famille kramail) ; fragment `forum` (140 éléments des messages du sujet, RELEVE des styles) | styles calculés et positions | couleurs du « ••• » : masque sur la base ; positions des secondaires si la largeur change. Le 6.4 s'est fait prendre ici au `test:all` |
| `palette-nation.mjs` | pages sujet et « réception du kramail » à 375 et 1280, 16 variantes, contre BASELINE4 6685df5 et BASELINE5 d521cc8 | couleurs des composants | à vérifier au rouge avant ; masque si le « ••• » est relevé |
| `forum-index.mjs` | COMMIT_AVANT 81512a3, SUJET `forum-sujet`, `EMPREINTE` | empreinte du sujet | masque par `EMPREINTE` (options sujet, verifier, jetons), comme au 6.4, base seulement |
| `forum-mobile.mjs` | l.52 voile simulé ; l.381-465 vrai gestionnaire Bootstrap, toucher du voile | menus du forum | vert attendu ; modèle pour le nouveau contrôle |
| `fin-initialisation.mjs` | `kramail-reception` | fin d'initialisation | vert attendu |
| `jeu-identite` | zones forum et kramail | rendu des zones | à lire au rouge avant |

## 5. Compléments

### 5.1 Masques prévus (sur le bundle de base seulement)

Détection : `AVANT_TICKET65(src)`, vrai si la chaîne minifiée `kr-more-glyph` est absente. Vérifié : `kr-more` est absent des 17 bases citées par les suites (6685df5, d521cc8, 0523d7f, 21fed8d, 81512a3, d68ab55, 4d97496, 3b1da55, fe77411, d953969, ef0e4d4, 62fd47d, 5042afd, 8631c45, 00b0786, 5ff22d3, 2db3b4c) et de `1134ef9` ; présent dans le bundle courant après le build (à revérifier).

Miroirs dans `lib/variantes.mjs` :

- `PLUS_TICKET65` : CSS miroir (style standard et glyphe), injecté par `poserJetonsRedefinis` ou équivalent ;
- `plusTicket65` : masque DOM, qui remplace `i.fa-ellipsis-v` par le `span.kr-more-glyph` et pose `kr-more` et `aria-label` sur les trois boutons.

| Suite | Fragment | Masque | Condition de retrait |
|---|---|---|---|
| `kramail-redaction.mjs` | `regression` (375, 320 ; réception, lecture) | CSS et DOM sur « avant » | sweep 6.7 ou action A4 de la rétro 5 |
| `typographie-formes.mjs` | `boutons`, `echelle-forum`, `espacement`, `nettoyage` (selon rouge avant) | CSS et DOM | réalignement des bases par le sweep 6.7 ou l'action A4 de la rétro 5 |
| `cartes-pastilles.mjs` | `forum`, page reception | CSS et DOM | idem |
| `palette-nation.mjs` | pages sujet et réception (si rouge) | CSS et DOM | idem |
| `forum-index.mjs` | `EMPREINTE` du sujet | options sujet, verifier, jetons | idem |
| `messages-v3.mjs` | `themes` (si rouge) | aucun prévu : le courant seul est mesuré | — |

Chaque masque n'est posé que si le rouge avant le rend nécessaire : rouge sans lui, vert avec lui.

### 5.2 Repères du routeur (relevé `TOKEN_RE` sur les fichiers de `SUITES`, script hors dépôt `/tmp/kr65/tokens.mjs`)

`MAX_CITING = 3`, `TOKEN_RE = /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+/g`. Seuls les fichiers de suite comptent ; `lib/variantes.mjs` ne compte pas.

| Suites citantes | Jetons | Règle pour `forum-activite.mjs` |
|---|---|---|
| 3 | `kr-msg` (messages-v3, palette-nation, typographie-formes), `dropdown-backdrop` (forum-mobile, kramail-redaction, typographie-formes), `aria-hidden`, `forum-sujet`, `kr-text-nation`, `kr-bg-surface`, `kr-text-primary`, `min-height`, `fa-link` (forum-mobile, messages-v3, kramail-redaction), `data-kr-label`, `media-body`, `media-list` | jamais en clair : par `lib/variantes.mjs` |
| 2 | `kr-msg-more` (messages-v3, typographie-formes), `kramail-lecture`, `kr-border-tint`, `fa-th-list`, `kr-tools-plus`, `z-index`, `forum-thread-action` | une suite de plus au maximum ; si une autre suite en a besoin, par `variantes` |
| 1 | `kr-msg-open`, `kr-msg-secondary` (messages-v3), `kramail-actions-mobile`, `kramail-post-kebab` (typographie-formes), `kr-header-tint`, `kr-forum-sujet`, `forum-activite` | libre |
| 0 | `fa-ellipsis-v`, `kr-more`, `kr-more-glyph`, `label-simple`, `page-kramail`, `kramail-actions-moved`, `dropdown-menu-right`, `kr-border-strong`, `letter-spacing` | libre ; `kr-more` et `kr-more-glyph` deviennent les repères du ticket |
| > 3 déjà | `dropdown-toggle` 5, `dropdown-menu` 5, `aria-label` 8, `aria-expanded` 5, `kramail-reception` 5, `btn-default` 8, `pull-right` 8, `btn-group` 6, `font-size` 5, `font-weight` 6, `min-width` 6, `mobile-mode` 17, `kr-theme-enabled` 20, `messages-v3` 5 | sans effet sur le seuil |

Le relevé est refait sur les suites finies : aucun jeton ne passe de 3 à 4.

### 5.3 Hors périmètre

- Liens « lien » (`fa-link`, `button title="lien"` de la `.pull-right` du `.forum-top`) et « liste des messages » (`fa-th-list`, `forum/sujet/<slug>-<id>-999`) du sujet mobile, masqués avec la barre native (deferred-work l.135, revue-manuelle l.432). Choix produit d'Arnaud : Ask First 1 du plan.
- Thème du forum pour le kramail (couleurs, bordures, menus) : épopée 7.
- Bouton « Plus » de l'éditeur (`kr-tools-plus`).
- Taille des icônes seules de l'en-tête du sujet, 16 → 14 px (revue-manuelle l.164) : décision du 6.4.
- Bureau : aucun « ••• » à 768 px et plus.
