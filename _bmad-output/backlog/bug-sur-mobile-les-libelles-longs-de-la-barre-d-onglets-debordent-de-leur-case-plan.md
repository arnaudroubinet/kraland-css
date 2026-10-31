---
title: "Sur mobile, les libellés longs de la barre d'onglets débordent de leur case"
type: 'bugfix'
ticket: '19'
created: '2026-10-31'
status: 'built'
baseline_revision: 'fc76fd4ec5bfc8891aa2d9535c22bf6fe980c5a8'
route: 'oneshot'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur les pages de jeu mobiles, chaque `a` de la barre d'onglets `.mobile-tab-bar` (créée par `createTabBar`) prend la largeur de son contenu et dépasse sa case : la règle tactile générique `a:not(.list-group-item)… { display: inline-flex !important }` (`kraland-theme.css`, PHASE 5) le rend `inline-flex` (largeur ajustée au contenu), et la règle mobile générique `.nav-tabs > li > a { padding: 12px 16px !important; font-size: 16px !important }` bat son `padding: 8px 4px` sans `!important`. Mesuré sur fixtures à 375 px : barre de 388 px, Personnage 87 à 91 px pour une case de 67 à 75 px.

**Approach:** Dans la règle `.mobile-tab-bar.nav-tabs > li > a` (bloc `@media (max-width: 767px)` « TASK-1.3 »), imposer `display: flex` et `padding: 8px 4px` en `!important` : le lien redevient un bloc qui remplit son `li` (`flex: 1 1 0`, `min-width: 0`), et le libellé, déjà en ellipse, se tronque s'il ne tient pas. Les autres onglets mobiles et l'ordinateur ne changent pas. Test e2e : nouveau fragment `onglets` dans `tests/e2e/jeu-identite.mjs` (critères 1 à 4 du ticket, cinq pages de jeu sur leurs fixtures `jeu-*.html`, 320, 375 et 767 px, Kraland clair et Empire Brun sombre, 768 sans barre, bascule 767 → 768 → 767).

</frozen-after-approval>

## Implementation Notes

Oneshot : 2 déclarations CSS et environ 80 lignes de test.

Écart à l'approche figée : `display: flex` + `padding: 8px 4px` en `!important` a été essayé puis abandonné. Il supprime la boîte de ligne inline du lien et fait perdre 3 px à la barre (49,39 → 46,39 px), ce qui casse les comparaisons à la base de plateau-qualite-usage, cartes-pastilles#etiquettes et typographie-formes#nettoyage. Correctif retenu : `width: 100%` (l'inline-flex tactile est conservé, hauteur inchangée) et `padding: 12px 2px !important` (2 px de côté pour que « Personnage » actif en demi-gras tienne entier à 375 px).

Fichiers : `kraland-theme.css` (règle `.mobile-tab-bar.nav-tabs > li > a`), `tests/e2e/jeu-identite.mjs` (fragment `onglets`), `tests/e2e/lib/router.mjs`, `tests/e2e/confort-mobile.mjs` (libellés d'onglets exclus de la marge de 16 px : la barre ne défile plus), `tests/e2e/typographie-formes.mjs` (`.mobile-tab-bar` écartée du nettoyage), bundle et `version.json` régénérés.

Mesures (fixtures) : à 375 px, barre 375/375 sans défilement, cases et liens de 75 px, hauteur 45,4 px (inchangée), « Personnage » actif 68,7 px, entier. À 320 px, cases de 64 px : « Personnage » est tronqué par ellipse (critère 3), les autres libellés tiennent. À 767 px, cases de 153 px.

Surprises : la fixture n'a pas Font Awesome (icône 0×0), la hauteur réelle reste celle de la base ; l'indicateur de défilement `::after` est masqué faute de débordement.

## Verification

**Commands:**
- `npm run build` puis `KR_FRAG=onglets node tests/e2e/jeu-identite.mjs` -- rouge sur le bundle de base (`KR_SCRIPT`), vert après.
- `npm run test:zone -- plateau typographie-formes transitions confort-mobile` -- vert (suites qui mesurent la barre ou ses libellés).
- `npm run lint:css`, `npm run lint:js`, `npm run test:router`, `npm run test:unit`, `diff -r .hermes/skills .claude/skills` -- verts / vide.
- `caffeinate -ims npm run test:all` -- une fois, après la dernière modification.

## Review Triage Log

Revue rapide (une passe, `quick`), six constats :

1. Écart à l'approche figée (`width: 100%`, 2 px de côté au lieu de `display: flex`, 4 px) — **reporté à Arnaud** : bloc figé non modifié, écart motivé dans Implementation Notes, consigné dans `revue-manuelle.md` (ticket backlog 19).
2. Comportement à 320 px non consigné — **corrigé** : mesures ajoutées aux Implementation Notes.
3. `typographie-formes#nettoyage` écartait tout le sous-arbre `.mobile-tab-bar` — **corrigé** : option `ignorer` d'`EMPREINTES` ; seules `width`, `inline-size`, marges intérieures latérales, `perspective-origin`, `transform-origin` et le `::after` de la barre sont écartés. Contre-épreuve : `font-weight: 900` injecté sur les liens → 14 FAIL.
4. Exception de marge de 16 px non consignée — **corrigé** pour l'en-tête de `confort-mobile.mjs` ; décision **reportée à Arnaud** (`revue-manuelle.md`).
5. Critère 1 vérifié sans la largeur de l'écran — **corrigé** : bord droit de la barre ≤ largeur de l'écran et `scrollWidth` de la page ≤ largeur de l'écran.
6. Exceptions non contrôlées pendant la bascule — **corrigé** : contrôle « aucune exception » après la bascule.

- Decision (orchestrateur, 2026-10-31) : `width: 100%` et `padding: 12px 2px` retenus contre l'intention figée (`display: flex` cassait la hauteur) ; libellés de la barre d'onglets exemptés de la marge de 16 px (barre pleine largeur, cases égales).
