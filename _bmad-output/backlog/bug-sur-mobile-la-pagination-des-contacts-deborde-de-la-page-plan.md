---
title: "Sur mobile, la pagination des Contacts déborde de la page"
type: 'bugfix'
ticket: '30'
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
  - '{project-root}/_bmad-output/backlog/bug-sur-mobile-la-pagination-des-contacts-deborde-de-la-page.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, la pagination DataTables des Contacts (`#topics_paginate`) est une rangée flex `nowrap` centrée, hors du cadre défilant du tableau : dès que ses boutons dépassent la largeur de la carte, la page entière défile (relevé connecté : `scrollWidth` 459 pour 375). La fixture actuelle (3 pages, compactée en « ‹ 1 2 3 › ») ne déborde pas ; la structure réelle qui déborde n'est pas relevée.

**Approach:** CSS seul, bloc mobile, garde `:where(html.kr-page-contacts)` : la pagination et son `span` de numéros passent en `flex-wrap: wrap` (rangées espacées de 4 px), cibles de 44 px inchangées. Le correctif ne dépend pas de la structure. Nouveau fragment `kramail-theme#contacts-pagination` : fixture, pagination longue « 1 2 3 4 5 … 13 » et pagination `full_numbers` (Premier / Dernier, variante plausible qui déborde sur la base) à 320 et 375, Kraland clair et Empire Brun sombre : `scrollWidth` = viewport, boutons visibles dans la carte et à 44 × 44 ; 768 et 1280 égaux à la base. Capture de la structure réelle demandée dans revue-manuelle.md.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, bloc CONTACTS mobile : `flex-wrap: wrap !important` sur `.dataTables_paginate`, et `display: contents` sur son `> span` (ajout après la revue : un seul flux, coupé bouton par bouton ; dérivé à 320 px en 2 rangées au lieu de 3).
- Tests : `kramail-theme#contacts-pagination`, dérivés `contacts-longue` (1 2 3 4 5 … 13) et `contacts-full` (full_numbers, Premier / Dernier). Sur la base, `contacts-full` déborde à 463 px (relevé du site : 459). Les boutons désactivés (`pointer-events: none` natif) sont exclus du contrôle elementFromPoint.

## Verification

**Commands:**
- `KR_FRAG=contacts-pagination node tests/e2e/kramail-theme.mjs` -- rouge sur la base, vert après.
- `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js KR_FRAG=contacts-pagination node tests/e2e/kramail-theme.mjs` -- rouge.

**Résultats (2026-10-31) :**
- `KR_FRAG=contacts-pagination` : 48 ok, 0 FAIL (3 pages × 320/375 × deux variantes : scrollWidth = largeur, boutons 44 × 44 dans la carte ; 768/1280 égaux à la base).
- Rouge avant = contre-épreuve `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js` : 8 FAIL (contacts-full : scrollWidth 463, « Suivant » et « Dernier » hors carte).
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router conforme. test:all : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant, lot B), 2026-10-31 :
- Retour à la ligne à deux niveaux (le span part en bloc) : **corrigé** (`display: contents`).
- `scrollWidth` comparé à `innerWidth` (faux vert possible en `isMobile`) : **corrigé** (comparaison avec la largeur demandée).
- Structure réelle supposée (full_numbers) : **doute**, capture demandée dans revue-manuelle.md.
- Liste du kramail exposée à la même règle `nowrap` : **différé** (hors ticket), consigné.
