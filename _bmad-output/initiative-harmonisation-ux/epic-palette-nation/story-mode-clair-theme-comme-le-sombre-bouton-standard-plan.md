---
title: "Mode clair thémé comme le sombre ; bouton standard"
type: 'feature'
ticket: '4'
created: '2026-10-23'
status: 'built'
baseline_revision: '6685df5d4f7a8fbdca9b85dd7c66bcf384dfce2a'
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

**Problem:** En clair, les en-têtes et pieds de panneau, les en-têtes de tableau, les onglets et le bouton standard gardent le rendu de Bootstrap (`#f5f5f5`, `#333`, `#ddd`, `#ccc`, `#e6e6e6`), sans couleur de nation ; le sombre, lui, est thémé. Le bouton standard n'a pas le texte de la nation ; en sombre, ses états `.active` et menu ouvert retombent sur `#e6e6e6`. `--kr-text-secondary` (`#6b7280`) tombe sous 4,5:1 sur `bg-page`, `header-tint` et `info-bg` (Q26).

**Approach:** Une seule série de règles pour les deux modes, sur les jetons qui changent avec le mode (H5.3 ; CAP-4) :
- en-têtes et pieds des panneaux `.panel-default`, en-têtes de tableau : fond `--kr-header-tint`, bordure `--kr-border-tint`, texte `--kr-text-primary` ;
- onglets : bordures `--kr-border-tint`, onglet actif sur `--kr-bg-surface` ;
- bouton standard (`.btn-default`, « ? Aide » compris), tous états : fond `--kr-bg-surface`, bordure `--kr-border-tint`, texte `--kr-text-nation`, survol et appui en `--kr-header-tint` ;
- `hr` masqué dans les deux modes, comme en sombre aujourd'hui ;
- `--kr-text-secondary` à `#636a77` en clair.

## Boundaries & Constraints

**Always:**
- Les règles sombres du domaine (`html[class*="-dark"] .panel-heading`, `.panel-footer`, `th`, DataTables `thead`/`tfoot`, `.btn-default` et ses états, `.nav-tabs`, `hr`) sont réécrites en règles communes ou retirées (P1 option 4) ; leurs propriétés non chromatiques sont reprises en clair.
- En sombre, le rendu reste celui d'aujourd'hui, sauf le fond du bouton standard (`bg-surface` au lieu de `bg-elevated`, DESIGN › Bouton standard), son texte (accent) et ses états `.active` / menu ouvert.
- Les règles propres à une page (forum, kramail, sous-forum, index, modale d'ordre mobile, barre d'outils, cartes mobiles) gardent la main.
- Texte ≥ 4,5:1 dans les 16 variantes (`tests/e2e/lib/variantes.mjs`) ; fixture synthétique.

**Never:** en-têtes des panneaux d'état (`.panel-info`, `-success`, `-warning`, `-danger`) et alertes (3.5) ; `.panel-primary` (3.2) ; titres 17 px et rayons (épopée 4) ; onglets bleus en dur de la modale d'ordre mobile (`#428bca`, ticket 2.6) ; barre d'onglets mobile.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Panneau | `.panel-default` avec en-tête et pied, 16 variantes, 375 × 667 et 1280 px | en-tête et pied : fond `header-tint`, bordure `border-tint`, texte ≥ 4,5:1 ; aucun `#f5f5f5` ni `#ddd` en clair | No error expected |
| Tableau | `.table` avec `thead th`, et tableau DataTables | fond `header-tint`, bordure `border-tint`, texte ≥ 4,5:1 | No error expected |
| Onglets | `.nav-tabs`, onglet actif et inactif survolé | bordures `border-tint`, actif sur `bg-surface`, texte ≥ 4,5:1 | No error expected |
| Bouton standard | `.btn-default` sur `button`, `a`, `input` ; repos, survol, focus, `:active`, `.active`, menu ouvert, désactivé ; « ? Aide » de la modale d'ordre | fond `bg-surface` (survol et appui `header-tint`), bordure `border-tint`, texte `text-nation` ≥ 4,5:1 ; aucun `#ccc`, `#e6e6e6`, `#adadad`, `#8c8c8c`, `#d4d4d4`, `#333` en clair | No error expected |
| hr | `hr` dans un panneau | masqué dans les deux modes | No error expected |
| Texte atténué | `--kr-text-secondary` en clair sur blanc, `bg-page`, `header-tint` et `info-bg` des 8 variantes claires | `#636a77`, ≥ 4,5:1 | No error expected |
| Pages | sujet, sous-forum, index RP, réception du kramail, plateau, 375 et 1280 px | rendu propre à la page conservé ; textes ≥ 4,5:1 | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes valeurs | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` au `6685df5` (lignes approximatives, à relocaliser par sélecteur) :
  - sombre : `.panel, .panel-default` l.2582, `.panel-heading` l.2588 (tous les types), `.panel-footer` l.2599, `.btn-default` l.2723 (repos), l.2729 (survol), l.2734 (focus, appui) et l.12569 (survol, couleur accent, gagnante), `th` l.2765, `.nav-tabs` l.2833-2846, `hr` l.3223, DataTables `thead` l.3668-3681 et `tfoot` l.3717 (`!important`) ;
  - `--kr-text-secondary` de `:root` ; ~110 emplois, surtout sur blanc ; `bg-page` : `.dataTables_info`, `.kraland-css-version`, fil d'Ariane ;
  - « ? Aide » : `.kr-order-form .kr-order-help-toggle` l.1911 (texte `--kr-text-primary`), classes `btn btn-default kr-order-help-toggle` posées par le template (L9014).
- Règles de page qui gardent la main (`!important` ou plus spécifiques) : panneaux mobiles l.7639/7646, forum l.8342-8357, kramail l.9001-9016, `.panel-group` l.6625, modale mobile l.6967/7065, en-têtes du sous-forum l.13829/13848 et de la racine l.14608, `h1.page-header .btn-default` du kramail l.9902/9908, barre d'outils l.2555, boutons des messages l.14990/15066, bouton → du sous-forum l.14421, mini-profil l.4761, onglets de la modale l.995-1047, l.1554-1572, l.1763 et l.6732-7045, barre d'onglets mobile l.5181-5252.
- Règle qui perd contre une règle générique et doit être revue : `.bootbox-confirm table th` l.1183 et l.1707 (mobile).
- Tests :
  - `tests/e2e/modale-ordre.mjs` l.1107-1109 : « ? Aide » a le fond d'« Annuler » (`.btn-default`, à garder) et le texte `--kr-text-primary` (passe à `--kr-text-nation`) ;
  - `tests/e2e/palette-nation.mjs` : jetons `header-tint`, `border-tint`, `text-nation` déjà comparés à DESIGN.md ; balayage du sombre ; `COMPOSANTS` et états forcés par CDP ;
  - `forum-index.mjs` l.269-274 : parité index / sous-forum des en-têtes de panneau et de `thead th`.
- Comparaisons figées `forum-index#hors-perimetre`, `kramail-redaction#regression`, `cybermonde-carte#panneaux` : écarts attendus sur ces composants en clair, à neutraliser sur ces seuls éléments, consignés.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/palette-nation.mjs` et sa fixture (ou une fixture dédiée) -- contrôles rouges d'abord, une vérification par ligne de la matrice
- [x] `kraland-theme.css` -- règles communes des composants, règles sombres du domaine réécrites ou retirées, `--kr-text-secondary` clair
- [x] `tests/e2e/modale-ordre.mjs` -- « ? Aide » attend `--kr-text-nation`
- [x] suites à comparaison figée touchées -- écarts consignés, tout autre écart reste rouge
- [x] `tests/e2e/lib/router.mjs` -- fragments nouveaux, aucune 4e citation d'un repère
- [x] `npm run build`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne machine calme, then RÉSULTAT : VERT.
- Given une copie mutée du bundle (en-tête remis en `#f5f5f5`, texte du bouton standard en `#333`, `text-secondary` remis à `#6b7280`), when la suite tourne, then elle est rouge.

## Implementation Notes

- CSS (`kraland-theme.css`) : les règles sombres du domaine sont réécrites en place en règles communes, à la même spécificité et au même rang dans la cascade (le sombre garde donc la main exactement là où il l'avait) :
  - en-tête et pied de `.panel-default` : `html:where(.kr-theme-enabled) .panel-default > .panel-heading / > .panel-footer` (0,2,1, celle de l'ancienne règle sombre) en `header-tint`, `border-tint`, `text-primary`. Les règles sombres `.panel-heading` et `.panel-footer` restent pour les autres types de panneau (panneaux d'état : ticket 3.5, hors périmètre) ; en sombre elles donnent les mêmes valeurs au panneau standard ;
  - en-têtes de tableau `.table > thead|tbody|tfoot > tr > th` et DataTables `thead` (repos, tri, tri survolé) et `tfoot` (`!important` gardé) : préfixe `html.kr-theme-enabled`, jetons `header-tint` / `border-tint` ;
  - onglets `.nav-tabs` : bordures `border-tint`, survol `bg-hover`, actif `bg-surface`, texte `text-primary` (la barre d'onglets mobile et les onglets des modales, plus spécifiques ou en `!important`, gardent la main) ;
  - `hr` masqué dans les deux modes (`html.kr-theme-enabled hr`) ;
  - bouton standard : règle commune après les boutons primaires, même schéma de spécificité (`.btn-default.btn-default`, repos et focus (0,3,1)/(0,4,1), survol/appui/`.active`/menu ouvert en `header-tint`, désactivés placés après) ; texte `text-nation`, bordure `border-tint`. Règles sombres `.btn-default` (repos, survol, focus/appui) retirées, et `html[class*="-dark"] .btn-default:hover` retiré de la règle PLT-11 (les sélecteurs `.list-group-item.btn` y restent). « ? Aide » : `color: var(--kr-text-primary)` retiré de `.kr-order-form .kr-order-help-toggle` (il perdait déjà contre la règle commune) ;
  - `--kr-text-secondary` : `#636a77` en clair (`:root`).
- Décision prise en autonomie (à confirmer par Arnaud, consignée dans `revue-manuelle.md`) : en Confédération Libre clair, `text-nation` (= primaire `#6b7280`) ne fait que 4,38:1 sur `header-tint` (bouton standard survolé ou pressé), sous le seuil de la matrice. Comme Paladium (Q2), la variante prend son accent : `--kr-text-nation: var(--kr-highlight)` (`#475369`, 7,75:1 sur blanc, 7,04:1 sur `header-tint`). DESIGN.md mis à jour (rôle `text-nation`, tableau « Couleur de nation et texte coloré », contraste de référence, composant Bouton standard), ainsi que sa copie dans `palette-nation.mjs`.
- « Annuler » de la modale d'ordre mobile (`.bootbox-confirm .kr-btn-secondary-subtle`, règle propre à la modale) : fond `bg-elevated` → `bg-surface`, pour garder « ? Aide » au fond d'« Annuler » (assertion de `modale-ordre.mjs` à garder). C'est le « fond du bouton standard » de l'exception sombre (DESIGN : « Annuler » est un bouton standard) ; en clair, `bg-elevated` et `bg-surface` sont blancs, rien ne change. Son texte (`text-secondary`) et sa bordure restent ceux de la règle de la modale.
- Écarts du sombre au-delà de la lettre de « Always » (la matrice prime) : le bouton standard survolé passe de `bg-active` à `header-tint` (`bg-elevated`), focus et appui de `bg-hover` à `bg-surface` / `header-tint`, bordure des états de `border-strong` à `border-tint` (`border-default`). Tout le reste du sombre est inchangé : vérifié par la comparaison des pages de référence au bundle `6685df5` (aucun autre écart en sombre).
- `.bootbox-confirm table th` (l.1183, revue) : laissée telle quelle. Elle perdait déjà en sombre contre la règle des en-têtes de tableau ; elle perd désormais aussi en clair pour les tableaux `.table` (en-tête teinté comme partout) et garde la main pour les tableaux sans `.table`. La règle l.1707 (mobile) ne porte aucune couleur.
- Tests :
  - `palette-nation.mjs` : fixture synthétique `palette-nation-composants.html` ; fragments `composants-mobile`, `composants-bureau` (16 variantes : fond, bordure, texte et contraste des en-têtes, pieds, en-têtes de tableau, onglets, bouton standard dans tous ses états, `hr` masqué, aucun gris de Bootstrap en clair, `text-secondary` `#636a77` ≥ 4,5:1 sur blanc, `bg-page`, `header-tint`, `info-bg`), `composants-largeurs` (767, 768, 769, 1440, 1920 px contre 375 / 1280), `composants-pages-mobile`, `composants-pages-bureau` (sujet, sous-forum, index RP, réception du kramail, plateau : chaque composant comparé au bundle `6685df5` ; en clair seul un gris ou un blanc de Bootstrap peut devenir un jeton du ticket, le bouton standard peut prendre `text-nation` / `bg-surface` ; texte des composants ≥ 4,5:1). Sur mobile, l'en-tête de panneau garde la carte mobile (`bg-surface`, sans bordure).
  - Sélecteur des composants partagé dans `lib/variantes.mjs` (`COMPOSANTS_TICKET4`) et jeton `TEXTE_SECONDAIRE_CLAIR` (posé sur les bundles « avant ») : hors des suites, pour ne pas citer une 4e fois `panel-default` ni `panel-heading` (routeur). Aucune 4e citation (comparaison des citations HEAD / arbre de travail).
  - `modale-ordre.mjs` : « ? Aide » attend `--kr-text-nation` (fond d'« Annuler » gardé).
- Écarts consignés des comparaisons figées :
  - `forum-index.mjs#hors-perimetre` : `TEXTE_SECONDAIRE_CLAIR` posé sur le bundle « avant » ; dans l'empreinte, texte, fond et bordure basse des composants valent « composant » ; leur contenu dont le texte est celui du composant dans l'un des deux bundles a son texte (et sa bordure basse quand elle suit le texte) neutralisé des deux côtés. Correction au passage : `lire()` de l'empreinte ramène `color(srgb …)` à 0..255 (les fonds `color-mix()` du ticket passaient pour des couleurs de nation). Contre-épreuve : taille du fil d'Ariane mobile 14 → 15 px → rouge (2 FAIL).
  - `kramail-redaction.mjs#regression` : `TEXTE_SECONDAIRE_CLAIR` posé sur un bundle « avant » qui déclare encore `#6b7280` ; composants marqués (`data-kr-composant`) et masqués sur les deux captures. Contre-épreuve : titre du panneau du kramail 16 → 18 px → rouge (6 FAIL).
  - `cybermonde-carte.mjs#panneaux` : aucun écart (vert sans retouche).
- Rouge avant : nouveaux fragments contre le bundle `6685df5` → 97 FAIL (toutes les lignes de la matrice) ; `modale-ordre` → 32 FAIL. Mutations du bundle (critère d'acceptation) : pied de panneau en `#f5f5f5` → 32 FAIL ; texte du bouton standard (repos et focus) en `#333` → 63 FAIL ; `text-secondary` remis à `#6b7280` → 17 FAIL.
- Vérification (base `6685df5`, non commité) : `palette-nation` 732 ok ; `modale-ordre` 297 ok ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur, 1 avertissement préexistant (`report-non-lu.mjs`) ; `test:unit` vert ; `test:all` 5415 ok, 0 FAIL, RÉSULTAT : VERT (charge 2,5 au départ).
- Après revue :
  - boutons de groupe du tableau de bord du plateau (`.dashboard-group-buttons`, liens natifs clonés par le template) exclus de la règle commune du bouton standard par `:where(:not(.dashboard-group-buttons *))`, sans spécificité ajoutée ; `html[class*="-dark"] .btn-default:hover` remis dans PLT-11, où il ne sert plus qu'à eux (survol sombre du mobile inchangé). Échantillon `#bs-tableau` dans la fixture : repos et survol forcé égaux au bundle `6685df5`, 16 variantes, 375 et 1280 px ; contre-épreuve (exclusion retirée) → 32 FAIL ;
  - comparaison des pages (`ecartsPage4`) : seules les valeurs natives de Bootstrap peuvent devenir un jeton du ticket (ses gris ; son blanc en fond du bouton standard et de l'onglet actif ; l'absence de fond d'un `th`) ; tout autre fond transparent ou blanc reste exigé inchangé. Limite : une règle de page qui poserait un fond transparent sur un `th`, battue par la règle commune, ne se distingue pas du natif ;
  - `kramail-redaction#regression` : texte atténué posé et composants masqués seulement si le bundle « avant » précède le ticket (il déclare encore `--kr-text-secondary:#6b7280`) ;
  - mutation « en-tête remis en `#f5f5f5` » (en-tête retiré de la règle commune, retour au rendu Bootstrap) → 32 FAIL ;
  - DESIGN.md : `text-secondary` `#636a77` (front matter, « Fonds et textes », contraste de référence : 5,44 / 4,99 / 4,70 à 5,17 / 4,86 à 5,21:1 sur blanc / `bg-page` / `header-tint` / `info-bg`) ;
  - `hr` masqué : le séparateur des filtres d'Événements (`body.page-evenements #col-left form hr`) l'est aussi, voulu ; consigné dans `revue-manuelle.md`.

## Plan Change Log

## Review Triage Log

Passe quick du 2026-10-23 (boucle 0) : 1 medium et 5 low (patch), 1 medium (intent_gap tranché en autonomie).
- medium, patch — la règle commune du bouton standard (0,3,1) battait les boutons de groupe du tableau de bord du plateau. Exclusion `:where(:not(.dashboard-group-buttons *))`, échantillon et contrôle d'égalité avec 6685df5 (contre-épreuve : 32 FAIL).
- low, patch (document) — `hr` masqué aussi sur le formulaire de filtres d'Événements : ajouté à `revue-manuelle.md`.
- low, patch — la mutation « en-tête en #f5f5f5 » du critère n'avait pas été faite : elle donne 32 FAIL.
- low, patch — `ecartsPage4` acceptait toute valeur avant blanche ou transparente : seules les valeurs natives de Bootstrap sont acceptées (exception commentée : fond transparent d'un `th`).
- low, patch — masquage des composants du kramail appliqué même après fusion : il est conditionné à un bundle « avant » antérieur au ticket.
- low, patch (document) — DESIGN.md donnait encore `text-secondary` à `#6b7280` : passé à `#636a77`, avec les nouveaux contrastes.
- medium, intent_gap — en sombre, les états du bouton standard changent un peu plus que ne le dit « Always » (survol, focus, bordures), pour suivre la matrice. Tranché en autonomie, consigné dans `revue-manuelle.md`.

Note de processus : pendant l'implémentation, l'agent a fait un `git stash` puis un `git stash pop` sans accord ; l'arbre est revenu à l'identique (pile de stash vide). Signalé à Arnaud.

Vérification après patch : build validé ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant) ; `test:unit` vert ; skills identiques ; `test:all` 5447 ok, 0 FAIL, RÉSULTAT : VERT, machine calme.

## Design Notes

- `header-tint` et `border-tint` valent `bg-elevated` et `border-default` en sombre : une règle commune garde le sombre tel quel.
- Effets visibles en clair : en-têtes, pieds et en-têtes de tableau teintés de la nation ; bouton standard au texte de la nation et à la bordure teintée ; `hr` masqués.

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant, vert après
- `node tests/e2e/modale-ordre.mjs` -- expected: vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: conformes
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme
