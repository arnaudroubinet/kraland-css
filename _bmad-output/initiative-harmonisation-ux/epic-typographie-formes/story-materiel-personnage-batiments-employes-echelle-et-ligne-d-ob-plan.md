---
title: "Matériel, Personnage, Bâtiments, Employés : échelle et ligne d'objet"
type: 'feature'
ticket: '6'
created: '2026-10-24'
status: 'built'
baseline_revision: '1590761'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-echelle-typographique-du-plateau-du-mini-profil-et-des-en-te-plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Matériel, Bâtiments et Employés n'ont aucune fixture ; l'échelle du ticket 5 n'y est pas prouvée. Sur Matériel, les détails des lignes d'objet sont à 12 px sur mobile (`.list-group-item-text` l.4517), la charge (`span.mention.pull-right`) n'a ni taille ni couleur décidées, les objets déplacés sur ordinateur (`.kr-materiel-moved … a.list-group-item` 1.06rem = 10,6 px, l.6292) passent sous 12 px ; sur mobile, la ligne d'objet suit des flottants natifs, sans garantie de l'ordre image, nom, charge à droite (H3.1, H3.2).

**Approach:** Créer trois fixtures synthétiques (Matériel, Bâtiments, Employés) à partir du squelette DOM relevé en lecture seule le 2026-10-24 (mandat d'Arnaud, relevés hors dépôt dans `/tmp/kr-releves/`), reprendre `jeu-perso.html` pour Personnage ; appliquer l'échelle en jetons sur les quatre pages (titres 17, noms et valeurs 15, détails 13, rien sous 12 px sur mobile) ; sur mobile, ligne d'objet du Matériel : image à gauche, nom en 15 px, charge alignée au bord droit sur la même ligne en `var(--kr-font-detail)` et `var(--kr-text-secondary)`.

## Boundaries & Constraints

**Always:**
- Fixtures synthétiques : squelette relevé (`#content.container > .row > #col-left.col-md-3 + #col-right.col-md-9`, `#col-right > .container-fluid > .row > .col-md-6 > .dashboard > .panel.panel-default > .panel-heading (h3.panel-title + span.pull-right.clickable) + .panel-body`, ligne d'objet `a.list-group-item` > `span.mention.pull-right` (charge) + `img.pull-left` 32×32 + `h4.list-group-item-heading.nomargin` + `p.list-group-item-text`), servies au chemin réel (`/jouer/materiel`, `/jouer/bat`, `/jouer/pnj`) pour la détection par chemin ; valeurs inventées ; aucun jeton CSRF ni `updateAjax`, aucun script du site, aucune capture brute ; images locales ou neutres (repli d'image du projet).
- Matériel : au moins Argent (valeur « 22467 FK » en h4), Outils et Armes (ligne avec `span.label`, ligne avec `img star` dans la charge, ligne à long nom), Clefs replié, et la colonne 2 (`well` « Charge … », « Fabriquer ») pour que le déplacement Clefs/Fabriquer du template (l.8502-8540) s'exécute.
- Assumption : Bâtiments et Employés sont vides chez le personnage relevé ; leurs lignes reprennent la structure de lignes du site (`a.list-group-item` + `h4.list-group-item-heading` + `p.list-group-item-text`, et `building-section-*` posé par le template sur mobile), consignée comme reconstruite et non relevée ; Employés garde l'alerte « Engagés aujourd'hui : 0/1 » (détail).
- Ligne d'objet mobile : P1 option 4, de préférence en réécrivant les règles existantes de la ligne (sinon une seule règle mobile gardée `:where(body:has(#col-leftest))`) ; la charge reste dans le DOM natif (premier enfant), son placement à droite se fait en CSS ; nom tronqué ou replié sans chevaucher la charge ; cible de la ligne inchangée.
- `.list-group-item-text` mobile 12 → `var(--kr-font-detail)` sous la garde des pages de jeu si la règle l.4517 sert ailleurs ; `.kr-materiel-moved` ordinateur : nom `var(--kr-font-name)`, détail et charge `var(--kr-font-detail)`.
- Mesures dans le fragment `echelle` de `tests/e2e/typographie-formes.mjs` (pages `materiel`, `bat`, `pnj`, `perso` sur les fixtures), aux largeurs communes (375, 767, 768, 769, 1280, 1440, 1920), Kraland clair et Empire Brun sombre ; ligne d'objet à 375 px : image à gauche du nom, charge alignée au bord droit (écart ≤ 1 px avec le bord intérieur), même ligne (recouvrement vertical) ; plancher de 12 px ; le pied de page à 10 px en style en ligne du site est hors `#content` : le plancher mesure `#content`.
- Rouge avant sur `1590761`, contre-épreuves ; routeur : mots-clés sans porter un repère à 4 suites citantes (MAX_CITING = 3) ; écarts attendus des autres suites en masque miroir hors couche dans `lib/variantes.mjs`.

**Never:** toucher au plateau (ticket 5), au forum, au kramail ; règle `:focus` ; git modifiant arbre/index/stash ; aucune requête vers le site réel pendant l'implémentation (les relevés suffisent) ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Titres | 4 pages, toutes largeurs | 17 px / 700 | n/a |
| Noms, valeurs | lignes d'objet, bâtiments, employés, Argent | 15 px / 600 | n/a |
| Détails | `p.list-group-item-text`, charge, alerte Employés, `well` | 13 px | n/a |
| Ligne d'objet mobile | Matériel à 375 et 767 px | image, nom, charge au bord droit sur la même ligne ; charge en text-secondary | nom long : pas de chevauchement |
| Ordinateur | Matériel 1280-1920, objets déplacés | ordre natif, rien sous 12 px | n/a |
| Seuil | 767 / 768 / 769, bascule dans les deux sens | valeurs du support | n/a |

</frozen-after-approval>

## Code Map

- Relevés (hors dépôt, lecture seule) : `/tmp/kr-releves/materiel.html` (contenu l.356-605), `bat.html` (l.355-385), `pnj.html` (l.355-390).
- Template : détection par chemin `KR_GAME_SECTIONS` l.291-303 ; `#col-leftest` créé l.8078-8082 (`isPlatoPage()` l.3466) ; Clefs/Fabriquer l.8502-8540 ; `building-section-*` mobile l.2522-2543.
- CSS : mobile `.list-group-item-heading` l.4512, `.list-group-item-text` 12 px l.4517, `.panel-body h4` l.4524 ; pages de jeu l.13351-13370 ; `.kr-materiel-moved` l.6292-6311 ; bâtiments l.6021, 6320-6366 ; modèle de ligne flex du commerce mobile l.6082-6169.
- Tests : `tests/e2e/typographie-formes.mjs` fragment `echelle` (l.624-810, `PAGES_ECHELLE`, sélecteurs `noms` l.643, `details` l.644 à étendre à la charge et aux détails), `tests/e2e/fixtures/jeu-perso.html`, `jeu-identite.mjs` ; `lib/router.mjs`, `router.test.mjs`, `lib/variantes.mjs`.

## Tasks & Acceptance

**Execution:**
- [ ] Fixtures `jeu-materiel.html`, `jeu-batiments.html`, `jeu-employes.html` (synthétiques).
- [ ] Fragment `echelle` étendu -- rouge sur `1590761`.
- [ ] `kraland-theme.css` -- détails, charge, objets déplacés, ligne d'objet mobile en jetons.
- [ ] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` et `npm run test:router` tournent, then 0 FAIL et routeur conforme ; valeurs de la matrice tenues.

## Implementation Notes

- Fixtures : `jeu-materiel.html` (`/jouer/materiel`), `jeu-batiments.html` (`/jouer/bat`), `jeu-employes.html` (`/jouer/pnj`), synthétiques, sans `#col-leftest` natif (créé par le template). Lignes de Bâtiments et d'Employés reconstruites (commentaire en tête de fixture). Clés de page du fragment : `jeu-materiel`, `bat`, `pnj` (`materiel` reste la fixture du ticket 5).
- Objets déplacés (`.kr-materiel-moved`) : le template ne déplace que le panneau titré « Matériel » du plateau ; testés sur `typographie-echelle.html`, qui gagne un panneau `#panneau-materiel` (charge, image, nom, détail). `SEL_ECHELLE.batiment` resserré à `#panneau-batiment .building-section-content` (le panneau Matériel devient lui aussi une section repliable sur mobile).
- Plateau exclu : `#col-leftest` existe sur toute page `/jouer` (`isPlatoPage()`), la garde des pages de jeu couvrait donc le plateau. Le template pose `html.kr-page-plateau` (chemin `/jouer/plateau` et sous-chemins, `krActiveGameSection`, dans `applyVariant` à côté de `kr-page-report`) ; toutes les nouvelles règles sont gardées `:where(html:not(.kr-page-plateau) body…:has(#col-leftest))`. Sur mobile, le plateau (Commerce, panneau Matériel) est égal au bundle de `1590761`, prouvé sur la FIXTURE SYNTHÉTIQUE `jeu-plateau-objets.html` (`/jouer/plateau`).
- Seul effet sur le plateau, voulu par le plan (Always : « `.kr-materiel-moved` ordinateur : … détail et charge `var(--kr-font-detail)` ») : sur ordinateur, le panneau Matériel déplacé passe de 10,6 à 13 px (le reste de sa valeur est égal) ; le test le tolère explicitement.
- CSS : `.list-group-item-text` mobile 12 px inchangé (règle d'origine), `var(--kr-font-detail)` sur les pages de jeu hors plateau ; détails ordinateur et mobile (texte de ligne, charge, `well` de la colonne 2, alerte des Employés) limités aux enfants directs `#col-right .panel-body > a.list-group-item > …` ; ligne d'objet mobile en grille nommée (`image nom charge` / `image texte texte` avec image, `nom charge` / `texte texte` sans image : le nom part du bord), seulement si la ligne a une charge, hors `.kr-materiel-moved` ; les lignes sans charge (Employés, Bâtiments) gardent le flex natif.
- Mesures : chevauchement mesuré sur le texte réel du nom (`Range.getClientRects`, recouvrement avec la charge ou débordement du bord droit), plus la boîte du `h4` ; `jeu-materiel.html` gagne une ligne « charge sans image » (Bâton) et un nom d'un seul mot très long (Grimoire), consignées comme ajoutées. Plancher de 12 px mesuré dans `#content` à toutes les largeurs (mobile et ordinateur).
- Personnage : `jeu-perso.html` n'a pas de ligne d'élément de liste (tableaux Citoyenneté, Maladies) ; la matrice ne lui demande que titres et plancher : titres 17/700 (déjà mesurés) et plancher de 12 px dans `#content` à toutes les largeurs (`plancherContenu`). Fixture inchangée (structure vérifiée par `jeu-identite.mjs`, `PANNEAUX_PERSO`).
- Routeur : `LIGNE_OBJET_TICKET6` et `SECONDAIRE_TICKET6` écrits dans `lib/variantes.mjs` (sinon `list-group-item` et `kr-text-secondary` passaient à 4 suites citantes) ; mot-clé `list-group-item-text|kr-materiel-moved|kr-page-plateau` -> `typographie-formes`, `plateau` (tests dans `router.test.mjs`, hunk CSS et hunk du template).
- Aucun masque miroir ajouté : aucune autre suite n'a d'écart.

## Plan Change Log

- 2026-10-24, revue : plateau exclu des nouvelles règles (`html.kr-page-plateau` posé par le template) et prouvé égal au bundle de base sur mobile ; plancher ordinateur mesuré dans `#content` (et non plus `#col-right`) ; Personnage couvert par le plancher à toutes les largeurs ; grille sans image (nom au bord) ; chevauchement mesuré sur le texte réel. Ajouts hors liste initiale : fixture `jeu-plateau-objets.html`, constante `COMMIT_TICKET6` (option `KR_SCRIPT_AVANT_TICKET6`), modification du template (classe de page).

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes plateau profil` (et la zone de `jeu-identite`) ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL. (`test:all` : orchestrateur.)

**Résultats (implémenteur, arbre de travail non commité) :**
- Après revue. Rouge avant (bundle de `1590761`, `KR_FRAG=echelle`) : 445 ok, 67 FAIL. Vert après : 512 ok, 0 FAIL.
- Contre-épreuves (copies mutées du bundle, `KR_SCRIPT`, `KR_FRAG=echelle`) : grille retirée 8 FAIL ; couleur de la charge retirée 4 ; objets déplacés à 1.06rem 10 ; détails ordinateur à 14 px 36 ; `.list-group-item-text` de jeu à 12 px 17 ; jeton remplacé par 13px littéral 1 (jetons redéfinis) ; exclusion du plateau retirée du CSS 4 (plateau 375 et 767 px) ; classe `kr-page-plateau` non posée 4 ; `overflow-wrap: anywhere` du nom retiré 2 (Grimoire sur la charge, 375 px) ; grille à trois colonnes même sans image 4 (Bâton à 10 px du bord).
- `test:zone -- typographie-formes plateau profil` (jeu-identite compris) : 2480 ok, 0 FAIL. `test:changed` (élargi au total par `lib/variantes.mjs`) : 7550 ok, 0 FAIL. `test:router` : conforme. `test:unit` : 0. `lint:css` 0 ; `lint:js` 0 (1 avertissement préexistant, `report-non-lu.mjs`).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css, détails mobiles et `.kr-materiel-moved` | La garde `body:has(#col-leftest)` couvre le plateau : commerce 12→13 px, charge du panneau Matériel du plateau à 13 px | fondé | patch (fixed) | `#col-leftest` créé quand `isPlatoPage()` (template l.3466) ; frozen « Never : toucher au plateau » ; exclure le plateau |
| 2 | quick | typographie-formes.mjs, plancher ordinateur | Plancher mesuré dans `#col-right` au lieu de `#content` | fondé | patch (fixed) | plan : « le plancher mesure `#content` » |
| 3 | quick | PAGES_ECHELLE, `perso` | Personnage sans `objets: true` : aucune mesure nouvelle | fondé | patch (fixed) | plan : échelle « sur les quatre pages » |
| 4 | quick | grille de ligne d'objet | Grille sur `:has(> .mention)` sans `> img` : nom décalé de 10 px si pas d'image | fondé | patch (fixed) | `gap` conservé avec colonne vide |
| 5 | quick | MESURE_ECHELLE, chevauchement | Boîte du `h4` = piste de grille : test vrai par construction | fondé | patch (fixed) | mesurer le texte (Range ou `scrollWidth`) |

## Result

Construit le 2026-10-24. 5 constats de revue corrigés : le plateau est exclu (classe `html.kr-page-plateau` posée par le template, test comparé au bundle de `1590761`) ; le plancher est mesuré dans `#content` ; Personnage est couvert par le plancher ; la grille utilise des zones nommées, avec un cas sans image ; le chevauchement est mesuré sur le texte réel. Écart accepté : sur ordinateur, le panneau Matériel du plateau passe de 10,6 à 13 px (liste Always du plan), consigné dans revue-manuelle. Preuves : `npm run build` OK, `lint:css` 0, `lint:js` 0, `test:router` conforme, `test:all` 7550 ok, 0 FAIL (machine calme).
