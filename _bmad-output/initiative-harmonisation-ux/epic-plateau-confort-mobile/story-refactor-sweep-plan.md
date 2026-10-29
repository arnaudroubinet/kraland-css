---
title: 'Refactor sweep de fin d''épopée 9 (plateau et confort mobile)'
type: 'refactor'
ticket: 12
created: '2026-10-29'
status: 'built'
baseline_revision: '7bec45299cd1427408b3a9c7889e0eaa3ef1326a'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'invocation'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem :** les entrées 9.1 à 9.10 laissent du CSS mort ou dupliqué (bloc mobile des cartes, paddings morts, 44 px en dur, jetons non lus) et des bases de tests figées sur d'anciens SHA, avec des masques devenus inertes ou qui ne servent qu'à ces bases.

**Approach :** périmètre fixé ci-dessous (Code Map), à partir de la description de l'entrée, des reports D9.n et de ce qui vise l'épopée 9 dans `deferred-work.md`, et des masques inertes listés par le sweep 7.10. Chaque retrait CSS est prouvé par un rendu égal à 7bec452 ; chaque base `COMMIT_*` / `BASE_SHA` est recalée sur 7bec452, puis ses masques retirés, sauf masque encore actif contre sa base.

## Boundaries & Constraints

**Always :** rendu égal à 7bec452 sur les fixtures des entrées 1 à 10 ; compte de `!important` ≤ 2946 ; gardes `:where(html.x)` ; media 767/768, aucune règle mobile ou bureau rendue globale ; masque gardé = noté dans revue-manuelle.md, section « Ticket 9.12 ».

**Never :** écriture git, npm install, test:all, test:changed ; site réel, Chrome 9222/9223 ; dépôt principal ; changement de rendu voulu ; renommage de `--kr-touche-croix` (`AVANT_TICKET95` le lit).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rendu égal | fixtures 1 à 10, 320/375/767/768/1280 px, Kraland clair et Empire Brun sombre, bundle neuf contre 7bec452 | styles calculés (hors propriétés `--*`) et boîtes égaux | un écart = retrait annulé |
| Base recalée | suite avec base 7bec452, masque retiré | suite verte | rouge = masque gardé, base laissée, consigné |
| Précondition historique | `AVANT_*(base) === true` exigé | assertion retirée avec le recalage | consigné |

</frozen-after-approval>

## Code Map

CSS retenu (`kraland-theme.css`) :
- C1 bloc « DASHBOARD MOBILE » (~l.5913-6246) : un seul `@media (max-width: 767px)` au lieu d'un par règle, ordre gardé ; `body.mobile-mode .dashboard-cards-grid` (4c et 4e) fusionnés, aucune propriété commune, seul `.collapsed` (spécificité plus forte) entre eux.
- C2 `.dashboard-card h4` (~l.4523) : aucun `h4` dans les cartes construites par le template (~l.4234-4350).
- C3 `.container` `padding-left/right: 15px !important` (~l.4297) : toujours battu par `.container` 12 px `!important` (~l.9576), même media, plus loin.
- C4 `min-height: 44px` (41 fois) et `var(--mobile-touch-target)` → `var(--kr-touch-target)` ; déclaration `--mobile-touch-target` retirée (~l.134).
- C5 `body.mobile-mode { }` vide (~l.6978).
- C6 jetons non lus hérités : `--kr-gold`, `--kr-bootstrap-blue`, `--kr-overlay-light-20`, `--mobile-tab-bar-height`, `--mobile-spacing-xl`, `--z-tab-bar`, `--z-bottom-sheet`, `--z-drawer`, `--transition-slow` (aucun `var(`, ni template, ni tests).

CSS écarté : grille d'actions (~l.12491-12566) et `.dashboard-section-header` 12 px (~l.12578, 12601) en double entre ≥ 768 et ≤ 767 (fusion = règle globale, contraire à la convention des media) ; `--kr-font-page-title`, `--kr-space-5/6` (échelle de DESIGN.md) ; paddings de colonnes `.col-sm-*` (~l.9588, vivants hors `mobile-mode`) ; nettoyage `.panel-info` du template (~l.9361, demande le site réel).

Tests (`tests/e2e`) : toutes les constantes `COMMIT_*`, `BASE_SHA`, `BASELINE*` et bases `git show` de `cartes-pastilles`, `confort-mobile`, `forum-activite`, `forum-index`, `kramail-redaction`, `kramail-theme`, `palette-nation`, `plateau-qualite-usage`, `report-non-lu`, `typographie-formes` → 7bec452. Masques visés : `MASQUE_FORUM_98`, `MASQUE_INDICATEUR_96`, `MASQUE_SUPERPOSITION_96`, `CORRIGER_BUG14`, `LEGENDES_TICKET45`, `CIBLES_TICKET95`, `ECHELLE_TICKET45`, `medias410`, `MASQUE_JAUGES_9`, `MASQUE_PV_97`, `MASQUE_MODULES_96`, `MASQUE_CIBLES_94`, `CARTES_TICKET92`, `CARTES_TICKET54/55`, `SANS_MARGE_PAGE_99`, `MASQUE_KRAMAIL_99`, `sansTitre`, `masqueB15`, masques 7.3/7.5 ; exports orphelins de `lib/variantes.mjs` ensuite. `lib/router.mjs` : commentaires seulement si une constante citée disparaît.

## Tasks & Acceptance

**Execution :**
- [x] `/tmp/kr912` -- bundle 7bec452 (`git show`) et comparateur jetable de styles calculés et de boîtes -- preuve du rendu égal.
- [x] `kraland-theme.css` -- C1 à C6, un par un, build et comparateur après chaque -- rendu égal.
- [x] `tests/e2e/*.mjs`, `lib/variantes.mjs` -- recalages, retrait des masques et préconditions devenus sans objet, constantes orphelines -- bases à jour.
- [x] `revue-manuelle.md` (worktree) -- section « Ticket 9.12 » -- masques gardés et doutes.

**Acceptance Criteria :**
- Given le bundle neuf, when le comparateur tourne contre 7bec452, then zéro écart.
- Given chaque suite recalée, when sa zone tourne, then elle est verte ; contre `KR_SCRIPT` = 7bec452, verte aussi.
- Given `grep -o '!important' kraland-theme.css | wc -l`, then ≤ 2946.

## Implementation Notes

- CSS : C1 à C6 appliqués (102 insertions, 186 suppressions), 2943 `!important` (2946 avant). Le comparateur `/tmp/kr912/diff.mjs` compare, bundle neuf contre bundle 7bec452, les styles calculés hors `--*` et les boîtes de chaque élément et pseudo-élément. Couverture : 492 cas (45 fixtures ; 320, 375, 767, 768 et 1280 px ; Kraland et Empire Brun sombre ; plateau mobile plié et déplié). Résultat : 0 écart.
- Bases recalées sur 7bec452 : `report-non-lu`, `confort-mobile`, `forum-index`, `kramail-redaction`, `kramail-theme` (`BASE_SHA`, `COMMIT_AVANT_99`), `palette-nation` (`BASELINE4`), `forum-activite` (7 bases), `cartes-pastilles` (bases 53, 54 et 55 fusionnées), `plateau-qualite-usage` (cartes), `typographie-formes` (BOUTONS, ECHELLE, ECHELLE_FORUM, RAYONS, ESPACEMENT, NETTOYAGE, CHAMPS).
- Masques retirés avec elles : `masqueB15`, `sansTitre`, `masque98`, `MASQUE_SUPERPOSITION_96`, `MASQUE_KRAMAIL_99`, `MASQUE_INDICATEUR_96`, `MASQUE_FORUM_98`, `SANS_ENTREE8`, `sansMarge`, `SANS_MARGE_PAGE_99`, `CARTES_TICKET92`, `sansPv97`, `sansPnj55`, `sansPosition55` et `focusBase`. Côté `typographie-formes` : `MASQUE_JAUGES_9`, `MASQUE_PV_97`, `MASQUE_MODULES_96`, `MASQUE_CIBLES_94`, le miroir `ECHELLE_TICKET45`, `medias410`, le masque 7.5 des champs et `CORRIGER_BUG14` sur les bases recalées.
- Préconditions retirées : `AVANT_TICKET55(avant55)` et `AVANT_BUG14(avantChamps)`. Pour la seconde, le contrôle absolu `!AVANT_BUG14(userscript)` reste.
- Bases gardées, parce que ce sont des preuves d'avant un ticket : `PALETTE_BASE_SHA` 0b27dc2, `BASELINE5` et `BASELINE13`, la base pv cb73530, et dans `typographie-formes` `COMMIT_AVANT` d68ab55, `COMMIT_MODALES`, `COMMIT_COMPACT`, `COMMIT_TICKET6`, `COMMIT_TITRE_FORUM` et `COMMIT_MEDIAS_410`. Leurs masques encore actifs restent posés et sont notés dans revue-manuelle.md, section « Ticket 9.12 ».
- Exports orphelins retirés : `ECHELLE_TICKET45`, `MEDIAS_TICKET410`, `CARTES_TICKET92`, `AVANT_TICKET92`, `AVANT_TICKET97` et `sansClassesPv97` dans `lib/variantes.mjs`, `SANS_MARGE_PAGE` dans `lib/marges.mjs`.
- `deferred-work.md` : trois entrées sont marquées traitées (`sansTitre`, les bases dédiées de 7.10, les masques inertes de 7.10).
- Implémentation faite directement, sans sous-agent.

## Plan Change Log

- `COMMIT_MEDIAS_410` n'est pas recalé : c'est une base de preuve du ticket 4.10 (précondition, « rendu 768 changé », A8). Le doute est noté dans revue-manuelle.md.

## Review Triage Log

- Revue rapide par l'implémenteur. Libellé de base de `typographie-formes` corrigé : « 9.1 à 9.10 comprises », car 7bec452 contient 9.10 (fde18e7). Aucun autre constat. Une revue indépendante reste à faire (AGENTS.md).

## Verification

**Commands :**
- `npm run build` -- VALIDATION PASSED.
- `node /tmp/kr912/diff.mjs` -- 0 écart.
- `npm run test:zone -- <zones touchées> palette-nation` -- vert.
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` (séparés), `diff -r .hermes/skills .claude/skills` -- code 0, sortie vide.

**Résultats (worktree wt/9.12, base 7bec45299cd1427408b3a9c7889e0eaa3ef1326a, aucun commit) :**
- `npm run build` : VALIDATION PASSED.
- `node /tmp/kr912/diff.mjs` : 492 cas, 120540 éléments par côté, 0 écart (code 0) sur 3 passages sur 4. Un passage lancé juste après lint et router a donné 1 cas d'écart, sans détail gardé ; les deux relances suivantes, machine calme, donnent 0.
- `grep -o '!important' kraland-theme.css | wc -l` : 2943.
- `npm run test:zone --` : plateau 1959 ok, forum 639, sous-forum 1374, kramail 1622, report 1174, palette-nation 1372, typographie-formes 4486, cartes-pastilles 2302, forum-activite 1393, confort-mobile 912. 0 FAIL partout, code 0.
- `KR_SCRIPT=/tmp/kr912/base.user.js node tests/e2e/<suite>.mjs` sur les 10 suites modifiées : code 0, 0 FAIL. Sur une base recalée, cette commande compare 7bec452 à lui-même et passe d'office. Elle prouve seulement que les contrôles absolus et les bases gardées acceptent 7bec452, pas que le rendu est égal ; cette preuve-là vient du comparateur.
- Sensibilité du comparateur (revue indépendante) : un bundle muté à `--kr-touch-target: 43px` donne 104 écarts sur 104 cas. La revue a lancé le comparateur 3 fois sur le bundle neuf : 0 écart à chaque passage.
- Commandes à code 0 : `npm run test:router` (Routeur conforme), `npm run test:unit` (58 pass), `npm run lint:css`, `npm run lint:js` (0 erreur ; 3 avertissements `no-loop-func` déjà présents).
- `diff -r .hermes/skills .claude/skills` : sortie vide.

## Result

| Preuve | Commande | Résultat |
|---|---|---|
| Rendu égal à 7bec452 | `node /tmp/kr912/diff.mjs` | 0 écart, 492 cas |
| `!important` | `grep -o '!important' kraland-theme.css \| wc -l` | 2943 (≤ 2946) |
| Zones touchées | `npm run test:zone -- <zone>` | 10 zones vertes, 17233 ok |
| 7bec452 accepté par les contrôles absolus et les bases gardées (passe d'office sur une base recalée) | `KR_SCRIPT=<bundle 7bec452>` sur les 10 suites | vertes |
| Sensibilité du comparateur | bundle muté `--kr-touch-target: 43px` | 104 écarts sur 104 cas |
| Routeur, unitaires, lint | `test:router`, `test:unit`, `lint:css`, `lint:js` | code 0 |
| Skills | `diff -r .hermes/skills .claude/skills` | vide |

Reste : revue indépendante, `test:all` machine calme, commit et PR vers `feature/next` (orchestrateur).

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, commité (`db81317`) et fusionné sur `feature/next` (`6fbdba0`) ; `test:all` de la fusion : 18438 ok, 1 FAIL de charge `kramail-theme#confort` (bascule 767 > 768 > 767 de la réception), vert 2/2 rejoué seul. Le « Reste » ci-dessus est soldé.
