---
title: 'Refactor sweep de l''épopée Notifications'
type: 'refactor'
ticket: 4
created: '2026-10-29'
status: 'built'
baseline_revision: 'abbe7be3fb7d0a32d0f15917b7a353c8cface6ef'
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

**Problem:** Après 8.1 à 8.3, la section `/report` de la feuille contient des règles qui en battent d'autres de la peau (la règle générique `.bg-info` battue sur la ligne non lue ; la taille du texte commune battue par la règle mobile), des commentaires périmés, et `confort-mobile.mjs` compare `/report` à un bundle figé (9b6851a) au prix d'un recalage vertical provisoire (ticket 8.3).

**Approach:** Périmètre fixé au démarrage (liste ci-dessous), sans scope nouveau : relever `COMMIT_AVANT` de `confort-mobile.mjs` sur abbe7be (8.3 compris) et retirer le recalage ; réécrire les règles battues en gardes (P1 option 4) ; mettre à jour les commentaires périmés. Chaque retrait a son rouge (mutation) ou sa preuve d'inertie (grep vide).

Périmètre (rétro 2, A2 : reports qui visent ce sweep) :
- S1 `confort-mobile.mjs` : `COMMIT_AVANT` → abbe7be ; retrait de `recaler`, du contrôle borné à 54 px et des champs `report`/`haut` du relevé ; en-tête.
- S2 doublon `.bg-info` : la règle générique exclut la ligne du journal de `/report` par `:not(:where(…))` ; `color: inherit` de la section `/report` retiré (devenu inerte).
- S3 taille du texte : `font-size: var(--kr-font-body)` du bloc commun, battu sur mobile, passe dans le bloc ordinateur.
- S4 commentaires : en-tête CSS de la section `/report` (« cellule de la date seule », « autres .bg-info ») et commentaire de `kr-page-report` dans le template.
- S5 mentions 600×600 : relevé ; celles qui restent décrivent la fonction native (vraies), aucune à changer.
- Reports examinés : D8.1 (corrigé en 8.1, rien à reprendre) ; deferred-work 4.9 `padding-left: 10px` (traité par 8.1, à prouver par grep) ; D12 / 5.4 cloche menu fermé (rejeté : décision d'Arnaud attendue, épopée) ; aucun autre report D8.n.

**Never:** règle `body` globale (`padding-top: 60px`, compensée par 8.3 par décision d'intent) ; masques d'autres épopées dans `confort-mobile.mjs` ; `durations.json` ; site réel.

</frozen-after-approval>

## Implementation Notes

Route oneshot : environ 40 lignes dans la feuille, une suite et le template. Approbation du plan par le constructeur (mandat autonome) ; ni revue ni commit dans ce mandat (relecteur indépendant), le statut s'arrête à `in-review`.

- Fichiers touchés : `kraland-theme.css` (règle générique `.bg-info`, section `/report`), `kraland-userscript-template.js` (commentaire de `kr-page-report`, ~l.3721), `tests/e2e/confort-mobile.mjs` (`COMMIT_AVANT`, relevé, en-tête), bundle et `version.json` régénérés, `deferred-work.md`, `revue-manuelle.md`.
- S1 : `COMMIT_AVANT = 'abbe7be'` (merge 8.3, `abbe7be3fb7d0a32d0f15917b7a353c8cface6ef`). Tickets fusionnés entre 9b6851a et abbe7be : 7.2, 9.4, 8.2, 8.3. `recaler`, son assertion bornée à 54 px et les champs `report`/`haut` du relevé sont retirés ; l'en-tête ne cite plus de SHA en dur.
- S2 : `.bg-info:not(:where(html.kr-page-report table > tbody > tr))`, spécificité inchangée (0,1,0) ; sur `/report`, la ligne du journal ne garde que `background-color: transparent` (fond natif `#d9edf7` de Bootstrap) ; `color: inherit` retiré, inerte une fois la règle générique écartée.
- S3 : `font-size: var(--kr-font-body)` des cellules passe du bloc commun au bloc `(min-width: 768px)`. La date reste en 13 px (bloc commun, (0,2,4)).
- Écart (revue, constat 1) : le déplacement n'est pas sans effet sur mobile. Une table imbriquée dans une cellule du journal passe de 14 à 15 px sur mobile, car elle hérite de la règle mobile. Mesuré : 54 écarts à 375 px, 0 à 1280 px. Cas absent de la fixture, hypothétique sur le site ; la règle n'est pas restaurée.
- S4 : en-tête CSS (« sur ordinateur, … cellule de la date seule » ; garde de la règle générique) et commentaire du template. Le commentaire du template est retiré du bundle minifié (grep vide) : seules les règles CSS changent dans le bundle (diff des deux bundles, version masquée).
- S5 : les mentions « 600×600 » restantes (template ~l.1197, `cloche-notifications.mjs`, deux copies du skill) décrivent la fonction native, toujours vraie ; aucune ne vise `/report` (8.1 a réécrit `report-non-lu.mjs`). Rien à changer.
- Reports : 4.9 `padding-left: 10px` de `/report` absent de la feuille et du bundle (grep) ; D8.1 corrigé en 8.1 ; D12 non repris (décision d'Arnaud). Aucun autre report ne vise 8.4.
- Surprise : le masque `sansTitre` de `confort-mobile#secondaires` devient inerte avec la nouvelle base (copie sans masque verte) ; hors notifications, consigné dans `deferred-work.md` pour 9.12, non fait.
- Surprise : la règle de taille 14 px sur ordinateur n'a pas de rouge (le `body` natif de Bootstrap fait déjà 14 px) ; gardée (jeton de DESIGN), report consigné.
- Doute : le routeur élargit le diff au total (hunks de commentaires sans zone, module transverse « GESTION DU THÈME ») ; la couverture ciblée se justifie par le diff du bundle, limité aux règles `.bg-info` et `/report`. `test:all` reste dû (verify de l'entrée), interdit dans ce mandat.

## Review Triage Log

Passe 1 (revue indépendante, 2026-10-29), décisions de l'orchestrateur :

| # | Décision | Suite |
|---|----------|-------|
| 1 | Corrigé | affirmation « sans effet sur mobile » retirée ; écart de la table imbriquée (14 → 15 px sur mobile, 54 écarts à 375 px, 0 à 1280 px) consigné ici et dans `revue-manuelle.md` ; règle non restaurée |
| 2 | Traité à la fusion par l'orchestrateur | aucune |
| 3 | Traité à la fusion par l'orchestrateur | aucune |
| 4 | Reporté au sweep 7.10 | aucune |
| 5 | Accepté, sans action | aucune |
| 6 | Accepté, sans action | aucune |
| 7 | Accepté, sans action | aucune |
| 8 | Corrigé | commentaire de la règle générique : « Hors lignes de tableau de /report (le journal) » |
| 9 | Accepté, sans action | aucune |
| 10 | Corrigé | `revue-manuelle.md`, section 8.3 : « (fait en 8.4) » |
| 11 | Traité à la fusion par l'orchestrateur | aucune |
| 12 | Accepté, sans action | aucune |

## Verification

**Commands:**
- `npm run build` -- expected: validation passée
- mutations sur copie du bundle dans /tmp (`KR_SCRIPT`) -- expected: rouge par retrait
- `npm run test:zone -- report cloche confort-mobile` et suites qui mesurent `/report` ou `.bg-info` (`palette-nation`) -- expected: vert
- `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: code 0

## Result

Provisoire, implémenteur ; revue indépendante à faire. Base `abbe7be3fb7d0a32d0f15917b7a353c8cface6ef`, worktree `wt/8.4`, non commité.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite, correctifs appliqués, commité (936c3af) et fusionné sur `feature/next` ; `test:all` vert contenant l'épopée : 18074 ok, 0 FAIL, sur `d8c8777`.

- Rouges (copies du bundle dans /tmp/kr84) : S1, nouvelle suite contre l'ancienne base (`KR_SCRIPT_AVANT` = bundle de 9b6851a) : exit 1, 4 FAIL, `hors-perimetre report kraland 375 px`, `… kraland 767 px`, `… empire-brun-dark 375 px`, `… empire-brun-dark 767 px`, libellé « sans classe de marge, textes égaux au bundle de base ». Ils viennent du seul décalage de 54 px sur /report (8.3) ; aucun autre contrôle ne diffère. S2, garde `:not(:where(…))` retirée : `report-non-lu` exit 1, 168 FAIL (C2, N) ; fond transparent retiré : exit 1, 252 FAIL. S3, règle 14 px retirée : exit 0 (pas de rouge, voir notes).
- Inertie (grep, template, feuille, bundle, `tests/` hors vendor) : `recaler`, `recalage`, `9b6851a` : 0 ; `padding-left: 10px` sur `/report` : 0.
- Vert : `npm run build` (validation passée) ; `npm run test:zone -- report cloche confort-mobile` 1861 ok / 0 FAIL (report-non-lu 1064, cloche-notifications 179, confort-mobile 618 : mêmes nombres qu'en 8.3) ; `npm run test:zone -- palette-nation` 1372 ok / 0 FAIL ; `npm run test:router` exit 0 (« Routeur conforme ») ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement `no-loop-func` déjà présent, report-non-lu.mjs l.93) ; `diff -r .hermes/skills .claude/skills` vide (skills non modifiés) ; aucun `!important` ajouté.
- `npm run test:all` et `test:changed` non lancés (interdits dans ce mandat).
- Après les correctifs de revue : `npm run build` validation passée ; `KR_FRAG=hors-perimetre node tests/e2e/confort-mobile.mjs` exit 0, 32 ok / 0 FAIL ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (même avertissement `no-loop-func`).
