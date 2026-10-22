---
title: "L'index du forum reprend la présentation du sous-forum"
type: 'feature'
ticket: '1'
created: '2026-10-22'
status: 'built'
baseline_revision: '81512a3a4a0adb59958ddf955e203a7d44941b0e'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les index du forum (`/forum/rp`, `/forum/hrp`, `/forum/communaute`, `/forum/debats`) ne ressemblent pas au sous-forum (ex. `/forum/rp/royaume-de-ruthvenie-101118`). Sur ordinateur : description et modérateurs, auteur en lien, petite flèche. Sur mobile : cartes et tableau natif affichés en double, compteurs sans libellé, titre de section en couleur de nation, titre de page collé au bord, aucun bouton →.

**Approach:** Sur les deux supports, ces quatre index prennent la présentation du sous-forum : en-tête de page, en-têtes de section, une ligne par forum dans l'ordre natif (nom ; dernier message : auteur en gras, heure atténuée ; compteurs ; bouton → vers le dernier message au bout de la ligne), sans description ni modérateurs (refonte H12.1). La racine `/forum` et le sous-forum ne changent pas.

## Boundaries & Constraints

**Always:** surcharge seulement ; ordre DOM natif des forums ; liens natifs inchangés (forum, dernier message avec son `#msg…`) ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)` ; P1 option 4 : les règles et modules anciens de l'index (cartes mobiles `ForumCards`, CSS « v1 » et « v2 », `PermanentTopics:Icons`) sont retirés ou contournés pour l'index, et la nouvelle présentation est gardée par une classe de page sur `html` en `:where(html.kr-page-forum-index)` ; rien ne s'applique peau coupée.

**Never:** poser `kr-subforum` sur l'index ; toucher la liste latérale, l'en-tête de sujet, « ••• », la racine `/forum` ; inventer un contenu absent du HTML natif ; corriger ici le retrait des ancres `#msg` à l'arrivée sur mobile (entrée séparée de l'épopée).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Index, ordinateur | 4 index, 1440 px | colonnes Forum, Sujets, Messages, Dernier Message comme celles du sous-forum ; nom seul ; auteur en gras, heure atténuée dessous ; bouton → au bout de la ligne ; ni description ni modérateurs | No error expected |
| Index, mobile | 4 index, 375 px | une seule présentation (plus de doublon) : lignes pleine largeur sous l'en-tête de section ; nom ; « Dernier : auteur, heure » ; « N sujets · N messages » ; bouton → de 44 px ; toute la ligne ouvre le forum | No error expected |
| Forum sans message | cellule « Dernier Message » vide (0 / 0) | compteurs « 0 sujets · 0 messages », ni dernier message ni bouton → | No error expected |
| Auteur avec icône | `a.nomargin` contenant `img.icon` | nom de l'auteur et icône conservés, en gras | No error expected |
| En-têtes | titre de page, « Tous les forums », `h3.panel-title` avec icône et chevron | même rendu que l'en-tête de page et les en-têtes de section du sous-forum ; titre de section en couleur de texte | No error expected |
| Hors périmètre | racine `/forum`, sous-forum, sujet | rendu inchangé | No error expected |
| Seuil | 767 / 768 px, aller et retour | présentation mobile / ordinateur correcte des deux côtés | No error expected |

</frozen-after-approval>

## Code Map

- Structure native relevée le 2026-10-22, identique sur les 4 index : `#col-right` > [`div.alert` éventuel], `span.pull-right > a.btn[href=forum]` « Tous les forums » (`fa-stream`, avant le titre), `h1.page-header`, `div.panel.panel-default` > `.panel-heading` (`h3.panel-title` avec `i.fa.fa-comments-o` + `span.pull-right.clickable` chevron), `.panel-body` > `table.table` (thead Forum | Sujets | Messages | Dernier Message). Ligne : td1 `p.nomargin>a` (nom) + `p.nomargin.tagforum` (description, peut contenir `<u>`) + `span.tagforum` (`fa-gavel` « Modérateurs : » + liens + `span.label.label-info`) ; td2, td3 `td.center` ; td4 `a.nomargin` (auteur, peut contenir `img.icon`) + `p.nomargin.mini > span.btn-group.btn-group-xs > a.btn.btn-default[href=forum/sujet/…#msgN][data-toggle=tooltip] > i.fa.fa-arrow-right` + date en texte ; td4 vide si aucun message. Sous-forum : boutons « ⏪ Jeu (RP) » et « nouveau sujet » dans le `h1`.
- `kraland-userscript-template.js` : `addPageTypeClass` (~l.843, classes de page) ; `krForumMenuForPath` / `FORUM_MENUS` (~l.86-104) pour reconnaître un index ; `ForumCards:MobileTransform` (prio 15, ~l.4748-4954, à exclure de l'index) ; `PermanentTopics:Icons` (prio 25, ~l.5314-5383, à exclure de l'index) ; sous-forum : `ForumTopics:Status` (24), `MobileStats` (25, unités, `aria-label` du →, clic de ligne), en-tête mobile `transformSubforumHeader` / `createNewTopicAction` (~l.5395-5448 : ne pas l'appeler tel quel, il suppose `#topics`) ; `reorderBtnGroupXs` (~l.7779) déplace `span.btn-group-xs` ; `isThemeEnabled` (~l.3139).
- `kraland-theme.css` : en-têtes `.panel-default` mobiles sans garde (~l.7508-7536) ; « v1 » `body.mobile-mode:where(.page-forum, .page-forum-racine) .panel-default .table …` (~l.7538-7788, garder pour la racine) ; cartes (~l.7884-8124, le bloc contient aussi le MINI-CHAT FAB) ; « v2 » `body.page-forum .panel-default .table …` (~l.8201-8471) ; `body.mobile-mode #col-right table:not(.dataTable)` (~l.4252, cause du doublon mobile) ; sous-forum à reprendre comme modèle : L1 (~13536), L2 en-tête mobile (~13622-13687), L3 lignes mobiles (~13688-14087 : ligne flex, lien étiré, « Dernier : », → 44 px), L4 permanents (~14089-14229, piège : masque td2-td4 de tout `.panel-default table.table` sous `kr-subforum`), L6 ordinateur (~14299-14466 : nom gras + date, → 32 px).
- Tests : `tests/e2e/fixtures/forum-index-rp.html` (à refaire sur la structure réelle, données inventées), nouvelle fixture `forum-index-communaute.html` ; nouvelle suite `tests/e2e/forum-index.mjs` enregistrée dans `tests/e2e/lib/router.mjs` ; à mettre à jour sciemment : `jeu-identite.mjs` (`fuite-forum` : 3 contrôles « index du forum » ; `hors-forum-js` : « index du forum 375 px : le module ajoute toujours ses blocs ») et `sous-forum.mjs` (`l0` : « /forum/rp » et « /forum/hrp à 375 : l'index reste en cartes ») ; les contrôles « racine du forum » restent verts.

## Tasks & Acceptance

**Execution:**
- [x] fixtures `forum-index-rp.html` (réécrite) et `forum-index-communaute.html` -- structure réelle, cas « forum sans message », auteur avec `img.icon`, description avec `<u>`, deux modérateurs -- base des tests
- [x] `tests/e2e/forum-index.mjs` + routeur -- suite rouge d'abord, une vérification par ligne de la matrice, à 375, 767, 768 et 1440 px, Kraland clair et Empire Brun sombre
- [x] `kraland-userscript-template.js` -- classe `kr-page-forum-index` sur `html` pour les 4 index ; exclusion de l'index dans `ForumCards` et `PermanentTopics:Icons` ; marquage minimal des cellules et ajouts de texte (unités, « Dernier : ») sur le modèle de `MobileStats`
- [x] `kraland-theme.css` -- index exclu de v1/v2 par `:where(html:not(.kr-page-forum-index))` ou retrait des règles qui ne servent qu'à l'index ; nouvelle section gardée `:where(html.kr-page-forum-index)`, ordinateur et mobile, sur le modèle L1, L2, L3, L6
- [x] `jeu-identite.mjs`, `sous-forum.mjs` -- contrôles de l'index mis à jour vers la nouvelle présentation ; racine inchangée
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given un index à 375 px, when la page s'affiche, then aucun élément ne déborde horizontalement et les cartes `.forums-cards-container` n'existent plus
- Given la racine `/forum` et un sous-forum, when ils s'affichent, then leur rendu et leurs tests actuels sont inchangés
- Given le thème désactivé, when un index s'affiche, then la page native est intacte

## Implementation Notes

- Fichiers : `kraland-userscript-template.js` (`krForumIsIndexPath` dans le cœur pur `menus-forums` ; `html.kr-page-forum-index` dans `applyThemeInline`, donc peau active seulement ; garde de chemin dans `ForumCards:MobileTransform` et `PermanentTopics:Icons`, peau coupée comprise ; module `ForumIndex:Presentation`, priorité 26) ; `kraland-theme.css` (`:where(html:not(.kr-page-forum-index))` devant les 46 sélecteurs « cartes » 1re version, les 46 sélecteurs de tableau de la 2e version et `body.mobile-mode #col-right table:not(.dataTable)` ; section « INDEX DU FORUM » après L6) ; fixtures `forum-index-rp.html` (réécrite, 4 forums) et `forum-index-communaute.html` (3 forums) ; suite `tests/e2e/forum-index.mjs` (5 fragments, 121 contrôles) enregistrée dans `router.mjs` (zones forum et sous-forum, entrée `SECTIONS` du module) avec 2 tests du routeur ; `jeu-identite.mjs`, `sous-forum.mjs`, `tests/unit/menus-forums.test.mjs` ; bundle et `version.json`.
- « Même rendu que le sous-forum » est mesuré : la suite charge le sous-forum « Débuter » dans le même navigateur et compare les propriétés calculées de chaque composant (en-têtes, ligne, nom, dernier message, bouton →, compteurs, colonnes, position du bouton du titre).
- Décision : les règles du panneau de la 2e version (fond, en-tête, corps, h3 16 px / 600) restent communes au sous-forum et à l'index, car elles font l'en-tête de section du sous-forum ; seules ses règles de tableau excluent l'index.
- Décision : libellé « Tous les forums » écrit par le module. Sur mobile, `disableTooltips` (transformations DOM, avant la file) retire l'infobulle du bouton natif ; sur ordinateur, le libellé n'est ajouté que si le bouton n'a pas de texte. Le bouton natif est retiré sur mobile (remplacé par le fil d'Ariane, même href) et déplacé dans le h1 sur ordinateur.
- Décision : unité posée seulement si la cellule ne contient qu'un nombre ; « 1 sujet », sinon pluriel (« 0 sujets »).
- Hypothèses ajoutées à `revue-manuelle.md` : bouton du titre sur ordinateur, graisse 400 du nom de forum (DESIGN.md donne 700), glyphe de `fa-comments-o`.
- Surprise : la croix de l'alerte native « Bienvenue » débordait de 5 px à 375 px (règle mobile générique `.alert { padding: 12px 15px }` contre `.alert-dismissible .close { right: -21px }`). Corrigé pour l'index seulement (`padding-right: 35px`) ; le défaut reste sur les autres pages mobiles à alerte fermable.
- Surprise : sur ordinateur en Kraland clair, le titre de section du sous-forum est `#333` (Bootstrap), pas `--kr-text-primary` ; l'index reprend la même couleur, jamais celle de la nation.
- Surprise : `origin/feature/next` a 33 commits locaux de retard ; le bundle « avant » de `forum-index.mjs` (hors périmètre) est pris sur la branche locale `feature/next` d'abord.
- Vérification : `forum-index.mjs` rouge sur le bundle de HEAD (24 ok, 97 FAIL), vert après (121 ok) ; contre-épreuves (nom à 15 px : « même rendu » rouge ; unités retirées : contenus rouges) ; `test:zone -- forum sous-forum menus-forums` vert (1940 ok) ; `test:router` conforme ; `test:unit` 56 ok ; `lint:css` et `lint:js` à 0 erreur ; `test:all` VERT (4341 ok, 0 FAIL).
- Correctifs de revue : le bouton → reçoit le nom accessible du sous-forum (libellé et repli de `labelRow`), vérifié sur mobile et ordinateur ; seuil mesuré à 767, 768 et 769 px ; la racine est servie par `forum-racine.html` (ancienne `forum-index-rp.html`, restaurée de 81512a3) et les contrôles « racine » de `jeu-identite.mjs` sont revenus à l'identique (2 lignes) ; le bundle « avant » est figé au commit 81512a3 (au lieu de la branche locale feature/next) ; une page de sujet entre dans la comparaison hors périmètre (`forum-sujet.html`, sortie du constructeur `page('sujet')` de `messages-v3.mjs`). `forum-index.mjs` 127 ok, `jeu-identite.mjs` 92 ok ; contre-épreuve : sans aria-label, les contrôles du bouton → sont rouges.

## Design Notes

- En-tête de page mobile : fil d'Ariane construit à partir du bouton natif « Tous les forums » (« ⏪ Tous les forums › <catégorie> »), sur le modèle des classes `.forum-mobile-breadcrumb*` et `.forum-subforum-head/-title` du sous-forum, puis le titre ; ordinateur : titre et bouton « Tous les forums » à droite, comme les boutons du sous-forum (hypothèse notée dans `revue-manuelle.md`).
- Index Staff exclu ; seuls rp, hrp, communaute et debats reçoivent `kr-page-forum-index`.
- Cascade : les règles anciennes en `!important` (v1, v2, l.~4252) battent une garde à spécificité nulle ; les exclure de l'index plutôt que surenchérir (P1, option 4).

## Verification

**Commands:**
- `npm run build && node tests/e2e/forum-index.mjs` -- expected: rouge avant le code, vert après
- `npm run test:zone -- forum sous-forum menus-forums`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

**Manual checks (if no CLI):**
- Validation visuelle d'Arnaud sur le site réel : les 4 index à 375 et 1440 px, en Kraland clair et Empire Brun sombre, comparés au sous-forum Royaume de Ruthvénie.

## Review Triage Log

Passe quick du 2026-10-22 : 4 low, patch ; tous corrigés par l'implémenteur.
- low, patch — bouton → mobile sans nom accessible (les infobulles sont retirées sur mobile avant la file d'init) : `aria-label` posé comme `labelRow` du sous-forum, vérifié à 375 et 1440 px.
- low, patch — seuil testé à 767 et 768 px seulement (AGENTS.md : N−1, N, N+1) : 769 px ajouté.
- low, patch — tests de la racine modifiés par la réécriture de la fixture : fixture d'origine conservée sous `forum-racine.html`, assertions de la racine revenues à l'identique.
- low, patch — comparaison « hors périmètre » faite sur la branche locale (se comparerait à elle-même une fois commitée) et sans page de sujet : bundle d'avant figé à `81512a3` (remplaçable par `KR_SCRIPT_AVANT`), page de sujet ajoutée.

Vérification : `forum-index.mjs` 127 ok ; `test:unit` 56/56 ; `test:router` conforme ; `lint:css`, `lint:js` 0 erreur ; `test:all` 4347 ok, 0 FAIL. Site réel (lecture seule, 2026-10-22) : 4 index à 375 et 1440 px, deux variantes : 0 carte, 0 description visible, → de 44 px (mobile) et 32 px (ordinateur) avec nom accessible, fil d'Ariane mobile, aucun débordement ; racine et sous-forum inchangés. Captures : `.tmp/captures/validation-6-1-index-forum/` (hors git).
