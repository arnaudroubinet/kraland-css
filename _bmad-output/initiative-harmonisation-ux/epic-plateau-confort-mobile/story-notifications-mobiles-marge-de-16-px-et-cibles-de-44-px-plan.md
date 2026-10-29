---
title: 'Notifications mobiles : marge de 16 px et cibles de 44 px'
type: 'feature'
ticket: '10'
created: '2026-10-29'
status: 'built'
baseline_revision: '8420e3a0b857f7cbb17e2ddf690ba98617965bee'
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

**Problem:** sur mobile, la page `/report` finie par l'épopée des notifications n'a pas la marge de l'entrée 1 : pas de `kr-marge-mobile`, texte des lignes du journal à 12 px du bord (padding de cellule `--kr-space-3`), paragraphe et pagination posés directement dans `body` à 0 px. Les cibles hors bouton (sélecteur, onglets, pagination) font déjà 44 px ou plus sur la base (relevé de la fixture à 320, 375, 767 px).

**Approach:** déclarer `/report` dans `KR_PAGE_CLASSES` (classes `kr-page-report kr-marge-mobile`, la bascule isolée d'`applyVariant` disparaît) ; sous `@media (max-width: 767px)` et la garde `:where(html.kr-page-report)`, cellules du journal à `--kr-marge-page` en horizontal (filet de 4 px et ligne restent pleine largeur), enfants directs `p` et `.pagination` du `body` à la marge ; mesures dans `report-non-lu.mjs`, nouveau fragment `confort`.

## Boundaries & Constraints

**Always:** P1 option 4 (règle de cellule réécrite, pas battue) ; aucun nouvel `!important` ; gardes `:where(html.x)` ; mobile en `(max-width: 767px)` seul ; marge par `var(--kr-marge-page)` ; bandeau du sélecteur gardé à 16 px du haut (8.3) et à sa marge en ligne native de 10 px ; cibles ≥ 44 × 44 par la boîte et elementFromPoint ; fixture synthétique `report-non-lu.html`, réseau confiné.

**Never:** site réel ni `/report` réel ; ordinateur et popup 900 × 800 (égaux à la base) ; liens au fil du texte des lignes (H9.1) ; boutons ; couleurs et tailles de la ligne (8.1) ; règle `body` globale.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobile | fixture `/report/perso-000000`, 320 / 375 × 667 / 767 px, Kraland clair et Empire Brun sombre | `kr-page-report` et `kr-marge-mobile` posées ; aucun nœud texte visible à moins de 16 px d'un bord ; texte du sélecteur ≥ 16 px des deux bords ; bandeau à 16 px du haut ; sélecteur, onglets et pages de la pagination ≥ 44 × 44 aux cinq points ; aucun débordement | No error expected |
| Ordinateur | 768, 900 × 800, 1280 px | boîtes de tous les textes égales au bundle de base 8420e3a | No error expected |
| Bascule | 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet | marge et cibles à 767 ; textes égaux à la base à 768 | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.307 `KR_PAGE_CLASSES` (bloc pur `identite`) -- ajouter `/^\/report(?:\/|$)/` → `kr-page-report`, `kr-marge-mobile` ; retirer `isReport` et sa bascule d'`applyVariant` (l.3726-3728) : la boucle l.3735 bascule déjà toute classe déclarée.
- `kraland-theme.css` l.819-860 (bloc mobile de la section `/report`) -- cellule `padding: var(--kr-space-1) var(--kr-space-3) var(--kr-space-2)` : horizontal en `var(--kr-marge-page, var(--kr-space-3))` ; nouvelle règle `body.mobile-mode > :is(p, .pagination)`. `--kr-marge-page` n'existe que sous `:where(html.kr-marge-mobile) body.mobile-mode` (l.6951). Bandeau et règle `body` du haut de page (l.802) : ne pas toucher.
- `tests/e2e/report-non-lu.mjs` -- fragment `confort` ; réutiliser `open`, `DEUX`, `croise`, `mapLimit`, `TEXTES_HORS_MARGE_PAGE`, `CIBLE_PAGE`, `ecartsCible` (lib/marges.mjs) ; base : `git show 8420e3a` ou `KR_SCRIPT_AVANT`.
- `tests/e2e/confort-mobile.mjs` l.83 -- `report` sort de `HORS` (page désormais dans le périmètre, mesurée par report-non-lu#confort), en-tête l.11.
- `tests/e2e/lib/router.mjs` l.50, `router.test.mjs` l.43-52 -- frag `confort` ; la fixture ne route plus vers confort-mobile.
- `tests/unit/identite.test.mjs` l.25 -- `/report` sort de la liste vide ; `/report`, `/report/perso-1` attendus.
- Skills `tester-kraland-css` (deux copies) l.20 -- citer le fragment.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- entrée `/report` dans `KR_PAGE_CLASSES`, bascule `isReport` retirée.
- [x] `kraland-theme.css` -- cellules à la marge, `p` et `.pagination` du `body` à la marge.
- [x] `tests/unit/identite.test.mjs` -- chemins `/report`.
- [x] `tests/e2e/report-non-lu.mjs` -- fragment `confort` (matrice entière).
- [x] `tests/e2e/confort-mobile.mjs`, `router.mjs`, `router.test.mjs`, skills -- périmètre et routage.

**Acceptance Criteria:**
- Given le bundle de base 8420e3a (`KR_SCRIPT`), when `KR_FRAG=confort` tourne, then les contrôles de classe et de marge échouent, ceux d'ordinateur passent.
- Given une mutation retirant la règle des cellules, ou celle de `p`/`.pagination`, when le fragment tourne, then il échoue.
- Given les suites qui mesurent `/report` (report-non-lu, palette-nation, confort-mobile, typographie-formes, cartes-pastilles), when elles tournent, then elles sont vertes.

## Implementation Notes

- Implémentation directe par l'agent mandaté (consigne de l'appelant), sans sous-agent ; checkpoint du plan sauté (mode autonome).
- Cibles : sélecteur, onglets et pages de pagination font déjà ≥ 44 × 44 sur la base 8420e3a ; le fragment `confort` les verrouille (6 cibles), aucun CSS de cible ajouté.
- `report` sort de `PAGES`/`HORS` de `confort-mobile.mjs` : changement de périmètre, pas un masque. Conflit de fusion probable avec 9.8, qui retire d'autres pages de la même liste.
- Test unitaire : `/reports` remplace `/report` dans la liste des chemins sans classe (garde de l'ancre `(?:\/|$)`).
- `durations.json` non modifié : le fragment `confort` neuf est lancé en tête (durée manquante, pas d'échec).
- Revue : mots-clés génériques de la marge routés aussi vers `report` ; commentaire de `confort-mobile` dans le routeur corrigé.

## Plan Change Log

## Review Triage Log

| # | Lens | Constat | Verdict | Route | Preuve |
|---|------|---------|---------|-------|--------|
| 1 | quick | `router.mjs` : les mots-clés `kr-marge-mobile`, `kr-marge-page`, `kr-margin-mobile`, `KR_PAGE_CLASSES` routaient seulement vers `confort-mobile`, qui ne mesure plus `/report`. | medium | patch | Vérifié l.246 : `['confort-mobile']` seul. Ajout de `'report'` et d'une assertion dans `router.test.mjs` ; contre-épreuve (retrait de `'report'`) : FAIL du cas « marge mobile ». |
| 2 | quick | `router.mjs` l.110-113 : le commentaire de `confort-mobile` cite encore les notifications hors périmètre. | low | patch | Vérifié ; direct correction du commentaire. |

Revue indépendante de l'orchestrateur (2026-10-29), verdict global conforme :

| # | Constat | Décision | Suite donnée |
|---|---------|----------|--------------|
| 1, 3, 6, 9, 11 | Constats de conformité | conforme | Aucune action |
| 2 | Structure réelle de `/report` non vérifiée (`body > :is(p, .pagination)`) | consigné | Doute complété dans `revue-manuelle.md` (cloche active, GET /report interdit) |
| 5 | Retouche facultative | écarté | Aucune action |
| 10 | Conflit avec 9.8 (`confort-mobile.mjs`, `router.mjs`) | orchestrateur | Traité à la fusion |
| — | `router.test.mjs` : hunk synthétique citant `classList.toggle('kr-page-report', isReport)`, code supprimé | patch | Remplacé par la ligne `/report` de `KR_PAGE_CLASSES` ; zones attendues `confort-mobile` et `report` |
| — | `router.mjs` : `kr-page-jeu`, `kr-page-aide`, `kr-page-secondaire` routés vers `report` | patch | Seuls les jetons génériques routent vers `report` ; les classes de page restent sur `confort-mobile` |
| — | `report-non-lu.mjs` : `COMMIT_AVANT_910` sans consigne de recalage | patch | Commentaire : avancer la base, ou passer `KR_SCRIPT_AVANT`, à la prochaine retouche du rendu ordinateur de /report |

## Design Notes

- Cellules plutôt que `body` : un padding du `body` décalerait le bandeau (10 px natif) et couperait le filet pleine largeur de la ligne non lue.
- Repli `var(--kr-marge-page, var(--kr-space-3))` : avant `mobile-mode`, la cellule garde ses 12 px de la base.

## Verification

**Commands:**
- `npm run build` -- validation OK.
- `KR_SCRIPT=/tmp/base910.user.js KR_FRAG=confort node tests/e2e/report-non-lu.mjs` -- rouge ; sans KR_SCRIPT -- vert.
- `npm run test:zone -- report confort-mobile palette-nation typographie-formes cartes-pastilles` -- vert.
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- code 0.

## Result

Statut `in-review` sur wt/9.10 (base 8420e3a, non commité).

- Rouge : `KR_SCRIPT=/tmp/base910.user.js KR_FRAG=confort node tests/e2e/report-non-lu.mjs` -- 24 FAIL (classes et marge à 320, 375, 767 px et aux étapes 767 des bascules) ; ordinateur et cibles verts.
- Vert : `KR_FRAG=confort node tests/e2e/report-non-lu.mjs` -- 64 ok, 0 FAIL.
- Contre-épreuves (bundles mutés) : padding de cellule rendu à `--kr-space-3` -- 12 FAIL ; règle `p`/`.pagination` neutralisée -- 12 FAIL ; `kr-marge-mobile` retirée de `KR_PAGE_CLASSES` -- 24 FAIL.
- `npm run test:zone -- report cloche` -- 1307 ok ; `confort-mobile palette-nation` -- 2300 ok ; `typographie-formes cartes-pastilles parler` -- 6807 ok ; `initialisation transitions profil` -- 504 ok ; 0 FAIL.
- `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- code 0 ; `npm run test:router` -- conforme (après correctif de revue, contre-épreuve rouge).
- `npm run build` -- VALIDATION PASSED ; `!important` : 3180 avant et après ; `diff -r .hermes/skills .claude/skills` vide.
- Non lancés (interdits par le mandat) : `test:all`, `test:changed`.
