---
title: 'Sur le forum, « Envoyer » reste atteignable sous un message ouvert, et accordéons et modales gardent leur peau'
type: 'bugfix'
ticket: 12
created: '2026-10-28'
status: 'built'
baseline_revision: '7e69719023daea54d8e485bbc07b6951dbe38496'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/backlog/story-envoyer-et-panneaux-du-forum-sur-page-derivee.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, la barre d'un message ouvert (z-index 991, 6.5) passe au-dessus de la barre fixe « Envoyer » (z-index 90) quand elle défile dessous (D13). Sur `/forum/*`, les règles du panneau forum (`margin-bottom: 0` de l'en-tête, `padding: 0` du corps) battent celles des accordéons et modales `.panel-default` (D7). Aucune fixture ne porte ces cas.

**Approach:** Deux fragments de `forum-activite` sur pages dérivées en mémoire mesurent les deux cas. La peau est corrigée à l'origine (P1 option 4) : z-index 991 réservé à l'état « voile présent », règles forum gardées par `:where(:not(.panel-group > *, .modal *))`.

## Boundaries & Constraints

**Always:** P1 option 4, aucun nouvel `!important` ; spécificités inchangées (gardes `:where()`) ; mobile `max-width: 767px`, bureau `min-width: 768px` ; cibles ≥ 44 px ; pages dérivées des fixtures seulement ; contre-épreuves `KR_SCRIPT` (bundle de la base et bundles mutés) ; `test:zone -- forum-activite` pendant la boucle ; `test:router` (tests/ change).

**Never:** site réel ; changer l'ordre des actions du message, le « ••• » ou son comportement au-dessus du voile 990 ; toucher `.btn-success` du plateau ni les suites palette-nation, typographie-formes, cartes-pastilles (ticket 13) ; modifier `revue-manuelle.md`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Barre fixe | sujet mobile 375 et 767, formulaire `post_msg` sans `.btn-toolbar` (Envoyer fixe), message ouvert défilé sous la barre | `elementFromPoint` au centre d'« Envoyer » dans « Envoyer » | rouge sur la base 7e69719 attendu |
| Envoyer en flux | même sujet, formulaire avec `.btn-toolbar` (`kr-editor`, Envoyer statique) | centre d'« Envoyer » atteignable après `scrollTo` | — |
| Voile présent | message ouvert + `.dropdown-backdrop` simulé | actions du message au-dessus du voile (comme `plus`) | — |
| Accordéon, modale | `.panel-group > .panel-default` et `.modal .panel-default` sur `/forum/sujet/…`, 375, 767, 768, 1280 | fond, rayon, bordure, marge et retrait de l'en-tête, retrait du corps égaux à la même page servie hors forum | rouge sur la base au mobile |
| Carte du forum | panneaux forum des fixtures | égaux à la base 7e69719 (fragments existants verts) | — |

</frozen-after-approval>

## Code Map

Lignes = `7e69719`.

- `kraland-theme.css` :
  - l.8334-8356 (mobile, bloc `@media (max-width: 767px)` de l.8257) : `body.page-forum .panel-default`, `> .panel-heading`, `> .panel-body` + `body.page-forum-racine .panel-default > .panel-body`, `> .panel-heading h3`. Origine de D7 : (0,3,1) `!important` après l.7852-7874. Ajouter `:where(:not(.panel-group > *, .modal *))` sur `.panel-default` (spécificité égale) ; valeurs inchangées.
  - l.7852-7908 : règles communes accordéon/modale et carte de section. Ne pas changer.
  - l.6831-6896 : `.panel-group` mobile (`.panel-body` 10px 0). Ne pas changer.
  - l.15234-15238 (mobile, bloc de l.15010) : `body.mobile-mode ul.media-list.forum > li.media.kr-msg.kr-msg-open > .media-body > .pull-right { position: relative; z-index: 991 }`. Origine de D13. Préfixer par `body.mobile-mode:has(.dropdown-backdrop)` ; commentaire mis à jour.
  - l.9732-9746 : barre fixe `:where(body.page-kramail-compose, body.page-forum) button.btn-primary.pull-right` (z-index 90). Ne pas changer.
  - l.15407-15426 : Envoyer statique du `form.kr-editor[name="post_msg"]`. Ne pas changer.
- `kraland-userscript-template.js` l.7410-7414 : `enhanceEditors` pose `kr-editor` seulement si le formulaire a `.btn-toolbar`. Lecture seule ; aucun changement JS.
- `tests/e2e/forum-activite.mjs` :
  - en-tête l.1-48 : deux entrées de fragment ;
  - nouveaux fragments `envoyer` et `panneaux` après `ligne` (l.1545), sur le modèle de `plus` (l.1199-1260 : `VOILE`, cible vérifiée par `elementFromPoint`) ;
  - pages dérivées : `forum-sujet.html` + formulaire de `typographie-forum-redaction.html` l.14-23 (avec et sans `.btn-toolbar`) ;
  - `VARIANTES` l.91 réutilisées.
- `tests/e2e/lib/router.mjs` l.98 : ajouter `['envoyer'], ['panneaux']` aux `frags` de `forum-activite`.
- `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` l.27 : fragments ajoutés à la ligne « Activité du forum ».
- `_bmad-output/initiative-harmonisation-ux/deferred-work.md` l.96-97 (D7) et l.150-151 (D13) : ligne `status:` ajoutée.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/forum-activite.mjs` -- écrire `envoyer` et `panneaux` (matrice) ; rouges sur la base (`KR_SCRIPT` = bundle de 7e69719) -- rouge avant.
- [x] `kraland-theme.css` -- les deux corrections de la Code Map -- vert après.
- [x] `tests/e2e/lib/router.mjs`, deux copies du skill -- enregistrer les fragments -- `test:router` vert, `diff -r` vide.
- [x] contre-épreuves -- bundle muté sans `:has(.dropdown-backdrop)` (991 toujours actif) : `envoyer` rouge ; bundle muté où l.7877-7908 perdent leur `:where(:not(…))` : `panneaux` rouge.
- [x] `deferred-work.md` -- statuts D7 et D13.

**Acceptance Criteria:**
- Given le bundle de la base 7e69719, when `envoyer` et `panneaux` tournent, then chacun échoue au mobile.
- Given l'arbre fini, when `forum-activite` complet tourne, then 0 FAIL ; `plus` reste vert sans modification.

## Design Notes

- **Assumption (D13)** : le 991 ne sert qu'au-dessus d'un voile 990 (6.5). Sans voile, la barre ouverte revient au z-index de la base, sous « Envoyer ». Avec voile, « Envoyer » est déjà sous le voile sur la base. Lever « Envoyer » au-dessus de 991 le mettrait au-dessus du voile : un tap enverrait au lieu de fermer le menu. Ce serait un choix produit, écarté.
- **Assumption (D7)** : la référence « hors forum » est la même page dérivée servie à un chemin sans classe `page-*` de `addPageTypeClass` (template l.858-866). Vérifier que seules `page-forum` et ses dérivées diffèrent sur `<body>`.
- Modale : markup statique `.modal.in` (`display: block`) dans la page dérivée, sans appel jQuery.
- Bureau : aucune règle `page-forum` hors `kr-subforum` ; contrôle de non-régression, vert attendu sur la base.

## Verification

**Commands:**
- `npm run build` puis `npm run test:zone -- forum-activite` (`KR_FRAG=envoyer`, `panneaux`, `plus` pendant la boucle) -- 0 FAIL.
- `KR_SCRIPT=<bundle 7e69719> KR_FRAG=envoyer|panneaux` -- FAIL attendus.
- `npm run test:router` ; `npm run lint:css` et `npm run lint:js` séparés -- exit 0.
- `diff -r .hermes/skills .claude/skills` -- vide.

## Implementation Notes

Worktree `kraland-css-wt12` (branche `wt/12`, base 7e69719), non commité.

- `kraland-theme.css` : 4 règles forum mobiles gardées par `:where(:not(.panel-group > *, .modal *))` (titre h3 compris, racine comprise) ; z-index 991 préfixé par `body.mobile-mode:has(.dropdown-backdrop)`. Aucun `!important` ajouté ni retiré.
- `tests/e2e/forum-activite.mjs` : fragments `envoyer` (16 contrôles) et `panneaux` (24 contrôles). `envoyer` : formulaire de `typographie-forum-redaction.html` (via `R.reponse.fixture`) avec et sans `.btn-toolbar`, ajouté au fil de sujet ; message ouvert par `click()` sur « ••• », barre défilée sous « Envoyer » (précondition : centre d'« Envoyer » dans la barre), voile simulé (`VOILE`, `OUVERT` de `plus` réutilisés) et « Envoyer » non touché sous le voile. `panneaux` : accordéon (corps direct et corps repliable) et modale `.modal.in` statique ; forum `/forum/sujet/…` = hors forum `/fixture/hors-forum` (classes de `<body>` hors `page-forum*`/`kr-forum-*` identiques ; seule `kr-forum-sujet` diffère) ; hors forum = bundle 7e69719 ; carte de l'index RP et du sous-forum (375, 767) = 7e69719.
- Markup et sélecteur de `panneaux` dans `lib/variantes.mjs` (`REPERES_PANNEAUX_TICKET12`) : sinon `panel-default` et `modal-content` passaient à 4 suites citantes (MAX_CITING) et `test:router` échouait (« nettoyage (ticket 10) … sous-forum absente »).
- Rouge avant (`KR_SCRIPT=/tmp/kr-base-7e69719.user.js KR_FRAG=envoyer,panneaux`) : 8 FAIL (envoyer fixe 375/767 × 2 variantes : centre -> `DIV.pull-right` ; panneaux 375/767 × 2 : marge d'en-tête 0 au lieu de 12 px, corps 0 au lieu de `10px 0` / 16 px). Vert après : `test:zone -- forum-activite` 929 ok, 0 FAIL.
- Contre-épreuves : `/tmp/kr-mut12-sans-has.user.js` (991 sans `:has`) -> `envoyer` 4 FAIL ; `/tmp/kr-mut12-carte.user.js` (règles de la carte l.7877-7908 sans garde) -> `panneaux` 4 FAIL (contrôle « hors forum égal à la base », ajouté pour cela : la seule égalité forum = hors forum restait verte, la mutation touchant les deux pages).
- Après revue : le contrôle « « Envoyer » sous le voile » passait par construction (voile plein écran à 990 au-dessus de 90). Complété par `SOUS_VOILE` : voile posé, centre du « ••• » du message ouvert (défilé à 200 px du haut) -> barre du message. Contre-épreuve `/tmp/kr-mut12-sans-991.user.js` (règle 991 retirée du bundle) : `envoyer` 8 FAIL (« centre du « ••• » -> DIV.dropdown-backdrop ») ; base 7e69719 toujours 8 FAIL, sans `:has` toujours 4 FAIL. En-tête de la suite : base 6270c81 pour tous les fragments sauf `panneaux` (7e69719). Rejeu : `npm run build`, `lint:css`, `lint:js`, `test:router` exit 0, `diff -r` vide, `test:zone -- forum-activite` 929 ok, 0 FAIL.
- Non-régression : `test:zone -- forum sous-forum cartes-pastilles` puis `messages kramail typographie-formes` verts ; `test:router`, `lint:css`, `lint:js` exit 0 ; `diff -r .hermes/skills .claude/skills` vide.

## Plan Change Log

- 2026-10-28 : `tests/e2e/lib/variantes.mjs` modifié, hors Code Map. (1) `REPERES_PANNEAUX_TICKET12` (routeur, MAX_CITING). (2) `REGLES_FORUM_TICKET52` : sélecteurs mis à la garde (`GARDE_TICKET12`) ; le contrôle statique `cartes-pastilles#forum` cherche le sélecteur sérialisé exact et échouait (« body.page-forum .panel-default absente »). Le fichier de suite `cartes-pastilles.mjs` n'est pas touché ; conflit possible avec le ticket 13 s'il modifie la même zone de `variantes.mjs`.
- 2026-10-28 (revue) : contrôle du voile de `envoyer` rendu dépendant de la règle 991 (centre du « ••• » au-dessus du voile) ; libellé du bundle de base de l'en-tête corrigé.
- 2026-10-28 : contrôle « accordéon et modale hors forum égaux à la base » ajouté à `panneaux` pour que la 2e contre-épreuve du plan soit rouge.

## Review Triage Log

## Notes

- Estimation : ~10 lignes CSS, ~180 lignes de test, ~6 lignes ailleurs.
- Doute : sur un vrai sujet, le formulaire a sa barre d'outils, donc « Envoyer » est statique au mobile (l.15407). Le cas fixe ne vaut que pour un formulaire sans barre ou avant `enhanceEditors`. S'il s'avère inatteignable, le consigner, sans retirer le contrôle.
- Doute : `.table` dans un accordéon d'une page forum prendrait encore les cartes de ligne (l.8362+, garde `html:not(.kr-page-forum-index)`). Hors périmètre ; à consigner si observé.
- Conflits : le ticket 13 touche `kraland-theme.css` l.860-940, 2391-2416, 5242, 12537 ; ce ticket touche l.8334-8356 et l.15234-15238. Le fichier est commun, mais les zones sont disjointes. Le bundle et `version.json` sont à reprendre au rebase.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | tests/e2e/forum-activite.mjs:1827 | `sous === false` sous voile passe par construction (voile 990 au-dessus d'« Envoyer » 90) | réel | patch (fixed) | voile simulé en dernier enfant de body, plein écran |
| 2 | quick | tests/e2e/forum-activite.mjs:58 | En-tête annonce la base 6270c81 pour tous les fragments ; `panneaux` utilise 7e69719 | réel | patch (fixed) | `COMMIT_PANNEAUX` |
| 3 | quick | kraland-theme.css:15237 | La barre ne monte en 991 que sous `.dropdown-backdrop` | voulu | none | Design Notes, Assumption 1 ; le voile capte le tap |

## Result

- Revue quick : 3 constats bas ; 1 et 2 corrigés, 3 voulu par le plan (voir Review Triage Log).
- Construit dans le worktree `wt/12` (commit 5654d10), fusionné dans `feature/next` après les backlogs 13 et 9 : conflit `tests/e2e/lib/variantes.mjs` résolu en gardant les deux blocs (13 et 12) ; bundle et `version.json` repris de la base puis régénérés ; patch source inchangé.
- `test:all` après fusion : 13832 ok, 0 FAIL en 348 s, machine calme.
- `lint:css`, `lint:js`, `test:router` verts ; `!important` 3281 ; copies de skills identiques.
- Doute pour Arnaud : sur un vrai sujet, le formulaire a sa barre d'outils, donc « Envoyer » n'est pas en barre fixe au mobile ; le cas fixe testé est peut-être marginal.
