---
title: 'Pages secondaires : marge de 16 px et cibles de 44 px'
type: 'feature'
ticket: '4'
created: '2026-10-29'
status: 'built'
baseline_revision: '9b6851a5e7609104a935a363928bb8b690ccb13c'
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

**Problem:** en mobile, les pages secondaires (Règles, Monde, Événements, Citoyens, Membres, Interface, Statistiques, Carte, Cybermonde) collent leur texte au bord (relevé 9.3 : `#col-right` hors carte à 0 px, `#col-left` à 12-15 px), gardent des cibles hors bouton sous 44 px de large ou de haut, et le titre de la ville est hors écran à l'arrivée sur la carte. La règle « PHASE 5 » révèle les `input.hidden` d'Événements et `.form-control { height: 44px !important }` écrase `input-lg` et toute hauteur en ligne.

**Approach:** étendre le mécanisme de 9.1 (KR_PAGE_CLASSES, classe `kr-marge-mobile`) aux pages secondaires avec une classe `kr-page-secondaire`, corriger les cibles à l'origine sous cette garde, rendre le titre de la ville collant à 16 px du bord de sa carte défilante (et de la fenêtre en ordinateur), exclure `.hidden` de « PHASE 5 » sans changer sa spécificité, retirer les deux `height: 44px !important` des formulaires.

## Boundaries & Constraints

**Always:** réécriture à l'origine ; aucun `!important` nouveau ; garde de page `:where(html.x)` ; mobile en `(max-width: 767px)`, ordinateur en `(min-width: 768px)` ; cibles ≥ 44 × 44 ou ligne entière touchable (elementFromPoint) ; fixtures synthétiques tirées des chaînes du relevé 9.3 ; à 768 et 1280 px, tout égal au bundle de base 9b6851a sauf ce que 9.4 change.

**Never:** taille de police (décision 2026-10-28) ; boutons `.btn` (épopée 4) ; liens au fil du texte (« Artiste », « ici », exception H9.1) ; liens-images de choix d'Interface (`#col-right > a > img`, `div > a > img`, `div.t > a > img`, `td > a > img`, 40 × 44 : peut-être des liens d'action, laissés natifs) ; modales (`.modal`, y compris sur les pages secondaires) ; Contacts (relevé 2026-10-29 : `/contacts`, reçoit la peau du forum en mobile ; impact croisé reporté, hors de ce ticket) ; site réel ; structure inventée sans source.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Marge | 9 pages secondaires, 320 / 375 / 767 px, Kraland clair et Empire Brun sombre | classes `kr-page-secondaire kr-marge-mobile` ; texte hors défilant ≥ 16 px des bords ; cartes de section à 8 px ; aucun débordement | No error expected |
| Cibles | Organisations « - », Événements case à cocher et pagination, Interface : options en `label` englobant (relevé 2026-10-29), ville : icônes de tableau, chevron Fonctionnaires, onglets et sélecteurs de carte | chaque cible ≥ 44 × 44 aux cinq points, ou ligne de 44 px touchable | No error expected |
| `input.hidden` | Événements, `input#mySubmit1…6.hidden` | non affichés | No error expected |
| Titre de ville | carte de ville à 375 px (cadre ouvert au milieu) et 768 / 1280 px | texte du titre ≥ 16 px du bord gauche de l'écran ; à 1280 px, position inchangée | No error expected |
| Formulaires | `input-lg`, hauteur en ligne, `select.form-control` en mobile | 46 px, hauteur en ligne respectée, sélecteur toujours à 44 px | No error expected |
| Bureau | mêmes pages à 768 et 1280 px | textes égaux au bundle de base (titre de ville à 768 px excepté) | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` l.307 `KR_PAGE_CLASSES` (bloc pur `identite`) -- ajouter l'entrée des pages secondaires ; applyVariant l.3697 bascule déjà toutes les classes déclarées.
- `kraland-theme.css` « MARGE MOBILE » (~l.6918) -- la marge vient de `body.mobile-mode > .container > .row` : rien à ajouter pour les pages `#content.container > .row` ; Cybermonde : `body > .genmsg` à couvrir.
- `kraland-theme.css` « PHASE 5 » (~l.4748) -- exclure `.hidden` par `:where(:not(.hidden))` (spécificité inchangée).
- `kraland-theme.css` « Formulaires » (~l.4779) et `select.form-control` (~l.9802) -- retirer les deux `height: 44px !important` ; le `min-height` mobile garde 44 px.
- `kraland-theme.css` « Nav map mobile » (~l.4148) -- remplacer `height/min-height` neutralisés par 44 px (même déclaration `!important` existante).
- `kraland-theme.css` Cybermonde (~l.4105) -- titre `.kr-cybermonde-region > #mapname-container` collant (`position: sticky; left: 16px`).
- Précédent du chevron 44 × 44 : `body.page-forum.kr-subforum .panel-heading span.clickable` (~l.14301).
- `tests/e2e/confort-mobile.mjs` -- fragment `secondaires` ; base des comparaisons 9b6851a ; Règles et Cybermonde sortent du hors-périmètre.
- `tests/e2e/lib/router.mjs` -- fragment, mot-clé `kr-page-secondaire`.
- `tests/unit/identite.test.mjs` -- krPageClasses.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- entrée `kr-page-secondaire` -- marge 9.1 sur les pages secondaires.
- [x] `kraland-theme.css` -- cibles, `.hidden`, formulaires, titre de ville -- voir Code Map.
- [x] `tests/e2e/fixtures/secondaires-*.html` -- fixtures synthétiques Règles, Guide, Organisations, Événements, Statistiques, fiche membre, Interface (squelette du relevé 2026-10-29), carte de ville, Cybermonde.
- [x] `tests/e2e/confort-mobile.mjs`, `tests/e2e/lib/router.mjs`, `tests/unit/identite.test.mjs` -- fragment `secondaires`, routage, test pur.
- [x] Suites sœurs mesurant ces pages : masquer la seule marge (SANS_MARGE_PAGE) ou l'écart propre à 9.4.

**Acceptance Criteria:**
- Given le bundle de base 9b6851a, when `KR_FRAG=secondaires` tourne, then il échoue ; given le bundle 9.4, then il passe.

## Implementation Notes

- Marge : `KR_PAGE_CLASSES` reçoit `/regles`, `/monde`, `/map`, `/communaute/membres`, `/communaute/stats`, `/profil/interface` (`kr-page-secondaire kr-marge-mobile`). La règle 9.1 (`body.mobile-mode > .container > .row`) suffit pour `#content.container > .row` ; seul le `body > .genmsg` de la carte du monde reçoit la marge en plus.
- Cibles, mobile sous `:where(html.kr-page-secondaire)`, hors modales (`:where(:not(.modal *))`) : `td > a:not(.btn):is(:has(> i), .nomargin)` à 44 de large (« - » des Organisations, icônes de police de la ville ; liens-images exclus) ; `.form-check` en ligne de 44 px de haut au minimum (repli sans libellé), libellé de 44 px qui prend la ligne ; `.radio > label` et `.checkbox > label` à 44 de haut (Interface) ; chevron `span.clickable` 44 × 44 (précédent du sous-forum, `margin-right: -12px` garde le glyphe à 29 px du bord, base 24). Onglets et sélecteurs de la carte : `a:not(.btn)` reçoit le min-height de « PHASE 5 » (44 px), padding vertical à 0 ; le bouton « Travail » (`a.btn`) garde sa hauteur native de 34 px par une règle `a.btn` qui reprend les deux `!important` déplacés (total inchangé).
- `.hidden` : « PHASE 5 » porte `:where(:not(.hidden))` sur chaque sélecteur, spécificité inchangée ; `input#mySubmitN.hidden` mesure 0 × 0.
- Formulaires : les deux `height: 44px !important` retirés ; `select.form-control` mobile garde `min-height: 44px` (son `height: auto` retiré). Mesuré : input 44, select 44, input-lg 46, hauteur en ligne 60 (base : 44 partout), sur une page secondaire, sur la rédaction du kramail (sans garde) et dans une `.bootbox.modal` (où tout select reste à 44 par la règle `.modal-body select` antérieure). Conséquence voulue : `select[multiple]` et `select[size]` passent de 44 à 103 px (hauteur native).
- Titre de la ville : `#mapname-container` de la boîte de région couvre la carte (`--kr-cybermonde-largeur`) en mobile, le `h4` colle à 16 px (`position: sticky`) ; en ordinateur, même `h4` collant contre la fenêtre. Texte du titre à 16 px de 320 à 1024 px, 132 px à 1280 (inchangé).
- Message de la carte du monde : `body > .genmsg:not(:has(.container))` (un `.container` inclus, comme dans la fixture cybermonde-monde.html, porte déjà sa marge ; sans cette exclusion, ses panneaux passaient à 24 px).
- Suites sœurs : forum-activite `fil` (Règles hors forum) neutralise la marge des deux côtés (SANS_MARGE_PAGE) ; typographie-formes `nettoyage` (Interface) reçoit MASQUE_CIBLES_94 sur le bundle testé (min-height 20 px natif, alignement natif hors options du thème) ; cybermonde-carte `panneaux` retire le seul décalage de 16 px des sélecteurs de /map sans carte à 375 px (margeSecondaire). Les deux masques ne s'appliquent que contre une base sans `kr-page-secondaire`.
- Base des comparaisons de confort-mobile : `de4c079` (sans 9.1) passe à `9b6851a` (7.1, 9.1, 9.2 et 9.6 compris). Règles et Cybermonde sortent du hors-périmètre (mesurés par `secondaires`).

## Plan Change Log

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | (haute) cybermonde-carte `margeSecondaire` ajoute toujours 16 px à la base : marge comptée double une fois 9.4 fusionné | Corrigé : décalage appliqué seulement si la base n'a pas `kr-page-secondaire` | `KR_SCRIPT_AVANT=<bundle 9.4> KR_FRAG=panneaux` : 13 ok, 0 FAIL ; base par défaut : 13 ok |
| 2 | Membres : liens de 34 px, ni fixture ni correctif | Hors 9.4 : report créé par le coordinateur dans tickets.toml | Consigné dans Result |
| 3 | Interface : liens-images de choix 40 × 44 | Exclusion inscrite (Boundaries) ; `td > a` limité aux icônes de police et au « - » ; fixture complétée (`div > a > img`, `div.t > a > img`) | Contrôle « liens-images égaux au bundle de base » : rouge sur le bundle 9.4 v1 (2 FAIL), vert |
| 4 | Événements : repli sans `label.form-check-label` ; ligne longue (relevé F3) | `.form-check` à 44 px de haut au minimum ; variante de fixture sans libellé ; ligne longue ajoutée | Sans libellé : rouge sur base et v1, vert (ligne 44, case atteinte). Ligne longue : le tableau (`display: block`, `overflow-x: auto`) défile, page sans débordement, en base comme en 9.4 ; F3 non reproduit sur fixture, rien corrigé |
| 5-6 | Retrait de `height: 44px !important` des `.form-control` | `select[multiple]` et `select[size]` : 44 -> 103 px, natif voulu ; contrôle « champs » ajouté sur la rédaction du kramail (sans garde) et dans une `.bootbox.modal` | Rouge sur la base (2 + 2 FAIL), vert. En modale, select-lg à 44 (règle `.modal-body select` antérieure) |
| 7 | Nav map : `a` sans `:not(.btn)` grandit « Travail » | `a:not(.btn)` pour les onglets ; règle `a.btn` (min-height unset, padding natif) avec les `!important` déplacés | « Travail à 34 px » : rouge sur v1 (2 FAIL), vert |
| 8 | `td > a:not(.btn)` trop large | Limité à `:is(:has(> i), .nomargin)` | Carte de ville à 767 : toujours 111 px (139 en base), les liens-icônes de 44 px élargissent `body > .container-fluid` (560 contre 504) ; `cartesJusqua: 375` gardé |
| 9 | typographie-formes : MASQUE_CIBLES_94 appliqué contre toute base | Conditionné à une base sans `kr-page-secondaire` | `KR_SCRIPT_AVANT_NETTOYAGE=<bundle 9.4> KR_FRAG=nettoyage` : 425 ok ; base par défaut : 425 ok |
| 10 | Cibles appliquées aux modales | `:where(:not(.modal *))` sur les quatre règles de cibles | `.radio`, `.checkbox`, `.form-check` dans une `.modal` sur /monde/guide égaux à la base : rouge sur v1 (2 FAIL), vert |

## Verification

**Commands:**
- `npm run build`, `npm run lint:css`, `npm run lint:js` -- codes de sortie 0.
- `npm run test:unit`, `npm run test:router` -- verts.
- `KR_FRAG=secondaires KR_SCRIPT=/tmp/kr94/base.user.js node tests/e2e/confort-mobile.mjs` -- rouge ; sans KR_SCRIPT -- vert.
- `npm run test:zone -- <zone>` sur confort-mobile, typographie-formes, cartes-pastilles, palette-nation, forum, forum-activite, kramail-redaction, cybermonde et les suites qui mesurent les éléments touchés -- verts.

## Result

Livré dans le worktree wt/9.4 (base 9b6851a), non commité. Correctifs de la revue indépendante appliqués (voir Review Triage Log).

- Fichiers : `kraland-userscript-template.js`, `kraland-theme.css`, `tests/e2e/confort-mobile.mjs`, `tests/e2e/cybermonde-carte.mjs`, `tests/e2e/forum-activite.mjs`, `tests/e2e/typographie-formes.mjs`, `tests/e2e/lib/router.mjs`, `tests/unit/identite.test.mjs`, 9 fixtures `tests/e2e/fixtures/secondaires-*.html` (Interface : liens-images `div > a > img` et `div.t > a > img` ; Événements : ligne longue sans coupure), bundle et `version.json` régénérés.
- Rouge : `KR_FRAG=secondaires KR_SCRIPT=/tmp/kr94/base.user.js node tests/e2e/confort-mobile.mjs` -> 164 contrôles en échec ; avec le bundle 9.4 de la première livraison (`/tmp/kr94/v1.user.js`) -> 8 en échec (Travail, liens-images, modale, Événements sans libellé). Vert : sans KR_SCRIPT -> 306 ok, 0 échec.
- Masques conditionnés (1, 9) : `KR_SCRIPT_AVANT=<bundle 9.4> KR_FRAG=panneaux node tests/e2e/cybermonde-carte.mjs` -> 13 ok ; `KR_SCRIPT_AVANT_NETTOYAGE=<bundle 9.4> KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs` -> 425 ok ; mêmes résultats contre la base par défaut. Contre-épreuves de la première livraison inchangées (sans masques : 2, 4 et 2 FAIL).
- `npm run test:zone -- confort-mobile typographie-formes cartes-pastilles palette-nation forum forum-activite kramail cybermonde menus-forums messages initialisation modale-ordre` : 11905 ok, 3 FAIL, tous dans `kramail-redaction#regression` (lecture 320, 375 et 1280 px, captures avant/après). Cause : le bundle « avant » de ce fragment est `origin/feature/next` (c8c4082), qui contient 7.2 (lecture du kramail) absent de la base 9b6851a. Rejoué seul avec `KR_SCRIPT_AVANT=<bundle 9b6851a>` : 12 ok. Écart de base, pas de 9.4 ; disparaît au rebase.
- `!important` : 3275 (base 3277, les deux `height: 44px` retirés ; aucun nouveau).
- Commandes : build, lint:css et lint:js (code 0 ; 1 avertissement préexistant dans report-non-lu.mjs), test:unit, test:router (verts), `diff -r .hermes/skills .claude/skills` (vide).

### Reports et doutes

- Contacts (`/contacts`) : hors périmètre ; impact croisé de la peau du forum en mobile (relevé 2026-10-29) reporté, non corrigé.
- Fenêtre `/help` et `/help/<partie>` : gabarit propre, sans garde, texte à 0 px à 375 et 1280 ; hors liste, reportée.
- Liste des Membres (`/communaute/membres`, liens de 34 px) : écart connu, sans fixture ni correctif ; report créé par le coordinateur dans tickets.toml.
- Liens-images de choix d'Interface (40 × 44) : exclus, laissés natifs (peut-être des liens d'action).
- Événements : le `label.form-check-label` est supposé (le relevé 9.3 ne cite que l'input 20 × 20). Repli sans libellé : la ligne `.form-check` fait 44 px de haut, mais seule la case de 20 × 20 reste touchable (la CSS ne rend pas la ligne cliquable sans libellé).
- Ligne longue d'Événements (F3) : non reproduite sur fixture ; le tableau (`display: block`, `overflow-x: auto`, natif de la peau) défile, page sans débordement, en base comme en 9.4. Rien corrigé ; à revoir sur le site si F3 persiste.
- Formulaires : `select[multiple]` et `select[size]` passent de 44 à 103 px (hauteur native, voulu). En modale, tout select reste à 44 px (règle `.modal-body select` antérieure).
- Carte de ville : conteneur du chevron Fonctionnaires et contenu des icônes de tableau supposés ; glyphe du chevron à 29 px du bord droit (24 dans la base).
- Carte de ville à 767 px : cartes toujours à 111 px des bords (139 dans la base) après la restriction de `td > a` ; les liens-icônes de 44 px élargissent `body > .container-fluid` (560 contre 504). `cartesJusqua: 375` gardé.
- La fixture cybermonde-region.html (suite cybermonde-carte) garde son titre hors de la région : le titre collant n'y est pas mesuré.
- Exclus : liens au fil du texte (« Artiste », « ici », `p.help-block > a` d'Interface), `.btn` (dont « Travail », 34 px) et `button.btn-xs` (épopée 4), modales.
- Hypothèse input-lg : vérifiée seulement sur les pages publiques, Interface et Contacts (aucun input-lg relevé).
- confort-mobile : COMMIT_AVANT passe de de4c079 à 9b6851a (contient 7.1, 9.1, 9.2 et 9.6).
- Masques MASQUE_CIBLES_94 (typographie-formes) et margeSecondaire (cybermonde-carte) : inactifs dès que la base contient `kr-page-secondaire` ; à retirer ensuite.
- `node_modules` du worktree : lien symbolique vers le dépôt principal, non suivi, à ne pas commiter.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (`ec66ba6`) et fusionné sur `feature/next` (`724c5c1`) ; `test:all` avant fusion : 15685 ok, 0 FAIL, journal `/private/tmp/kr-testall-94.log` (01:34, arbre déduit de l'heure).
