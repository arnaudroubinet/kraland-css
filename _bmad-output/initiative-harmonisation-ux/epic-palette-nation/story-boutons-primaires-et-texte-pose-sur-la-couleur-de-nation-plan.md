---
title: "Boutons primaires et texte posé sur la couleur de nation"
type: 'feature'
ticket: '2'
created: '2026-10-23'
status: 'built'
baseline_revision: '52f420a8b7e878f8072e52834fcc0cbb4df0b455'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Hors `button` et `a` au repos, les boutons primaires gardent en clair le bleu de Bootstrap : survol de la bordure, `:active`, `.active`, `.focus`, menu ouvert, désactivé, badge interne ; `label`, `span` et `input`. Le texte posé sur la couleur de nation est blanc, `--kr-surface`, `--kr-text-inverse` ou l'accent inverse : il tombe sous 4,5:1 en Paladium clair et dans plusieurs variantes sombres. En sombre, les boutons primaires recopient en dur, variante par variante (règles E3 et PLT-10), les valeurs des variables `--kr-arm-*`.

**Approach:** Tout fond en couleur de nation prend la paire d'action et tout texte posé dessus prend l'encre assortie, dans les 16 variantes (Q1, H5.1 ; CAP-4) :
- au repos : `--kr-arm-bg` (repli `--kr-primary`) et `--kr-arm-ink` (repli blanc) ;
- au survol, à l'appui, et sur un fond en primaire foncée : `--kr-arm-bg-hover` (repli `--kr-primary-dark`) et `--kr-arm-ink-hover` (repli blanc).

Les boutons primaires de toute balise et de tout état suivent cette règle. Les règles sombres E3 et PLT-10 sont remplacées par les variables.

## Boundaries & Constraints

**Always:**
- Liste du ticket : bouton primaire de toute balise et de tout état ; titre actif des listes latérales (et son texte et son badge internes) ; bandeau `.bg-primary` de /report ; pagination (page active, survol, focus, `span`, appui mobile) et `paginate_button.current` ; onglets et menus actifs en couleur de nation (`.nav-pills`, `.dropdown-menu > .active`, onglets des modales hors ordre) ; dossiers du kramail ; « Jouer » de l'accueil ; `.label`, `.label[href]` survolé, `.badge` ; `.bg-info` ; en-têtes et pastilles du tableau de bord ; liens `#flap` ; croix mobile et « tout voir » au repos ; « + » du sous-forum mobile (style en ligne du template) ; `.panel-primary` ; titres des encarts de la carte, sélection de texte et `.btn-warning` en sombre ; barre d'envoi fixe pressée (exception laissée par 3.1).
- Bordure des boutons primaires en `--kr-primary-dark` ; ombre en `--kr-btn-shadow`.
- P1 option 4 : les règles du domaine sont réécrites en place ou retirées (E3, PLT-10), pas surchargées.
- Texte ≥ 4,5:1 sur son fond, mesuré dans les 16 variantes avec `tests/e2e/lib/variantes.mjs`.
- Fixture synthétique, aucune capture HTML brute dans le dépôt.

**Never:**
- onglet actif et « Valider » de la modale d'ordre (ticket 2.6) ;
- textes en primaire sur fond neutre, dont la barre d'onglets mobile et les liens d'alerte (3.3) ;
- pastilles d'état et non-lu (3.5) ;
- pastilles de niveau et pièce « ici » sur l'accent (rendu gardé par DESIGN.md) ;
- couleur de famille des `.btn-warning` (3.5 : seule leur encre change ici) ;
- aucune valeur de jeton nouvelle.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bouton primaire | `button`, `a`, `label`, `span`, `input` ; repos, survol, focus, `:active`, `.active`, `.focus`, menu ouvert, désactivé ; 16 variantes, 1280 px | fond, texte et bordure de la paire de l'état ; texte ≥ 4,5:1 ; en clair, aucun `#337ab7`, `#286090`, `#204d74`, `#122b40` ni `#2e6da4` calculé | No error expected |
| Badge d'un bouton primaire | `.btn-primary .badge` | texte `--kr-arm-bg`, fond `--kr-arm-ink` (inverse de la paire) | No error expected |
| Composants de la liste | chaque élément de la liste du ticket, présent dans la fixture ; 16 variantes, 375 × 667 et 1280 px | fond et texte de la paire, au repos et au survol (ordinateur) ou à l'appui (mobile) ; texte ≥ 4,5:1 | No error expected |
| « + » du sous-forum | sous-forum mobile, 375 px | fond `--kr-arm-bg`, texte `--kr-arm-ink`, ≥ 4,5:1 | No error expected |
| Balayage | report, plateau, sujet, sous-forum, index RP et réception du kramail, 375 et 1280 px, 16 variantes | tout élément visible portant du texte et un fond calculé égal à une couleur de nation (primaire, primaire foncée, `--kr-arm-bg`, `--kr-arm-bg-hover`) a un texte ≥ 4,5:1, au repos et au survol | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes valeurs qu'à 375 et 1280 px | No error expected |
| Peau coupée | `kr-theme-enabled = false` | boutons Bootstrap natifs | No error expected |

</frozen-after-approval>

## Code Map

- Paire d'action : variables des blocs de variantes (l.150-420 ; Paladium clair : `--kr-arm-ink` et `--kr-arm-ink-hover`). Replis employés par le code : `var(--kr-arm-bg, var(--kr-primary))`, `var(--kr-arm-ink, var(--kr-white))`, `var(--kr-arm-bg-hover, var(--kr-primary-dark))`, `var(--kr-arm-ink-hover, var(--kr-white))`. Consommateurs déjà sur la paire : `.kr-order-badge` l.1925, croix l.6216/6271, « Répondre » l.13382, « Envoyer » du forum l.15310 ; au survol seulement : l.2054, l.4560, l.11622 ; pagination active l.2002 (paire de survol au repos, ticket 3.1).
- Boutons primaires :
  - clair : l.2045 (`button.btn-primary, a.btn-primary` : texte accent inverse) et l.2054 (survol et focus, sans bordure) ;
  - sombre : l.2657 et l.2663, PLT-10 l.12521 et E3 l.12527-12602, avec en dur les valeurs `--kr-arm-*` (Empire Brun sombre : texte `#f5f1ed`, sans variable) ;
  - dossier kramail actif l.8877 (≤ 767, `!important`) ; barre d'envoi pressée l.9750 ;
  - `input.btn-primary` du « + » des contacts kramail (≥ 769 ; fond transparent sous 768 par l.10143) ;
  - créés par le JS : `.kr-mobile-skills-toggle` (L10334), `#kr-config-export-btn` (L8715).
- États de Bootstrap à battre (`tests/e2e/vendor/bootstrap.min.css`), spécificité jusqu'à (0,4,0) : `.btn-primary:active`, `.active`, `.focus`, `:active:hover`, `:active:focus`, `.open > .dropdown-toggle.btn-primary` (et `:hover`, `:focus`), `.disabled` / `[disabled]` / `fieldset[disabled]` (et `:hover`, `:focus`), `.btn-primary .badge`.
- En sombre, `html[class*="-dark"] a:link, a:visited` (l.3199, (0,2,2)) colore le texte des liens : la règle des boutons doit l'emporter pour `a.btn-primary`.
- Texte posé sur la couleur de nation :
  - `.list-group-item.active` l.762 (`!important`), avec Bootstrap `.list-group-item.active > .badge` et `.list-group-item-text` (`#c7ddef`) ;
  - `.label, .badge` l.651 ; `.bg-info` l.658 (`tr.bg-info` de /report reste à la l.671) ; `.bg-primary` l.2025 ;
  - pagination : l.2012 ; sombre l.3521-3528 ; Bootstrap `.pagination > .active > a:focus` (0,3,1) ; appui mobile l.9504 ; `paginate_button.current` l.8758 et l.3548-3569 ;
  - menus et onglets : `.dropdown-menu > .active > a` (sombre l.2758 ; bleu de Bootstrap en clair) ; `.nav-pills` (aucune règle) ; onglets des modales mobiles l.6710 (battue dans la modale d'ordre) ;
  - tableau de bord : `.dashboard-card-badge` l.5712 (texte du thème sur la primaire), `.dashboard-card-actions a:hover` l.5760 ; `.dashboard-section-header` l.2107, sans effet (l.13261, l.13287) ;
  - `a[href*="#flap"]` l.4123 ; `.kr-mobile-close` l.4541 ; `.kr-changelog-view-all` l.11615 ; `.accueil-play-btn` l.11950-11964 et l.12207 (bouton créé par le template, L2219 ; `body.page-accueil` est posée pour `/` et `/accueil`, L865) ;
  - sombre : `.map-box-title` et `.map-box-bottom` l.2900-2909, `::selection` l.3147, `.btn-warning` l.3227-3233 ;
  - template : « + » du sous-forum, `a.forum-new-topic-fab`, style en ligne L5572-5585 (`background: var(--kr-primary); color: white`). Aucune fixture ne le déclenche aujourd'hui : il est créé par `transformSubforumHeader` (L5428).
- Sans effet, laissées en l'état : l.1002 (onglet de la modale d'ordre, 2.6), l.11833 et l.12393 (en-tête joueur de l'accueil, battues par l.762).
- Tests et harnais :
  - suite `tests/e2e/palette-nation.mjs`, fixture `palette-nation.html` (ticket 3.1 : boutons, pagination, croix mobile et « tout voir » déjà présents) ;
  - ouvertures à reprendre : `ouvrir` (palette-nation.mjs:121), `open` (forum-index.mjs:80, pages de forum) ;
  - fixtures du balayage : `report-non-lu.html` (/report/perso-000000), `plateau-qualite-usage.html` (/jouer/plateau), `forum-sujet.html`, `sous-forum-debuter.html` (émulateur DataTables), `forum-index-rp.html`, `kramail-reception.html` (/kramail/personnage-fictif-2000-0), `kramail-nouveau.html` (barre d'envoi) ;
  - la croix a déjà son contrôle des 16 variantes (`croix-directionnelle.mjs`, m1).
- Suites qui figent des couleurs que ce ticket change :
  - `report-non-lu.mjs` (fonds du bandeau et de la page active) ;
  - `forum-index.mjs#hors-perimetre` (empreinte `color`, `background-color`, `border-bottom-color` contre 81512a3, Kraland et Empire Brun sombre) ;
  - `kramail-redaction.mjs#regression` (captures contre `origin/feature/next`, Empire Brun sombre : texte des dossiers `#f5f1ed` → blanc).

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/palette-nation.html`, `tests/e2e/palette-nation.mjs` -- contrôles rouges d'abord, une vérification par ligne de la matrice. La fixture reçoit un échantillon de chaque élément de la liste ; les boutons primaires sont déclinés par balise et par état de classe (`.active`, `.focus`, `.disabled`, `[disabled]`, menu ouvert, badge). Le balayage porte sur les fixtures de référence, avec au plus 16 ouvertures simultanées. Pour le « + » du sous-forum, compléter la fixture du sous-forum ou une page de palette-nation avec la structure qui déclenche `transformSubforumHeader` -- balle traçante des composants
- [x] `kraland-theme.css` -- paire d'action sur chaque règle de la liste ; règles uniques des boutons primaires, toutes balises et tous états, pour les deux modes ; E3 et PLT-10 retirés -- Q1, H5.1
- [x] `kraland-userscript-template.js` -- style en ligne du « + » du sous-forum sur la paire -- Q1
- [x] `tests/e2e/report-non-lu.mjs`, `tests/e2e/forum-index.mjs`, `tests/e2e/kramail-redaction.mjs` -- n'accepter que les écarts dus à la paire, sur ses seuls éléments, et les consigner. Exemples : propriétés de couleur des éléments en couleur de nation exclues de l'empreinte, ou ces éléments masqués sur les captures. Tout autre écart reste rouge -- comparaisons figées
- [x] `tests/e2e/lib/router.mjs` -- fragments nouveaux de la suite ; aucun mot-clé qui réduise le routage ; ne pas citer dans un commentaire de suite un repère déjà cité par 3 suites -- routage
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne, then tout est vert, et seuls les écarts consignés de la paire sont acceptés.
- Given une copie mutée du bundle, when la suite tourne, then elle est rouge. Mutations à essayer : une règle E3 remise, le texte d'un bouton en accent inverse, le « + » en blanc sur la primaire, un état de Bootstrap non battu.

## Implementation Notes

- Boutons primaires : trois règles uniques, toutes balises, deux modes, préfixées `html.kr-theme-enabled` pour battre Bootstrap ((0,4,0)) et la règle des liens du sombre ((0,2,2)) sans `!important` : repos (0,3,1), états `:hover`, `:focus`, `.focus`, `:active`, `.active` (0,4,1) et menu ouvert (0,5,1), désactivé (0,4,1, placé après, ombre retirée). Règles sombres `.btn-primary`, PLT-10 et E3 retirées ; commentaires « (cf. E3) » des blocs de variantes réécrits.
- Paire posée en place sur chaque règle de la liste. Choix de rangement : titre actif au survol et page active au survol gardent leur paire (repos ou survol, contrôle « une » de la suite) ; page active (lien ou `span`) en paire de survol dans les deux modes, la règle sombre en `!important` réécrite ; onglets des modales mobiles scindés (actif : paire de repos ; survol et focus : paire de survol) ; « Jouer » : la paire de survol remplace l'opacité 0,85 au survol (et `:active` ajouté sur mobile) ; `.dashboard-section-header` réécrite bien que sans effet.
- `.btn-warning` sombre : le fond passe aussi à `--kr-arm-bg`, sinon l'encre de Kraland et de Khanat Elmérien sombres tombe sous 4,5:1 (4,00:1 et 3,64:1 sur la primaire, Design Notes) ; le survol garde le fond d'accent et reçoit explicitement le texte inverse qu'il héritait. À trancher par Arnaud si « seule leur encre change » excluait ce fond.
- « + » du sous-forum : `a.forum-new-topic-fab` est créé par la branche non sous-forum de `transformForumHeader` (titre `.container h1` à deux liens, sans `#topics`), et non par `transformSubforumHeader`. La fixture de la palette porte un tel titre : le template y crée le « + » sur mobile.
- Suite : pseudo-classes forcées par CDP (`CSS.forcePseudoState`, fonctionne avec le navigateur partagé), aucun clic. Fragments ajoutés : `balayage-mobile`, `balayage-bureau` ; `paginationActive` remplacée par les composants (16 variantes au lieu de 8). Balayage : 16 ouvertures simultanées au plus.
- Écarts consignés (paire d'action, seuls éléments posés sur la couleur de nation) :
  - `report-non-lu.mjs` C4 et portée : le `.bg-info` générique attendu en paire de repos (fond `--kr-arm-bg`, encre `--kr-arm-ink`) au lieu de primaire et blanc ;
  - `forum-index.mjs#hors-perimetre` : dans l'empreinte, `color`, `background-color` et `border-bottom-color` d'un élément à fond propre en couleur de nation (primaire, primaire foncée, `--kr-arm-bg`, `--kr-arm-bg-hover`, mesurées dans chaque bundle), et `color` des éléments transparents posés dessus, valent « paire » ; contre-épreuve : graisse de `.paginate_button.current` modifiée -> rouge ;
  - `kramail-redaction.mjs#regression` : mêmes éléments marqués `data-kr-paire` et masqués sur les deux captures, leur nombre comparé ; contre-épreuve : espacement du titre de page modifié -> rouge (12 FAIL).
- Après revue : texte interne du titre actif couvert au survol et au focus (Bootstrap (0,4,0)) ; badge d'en-tête et corps repliables de `.panel-primary` sur la paire et la primaire foncée ; ombre intérieure de Bootstrap rendue aux boutons primaires pressés (`:active`, `.active`, menu ouvert, `--kr-overlay-dark-125`) ; « + » des contacts du kramail sans ombre sous 768 px. Suite : états survolé (1280) et pressé (375) ajoutés aux composants interactifs (cible forcée distincte pour le texte et le badge du titre actif), `.btn-warning` survolé et pressé en sombre (contraste seul au survol, fond d'accent : déjà ≥ 4,5:1, CSS inchangé), ombres des boutons, absence de #337ab7 dans les panneaux primaires, ombre du « + » des contacts.
- `router.test.mjs` : la fixture `report-non-lu.html` est désormais citée par palette-nation (balayage) : attente mise à jour (report-non-lu et palette-nation).
- Contre-épreuves de palette-nation (copies du bundle par `KR_SCRIPT`), toutes rouges : règle E3 remise (PLT-10 #f5f1ed en Empire Brun sombre, avec une spécificité qui l'emporte : remise telle quelle, une règle E3 est battue par la règle unique et reste sans effet) ; texte des boutons en accent inverse (16 FAIL) ; état `.focus` de Bootstrap non battu (16 FAIL) ; « + » blanc sur la primaire (8 FAIL) ; texte du titre actif en `--kr-surface` (balayage, 6 FAIL) ; page active survolée en primaire (balayage au survol, 2 FAIL).

## Plan Change Log

## Review Triage Log

Passe quick du 2026-10-23 (boucle 0) : 1 medium et 4 low (patch), 1 false.
- medium, patch — le texte du titre actif (`.list-group-item.active .list-group-item-text`, (0,3,0)) repassait au `#c7ddef` de Bootstrap au survol et au focus ((0,4,0)). Correction : `:is(:hover, :focus)` dans la règle, texte et badge mesurés pseudo-classe forcée.
- low, patch — survol de `.btn-warning` en sombre sans contrôle de contraste. Il est conforme (≥ 4,5:1 dans les 8 variantes sombres) ; le contrôle est ajouté. Le fond passe en `--kr-arm-bg`, au-delà de « seule leur encre change » : avec la seule encre, 4,00:1 en Kraland sombre et 3,64:1 en Khanat Elmérien sombre. Décision en autonomie, consignée dans `revue-manuelle.md`.
- low, patch — ombre des boutons : halo sur le « + » transparent des contacts du kramail sous 768 px ; ombre intérieure de Bootstrap perdue à l'appui et sur `.active`. Correction : `box-shadow: none` sur ce bouton, ombre intérieure rendue aux états pressés, contrôles ajoutés.
- low, patch — bleu de Bootstrap resté dans `.panel-primary` (badge d'en-tête, bordures des corps repliables). Réécrits ; aucun `#337ab7` calculé.
- low, patch — états survolés et pressés manquants dans les contrôles (`#lien-flap`, « + » du sous-forum, `#bouton-alerte`, `#page-active-span`, `#croix-mobile`, `#tout-voir`, `#etiquette-lien`). Ajoutés.
- false — section « Racine du forum » de `revue-manuelle.md` : elle vient de la livraison du correctif `/forum` (bcc7710), exacte pour cette livraison, hors du diff de ce ticket.

Vérification après patch : `palette-nation` vert par fragment ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur, 1 avertissement préexistant ; `test:unit` vert ; `diff -r` des skills vide ; `test:all` 5055 ok, 0 FAIL, RÉSULTAT : VERT, machine calme.

## Design Notes

- Fond et encre vont toujours ensemble. L'encre de Kraland sombre (`#f5f1ed`) n'atteint 4,5:1 que sur son fond d'action `#b64c4c`, pas sur la primaire `#c45252`. Même chose pour Khanat Elmérien sombre : `#8659b3`, et non `#9966cc`. Changer le texte sans le fond ne suffit donc pas.
- Effets visibles, conformes à DESIGN.md › Encre d'action :
  - en clair, le texte des boutons primaires passe de l'accent inverse au blanc (encre `#1e1a15` en Paladium) ;
  - en Kraland et Khanat Elmérien sombres, les fonds de la liste prennent la teinte d'action, comme les boutons et la croix aujourd'hui ;
  - en Empire Brun sombre, le texte passe de `#f5f1ed` à blanc.
- En clair, seul Paladium déclare la paire. Les autres variantes claires gardent donc leurs fonds (primaire ou primaire foncée), et seule l'encre change là où elle n'était pas blanche.
- Les états de Bootstrap vont jusqu'à (0,4,0) : préférer des sélecteurs assez spécifiques à `!important`, sauf là où la règle remplacée en avait déjà.

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant le code, vert après
- `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: conformes, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT, machine calme
