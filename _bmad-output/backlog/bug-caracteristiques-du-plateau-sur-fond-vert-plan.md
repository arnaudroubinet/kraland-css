---
title: 'Les caractéristiques du personnage prennent le fond neutre des compétences et des boutons standard'
type: 'bugfix'
ticket: 13
created: '2026-10-28'
status: 'built'
baseline_revision: '7e69719023daea54d8e485bbc07b6951dbe38496'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'auto'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/backlog/bug-caracteristiques-du-plateau-sur-fond-vert.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/router.mjs'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Décision :** 2026-10-25 — Arnaud : « Oui je veux le même fond neutre. » Les caractéristiques prennent le fond neutre des compétences.

**Problem:** Les caractéristiques du personnage (`a.btn.btn-success.alert121…126.mini`) s'affichent en `--kr-success` plein (fond, bordure ; texte `bg-surface` ; badge en paire inverse), sur tous les thèmes. Le défaut touche le plateau (colonne latérale, mini-profil) et Bâtiments, Matériel, Employés. Les compétences ont le fond neutre du bouton standard.

**Approach:** P1 option 4 : réécrire l'origine. Exclure les caractéristiques `btn-success` de la palette d'états par un `:where(:not(…))`, leur donner les règles du bouton standard, retirer les exceptions du 3.5 devenues inutiles.

## Boundaries & Constraints

**Always:** sélecteurs ajoutés sans spécificité supplémentaire (`:where`) ; mobile en `max-width: 767px`, bureau en `min-width: 768px` ; compte de `!important` ≤ 3281 ; seul `btn-success` est neutralisé.

**Never:** nouvelle règle qui bat la palette ; nouvel `!important` ; changer les compétences, leurs pastilles, les cibles tactiles (≥ 44 px), la grille du mini-profil ; changer la palette des votes, scores, alertes, étiquettes, panneaux ; toucher la pièce courante (`.btn-warning` à image de pièce) et la marque PNJ (`.btn-danger.xmini`) ; nouveau masque de test ; site réel.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Caractéristique `btn-success` | plateau, Bâtiments, Matériel, Employés | fond, bordure, texte, badge du bouton standard de la page ; repos, survol, appui | No error expected |
| Malus éventuel | caractéristique `btn-warning` ou `btn-danger` | garde la palette d'états | No error expected |

</frozen-after-approval>

## Code Map

- `tests/e2e/fixtures/jeu-{materiel,batiments,employes}.html` -- Caractéristiques natives dans `#col-left .panel-body > .btn-group-xs.center`, 3 `.btn-success`, aucun autre. URL `/jouer/*` : `isPlatoPage()` est vrai. `restructurePlatoColumns`, `moveBtnGroupToCols` et `transformStatsToNotifications` (template l.8027-8283) les placent dans `#col-leftest-stats` et les passent en `kr-stat`. `jeu-plateau-objets.html` : 2 `.btn-success` dans `#col-leftest-stats`, aucun autre. Le sélecteur `#col-leftest-stats .btn-success` est donc sûr.
- `kraland-theme.css` l.859-861 -- `--kr-state` sur `.btn-success` : ne pas toucher.
- `kraland-theme.css` l.901, 907, 914-915, 934 -- palette des boutons d'état (repos, états, désactivé, badge). Ajouter `#col-leftest-stats .btn-success, .btn-success.mobile-characteristic-badge` au `:where(:not(…))` existant (l.934 : en créer un). La l.908 (`.open > .dropdown-toggle`) n'est pas concernée. Badge mobile : `.kr-stat-badge.is-level` (0,2,0, l.12989) perd aujourd'hui contre la l.934 (0,4,1). Bureau : `#col-leftest .kr-stat-badge` (1,2,0, l.12759-12790) gagne déjà.
- `kraland-theme.css` l.2391-2416 -- bouton standard H5.3 (`bg-surface`, `border-tint`, `text-nation` ; survol et appui `header-tint`), source du fond des compétences (`a.btn.btn-default.kr-skill`, clone `.mobile-skill-item`). Ajouter `html.kr-theme-enabled .btn.btn-success:where(#col-leftest-stats *, .mobile-characteristic-badge)` à chaque liste, avec les mêmes pseudo-classes. Résultat : (0,3,1) et (0,4,1), comme H5.3. Bootstrap `.btn-success…` (≤ (0,3,0)) est battu.
- `kraland-theme.css` l.4617-4621 -- `.panel-body a:where(:not(.btn:not(…bat…))):hover` (mobile) exclut tous les boutons : garder le sélecteur, réécrire le commentaire.
- `kraland-theme.css` l.5242-5246 -- appui du mini-profil : ligne compétence sans `:where` (forme de `d521cc8`) ; ligne caractéristique en `:where(:not(.btn-warning, .btn-danger))`.
- `kraland-theme.css` l.12536-12543 -- PLT-11 sombre : `.list-group-item.btn:where(:not(.btn-warning, .btn-danger)):hover`. Avec ce sélecteur, compétence et caractéristique partagent le survol sombre.
- `kraland-userscript-template.js` l.1522-1545 (clone `mobile-characteristic-badge`) et l.8169-8283 (`kr-skill`, `kr-stat`) -- lecture seule.
- `tests/e2e/palette-nation.mjs` l.1402-1477 -- `PAGES5`, `RELEVER5`, `pages5`, `ecartsPage5`, libellé `quoi` : suite d'accueil. Elle accueille aussi les 3 pages de jeu : `jeu-materiel`, `jeu-batiments` et `jeu-employes` passent de 2 à 3 suites citantes (typographie-formes, cartes-pastilles). Aucune autre suite ne doit plus les citer.
- `tests/e2e/typographie-formes.mjs` l.155-160 et 320-345 (`stat` contre `d68ab55`), fragment `nettoyage` (`6270c81`) ; `tests/e2e/lib/variantes.mjs` l.374-377 (`horsFamilles` en `egal`) et `tests/e2e/cartes-pastilles.mjs` l.1372-1376 (fragment `etiquettes`) -- rouges probables : toutes les bases contiennent la palette du 3.5.
- `tests/e2e/lib/router.mjs` l.261-262 -- `MAX_CITING = 3`. Déjà à 3 : `skills-panel`, `kr-skill-badge`, `btn-success`. Déjà à 4 : `btn-group-xs`. `kr-skill` 2, `col-leftest-stats` 2, `kr-stat` 1.

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/palette-nation.mjs` -- Réécrire `etats-pages-*` : chaque caractéristique (`a.btn-success[class*="alert12"]`, `alert12` n'est pas un jeton) est comparée à un bouton de référence de la page : `a.kr-skill` sur le plateau, `.mobile-skill-item` dans le mini-profil, `a.btn.btn-default` sur les pages de jeu. On vérifie l'égalité du fond, de la bordure, de la couleur et du `.badge` de même niveau (`is-level`/`is-zero`). Trois états : repos, `:hover` et `:active` forcés. Le mini-profil est mesuré plié puis déplié. Ajouter à `PAGES5` Matériel, Bâtiments et Employés. Largeurs : plateau à 375, 767, 768 et 1280 px ; pages de jeu à 375 et 1280 px. Variantes : les 16 à 375 et 1280 px, `kraland` et `empire-brun-dark` à 767 et 768 px. Mettre les pages et largeurs dans les fragments existants. Ne citer ni `skills-panel`, ni `kr-skill-badge`, ni `mobile-mini-profile`. -- Faire rougir d'abord (AC 1 et 3).
- [ ] `kraland-theme.css` -- Exclusions de la palette, ajouts au H5.3, appui mobile, PLT-11, commentaires à jour. -- AC 1, 2, 4.
- [ ] `tests/e2e/typographie-formes.mjs`, `tests/e2e/lib/variantes.mjs`, `tests/e2e/cartes-pastilles.mjs` -- Ne traiter que les contrôles réellement rouges. Pour une caractéristique, remplacer la comparaison à la base par une égalité absolue avec la référence de la même page. Les sélecteurs de la référence vont dans `variantes.mjs`, que le routeur ne compte pas. Aucun masque, aucune base sur un commit qui contient le correctif. Une contre-épreuve rouge par contrôle réécrit.
- [ ] `kraland-userscript-main.user.js`, `version.json` -- `npm run build`.

**Acceptance Criteria:**
- Given les caractéristiques `btn-success` du plateau, sur ordinateur (colonne latérale) et sur mobile (mini-profil plié puis déplié), when la page est rendue à 375, 767, 768 et 1280 px en Kraland clair et en Empire Brun sombre, then fond, bordure, couleur du texte et badge de valeur sont égaux à ceux d'une compétence de la même page, au repos, au survol et à l'appui.
- Given les caractéristiques de Bâtiments, Matériel et Employés, when la page est rendue à 375 et 1280 px en Kraland clair et en Empire Brun sombre, then elles ont le fond, la bordure et le texte du bouton standard de la même page, au repos, au survol et à l'appui.
- Given les votes du sujet, le score des messages mobiles et les alertes « Bienvenue », when ils sont rendus, then ils gardent la couleur d'état du ticket 3.5.
- Given les contrôles `etats-pages-*` réécrits, when la suite tourne, then elle passe, et elle échoue sur le bundle de `7e69719`.
- Given une caractéristique en `btn-warning` ou `btn-danger`, when elle est rendue, then elle garde la palette d'états.

## Implementation Notes

- CSS : `#col-leftest-stats .btn-success, .btn-success.mobile-characteristic-badge` ajoutés aux 4 `:where(:not(…))` de la palette (repos, survol, désactivé ×2) et à un `:where(:not(…))` créé sur la pastille ; H5.3 reçoit les caractéristiques au repos, au focus, au survol et à l'appui, et aussi à l'état désactivé (`.disabled`, `[disabled]`, `fieldset[disabled]`), pour que la palette exclue ne laisse pas le Bootstrap vert. Appui du mini-profil et PLT-11 en `:where(:not(.btn-warning, .btn-danger))`. `!important` : 3281, comme la base.
- `palette-nation` `etats-pages-*` : la référence des pages de jeu est `a.kr-skill` (compétence de la colonne), et non `a.btn.btn-default` : la bordure d'une cellule d'icône suit la couleur du texte (`text-nation`), celle du `btn-default` simple vaut `border-tint`. Les malus sont simulés sur le plateau par une fixture modifiée (FOR en `btn-warning`, VOL en `btn-danger`). L'ouverture sur le bundle de base (`avant`) reste réservée au sous-forum et au report.
- Repères dans `lib/variantes.mjs` (`CARACTERISTIQUES_BACKLOG13`) : sélecteurs, jetons de pastille par niveau, sous-arbres, et la mesure partagée `RELEVER_CARACTERISTIQUES_BACKLOG13` / `ecartsCaracteristiquesBacklog13`. Une pastille sans compétence de même niveau sur la page (typographie-formes.html : une seule compétence, non nulle) est comparée aux jetons de son niveau, ceux des pastilles de compétence, sondés dans la page.
- Contrôles réécrits (rouges sur `7e69719`, verts après) : typographie-formes `mobile`/`bureau` (`stat` hors base, contrôle de pastille), `nettoyage` plateau et champ (sous-arbres des caractéristiques hors empreinte, contrôle absolu) ; cartes-pastilles `groupes` (mini-profil, fond et texte des caractéristiques hors base ; non prévu au plan) et `etiquettes` (palette des 3 repères caractéristiques hors base). La géométrie reste comparée à la base.
- `npm run test:changed` n'était pas autorisé par le brief de l'agent : non lancé.
- Revue (constat 1) : PLT-11 resserré en `.list-group-item.btn:where(:not(.btn-success, .btn-warning, .btn-danger), .btn-success:is(#col-leftest-stats *, .mobile-characteristic-badge)):hover`. Spécificité inchangée, aucun `!important`. Un bouton de liste `.btn-success` hors caractéristiques garde le survol de la palette d'états.
- Revue (constats 1 et 5) : `etats-pages-*` ajoute une sonde `a.list-group-item.btn.btn-success` hors caractéristiques à la page des malus. Malus et sonde sont relevés au repos, au survol et à l'appui forcés, et comparés au bundle `7e69719` (`BASELINE13`, surchargeable par `KR_SCRIPT_AVANT13`), qui ne contient pas le correctif.

## Plan Change Log

- 2026-10-28 : référence des pages de jeu `a.kr-skill` au lieu de `a.btn.btn-default` (bordure des cellules d'icône) ; H5.3 étendu à l'état désactivé ; fragment `groupes` de cartes-pastilles ajouté aux contrôles réécrits.
- 2026-10-28 (revue) : PLT-11 limité aux caractéristiques parmi les `.btn-success` (constat 1) ; malus et sonde `.btn-success` hors caractéristiques comparés à `7e69719` au survol et à l'appui (constats 1 et 5).

## Review Triage Log

## Design Notes

- Decision (orchestrateur, 2026-10-28) : la demande d'Arnaud ne se limite pas au plateau. Les caractéristiques de Bâtiments, Matériel et Employés prennent aussi le fond neutre du bouton standard de leur page ; seul `btn-success` est neutralisé (consigné dans `revue-manuelle.md`, « Backlog 13 »).
- Question warning/danger : ni les fixtures ni le template ne montrent ce cas. Les 8 fixtures `alert12x` portent toutes `btn-success`. Décision prudente : warning et danger gardent la palette.
- Cible : la colonne (`#col-leftest-stats`) et le clone mobile, pas `alert12`, qui est aussi la classe de « Prier » (`btn-primary`). Ne viser que `.btn-success` laisse « Prier » hors de la règle.
- `.panel-body a:hover` reste en place. Le rendre aux boutons changerait tous les boutons mobiles d'un `.panel-body`.
- TF1 (`CARTES_TICKET54/55`) n'est pas retiré. Ce ticket ne change aucune règle des étiquettes et pastilles : le badge suit seulement celui des compétences.

## Verification

**Commands:**
- `npm run build` -- expected: build et validation OK.
- `npm run test:zone -- palette-nation` -- expected: vert.
- `npm run test:zone -- plateau`, `-- profil`, `-- typographie-formes`, `-- cartes-pastilles`, `-- messages`, puis `npm run test:changed` -- expected: vert.
- `npm run test:router` -- expected: conforme. Ensuite, compter les jetons cités (`TOKEN_RE` sur les fichiers de `SUITES`) : aucun ne passe à 4 suites citantes.
- `git show 7e69719:kraland-userscript-main.user.js > $TMPDIR/kr-7e69719.user.js && KR_SCRIPT=$TMPDIR/kr-7e69719.user.js KR_FRAG=etats-pages-mobile node tests/e2e/palette-nation.mjs` (puis `etats-pages-bureau`) -- expected: FAIL nommés sur les caractéristiques, votes et « Bienvenue » verts.
- `npm run lint:css` puis `npm run lint:js` -- expected: 0 erreur chacun.
- `grep -c '!important' kraland-theme.css` -- expected: ≤ 3281.
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css:12549 | PLT-11 sombre `:where(:not(.btn-warning, .btn-danger)):hover` s'étend à tout `.list-group-item.btn.btn-success`, pas seulement aux caractéristiques | réel | patch (fixed) | aucune garde `#col-leftest-stats` / `.mobile-characteristic-badge` |
| 2 | quick | tests/e2e/palette-nation.mjs:1495 | Caractéristique comparée à la seule compétence : dérive commune non vue | atténué | none | compétences comparées à la base dans `cartes-pastilles#groupes` et `typographie-formes#nettoyage` |
| 3 | quick | tests/e2e/lib/variantes.mjs:142 | Jetons de pastille VOL 0 recopiés à la main de kraland-theme.css:12788-12799, 12998-13009 | réel, faible | defer | valeurs exactes aujourd'hui ; fixture sans compétence à 0 |
| 4 | quick | tests/e2e/lib/variantes.mjs:136 | Référence `a.kr-skill` au lieu de `a.btn.btn-default` du plan | sans effet | none | `btn btn-default mini kr-skill` (template:8182) |
| 5 | quick | tests/e2e/palette-nation.mjs:1506 | Malus vérifiés au repos seulement ; survol sombre et appui mobile non couverts | réel | patch (fixed) | exclusions `:where(:not(.btn-warning, .btn-danger))` sans test |

## Result

- Revue quick : 5 constats bas ; 1 et 5 corrigés, 2 et 4 sans suite, 3 reporté dans `deferred-work.md` (voir Review Triage Log).
- `test:all` (base 7e69719) : 13771 ok, 0 FAIL en 348 s, machine calme.
- `lint:css`, `lint:js`, `test:router` verts ; `!important` 3281, comme la base ; copies de skills identiques.
- Contre-épreuves : bundle de base rouge sur `etats-pages-*`, `typographie-formes#mobile` et `#nettoyage`, `cartes-pastilles#etiquettes` et `#groupes` ; mutations m1 à m6 rouges.
- À confirmer par Arnaud : masque TF1 gardé (Design Notes) ; référence `a.kr-skill` sur les pages de jeu au lieu de `a.btn.btn-default`.
