---
title: "Membres et fenêtre d'aide : marge de 16 px et cibles de 44 px"
type: 'feature'
ticket: '13'
created: '2026-10-29'
status: 'built'
baseline_revision: '034a820fd0954da3ff3f87205b80df6889521764'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** en mobile, la page Membres (`/communaute/membres`, fiche du compte connecté en édition) garde des liens `span.btn-group-xs > a.btn` de 34 px de large, et la fenêtre d'aide (`/help`, `/help/<partie>`, ouverte par `openHelp`) n'a aucune classe de page : texte à 0 px du bord, liens de tableau de `/help/staff` de 30 à 42 px de large.

**Approach:** déclarer `/help` dans `KR_PAGE_CLASSES` (classes `kr-page-aide-fenetre kr-marge-mobile`) pour reprendre la marge de l'entrée 1, poser les `.well` de `/help/staff` à 8 px des bords comme une carte de section, et porter à 44 px de large les liens de tableau des `.well` de la fenêtre d'aide et les liens `.btn-group-xs > .btn` de `#myTabContent` des Membres, sous leur garde de page.

## Boundaries & Constraints

**Always:** correction à l'origine ; aucun `!important` nouveau ; gardes `:where(html.x)` ; mobile en `(max-width: 767px)` ; cibles ≥ 44 × 44 par la boîte et par elementFromPoint ; seuils 767, 768 et 769 ; fixtures synthétiques tirées des relevés du 2026-10-28 (Annexe C) et du 2026-10-29 (releve-membres) ; à 768, 769 et 1280 px, textes égaux au bundle de base 034a820.

**Never:** marge de `/help` sur ordinateur (non reproductible sur fixture : texte à 15 px, contre 0 px relevé) ; liens au fil du texte (`p > a`, `pre > a`, H9.1) ; autres `.btn` que `.btn-group-xs > .btn` des Membres (épopée 4) ; police ; modales ; site réel.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Membres | `/communaute/membres`, 320 / 375 / 767 px, Kraland clair et Empire Brun sombre | classes inchangées (`kr-page-members kr-page-secondaire kr-marge-mobile`) ; texte ≥ 16 px ; cartes à 8 px ; `.btn-group-xs > .btn` ≥ 44 × 44 aux cinq points ; aucun débordement | No error expected |
| Aide | `/help`, mêmes largeurs et variantes | classes `kr-page-aide-fenetre kr-marge-mobile` ; texte ≥ 16 px hors `pre` défilant ; aucun débordement | No error expected |
| Aide Staff | `/help/staff`, mêmes largeurs et variantes | texte ≥ 16 px ; `.well` à 8 px des bords ; `td > a` ≥ 44 × 44 aux cinq points | No error expected |
| Bureau et seuil | les trois pages à 768, 769 et 1280 px ; bascule 767 → 768 → 767 et 768 → 767 → 768 sur `/help/staff` | textes égaux au bundle de base à ≥ 768 px ; marge et cibles à 767 px | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.307 `KR_PAGE_CLASSES` (bloc pur `identite`) -- ajouter `/^\/help(?:\/|$)/` ; `applyVariant` (l.3730) bascule déjà toute classe déclarée. `kr-page-members` vient d'`isMembers` (l.3718, l.8139) : ne pas toucher.
- `kraland-theme.css` « MARGE MOBILE » (l.6949, dans `@media (max-width: 767px)` ouvert l.6923) -- la règle `body.mobile-mode > .container > .row` donne la marge à `#content.container > .row` de `/help` sans ajout. Ajouter après « PAGES SECONDAIRES » (l.6962-7003) un bloc « FENÊTRE D'AIDE ET MEMBRES ».
- Précédents : retrait des cartes `calc(var(--kr-space-2) - var(--kr-marge-page, 0px))` (l.8065) ; `td > a … min-width: var(--mobile-touch-target)` (l.6971). « PHASE 5 » (l.4777) donne déjà 44 px de haut et `inline-flex` centré aux `a` et `.btn` : seule la largeur manque.
- `tests/e2e/fixtures/secondaires-membres.html`, `aide-fenetre.html`, `aide-fenetre-staff.html` -- fixtures synthétiques (écrites, en-têtes sourcés).
- `tests/e2e/confort-mobile.mjs` -- nouveau fragment `membres-aide` ; réutiliser `ouvrir`, `ETAT`, `RELEVE`, `controlerMarge`, `CIBLE_PAGE` / `ecartsCible`, `premierEcart`. Base propre au fragment : `034a820` (contient 9.4), sans toucher `COMMIT_AVANT`.
- `tests/e2e/lib/router.mjs` -- fragment `membres-aide` ; le mot-clé `kr-page-aide` couvre déjà `kr-page-aide-fenetre`.
- `tests/unit/identite.test.mjs` l.25-26 -- `/help` sort de la liste vide ; `/help`, `/help/staff` attendus ; `/helpers` vide.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- entrée `/help` dans `KR_PAGE_CLASSES` -- marge 9.1.
- [x] `kraland-theme.css` -- `.well` de la fenêtre d'aide à 8 px, `td > a:not(.btn)` de la fenêtre d'aide et `.btn-group-xs > .btn` des Membres à 44 px de large.
- [x] `tests/unit/identite.test.mjs` -- chemins `/help`.
- [x] `tests/e2e/confort-mobile.mjs`, `tests/e2e/lib/router.mjs` -- fragment `membres-aide` (matrice entière), routage.
- [x] Suites sœurs qui mesurent ces pages ou ces sélecteurs : vérifier, masquer seulement l'écart propre à 9.13, masque inactif dès que la base porte `kr-page-aide-fenetre`.

**Acceptance Criteria:**
- Given le bundle de base 034a820, when `KR_FRAG=membres-aide` tourne, then les contrôles de marge et de cibles échouent ; given le bundle 9.13, then tout passe.
- Given une mutation retirant l'une des trois règles CSS, when le fragment tourne, then le contrôle correspondant échoue.

## Implementation Notes

- Implémentation directe par l'agent de construction (consigne du coordinateur : agent dédié, pas de re-délégation), plan approuvé en mode autonome.
- Suites sœurs : aucune autre suite ne charge `/help` ni `/communaute/membres` ; aucun masque nécessaire.
- Contre-épreuves (copies du bundle dans /tmp, rien dans le dépôt) : règle `.btn-group-xs` retirée → 6 FAIL (cibles Membres) ; règle `td > a` retirée → 6 FAIL (cibles Staff) ; règle `.well` retirée → 12 FAIL (cartes Staff et bascule) ; entrée template sans `kr-marge-mobile` → 30 FAIL.

## Plan Change Log

- 2026-10-29, revue indépendante (revue 2) et relevé releve-aide du coordinateur : « liste des Membres » devient « page Membres, fiche du compte connecté en édition » (Intent, sur consigne du coordinateur ; titre du ticket inchangé, décision d'Arnaud). Règles de cibles restreintes à `.well td > a` et `#myTabContent .btn-group-xs > .btn` ; fixtures recalées sur le relevé ; contrôles ajoutés (plafond de 24 px, bascule Membres, hors périmètre). Points 1 et 2 de la revue (fidélité de `/help` au bureau, parent de `#content`) non traités : relevé séparé du coordinateur. KEEP : classes `kr-page-aide-fenetre kr-marge-mobile`, `.well` à 8 px, aucune règle bureau.

## Review Triage Log

| # | Finding (quick) | Verdict | Route | Evidence |
|---|-----------------|---------|-------|----------|
| 1 | `td > a:not(.btn)` et `.btn-group-xs > .btn` sans exclusion `.modal` (Never : modales) | medium | patch | Les règles voisines (PAGES SECONDAIRES) portent `:where(:not(.modal *))` ; les modales BBCode du userscript ont des `.btn-group-xs`. Ajouté `:where(:not(.modal *))` aux deux règles (spécificité inchangée). |
| 2 | `kr-page-members` couvre aussi `/communaute/membres/<slug>` | maybe-false | reject | `isMembers` teste le préfixe ; aucune trace relevée de `.btn-group-xs` sur une fiche ; si présent, l'effet est un agrandissement à 44 px conforme à l'épopée (low). Noté dans revue-manuelle. |
| 3 | `td > a:not(.btn)` sans filtre sur tout `/help/*` : lien court au fil d'une cellule élargi | low | reject | `min-width` n'agit que sous 44 px ; aucune partie relevée n'a de lien inséré dans une phrase de cellule ; le filtre ajouterait une garde. |
| 4 | Bascule `/help/staff` : cibles non mesurées aux étapes 767 | medium | patch | Matrice « marge et cibles à 767 px ». `parcours` prend un paramètre `sels` et mesure `CIBLE_PAGE` ; contrôle ajouté aux étapes < 768. |
| 5 | `kr-page-members` jamais contrôlée | low | patch | Matrice « classes inchangées (kr-page-members …) ». Contrôle `m.membres` ajouté (vrai sur Membres, faux sur l'aide) sans toucher la liste d'ETAT partagée. |
| 6 | AC 1 : la marge de Membres passe déjà sur la base | false | reject | L'AC porte sur le fragment entier, qui échoue sur la base (42 FAIL) ; Membres a `kr-marge-mobile` depuis 9.4. |

### Revue 2 (revue indépendante, correctifs mineurs du coordinateur)

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | Règle des cibles de l'aide trop large (`td > a` hors `.well`) | corrigé | `.well td > a:not(.btn)` ; contrôle hors périmètre `aide-hors-well` (largeur égale à la base) : 8 FAIL avant, vert après |
| 2 | Règle des Membres touche les fiches `/communaute/membres/<slug>` | corrigé | `#myTabContent .btn-group-xs > .btn` (le relevé confirme : fiche d'un autre membre sans `#myTabContent` ni `.btn-group-xs`) ; contrôle `fiche-membres` : rouge avant (dans les 8 FAIL), vert après |
| 3 | Commentaire « MARGE MOBILE » incomplet | corrigé | pages secondaires (9.4) et fenêtre d'aide (9.13) citées ; non testable |
| 4 | Fixture Staff : en-tête avec lien, 7 lignes partout | corrigé | 1re ligne = un seul `th` sans lien ; lignes/liens 7/5, 4/2, 3/2, 11/10, 7/6 (25 liens), selon le relevé |
| 5 | Fixture Membres : 42 px sur la base au lieu de 34 | corrigé | structure du relevé (fiche du compte en édition, 7 boutons `fa-edit`), padding 8px et icône de 16 px en ligne : 34 px sur la base, 44 après |
| 6 | Bascule sans la page Membres | corrigé | `casS` couvre `aide-staff` et `membres` ; contre-épreuve : règle Membres retirée, 6 FAIL de bascule |
| 7 | Pas de plafond de marge dans les `.well` | corrigé | premier texte de chaque `.well` à 24 px au plus ; contre-épreuve : règle `.well` retirée, 6 FAIL de plafond |
| R1 | Fidélité de `/help` au bureau | corrigé | relevé releve-aide du 2026-10-29 ; fixtures recalées sur le relevé releve-aide (`#content` padding-left 0, `.row` margin-left 0) |
| R2 | Parent de `#content` | levé | relevé releve-aide du 2026-10-29 : `#content.container` enfant direct de `body` sur `/help` et `/help/staff`, conforme aux fixtures |

## Design Notes

- Classe neuve `kr-page-aide-fenetre` plutôt que `kr-page-aide` : gabarit distinct (`/aide` a `#col-left`/`#col-right`) ; `kr-page-secondaire` apporterait des règles de cibles sans objet ici.
- `.well` à 8 px : même retrait que les cartes de section (H4.1) ; sans lui, les `.well` passent à 16 px et leur texte à 32 px, 40 px dans les cellules. Premier texte à 24 px au plus (plafond contrôlé).
- `/communaute/membres` est la fiche du compte connecté en édition (relevé releve-aide) ; ses boutons d'édition sont dans `#myTabContent`, absent des fiches des autres membres.

## Verification

**Commands:**
- `npm run build`, `npm run lint:css`, `npm run lint:js` -- code 0.
- `npm run test:unit`, `npm run test:router` -- verts.
- `KR_FRAG=membres-aide KR_SCRIPT=/Users/arnaud/IdeaProjects/kraland-css/kraland-userscript-main.user.js node tests/e2e/confort-mobile.mjs` -- rouge ; sans KR_SCRIPT -- vert.
- `npm run test:zone -- confort-mobile <suites qui mesurent ces pages>` -- vert.

## Result

- Statut : `in-review` (arrêt demandé par le coordinateur ; ni `built` ni commit).
- Revue quick : 6 constats ; 3 corrigés (exclusion `.modal` sur les deux règles de cibles, cibles mesurées aux étapes 767 de la bascule, contrôle de `kr-page-members`), 3 rejetés (voir Review Triage Log). Aucun report dans `deferred-work.md`.
- Après correctifs : `npm run build` VALIDATION PASSED ; `lint:css` 0 ; `lint:js` 0 (1 avertissement préexistant) ; `test:unit` 57/0 ; `test:router` conforme ; `KR_FRAG=membres-aide` vert 124 ok / 0 FAIL ; sur le bundle de base 034a820 rouge 76 ok / 48 FAIL.
- `test:zone` large (confort-mobile, kramail, typographie-formes, cartes-pastilles, palette-nation, images, initialisation, messages) avant les correctifs de revue : 10007 ok / 0 FAIL ; après : `test:zone -- confort-mobile typographie-formes` 5169 ok / 0 FAIL.
- Contre-épreuves (bundles mutés dans /tmp) : règle `.btn-group-xs` retirée 6 FAIL ; `td > a` retirée 6 FAIL, puis 12 avec la bascule ; `.well` retirée 12 FAIL ; template sans `kr-marge-mobile` 30 FAIL ; `kr-page-members` non posée 12 FAIL.
- `!important` : 3203, comme la base.
- Revue 2 (correctifs mineurs, relevé releve-aide intégré) : `KR_FRAG=membres-aide` vert 168 ok / 0 FAIL ; base 034a820 114 ok / 54 FAIL ; avant les restrictions, 8 FAIL hors périmètre ; contre-épreuves : règle `.well` retirée 18 FAIL (dont 6 de plafond), règle Membres retirée 12 FAIL (dont 6 de bascule). `test:zone -- confort-mobile typographie-formes` 5213 ok / 0 FAIL ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 ; `npm run build` VALIDATION PASSED ; `test:unit` 0. Statut maintenu `in-review`.

Clôture (orchestrateur, 2026-10-29) : revue 2 faite, correctifs appliqués, commité (`5916cab`, relevé en `034a820`) et fusionné sur `feature/next` (`be44760`) ; `test:all` avant fusion : 16150 ok, 0 FAIL, journal `/private/tmp/kr-testall-913.log` (03:14, arbre déduit de l'heure). Le Result ci-dessus (« in-review », « ni built ni commit ») décrit l'état d'avant la fusion.
