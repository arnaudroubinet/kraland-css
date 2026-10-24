---
title: "Grille d'espacement au pas de 4 px"
type: 'feature'
ticket: '9'
created: '2026-10-24'
status: 'built'
baseline_revision: '62fd47d'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-grille-d-espacement-au-pas-de-4-px-inventaire.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les composants courants ont deux grilles. Bootstrap pose 15 px et 10 px (`.panel-body` 15, `.panel-heading` 10/15, pied de modale 5). La peau ajoute ses propres 15, 10, 6 et 5 px : panneaux mobiles, en-têtes mobiles, cellules et corps de panneau du forum, liens des panneaux mobiles, boutons des messages. Les jetons `--kr-space-1..6` (4 à 32 px) de l'entrée 1 sont déclarés, mais aucune règle ne les emploie. DESIGN.md › Grille (H11.2) demande une grille unique au pas de 4 px, identique sur ordinateur et mobile, sur le périmètre de Q11 : `.panel-body`, `.panel-heading`, `.btn`, `.form-control`, cellules de tableau, sans la gouttière de la grille Bootstrap.

**Approach:** L'annexe d'inventaire mesure, sur les fixtures et aux largeurs communes, chaque marge, retrait et écart calculé des composants du périmètre. Elle remonte chaque valeur hors pas à sa règle gagnante. Chaque déclaration gagnante de la peau est réécrite en place au jeton (P1 option 4). Les natifs de Bootstrap sans règle dans la peau reçoivent une règle de rôle dans la liste combinée. Les valeurs que la hauteur imposée ou un autre ticket figent sont gardées comme exceptions, mesurées égales à la base. La preuve tient dans un fragment `espacement` de `typographie-formes.mjs`.

## Boundaries & Constraints

**Always:**
- L'inventaire de l'annexe fait foi : 13 déclarations CSS réécrites (section 1), 1 déclaration du template (section 2), 4 règles de rôle (section 3), 14 exceptions gardées (section 4). Tout écart est consigné au Plan Change Log avec sa raison.
- P1 option 4 : on réécrit la déclaration d'origine, sans ajouter de règle concurrente plus spécifique ni de `!important` nouveau. Une déclaration déjà en `!important` garde ce `!important` avec la valeur du jeton.
- Natifs de Bootstrap (annexe, section 3) : une seule liste combinée `@media (max-width: 767px), (min-width: 768px)`, placée après `.form-control.form-control`, sans `!important`. Aucune nouvelle règle globale hors média.
- Une règle mobile reste en `max-width: 767px`, une règle ordinateur en `min-width: 768px`.
- Les valeurs passent par `var(--kr-space-N)`, jamais par un littéral.
- Les boutons de la liste de l'entrée 2 gardent 34 px de haut sur ordinateur et au moins 44 px sur mobile. Les colonnes du plateau (`[id^=col-]`) gardent leur x et leur largeur de la base à 375, 768 et 1280 px.
- Exceptions (annexe, section 4) mesurées égales au bundle de `62fd47d`, propriété par propriété et en hauteur.
- Mesures dans un fragment `espacement` de `tests/e2e/typographie-formes.mjs`, `COMMIT_ESPACEMENT = '62fd47d'` (option `KR_SCRIPT_AVANT_ESPACEMENT`). Fixtures : plateau, plateau-typo, sujet, rédaction, index RP, sous-forum, kramail (réception, lecture, nouveau, répondre), modale d'ordre, Interface, composants. Largeurs communes : 375, 767, 768, 769, 1280, 1440, 1920. Variantes : Kraland clair et Empire Brun sombre. Jetons redéfinis (`--kr-space-1` 5px, `--kr-space-2` 9px, `--kr-space-3` 13px, `--kr-space-4` 17px) suivis par chaque élément R et N. Bascule 767/768 testée dans les deux sens dans le même onglet. Mini-profil plié et déplié à 375 et 700 px.
- Rouge avant sur le bundle de `62fd47d` (`KR_SCRIPT`), contre-épreuves nommées et comptées.
- Les écarts attendus des autres suites passent par un masque miroir hors couche, `ESPACEMENT_TICKET49` et son détecteur `AVANT_TICKET49`, dans `tests/e2e/lib/variantes.mjs`. Le masque est posé sur le bundle de base, jamais sur le bundle courant. Ces suites ne reçoivent pas de valeurs codées en dur.
- Routeur : mot-clé des jetons d'espacement. Aucune classe n'est citée par 4 suites (MAX_CITING = 3) ; cas ajouté dans `router.test.mjs`.

**Ask First:**
- Tout changement de `line-height` ou de `height` d'un bouton ou d'un champ pour faire tomber son retrait vertical au pas (A1, A2).
- Toute réécriture d'une entrée H (annexe, section 5) sans cas mesuré.
- Un retour à la ligne nouveau dans un titre de sujet, de forum ou un en-tête, à une largeur commune.
- Tout écart hors espacement dans une suite existante (taille de texte, couleur, rayon) : c'est le signe d'une règle battue ou retirée par erreur.

**Never:**
- La gouttière de la grille Bootstrap (`.row`, `[class^=col-]`) et la marge latérale de 16 px (épopée 9).
- Règle `:focus`. Tailles de texte, rayons, couleurs, cibles tactiles.
- Corriger les médias `(max-width: 768px)` de l'éditeur du kramail ; on les signale seulement (déjà consignés par l'entrée 8).
- Git modifiant l'arbre, l'index ou le stash. Aucune requête vers le site réel. Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Corps de panneau | `.panel-body` natif (≥768) et mobile, plateau, kramail, modale | retrait 16 px partout | forum : 8 16 8 (A6) ; `grid-transformed` : 8 3 gardé (E10) |
| En-tête de panneau | `.panel-heading` natif (≥768) | 12 px 16 px, hauteur 40 → 44 | mobile : 12 16 (8525, 9181) et écart 8 |
| Cellules du forum | sous-forum et index, ≥768 | 8 px sur les 4 côtés, `th` de `#topics` aussi | aucun titre ne passe à la ligne à 768 |
| Boutons | `.btn` ≥768, mobile | horizontal au pas ; vertical 6 gardé (E1) ; hauteur 34 / ≥ 44 | `.btn-xs`, `.btn-sm`, BBCode égaux à la base |
| Interstices | aide de l'ordre, boutons des messages, liens des panneaux mobiles, pied de modale, import | 4 ou 8 px | marges `auto` : égales à la base (E11 à E13) |
| Champs | `.form-control` | horizontal 8 ; vertical 6 gardé (E2) ; mobile 12 inchangé | n/a |
| Jetons redéfinis | `--kr-space-1..4` à 5/9/13/17 px | chaque élément R et N suit son jeton | littéral restant : FAIL nommé |
| Plateau | colonnes `[id^=col-]` à 375, 768, 1280 | x et largeur égaux à la base | rangée intérieure plus étroite de 2 px : admise (A7) |
| Seuil | 767 / 768 / 769, bascule dans les deux sens | valeurs du support de part et d'autre | n/a |

</frozen-after-approval>

## Code Map

- Inventaire complet (ligne, média, sélecteur, valeur, cible, raison, cas mesuré) : annexe `story-grille-d-espacement-au-pas-de-4-px-inventaire.md`.
- CSS, jetons : `:root` l.34-39 `--kr-space-1..6` (4/8/12/16/24/32) ; `--mobile-spacing-*` déjà au pas.
- CSS, réécritures : l.2099-2100 (aide de l'ordre, liste combinée) ; l.4308, 4316, 4327, 4575, 4577 (mobile, « Panels responsive » et « Items de commerce ») ; l.14586, 14727 (sous-forum, ≥768) ; l.15082, 15176 (index du forum, ≥768) ; l.15352, 15551 (forum mobile).
- CSS, règle de rôle : après `.form-control.form-control` (l.644-649, section 4. FORMS).
- Template : `kraland-userscript-template.js` l.8720 (`#kr-config-import-btn`, `margin-left:6px`).
- Natifs : Bootstrap 3.3.7 `tests/e2e/vendor/` (`.btn` 6/12, `.panel-body` 15, `.panel-heading` 10/15, `.modal-footer .btn+.btn` 5) ; feuille dataTable de la fixture `sous-forum-debuter.html` l.29 (`8px 10px`).
- Tests :
  - `tests/e2e/typographie-formes.mjs` : en-tête l.56 « Hors de ces tickets : espacement (4.9) » à retirer ; liste `KR_FRAG` l.72-73 ; `const FRAG` l.109 ; modèle du fragment `rayons` (l.1177-1185 `COMMIT_RAYONS`, `if (on('rayons'))` l.1372) ; fragments qui comparent au bundle de base : `boutons`, `compact`, `echelle`, `echelle-forum`, `rayons`.
  - `tests/e2e/lib/variantes.mjs` : modèle `RAYONS_TICKET48` l.246 et `AVANT_TICKET48` l.258.
  - `tests/e2e/kramail-redaction.mjs` : `bundleAvant()` et masques sur le bundle avant (l.216-234), fragment `regression` (l.1289-1304).
  - `tests/e2e/forum-index.mjs` : masques `AVANT_TICKET4x` posés sur le bundle de `81512a3` (l.92).
  - `tests/e2e/cybermonde-carte.mjs` (fragment panneaux : position, largeur, couleurs contre le bundle avant) ; `palette-nation.mjs` (BASELINE4/5) ; `sous-forum.mjs` (`checkNewmsg`, hauteurs) ; `modale-ordre.mjs` ; `plateau-qualite-usage.mjs` ; `plateau-profil-mobile.mjs` ; `messages-v3.mjs` ; `forum-mobile.mjs`.
  - `tests/e2e/lib/router.mjs` : registre l.78 (fragment `espacement`), KEYWORDS l.140-165, `MAX_CITING` l.196 ; `tests/e2e/router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [ ] Fragment `espacement` dans `typographie-formes.mjs`, `COMMIT_ESPACEMENT = '62fd47d'`, ajouté à `KR_FRAG` et au registre du routeur -- rouge sur `62fd47d`.
- [ ] `kraland-theme.css` : les 13 déclarations de l'annexe, section 1, réécrites au jeton ; bloc de rôle de la section 3.
- [ ] `kraland-userscript-template.js` l.8720.
- [ ] Masque `ESPACEMENT_TICKET49` / `AVANT_TICKET49` dans `lib/variantes.mjs` ; suites cassées mises au masque ; fragments de base de `typographie-formes.mjs` ajustés (Implementation Notes).
- [ ] Routeur : mot-clé et cas de `router.test.mjs`.
- [ ] Entrées H de l'annexe, section 5, consignées dans `deferred-work.md` pour l'entrée 10.
- [ ] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when le fragment `espacement` tourne aux largeurs et variantes communes, then chaque `padding`, `margin`, `row-gap` et `column-gap` calculé des éléments R et N de l'annexe est un multiple de 4 entre 0 et 32 px, égal au jeton attendu. Chaque exception E est égale au bundle de `62fd47d`.
- Given les jetons redéfinis, when le fragment tourne, then chaque élément R et N suit la nouvelle valeur.
- Given les boutons de la liste de l'entrée 2, when on mesure, then 34 px de haut à ≥ 768 px et au moins 44 px sur mobile. Les colonnes du plateau gardent x et largeur de la base à 375, 768 et 1280 px.
- Given `kraland-theme.css`, when on cherche les 13 littéraux de l'annexe dans leurs sélecteurs, then on n'en trouve aucun (contrôle statique du fragment).
- Given `npm run test:changed` et `npm run test:router`, when ils tournent, then 0 FAIL et routeur conforme.

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : le retrait vertical de 6 px du `.btn` à ≥ 768 px est gardé (E1). Raison : l'entrée 2 impose 34 px, soit 6 + 20 + 6 + 2 de bordure. Un 8/16 demande un `line-height` de 16. La simulation a fui : bâtiments 74 → 78, grille d'actions 34 → 34,8, boutons des en-têtes 14 → 18, sous-forum 34 → 35. L'horizontal 12 est déjà au pas.
  - A2 : le vertical 6 du `.form-control` (l.647, `.6rem`) est gardé (E2). Raison : le champ s'aligne sur le bouton de 34 px dans les `input-group`. L'horizontal 8 est déjà au pas. La valeur mobile (12, l.9885) est déjà au pas.
  - A3 : règle d'arrondi au multiple de 4 le plus proche. À égalité, un retrait de cadre monte et un interstice descend. 15 → 16, 5 → 4, 6 (gap) → 4, 10 (gap, margin) → 8, 10 (retrait d'en-tête) → 12. Raison : H11.2 laisse le choix « selon les espacements voisins ». Un cadre qui rétrécit tasse son contenu ; un interstice qui grandit allonge la page.
  - A4 (mis à jour le 2026-10-24, décision de l'orchestrateur) : les cellules du sous-forum et de l'index passent à 4 px en vertical et 8 px en horizontal (6/10 → 4/8, `var(--kr-space-1) var(--kr-space-2)`). Les `th` de `#topics` passent de 8/10 à 8/8. C'est une exception à A3, pour la densité : à 8/8, les seuils de L6 cassaient (ligne de permanent à 62 px pour une limite de 60, 1er sujet à 693 px pour une limite de 684). Ces seuils sont des décisions produit antérieures et ils priment. L'index suit le sous-forum, pour garder la parité vérifiée par `forum-index`. Avec 8/12, des titres du sous-forum passaient à la ligne à 768 px (rangée 56,4 → 80,4 px). La règle `th` porte la garde du sous-forum : sans elle, le `#dt` de la fixture des composants passait de 0 à 8/12. (Ancienne version : 8/8 sur les 4 côtés, chaque rangée gagnait 4 px de haut.)
  - A5 : l'en-tête natif passe à 12 px 16 px (40 → 44 px de haut). Raison : il s'aligne sur les en-têtes mobiles de la peau déjà à `12px 16px` (l.8525, l.9181). Le 10 d'un retrait de cadre monte (A3).
  - A6 : le corps de panneau du forum passe de `8px 15px 10px` à `8px 16px 8px`. Raison : 15 → 16 (A3). Le bas s'aligne sur le haut, ce qui évite un 12 qui creuserait les listes de sujets.
  - A7 : `.panel-body a` (l.4571, mobile) et `.panel` (l.4307, mobile) sont des règles larges. Elles touchent tous les liens des panneaux mobiles (accès rapides, pagination dataTables, mentions, actions de fil) et tous les panneaux mobiles. On les réécrit telles quelles, sans les restreindre : c'est leur portée d'origine. La rangée intérieure du plateau (`#player-vitals-section`, `#player-actions-section`) perd 2 px de large (retrait 15 → 16 de chaque côté). Les boutons d'action perdent 1 px. Les colonnes `[id^=col-]` ne bougent pas.
  - A8 : `.btn-xs`, `.btn-sm`, barre BBCode du kramail (0 5) et tuiles du mini-profil (6 2 4, écart 10) sont gardés (E3 à E9). Raison : l'entrée 2 les exclut (BBCode) ou l'entrée 4 les fixe (compact), ou ce sont des tuiles denses dont la hauteur (74,4 / 88,8) dépend de ces valeurs.
  - A9 : les 21 déclarations non atteintes (annexe, section 5) sont laissées telles quelles et consignées pour l'entrée 10. Raison : sans élément mesuré, une réécriture n'a pas de cas mesuré.
  - A10 : le `.btn` mobile (vertical 12, `line-height` 20) est déjà au pas, il reste inchangé.
  - A11 : le bloc de rôle est dans la liste combinée, mais il est inerte sur mobile : les `!important` mobiles de la peau le battent (mesuré égal à 375 et 767 px). Il est écrit ainsi par la règle « jamais en global ». Cette liste combinée n'a pas de rôle mobile propre. Mise à jour du 2026-10-24 (revue, AGENTS.md prime sur l'annexe) : la règle `th` du tableau du sous-forum quitte la liste combinée pour un bloc `@media (min-width: 768px)`. Sa garde s'écrit `:where(html body.page-forum.kr-subforum) table.dataTable thead th`. Le reste du sélecteur (0,1,3) suffit à battre le natif, sans `!important` : mesuré 8/8 sur `#topics` à 768 et 1280 px, `#dt` des composants toujours à 0. La liste combinée garde 3 règles de rôle.
  - A12 : l.4312 (`.panel-heading` mobile `10px 15px !important`) n'est pas touchée. Raison : elle est toujours battue (l.7835, forum, 8525, 9181). Sans effet mesuré sur les fixtures, elle passe en H.
  - A13 : `.kr-tools-plus` passe de 0 10 à 0 8, et non à 12. Raison : ses voisins de la barre BBCode mobile sont à 0 8.
- Comptes : 13 déclarations CSS, 4 règles de rôle, 1 déclaration du template ; 14 exceptions ; 21 entrées H. Éléments dont l'espacement calculé change, toutes fixtures et largeurs : cellules 288, boutons 64, liens `.panel-body a` 44, en-têtes 40, corps de panneau 33, panneaux 12.
- Décalages mesurés de `#content .row` (hauteur, simulation contre base) : sous-forum +52,5 à 768, +63 à 1280, +1 sur mobile ; index RP +17 à ≥ 768 ; plateau +2 ; plateau-typo +6 et +3 sur mobile ; réception +6 à ≥ 768 et -6 sur mobile (`mb` 5 → 4 des liens) ; répondre +4 ; modale d'ordre +2 ; composants +4 et +1 sur mobile.
- Détecteur : le bundle simulé contient `.panel-body{padding:var(--kr-space-4)}`. Sur `62fd47d`, `kr-space-` n'apparaît qu'à sa définition. D'où `AVANT_TICKET49 = bundle => !bundle.includes('.panel-body{padding:var(--kr-space-4)}')`. `ESPACEMENT_TICKET49` est la feuille miroir des sections 1 à 3 de l'annexe, en valeurs littérales. Il est posé seulement sur un bundle avant le ticket, sur le modèle de `RAYONS_TICKET48`.
- Fragment `espacement` : liste de cas `{ page, sélecteur, rôle, largeurs, propriétés }` tirée de l'annexe. Rôle R/N : valeur du jeton, multiple de 4, suivie sous jetons redéfinis. Rôle E : égal au bundle de base relevé dans le même test, sur les 4 `padding`, les 4 `margin`, `row-gap`, `column-gap` et la hauteur. Une propriété n'est retirée d'un cas E que si un cas R ou N la couvre déjà, ou si c'est une marge automatique (liste au Plan Change Log). Colonnes du plateau : x et largeur égaux à la base. Hauteurs des boutons de l'entrée 2 : 34 / ≥ 44. Contrôle statique : les 13 sélecteurs de l'annexe ne portent plus leurs littéraux ; les règles de rôle sont sans `!important`, dans la liste combinée sauf l'en-tête du tableau du sous-forum (ordinateur, A11).
- Fragments existants de `typographie-formes.mjs` qui comparent au bundle de base et casseront :
  - `boutons` (comparaison à `COMMIT_MODALES`, l.24 et l.98) : « tous les boutons à partir de 768 px égaux à la base ». Le pied de modale passe de `ml` 5 à 4, et la largeur de « ? Aide » de 60 à 58.
  - `echelle` : plateau égal à `COMMIT_TICKET6`.
  - `echelle-forum`.
  - `rayons` : géométrie.
  - Correction : poser `ESPACEMENT_TICKET49` sur leur bundle de base par `AVANT_TICKET49`. Les rayons, tailles et couleurs restent comparés tels quels.
- Autres suites probablement rouges, à mettre au masque et non à des valeurs codées :
  - `kramail-redaction#regression` (pixels contre le bundle avant de feature/next) ;
  - `forum-index` (masques sur le bundle de `81512a3`) ;
  - `sous-forum.mjs` `checkNewmsg` (hauteurs) ;
  - `modale-ordre` ;
  - `cybermonde-carte` panneaux (positions et largeurs) ;
  - `palette-nation` (BASELINE4/5) ;
  - `plateau-qualite-usage`, `plateau-profil-mobile`, `messages-v3`, `forum-mobile`.
  - La liste exacte sort du premier `test:changed` ; chaque suite touchée est consignée au Plan Change Log.
- Routeur : mot-clé `/--kr-space-\d/` vers `['typographie-formes', 'forum', 'sous-forum', 'kramail', 'plateau', 'modale-ordre', 'cybermonde']`, sans changer MAX_CITING = 3. Les hunks sur `.panel-heading` élargissent déjà aux 9 zones (l.162). Avant d'ajouter des sélecteurs au fragment, compter les suites qui citent `panel-body`, `kr-tools-plus`, `kr-order-help-toggle`, `dataTable` : si l'une passe à 4, écrire la liste dans `lib/variantes.mjs` (modèle `PROPRIETES_RAYON_TICKET48`).
- Risques :
  - Plateau : rangées intérieures -2 px et boutons d'action -1 px à 768 et 1280. Les colonnes restent fixes, mais les grilles d'actions sont serrées à 768 : vérifier qu'aucun libellé ne passe à la ligne, et le mini-profil plié et déplié à 375 et 700. `cybermonde-carte` et `palette-nation` comparent des positions au pixel.
  - Forum : le sous-forum s'allonge de 52 à 63 px (4 px par rangée, 150 cellules). C'est le plus gros décalage visible. Le seuil de 768 est le plus serré : un titre long de plus dans le site réel pourrait passer à la ligne là où la fixture tient. Les en-têtes passent de 40 à 44 px sur toutes les pages ordinateur.
  - `.panel-body a` mobile touche des liens hors plateau (pagination, mentions). Le `mb` de 5 → 4 raccourcit la réception de 6 px.
- Coupe proposée si le rouge/vert dérape (non créée) :
  - 4.9a forum : cellules, corps de panneau du forum, `th` dataTable, `kr-tools-plus`, boutons des messages ;
  - 4.9b panneaux et plateau : `.panel-body`, `.panel-heading`, `.panel`, `.panel-body a`, aide de l'ordre, pied de modale, import.

## Plan Change Log

- 2026-10-24, implémentation :
  - Fixture « composants » : `palette-nation-composants.html` (le `#dt` et les `[id^="bs-"]` y sont).
  - Marges automatiques (E11 à E13 : `.kr-msg-more`, `.kr-tools-plus`, Envoyer mobile) : `margin-left` est automatique, sa valeur calculée suit la largeur. Elle est retirée et remplacée par le bord droit de l'élément ; toutes les autres propriétés et la hauteur sont comparées à la base.
  - l.4508 (`.panel-body:has([id^="c"])`, 10 px, mobile) gagne sur `typographie-echelle.html` (`#champ-essai`). Elle reste en H, inchangée. Le cas `corps-champ` (E) la garde égale à la base, et ces corps sont retirés du cas R mobile de plateau-typo.
  - Cas R retirés, car la règle est battue dans la base comme dans le bundle testé : panneaux d'un accordéon (`.panel-group > .panel`, marge 0), corps du kramail (0), corps de la commande (`.panel-order`, 16 px littéral), corps d'une liste d'objets (`.list-group > .panel-body`, 10 px).
  - Hauteurs de l'entrée 2 : les boutons sans texte (icône seule) et les `.btn-xs` sont ignorés. Ce sont des exceptions E, et non des boutons de l'entrée 2. Mobile (revue du 2026-10-24) : le plancher de 44 px est mesuré sur les accès rapides (`.kr-quick-access-buttons > .btn`) et les actions rapides (`.mobile-quick-actions .btn`) du plateau, l'Envoyer de la rédaction et les `#bs-*` des composants, visibles sur mobile (46 px). La grille d'actions `.kr-action-grid` n'est pas rendue sur mobile dans la fixture du plateau : aucun élément visible à 375 ni à 767 px. Hors de la liste de l'entrée 2 sur mobile : barre BBCode (exclue par l'entrée 2), tuiles et bouton de gestion du mini-profil (E8, tuiles denses), `#bs-aide` (aide de l'ordre, déjà mesurée par le cas `aide`).
  - Contrôle statique : accepte plusieurs règles du même sélecteur dans la même media (`.panel-body` mobile porte aussi `var(--mobile-spacing-lg)`). Il exige la déclaration au jeton et l'absence du littéral.
  - Listes de cas, propriétés et déclarations attendues écrites dans `lib/variantes.mjs` (`CAS_ESPACEMENT_TICKET49`, `PROPRIETES_ESPACEMENT_TICKET49`, `DECLARATIONS_ESPACEMENT_TICKET49`). Raison : citées dans le fragment, `btn-xs`, `form-control`, `padding-left`, `list-group-item`, `panel-default` et `page-forum` passaient de 3 à 4 suites (MAX_CITING). Après déplacement : 3, aucun repère transverse nouveau.
  - Test du routeur : `tests/e2e/lib/router.test.mjs`. Les hunks sur le template et sur un littéral élargissent à tout : seuls les hunks CSS au jeton sont vérifiés (7 zones exactes).
  - Masque miroir : la règle de `#kr-config-import-btn` est gardée sur ordinateur seulement, là où le bouton est mesuré.
  - Jetons redéfinis : sur la base, `liens-marge` et le pied de modale passent par coïncidence (5 px de la base = `--kr-space-1` redéfini à 5). Le contrôle aux jetons par défaut les met en rouge.
  - Colonnes du plateau : le cas compare aussi les quatre `padding` à la base, en plus de x et largeur. Sans eux, la contre-épreuve `#col-left` `padding-left: 16px` restait verte (le cadre ne bouge pas).
  - Suites mises au masque `ESPACEMENT_TICKET49` / `AVANT_TICKET49` : `forum-index#hors-perimetre`, `kramail-redaction#regression`. Les fragments de base de `typographie-formes.mjs` (`boutons`, `echelle`, `echelle-forum`, `rayons`) et les autres suites listées sont restés verts sans masque.
  - Écart à A4 : 8/8 → 4/8, seuils L6 (lignes permanentes ≤ 60 px, 1er sujet ≤ 0,95 × 720) ; décision orchestrateur 2026-10-24. Les cellules de l'index suivent la même règle. Le fragment `espacement`, le masque `ESPACEMENT_TICKET49` et la contre-épreuve des cellules sont à jour. Les décalages de hauteur du sous-forum et de l'index donnés plus haut (Comptes, Décalages, Risques) datent de la simulation à 8/8 et n'ont pas été remesurés.
  - Revue du 2026-10-24, exceptions E : chaque cas E compare désormais les 4 `padding`, les 4 `margin`, `row-gap`, `column-gap` et la hauteur à la base. Les cas `bbcode` et `bbcode-groupe` sont fusionnés (toutes largeurs). Propriétés retirées, avec leur raison :
    - colonnes du plateau : hauteur (elle suit les rangées R du contenu ; x et largeur restent comparés) ;
    - boutons du plateau sur mobile (accès et actions rapides) : `margin-bottom`, `row-gap`, `column-gap`, couverts par les cas R `liens` et `liens-marge` (`.panel-body a`) ;
    - `.kr-msg-more` : `row-gap`, `column-gap` (cas R `messages`) et `margin-left` automatique ;
    - `.kr-tools-plus` : `padding-left`, `padding-right` (cas R `plus`) et `margin-left` automatique ;
    - pied de modale, `.btn + .btn` : `margin-left` (cas N `pied`) ; le premier bouton compare tout ;
    - `#kr-config-import-btn` : `margin-left` (cas R `import`) ; les autres `.btn-sm` comparent tout ;
    - `#bs-aide` retiré des `#bs-*` : c'est l'aide de l'ordre (cas R `aide`).
  - Revue du 2026-10-24, règle `th` (l.666) : écart à l'annexe, section 3. La règle passe de la liste combinée à `@media (min-width: 768px)` avec la garde `:where(html body.page-forum.kr-subforum)` (AGENTS.md). Spécificité suffisante, aucun `!important` ajouté (A11). Masque `ESPACEMENT_TICKET49` et déclaration attendue du contrôle statique mis à jour.
  - Contre-épreuves ajoutées : marge d'une exception mutée (BBCode `margin-top: 3px`, posé sous `:is(#kr-mutation, …)` pour battre la peau ; grille d'actions `margin-bottom: 7px`), hauteur mobile sous 44 px (accès rapides à 40 px), `th` posé sur mobile (`9px`, `#dt` touché). La contre-épreuve « garde du `th` retirée » vise le nouveau sélecteur.

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes forum sous-forum kramail plateau modale-ordre cybermonde palette-nation` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, codes de sortie lus. (`test:all` : orchestrateur.)
- Rouge avant : `KR_SCRIPT=<bundle de 62fd47d> KR_FRAG=espacement` -- FAIL attendus sur chaque élément R et N, sur le suivi des jetons redéfinis et sur le contrôle statique ; exceptions, hauteurs de boutons et colonnes du plateau vertes.
- Contre-épreuves (copies mutées du bundle, `KR_SCRIPT`, `KR_FRAG=espacement`). Chacune doit donner au moins un FAIL nommé :
  - l.14586 remise à `6px 10px` ;
  - bloc de rôle retiré ;
  - `.panel-heading` du bloc remis à `10px 15px` ;
  - l.4327 remise à un littéral `16px`, qui ne suit plus le jeton redéfini ;
  - l.4577 remise à `5px` ;
  - template l.8720 remis à `6px` ;
  - E1 : `.btn` passé à `8px 12px` ;
  - E8 : mini-profil passé à `8px 4px` ;
  - garde du `th` dataTable retirée (`#dt` des composants touché) ;
  - colonne du plateau décalée (`#col-left` `padding-left: 16px`).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css l.14606, l.15102 ; variantes.mjs | Cellules à 4/8 au lieu de « 8 px sur les 4 côtés » du bloc figé, sans renégociation humaine | fondé | décision Arnaud (revue-manuelle) | 8/8 dépasse les seuils L6 (62 px > 60 ; 693 > 684) ; 4/8 gardé en attendant |
| 2 | quick | variantes.mjs, `CAS_ESPACEMENT_TICKET49` | Exceptions E sans hauteur ni toutes les propriétés | fondé | patch (fixed) | Always : « propriété par propriété et en hauteur » |
| 3 | quick | typographie-formes.mjs, `hauteurs` | Plancher de 44 px mobile non mesuré sur le plateau, la rédaction et `#bs-*` | fondé | patch (fixed) | critère 3 |
| 4 | quick | kraland-theme.css l.666 | Règle `th` ordinateur dans la liste combinée, garde `html body…` hors `:where()` | fondé | patch (fixed) | AGENTS.md prime sur l'annexe |

## Result

Construit le 2026-10-24. 13 déclarations réécrites aux jetons d'espacement, 3 règles de rôle des natifs dans la liste combinée, l'en-tête du sous-forum sur ordinateur sous `min-width: 768px`, 1 déclaration du template. Revue : 3 patchs corrigés (exceptions comparées propriété par propriété et en hauteur, plancher de 44 px mesuré sur mobile, règle `th` conforme à AGENTS.md). Constat 1 en attente d'Arnaud : cellules du forum à 4/8 au lieu de 8/8 (seuils L6), consigné dans revue-manuelle.md. Preuves : `npm run build` OK, `lint:css` 0, `lint:js` 0, `test:router` conforme, `test:all` 10042 ok, 0 FAIL.
