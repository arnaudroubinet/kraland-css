---
title: 'Notifications : le sélecteur de personnage commence à 16 px du haut'
type: 'feature'
ticket: 3
created: '2026-10-29'
status: 'built'
baseline_revision: '5f5d29917cf40521824c2db44f152317f823821c'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur `/report` (onglet ou popup, les deux supports), le bandeau `.bg-primary` du sélecteur de personnage commence à 70 px du haut : le `padding-top: 60px` du `body` (~l.481 de la feuille, prévu pour la barre de navigation fixe que `/report` n'a pas) s'ajoute à la marge en ligne de 10 px du bandeau (H14.3).

**Approach:** CSS seul, sous `:where(html.kr-page-report)`, en liste combinée `@media (max-width: 767px), (min-width: 768px)` : le `padding-top` du `body` passe à `calc(var(--kr-space-4) - 10px)`, de sorte que padding et marge en ligne (non battue) placent le bandeau à 16 px du haut. Aucun `!important` (décision d'Arnaud du 2026-10-28) ; si un écart reste, il est consigné. Nouveau fragment `haut` dans `report-non-lu.mjs`, frags mis à jour dans `router.mjs` et `router.test.mjs`. Les autres fenêtres sans barre (aperçu `help.php?p=prev`) sont notées, pas traitées.

</frozen-after-approval>

## Implementation Notes

Route oneshot : une règle CSS de quelques lignes, un fragment de test et la liste des frags du routeur (≈ 60 lignes).

- Assumption: approbation du plan par le constructeur lui-même (mandat autonome, aucun checkpoint humain) ; ni revue ni commit dans ce mandat (relecteur indépendant), le statut s'arrête à `in-review`.
- Assumption: compensation par `calc(var(--kr-space-4) - 10px)` (6 px) : la valeur 10 px est la marge en ligne relevée (`style="margin:10px;"`, fixture tirée du relevé t_f45d2cfb). Si le site change cette marge, le haut du bandeau bouge d'autant ; le test le détecterait sur une fixture mise à jour.
- Assumption: le `body` est en `display: flex` (l.475-482) : la marge haute du bandeau ne fusionne pas avec le `body` ; haut du bandeau = padding du body + 10 px. Mesuré sur la base : 70 px à 375, 767, 768, 900 et 1280 px, `body.style.paddingTop` vide (le module `fixNavbarPadding` sort sans barre).
- Assumption: la règle se pose dans la section `/report` existante (après l.475) ; `:where(html.kr-page-report) body` a la spécificité (0,0,1) de `body` et gagne par l'ordre. Aucune règle `body.mobile-mode` ne pose de `padding-top` (mesuré : 60 px en mobile sur la base).
- Assumption: chevauchement avec le 7.3 (sélecteur de l'en-tête du kramail) : aucune règle ni code partagés ; le bandeau de `/report` n'est stylé que par la règle générique `.bg-primary`, inchangée. La garde `kr-page-report` exclut le kramail.
- Fichiers touchés : `kraland-theme.css` (règle `:where(html.kr-page-report) body` dans le bloc combiné de la section `/report`), bundle et `version.json` régénérés par `npm run build`, `tests/e2e/report-non-lu.mjs` (fragment `haut`, en-tête), `tests/e2e/confort-mobile.mjs` (recalage vertical sur `/report`), `tests/e2e/lib/router.mjs` et `router.test.mjs` (frag `haut`), `revue-manuelle.md`.
- Surprise : `confort-mobile#hors-perimetre` compare `/report` au bundle figé 9b6851a ; le contenu remonte de 54 px (« Rapport @ 17,87 » au lieu de « 17,141 »), 4 FAIL. Correctif : sur `/report` seulement, ordonnées recalées de l'écart des `padding-top` du body, borné à 60 → 6 px (revue 1) ; la base est figée, le recalage est à supprimer au relèvement de `COMMIT_AVANT` (tâche ajoutée à l'entrée 8.4). Contre-épreuves : base = bundle courant → vert ; onglets décalés de 5 px → rouge (« 17,146 » au lieu de « 17,141 »).
- Assumption: `tests/e2e/durations.json` non modifié (durée de `report-non-lu#haut` manquante, fragment lancé en tête, comme en 8.2).
- Revue 1 : fragment `haut` ajouté aux deux copies du skill `tester-kraland-css`.
- Doute: la marge en ligne de 10 px du vrai `/report` n'est vérifiée que par la fixture (relevé t_f45d2cfb) ; passe finale d'Arnaud.
- Constat : aperçu `help.php?p=prev` et fenêtre `/help` non traités (intent) ; bande vide possible, non vérifiée.
- Ni revue ni commit : mandat de l'orchestrateur (relecteur indépendant) ; le workflow s'arrête à `in-review`.

## Review Triage Log

Passe 1 (revue indépendante, 2026-10-29) : approuvable sous réserve ; 7 constats retenus par l'orchestrateur, 1 écarté.

| # | Constat | Décision | Suite |
|---|---------|----------|-------|
| 1 | `confort-mobile.mjs` : le recalage ne se retire pas seul (`COMMIT_AVANT` figé à 9b6851a) | patch | commentaire « à supprimer au relèvement de COMMIT_AVANT (entrée 8.4) » ; tâche ajoutée à la description de l'entrée 4 de `tickets.toml` |
| 2 | Recalage non borné | patch | sur `/report`, `b.haut === 60`, `t.haut === 6`, `dy === 54` exigés, sinon échec explicite ; contre-épreuves : padding 60 px restauré → 4 FAIL, padding 0 → 4 FAIL, bundle courant vert |
| 3 | Commentaire CSS : position de la règle body et sources | patch | « règle body (~l.475) », relevé t_f45d2cfb et contrôle `report-non-lu#haut` cités |
| 4 | C4 hors `/report` : largeurs bureau manquantes, libellé « égal à la base » | patch | 768 et 1280 ajoutés ; libellé « à 60 px (valeur relevée sur la base 5f5d299) » |
| 5 | `report-non-lu#haut` n'affirme pas le mode | patch | `body.mobile-mode` présent à 375 et 767, absent dès 768 (bascules comprises) |
| 6 | `revue-manuelle.md` : « se retire seul » inexact | patch | phrase réécrite (base figée, suppression à l'entrée 8.4) |
| 7 | Skills sans le fragment `haut` | patch | deux copies de `tester-kraland-css` ; `diff -r` vide |
| 8 | Garde `:has(> nav.navbar)` | écarté (YAGNI, orchestrateur) | aucune |

## Verification

**Commands:**
- `npm run build` -- expected: build et validation verts
- `KR_SCRIPT=/tmp/kr83/base.user.js KR_FRAG=haut node tests/e2e/report-non-lu.mjs` -- expected: rouge sur la base
- `npm run test:zone -- report` et suites qui mesurent le body ou le bandeau -- expected: vert
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: code 0

## Result

Provisoire, implémenteur ; revue indépendante à faire. Base `5f5d29917cf40521824c2db44f152317f823821c`, worktree `wt/8.3`, non commité.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (9f41971) et fusionné sur `feature/next` ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777`.

- Rouge avant : `KR_SCRIPT=/tmp/kr83/base.user.js KR_FRAG=haut node tests/e2e/report-non-lu.mjs` (bundle `git show 5f5d299:kraland-userscript-main.user.js`, `kr-theme-variant-*` vérifié) : exit 1, 28 FAIL (16 largeurs + 12 étapes de bascule, « haut du bandeau 70 px (padding-top du body 60px, marge 10px) ») ; portée hors `/report` verte.
- Contre-épreuves (copies mutées du bundle dans /tmp/kr83) : règle retirée → 28 FAIL ; `- 7px` (19 px) → 28 FAIL ; garde `:where(html.kr-page-report)` retirée → 4 FAIL (hors /report, padding-top 6 px) ; règle passée en `(min-width: 768px)` seul → 10 FAIL, tous à 375 et 767 (étapes 767 des bascules comprises), 768 et 769 verts (seuils N−1, N, N+1). Une mutation de 1 px (15 px) reste dans la tolérance ± 1, comme prévu.
- Vert : `npm run build` (validation passée) ; `KR_FRAG=haut node tests/e2e/report-non-lu.mjs` 36 ok / 0 FAIL ; `npm run test:zone -- report cloche typographie-formes cartes-pastilles palette-nation confort-mobile initialisation kramail transitions confinement` 10965 ok / 4 FAIL (confort-mobile#hors-perimetre, réel, corrigé, voir notes) ; après correctif `npm run test:zone -- report confort-mobile forum sous-forum plateau modale-ordre cybermonde` (zones routées par `zonesFromDiff('5f5d299')`) 5126 ok / 2 FAIL, tous `breakpoint-switch#nav-large` (barre de 1100 px, page de jeu), vert rejoué seul trois fois et vert sur la base (`KR_SCRIPT`) : charge machine ; report-non-lu 1060 ok, confort-mobile 618 ok ; `npm run test:router` exit 0 ; `npm run test:unit` 57/57 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement `no-loop-func` déjà présent, report-non-lu.mjs l.93) ; `diff -r .hermes/skills .claude/skills` vide ; aucun `!important` ajouté (lignes ajoutées de la feuille et des tests : un seul dans un commentaire).
- Largeurs : 375×667, 767, 768, 769, 900×800, 1280, 1440, 1920 ; bascule 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet ; Kraland clair et Empire Brun sombre ; hors `/report` à 375 et 900×800.
- `npm run test:all` et `test:changed` non lancés (interdits dans ce mandat).
- Après revue 1 : `npm run test:zone -- report confort-mobile` 1682 ok / 0 FAIL (report-non-lu 1064, confort-mobile 618) ; `KR_SCRIPT=/tmp/kr83/base.user.js KR_FRAG=haut` toujours rouge (28 FAIL) ; `npm run test:router` conforme ; `lint:css` exit 0 ; `lint:js` exit 0 (même avertissement) ; `npm run build` validation passée ; `diff -r .hermes/skills .claude/skills` vide.
