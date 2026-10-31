---
title: "Contrôle absolu de taille : titres de modale et d'accordéon, .xmini, liens du pied"
type: 'chore'
ticket: '24'
created: '2026-10-31'
status: 'built'
baseline_revision: '77f0aba3245a6638dfc36d01be40840444a16f89'
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

**Problem:** Le sweep 9.12 (6fbdba0) a retiré le miroir `ECHELLE_TICKET45` de `tests/e2e/typographie-formes.mjs` ; plus aucun contrôle ne vise `.modal-title`, `.panel-group .panel-title`, `.xmini` ni `footer a`, dont une régression de taille passerait inaperçue.

**Approach:** Ajouter au fragment `echelle` un contrôle absolu sur les pages du miroir retiré (Matériel, sous-forum, kramail), Kraland clair et Empire Brun sombre, à 375, 767, 768 et 1280 px : `.modal-title` et `.panel-group .panel-title` à leurs taille/graisse relevées sur HEAD (écrites en dur), `.xmini` et `footer a` en 12 px. Contre-épreuve par bundle muté. Aucune modification de `kraland-theme.css` ni du template.

</frozen-after-approval>

## Verification

- `KR_FRAG=echelle node tests/e2e/typographie-formes.mjs` -- vert sur le bundle de HEAD
- même commande avec `KR_SCRIPT=<bundle muté>` (taille d'un des quatre éléments changée) -- rouge sur le nouveau contrôle
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `caffeinate -ims npm run test:all`

## Implementation Notes

Route oneshot : un seul bloc de test (~30 lignes) dans `tests/e2e/typographie-formes.mjs`, aucune modification produit.

- Valeurs relevées sur HEAD (77f0aba), identiques sur Kraland clair et Empire Brun sombre : mobile (375, 767 px) `.modal-title` 15px/500, `.panel-group .panel-title` 14px/500 ; ordinateur (768, 1280 px) `.modal-title` 18px/500, `.panel-group .panel-title` 16px/500 (Bootstrap). `.xmini` et `footer a` en 12 px partout. Premier essai à valeur unique : 8 FAIL, d'où deux tables (`ABSOLU`, `ABSOLU_MOBILE`).
- Aucune fixture du miroir ne porte de `.xmini` (le miroir retiré n'en mesurait donc aucun) : sonde `span.xmini` ajoutée au corps de page. `footer a` présent sur Matériel (1) et kramail (2), absent du sous-forum.
- Contre-épreuve (`KR_SCRIPT=/tmp/b24/mN.user.js KR_FRAG=echelle node tests/e2e/typographie-formes.mjs`, bundles mutés depuis le bundle de travail) : m1 `.xmini,footer a` ordinateur 11px : 12 FAIL ; m2 `footer a,.xmini` mobile 13px : 12 FAIL ; m3 accordéon mobile 13px : 4 FAIL ; m4 modale mobile graisse 700 : 4 FAIL ; m5 accordéon ordinateur 15px : 4 FAIL ; m6 modale ordinateur 20px : 4 FAIL. Tous les FAIL sur le nouveau contrôle seulement. Bundle de base 77f0aba (`KR_SCRIPT`) : 512 ok, 0 FAIL.
- Vérifications : `npm run build` 0 ; `KR_FRAG=echelle` 512 ok / 0 FAIL ; `npm run test:router` « Routeur conforme » ; `lint:css` 0 ; `lint:js` 0 (3 avertissements antérieurs, hors fichier touché) ; `test:unit` 62/62 ; `caffeinate -ims npm run test:all` 19402 ok, 0 FAIL, VERT.

## Plan Change Log

## Review Triage Log

Passe quick (1 relecteur) : 0 high, 0 medium, 1 low, 1 false.
- low, rejeté : `.xmini` contrôlé par une sonde synthétique seulement, une régression limitée à un contexte (`.btn.btn-danger.xmini`, `.mention .xmini`) passerait. Pas un recul (le miroir n'en mesurait aucun), limite écrite dans le commentaire du test ; doute porté dans revue-manuelle.md.
- false : « contre-épreuve sans trace » ; elle a été exécutée (m1 à m6, ci-dessus), la trace manquait seulement dans le plan au moment de la revue.
