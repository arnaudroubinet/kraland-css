---
title: 'Jauges PM et PP du mini-profil mobile : chacune sa valeur'
type: 'bugfix'
ticket: 9
created: '2026-10-28'
status: 'built'
baseline_revision: '7e69719023daea54d8e485bbc07b6951dbe38496'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `findGaugeInSection` retient le premier élément de `#player-vitals-section` dont le texte commence par le type ou contient « ␣PM␣ »/« ␣PP␣ » : la `.col-sm-8.nopadding-right` commune aux trois jauges. Sur la fixture, PV, PM et PP du mini-profil mobile affichent « 18/30 » à 60 %.

**Approach:** Lire chaque jauge depuis son bouton (`a.alert141` PV, `a.alert142` PM, `a.alert143` PP) : valeur = premier nombre du texte du bouton ; maximum = somme des `.sr-only` de la `.progress` de la colonne qui suit celle du bouton ; pourcentage = valeur / maximum. Aucune recherche par texte, donc indépendant des espaces autour de « PM »/« PP ».

## Acceptance Criteria (complétés au plan)

1. Fixture `palette-nation-jauges.html` à 375 × 667, plié puis déplié : compactes PV 18, PM 25, PP 45 ; complètes « 18/30 », « 25/25 », « 45/150 » ; remplissages à 60 %, 100 %, 30 % (± 1 point).
2. Même résultat quand le texte des boutons est `PV&nbsp;&ensp;18` (forme des fixtures `jeu-*.html`) et quand les espaces entre balises sont retirés.
3. Jauge à 0 (PP 0, reste 150) : valeur 0, « 0/150 », remplissage 0 %, aucune exception.
4. Bouton ou `.progress` absent : la jauge concernée n'est pas rendue (comportement existant d'un `null`), les autres restent justes.
5. Le nouveau test échoue sur le bundle de la base (`KR_SCRIPT`) et passe après correction.
6. Inchangés : couleurs, tailles, formes des jauges (ticket 3.6), barres du panneau sur ordinateur, barres de PV des cartes de personnages.

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` L1278-1297 `extractGaugeData` -- seul appelant : L1358. À supprimer avec l'ancienne recherche.
- `kraland-userscript-template.js` L1336-1387 `findGaugeInSection` + appels PV/PM/PP -- à remplacer. Retour inchangé `{ type, current, max, percent }` (consommé L1476-1517, rendu non touché).
- `kraland-userscript-template.js` L8148 -- pose `id="player-vitals-section"` ; garder la portée de recherche dans cette section.
- `tests/e2e/fixtures/palette-nation-jauges.html` L56-78 -- bouton dans `.col-xs-12.col-sm-4 > .btn-group-xs`, puis `.col-xs-12.col-sm-8 > .progress` à 2 segments (`.sr-only` valeur, reste). Ne pas modifier.
- `tests/e2e/fixtures/jeu-materiel.html` L66-71 -- même structure, texte `PM&nbsp;&ensp;25`, `PP&nbsp;&emsp;0` / reste 150 : modèle des variantes de l'AC 2-3.
- `tests/e2e/plateau-profil-mobile.mjs` (212 lignes, zones `profil`, `plateau`, `KR_SCRIPT` géré L17) -- y ajouter le test. Ne pas toucher `palette-nation.mjs` (ticket 13).

## Tasks & Acceptance

- [x] `tests/e2e/plateau-profil-mobile.mjs` -- scénario « valeurs des jauges » : fixture `palette-nation-jauges.html` servie à `/jouer/plateau`, 375 × 667, 3 variantes de corps (brute ; boutons en `&nbsp;&ensp;` ; espaces entre balises retirés) + PP à 0/150 ; relever textes `.mobile-gauge-compact-value`, `.mobile-gauge-full-header span:last-child` et `style.width` des remplissages, plié puis déplié -- AC 1-3, 5.
- [x] `kraland-userscript-template.js` -- nouvelle lecture par bouton, suppression de `extractGaugeData` -- AC 1-4.

## Implementation Notes

Oneshot : un module, environ 30 lignes de JS et 50 de test, 2 fichiers.

Réalisé dans le worktree `kraland-css-wt9` (branche `wt/9`, base 7e69719), non commité :
- `kraland-userscript-template.js` : `extractGaugeData` supprimée ; `findGaugeInSection(section, type, alertClass)` lit le premier nombre de `a.alert14x`, prend la `.progress` de la colonne suivant `button.closest('[class*="col-"]')`, maximum = somme des `.sr-only` (repli : valeur × 100 / largeur du premier `.progress-bar`), `null` si bouton, nombre, `.progress` ou maximum absents. Retour `{ type, current, max, percent }` inchangé.
- `tests/e2e/plateau-profil-mobile.mjs` : corps de route variable, 5 cas à 375 × 667, plié puis déplié (brute, `&nbsp;&ensp;`, espaces entre balises retirés, PP 0/150, bouton PM absent → PM non rendue, PV/PP justes) + aucune `pageerror` ; 15 contrôles ajoutés (75 au total).
- Rouge : `KR_SCRIPT=/tmp/kr-base-7e69719.user.js node tests/e2e/plateau-profil-mobile.mjs` → 10 échecs (les 10 contrôles de valeurs ; les 5 « aucune exception » passent).
- Vert après `npm run build` : `lint:js` 0, `lint:css` 0, `test:zone -- profil` (181 ok), `-- plateau` (1021 ok), `-- palette-nation` (1364 ok), `test:router` conforme.
- Contre-épreuve : bundle muté `"PM","alert142"` → `"PM","alert141"` → rouge sur tous les cas.

Reprise après revue (constats 1, 2, 3, 5 ; 4 rejeté) :
- Template : colonne du bouton bornée à `#player-vitals-section` (`section.contains(column)`, sinon `null`).
- Test : 2 cas ajoutés, « `.progress` PP absente » (PP non rendue, PV/PM justes) et « `.sr-only` PP absents » (maximum 150 tiré de la largeur 30 %) ; `readGauges` ne lève plus de TypeError si un élément manque (valeur « absente », largeur NaN) ; 7 cas, 21 contrôles de jauges, 81 au total.
- Rouge : `KR_SCRIPT=/tmp/kr-base-7e69719.user.js` → 14 échecs (les 14 contrôles de valeurs).
- Vert : `npm run build`, `lint:js` 0, `lint:css` 0, `test:zone -- profil` (187 ok), `-- plateau` (1027 ok), `-- palette-nation` (1364 ok), `test:router` conforme.
- Contre-épreuves : `alert142` → `alert141` → 14 rouges ; repli `m=Math.round(100*n/e)` → `m=n` → 2 rouges (cas `.sr-only` absents). La borne de section n'a pas de contre-épreuve (aucune fixture où la colonne sort de la section).

Régression vue par `test:all` (coordinateur) : `KR_FRAG=nettoyage node tests/e2e/typographie-formes.mjs` → 4 FAIL « styles calculés égaux à la base » (largeurs des remplissages PM/PP et du texte des valeurs). Effet voulu du ticket : la base 6270c81 affichait PV dans les trois jauges. Test corrigé, pas le code :
- `tests/e2e/typographie-formes.mjs` : `MASQUE_JAUGES_9` (option `masque` d'`EMPREINTES`, propriétés exclues par élément, hors pseudo-éléments), passé à la seule comparaison « styles calculés égaux à la base ». Éléments : `.mobile-gauge-compact-fill`, `.mobile-gauge-full-fill`, `.mobile-gauge-compact-value`, `.mobile-gauge-full-header > span` ; propriétés : `width`, `inline-size`, `right`, `inset-inline-end`, `perspective-origin`, `transform-origin`. Condition de retrait : quand `COMMIT_NETTOYAGE` passe au-delà du commit du backlog 9. Commentaire « Aucun masque » mis à jour.
- Autres suites : `palette-nation.mjs` relève les jauges contre des jetons, pas contre une base (zone verte) ; rien d'autre ne compare `mobile-gauge-*` à une base.
- Vert : `npm run build`, `lint:js` 0, `lint:css` 0, `KR_FRAG=nettoyage` typographie-formes vert, `test:zone -- typographie-formes` (4402 ok), `-- profil` (187 ok), `-- plateau` (1027 ok), `test:router` conforme.

## Design Notes

- Colonne du bouton : `button.closest('[class*="col-"]')`, puis `nextElementSibling` contenant `.progress`.
- Assumption : maximum = somme des `.sr-only` ; repli si absents = valeur × 100 / largeur du premier `.progress-bar`, sinon `null`. Pas de repli sur la recherche par texte.
- Assumption : la valeur vient du bouton (le ticket l'indique), pas du premier `.sr-only`.

## Verification

- `npm run lint:js` puis `npm run lint:css` (séparés, codes de sortie lus) -- 0 erreur.
- Rouge : `git show 7e69719:kraland-userscript-main.user.js > "$TMPDIR/base.user.js"` puis `KR_SCRIPT="$TMPDIR/base.user.js" node tests/e2e/plateau-profil-mobile.mjs` -- échec des contrôles PM/PP.
- `npm run build`, puis `npm run test:zone -- profil` et `npm run test:zone -- plateau` -- vert.
- `npm run test:zone -- palette-nation` (frags `jauges-*` : largeurs PM/PP changent) -- vert.
- `npm run test:router` -- vert (tests/ change).
- Contre-épreuve : muter la classe `alert142` en `alert141` dans le module, test rouge.

## Notes

- Point ouvert du ticket non tranché : texte réel du panneau inconnu. Les fixtures `jeu-*.html` montrent `PV&nbsp;&ensp;18` : si le site est ainsi, `includes(' PM ')` échoue sur le conteneur et le bouton est pris, d'où sans doute PM/PP à la bonne valeur mais à 100 %. La lecture par bouton couvre les deux cas ; la sonde en lecture seule sur `/jouer/plateau` reste à faire par Arnaud (AC 3 du ticket).
- `typographie-formes` mesure `.mobile-gauge-compact-value` (taille, pas valeur) : non concerné.
- Conflits : ticket 13 (palette `.btn-success`, suites palette-nation/typographie-formes/cartes-pastilles) et ticket 12 (forum) ne touchent pas ces fichiers ; seul le bundle et `version.json` divergent.

## Plan Change Log

- 2026-10-28 : AC 4 couvert par un cas « bouton PM absent » ajouté au scénario (non listé dans la tâche de test, sans changer l'intention). Contre-épreuve de mutation faite sur une copie du bundle (le source n'est pas modifié).
- 2026-10-28 : revue — borne de section sur la colonne du bouton, cas `.progress` absente et repli par largeur ajoutés, garde de `readGauges`.
- 2026-10-28 : masque `MASQUE_JAUGES_9` dans le fragment nettoyage de typographie-formes (base 6270c81 aux mauvaises valeurs PM/PP), retrait quand la base dépasse le commit du backlog 9.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | tests/e2e/plateau-profil-mobile.mjs:57 | Critère 4, cas « `.progress` absente » non couvert | réel | patch (fixed) | `GAUGE_CASES` sans variante sans `.progress` |
| 2 | quick | tests/e2e/plateau-profil-mobile.mjs:52-58 | Repli par largeur (template:1331-1335) jamais exercé | réel | patch (fixed) | toutes les variantes gardent les `.sr-only` |
| 3 | quick | kraland-userscript-template.js:1322 | `closest('[class*="col-"]')` non borné à `#player-vitals-section` | réel, faible | patch (fixed) | peut atteindre `#col-left` (`col-md-3`) |
| 4 | quick | kraland-userscript-template.js:1330 | `.sr-only` « 60% Complete » ou séparateur de milliers fausserait le maximum | rejeté | none | fixtures `jeu-*` et panneau relevé : `.sr-only` numériques, valeurs ≤ 150 |
| 5 | quick | tests/e2e/plateau-profil-mobile.mjs:221-222 | `readGauges` lève TypeError au lieu d'un échec lisible | réel | patch (fixed) | `compact.closest` / `full.closest` sans garde |

## Result

- Revue quick : 5 constats bas ; 1, 2, 3 et 5 corrigés, 4 rejeté (voir Review Triage Log).
- `test:all` du worktree `wt/9` (base 7e69719) : 13718 ok, 0 FAIL en 340 s, machine calme. Un premier passage avait relevé 4 FAIL réels dans `typographie-formes#nettoyage` (largeurs PM/PP corrigées comparées à la base fausse) : masque `MASQUE_JAUGES_9` ajouté, avec condition de retrait ; 2 FAIL de charge dans `cartes-pastilles#etiquettes`, verts rejoués seuls.
- `lint:css`, `lint:js`, `test:router` verts ; `!important` 3281 ; copies de skills identiques.
- Reste pour Arnaud : relevé en lecture seule du texte réel du panneau sur `/jouer/plateau` à 375 px (espaces autour de PM/PP).
