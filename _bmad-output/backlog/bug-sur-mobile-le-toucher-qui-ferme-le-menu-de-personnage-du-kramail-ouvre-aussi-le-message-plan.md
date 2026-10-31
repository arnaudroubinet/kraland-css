---
title: 'Sur mobile, le toucher qui ferme le menu de personnage du kramail ouvre aussi le message dessous'
type: 'bugfix'
ticket: '18'
created: '2026-10-31'
status: 'built'
baseline_revision: '8a58d080d50e3a20557db486cf002214e11bc0fc'
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

**Problem:** Sur les listes du kramail en mobile, le menu de personnage (`.kramail-character-selector`, composant du script) se ferme sur un `click` du document sans annuler ce clic (`buildSelector`, `kraland-userscript-template.js`). Le toucher qui le ferme atteint donc le lien étiré de la ligne dessous (`span[id^="ajax-m"] > a:last-child::after`, `inset: 0`) et ouvre le message.

**Approach:** En mode mobile (`isMobileMode()` lu au moment du clic), tant que le menu est ouvert, un écouteur `click` en phase de capture sur le document ferme le menu et absorbe le clic extérieur (`preventDefault` + `stopPropagation`). Les clics dans le sélecteur (dont les options) et tout clic au bureau (≥ 768 px) gardent le comportement de base. Tests e2e dans `kramail-theme.mjs` : nouveau fragment `entete-toucher` (critères 1 à 4 du ticket, tap tactile 375×667, Kraland clair et Empire Brun sombre, 767, 768 et 1280 px) et `entete-menu` dont le clic extérieur mobile passe sur une ligne.

</frozen-after-approval>

## Implementation Notes

Oneshot : une dizaine de lignes dans `buildSelector` et environ 120 lignes de test. Mécanisme retenu par le plan (le ticket le lui laisse) : capture au niveau du document, active seulement si le menu est ouvert et le mode mobile actif au moment du clic. Un franchissement du seuil recharge la page : la lecture du mode au clic n'est donc pas exercée sans rechargement.

- `kraland-userscript-template.js` (`buildSelector`, écouteur en capture après l'écouteur de fermeture existant, laissé tel quel) : `preventDefault` + `stopPropagation` + fermeture, si mobile, menu ouvert et affiché, clic non issu du clavier (`detail` non nul), cible hors du sélecteur.
- `tests/e2e/kramail-theme.mjs` : fragment `entete-toucher`, sur la Réception dérivée en liste (`liste-reception`). Sur la fixture brute `kramail-reception`, les lignes commencent à y = 438 et vont de x = 8 à 367 : le point (5, 400) du relevé 7.4 tombe sur le formulaire. Le point retenu est le centre du titre du dernier message, hors du menu ouvert au bureau. `MENU_PERSONNAGE` (entete-menu, bascule) : sur mobile, clic extérieur au centre du titre du dernier message, sans navigation attendue. Au bureau, il reste en (5, 400).
- `tests/e2e/lib/router.mjs` : fragment `entete-toucher` enregistré.
- Surprise : la navigation interrompue du site fictif charge une page d'erreur, qui lève `localStorage ... Access is denied`. Les erreurs de page sont donc relevées avant que la page soit quittée.

## Review Triage Log

Passe 1 (quick) : 4 constats, tous réels et corrigés (patch) ; 0 rejeté, 0 différé.

- medium, patch : rédaction mobile. Le sélecteur sans menu affiché peut passer à `aria-expanded="true"` au clavier. Le toucher suivant (« Envoyer » compris) aurait été avalé. Garde ajoutée (`dropdown.getClientRects().length === 0`). Contrôle `nouveau 375 px` ajouté : rouge sur un bundle sans la garde, vert après.
- low, patch : les clics issus du clavier (Entrée sur un lien de ligne, menu ouvert) étaient absorbés. La correction est simple (`e.detail === 0` exclu). Contrôle « Entrée sur le lien d'une ligne » ajouté : rouge sans la garde, vert après.
- medium, patch : `entete-clavier` et `entete-couleurs` avaient été déplacés par erreur avec le nouveau fragment, et `entete-clavier` était passé sur `liste-reception`. Les deux sont rétablis à l'identique de la base.
- low, patch : la bascule ne prouve pas la lecture du mode au clic, car chaque franchissement recharge la page. Le commentaire du test et ces notes sont corrigés. Le commentaire dit aussi qu'il n'y a qu'un écouteur de retenue par document, grâce au rechargement.

- Decision (orchestrateur, 2026-10-31) : tout toucher extérieur est absorbé, comme le `.dropdown-backdrop` de Bootstrap sur tactile ; pas de limitation aux lignes.
