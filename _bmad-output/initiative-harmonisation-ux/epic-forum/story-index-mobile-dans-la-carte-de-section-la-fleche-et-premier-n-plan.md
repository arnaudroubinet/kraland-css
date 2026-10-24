---
title: 'Index mobile dans la carte de section ; la flèche et « premier non lu » mènent au message'
type: 'feature'
ticket: '2'
created: '2026-10-25'
status: 'built'
baseline_revision: '0523d7fb5893686272ec0755fefe63ba1a0d52b4'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/tickets.toml'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-l-index-du-forum-reprend-la-presentation-du-sous-forum-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/review-faisabilite.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/notes-implementation.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, l'index du forum est déjà dans la carte de section (5.2). La flèche fait déjà 44 px et toute la ligne ouvre le forum. Deux défauts restent :

- **Hauteur.** Un forum sans dernier message mesure 64,7 px, sur l'index et sur la racine. DESIGN › Ligne de forum demande au moins 72 px.
- **Ancres (H10).** La flèche « dernier message » de l'index et le titre « premier non lu » du sous-forum mènent à `forum/sujet/…#msgNNN`. Le correctif d'ancres du template (l.2882-2907) efface tout hash autre que `#top` et remonte en haut de page, si `innerWidth < 768` quand le script est évalué. En émulation (largeur 375 à l'évaluation), le joueur arrive donc en haut du sujet, même peau coupée. Sur un vrai téléphone, la largeur vaut 981 à ce moment : le correctif ne fait rien, et le joueur arrive sur le message. Le comportement dépend de l'appareil (inventaire §1.1, §1.2).

**Approach:** Balle traçante de l'épopée 6 :

- **Correctif d'ancres.** Il est réduit à son but déclaré : la condition ne vise plus que `#flap`, et garde le test de largeur, sans lequel le bureau perdrait l'ouverture native du mini-chat (§1.3). Un `#msg…` n'est donc plus jamais touché, quelle que soit la largeur lue à l'évaluation.
- **Ligne d'index.** Elle reçoit `min-height: 72px` et `align-content: center`. Les deux déclarations sont ajoutées dans la règle d'origine (l.14701), sans `!important`.
- **Nouvelle suite.** `tests/e2e/forum-activite.mjs`, propre à l'épopée, avec sa zone dans le routeur. Elle prouve les deux parcours (flèche, premier non lu) dans les deux états d'injection (981 et 375), les lignes, les seuils et le bureau.
- **Masque.** `cartes-pastilles.mjs`, qui compare les hauteurs de ligne à une base figée, reçoit un masque. Sa condition de retrait nomme un événement à venir.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi (§1 mesures, §2 règles, §4 assertions). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire la règle d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau : le compte reste 3292. Les deux déclarations ajoutées l.14701 sont sans `!important`. Vérifier par CDP (règles appliquées à `tr`) qu'aucune règle ne les bat.
- Mobile en `@media (max-width: 767px)`, bureau en `(min-width: 768px)`, aucune règle mobile globale. Une garde de page s'écrit `:where(html.x)`. La règle l.14701 garde sa spécificité (1,3,3).
- Correctif d'ancres :
  - le corps (`scrollRestoration`, `replaceState`, `scrollTo(0, 0)`, restauration après 500 ms) est inchangé ;
  - seule la condition change : `window.innerWidth < 768 && window.location.hash === '#flap'` ;
  - le code reste au premier niveau de l'IIFE, hors InitQueue, avant tout module ;
  - le commentaire est mis à jour (but : `#flap` seul, H10).
- Ancres vérifiées dans les deux états d'injection, sur le même sujet et aux mêmes largeurs :
  - **début** : script en tête de `<head>`, avant la meta viewport ; `window.__krInjection.largeur` ≥ 768 exigé (981 relevé) ; c'est l'état d'un vrai téléphone ;
  - **body** : bundle évalué à l'existence de `document.body` ; `window.__krInjection.largeur` = largeur émulée exigée.
  Un relevé dont l'état d'injection n'est pas celui attendu est un FAIL, pas un vert.
- « Message dans la fenêtre » se mesure ainsi :
  - `location.hash` vaut `#msgNNN` après `krReady`, puis encore 2 s plus tard (le correctif agit au `load` et à 500 ms) ;
  - le `li.media` qui suit `a[name="msgNNN"]` coupe la fenêtre (haut < `innerHeight` et bas > 0) ;
  - `elementFromPoint` au centre de sa partie visible tombe dans ce message.
- Ligne d'index et de racine, à 375 et 767 :
  - hauteur ≥ 72 px pour chaque ligne, forum sans message compris ;
  - lignes à 3 rangées égales à la base (85,9) ;
  - `elementFromPoint` au centre de la ligne → lien du forum ; au centre de la flèche → lien `#msg` de la flèche ;
  - flèche ≥ 44×44, centrée verticalement à ±1 px près.
- Seuils : 767, 768 et 769. Bascule 768 → 767 → 768 dans le même onglet, pour un sujet ouvert avec `#msgNNN` et pour l'index. À 768, 769 et 1280, tout est égal au bundle de base `0523d7f`.
- Suite nouvelle :
  - `forum-activite.mjs`, zone `forum-activite` ;
  - entrée `SUITES` littérale, avec ses fragments ; règle de fichier, mots-clés et entrée `SECTIONS` pour la section « FIX MOBILE : … » ;
  - cas dans `router.test.mjs`, puis `npm run test:router` vert ;
  - ligne de zone au tableau du skill `tester-kraland-css`, dans les deux copies, `diff -r .hermes/skills .claude/skills` vide.
- Repères déjà cités par 3 suites (`kr-page-forum-index`, `page-forum`, `panel-default`, `forum-sujet.html`…) : pas en clair dans `forum-activite.mjs`, ils passent par `lib/variantes.mjs` (MAX_CITING = 3).
- Masques :
  - posés sur le bundle de base seulement, jamais sur le bundle courant ;
  - chaque masque porte en commentaire une condition de retrait qui nomme un événement à venir : « retirer quand `COMMIT_AVANT` de la suite est réaligné sur un SHA qui contient 6.2 ; le réalignement est porté par le sweep 6.7 ou par l'action A4 de la rétro 5 (les deux sont des tickets à venir) ». Jamais « quand le bundle de base contient l'entrée ».
- Base de comparaison de la nouvelle suite : un SHA figé (`COMMIT_AVANT = '0523d7f'`), pas une branche (rétro 5, F3).
- Fixtures synthétiques du dépôt seulement. Un `#flap` ou une ancre renommée se pose en mémoire dans la suite, jamais dans une nouvelle capture HTML brute.

**Ask First:**
- Retirer tout le correctif d'ancres : il n'a aucun effet mesurable sur `#flap` en mobile (§1.3), mais c'est un retrait de comportement.
- Décaler l'ancre sous la barre de navigation fixe (`scroll-padding-top` ou `scroll-margin-top` mobile). L'en-tête du message ancré est sous la barre de 60 px ; c'est déjà le cas au bureau dans la base (§1.1).
- Faire primer l'ancre sur le défilement en pixels après une bascule de seuil (`restoreScrollAfterReload`, §1.4).
- Toute modification de la ligne de sujet du sous-forum : hauteur (`min-height: 44px !important` l.14185), parité `COMPOSANTS_MOBILE` de 6.1.
- Tout changement de retrait (`padding`) ou de hauteur des lignes à 3 rangées de l'index.
- Une flèche à 34 px ou au style de bouton standard (entrée 6.6).
- Sortir la racine `/forum` de la règle (elle porte `kr-page-forum-index` et reçoit les 72 px, §1.5).
- Toucher Staff (exclu de la présentation de l'index, choix de 6.1 en attente).
- Changer un seuil ou une tolérance de `sous-forum.mjs` ou de `forum-index.mjs`.
- Un JS de repositionnement après la transformation Messages:V3, si le message ancré sort de la fenêtre une fois la page transformée.

**Never:**
- Règle `:focus`, focus clavier (aucun focus clavier dans l'épopée).
- `!important` nouveau. Test de largeur retiré de la branche `#flap`.
- Une condition qui lit la largeur plus tard (`DOMContentLoaded`, `load`) pour décider d'effacer `#msg` : un vrai téléphone ferait alors comme l'émulation.
- Toucher `smartLink`, l'icône d'état du sous-forum ou le lien natif de la flèche.
- Capture HTML brute dans le dépôt. Site réel, cloche, `/report`, Chrome 9222/9223.
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sujet, vrai téléphone | `forum-sujet.html#msg6801393` et `#msg6801395`, 375 et 767, injection début (981) | hash gardé ; message dans la fenêtre (2e en haut, 3e au défilement maximal) | injection lue à < 768 : FAIL d'état |
| Sujet, émulation | mêmes URL, 375 et 767, injection body (375 / 767) | même résultat que la ligne précédente (rouge sur la base : hash vide, scrollY 0) | — |
| Peau coupée | `kr-theme-enabled` = `false`, 375, `#msg6801395` | hash gardé, message dans la fenêtre (base : vide, 0) | — |
| Flèche de l'index | `forum-index-rp`, 375, tap au centre de la flèche de « Taverne » | arrivée sur `/forum/sujet/une-histoire-de-comptoir-330001-1#msg6900001` (sujet servi par `forum-sujet.html`, ancre renommée en mémoire) ; hash gardé ; message dans la fenêtre ; dans les deux injections | tap qui n'atteint pas la flèche (`elementFromPoint`) : FAIL avant le tap |
| Premier non lu | `sous-forum-debuter`, 375, tap au centre du titre « Gagner des PA » | arrivée sur `…gagner-des-pa-334743-1#msg6698133`, hash gardé, message dans la fenêtre ; dans les deux injections | — |
| Mini-chat mobile | sujet complété en mémoire par `#flap`, `…#flap`, 375 | injection body : hash effacé, scrollY 0 (comme la base) ; injection début : `#flap` gardé (comme la base) ; mini-chat caché dans les deux cas | — |
| Mini-chat bureau | même page, 1280 | `#flap` gardé (comme la base) | test de largeur retiré : FAIL |
| Lignes d'index | `forum-index-rp`, `forum-index-communaute`, `forum-racine-groupes`, 375 et 767 | chaque ligne ≥ 72 px dans la carte ; forum sans message à 72, texte centré ; lignes à 3 rangées égales à la base ; centre → forum ; flèche ≥ 44 → `#msg` | forum sans message sans flèche ni case vide (Q27.2) |
| Seuils | 767, 768, 769 ; bascule 768 → 767 → 768 dans le même onglet | 767 : lignes ≥ 72 ; 768 et 769 : égal à la base ; sujet `#msg6801395` : hash gardé des deux côtés | position après bascule = celle de la base (§1.4), sans document de plus que la base |
| Bureau | index, racine, sujet `#msg`, 768, 769, 1280 | égal au bundle `0523d7f` | — |
| Staff | `forum-index-rp` à `/forum/staff`, 375 | égal à la base | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n-inventaire.md`.
- `kraland-userscript-template.js` (lignes de `0523d7f`, à revérifier) :
  - l.2881-2907 : section « FIX MOBILE : Empêcher le scroll automatique vers #flap ou autres ancres », condition l.2885 ;
  - l.817-832 : `restoreScrollAfterReload` (lu, non touché) ;
  - l.4982 : `initMiniChatFAB` (lu, non touché) ;
  - l.5066-5140 : `smartLink` du SOUS-FORUM (lu, non touché).
- `kraland-theme.css` :
  - l.14557 : en-tête de section « INDEX DU FORUM » ; l.14684 : `@media (max-width: 767px)` des lignes ;
  - l.14701-14717 : règle de la ligne `tr` (cible) ;
  - l.14814 / l.14828 : groupe et bouton de la flèche (lus) ; l.14863 : `tr:active` ; l.14870 : `@media (min-width: 768px)` ;
  - l.4422-4442 : `#flap` mobile (lu).
- Tests :
  - `tests/e2e/forum-activite.mjs` (nouveau) : harnais repris de `forum-index.mjs` `open()` (l.87-112) et du mode `debut` de `modale-ordre.mjs` (l.137-170) ;
  - `tests/e2e/lib/variantes.mjs` l.360-431 : masques 5.x ; ajouter repères, masque et détecteur 6.2 ;
  - `tests/e2e/cartes-pastilles.mjs` : `COMMIT_AVANT` l.78, `ouvrir` l.170, fragment `lignes` l.616-660 ;
  - `tests/e2e/forum-index.mjs` : `LIGNES` l.143-219, `COMPOSANTS_MOBILE` l.251-271, l.355-361, l.379-388, hors-périmètre l.581-613 ;
  - `tests/e2e/sous-forum.mjs` : `forumIndex()` l.40-46, l.540, l.1090, l.1173-1174 ;
  - `tests/e2e/lib/router.mjs` : `SUITES` (l.37 pour le modèle), `KEYWORDS` l.147-200, `SECTIONS` l.204-215, `MAX_CITING` l.232 ; `tests/e2e/lib/router.test.mjs` (modèle l.333-338) ;
  - `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` : tableau des zones.

## Tasks & Acceptance

**Execution:**
- [ ] Rouge avant : extraire hors dépôt le bundle de `0523d7f` (`git show 0523d7f:kraland-userscript-main.user.js > /tmp/…`). Écrire d'abord `forum-activite.mjs` (tâche suivante), puis le lancer avec `KR_SCRIPT=<ce bundle>`. `kr-theme-enabled` est vérifié avant toute mesure. FAIL attendus listés en Verification.
- [ ] `tests/e2e/forum-activite.mjs`, fragments :
  - `ancres` : sujet `#msg6801393` et `#msg6801395` ; 375, 767, 768, 1280 ; injections début et body ; état d'injection vérifié ; peau coupée à 375 ; `#flap` à 375 (deux injections) et 1280 ;
  - `parcours` : tap au centre de la flèche (index RP) et du titre « premier non lu » (sous-forum) ; le sujet d'arrivée est servi par `forum-sujet.html`, ancre renommée en mémoire ; deux injections ; `elementFromPoint` vérifié avant chaque tap ;
  - `lignes` : index RP, Communauté, racine-groupes à 375 et 767 (hauteur, centre, flèche, carte) ;
  - `seuil` : 767, 768, 769, bascule 768 → 767 → 768 (index et sujet `#msg`), garde-fou de 1 300 ms entre deux rechargements ;
  - `bureau` : 768, 769, 1280 égal à `0523d7f` (lignes, flèche, sujet `#msg`) ; Staff à 375 égal à la base.
  Confinement réseau, Bootstrap du vendor, aucun accès hors fixtures. Repères partagés importés de `lib/variantes.mjs`.
- [ ] `kraland-userscript-template.js` l.2885 : condition réduite à `window.innerWidth < 768 && window.location.hash === '#flap'`, corps inchangé ; commentaire l.2883 mis à jour (but `#flap`, H10, `#msg` jamais touché).
- [ ] `kraland-theme.css` l.14701 : ajouter `min-height: 72px;` et `align-content: center;` dans la règle d'origine, sans `!important`. Vérifier par CDP la règle gagnante. Mesurer l'index, la racine, la racine-groupes et Staff.
- [ ] `tests/e2e/lib/variantes.mjs` :
  - masque `LIGNE_INDEX_TICKET62` : miroir littéral des deux déclarations, sous `@media (max-width: 767px)` ;
  - détecteur `AVANT_TICKET62`, qui lit une chaîne minifiée relevée dans le bundle construit, absente de `21fed8d` et de `0523d7f` ;
  - condition de retrait événementielle en commentaire (Boundaries).
- [ ] `tests/e2e/cartes-pastilles.mjs` fragment `lignes` : poser `LIGNE_INDEX_TICKET62` sur le bundle de base `21fed8d` seulement, si `AVANT_TICKET62(avant)`. Moyen : `poserJetonsRedefinis` ou une option `masque` de `ouvrir`, au choix, consigné. Rouge sans le masque (§4), vert avec.
- [ ] Suites existantes, après le 1er `test:zone` : `forum-index.mjs` (parité, flèche, hors-périmètre), `sous-forum.mjs`, `typographie-formes.mjs`, `palette-nation.mjs`. Vert attendu sans retouche. Une retouche nécessaire va au Plan Change Log ; un seuil ou une tolérance changés passent par Ask First.
- [ ] `tests/e2e/lib/router.mjs` :
  - entrée `SUITES` `{ name: 'forum-activite', file: 'forum-activite.mjs', zones: ['forum-activite'], frags: [['ancres'], ['parcours'], ['lignes'], ['seuil'], ['bureau']], needsBootstrap: true }` ;
  - mot-clé dédié → `forum-activite` : la ligne d'index (`kr-page-forum-index` suivi de `tbody > tr`), `location.hash`, `scrollRestoration`, `flap`, `smart-redirect` ;
  - `SECTIONS` : `[/^FIX MOBILE : /, ['forum-activite']]`.
  Les mots-clés existants restent tels quels. Cas dans `router.test.mjs` (hunk CSS de la ligne d'index ; hunk du correctif ; fichier de suite), puis `npm run test:router`.
- [ ] Skill `tester-kraland-css` : ligne de zone `forum-activite` (ancres `#msg` et `#flap`, lignes d'index ≥ 72 px, parcours flèche et premier non lu) dans les deux copies, puis `diff -r .hermes/skills .claude/skills`.
- [ ] `npm run build`, contre-épreuves, lint, compte `!important`.

**Acceptance Criteria:**
- Given `forum-sujet.html#msg6801393` ou `#msg6801395` à 375 et 767 px, when le bundle est évalué à 981 px (injection début) puis à la largeur émulée (injection body), then dans les deux cas `location.hash` garde `#msgNNN` après `krReady` et 2 s plus tard, et le message ciblé est dans la fenêtre (`elementFromPoint` au centre de sa partie visible).
- Given la flèche d'un forum de l'index RP et le titre d'un sujet lu en partie du sous-forum, à 375 px, when on tape au centre, then le sujet s'ouvre sur `#msgNNN`, le hash est gardé et le message est dans la fenêtre, dans les deux états d'injection.
- Given le thème coupé à 375 px, when on ouvre `#msg6801395`, then le hash est gardé.
- Given `…#flap` à 375 px (injection body), when la page est prête, then le hash est effacé et la page reste en haut, comme la base. Given `…#flap` à 1280 px, then le hash est gardé.
- Given l'index RP, Communauté et la racine-groupes à 375 et 767 px, when on mesure chaque ligne, then elle fait au moins 72 px dans la carte. Le forum sans message fait 72 px, texte centré, et les lignes à 3 rangées restent à la hauteur de la base. Le centre de la ligne mène au forum, la flèche fait au moins 44×44 et mène au `#msg`.
- Given 768, 769 et 1280 px, when on compare au bundle `0523d7f`, then l'index, la racine et le sujet ouvert sur `#msg` sont égaux. La bascule 768 → 767 → 768 dans le même onglet garde le hash des deux côtés.
- Given `cartes-pastilles.mjs` `lignes`, `forum-index.mjs`, `sous-forum.mjs`, when ils tournent, then ils sont verts ; le masque n'est posé que sur le bundle de base.
- Given `kraland-theme.css`, when on compte `!important`, then 3292. Les deux déclarations ajoutées sont sous `@media (max-width: 767px)`.
- Given `npm run test:router`, then vert. `diff -r .hermes/skills .claude/skills` est vide.

## Implementation Notes

- **CSS** (`kraland-theme.css`, règle d'origine de la ligne d'index, sous `@media (max-width: 767px)`) : `align-content: center;` et `min-height: 72px;` ajoutés, sans `!important` (compte inchangé : 3292). CDP à 375 px, index RP : une seule règle déclare `min-height` (72px) et `align-content` (center) sur la ligne, `:where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr`, média `(width <= 767px)` ; forum sans message mesuré à 72 px.
- **Template** (section « FIX MOBILE : Empêcher le scroll automatique vers #flap ») : condition `window.innerWidth < 768 && window.location.hash === '#flap'`, corps inchangé. Commentaire de la section mis à jour (H10, ticket 6.2).
- **`lib/variantes.mjs`** : `ACTIVITE_TICKET62` (fixtures, classes, sélecteurs de ligne, carte et flèche), masque `LIGNE_INDEX_TICKET62`, détecteur `AVANT_TICKET62` (chaîne minifiée `align-content:center;align-items:baseline;gap:2px 6px;min-height:72px` : 1 fois dans le bundle construit, 0 dans `21fed8d` et `0523d7f`), condition de retrait en commentaire.
- **Nouvelle suite `tests/e2e/forum-activite.mjs`** (113 contrôles après la revue, 89 avant, 5 fragments `ancres`, `parcours`, `lignes`, `seuil`, `bureau`). Injection « début » : script en tête de `<head>`, bundle évalué dès que `<html>` existe ; l'état d'injection (`window.__krInjection` : `<body>` absent et largeur ≥ 768, ou `<body>` présent et largeur émulée) est vérifié à chaque cas. `#flap` et les ancres d'arrivée des parcours (`msg6900001`, `msg6698133`) sont posés en mémoire dans `forum-sujet.html`. Les relevés comparés à la base incluent le `min-height` calculé de chaque ligne (voir Plan Change Log).
- **`cartes-pastilles.mjs`** : option `masque` ajoutée à `ouvrir` (`addInitScript(poserJetonsRedefinis, masque)`), posée dans le fragment `lignes` sur le bundle de base seulement, si `AVANT_TICKET62(avant)`.
- **`typographie-formes.mjs`** (fragment `nettoyage`) : `LIGNE_INDEX_TICKET62` empilé sur le masque de la base `00b0786`, si `AVANT_TICKET62(script)` (voir Plan Change Log).
- **Routeur** : entrée `SUITES` `forum-activite` ; mot-clé `/kr-page-forum-index\b[^{]*tbody\s*>\s*tr|location\.hash|scrollRestoration|flap|smart-redirect/` ; `SECTIONS` `[/^FIX MOBILE : /, ['forum-activite']]` ; règle de fichier de `sous-forum-debuter.html` complétée de `forum-activite`. `router.test.mjs` : un cas nouveau (hunk CSS de la ligne d'index, hunk sans mot-clé dans « FIX MOBILE », hunk avec mot-clé, fichier de suite), deux cas existants mis à jour (zones de `sous-forum-debuter.html`).
- **Repères cités** (après la revue, constats 1 et 2) : relevé `TOKEN_RE` des 25 jetons de la suite contre les autres suites du registre : aucun ne passe de 3 à 4 suites citantes. `forum-sujet.html` et `forum-index-communaute.html` ne sont plus écrits en clair (seulement dans `ACTIVITE_TICKET62`) ; le commentaire qui citait `min-height` dit « hauteur minimale calculée ». Restent en clair `forum-index-rp.html` et `sous-forum-debuter.html` (jetons déjà cités par 5 et 6 suites, hors routage par citation avant ce ticket) et `forum-racine-groupes.html` (2 → 3).
- **Skill** `tester-kraland-css` : ligne de zone `forum-activite` dans les deux copies ; `diff -r .hermes/skills .claude/skills` vide.
- **Rouge avant** (`KR_SCRIPT` = bundle de `0523d7f`) : 35 FAIL. `ancres` en body à 375 et 767 (hash vide, scrollY 0), peau coupée, `parcours` en body (2), `lignes` (24, forums sans message à 64,7 px), `seuil` 767 (2) et les deux bascules. Verts sur la base : injection début (981), `#flap`, `bureau`, flèche 44, centre de ligne.
- **Contre-épreuves** (copies mutées du bundle sous `/tmp/kr62/`, `KR_SCRIPT`) :
  - condition de base remise : 4 FAIL `ancres` body (hash vide) ;
  - test de largeur retiré de la branche `#flap` : 3 FAIL (`#flap` 375 début, 1280 début et body) ;
  - décision lue au `DOMContentLoaded`, condition actuelle : 1 FAIL (`#flap` 375 début effacé) ; même mutation avec la condition de base : 10 FAIL (`#msg` effacé en injection début aussi) ;
  - `min-height: 72px` retiré : 24 FAIL `lignes` ;
  - `align-content` retiré : 12 FAIL (texte haut 10 / bas 11,8) ;
  - `a::after` retiré : 12 FAIL (centre de ligne -> null) ;
  - `min-height` hors media query : 4 FAIL `seuil` 768 et 769 (après ajout du `min-height` calculé aux relevés) ;
  - mini-chat (après la revue, constat 3) : règle `#flap` de la peau et `getElementById("flap")` du template renommés dans le bundle : 2 FAIL (`#flap` 375 début et body, « mini-chat visible : [0,375] »). Le renommage JS seul reste vert : la règle `#flap` mobile de la peau (`right: -100%`) cache déjà le panneau ;
  - masque retiré de `cartes-pastilles.mjs` (`lignes`) : 12 FAIL (hauteur testé 72 / base 64,7) ; masque retiré de `typographie-formes.mjs` (`nettoyage`) : 8 FAIL (racine 375 et 767).

## Plan Change Log

- **`typographie-formes.mjs` retouché** (le plan attendait « vert sans retouche ») : le fragment `nettoyage` compare les styles calculés de la racine `/forum` à la base `00b0786`. Les deux lignes sans message diffèrent (`min-height` 72px, `align-content` center) : 8 FAIL. Correction : `LIGNE_INDEX_TICKET62` empilé sur le masque de la base, comme les entrées 5.1 à 5.5. Aucun seuil ni tolérance changé. Après : 405 ok, 0 FAIL.
- **Contre-épreuve « `min-height` hors media query »** : la prévision du plan (« bureau rouge à 768 ») ne tenait pas. Sur ordinateur, la ligne est une ligne de tableau qui ignore `min-height`, et la géométrie reste égale à la base. La suite relève donc aussi le `min-height` calculé de chaque ligne, comparé à la base en `seuil` (768, 769) et `bureau`. Après ce relevé, 4 FAIL.
- **Règle de fichier** : `sous-forum-debuter.html` avait une règle explicite (`sous-forum`, `cartes-pastilles`) qui court-circuite la citation ; `forum-activite` y est ajouté. Les quatre autres fixtures sont routées par citation (noms de fichiers en clair dans l'en-tête de la suite).
- **Option de masque** : option `masque` de `ouvrir` dans `cartes-pastilles.mjs` (choix laissé ouvert par le plan).
- **`npm run test:changed` non lancé** : `tests/e2e/lib/variantes.mjs` modifié l'élargit au total (« touche le lanceur ou les dépendances »), comme en 5.2.
- **Revue, constat 1** : les noms `forum-sujet.html` et `forum-index-communaute.html` sont retirés de l'en-tête de la suite (le plan, l.76, interdit un 4e citant). Conséquence : une modification de ces deux fixtures ne lance plus `forum-activite` par citation. Elle lance les suites qui les citent ; `test:all` couvre le reste. Une règle de fichier dédiée remplacerait la citation pour les autres suites, d'où le choix de ne pas en poser.
- **Revue, constat 2** : commentaire reformulé (« hauteur minimale calculée ») ; `min-height` n'est plus cité par la suite.
- **Revue, constat 3** : le contrôle « mini-chat caché » ne pouvait pas rougir (panneau en mémoire en `fixed`, `right:-300px`). Le panneau est maintenant posé dans le flux, sans style : sans la peau, il est visible en pleine largeur. « Caché » = `visibility: hidden`, `display: none`, boîte vide ou rejet hors de la largeur de la fenêtre ; la position verticale ne compte plus. Contre-épreuve rouge (voir Implementation Notes).
- **Revue, constat 5** : la spécificité de la règle l.14701 (`:where(html.kr-page-forum-index) #col-right .panel-default .table > tbody > tr`) est (1,2,2) et non (1,3,3) comme écrit dans Boundaries : un id, deux classes, deux types ; `:where()` compte zéro. Les deux déclarations ajoutées n'en changent pas.
- **Revue, constat 6** : l'entrée 6.2 (`tickets.toml`) nomme les index RP, HRP, Communauté et Débats, et son `verify` cite `sous-forum-debuter` pour « lignes ≥ 72 px ». Le plan ne mesurait que RP, Communauté et la racine-groupes. Le dépôt n'a aucune fixture d'index HRP ni Débats (`forum-colonne-native-hrp.html` n'est qu'une colonne latérale). Le fragment `lignes` sert donc l'index RP aux chemins `/forum/hrp` et `/forum/debats` : la classe `kr-page-forum-index` suit le chemin (`krForumIsIndexPath`). Cela prouve que la règle s'applique sur ces chemins, pas le rendu des vrais index HRP et Débats. Rouge sur la base : 16 FAIL de plus (64,7 px). Le sous-forum n'est pas mesuré à 72 px : sa ligne de sujet (44 px, l.14185) est hors périmètre (Ask First), seul son lien « premier non lu » est vérifié (`parcours`).

## Design Notes

**Pourquoi `#flap` seul, avec le test de largeur.** Trois variantes de la condition ont été mesurées (§1.1, §1.3) :

| Condition | `#msg` mobile (981 et 375) | `#flap` mobile | `#flap` bureau |
|---|---|---|---|
| base (`< 768`, tout hash ≠ `#top`) | effacé à 375, gardé à 981 | effacé à 375, gardé à 981 | gardé |
| `#flap` seul, sans largeur | gardé | effacé | **effacé** (casse `#flap:target` natif) |
| `< 768` et `#flap` (retenue) | gardé | comme la base | gardé |

La branche `#flap` reste dépendante de l'appareil, comme aujourd'hui : elle est inerte sur un vrai téléphone. Elle n'a d'ailleurs aucun effet visible, car le CSS et le JS cachent déjà le mini-chat. Son retrait complet passe par Ask First, et sera consigné dans `deferred-work.md` si Arnaud le reporte.

**Pourquoi `align-content: center`.** Avec `flex-wrap: wrap`, `align-content: normal` étire les rangées. Les 7,3 px gagnés par le forum sans message se répartiraient entre le nom et les compteurs (haut 10, compteurs 41, bas 12,8). Centrer le bloc donne 13,7 / 39,2 / 14,7, aligné sur la flèche, elle aussi centrée (§1.6). Les lignes à 3 rangées n'ont aucun espace libre et ne bougent pas.

**Masque et base figée.** `cartes-pastilles.mjs` compare les hauteurs de ligne à `21fed8d` (§4). La seule ligne qui change est un forum sans message, avec le même nombre de rangées de texte : le contrôle « hauteur égale » passe au rouge. Le masque pose les 72 px sur la base. `forum-index.mjs` n'a pas besoin de masque : l'index n'est pas dans l'empreinte hors-périmètre, et la parité ne compare ni `min-height` ni `align-content` (à vérifier par le 1er `test:zone`).

**Pièges :**
- P1 : `addInitScript` s'exécute avant que `<html>` existe. Le mode début attend `document.documentElement`. Sans script en tête de `<head>`, l'observateur n'est livré qu'au premier script et l'injection tombe après `<body>` (commentaire de `modale-ordre.mjs` l.137-140).
- P2 : la meta viewport est lue avant `<body>`. Le harnais `open` de `forum-index.mjs` évalue donc toujours à la largeur émulée. Le cas d'un vrai téléphone n'existe que par le mode début.
- P3 : 3e message au défilement maximal (document de 2247 px à 375). « Dans la fenêtre » ne veut pas dire « en haut ».
- P4 : barre fixe de 60 px. `elementFromPoint` au haut du message tombe sur la barre ; mesurer au centre de la partie visible (« couvert » n'est pas « invisible »).
- P5 : `scrollIntoView` fait défiler les conteneurs masqués. Mesurer par `scrollTo` puis `elementFromPoint` (`lienEn` de `forum-index.mjs`).
- P6 : `page.clock` casse `requestAnimationFrame`. Les attentes du correctif (500 ms, `load`) se mesurent en temps réel, sans `clock.install`.
- P7 : la bascule recharge la page (`sous-forum.mjs` l.924, `forum-index.mjs` `seuil`). Garde-fou de 1 200 ms : 1 300 ms entre deux redimensionnements (`ECART_RECHARGEMENT_MS`).
- P8 : MAX_CITING. Une 4e suite qui cite `kr-page-forum-index` en clair retire ce repère du routage par citation pour les trois autres.
- P9 : faux FAIL sous charge (rétro 4, F10). Rejouer la suite seule, machine calme.
- P10 : un bundle construit hors `main` pointe vers `localhost:4848` : sans effet sur les fixtures, `GM.xmlHttpRequest` étant neutralisé.

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- forum-activite forum sous-forum cartes-pastilles messages` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` (codes de sortie lus séparément) ; `grep -c '!important' kraland-theme.css` = 3292 ; `diff -r .hermes/skills .claude/skills` vide. `npm run test:changed` seulement s'il ne s'élargit pas au total (sinon consigné, comme en 5.2). Pas de `test:all` (orchestrateur).
- Rouge avant, sur le bundle de `0523d7f` (`KR_SCRIPT`), FAIL attendus :
  - `ancres` et `parcours` en injection body à 375 et 767 : hash vide, scrollY 0 ;
  - peau coupée à 375 : hash vide ;
  - `lignes` : « Les Cadets d'Essai », « Archives d'essai » et les 2 lignes sans message de racine-groupes à 64,7 px ;
  - `seuil` : hash vide après la bascule vers 767.
  Verts attendus sur la base : injection début (981), `#flap`, `bureau`, flèche 44, centre de ligne. C'est la preuve que le cas du vrai téléphone était déjà correct et reste gardé.
- Contre-épreuves sur des copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - condition de base remise (`#msg` effacé à 375) ;
  - test de largeur retiré de la branche `#flap` (`#flap` bureau rouge) ;
  - décision lue au `DOMContentLoaded` (`innerWidth < 768` alors vrai à 981 → `#msg` effacé : injection début rouge) ;
  - `min-height: 72px` retiré (lignes rouges) ;
  - `min-height` hors media query (bureau rouge à 768) ;
  - `align-content` retiré (texte non centré : haut du nom et bas des compteurs à plus de 1 px d'écart) ;
  - lien étiré `a::after` retiré (centre de ligne rouge) ;
  - masque `LIGNE_INDEX_TICKET62` retiré de `cartes-pastilles.mjs` (`lignes` rouge).
- Largeurs : 375×667, 767, 768, 769, 1280. Bascule 768 → 767 → 768 dans le même onglet. Variantes Kraland clair et Empire Brun sombre pour les lignes.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, clair et sombre : index RP (forum sans message), racine-groupes, sujet ouvert sur `#msg6801395` (deux injections).
- Essai sur vrai téléphone par Arnaud (Open question de l'épopée) : ouvrir une flèche de l'index et un « premier non lu ». Le message doit être à l'écran, son en-tête éventuellement sous la barre (Ask First).

## Review Triage Log

## Result

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | `tests/e2e/forum-activite.mjs:24-25` | `forum-sujet.html` et `forum-index-communaute.html` sont écrits en clair, alors que le plan l'interdit (l.76) : 4 suites citantes | fondé | patch (fixed) | Calcul `TOKEN_RE` sur les suites ; effet nul aujourd'hui (`addCited`) |
| 2 | quick | `tests/e2e/forum-activite.mjs:177` | Le commentaire fait passer `min-height` à 4 suites citantes (P8), et les notes ne le relèvent pas | fondé | patch (fixed) | `'min-height'` cité au template l.9419 |
| 3 | quick | `tests/e2e/forum-activite.mjs:64`, `:251` | « mini-chat caché » ne peut pas échouer : `#flap` fixe à `right:-300px` est toujours hors fenêtre | fondé | patch (fixed) | Le CSS natif est servi vide ; le thème ne le déplace pas |
| 4 | quick | `kraland-userscript-template.js:2888` | Les ancres autres que `#flap` ne sont plus effacées en largeur lue < 768, et seul le fil de sujet le prouve | fondé | defer | Comportement déjà celui du vrai téléphone (981) ; aucun autre code ne dépend de l'effacement. Report dans deferred-work |
| 5 | quick | plan, Boundaries | La spécificité est notée (1,3,3) ; la vraie valeur est (1,2,2) | fondé | patch (fixed) | Lecture du sélecteur |
| 6 | quick | entrée 6.2, `verify` | HRP, Débats et `sous-forum-debuter` « ≥ 72 px » ne sont pas mesurés ; l'écart n'est pas consigné | fondé | patch (fixed) | Plan : RP, Communauté et racine-groupes seulement |

## Result

- Construit le 2026-10-25 sur la base `0523d7f`.
- Revue quick : 6 constats. #1, #2, #3, #5 et #6 sont corrigés. #4 est reporté (ancres hors forum, deferred-work).
- Gates :
  - `npm run build`, `lint:css`, `lint:js` et `test:router` sortent en 0 ;
  - `diff -r .hermes/skills .claude/skills` est vide ;
  - `npm run test:all` : 12891 ok, 0 FAIL (VERT).
- Rouge avant sur la base : 51 FAIL dans `forum-activite`. 8 contre-épreuves à l'implémentation, plus celle du mini-chat après la revue (2 FAIL).
