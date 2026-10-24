---
title: 'Étiquettes de catégorie : un seul style, « PNJ » compris (H8.1)'
type: 'feature'
ticket: '5'
created: '2026-10-24'
status: 'built'
baseline_revision: '59567f05411c208073df99b562b741d18aa336f6'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/epic-cartes-pastilles.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-cartes-pastilles/story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
  - 'tests/e2e/lib/variantes.mjs'
  - 'tests/e2e/lib/router.mjs'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `.label` et `.badge` servent aux deux familles de DESIGN.md (Étiquette de catégorie, Pastille d'état). Plusieurs étiquettes de catégorie gardent pourtant un style propre :
- « PNJ » des cartes du tableau de bord (`.dashboard-card-pnj`, `#c9302c` en dur, l.2678) ;
- la marque native `span.btn.btn-danger.xmini`, en rouge danger de Bootstrap (exclue des boutons d'état par le ticket 3.5) ;
- les tags du sujet (`.forum-tags a`, mobile, gris l.8671) ;
- le compteur de groupe (`.dashboard-section-header .badge`, neutre l.13256 et l.13283).

Les compteurs de contact du kramail (`#badge1000`…) signalent des non-lus, mais ne sont pas en pastille d'état. Le rouge d'une étiquette se lit comme un blocage. DESIGN.md › Étiquette de catégorie (`label-category`) : fond `--kr-arm-bg` (repli `--kr-primary`), texte `--kr-arm-ink` (repli blanc), 12 px 700, rayon plein, jamais une couleur d'état.

**Approach:** Chaque étiquette et pastille restante est classée dans l'annexe d'inventaire. Les règles d'origine de la peau sont réécrites en place :
- PNJ des cartes, tags du sujet et compteur de groupe : couleurs de catégorie ;
- compteurs de contact du kramail : ajoutés à la règle de pastille d'état de l'entrée 4 (l.797).

La marque native `.btn-danger.xmini` n'a pas de règle d'origine dans la peau. Elle reçoit une règle de catégorie sur le schéma des boutons d'état de 3.5 (A2).

Gardent leur rendu :
- les étiquettes déjà en catégorie : « guilde », « [mod] », « Arme en main », pastilles d'ordre ;
- les étiquettes d'état : `.label-success/-warning/-danger`, pastilles de panneau d'état, score de vote ;
- les éléments hors familles (Q30.1, Q30.4) : pastille de niveau, « ici » de la croix, caractéristiques.

Un fragment `etiquettes` de `cartes-pastilles.mjs` contrôle le tout. La garde PNJ de `palette-nation` et le contrôle couleurs de `typographie-formes` suivent, chaque masque avec sa condition de retrait.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi. Tout écart va au Plan Change Log, avec sa raison.
- P1, option 4 : réécrire la déclaration d'origine, sans règle concurrente plus spécifique. Aucun `!important` nouveau dans `kraland-theme.css`.
  - Les `!important` existants de `.forum-tags a` (l.8671) et de la règle d'état l.797 gardent leur place.
  - Le seul ajout est la règle de la marque native (A2), qui n'a pas d'origine dans la peau ; elle n'a pas d'`!important`.
- Médias selon AGENTS.md :
  - une règle nouvelle servant les deux supports va dans la liste combinée `@media (max-width: 767px), (min-width: 768px)` (précédent 5.4, A4) ;
  - les réécritures restent dans leur bloc actuel : mobile pour `.forum-tags`, mobile et bureau pour le compteur de groupe ;
  - toute garde de page s'écrit `:where(html.x)`.
- Valeurs de DESIGN.md sans en inventer :
  - catégorie : `var(--kr-arm-bg, var(--kr-primary))` / `var(--kr-arm-ink, var(--kr-white))`, survol `--kr-arm-bg-hover` / `--kr-arm-ink-hover` (comme `a.label`, l.763-768) ;
  - état : `--kr-status-unread` / `--kr-bg-surface`.
- Géométrie inchangée : position, retrait, casse et espacement de « PNJ » (cartes de 5.3) ; taille de `.xmini` ; gap et retrait des tags ; retrait du compteur de groupe.
- Sont égaux à la base `59567f0` :
  - `.kr-stat-badge`, `.kr-skill-badge` et `.kr-room-here` (Q30.1) ;
  - les caractéristiques `btn-success` et leur `.badge`, ainsi que `.mobile-characteristic-badge` (Q30.4) ;
  - les étiquettes et pastilles d'état ;
  - les catégories déjà conformes ;
  - `span.tagforum` (A4) ;
  - `#piece` de palette-nation.
- Sélecteurs et noms de jetons nouveaux des tests : passer par `lib/variantes.mjs` (MAX_CITING = 3, annexe §7).

**Ask First:**
- Toute étiquette de catégorie d'une autre couleur que arm-bg / arm-ink, ou toute pastille d'état autre que status-unread.
- Changer le rendu de `span.tagforum` (tags natifs du sous-forum, en texte « · #tag ») : alternative à A4.
- Garder le compteur de groupe neutre : alternative à A3.
- Changer la géométrie d'une étiquette (« PNJ » en 12 px 700 mais retrait `2px 5px` gardé).
- Retirer `--kr-badge-pnj`, `--kr-badge-danger`, `--kr-badge-danger-border` (sweep 5.6).
- Un contrôle d'une autre suite qui casse pour une autre raison que la couleur des éléments de la liste.

**Never:**
- Règle `:focus`. Modification du template JS (`buildCard`, `extractMemberData`, `extractGroupData`).
- Ouvrir, précharger ou appeler `/report`. Aucun clic sur la cloche, ni `openReport` des fixtures kramail.
- Toucher la pastille de niveau, « ici », les caractéristiques, les boutons d'état de 3.5 (l.902-916), `--kr-level-*`.
- Données réelles dans une fixture ; aucune fixture modifiée (pages dérivées dans le test, A5).
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur). Site réel, Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| PNJ des cartes | plateau-qualite-usage (Bootstrap vendored) et typographie-formes, 375, 767, 768, 769, 1280, 1440, 1920 | `.dashboard-card-pnj` : fond = arm-bg calculé, texte = arm-ink calculé, 12 px, 700, rayon plein ; position et retrait égaux à la base | rgb exacts, pas « différent du rouge » |
| Marque native | palette-nation-etats `#pnj`, repos et survol forcé | même paire arm ; bordure = fond ; taille `.xmini` égale à la base ; plus aucune couleur Bootstrap | survol = repos |
| Tags du sujet | typographie-formes `/forum/hrp/fixture-typographie-1`, 375 et 767 ; `:active` forcé | `.forum-tags a` en paire arm ; `:active` en arm-bg-hover / arm-ink-hover | 768 et au-delà : égal à la base (pas de règle bureau) |
| Compteur de groupe | typographie-formes `#pastille-groupe`, plateau-qualite-usage | paire arm, bordure = fond, des deux côtés du seuil | — |
| Compteurs kramail | kramail-reception dérivée (`#badge1000` rempli, A5) | fond status-unread, texte bg-surface = « NOUVEAU MESSAGE » du sous-forum ; vides invisibles (Bootstrap réel) | `.list-group-item.active` : non lu gagne |
| Déjà conformes | typographie-formes `#etiquette-rang`, `#etiquette-mod` ; forum-index-rp `[mod]` ; jeu-materiel « Arme en main » ; `kr-order-badge` | égaux à la base `59567f0` et en paire arm | — |
| Hors familles | `.kr-stat-badge`, `.kr-skill-badge`, `.kr-room-here` (375), caractéristiques | égaux à la base | — |
| Absents | forum-sujet, « article », « Dernier sujet » | aucune `.label`/`.badge` sur forum-sujet ; absence consignée | — |
| Thèmes | 16 variantes, 375, 1280, 1440, 1920 | arm-ink sur arm-bg ≥ 4,5:1 ; aucune étiquette de la liste en couleur d'état | Kraland sombre 4,53, Khanat sombre 4,57 : rapport exact |
| Seuils | 767 / 768 / 769, bascule 767 ↔ 768 dans les deux sens | même paire arm des deux côtés pour PNJ, marque, groupe ; tags arm à 767, base à 768 | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-inventaire.md` (lignes de `59567f0`, à revérifier).
- `kraland-theme.css` :
  - l.713-720 `.label, .badge` : modèle, non touché ;
  - l.797-804 règle d'état 5.4 : ajout du sélecteur des compteurs de contact ;
  - l.859-860 commentaire « Hors palette : PNJ » : mis à jour ;
  - l.902-916 boutons d'état 3.5 : non touchés, l'exclusion `:where(:not(.btn-danger.xmini…))` reste ;
  - l.2673-2687 `.dashboard-card-pnj` : réécrite ;
  - l.8671-8686 `.forum-tags a` et `:active`, mobile : réécrites ;
  - l.13256 et l.13283 compteur de groupe, bureau et mobile : réécrits.
- Template JS (lecture seule) : `buildCard` l.4359-4363, `extractMemberData` l.4153, `extractGroupData` l.4073.
- Tests :
  - `tests/e2e/lib/variantes.mjs` : bloc 5.5 après l.496 ;
  - `tests/e2e/cartes-pastilles.mjs` : en-tête l.1-55, bases l.66-74, `PAGES` l.99-132, `pastilles` l.1185, `horsListe` l.1139 et l.1242 ;
  - `tests/e2e/typographie-formes.mjs` : contrôle couleurs l.318 ; `nettoyage` l.1871-1874 ;
  - `tests/e2e/palette-nation.mjs` : `HORS5` l.1231, contrôle l.1345-1356 ;
  - `tests/e2e/lib/router.mjs` : l.91, l.168, l.190, l.193 ; `router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [ ] Relevé de base sur le bundle de `59567f0` (Bootstrap réel), avant toute écriture, à 375 et 1280 px, en Kraland clair et Empire Brun sombre.
  - Propriétés : fond, texte, bordures (largeur et couleur), taille, graisse, rayon, retrait.
  - Éléments : PNJ de carte, `#pnj` (repos et survol), tags (375), `#pastille-groupe`, compteur kramail dérivé, `#etiquette-rang`, `#etiquette-mod`, « Arme en main ».
  - Écarts à l'annexe §1 : au Plan Change Log.
- [ ] `tests/e2e/lib/variantes.mjs`, bloc 5.5 après le bloc 5.4 :
  - repères `ETIQUETTES_TICKET55` : sélecteurs de la liste (annexe §2), noms des jetons `--kr-arm-bg`, `--kr-arm-ink`, `--kr-arm-bg-hover`, `--kr-arm-ink-hover`, sélecteur des compteurs de contact ;
  - masque `CARTES_TICKET55` : miroir des règles réécrites (PNJ, groupe, tags, compteurs), `!important` dans le test seulement (précédent 5.4 P9) ; couleur de bordure déclarée si le contrôle la compare ;
  - détecteur `AVANT_TICKET55` : début minifié de `.dashboard-card-pnj{` suivi de `background:var(--kr-arm-bg`, à relever dans le bundle construit.
  - Condition de retrait : « quand le bundle de base de la suite contient l'entrée 5.5 ».
- [ ] `tests/e2e/cartes-pastilles.mjs`, fragment `etiquettes` :
  - base `COMMIT_AVANT_55 = '59567f0'`, surchargeable par `KR_SCRIPT_AVANT` ;
  - pages : `barre` (typographie-formes), une page tags (`/forum/hrp/fixture-typographie-1`), `groupes`, une page `palette-nation-etats.html` (`/regles/avancees`), `reception` dérivée, `index-rp`, `materiel`, `sous-forum` (référence), `sujet` (absence) ;
  - contrôles selon la matrice ;
  - géométrie et égalités à la base à 375, 767, 768, 769, 1280, 1440, 1920, en Kraland clair et Empire Brun sombre ;
  - couleurs et contraste (`CONTRASTE`) dans les 16 variantes à 375, 1280, 1440, 1920 ;
  - bascule 767 ↔ 768 dans les deux sens ;
  - contrôle statique : aucun `!important` de plus que la base, aucune couleur littérale dans les règles réécrites, aucune règle `:focus` ;
  - `kr-theme-enabled` vérifié avant toute mesure ;
  - en-tête du fichier mis à jour.
  - Fragment `pastilles` : `#pastille-groupe` quitte `horsListe` (`PASTILLES_TICKET54`), sinon il compare à `601ab19` sans masque possible. Consigner l'écart.
- [ ] `kraland-theme.css` :
  - `.dashboard-card-pnj` : `background: var(--kr-arm-bg, var(--kr-primary))`, `color: var(--kr-arm-ink, var(--kr-white))`. Le commentaire PLT-10 est retiré, la géométrie reste.
  - `.forum-tags a` : fond arm-bg, texte arm-ink (`!important` existants gardés). `:active` : arm-bg-hover / arm-ink-hover (A6).
  - Compteur de groupe l.13256 et l.13283 : `background-color` arm-bg, `color` arm-ink, `border-color` arm-bg.
  - Règle l.797 : ajouter `a.list-group-item[href^="kramail/"] > .badge:not(:empty)` **en tête de liste** (forme à confirmer par le relevé, A5). En fin de liste, il casserait `AVANT_TICKET54` (P14).
  - Règle nouvelle `html.kr-theme-enabled .btn.btn-danger.xmini` (0,3,1), en liste combinée, près des boutons d'état. Elle porte le fond arm-bg, le texte arm-ink et la bordure arm-bg, en 12 px 700 avec rayon plein (A2).
  - Commentaire l.859-860 mis à jour : « PNJ : étiquette de catégorie (épopée 5, entrée 5) ».
- [ ] `tests/e2e/palette-nation.mjs` :
  - `#pnj` quitte `HORS5` ; la garde `#piece` contre `d521cc8` reste ;
  - nouveau contrôle `#pnj` repos et survol : fond = arm-bg sondé, texte = arm-ink sondé, bordure = fond, ≥ 4,5:1, 16 variantes (fragments `etats-mobile`, `etats-bureau`) ;
  - `#pnj` rentre dans « aucune couleur d'état de Bootstrap ».
- [ ] `tests/e2e/typographie-formes.mjs` : poser `CARTES_TICKET54 + CARTES_TICKET55` sur la base quand `AVANT_TICKET55(avant)` (l.318). Commentaire « écart accepté et consigné (épopée 5, entrée 5) » avec la condition de retrait. Si `nettoyage` est rouge sur ces éléments au 1er passage, y empiler le masque.
- [ ] Suites existantes, 1er passage : `forum-index`, `plateau-qualite-usage`, `plateau-profil-mobile`, `kramail-redaction`, `sous-forum`, `report-non-lu`, `jeu-identite`. Attendu vert sans changement. Un rouge lié à la couleur des éléments de la liste reçoit le masque ; tout autre rouge relève d'Ask First.
- [ ] `tests/e2e/lib/router.mjs` :
  - fragment `etiquettes` ajouté à l'entrée l.91 ;
  - mot-clé `/xmini|dashboard-card-pnj|forum-tags/` vers `cartes-pastilles`, `typographie-formes`, `palette-nation`. `dashboard-card-pnj` est retiré de l.168 ou laissé en double, au choix consigné ;
  - FILE_RULES : `cartes-pastilles` pour `palette-nation-etats.html`, `forum-index-rp.html`, `jeu-materiel.html` s'il manque ;
  - cas dans `router.test.mjs` (ligne de la règle `.btn.btn-danger.xmini` et de `.forum-tags a`) ;
  - skill `tester-kraland-css` mis à jour dans les deux copies si le routage change (`diff -r .hermes/skills .claude/skills` vide).
- [ ] `revue-manuelle.md`, section « Ticket 5.5 » : A2, A3, A4, A5. `deferred-work.md` : `--kr-badge-pnj` mort (5.6), `span.tagforum` (A4).
- [ ] `npm run build`, rouge avant, contre-épreuves, lint.

**Acceptance Criteria:**
- Given les 16 variantes à 375, 1280, 1440 et 1920 px, when la suite tourne, then « PNJ » de carte, `#pnj`, `#pastille-groupe`, « guilde », « [mod] » et « Arme en main » ont le fond arm-bg et le texte arm-ink calculés, à 4,5:1 au moins, 12 px, 700 et rayon plein. Aucun n'est en couleur d'état. Les tags passent aussi, à 375 px seulement.
- Given `#pnj` au survol forcé, then ses couleurs sont celles du repos.
- Given kramail-reception dérivée, then le compteur rempli a le fond et le texte de « NOUVEAU MESSAGE » du sous-forum de la même variante ; vide, il est invisible.
- Given pastille de niveau, « ici », caractéristiques, `#piece`, étiquettes d'état et `span.tagforum`, when on compare à la base, then ils sont égaux.
- Given la géométrie de « PNJ », des tags et du compteur de groupe, when on compare à `59567f0`, then elle est égale.
- Given la bascule 767 ↔ 768 dans les deux sens, then le rendu de la matrice tient des deux côtés.
- Given `typographie-formes` sur `d68ab55` avec les masques 54 et 55, then le contrôle couleurs est vert. Sans le masque 55, il est rouge sur `pnj`, `groupe` et `tags` seulement.
- Given `kraland-theme.css`, then un contrôle statique ne trouve ni `!important` nouveau, ni `#c9302c`, ni règle `:focus` ajoutée.
- Given `npm run test:router`, then vert.

## Implementation Notes

- Assumptions, tranchées par le planificateur :
  - A1 (épopée, Assumption tags) : `.forum-tags` est une étiquette de catégorie.
  - A2 (sans source) : la marque native n'a de couleur que celle de Bootstrap (`.btn-danger`) ; il n'y a rien à réécrire dans la peau. La règle `html.kr-theme-enabled .btn.btn-danger.xmini`, en (0,3,1), est l'équivalent le plus proche. Elle bat `.btn-danger:hover` (0,2,0) et `.btn-danger:active:hover` (0,3,0) sans pseudo-classe ; survol = repos. L'autre voie possible était d'ajouter le sélecteur à `.label, .badge` (l.713, global, (0,3,0) à égalité avec Bootstrap `:active:hover`) ; elle a été écartée.
  - A3 (sans source) : le compteur de groupe classe (nombre de cartes), il ne signale pas : catégorie. Alternative en Ask First.
  - A4 (sans source, précédent 5.2 R6) : les tags natifs `span.tagforum` gardent leur rendu « · #tag ». `.forum-tags` n'existe que dans la fixture synthétique ; à consigner pour Arnaud.
  - A5 (ticket : « compteurs du kramail par exemple ») : les compteurs de contact sont des pastilles d'état. Fixtures vides : page dérivée dans le test par remplacement de chaîne (`id="badge1000"></span>` vers `id="badge1000">2</span>`), précédent 5.4 A3.
  - A6 (sans source) : `:active` des tags suit le survol de `a.label` (l.767), pas `--kr-bg-active` (contraste non garanti avec arm-ink).
  - A7 : « article » et « Dernier sujet » sont absents du CSS, du JS (hors `createElement('article')`, l.4885) et des fixtures ; il n'y a que « Dernier : » (l.14018, l.14780, texte). Pas de site réel : absence consignée.
  - A8 : score de vote du forum (`.btn-success`, l.15152) = état ; les pastilles de panneau d'état (l.963) restent.
- Pièges :
  - P1 : contrastes arm serrés (Kraland sombre 4,53, Khanat sombre 4,57, Confédération clair 4,83). Lire le rapport exact de `CONTRASTE`, jamais un arrondi.
  - P2 : en Kraland clair, `--kr-status-unread` vaut `#c41e3a`, voisin de `#dc3545`. Comparer les rgb exacts au jeton sondé.
  - P3 : sur plateau-qualite-usage, le JS transforme la marque native en `.dashboard-card-pnj` (`cloneVisibleContent` ne garde que texte et IMG). La marque native ne se mesure que sur palette-nation-etats `#pnj`.
  - P4 : plateau-qualite-usage n'a pas de lien Bootstrap : passer par la route vendored (`avecBootstrap`).
  - P5 : `.badge:empty` vient de Bootstrap ; sans Bootstrap réel, un compteur vide paraît plein.
  - P6 : `.list-group-item.active > .badge` (l.1020) pose la paire inverse ; la règle d'état garde `!important` et gagne. Vérifier sur un contact actif s'il en existe un.
  - P7 : MAX_CITING. `kr-arm-ink` est cité par 3 suites ; cartes-pastilles serait la 4e. `dashboard-section-header` est à 2. Passer jetons et sélecteurs par `variantes.mjs`.
  - P8 : `ouvrir` de cartes-pastilles n'a pas de paramètre `css` : aucun masque n'y est posable. Les couleurs s'y comparent aux jetons sondés, pas à la base.
  - P9 : le fragment `pastilles` (5.4) compare `#pastille-groupe` à `601ab19` : il rougit dès la réécrite du compteur de groupe.
  - P10 : kramail : ne jamais cliquer la cloche (`openReport`). Aucune route vers `/report`.
  - P11 : `#pnj` est un `span` non focalisable : pas de `:focus`, survol forcé seulement.
  - P12 : `--kr-badge-pnj` (`#d9534f`, l.77) et `--kr-badge-danger-border` sont morts : à laisser au sweep 5.6.
  - P13 : faux FAIL sous charge : rejouer la suite seule, machine calme.
  - P14 : `AVANT_TICKET54` cherche `a[href*=kramail] .badge:not(:empty){background-color:var(--kr-status-unread)!important`, soit le dernier sélecteur de la règle l.797. Un sélecteur ajouté en fin de liste fait disparaître cette chaîne. Le détecteur verrait alors tout bundle postérieur comme antérieur à 5.4. Ajouter en tête, puis vérifier `AVANT_TICKET54(bundle courant) === false`.
  - P15 : `CARTES_TICKET54` (miroir de la règle 5.4) ne couvre pas les compteurs de contact. Le miroir 5.5 les porte.
- Implémentation (2026-10-24, décisions prises en autonomie, consignées aussi dans `revue-manuelle.md` › Ticket 5.5) :
  - Marque native sous 768 px : la règle `.btn` mobile de la peau (`--kr-font-button`, `padding: 12px 20px`, `min-height: 44px`, en priorité forcée) l'emporte sur A2 ; la marque reste à 14 px et 46 px de haut, comme la base. 12 px au bureau. Le test compare sa taille et son cadre à la base.
  - La graisse 700 élargit la marque d'environ 1 px : `#piece` voisine glisse d'autant. Sur la page `etats`, la position de `#piece` seule est exclue de la comparaison (`sansPosition55`, revue #3) ; les `.label-*` gardent la leur.
  - Appui des tags : l'encre passe par la redéfinition de `--kr-arm-ink` dans la règle `:active`, sans priorité forcée nouvelle.
  - Tags mobiles : `table.dataTable` est masqué sous 768 px sur la fixture (base comme ici) ; couleurs et contraste lus sur les styles calculés, sans boîte.
  - plateau-qualite-usage n'a pas de compteur de groupe : seul `#pastille-groupe` (typographie-formes) le porte.
  - Contrôle statique des tags : sélecteur minifié (`td:first-child`).
  - Réception dérivée : deux compteurs remplis, dont un contact actif (P6).
  - Routeur : `dashboard-card-pnj` laissé en double ; pas de règle de fichier nouvelle (règle « fixture »).
  - Revue #2 : la règle A2 ne déclare plus `font-size` ; la taille vient de l'origine `.xmini` (l.13151, l.13170), 12 px au bureau. Le contrôle statique de la marque n'attend plus de `font-size`.
  - Revue #4 : la branche `egal` du fragment `etiquettes` exige au moins un élément là où il est rendu. Relevé sur les fixtures : `.mobile-characteristic-badge` absent de `barre` et `.kr-room-here` absent de `groupes` (retirés de ces listes) ; `.kr-room-here` (`barre`) et `.mobile-characteristic-badge` (`groupes`) rendus sous 768 px seulement (exigés sous 768 px, égalité à la base au-delà). Repères dans `ETIQUETTES_TICKET55` (`horsFamillesAbsent`, `horsFamillesMobile`).
  - Bases antérieures des autres suites : `nettoyage` (typographie-formes, base `00b0786`) empile `CARTES_TICKET55` quand `AVANT_TICKET55` ; le fragment `groupes` (cartes-pastilles, base `a7f0463`) neutralise fond, bordure et couleur de `SPAN.dashboard-card-pnj` des deux côtés (`sansPnj55`), car `ouvrir` n'accepte pas de css (P8). À retirer quand ces bases contiennent l'entrée 5.

## Plan Change Log

- 2026-10-24 : la taille 12 px de la marque native ne vaut qu'au bureau (règle `.btn` mobile en priorité forcée, aucune priorité nouvelle permise) ; sous 768 px, taille égale à la base. Position de `#piece` hors comparaison (voisine de la marque élargie).
- 2026-10-24 : masque 5.5 empilé dans `nettoyage` (rouge au 1er passage sur le fond du « PNJ » des cartes, comme prévu) ; fragment `groupes` de cartes-pastilles rouge sur le même fond contre `a7f0463` : couleurs du « PNJ » neutralisées des deux côtés, géométrie toujours comparée.
- 2026-10-24 (revue, constats #2 à #4) : `font-size` retirée de la règle A2 (la tâche disait « en 12 px » : la taille reste à l'origine `.xmini`, P1 option 4). Masque de position limité à `#piece`. Présence exigée dans la branche `egal` ; deux éléments hors familles retirés des pages où la fixture ne les rend pas, deux autres exigés sous 768 px seulement. Contre-épreuves : `.label-*` déplacées, 42 FAIL ; sélecteurs `span.tagforum`, `.kr-stat-badge` et `.label-warning` rendus introuvables, 56 FAIL. Constat #1 reporté, question à Arnaud dans `revue-manuelle.md`.

## Design Notes

| Règle | Avant | Après |
|---|---|---|
| `.dashboard-card-pnj` | (0,1,0), global, `#c9302c` / blanc | identique, arm-bg / arm-ink |
| `html.kr-theme-enabled .btn.btn-danger.xmini` | absente (Bootstrap `.btn-danger`) | (0,3,1), liste combinée |
| `body.page-forum table.dataTable tbody td:nth-child(1) .forum-tags a` | (0,4,5), mobile, `!important` | identique, arm-bg / arm-ink |
| `.dashboard-section-header .badge` | (0,2,0), bureau et mobile | identique, arm |
| règle d'état l.797 | 4 sélecteurs | + `a.list-group-item[href^="kramail/"] > .badge:not(:empty)` (0,4,1) |

```css
/* avant */
.dashboard-card-pnj { background: #c9302c; color: var(--kr-white); }
/* après */
.dashboard-card-pnj { background: var(--kr-arm-bg, var(--kr-primary)); color: var(--kr-arm-ink, var(--kr-white)); }
```

## Verification

**Commands:**
- `npm run build` ; `KR_FRAG=etiquettes node tests/e2e/cartes-pastilles.mjs` ; `KR_FRAG=pastilles node tests/e2e/cartes-pastilles.mjs` ; `KR_FRAG=etats-mobile node tests/e2e/palette-nation.mjs` et `etats-bureau` ; `KR_FRAG=mobile node tests/e2e/typographie-formes.mjs` et `bureau` ; `npm run test:zone -- cartes-pastilles typographie-formes palette-nation plateau forum kramail sous-forum` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js`.
  - Attendu : 0 FAIL, codes de sortie lus séparément.
  - `test:changed` seulement s'il ne s'élargit pas au total.
  - Pas de `test:all`.
- Rouge avant : extraire hors dépôt `git show 59567f0:kraland-userscript-main.user.js`, puis `KR_SCRIPT=<bundle> KR_FRAG=etiquettes node tests/e2e/cartes-pastilles.mjs`. Idem pour `palette-nation` etats-*.
  - FAIL attendus : PNJ de carte, `#pnj`, tags, groupe, compteur kramail.
  - Verts : « guilde », « [mod] », « Arme en main », hors familles, géométrie.
- Contre-épreuves sur copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - PNJ remis à `#c9302c` ;
  - règle `.btn.btn-danger.xmini` retirée ;
  - règle limitée à `(max-width: 767px)` (FAIL à 768 et au-delà) ;
  - tags remis à `--kr-bg-hover` ;
  - groupe remis à `--kr-bg-active` ;
  - compteur kramail retiré de la règle d'état ;
  - `.kr-stat-badge` en arm (FAIL hors familles) ;
  - `.badge:empty{display:inline-block}` (FAIL vides) ;
  - arm-ink remplacé par un gris à 3:1 dans une variante (FAIL contraste).
- Masque : `typographie-formes` mobile et bureau, verts avec 54 + 55 ; sans 55, rouges sur `pnj`, `groupe`, `tags` seulement.
- Largeurs : 375×667, 767, 768, 769, 1280, 1440, 1920 ; bascule 767 ↔ 768 dans les deux sens. Géométrie en Kraland clair et Empire Brun sombre ; couleurs et contraste dans les 16 variantes.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667 et 1280×720, en Kraland clair et Empire Brun sombre : carte PNJ du plateau, marque native, tags du sujet, compteur de groupe, à côté de « guilde » et « [mod] ». Regarder la lisibilité de « PNJ » sur la carte et le contour sur la couleur de nation.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | `kraland-theme.css:926-933` / `:4680-4683` | Sous 768 px, la marque PNJ native reste en 14 px et 46 px de haut ; le `verify` de l'entrée 5 demande 12 px 700 | fondé | defer | La règle `.btn` mobile en `!important` bat A2. Corriger reviendrait à toucher l'exclusion de `.xmini` dans la règle `.btn` mobile, ce qui change une géométrie (*Ask First*). Question posée à Arnaud dans revue-manuelle, section Ticket 5.5 ; report dans deferred-work |
| 2 | quick | `kraland-theme.css:930` | La déclaration `font-size` de A2 est sans effet et double l'origine `.xmini` (l.13151, l.13170) : P1 option 4 | fondé | patch (fixed) | Au bureau, 12 px dès la base ; en mobile, `.btn` `!important` l'emporte |
| 3 | quick | `tests/e2e/cartes-pastilles.mjs` `sansPosition55` | Le masque retire `left/top` de toute la page `etats`, et non de `#piece` seul | fondé | patch (fixed) | Il s'applique aux `.label-*` de `E.etat` |
| 4 | quick | `tests/e2e/cartes-pastilles.mjs` branche `egal` | Les contrôles `egal` passent quand l'élément manque des deux côtés | fondé | patch (fixed) | `assert.ok(l.length > 0)` n'est exigé que pour `conforme` et `tags` |

## Result

- Construit le 2026-10-24 sur la base `59567f0`.
- Revue quick : 4 constats. #2, #3 et #4 sont corrigés. #1 est reporté (marque PNJ mobile en 14 px, question posée à Arnaud dans revue-manuelle, report écrit dans deferred-work).
- Gates :
  - `npm run build`, `lint:css`, `lint:js` et `test:router` sortent en 0 ;
  - `diff -r .hermes/skills .claude/skills` est vide ;
  - `npm run test:all` : 12777 ok, 0 FAIL (VERT).
- Rouge avant sur la base : 420 FAIL. Contre-épreuves : 9 à l'implémentation, plus 2 après la revue (42 et 56 FAIL).
