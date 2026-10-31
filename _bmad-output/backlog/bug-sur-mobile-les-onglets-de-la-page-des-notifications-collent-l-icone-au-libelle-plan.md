---
title: "Sur mobile, les onglets de la page des notifications collent l'icône au libellé"
type: 'bugfix'
ticket: '27'
created: '2026-10-31'
status: 'built'
baseline_revision: '245b8f78a54114adc4efbc4976803c558f66cb99'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/.claude/skills/tester-kraland-css/SKILL.md'
  - '{project-root}/_bmad-output/backlog/bug-sur-mobile-les-onglets-de-la-page-des-notifications-collent-l-icone-au-libelle.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, la règle tactile globale des liens (`a:not(.list-group-item)` en `inline-flex !important`, bloc `@media (max-width: 767px)`) fait de l'icône et du libellé deux items flex : l'espace blanc qui les séparait n'est plus rendu. Sur `/report`, les onglets Rapport et Combats (`#myTab.nav-tabs > li > a`) collent l'icône au libellé (0 px à 375 et 767 ; 3,9 px dès 768, par l'espace blanc).

**Approach:** CSS seul, bloc mobile, garde `:where(html.kr-page-report)` : `gap: var(--kr-space-1)` (4 px, pas de la grille) sur `.nav-tabs > li > a`. Le `gap` vaut aussi si le site sert l'icône sans espace blanc. Ordinateur inchangé (critère 2 du ticket gardé tel quel ; la note « bureau aussi à 0 px sur le site » est consignée comme doute). Nouveau fragment `report-non-lu#onglets` : écart de 4 ± 0,5 px à 320, 375 et 767, Kraland clair et Empire Brun sombre, fixture et variante sans espace blanc ; 768 et 1280 égaux au bundle de base ; bascule 767 ↔ 768 dans les deux sens.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, bloc mobile de /report (« Marge mobile », épopée 9) : `:where(html.kr-page-report) .nav-tabs > li > a { gap: var(--kr-space-1); }`. La garde laisse intacte la barre `.mobile-tab-bar` (ticket 19, /jouer seulement).
- Tests : `report-non-lu#onglets`. `open()` accepte un corps HTML (dérivé « sans espace », `</i>Rapport`). Base de comparaison : `COMMIT_AVANT_27` = 245b8f7 (`KR_SCRIPT_ONGLETS`). Le fragment est enregistré dans `router.mjs` et `router.test.mjs`.

## Verification

**Commands:**
- `KR_FRAG=onglets node tests/e2e/report-non-lu.mjs` -- rouge sur la base, vert après.
- `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js KR_FRAG=onglets node tests/e2e/report-non-lu.mjs` -- rouge.

**Résultats (2026-10-31) :**
- `KR_FRAG=onglets` : 32 ok, 0 FAIL (4,0 px à 320/375/767, deux variantes, avec et sans espace ; 768/1280 égaux à la base ; bascule dans les deux sens).
- Rouge avant = contre-épreuve `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js` : 14 ok, 18 FAIL (0,0 px).
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router conforme. test:all : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant, lot B), 2026-10-31 :
- `.mobile-tab-bar` non touchée : vérifié, sans objet.
- Ordinateur à 0 px sur le site (HTML sans espace), alors que le critère 2 dit « inchangé » : **doute**, consigné dans revue-manuelle.md (à trancher, capture de `#myTab` demandée).
