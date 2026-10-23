---
title: "Jetons d'échelle ; étiquettes et pastilles en 12 px gras"
type: 'feature'
ticket: '1'
created: '2026-10-24'
status: 'built'
baseline_revision: 'd68ab559a01bad1e2728506e434e3d56e90c983b'
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

**Problem:** Le thème n'a aucun jeton de taille de texte ni d'espacement (seul `--kr-radius: .5rem`, CSS:18) ; les étiquettes et pastilles ont des tailles disparates de 8 à 11 px (H8.2, DESIGN.md « 8,25 à 10,5 px »).

**Approach:** Balle traçante de l'épopée 4. Déclarer sur `:root` les jetons de DESIGN.md (frontmatter l.51-91 : typography, rounded, spacing) ; toute étiquette et pastille passe en 12 px / 700 par `--kr-font-label`, sans changer ses couleurs ; créer la suite `typographie-formes.mjs` et sa zone dans le routeur.

## Boundaries & Constraints

**Always:** jetons nommés `--kr-font-<rôle>` (label, button-compact, detail, body, body-mobile, name, forum-name, section-title, page-title, button), `--kr-radius-sm/-md/-full`, `--kr-space-1` à `-6`, `--kr-margin-mobile`, `--kr-touch-target`, `--kr-touch-target-dpad`, valeurs en px de DESIGN.md (1 rem = 10 px sur ce site) ; `--kr-radius` existant inchangé ; P1 option 4 : réécrire les règles de taille existantes pour consommer le jeton, pas les battre par une règle de plus ; mobile `@media (max-width: 767px)`, bureau `(min-width: 768px)`, commun `@media (max-width: 767px), (min-width: 768px)` ; couleurs, rayons et hauteurs de ligne inchangés hors effet direct de la taille ; rouge avant le code sur le bundle de base (`KR_SCRIPT`) et contre-épreuve pour chaque contrôle ; une suite propre à l'épopée (ne pas grossir palette-nation.mjs).

**Never:** toucher aux boutons (entrées 4.2 à 4.4), aux rayons (4.8 : le `border-radius: 3px` de `.kr-topic-badge` reste), à l'espacement (4.9) ; aucune règle `:focus` ; ne pas réduire une cible tactile ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Jetons | `:root`, Kraland clair et Empire Brun sombre | chaque jeton calculé égal à DESIGN.md | n/a |
| Étiquettes et pastilles | `.label`, `.badge`, « ! » de la cloche, « ici » de la croix, tags du forum, `.kr-topic-badge`, badges et PNJ du tableau de bord, `.kd-opt-tag` / `.kd-opt-free` du kramail, `.kr-stat-badge`, pastilles de la modale d'ordre ; 375, 767, 768, 1280 px | font-size 12px, font-weight 700, via `--kr-font-label` | n/a |
| Couleurs | mêmes éléments, Kraland clair et Empire Brun sombre | couleur, fond et bordure calculés égaux à la base | n/a |
| Sous-forum | `.kr-topic-badge` à 12 px | hauteurs de ligne existantes de sous-forum.mjs tenues (≤ 20 px une ligne, ≤ 34 px deux lignes, permanent 44-48 px) | n/a |

</frozen-after-approval>

## Code Map

- `kraland-theme.css:18` -- `:root` : ajouter les jetons à côté de `--kr-radius`.
- `kraland-theme.css:674` `.label, .badge` -- couleurs seules ; taille de Bootstrap (`.label` 75 % = 10,5 px, `.badge` 12px/700) : poser `font-size: var(--kr-font-label); font-weight: 700` ici.
- Cloche « ! » (mobile, `!important`) : `:5593` `.navbar-header-buttons-left/right .badge` 10px ; `:5695` `.navbar-right .badge` 11px. Texte du serveur.
- « ici » : `:6740` `body.mobile-mode .kr-nav-v2 .kr-room-here` 10.5px/700 ; créé par `buildRoom` (template:2749-2756). Page de test construite en ligne dans `tests/e2e/croix-directionnelle.mjs`.
- Tags du forum (mobile, `!important`) : `:8889` `.forum-tags .glyphicon` 8px, `:8896` `.forum-tags a` 9px ; balisage natif, aucune fixture.
- `.kr-topic-badge` : `:13761` 11px/700 ; `:13814` 11px !important mobile ; créé par template:5103-5108.
- Tableau de bord : `:2424` `.dashboard-section-header .badge` 10px/600, `:13333` (≥768) et `:13365` (≤767) 11px ; `.dashboard-card-pnj` `:2606` 10px/600, `:13345`, `:13377` 11px (créé template:4357-4359) ; `:5954` `body.mobile-mode .dashboard-card-badge` 8px : aucun créateur JS, retirer si aucune cible prouvée.
- Kramail : `.kd-opt-tag` `:11295`/`:11555` 11px (12px désactivé `:11300`/`:11560`), `.kd-opt-free` `:11307`/`:11567` 11.5/12px ; créés template:6627-6631, 6765. `.kd-chip` (13-15 px, puce de destinataire avec croix) est un contrôle, pas une étiquette : inchangé.
- `.kr-stat-badge` : `:12988` 11px/700, `:13198` 11px mobile.
- Modale d'ordre : `:2090-2091` `.kr-order-badge` déjà 12px/700 : consommer le jeton.
- Fixtures : `.label` forum-index-rp/communaute, forum-racine-groupes, palette-nation(-etats) ; `.badge` palette-nation, kramail-*.html (cloche vide) ; `.kr-topic-badge` sous-forum-debuter ; `.kd-opt-*` kramail-nouveau/repondre/transferer ; modale-ordre/*. Sans fixture : « ! » rempli, `.forum-tags`, en-tête de section du tableau de bord : créer une fixture synthétique `tests/e2e/fixtures/typographie-formes.html` (balisage natif minimal, contenus inventés).
- Tests qui figent ces tailles : `modale-ordre.mjs:425,988` (reste vert) ; `sous-forum.mjs:1064-1093` (hauteurs) ; `forum-index.mjs:578` EMPREINTE avec font-size (le `[mod]` passe de 10,5 à 12 px : consigner l'écart comme COMPOSANTS_TICKET5 / AVANT_TICKET5, l.720-721, lib/variantes.mjs:58-68) ; `palette-nation.mjs` couleurs seules.
- Routeur : `tests/e2e/lib/router.mjs` `SUITES` (l.18-60), `KEYWORDS` (l.117), `SECTIONS` (l.136), `PURE_BLOCKS`, `MAX_CITING = 3` ; `lib/router.test.mjs` (check sur le modèle l.53-72) ; `durations.json`. Modèle de suite : `palette-nation.mjs` (en-tête matrice, imports `launchBrowser`, `confineNetwork`, `mapLimit`, `krReady`, `parVariante` de lib/variantes.mjs:94). Les jetons `:root` ne doivent pas rendre la zone transverse (commentaire router l.59-68).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/typographie-formes.mjs` + fixture + routeur -- contrôles de la matrice, rouges sur la base.
- [x] `kraland-theme.css` -- jetons `:root` ; règles de taille réécrites en `var(--kr-font-label)` / 700 ; règle morte `.dashboard-card-badge` retirée si sans cible.
- [x] `forum-index.mjs`, `sous-forum.mjs` -- écart voulu consigné, hauteurs vérifiées.
- [x] `npm run build` puis contre-épreuves (taille d'origine remise → rouge).

**Acceptance Criteria:**
- Given les fixtures existantes, when `npm run test:all` tourne, then tout est vert hors écarts voulus consignés.

## Implementation Notes

- Jetons déclarés sur `:root` juste après `--kr-avatar-size`, valeurs en px de DESIGN.md ; `--kr-radius: .5rem` inchangé. Aucune variante ne les redéfinit.
- Règles réécrites en `var(--kr-font-label)` (graisse 700 posée là où elle était à 600 ou absente) : `.label, .badge` (socle couleurs), pastille de la modale d'ordre, `.dashboard-section-header .badge` et `.dashboard-card-pnj` (règles globales ; les surcharges à 11 px des deux media « plancher de 11 px » sont supprimées, devenues redondantes), badges de l'en-tête mobile (`.navbar-header-buttons-left/right .badge`, `.navbar-right .badge`, `!important` et hauteurs de ligne gardés), « ici » de la croix, `.forum-tags a` (mobile), `.kd-opt-tag` bureau et mobile (la règle `[aria-disabled]` ne porte plus que `letter-spacing`, la taille de `.kd-opt-free` vient de la règle de base), `.kr-skill-badge, .kr-stat-badge` bureau et mobile (règle commune : la pastille de compétence suit), `.kr-topic-badge` commun et mobile.
- `.forum-tags .glyphicon` laissé à 8 px : c'est une icône, pas un texte d'étiquette ; à trancher si on veut l'aligner sur 12 px.
- Règle morte `body.mobile-mode .dashboard-card-badge` supprimée : aucun créateur dans tout l'historique du template ; seule cible, la fixture palette-nation.html (`#pastille-carte`), retirée avec son entrée `COMPOSANTS` de palette-nation.mjs.
- « ici » de la croix et tags du forum n'existent que sur mobile : contrôlés à 375 et 767 px seulement.
- Couleurs : comparées au bundle de base `d68ab55` (`KR_SCRIPT_AVANT` pour un autre), 0 écart.
- Rouge sur la base (`KR_SCRIPT` = bundle `d68ab55`) : 51 FAIL sur 123 contrôles (jetons absents, tailles 8,25 à 11 px, graisse 400/600 des tags et `.kd-opt-tag`, consommation du jeton). Pastille de la modale d'ordre déjà en 12px/700 sur la base : seul le contrôle de consommation (`--kr-font-label` à 13 px) la fait passer au rouge.
- Contre-épreuves (bundle jetable hors dépôt, une mutation à la fois) : chacune des 14 tailles remise à sa valeur d'origine → rouge (4 à 8 FAIL) ; graisse 600 remise sur la pastille d'en-tête de groupe → rouge ; fond du PNJ changé d'un point → contrôle des couleurs rouge ; zone du routeur faussée → check routeur rouge.
- forum-index.mjs (hors périmètre, bundle `81512a3`) : rouge à 8 FAIL avant consignation (`[mod]` de Staff 8,25 → 12 px, hauteurs du sous-forum décalées par `.kr-topic-badge`). Écart consigné par `ETIQUETTES_TICKET41` (lib/variantes.mjs) : taille et graisse des étiquettes en `!important` dans une `@layer` posée sur le bundle « avant » (une déclaration importante en couche bat toute déclaration importante hors couche), plus une ligne `info écart accepté et consigné`.
- sous-forum.mjs : hauteurs tenues à 12 px sans changement de code ; écart consigné en commentaire au-dessus de `checkNewmsg`.
- Routeur : suite `typographie-formes` (zone du même nom, fragments `jetons`, `mobile`, `bureau`) ; check router.test : zone, déclaration de jeton sur `:root` → total, fixture → cette suite seule. `durations.json` non rempli (une durée manquante n'échoue pas).

## Plan Change Log

- Commande de vérification : `forum-index` n'est pas une zone du routeur ; remplacée par `npm run test:zone -- forum sous-forum modale-ordre palette-nation typographie-formes` (forum-index porte les zones forum et sous-forum).

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | Pastille du mini-profil 11→12 px dans une boîte de 16 px, sans mesure plié/déplié à 375/700 | medium | patch | Règle l.5232 en absolu ; la suite ne lit que getComputedStyle ; piège AGENTS.md. |
| 2 | Seuils sans 769 ni transition dans le même onglet | low | patch | `largeurs` 375/767 et 768/1280 ; paires mobile/bureau réécrites (.kd-opt-tag, .kr-stat-badge). |
| 3 | `.kr-skill-badge` restylée, jamais mesurée | low | patch | Fixture sans pastille de compétence ; PAGES.plateau ne mesure que .kr-stat-badge. |
| 4 | Contrôle 13 px sans test de présence | low | patch | l.189 n'asserte que `hors`, l.198 a `vides`. |
| 5 | Routeur sans mot-clé pour la zone | medium | patch | Entrée « Aucun mot-clé » ; une retouche locale de `var(--kr-font-label)` ne lance pas la suite sous test:changed. |

## Verification

**Résultats (2026-10-24, base `d68ab55`, arbre non commité) :**
- `npm run build` : validation passée.
- `node tests/e2e/typographie-formes.mjs` : 123 ok, 0 FAIL (base : 51 FAIL).
- `npm run test:zone -- forum sous-forum modale-ordre palette-nation typographie-formes` : 0 FAIL après consignation de forum-index.
- `npm run test:router` : routeur conforme.
- `npm run lint:css` : code 0 ; `npm run lint:js` : code 0 (1 avertissement préexistant, report-non-lu.mjs).
- `npm run test:all` : 6190 ok, 0 FAIL, VERT.

**Commands:**
- `npm run build` ; `node tests/e2e/typographie-formes.mjs` ; `npm run test:zone -- forum-index sous-forum modale-ordre palette-nation` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, routeur conforme, lint 0 erreur. (`test:all` : orchestrateur, machine calme.)

## Result

Jetons de DESIGN.md sur `:root` ; étiquettes et pastilles (`.label`, `.badge`, cloche, « ici », tags du forum, `.kr-topic-badge`, tableau de bord, `.kd-opt-tag`, `.kr-stat-badge`/`.kr-skill-badge`, modale d'ordre) en `var(--kr-font-label)` / 700, couleurs inchangées ; règle morte `.dashboard-card-badge` retirée. Suite `typographie-formes.mjs` (jetons, mobile, bureau 768/769/1280, mini-profil replié et déplié à 375/700, bascule 767/768/767) : rouge sur d68ab55 (51 FAIL), vert après, contre-épreuves rouges. Revue quick : 5 constats de couverture et de routeur, tous patchés ; mot-clé du routeur réduit aux composants par l'orchestrateur (une retouche de `.label, .badge` garde son élargissement). `npm run test:router` conforme, lint 0 erreur, `npm run test:all` 6234 ok, 0 FAIL (machine calme). Doutes : revue-manuelle.md, ticket 4.1.
