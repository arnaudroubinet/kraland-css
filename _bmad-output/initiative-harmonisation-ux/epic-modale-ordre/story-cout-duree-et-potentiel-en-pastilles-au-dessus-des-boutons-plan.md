---
title: "Coût, durée et potentiel en pastilles au-dessus des boutons"
type: 'feature'
ticket: '4'
created: '2026-10-22'
status: 'in-progress'
baseline_revision: 'ae45a71425d0ef1ef363729da3a4620cfdf5f404'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: ''
review_source: ''
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La ligne « Coût | Durée | Potentiel » (`.panel-footer > p.mini`) n'est mise en pastilles que sur mobile, une fois, aux couleurs pastel (jaune, bleu ciel, rose), dans une bande collante qui recouvre à l'ouverture le titre de Dormir et le « ? Aide » de Pouvoir ; sur ordinateur elle reste une ligne de texte de 12 px ; un autre ordre chargé garde les anciennes valeurs.

**Approach:** Sur ordinateur et mobile, le coût, la durée et le potentiel s'affichent en pastilles juste au-dessus des boutons « Annuler » / « Valider » : icône et valeur, style des étiquettes de catégorie en 12 px gras, fond `--kr-arm-bg` et texte `--kr-arm-ink` (H2.5, Q1 ; Q5 tranchée par défaut) ; les valeurs suivent le contenu courant ; plus rien ne recouvre le titre ni « ? Aide » à l'ouverture.

## Boundaries & Constraints

**Always:** porté par le socle de la modale d'ordre (tickets 2.2 et 2.3) : idempotent, réappliqué quand le contenu de `#ajax-order` est remplacé, actif quand le bundle tourne avant `<body>` ; valeurs lues dans la ligne native du contenu courant, segments absents compris (pas de pastille vide) ; le texte natif reste dans le DOM (masqué), jamais remplacé ; P1 option 4 : `formatFooterAsBadges`, les règles `.kr-badge-*` pastel et la bande collante `.kraland-action-footer` sont retirées ou réécrites ; contrastes vérifiés dans les 16 variantes avec `tests/e2e/lib/variantes.mjs`.

**Never:** toucher « Valider » mobile et l'onglet actif (entrée 6), la croix (entrée 5) ; changer l'envoi natif.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Dormir | « Coût: 0 FK \| Durée: 00:00 \| » | pastilles coût et durée, aucune pastille de potentiel, au-dessus des boutons | No error expected |
| Pouvoir | « Coût: 0 FK \| Durée: 02:00 \| » + potentiel « VOL + Pouvoir = 9 » | trois pastilles | No error expected |
| Contenu remplacé | autre ordre chargé | pastilles aux valeurs du nouvel ordre, jamais en double | No error expected |
| Sans ligne de coût | contenu sans `.panel-footer p.mini` | aucune pastille, rien d'autre ne change | No error expected |
| Ouverture | 375 × 667 | le titre de l'ordre, les alertes et « ? Aide » ne sont pas recouverts (`elementFromPoint`) | No error expected |
| Contrastes | 16 variantes | texte des pastilles ≥ 4,5:1 sur leur fond | No error expected |
| Supports | 375, 767, 768, 769, 1280, 1440, 1920 px | même rendu, pastilles au-dessus des boutons | No error expected |

</frozen-after-approval>

## Code Map

- Natif : `.panel.with-nav-tabs > .panel-footer > p.mini` « Coût: 0 FK | Durée: 00:00 | » ; le potentiel apparaît en dernier segment (relevé réel de Pouvoir : « VOL + Pouvoir = 9 »). Les fixtures `tests/e2e/fixtures/modale-ordre/` doivent porter un potentiel (Pouvoir) pour le vérifier.
- `kraland-userscript-template.js` : `formatFooterAsBadges` (~l.9514, garde mobile, remplace le `innerHTML` du pied par `div.kr-action-badges` aux classes `kr-badge-cost/-duration/-potential`) ; chaîne mobile `transformOrderModalStructure` (~l.9408 : `panelFooter.classList.add('kraland-action-footer')`) ; socle `applyOrderModal` / `arrangeOrderAlerts` (tickets 2.2, 2.3) : point d'accroche ; pied de la modale `.modal-footer` (boutons `data-bb-handler`) hors de `#ajax-order`.
- `kraland-theme.css` : `.bootbox-confirm .kraland-action-footer` (~l.1479, collante `bottom: 72px`, z-index 90) et `p` (~l.1488) ; `.bootbox-confirm .kr-action-badges`, `.kr-badge`, `.kr-badge-cost/-duration/-potential` pastel (~l.1807-1845) ; tout en `@media (max-width: 767px)`.
- Tests : `tests/e2e/modale-ordre.mjs` (fragments `mobile`, `bureau`, `largeurs`, `seuil`, `variantes` ; option `debut`) ; `tests/e2e/lib/variantes.mjs` (`CONTRASTE`, `parVariante`).

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/fixtures/modale-ordre/` -- potentiel dans Pouvoir, ordre sans ligne de coût -- cas de la matrice
- [ ] `tests/e2e/modale-ordre.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [ ] `kraland-userscript-template.js` -- pastilles construites par le socle au-dessus des boutons, deux supports, valeurs du contenu courant ; `formatFooterAsBadges` retirée de la chaîne mobile
- [ ] `kraland-theme.css` -- style des pastilles (paire arm, 12 px gras, arrondi complet), bande collante et pastels retirés
- [ ] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre à 375 ou 1280 px, when son contenu est remplacé, then une seule rangée de pastilles existe, aux valeurs du contenu courant
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT
