---
title: 'Refactor sweep de l''épopée Accueil mobile'
type: 'refactor'
ticket: '4'
created: '2026-10-30'
status: 'built'
baseline_revision: '1e8e6e262c20e5b22c95464574185c4f8bde7b3d'
route: 'oneshot'
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

**Problem:** Les entrées 10.3 et 10.5 laissent dans `kraland-theme.css` une garde de page de l'accueil recopiée en long dix fois, un bloc `@media (min-width: 3840px)` de l'accueil identique à celui de 2560 px, une garde de colonne posée sur `col-md-` seulement (constat 7 de 10.5), une règle du chevron recopiée de celle des pages secondaires (constat 8) et un `order: 3` du Forum déjà donné par `#col-t > *`.

**Approach:** Nettoyage sans aucun changement de rendu. Périmètre fixé au départ :
1. Garde des quatre cartes : `:where(:not(G :is(L), G :is(L) *))` réécrite en `:where(:not(G :is(L, :is(L) *)))` (G = `:where(html.kr-page-accueil)`, L = `.ds_user, .accueil-forum-section, .kraland-metrics, #player-header-section`), même portée et spécificité nulle, aux 10 occurrences.
2. Bloc `.page-accueil` en `min-width: 3840px` retiré : le bloc de 2560 px s'applique aussi au-delà avec les mêmes valeurs et la même spécificité (1,1,0), au-dessus des règles du plateau (1,0,0) ; 2 `!important` en moins. Vérifié à 2560 et 3840 px.
3. Constat 7 : garde `:where(:not(:where(html.kr-page-accueil) #col-right))` ajoutée aux deux sélecteurs `[class*="col-sm-"]` de « Empiler les colonnes » (#col-right de l'accueil est `col-md-6` : neutre).
4. Constat 8 : la règle du chevron de l'accueil rejoint celle des pages secondaires en liste combinée, chaque sélecteur gardant sa portée et sa spécificité (fusion en `:where(html.kr-page-secondaire, html.kr-page-accueil)` écartée : elle élargirait la portée à tout `.panel-heading` de l'accueil et baisserait la spécificité de (1,4,2) à (0,3,2)).
5. `#col-t > .accueil-forum-section { order: 3 }` retiré (doublon de `#col-t > * { order: 3 }`).

Écartés : `!important` du flex mobile (déjà retirés par 10.3, 0 dans le bloc mobile) ; bloc de 2560 px (nécessaire contre le plateau) ; classe posée par JS sur les cartes (posée après `DOMContentLoaded` alors que `kr-page-accueil` l'est au document-start : fenêtre où les règles génériques s'appliqueraient) ; fusion des fixtures `palette-nation-accueil.html` et `ACCUEIL_BOUTONS`/`ACCUEIL_RAYONS` avec `accueil.html` (elles portent `.kr-ministerial-card`, l'alerte transformée, `img-circle`, `dashboard-card-avatar` et des identifiants absents de `accueil.html` : leurs tests changeraient) ; aucun report D10.n dans `deferred-work.md`.

## Boundaries & Constraints

**Always:** rendu identique à 1e8e6e2 ; gardes en `:where(html.x)` ; `!important` ≤ 2900 ; bundle par `npm run build`.

**Never:** nouvel `!important` ; changement de spécificité ou de portée ; écriture git ; site réel ; `test:all`, `test:changed`.

</frozen-after-approval>

## Implementation Notes

Route oneshot : environ 30 lignes CSS dans un seul fichier, aucune modification de tests/.

- Fichiers : `kraland-theme.css` (5 points du périmètre, commentaire du bloc de 2560 px), bundle et `version.json` par `npm run build`, `revue-manuelle.md` (section 10.4).
- Base reconstruite depuis 1e8e6e2 (`/tmp/kr104/base.user.js`) : identique au bundle commité, hors version.
- Outil de comparaison hors dépôt (`/tmp/kr104/outil/compare.mjs`) : styles calculés de toutes les propriétés (hors transitions et animations, animations annulées) et boîte de chaque élément, base contre arbre du sweep. Il couvre accueil.html, ses variantes en mémoire (déconnectée, sans ministre, durcie) et palette-nation-accueil.html, à 320, 375×667, 767, 768, 1280, 2560 et 3840 px, en Kraland clair et en Empire Brun sombre. Résultat : 70 comparaisons, 0 écart.
- Contre-épreuves de l'outil :
  - chevron à −11 px au lieu de −12 px : 20 écarts à 375 px ;
  - bloc de 2560 px borné sous 3840 px : 566 écarts à 3840 px.
- Constat de la revue (commentaire ambigu « dès 2560 px et au-delà de 3840 px ») : corrigé. Le CSS minifié du bundle est identique (diff vide hors version).

## Review Triage Log

Revue quick (sous-agent, inspection) : 0 high, 0 medium, 1 low, 0 false.

| Constat | Verdict | Suite |
|---|---|---|
| Commentaire du bloc de 2560 px ambigu (« dès 2560 px et au-delà de 3840 px ») | low | patch : « à partir de 2560 px, 3840 px compris » ; bundle minifié inchangé |

## Verification

**Commands:**
- `npm run build` -- validation OK.
- Comparaison des styles calculés de tous les éléments de `accueil.html` (et variantes déconnectée, sans panneau) contre le bundle de 1e8e6e2 (`/tmp/kr104/base.user.js`) à 375×667, 767, 768, 1280, 2560 et 3840 px -- 0 écart.
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes confort-mobile cloche cartes-pastilles initialisation demarrage` et zones des listes -- code 0.
- `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- code 0 ; `grep -c '!important' kraland-theme.css` -- 2898.

## Result

Sweep 10.4 sans changement de rendu. Les dix gardes des cartes de l'accueil sont raccourcies sous une forme équivalente. Le bloc `.page-accueil` en ≥ 3840 px, doublon de celui de 2560 px, est retiré. La garde `#col-right` couvre aussi `col-sm-` (constat 7). Le chevron de l'accueil rejoint celui des pages secondaires en liste combinée (constat 8). L'`order: 3` en double du Forum est retiré. `!important` : 2898 (base 2900).

Preuves :
- comparaison des styles calculés et des boîtes contre le bundle de 1e8e6e2 : 70 comparaisons, 0 écart, de 320 à 3840 px, sur 5 pages et 2 variantes ; contre-épreuves de l'outil rouges (20 et 566 écarts) ;
- `npm run test:zone` sur accueil-mobile, palette-nation, typographie-formes, confort-mobile, cloche, cartes-pastilles, initialisation, demarrage, plateau, profil, kramail, forum, sous-forum, forum-activite et report : 17668 ok, 0 FAIL ;
- `test:router`, `test:unit`, `lint:css` et `lint:js` : code 0.

Écartés : `!important` du flex mobile (déjà retirés par 10.3), classe JS, fusion des fixtures (voir Intent). `test:all` reste à lancer par le coordinateur. Rien n'est commité.

Clôture (orchestrateur, 2026-10-30) : revue quick faite (1 low, corrigé) ; approbation de la revue indépendante rapportée par l'orchestrateur, sans trace dans ce plan ; commité (c8ef8c1) et fusionné sur `feature/next` (697c363), malgré « Rien n'est commité » du Result ; `test:all` : 18840 ok, 0 FAIL, sur l'arbre de `697c363` (`/private/tmp/kr-testall-104.log`, SHA déduit de l'heure ; la fusion ne diffère de c8ef8c1 que par le bundle et `version.json`).

- Revue indépendante (orchestrateur, 2026-10-30) : APPROUVÉ, lecture seule ; portée et spécificité vérifiées pour les 5 points (garde réécrite équivalente car html est racine, bloc 3840 vrai doublon, chevron sans inversion de cascade, retrait de order: 3 neutre) ; 2 low : hypothèse col-sm- prouvée sur fixture seule, commentaire du chevron corrigé avant commit (c8ef8c1).
