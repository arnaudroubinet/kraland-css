---
title: "Le message du ministre revient sur mobile, en carte sous Bienvenue"
type: 'feature'
ticket: '5'
created: '2026-10-30'
status: 'built'
baseline_revision: '82630594969142d6f8ee87a7bf1c09440e8de604'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md', '{project-root}/.claude/skills/tester-kraland-css/SKILL.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, le panneau du « Message du Ministre de l'Information » (`#col-right > .panel.panel-default`, pas une `.alert` : `transformMinisterialAlert` n'agit pas) est masqué avec toute la colonne `#col-right` ; décision d'Arnaud du 2026-10-30 : il revient sur mobile.

**Approach:** Sur mobile seul, `#col-right` cesse d'être une boîte : seul le panneau ministériel est affiché, en carte de section de 5.1 (en-tête 48 px, titre 17 px), rangé sous Bienvenue ; tout le reste de la colonne (`#myCarousel` compris) reste masqué. Fragment E10.6 (`ministre`) dans `accueil-mobile.mjs`, rouge sur la base puis vert.

## Boundaries & Constraints

**Always:** règles en `@media (max-width: 767px)` sous `:where(html.kr-page-accueil) body.mobile-mode` ; jetons existants ; ordre mobile Jouer, Bienvenue, Ministre, Forum, Compteurs, Nouvelles ; cibles du panneau ≥ 44 px (onglets, chevron, lien d'image) ; aucun texte visible sous 12 px ni à moins de 16 px du bord ; bureau égal à la base (768 à 1920 px) ; `!important` ≤ 2900 ; bundle par `npm run build`.

**Never:** toucher au bloc ordinateur ni au carrousel sur ordinateur ; afficher `#myCarousel` ou un autre enfant de `#col-right` sur mobile ; nouveau composant, nouveau `!important` ; modifier `transformMinisterialAlert` ; écriture git ; site réel.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| avec panneau | accueil.html, 320, 375×667, 767 ; Kraland clair, Empire Brun sombre | panneau visible entre Bienvenue et Forum, carte à 8 px, rayon 8, fond surface, en-tête ≥ 48 px, titre 17 px 700 couleur du texte ; `#myCarousel` non visible ; E10.1-E10.4 tenus | FAIL nommé |
| sans panneau | variante en mémoire sans le `.panel` de `#col-right` | rien de `#col-right` visible (aucune boîte non vide), ordre Jouer, Bienvenue, Forum… intact | FAIL nommé |
| carrousel affiché | `kr-carousel-hide` = 'false', 375 px | `#myCarousel` toujours masqué | FAIL nommé |
| bascule | 767 ↔ 768 deux sens | égal à une ouverture directe | premier écart |
| bureau | 768, 769, 1280, 1440, 1920 | textes égaux au bundle de base | premier écart |
| contraste | 16 variantes, 375 | titre du ministre ≥ 4,5:1 | FAIL par variante |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.11537-11540 -- `#col-right { display: none }` mobile : remplacé par `display: contents`, enfants masqués sauf `> .panel-default:has(#myTabContent)` (order 3, voir Design Notes).
- `kraland-theme.css` l.8105-8145 -- carte de section 5.1 : s'applique déjà au `.panel-default` (`.row > [class*="col-"] > *` donne le recul de la marge, 8 px du bord) ; rien à changer.
- `kraland-theme.css` l.6971-6978 -- chevron natif `span.clickable` à 44 px (pages secondaires) : même valeurs pour le panneau de l'accueil.
- `kraland-theme.css` l.4911 -- `.nav-tabs > li > a` mobile en `!important` (padding 12/16) : vérifier la taille des onglets de drapeaux.
- `kraland-theme.css` l.11502-11507 et l.11629 -- commentaires du bloc mobile (« entrée 5 ») à mettre à jour.
- `tests/e2e/fixtures/accueil.html` l.201-225 -- panneau natif (6 onglets, `.genmsg`, lien d'image) ; variante sans panneau dérivée en mémoire dans la suite (comme `HTML_DECONNECTE`).
- `tests/e2e/accueil-mobile.mjs` -- `BLOCS`, `CARTES`, `EN_TETES` (en-tête et titre séparés pour le panneau), contrôle `#col-right masqué` du fragment mobile et du fragment carrousel à 375 réécrits ; nouveau fragment `ministre` (320, 375, 767 ; avec et sans panneau) ; titre du ministre dans `contraste` ; `span.clickable` parmi les cibles.
- `tests/e2e/lib/router.mjs` l.125 et `router.test.mjs` l.603 -- frag `ministre`.
- Skill `tester-kraland-css` (deux copies) -- ligne Accueil.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/accueil-mobile.mjs` -- fragment E10.6 et contrôles mis à jour -- rouges sur `KR_SCRIPT` = bundle de 8263059 (/tmp).
- [x] `kraland-theme.css` -- `#col-right` mobile, panneau, chevron, onglets, `.genmsg` -- vert.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs`, skill (deux copies) -- frag `ministre`.
- [x] `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` -- section 10.5.

**Acceptance Criteria:**
- Given le bundle reconstruit, when `npm run test:zone -- accueil-mobile` est lancé, then tout est vert ; avec `KR_SCRIPT` = bundle de 8263059, le fragment `ministre` est rouge.
- Given une mutation (copie du bundle dans /tmp : `#col-right` remis en `display: none`, ou carrousel affiché), when la suite est relancée, then elle est rouge.
- Given palette-nation, typographie-formes, confort-mobile, cloche, `test:router`, `test:unit`, `lint:css`, `lint:js`, when ils sont lancés, then code 0.

## Implementation Notes

- Implémentation directe, sans sous-agent (contexte déjà chargé).
- `display: contents` abandonné : la marge basse forcée du panneau (16 px, `.panel` mobile, figée par le test d'espacement 4.9) et celle de la règle « Empiler les colonnes » (15 px) laissaient 39 px sous la carte. `#col-right` devient une colonne flex (order 3) à marge basse −16 px ; la règle générique de colonne l'exclut par une garde `:where(...)`.
- Titre du panneau en `flex: 1 1 0%` : l'en-tête commun en flex-wrap rejetait sinon le chevron sous le titre.
- La suite ne cite pas `panel-default` : 4e suite à le citer, elle l'aurait rendu transverse pour le routeur (perte de `sous-forum` au test du routeur).
- Contre-épreuves (copies du bundle dans /tmp) : `#col-right` en `display: none` -> 18 FAIL ; order 6 -> 6 FAIL ; enfants de `#col-right` affichés -> 2 FAIL au fragment `carrousel`.
- Revue indépendante (approuvé avec correctifs) :
  - Déconnecté : le bloc de `#col-t` qui porte le mot de passe passe en order 2, donc l'ordre devient formulaire, ministre, forum natif, Compteurs. Contrôle ajouté au fragment `deconnecte`, dont la variante garde le panneau.
  - Écarts Bienvenue-ministre et ministre-Forum mesurés à 8 ± 0,5 px, comme Forum-Compteurs.
  - Variante durcie `HTML_MINISTRE_DUR` : un enfant inconnu `.kr-inconnu` de `#col-right`, qui doit rester masqué, et une longue URL sans césure.
  - `overflow: hidden` du panneau remplacé par `overflow-wrap: anywhere` sur le corps : rien n'est coupé, et les coins restent nets sans recadrage (capture à 320 px).
  - Contre-épreuves :
    - sans `order: 2` -> 6 FAIL ;
    - sans la marge −16 px -> 6 FAIL ;
    - enfants de `#col-right` non masqués -> 12 FAIL ;
    - sans `overflow-wrap` -> 12 FAIL.
  - Base 8263059 (fragments `ministre` et `deconnecte`) -> 36 FAIL.
- Alternative « retirer plutôt que battre » (`display: contents` et garde sur la marge forcée de `.panel`) écartée. La suite 4.9 fige la déclaration mobile `.panel { margin-bottom: var(--kr-space-4) !important }` par son sélecteur exact (`DECLARATIONS_ESPACEMENT_TICKET49`, `typographie-formes`). Une garde changerait ce sélecteur et casserait le contrat de 4.9, ou obligerait à le réécrire. L'existant (colonne flex à −16 px, garde sur « Empiler les colonnes ») est gardé ; l'écart de 8 px le verrouille.
- Candidats du sweep 10.4 : constats 7 et 8 de la revue indépendante, non appliqués à la demande du coordinateur. 7 : la garde de « Empiler les colonnes » (kraland-theme.css ~l.4413) ne couvre que `[class*="col-md-"]` ; l'appliquer aussi aux deux sélecteurs `col-sm-` (~l.4414/4416). 8 : la règle du chevron de l'accueil (~l.11582) recopie celle des pages secondaires (~l.6971) ; fusionner en `:where(html.kr-page-secondaire, html.kr-page-accueil)` si l'exclusion des modales est neutre sur l'accueil.

## Plan Change Log

## Review Triage Log

| Finding (quick) | Verdict | Route | Evidence |
|---|---|---|---|
| Accueil déconnecté : panneau (order 3, avant #col-t dans le DOM) au-dessus du formulaire de connexion | medium | intent_gap (non bouclé, mode autonome) | Vrai si le panneau est servi déconnecté ; l'intention ne fixe pas l'ordre sans Jouer ni Bienvenue. Consigné pour Arnaud dans revue-manuelle.md (10.5). |
| Commentaire de `accueil-mobile` dans router.mjs périmé | low | patch | Commentaire mis à jour (entrée 5, fragment E10.6). |
| En-tête de la section accueil mobile du CSS à moitié mis à jour | low | patch | Ministre ajouté à la liste des cartes et des en-têtes de 48 px, titre de la sous-section complété. |
| Champ `colRight` d'ETAT sans contrôle | false | rejeté | Lu par la comparaison d'état de `bascule` (bascule égale à une ouverture directe) : utile. |
| (indépendante 1) Déconnecté : ministre au-dessus du formulaire | medium | patch | Formulaire en order 2 ; contrôle d'ordre au fragment `deconnecte` ; rouge sans le correctif. |
| (indépendante 2) Écarts entre cartes non mesurés | medium | patch | 8 ± 0,5 px mesurés ; rouge sans la marge −16 px. |
| (indépendante 3) Retirer plutôt que battre | arbitrage | écarté | Casse le sélecteur figé par 4.9 (voir Implementation Notes). |
| (indépendante 4) Enfant inconnu de `#col-right` non couvert | medium | patch | `.kr-inconnu` injecté ; rouge sans la règle de masquage. |
| (indépendante 5) `overflow: hidden` coupe le contenu | low | patch | `overflow-wrap: anywhere` ; volet à longue URL ; rouge sans lui. |
| (indépendante 6) Liens texte du message < 44 px | low | defer | Noté pour la passe manuelle (revue-manuelle 10.5). |
| (indépendante 7 et 8) | — | defer | Candidats du sweep 10.4. |

## Design Notes

DOM : `#col-left`, `#col-right`, `#col-t`. Les blocs de `#col-t` ont 1 (Jouer), 2 (Bienvenue), 3 (Forum et autres) ; le panneau reçoit `order: 3` : à ordre égal, l'ordre du DOM s'applique et `#col-right` précède `#col-t`, donc le panneau vient juste sous Bienvenue et avant le Forum, sans renuméroter les autres blocs. Sélection du panneau : `:has(#myTabContent)` (structure relevée au spike), pour qu'aucun autre enfant de `#col-right` n'apparaisse.

## Verification

**Commands:**
- `npm run build` -- validation OK.
- `node tests/e2e/accueil-mobile.mjs` ; `KR_SCRIPT=/tmp/kr105/src/kraland-userscript-main.user.js KR_FRAG=ministre node tests/e2e/accueil-mobile.mjs` -- vert ; rouge sur la base.
- `KR_FRAG=ministre,deconnecte` : rouge sur la base, vert ensuite ; contre-épreuves `/tmp/kr105/n{1,2,4,5}.user.js` rouges.
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes confort-mobile cloche cartes-pastilles initialisation demarrage` -- vert.
- `npm run test:router` ; `npm run test:unit` ; `npm run lint:css` ; `npm run lint:js` -- code 0.
- `grep -c '!important' kraland-theme.css` -- ≤ 2900.

**Manual checks (if no CLI):**
- Passe manuelle d'Arnaud : vrai /accueil connecté en émulation 375×667 (session du Chrome dédié déconnectée ce jour).

## Result

Sur mobile, le panneau ministériel de `#col-right` s'affiche en carte 5.1 sous Bienvenue, à 8 px des cartes voisines. Sur l'accueil déconnecté, il vient après le formulaire de connexion. Le carrousel et tout autre enfant de la colonne restent masqués, une longue URL se replie dans la carte, et le bureau est inchangé.

- Base 8263059 : rouge (18 FAIL sur `ministre` au premier passage ; 36 FAIL sur `ministre` et `deconnecte` après la revue).
- Après le correctif : accueil-mobile vert, 370 ok.
- Contre-épreuves rouges :
  - avant la revue : 18, 6 et 2 FAIL ;
  - après la revue : 6, 6, 12 et 12 FAIL.
- Zones accueil-mobile, palette-nation, typographie-formes, confort-mobile, cloche, cartes-pastilles, initialisation et demarrage : code 0.
- test:router, test:unit, lint:css et lint:js : code 0. `!important` : 2900.
- Revue quick et revue indépendante appliquées. L'alternative `display: contents` est écartée, car elle casse le sélecteur figé par 4.9.
- Différé : liens texte du message (passe manuelle) ; constats 7 et 8 (sweep 10.4).
- Rien n'est commité.
