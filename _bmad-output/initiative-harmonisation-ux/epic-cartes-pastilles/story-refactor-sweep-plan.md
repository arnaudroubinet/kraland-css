---
title: 'Refactor sweep'
type: 'refactor'
ticket: '6'
created: '2026-10-24'
status: 'built'
baseline_revision: 'ca73215ae5591aa018457916cfce887df274d01e'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-refactor-sweep-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-refactor-sweep-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
  - 'tests/e2e/lib/router.mjs'
---

## Entrées de deferred-work.md visant l'épopée

« Traitée » renvoie à la tâche (T2 à T5) ; « rejetée » donne la raison du report. Détail, lignes et relevés : inventaire §1 à §4.

| # | Entrée (origine) | Lieu (base `ca73215`) | Statut | Raison |
|---|------------------|------------------------|--------|--------|
| D1 | Chevron « Fonctionnaires » du Cybermonde dans le `h3`, ~222 px (revue 5.1) | deferred-work.md l.74 | rejetée | Changement de rendu, identique à la base. |
| D2 | Repli du module sans transition (revue 5.1) | deferred-work.md l.75 | rejetée | Changement de rendu (animation). |
| D3 | 2e version A13 gardée pour Staff (5.2) | deferred-work.md l.79-80 | rejetée | La retirer change Staff (autre ticket). |
| D4 | Chevron de Staff 10×14, croix d'alerte qui sort de 5 px (5.2) | deferred-work.md l.82-83 | rejetée | Changement de rendu ; alignement de Staff ou épopée 9. |
| D5 | Coins de la racine en sombre (5.2) | deferred-work.md l.85-86 | rejetée | Changement visible, option non tranchée. |
| D6 | Accordéon ou modale `.panel-default` sur `/forum/*` (revue 5.2) | deferred-work.md l.91 | rejetée | Demande le site réel. |
| D7 | Bascule 767 ↔ 768 du forum non couverte (revue 5.2) | deferred-work.md l.92 | rejetée | Ajout de couverture, pas un nettoyage ; le forum recharge au seuil (`sous-forum.mjs` ~l.915-925). |
| D8 | Pages `/forum/*` hors fixtures (revue 5.2) | deferred-work.md l.93 | rejetée | Capture ou site réel. |
| D9 | Boutons de groupe à 28 px (5.3) | deferred-work.md l.97-98 | rejetée | Épopée 9. |
| D10 | Padding de l'accordéon sans transition (5.3) | deferred-work.md l.100-101 | rejetée | Changement de rendu, comme D2. |
| D11 | A5 `--kr-badge-danger-border` ; sort de `--kr-badge-danger` (5.4) | `kraland-theme.css` l.75-76, l.10577 | traitée (T2) | `-border` retiré (aucun lecteur). `--kr-badge-danger` gardé : lu l.10577 par `.kd-field.is-invalid`. |
| D12 | Bureau compact 768-991 (5.4) | deferred-work.md l.109-110 | rejetée : décision d'Arnaud en attente | Question de produit. |
| D13 | `--kr-badge-pnj` (5.5) | `kraland-theme.css` l.77 | traitée (T2) | Retiré (aucun lecteur). |
| D14 | `span.tagforum` (5.5, A4) | deferred-work.md l.118-119 | rejetée : décision d'Arnaud en attente | Choix de famille. |
| D15 | Marque PNJ mobile en 14 px (5.5) | deferred-work.md l.121-122 | rejetée : décision d'Arnaud en attente | Taille, question de produit. |

Hors liste, aussi traités par ce ticket : masque `CARTES_TICKET51` éteint dans deux suites (T3, T4), condition de retrait de `sansPosition55` (T5). Reports des épopées 6 à 9 et des épopées 1 à 4 : hors périmètre (inventaire §1).

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'épopée 5 a laissé deux jetons de `:root` que plus rien ne lit : `--kr-badge-danger-border` (depuis 5.4) et `--kr-badge-pnj` (depuis 5.5). Deux suites (`cybermonde-carte`, `kramail-redaction`) gardent le masque `CARTES_TICKET51` alors que leur base, `origin/feature/next`, contient l'entrée 5.1 : le détecteur vaut `false` et le code ne fait plus rien. Le masque `sansPosition55` de `cartes-pastilles` n'a pas de condition de retrait écrite.

**Approach:** Que des retraits inertes, sans changement de rendu. Retirer les deux jetons ; inverser exactement les hunks de `21fed8d` dans les deux suites ; écrire la condition de retrait de `sansPosition55`. Prouver par `grep` avant et après que les jetons n'étaient lus nulle part, et par les suites que rien ne bouge. Tout le reste des reports est rejeté avec sa raison.

## Boundaries & Constraints

**Always:**
- Retraits retenus, et seulement eux :
  - T2 : `kraland-theme.css` l.76 `--kr-badge-danger-border: #bd2130;` et l.77 `--kr-badge-pnj: #d9534f;` ;
  - T3 : hunks de `21fed8d` dans `tests/e2e/cybermonde-carte.mjs` ;
  - T4 : hunks de `21fed8d` dans `tests/e2e/kramail-redaction.mjs`.
- `--kr-badge-danger` (l.75) reste tel quel : nom et valeur.
- T5 : un commentaire seulement, sans nouveau nom ni changement de logique.
- Option 4 de P1 : on réécrit l'origine, on ne la bat pas. Aucune règle nouvelle, aucun `!important` nouveau (3292 lignes avant comme après).
- Mobile en `max-width: 767px`, bureau en `min-width: 768px`, gardes en `:where(...)` : rien n'est ajouté qui les touche.
- Les masques restent posés sur le bundle de base, jamais sur le bundle courant. `variantes.mjs` n'est pas modifié : `CARTES_TICKET51` / `AVANT_TICKET51` gardent trois consommateurs (`forum-index`, `palette-nation`, `typographie-formes`).
- Un repère cité par 4 suites passe dans `variantes.mjs` (MAX_CITING) : aucun repère de classe n'est ajouté ni retiré ici.
- Copies de skills identiques : `diff -r .hermes/skills .claude/skills` vide.

**Ask First:**
- Tout `var(--kr-badge-danger-border` ou `var(--kr-badge-pnj` trouvé au relevé avant (template, tests, fixtures) : le jeton n'est pas mort, on le garde.
- Tout écart d'une suite après T2 à T5 : un retrait n'était pas inerte, on le remet.
- Retrait des jetons A5 de la rétro 4 (`--kr-font-page-title`, `--kr-space-5`, `--kr-space-6`, `--kr-margin-mobile`, `--kr-touch-target-dpad`) : décision d'Arnaud en attente.
- Toute question listée « décision d'Arnaud en attente » (D12, D14, D15, inventaire O1, O2).

**Never:**
- Changer un rendu, à quelque largeur que ce soit.
- Toucher les masques des épopées 3 et 4, la base de `kramail-redaction`, ou un masque dont la base est antérieure à son entrée.
- Modifier `kraland-userscript-main.user.js` à la main.
- Sous-agent pour l'implémentation. Git qui modifie l'arbre, l'index ou le stash sans accord. Site réel, cloche, `/report`. Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Jetons retirés (T2) | `grep` des deux noms dans la feuille, le template et le bundle | aucune occurrence après ; 2 déclarations et 1 ligne de bundle avant | une occurrence `var(` avant : Ask First |
| Champ invalide du kramail | `.kd-field.is-invalid` sur la rédaction | `border-color` = `#dc3545`, comme avant | `--kr-badge-danger` absent : FAIL de `kramail-redaction` |
| Cartes et cloche (5.4, 5.5) | fragments `pastilles`, `etiquettes` de `cartes-pastilles` | verts, égaux à avant T2 | n/a |
| Cybermonde (T3) | fragment `panneaux` contre `origin/feature/next` | même verdict qu'avant ; plus de log « panneaux mobiles en carte de section » | `KR_SCRIPT_AVANT` sur un bundle antérieur à 5.1 : écart attendu non masqué, consigné au Plan Change Log |
| Kramail (T4) | `regression` contre `origin/feature/next` | même verdict qu'avant ; liste `init` sans `CARTES_AVANT` | idem |
| `sansPosition55` (T5) | fragment `etiquettes` | vert, code inchangé | n/a |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` (base `ca73215`, 15454 lignes) :
  - l.75 `--kr-badge-danger: #dc3545;` (gardé) ; l.76 `--kr-badge-danger-border: #bd2130;` (retiré) ; l.77 `--kr-badge-pnj: #d9534f;` (retiré) ; l.78 `--kr-bootstrap-blue` (mort, hors épopée, gardé).
  - l.10577 : `body.page-kramail-compose form[name="post_msg"] .kd-field.is-invalid { border-color: var(--kr-badge-danger, #dc3545); }`, seul lecteur de `--kr-badge-danger`.
  - l.797-806 : règle d'état 5.4/5.5 ; l.859-860 : commentaire déjà mis à jour par 5.5. Rien à changer.
- `kraland-userscript-template.js` : `is-invalid` posé l.6571 et l.7024 ; littéraux `#d9534f` l.4351 et l.8010, non liés aux jetons. Aucun changement.
- `tests/e2e/cybermonde-carte.mjs` (T3) :
  - l.41 `import { AVANT_TICKET51, CARTES_TICKET51, poserJetonsRedefinis } from './lib/variantes.mjs';` ;
  - l.99 `async function open(url, html, variante, dev, src = userscript, css = null) {` ;
  - l.101 `if (css) { await context.addInitScript(poserJetonsRedefinis, css); }` ;
  - l.352-355 : commentaire de deux lignes, `const cartesAvant = …`, log `info` ;
  - l.358 `for (const [src, css] of [[avant, cartesAvant], [userscript, null]]) {` ; l.359 `open(c.url, c.html, c.variante, device(c.largeur), src, css);`.
- `tests/e2e/kramail-redaction.mjs` (T4) :
  - l.29 : import, `AVANT_TICKET51, CARTES_TICKET51` dans la liste ;
  - l.238-240 : commentaire de deux lignes et `const CARTES_AVANT = …` ;
  - l.1298 : `if (CARTES_AVANT) { console.log(…) }` ;
  - l.1312 : `, CARTES_AVANT` en fin de la liste `init`.
- `tests/e2e/cartes-pastilles.mjs` (T5) : l.1453 commentaire de `sansPosition55`, l.1454 sa définition. Modèle : condition de `sansPnj55` l.1064. Bases : `COMMIT_AVANT` `21fed8d` l.78, `_53` `a7f0463` l.82, `_54` `601ab19` l.86, `_55` `59567f0` l.90.
- `tests/e2e/lib/variantes.mjs` : `CARTES_TICKET51` / `AVANT_TICKET51` l.336-382 (condition l.365). Aucun changement.
- `tests/e2e/lib/router.mjs` : un hunk qui déclare une variable CSS élargit `test:changed` au total ; mot-clé `/badge-danger|kr-bell-swing|fa-bell\b/` l.195 vers `cartes-pastilles` et `typographie-formes`.
- Suivi : `_bmad-output/initiative-harmonisation-ux/deferred-work.md` l.106-108 (5.4 A5) et l.115-117 (5.5 `--kr-badge-pnj`) ; `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md`.

## Tasks & Acceptance

**Execution:**
- [x] T1 : relevé avant, consigné dans le Plan Change Log :
  - `grep -n -- '--kr-badge-danger-border\|--kr-badge-pnj' kraland-theme.css kraland-userscript-template.js` → l.76 et l.77 seulement, aucun `var(` ;
  - `grep -c 'kr-badge-pnj\|kr-badge-danger-border' kraland-userscript-main.user.js` → 1 ;
  - `grep -rn 'kr-badge-pnj\|kr-badge-danger-border' tests` → vide ;
  - `grep -n 'var(--kr-badge-danger' kraland-theme.css kraland-userscript-template.js` → l.10577 seulement ;
  - `grep -c '!important' kraland-theme.css` → 3292 ;
  - `KR_FRAG=panneaux node tests/e2e/cybermonde-carte.mjs` et `node tests/e2e/kramail-redaction.mjs` : comptes ok/FAIL notés, et preuve que le log « panneaux mobiles en carte de section » n'est pas imprimé (`AVANT_TICKET51(avant)` vaut `false`).
- [x] T2 : `kraland-theme.css`, supprimer les lignes 76 et 77. Puis `npm run build`.
- [x] T3 : `cybermonde-carte.mjs`, inverse de `21fed8d` :
  - supprimer l.41 ;
  - l.99 → `async function open(url, html, variante, dev, src = userscript) {` ;
  - supprimer l.101 ;
  - supprimer l.352-355 ;
  - l.358 → `for (const src of [avant, userscript]) {` ; l.359 → `open(c.url, c.html, c.variante, device(c.largeur), src);`.
  - Preuve : `git diff 458dc03 -- tests/e2e/cybermonde-carte.mjs` vide.
- [x] T4 : `kramail-redaction.mjs`, inverse de `21fed8d` :
  - l.29 : retirer `AVANT_TICKET51, CARTES_TICKET51, ` de l'import ;
  - supprimer l.238-240 ;
  - supprimer l.1298 ;
  - l.1312 : retirer `, CARTES_AVANT`.
  - Preuve : `git diff 458dc03 -- tests/e2e/kramail-redaction.mjs` vide.
- [x] T5 : `cartes-pastilles.mjs`, après le commentaire l.1453, ajouter `// Condition de retrait : quand le bundle de base du fragment etiquettes (COMMIT_AVANT_55) contient l'entrée 5.5.`
- [x] T6 : `deferred-work.md` : ajouter `status: traité par le sweep 5.6` sous les entrées l.106 (5.4 A5) et l.115 (5.5 `--kr-badge-pnj`), avec la preuve `grep` en `evidence`. Les autres entrées 5.x ne changent pas.
- [x] T7 : `revue-manuelle.md`, section « Ticket 5.6 » : rappel des questions en attente (D12, D14, D15, jetons A5 de la rétro 4, inventaire O1 à O3), sans nouvelle question.
- [ ] T8 : vérification (section Verification).

**Acceptance Criteria:**
- Given la feuille, le template, les tests et le bundle construit, when on cherche `--kr-badge-danger-border` et `--kr-badge-pnj`, then on ne trouve plus rien (avant : 2 déclarations dans la feuille, 1 ligne dans le bundle, aucun lecteur).
- Given `kraland-theme.css`, when on cherche `--kr-badge-danger`, then on trouve toujours la déclaration l.75 et la lecture (l.10577 avant T2, l.10575 après).
- Given `kraland-theme.css`, when on compte `!important`, then 3292 avant et après.
- Given `cybermonde-carte.mjs` et `kramail-redaction.mjs`, when on les compare à `458dc03`, then le diff est vide, et chaque suite donne le même verdict qu'au relevé T1.
- Given `npm run test:zone -- cartes-pastilles typographie-formes kramail cybermonde palette-nation` puis `npm run test:all` sur machine calme, when ils tournent, then 0 FAIL.
- Given `npm run test:router`, when il tourne, then « Routeur conforme ».

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : `risk: 'low'`. Aucun rendu ne change : les jetons retirés n'ont aucun lecteur, et les masques retirés ne posaient rien.
  - A2 : `--kr-badge-danger` est gardé tel quel. Le renommer (par exemple en `--kr-danger`) serait cosmétique, et changer sa valeur changerait la bordure d'un champ invalide du kramail.
  - A3 : contre-épreuve sans objet pour un retrait inerte (aucune mutation ne peut rendre rouge un code qui ne fait rien). Elle est remplacée par l'égalité avant/après : mêmes comptes ok/FAIL pour les suites concernées, et diff vide contre `458dc03` pour T3 et T4.
  - A4 : comme T2 touche un hunk qui déclare une variable CSS, `test:changed` part au total. Pendant la boucle, utiliser `test:zone` ciblé ; `test:all` une seule fois à la fin.
  - A5 : `test:router` est obligatoire, parce que `tests/` change (T3 à T5).
  - A6 : `KR_SCRIPT_AVANT` sur un bundle antérieur à 5.1 rendrait `cybermonde-carte` et `kramail-redaction` rouges sur les panneaux mobiles. C'est le comportement voulu après l'extinction, comme pour toute suite à base auto-référente. Le consigner au Plan Change Log s'il est observé, sans remettre le masque.
- Ordre : T1, T2 + build + `test:zone -- cartes-pastilles kramail`, T3 + `test:zone -- cybermonde`, T4 + `test:zone -- kramail`, T5 + `KR_FRAG=etiquettes node tests/e2e/cartes-pastilles.mjs`, T6, T7, puis T8.
- Le bundle est régénéré par `npm run build`, jamais édité.
- Notes d'implémentation (2026-10-25) :
  - T2 : lignes 76 et 77 supprimées ; `--kr-badge-danger` reste l.75, sa lecture passe de l.10577 à l.10575. Le bundle ne change que par la ligne CSS minifiée et la version (en-tête et constante).
  - T3, T4 : les deux suites sont reprises au contenu de `458dc03` (`git show 458dc03:<suite> > <suite>`, lecture seule de git). `git log 458dc03..HEAD` montre que `21fed8d` est le seul commit à les toucher : c'est l'inverse exact de ses hunks, ligne pour ligne comme listé en T3 et T4. `git diff 458dc03` vide pour chacune.
  - T5 : une ligne de commentaire ajoutée sous celle de `sansPosition55` ; code inchangé.
  - T6 : dans `deferred-work.md`, la preuve `grep` est ajoutée à la fin de l'`evidence` existante des deux entrées (pas de seconde clé `evidence`), puis une ligne `status`.
  - T7 : section « Ticket 5.6 » de `revue-manuelle.md` : Ask First tranchés (tous sans objet) et rappel D12, D14, D15, jetons A5 de la rétro 4, O1 à O3.
  - T8 : `npm run test:all` non lancé dans cette passe (consigne de l'orchestrateur) ; il reste à lancer une fois, machine calme, avant la livraison.
  - T8 (orchestrateur, 2026-10-25) : `npm run test:all` lancé sur l'arbre de `55b14f0` avant commit, log `/tmp/kr-56-all.log` : 12777 ok, 0 FAIL. Même total que 5.5 : le ticket ne retire que des lignes d'info, aucun contrôle.

## Plan Change Log

- 2026-10-25, relevé avant T1 (base `ca73215`, arbre propre sur les fichiers visés) :
  - `grep -n -- '--kr-badge-danger-border\|--kr-badge-pnj' kraland-theme.css kraland-userscript-template.js` → `kraland-theme.css:76` et `:77` seulement, aucun `var(` ;
  - `grep -c 'kr-badge-pnj\|kr-badge-danger-border' kraland-userscript-main.user.js` → 1 ;
  - `grep -rn 'kr-badge-pnj\|kr-badge-danger-border' tests` → vide (exit 1) ;
  - `grep -n 'var(--kr-badge-danger' kraland-theme.css kraland-userscript-template.js` → l.10577 seulement ;
  - `grep -c '!important' kraland-theme.css` → 3292 ; feuille de 15454 lignes ;
  - `KR_FRAG=panneaux node tests/e2e/cybermonde-carte.mjs` → exit 0, 13 ok, 0 FAIL, log « panneaux mobiles en carte de section » absent (`AVANT_TICKET51(avant)` vaut `false`) ;
  - `node tests/e2e/kramail-redaction.mjs` → exit 0, 340 ok, 0 FAIL, log « carte de section » absent.
- 2026-10-25, relevé après T2 à T5 :
  - mêmes deux commandes → exit 0, 13 ok et 340 ok, 0 FAIL ; lignes ok/FAIL identiques à l'avant (`diff` vide, triées pour `kramail-redaction`) ;
  - `grep` des deux jetons dans la feuille et le template → vide ; dans le bundle → 0 ; dans `tests` → vide ;
  - `grep -n -- '--kr-badge-danger' kraland-theme.css` → l.75 (déclaration) et l.10575 (`var(--kr-badge-danger, #dc3545)`) ;
  - `grep -c '!important' kraland-theme.css` → 3292 ;
  - `git diff 458dc03 -- tests/e2e/cybermonde-carte.mjs tests/e2e/kramail-redaction.mjs` → vide.
- 2026-10-25, Ask First : aucun déclenché (aucun `var(` au relevé avant, aucun écart de suite). `KR_SCRIPT_AVANT` sur un bundle antérieur à 5.1 non joué (A6) : rien à consigner.
- 2026-10-25, écart de méthode : T3 et T4 appliqués par restauration du contenu `458dc03` plutôt que par édition ligne à ligne ; résultat identique, prouvé par le diff vide.

## Design Notes

- Pourquoi les autres masques restent : leur consommateur compare à une base antérieure à l'entrée (`81512a3`, `6685df5`, `00b0786`, `62fd47d`, `d68ab55`, `a7f0463`, `59567f0`). Le détecteur y vaut `true` et l'écart est réel (inventaire §3).
- Pourquoi les masques des épopées 3 et 4 de `kramail-redaction` restent : la rétro 4 (A6) les éteint après la fusion dans `main`. `origin/main` (`d5b38e5`) ne contient pas les épopées, donc la condition n'est pas remplie, et ce n'est pas l'épopée 5.
- `palette-nation.mjs` l.73-74 renvoie les barres de PV des cartes à « l'épopée 5 ». Aucun ticket 5.x ne les a prises ; elles changeraient le rendu. Signalées à Arnaud (inventaire O3), sans action ici.

## Verification

**Commands:**
- `npm run build` -- exit 0, validation postbuild ok.
- `npm run lint:css` puis `npm run lint:js`, lancés séparément -- exit 0 chacun, codes de sortie lus.
- `npm run test:router` -- « Routeur conforme ».
- `npm run test:zone -- cartes-pastilles typographie-formes kramail cybermonde palette-nation` -- 0 FAIL, comptes égaux au relevé T1 pour `cybermonde-carte` et `kramail-redaction`.
- `diff -r .hermes/skills .claude/skills` -- sortie vide.
- Preuve `grep` après :
  - `grep -n -- '--kr-badge-danger-border\|--kr-badge-pnj' kraland-theme.css kraland-userscript-template.js` → vide ;
  - `grep -c 'kr-badge-pnj\|kr-badge-danger-border' kraland-userscript-main.user.js` → 0 ;
  - `grep -n -- '--kr-badge-danger' kraland-theme.css` → l.75 et la lecture `var(--kr-badge-danger, #dc3545)` ;
  - `grep -c '!important' kraland-theme.css` → 3292 ;
  - `git diff 458dc03 -- tests/e2e/cybermonde-carte.mjs tests/e2e/kramail-redaction.mjs` → vide.
- `npm run test:all`, une seule fois, à la fin, machine calme -- 0 FAIL. Un FAIL isolé sous charge se rejoue seul avant toute conclusion.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | `tests/e2e/kramail-redaction.mjs` l.220-240 | Les masques conditionnels 4.x (`ESPACEMENT_TICKET49`…) sont aussi inertes sur une base qui contient l'épopée 4, mais ils restent | rejeté | — | Ils se coupent d'eux-mêmes (`AVANT_TICKET4x`) et le plan les écarte du nettoyage de l'épopée 5. Les garder ne cause aucun faux vert |

## Result

- Construit le 2026-10-25 sur la base `ca73215`.
- Revue quick : 1 constat, rejeté (masques 4.x conditionnels et inertes).
- Gates :
  - `npm run build`, `lint:css`, `lint:js` et `test:router` sortent en 0 ;
  - `diff -r .hermes/skills .claude/skills` est vide ;
  - `npm run test:all` : 12777 ok, 0 FAIL (VERT).
- `--kr-badge-danger-border` et `--kr-badge-pnj` sont retirés : 0 lecture avant comme après. `CARTES_TICKET51` est éteint dans `cybermonde-carte` et `kramail-redaction` ; `git diff 458dc03` est vide pour ces deux suites.
