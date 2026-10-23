---
title: "Texte coloré lisible ; plus de rouge Kraland ni de bleu Bootstrap résiduels"
type: 'feature'
ticket: '3'
created: '2026-10-23'
status: 'built'
baseline_revision: '804c892e307c11ab6c91c02be38075043c9e61bd'
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

**Problem:** Une quarantaine de déclarations colorent encore du texte en `--kr-primary` ou `--kr-primary-dark`, dans les deux modes : en sombre, la primaire tombe à 2,25 à 2,56:1 en Empire Brun (H5.6) ; en clair, elle ne suit pas la nuance lisible de la nation (Q2). En sombre, les couleurs de nation `.f4` à `.f8` restent sous 4,5:1 dans certaines variantes. Du rouge Kraland (`rgba(139, 15, 14, …)`) et du bleu `#2196F3` sont codés en dur dans toutes les variantes.

**Approach:** Tout texte aujourd'hui en primaire ou en primaire foncée prend `--kr-text-accent`, au repos comme au survol et à l'appui. Les couleurs de nation `.f1` à `.f9` sont éclaircies en sombre jusqu'à 4,5:1 sur `bg-surface`. Les valeurs en dur sont remplacées par des jetons de la nation (H5.6, Q2 ; CAP-4).

## Boundaries & Constraints

**Always:**
- Périmètre : les déclarations `color:` en primaire ou en primaire foncée hors fond de nation (forum mobile, en-têtes de panneau du forum et du kramail, kramail, accueil, changelog, barre d'outils, pagination, onglets mobiles, menu de la barre du haut, `.accordion-toggle`, `.bootbox-confirm .panel-actions label:hover`, `.carousel-control` sombre) ; `html[class*="-dark"] .alert a` ; la coche du sélecteur de personnage du template (L5830).
- Les règles mortes du domaine (`.kr-changelog-inline`) sont retirées ; les autres sont réécrites en place (P1 option 4).
- Rouge Kraland en dur → mélange de la primaire de la nation, à la même opacité (`color-mix(in srgb, var(--kr-primary) N%, transparent)`) ; `#2196F3` → `--kr-text-accent` pour le contour, paire d'action pour le fond et le texte du bouton du mini-chat.
- Texte ≥ 4,5:1 sur son fond, dans les 16 variantes (`tests/e2e/lib/variantes.mjs`) ; fixture synthétique.

**Never:** couleur des titres de section (H4.1, épopée 5 : ils prennent ici l'accent, comme tout texte en primaire) ; fond et filet de l'onglet actif (épopée 4, ticket 2.6) ; `accent-color` des cases à cocher (non textuel) ; focus clavier (3.7) ; alerte info sombre (3.5) ; variante high-contrast.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Texte coloré | un échantillon par règle du périmètre, dans son contexte de page ; 16 variantes ; 375 × 667 et 1280 px ; repos, survol (ordinateur) ou appui (mobile) | couleur `--kr-text-accent`, ≥ 4,5:1 sur son fond | No error expected |
| Sombre | même échantillons, 8 variantes sombres | aucune couleur de texte calculée égale à la primaire ni à la primaire foncée | No error expected |
| Lien d'alerte, sombre | lien dans `.alert-info`, `.alert-warning`, `.alert-danger` | `--kr-text-accent`, ≥ 4,5:1 | No error expected |
| Couleurs de nation | `.f1` à `.f9` sur `bg-surface`, 8 variantes sombres | ≥ 4,5:1 | No error expected |
| Rouge et bleu en dur | barre d'outils (survol, appui, focus), `.accordion-toggle`, champ au focus, carte du forum, mini-chat ; 15 variantes hors Kraland | aucun `rgb(139, 15, 14…)` ni `#2196F3` calculé | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes valeurs | No error expected |

</frozen-after-approval>

## Code Map

- Lignes de `kraland-theme.css` au 2026-10-23 (`804c892`) :
  - forum mobile `a:active` l.7744, 7769, 7856, 7893, 8438, 8461, 8542, 8579, 8678, glyphe l.8775 ; en-têtes `body.page-forum .panel-default > .panel-heading h3` l.8357 et `body.page-kramail .panel-heading h3.panel-title` l.9006 ;
  - kramail l.9472, 9504, 9748, 9901, 9914, 9948 ; accueil l.11957, 11963, 12436, 12077, 12144, 12255 ; changelog l.11609, 11645, 11706, 11729, morte l.11740-11753 ;
  - barre d'outils l.2557, 9691 ; pagination l.2037, 2041, 3572, 3616 ; onglets mobiles l.5249, 7033 ; menu de la barre du haut l.7955, 7983 ;
  - autres l.1165, 3227, 9849 ; `.forum-thread-action-new` l.13376 (primaire en simple repli, laissée) ;
  - lien d'alerte sombre l.2864 ;
  - couleurs de nation : `:root` l.57-65, blocs sombres, consommateurs `html[class*="-dark"] .fN` l.2967-2975 ;
  - rouge en dur l.1411, 7367, 8066, 9689, 9695, 9701, 9718, 9847, 10344 ; `#2196F3` l.8174 (contour), l.8186 (fond du mini-chat, texte blanc).
- Template : coche L5830 (`color: var(--kr-primary)`).
- Tests : suite `tests/e2e/palette-nation.mjs` (outils `CONTRASTE`, `COMPOSANTS`, états forcés par CDP, balayage), fixture `palette-nation.html` ; ouvertures de pages de forum et de kramail : `forum-index.mjs:80`, fixtures `kramail-reception.html`, `sous-forum-debuter.html`.
- Comparaisons figées : `forum-index#hors-perimetre`, `kramail-redaction#regression` : écarts de couleur de texte attendus sur ces éléments, à neutraliser sur ces seuls éléments, consignés.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/palette-nation.mjs`, `tests/e2e/fixtures/palette-nation.html` (et fixtures de page si une règle exige une classe de page) -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-theme.css` -- textes en `--kr-text-accent`, couleurs de nation sombres, valeurs en dur remplacées, règles mortes retirées
- [x] `kraland-userscript-template.js` -- coche en `--kr-text-accent`
- [x] suites à comparaison figée touchées -- écarts consignés, tout autre écart reste rouge
- [x] `tests/e2e/lib/router.mjs` -- fragments nouveaux, aucun mot-clé qui réduise le routage, aucune 4e citation d'un repère
- [x] `npm run build`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne machine calme, then RÉSULTAT : VERT.
- Given une copie mutée du bundle (un texte remis en primaire, une couleur de nation remise, un rouge en dur remis), when la suite tourne, then elle est rouge.

## Implementation Notes

- Texte : les 42 déclarations `color:` en primaire du périmètre passent à `--kr-text-accent` en place (filets, fonds et bordures de l'onglet actif et du menu laissés en primaire) ; `.forum-thread-action-new` (repli) laissé ; coche du sélecteur de personnage du template en accent ; règles mortes `.kr-changelog-inline` retirées ; commentaires « en primaire » mis à jour.
- Valeurs en dur : rouge Kraland → `color-mix(in srgb, var(--kr-primary) N%, transparent)` à la même opacité (l.1411, 7367, 8066, 9718, 9847, 10344) ; `#2196F3` → `--kr-text-accent` (contour de `.forum-card-link:focus`) et paire d'action (fond et texte de `.mini-chat-fab`). `.mini-chat-fab.active` (`#f44336`) hors périmètre, laissé.
- Écarts au-delà du texte, pour tenir 4,5:1 (consignés dans `revue-manuelle.md`) :
  - boutons génériques de la barre BBCode : fond `--kr-surface` (blanc aussi en sombre) → `--kr-bg-surface` ; en sombre, l'accent sur blanc tombait de 1,66:1 à 3,34:1 ; le clair ne change pas ;
  - `html[class*="-dark"] .alert-warning` : fond ambre de 15 % à 8 % ; le lien en accent passe de 4,36:1 à 5,02:1 en Kraland sombre et de 4,04:1 à 4,65:1 en Paladium sombre.
- Modale du changelog (après revue) : fond noir dans les 16 variantes, où l'accent du clair tombait de 2,01:1 à 3,55:1. Titre, version et puces prennent `color: inherit` (texte clair de la modale) au lieu de l'accent ; contrôle : couleur héritée et ≥ 4,5:1 dans les 16 variantes (`herite`). Décision en autonomie, à confirmer (`revue-manuelle.md`).
- Barre d'outils mobile (après revue, P1 option 4) : déclarations mortes retirées de `.btn-toolbar .btn:hover`, `:active` et `:focus-visible` (fond, texte, bordure et ombre, toujours battus par la règle de base en `!important`) ; restent l'échelle à l'appui et `outline: none` au focus. Les trois contrôles `DURS` de `#outil`, qui ne pouvaient pas rougir, sont retirés.
- Flèche du carrousel en sombre (après revue) : opacité 0,7 → 1, au repos comme au survol et au focus (à 0,7, 3,44:1 en Kraland sombre) ; `MESURES_TEXTE` compte désormais l'opacité de l'élément et de ses ancêtres dans celle du texte.
- Balayage du sombre (après revue) : seuls les textes posés sur un fond de nation (primaire, primaire foncée, `--kr-arm-bg`, `--kr-arm-bg-hover`) sont exclus ; l'exclusion de l'encre d'action sautait tout texte sur blanc en Empire Brun sombre.
- Couleurs de nation `.f1` à `.f9` en sombre : déjà ≥ 6,26:1 sur `bg-surface` et `bg-elevated` dans les 8 variantes (blocs sombres des variantes), aucune valeur changée ; contrôle ajouté (contre-épreuve : `.f4` remise à `#0033a0` en Kraland sombre → rouge, 1,69:1).
- Règles réécrites sans effet mesurable dans les fixtures (battues par une règle plus spécifique, ou élément absent) : en-têtes `h3` du forum mobile, liens de cartes du forum en `:active` hors `a.nomargin` et étiquette, glyphe l.8775, onglet actif de `.mobile-tab-bar`, `.kramail-msg-recipients a`, citation du kramail, icônes du formulaire du kramail (ordinateur), fonds `:active` des barres d'outils (Bootbox, kramail), survol et focus de la barre d'outils mobile (fond et ombre en `!important` dans la règle de base). Le balayage du sombre les couvre si elles redeviennent effectives.
- Suite `palette-nation` : fragments `textes-mobile`, `textes-bureau`, `textes-largeurs` ; fixtures synthétiques `palette-nation-textes.html` (servie à `/regles/avancees`) et `palette-nation-accueil.html` (`/accueil`) ; pages de référence : sous-forum, sujet, réception et rédaction du kramail. Échantillons (`TEXTES`) : une règle effective chacun, couleur égale à `--kr-text-accent` (sonde et DESIGN.md), ≥ 4,5:1 ; balayage du sombre (repos, survol, appui, focus forcés par CDP) sans texte en primaire ni primaire foncée, hors texte posé sur la couleur de nation, badges en paire inverse et `.f1` à `.f9` (la nation 2 vaut la primaire de Paladium sombre) ; valeurs en dur (`DURS`) dans 15 variantes ; largeurs : mêmes couleurs que 375 ou 1280 px (fond des textes du kramail exclu : il change sous 769 px, règle `max-width: 768px` antérieure). Requêtes refusées vérifiées sur les fixtures synthétiques seulement (les fixtures de référence demandent leurs polices). Sélecteurs choisis pour ne pas citer une 4e fois `panel-heading`, `panel-title` ni `btn-toolbar` (routeur).
- Écarts consignés des comparaisons figées :
  - `forum-index.mjs#hors-perimetre` : l'empreinte relève les éléments dont le texte est en primaire ou primaire foncée dans le bundle « avant » ; sur ces seuls éléments, `color` (et `border-bottom-color` quand elle suit le texte) valent « texte coloré » des deux côtés. Contre-épreuve : graisse de la pagination modifiée → rouge (2 FAIL) ;
  - `cybermonde-carte.mjs#panneaux` (relevé par `test:all`) : les sélecteurs de province et de ville, posés dans la pagination, héritent de `.pagination > li > a` ; sur les seuls éléments en primaire dans le bundle « avant », la couleur vaut « texte coloré » des deux côtés. Contre-épreuve : taille de police de la pagination modifiée → rouge (4 FAIL) ;
  - `kramail-redaction.mjs#regression` : mêmes éléments relevés dans le bundle « avant », marqués aux mêmes index dans « après » (`data-kr-texte-colore`) et masqués sur les deux captures. Contre-épreuve : taille du titre du panneau du kramail modifiée → rouge (6 FAIL).
- Vérification (base `804c892`, non commité) : `palette-nation` vert (tous fragments) ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur, 1 avertissement préexistant (`report-non-lu.mjs`) ; `test:unit` vert ; `test:all` 5223 ok, 0 FAIL, RÉSULTAT : VERT.
- Contre-épreuves de `palette-nation` (copies du bundle par `KR_SCRIPT`), toutes rouges : bundle de `804c892` (110 FAIL sur `textes-mobile` et `textes-bureau`) ; liens des alertes sombres remis en primaire (32 FAIL) ; `.f4` remise en bleu foncé (2 FAIL) ; rouge en dur remis sur le champ au focus (15 FAIL) ; après revue : texte de la barre d'outils en primaire sur blanc (balayage rouge en Empire Brun sombre, 48 FAIL en tout), flèche du carrousel remise à 0,7 (10 FAIL), titre du changelog remis en accent (32 FAIL).

## Plan Change Log

## Review Triage Log

Passe quick du 2026-10-23 (boucle 0) : 3 medium (patch), 1 medium (intent_gap tranché en autonomie).
- medium, patch — survol, appui et focus de la barre d'outils mobile : leurs règles, sans `!important`, perdaient toujours contre la règle de base ; les 3 contrôles `#outil` ne pouvaient pas échouer. Déclarations mortes retirées, contrôles retirés.
- medium, patch — flèche du carrousel en sombre : opacité 0,7, contraste réel ≈ 3,4:1 ; la mesure ignorait l'opacité de l'élément. Opacité 1, mesure qui compose l'opacité (contre-épreuve : 10 FAIL).
- medium, patch — le balayage du sombre excluait tout texte sur blanc en Empire Brun sombre (repli de `--kr-arm-ink`). Exclusion limitée aux fonds de nation (contre-épreuve : 48 FAIL).
- medium, intent_gap — modale du changelog, fond noir dans les 16 variantes : l'accent y tombait de 2,01 à 3,55:1 en clair. Tranché en autonomie : ces textes héritent du texte clair de la modale (≥ 4,5:1, contre-épreuve : 32 FAIL) ; consigné dans `revue-manuelle.md`.

Vérification après patch : build validé ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant) ; `test:unit` vert ; skills identiques ; `test:all` 5223 ok, 0 FAIL, RÉSULTAT : VERT, machine calme.

## Design Notes

- Couleurs de nation sombres : éclaircir chaque valeur sous 4,5:1 en la mêlant de blanc (`color-mix(in srgb, <valeur> N%, #fff)` ou valeur calculée), au plus petit taux qui passe sur `bg-surface` de toutes les variantes sombres, pour garder la teinte.
- Effets visibles : en Royaume de Ruthvénie clair, ces textes passent du vert de la primaire au rouge de l'accent ; en Paladium clair, de l'or illisible au vert ; en Empire Brun clair, au brun `#8a5a00`.

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant, vert après
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: conformes
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme
