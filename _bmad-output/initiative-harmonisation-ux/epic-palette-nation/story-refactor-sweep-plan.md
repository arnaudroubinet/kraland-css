---
title: 'Refactor sweep'
type: 'refactor'
ticket: '8'
created: '2026-10-23'
status: 'built'
baseline_revision: 'f3f838a5aa48396305e6455034ef63270fe1f772'
route: 'full'
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

**Problem:** Les tickets 3.1 à 3.6 laissent surtout des doublons dans la suite `palette-nation.mjs` (sonde de couleur recopiée 7 fois, 4 recherches « couleur parmi une liste », `proche` 3 fois, test sombre/clair répété, constante de secondaire clair dupliquée), un commentaire de ticket abandonné et un commentaire CSS mal placé.

**Approach:** Nettoyage sans aucun changement de rendu ni de contrôle : mêmes vérifications, même nombre de contrôles à ±0, helpers partagés dans `tests/e2e/lib/variantes.mjs`.

## Boundaries & Constraints

**Always:** comportement du userscript et du CSS strictement inchangé (seul un commentaire CSS bouge) ; la suite palette-nation garde exactement les mêmes contrôles et le même total ok ; aucun nouveau repère de classe à tiret cité par une 4e suite (MAX_CITING = 3 du routeur) ; `npm run test:router` conforme.

**Never:** toucher aux `hr` masqués (décision d'Arnaud en attente), à `JETONS_REDEFINIS` / `COMPOSANTS_TICKET4/5` / `AVANT_TICKET5` (servent aux comparaisons jusqu'au push), aux `--kr-focus-ring*`, à `--kr-gold` / `--kr-badge-pnj` / `--kr-bootstrap-blue` (hors épopée) ; supprimer `alerteSombre` ; corriger la règle l.833 des boutons d'état (change le rendu) ; toute commande git modifiant arbre, index ou stash ; site réel ; Chrome 9222/9223.

</frozen-after-approval>

## Code Map

- `tests/e2e/palette-nation.mjs` -- l.73 commentaire « focus (ticket 7) » ; `rougeKraland` l.171, `commeGris` l.983, `commeBootstrap` l.1220, `ancienneJauge` l.1483 (même recherche à 1 près par canal ; `rougeKraland` sans test `a[3] > 0`) ; `sonde` recopiée l.210, 636, 795, 822, 999, 1240, 1486 (dans des fonctions évaluées dans la page ; deux formes : texte brut ou via `K.rgb`) ; `proche` l.985 (chaînes, Node) et l.638/796 (tableaux, page) ; ~20 `variante.endsWith('-dark')`, `couleurEtat` l.1211, `couleurJauge` l.1479, l.1545 ; `SECONDAIRE_CLAIR = '#636a77'` l.982.
- `tests/e2e/lib/variantes.mjs` -- `CONTRASTE()` l.89 pose `window.__krContraste` (y ajouter `sonde` et `procheRgb`) ; `TEXTE_SECONDAIRE_CLAIR` l.49 (constante unique à réutiliser).
- `kraland-theme.css` -- l.3065 commentaire « Fond, bordure et liens des alertes… (ticket 3.5) » au-dessus de `html[class*="-dark"] .alert { color }` qui ne fait pas cela : le placer au-dessus des règles qu'il décrit ou le reformuler.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/palette-nation.mjs` -- retirer « focus (ticket 7) » de la liste l.73 -- ticket 3.7 abandonné.
- [x] `tests/e2e/palette-nation.mjs` -- un helper `parmi(couleur, liste, { opaque })` remplace les 4 recherches -- doublon.
- [x] `tests/e2e/lib/variantes.mjs` + `palette-nation.mjs` -- `sonde` et `proche` (tableaux) une fois dans `__krContraste` ; les 7 + 2 copies l'appellent -- doublon.
- [x] `tests/e2e/palette-nation.mjs` -- `const mode = v => v.endsWith('-dark') ? 'sombre' : 'clair'` utilisé là où le libellé sombre/clair est dérivé -- doublon.
- [x] `tests/e2e/lib/variantes.mjs` + `palette-nation.mjs` -- `SECONDAIRE_CLAIR` remplacé par l'import de `TEXTE_SECONDAIRE_CLAIR` -- valeur dupliquée.
- [x] `kraland-theme.css` -- commentaire l.3065 déplacé ou reformulé -- commentaire trompeur.

**Acceptance Criteria:**
- Given la base, when on lance `node tests/e2e/palette-nation.mjs` avant et après, then même total ok, 0 FAIL, mêmes noms de fragments.
- Given le bundle régénéré, when on compare le CSS hors commentaires à la base, then il est identique.

## Implementation Notes

Périmètre retenu : « focus (ticket 7) » retiré de la liste des sujets non vérifiés ; `parmi(couleur, liste, { opaque })` remplace `rougeKraland`/`commeGris`/`commeBootstrap`/`ancienneJauge` (mêmes noms d'appel) ; `sonde` et `procheRgb` posés une fois par `CONTRASTE()` dans `window.__krContraste`, les 7 + 2 copies supprimées ; helper `mode` pour les libellés sombre/clair (variable locale renommée `ton` dans `verifierJauges`) ; `TEXTE_SECONDAIRE_CLAIR_HEX` exporté de `lib/variantes.mjs` ; commentaire CSS des alertes sombres reformulé. `proche` sur chaînes (Node) laissé en place.
Preuve : `palette-nation.mjs` 1322 ok / 0 FAIL avant et après, lignes ok/FAIL identiques au caractère ; CSS identique à la base hors commentaires.
Écartés : `hr` masqués (décision d'Arnaud en attente), jetons de comparaison figée (jusqu'au push), `alerteSombre`, règle l.833 des boutons d'état (change le rendu), `--kr-gold`/`--kr-badge-pnj`/`--kr-bootstrap-blue` (hors épopée).
Vérification finale (machine calme) : build, `test:router` conforme, `lint:css` 0, `lint:js` 0 erreur (1 avertissement préexistant), `test:unit` 56/56, skills identiques, `test:all` 6005 ok 0 FAIL (un premier passage : 1 FAIL d'opacité de la croix pendant le fondu, suite seule verte 3/3, consigné dans deferred-work).

## Plan Change Log

## Review Triage Log

Passe quick du 2026-10-23 : 2 low, 0 false. (1) low, patch — `kraland-theme.css` l.3065 : la 2e phrase du commentaire peut se lire comme décrivant le bloc alors que fond, bordure et liens sont posés dans les règles communes (« section 5 » est la convention du fichier, citée l.2810, 3471) ; reformulation explicite « posés ailleurs ». (2) low, patch — `palette-nation.mjs` l.986 : `SECONDAIRE_CLAIR` recalculé par regex `[0]` sur la règle CSS (lèverait au chargement si la constante changeait de forme) ; constante hex exportée `TEXTE_SECONDAIRE_CLAIR_HEX` dans `lib/variantes.mjs`. Points vérifiés sans défaut par le relecteur : équivalence de `parmi`, des 7 `sonde` et 2 `proche`, libellés de `mode`, `CONTRASTE` évalué avant tout appel, zones interdites intactes.

## Verification

**Commands:**
- `npm run build` ; `node tests/e2e/palette-nation.mjs` (total ok identique à la base) ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` (1 avertissement préexistant) ; `npm run test:unit` ; `npm run test:all` machine calme -- 0 FAIL.
