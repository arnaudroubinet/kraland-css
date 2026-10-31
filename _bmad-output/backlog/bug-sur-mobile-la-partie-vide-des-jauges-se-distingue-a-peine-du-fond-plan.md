---
title: "Sur mobile, la partie vide des jauges se distingue à peine du fond"
type: 'bugfix'
ticket: '23'
created: '2026-10-31'
status: 'built'
baseline_revision: '036c8325cabee0ae6ffc64d6c26efd4236f2ac69'
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
  - '{project-root}/_bmad-output/backlog/bug-sur-mobile-la-partie-vide-des-jauges-se-distingue-a-peine-du-fond.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile (≤ 767 px), la piste des jauges du mini-profil (`.mobile-gauge-compact-bar`, `.mobile-gauge-full-bar`) n'a ni bordure ni ombre : `--kr-gauge-track` (`#f5f5f5` en clair, bg-elevated en sombre) sur bg-surface donne ≈ 1,09:1 à 1,14:1, la partie vide d'une jauge se voit à peine.

**Approach:** CSS seul, bloc mobile de `kraland-theme.css` : `border: 1px solid var(--kr-border-tint)` sur les deux pistes, hauteur extérieure, rayon et `overflow: hidden` conservés (boîte `border-box` de Bootstrap). Bureau inchangé. Nouveau fragment `palette-nation#jauges-filet` : filet de 1 px à la couleur de `--kr-border-tint` sur les quatre côtés (16 variantes à 375, Kraland et Empire Brun sombre à 700 et 767, plié et déplié), contraste du filet sur le fond consigné, remplissage et hauteur comparés au bundle de base, 768 / 769 / 1280 égaux à la base.

</frozen-after-approval>

## Implementation Notes

Route oneshot : une règle CSS sur deux sélecteurs et un fragment de test.

- `kraland-theme.css` (bloc mobile, `.mobile-gauge-compact-bar` et `.mobile-gauge-full-bar`) : `border: 1px solid var(--kr-border-tint) !important`. Boîte `border-box` (Bootstrap) : hauteur extérieure inchangée (6 et 12 px), remplissage dans la boîte intérieure, donc 4 et 10 px de haut au lieu de 6 et 12. Rayon et `overflow: hidden` inchangés. Aucun changement JS.
- `tests/e2e/palette-nation.mjs` : fragment `jauges-filet` (base `BASELINE23 = '036c832'`, `KR_SCRIPT_AVANT23`). `ouvrir` reçoit une option `tactile` (défaut inchangé) pour la bascule à la souris.
- `tests/e2e/typographie-formes.mjs` (nettoyage) : `IGNORER_JAUGES` écarte, en mode mobile seulement, les bordures des pistes et la géométrie du remplissage (largeur, hauteur, `right`, `bottom` et formes logiques). Pas de `CORRIGER_BUG23` : le changement est voulu, la base n'est pas fausse.
- `tests/e2e/lib/router.mjs` : fragment `jauges-filet` déclaré.
- Surprise : en sombre, `--kr-border-tint` vaut `rgba(255, 255, 255, 0.08)` (translucide). Le raccourci `background` garde `background-clip: border-box` : le filet est 8 % de blanc sur la piste elle-même. Le contraste est composé ainsi.

### Contraste mesuré (critère 3), 375 px, fixture `palette-nation-jauges.html`

Filet composé sur la piste, comparé au fond effectif sous la piste (blanc en clair, bg-surface sombre) ; entre parenthèses, la piste seule (avant).

| Variante | Filet | Piste seule |
|---|---|---|
| Kraland | 1,41:1 | 1,09:1 |
| Empire Brun | 1,36:1 | 1,09:1 |
| Paladium | 1,13:1 | 1,09:1 |
| Théocratie Seelienne | 1,40:1 | 1,09:1 |
| Paradigme Vert | 1,33:1 | 1,09:1 |
| Khanat Elmérien | 1,41:1 | 1,09:1 |
| Confédération Libre | 1,25:1 | 1,09:1 |
| Royaume de Ruthvénie | 1,32:1 | 1,09:1 |
| Kraland sombre | 1,42:1 | 1,12:1 |
| Empire Brun sombre | 1,46:1 | 1,14:1 |
| Paladium sombre | 1,39:1 | 1,10:1 |
| Théocratie sombre | 1,45:1 | 1,14:1 |
| Paradigme Vert sombre | 1,48:1 | 1,16:1 |
| Khanat sombre | 1,39:1 | 1,10:1 |
| Confédération sombre | 1,42:1 | 1,12:1 |
| Ruthvénie sombre | 1,45:1 | 1,14:1 |

## Verification

**Commands:**
- `KR_FRAG=jauges-filet node tests/e2e/palette-nation.mjs` -- bundle de base (avant correctif) : 46 ok, 22 FAIL ; après : 68 ok, 0 FAIL.
- `KR_SCRIPT=/tmp/kr-base-036c832.user.js KR_FRAG=jauges-filet node tests/e2e/palette-nation.mjs` -- 46 ok, 22 FAIL (filet absent : 16 variantes à 375, 700, 767, bascule).
- `KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs` -- 413 ok, 0 FAIL (avant `IGNORER_JAUGES` : 4 FAIL, pistes et remplissages) ; même commande avec `KR_SCRIPT` de base : 413 ok.
- `npm run test:zone -- palette-nation plateau profil typographie-formes cartes-pastilles` -- 10401 ok, 4 FAIL (nettoyage, corrigé ensuite).
- `caffeinate -ims npm run test:all` (une fois, en fin) : 19378 ok, 0 FAIL, RÉSULTAT : VERT.
- `npm run test:router` conforme ; `lint:css` 0 ; `lint:js` 0 (3 avertissements préexistants, hors fichiers touchés) ; `test:unit` 62/62.

## Review Triage Log

Revue quick (1 sous-agent, inspection), 6 constats : 5 patch, 1 consigné dans revue-manuelle.md.

- medium, patch : critère 3, contraste non consigné dans le plan. Tableau ajouté (Implementation Notes).
- medium, patch : contraste sombre composé sur le fond du parent, alors que la piste passe sous le filet (`background-clip: border-box` du raccourci `background`). `RELEVER23` compose maintenant sur la piste quand le clip est `border-box` ; valeurs sombres de 1,23-1,25:1 à 1,39-1,48:1.
- low, consigné : gain visible du filet en sombre faible (jeton translucide à 8 %). Choix de jeton tranché le 2026-10-30 ; à valider à l'œil par Arnaud.
- low, patch : critère 4 cité à 1280 × 720, mesuré en × 900. Hauteur ordinateur du fragment passée à 720.
- low, patch : lecture de `compacte.contrasteFilet` hors `check` (TypeError si le profil manque). Garde ajoutée.
- low, patch : commentaire du routeur complété (backlog 23). `test:router` conforme.

- Decision (orchestrateur, 2026-10-31) : hauteur extérieure gardée (remplissage 4 et 10 px, toléré par le critère 2) plutôt qu'un mini-profil plus haut de 6 px ; jeton border-tint conservé, gain en sombre à juger à l'œil par Arnaud à la passe finale.
