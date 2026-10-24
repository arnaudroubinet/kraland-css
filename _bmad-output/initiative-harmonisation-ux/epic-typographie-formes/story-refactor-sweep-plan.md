---
title: 'Refactor sweep'
type: 'refactor'
ticket: '10'
created: '2026-10-24'
status: 'built'
baseline_revision: '00b0786'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/epic-typographie-formes.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-grille-d-espacement-au-pas-de-4-px-inventaire.md'
---

## Entrées de deferred-work.md visant l'épopée

Liste exigée par la description du ticket (rétro de l'épopée 2, action 4). « Traitée » renvoie au candidat retenu (R, M) ; « rejetée » donne la raison du report.

| # | Entrée (origine) | Lieu (base `00b0786`) | Statut | Raison |
|---|------------------|------------------------|--------|--------|
| D1 | Bootbox mobile, règles contradictoires (2.6) | bloc 1 l.1241-2097, bloc 2 l.7108+ | rejetée (déjà traitée) | Réglée par l'entrée 3 de l'épopée (modales Bootbox, Valider de taille normale). Rien à faire ici. |
| D2 | Médias de l'éditeur du kramail `(min-width: 769px)` / `(max-width: 768px)` (4.8) | l.10121-10294, l.10310-10612 | traitée (M1) | Changement voulu à 768 px, testé au seuil N−1/N/N+1. |
| D3 | Autres `(max-width: 768px)` cités par 4.8 (~1704, ~1982, ~11931) | l.1727, l.2005 (imbriqués dans ≤ 767) ; l.11954 (changelog) | traitée (R1, M2) | 1727 et 2005 valent 767 : aplatis sans changement de rendu. 11954 : changement voulu à 768 px. |
| D4 | Doublons Bootbox l.1191-2036 contre 6856-7659 (4.8) | l.1241-2097 contre l.7108-7700 | rejetée | Pas un doublon strict : le bloc 1 ne demande pas `mobile-mode` et sert seul quand la fenêtre est rétrécie sans `mobile-mode` (cas réel, gardé et testé par l'entrée 3). |
| D5 | `.modal` l.1287 battue par l.7319 (4.8) | idem | rejetée | Même raison que D4. |
| D6 | Cartes de ligne du forum, 1re et 2e version (4.8) | 1er bloc l.7870-8115, 2e bloc l.8565-8803 | traitée (R5) | La portée du 1er bloc est incluse dans celle du 2e (A3). 96 déclarations sur 98 sont doublées à l'identique ou battues. |
| D7 | Bouton l.5500 battu par l.4085 (4.8) | navbar-toggle l.5550-5568, battu par l.4131-4174 | traitée (R2) | Tout est mort sauf `order: 1`. |
| D8 | `.kramail-character-dropdown`, rayon déclaré deux fois (4.8) | template l.5793 (cssText), CSS l.9505 | traitée (R6) | Une seule source gardée : le template (A4). |
| D9 | 21 entrées H de l'espacement (4.9, annexe section 5) | l.599, 600, 769, 1625, 1626, 4312, 4508, 4646, 4654, 6852, 7034, 8011, 8695, 9441, 10476, 10477, 13107, 13241, 15615, 14109, 14114 | rejetée, sauf 4654 (padding traité par R4) et 8011 (retirée avec R5) | Les réécrire au pas change le rendu et demande un cas mesuré par entrée (Ask First du 4.9). Hors du périmètre « sans changement visuel voulu ». Détail en Implementation Notes. |

Entrées de deferred-work.md hors épopée (kramail 1.x, list-group 3.1, alerte info, Contacts 3.5, croix) : non concernées par ce ticket.

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** L'épopée a laissé du code mort et des seuils faux dans la peau. Des déclarations sont toujours battues par une règle `!important` de portée plus large : hamburger mobile, grille d'actions mobile, `.form-control` mobile, 1er bloc des cartes de ligne du forum. Un rayon est déclaré deux fois, dans le template et dans la feuille. Trois médias utilisent encore le seuil 768/769 au lieu de 767/768 : l'éditeur du kramail et le changelog. À 768 px exactement, le DOM est celui de l'ordinateur (pas de `mobile-mode`, posé quand `innerWidth < 768`), mais le CSS appliqué est celui du mobile. Deux autres `(max-width: 768px)` sont imbriqués dans un bloc ≤ 767 et ne valent rien de plus.

**Approach:** Deux familles. Les retraits (R1 à R6) ne changent aucun rendu : chacun est prouvé égal au bundle de `00b0786` par comparaison des styles calculés, élément par élément, pseudo-éléments compris. Les corrections de média (M1, M2) sont des changements voulus à 768 px seulement : ailleurs, égalité avec la base ; à 768, égalité avec le rendu de la base à 769. Elles sont testées à 767, 768 et 769, avec la bascule dans les deux sens. Tout le reste des entrées différées est reporté avec sa raison.

## Boundaries & Constraints

**Always:**
- Retraits retenus, et seulement eux : R1 (médias imbriqués l.1727 et l.2005), R2 (navbar-toggle l.5550-5568, sauf `order: 1`), R3 (grille d'actions l.13355-13357 et l.13361), R4 (`.form-control` l.4674-4678, `padding` et `font-size`, `height` gardée), R5 (cartes du forum, 1er bloc l.7870-8115, sauf `tr { box-shadow }` et `tr:active { transform }`), R6 (`border-radius` de `.kramail-character-dropdown` l.9505). Tout écart est consigné au Plan Change Log avec sa raison.
- Corrections de média : M1 (éditeur du kramail, l.10121 → `(min-width: 768px)`, l.10310 → `(max-width: 767px)`) et M2 (changelog, l.11954 → `(max-width: 767px)`).
- Chaque retrait est mesuré égal au bundle de `00b0786` (`KR_SCRIPT_AVANT_NETTOYAGE`, défaut : bundle construit depuis `00b0786`), sur toutes les propriétés calculées de chaque élément visible et de ses `::before` / `::after`.
- Hors de 768 px, les corrections de média sont aussi mesurées égales à la base. À 768 px, chaque élément de l'éditeur et du changelog est égal à la base relevée à 769 px, pour les propriétés déclarées par les blocs M1 et M2 (géométrie exclue, elle suit la largeur).
- Mesures dans un fragment `nettoyage` de `tests/e2e/typographie-formes.mjs`, `COMMIT_NETTOYAGE = '00b0786'`. Largeurs : 375, 767, 768, 769, 1280. Variantes : Kraland clair et Empire Brun sombre. Bascule 767 → 768 → 767 dans le même onglet.
- Une règle mobile reste en `max-width: 767px`, une règle ordinateur en `min-width: 768px`. Aucune règle nouvelle, aucun `!important` nouveau.
- Les écarts attendus des autres suites à 768 px passent par un masque miroir `MEDIAS_TICKET410` et son détecteur `AVANT_TICKET410` dans `tests/e2e/lib/variantes.mjs`, posés sur le bundle de base, jamais sur le bundle courant.
- Rouge avant sur le bundle de `00b0786`, contre-épreuves nommées et comptées.
- Routeur : MAX_CITING = 3 inchangé ; cas ajouté dans `router.test.mjs`.

**Ask First:**
- Tout écart mesuré non nul d'un retrait R1 à R6 : la déclaration n'était pas morte, on la remet.
- Toute réécriture d'une entrée H du 4.9.
- Toute fusion des blocs Bootbox (D4, D5).
- Toute question de produit listée dans les reports (tailles, graisses, cellules).

**Never:**
- Changer un rendu à une autre largeur que 768 px.
- Règle `:focus`. Tailles de texte, rayons, couleurs, espacements au sens du design.
- Modifier `kraland-userscript-main.user.js` à la main.
- Git modifiant l'arbre, l'index ou le stash. Aucune requête vers le site réel. Chrome 9222/9223. Ne jamais charger `/report`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Médias imbriqués (R1) | modale d'ordre à 375, 767, 768 | styles égaux à la base | n/a |
| Hamburger (R2) | plateau ≤ 767, repos, survol, focus | égal à la base ; `order` 1 | `order` perdu : FAIL nommé |
| Grille d'actions (R3) | plateau 375, 767 ; (768, `pointer: coarse`) | égal à la base | bloc `pointer: coarse` l.13334 intact |
| Champ mobile (R4) | `#champ-essai`, rédaction, kramail à 375 et 767 | hauteur 44, padding 12/16, police 16 | n/a |
| Cartes du forum (R5) | sous-forum et Staff (`/forum/staff`) à 375, 767 ; `tr:active` | ombre, transform, tout égal à la base | `/forum` racine non touché (`kr-page-forum-index`) |
| Menu du kramail (R6) | rédaction à 375, menu ouvert ; puis 1280 dans le même onglet | rayon md partout | n/a |
| Éditeur (M1) | rédaction et répondre à 767, 768, 769 | 767 = base ; 768 = base à 769 ; 769 = base | bascule 767 → 768 → 767 |
| Changelog (M2) | Interface, changelog ouvert, 767, 768, 769 | idem | pied en ligne à 768 |
| Hors 768 | toutes fixtures à 375, 1280 | égal à la base | n/a |

</frozen-after-approval>

## Code Map

- CSS (`kraland-theme.css`, base `00b0786`, 15685 lignes) :
  - R1 : l.1727 (ferme l.1991) et l.2005 (ferme l.2044), `@media (max-width: 768px)` dans `@media (max-width: 767px)` l.1241-2097 (« Fin @media (max-width: 767px) pour BOOTBOX ORDER MODAL »).
  - R2 : l.5550-5568, dans `@media (max-width: 767px)` l.5528 et `body.mobile-mode {` l.5529. Battu par l.4131-4174 (≤ 767 l.4081), tout en `!important`.
  - R3 : l.13353-13366 `.kr-action-grid > .btn, .kr-quick-access-buttons > .btn` (≤ 767 l.13340). Battu par l.4654 (≤ 767 l.4081) : `min-height: 44px !important; display: inline-flex !important; align-items: center !important; justify-content: center !important`. Bloc vivant à garder : l.13334 `(min-width: 768px) and (pointer: coarse)`.
  - R4 : l.4674-4678 (≤ 767). Battu par l.9905-9911 (≤ 767 l.9782), même sélecteur, plus loin : `font-size: 16px !important`, `padding: 12px var(--mobile-spacing-md) !important`.
  - R5 : 1er bloc l.7870-8115 (≤ 767 l.7762), préfixe `:where(html:not(.kr-page-forum-index)) body.mobile-mode:where(.page-forum, .page-forum-racine)` ; 2e bloc l.8565-8803 (≤ 767 l.8459), préfixe `:where(html:not(.kr-page-forum-index)) body.page-forum`. Spécificité égale (0,1,1), le 2e est plus loin. 31 règles par bloc, 98 déclarations dans le 1er, 96 doublées (même sélecteur, même propriété, même importance ; 93 à valeur égale, 3 battues par la valeur du 2e). Vivantes : `tr { box-shadow: var(--kr-shadow-sm) !important }`, `tr:active { transform: scale(0.98) !important }`. Commentaire « racine du forum » périmé.
  - R6 : l.9497-9505 (≤ 767 l.8459), `border-radius: var(--kr-radius-md) !important`.
  - M1 : l.10121-10294 `@media (min-width: 769px)` (« Kramail formulaire desktop ») ; l.10310-10612 `@media (max-width: 768px)` (« Kramail formulaire mobile », contient l.10319 qui masque le dropdown du sélecteur sur la rédaction).
  - M2 : l.11954-11989 `@media (max-width: 768px)` (changelog : `.kr-changelog-content` 95 %, header, body, footer en colonne, bouton du pied 100 %).
- Template (`kraland-userscript-template.js`) : l.598 `MOBILE_BREAKPOINT = 768` ; l.110 `krForumIsIndexPath` (`p === '/forum'`), l.860-863, l.3757 ; l.5713-5717 (création du menu de personnage en `mobile-mode`) et l.5785-5799 (cssText, l.5793 `border-radius: var(--kr-radius-md);`). Aucun changement de template prévu.
- Bundle : médias minifiés `@media (width<=768px){` (4 occurrences) et `@media (width>=769px){` (1).
- Tests :
  - `tests/e2e/typographie-formes.mjs` : liste `KR_FRAG` l.82, `const FRAG` l.119, `COMMIT_*` (l.101, 104, 108, 112, 665, 981, 1193, 1452), modèle du fragment `espacement` ; cas `menu-personnage` du fragment `rayons` (l.1257) ; ouverture du changelog par `#kr-changelog-btn` (l.477) ; `.kr-changelog-footer button` (l.423).
  - `tests/e2e/lib/variantes.mjs` : modèle `ESPACEMENT_TICKET49` / `AVANT_TICKET49`.
  - `tests/e2e/lib/router.mjs` : registre l.81, KEYWORDS l.131, `MAX_CITING` l.200 ; `tests/e2e/lib/router.test.mjs`.
  - Suites à surveiller à 768 : `kramail-redaction.mjs` (`bundleAvant()`, fragment `regression`), `palette-nation.mjs` (Interface, changelog), `breakpoint-switch.mjs`, `forum-index.mjs` (masques sur `81512a3`), `forum-mobile.mjs`, `sous-forum.mjs`, `modale-ordre.mjs`.
- Fixtures : `plateau-minimal.html`, `plateau-qualite-usage.html`, `sous-forum-debuter.html`, `forum-index-rp.html` (servie à `/forum/staff`, `forum-index.mjs` l.62), `forum-sujet.html`, `typographie-forum-redaction.html`, `kramail-nouveau.html`, kramail répondre, `typographie-echelle.html` (`#champ-essai`), dossier `modale-ordre`, `palette-nation-profil.html` (Interface, changelog), `palette-nation-composants.html`.

## Tasks & Acceptance

**Execution:**
- [x] Fragment `nettoyage` dans `typographie-formes.mjs`, `COMMIT_NETTOYAGE = '00b0786'` (option `KR_SCRIPT_AVANT_NETTOYAGE`), ajouté à `KR_FRAG` et au registre du routeur -- rouge sur `00b0786` pour M1 et M2 seulement.
- [x] `kraland-theme.css` : R1 à R6, dans cet ordre, `npm run build` et fragment vert après chacun.
- [x] `kraland-theme.css` : M1 puis M2.
- [x] Masque `MEDIAS_TICKET410` / `AVANT_TICKET410` dans `lib/variantes.mjs` ; suites rouges à 768 mises au masque (Plan Change Log).
- [x] Routeur : comptes des suites citantes, cas de `router.test.mjs`.
- [x] Contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures et les largeurs 375, 767, 769, 1280, when le fragment `nettoyage` tourne en Kraland clair et en Empire Brun sombre, then chaque élément visible et ses `::before` / `::after` ont des styles calculés égaux au bundle de `00b0786`, états compris (survol et focus du hamburger, `tr:active`, menu du kramail ouvert, changelog ouvert, modale d'ordre ouverte).
- Given la rédaction, la réponse du kramail et le changelog à 768 px, when on mesure, then les propriétés déclarées par M1 et M2 sont égales à la base relevée à 769 px ; hors de ces blocs, tout est égal à la base à 768 px.
- Given un onglet à 767 puis 768 puis 767 px, when on mesure à chaque pas, then chaque état suit le support (mobile, ordinateur, mobile).
- Given `kraland-theme.css`, when on cherche `(max-width: 768px)` et `(min-width: 769px)`, then on n'en trouve aucun (contrôle statique du fragment).
- Given le menu de personnage ouvert en mobile puis la fenêtre passée à 1280, when on mesure, then son rayon reste `var(--kr-radius-md)`.
- Given `npm run test:changed` et `npm run test:router`, when ils tournent, then 0 FAIL et routeur conforme.

## Implementation Notes

- Assumptions (tranchées par le planificateur) :
  - A1 : `risk: 'medium'` au lieu du `low` du ticket. Raison : M1 et M2 changent le rendu à 768 px (éditeur du kramail, changelog), et R5 retire 96 déclarations d'un bloc large. Les retraits seuls seraient `low`.
  - A2 : M1 et M2 sont retenus alors que la consigne exclut les changements visuels voulus. Raison : la consigne les admet s'ils sont testés au seuil, et deferred-work.md les assigne à l'entrée 10. À 768 px, la base mélange le DOM d'ordinateur (pas de `mobile-mode`) et le CSS mobile (dropdown du sélecteur masqué par l.10319, pied du changelog en colonne). La correction aligne ces blocs sur la convention 767/768 d'AGENTS.md.
  - A3 : R5 repose sur l'inclusion de portée. Le 1er bloc exige `body.mobile-mode` et `.page-forum` ou `.page-forum-racine`, hors `kr-page-forum-index`. La racine `/forum` porte toujours `kr-page-forum-index` (template l.110), donc `.page-forum-racine` n'y apporte aucun élément hors de `.page-forum`. Si une page porte `.page-forum-racine` sans `.page-forum` ni `kr-page-forum-index`, le 2e bloc ne la couvre pas : le fragment le vérifie par un contrôle statique du template (classe posée seulement avec `.page-forum` ou sur la racine), et la mesure porte sur le sous-forum et Staff. Les 2 déclarations vivantes restent dans le 1er bloc, à leur place. Le commentaire est corrigé.
  - A4 : R6 retire la déclaration de la feuille et garde celle du template, à l'inverse de la « préférence feuille » du deferred. Raison : le cssText inline s'applique même après un passage en ordinateur, où la règle ≤ 767 de la feuille ne vaut plus. Retirer le cssText changerait le rayon à ≥ 768 px dans ce cas (rayon natif) ; retirer la feuille est strictement égal. Le cas `menu-personnage` du fragment `rayons` doit rester vert.
  - A5 : R1 remplace les deux médias imbriqués par `(max-width: 767px)` plutôt que d'aplatir leurs règles. Raison : diff minimal, ordre de la cascade inchangé, et le contrôle statique de M1/M2 devient global.
  - A6 : R2 garde `order: 1` seul dans la règle, sans `!important` (comme la base). R3 garde les autres déclarations de la règle l.13353.
  - A7 : la comparaison globale du fragment porte sur l'ensemble des propriétés de `getComputedStyle`. Les transitions et les animations sont figées (`transition: none`, `animation: none`, posés dans les deux bundles) avant la mesure, pour ne pas mesurer un instant.
  - A8 : pour M1/M2 à 768 px, la base à 769 px est relevée dans un autre onglet. « Propriétés déclarées » = l'ensemble des propriétés que les blocs l.10121-10294, l.10310-10612 et l.11954-11989 déclarent, extrait du CSS par le test (pas de liste codée). Seules exceptions : les propriétés qui suivent la largeur de la fenêtre, exclues nommément dans `EXCLUES_A8`, chacune avec son élément et sa raison (Plan Change Log).
  - A9 : la description du ticket demande que le plan commence par la liste des entrées de deferred-work.md. Elle est placée avant le bloc gelé.
  - A10 : `review`, `review_source` et `lenses_ran` sont vides : le planificateur ne fixe pas la revue, l'orchestrateur le fait.
- Retenus (lieu et action) :
  - R1 : l.1727 et l.2005, `(max-width: 768px)` → `(max-width: 767px)`.
  - R2 : l.5550-5568, retirer `display`, `margin` (×3), `padding`, `border`, `border-radius`, `background` de `.navbar-toggle`, la règle `:hover, :focus` et la règle `.icon-bar`. Garder `order: 1`.
  - R3 : l.13355, 13356, 13357, 13361, retirer `display`, `align-items`, `justify-content`, `min-height`.
  - R4 : l.4674-4678, retirer `font-size` et `padding`. Garder `height: 44px !important`.
  - R5 : l.7870-8115, retirer les 96 déclarations doublées ; garder `tr { box-shadow }` et `tr:active { transform }` ; règles vidées retirées.
  - R6 : l.9505, retirer `border-radius`.
  - M1 : l.10121 → `(min-width: 768px)`, l.10310 → `(max-width: 767px)`.
  - M2 : l.11954 → `(max-width: 767px)`.
- Reportés (avec raison) :
  - Doublons Bootbox et `.modal` l.1287 / l.7319 (D4, D5) : pas des doublons stricts, le bloc 1 sert seul sans `mobile-mode`.
  - Entrées H du 4.9 (D9) : la réécriture au pas change le rendu et demande un cas mesuré par entrée. Précisions : l.4312 n'est pas morte de façon structurelle (sans elle, la règle de rôle 12/16 gagnerait sur les en-têtes mobiles sans peau propre) ; l.4508 gagne sur `typographie-echelle.html` ; l.8011 part avec R5 ; l.8695 n'est pas prouvée morte ; l.769 vise `/report`, jamais chargée en test ; l.4654 : seul le `padding` de 4674 est traité (R4), la règle 4654 elle-même est vivante.
  - Masques miroirs `ETIQUETTES_TICKET41` … `ESPACEMENT_TICKET49` : tous utiles, leurs détecteurs servent des bundles de base figés (`81512a3`, `d68ab55`, `4d97496`, `8631c45`, `3b1da55`, `fe77411`, `d953969`, `5ff22d3`, `62fd47d`).
  - Questions de produit, à Arnaud : `.forum-tags .glyphicon` 8 px (4.1), icônes seules à 14 px sur mobile (4.2), graisse 400 du nom de forum (4.7), cellules à 4/8 (4.9), tailles sous 12 px des pages secondaires (épopée), `.dashboard-section-header` 12 px et `.list-group-item-text` (4.5).
  - l.12292 `calc(.5rem / 2)` (4.8) : exception de forme, sans gain.
  - `.kd-msg-btn` `height` (4.2) : masquée par `min-height`, mais vivante quand le contenu dépasse.
  - Votes et pagination mobiles : épopée 9.
  - Feuille du bas de l'éditeur du kramail, non mesurée par 4.8 : couverte en partie par M1, le reste hors périmètre.
- Masque `MEDIAS_TICKET410` : transformation de chaîne du bundle de base, `@media (width<=768px){` → `@media (width<=767px){` et `@media (width>=769px){` → `@media (width>=768px){`. Détecteur `AVANT_TICKET410 = src => src.includes('(width>=769px)')`. Posé seulement sur un bundle de base, sur le modèle de `ESPACEMENT_TICKET49`. Une suite qui compare au bundle de base à 768 px (kramail-redaction `regression`, palette-nation, breakpoint-switch) le reçoit si elle passe au rouge ; la liste exacte sort du premier `test:changed` et va au Plan Change Log.
- Routeur : compter les suites qui citent `navbar-toggle` (déjà 2 : menus-forums, typographie-formes), `kr-action-grid`, `form-control` (déjà 3), `kramail-character-dropdown` et `editeur-text` (2 : palette-nation, typographie-formes), `kr-changelog`. Si l'une passe à 4 avec le fragment, écrire la liste de sélecteurs dans `lib/variantes.mjs` (modèle `CAS_ESPACEMENT_TICKET49`). Les hunks qui ne touchent qu'une ligne de média ne portent ni mot-clé ni sélecteur : ils élargissent au total, ce que le cas de `router.test.mjs` vérifie. Un hunk de R5 (sélecteurs du forum) doit router vers `forum`, `sous-forum` et `typographie-formes`.
- Risques :
  - R5 est le plus gros retrait : une déclaration crue doublée mais à valeur différente (3 sur 96) changerait le rendu si l'analyse de portée (A3) est fausse. Le fragment compare tout à 375 et 767 sur le sous-forum et Staff, en `mobile-mode`, et `tr:active` à part.
  - M1 à 768 px : le dropdown du sélecteur de la rédaction réapparaît, et la barre de l'éditeur passe en ordinateur. Les seuils serrés de 768 (titres, barre BBCode) peuvent déborder : vérifier qu'aucun bouton ne passe à la ligne.
  - Une suite figée sur une base ancienne (`81512a3` pour forum-index) peut passer au rouge à 768 : elle reçoit `MEDIAS_TICKET410`, pas une valeur codée.
  - Le cas « fenêtre rétrécie sans `mobile-mode` » (4.3) : R1 touche le bloc Bootbox sans `mobile-mode` ; il est mesuré à 767 sans `mobile-mode` (bascule depuis 1280).

## Plan Change Log

- R4 : la valeur réelle du retrait gardé est `12px` en haut et à gauche (jeton `--mobile-spacing-md`), non 12/16 : le contrôle attend `44/12px/12px/16px` (hauteur, retrait haut, retrait gauche, police).
- Champs R4 mesurés sur `champ`, `nouveau` et `repondre` : la rédaction du forum n'a pas de champ texte d'une ligne dans sa fixture.
- Menu de personnage (R6, A4) mesuré sur la réception du kramail : la rédaction le masque par `display: none !important` (l.10319). Champ sonde `#kr-sonde-saisie` injecté, ouverture à 375 puis fenêtre à 1280, attendu `ouvert 8px 8px 8px 8px`.
- A8 (bloc figé, critère 2), après revue : à 768 px, sur la réception, la rédaction, la réponse du kramail et l'interface (changelog ouvert), chaque élément visible visé par un sélecteur des blocs M1/M2, et ses `::before`/`::after` à contenu posé, est comparé à la base `00b0786` (non décalée) relevée à 769 px dans un autre onglet. Blocs et propriétés extraits du CSSOM de la base (`BLOCS_M` : médias `(width<=768px)` et `(width>=769px)` de premier niveau, 3 blocs exigés, 82 propriétés longues ; les médias imbriqués de R1 n'en font pas partie). La comparaison aux médias décalés reste en plus.
- Exclusions nommées de A8 (`EXCLUES_A8`), seules propriétés qui suivent la largeur de la fenêtre (1 px de moins à 768) :
  - `width`, tous les éléments : largeurs du flux et des colonnes Bootstrap en %, chaque conteneur a 1 px de moins (675 au lieu de 676 px).
  - `padding-right`, `.kd-label` seulement : retrait `clamp(0px, calc(16.6667% - 103px), 15px)` (≥ 768), 3,5 au lieu de 3,66 px.
  - `left` et `right`, `.kr-changelog-content` seulement : centrage par `left: 50%` et `translate(-50%, -50%)`, 384 au lieu de 384,5 px (`right` en découle).
  - Les marges auto et les alias logiques signalés à l'implémentation ne donnent aucun écart sur les éléments ainsi mesurés : non exclus.
- A8 rouge sur la base (`KR_SCRIPT` = bundle de `00b0786`) : 8 FAIL, les 4 pages × 2 variantes (exemple réception : `h1.page-header` `margin-bottom 20px au lieu de 16px`, `padding-bottom 9px au lieu de 12px`, bordure). Vert sur le bundle courant.
- Risque M1 « aucun bouton ne passe à la ligne » : contrôle ajouté à 768 px sur les pages M (texte d'un bouton sur une ligne, sans débord, groupe sur une rangée), comparé au relevé à 769 px.
- Racine `/forum` ajoutée aux pages des lignes (R5). A3 contrôlé de façon dynamique (racine à 375 px : `kr-page-forum-index` et `page-forum-racine` présents, `page-forum` absent) et par le compte des `classList.add` de `page-forum-racine` dans le bundle (template minifié : pas d'expression rationnelle sur la source).
- Sélecteurs `LIGNES_FORUM_TICKET410` et `CLASSES_RACINE_TICKET410`, champs `CHAMPS_TICKET410` dans `lib/variantes.mjs` : `page-forum`, `panel-default` et `form-control` sont déjà cités par 3 suites. Le commentaire du fragment cite `page-forum-racine` (2 suites) et `kr-page-forum-index` (3 suites), pour qu'un hunk de R5 lance `typographie-formes`, en plus de `forum` (mot-clé) et `sous-forum` (repère cité) ; cas de `router.test.mjs` ajouté, avec le cas « ligne de média seule → total ».
- Suites mises au masque `MEDIAS_TICKET410` (rouges à 768 px au premier `test:changed`, `nouveau` et `repondre`) : fragments `echelle-forum`, `rayons` et `espacement` de `typographie-formes.mjs` (bases `d953969`, `5ff22d3`, `62fd47d`, décalées par `medias410`). Aucune autre suite rouge : kramail-redaction, palette-nation et breakpoint-switch restent verts sans masque.
- `height: 44px !important` de `.form-control` (l.4674) sorti du sweep, déclaration gardée, consignée comme candidate morte dans `deferred-work.md`. Contre-épreuve sans FAIL ; sonde CDP (`CSS.getMatchedStylesForNode`) sur toutes les pages du fragment, bundle sans la déclaration : chaque `.form-control` d'une ligne garde 44 px, car la hauteur native de Bootstrap est `34px` et `.form-control { min-height: var(--mobile-touch-target) !important }` (l.9653, même média ≤ 767, jeton 44 px sur `:root` seulement) l'emporte. Aucune fixture n'a de `.form-control` à hauteur propre au-dessus de 44 px (`input-lg`, style en ligne) : 37 `class="form-control"` nus, sans `height` en ligne. Pas de champ synthétique ajouté : il ne prouverait rien sur le site.
- États forcés (après revue) : un état sans élément mesuré échoue. Par page, sur les cas mobiles (375 et 767 px), checks `hamburger :hover`, `hamburger :focus` et `hamburger visible en mode mobile` (plateau, plateau-minimal, champ) et `lignes du forum :active` (sous-forum, staff, racine) exigent au moins un élément ; le check par cas de l'`order: 1` ne porte plus d'`assert.ok` qui ne peut pas échouer. Agrégat par page : plateau-minimal à 767 px n'a pas de `mobile-mode`, un cas seul peut donc ne rien mesurer. Contre-épreuves (copies du test) : sélecteur du hamburger faussé (`.navbar-toggle-x`) → 9 FAIL ; sélecteur des lignes faussé → 3 FAIL.
- Commentaire de la 1re version des cartes du forum (l.7856) : « Chaque ligne devient une card » remplacé par « Ombre de la carte (la 2e version pose la carte elle-même) », seul reste du bloc après R5.
- Preuve après revue : `test:zone` (8 zones) et `test:changed` à 1 FAIL chacun, sur `nettoyage`, avec un cas différent à chaque fois (`nouveau empire-brun-dark 375`, `modale-ordre empire-brun-dark 375`). La base a été relevée dans un état passager (`#content` en `display: none`, voile `rgba(0, 0, 0, 0.5)`), sous charge. Rejoué seul, machine calme : fragment 2 × 405 ok, 0 FAIL ; `test:zone -- typographie-formes` 4371 ok, 0 FAIL. Signalé à l'orchestrateur pour `test:all`.
- Contre-épreuve R1 : une règle sortie du seul média imbriqué reste dans le bloc ≤ 767 englobant (sans effet, ce qui prouve R1). La copie mutée place `.bootbox-confirm > .modal-dialog { display: block }` après le bloc englobant.
- Contre-épreuve `MEDIAS_TICKET410` remplacé par l'identité : c'est l'état du premier `test:changed`, avant le masque des trois fragments (8 FAIL à 768 px).

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes kramail forum sous-forum modale-ordre palette-nation plateau transitions` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL, codes de sortie lus. (`test:all` : orchestrateur.)
- Rouge avant : `KR_SCRIPT=<bundle de 00b0786> KR_FRAG=nettoyage` -- FAIL attendus à 768 px sur M1 et M2, sur la bascule et sur le contrôle statique des médias ; tous les cas d'égalité des retraits verts (base contre base).
- Contre-épreuves (copies mutées du bundle, `KR_SCRIPT`, `KR_FRAG=nettoyage`). Chacune doit donner au moins un FAIL nommé :
  - 1er bloc des cartes du forum retiré en entier (`box-shadow` de `tr` perdu) ;
  - `transform` de `tr:active` retiré ;
  - `order: 1` du hamburger retiré ;
  - ~~`height: 44px` de `.form-control` (l.4674) retiré~~ : sortie du sweep, candidate morte (Plan Change Log, `deferred-work.md`) ;
  - éditeur du kramail remis à `(width>=769px)` ;
  - éditeur du kramail remis à `(width<=768px)` ;
  - changelog remis à `(width<=768px)` ;
  - rayon du menu de personnage retiré de la feuille et du cssText ;
  - une règle d'un média imbriqué (R1) sortie du bloc ≤ 767 ;
  - `MEDIAS_TICKET410` remplacé par l'identité (une suite au masque repasse au rouge).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | typographie-formes.mjs, fragment `nettoyage`, 768 px | A8 du bloc figé (égalité à 768 avec la base relevée à 769, propriétés de M1/M2) abandonnée sans renégociation | fondé | patch (fixed) | bloc figé et critère 2 |
| 2 | quick | kraland-theme.css l.4674 ; contrôle `champs` | Contre-épreuve R4 (`height: 44px` retiré) sans FAIL | fondé | patch (fixed) | Verification : un FAIL nommé par contre-épreuve |
| 3 | quick | fragment `nettoyage`, hamburger et `lignes` | États forcés sautés en silence si aucun élément visible ; `assert.ok` qui ne peut pas échouer | fondé | patch (fixed) | critère 1 |
| 4 | quick | kraland-theme.css ~l.7853 | Commentaire « Chaque ligne devient une card » faux après R5 | fondé | patch (fixed) | R5 |

## Result

- Built sur la base `00b0786`, les 4 constats de revue corrigés (#1 A8 rétablie, mesurée contre la base à 769 px ; #2 R4 gardée, sortie du sweep, consignée dans `deferred-work.md` ; #3 états forcés en échec si rien n'est mesuré ; #4 commentaire corrigé).
- `npm run build`, `lint:css`, `lint:js` : exit 0 ; `test:router` : « Routeur conforme ».
- `npm run test:all` sur machine calme : 10447 ok, 0 FAIL en 308 s, RÉSULTAT : VERT.
