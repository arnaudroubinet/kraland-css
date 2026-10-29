---
title: "Sur ordinateur, les champs `.form-control` s'affichent en 9,5 px"
type: 'bugfix'
ticket: '14'
created: '2026-10-29'
status: 'built'
baseline_revision: '5638f29605ed1066236ea7ff2791c204b91d2013'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/.claude/skills/tester-kraland-css/SKILL.md'
  - '{project-root}/_bmad-output/backlog/bug-sur-ordinateur-les-champs-form-control-s-affichent-en-9-5-px.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La règle globale `.form-control.form-control` (section « 4. FORMS » de `kraland-theme.css`) pose `font-size: .95rem` et `padding: .6rem .8rem`. Bootstrap 3 pose 10 px sur `html` : sur ordinateur, les `input` et `select` `.form-control` tombent à 9,5 px (retrait 6 × 8 px) au lieu des 14 px et 6 × 12 px natifs. Le mobile n'est pas touché : sa règle `.form-control` pose taille et retrait en `!important`.

**Approach:** P1 option 4 : réécrire la règle d'origine. Retirer la taille et le retrait de la règle globale ; les `input` et `select` reprennent les valeurs natives de Bootstrap (14 px = `--kr-font-body`, 6 × 12 px, `.input-sm` et `.input-lg` natifs). Le `textarea` garde son retrait par une règle de même spécificité au même endroit (`:where(textarea)`), sa taille reste celle de `textarea.form-control.form-control`. Aucun nouvel `!important`, mobile strictement inchangé. Preuve : fragment `champs` de `typographie-formes.mjs`, rouge sur le bundle de `5638f29`.

Décisions (orchestrateur, 2026-10-29) : taille cible 14 px ; retrait natif 6 × 12 px ; halos de focus et tailles rem du mobile hors périmètre (deferred-work.md) ; `.input-sm` / `.input-lg` natifs.

</frozen-after-approval>

## Implementation Notes

Route oneshot : une règle CSS réécrite et un fragment de test.

- `kraland-theme.css` (« 4. FORMS ») : `.form-control.form-control` ne garde que rayon et bord. Le textarea prend aussi le retrait natif 6 × 12 px (décision de revue, orchestrateur, 2026-10-29) ; sa taille reste celle de `textarea.form-control.form-control`. Aucun `!important`, règle mobile intacte.
- `tests/e2e/typographie-formes.mjs` : fragment `champs` (`COMMIT_CHAMPS = 5638f29`, `KR_SCRIPT_AVANT_CHAMPS`). 4 pages (report, kramail, forum, matériel), 375/767/768/769/1280 px × 2 variantes, sondes `.input-sm` / `.input-lg`, bascule 767↔768 dans le même onglet.
- `tests/e2e/lib/variantes.mjs` : `AVANT_BUG14` et `CORRIGER_BUG14` (base réécrite comme le bundle ; sans effet une fois la base recalée ; `console.warn` si une base encore en `.95rem` n'est pas reconnue). Appliqué aux bases d'echelle, echelle-forum, espacement, nettoyage, medias-410 (typographie-formes) et fil (forum-activite).
- Routeur : `typographie-formes` gagne le fragment `champs` (décrit dans le commentaire de la suite) ; attente Notifications de `router.test.mjs` élargie à typographie-formes.
- Reporté (deferred-work.md) : halos de focus en rem, tailles rem des règles mobiles.

## Verification

**Commands:**
- `npm run build` -- expected: validation postbuild OK
- `KR_FRAG=champs node tests/e2e/typographie-formes.mjs` -- expected: vert ; rouge avec `KR_SCRIPT=/tmp/baseb14.user.js`
- `npm run test:zone -- typographie-formes palette-nation modale-ordre parler kramail forum-activite report cloche cartes-pastilles confort-mobile messages forum plateau cybermonde` -- expected: 0 FAIL
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: exit 0

## Result

Après revue (textarea au retrait natif, avertissement de `CORRIGER_BUG14`, description du routeur) :

- `npm run build` : validation OK.
- Rouge : `KR_SCRIPT=/tmp/baseb14.user.js KR_FRAG=champs` → 39 FAIL (champs à 9.5px 6px 8px, textarea à 6 × 8, check statique).
- Vert : `KR_FRAG=champs` → 111 ok, 0 FAIL.
- Contre-épreuve textarea : règle `:where(textarea){padding:.6rem .8rem}` remise dans le bundle → 12 FAIL (kramail et forum, 768/769/1280 px, 2 variantes). Contre-épreuves antérieures : `.95rem` remis → 26 FAIL ; mobile 16 → 15 px → 20 FAIL.
- `npm run test:zone -- typographie-formes forum-activite` : forum-activite 1385 ok ; typographie-formes 4118 ok, 0 FAIL, mais `boutons` arrêté sous charge (`#kr-changelog-btn` introuvable, load ~40) ; `KR_FRAG=boutons` relancé seul : 412 ok, 0 FAIL. Aucun avertissement `CORRIGER_BUG14` dans les journaux.
- Premier passage (avant revue) : palette-nation, modale-ordre, kramail, report-non-lu, cartes-pastilles, confort-mobile, parler, cloche, messages, forum, plateau, cybermonde, sous-forum à 0 FAIL (flake de capture `kramail-redaction#regression`, vert seul).
- `npm run test:router` conforme, `npm run test:unit` exit 0, `npm run lint:css` exit 0, `npm run lint:js` exit 0 (1 avertissement préexistant, report-non-lu.mjs:97).
- `npm run test:all` non lancé (interdit ici) : à faire une fois, machine calme.
