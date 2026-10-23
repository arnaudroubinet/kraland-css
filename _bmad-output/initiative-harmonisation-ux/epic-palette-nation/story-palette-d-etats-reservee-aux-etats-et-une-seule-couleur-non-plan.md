---
title: "Palette d'états réservée aux états et une seule couleur « non lu »"
type: 'feature'
ticket: '5'
created: '2026-10-23'
status: 'built'
baseline_revision: 'd521cc891b1741e0eb55f538a147ed09911db700'
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

**Problem:** En clair, les alertes, textes, étiquettes et boutons d'état gardent les couleurs de Bootstrap ; en sombre, des valeurs en dur (vert, ambre, rouge, et le brun `rgb(122, 82, 64)` de l'alerte info dans les 8 nations). Il n'existe aucun jeton d'état. « Voir l'historique des changements », action ordinaire, est en cyan d'état.

**Approach:** Jetons d'état `--kr-success`, `--kr-warning`, `--kr-danger`, un ton par mode (DESIGN.md › Palette d'états, Q3). Les alertes d'état prennent un fond et une bordure à 12 % et 35 % de leur couleur sur `bg-surface`, et un texte `--kr-text-primary`. L'alerte info prend la teinte de la nation (`--kr-alert-info-*`, Q4) dans les deux modes. Textes, étiquettes, badges et boutons d'état prennent les jetons. Les actions ordinaires passent au style standard. Le « non lu » reste sur `--kr-status-unread` (H5.5, R3 ; CAP-4).

## Boundaries & Constraints

**Always:**
- Périmètre : `.alert-success/-info/-warning/-danger` (clair, sombre, accueil) ; `.text-*`, `.bg-success/-warning/-danger`, `.label-*`, `.btn-success/-info/-warning/-danger` (votes, caractéristiques du plateau compris) ; `.panel-success/-info/-warning/-danger` (en-tête) ; `.btn-success` du score des messages mobiles.
- « Voir l'historique des changements » (template L11195, `btn-info`) devient un bouton standard.
- Décision prise en autonomie (à confirmer, `revue-manuelle.md`) : dans une alerte, un lien prend la couleur du texte de l'alerte, souligné. En couleur d'accent, il tomberait à 3,80:1 en Paladium sombre sur l'alerte info (Q4) et à 4,30:1 sur l'avertissement.
- Texte ≥ 4,5:1 dans les 16 variantes : texte d'alerte sur son fond, texte en couleur d'état sur `bg-surface`, `bg-surface` sur un fond d'état plein.
- Les règles du domaine sont réécrites ou retirées (P1 option 4).
- Fixture synthétique.

**Never:**
- cloche, enveloppe du kramail et « PNJ » (épopée 5) ;
- « Valider » vert de la modale d'ordre mobile (ticket 2.6) ;
- pièce courante du plateau (`btn-warning`, accent, 3.2) ;
- boutons de la page Contacts et « Pas un contact » : ni fixture ni classe de page, relevé à faire (reporté) ;
- jauges (3.6) ;
- focus (3.7).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Jetons | 16 variantes | `--kr-success/-warning/-danger` égaux à DESIGN.md (clair, sombre) | No error expected |
| Alertes d'état | `.alert-success/-warning/-danger` avec texte et lien, 16 variantes, 375 et 1280 px | fond 12 % et bordure 35 % de la couleur d'état sur `bg-surface`, texte `text-primary` ≥ 4,5:1, lien de la couleur du texte, souligné | No error expected |
| Alerte info | `.alert-info` avec lien, 16 variantes | fond et bordure `--kr-alert-info-*` (plus de `rgb(122, 82, 64)`), texte et lien ≥ 4,5:1 | No error expected |
| États pleins et textes | `.label-*`, `.btn-success/-warning/-danger/-info` (repos, survol), `.bg-*`, `.text-*`, `.panel-*` | couleur d'état du jeton, texte ≥ 4,5:1, aucune couleur Bootstrap (`#5cb85c`, `#f0ad4e`, `#d9534f`, `#5bc0de`, `#dff0d8`, `#fcf8e3`, `#f2dede`, `#d9edf7`, …) | No error expected |
| Action ordinaire | « Voir l'historique des changements » | bouton standard (3.4) | No error expected |
| Non lu | pastilles et filets du sous-forum et de /report | `--kr-status-unread` (garde) | No error expected |
| Pages | sujet (votes), plateau (caractéristiques), index (alerte « Bienvenue »), modale d'ordre (alertes), 375 et 1280 px | couleurs d'état des jetons ; textes ≥ 4,5:1 | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes valeurs | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` au `d521cc8` (lignes approximatives) :
  - jetons info l.48-49 et l.216-217 ; `.alert.alert-info` l.743 ; `.alert strong, .alert p` l.749 ; sombre `.alert` l.2880, `.alert *` l.2885, `.alert a` l.2889, `.alert-info` l.2894 (en dur), `.alert-success` l.2900, `.alert-warning` l.2907 (8 %), `.alert-danger` l.2913 ; accueil `.page-accueil .alert-info` l.11869, l.12229 (filet primaire, à garder) ;
  - modale d'ordre : `.bootbox-confirm .alert` l.1832-1846 (l'aide `.alert-order` en teinte info), `.kr-order-alerts` l.1905-1924 ;
  - `.btn-success` du score mobile l.15124 ; sombre `.btn-warning` l.3310-3316 (pièce courante, hors périmètre) ; `.bg-info` l.669 (paire d'action, 3.2) ; /report `tr.bg-info` l.682-690.
- Template : « Voir l'historique » L11195 (`btn btn-info kr-changelog-btn`) ; retours d'options `alert alert-success` L8802-8925 (états, gardés).
- Tests :
  - `palette-nation.mjs` : `ALERTE_SOMBRE` (l.16, 441, 525-560), à remplacer par les jetons info ; liens d'alerte l.708-710 (fixture `palette-nation-textes.html` l.51-53) ;
  - `modale-ordre.mjs` : contrastes du texte des alertes dans les 16 variantes ;
  - fixtures : `forum-sujet.html` (votes `span.btn.btn-success`), `plateau-qualite-usage.html` (caractéristiques `btn-success`), `forum-index-rp.html` (« Bienvenue » `.alert-success`) ;
  - comparaisons figées `forum-index#hors-perimetre`, `kramail-redaction#regression`, `cybermonde-carte#panneaux` : écarts sur ces éléments à neutraliser, consignés, conditionnés à un bundle « avant » antérieur au ticket.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/palette-nation.mjs` et une fixture dédiée -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-theme.css` -- jetons d'état, alertes, états pleins et textes, panneaux d'état, liens d'alerte, alerte info sombre sur les jetons
- [x] `kraland-userscript-template.js` -- « Voir l'historique » en `btn-default`
- [x] suites touchées (`palette-nation`, `modale-ordre`, comparaisons figées) -- attentes mises à jour, écarts consignés
- [x] `tests/e2e/lib/router.mjs` -- fragments nouveaux, aucune 4e citation d'un repère
- [x] `_bmad-output/initiative-harmonisation-ux/deferred-work.md` -- boutons de la page Contacts et « Pas un contact » à relever
- [x] `npm run build`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne machine calme, then RÉSULTAT : VERT.
- Given une copie mutée du bundle (alerte info sombre remise en dur, alerte d'avertissement aux couleurs Bootstrap, lien d'alerte en accent), when la suite tourne, then elle est rouge.

## Implementation Notes

- CSS (`kraland-theme.css`) :
  - jetons `--kr-success` `#2e7d32` / `#81c784`, `--kr-warning` `#8a5a00` / `#ffb74d`, `--kr-danger` `#c62828` / `#ff8a80` (`:root` / `html[class*="-dark"]`), et `--kr-state-hover-mix` (`#000` / `#fff`) pour le survol des états pleins ;
  - section 5 : chaque classe d'état (`.alert-*`, `.label-*`, `.btn-*`, `.bg-*`, `.text-*`, `.panel-*` ; succès, avertissement, danger) pose sa couleur dans `--kr-state`, que les règles communes emploient : alertes (fond 12 %, bordure 35 % sur `bg-surface`, texte `text-primary`, (0,3,1)) ; liens d'alerte `color: inherit !important`, soulignés, boutons et étiquettes exclus sans spécificité ajoutée ; étiquettes (0,4,1) et étiquette lien survolée (0,6,2) ; boutons d'état sur le schéma des boutons primaires (repos (0,3,1), états (0,4,1), désactivés après), badge interne en paire inverse ; `.bg-*` pleins ; `.text-*` (0,3,1), `.text-info` en `text-accent` ; panneaux d'état (bordure, en-tête, badge) et panneau info en `--kr-alert-info-*` ;
  - `.alert.alert-info` et `.alert strong, .alert p` passent de `--kr-text` à `--kr-text-primary` ; règles sombres `.alert a`, `.alert-info` (`rgb(122, 82, 64)`), `.alert-success`, `.alert-warning` (8 %), `.alert-danger` retirées, ainsi que la bordure `border-default` de `html[class*="-dark"] .alert` (elle battait la bordure des alertes typées) ; `.alert` sombre garde le texte du thème et `.alert *` hérité ;
  - `.btn-info` rejoint les boutons primaires (paire d'action, ombre comprise) et `.btn-info .badge` la paire inverse ;
  - exclusions : PNJ (`.btn-danger.xmini`) et pièce courante (`.btn-warning:has(> img[src*="/bat/bat"])`) sortis des boutons d'état par `:where(:not(…))` ; la règle sombre « BOUTONS WARNING » ne vise plus que la pièce (`:where(:has(…))`, même spécificité) ;
  - accueil : `.page-accueil .alert-info` prend `--kr-alert-info-bg` (et `--kr-alert-info-border` sur ordinateur), filet primaire gardé ;
  - score mobile des messages : `color-mix()` de `--kr-success` à 12 % et 35 % sur `bg-surface` au lieu du vert translucide.
- Template : « Voir l'historique des changements » en `btn btn-default kr-changelog-btn`.
- Décisions en autonomie consignées dans `revue-manuelle.md` (ticket 3.5) : liens d'alerte, info pleine en paire d'action, pièce courante, PNJ, fonds pleins, score mobile, accueil, bordure sombre, en-tête info de la modale d'ordre, Contacts (reporté dans `deferred-work.md`).
- Tests :
  - `palette-nation.mjs` : fixtures synthétiques `palette-nation-etats.html` et `palette-nation-profil.html` (servie à `/profil/interface`, `GM.xmlHttpRequest` répondant par une erreur : option `gmErreur` d'`ouvrir`) ; fragments `etats-mobile`, `etats-bureau` (jetons, alertes et liens, alerte info, états pleins repos, survol forcé, `.active`, `[disabled]`, `.btn-info`, textes sur `bg-surface`, panneaux, aucune couleur d'état de Bootstrap, PNJ et pièce courante comparées au bundle `d521cc8`, « Voir l'historique » en bouton standard), `etats-largeurs` (767, 768, 769, 1440, 1920 px contre 375 / 1280, jetons compris), `etats-pages-mobile`, `etats-pages-bureau` (votes du sujet, caractéristiques du plateau, « Bienvenue » de l'index RP ; garde du non lu : pastilles du sous-forum et filet de /report en `--kr-status-unread`, égaux au bundle `d521cc8`). Étiquettes et boutons de la fixture hors d'un `.panel-body` : sur mobile, la règle des articles de commerce (`.panel-body a:hover`, `!important`) y donne aux liens survolés le fond `bg-hover` (préexistant, hors ticket) ;
  - ticket 1 : `alerteSombre` et `consommateurs` attendent `--kr-alert-info-*` dans les deux modes (`ALERTE_SOMBRE` retiré) ; ticket 3 : les 3 liens d'alerte sortent de `TEXTES` (vérifiés par `etats-*`) ; ticket 2 : `#bouton-alerte` de `palette-nation.html` devient une pièce courante (lien `.btn-warning` à image de pièce), seule cible restante de la règle sombre ;
  - `modale-ordre.mjs` : fond, bordure et texte de l'avertissement (Dormir) et du blocage (Pouvoir) comparés aux mélanges attendus, lus sur une sonde ;
  - `lib/variantes.mjs` : `COMPOSANTS_TICKET5` et `AVANT_TICKET5` (hors des suites : citations du routeur). Aucune 4e citation (comparaison HEAD / arbre de travail ; `btn-success` passe à 3 suites) ; fragments ajoutés au registre du routeur.
- Écarts consignés des comparaisons figées :
  - `forum-index.mjs#hors-perimetre` : face à un bundle « avant » qui ne déclare pas `--kr-success`, les éléments de `COMPOSANTS_TICKET5` sont neutralisés comme ceux du ticket 4 (texte, fond, bordure basse, contenu qui en hérite le texte). Écarts levés : score du sujet (375 px), vote du sujet (1440 px), « Bienvenue » de l'index Staff. Contre-épreuve : marge gauche de `.btn-success` à 3 px → rouge (2 FAIL) ;
  - `kramail-redaction#regression`, `cybermonde-carte#panneaux` : aucun écart (verts sans retouche).
- Rouge avant (bundle `d521cc8`) : fragments `etats-*` → 294 FAIL (78 ok : socle, gardes PNJ / pièce / non lu, comparaisons de largeurs) ; `modale-ordre` → 32 FAIL. Mutations du bundle (critère d'acceptation), fragments `mobile`, `bureau`, `etats-mobile`, `etats-bureau` : alerte info sombre remise en `rgb(122, 82, 64)` → 40 FAIL ; avertissement aux couleurs de Bootstrap → 64 FAIL ; lien d'alerte en accent → 64 FAIL.
- Vérification (base `d521cc8`, non commité) : `palette-nation` 1136 ok ; `modale-ordre` 297 ok ; `forum-index#hors-perimetre` 43 ok ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur, 1 avertissement préexistant (`report-non-lu.mjs`) ; `test:unit` 56 ok ; skills identiques ; `test:all` 5819 ok, 0 FAIL, RÉSULTAT : VERT (charge 5,1 au départ, pas tout à fait calme).

## Plan Change Log

## Review Triage Log

Revue du 2026-10-23 (boucle 0), 5 constats, tous corrigés (patch) :
- bordure sombre retirée de toute `.alert` : l'aide de la modale d'ordre (alerte sans type, teinte seulement sous 769 px) perdait son cadre sur ordinateur en sombre. `border-default` rendu aux alertes sans type par `html[class*="-dark"] .alert:where(:not(.alert-success, .alert-warning, .alert-danger, .alert-info))` ; contrôle du cadre (1 px, `border-default`) dans `modale-ordre.mjs` (sombre, 1280 px). Contre-épreuve (règle retirée) : 8 FAIL ;
- caractéristiques du plateau survolées et pressées : `.panel-body a:hover` (mobile, `!important`), `html[class*="-dark"] .list-group-item.btn:hover` (PLT-11) et `.mobile-characteristic-badge:active` (mini-profil, `!important`) battaient le survol de la palette d'états. Boutons exclus de la première (sauf la pièce courante), boutons d'état des deux autres, par `:where(:not(…))` ; `etats-pages-*` force `:hover` et `:active` sur les caractéristiques de `plateau-qualite-usage.html` (fond de survol de l'état, texte `bg-surface`, ≥ 4,5:1). Contre-épreuve (exclusion PLT-11 retirée) : 1 FAIL ;
- `COMPOSANTS_TICKET5` neutralisait `.bg-info` et `.label-info`, inchangés : retirés de la liste ;
- contenu des fonds `.bg-*` (liens compris) au texte du fond, boutons et étiquettes exclus ; lien ajouté à la fixture (`#bg-success-lien`), contrôlé. Contre-épreuve (règle retirée) : 16 FAIL ;
- commentaire de `.kr-order-alerts` : la raison du fond opaque ne cite plus les teintes translucides retirées.

Vérification ciblée après patch : zones `palette-nation` (1136 ok), `modale-ordre` (297 ok), `plateau`, `profil` (2439 ok au total, RÉSULTAT : VERT) ; `forum-index#hors-perimetre` 43 ok ; `test:router` conforme ; `lint:css` 0 ; ESLint des tests 0 erreur.

## Design Notes

- Fond d'alerte : `color-mix(in srgb, var(--kr-warning) 12%, var(--kr-bg-surface))`, bordure à 35 %.
- Fond d'état plein (étiquette, bouton) : couleur d'état, texte `--kr-bg-surface` (composant Pastille d'état) ; survol d'un bouton d'état : couleur d'état mêlée de 15 % de noir en clair, de blanc en sombre, si le contraste tient.

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant, vert après
- `node tests/e2e/modale-ordre.mjs` -- expected: vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: conformes
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme

Vérification finale (orchestrateur, après patchs de revue) : build validé ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant) ; `test:unit` vert ; skills identiques ; `test:all` 5819 ok, 0 FAIL, RÉSULTAT : VERT (aucun autre agent actif, charge système 6).
