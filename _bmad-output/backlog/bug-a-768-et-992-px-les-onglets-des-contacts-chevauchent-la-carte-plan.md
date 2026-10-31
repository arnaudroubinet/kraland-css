---
title: "À 768 et 992 px, les onglets des Contacts chevauchent la carte de 11 px"
type: 'bugfix'
ticket: '28'
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
  - '{project-root}/_bmad-output/backlog/bug-a-768-et-992-px-les-onglets-des-contacts-chevauchent-la-carte.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur ordinateur, les boutons de catégorie des Contacts sont dans un `span.pull-right` flottant du `h1.page-header`. Quand le titre ne laisse pas la place (768 à 991 px et 992 à ~1100 px avec le titre « Membre fictif » de la fixture), le flottant passe sous le titre et dépasse du `h1`, qui ne le contient pas : 11 px de chevauchement sur la carte. Non reproduit sur le site (titre « Membres », court) ; le ticket garde l'hypothèse « titre robuste à un libellé long ».

**Approach:** CSS seul, bloc ordinateur `@media (min-width: 768px)`, garde `:where(html.kr-page-contacts)` : `display: flow-root` sur `#col-right h1.page-header`, qui contient alors son flottant. Quand les boutons tiennent à côté du titre (900, 1280), hauteur du titre et rendu inchangés. Nouveau fragment `kramail-theme#contacts-onglets` : bas des boutons au-dessus du haut de la carte à 767, 768, 769, 991, 992, 993 et 1280, Kraland clair et Empire Brun sombre ; 900 et 1280 égaux au bundle de base (boîtes des textes) ; bascule 767 ↔ 768 dans les deux sens.

</frozen-after-approval>

## Implementation Notes

- `kraland-theme.css`, nouveau bloc bureau après les Contacts mobiles : clearfix `:where(html.kr-page-contacts) #col-right h1.page-header::after` (`content: ""; display: block; clear: both`) et `margin-bottom: calc(-1 * var(--kr-space-1))` sur `> .pull-right`. La marge absorbe environ 1 px de dépassement du flottant quand il tient à côté du titre (900/1280 : rendu identique à la base).
- Écart à l'intention : clearfix au lieu de `display: flow-root`. Avec flow-root, `kramail-theme#contacts` échouait (3 FAIL : `display` du h1 différent de celui de la Réception). Le rendu est identique.
- Suite sans Font Awesome : la fixture ne reproduit pas. Dérivé `contacts-titre-long` (« Membre fictif au nom assez long »). Tests : `kramail-theme#contacts-onglets`, base `COMMIT_AVANT_LOTB` (`KR_SCRIPT_AVANT_LOTB`). `verifierTextesBase` reçoit un libellé optionnel. Aucune base `CORRIGER_BUG*` nécessaire : `confort` reste vert.

## Verification

**Commands:**
- `KR_FRAG=contacts-onglets node tests/e2e/kramail-theme.mjs` -- rouge sur la base, vert après.
- `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js KR_FRAG=contacts-onglets node tests/e2e/kramail-theme.mjs` -- rouge.

**Résultats (2026-10-31) :**
- `KR_FRAG=contacts-onglets` : 66 ok, 0 FAIL (fixture et titre long à 767/768/769/991/992/993/1280, deux variantes ; 900/1280 égaux à la base ; bascule 767↔768 dans les deux sens).
- Rouge avant = contre-épreuve `KR_SCRIPT=/tmp/kr-lotB/base-245b8f7.user.js` : 51 ok, 15 FAIL (chevauchement de 10,7 px, titre long, de 768 à 1280).
- `KR_FRAG=contacts,confort` : vert après passage au clearfix.
- lint:css 0, lint:js 0 (3 avertissements préexistants), test:unit 62/62, test:router conforme. test:all : voir le rapport du lot.

## Review Triage Log

Revue quick (sous-agent indépendant, lot B), 2026-10-31 :
- Libellé « confort … COMMIT_AVANT_99 » sur la comparaison de contacts-onglets : **corrigé** (libellé avec COMMIT_AVANT_LOTB).
- Cause du seuil sans icônes non élucidée, et −4 px calé sans Font Awesome : **doute**, consigné (relevé avec Font Awesome hors suite : 11 px reproduits sur la fixture, corrigés).
- Bascule en Kraland clair seul, étapes à 767 triviales : **accepté** (le critère n'exige pas la bascule ; la bascule 767↔768 reste couverte).
