---
title: 'Cercle et barre de PV des cartes sans couleurs en dur'
type: 'refactor'
ticket: '7'
created: '2026-10-29'
status: 'built'
baseline_revision: 'cb7353087f799160c6811a9d2f45e1c905cb8e10'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** le template peint le cercle de PV des cartes de personnage (`createHPCircle`, 5 niveaux : `#32CD32`, `#FFD700`, `#FF8C00`, `#DC143C`, `#8B0000`, piste `rgba(0,0,0,0.1)`), la barre de PV (`buildCard`, `#5cb85c`, `#f0ad4e`, `#d9534f`) et l'avatar KO (`grayscale`, opacité 0,7) en dur, en attributs ou styles en ligne. Les couleurs ignorent le mode sombre, et le vert lime et l'or tombent sous 3:1 sur la carte claire.

**Approach:** décision d'Arnaud du 2026-10-28 (Q30.5) : la couleur reste par niveau de santé, passée aux jetons. Le template ne pose plus que des classes de niveau ; la feuille porte les couleurs en jetons tirés de la palette d'états de l'épopée 3 (`--kr-success`, `--kr-warning`, `--kr-danger`), un ton par mode.

## Boundaries & Constraints

**Always:** une couleur par niveau (5 pour le cercle, 3 pour la barre, seuils de la base gardés : > 70 %, > 30 %) ; longueur d'arc, largeur de barre et géométrie inchangées ; contraste ≥ 3:1 de chaque couleur de PV sur le fond de la carte, dans les 16 variantes ; avatar KO gris à 0,7 d'opacité par classe ; aucun nouvel `!important` ; règles globales (bureau et mobile, comme aujourd'hui).

**Never:** changement du HTML natif, de l'ordre DOM ou des boîtes des cartes ; vert de la jauge (`--kr-gauge-pv`) pour le cercle ; édition du bundle à la main ; fichiers hors feuille, template, tests et fixtures.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Cercle par niveau | `pdv1` à `pdv5`, 375 et 1280 px, 16 variantes | trait = jeton du niveau ; aucun attribut `stroke` ni style en ligne de couleur ; 5 couleurs distinctes | No error expected |
| Barre par seuil | largeur 85, 71, 70, 31, 30 et 10 % | fond = jeton haut (> 70), moyen (> 30), bas ; seule la largeur reste en ligne | No error expected |
| Contraste | chaque couleur de PV | ≥ 3:1 sur le fond effectif de la carte | No error expected |
| Avatar KO | `pdv5` | gris, opacité 0,7, par classe ; aucun style en ligne | No error expected |
| Niveau hors table | `pdv6` à `pdv9` | rendu du niveau 1 (repli de la base) | No error expected |
| Boîtes | 375 et 1280 px | cercle, avatar et barre aux boîtes de la base | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` `createHPCircle` (l.~4181-4231) -- table `pvConfig` : garder les pourcentages, retirer les couleurs ; classes `dashboard-card-hp-track` / `dashboard-card-hp-progress` sur les cercles, `kr-pv-N` sur le SVG ; plus d'attribut `stroke`.
- même fichier, `buildCard` (l.~4266-4272 filtre KO, l.~4318-4335 barre) -- KO : classe `is-ko` sur l'avatar ; barre : classe `kr-pv-1|3|4`, `width` seule en ligne.
- `kraland-theme.css` palette d'états `:root` l.~170-178 -- jetons `--kr-pv-1..5`, `--kr-pv-track` dérivés ; aucun ton sombre propre (les jetons de base changent déjà au sombre, même élément `html`).
- même fichier, l.~2650-2760 (cercle, avatar, barre) -- règles `.kr-pv-N { --kr-pv }`, trait, fond, KO.
- `kraland-theme.css` l.6020-6035 mobile (`stroke-width: 2 !important`) -- non touché.
- `tests/e2e/plateau-qualite-usage.mjs` -- nouveau fragment `pv` ; fixture `plateau-cartes-noms.html` lue, barres de PV ajoutées au chargement (aucune fixture n'en a).
- `tests/e2e/lib/variantes.mjs` -- `VARIANTES`, `CONTRASTE` (sonde, composition des fonds).
- `tests/e2e/lib/router.mjs`, `router.test.mjs` -- fragment `pv` ; mot-clé `dashboard-card-hp|dashboard-card-avatar|kr-pv-` vers `plateau`.
- Suites de zone (mesurent les cartes) : plateau-qualite-usage, cartes-pastilles, palette-nation, typographie-formes, confort-mobile.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-theme.css` -- jetons et règles -- couleurs hors du template.
- [x] `kraland-userscript-template.js` -- classes à la place des couleurs et du filtre en ligne.
- [x] `tests/e2e/plateau-qualite-usage.mjs` -- fragment `pv` couvrant la matrice, 16 variantes à 375 et 1280 px, boîtes comparées à la base (`KR_SCRIPT_AVANT`, défaut `git show cb73530`).
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs` -- fragment et routage.
- [x] Suites sœurs -- masque seulement si un écart de couleur de PV y apparaît, conditionné à la base.

**Acceptance Criteria:**
- Given le bundle de cb73530, when le fragment `pv` tourne, then il échoue ; given le bundle courant, then il passe.
- Given une mutation du bundle (jeton remis en dur, classe de niveau retirée), when le fragment tourne, then il échoue.

## Design Notes

Jetons (ton de chaque mode hérité de la palette d'états) :

```css
--kr-pv-1: var(--kr-success);
--kr-pv-2: color-mix(in srgb, var(--kr-success) 50%, var(--kr-warning));
--kr-pv-3: var(--kr-warning);
--kr-pv-4: var(--kr-danger);
--kr-pv-5: color-mix(in srgb, var(--kr-danger) 60%, var(--kr-text-primary));
--kr-pv-track: var(--kr-border-default);
```

Barre : haut = `--kr-pv-1`, moyen = `--kr-pv-3`, bas = `--kr-pv-4`. Le danger sert ici un état de santé, hors de la réserve « blocages » de H5.5 : consigné en doute.

## Implementation Notes

- Assumption: implémentation directe par l'agent de build, sans sous-agent (mode autonome, précédent 9.2).
- Classes posées par le template : `kr-pv-N` sur le SVG (N = niveau, repli 1 hors table), `dashboard-card-hp-track` et `dashboard-card-hp-progress` sur les cercles, `kr-pv-1|3|4` sur la barre, `is-ko` sur l'avatar. La feuille relie `.kr-pv-N` à `--kr-pv`, puis trait et fond à `--kr-pv`.
- Aucune fixture n'a de barre de PV : le fragment `pv` en injecte une par carte (largeurs 85, 71, 70, 31, 30, 10 %) et passe un `pdv1` en `pdv6`.
- Suites sœurs : masques conditionnés à la base (`AVANT_TICKET97`, `lib/variantes.mjs`). cartes-pastilles#groupes retire les classes de l'entrée des relevés (`sansClassesPv97`) ; typographie-formes#nettoyage exclut `stroke` des cercles (`MASQUE_PV_97`, le paramètre `masque` d'`EMPREINTES` accepte une liste). Retrait au recalage de COMMIT_AVANT_53 et COMMIT_NETTOYAGE.
- Piste : `rgba(0,0,0,0.1)` devient `--kr-border-default` (0,08 en clair) ; consigné en doute.

## Plan Change Log

## Review Triage Log

| # | Finding | Verdict | Route | Evidence |
|---|---------|---------|-------|----------|
| 1 | `tests/e2e/lib/router.mjs` : la règle `dashboard-card-hp|dashboard-card-avatar|kr-pv-` route vers `plateau` seul ; avant, ces classes élargissaient à tout le jeu | medium | patch | Vérifié : sans mot-clé, un hunk sur l'avatar tombait sur `widen` ; les suites de zone du Code Map (cartes-pastilles, typographie-formes, palette-nation, confort-mobile) mesurent cercle et avatar. Corrigé : règle vers ces cinq zones, `router.test.mjs` exige les cinq. |
| 2 | `tests/e2e/plateau-qualite-usage.mjs` `avecBarres` : seul `pdv6` exercé, la matrice demande `pdv6` à `pdv9` | low | patch | Vérifié : un seul `replace`. Corrigé : quatre cartes passent en `pdv6` à `pdv9` (fixture à 10 `pdv1`). |
| 3 | `kraland-theme.css` `--kr-pv-5` : en sombre, le mélange avec `--kr-text-primary` (clair) donne un rose plus pâle que le niveau 4 ; la gradation s'inverse | medium | patch (revue indépendante) | Vérifié par calcul, puis tranché par la revue indépendante : `--kr-pv-5: color-mix(in srgb, var(--kr-danger) 75%, var(--kr-bg-surface))` dans le bloc sombre `html[class*="-dark"]`. Contraste minimal du cercle en sombre : 4,10:1 (empire-brun-dark, 375 px). |

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/kr97/base.user.js KR_FRAG=pv node tests/e2e/plateau-qualite-usage.mjs` -- FAIL ; sans `KR_SCRIPT` -- 0 FAIL ; mutants dans /tmp/kr97/mut -- FAIL.
- `npm run test:zone -- plateau cartes-pastilles palette-nation typographie-formes confort-mobile forum-activite` -- FAIL attribués.
- `npm run build`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:router`, `diff -r .hermes/skills .claude/skills` -- verts.

### Revue indépendante (coordinateur)

| # | Finding | Décision | Evidence |
|---|---------|----------|----------|
| R1 | Niveau 5 plus pâle que le 4 en sombre | patch | Voir ligne 3 ; règle des deux modes : niveau 5 plus sombre que le 4. |
| R2 | Ordre de gravité non vérifié | patch | Check « niveau 5 plus sombre que le 4 » (luminance WCAG) par variante. Mutant sans le jeton sombre : 16 FAIL (8 variantes sombres x 2 largeurs) ; corrigé : 0 FAIL. |
| R3 | Niveau absent (sans image pdv) non couvert | patch | `avecBarres` retire l'image pdv d'une carte (barre gardée) ; check : aucun cercle, avatar sans `is-ko` ni filtre, barre présente ; boîtes égales à la base. Mutant « niveau absent en KO » : 32 FAIL. |
| R4 | Barre injectée présentée comme native | patch | Commentaire : balisage supposé, non relevé sur le site. |
| R5 | `sansClassesPv97` retire le point de tout élément sans classe | patch | Second replace borné à `circle.`. |
| R6 | forum-activite#fil au Code Map sans lien démontré | patch | Retiré du Code Map. |
| R7 | Piste de la barre en clair en dur (`rgb(0,0,0,0.08)`) | patch | `background: var(--kr-pv-track)`, même valeur en clair ; règle sombre `--kr-bg-elevated` gardée. |
| R8 | `AVANT_TICKET97` sur le jeton, `MASQUE_PV_97`, piste du cercle à `--kr-border-default` | accepté sans changement | Doute de la piste déjà consigné. |

## Result

- Feuille : jetons `--kr-pv-1..5` et `--kr-pv-track` tirés de la palette d'états ; trait du cercle, piste, fond de la barre et avatar KO par classe. Aucun `!important` ajouté.
- Template : classes `kr-pv-N`, `dashboard-card-hp-track`, `dashboard-card-hp-progress`, `kr-pv-1|3|4` sur la barre, `is-ko` ; plus aucune couleur ni filtre en ligne (largeur de barre seule).
- Preuves (worktree, bundle régénéré) :
  - `KR_FRAG=pv node tests/e2e/plateau-qualite-usage.mjs` : 390 ok, 0 FAIL ; base cb73530 (`KR_SCRIPT=/tmp/kr97/base.user.js`) : 304 FAIL ; mutants jeton-en-dur 16, sans-classe 64, ko-en-ligne 64, seuil 32 FAIL.
  - Contraste minimal : clair, cercle 4,70:1 et barre 4,10:1 (375 px), 4,91 et 4,29 (1280 px) ; sombre ≥ 6,45:1.
  - `npm run test:zone -- plateau cartes-pastilles palette-nation typographie-formes confort-mobile forum-activite` : 11819 ok, 34 FAIL, attribués : cartes-pastilles#groupes (22) et typographie-formes#nettoyage (10), écarts de classes et de trait de l'entrée, masqués (`AVANT_TICKET97`) puis rejoués seuls à 125 ok et 417 ok, 0 FAIL ; breakpoint-switch#nav-origine (2), faux FAIL de charge, rejoué seul à 33 ok, 0 FAIL.
  - `npm run build`, `npm run lint:css` (0), `npm run lint:js` (0, 1 avertissement préexistant dans report-non-lu.mjs), `npm run test:unit` (57 pass), `npm run test:router` (conforme), `diff -r .hermes/skills .claude/skills` (vide).
- Revue quick : 3 constats ; 2 corrigés (routage, pdv6 à pdv9), 1 consigné pour arbitrage (gradation du niveau 5 en sombre).
- Après la revue indépendante : `npm run build` (0) ; `KR_FRAG=pv` 454 ok, 0 FAIL ; base cb73530 336 FAIL ; mutants sombre-pale 16 FAIL et absent-ko 32 FAIL ; cartes-pastilles#groupes 125 ok, typographie-formes#nettoyage 417 ok, typographie-formes#jetons 19 ok, palette-nation (complète) 1372 ok, 0 FAIL ; `test:router` conforme ; `test:unit` 57 pass ; `lint:css` 0 ; `lint:js` 0 (1 avertissement préexistant).

Clôture (orchestrateur, 2026-10-29) : revue indépendante (coordinateur) faite, commité (`9408411`) et fusionné sur `feature/next` (`693f307`) ; `test:all` avant fusion : 17436 ok, 4 FAIL `demarrage-mobile`, attribués à la charge, journal `/private/tmp/kr-testall-97.log` (04:40, arbre déduit de l'heure). Gradation du niveau 5 en sombre : en attente d'Arnaud.
