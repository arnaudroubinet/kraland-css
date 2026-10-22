---
title: "L'index du forum reprend la présentation du sous-forum"
type: 'feature'
ticket: '1'
created: '2026-10-22'
status: 'in-progress'
baseline_revision: '81512a3a4a0adb59958ddf955e203a7d44941b0e'
route: 'full'
route_source: 'auto'
risk: 'high'
review: ''
review_source: ''
lenses_ran: []
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
- [ ] fixtures `forum-index-rp.html` (réécrite) et `forum-index-communaute.html` -- structure réelle, cas « forum sans message », auteur avec `img.icon`, description avec `<u>`, deux modérateurs -- base des tests
- [ ] `tests/e2e/forum-index.mjs` + routeur -- suite rouge d'abord, une vérification par ligne de la matrice, à 375, 767, 768 et 1440 px, Kraland clair et Empire Brun sombre
- [ ] `kraland-userscript-template.js` -- classe `kr-page-forum-index` sur `html` pour les 4 index ; exclusion de l'index dans `ForumCards` et `PermanentTopics:Icons` ; marquage minimal des cellules et ajouts de texte (unités, « Dernier : ») sur le modèle de `MobileStats`
- [ ] `kraland-theme.css` -- index exclu de v1/v2 par `:where(html:not(.kr-page-forum-index))` ou retrait des règles qui ne servent qu'à l'index ; nouvelle section gardée `:where(html.kr-page-forum-index)`, ordinateur et mobile, sur le modèle L1, L2, L3, L6
- [ ] `jeu-identite.mjs`, `sous-forum.mjs` -- contrôles de l'index mis à jour vers la nouvelle présentation ; racine inchangée
- [ ] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given un index à 375 px, when la page s'affiche, then aucun élément ne déborde horizontalement et les cartes `.forums-cards-container` n'existent plus
- Given la racine `/forum` et un sous-forum, when ils s'affichent, then leur rendu et leurs tests actuels sont inchangés
- Given le thème désactivé, when un index s'affiche, then la page native est intacte

## Implementation Notes

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
