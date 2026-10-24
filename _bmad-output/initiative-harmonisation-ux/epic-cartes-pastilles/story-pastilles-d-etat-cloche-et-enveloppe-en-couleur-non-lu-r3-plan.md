---
title: 'Pastilles d''état : cloche et enveloppe en couleur « non lu » (R3)'
type: 'feature'
ticket: '4'
created: '2026-10-24'
status: 'built'
baseline_revision: '601ab196e8cf2ff47ab188a7858f5eaec1778bf9'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-groupes-du-plateau-mobile-dans-la-carte-de-section-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Dans la barre de navigation, la pastille « ! » de la cloche (`.badge.badge-danger`) et la pastille de l'enveloppe du kramail (`a[href*="kramail"] .badge`, `#badge`) sont peintes en rouge danger (`--kr-badge-danger`, `#dc3545`), texte blanc, dans les 16 variantes. Une seule règle globale les force (l.796-804, « notification alert always red on all themes »). Ce rouge est celui des blocages ; une notification n'est pas un blocage. DESIGN.md › Pastille d'état (`badge-state`, l.506 et l.516) demande pour la cloche et l'enveloppe la pastille d'état : fond `--kr-status-unread`, texte `--kr-bg-surface`, 12 px 700, rayon plein. C'est le fond de « NOUVEAU MESSAGE » du sous-forum (`.kr-topic-badge`).

**Approach:** Réécrire en place la règle d'origine l.796-804. Ses sélecteurs ne changent pas. Fond : `var(--kr-status-unread)`. Texte : `var(--kr-bg-surface)`. La déclaration `border-color`, inerte, est retirée. Les deux `!important` existants restent sur leurs nouvelles valeurs ; aucun n'est ajouté. L'animation `kr-bell-swing`, la géométrie de la barre et le JS des clones mobiles ne changent pas. Un fragment `pastilles` de `cartes-pastilles.mjs` contrôle la pastille d'état sur les deux supports, clones compris. Le contrôle couleurs de `typographie-formes` (éléments `cloche` et `badge`) reçoit le masque `CARTES_TICKET54`, avec sa condition de retrait.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi : §1 rendu de base, §2 règles, §3 JS, §4 emplois de `.badge-danger`, §5 suites, §8 routeur. Tout écart va au Plan Change Log, avec sa raison.
- P1, option 4 : réécrire la déclaration d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau dans `kraland-theme.css`. Les deux `!important` existants (fond, texte) gardent leur place. Retirer `border-color` peut révéler un défaut natif : mesurer les 4 bordures (largeur 0) avant et après.
- Médias selon AGENTS.md : la règle sert les deux supports à l'identique. Elle passe dans la liste combinée `@media (max-width: 767px), (min-width: 768px)`, comme `.kr-topic-badge` (A4). Aucune règle mobile ou bureau globale. Garde de page éventuelle en `:where(html.x)`. La spécificité des sélecteurs ne change pas (Design Notes).
- Valeurs de DESIGN.md › Pastille d'état, sans en inventer : fond `--kr-status-unread`, texte `--kr-bg-surface`, taille `--kr-font-label`, graisse 700, rayon `--kr-radius-full`. La taille, la graisse et le rayon viennent déjà de `.label, .badge` (l.713) et des règles de barre (l.5631, l.5734) : la mesure de base le confirme avant toute écriture.
- Géométrie de la barre inchangée : position, `min-width`, hauteur, retrait, interligne des pastilles (l.5631, l.5734) et cibles de 44 px des liens (A2).
- Animation `kr-bell-swing` inchangée : elle reste sur `.fa-bell` et `.fa-envelope` quand la pastille est remplie, original et clone.
- Pastille vide toujours invisible (`.badge:empty` de Bootstrap) : original et clone, sur les deux supports.
- Emplois hors liste égaux à la base : `.kd-field.is-invalid` du kramail (l.10559, blocage), badges de bouton, de panneau, de groupe et du mini-profil (annexe §2.5), lignes non lues de `/report` (l.776-794).
- Masque posé sur le bundle de base seulement, empilable avec `CARTES_TICKET51/52/53`. Il porte sa condition de retrait en commentaire. Les sélecteurs de la cloche, de l'enveloppe et de la référence « NOUVEAU MESSAGE » passent dans `lib/variantes.mjs` (MAX_CITING = 3 : `kr-topic-badge` est déjà cité par 3 suites).

**Ask First:**
- Toute pastille d'une autre couleur que `--kr-status-unread`, y compris une couleur propre à l'enveloppe (DESIGN la voyait grise : Source conflict de l'épopée, tranché par l'Assumption « cloche et enveloppe en non lu »).
- Tout changement de géométrie de la pastille : retrait et interligne de `.kr-topic-badge`, taille, position.
- Tout retrait ou changement de l'animation.
- Tout retrait des jetons `--kr-badge-danger` ou `--kr-badge-danger-border` (sweep 5.6, A5).
- Un contrôle d'une autre suite qui casse pour une raison autre que la couleur des deux pastilles.

**Never:**
- Règle `:focus`. Modification du template JS (clones, `moveHeaderButtons`).
- Ouvrir, précharger ou appeler `/report`, y compris par un tap sur la cloche ou par `openReport` (AGENTS.md). Aucun clic sur la cloche dans les tests.
- Toucher la pastille « PNJ » (`--kr-badge-pnj`, entrée 5) ou les badges de panneau.
- Données réelles dans une fixture : aucune capture brute.
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur). Site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cloche remplie, bureau | typographie-formes, 768, 769, 1280, 1440, 1920 | `.fa-bell ~ .badge` de `.navbar-right` : fond = `--kr-status-unread` calculé, texte = `--kr-bg-surface` calculé, 12 px, 700, rayon plein, bordures de largeur 0 | valeurs rgb exactes, pas « différent du rouge » |
| Cloche remplie, mobile | typographie-formes, 375 et 767 | le clone de `.navbar-header-buttons-left` est visible (`elementFromPoint` sur son centre) et porte la même pastille ; l'original reste dans le menu replié | — |
| Enveloppe remplie | typographie-formes, mêmes largeurs | `a[href*="kramail"] .badge` (original et clone, `#badge` dupliqué à 375) : même pastille que la cloche | les deux `#badge` mesurés |
| Référence | sous-forum-debuter, mêmes largeur et variante | fond de la cloche = fond de `.kr-topic-badge` « NOUVEAU MESSAGE » ; texte idem | — |
| Pastilles vides | kramail-reception, Bootstrap réel, 375, 767, 768, 1280 | cloche et enveloppe, original et clone : `display: none` (ou boîte 0 × 0) ; aucune animation sur l'icône | — |
| Animation | typographie-formes remplie, 375 et 1280 | `animation-name` = `kr-bell-swing` sur `.fa-bell` et `.fa-envelope` visibles ; égal à la base | — |
| Hors liste | typographie-formes `#pastille-titre`, `#pastille-groupe` ; kramail-redaction `blocage-*` | égal à la base | — |
| Thèmes | 16 variantes, 375, 1280, 1440, 1920 | fond = status-unread de la variante (Empire Brun clair : `#8a5a00`) ; texte bg-surface ≥ 4,5:1 sur ce fond | Kraland clair : `#c41e3a` attendu, pas `#dc3545` |
| Seuils | 767 / 768 / 769, bascule 767 ↔ 768 dans les deux sens, même onglet | pastille d'état des deux côtés ; pastille visible portée par le clone à 767, par l'original à 768 | rechargement si la bascule ne recrée pas les clones (P5) |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-inventaire.md`.
- `kraland-theme.css` (lignes de `601ab19`, à revérifier) :
  - l.75-76 : jetons `--kr-badge-danger`, `--kr-badge-danger-border`, non touchés ;
  - l.170, l.187 : `--kr-status-unread` ;
  - l.713-720 : `.label, .badge`, non touché ;
  - l.796-804 : règle d'origine, réécrite ;
  - l.806-843 : animation, non touchée ;
  - l.5630-5641 et l.5733-5743 : géométrie mobile des pastilles, non touchée ;
  - l.10559 : `.kd-field.is-invalid`, non touché ;
  - l.13594-13615 : `.kr-topic-badge`, référence, non touchée.
- `kraland-userscript-template.js` (lecture seule) : l.1121-1201 `moveHeaderButtons` (priorité 20, clones).
- Fixtures (lecture seule) : `typographie-formes.html` l.26-27 (remplies), `kramail-reception.html` l.100-101 (vides), `sous-forum-debuter.html` (référence).
- Tests :
  - `tests/e2e/cartes-pastilles.mjs` : `COMMIT_AVANT` l.58, `PAGES` l.87-117, `avecBootstrap` l.118, `ouvrir` l.128, `groupes` l.883, `contraste` l.1096 ;
  - `tests/e2e/lib/variantes.mjs` l.433-466 : repères et masques 5.3, modèle de la 5.4 ; `CONTRASTE` l.503 ;
  - `tests/e2e/typographie-formes.mjs` : éléments l.154-155, `MESURE` l.263, `largeurs` l.311, contrôle couleurs l.324, `nettoyage` l.1865 ;
  - `tests/e2e/lib/router.mjs` (entrée l.91, KEYWORDS l.137-196, FILE_RULES l.120-128) et `router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] Relevé de base sur le bundle de `601ab19` (CDP, Bootstrap réel), avant toute écriture : fond, texte, taille, graisse, rayon, bordures et `animation-name` de la cloche et de l'enveloppe remplies (original et clone) à 375 et 1280 px, en Kraland clair et Empire Brun sombre ; `display` des pastilles vides sur kramail-reception. Consigner au Plan Change Log tout écart à l'annexe §1, dont la taille réelle (12 ou 10 px).
- [x] `tests/e2e/lib/variantes.mjs`, bloc 5.4 après le bloc 5.3 :
  - repères `PASTILLES_TICKET54` : cloche (`.fa-bell ~ .badge`), enveloppe (`a[href*="kramail"] .badge`), conteneurs (`.navbar-right`, `.navbar-header-buttons-left`), référence (`.kr-topic-badge`), nom du jeton (`--kr-status-unread`) ;
  - masque `CARTES_TICKET54` : miroir de la règle réécrite, mêmes sélecteurs, en valeurs littérales si un jeton manque dans une base ancienne (précédent 5.2). Le masque garde `!important`, sans quoi la règle de la base le bat : il vit dans le test, pas dans la peau ;
  - détecteur `AVANT_TICKET54` : chaîne minifiée relevée dans le bundle construit, absente de la base, non touchée par les entrées 5 et 6. Candidat : le début de la règle réécrite suivi de `{background-color:var(--kr-status-unread)!important` (vérifier la forme minifiée).
  Condition de retrait : « quand le bundle de base contient l'entrée 5.4 ».
- [x] `tests/e2e/cartes-pastilles.mjs`, fragment `pastilles` (A3, A6) :
  - base `COMMIT_AVANT_54 = '601ab19'`, surchargeable par `KR_SCRIPT_AVANT` ;
  - pages : `typographie-formes.html` (remplies), `kramail-reception.html` (vides), `sous-forum-debuter.html` (référence), chacune avec Bootstrap réel ;
  - contrôles selon la matrice. Géométrie, animation et vides à 375, 767, 768, 769, 1280, 1440, 1920, en Kraland clair et Empire Brun sombre. Couleurs et contraste dans les 16 variantes à 375, 1280, 1440, 1920 (`CONTRASTE`) ;
  - bascule 767 ↔ 768 dans les deux sens ;
  - hors liste égaux à la base : `#pastille-titre`, `#pastille-groupe` ;
  - `kr-theme-enabled` vérifié avant toute mesure.
  Mettre à jour l'en-tête du fichier (liste des fragments).
- [x] `kraland-theme.css`, l.796-804, réécriture en place :
  - commentaire : « Pastille d'état (DESIGN › badge-state) : cloche et enveloppe en non lu, toutes variantes » ;
  - `background-color: var(--kr-status-unread) !important` ;
  - `color: var(--kr-bg-surface) !important` ;
  - `border-color` retiré ;
  - règle placée dans `@media (max-width: 767px), (min-width: 768px)` (A4), sélecteurs inchangés.
  Mesurer après le retrait de `border-color`.
- [x] `tests/e2e/typographie-formes.mjs` : poser `CARTES_TICKET54` sur la base quand `AVANT_TICKET54(avant)`, empilé après `CARTES_TICKET53`, là où le contrôle couleurs l.324 relève `cloche` et `badge`. Vérifier au 1er passage si `nettoyage` (l.1865) relève aussi les pastilles du plateau ; si oui, y empiler le masque. Commentaire « écart accepté et consigné (épopée 5, entrée 4) » avec la condition de retrait.
- [x] Suites existantes, après le 1er passage des zones : `palette-nation`, `report-non-lu`, `kramail-redaction`, `forum-index`, `sous-forum`, `fin-initialisation`, `jeu-identite`. Attendu vert sans changement (annexe §5.2). Un rouge lié à la couleur des pastilles reçoit le masque ; tout autre rouge relève d'Ask First. Liste au Plan Change Log.
- [x] `tests/e2e/lib/router.mjs` :
  - fragment `pastilles` ajouté à l'entrée `cartes-pastilles` (l.91) ;
  - mot-clé `/badge-danger|kr-bell-swing|fa-bell\b/` vers `cartes-pastilles` et `typographie-formes`, avec un cas dans `router.test.mjs` (ligne de la règle réécrite) ;
  - FILE_RULES : `cartes-pastilles` ajouté pour `typographie-formes.html`, `kramail-reception.html` et `sous-forum-debuter.html` s'il manque (précédent 5.3, l.120-121).
  Skill `tester-kraland-css` mis à jour dans les deux copies si le routage change (`diff -r .hermes/skills .claude/skills` vide).
- [x] `npm run build`, rouge avant, contre-épreuves, lint.

**Acceptance Criteria:**
- Given typographie-formes à 375, 767, 768, 769, 1280, 1440 et 1920 px, when la suite tourne, then la pastille visible de la cloche et celle de l'enveloppe (clone à 375 et 767, original au-delà) ont le fond `--kr-status-unread`, le texte `--kr-bg-surface`, 12 px, 700, un rayon plein et des bordures de largeur 0.
- Given les 16 variantes à 375, 1280, 1440 et 1920 px, when on mesure, then le fond est égal au fond de « NOUVEAU MESSAGE » du sous-forum de la même variante, et le texte atteint 4,5:1 au moins sur ce fond.
- Given kramail-reception avec Bootstrap réel, when on lit les pastilles vides, then elles sont invisibles, original et clone, sur les deux supports, et l'icône n'est pas animée.
- Given une pastille remplie, when on lit l'icône visible, then `animation-name` vaut `kr-bell-swing`, comme sur la base.
- Given les emplois hors liste (badges de panneau et de groupe, `.kd-field.is-invalid`), when on compare à la base, then ils sont égaux.
- Given la bascule 767 ↔ 768 dans les deux sens, then la pastille d'état est présente des deux côtés.
- Given `kraland-theme.css`, when un contrôle statique lit la règle réécrite, then il ne trouve ni `!important` nouveau, ni règle globale, ni rouge littéral.
- Given `typographie-formes` sur la base `d68ab55` avec le masque, then le contrôle couleurs est vert ; sans masque, il est rouge sur `cloche` et `badge` seulement.
- Given `npm run test:router`, then vert.

## Implementation Notes

- Assumptions, tranchées par le planificateur :
  - A1 (épopée, Assumption « cloche et enveloppe en non lu sur les deux supports ») : l'enveloppe prend la même pastille que la cloche, malgré DESIGN qui la voyait grise (Source conflict de l'épopée).
  - A2 (sans source) : la géométrie de la barre reste. Seules la couleur, la police et le rayon passent à la Pastille d'état. Le retrait `1px 6px` et l'interligne 1,5 de `.kr-topic-badge` ne tiendraient pas dans les pastilles de 16 et 18 px, posées en absolu sur des cibles de 44 px.
  - A3 (sans source) : aucune fixture ne change. Les pastilles remplies viennent de `typographie-formes.html` ; les vides, de `kramail-reception.html`. Si un contrôle exige une pastille remplie sur kramail-reception, la page est dérivée dans le test par remplacement de chaîne (`<span class="badge badge-danger"></span>` vers `…>!</span>`), à consigner.
  - A4 (convention de l'épopée, précédent `.kr-topic-badge`) : la règle globale passe dans la liste combinée `(max-width: 767px), (min-width: 768px)`. Le rendu ne change pas ; la convention « jamais en global » est tenue.
  - A5 (sans source) : `--kr-badge-danger-border` n'est plus lu après 5.4. Son retrait, et le sort de `--kr-badge-danger` (encore lu par `.kd-field.is-invalid`), reviennent au sweep 5.6. À consigner dans `deferred-work.md`.
  - A6 (sans source) : la base du fragment `pastilles` est `601ab19`, dans une constante dédiée. Les constantes des fragments 5.1 à 5.3 ne changent pas.
  - A7 (sans source) : les deux `!important` restent. Ils existent pour battre une règle du site non reproduite dans les fixtures (`bootstrap1.min.css` du site). Les retirer sans preuve sur le site réel n'est pas sûr ; le site réel est hors mandat.
- Décisions de construction (en autonomie, consignées dans `revue-manuelle.md`, section « Ticket 5.4 ») :
  - D1 (bureau compact, 768 à 991 px) : sur la base, la barre y est un menu repliable sans clone (PLT-04) ; menu fermé, cloche et enveloppe ont une boîte 0 × 0. Rendu de base gardé. Le fragment `pastilles` contrôle à 768 et 769 px le menu fermé (aucune pastille visible, égal à la base) puis le menu ouvert par le bouton de la barre (original visible, pastille d'état). Report dans `deferred-work.md`. Bascule 767 ↔ 768 (correctif de revue) : à chaque étape à 768 px, dans le même onglet, le menu est ouvert par le bouton de la barre (jamais la cloche), l'original y est visible (`elementFromPoint`) en pastille d'état, puis le menu est refermé (aucune pastille visible).
  - D2 (masque) : `CARTES_TICKET54` pose aussi `border-color: var(--kr-primary-dark) !important`, couleur de bordure calculée après le retrait (largeur 0 inchangée), pour égaliser le contrôle couleurs de `typographie-formes`, qui compare la couleur de bordure.
  - D3 (`nettoyage`) : vert sans masque au 1er passage de la zone ; rien n'y est empilé.
  - D4 (routeur) : `typographie-formes.html` passe par la règle « fixture » (citée par `cartes-pastilles` et `typographie-formes`) ; règles dédiées pour `kramail-reception.html` et `sous-forum-debuter.html`. Deux cas existants de `router.test.mjs` suivent ce fait.
  - D5 (hors liste) : `#pastille-titre` et `#pastille-groupe` comparés à la base ; `.kd-field.is-invalid`, absent des fixtures de la barre, reste couvert par `kramail-redaction` (zone `kramail`).
- Pièges :
  - P1 : en Kraland et Ruthvénie clairs, `#c41e3a` (status-unread) est voisin de `#dc3545` (Q21). Comparer des rgb exacts au jeton calculé de la variante, jamais « différent du rouge » ni « à distance du rouge ».
  - P2 : en variante claire, `--kr-bg-surface` vaut `#fff`, comme l'ancien texte blanc. Le rouge avant sur le texte n'apparaît qu'en variante sombre : Empire Brun sombre est obligatoire dans la matrice.
  - P3 : `border-color` est inerte (pas de bordure sur `.badge` de Bootstrap 3). Son retrait ne change pas le rendu ; mesurer quand même la largeur des 4 bordures.
  - P4 : à 375 et 767 px, `#badge` est dupliqué par le clone. `querySelector('#badge')` lit l'original, caché dans le menu replié. Mesurer la pastille visible par son conteneur (`.navbar-header-buttons-left`), puis vérifier `elementFromPoint` sur son centre. « Couvert » n'est pas « invisible ».
  - P5 : les clones sont créés une fois à l'init, en `mobile-mode`. Une bascule 1280 → 767 dans le même onglet peut ne pas les créer. Le contrôle de bascule dit ce qu'il observe ; à défaut de clone, il mesure la pastille d'origine, en clair. Ne pas corriger le JS (hors périmètre).
  - P6 : la cloche de toutes les fixtures appelle `openReport` au clic (`onclick` neutralisé dans typographie-formes, pas dans les fixtures kramail). Aucun tap ni clic sur la cloche. Aucune route vers `/report`.
  - P7 : MAX_CITING. `kr-topic-badge` est à 3 suites ; `cartes-pastilles` ne peut pas le citer. `kr-status-unread` cité par `cartes-pastilles` serait une 3e suite : le passer par `variantes.mjs` aussi.
  - P8 : la ligne réécrite contient `kramail` ; le routeur l'envoie vers `forum` et `kramail` seulement. Sans le mot-clé ajouté, `test:changed` ne lance ni `cartes-pastilles` ni `typographie-formes`.
  - P9 : le masque `CARTES_TICKET54` doit garder `!important` pour battre la règle de la base ; il n'est pas dans la peau.
  - P10 : `.badge:empty` vient de Bootstrap. Sans Bootstrap réel, une pastille vide prend le retrait et paraît pleine. Toutes les pages du fragment chargent Bootstrap 3.3.7.
  - P11 : faux FAIL sous charge. Rejouer la suite seule, machine calme, `kr-theme-enabled` vérifié.

## Plan Change Log

- Relevé de base (`601ab19`, Bootstrap réel, 375 et 1280 px, Kraland clair et Empire Brun sombre), conforme à l'annexe §1 : fond `rgb(220, 53, 69)`, texte blanc, **12 px** (pas 10), 700, rayon 9999px, bordures de largeur 0 (couleur `rgb(189, 33, 48)`), icône `kr-bell-swing`. 375 px : clones visibles (16 × 16, `2px 4px`), originaux 0 × 0 dans le menu replié. 1280 px : originaux visibles (`3px 7px`). Vides de kramail-reception : `display: none`, icône sans animation. Jetons : Kraland `rgb(196, 30, 58)` sur `rgb(255, 255, 255)` ; Empire Brun sombre `rgb(212, 165, 116)` sur `rgb(30, 26, 21)`.
- Écart à la matrice (D1) : à 768 et 769 px, la pastille visible n'est pas l'original menu fermé (bureau compact PLT-04, aucune pastille visible dans la base). Contrôle menu fermé + menu ouvert.
- Écart au masque (D2) : le retrait de `border-color` change la couleur de bordure calculée (largeur 0) ; le masque la reproduit.
- Forme minifiée du détecteur `AVANT_TICKET54` : `a[href*=kramail] .badge:not(:empty){background-color:var(--kr-status-unread)!important` ; média minifié en `(width<=767px),(width>=768px)`.
- Preuves (HEAD `601ab19`, arbre de travail non commité) :
  - `KR_FRAG=pastilles node tests/e2e/cartes-pastilles.mjs` : vert. Rouge avant sur le bundle de `601ab19` : 95 FAIL (statique, fond et texte, référence « NOUVEAU MESSAGE ») ; formes, vides, animation, hors liste verts.
  - Contre-épreuves (bundles mutés hors dépôt) : fond `--kr-badge-danger` 95 FAIL ; texte `--kr-white` 48 FAIL (sombre) ; `(max-width: 767px)` seul 69 FAIL (768 et au-delà) ; sélecteurs kramail retirés 95 FAIL (enveloppe) ; `.badge:empty{display:inline-block}` 10 FAIL (vides) ; animation retirée 14 FAIL ; `.badge` ajouté 14 FAIL (hors liste).
  - `typographie-formes` `KR_FRAG=mobile` et `bureau` : verts avec `CARTES_TICKET54` ; sans lui, 4 et 6 FAIL sur `cloche` et `badge` seulement.
  - `npm run test:zone -- cartes-pastilles typographie-formes kramail forum sous-forum palette-nation report initialisation` : 9653 ok, 0 FAIL (jeu-identite, forum-index, palette-nation, typographie-formes, cartes-pastilles, sous-forum, fin-initialisation, forum-mobile, kramail-redaction, report-non-lu), sans autre masque.
  - Correctif de revue (bascule) : l'étape 768 de la bascule ne constatait que l'absence de pastille visible et lisait l'original caché. Elle ouvre maintenant le menu compact dans le même onglet, vérifie l'original visible en pastille d'état, puis le referme. Contre-épreuve : `@media (width>=768px){.navbar-right .badge{display:none!important}}` ajouté au bundle, 84 FAIL dont les 6 étapes 768 de la bascule (« visible nulle part (attendu original) ») ; `(max-width: 767px)` seul : 69 FAIL, dont les mêmes 6 étapes. Rejeu après le correctif : `npm run build` 0 ; `KR_FRAG=pastilles` vert (rouge avant sur `601ab19` : 95 FAIL) ; même `test:zone` : 9653 ok, 0 FAIL ; `test:router` vert ; `lint:css` 0 ; `lint:js` 0.
  - `npm run test:router` vert ; `npm run lint:css` 0 ; `npm run lint:js` 0 (un avertissement préexistant dans `report-non-lu.mjs`). `test:changed` non lancé : le diff s'élargit au total (`tests/e2e/lib/variantes.mjs`).

## Design Notes

Spécificités à préserver :

| Règle | Avant | Après |
|---|---|---|
| `.badge-danger` | (0,1,0), global | identique, dans la liste combinée |
| `.navbar-right a[href="kramail"] .badge:not(:empty)` | (0,4,1), global | identique |
| `.navbar-header-buttons-left a[href="kramail"] .badge:not(:empty)` | (0,4,1), global | identique |
| `.navbar-header-buttons-left a[href*="kramail"] .badge:not(:empty)` | (0,4,1), global | identique |

Une `@media` ne change pas la spécificité ni l'ordre de la cascade. La règle reste après `.label, .badge` (l.713) : `.badge-danger` la bat à spécificité égale, et le `!important` existant la protège.

Avant / après des déclarations :

```css
/* avant */
background-color: var(--kr-badge-danger) !important;
color: var(--kr-white) !important;
border-color: var(--kr-badge-danger-border) !important;
/* après */
background-color: var(--kr-status-unread) !important;
color: var(--kr-bg-surface) !important;
```

## Verification

**Commands:**
- `npm run build` ; `KR_FRAG=pastilles node tests/e2e/cartes-pastilles.mjs` ; `npm run test:zone -- cartes-pastilles typographie-formes kramail forum sous-forum palette-nation report` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js`. Attendu : 0 FAIL, codes de sortie lus séparément. `test:changed` seulement s'il ne s'élargit pas au total. Pas de `test:all` (orchestrateur).
- Rouge avant : extraire hors dépôt le bundle de `601ab19` (`git show 601ab19:kraland-userscript-main.user.js`), puis `KR_SCRIPT=<ce bundle> KR_FRAG=pastilles node tests/e2e/cartes-pastilles.mjs`. FAIL attendus :
  - fond `rgb(220, 53, 69)` au lieu de status-unread, dans les 16 variantes ;
  - fond différent de « NOUVEAU MESSAGE » ;
  - texte blanc au lieu de bg-surface, en variante sombre.
  Verts : taille, graisse, rayon, bordures, vides invisibles, animation, hors liste.
- Contre-épreuves sur des copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - fond remis à `var(--kr-badge-danger)` ;
  - texte remis à `var(--kr-white)` (FAIL en sombre) ;
  - règle limitée à `(max-width: 767px)` (FAIL à 768 et au-delà) ;
  - sélecteurs kramail retirés (FAIL enveloppe) ;
  - `display: inline-block` ajouté à `.badge:empty` (FAIL vides) ;
  - animation retirée (FAIL animation) ;
  - `.badge` ajouté à la liste de la règle (FAIL `#pastille-titre` hors liste).
- Masque : `KR_FRAG=mobile` et `KR_FRAG=bureau` de `typographie-formes.mjs` verts avec `CARTES_TICKET54` ; rouges sur `cloche` et `badge` sans lui.
- Largeurs : 375×667, 767, 768, 769, 1280, 1440, 1920, avec la bascule 767 ↔ 768 dans les deux sens. Géométrie en Kraland clair et Empire Brun sombre. Couleurs et contraste dans les 16 variantes.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667 et 1280×720, en Kraland clair et Empire Brun sombre : cloche et enveloppe remplies, à côté de « NOUVEAU MESSAGE » du sous-forum. Regarder la lisibilité du « ! » et du chiffre, et le contour de la pastille sur la barre de nation.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | lib/variantes.mjs l.490-494 | Masque `CARTES_TICKET54` pas miroir pur : `border-color: var(--kr-primary-dark) !important` ajouté | rejeté | — | bordure de largeur 0, valeur de `.label, .badge` l.716 ; ne touche pas le bundle courant ; consigné (D2) |
| 2 | quick | cartes-pastilles.mjs l.1151, l.1303 | Bascule : l'étape 768 constate `porteur === null` et passerait si la pastille ne s'affichait plus après bascule | fondé | patch (fixed) | menu ouvert contrôlé seulement hors bascule |
| 3 | quick | kraland-theme.css l.797 | Largeur fractionnaire 767-768 : aucune des deux requêtes | rejeté | — | convention AGENTS.md, même trou l.653, l.725 |
| 4 | quick | plan, matrice « Seuils » | « Pastille visible portée par l'original à 768 » impossible sans toucher au JS ou au menu | fondé | defer | ticket `verify` sans 768 ; deferred-work.md et revue-manuelle.md (D1) |

## Result

- Construit sur `601ab19`. Revue quick : 4 constats, 1 corrigé, 1 reporté (bureau compact 768-991, deferred-work.md), 2 rejetés.
- Gates : `npm run build`, `lint:css`, `lint:js`, `test:router` verts ; skills identiques ; `npm run test:all` : 11799 ok, 0 FAIL en 800 s.
- Fragment `pastilles` : rouge avant sur `601ab19` (95 FAIL) ; contre-épreuves toutes rouges.
