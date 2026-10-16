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
- Lint : fichiers touchés (template, router, kramail-redaction, menus-forums) 0 erreur. `npm run lint` global : 25 erreurs/8 avertissements préexistants sur fichiers non modifiés (tests/e2e/parler-viewport.mjs de PR16, kraland-userscript-main.js, validate.js) ; ce n'est pas un lint vert.
- Tests ciblés zones parler, kramail, menus-forums, forum : 22:21:22 -> 22:23:17, 1405 ok, 0 FAIL. (Un premier essai a échoué sur l'exécutable Chromium absent, sans lien avec le code ; relancé avec PLAYWRIGHT_BROWSERS_PATH vers les liens 1217 -> 1224.)
- test:all global unique, hors réseau : 22:24:54 -> 22:33:46, 4029 ok, 0 FAIL, RÉSULTAT VERT.
- SHA-256 : bundle 3b906ec339a863ed6d10fc142237793c2bfe164dfb2c8d1977552aa6f1ecae29, thème 5c1b7eef1d4e71c6ff77a6989dc097e72237e7222f014447553f9a0716fd6190, template ced583e3681ab8010e0f128ca453f375f9c0b720b7b83242f41ac692eb3cec05.

## Contenu de next / reste local

- Dans next après intégration : PR14, PR15, PR16, PR17, PR19 (et PR18).
- Hors périmètre, non inclus : bmad/ux-lot8 (425cc6f, ticket 3 en cours), PR9/11/12 (branches plateau/forum mobile sur main ou plt-qu), non touchées.
