---
title: 'Les suites e2e instables passent de façon stable dans test:all'
type: 'chore'
ticket: '22'
created: '2026-10-30'
status: 'built'
baseline_revision: '5a82b7bd7a84657c14261d85070f64355f2cabe9'
route: 'full'
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

**Problem:** Plusieurs contrôles e2e (liste du ticket 22) échouent par intermittence dans `test:all` et passent rejoués seuls ; ces faux FAIL brouillent la preuve de livraison.

**Approach:** Reproduire chaque contrôle sous charge, établir la cause avec preuve, corriger uniquement dans `tests/e2e/` en attendant un état mesurable ; un vrai défaut du produit sort en ticket séparé.

## Boundaries & Constraints

**Always:** corrections dans `tests/e2e/` seulement ; contre-épreuve par mutation du bundle (`KR_SCRIPT`) pour chaque contrôle stabilisé ; journaux et scripts jetables dans `/tmp/kr-b22/`.

**Never:** toucher `kraland-theme.css`, `kraland-userscript-template.js` ou les fixtures ; élargir une borne ou une tolérance ; retirer ou sauter un contrôle ; ajouter un « retry » ou allonger un délai fixe ; écriture git ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Suite sous charge | suite en parallèle d'autres zones, 5 tours | vert à chaque tour | cause consignée si rouge |
| Mutation du produit | `KR_SCRIPT` sur un bundle muté | rouge | aucun faux vert |
| Fragment interrompu | sortie non nulle, 0 FAIL | rapport « interrompu : sortie N » | cause visible |

</frozen-after-approval>

## Code Map

- `tests/e2e/lib/settle.mjs` -- horloge simulée (`installClock`, `runClock`) : option `paused`
- `tests/e2e/demarrage-mobile.mjs` -- fenêtre d'absence `pire-cas` : horloge en pause
- `tests/e2e/kramail-theme.mjs` -- `basculer()` des fragments `bascule` et `confort`
- `tests/e2e/croix-directionnelle.mjs` -- `load()` du fragment `transitions`
- `tests/e2e/run.mjs` -- rapport de `test:all`
- `kraland-userscript-template.js` -- lu seulement : `checkBreakpointCrossing` (l.675-813), `insertChangelogButton` (~l.10895), `insertTampermonkeyThemeUI` (~l.8806)

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/lib/settle.mjs` -- option `paused` : `pauseAt` après chaque `runFor` -- le temps simulé ne vient plus que des pas
- [x] `tests/e2e/demarrage-mobile.mjs` -- `installClock(context, { paused: true })` -- `pire-cas` ne dépend plus de la charge
- [x] `tests/e2e/kramail-theme.mjs` -- `scrollTo(0, 0)` avant le changement de largeur -- la restauration du défilement du produit ne l'annule plus
- [x] `tests/e2e/croix-directionnelle.mjs` -- `about:blank` avant le changement de largeur -- le rechargement de bascule n'annule plus le `goto`
- [x] `tests/e2e/run.mjs` -- « interrompu : sortie N » pour un fragment sorti en erreur sans FAIL -- explique le « FAIL avec 0 FAIL »

**Acceptance Criteria:**
- Given les CA 1 à 4 du ticket 22, when les preuves de la section Result sont rejouées, then chaque contrôle de la liste est vert ou sort en ticket séparé avec preuve.

## Implementation Notes

Voir `## Result`.

## Plan Change Log

## Review Triage Log

Passe 1 (lentille quick) : 0 high, 0 medium, 3 low, 4 false, 0 maybe-false. 2 corrections appliquées, rien de reporté.

| Constat | Verdict | Route | Preuve / action |
|---|---|---|---|
| `settle.mjs` : `paused` laisse fuir l'écart réel du premier pas (`ticks` non recalé) | low | patch | Le commentaire promettait trop. Il dit maintenant que Date.now ne vient que des pas, avec la limite bornée à un pas (lue dans le code, non mesurée). `pire-cas` reste vert dans 4 `test:all`. |
| `run.mjs` : `code: 'non lancé'` est compté « interrompu » | low | patch | Réel (l.215). La condition exige maintenant `typeof r.code === 'number'`. |
| T-A et T-B ne sont pas des tickets créés | false | rejet | Le mandat demande de proposer le ticket dans le plan, pas de le créer. |
| CA1 : pas de cause pour les suites vertes au lot B et F, ni pour celles non reproduites | false | rejet | Le correctif serait une modification du plan. Ces suites sont non reproduites, avec N tours consignés, ce qui est la sortie prévue par le mandat. |
| Pas de preuve en rouge pour le rapport « interrompu » | low | rejet | Le changement ne touche que l'affichage. Une preuve demanderait un fragment piégé ; peu probable de gêner. |
| Le Result se contredit sur la date des preuves | false | rejet | Le correctif serait une modification du plan. Le texte a quand même été précisé : la fenêtre 22:22-22:39 est un vrai éveil. |
| `croix` : `about:blank` dans le `load()` partagé, donc moins de couverture | false | rejet | Aucun fragment ne vérifiait le rechargement dans le même document ; l'écart est consigné. |

## Verification

**Commands:**
- `npm run build && npm run test:all` (3 fois) -- expected: RÉSULTAT : VERT
- `npm run test:router` ; `npm run test:unit` ; `npm run lint:css` ; `npm run lint:js` -- expected: exit 0, 58 pass
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide

## Result

Base `5a82b7b`, arbre de travail non commité (worktree `wt/b22`). Diff source : 5 fichiers de `tests/e2e/` (+31/−8), plus `kraland-userscript-main.user.js` et `version.json` regénérés par `npm run build`. Produit, fixtures et skills inchangés.

Piège de mesure : de 22:02 à 23:52 le 2026-10-30, le Mac était en veille capot fermé. Les processus ne tournaient que pendant des DarkWake ; preuve dans `pmset -g log` : une attente de 364 à 370 s mesurée pour environ 500 ms de `performance.now`. Les lots lancés après 22:39 ont donc été jetés. Seule exception : une vraie fenêtre d'éveil, de 22:22:02 à 22:39:15, d'où viennent les lots A et B. Les autres preuves datent de 23:54 à 00:30, sous `caffeinate -ims`, et le journal n'y montre aucune entrée Sleep ni DarkWake.

Cause et correctif par contrôle :

- `demarrage-mobile#pire-cas`. Documents observés : 5, 7, 10 et 11 ; la borne est 4.
  - Cause : Playwright 1.59 rejoue l'horloge simulée en deux lots dans le document rechargé. Le second lot y ajoute les écarts de temps réel et relance l'horloge en temps réel.
  - Preuve : sous charge, un pas de 500 ms donnait de 616 à 815 ms d'écart simulé ; après correctif, exactement 500 ms.
  - Correctif : `installClock(context, { paused: true })` et un `pauseAt` après chaque `runFor` (`lib/settle.mjs`).
- `kramail-theme#confort` (bascule 767 > 768 > 767).
  - Cause : la restauration du défilement du produit rejoue `window.scrollY` jusqu'à 1,8 s après le rechargement (`restoreScrollAfterReload`). Elle annulait le `scrollTo(0, 0)` posé par le test après le chargement.
  - Preuve : avec une réponse retardée de 2000 ms, 6 FAIL avant le correctif ; 366 ok après.
  - Correctif : `scrollTo(0, 0)` avant le changement de largeur.
- `croix-directionnelle#transitions`.
  - Cause : la largeur changeait sur l'ancien document. Le rechargement de bascule (`checkBreakpointCrossing`, 400 ms) annulait alors le `goto` suivant : `net::ERR_ABORTED`.
  - Preuve : avec une réponse retardée de 800 ms, `page.goto: net::ERR_ABORTED` avant le correctif ; tout vert après.
  - Correctif : `goto('about:blank')` avant `setViewportSize`.
- `test:all` qui affiche « FAIL avec 0 FAIL » : c'est un fragment sorti en erreur (exception, `krReady` dépassé) sans aucun contrôle en échec.
  - Correctif : `run.mjs` signale « interrompu : sortie N » pour ces fragments et en donne le compte dans `Total`.
- Non reproduits : `breakpoint-switch#nav-large` et `#nav-origine` (environ 22 tours sous charge, 64 chargements bridés, 6 suites bridées) ; `cartes-pastilles#etiquettes` (le décalage de 10 px) ; `accueil-mobile#bureau` (8 tours). Aucun correctif pour ces trois-là. Doutes dans `revue-manuelle.md`.
- Vrais défauts du produit, à traiter en tickets séparés :
  - **T-A** « Le bouton « Voir l'historique des changements » manque quand le panneau d'options est posé après DOMContentLoaded ». C'est la cause de `palette-nation#etats-mobile` et de `typographie-formes#boutons`.
    - Mécanisme : `insertChangelogButton` cherche `#kr-changelog-section` une seule fois. Or `insertTampermonkeyThemeUI` crée cette section par un essai toutes les 200 ms, parfois après DOMContentLoaded.
    - Preuve : en bridé (×20), 6 tours sur 42 sans bouton au bout de 20 s, et tous ces tours avaient la section absente au DOMContentLoaded. Lot F : 1 FAIL sur 5 (« bouton absent »).
  - **T-B** (à confirmer) : `applyNavbarPadding` ne mesure la barre qu'une fois (rAF + 200 ms) et ne remesure pas quand son contenu passe de 2 à 3 rangées. C'est la cause probable du `accueil-mobile#bureau` rouge, où la base mesurait 153 au lieu de 203.

Preuves, sur le dernier arbre :

1. `npm run build` puis `npm run test:all` 3 fois de suite : 18942 ok, 0 FAIL, RÉSULTAT : VERT à chaque tour, en 311, 485 et 477 s. Le premier tour a démarré avant la correction du rapport de `run.mjs` (le rapport seul a changé).
2. 5 tours en parallèle par lot, chaque lot avec d'autres zones :
   - lot A, verts 5 sur 5 : `pire-cas`, `confort`, `transitions`, `nav-large` et `nav-origine` ;
   - lot B, verts 5 sur 5 : `kramail-redaction#regression` et `#clavier+reseau`, `palette-nation#etats-largeurs`, `modale-ordre#largeurs` ;
   - lot F, verts 5 sur 5 : `cartes-pastilles#etiquettes` (974 ok), `plateau-qualite-usage` (775 ok), `kramail-theme#redaction-dest` ;
   - lot F, `palette-nation#etats-mobile` : 4 sur 5, l'échec est le défaut T-A.
3. Contre-épreuves `KR_SCRIPT` sur des bundles mutés (`/tmp/kr-b22/mut/`) :
   - `RELOAD_MIN_GAP_MS` à 0 rend `pire-cas` rouge : 11 documents et « la boucle s'arrête » en FAIL. Le témoin « boucle » reste vert sur le bundle normal.
   - Sans rechargement de bascule, `confort` passe rouge (11 FAIL : `body.mobile-mode` présent à 768 et absent à 767).
   - Seuil de la croix à 700 px : `transitions` passe rouge à 700 px.
Après les corrections de revue : un `test:all` de plus, 18942 ok, 0 FAIL, VERT en 431 s.
4. `test:router` : « Routeur conforme ». `test:unit` : 58 pass, 0 fail.
5. `lint:css` sort à 0. `lint:js` sort à 0, avec 3 avertissements antérieurs (`kramail-theme.mjs:2051`, `:2054`, `report-non-lu.mjs:97`).
6. `diff -r .hermes/skills .claude/skills` : sortie vide.

Écarts :

- `transitions` reste vert sans rechargement de bascule. Le test recharge chaque largeur par un `goto` neuf, déjà avant ce ticket ; il ne prouve donc pas le rechargement dans le même onglet, malgré son titre CA9.
- Les lots A et B datent de la fenêtre d'éveil valide de 22:22 à 22:39. Ils ont précédé la seule correction du rapport de `run.mjs`.
