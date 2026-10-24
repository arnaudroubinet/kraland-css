---
title: "Trois rayons : 4 px, 8 px et plein"
type: 'feature'
ticket: '8'
created: '2026-10-24'
status: 'built'
baseline_revision: '5ff22d3'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-inventaire.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le thème déclare 262 rayons (230 `border-radius`, 32 longhands de coin) et le template 6 autres. On y trouve des dizaines de valeurs distinctes : 3, 4, 5, 6, 8, 10, 12, 16, 20 px, 50 %, `.5rem` (qui vaut 5 px, car `html` est à 10 px), `--mobile-radius`. Les mêmes rôles n'ont pas le même rayon : « Envoyer » du forum à 8 px, boutons à icône du kramail à 10 px, cartes du forum et du kramail à 12 px. Les jetons `--kr-radius-sm/md/full` de l'entrée 1 existent mais ne servent qu'au compact (entrée 4). DESIGN.md › Shapes (H6.3) veut trois rayons, identiques sur ordinateur et mobile.

**Approach:** Classer chaque déclaration par rôle dans l'annexe d'inventaire : contrôle `var(--kr-radius-sm)`, conteneur `var(--kr-radius-md)`, pastille et étiquette `var(--kr-radius-full)`, exception gardée, ou 0 et coin intérieur inchangés. Réécrire chaque déclaration d'origine en place (P1 option 4), sans ajouter de règle qui la bat. Couvrir les natifs de Bootstrap sans règle d'origine dans la peau par une règle de rôle commune. Retirer `--kr-radius`, `--mobile-radius` et `--mobile-radius-lg` une fois leurs consommateurs réécrits. Prouver le tout dans un fragment `rayons` de `typographie-formes.mjs`.

## Boundaries & Constraints

**Always:**
- L'inventaire de l'annexe fait foi. Chaque ligne C4, K8 et P y est réécrite au jeton de son rôle. Les lignes X et Z gardent leur valeur. Un écart à l'inventaire est consigné au Plan Change Log avec sa raison.
- P1 option 4 : on réécrit la déclaration d'origine, sans ajouter de règle concurrente plus spécifique ni de `!important` nouveau. Une déclaration déjà en `!important` garde ce `!important` avec la valeur du jeton.
- Les longhands de coin gardent leur forme. `S S 0 0` reste un rayon aux coins du haut, `0 S S 0` un rayon aux coins de droite. Seule la valeur non nulle passe au jeton.
- Natifs de Bootstrap (annexe, section 3) : une seule règle de rôle dans la liste combinée `@media (max-width: 767px), (min-width: 768px)`. `.label` et `.badge` sont ajoutés à la règle existante l.695-702. Les coins intérieurs natifs des groupes restent à 0.
- Les rayons sont identiques sur ordinateur et mobile. Une règle commune s'écrit dans la liste combinée, jamais en global. Une règle mobile reste en `max-width: 767px` et une règle ordinateur en `min-width: 768px`.
- Template : les 6 déclarations de l'annexe, section 2, passent au jeton dans la même forme (`cssText` ou `setProperty(…, 'important')`).
- Exceptions gardées à la valeur de la base, mesurées comme égales au bundle de `5ff22d3` : croix directionnelle (rayons asymétriques), avatars et images, vignettes de pièce, cercle `.c100`, jauges, barres de défilement, dessin du hamburger.
- Mesures dans un fragment `rayons` de `tests/e2e/typographie-formes.mjs`. Fixtures : plateau, forum, sous-forum, kramail, modale d'ordre. Largeurs communes : 375, 767, 768, 769, 1280, 1440, 1920. Variantes : Kraland clair et Empire Brun sombre. Le rayon calculé est relevé aux quatre coins. Les jetons redéfinis (`--kr-radius-sm` 7px, `--kr-radius-md` 11px) sont suivis par chaque élément. Bascule 767/768 testée dans les deux sens dans le même onglet.
- Rouge avant sur le bundle de `5ff22d3` (`KR_SCRIPT`), contre-épreuves comptées.
- forum-index : parité des rayons entre index et sous-forum ajoutée aux composants comparés.
- Les écarts attendus des autres suites passent par un masque miroir hors couche dans `tests/e2e/lib/variantes.mjs`, posé sur le bundle de base. Ces suites ne reçoivent pas de valeurs codées en dur.
- Routeur : mots-clés pour les rayons, sans qu'une classe soit citée par 4 suites (MAX_CITING = 3) ; cas ajouté dans `router.test.mjs`.

**Ask First:**
- Toute réécriture qui changerait la forme d'une exception X (croix, avatar, image, jauge, barre de défilement).
- Tout écart de pixels hors rayon dans une suite existante (taille, espacement, couleur) : c'est le signe d'une règle battue ou retirée par erreur.
- Retirer un doublon (Bootbox l.1191-2036 contre l.6856-7659, cartes du forum l.7835 et l.8529) au lieu de le réécrire.

**Never:**
- Règle `:focus`.
- Toucher à la carte de section (épopée 5), à la barre fixe d'envoi du kramail (épopée 7), aux tailles, couleurs, espacements et cibles tactiles.
- Corriger les médias `(max-width: 768px)` et `(min-width: 769px)` de l'éditeur du kramail (l.10068-10535). On les signale seulement, pour l'entrée 10.
- Git modifiant l'arbre, l'index ou le stash. Aucune requête vers le site réel. Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Contrôles | boutons (dont « Envoyer » du forum, boutons à icône du kramail, votes, pagination), champs, sélecteurs, onglets, barre BBCode, toutes largeurs | 4 px aux coins extérieurs | coin intérieur d'un groupe : 0 |
| Conteneurs | panneaux, cartes du forum et du kramail, modales, menus, alertes, `well`, en-têtes repliables | 8 px ; menu en feuille du bas : 8 8 0 0 | en-tête et pied de panneau : 7 px aux coins de leur bord |
| Pastilles | `.label`, `.badge`, pastilles du forum et de la modale d'ordre, boutons ronds | rayon calculé ≥ hauteur / 2 (plein) | n/a |
| Exceptions | croix, avatars, images, vignettes, jauges, barres de défilement | égales au bundle de `5ff22d3` | n/a |
| Jetons redéfinis | `--kr-radius-sm` 7px, `--kr-radius-md` 11px | chaque élément C4 et K8 suit son jeton | littéral restant : FAIL nommé |
| Seuil | 767 / 768 / 769, bascule dans les deux sens | mêmes rayons de part et d'autre | n/a |

</frozen-after-approval>

## Code Map

- Inventaire complet (ligne, média, sélecteur abrégé, valeur actuelle, rôle, cible) : annexe `story-trois-rayons-4-px-8-px-et-plein-inventaire.md`.
- CSS, jetons : `:root` l.18 `--kr-radius: .5rem`, l.32-34 `--kr-radius-sm/md/full`, l.140 `--mobile-radius: 8px`, l.141 `--mobile-radius-lg: 16px` (aucun consommateur). Règle `.label`/`.badge` l.695-702.
- CSS, blocs principaux : Bootbox ordinateur l.1191-2036 et mobile l.6856-7659 (doublons) ; barre BBCode l.1500-1628 et l.7425-7553 ; plateau et croix l.6436-6703 ; forum l.7835-8529, 9197, 13544-15614 ; kramail l.9064-10692 (éditeur l.10068-10535) ; modales l.4694, 9408-9423 ; cartes l.12009-12679.
- Template : `forum-new-topic-fab` l.5579 ; `.kramail-character-dropdown` l.5793 ; `.kramail-character-selector` l.5885 ; `forceOrderModalGridLayout` l.9339 (rayon l.9419) ; `fixDropdownPosition` l.9653 (rayon l.9671).
- Tests : `tests/e2e/typographie-formes.mjs` (fragments `jetons` l.109-112, `compact` l.564-637 avec `MESURE_COMPACT`, constantes `COMMIT_*`) ; `tests/e2e/forum-index.mjs` (COMPOSANTS mobile l.255-266, bureau l.268-285, 'bouton →' seul à comparer un rayon) ; `tests/e2e/kramail-redaction.mjs` (fragment `regression` l.1274-1345, `poserJetonsRedefinis` l.220-235) ; `tests/e2e/lib/variantes.mjs` (masques `*_TICKET4x`, détecteurs `AVANT_TICKET4x`) ; `tests/e2e/lib/router.mjs` (registre l.78, KEYWORDS l.128-160, `MAX_CITING` l.191) ; `tests/e2e/router.test.mjs` (modèle de cas l.132-140).
- Fixtures : `typographie-formes.html`, `typographie-echelle.html`, `plateau-qualite-usage.html`, `forum-sujet.html`, `forum-index-rp.html`, `typographie-forum-redaction.html`, `sous-forum-debuter.html`, `kramail-reception.html`, `kramail-envoi.html`, `kramail-lecture.html`, `kramail-nouveau.html`, `modale-ordre/plateau.html`.

## Tasks & Acceptance

**Execution:**
- [x] Fragment `rayons` dans `typographie-formes.mjs`, `COMMIT_RAYONS = '5ff22d3'` (option `KR_SCRIPT_AVANT_RAYONS`) ; ajouté au registre du routeur l.78 -- rouge sur `5ff22d3`.
- [x] `kraland-theme.css` : lignes C4, K8 et P de l'annexe réécrites au jeton ; règle de rôle des natifs ; `.modal-content` en liste combinée ; `--kr-radius`, `--mobile-radius`, `--mobile-radius-lg` retirés.
- [x] `kraland-userscript-template.js` : les 6 déclarations de l'annexe, section 2.
- [x] Fragments `jetons` et `compact` mis à jour ; parité des rayons dans `forum-index.mjs` ; masque `RAYONS_TICKET48` / `AVANT_TICKET48` dans `lib/variantes.mjs` si kramail-redaction ou une autre suite casse.
- [x] Routeur : mot-clé et cas de `router.test.mjs`.
- [x] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when le fragment `rayons` tourne aux largeurs et variantes communes, then chaque élément de l'inventaire a le rayon calculé de son rôle, et les exceptions sont égales au bundle de `5ff22d3`.
- Given `kraland-theme.css` et le template, when on cherche une valeur de rayon littérale non nulle hors exceptions X, then on n'en trouve aucune (contrôle statique du fragment).
- Given `npm run test:changed` et `npm run test:router`, when ils tournent, then 0 FAIL et routeur conforme.

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : les natifs de Bootstrap sans règle dans la peau (`.btn*`, `.label`, `.badge`, `.panel`, `.alert`, `.well`, `.dropdown-menu`) reçoivent une règle de rôle. Ce n'est pas battre une règle de la peau, P1 option 4 tient. Raison : sans elle, H6.3 n'est pas tenu sur les boutons natifs (3 et 6 px).
  - A2 : `--kr-radius` et `--mobile-radius` sont retirés après réécriture, `--mobile-radius-lg` aussi (mort). Le fragment `jetons` cesse d'attendre `'--kr-radius': '.5rem'` et vérifie l'absence des trois variables. Raison : la description du ticket les dit « repris par les jetons ».
  - A3 : les boutons ronds (50 %) passent à plein. Raison : même rendu pour un carré, un seul vocabulaire.
  - A4 : barre BBCode et champ forment un champ composé, à 4 px aux coins extérieurs. Les coins intérieurs restent à 0. Raison : le champ est un contrôle.
  - A5 : les onglets (dont ceux de la modale d'ordre, template l.9419) sont des contrôles à 4 px. Raison : ce sont des cibles cliquables, pas des conteneurs.
  - A6 : la recherche en pilule (l.9197) et le tri en pilule (l.14055) passent à 4 px. Raison : ce sont des champs et boutons, pas des étiquettes. DESIGN.md réserve le plein aux pastilles.
  - A7 : jauges et barres de défilement sont gardées. Raison : H6.3 ne les cite pas, elles suivent la logique de Q12 (forme fonctionnelle).
  - A8 : l'en-tête repliable et `.panel-collapse` sont des conteneurs à 8 px. Raison : ils font partie du panneau.
  - A9 : le titre-sélecteur du kramail (template l.5885) est un contrôle à 4 px. Raison : il ouvre un menu.
  - A10 : tuiles, pièces et liens-lignes de `.panel-body` (l.4543, 6604-6657) sont des contrôles à 4 px. Raison : chacun est une cible.
  - A11 : la barre fixe d'envoi du kramail reste à 0 (épopée 7). « Envoyer » du forum passe de 8 à 4 px. Raison : périmètre de l'épopée 7 ; la description du ticket cite « Envoyer » du forum.
  - A12 : l'infobulle `.kr-icon-cell::after` est un conteneur à 8 px. Raison : c'est une surface de texte.
  - A13 : les doublons (Bootbox, cartes de ligne du forum l.7835 et l.8529, `.modal` l.1287 battu par l.7319, bouton l.5500 battu par l.4085) sont réécrits au jeton. Leur retrait est reporté à l'entrée 10. Raison : retirer un doublon peut révéler un défaut natif ; ce n'est pas l'objet du ticket.
  - A14 : `.list-group` et les infobulles et popovers natifs restent natifs. Raison : non cités par H6.3, rendu à 4 px déjà proche, risque de régression sur Matériel (ticket 6).
- Comptes de l'inventaire (CSS, sur 262 déclarations de rayon) : C4 102 (dont 12 déjà au jeton), K8 51, P 20, X 36, Z 53. Valeur calculée changée : C4 67, K8 28, P 14. Template : C4 2, K8 2, P 1, Z 1.
- X l.12292 `calc(var(--kr-radius) / 2)` : à réécrire en `calc(.5rem / 2)` (valeur égale) pour que le retrait de `--kr-radius` soit neutre. C'est le seul X touché.
- Fragment `rayons` : liste de cas `{ page, sélecteur, rôle, largeurs }` tirée de l'annexe. Le rôle donne l'attendu : C4 4 px (7 px sous jeton redéfini), K8 8 px (11 px), P rayon ≥ hauteur / 2, X égal au bundle de base (relevé sur `COMMIT_RAYONS` dans le même test). Les coins attendus à 0 sont relevés eux aussi. Contrôle statique : aucune valeur littérale non nulle de `border-radius` dans le CSS et le template hors lignes X listées et hors coins à 0.
- Fragment `compact` : pour les rayons, la comparaison « égal à la base » des éléments non visés (mobile 375/767, autres boutons des messages) devient « valeur du rôle ». Le reste de l'empreinte (taille, hauteur, couleur) reste égal à la base. Consigné dans le fragment par le numéro du ticket.
- forum-index : ajouter `border-*-radius` aux composants de parité (ligne, panneau, en-tête, bouton du titre) en mobile et bureau. La parité 'bouton →' tient (l.15013/15125 et l.14251/14665 passent toutes au jeton).
- kramail-redaction `regression` : écart de pixels attendu (cartes 12 → 8, boutons 10 → 4, champs, panneaux). Masque miroir `RAYONS_TICKET48` posé sur le bundle avant par `poserJetonsRedefinis`, détecteur `AVANT_TICKET48` (présence de `--mobile-radius` sur `:root`), sur le modèle de `ECHELLE_FORUM_AVANT`. Le masque n'est jamais posé sur le bundle courant.
- modale-ordre l.428 : la pastille arrondie attend un rayon ≥ hauteur / 2 ; le plein passe sans modification.
- Routeur : mot-clé `/border(?:-[a-z]+)*-radius|--kr-radius|--mobile-radius/` vers `['typographie-formes', 'kramail']` ; `forum-index` est déjà routé par ses classes. Avant d'ajouter, compter les suites qui citent les classes touchées (`btn`, `panel`, `label`, `badge`) : si l'une passe à 4, écrire la liste dans `lib/variantes.mjs` (modèle `LIGNE_OBJET_TICKET6`). Un hunk de jeton sur `:root` élargit au total, comme aujourd'hui.
- Constats à reporter à l'entrée 10 (deferred-work), sans correction : médias `(max-width: 768px)` et `(min-width: 769px)` de l'éditeur du kramail ; doublons Bootbox et cartes de ligne du forum ; `.kramail-character-dropdown` déclaré à la fois en `cssText` (template l.5793) et en CSS `!important` (l.9447).
- Taille du ticket : 262 + 6 déclarations, dont 110 changent de valeur, sur 4 zones. C'est faisable en un ticket car le travail est mécanique et l'inventaire est figé, mais c'est la limite haute. Coupe proposée si le rouge/vert dérape (non créée) : 4.8a = jetons, natifs, plateau, modales, accueil et template ; 4.8b = forum, sous-forum et kramail, avec forum-index et le masque kramail.

## Plan Change Log

- Rôle N4 ajouté au fragment `rayons` : pagination, onglets et `input-group-addon` natifs de Bootstrap (annexe, section 3, dernière ligne) restent à 4 px sans règle de la peau, donc ne suivent pas les jetons redéfinis. Le fragment les attend à 4 px dans toutes les passes.
- `.modal-content` placé dans la règle de rôle des natifs (même liste combinée, `@media (max-width: 767px), (min-width: 768px)`), sans `!important` : aucune règle de la peau ne le dispute sur ordinateur (seul le natif de Bootstrap, (0,1,0), 6 px, battu par la feuille adoptée). Sur mobile, la règle « Modal responsive » (~l.4728) garde son `!important` d'origine, au jeton (revue, constat 2).
- Non couvert, laissé au natif 4 px (hors inventaire) : `nav.navbar`.
- Accordéon sur ordinateur (revue, constat 1) : `.panel-group .panel` ((0,2,0), 4 px natif) battait le panneau ; règle `.panel-group .panel { border-radius: var(--kr-radius-md); }` ajoutée à la règle de rôle des natifs, sans `!important`. Rôle H ajouté au fragment : coins hauts de l'en-tête = rayon du panneau moins 1 px (panneau arrondi exigé). Cas `accordeon` (kramail-repondre.html) et `materiel` (#accordeon-essai).
- Template : 5 déclarations réécrites ; la 6e ligne de l'annexe (fil d'Ariane, `0`, rôle Z) reste inchangée comme prévu.
- Routeur, MAX_CITING : le fragment `rayons` aurait fait passer `border-radius`, `form-control` et `form-horizontal` de 3 à 4 suites. Les noms de propriété du contrôle statique sont écrits dans `lib/variantes.mjs` (`PROPRIETES_RAYON_TICKET48`) ; les sélecteurs des cas n'emploient plus `form-control` ni `form-horizontal` (`.input-group > select`, `.input-group > :is(input, select)`, `form > .panel`). Aucun repère ne dépasse 3 suites. `btn`, `panel`, `label`, `badge` : aucun ne passe à 4.
- forum-index : la parité des rayons tenait déjà sur le bundle de `5ff22d3` (0 FAIL avant comme après) ; pas de rouge avant pour cet ajout.
- kramail-redaction `regression` : 12 FAIL sur le bundle de base (boutons 10 et 5 → 4 px, sélecteur de personnage 8 → 4, `.navbar-toggle` mobile 12 → 4, panneaux 4 → 8, en-tête 3 → 7 sur ordinateur, lignes de `#topics` 12 → 8, cartes de lecture 4 et 12 → 8, pagination mobile 10 → 4, boutons à icône de la lecture 3 → 4). Masque miroir `RAYONS_TICKET48` et détecteur `AVANT_TICKET48` ajoutés dans `lib/variantes.mjs`, posés seulement sur le bundle « avant » ; rayons calculés identiques élément par élément avec le miroir (relevé à 1280, 375 et 320 px), puis fragment vert (12 ok).
- Exceptions X mesurées égales au bundle de `5ff22d3` (revue, constat 3) : `.kr-room-thumb` et son image, `.c100` avec `::before` et `::after` (mesure du pseudo-élément), `.mobile-gauge-compact-bar`, `.mobile-gauge-full-bar`, `.dashboard-card-avatar`, `img.img-circle`, `.kr-ministerial-card img`, image du personnage de l'accueil (fixture synthétique `ACCUEIL_RAYONS`). Barres de défilement : `::-webkit-scrollbar-thumb` a un style calculé mesurable ; poignées des barres BBCode (rédaction du forum, éditeur du kramail, modale) mesurées sur mobile, seul support où la peau leur donne un rayon (2 px) ; contre-épreuve : les 4 poignées passées à `var(--kr-radius-sm)` donnent 12 FAIL sur 12 cas `defilement`. La barre de page en sombre n'a pas de rayon. Contre-épreuve : `.c100:after` passé de `50%` à `var(--kr-radius-md)` dans une copie du bundle donne 16 FAIL nommés `horloge-apres`.
- Inventaire mesuré (revue, constat 4) : menu d'actions du kramail ouvert (mobile) et menus de la barre de navigation (ordinateur, mesurés fermés : rayon calculé sans rendu, coins hauts carrés comme dans la base) ; feuille du bas d'une barre BBCode de modale (mobile, menu ouvert par clic DOM) ; pied de panneau (K7) ; en-tête repliable, bascule et `.panel-collapse` de l'accordéon ; `well` ; `.kramail-character-dropdown` mesuré fermé ; bouton rond `.forum-new-topic-fab` (P, fixture des composants avec titre de forum à liens, pour ne pas lier `palette-nation.html` à la suite). Drapeau `cache` (5e élément d'un cas) pour mesurer un élément masqué ; clics DOM par page (`clics`), la barre de navigation fixe interceptant le clic de Playwright. Non mesurée : la feuille du bas de l'éditeur du kramail (`body.page-kramail .editeur-text .btn-toolbar .dropdown-menu`), sans fixture à menu de barre ; couverte par le contrôle statique. Autres boutons ronds (`.kr-mobile-close`, `.mini-chat-fab`, réglages du mini-profil) absents ou masqués dans les fixtures : idem.
- Commentaire `.navbar-toggle` (~l.4119) « Coins plus arrondis, style moderne » remplacé par « Contrôle : rayon des contrôles (4 px) » (revue, constat 6). Constats de l'entrée 10 consignés dans `deferred-work.md` (revue, constat 5).
- Vérification après revue (2026-10-24) : `npm run build` 0 ; `KR_FRAG=rayons` 1458 ok, 0 FAIL ; même fragment sur le bundle de `5ff22d3` : 668 FAIL ; `test:zone -- typographie-formes forum sous-forum kramail modale-ordre` 5372 ok, 0 FAIL ; `test:changed` 9012 ok, 0 FAIL ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant, `report-non-lu.mjs`). Aucun repère au-delà de MAX_CITING.

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes forum sous-forum kramail modale-ordre` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL. (`test:all` : orchestrateur.)
- Rouge avant : `KR_SCRIPT=<bundle de 5ff22d3> KR_FRAG=rayons` -- FAIL attendus sur les 110 valeurs changées et sur le contrôle statique.
- Contre-épreuves (copies mutées du bundle, `KR_SCRIPT`, `KR_FRAG=rayons`) : `--kr-radius-md` à 11px sans suivi (un littéral 8px réintroduit dans une carte) ; « Envoyer » du forum remis à 8px ; bouton à icône du kramail remis à 10px ; `.label` remis à .25em ; rayon de la croix passé au jeton ; avatar passé au jeton ; règle de rôle des natifs retirée ; template l.9419 remis à `'8px'` ; coin intérieur de la barre BBCode passé au jeton. Chacune doit donner au moins un FAIL nommé.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css, règle de rôle `.panel > .panel-heading` | Accordéon sur ordinateur : en-tête à 7 px dans un panneau resté à 4 px (`.panel-group .panel` natif 0,2,0) | fondé | patch (fixed) | `.panel-group .panel` passe au jeton conteneur ; cas accordéon mesuré |
| 2 | quick | kraland-theme.css, `.modal-content` | `!important` étendu à l'ordinateur par le déplacement dans la liste combinée | fondé | patch (fixed) | Never : pas de `!important` nouveau |
| 3 | quick | typographie-formes.mjs, `PAGES_RAYONS` | Exceptions X non mesurées contre la base (vignettes, `.c100`, jauges, avatars de carte, `.img-circle`, image ministérielle, barres de défilement) | fondé | patch (fixed) | Always : exceptions mesurées égales au bundle de `5ff22d3` |
| 4 | quick | typographie-formes.mjs, `PAGES_RAYONS` | Menus, feuille du bas, pied de panneau, repliables, boutons ronds, `well`, menu personnage du kramail non mesurés | fondé | patch (fixed) | critère 1 : chaque élément de l'inventaire |
| 5 | quick | deferred-work.md | Constats pour l'entrée 10 non consignés | fondé | patch (fixed) | Implementation Notes |
| 6 | quick | kraland-theme.css ~l.4116 | Commentaire « Coins plus arrondis » faux après 12→4 px | fondé | patch (fixed) | valeur réécrite |

## Result

Construit le 2026-10-24. 6 constats de revue corrigés : accordéon à 8 px sur ordinateur, `!important` de `.modal-content` limité au mobile, exceptions et éléments de l'inventaire mesurés, constats de l'entrée 10 dans deferred-work.md, commentaire corrigé. Orchestrateur : `kramail-redaction#regression` échouait sous `test:all` (2 pixels, écart 4, coin haut droit de `li.media.well` de « lecture 1280 »). Un A/A sous charge (bundle 4.8 des deux côtés) reproduit l'écart dans 4 passes sur 28 : c'est du bruit d'anticrénelage, sans lien avec le ticket. `PIX_MAX_CANAL` passe de 2 à 4, calibrage consigné dans le test. Preuves : `npm run build` OK, `lint:css` 0, `lint:js` 0, `test:router` conforme, `test:all` 9012 ok, 0 FAIL.
