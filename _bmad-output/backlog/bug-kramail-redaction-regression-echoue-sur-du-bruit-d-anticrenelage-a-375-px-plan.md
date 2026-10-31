---
title: '`kramail-redaction#regression` tolère le bruit d''anticrénelage à 375 px et détecte toujours une vraie régression'
type: 'bugfix'
ticket: 33
created: '2026-10-31'
status: 'built'
baseline_revision: '893894ac76a4bd056a23511f599c20d03bf52e78'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/backlog/bug-kramail-redaction-regression-echoue-sur-du-bruit-d-anticrenelage-a-375-px.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** le fragment `regression` de `tests/e2e/kramail-redaction.mjs` échoue parfois sous charge sur « lecture 375 » (`{"pixels":32,"maxCanal":2}`) : la borne `PIX_MAX_PIXELS = 20`, calibrée sur « lecture 1280 », est dépassée en nombre par du bruit d'anticrénelage d'écart 2, pas par une vraie différence.

**Approach:** mesurer le bruit en A/A sous charge (même bundle des deux côtés, `KR_SCRIPT_AVANT`, au moins 30 passes), puis ajuster la tolérance de `pixelsEquivalent` d'après cette mesure (écart faible toléré sans dépendre du nombre, ou borne de nombre relevée), en gardant rouges un écart de couleur > 4 et une hauteur +1 px (contre-épreuve sur bundle muté). Le commentaire de calibrage cite la mesure (passes, maximum de pixels et d'écart, zone). Tests seulement, produit inchangé.

**Acceptance Criteria (ticket) :**
1. Given deux captures A/A de « lecture 375 » sous charge, then le fragment est vert sur au moins 30 passes.
2. Given un bundle muté qui change une couleur (écart > 4) ou une hauteur de 1 px sur la lecture à 375 px, then le fragment est rouge.
3. Given la nouvelle borne, then le commentaire de calibrage cite la mesure A/A (nombre de passes, maximum de pixels et d'écart, zone).

</frozen-after-approval>

## Implementation Notes

Route oneshot : quelques lignes dans un seul fichier de test (`PIX_MAX_*`, `pixelsEquivalent`, commentaire de calibrage), précédées d'une mesure.

- Mesure A/A sous charge (16 exécutions parallèles du fragment `regression`, `KR_SCRIPT_AVANT` = bundle de 893894a, machine partagée avec d'autres agents) : 176 passes. Seule « lecture 375 » dépasse : cadre arrondi de l'avatar (`img.avatar.img-thumbnail` dans `li.media.well`), boîte (22-82, 291-365), au plus 32 pixels, écart au plus 3, 57 passes sur 176 non identiques octet pour octet. « lecture 1280 » : 9 pixels, écart 1. Ancienne borne (20 pixels) : 15 passes rouges sur les 112 premières (9/64, puis 6/48), le FAIL du ticket reproduit.
- Borne retenue : `PIX_MAX_PIXELS` 20 -> 80 (plus de 2 x 32), `PIX_MAX_CANAL` inchangé (4). Option « écart <= 2 sans borne de nombre » écartée : elle laisserait passer un voile d'écart 2 sur toute la page, et l'écart mesuré atteint 3.
- `comparePixels` renvoie aussi `box` (boîte englobante des pixels différents) quand il y en a : la note et le message d'échec localisent la zone, ce qui a servi à la mesure.
- Commentaires de calibrage (`PIX_MAX_*`, ~l.105-118) et rappel près de la comparaison (~l.1335) mis à jour.
- Contre-épreuve (bundle muté par une feuille `adoptedStyleSheets` en `@media (max-width: 767px)`, sans nœud DOM ajouté pour isoler le contrôle pixel ; copies dans `/tmp/b33aa/mut/`) : point 4 x 4 px à 5 % de blanc (16 pixels, écart 11, sous la borne de nombre) rouge sur les 8 combinaisons 375/320 ; couleur du nom de l'auteur décalée (786 pixels, écart 9) rouge sur « lecture 375 » et « lecture 320 » ; avatar `margin-top: 1px` (280 pixels, écart 190) rouge sur « lecture 375 » et « lecture 320 ». Bundle normal après correctif : 64 passes A/A sous charge, 64 vertes.
- Fichier source modifié : `tests/e2e/kramail-redaction.mjs` seulement. Produit inchangé ; `version.json` et le bundle régénérés par `npm run build` après la revue (règle de livraison, précédent 406485c), sans édition à la main.
- Après revue : contre-épreuve de vraie hauteur +1 px (`padding-bottom: 1px` sur l'avatar, `/tmp/b33aa/mut/hauteur-vraie.user.js`) : 142 pixels, écart 190, rouge sur « lecture 375 » et « lecture 320 ». La branche `dims` n'est pas exerçable ici : la page de lecture tient dans la fenêtre de 900 px, une hauteur +1 px décale le contenu sans changer les dimensions de la capture.
- Autres comparaisons pixel du dépôt (note du ticket) : aucune. `getImageData`/`Buffer.compare` n'apparaissent que dans `kramail-redaction.mjs` (fragment `regression` seul) ; `confinement-reseau.mjs` ne cite `comparePixels` que dans sa liste blanche de contextes.

## Review Triage Log

Passe 1 (quick) : 1 medium, 1 low, 1 low ; 0 false.
- medium, patch : `version.json` et bundle absents du diff (AGENTS.md § Livraison ; 406485c, ticket de tests seuls, les embarquait). `npm run build` lancé.
- low, patch : note du ticket « relever les autres fragments de comparaison pixel » sans constat. Constat négatif ajouté aux notes (aucune autre comparaison pixel).
- low, patch : contre-épreuve « hauteur » faite par `margin-top` (décalage), pas par une vraie hauteur. Mutation `padding-bottom: 1px` ajoutée, rouge ; branche `dims` non exerçable sur cette page (notée).

## Verification

**Commands:**
- A/A sous charge : `KR_SCRIPT_AVANT=kraland-userscript-main.user.js KR_FRAG=regression node tests/e2e/kramail-redaction.mjs` en boucle, 30 passes et plus, plusieurs instances parallèles -- expected: écarts relevés, tous verts après correctif
- Contre-épreuve : bundle muté (couleur, hauteur +1 px sur la lecture à 375 px) en `KR_SCRIPT` -- expected: rouge
- `npm run test:zone -- kramail`, `npm run lint:css`, `npm run lint:js`, `npm run test:router`, `npm run test:unit`, `diff -r .hermes/skills .claude/skills`, `caffeinate -ims npm run test:all` -- expected: verts
