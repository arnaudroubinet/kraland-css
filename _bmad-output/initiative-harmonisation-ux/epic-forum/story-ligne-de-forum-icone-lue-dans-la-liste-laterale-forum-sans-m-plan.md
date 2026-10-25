---
title: 'Ligne de forum : icône lue dans la liste latérale, forum sans message, compteurs et flèche sur ordinateur (Q27)'
type: 'feature'
ticket: '6'
created: '2026-10-25'
status: 'built'
baseline_revision: '6ba0838558613990b297b68eb22a3984a2c99674'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/tickets.toml'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-l-index-du-forum-reprend-la-presentation-du-sous-forum-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-bouton-commun-au-forum-et-au-kramail-h12-2-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/review-faisabilite.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La ligne de l'index du forum ne suit pas encore la **Ligne de forum** de DESIGN.md (`{components.forum-row}`, l.165-172 et l.511 ; inventaire §3) :

- D1 : aucune icône de forum sur la ligne, alors que la liste latérale native en porte une par forum (`#col-left .list-group > a.list-group-item > span.lefticon > i`). Le tableau natif n'en a pas (M13, Q27.3) ;
- D2 : flèche « dernier message » de 32 px sur ordinateur (DESIGN : 34 px) ;
- D3 : auteur du dernier message en `--kr-text-primary` sur ordinateur (DESIGN : `{colors.text-accent}`) ;
- D4 : auteur et heure alignés à gauche dans leur cellule sur ordinateur (DESIGN l.468 : compteurs, dernier message et flèche alignés à droite).

Déjà conformes, à garder : heure native (« Aujourd'hui (HH:MM) », Q27.1) ; forum sans message sans flèche ni case vide (Q27.2) ; flèche vers le dernier message `#msgN` (Q27.4) ; ligne mobile ≥ 72 px, flèche mobile 44 px (6.2).

**Approach:** Le module `ForumIndex:Presentation` (template l.5672-5733, peau active seulement par la garde `kr-page-forum-index`) lit la liste latérale native au moment où il tourne. Il construit une table « chemin normalisé → icône » avec `krForumNormalizePath` (cœur pur l.94). Pour chaque ligne dont le lien du nom a une entrée active dans la table, il pose avant le nom une `span.kr-forum-icon[aria-hidden="true"]` qui contient un clone de l'`i` (ou de l'`img`) de `span.lefticon`. Sans entrée, rien n'est posé : la ligne garde son rendu natif (Ask First 2).

Côté CSS, section « INDEX DU FORUM » :

- icône : une règle nouvelle par support, sans `!important`, dans `@media (max-width: 767px)` et `@media (min-width: 768px)` ;
- ordinateur seulement, par réécriture des règles d'origine : flèche 32 → 34 px (l.14955, l.14967) ; auteur en `--kr-text-accent` (l.14937) ; `text-align: right` sur la cellule du dernier message (l.14950).

Compteurs en colonnes, couleur inchangée (Ask First 1). Mobile inchangé hors icône. Sous-forum et Staff inchangés.

## Boundaries & Constraints

**Always:**
- L'inventaire fait foi (§1 relevé et correspondance des URL, §2 règles, §4 assertions, §5 masques et repères). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire les déclarations d'origine, sans règle concurrente plus spécifique. **Aucun nouvel `!important`** : `grep -c '!important' kraland-theme.css` ≤ 3290 (compte de `6ba0838`). Réécrire la valeur d'une ligne `!important` existante est permis (compte inchangé) ; en ajouter une ne l'est pas. Aucun `:focus`, aucun focus clavier.
- Mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)`, aucune règle globale.
- Garde ajoutée à un sélecteur : `:where(html.kr-page-forum-index)`, spécificité nulle. Aucune garde `html:where(.x)`.
- Module actif seulement avec la peau : sans `kr-theme-enabled` (donc sans `kr-page-forum-index`), aucune `.kr-forum-icon`, `#col-right` identique à la page native.
- Liste latérale **lue, jamais modifiée** : ni classe, ni attribut, ni déplacement de nœud. L'icône est un clone (`cloneNode(true)`), l'original reste en place.
- Lecture : `#col-left .list-group > a.list-group-item[href]` hors `.kraland-metrics` ; entrée désactivée (`krForumIsDisabledEntry`) ignorée ; clé `krForumNormalizePath(new URL(href, document.baseURI).pathname)` des deux côtés.
- Idempotence : un 2e passage ne pose pas de 2e icône (une `.kr-forum-icon` déjà présente dans la ligne arrête la pose).
- L'icône n'est pas une cible : `pointer-events: none`, sous le lien étiré du nom ; `elementFromPoint` sur l'icône rend le lien du forum.
- Heure, texte de `p.mini`, `href` de la flèche, `aria-label` de la flèche : inchangés.
- Ordre DOM natif des lignes gardé ; aucune ligne ajoutée, retirée ou déplacée.
- Fixtures synthétiques seulement, inchangées : `forum-index-rp.html`, `forum-index-communaute.html`, `forum-racine-groupes.html`, `forum-racine.html`, `forum-colonne-native-rp.html`, `sous-forum-debuter.html`. Variantes (entrée désactivée, `img`, `href` absolu, colonne composée, liste retirée) faites en mémoire dans la suite.
- Repères cités par 3 suites (`kr-page-forum-index`, `kr-text-secondary`, `forum-index-communaute`) : jamais écrits en clair dans `forum-activite.mjs` ni dans une 4e suite. `kr-forum-icon`, `lefticon` et `forum-colonne-native-rp` écrits dans `lib/variantes.mjs` seulement (`REPERES_LIGNE_TICKET66`). Relevé `TOKEN_RE` refait sur les suites finies : aucun jeton ne passe de 3 à 4.
- Masques posés sur le bundle de base seulement, si `AVANT_TICKET66(base)`, jamais sur le bundle courant, et seulement si le rouge avant les rend nécessaires. Chaque masque porte sa condition de retrait (inventaire §5.1) : réalignement de la base par le sweep 6.7 ou par l'action A4 de la rétro 5. Jamais « quand le bundle de base contient l'entrée ».
- Chaque contrôle du fragment peut échouer et a une contre-épreuve nommée (Verification).
- Les Ask First ci-dessous sont **tranchés dans le sens prudent par l'implémenteur**, sans attendre : le choix prudent est écrit à côté de chacun, appliqué tel quel et consigné dans `revue-manuelle.md` (section « Ticket 6.6 ») pour Arnaud.

**Ask First:**
1. **Compteurs sur ordinateur (décision 6.1 non confirmée, revue-manuelle l.86 et l.366).** DESIGN veut « N sujets · N messages » en `text-secondary` ; 6.1 a gardé les colonnes Sujets et Messages, alignées sur Msg et Vus du sous-forum, en attente d'Arnaud. Prudent : colonnes gardées, chiffres à droite comme aujourd'hui, **couleur inchangée** (héritée). Aucun « N sujets · N messages » sur ordinateur. Rappel de la question dans `revue-manuelle.md`.
2. **Repli de l'icône.** La ligne native n'a aucune icône : « garder l'icône native » ne peut rien poser. Prudent : URL absente de la liste, liste absente ou entrée sans `span.lefticon` → aucune icône, aucune place réservée, aucun contenu inventé ; la ligne reste. Les noms d'un même groupe peuvent ne pas être alignés si la liste est partielle (constat consigné).
3. **Entrée désactivée de la liste.** Prudent : traitée comme absente (repli), comme les menus (Q3). La ligne n'est pas retirée de l'index (la page native la montre).
4. **Flèche de 34 px.** Prudent : 34 × 34 sur ordinateur seulement, couleurs, bordure, rayon et survol actuels gardés ; le passage au bouton standard (`[ASSUMPTION]` de DESIGN) n'est pas fait. `padding-right: 52px` de la cellule gardé (8 px entre le texte et la flèche, 10 px du bord). Flèche mobile 44 px inchangée.
5. **Écart avec le sous-forum.** 6.1 avait aligné le bureau de l'index sur le sous-forum (`forum-index.mjs` l.523). Prudent : le ticket s'applique à l'index seulement (flèche 34, auteur accent, dernier message à droite) ; le sous-forum ne change pas. Le contrôle l.523 reçoit une exception nommée pour ces trois propriétés (`auteur du dernier message` `color`, `bouton →` `width`/`height`, `cellule du dernier message` `text-align`) ; toute autre divergence reste rouge.
6. **Racine `/forum`.** Prudent : incluse (même classe `kr-page-forum-index`, même module). Son 2e groupe (`forum/hrp/…` absent de la liste RP) sert le cas de repli. `forum-racine.html` (aucune liste) : aucune icône.
7. **Icône image de la liste.** Prudent : `img` cloné avec son `src` d'origine, sans remplacement ni repli (AGENTS.md, icônes : repli sur l'URL d'origine).
8. **Auteur sur mobile.** DESIGN dit `text-accent` sans support ; le ticket ne vise que l'ordinateur. Prudent : mobile inchangé (`--kr-text-primary`, 600).
9. **Graisse du nom** (400 contre 700 de DESIGN, revue-manuelle l.89). Prudent : non touchée.
10. **`span.tagforum`** (D14). Prudent : non touché.
11. **Couleur et taille de l'icône.** Prudent : décorative (`aria-hidden`), `color: var(--kr-text-secondary)`, `font-size` du nom, largeur fixe de 1,25 em centrée, marge droite `var(--kr-space-1)`, sur les deux supports. Aucun contraste exigé (non textuelle et décorative) ; mesuré et consigné quand même.
12. **Seuils et tolérances.** Aucun changé dans les suites existantes. Un seuil ou une tolérance à changer arrête le build et passe à Arnaud.
13. **Contraste de l'auteur.** Si `--kr-text-accent` sur le fond réel de la ligne est < 4,5:1 dans une des 16 variantes, arrêt : pas de nouveau jeton ni de couleur littérale ; passage à Arnaud.
14. **Fixtures.** Prudent : inchangées ; variantes en mémoire.

**Never:**
- Nouvel `!important` ; règle `:focus` ; règle de mobile hors `@media (max-width: 767px)` ; règle d'ordinateur hors `@media (min-width: 768px)` ; règle globale.
- Modifier la liste latérale, les menus des forums, le cœur pur `menus-forums`, `captureForumSidebar`.
- Inventer une icône (glyphe de repli), une case vide, une flèche ou un texte absent du HTML natif. Retirer une ligne.
- Changer l'heure, son format ou sa position dans le texte. Changer le `href` de la flèche.
- Toucher le sous-forum, Staff, le sujet, le mobile hors icône, `span.tagforum`, la graisse du nom.
- « N sujets · N messages » sur ordinateur (Ask First 1).
- Modifier une fixture. Capture HTML brute dans le dépôt.
- Site réel, `/report`, Chrome 9222/9223. Git qui modifie l'arbre, l'index ou le stash sans accord. `test:all` (orchestrateur).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Index RP | `forum-index-rp`, `/forum/rp`, 375, 767, 768, 1280, 1440, 1920 | une `span.kr-forum-icon[aria-hidden]` par ligne, avant le nom, contenant un `i` de même `className` que l'entrée de même chemin (`far fa-comments`, `far fa-gem`, `far fa-flag`, `far fa-handshake`) | base `6ba0838` : aucune icône (rouge) |
| Index Communauté | `forum-index-communaute`, `/forum/communaute`, mêmes largeurs | `far fa-newspaper`, `far fa-smile`, `far fa-folder` | base : rouge |
| HRP, Débats | index RP servi à `/forum/hrp` et `/forum/debats` | mêmes icônes que l'index RP (liens et liste identiques) | — |
| Racine à groupes | `forum-racine-groupes`, `/forum` | 1er groupe : 4 icônes ; 2e groupe (`forum/hrp/…`) : aucune icône, ligne gardée | icône posée dans le 2e groupe : FAIL |
| URL absente, entrée en trop | index RP + `#col-left` de `forum-colonne-native-rp` composés en mémoire | Taverne et Marché : icône ; Royaume et Cadets : aucune ; Monde (sans ligne) : rien ajouté ; 4 lignes dans l'ordre natif | — |
| Entrée désactivée | entrée Marché `.disabled` (puis `aria-disabled="true"`) en mémoire | Marché sans icône, ligne gardée | — |
| Image dans la liste | `span.lefticon > img[src=data:…]` en mémoire sur Taverne | `img` cloné, même `src`, dans `.kr-forum-icon` | — |
| Entrée sans `lefticon`, liste retirée | en mémoire ; `forum-racine.html` | aucune icône, aucune place réservée, aucune erreur | exception : FAIL |
| `href` absolu ou avec `?`/`#` | entrée Taverne `http://www.kraland.org/forum/rp/taverne-10101?x#y` en mémoire | icône posée (même clé normalisée) | — |
| Liste intacte | toutes pages | `outerHTML` de `#col-left .list-group` égal avant et après le module | mutation : FAIL |
| Idempotence | `initForumIndex` rejoué (ou bascule 768 → 767 → 768) | une seule `.kr-forum-icon` par ligne | — |
| Cible | 375 et 767, tactile | `elementFromPoint` au centre de l'icône (après `scrollTo`) rend le lien du nom ; centre de la ligne → forum ; flèche ≥ 44 × 44 → `#msgN` | — |
| Heure | toutes pages, tous supports | texte de `p.mini` égal au texte natif de la fixture (« Hier (13:20) », « Aujourd'hui (09:05) », « 19/10 (21:43) ») | — |
| Forum sans message | Cadets (RP), Archives (Communauté), mobile et ordinateur | aucune flèche ; `td4` sans enfant visible ni pseudo-contenu ; mobile 72 px, texte centré | flèche ou case : FAIL |
| Flèche ordinateur | 768, 1280, 1440, 1920, lignes avec dernier message | `a.btn` 34 × 34 ; bord droit à 10 px (± 1) du bord droit de la ligne ; centré verticalement à 1 px près | base : 32 (rouge) |
| Dernier message à droite | 768 à 1920 | `td4` `text-align: right` ; bord droit du texte de l'auteur et de l'heure à ≤ 8 px (± 1) du bord gauche de la flèche ; compteurs `td2`, `td3` à droite | base : à gauche (rouge) |
| Auteur ordinateur | 1280, Kraland clair et Empire Brun sombre | couleur = `--kr-text-accent` résolu ; 700 ; `--kr-font-detail` | base : `--kr-text-primary` (rouge) |
| Contraste de l'auteur | 1280, 16 variantes, fond effectif de la ligne | ≥ 4,5:1 | < 4,5 : Ask First 13 |
| Mobile hors icône | 375, 767 | auteur `--kr-text-primary` 600, flèche 44, compteurs « N sujets · N messages » égaux à la base masquée | — |
| Peau coupée | `kr-theme-enabled` absent, 375 et 1280 | aucune `.kr-forum-icon` ; `#col-right` identique à la page native | icône posée : FAIL |
| Staff | index RP servi à `/forum/staff` | aucune icône, rendu égal à la base | — |
| Sous-forum | `sous-forum-debuter`, 1280 | flèche 32 px, auteur inchangé, aucune `.kr-forum-icon` | fuite : FAIL |
| Seuils | 767, 768, 769 ; bascule 768 → 767 → 768 → 767 | 767 : icône mobile ; 768/769 : icône, flèche 34, auteur accent ; une icône par ligne à chaque étape | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-ligne-de-forum-icone-lue-dans-la-liste-laterale-forum-sans-m-inventaire.md`.
- `kraland-userscript-template.js` (lignes de `6ba0838`, à revérifier) :
  - l.80-125, cœur pur `menus-forums` : `krForumNormalizePath` (l.94), `krForumIsDisabledEntry` (l.119), lus, non modifiés ;
  - l.3759-3760 : pose de `kr-page-forum-index` (lue) ;
  - l.5672-5733, `ForumIndex:Presentation` : nouvelle fonction `sidebarIcons()` (table chemin → `span.lefticon` de la liste) et `decorateRows(table, icons)` (pose de `span.kr-forum-icon` avant `td:first-child > p:not(.tagforum)`) ; appel dans `initForumIndex()` après `labelRows`. En-tête du module mis à jour (icône, repli).
- `kraland-theme.css`, section « INDEX DU FORUM » (l.14561-14995) :
  - mobile, après la règle du nom l.14791 : règle `… td:first-child > .kr-forum-icon` (`order: 1`, `flex: 0 0 auto`, largeur 1,25 em, `text-align: center`, marge droite `var(--kr-space-1)`, `--kr-text-secondary`, `pointer-events: none`) ;
  - ordinateur, après la règle du nom l.14907 : même règle en `display: inline-block`, `vertical-align: baseline` ;
  - l.14937 : `color: var(--kr-text-accent) !important` (valeur réécrite) ;
  - l.14950 : `text-align: right` ajouté (sans `!important` ; CDP : aucune règle concurrente) ;
  - l.14955 : `width: 34px`, `height: 34px` ; l.14967 : `width`, `height`, `min-width` 34 px (valeurs réécrites) ;
  - commentaire de tête de section (l.14562-14570) et du bloc ordinateur (l.14893) mis à jour.
- Tests :
  - `tests/e2e/forum-activite.mjs` : nouveau fragment `ligne`, base `COMMIT_LIGNE = '6ba0838'` (`KR_SCRIPT_AVANT_LIGNE`) ; masques sur `lignes`, `seuil`, `bureau` (et `fil` si le rouge avant le montre) ; en-tête de la suite (fragments, options, fixtures nommées par `lib/variantes.mjs`) ;
  - `tests/e2e/lib/variantes.mjs` : `REPERES_LIGNE_TICKET66`, `AVANT_TICKET66` (chaîne `kr-forum-icon`), `LIGNE_TICKET66` (miroir CSS), `ligneTicket66` (masque DOM), conditions de retrait en commentaire ;
  - `tests/e2e/cartes-pastilles.mjs` : `lignes` l.632-690, `forum` l.540, `bureau` l.765 (`comparer` l.514) ;
  - `tests/e2e/typographie-formes.mjs` : `echelle-forum` miroir l.1193-1219 ; `espacement` l.1596 si le rouge avant le montre ;
  - `tests/e2e/forum-index.mjs` : exception nommée de l.523 (`ecarts` sur `COMPOSANTS_BUREAU` l.294-310) ;
  - `tests/e2e/lib/router.mjs` : `SUITES` l.98 (fragment `['ligne']`), `KEYWORDS` l.154-215 ;
  - `tests/e2e/lib/router.test.mjs` : cas nouveaux ;
  - `tests/e2e/durations.json` : durée du fragment (facultative) ;
  - `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` : ligne « Activité du forum » (icône, fragment `ligne`, masques `LIGNE_TICKET66` et `ligneTicket66`).
- `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` : section « Ticket 6.6 ».

## Tasks & Acceptance

**Execution:**
- [ ] Rouge avant. `mkdir -p /tmp/kr66 && git show 6ba0838:kraland-userscript-main.user.js > /tmp/kr66/base.user.js`. Écrire le fragment `ligne` d'abord, puis `KR_SCRIPT=/tmp/kr66/base.user.js KR_FRAG=ligne node tests/e2e/forum-activite.mjs`. `kr-theme-enabled` vérifié avant toute mesure. FAIL et verts attendus en Verification.
- [ ] `tests/e2e/forum-activite.mjs`, fragment `ligne`, sur les pages et cas de la matrice ; 375, 767 (tactile), 768, 769, 1280, 1440, 1920 ; Kraland clair et Empire Brun sombre ; 16 variantes pour le contraste :
  - icône par ligne, `className` ou `src` égal à l'entrée de même chemin ; aucune icône sans entrée active ; `aria-hidden` ;
  - liste latérale intacte (`outerHTML` avant/après) ; idempotence (`initForumIndex` rejoué par la bascule) ;
  - `elementFromPoint` sur l'icône et au centre de la ligne → lien du forum ; flèche mobile ≥ 44 × 44 → `#msgN` ;
  - heure égale au texte natif ; forum sans message sans flèche ni contenu dans `td4` ;
  - ordinateur : flèche 34 × 34 à 10 px du bord, texte du dernier message à droite, compteurs à droite, auteur `--kr-text-accent` (jeton résolu) ; contraste ≥ 4,5:1 sur le fond effectif (`CONTRASTE()`) ;
  - mobile : auteur, flèche, compteurs égaux à la base masquée ;
  - peau coupée : aucune icône, `#col-right` natif ; Staff et sous-forum inchangés ;
  - seuils 767/768/769, bascule 768 → 767 → 768 → 767 (`ECART_RECHARGEMENT_MS`).
  Réseau confiné, Bootstrap du vendor, repères importés de `lib/variantes.mjs`.
- [ ] `kraland-userscript-template.js`, `ForumIndex:Presentation` :
  - `sidebarIcons()` : `Map` chemin normalisé → `span.lefticon`, sur `#col-left .list-group > a.list-group-item[href]` hors `.kraland-metrics`, entrées désactivées exclues ;
  - `decorateRows(table, icons)` : pour chaque `tbody > tr`, lien `td:first-child > p:not(.tagforum) > a[href]` ; si la clé existe et que la ligne n'a pas de `.kr-forum-icon`, insérer avant le `p` une `span.kr-forum-icon` (`aria-hidden="true"`) avec les enfants clonés de la `span.lefticon` (par `cloneNode`, pas d'`innerHTML`) ;
  - appel dans `initForumIndex()` après `labelRows`, pour chaque tableau ;
  - en-tête du module mis à jour.
- [ ] `kraland-theme.css` : règles d'icône mobile et ordinateur ; réécritures l.14937, l.14950, l.14955, l.14967 ; commentaires de section ; CDP au build sur l'auteur, la flèche, `td4`, l'icône (règle gagnante, aucune règle `!important` concurrente sur `.kr-forum-icon` ou son `i`) ; `grep -c '!important'` ≤ 3290.
- [ ] `tests/e2e/lib/variantes.mjs` : `REPERES_LIGNE_TICKET66` (classe, `lefticon`, sélecteur de la liste, fixture `forum-colonne-native-rp.html`, chemins), `AVANT_TICKET66`, `LIGNE_TICKET66`, `ligneTicket66`, conditions de retrait. `AVANT_TICKET66` vérifié sur chaque base citée (`git show <sha>:kraland-userscript-main.user.js | grep -c kr-forum-icon` = 0).
- [ ] Masques sur la base, seulement là où le rouge avant les rend nécessaires (inventaire §5.1) : `forum-activite` (`lignes`, `seuil`, `bureau`, `fil`), `cartes-pastilles` (`lignes`, `forum`, `bureau`), `typographie-formes` (`echelle-forum`, `espacement`). Pour chaque masque : rouge sans lui, vert avec lui ; ligne `info écart accepté et consigné` sur le modèle de 6.5.
- [ ] `forum-index.mjs` l.523 : exception nommée (Ask First 5), limitée aux trois propriétés ; contre-épreuve : une 4e propriété mutée reste rouge.
- [ ] Suites existantes après le 1er `test:zone` : `forum-mobile`, `jeu-identite`, `palette-nation`, `menus-forums`, `sous-forum`. Vert attendu sans retouche ; une retouche va au Plan Change Log ; un seuil ou une tolérance → arrêt (Ask First 12).
- [ ] `tests/e2e/lib/router.mjs` : `SUITES`, fragment `['ligne']` ajouté à `forum-activite` ; `KEYWORDS`, `[/kr-forum-icon/, ['forum-activite', 'cartes-pastilles', 'typographie-formes']]` avec commentaire (épopée 6, entrée 6) ; cas dans `router.test.mjs` (hunk CSS `.kr-forum-icon`, hunk du module `ForumIndex:`, fragment `ligne`) ; `npm run test:router`.
- [ ] Skill `tester-kraland-css` : ligne « Activité du forum » dans les deux copies ; `diff -r .hermes/skills .claude/skills` vide.
- [ ] `revue-manuelle.md`, section « Ticket 6.6 » : Ask First tranchés (choix prudent de chacun), rappel de la question des compteurs (Ask First 1).
- [ ] `npm run build`, contre-épreuves, `lint:css`, `lint:js`, compte `!important`, relevé `TOKEN_RE`.

**Acceptance Criteria:**
- Given l'index RP, l'index Communauté et le 1er groupe de la racine, when la page est prête avec la peau, then chaque ligne porte avant son nom une `.kr-forum-icon[aria-hidden]` qui contient le clone de l'icône de l'entrée de même chemin dans la liste latérale.
- Given une URL absente de la liste, une entrée désactivée, une entrée sans `lefticon` ou une liste absente, then la ligne n'a aucune icône, aucune place réservée, et reste à sa place.
- Given n'importe quelle page de l'index, then la liste latérale est inchangée et chaque ligne a au plus une icône, y compris après la bascule 768 → 767 → 768.
- Given 375 et 767 px en tactile, then le centre de l'icône et le centre de la ligne mènent au forum, la flèche fait ≥ 44 × 44 et mène à `#msgN`, et le reste de la ligne est égal à la base masquée.
- Given toutes les largeurs, then l'heure du dernier message est le texte natif et un forum sans message n'a ni flèche ni contenu dans sa cellule.
- Given 768, 769, 1280, 1440 et 1920 px, then la flèche fait 34 × 34 à 10 px du bord droit, l'auteur et l'heure sont alignés à droite contre la flèche, les compteurs sont à droite, l'auteur est en `--kr-text-accent`.
- Given 16 variantes à 1280 px, then l'auteur est ≥ 4,5:1 sur le fond de la ligne.
- Given la peau coupée, then aucune `.kr-forum-icon` et `#col-right` identique à la page native ; given Staff et le sous-forum, then rendu inchangé.
- Given `forum-index`, `cartes-pastilles`, `typographie-formes`, `palette-nation`, `jeu-identite`, `forum-mobile`, `menus-forums`, `sous-forum`, then verts ; les masques ne sont posés que sur la base ; l'exception de `forum-index` l.523 ne couvre que les trois propriétés nommées.
- Given `kraland-theme.css`, then `grep -c '!important'` ≤ 3290.
- Given `npm run test:router`, then vert ; aucun jeton de `TOKEN_RE` ne passe de 3 à 4 suites ; `diff -r .hermes/skills .claude/skills` vide.

## Implementation Notes

**Produit.**
- `kraland-userscript-template.js`, module `ForumIndex:Presentation` : ajout de `pathKey`, `sidebarIcons()` et `decorateRows()`.
  - Lecture de `#col-left .list-group > a.list-group-item[href]`, hors `.kraland-metrics`.
  - Entrées désactivées exclues par `krForumIsDisabledEntry`.
  - Clé : `krForumNormalizePath` sur le chemin de `new window.URL(href, document.baseURI)`.
  - Chaque ligne reçoit une `span.kr-forum-icon[aria-hidden="true"]`, posée avant le `p` du nom. Elle contient un clone du premier élément de la `span.lefticon` (`i` ou `img`), sans nœud texte, `id` retiré du clone et de ses descendants (revue, constat 5).
  - Garde d'idempotence : une ligne qui a déjà son icône n'en reçoit pas d'autre.
  - Le module reste gardé par `kr-page-forum-index`.
  - Le commentaire de l'icône est placé au-dessus de `pathKey`, pas dans l'en-tête du module. Avec plus de 12 lignes, `templateSections` ne voit plus la section : le routeur perdait `MODULE : ForumIndex:`.
- `kraland-theme.css` :
  - mobile : icône `order: 1`, `flex: 0 0 auto`, 1,25 em, `--kr-text-secondary`, `pointer-events: none` ;
  - ordinateur : icône en `inline-block` ;
  - ordinateur, auteur : passe de `--kr-text-primary` à `--kr-text-accent` (déclaration existante modifiée) ;
  - ordinateur, `td4` : `text-align: right` ;
  - ordinateur, flèche : passe de 32 à 34 px (groupe et `a.btn`, déclarations existantes modifiées).
  - Toutes les règles sont dans leur `@media` respectif, sous la garde `:where(html.kr-page-forum-index)`. `!important` : 3290 avant, 3290 après.

**Suites.**
- `tests/e2e/lib/variantes.mjs` contient 4 ajouts :
  - `REPERES_LIGNE_TICKET66` : classes, fixtures, accent, détail, icônes par chemin ;
  - `AVANT_TICKET66` ;
  - `LIGNE_TICKET66` : feuille miroir ;
  - `ligneTicket66()` : script DOM miroir.
- `tests/e2e/forum-activite.mjs`, nouveau fragment `ligne` (base `6ba0838`, `KR_SCRIPT_AVANT_LIGNE`) : index × 375/767/768/1280/1440/1920 × 2 variantes ; pages dérivées en mémoire × 375/1280 ; contraste dans 16 variantes ; mobile égal à la base masquée ; peau coupée ; Staff et sous-forum ; seuils ; bascule. Masque `ligne66` posé sur la base aux fragments `seuil`, `bureau`, `fil` et à la bascule.
- `tests/e2e/forum-index.mjs` :
  - exception nommée `EXCEPTION_TICKET66`, limitée au contrôle bureau « même rendu que le sous-forum » ;
  - `ATTENDU.bureau.fleche` passe de 32 à 34.
- `tests/e2e/cartes-pastilles.mjs` : masque sur le fragment `lignes`.
- `tests/e2e/typographie-formes.mjs` : masque sur `echelle-forum` et `nettoyage`.
- `tests/e2e/lib/router.mjs` :
  - `SUITES` : fragment `['ligne']` ajouté à forum-activite ;
  - `KEYWORDS` : `/kr-forum-icon/` route vers forum-activite, cartes-pastilles et typographie-formes.
- `tests/e2e/lib/router.test.mjs` : 1 cas (fragment, hunk CSS, hunk du module).
- Skill `tester-kraland-css` : ligne « Activité du forum » mise à jour dans les 2 copies.

**Rouge avant** (base `6ba0838` : `KR_SCRIPT=/tmp/kr66/base.user.js KR_FRAG=ligne node tests/e2e/forum-activite.mjs`, exit 1) : 175 FAIL et 199 ok.
- Rouges :
  - icône par ligne : 72 FAIL, aucune `.kr-forum-icon` ;
  - flèche : 40 FAIL, 32 × 32 ;
  - dernier message : 40 FAIL, `text-align: start`, auteur en `rgb(15, 23, 36)` au lieu de l'accent ;
  - contraste : 16 FAIL, rouges par la couleur ;
  - seuils 767/768/769 et bascule : 7 FAIL.
- Verts sur la base, comme attendu :
  - liste latérale intacte, heure native, aucune exception ;
  - forum sans message ;
  - cibles mobiles et flèche de 44 ;
  - repli sans icône (sans liste, racine nue) ;
  - peau coupée ;
  - Staff, sous-forum, mobile hors icône.

**Vert après** (bundle courant, `KR_FRAG=ligne`) : exit 0, 388 ok après revue (381 au premier build). Les fragments masqués sont verts :
- `forum-activite` : `seuil`, `bureau`, `fil` ;
- `cartes-pastilles` : `lignes` ;
- `typographie-formes` : `echelle-forum`, `nettoyage` ;
- `forum-index` : `bureau`, `seuil`.

Zones finales : `npm run test:zone -- forum-activite cartes-pastilles typographie-formes palette-nation forum sous-forum menus-forums`, exit 0, 10894 ok, 0 FAIL (après revue ; 10887 au premier build) (`forum` couvre forum-index, forum-mobile et jeu-identite). `npm run test:router` : exit 0, 103 ok. `lint:css` : exit 0. `lint:js` : exit 0 (1 warning existant, `report-non-lu.mjs`). `!important` : 3290. Relevé `TOKEN_RE` : 0 franchissement. `diff -r .hermes/skills .claude/skills` : vide.

**Contre-épreuves** (bundle muté hors dépôt, `KR_SCRIPT`, `KR_FRAG=ligne` sauf mention). Chaque ligne donne le contrôle rouge nommé :
- appel de `decorateRows` retiré : « ligne rp kraland 375 px : une icône de la liste latérale par ligne… » (79 FAIL) ;
- clé sans `krForumNormalizePath` (href brut) : « ligne absolu empire-brun-dark 375/1280 px : une icône… » (2 FAIL) ;
- filtre `krForumIsDisabledEntry` retiré : « ligne desactiveeClasse / desactiveeAria … : une icône… » (4 FAIL) ;
- glyphe générique `far fa-comments` en repli : « ligne racine kraland 375 px : une icône… » (2e groupe) et pages dérivées sans entrée (24 FAIL) ;
- `img` remplacé par un `i` : « ligne image empire-brun-dark 375/1280 px : une icône… » (2 FAIL) ;
- original déplacé au lieu de cloné : « ligne rp kraland 375 px : liste latérale intacte… » (72 FAIL) ;
- garde d'idempotence retirée et décoration appelée deux fois : « ligne rp kraland 375 px : une icône… » (79 FAIL) ;
- `pointer-events: none` retiré, `position: relative; z-index: 2` sur l'icône : « ligne image empire-brun-dark 375 px : centre de l'icône et de la ligne -> forum… », « « Taverne » icône -> null » (1 FAIL) ;
- garde `kr-page-forum-index` retirée du module : « ligne peau coupée /forum/rp 375 px et 1280 px : aucune icône, #col-right égal au bundle de base peau coupée » (4 FAIL) ;
- garde `:where(html.kr-page-forum-index)` retirée de la règle ordinateur du `a.btn` : « ligne /forum/staff empire-brun-dark 1280 px : aucune icône, empreinte du contenu égale au bundle de base » (1 FAIL) ;
- flèche 34 → 32 : « ligne rp kraland 768 px : bouton → de 34 x 34 à 10 px… » (45 FAIL) ;
- `right` 10 → 4 : même contrôle, plus « dernier message à droite (texte à 8 px ± 1 de la flèche)… » (80 FAIL) ;
- `text-align: right` retiré : « ligne rp kraland 768 px : dernier message à droite… » (40 FAIL) ;
- auteur en `--kr-text-primary` : « dernier message à droite… auteur en couleur d'accent… » et 16 « ligne contraste rp … » (61 FAIL) ;
- auteur en gris clair `#d0d0d0` : mêmes contrôles et 16 contrastes rouges (61 FAIL) ;
- texte de `p.mini` remplacé : « ligne rp kraland 375 px : liste latérale intacte…, heure native… » (156 FAIL) ;
- graisse de l'auteur 700 → 400 : `forum-index` `bureau`, « [kraland] /forum/rp 1440 : même rendu que le sous-forum (…) » (« Taverne : graisse 400 ») et 11 autres FAIL. Une 4e propriété hors de l'exception reste donc rouge ;
- masques désactivés (`AVANT_TICKET66` rendu faux, restauré ensuite, fichier identique par `cmp`) :
  - `cartes-pastilles` `lignes` : 12 FAIL, « lignes index-rp kraland 375 px : hauteur, retraits… » ;
  - `typographie-formes` : 12 FAIL, `echelle-forum` 6 et `nettoyage` 6 ;
  - `forum-activite` : 23 FAIL, `seuil` 4, `bureau` 12, `fil` 6, bascule 1.
- Après revue (constats 1, 2 et 5), bundle reconstruit :
  - `color: var(--kr-text-secondary)` retiré des deux règles de l'icône : « ligne rp kraland 768 px : une icône… », « « Taverne » couleur rgb(51, 51, 51) (glyphe …) au lieu de rgb(99, 106, 119) » (53 FAIL, tous sur ordinateur) ;
  - `font-size` de `.kr-forum-icon` passé à 12px (mobile et ordinateur) : « ligne rp kraland 375 px : une icône… », « « Taverne » glyphe de 12px au lieu de 15px (taille du nom) » (83 FAIL) ;
  - retour au clonage de tous les `childNodes` de `span.lefticon` : « ligne espacesId empire-brun-dark 375 px : une icône… », « « Taverne » contenu ["#3","I.far fa-comments","#3"] au lieu de I.far fa-comments » (2 FAIL) ;
  - retrait de `id` supprimé : « ligne espacesId empire-brun-dark 375 px : une icône… », « « Taverne » 1 id dans l'icône clonée » (2 FAIL) ;
  - mutants rejoués sur le nouveau clonage : appel de `decorateRows` retiré (83 FAIL), href brut (2), filtre des désactivées retiré (4), glyphe générique (26), `img` remplacé (4), glyphe déplacé (78, « liste latérale intacte »), idempotence (83), garde du module (4).
- Mutations équivalentes (restent vertes ; pourquoi) :
  - `color: var(--kr-text-secondary)` retiré de la seule règle mobile de l'icône : vert. Sur mobile, la ligne donne déjà `--kr-text-secondary` à l'icône par héritage (couleur du glyphe mesurée égale au jeton résolu). La déclaration est gardée : elle fixe la couleur même si la couleur héritée change ;
  - `flex: 0 0 auto` retiré de l'icône mobile : vert sur `ligne` et `lignes`, même avec un nom de 180 caractères (page dérivée `nomLong`, contrôle de largeur 1,25 em ajouté). Le nom a une base de 0 (`flex: 1 1 0`) et la rangée passe à la ligne (`flex-wrap: wrap`) : l'icône n'est jamais rétrécie. La déclaration est gardée pour l'intention ;
  - règle mobile de l'icône sortie du `@media (max-width: 767px)` (posée en global en fin de feuille) : vert sur `ligne`, `seuil`, `bureau` et `forum-index` `bureau,seuil`. Sur ordinateur, la cellule n'est pas un conteneur flex : `order` et `flex` sont sans effet. `line-height: 1.3` sur une icône `inline-block` ne change pas la boîte de ligne. Le reste est redéfini à l'identique par la règle ordinateur.

## Plan Change Log

- **Exception de `forum-index` : groupe du bouton → ajouté.** Le plan nommait 3 propriétés. Le contrôle mesure aussi le groupe (`groupe du bouton →`) : 34 px de large et de haut, centrage à `translateY(-17px)` au lieu de -16. L'exception couvre donc `width`, `height` et `transform` du groupe. Toute autre propriété reste rouge (contre-épreuve sur la graisse). L'entrée `'cellule du dernier message': ['text-align']` du premier build est retirée (revue, constat 3) : `COMPOSANTS_BUREAU` ne mesure de cette cellule que `position` et `padding-right` ; l'alignement à droite est vérifié par le fragment `ligne`.
- **`ATTENDU.bureau.fleche` passe de 32 à 34** dans `forum-index.mjs`. La valeur attendue suit le ticket, sans changement de tolérance.
- **Masques posés seulement là où la base diverge.**
  - Sans masque, les fragments suivants sont verts : `cartes-pastilles` `forum` et `bureau`, `forum-activite` `lignes`, `typographie-formes` `espacement`. Aucun masque n'y est posé.
  - Les masques sont posés sur la base seulement, avec une condition de retrait (sweep 6.7 ou action A4 de la rétro 5). Ils couvrent : `cartes-pastilles` `lignes`, `typographie-formes` `echelle-forum` et `nettoyage`, `forum-activite` `seuil`, `bureau`, `fil` et bascule.
- **Peau coupée.** Le contrôle compare `#col-right` au bundle de base peau coupée, et non au HTML servi. Sans la peau, à 375 px, le script pose `style="padding-left: 0px !important; padding-right: 0px !important;"` sur `#col-right`, avant comme après le ticket. La page sans script n'est donc pas la référence. Le contrôle « aucune icône » ne change pas.
- **Page dérivée `nomLong` et contrôle de largeur de l'icône (1,25 em)** : ajoutés pour éprouver `flex: 0 0 auto`, qui reste une mutation équivalente (voir Implementation Notes).
- **Routeur.** Avec le mot-clé générique `forum`, un hunk CSS `.kr-forum-icon` route aussi vers `forum` (forum-index) : le cas de `router.test.mjs` l'attend.
- **Revue (constats 1, 2, 3 et 5 ; le 4 est écarté).**
  - Fragment `ligne` : le contrôle d'icône vérifie la couleur de la `span` et du glyphe cloné contre `--kr-text-secondary` résolu (`REPERES_LIGNE_TICKET66.secondaire`, sonde), la taille de police du glyphe contre celle du nom, et l'absence d'`id`, sur mobile et sur ordinateur (seuils et bascule compris).
  - Nouvelle page dérivée `espacesId` : glyphe entouré de retours à la ligne et porteur d'un `id` dans `span.lefticon` ; attendu : un seul enfant, aucun `id`.
  - Produit et `ligneTicket66` : clone du premier élément de `span.lefticon` seulement, `id` retiré.
  - `EXCEPTION_TICKET66` : entrée `text-align` de la cellule retirée.
  - Condition morte `|| page === 'racineNue'` retirée du contrôle « forum sans message » (la racine nue sort avant).
- **Peau coupée : course du harnais sur les infobulles (FAIL sous `test:all`).** Sous `test:all` (concurrence 16), « ligne peau coupée /forum/rp 375 px » a échoué deux fois, au caractère 430. Le 1280 px restait vert.
  - Première correction, fausse et retirée : `colonne()` attendait 300 ms sans mutation de `#col-right`. Le FAIL est revenu au même caractère. La lecture immédiate est rétablie.
  - Extraits complets (JSON) : l'un des deux bundles garde sur `a[href="forum"]` et les flèches `data-toggle="tooltip" data-placement="bottom" title="" data-original-title="…"` (natifs de la fixture), l'autre les a retirés. Le côté perdant change d'un échec à l'autre (base au premier, testé au second).
  - Cause : la suite injecte le script à l'apparition de `<body>`. Peau coupée, `observeTooltips` pose alors un observateur sur `<body>` ; `disableTooltips` ne retire les infobulles qu'avec `body.mobile-mode`, posé seulement au `DOMContentLoaded` (`initMobileMode`). Les attributs partent si la dernière insertion du parseur est livrée à l'observateur après ce `DOMContentLoaded`, et restent sinon. C'est une course du harnais, sans lien avec le ticket : avec `@run-at document-start`, `<body>` n'existe pas encore et l'observateur n'est pas posé, donc les infobulles natives restent.
  - Reproduction à la demande : un écouteur `DOMContentLoaded` vide en capture, posé avant le script et sur la base seule, fait perdre la course à la base. En injection `body`, on obtient le même FAIL à 375 px, au caractère 430 ; le 1280 px reste vert.
  - Correction : ce contrôle injecte au début du document (`debut: true`, comme `@run-at document-start`), des deux côtés. La tolérance et l'objet comparé (`outerHTML` de `#col-right` et nombre d'icônes) ne changent pas. Le message d'écart sort les deux extraits avec `JSON.stringify`. Avec le même écouteur forcé, le contrôle reste vert en injection début.
  - Contre-épreuves : un bundle muté hors dépôt pose `data-kr-mute` sur `#col-right`, de façon synchrone et peau coupée. Il donne 2 FAIL (375 px au caractère 37, 1280 px au caractère 36), et le style en ligne de 375 px reste présent. La garde du module retirée reste rouge (4 FAIL, « icônes »).
  - Sous la charge qui reproduisait l'échec (2 × `run.mjs zone palette-nation` en parallèle de `run.mjs zone forum-activite`), deux tours donnent exit 0, 889 ok, 0 FAIL. Avant la correction, la même charge donnait 888 ok et 1 FAIL au caractère 430.
- **`new window.URL`** (template et `ligneTicket66`) au lieu de `new URL` : `no-undef` d'ESLint. C'est la forme déjà employée par le cœur pur.

## Design Notes

**Pourquoi lire la liste dans le module de l'index.** `destinationKey`, `labelOf` et `DECORATIONS` sont privés à l'IIFE des menus (l.4535-4760). Les exporter changerait le module des menus (Never). Le cœur pur expose déjà `krForumNormalizePath` et `krForumIsDisabledEntry`, qui suffisent : même clé, même règle d'accès que les menus.

**Pourquoi au moment du module et non dans `captureForumSidebar`.** La capture des menus ne garde que des libellés et des chemins, pas les icônes. Les transformations de la peau qui tournent avant la file (`applyDOMTransformations`) ne réécrivent pas `span.lefticon` des forums (relevé §1.4). À vérifier au build : `outerHTML` de la liste avant le module égal à la fixture. Sinon, arrêt et Plan Change Log.

**Pourquoi aucune icône de repli.** Le ticket dit « repli sur l'icône native » ; la ligne native n'en a pas (§1.1). Poser un glyphe générique serait inventer un contenu (Never de 6.1). Le repli est donc la ligne native.

**Pourquoi l'icône dans `td1` et pas dans le lien.** Dans le lien, l'icône hériterait du soulignement au survol et de la couleur du nom, et changerait le texte accessible. Hors du lien, dans `td1` en `display: contents` sur mobile, elle devient un élément flex de la ligne, placé par `order: 1` avant le nom (même `order`, ordre DOM).

**Pourquoi `text-align: right` sur `td4`.** C'est la seule déclaration qui aligne auteur et heure contre la flèche sans déplacer la flèche absolue ni changer `padding-right`. Les colonnes restent celles de 6.1.

**Pièges :**
- P1 : sur mobile, une icône sans `flex: 0 0 auto` rétrécit ou passe seule sur une rangée : la ligne passe de 3 à 4 rangées et `lignes` rougit même masqué.
- P2 : `cartes-pastilles` `lignes` compte les `i` de la ligne (`egal.icones`) : le masque DOM doit poser exactement le même `i`, à la même place, sur la base.
- P3 : `typographie-formes` `echelle-forum` compare le **nombre** d'éléments de `#col-right` : le masque DOM est indispensable, la feuille miroir seule ne suffit pas.
- P4 : `href` relatif des fixtures (`forum/rp/…`) et `document.baseURI` : passer par `new URL(href, document.baseURI)` des deux côtés, sinon aucune clé ne correspond.
- P5 : `ForumIndex:Presentation` peut tourner deux fois sur une bascule sans rechargement : garde d'idempotence par ligne.
- P6 : `--kr-text-accent` est clair dans les variantes sombres ; le fond de la ligne sur ordinateur est celui du panneau (`--kr-bg-surface`), pas celui de la page : mesurer le fond effectif.
- P7 : la flèche passe à 34 px : la hauteur de ligne peut grandir de 2 px à 768 px (texte sur une rangée) ; `bureau` de `cartes-pastilles` le voit, d'où le masque CSS.
- P8 : `forum-index-communaute`, `kr-page-forum-index`, `kr-text-secondary` sont déjà à 3 suites : un seul littéral dans `forum-activite.mjs` les rend transverses et casse le routage.
- P9 : `page.clock` casse `requestAnimationFrame` ; `addInitScript` tourne avant `<html>` (masque DOM par `MutationObserver`, sur le modèle de `plusTicket65`).

## Verification

**Commands:**
- `npm run build`.
- `npm run test:zone -- forum-activite cartes-pastilles typographie-formes palette-nation forum sous-forum` (`forum` lance `forum-index`, `forum-mobile`, `jeu-identite`).
- `npm run test:zone -- menus-forums` (la liste latérale est lue).
- `npm run test:router`.
- `npm run lint:css` puis `npm run lint:js`, codes de sortie lus séparément.
- `grep -c '!important' kraland-theme.css` ≤ 3290.
- `diff -r .hermes/skills .claude/skills` vide.
- Relevé `TOKEN_RE` des suites (script hors dépôt, sur le modèle de `/tmp/kr66/tok.mjs`) : aucun jeton de 3 à 4.
- Pas de `test:all` : il revient à l'orchestrateur.
- Rouge avant sur le bundle de `6ba0838` (`KR_SCRIPT=/tmp/kr66/base.user.js`, `KR_FRAG=ligne`). FAIL attendus :
  - icône par ligne : aucune `.kr-forum-icon` (index RP, Communauté, racine 1er groupe, colonne composée, `img`, `href` absolu) ;
  - flèche ordinateur 32 × 32 au lieu de 34 × 34 (768 à 1920) ;
  - auteur `--kr-text-primary` au lieu de `--kr-text-accent` ;
  - texte du dernier message à gauche de la cellule ;
  - contraste de l'auteur : mesure faite sur la couleur attendue, rouge par la couleur (à noter : le contraste seul peut être vert sur la base).
- Verts attendus sur la base (non-régression) : repli sans icône (URL absente, désactivée, sans `lefticon`, liste absente), liste intacte, heure native, forum sans message, flèche mobile 44, cibles mobiles, peau coupée, Staff, sous-forum, idempotence, mobile hors icône.
- Contre-épreuves sur copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - appel de `decorateRows` retiré : « icône par ligne » rouge ;
  - clé sans `krForumNormalizePath` (href brut) : « `href` absolu » rouge ;
  - filtre `krForumIsDisabledEntry` retiré : « entrée désactivée » rouge ;
  - repli muté en glyphe générique (`fa-comments`) : « URL absente » et « racine 2e groupe » rouges ;
  - `img` remplacé par un `i` : « image dans la liste » rouge ;
  - original déplacé au lieu de cloné : « liste intacte » rouge ;
  - garde d'idempotence retirée et module appelé deux fois : « une seule icône » rouge ;
  - `pointer-events: none` retiré et `z-index: 2` sur l'icône : « cible » rouge ;
  - garde `kr-page-forum-index` retirée du module et classe posée sans peau : « peau coupée » rouge ;
  - garde `:where(html.kr-page-forum-index)` retirée d'une règle ordinateur : « sous-forum » rouge (flèche 34 au sous-forum) ;
  - flèche 34 → 32 : « flèche ordinateur » rouge ; `right` 10 → 4 : « 10 px du bord » rouge ;
  - `text-align: right` retiré : « dernier message à droite » rouge ;
  - auteur remis en `--kr-text-primary` : « auteur » rouge ; auteur muté en gris clair : contraste rouge dans au moins une variante ;
  - texte de `p.mini` remplacé : « heure » rouge ;
  - règle d'icône mobile sortie du `@media (max-width: 767px)` : seuil 768 ou bureau rouge ;
  - `flex: 0 0 auto` retiré de l'icône mobile : `lignes` (3 rangées) rouge à 375 ;
  - chaque masque retiré : la suite masquée rouge ; exception l.523 de `forum-index` élargie à une 4e propriété mutée : rouge.
- Largeurs : 375×667, 767, 768, 769, 1280, 1440, 1920 ; bascule dans le même onglet. Variantes : Kraland clair et Empire Brun sombre, 16 variantes pour le contraste.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667 et 1280, 1440, 1920 px, clair et sombre : index RP, Communauté, racine à groupes, colonne composée.
- Arnaud relit les Ask First tranchés (prudents) dans `revue-manuelle.md`, dont la question 1 (compteurs sur ordinateur).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | forum-activite.mjs:1530, :1586 | La couleur de l'icône est relevée sans jamais être vérifiée, et elle est lue sur la `span`, pas sur le glyphe | fondé | patch (fixed) | `icone()` ne lit pas `i.couleur` : retirer `color: var(--kr-text-secondary)` laisse `ligne` vert (Ask First 11) |
| 2 | quick | forum-activite.mjs:1586-1595 | La taille de l'icône n'est jamais comparée à celle du nom | fondé | patch (fixed) | Le contrôle ne compare l'icône qu'à sa propre police : un `font-size` changé sur `.kr-forum-icon` reste vert dans `ligne` |
| 3 | quick | forum-index.mjs:325 | L'entrée `text-align` de `EXCEPTION_TICKET66` ne sert à rien | fondé | patch (fixed) | Le composant ne compare que `position` et `padding-right` (l.309) ; l'exception et `revue-manuelle.md` annoncent 4 points |
| 4 | quick | template:5707 | `pathKey` ne garde que le `pathname` et ignore l'origine | écarté | — | Le plan demande `pathname` seul ; un lien d'un autre hôte dans la liste latérale est improbable sur Kraland |
| 5 | quick | template:5730 | Tous les `childNodes` de `span.lefticon` sont clonés, nœuds texte et `id` compris | fondé | patch (fixed) | Une liste réelle avec espaces ou `id` donnerait un `id` en double ou un glyphe décalé ; cloner le seul élément, sans `id` |

## Result

Construit. Sur l'index du forum, sur les deux supports, chaque ligne porte l'icône de son forum, prise dans la liste latérale native par correspondance de chemin. La liste n'est jamais modifiée : le premier élément de l'icône est cloné, sans `id`. Les entrées désactivées et les URL absentes de la liste ne reçoivent aucune icône. L'heure native ne change pas, et un forum sans dernier message n'a ni flèche ni case vide. Sur ordinateur, le dernier message est aligné à droite, l'auteur prend `--kr-text-accent` (au moins 4,5:1 dans les 16 variantes) et la flèche passe à 34 px. Les compteurs restent en colonnes (Ask First 1, à confirmer par Arnaud). Rien ne change sans `kr-theme-enabled`. `!important` reste à 3290. Revue quick indépendante : 5 constats, 4 corrigés, 1 écarté (reporté dans `deferred-work.md`). Deux FAIL du `test:all`, au caractère 430, venaient d'une course du harnais sur les infobulles en peau coupée mobile : le contrôle injecte désormais au début du document, et le risque voisin est reporté au sweep 6.7. `test:all` vert : 13667 ok, 0 FAIL.
