# Intégration PR16 + PR17 + PR19 dans feature/next

Autorisation : Arnaud a autorisé explicitement la fusion des PR16/17/19 dans feature/next malgré les portes visuelles encore ouvertes. Ce document ne vaut pas validation visuelle : les risques visuels restent ouverts. Aucun push ni fusion avant la QA indépendante sur le SHA exact.

## Provenance

- Base : origin/feature/next = d2f1c9e5057df1c1428f3c0646f5b73db0cfb2ea (PR16 déjà squash-mergée).
- PR17 : tête 030608247ad2744058b484b217a27daddac61f2c (7 commits, aucun déjà inclus) -> merge 05b15bef88cdfd1a10cf98104e3b6203b36b2216.
- PR19 : tête 92dd4102d054a079aa9d21b9cc880b2710f431eb (12 commits, aucun déjà inclus) -> merge c1a33f73b90560de3f3dfb662a03f2fd2af84e49.
- Merge-base PR17/PR19 avec la base : 4880203 (PR18).
- Merges `--no-ff` : les commits d'origine des PR sont conservés (pas de duplication).

## Conflits réels et résolution

PR17 sur next (PR16 inclus) :
- package.json : scripts test:parler (PR16) et test:kramail (PR17) -> les deux conservés.
- version.json et kraland-userscript-main.user.js : générés -> pas de choix ours/theirs, régénérés par `npm run build` après résolution des sources.
- tests/e2e/lib/router.mjs, kraland-userscript-template.js, kraland-theme.css : fusion automatique sans conflit.

PR19 sur next + PR17 :
- package.json : test:parler, test:kramail, test:menus-forums -> les trois conservés.
- tests/e2e/lib/router.mjs : mots-clés parler (PR16) et menus-forums (PR19) -> les deux conservés.
- version.json et bundle : régénérés par build.
- kraland-userscript-template.js : fusion automatique. PR19 remplace par une implémentation unique les cinq extracteurs ForumsRP/HRP/Communaute/Debats/Staff (suppression voulue de PR19, aucune fonction perdue de PR16/PR17).

## Preuves (horodatage heure locale, 2026-10-16)

- Builds : après PR17 puis après PR19 (version finale 1.0.1792181957304), validate OK.
- Lint sur 1bdcafa (état antérieur, corrigé ci-dessous) : `npm run lint` sortait en exit 2. Stylelint : 13 erreurs dans kraland-theme.css (la chaîne s'arrêtait là, ESLint ne s'exécutait donc pas par `npm run lint`). ESLint : 25 erreurs et 8 avertissements (tests/e2e/parler-viewport.mjs de PR16, kraland-userscript-main.js, validate.js). Tout était hérité de la base d2f1c9e (aucun constat nouveau). La mention initiale « 25 erreurs/8 avertissements » omettait les 13 erreurs stylelint.
- Tests ciblés zones parler, kramail, menus-forums, forum : 22:21:22 -> 22:23:17, 1405 ok, 0 FAIL. (Un premier essai a échoué sur l'exécutable Chromium absent, sans lien avec le code ; relancé avec PLAYWRIGHT_BROWSERS_PATH vers les liens 1217 -> 1224.)
- test:all global de la session précédente sur c1a33f7 : 22:24:54 -> 22:33:46, 4029 ok, 0 FAIL, exit 0. Ce n'était PAS le seul lancement (un premier lancement à 22:23:23 avait fini en exit=1, Chromium absent) et il n'était PAS sous sandbox-exec : la coupure réseau reposait sur `ctx.route` dans les suites, sans coupure noyau de Node ni du navigateur. « Hors réseau » n'était donc pas prouvé au niveau du noyau pour ce run.

## Correction lint (commit local au-dessus de 1bdcafa)

- Reprise au texte près des seuls hunks lint de lot8 e2257c8 : kraland-userscript-main.js, validate.js, eslint.config.js (validate.js déclaré module ESM), et 3 hunks de kraland-theme.css (premier bloc `.bootbox-confirm .btn-toolbar` dupliqué, `-webkit-appearance`, règles `.mini.c1` à `.c10` sur plusieurs lignes). Rien du comportement lot8 (`:where(...kr-no-forum-tables)`, template, fixtures, tests), rien de PLT-07.
- tests/e2e/parler-viewport.mjs corrigé sans `eslint-disable` ni ignore : accolades, imports `URL` et `Buffer`, préfixe `window.`, injection par balise `<script>` à la place de l'évaluation indirecte, renommages `no-shadow`. Assertions et comportements inchangés.
- Build sur les sources existantes. `npm run lint` : exit 0, 0 erreur, 0 avertissement (stylelint puis ESLint).
- test:parler ciblé : 78 ok, 0 FAIL, sous sandbox-exec.
- test:all global sur l'état final (le fichier docs ne le modifie pas), sous sandbox-exec (IP distantes refusées, bouclage local permis ; sondes Node EPERM, Chromium et Chrome ERR_ACCESS_DENIED) : 4029 ok, 0 FAIL, exit 0, 22:57 -> 23:05. Journaux et manifeste : dev/artifacts/t_fcebc0e6.
- Réserve signalée, hors périmètre : kramail-redaction#regression et #barre prennent le bundle « avant » sur origin/feature/next ; la comparaison devient tautologique une fois next avancé.
- SHA-256 de 1bdcafa : bundle 3b906ec339a863ed6d10fc142237793c2bfe164dfb2c8d1977552aa6f1ecae29, thème 5c1b7eef1d4e71c6ff77a6989dc097e72237e7222f014447553f9a0716fd6190, template ced583e3681ab8010e0f128ca453f375f9c0b720b7b83242f41ac692eb3cec05.
- SHA-256 après correction lint : bundle 42723916ac56967f9c0c874c3018e468aae169b237ac245928ff91840bc8941d, thème 3bd8388629fdb6ed71af23e489c097a78ad4ccb58b105996afa624aa244519e4, template inchangé ced583e3681ab8010e0f128ca453f375f9c0b720b7b83242f41ac692eb3cec05.

## Contenu de next / reste local

- Dans next après intégration : PR14, PR15, PR16, PR17, PR19 (et PR18).
- Hors périmètre, non inclus : bmad/ux-lot8 (425cc6f, ticket 3 en cours), PR9/11/12 (branches plateau/forum mobile sur main ou plt-qu), non touchées.
