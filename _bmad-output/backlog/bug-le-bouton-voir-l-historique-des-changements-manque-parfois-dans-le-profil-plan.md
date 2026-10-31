---
title: "Le bouton « Voir l'historique des changements » manque parfois dans le profil"
type: 'bugfix'
ticket: '31'
created: '2026-10-31'
status: 'built'
baseline_revision: 'a9703caba50c469c9120000ce7a51649dc312768'
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

**Problem:** Sur `/profil/interface`, `ChangelogManager.addChangelogButton` cherche `#kr-changelog-section` une seule fois (au DOMContentLoaded, ou 500 ms après si le document est déjà analysé). `insertTampermonkeyThemeUI` crée cette section par un essai toutes les 200 ms (25 essais au plus), parfois après cette recherche : le bouton `#kr-changelog-btn` manque alors pour de bon (rouges instables de `palette-nation#etats-mobile` et `typographie-formes#boutons`). Le délai de 500 ms n'est pas non plus suivi par `InitQueue` : le bouton peut tomber après `html[data-kr-ready]`.

**Approach:** Sur `/profil/interface` seulement, attendre la section par essais de 200 ms, tenus par `InitQueue.hold`, jusqu'à ce qu'elle existe ou que l'interface du thème ait renoncé (`themeUiSettled`, même règle que `addResetButtonToInterfacePage`) ; puis insérer le bouton une seule fois. Hors profil : retour immédiat, ni attente ni bouton.

</frozen-after-approval>

## Acceptance

- Section posée en retard (titre « Thème de base » inséré par la page à 1500 ms) : au marqueur, un seul `#kr-changelog-btn`, dans `#kr-changelog-section`, et aucune mutation après le marqueur.
- Section présente dès le départ : un seul bouton.
- Page hors profil : aucun bouton.
- Interface du thème qui renonce (pas de titre) : marqueur posé, aucun bouton.

## Test

`tests/e2e/fin-initialisation.mjs` : le faux `GM.xmlHttpRequest` répond par une erreur (changelog chargé à vide, comme `gmErreur` de `palette-nation.mjs`) au lieu de ne jamais répondre ; nouvelle vérification au marqueur du nombre de boutons (1 dans la section sur `profil-interface` et `profil-interface-theme-tardif`, 0 ailleurs). Contre-épreuve : `KR_SCRIPT` sur le bundle de `baseline_revision` (rouge attendu sur la page à titre tardif).

## Implementation Notes

Oneshot : un seul module (`addChangelogButton`, ~15 lignes) et une vérification ajoutée à la garde de fin d'initialisation, qui possède déjà la page à section tardive.

- `kraland-userscript-template.js` `addChangelogButton` (~l.10896) : retour immédiat hors profil ; `InitQueue.hold`, essai immédiat puis toutes les 200 ms tant que la section manque, que `themeUiSettled` est faux et moins de 50 essais (10 s) ; pose synchrone du bouton puis `release()`.
- Après revue : `insertChangelogButton` (~l.10922) n'est plus async, il lance le chargement sans l'attendre ; le clic attend `loadChangelog()` puis ouvre l'historique. `loadChangelog` partage la promesse en vol (`_loading`, une seule requête) et traite `ontimeout`.
- `tests/e2e/fin-initialisation.mjs` : faux GM en erreur synchrone, sauf la nouvelle page `profil-interface-reseau-muet` (aucune réponse) ; contrôle au marqueur du nombre de boutons (1 dans la section sur les trois pages profil où l'interface s'insère, 0 ailleurs).
- `tests/e2e/confort-mobile.mjs` `RELEVE` : `#kr-changelog-section` exclue de la comparaison des textes au bundle de base 7bec452. Son faux GM ne répond jamais : la base ne posait pas le bouton, le bundle testé le pose (4 FAIL `secondaires bureau interface` au `test:all`, attendus).
- Surprise : le test a aussi montré que l'ancien délai de 500 ms n'était pas suivi par `InitQueue` (mutation après le marqueur sur `profil-interface` en DCL).

## Review Triage Log

Passe 1 (quick) : 4 medium, 1 low, 0 false, 0 maybe-false ; tout corrigé (patch).

- medium, patch : `release()` avant `insertChangelogButton()` async qui attend `loadChangelog()` ; avec un vrai réseau, bouton après le marqueur. Vérifié (bundle muté `async ... await this.loadChangelog()` : 4 FAIL sur `profil-interface-reseau-muet`). Correctif : pose synchrone, chargement au clic.
- medium, patch : `loadChangelog` sans `ontimeout` (GM `timeout: 5000`) : promesse jamais réglée, plus aucun bouton ni historique. Défaut antérieur, rendu visible par le clic qui attend le chargement. Correctif : `ontimeout` comme `onerror`.
- medium, patch : le test ne couvrait pas un réseau lent (erreur synchrone). Correctif : page `profil-interface-reseau-muet`, GM sans réponse.
- low, patch : deux requêtes quand `init()` et le bouton chargent en même temps. Correctif : promesse partagée `_loading`.
- medium, patch : si `insertTampermonkeyThemeUI` lève, `themeUiSettled` reste faux et la file est tenue pour toujours. Correctif : borne de 50 essais (10 s). `addResetButtonToInterfacePage` a la même dépendance sans borne (antérieur, consigné dans revue-manuelle.md).

## Verification

**Commands:**
- `npm run build && npm run test:zone -- initialisation palette-nation typographie-formes` -- expected: 0 FAIL
- `KR_SCRIPT=<bundle de base> node tests/e2e/fin-initialisation.mjs` -- expected: FAIL sur le bouton (page à titre tardif)
- `npm run lint:css` ; `npm run lint:js` ; `npm run test:router` ; `npm run test:unit` -- expected: exit 0
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide
- `caffeinate -ims npm run test:all` -- expected: RÉSULTAT : VERT

## Result

Preuves sur `a9703caba50c469c9120000ce7a51649dc312768` + arbre de travail (sans commit) :
- `node tests/e2e/fin-initialisation.mjs` : 269 ok, 0 FAIL. Contre-épreuves `KR_SCRIPT` : bundle de base, 14 FAIL (bouton absent au marqueur, mutation après le marqueur) ; bundle muté (`async insertChangelogButton(){await this.loadChangelog();`), 4 FAIL sur `profil-interface-reseau-muet`.
- `caffeinate -ims env KR_CONCURRENCY=6 npm run test:all` : 19002 ok, 4 FAIL, tous dans `confort-mobile#secondaires` (texte « Changements » en plus de la base) ; test corrigé, puis `npm run test:zone -- confort-mobile` : 912 ok, 0 FAIL, VERT.
- `npm run test:zone -- initialisation palette-nation typographie-formes` (avant revue) : 6105 ok, 0 FAIL. Après revue, `palette-nation typographie-formes` seul : 13 fragments interrompus par `page.goto` (30 s) sous une charge de 15, puis verts dans le `test:all`.
- `lint:css` 0 ; `lint:js` 0 (3 avertissements antérieurs) ; `test:router` « Routeur conforme » ; `test:unit` 58 pass ; `diff -r .hermes/skills .claude/skills` vide.

