---
title: "Échelle typographique du plateau, du mini-profil et des en-têtes de panneau"
type: 'feature'
ticket: '5'
created: '2026-10-24'
status: 'built'
baseline_revision: 'fe77411'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-bouton-compact-en-12-px-pour-les-votes-et-la-pagination-plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les jetons d'échelle (`--kr-font-section-title` 17, `--kr-font-name` 15, `--kr-font-detail` 13, `--kr-font-body` 14, `--kr-font-body-mobile` 15, `--kr-font-label` 12) existent mais ne servent pas : en-têtes de panneau en 16 px (Bootstrap, forum, kramail) ou 20 px (jeu mobile), noms et valeurs en h4 de 18 px sur ordinateur, échelle mobile des titres en `rem` qui descend à 11, 10 et 9 px (h4-h6), mini-profil à 10-11 px (jauges, onglets de section), planchers PLT-QU à 11 px.

**Approach:** Réécrire ces règles en jetons (DESIGN.md › Typography) : titres de section 17 px / 700 sur les en-têtes de panneau, deux supports, toutes pages ; noms et valeurs 15 px / 600 et détails 13 px sur le plateau ; texte courant 15 px sur le plateau mobile (14 px natif sur ordinateur) ; échelle mobile des titres en px ; rien sous 12 px sur le plateau mobile ; planchers PLT-QU à 12 px. Grand titre de page 36 px inchangé.

## Boundaries & Constraints

**Always:**
- P1 option 4 : réécrire ou retirer la règle d'origine (ex. css:5017, 5031, 5064, 5435 à 10-11 px battues par PLT-QU l.13370 ; l.7820 à 20 px ; l.8521, 9172, 9984 à 16 px), ne pas ajouter une règle qui bat.
- Assumption (titres) : « en-tête de panneau » = `.panel-heading` > `.panel-title` ou h1-h6 de premier niveau dans `.panel-heading`, ordinateur et mobile, jeu, forum, kramail ; exclus : titres de modale (Bootbox/modale d'ordre, h3 18 px), onglets dans un en-tête (l.1227), `.merged-columns` (l.7251), `.panel-group .panel-title` d'accordéon (l.6835) sauf preuve qu'il s'agit d'un en-tête de section.
- Assumption (échelle mobile en px, l.4737-4743) : h1, h2, h3 → `var(--kr-font-section-title)` ; h4, h5, h6 → `var(--kr-font-name)` ; aucun titre sous le texte courant. `.panel-body h4` 1rem (l.4543) → `var(--kr-font-name)`.
- Assumption (périmètre plateau) : noms/valeurs, détails, texte courant 15 px mobile et plancher 12 px s'appliquent sous la garde des pages de jeu existante (classe de page du plateau / `body.mobile-mode` + conteneurs du plateau) ; le forum garde ses messages à 16 px, les champs gardent 16 px ; les 11 px hors plateau (forum l.7920…, kramail, accueil, Bootbox) ne sont pas dans ce ticket.
- Mini-profil : libellés des onglets de section (`.mobile-tab-label`) et texte des jauges (`.mobile-gauge-compact-label`, `-value`, `.mobile-mini-profile-gauges-compact`) en `var(--kr-font-label)` ; libellé « Personnage » entier (sans ellipse ni coupure) à 360 et 375 px ; mini-profil plié et déplié à 375 et 700 px.
- Planchers PLT-QU 11 px (l.13095, 13230, 13347, 13363-13374, commentaire l.12912-12918 et l.13326) → 12 px en jeton.
- Rouge avant sur `fe77411`, contre-épreuves ; écarts attendus des autres suites consignés dans `tests/e2e/lib/variantes.mjs` sur le modèle `BOUTONS_TICKET42` / `PAGINATION_TICKET44`, jamais en affaiblissant une assertion.

**Never:** toucher au grand titre de page 36 px ; champs sous 16 px ; règle `:focus` ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| En-têtes de panneau | plateau, forum (sous-forum, sujet), kramail ; 375, 767, 768, 1280, 1440, 1920 ; clair et sombre | titre 17 px / 700 | n/a |
| Noms, valeurs, détails | fixtures plateau, ordinateur et mobile | 15 px / 600, 13 px | n/a |
| Texte courant | plateau | 14 px ordinateur, 15 px mobile ; champs 16 px | n/a |
| Plancher | plateau à 375 px | aucun texte visible sous 12 px | n/a |
| Onglet « Personnage » | 360 et 375 px | 12 px, libellé entier | n/a |
| Seuil | 767 / 768 / 769, bascule dans les deux sens | valeurs du support | n/a |

</frozen-after-approval>

## Code Map

- Jetons `kraland-theme.css:22-31`.
- Échelle rem mobile : l.4737-4743 ; `.panel-body h4` l.4543 ; `.dashboard-card h4` l.4286.
- En-têtes : l.7820 (jeu mobile 20 px), l.8521 (forum mobile 16), l.9172 (kramail mobile 16), l.9984 (`.panel-title` mobile 16) ; ordinateur : Bootstrap natif 16 px (aucune règle), à poser dans `@media (min-width: 768px)`. 4K l.589/594 (min-width 3840) : laisser ou aligner, consigner.
- Mini-profil : l.5017, 5031, 5064, 5197, 5435 ; PLT-QU l.12912-13379 (dont 13095, 13230, 13347, 13363-13374).
- Plateau mobile : l.5921 `.dashboard-card-name` 11, l.5954/13357 `.dashboard-card-status`, l.6158 / 6185 commerce.
- Libellé onglet : template.js:295, 1774, 1791 (`span.mobile-tab-label`).
- Tests : `tests/e2e/typographie-formes.mjs` (nouveau fragment `echelle`), `plateau-qualite-usage.mjs:125,153` et `plateau-profil-mobile.mjs:159` (11 → 12), fixtures `plateau-qualite-usage.html`, `plateau-minimal.html`, `palette-nation-profil.html`, `palette-nation-textes.html` (mobile-tab-bar), forum `forum-sujet.html`, `sous-forum-debuter.html`, kramail ; routeur `tests/e2e/lib/router.mjs` (mots-clés des composants mesurés) et `router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] Fragment `echelle` -- rouge sur `fe77411`.
- [x] `kraland-theme.css` -- en-têtes, échelle px, plateau, mini-profil, PLT-QU en jetons ; règles battues retirées.
- [x] Suites plateau au plancher de 12 px ; écarts attendus dans `variantes.mjs`.
- [x] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` et `npm run test:router` tournent, then 0 FAIL et routeur conforme ; valeurs de la matrice tenues.

## Implementation Notes

- Garde des pages de jeu : aucune classe de page n'existe pour le plateau ; `:where(body:has(#col-leftest))` (colonne des caractéristiques, présente sur le plateau, le Matériel, le Personnage, les Bâtiments, les Employés) porte le texte courant 15 px mobile et les noms d'objet 15 px / 600 sur ordinateur. Hypothèse à confirmer sur le site.
- En-têtes de panneau : sur ordinateur, une règle nouvelle `.panel-heading > :is(.panel-title, h1-h6):where(:not(.panel-group *, .modal *))` (Bootstrap n'a aucune règle de thème à réécrire) ; sur mobile, les règles d'origine (jeu 20 px, forum et kramail 16/600, `.panel-title` 16) réécrites en `var(--kr-font-section-title)` / 700. Règle 4K `.panel-heading h3` 16 px (min-width 3840) retirée : battue par la règle d'ordinateur. Sur mobile, la règle `.panel-title` 16 px garde sa marge ; la taille et la graisse passent à une règle `.panel-heading > :is(.panel-title, h1-h6):where(:not(.panel-group *, .modal *))`, identique à celle d'ordinateur.
- Échelle mobile des titres en px (h1-h3 17, h4-h6 15), h4-h6 écrits `:is(h4, h5, h6):where(:not(.panel-heading > *), .panel-group *, .modal *)` pour laisser aux titres d'en-tête (h4.panel-title compris) leurs 17 px / 700 sans règle qui bat ; `.panel-body h4` et `.dashboard-card h4` en `var(--kr-font-name)`. Conséquence : `h1.page-header` mobile passe de 17,5 à 17 px (le grand titre 36 px d'ordinateur n'est pas touché).
- Tableau de bord : `.dashboard-card-name` (11 px, 13 en grande carte, 12 et 14 en 2560 / 3840) réécrit en `var(--kr-font-name)` sur les deux supports, surcharges de taille retirées ; `.dashboard-card-status` (9 px, 11 en grande carte) réécrit en `var(--kr-font-detail)`, la surcharge PLT-QU de taille retirée (ordinateur et mobile). Risque : cartes de 140-160 px, nom limité à 2 lignes (ellipse au-delà).
- Mini-profil : jauges, onglets, légendes en `var(--kr-font-label)` à la règle d'origine ; le bloc PLT-QU « 10 px -> 11 px » retiré. Commerce mobile : nom en `--kr-font-name` / 600, description en `--kr-font-detail`, `.mention .xmini` en `--kr-font-label`. Règle PLT-QU « noms de bâtiment 12 px » retirée : `.panel-body h4` (15 px) la couvre ; mesurée sur la section repliable `.building-section-content` de `typographie-echelle.html` (15 px / 600 sur mobile).
- PLT-QU : `.xmini` et liens du pied de page passent de 11 à 12 px sur toutes les pages (lignes citées par le plan) ; légendes des compétences 11 -> 12.
- Écarts attendus consignés dans `tests/e2e/lib/variantes.mjs`, en masques miroirs (feuille adoptée hors couche, mêmes sélecteurs et même drapeau !important que les règles réécrites ou ajoutées, valeur du jeton) : `ECHELLE_TICKET45` (posé par `forum-index` hors-perimetre et `kramail-redaction` regression sur un bundle « avant » détecté par `AVANT_TICKET45`) et `LEGENDES_TICKET45` (trois règles des légendes ; posé par page par `typographie-formes` boutons, info consignée par page). Seule exception au miroir : h4-h6 d'en-tête de panneau reçoivent 17 px en !important, l'échelle d'avant les fixant en !important. Règles de pages de jeu absentes du masque (pages comparées sans jeu). Preuve : `echelle` compare titres, accordéon et modale du bundle de base masqué au bundle d'après (Matériel, sous-forum, kramail ; 375, 767, 768, 1280) ; l'ancien masque en couche !important y échoue (accordéon 15 px au lieu de 14).
- Non couverts (différés) : `.dashboard-section-header` 12 px, `.list-group-item-text` mobile 12 px (au plancher, détail non mesuré hors tableau de bord), sujet du forum (fixture sans en-tête de panneau), commerce et page Bâtiments réelle (aucune fixture ; seule la structure de section repliable est mesurée).

## Plan Change Log

- Zone `typographie-formes` : fragment `echelle` ajouté au registre ; mots-clés de routage des composants mesurés (`panel-heading`, `panel-title`, `list-group-item-heading`, `dashboard-card-name`, `dashboard-card-status`, `mobile-tab-label`, jauges compactes, `kr-skill-caption`).
- Fixture synthétique `tests/e2e/fixtures/typographie-echelle.html` (Matériel inventé : panneaux, carte du tableau de bord, texte, champ ; après revue : section « Bâtiment » repliable, en-tête en h4.panel-title, accordéon, modale masquée).
- Après revue : routage des composants génériques (`panel-heading`, `panel-title`, `list-group-item-heading`, cités par plus de 3 suites) sur une entrée propre vers forum, sous-forum, kramail, modale-ordre, cybermonde, palette-nation, plateau, profil, typographie-formes (cas de `router.test.mjs`, rouge si l'entrée est retirée) ; mots-clés de plateau seuls sur l'entrée typographie-formes.
- Après revue : règle 4K `.panel-heading h3` retirée ; échelle mobile h4-h6 sans les titres d'en-tête de panneau ; masques `ECHELLE_TICKET45` / `LEGENDES_TICKET45` réécrits en miroir ; info d'écart du fragment `boutons` par page, sur la même décision que le masque.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|------|----------|-------|---------|-------|----------|
| 1 | quick | tests/e2e/typographie-formes.mjs, router.mjs:179 | `panel-heading` et `panel-title` passent à 4 suites citantes (> MAX_CITING) : leurs citations ne lancent plus forum-index, modale-ordre, sous-forum, cybermonde-carte, jeu-identite | high | patch (fixed) | grep : 4 fichiers chacun ; MAX_CITING = 3 |
| 2 | quick | tests/e2e/lib/router.mjs:145 | Mots-clés `panel-heading|panel-title|list-group-item-heading` routent vers typographie-formes seul au lieu d'élargir | high | patch (fixed) | regex l.145 ; avant : aucun mot-clé, donc élargissement |
| 3 | quick | kraland-theme.css:588 / 13358 | Nouvelle règle d'en-tête ordinateur bat la règle 4K (16 px) sans la retirer (P1 option 4) | medium | patch (fixed) | spécificité 0,2,0 > 0,1,1, même plage ≥ 3840 |
| 4 | quick | kraland-theme.css:4725 / 9967 | Mobile : h4-h6 (avec ou sans `.panel-title`) dans `.panel-heading` restent à 15 px (échelle h4-h6 `!important` bat `.panel-title`) | medium | patch (fixed) | `.panel-title` sans `!important` |
| 5 | quick | tests/e2e/lib/variantes.mjs:488-506 | Masques `@layer … !important` plus larges que l'écart réel (ex. `.panel-group .panel-title` 14 px forcé), peuvent cacher une régression | medium | patch (fixed) | important en couche > important hors couche |
| 6 | quick | tests/e2e/typographie-formes.mjs (boutons) | Message « écart accepté » lu sur `avantBoutons` alors que le masque est décidé par page | low | patch (fixed) | `AVANT_TICKET45(baseBoutons(c.nom))` |
| 7 | quick | fixtures | Règle PLT-QU « noms de bâtiment 12 px » retirée sans mesure ; sujet, commerce, Bâtiments non mesurés | medium | patch (bâtiment) / defer (sujet sans en-tête, Bâtiments/commerce : ticket 4.6, mandat) | AGENTS.md : vérifier le rendu après suppression |

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes plateau profil forum sous-forum kramail` (corriger les noms de zone si besoin) ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL. (`test:all` : orchestrateur.)

**Résultats (arbre de travail sur `fe77411`) :**
- Rouge avant : `KR_SCRIPT=<bundle fe77411> KR_FRAG=echelle` : 88 ok, 128 FAIL (en-têtes 16/500 et 20/700, h4 du Matériel 10 px mobile / 18 px ordinateur, nom 11 px, texte mobile 14 px, jauges et onglets 11 px). `plateau-qualite-usage` et `plateau-profil-mobile` (seuil 12) rouges sur `fe77411`.
- Vert après : `KR_FRAG=echelle` 216 ok / 0 FAIL ; `npm run test:zone -- typographie-formes plateau profil forum sous-forum kramail` (avant consignation des écarts : 26 FAIL dans forum-index#hors-perimetre, kramail-redaction#regression, typographie-formes#boutons, tous écarts attendus) puis fragments rejoués verts ; `npm run test:changed` élargi au total : 6954 ok, 0 FAIL, VERT ; `npm run test:router` conforme ; `lint:css` exit 0 ; `lint:js` exit 0 (1 avertissement préexistant, report-non-lu.mjs).
- Après revue : `KR_FRAG=echelle` 254 ok / 0 FAIL ; `npm run test:zone -- typographie-formes plateau profil forum sous-forum kramail` 3885 ok / 0 FAIL ; `npm run test:changed` (total) 6992 ok / 0 FAIL ; `npm run test:router` conforme (entrée générique retirée -> FAIL) ; `lint:css` et `lint:js` exit 0. Contre-épreuves : échelle h4-h6 sans exclusion -> 13 FAIL (« Titre en h4 » 15 px) ; `.panel-body h4` à 12 px -> 13 FAIL (dont « Atelier d'essai ») ; ancien masque en couche -> 4 FAIL (accordéon).
- Contre-épreuves (copies du bundle, `KR_SCRIPT`) : jeton titre à 16 px -> 66 FAIL ; onglets à 11 px -> 25 FAIL ; titre d'ordinateur en 17 px littéral -> 3 FAIL (jetons redéfinis) ; texte courant mobile retiré -> 9 FAIL ; nom du tableau de bord à 11 px -> 17 FAIL.

## Result

Construit le 2026-10-24 sur `fe77411`. En-têtes de panneau en 17 px / 700 (deux supports, h1-h6 compris, hors accordéons et modales), échelle mobile des titres en px (h1-h3 17, h4-h6 15), noms et valeurs 15 px / 600, détails 13 px, texte courant 15 px sur les pages de jeu mobiles (garde `body:has(#col-leftest)`), mini-profil et planchers PLT-QU à 12 px ; règle 4K battue retirée. Revue quick : 7 constats, 6 corrigés, 1 en partie différé (sujet sans en-tête, commerce et Bâtiments : ticket 4.6). `npm run build` validé, `lint:css`/`lint:js` exit 0, `test:router` conforme, `npm run test:all` 6992 ok, 0 FAIL.
