---
title: "Coût, durée et potentiel en pastilles au-dessus des boutons"
type: 'feature'
ticket: '4'
created: '2026-10-22'
status: 'built'
baseline_revision: 'ae45a71425d0ef1ef363729da3a4620cfdf5f404'
route: 'full'
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
- [x] `tests/e2e/fixtures/modale-ordre/` -- potentiel dans Pouvoir, ordre sans ligne de coût -- cas de la matrice
- [x] `tests/e2e/modale-ordre.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-userscript-template.js` -- pastilles construites par le socle au-dessus des boutons, deux supports, valeurs du contenu courant ; `formatFooterAsBadges` retirée de la chaîne mobile
- [x] `kraland-theme.css` -- style des pastilles (paire arm, 12 px gras, arrondi complet), bande collante et pastels retirés
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given une modale d'ordre à 375 ou 1280 px, when son contenu est remplacé, then une seule rangée de pastilles existe, aux valeurs du contenu courant
- Given les suites existantes, when elles tournent, then `test:parler` et les autres restent vertes

## Implementation Notes

- Fichiers : `kraland-userscript-template.js` (section « MODAL PERSONNAGE MOBILE » : `readOrderCosts` et `showOrderCosts`, appelé par `applyOrderModal` avant le test du formulaire ; `arrangeOrderAlerts` pose le bloc des alertes après le `h3` du formulaire ; `formatFooterAsBadges`, son appel et le marquage `kraland-action-footer` retirés) ; `kraland-theme.css` (section 9f en liste combinée, marge de 12 px sur ordinateur ; règles `.kraland-action-footer` (9c) et `.kr-action-badges` / `.kr-badge*` pastel (9d) retirées ; commentaire de 9e mis à jour) ; fixtures Dormir et Pouvoir (lignes de coût réelles relevées le 2026-10-22) ; `tests/e2e/modale-ordre.mjs` (242 contrôles, mêmes fragments) ; ligne de zone du skill `tester-kraland-css` (deux copies) ; bundle et `version.json`.
- Décision (orchestrateur, en autonomie, à confirmer : revue-manuelle.md) : rangée `div.kr-order-badges` en tête du pied de la modale, toujours visible juste au-dessus des boutons, mise à jour d'après la ligne native du contenu courant (masquée par l'attribut `hidden` ; le pied du panneau qui ne contient qu'elle est masqué par `:has()`) ; pour garder entier à l'ouverture l'avertissement de Dormir à 375 × 667, le bloc `.kr-order-alerts` passe juste après le `h3` du formulaire, avant les caractéristiques et le panneau d'onglets (collant, jamais replié, `clear: both` sous l'image flottante du titre).
- Segments (relevé réel : « Coût: 0 FK | Durée: 00:00 | Automatique », « … | Potentiel: VOL + Pouvoir = 9 ») : libellé connu (Coût, Durée, Potentiel) : valeur et icône ; seul le dernier segment sans libellé est le potentiel (« Automatique », titré « Potentiel ») ; autre libellé (« Portée: 2 ») : pastille générique au segment entier, titrée de son libellé, sans icône ; autre segment sans libellé : générique sans titre ; segment vide : rien ; aucun libellé connu : aucune pastille. Plus rien à montrer (pas de formulaire, ligne retirée, vidée ou réécrite sans libellé connu) : rangée retirée, ligne réaffichée.
- Écart rangée / boutons : 12 px sur ordinateur ; 20 px sur mobile (deux gap de 10 px autour du `::after` vide du clearfix Bootstrap, placé avant les boutons réordonnés : rythme existant du pied, non modifié).
- Contrastes mesurés (texte des pastilles, 1280 px) : 4,53:1 (Kraland sombre) à 10,60:1 (Théocratie clair), conformes au tableau « Encre d'action » de DESIGN.md.
- Vérification : première version, bundle de HEAD (`cce72b7`) : 63 FAIL sur 235, vert après ; contre-épreuves de cette première version toutes rouges (ligne non masquée, rangée insérée vide puis remplie, socle mobile seulement, une fois par modale, bande collante rétablie, pastel, garde de libellé, 13 px / 500). Version finale : `modale-ordre.mjs` 242 ok ; contre-épreuves sur copies mutées du bundle hors dépôt, toutes rouges : bloc des alertes sous le `h4` 12 FAIL (dont l'avertissement de Dormir hors de la zone visible à l'ouverture à 375 px) ; tout segment sans libellé pris pour le potentiel 2 ; libellé inconnu pris pour le potentiel 2 ; sans nettoyage 4 ; pied du panneau non masqué 10. `test:parler` 78 ok ; sonde Parler jetable avec une ligne de coût dans sa fixture : 78 ok (pied 157 → 191 px sur mobile, 65 → 101 px sur ordinateur, « Valider » entier et touchable jusqu'à 390 × 160) ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant).
- Non fait : vérification sur le site réel (pas de mandat dans cette session) ; icônes Font Awesome absentes de la fixture (vérifiées par leurs classes).

## Verification

**Commands:**
- `npm run build && node tests/e2e/modale-ordre.mjs` -- expected: rouge avant le code sur les nouveaux contrôles, vert après
- `npm run test:parler`, `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: verts, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

## Review Triage Log

Passe quick du 2026-10-22, puis relevé réel : 4 patch, 1 changement de placement décidé en autonomie.
- high, patch — pastilles en fin d'ordre, sous le pli à l'ouverture (Dormir à 375 × 667, ordres longs sur ordinateur), contre l'intent « juste au-dessus des boutons » : rangée placée en tête du pied de la modale ; état à l'ouverture vérifié à toutes les largeurs. Pour garder l'avertissement de Dormir entier à l'ouverture, le bloc des alertes (ticket 2.3) remonte juste après le `h3` du formulaire, avant les caractéristiques et les onglets (décision consignée dans revue-manuelle.md).
- medium, patch — ligne réelle de Dormir « Coût: 0 FK | Durée: 00:00 | Automatique » (relevé du 2026-10-22 ; la fixture venait d'un relevé tronqué) : fixture alignée, 3 pastilles attendues (« Automatique » titré « Potentiel »).
- low, patch — tout segment inconnu devenait « Potentiel » : seul le dernier segment sans libellé est le potentiel ; un libellé inconnu donne une pastille générique titrée de son libellé.
- low, patch — pastilles périmées si la ligne native est réécrite sur place, vidée ou retirée : rangée retirée et ligne réaffichée.
- low, patch — en-tête de la suite périmé : réécrit.

Vérification : `modale-ordre.mjs` 242 ok ; contre-épreuves rouges (alertes sous le `h4`, segments, nettoyage, pied du panneau) ; `test:parler` 78 ok ; `test:router` conforme ; `test:unit` 56/56 ; `lint:css`, `lint:js` 0 erreur ; `test:all` 4604 ok, 0 FAIL. Site réel (lecture seule, modales annulées) : Dormir et Pouvoir, 375 et 1280 px, deux variantes : alerte sous le titre, entière à l'ouverture ; pastilles « 0 FK · 00:00 · Automatique » et « 0 FK · 02:00 · VOL + Pouvoir = 9 » entières au-dessus des boutons ; aide repliée. Captures : `.tmp/captures/validation-2-4-modale/` (hors git).
