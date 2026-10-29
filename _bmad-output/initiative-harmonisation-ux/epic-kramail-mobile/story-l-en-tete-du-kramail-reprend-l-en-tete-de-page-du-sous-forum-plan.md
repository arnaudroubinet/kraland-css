---
title: "L'en-tête du kramail reprend l'en-tête de page du sous-forum, sélecteur de personnage compris"
type: 'feature'
ticket: '3'
created: '2026-10-29'
status: 'built'
baseline_revision: 'c8c4082ae0c010bf946729bfe8fd050e9cf8c745'
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

**Problem:** Sur mobile, le h1 du kramail (liste, lecture) est une colonne propre (padding 12/16, marge 0) sans fil d'Ariane, au lieu de l'en-tête L2 du sous-forum ; au bureau, ses règles (bordure primaire, marges 40/0/16) divergent du sous-forum. Le menu de personnage est construit en styles en ligne (rayon déclaré deux fois, report 4.8) et le mode sombre a des règles propres.

**Approach:** Le module `Kramail:CharacterSwitcher` devient l'en-tête du kramail : sur mobile, h1 = fil d'Ariane commun (6.3) + `.forum-subforum-head` dont le titre est le sélecteur (liste) ou le sujet (lecture), puis la barre de boutons existante ; au bureau, h1 natif aux valeurs du sous-forum, le sélecteur à la place du nom. Aucun style en ligne : ouverture par `aria-expanded`, rayon et couleurs dans la feuille, par jetons.

## Boundaries & Constraints

**Always:** P1 option 4 (réécrire l'origine : élargir les `:where()` du fil et de l'en-tête de l'index, restreindre les règles kramail h1 à la rédaction) ; aucun nouvel `!important` (total ≤ 3205) ; gardes `:where(html.x)` ; mobile `max-width: 767px`, bureau `min-width: 768px` ; cibles ≥ 44 px ; ordre DOM natif de la barre de boutons ; structure `option > div > span:first-child` = coche (lue par palette-nation).

**Never:** toucher la rédaction (entrée 5 : rendu inchangé, sélecteur mobile sans menu gardé) ; inventer un sélecteur sur la lecture (le h1 natif n'y porte pas de nom) ; éditer le bundle ; site réel.

**Décisions (Assumptions, autonome, doutes dans revue-manuelle.md) :**
- A1 Sélecteur sur la liste aux deux supports ; rédaction mobile seulement (inchangé) ; lecture et Signaler : aucun sélecteur, fil « Kramail › Personnage › » avec le lien de Réception.
- A2 « Menu de personnage ouvrable » du verify s'entend sur kramail-reception ; kramail-lecture est vérifiée pour l'en-tête seul.
- A3 Libellé racine du fil : titre actif de la colonne gauche (« Kramail »), repli « Kramail », href `kramail`.
- A4 Au bureau, la règle hover/graisse des `.btn-default` du h1 et la bordure primaire ne restent que pour la rédaction.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Liste mobile | kramail-reception, 375/767 | h1 block m 12 16 p 0 sans bordure ; fil « Kramail › Personnage fictif » 44 px ; titre-sélecteur 24/700 ; onglets dessous | — |
| Lecture mobile | kramail-lecture | fil « Kramail › Personnage fictif › » + courant = sujet ; titre = sujet ; icône native retirée ; barre de Lecture après | lien de Réception absent : fil « Kramail › sujet » |
| Bureau | reception/lecture 1280 | h1 = valeurs du sous-forum (m 40 0 20, p 0 0 9, bordure #eee, 36/500, boutons 400) | — |
| Menu | clic sur le sélecteur | menu visible, rayon 8 px, aucun attribut style, options ≥ 44 px, ferme au clic extérieur | un seul personnage : pas de sélecteur |
| Variantes | 16 variantes | contraste ≥ 4,5:1 titre, fil, options, catégorie, coche | — |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` `Kramail:CharacterSwitcher` (l.5715-5996) -- réécrit : sélecteur sans style en ligne, en-tête mobile (marque `kr-kramail-entete` sur h1), lecture ; observer rejoue au passage mobile. Réutilise `createForumBreadcrumb`, `getActiveTitleLabel`, `cloneVisibleContent`, `setRichContent`. `Kramail:Lecture` (33) ajoute sa `.pull-right` en fin de h1 : ne pas changer.
- `kraland-theme.css` l.8961 (h1 colonne) -- restreint à la rédaction ; nouvelle règle liste/lecture. l.4483 -- exclure `.kr-kramail-entete`. l.9400-9494 -- sélecteur réécrit (état `aria-expanded`, classes nom/catégorie/coche, rayon), règles sombres retirées ; copie bureau. l.9900-9928 -- restreintes à `:where(html.kr-page-kramail-compose)`. l.14632-14689 -- `:where()` élargis aux gardes liste/lecture.
- `tests/e2e/kramail-theme.mjs` -- fragments `entete`, `entete-menu`, `entete-couleurs` ; `bureau` adapté.
- `tests/e2e/typographie-formes.mjs` l.1314-1340, 2125-2150 ; `palette-nation.mjs` l.761-762 ; `lib/variantes.mjs` l.204 -- lecteurs du sélecteur et du h1, à adapter avec condition de retrait.
- `tests/e2e/lib/router.mjs` -- routes `Kramail:` déjà vers forum + kramail.

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/kramail-theme.mjs` -- fragments rouges sur `/tmp/kt73-base.user.js` -- preuve rouge
- [ ] `kraland-userscript-template.js` -- réécrire le module -- intention
- [ ] `kraland-theme.css` -- réécrire les origines ci-dessus -- intention, P1
- [ ] suites de régression -- adapter avec condition de retrait -- pas de faux rouge
- [ ] `revue-manuelle.md` -- doutes A1-A4

**Acceptance Criteria:**
- Given rédaction mobile et bureau, when rendue, then valeurs calculées du h1 égales à la base.
- Given 375 → 1280 dans le même onglet, when le mode change, then aucun débordement et menu toujours ouvrable.

## Implementation Notes

- Implémenté directement, sans sous-agent : les interdits du mandat (git, test:all, site réel) ne sont pas dans le plan, un agent neuf ne les aurait pas.
- Module réécrit (`readCharacters`, `buildSelector`, `readingCharacter`, `buildMobileHead`) ; marque `kr-kramail-entete` sur le h1 mobile ; un seul personnage : titre sans sélecteur, fil gardé. Observer : rejoue l'init au passage mobile (idempotent par la marque).
- CSS : 4483 exclut `.kr-kramail-entete` ; 8961 et 9924 gardés par `:where(html.kr-page-kramail-compose)` ; 9900/9906 par `body.page-kramail:where(.kr-page-kramail-compose *, .mobile-mode)` (mobile inchangé) ; sélecteur réécrit (aria-expanded, classes, rayon dans la feuille seule), règles sombres retirées, copie bureau sans `!important` ; fil et tête : `:where()` élargis à `html.kr-page-kramail`.
- Surprise : `--kr-text-muted` de la catégorie à 2,54:1 (6 variantes claires) et < 4,5 en sombre : passé à `--kr-text-secondary`.
- `!important` : 3205 → 3197.
- Après la passe des zones, puis la revue : A4 appliqué (graisse, rayon et survol en accent des boutons du h1 au bureau sur la rédaction seule ; règles dans leur média, plus de garde `mobile-mode`). Options : fond au survol et au `:focus-visible`, contour primaire au `:focus-visible` ; spécificité `.kramail-character-dropdown .kramail-character-option` au bureau, pour battre `a:focus` de Bootstrap.
- Masques de régression : `AVANT_TICKET73` et `RETIRER_ENTETE_TICKET73` dans `lib/variantes.mjs`. Ils y sont parce que le repère est cité par plus de 3 suites (MAX_CITING). Ils servent dans cartes-pastilles (`comparer`), forum-activite (`plus` : position du « ••• » non comparée sur mobile, h1 retiré avant l'empreinte du bureau) et typographie-formes. Dans typographie-formes : `echelle`, `echelle-forum` (h1 de la liste et de la lecture hors du relevé, classes du menu de la rédaction ignorées), `nettoyage` (h1 retiré ; A8 et « rendu changé » sautés sur la réception ; menu « égal à la base » non contrôlé). Chaque masque a une condition de retrait : la base de la suite contient `kr-kramail-entete`.
- kramail-theme `bureau`/`bascule` : écart voulu `ECART_ENTETE` tant que la base précède l'entrée (h1, graisse, largeur des boutons ; hauteur et position verticale comparées), retrait au recalage de BASE_SHA. kramail-redaction `regression` : masque `AVANT_TICKET73` (repère `kr-kramail-entete`), h1 retiré des deux rendus.

## Plan Change Log

- 2026-10-29, revue indépendante : non approuvable en l'état. 11 constats, tous corrigés (Review Triage Log). Changement de conception : A4 appliqué tel que gelé (survol en accent des boutons du h1 au bureau sur la rédaction seule) ; la règle de palette-nation suit la rédaction. Le ticket reste en `in-review`.

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | A4 du gelé non appliqué : survol en accent des boutons du h1 au bureau hors rédaction | Corrigé : survol sous `:where(html.kr-page-kramail-compose)` au bureau, gardé sur mobile ; palette-nation vise la rédaction au bureau (pas de masque) | Rouge : mutation sans survol de la rédaction, FAIL `textes-bureau` |
| 2 | HAUTE : Entrée sur une option avalée par le `keydown` du sélecteur | Corrigé : `if (dropdown.contains(e.target)) { return; }` en tête du gestionnaire | Fragment `entete-clavier` ; rouge sans le correctif (« navigation : null ») |
| 3 | Focus visible des options perdu | Corrigé : cartes-pastilles compte `>=` (intention commentée) ; `:is(:hover, :focus-visible)` (fond) et contour primaire 2 px en `:focus-visible` seul, dans chaque média | `entete-clavier` vérifie le contour ; rouge sans les règles (« outline none ») |
| 4 | Masque `ECART_ENTETE` inconditionnel et trop large | Corrigé : conditionné à `AVANT_TICKET73(BASE_BUNDLE)` ; rectangle comparé en hauteur et position verticale ; graisse et largeur des boutons ignorées (écart A4 voulu) ; à 768 px, `bascule` compare le h1 à sous-forum-debuter | Rouge : mutation de 6 px en haut du h1, FAIL `bureau` (rect) ; `KR_SCRIPT_BASE` = bundle corrigé : tout comparé, vert |
| 5 | Critère « 375 → 1280 dans le même onglet » non couvert | Corrigé : `bascule` passe par 768 puis 1280 px et ouvre le menu (visible, dans l'écran, fermé au clic extérieur) | Rouge sur la base |
| 6 | Seuils 768 et 769 absents de `entete` | Corrigé : largeurs 375, 767, 768, 769, 1280 | Rouge sur la base |
| 7 | Contraste de la lecture non mesuré | Corrigé : `entete-couleurs` mesure kramail-lecture à 375 px, 16 variantes | Rouge sur la base (16 FAIL) |
| 8 | Commentaires de masques : « se retirent seuls » faux sur base figée | Corrigé : « retrait au recalage de COMMIT_* » (cartes-pastilles, forum-activite, typographie-formes, variantes) ; kramail-redaction (base feature/next) inchangé | Relecture |
| 9 | MutationObserver global et jamais déconnecté | Corrigé : lancé sur `html.kr-page-kramail` seul, pas lancé si la marque est posée, déconnecté au passage mobile | Pas de test de comportement propre : le seuil recharge la page ; `bascule` reste vert |
| 10 | Règle hors media query gardée par la classe JS `mobile-mode` | Corrigé : scindée en `@media (max-width: 767px)` et `@media (min-width: 768px)` sous `:where(html.kr-page-kramail-compose)` | Couvert par palette-nation et la zone |
| 11 | Sujet de la lecture lu par `textContent` (boutons compris) | Corrigé : nœuds texte directs du h1 seulement | `entete` : lecture dérivée avec un bouton dans le titre ; rouge avec `textContent` |
| 12 | Zone large : confort-mobile `hors-perimetre`, réception 375/767 px, texte du h1 différent de la base de4c079 (4 FAIL) | Écart voulu de l'entrée : masque `AVANT_TICKET73` + `RETIRER_ENTETE_TICKET73`, retrait au recalage de COMMIT_AVANT | Rejoué seul : vert ; suite complète : 328 ok |

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/kt73-base.user.js KR_FRAG=bascule,entete,entete-clavier,entete-couleurs node tests/e2e/kramail-theme.mjs` -- expected: FAIL
- `npm run build && npm run test:zone -- kramail palette-nation cartes-pastilles forum-activite typographie-formes confort-mobile` -- expected: PASS
- `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:router`, `diff -r .hermes/skills .claude/skills` -- expected: verts, diff vide

## Result

**Après revue (2026-10-29) :** 11 constats corrigés, plus un écart trouvé par la zone (Review Triage Log). Fichiers en plus : `tests/e2e/palette-nation.mjs`, `tests/e2e/confort-mobile.mjs`, fragment `entete-clavier` (kramail-theme, routeur).

**Rouge :**
- Base `/tmp/kt73-base.user.js` : `bascule` (h1 à 768 px, menu à 768 et 1280 px), `entete` (dont 768, 769 et la lecture avec bouton), `entete-clavier`, `entete-couleurs` (16 FAIL sur la lecture 375 px).
- Mutations : sans `dropdown.contains` : 4 FAIL `entete-clavier` (« navigation : null ») ; sans contour `:focus-visible` : 4 FAIL (« outline none ») ; sujet par `textContent` : 1 FAIL `entete` ; sans survol de la rédaction au bureau : FAIL palette-nation `textes-bureau` ; h1 décalé de 6 px : 18 FAIL `bureau` (rect vertical).
- `KR_SCRIPT_BASE` = bundle corrigé (ECART73 faux, tout comparé) : `bureau,bascule` 30 ok.

**Vert :**
- kramail-theme `bureau,bascule,entete,entete-menu,entete-clavier,entete-couleurs` : 108 ok avant l'ajout de la lecture avec bouton, puis zone verte.
- Zone large `kramail palette-nation cartes-pastilles forum-activite typographie-formes confort-mobile` : 10092 ok, 4 FAIL (confort-mobile `hors-perimetre`, constat 12). Corrigé et rejoué : confort-mobile 328 ok, 0 FAIL. Toutes les autres suites : 0 FAIL.
- `lint:css` 0 ; `lint:js` 0 (un avertissement antérieur) ; `test:unit` 0 ; `test:router` « Routeur conforme » ; skills : diff vide.
- `!important` : 3197, inchangé par la revue.

**Historique (premier passage) :**
**Fichiers :** `kraland-userscript-template.js` (module `Kramail:CharacterSwitcher` réécrit), `kraland-theme.css`, bundle et `version.json` régénérés par `npm run build`, `tests/e2e/kramail-theme.mjs` (fragments `entete`, `entete-menu`, `entete-couleurs` ; `bureau`/`bascule` adaptés), `tests/e2e/kramail-redaction.mjs`, `tests/e2e/forum-activite.mjs`, `tests/e2e/cartes-pastilles.mjs`, `tests/e2e/typographie-formes.mjs`, `tests/e2e/lib/variantes.mjs` (`AVANT_TICKET73`, `RETIRER_ENTETE_TICKET73`), `tests/e2e/lib/router.mjs`, `revue-manuelle.md`. Diff complet depuis la base : `/tmp/kt73/diff.patch`.

**Rouge (base `/tmp/kt73-base.user.js`, `KR_SCRIPT`) :** `entete` 11 FAIL ; `entete-menu` + `entete-couleurs` 0 ok / 38 FAIL.

**Contre-épreuves (mutations) :**
- Catégorie remise en `--kr-text-muted` : 24 FAIL dans `entete-couleurs`.
- Rayon du menu retiré : FAIL « rayons 0px » dans `entete-menu`.
- `h1.style.marginTop='0px'` : FAIL dans `entete` (marge et style en ligne).
- Survol des boutons du h1 restreint à la rédaction : 10 FAIL dans palette-nation (`textes-bureau`, `textes-largeurs`).
- Règle `:focus` ajoutée : FAIL dans cartes-pastilles (`etiquettes`).

**Vert :**
- `KR_FRAG=bureau,bascule,entete,entete-menu,entete-couleurs node tests/e2e/kramail-theme.mjs` : 74 ok.
- kramail-theme `lecture,lecture-plus,lecture-couleurs,gardes,onglets` : 191 ok.
- kramail-redaction `regression` : 12 ok.
- forum-activite `plus` : 112 ok, 0 FAIL.
- cartes-pastilles `bureau,etiquettes` : 1294 ok, 0 FAIL.
- palette-nation `textes-bureau,textes-largeurs` : 89 ok, 0 FAIL.
- typographie-formes `echelle,echelle-forum,nettoyage` : 1229 ok, 0 FAIL.

**Zones :** `npm run test:zone -- kramail forum forum-activite typographie-formes palette-nation cartes-pastilles menus-forums messages`.
- Premier passage : 8 fragments en FAIL (palette-nation `textes-bureau` et `textes-largeurs` ; typographie-formes `echelle`, `echelle-forum` et `nettoyage` ; forum-activite `plus` ; cartes-pastilles `bureau` et `etiquettes`). Tous les autres sont ok.
- Chaque fragment en FAIL a été rejoué seul après correction (lignes ci-dessus) : tous verts.
- La zone complète n'a pas été relancée après les corrections.

**Autres commandes :**
- `npm run lint:css` : sortie 0.
- `npm run lint:js` : sortie 0, un avertissement antérieur.
- `npm run test:unit` : sortie 0.
- `npm run test:router` : « Routeur conforme ».
- `diff -r .hermes/skills .claude/skills` : vide.
- `!important` : 3205 → 3197.

**Doutes (détaillés dans `revue-manuelle.md`, section Ticket 7.3) :**
- Pas de sélecteur sur la lecture.
- Sélecteur au bureau.
- Bureau : bordure et graisse du sous-forum, mais survol en accent gardé.
- Option sans `:focus` propre au bureau.
- Catégorie passée de muted à secondary.
- Lien `kramail` du fil.

Revue indépendante non faite (mandat).

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite (section « Après revue »), correctifs appliqués, commité (0e39faa) et fusionné sur `feature/next` (12da4c8) ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777` (SHA déduit de l'heure du journal).
