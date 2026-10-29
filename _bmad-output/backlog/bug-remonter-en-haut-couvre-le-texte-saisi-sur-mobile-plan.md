---
title: 'Sur mobile, « Remonter en haut » couvre la fin du texte saisi'
type: 'bugfix'
ticket: '16'
created: '2026-10-29'
status: 'built'
baseline_revision: '6788cbfd0b7217a23b58859173b04465ccdc8199'
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

**Problem:** Sur mobile, le bouton fixe « Remonter en haut » (36 px, `right: 8px`, `bottom: 20px` en rédaction) apparaît après 400 px de défilement et passe sur le bord droit de la zone de texte du formulaire `post_msg` (kramail Nouveau, Répondre… et réponse du forum) : environ 15 px de la fin de deux lignes, là où est le curseur, sont cachés.

**Approach:** Sur mobile seulement, masquer le bouton tant que la zone de texte du formulaire de rédaction a le focus (même masquage que le `:not(.kr-btt-visible)` existant : invisible et non touchable), en CSS pur. Hors focus et sur ordinateur, rien ne change. Test e2e rouge sur la base, vert après, avec contre-épreuve.

</frozen-after-approval>

## Implementation Notes

Oneshot : une règle CSS mobile dans `kraland-theme.css` et un fragment e2e dans `kramail-theme.mjs`.

- `kraland-theme.css`, bloc mobile PLT-09 (`@media (max-width: 767px)`, vers l.11967) : `body.mobile-mode:has(form[name="post_msg"] textarea[name="message"]:focus) .container.white .kraland-back-to-top { visibility: hidden; opacity: 0; }`. Pas de JS, pas de `!important`, pas de garde de page (le formulaire suffit).
- `tests/e2e/kramail-theme.mjs` : fragment `remonter`, inscrit dans `tests/e2e/lib/router.mjs`. Pages Nouveau, Répondre et `forum-remonter`. Cette dernière est construite dans le test à partir de `typographie-forum-redaction.html`, qui n'a pas le lien : lien natif `#top` du kramail, 400 px de contenu au-dessus du formulaire et 900 px au-dessous ; la fixture n'est pas modifiée.
- Le lien est sélectionné par `footer a[href="#top"]` et non par sa classe : la classe est déjà citée par 3 suites, une 4e la rendrait transverse (`MAX_CITING`).
- Surprise : la barre de navigation fixe recouvre le haut du champ défilé. Le test ne compte donc que les points du champ touchés sur le lien.
- Script `/Users/arnaud/kraland-css-captures/7.9/travail/de.mjs`, copié dans `/tmp/kr16/mesure/de.mjs` avec REPO pointé sur ce worktree, mode `de` : 32 ok / 4 FAIL sur la base (Répondre, clavier réduit, 5 points couverts), 36 ok / 0 FAIL après. Son champ `chevauchement` est géométrique et reste à 15 même quand le lien est masqué.

## Verification

**Commands:**
- `npm run build && KR_FRAG=remonter node tests/e2e/kramail-theme.mjs` -- expected: vert ; rouge avec `KR_SCRIPT=/tmp/kr16/base.user.js`
- `npm run test:zone -- <zones touchées>`, `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: verts

## Review Triage Log

Passe quick du 2026-10-29 : 4 constats, tous réels et de faible gravité, tous corrigés.
- low, patch : le critère 2 (≥ 44 px) n'était pas vérifié. La taille du lien hors saisie est maintenant contrôlée : 36 px de large, ≥ 44 px de haut, comme à la base. Le bouton n'est pas élargi ; doute consigné dans `revue-manuelle.md`.
- low, patch : le critère 3 n'était vérifié que sur la réponse du forum. Les 3 pages sont maintenant mesurées à 1280 × 400 px (hauteur choisie pour défiler de plus de 400 px). Une comparaison au bundle de base a été écartée : la règle est confinée à `max-width: 767px` et `body.mobile-mode`, et la base figée de la suite (d64c578) n'est pas 6788cbf.
- low, patch : `sansFuite` manquait sur les mesures pendant la saisie et à 1280 px. Il est ajouté.
- low, patch : `textarea:focus` visait aussi `textarea#dest`. La règle est restreinte à `textarea[name="message"]`.

## Result

Sur mobile, « Remonter en haut » est masqué tant que la zone de texte du message de rédaction (kramail, forum) a le focus. Hors saisie et sur ordinateur, rien ne change.

Preuves (worktree wt/b16, base 6788cbfd0b7217a23b58859173b04465ccdc8199, non commité) :
- `KR_FRAG=remonter node tests/e2e/kramail-theme.mjs` :
  - bundle construit : 21 ok, 0 échec ;
  - `KR_SCRIPT=/tmp/kr16/base.user.js` (bundle de 6788cbf) : 13 ok, 8 échecs (Nouveau et Répondre à 350 px, forum à 667 et 350 px ; 3 points sous le lien [331,271,36,44]) ;
  - contre-épreuve (sélecteur de la règle muté dans le bundle, `/tmp/kr16/mut.user.js`) : 13 ok, 8 échecs.
- `npm run test:zone --` :
  - verts : forum 639/0, typographie-formes 4510/0, palette-nation 1372/0, forum-activite 1393/0, messages 235/0, parler 86/0, modale-ordre 371/0 ;
  - kramail : 1253 ok, 1 FAIL à chacun des 2 passages, sur un fragment différent chaque fois. Ces fragments rejoués seuls passent 3 fois sur 3 : `kramail-redaction` `clavier,reseau` (17 ok) et `regression` (12 ok). Le second échec portait sur la lecture, une page sans formulaire `post_msg` : 32 pixels d'écart, canal ≤ 2.
- `npm run test:router` conforme ; `lint:css` sortie 0 ; `lint:js` sortie 0 (3 avertissements, aucun dans le fragment ajouté) ; `test:unit` 58/58.
- Aucun nouvel `!important`, aucun masque.
