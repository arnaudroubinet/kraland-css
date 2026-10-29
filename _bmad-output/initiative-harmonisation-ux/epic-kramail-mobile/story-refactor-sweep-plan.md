---
title: 'Refactor sweep de fin d''épopée 7 (kramail)'
type: 'refactor'
ticket: 10
created: '2026-10-29'
status: 'built'
baseline_revision: 'd64c5787d2f2636eb600f2204fa3a485d8af8688'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick-self']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem :** les entrées 7.1 à 7.8 laissent du CSS sans lecteur, un doublon JS entre `Kramail:Liste` et `Contacts:Page`, et des masques de tests conditionnés sur `AVANT_TICKET7x` devenus inertes une fois la base recalée.

**Approach :** retirer le seul sélecteur mort prouvé, factoriser le doublon, recaler les bases `COMMIT_*` masquées 7.x sur `d64c578` (premier SHA qui contient toutes les entrées) quand la comparaison absolue reste verte, puis retirer les masques et constantes devenus orphelins. A9 : figer la base de `kramail-redaction` sur `d64c578`.

## Boundaries & Constraints

**Always :** rendu inchangé ; aucun nouvel `!important` ; gardes `:where(html.x)` ; media 767/768 ; chaque retrait prouvé par suites vertes + grep sans lecteur ou rouge/vert ; chaque recalage justifié par zéro écart hors changements voulus des entrées.

**Never :** masques d'autres épopées (bug 14, 5.x, 9.x, `CARTES_TICKET54`, `MASQUE_FORUM_98`, `MASQUE_SUPERPOSITION_96`) ; classes `body.page-kramail*` (lecteurs vivants) ; écriture git ; test:all ; site réel.

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.9201-9202 -- sélecteur `… .pull-right > .btn-group > .btn > i` sans cible (kebab = `span`, sonde 13 fixtures × 2 largeurs).
- `kraland-userscript-template.js` ~l.6087-6209 -- `nameControls` et toucher de cellule dupliqués entre `Kramail:Liste` et `Contacts:Page`.
- `tests/e2e/lib/variantes.mjs` l.270-365 -- `AVANT_TICKET73/74/75/77`, `RETIRER_*` ; `AVANT_TICKET47/48/49`, `JETONS_REDEFINIS`, `TEXTE_SECONDAIRE_CLAIR` (seul lecteur : kramail-redaction).
- `tests/e2e/kramail-theme.mjs` (`BASE_SHA` 55ae556), `cartes-pastilles.mjs` (`COMMIT_AVANT` 6270c81, `COMMIT_AVANT_55` 59567f0), `confort-mobile.mjs` (`COMMIT_AVANT` abbe7be), `forum-activite.mjs` (`COMMIT_FIL`, `COMMIT_PLUS` 6270c81), `typographie-formes.mjs` (ECHELLE_FORUM, ESPACEMENT, NETTOYAGE 6270c81 ; BOUTONS, ECHELLE, RAYONS, CHAMPS), `kramail-redaction.mjs` (`bundleAvant` auto-référent).

## Tasks & Acceptance

**Execution :**
- [x] `kraland-theme.css` -- retirer le sélecteur mort -- aucun lecteur.
- [x] `kraland-userscript-template.js` -- helpers partagés `nommerControlesListe(noun…)` et toucher de cellule -- doublon 7.8.
- [x] `tests/e2e/*.mjs` -- recalages `COMMIT_*` sur `d64c578`, retrait des masques 7.x inertes, puis constantes orphelines.
- [x] `tests/e2e/kramail-redaction.mjs` -- A9 : base figée `d64c578`, masques 3.x/4.x/7.x inertes retirés.
- [x] `deferred-work.md`, `revue-manuelle.md` -- reports et clôtures.

**Acceptance Criteria :**
- Given le bundle reconstruit, when les zones kramail, forum, forum-activite, palette-nation, typographie-formes, cartes-pastilles, confort-mobile et test:router tournent, then tout est vert.
- Given une base recalée, when on rejoue avec l'ancienne base sans masque, then la suite est rouge (le masque servait), et verte avec la nouvelle.

## Implementation Notes

- CSS : sélecteur `… .pull-right > .btn-group > .btn > i` retiré (kebab = `span`, sonde 0 cible sur 13 fixtures × 2 largeurs). `!important` : 2946, inchangé.
- Template : `nommerControlesListe(noms)` et `cocherAuToucher(topics)` partagés par `Kramail:Liste` et `Contacts:Page`. `nameControls` du forum laissé à part (sélecteurs `.dataTables_filter`).
- Recalages sur `d64c578` : kramail-theme `BASE_SHA` (55ae556), confort-mobile `COMMIT_AVANT` (abbe7be), cartes-pastilles `COMMIT_AVANT` (6270c81), forum-activite `COMMIT_FIL` et `COMMIT_PLUS` (6270c81), typographie-formes `COMMIT_BOUTONS` (4d97496), `COMMIT_ECHELLE` (fe77411), `COMMIT_ECHELLE_FORUM` (6270c81), `COMMIT_RAYONS` (5ff22d3), `COMMIT_ESPACEMENT` (6270c81), `COMMIT_NETTOYAGE` (6270c81), palette-nation `BASELINE4` (6270c81, masque `dossier` retiré). A9 : kramail-redaction lit `d64c578` au lieu de `origin/feature/next`.
- Masques 7.x retirés avec leurs constantes ; masques 3.x et 4.x de kramail-redaction retirés (`JETONS_AVANT`, `SECONDAIRE_AVANT`, `ECHELLE_AVANT`, `ECHELLE_FORUM_AVANT`, `RAYONS_AVANT`, `ESPACEMENT_AVANT`, `MARQUER_COMPOSANTS`) ; exports orphelins de `lib/variantes.mjs` retirés (`JETONS_REDEFINIS`, `TEXTE_SECONDAIRE_CLAIR`, `ECHELLE_TICKET47`, `RAYONS_TICKET48`, `ESPACEMENT_TICKET49`, `AVANT_TICKET47/48/49/74/77`, `RETIRER_*`) ; commentaires du routeur ajustés.
- Gardés : bases dédiées `COMMIT_AVANT_55`, `COMMIT_CHAMPS`, `COMMIT_MEDIAS_410` et leurs masques `AVANT_TICKET73/75` (nettoyage m768 reclé sur `avantMedias410`) ; masques des autres épopées (sweep 9.12). D11 : close, aucun code.

## Plan Change Log

## Review Triage Log

- Revue indépendante : « approuvable après correctifs mineurs ». Corrigés : masque 7.2 inerte de `rayons` (lecture) retiré ; `BASELINE4` de palette-nation recalé, masque `dossier` retiré ; masque 7.5 de `champs` vérifié vivant sur 5638f29 (4 FAIL sans lui), gardé et reporté. Constats 4 et 5, antérieurs au ticket, reportés dans deferred-work.
- Revue quick (relecture du diff par l'agent) : aucun constat bloquant. Helpers hors IIFE de module, portée de l'IIFE principale, comportement identique (contre-épreuve mutant rouge). Revue indépendante à faire par l'orchestrateur avant fusion.

## Verification

**Commands :**
- `npm run build` -- succès + validation.
- `npm run test:zone -- <zone>` pour chaque zone citée ; `npm run test:router` -- verts.
- `npm run lint:css`, `npm run lint:js` séparés -- code 0.
- `grep -o '!important' kraland-theme.css | wc -l` -- ≤ 2946.

## Result

Sweep construit sur la base d64c578, non commité. Le `test:all` reste à lancer par l'orchestrateur.

| Preuve | Rouge (avant) | Vert (après) |
|---|---|---|
| Helpers partagés (template) | mutant : liste-actions 15 FAIL, contacts-boutons FAIL | zone kramail 1233 ok |
| Sélecteur mort (CSS) | sonde : 0 cible, 13 fixtures × 2 largeurs | zone kramail verte |
| kramail-theme 55ae556 → d64c578 | ancienne base sans masque : bureau et bascule rouges | vert |
| confort-mobile abbe7be → d64c578 | hors-perimetre : 4 FAIL | 912 ok |
| cartes-pastilles 6270c81 → d64c578 | bureau rouge (réception) | 2302 ok |
| forum-activite fil, plus 6270c81 → d64c578 | 18 FAIL | 1393 ok |
| typographie-formes (6 bases) → d64c578 | boutons 18, echelle 4, echelle-forum 20, rayons 53, espacement 48, nettoyage 44 FAIL | 4505 ok |
| palette-nation BASELINE4 6270c81 → d64c578 | composants-pages-mobile sans masque `dossier` : 1 FAIL | zone verte |
| rayons, lecture (masque 7.2 retiré après correctif de revue) | — | `KR_FRAG=rayons` vert |
| kramail-redaction A9 → d64c578 | `KR_SCRIPT_AVANT` 55ae556 : regression 12 FAIL | 335 ok |

Zones : kramail, forum, forum-activite, palette-nation, typographie-formes, cartes-pastilles et confort-mobile vertes. `test:router` est conforme. `lint:css` et `lint:js` sortent en code 0. Le compte de `!important` reste à 2946.


Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (1e09292) et fusionné sur `feature/next` (fe3550f), puis `redaction-palette` stabilisé par d8c8777 ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777` (SHA déduit de l'heure du journal).
