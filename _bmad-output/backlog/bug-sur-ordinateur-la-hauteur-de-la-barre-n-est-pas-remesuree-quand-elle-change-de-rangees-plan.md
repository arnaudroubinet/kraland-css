---
title: "Sur ordinateur, la hauteur de la barre n'est pas remesurée quand elle change de nombre de rangées"
type: 'bugfix'
ticket: '32'
created: '2026-10-31'
status: 'built'
baseline_revision: 'efe6439b169a72e868b0b5a1e804a2083e9baa28'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** De 992 à 1359 px, `applyNavbarPadding` mesure la barre une seule fois (rAF + 200 ms), puis seulement au redimensionnement. Si le contenu de la barre change de rangées après cette mesure, le `max-height` de la barre et le `padding-top` du corps restent à l'ancienne hauteur : les entrées débordent et couvrent le haut du contenu. Cause confirmée sur fixture : le logo du thème (`img.kr-logo`, `replaceNavbarBrand`) n'a pas de largeur tant que l'image n'est pas réglée ; quand son erreur arrive après la mesure, le texte de remplacement élargit la marque et la barre passe de 1 à 2 rangées à 1100 px (barre et `padding-top` à 60 px, entrées jusqu'à 120 px). C'est le rouge rare de `breakpoint-switch#nav-large`/`#nav-origine`.

**Approach:** Sur ordinateur (≥ 992 px, hors mode mobile), remesurer quand la hauteur des listes de la barre (`.navbar-nav`) change, par un `ResizeObserver`, sans redimensionnement de fenêtre. Remesure seulement si une hauteur observée diffère de celle relevée à la dernière mesure : pas de boucle, puisque la remesure ne touche que la barre et le corps.

</frozen-after-approval>

## Acceptance

- Logo refusé 1500 ms après la requête, 1100 px : une fois l'image réglée et la page stable, `padding-top` du corps = hauteur de barre (±1 px), aucune entrée hors de la barre.
- Entrée ajoutée à la barre après `data-kr-ready` (passage à une rangée de plus), sans redimensionnement : même résultat.
- 900 px (< 992) avec logo tardif : aucun `padding-top` ni `max-height` en ligne.
- Page stable : aucune mutation de `style` de la barre ni du corps pendant 1 s simulée (pas de boucle).

## Test

`tests/e2e/breakpoint-switch.mjs`, nouveau fragment `nav-tardif` (fixture `plateau-navbar-large.html`) : route du logo retardée de 1500 ms avant refus, plus une entrée insérée après le marqueur. Rouge attendu sur le bundle de `baseline_revision` (`KR_SCRIPT`). Fragment ajouté dans `tests/e2e/lib/router.mjs` et `tests/e2e/durations.json`. `tests/e2e/accueil-mobile.mjs#bureau` : référence de base remesurée après le logo.

## Implementation Notes

Oneshot : un module (~15 lignes) et un fragment de test.

- Cause confirmée avant tout correctif (script hors dépôt `/tmp/kr-b32/repro.mjs`, bundle de base) : logo refusé 1500 ms après sa requête, 1100 px, `plateau-navbar-large.html` : barre et `padding-top` à 60 px, bas des entrées à 120 px ; refus immédiat : 120/120. Relevé image par image : la marque passe de 16 à 68 px à l'arrivée de l'erreur, le `.container` de la barre de 60 à 120 px.
- `kraland-userscript-template.js` `applyNavbarPadding` (~l.890-900) : relève `rowHeights(nav)`, hauteurs des enfants directs de la barre, à chaque mesure. `watchNavbarRows` (~l.937-946), posé par `fixNavbarPadding` après la première mesure : `ResizeObserver` sur ces enfants, qui rappelle `applyNavbarPadding` seulement à ≥ 992 px hors mode mobile et si une hauteur diffère du dernier relevé. Sans `ResizeObserver` : comportement d'avant.
- Surprise : observer les `.navbar-nav` ne marche pas, leur `offsetHeight` reste à 0 (entrées flottantes) ; seul le conteneur suit le nombre de rangées.
- `tests/e2e/breakpoint-switch.mjs` : fragment `nav-tardif` (logo refusé après 1500 ms à 1100, 900 et 375 px ; 8 entrées ajoutées après le marqueur à 1280 px ; 0 mutation de `style` de la barre et du corps en 1 s simulée). `tests/e2e/lib/router.mjs`, `tests/e2e/durations.json` : fragment déclaré.
- `tests/e2e/accueil-mobile.mjs` `mesurer` : le rouge de `bureau` venait du côté **base** (`e2bcdd1`, même défaut) : « Nouvelles » à 161 au lieu de 211 quand le logo arrive tard. Le correctif produit ne le supprime pas. La référence est donc remesurée (logo réglé, `resize` simulé, 400 ms, deux images) ; le bundle testé ne l'est pas.

- Après revue : l'observateur ne remesure pas si la largeur a changé depuis la dernière mesure (`lastWidth`, ~l.948) : le redimensionnement reste à `ResizeManager` (anti-rebond). `nav-tardif` lâche le logo après la mesure de chargement (1 s simulée + deux images), plus un contrôle « scénario produit ». `accueil-mobile` : remesure de la base limitée à ≥ 992 px.
- Surprise : `html[data-kr-ready]` attend le `load`, donc le logo ; un logo tenu jusqu'au marqueur bloque la page.

## Review Triage Log

Passe 1 (quick) : 0 high, 2 medium, 2 low, 0 false, 0 maybe-false (5 constats). 3 corrigés, 1 rejeté, 1 reporté à Arnaud.

| Constat | Verdict | Route | Preuve / action |
|---|---|---|---|
| L'intention figée dit `.navbar-nav`, le code observe les enfants de la barre | low | defer | Réel ; le bloc figé ne se modifie pas sans Arnaud. Raison technique notée (hauteur des `.navbar-nav` à 0). Consigné dans `revue-manuelle.md`, section « Ticket backlog 32 ». |
| `nav-tardif` 1100 px : rouge sur la base dépendant du minutage (logo refusé à 1500 ms réelles), sans contrôle que le scénario a eu lieu | medium | patch | Réel. Logo lâché après la mesure de chargement ; contrôle « scénario produit » (logo en attente, barre 60, puis entrées à 120). Base : 3 FAIL, bundle : vert. |
| `ResizeObserver` remesure sans anti-rebond pendant un redimensionnement | medium | patch | Réel (la largeur du `.container` change à chaque pas). Rappel ignoré si `innerWidth` diffère de la dernière mesure. |
| Enfant ajouté à `nav.navbar` après coup non observé | low | rejet | Aucun module n'ajoute d'enfant direct à la barre (insertions en frère ou dans `.navbar-header`) ; consigné dans `revue-manuelle.md`. |
| `accueil-mobile` : base seule remesurée, aussi à 768/769 px | low | patch | Limité à `c.width >= 992`. L'asymétrie reste voulue (la base a le défaut), consignée. |

## Verification

**Commands:**
- `npm run build && npm run test:zone -- <les 20 zones des suites qui citent navbar ou padding-top, plus accueil-mobile>` -- expected: 0 FAIL
- `KR_SCRIPT=<bundle de base> KR_FRAG=nav-tardif node tests/e2e/breakpoint-switch.mjs` -- expected: FAIL
- `npm run lint:css` ; `npm run lint:js` ; `npm run test:router` ; `npm run test:unit` -- expected: exit 0
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide
- `caffeinate -ims npm run test:all` -- expected: RÉSULTAT : VERT

## Result

Preuves sur `efe6439b169a72e868b0b5a1e804a2083e9baa28` + arbre de travail (worktree `wt/b32`, sans commit) :
- Cause confirmée avant correctif : `/tmp/kr-b32/repro.mjs` (hors dépôt), bundle de base, logo refusé à 1500 ms, 1100 px : barre 60, `padding-top` 60, bas des entrées 120. Refus immédiat : 120/120/120.
- `KR_FRAG=nav-tardif node tests/e2e/breakpoint-switch.mjs` : 10 ok, 0 FAIL. Contre-épreuves `KR_SCRIPT` : bundle de base, 3 FAIL (entrées hors barre à 1100 et 1280 px, `padding-top` 60 au lieu de 120) ; bundle muté (`setInterval(applyNavbarPadding, 300)`), 2 FAIL (16 mutations de style en 1 s).
- `accueil-mobile#bureau` avec logo retardé de 1500 ms (copie temporaire de la suite, supprimée) : avant la retouche du test, 4 FAIL (« Nouvelles » base à 160/161 au lieu de 210/211, comme le rouge du ticket 22) ; après : vert. Même copie avec `KR_SCRIPT` = bundle de base : FAIL, le bundle testé garde le défaut.
- `caffeinate -ims npm run test:zone -- <20 zones>` (suites qui citent `navbar` ou `padding-top`, plus `accueil-mobile`) après les corrections de revue : 17170 ok, 0 FAIL, VERT.
- `caffeinate -ims npm run test:all` après la dernière modification du code : 19016 ok, 0 FAIL, VERT en 429 s.
- `lint:css` 0 ; `lint:js` 0 (3 avertissements antérieurs) ; `test:router` « Routeur conforme » ; `test:unit` 58 pass ; `diff -r .hermes/skills .claude/skills` vide.

- Decision (orchestrateur, 2026-10-31) : observer les enfants de `nav.navbar` (`.container`) plutôt que les `.navbar-nav` est retenu ; les `.navbar-nav` gardent une hauteur de 0 (entrées flottantes). L'intention figée est amendée en ce sens.
