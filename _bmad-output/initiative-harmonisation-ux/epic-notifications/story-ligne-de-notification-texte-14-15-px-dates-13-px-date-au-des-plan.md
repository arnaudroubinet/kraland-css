---
title: 'Ligne de notification : texte 14/15 px, dates 13 px, date au-dessus du texte sur mobile'
type: 'feature'
ticket: 1
created: '2026-10-28'
status: 'built'
baseline_revision: 'db25ad42c219c751f0bcd046230cf2f331e2687c'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'orchestrator'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur `/report`, le texte des notifications et les dates ont la même taille (14 px sur ordinateur, 13 px sur mobile par la règle mobile générique des tableaux en `!important`) ; sur mobile, la colonne de date de 100 px (`<col width="100">` natif) prend un tiers d'un écran de 375 px et le texte se tasse. Le filet non lu est posé sur la cellule de date et ne couvrirait plus que la date si elle passait au-dessus du texte (review-faisabilite L2). La règle de la cellule de date porte un `padding-left: 10px` hors grille (report de 4.9).

**Approach:** CSS seul, sous `:where(html.kr-page-report)` : tailles et parties communes en liste combinée (texte `--kr-font-body`, date `--kr-font-detail`) ; sur ordinateur, colonne de date, filet et teinte sur la cellule de date, retrait au jeton ; sur mobile, tableau, lignes et cellules en bloc, colonne native masquée, date au-dessus du texte, texte en `--kr-font-body-mobile` sur toute la largeur, filet sur la ligne `tr.bg-info` entière. La règle mobile générique `.table … td` (`padding: 8px !important; font-size: 13px !important`) est gardée hors `/report` par `:where(html:not(.kr-page-report))` au lieu d'être battue.

## Boundaries & Constraints

**Always:** P1 option 4 (aucun nouvel `!important`, gardes en `:where(html.x)`) ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)`, commun en liste combinée ; espacements aux jetons `--kr-space-*` ; fixture synthétique et réseau confiné ; aucun chargement de `/report` réel ; rouge sur le bundle de la base puis contre-épreuve par mutation.

**Never:** site réel, Chrome 9222/9223 ; popup 900×800 par `openReport` (entrée 2) ; bande vide du haut (entrée 3) ; marge latérale de 16 px et cibles de 44 px (épopée 9) ; taille du bilan `.mini.text-muted` ; masque de test nouveau.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobile, ligne date/texte | 375×667 et 767 px, 16 variantes | date (13 px) au-dessus du texte (15 px), texte sur toute la largeur de la ligne, pas de débordement | No error expected |
| Mobile, ligne non lue | `tr.bg-info` | filet inset 4 px sur le `tr`, toute sa hauteur, ≥ 3:1, aucun filet sur les cellules | No error expected |
| Ordinateur | 768, 769, 900×800, 1280, 1440, 1920 px | colonne de date de 100 px conservée, texte 14 px, date 13 px, filet et teinte sur la cellule de date | No error expected |
| Ligne à cellule unique | `td[colspan=2]` non lue | texte en taille de texte (pas de date), filet comme les autres | No error expected |
| Hors `/report` | même DOM sur `/jouer/evenements`, 375 et 900 px | règle générique inchangée (mobile : 13 px, 8 px) | No error expected |
| Bascule | 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet | rendu de chaque largeur après le rechargement de bascule | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` ~l.775-792 -- section `/report` (ligne non lue, filet sur `td:first-child`, `padding-left: 10px`)
- `kraland-theme.css` ~l.4656-4665 -- règle mobile générique `.table > … > td` en `!important` (13 px, 8 px), à garder hors `/report`
- `tests/e2e/report-non-lu.mjs` -- suite de la ligne non lue (fragments `fenetre` 600, `bureau` 1280, `portee` 600)
- `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs`, `tests/e2e/durations.json` -- fragments de la suite
- `tests/e2e/palette-nation.mjs` ~l.1430 -- relève le filet sur `td:first-child` à 375 px (garde « comme avant le ticket »)
- `.claude/skills/tester-kraland-css/SKILL.md`, `.hermes/skills/tester-kraland-css/SKILL.md` -- ligne de la zone report (600 et 1280)

## Tasks & Acceptance

**Execution:**
- [x] `kraland-theme.css` -- réécrire la section `/report` en trois blocs (commun, ordinateur, mobile) ; garder la règle mobile générique des tableaux hors `/report` -- P1 option 4, H14.1, H14.2
- [x] `tests/e2e/report-non-lu.mjs` -- fragments `popup` (900×800), `mobile` (375×667, 767), `bureau` (768, 769, 1280, 1440, 1920), `bascule` (767 ↔ 768), `portee` (375 et 900) ; critère N réécrit pour le mobile ; en-tête -- verify de l'entrée
- [x] `tests/e2e/palette-nation.mjs` -- relever le filet sur la ligne quand il y est, sinon sur la cellule de date -- garde « comme avant le ticket » toujours comparable
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs`, `durations.json`, deux copies du skill -- nouveaux fragments

**Acceptance Criteria:**
- Given le bundle de la base, when la suite adaptée tourne, then les critères mobiles (date au-dessus, 15 px, filet sur la ligne) et les dates à 13 px échouent (rouge).
- Given le bundle construit, when `test:zone -- report palette-nation` et `test:router` tournent, then tout est vert.
- Given une mutation (filet remis sur la cellule en mobile, ou `display: block` retiré), when la suite tourne, then elle échoue.

## Implementation Notes

- Assumption: la teinte à 14 % reste sur la cellule de date sur ordinateur seulement ; sur mobile, la date n'est plus une colonne, la teinte n'est pas reprise (maquette key-notifications-mobile, `[ASSUMPTION]`) : seul le filet marque la ligne.
- Assumption: l'inconnue de l'entrée est levée par le passage en bloc de `table`, `tbody`, `tr` et `td` sur mobile (proposition de L2) et `colgroup { display: none }`, plutôt que par un `box-shadow` sur un `tr` en `table-row`.
- Assumption: retrait gauche de la date non lue sur ordinateur à `--kr-space-3` (12 px, 8 px de jour après le filet de 4 px ; était 10 px). Cellules mobiles : `--kr-space-3` horizontal, date `--kr-space-2` en haut, texte `--kr-space-1` sous la date et `--kr-space-2` en bas. La marge de page de 16 px reste à l'épopée 9.
- Assumption: sur mobile, filet entre lignes conservé sur la première cellule seulement (`td + td` sans bordure haute), pour ne pas tirer de trait entre la date et le texte.
- Assumption: les tailles ne visent que les cellules du journal (`table > tbody > tr > td`) ; sur mobile, le bilan `.mini.text-muted` est ramené en `--kr-font-detail` (13 px, comme avant le ticket ; correctif de revue D8.1).
- Assumption: `/report` ne contient qu'un tableau `.table` (le journal) ; la mise en bloc mobile vise `table.table` (commentaire dans la feuille).

- Fichiers touchés : `kraland-theme.css` (section `/report` en trois blocs ; règle mobile générique des tableaux sous `:where(html:not(.kr-page-report))`), bundle et `version.json` régénérés, `tests/e2e/report-non-lu.mjs`, `tests/e2e/palette-nation.mjs` (relevé du filet), `tests/e2e/lib/router.mjs`, `router.test.mjs`, `durations.json`, les deux copies du skill `tester-kraland-css`.
- Surprise : sur mobile, la règle générique `.table … td { padding: 8px !important; font-size: 13px !important }` (~l.4656) imposait 13 px au texte ; elle est gardée hors `/report` au lieu d'être battue. Aucun `!important` ajouté (grep des lignes ajoutées : 0).
- Surprise : les cellules en bloc gardent la bordure haute de Bootstrap ; `td + td { border-top: 0 }` évite un trait entre date et texte. Sélecteurs mobiles en `table.table` pour passer devant `.table > tbody > tr > td` de Bootstrap (0,1,3) sans `!important`.
- `palette-nation.mjs` (`etats-pages-mobile`) lisait le filet sur `td:first-child` : rouge sur le nouveau bundle (« filets : none »), il lit désormais le filet de la ligne s'il existe, sinon celui de la cellule ; la comparaison au bundle d'avant reste exacte (même ombre).
- D8.1 (revue) : le bilan `.mini.text-muted` héritait de 15 px sur mobile, alors que l'intent classe sa taille en Never ; corrigé, règle `td .mini.text-muted { font-size: var(--kr-font-detail) }` dans le bloc mobile.
- Constat (hors ticket) : sur mobile, les lignes portant un lien sont plus hautes à cause de la cible tactile générique des liens (`min-height: 44px`), comme avant ; épopée 9.

## Review Triage Log

Passe 1 (revue indépendante, 2026-10-28) : 6 constats, tous en patch.

| # | Constat | Verdict | Action |
|---|---------|---------|--------|
| 1 | D8.1 : bilan `.mini.text-muted` passé de 13 à 15 px sur mobile, contraire au Never de l'intent | patch | règle mobile `td .mini.text-muted` en `--kr-font-detail` (13 px) ; assertion « bilan 13 px » à 375 et 767 ; contre-épreuve règle retirée → 32 FAIL |
| 2 | Hypothèse « un seul tableau .table » non écrite | patch | commentaire CSS sur le bloc mobile de mise en bloc |
| 3 | Mobile : rien ne garantit que le fond des `td` non lus laisse voir le filet inset du `tr` | patch | assertion C1 : fond calculé des `td` non lus `rgba(0, 0, 0, 0)` en mobile |
| 4 | `bascule` : `.catch(() => null)` muet sur le load | patch | load enregistré par passage et affirmé (`rechargement de bascule à chaque passage du seuil`) ; observé à chaque passage, aucun cas d'absence |
| 5 | `portee` : libellé trompeur | patch | message renommé « date à côté du texte hors /report » |
| 6 | Garde `:where(html:not(.kr-page-report))` sans contre-épreuve | patch | garde retirée du bundle (6 occurrences) : 32 FAIL en mobile (« taille du texte », 13 px imposé) ; `portee` reste vert ; bundle restauré (mutation sur copie dans /tmp) |

## Design Notes

Une garde négative sur la règle générique évite de la battre :

```css
:where(html:not(.kr-page-report)) .table > tbody > tr > td { padding: 8px !important; font-size: 13px !important; }
```

## Verification

**Commands:**
- `npm run build` -- expected: build et validation verts
- `KR_SCRIPT=/tmp/kr81/base.user.js node tests/e2e/report-non-lu.mjs` -- expected: rouge sur la base
- `npm run test:zone -- report palette-nation` -- expected: vert
- `npm run test:router`, `npm run test:unit` -- expected: vert
- `npm run lint:css`, `npm run lint:js` -- expected: code 0

## Result

Provisoire, implémenteur ; revue indépendante à faire. Base `db25ad4`, worktree `wt/8.1`, non commité.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (f24c332) et fusionné sur `feature/next` ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777`.

- Rouge avant : `KR_SCRIPT=/tmp/kr81/base.user.js node tests/e2e/report-non-lu.mjs` (bundle de la base, thème appliqué dans tous les cas) : exit 1, 236 FAIL / 784 ok ; ordinateur (768 à 1920, popup) : dates en 14 px ; mobile (375, 767, bascule) : filet absent de la ligne, date en colonne, texte en 13 px, teinte présente ; portée verte.
- Contre-épreuves (mutations du bundle construit, `KR_FRAG=mobile,popup`) : filet mobile retiré de la ligne → 96 FAIL (C1, B, C5) ; cellules remises en `table-cell` → 96 FAIL (L, N, débordement) ; taille des dates retirée → 48 FAIL (L). `palette-nation` `etats-pages-mobile` sur la mutation 1 → 1 FAIL.
- Contre-épreuves de la revue (`KR_FRAG=mobile,portee`, copies mutées du bundle dans /tmp) : garde `:where(html:not(.kr-page-report))` retirée de la règle générique → exit 1, 32 FAIL (L, taille du texte 13 px) ; règle du bilan retirée → exit 1, 32 FAIL (L, taille du bilan). Bundle du dépôt intact.
- Vert après les correctifs de revue : `npm run build` (validation passée) ; `npm run test:zone -- report palette-nation` 2396 ok / 0 FAIL (report-non-lu 1024, palette-nation 1372) ; `npm run test:router` exit 0 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (même avertissement de base).
- Vert avant revue : `npm run build` (validation passée) ; `npm run test:zone -- report` 1020 ok / 0 FAIL ; `npm run test:zone -- report palette-nation typographie-formes confinement` 6854 ok / 0 FAIL ; `npm run test:zone -- forum sous-forum kramail plateau modale-ordre cybermonde` (zones routées par le diff) 3504 ok / 0 FAIL ; `npm run test:router` exit 0 ; `npm run test:unit` 56/56 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement `no-loop-func` déjà présent sur la base).
- Largeurs couvertes : 375×667 et 767 (16 variantes), 768, 769, 1440, 1920 (Kraland clair, Empire Brun sombre), 900×800 et 1280 (16 variantes), bascule 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet.
- `npm run test:all` non lancé (interdit dans ce mandat) ; `test:changed` non lancé (le dossier `node_modules` non suivi l'élargit au total).
