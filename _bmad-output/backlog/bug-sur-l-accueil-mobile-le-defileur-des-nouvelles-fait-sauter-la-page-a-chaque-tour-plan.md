---
title: "Sur l'accueil mobile, le défileur des Nouvelles fait sauter la page à chaque tour"
type: 'bugfix'
ticket: '25'
created: '2026-10-31'
status: 'built'
baseline_revision: 'eb09f59677c285cbb76768819223fdd5934402ea'
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
  - '{project-root}/_bmad-output/backlog/bug-sur-l-accueil-mobile-le-defileur-des-nouvelles-fait-sauter-la-page-a-chaque-tour.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur l'accueil mobile (≤ 767 px), `ul.demo` est plafonné à la nouvelle visible (`max-height: max-content`, entrée 10.6). Le défileur natif (jQuery, sens « up ») replie la première nouvelle (`slideUp`), la déplace en fin de liste, puis la suivante apparaît : la hauteur de la liste suit l'animation (1,2 à 67,6 px relevés en déconnecté) et tout ce qui est dessous saute, jusqu'à 66 px.

**Approach:** CSS seul, bloc mobile de l'accueil : les nouvelles de `ul.demo` sont empilées dans une seule cellule de grille, toutes gardées dans la mise en page (hauteur et `display` forcés contre les styles en ligne de l'animation), seule la première visible (`visibility`). La liste prend donc la hauteur de la nouvelle la plus haute, constante pendant les tours ; le changement de nouvelle devient instantané. Ordinateur inchangé. Nouveau fragment `accueil-mobile#defileur` : animation native rejouée sur la fixture (repli, déplacement, dépli par jQuery, sans `page.clock`), 3 tours au moins à 320 et 375 px, Kraland clair et Empire Brun sombre, connecté et déconnecté ; hauteur de la carte Nouvelles et position du pied échantillonnées à chaque image : variation 0 px ; espace sous la nouvelle la plus haute ≤ 8 px ; 1280 px égal à la base.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, bloc « PAGE ACCUEIL - MOBILE », règle du défileur : `ul.demo` en `display: grid` et `height: auto !important` (remplace `max-height: max-content` : la hauteur en ligne du site ne compte plus) ; nouvelles en `grid-area: 1 / 1`, `display: list-item !important` et `height: auto !important` (sélecteur à ID : bat la règle commune `.panel-body.panel-news ul.demo li.news-item:nth-child(n+2) { display: none !important }` et les styles en ligne de `slideUp`/`slideDown`) ; `:nth-child(n+2)` en `visibility: hidden`.
- Effet : la liste prend la hauteur de la nouvelle la plus haute. Une nouvelle plus courte laisse un vide dessous (au plus la différence de hauteur entre nouvelles ; 0 à 8 px sur la fixture). Le changement de nouvelle est instantané (fin du repli), sans glissement visible.
- Tests : nouveau fragment `accueil-mobile#defileur` (rejoue 3 tours par jQuery, rAF réel). À chaque image : hauteur de la carte Nouvelles et haut du pied (variation 0 au dixième de px), une seule nouvelle visible et c'est la première, vide sous la nouvelle affichée. En fin : aucune nouvelle coupée, vide sous la plus haute ≤ 1 px. Contrôle `finitions` du défileur adapté : vide mesuré sous la nouvelle la plus haute (avant : sous la seule visible).
- 1280 px : non rejoué par `defileur` ; la règle est sous `@media (max-width: 767px)` et `body.mobile-mode`, et le fragment `bureau` compare l'ordinateur à la base (vert).

## Verification

**Commands:**
- `KR_FRAG=defileur node tests/e2e/accueil-mobile.mjs` -- rouge sur le bundle de base, vert après.
- `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js KR_FRAG=defileur node tests/e2e/accueil-mobile.mjs` -- rouge.
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes` -- vert.

**Résultats (2026-10-31) :**
- `KR_FRAG=defileur` : 40 ok, 0 FAIL (8 cas : 320/375 px × Kraland clair / Empire Brun sombre × connecté / déconnecté ; plus de 30 images par cas ; vide sous la nouvelle affichée relevé à 0 px partout).
- Contre-épreuve `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js` : 32 ok, 8 FAIL (variation de la carte jusqu'à 58,6 px).
- `KR_FRAG=finitions` : 102 ok sur le bundle et sur la base.
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router 0. Zones : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant), 2026-10-31 :
- Vide ≤ 8 px sous la plus haute toujours vrai par construction : **corrigé**. Vide sous la plus haute ≤ 1 px, et vide sous la nouvelle affichée mesuré à chaque image (≤ 8 px).
- Commentaire CSS « sans vide dessous » inexact : **corrigé**.
- Tolérance 0,5 px contre un critère de 0 px : **corrigé** (`ecart === 0` au dixième).
- Visibilité vérifiée en fin seulement : **corrigé** (à chaque image).
- `finitions` affaibli : **rejeté** (protège encore contre une hauteur en ligne qui dépasse la plus haute).
- 1280 px absent de `defileur` : **différé** (couvert par `bureau`).
- Animation rejouée à la main, pas le plugin natif ; variante déconnectée supposée : **doutes**, consignés dans revue-manuelle.md (capture demandée).
