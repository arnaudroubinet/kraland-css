---
title: 'Forum mobile : marge de 16 px et cibles de 44 px sur toutes les pages du forum'
type: 'feature'
ticket: '8'
created: '2026-10-29'
status: 'built'
baseline_revision: '724c5c11a5242d164000fc5616057bbc8e3938e4'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** en mobile, les pages du forum (index RP, HRP, Communauté, Débats, sous-forum, sujet, réponse, nouveau sujet, réponse refusée « Sujet Bloqué ! ») collent une partie de leur texte au bord : pied de page à 0 px, ligne « Par … » du sujet à 0-12 px, titres de l'index et du sous-forum, libellés du formulaire de rédaction à 12 px, messages en pleine largeur, alerte de réponse refusée qui déborde (scrollWidth 380 à 375 px, croix hors écran). Quelques cibles hors bouton restent sous 44 px de large (lien du fil d'Ariane mobile, nom de l'auteur d'un message, croix d'alerte).

**Approach:** classe de page `kr-page-forum` (KR_PAGE_CLASSES) sans `kr-marge-mobile` (les en-têtes du forum portent déjà 16 px, la marge de ligne les doublerait) ; règles ciblées sous `:where(html.kr-page-forum)` qui passent par le jeton `--kr-marge-page` de l'entrée 1, pour que SANS_MARGE_PAGE ramène les suites sœurs à la base ; croix d'alerte en 44 × 44 ; mesures dans `forum-activite.mjs`, fragment `confort`.

## Boundaries & Constraints

**Always:** réécriture à l'origine ; aucun `!important` nouveau ; garde de page `:where(html.x)` ; mobile en `(max-width: 767px)`, ordinateur en `(min-width: 768px)` ; cibles ≥ 44 × 44 ou ligne entière touchable (elementFromPoint) ; fixtures synthétiques ; à 768 et 1280 px, texte égal au bundle de base 724c5c1 ; toute règle commune avec le kramail reste gardée sur le forum.

**Never:** taille de police ; boutons `.btn` (épopée 4) ; liens au fil du texte (exception H9.1) ; structure ou style de l'en-tête L2 du sous-forum au-delà de la marge et des cibles (7.3 en parallèle) ; kramail ; Contacts (`/contacts`) ; site réel ; structure inventée sans source.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Marge | index RP, HRP, Communauté, Débats, racine, sous-forum, sujets, réponse, nouveau sujet, réponse refusée ; 320 / 375×667 / 767 px ; Kraland clair et Empire Brun sombre | classe `kr-page-forum`, pas `kr-marge-mobile` ; texte hors défilant ≥ 16 px des bords (texte coupé par ellipse : mesuré à son conteneur) ; aucun débordement | No error expected |
| Cibles | fil d'Ariane mobile, auteur d'un message, croix d'alerte | ≥ 44 × 44 aux cinq points, ou ligne de 44 px touchable | No error expected |
| Alerte | index « Bienvenue », réponse refusée « Sujet Bloqué ! » | croix 44 × 44 dans le coin, glyphe et texte ≥ 16 px des bords | No error expected |
| Bureau | mêmes pages à 768 et 1280 px | textes égaux au bundle de base | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.307 `KR_PAGE_CLASSES` -- entrée `/forum` et `/forum/*` hors `/forum/staff[/…]` : `kr-page-forum` (sans `kr-marge-mobile`).
- `kraland-theme.css` bloc mobile « PAGES SECONDAIRES » (~l.6923) -- bloc « FORUM » : jeton `--kr-marge-page` sur le forum, pied, `.forum-top` hors `.forum-thread-top-bottom`, `h1.page-header` hors `.forum-thread-heading`, formulaire `form.editeur-text` (les `.col-sm-*` ont marge et padding `0 !important` : le décalage passe par le formulaire), messages `li.media` en carte à 8 px, `min-width` 44 du fil d'Ariane et de l'auteur.
- `kraland-theme.css` alerte de l'index (~l.14690) -- réserve 35 -> 44 px (déclaration `!important` existante), croix 44 × 44 en absolu.
- `kraland-theme.css` `@media (max-width: 359px)` -- libellé `kr-message-row` verrouillé (`padding: 0 !important`) : `text-indent`.
- `tests/e2e/forum-activite.mjs` -- fragment `confort`, base `KR_SCRIPT_AVANT_CONFORT` (724c5c1) ; `PAGES.hrp` et `PAGES.debats` sur les nouvelles fixtures.
- `tests/e2e/confort-mobile.mjs` -- sous-forum et index RP sortent du hors-périmètre.
- `tests/e2e/lib/router.mjs` -- fragment, mot-clé `kr-page-forum`, nouvelles fixtures.
- `tests/unit/identite.test.mjs` -- krPageClasses.
- Fixtures : `forum-index-hrp.html`, `forum-index-debats.html`, `forum-nouveau-sujet.html`, `forum-reponse-bloquee.html`.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- entrée `kr-page-forum`.
- [x] `kraland-theme.css` -- bloc FORUM, alerte, ≤ 359 px.
- [x] Fixtures synthétiques HRP, Débats, nouveau sujet, réponse refusée.
- [x] `tests/e2e/forum-activite.mjs` -- fragment `confort` ; masques des fragments existants conditionnés à une base sans `kr-page-forum`.
- [x] `tests/e2e/lib/router.mjs`, `tests/unit/identite.test.mjs`, `tests/e2e/confort-mobile.mjs`.
- [x] Suites sœurs comparées à une base : `typographie-formes.mjs`, `forum-index.mjs`, `cartes-pastilles.mjs`, `kramail-theme.mjs` ; `lib/marges.mjs` (option `rogne`), `lib/variantes.mjs` (repères).

**Acceptance Criteria:**
- Given le bundle de base 724c5c1, when `KR_FRAG=confort` tourne, then il échoue ; given le bundle 9.8, then il passe.

## Implementation Notes

- Approche (b) retenue : l'essai de `kr-marge-mobile` sur le forum doublait les marges de 16 px déjà portées par les en-têtes (32 px).
- Toute marge passe par `--kr-marge-page` : SANS_MARGE_PAGE la rend invalide, la propriété retombe à 0, comme la base.
- `.col-sm-*` (marge et padding `0 !important`) et `.form-group` (padding 12 `!important`) : le décalage des libellés vient d'un padding `calc(marge - 12px)` du formulaire.
- Repères littéraux du fragment `confort` dans `lib/variantes.mjs` (`REPERES_CONFORT_ENTREE8`) : cités en clair dans la suite, `panel-default` et d'autres jetons passaient le seuil de 3 suites et devenaient transverses (test:router rouge).
- `TEXTES_HORS_MARGE_PAGE` reçoit l'option `rogne` : le texte coupé par un ancêtre à débordement non visible (ellipse des titres) est borné à cet ancêtre.
- Liens étirés (le `::after` du nom couvre la ligne de l'index) : acceptés si la ligne fait ≥ 44 px et répond aux trois points sondés.
- Masques conditionnés au marqueur `classes:["kr-page-forum"]` du bundle de base (inactifs contre le bundle 9.8) : forum-activite `fil` (réponse, SANS_MARGE_PAGE) ; typographie-formes `nettoyage` (`MASQUE_FORUM_98` des deux côtés sur sous-forum, racine et sujet : `min-width: 0` du fil d'Ariane et de l'auteur, alerte masquée) ; forum-index `hors-perimetre` (classe ignorée ; sous 768 px, hors Staff, SANS_MARGE_PAGE, `min-width: 0`, alerte retirée) ; cartes-pastilles `forum` (`min-width: 0` de l'auteur, fragment forum seul). Chacun porte la consigne de retrait.
- Staff exclu (revue C1) : plus de masque ni d'assouplissement pour Staff ; l'index Staff est comparé brut à la base dans forum-activite `ligne`, forum-index `hors-perimetre`, typographie-formes `nettoyage` et cartes-pastilles `forum` (largeur défilable égale à la base, 380 px à 375).
- Changement permanent : kramail-theme `lecture` mesure le message de forum de référence avec SANS_MARGE_PAGE sur mobile (lié à D3).
- Croix (revue C4, C5) : contrôlée sur toute page qui en porte une, présence exigée sur rp, hrp, debats, racine (forum-racine-groupes), bloque ; boîte dans le coin haut droit de l'alerte à 1 px près. Variante en mémoire `rpDecale` (bloc de 40 px avant l'alerte) : sans elle, l'alerte est le premier enfant de #col-right positionné et la contre-épreuve ne mord pas.
- Couplage (revue C7) : `calc(var(--kr-marge-page) - 12px)` du formulaire suit le padding mobile de 12 px des `.form-group`, signalé en commentaire.

## Assumptions

- A1 : implémentation faite directement par l'agent (pas de sous-agent implémenteur), le mandat étant autonome et borné.
- A2 : le forum ne reçoit pas `kr-marge-mobile` ; seules les pièces qui collaient au bord reçoivent la marge.
- A3 : messages en carte à 8 px sur le forum seulement ; la lecture du kramail, qui partage les règles `li.media.kr-msg`, est inchangée.
- A4 : réserve de l'alerte de l'index portée de 35 à 44 px pour la croix 44 × 44.
- A5 : nouveau sujet : relevé hors connexion seulement ; champ Tags absent de la fixture, faute de relevé.
- A6 : réponse refusée « Sujet Bloqué ! » (erreur 158) reproduite d'après le relevé 9.3, sur la base de forum-sujet-staff.html.
- A7 : recherche et modération du forum : absentes du relevé réel et de 9.3, aucune fixture, aucune structure inventée.
- A8 : Staff hors de l'entrée 8 (`epic-plateau-confort-mobile.md` l.65) : la catégorie `/forum/staff[/…]` ne reçoit pas `kr-page-forum` ; un sujet Staff (`/forum/sujet/…`) ne se distingue pas par son chemin et reçoit la classe comme tout sujet.
- A9 : Contacts exclu (`/contacts` ne reçoit pas `kr-page-forum`).

## Doutes

- D1 : écart au ticket : recherche et modération non couvertes faute de relevé, à acter par Arnaud (A7).
- D2 : Tags non couvert, faute de relevé (A5).
- D3 : messages en carte à 8 px sur le forum mais pas dans la lecture du kramail : écart visuel entre les deux (A3). Le contrôle `lecture` de kramail-theme mesure la référence du forum sans marge de page : lié à D3 ; à revoir si les cartes à 8 px s'étendent au kramail.
- D4 : réserve de l'alerte 35 -> 44 px (A4) sur tout le forum sauf Staff. `epic-plateau-confort-mobile.md` l.65 : « Staff (chevron natif de 10×14 px, croix d'alerte hors écran, report 5.2) reste hors de l'entrée 8 tant que l'alignement de Staff attend Arnaud. » Staff exclu, à trancher par Arnaud avec l'alignement de Staff.
- D5 : pas de `kr-marge-mobile` sur le forum (A2).
- D6 : restent sous 44 px hors périmètre : `.btn`, lien au fil du texte, libellés sans contrôle, liens d'auteur recouverts par la ligne touchable.
- D7 : sous 360 px, libellé « Message » décalé par `text-indent` (padding verrouillé en `!important`).
- D8 : masques et un changement permanent des suites sœurs (voir Implementation Notes).

## Plan Change Log

## Review Triage Log

- Revue rapide 9.8 (coordinateur, 2026-10-29) :
  - C1 corrigé : Staff (`/forum/staff[/…]`) sans `kr-page-forum`, donc hors règle d'alerte et de croix ; `sStaff` retiré du fragment `confort` ; masque `ligne` et assouplissement de cartes-pastilles retirés ; index Staff égal à la base.
  - C2 corrigé : champ Tags retiré de `forum-nouveau-sujet.html`.
  - C3 corrigé : commentaire de kramail-theme `lecture` et D3.
  - C4 corrigé : croix dans le coin haut droit de l'alerte (1 px) ; contre-épreuve sans `position: relative` sur l'alerte, avec la variante `rpDecale` : 6 FAIL.
  - C5 corrigé : croix contrôlée sur toute page qui en porte une, racine comprise.
  - C6 : rebase traité à la fusion par le coordinateur.
  - C7 corrigé : couplage `calc(... - 12px)` et padding des `.form-group` commenté.
  - D1 corrigé : écart au ticket acté dans revue-manuelle.
  - Masques acceptés ; D5 à D8 acceptés.

## Verification

**Commands:**
- `npm run build`, `npm run lint:css`, `npm run lint:js` -- codes de sortie 0.
- `npm run test:unit`, `npm run test:router` -- verts.
- `KR_FRAG=confort KR_SCRIPT=/tmp/kr98/base.user.js node tests/e2e/forum-activite.mjs` -- rouge ; sans KR_SCRIPT -- vert.
- `npm run test:zone -- forum forum-activite sous-forum menus-forums messages typographie-formes palette-nation cartes-pastilles confort-mobile kramail` -- verts ou FAIL attribués.

## Result

**Fichiers modifiés :** `kraland-userscript-template.js`, `kraland-theme.css`, `kraland-userscript-main.user.js` et `version.json` (générés par `npm run build`), `tests/unit/identite.test.mjs`, `tests/e2e/forum-activite.mjs`, `tests/e2e/confort-mobile.mjs`, `tests/e2e/typographie-formes.mjs`, `tests/e2e/forum-index.mjs`, `tests/e2e/cartes-pastilles.mjs`, `tests/e2e/kramail-theme.mjs`, `tests/e2e/lib/marges.mjs`, `tests/e2e/lib/variantes.mjs`, `tests/e2e/lib/router.mjs`, `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md`.
**Fichiers créés :** fixtures synthétiques `tests/e2e/fixtures/forum-index-hrp.html`, `forum-index-debats.html`, `forum-nouveau-sujet.html` (sans champ Tags), `forum-reponse-bloquee.html` ; ce plan. `node_modules` : lien symbolique non suivi, intact.
**`!important` dans `kraland-theme.css` :** 3203 avant (724c5c1), 3203 après.

**Preuve rouge puis vert (fragment `confort`, après les correctifs de revue) :**
- `KR_FRAG=confort KR_SCRIPT=/tmp/kr98/base.user.js node tests/e2e/forum-activite.mjs` : 288 FAIL.
- `KR_FRAG=confort node tests/e2e/forum-activite.mjs` : 456 ok, 0 FAIL.
- Contre-épreuve 1 : règle du pied de page retirée puis build : 84 FAIL (« citation du pied de page » à 0 px) ; restaurée, vert.
- Contre-épreuve 2 (C4) : `position: relative` retiré de l'alerte puis build : 6 FAIL, tous sur `rpDecale` (« croix 276,131,320,175 hors du coin haut droit de l'alerte 0,171,320,217 ») ; restauré, rebuild, vert.
- Masques des suites sœurs inactifs contre le bundle 9.8 (marqueur présent dans `/tmp/kr98/v98.user.js`, absent de la base) : forum-index `hors-perimetre`, cartes-pastilles `forum` et typographie-formes `nettoyage` verts avec le bundle 9.8 en base (passe d'avant la revue).

**Après les correctifs de revue (premier plan, `npm run build` 0) :**
- forum-activite `KR_FRAG=confort`, `ligne`, `fil`, `seuil` : verts.
- cartes-pastilles `KR_FRAG=forum`, forum-index `KR_FRAG=hors-perimetre` (Staff sans masque), kramail-theme `KR_FRAG=lecture` (30 ok), typographie-formes `KR_FRAG=nettoyage` : verts.
- confort-mobile (tous fragments) : vert.
- `npm run lint:css` 0 ; `npm run lint:js` 0 (seul avertissement préexistant `report-non-lu.mjs` no-loop-func) ; `npm run test:unit` 0 ; `npm run test:router` 0 (« Routeur conforme ») ; `diff -r .hermes/skills .claude/skills` vide.

**test:zone avant la revue** (`forum forum-activite sous-forum menus-forums messages typographie-formes palette-nation cartes-pastilles confort-mobile kramail`) : 12850 ok, 13 FAIL, machine chargée par un test:all concurrent. Attribution, chaque FAIL rejoué seul :
- `palette-nation#etats-largeurs` (1) : vert rejoué seul, faux FAIL de charge.
- `kramail-redaction#regression` (12) : rouge aussi avec `KR_SCRIPT=/tmp/kr98/base.user.js`, vert avec `KR_SCRIPT_AVANT=/tmp/kr98/base.user.js` ; sa base par défaut `origin/feature/next` a dépassé 724c5c1 : hors 9.8.
- `kramail-redaction#clavier+reseau` (1, passe précédente) : vert rejoué seul.
- test:zone non rejoué après la revue : les fragments touchés sont rejoués un à un ci-dessus.

**Doutes :** D1 à D8 ci-dessus, recopiés dans `revue-manuelle.md` (section « Ticket 9.8 »).

Clôture (orchestrateur, 2026-10-29) : revue quick du coordinateur faite, commité (`01a8aae`) et fusionné sur `feature/next` (`49d31df`) ; `test:all` avant fusion : 16931 ok, 1 FAIL `demarrage-mobile` (faux FAIL de charge présumé), journal `/private/tmp/kr-testall-98.log` (03:57, arbre déduit de l'heure). Doutes D1 à D8 en attente d'Arnaud (numérotés hors du schéma D9.n).
