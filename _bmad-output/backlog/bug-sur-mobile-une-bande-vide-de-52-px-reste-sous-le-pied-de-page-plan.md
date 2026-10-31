---
title: "Sur mobile, une bande vide d'environ 52 px reste sous le pied de page"
type: 'bugfix'
ticket: '26'
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
  - '{project-root}/_bmad-output/backlog/bug-sur-mobile-une-bande-vide-de-52-px-reste-sous-le-pied-de-page.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, `body.mobile-mode { padding-bottom: 52px }` (PLT-09, réserve du bouton « Remonter en haut », 36 px à 8 px du bas) laisse une bande vide sous le pied de page sur toutes les pages, même quand le bouton n'existe pas ou reste masqué (il n'apparaît qu'au-delà de 400 px de défilement). La marge en ligne de 60 px posée par `ensureFooterSticky` est sans effet (`body { margin: 0 !important }`).

**Approach:** CSS seul, bloc mobile : la réserve de 52 px n'est gardée que tant que le bouton est affiché (`body.mobile-mode:has(.kraland-back-to-top.kr-btt-visible)`). Sans bouton affiché, rien sous le pied. Le bouton affiché reste dans la réserve, sans couvrir le pied ni le contenu. La réserve n'apparaît qu'au-delà de 400 px de défilement et disparaît en deçà : la hauteur du document change sous l'écran, jamais au-dessus, sans saut. Ordinateur inchangé. Nouveau fragment `confort-mobile#pied-bas` : forum, kramail, plateau et accueil à 375 et 767 px (plus une page courte avec bouton jamais affiché), défilement en bas : espace sous le pied ≤ 8 px sans bouton affiché ; avec bouton affiché, espace = réserve et bouton entièrement sous le pied ; 768 et 1280 px égaux à la base ; bascule 767 → 768 → 767 dans le même onglet.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, bloc mobile PLT-09 : `body.mobile-mode { padding-bottom: 52px }` devient `body.mobile-mode:has(.kraland-back-to-top.kr-btt-visible)`. Rien d'autre ne lisait cette réserve (forum : la colonne d'« Envoyer » a sa propre marge ; barre d'envoi fixe retirée).
- La marge en ligne de 60 px posée par `ensureFooterSticky` reste sans effet (`body { margin: 0 !important }`) : laissée.
- Bouton : il mesure 44 px (plancher tactile) et portait la marge basse mobile des `.well` (15 px), soit 23 à 67 px du bas de l'écran : il mordait de 15 px sur le pied. `margin: 0 !important` sur la règle mobile du bouton : 8 à 52 px du bas, entièrement dans la réserve.
- Pages de rédaction (forum, kramail : `form[name="post_msg"]`), où le bouton est remonté à 20 px du bas : réserve de 64 px (20 + 44) tant que le bouton est affiché.
- Bases de comparaison : `CORRIGER_BUG26` (`tests/e2e/lib/variantes.mjs`) réécrit dans la base les règles du bouton et de la réserve comme dans le bundle. Appliqué à `typographie-formes#nettoyage` (base 7bec452) et à `kramail-redaction` (base 7bec452), qui comparaient la page entière à une base portant la bande de 52 px.
- Tests : nouveau fragment `confort-mobile#pied-bas` (bouton entièrement sous le pied, réserve 52 ou 64 px, aucun texte couvert) ; fixtures forum (index Staff) et accueil reçoivent en mémoire le bouton natif `a.well.well-sm` vers `#top`.

## Verification

**Commands:**
- `KR_FRAG=pied-bas node tests/e2e/confort-mobile.mjs` -- rouge sur le bundle de base, vert après.
- `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js KR_FRAG=pied-bas node tests/e2e/confort-mobile.mjs` -- rouge.
- `npm run test:zone -- forum kramail plateau accueil-mobile transitions` -- vert.

**Résultats (2026-10-31) :**
- `KR_FRAG=pied-bas` : 172 ok, 0 FAIL (5 pages × 2 variantes × 375/767/768/1280 px, plus la bascule 767 → 768 → 767 sur les deux variantes).
- Contre-épreuve `KR_SCRIPT=/tmp/kr-base-eb09f59.user.js` : 108 ok, 64 FAIL (52 px sous le pied bouton masqué, page courte comprise ; bouton qui mord sur le pied).
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router 0. Zones : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant), 2026-10-31 :
- Bouton qui mord de 15 px sur le pied : **corrigé** (marge 0, réserve de 64 px en rédaction).
- Le test ne vérifiait pas le bouton entièrement sous le pied : **corrigé** (`bouton.h >= piedBas - 0.5`).
- Saisie en cours (ticket 16) : la réserve reste quand le bouton est masqué pendant la frappe. Choix délibéré (pas de saut pendant la frappe) : **doute**, consigné dans revue-manuelle.md.
