---
title: 'Sur ordinateur, la cloche ouvre les notifications dans un popup de 900×800'
type: 'feature'
ticket: 2
created: '2026-10-29'
status: 'built'
baseline_revision: 'c8c4082ae0c010bf946729bfe8fd050e9cf8c745'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur ordinateur, la cloche appelle la fonction native `openReport(link)` de `main.js`, qui ouvre `/report` dans un popup de 600×600 : sous 768 px, il prend le rendu mobile (H9) et le journal y est à l'étroit. EXPERIENCE (R5) veut un popup de 900×800 sur ordinateur, sans préchargement.

**Approach:** Un module InitQueue redéfinit `openReport` sur la fenêtre de la page (`(typeof unsafeWindow !== 'undefined') ? unsafeWindow : window`), après `main.js` (script synchrone en fin de body, donc défini avant DOMContentLoaded). Au clic, hors `isMobileMode()`, la redéfinition appelle `window.open` avec la même URL (`'report'` + `'/' + link`), le même nom `private_report` et les options natives, largeur et hauteur passées à 900 et 800 ; en mobile, elle délègue à la fonction native inchangée.

## Boundaries & Constraints

**Always:** aucun chargement de `/report` avant le clic ; tests sur fixture synthétique, réseau confiné (`confineNetwork`), `window.open` remplacé par une sonde ; mobile inchangé (fonction native) ; rouge sur le bundle de la base `c8c4082`, contre-épreuve par mutation ; seuils 767 et 768 dans les deux sens dans le même onglet ; le module vérifie lui-même que la peau est active (review-faisabilite M10) ; aucun CSS, aucun `!important`.

**Never:** site réel, Chrome 9222/9223, clic sur une vraie cloche ; préchargement ou `fetch` de `/report` ; changement du rendu de `/report` (entrées 1 et 3) ; cloche invisible menu fermé de 768 à 991 px (D12, décision d'Arnaud attendue) ; ouverture mobile (Q17).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Barre large | 992, 1280, 1440, 1920 px, clic sur la cloche de `.navbar-right` | un seul `window.open('report', 'private_report', …width=900,height=800…)`, autres options natives gardées | No error expected |
| Bureau compact | 768, 769, 991 px, menu replié ouvert par `.navbar-toggle`, cloche vérifiée par `elementFromPoint` | même appel unique | No error expected |
| Lien | `openReport('x')` sur ordinateur | URL `report/x` | No error expected |
| Mobile | 375×667 et 767 px, `body.mobile-mode`, clic sur le clone de `.navbar-header-buttons-left` | appel natif 600×600, chaîne d'options identique | No error expected |
| Peau coupée | 1280 px, `kr-theme-enabled` à `false` | appel natif 600×600 | No error expected |
| Bascule | 767 → 768 → 767 et 768 → 767 → 768, même onglet | chaque étape : appel de sa largeur après le rechargement de bascule | No error expected |
| Réseau | toute largeur, avant et après le clic | aucune requête vers `/report`, aucune page ouverte | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` ~l.1100-1190 -- section « TASK-2.4 - DÉPLACER BOUTONS DANS HEADER MOBILE » : `moveHeaderButtons` clone le `li` de la cloche (attribut `onclick` natif conservé) dans `.navbar-header-buttons-left` en mobile ; nouvelle section de premier niveau à placer juste après.
- `kraland-userscript-template.js` ~l.385-398 -- motif `unsafeWindow` (KralandPerf) à reprendre ; `isMobileMode()` ~l.409 ; `isThemeEnabled()` ~l.3085 ; `InitQueue.register` ~l.489.
- `kraland-userscript-template.js` ~l.10914 -- `InitQueue.run()` au DOMContentLoaded, peau active ou non : d'où la garde de peau.
- `tests/e2e/vendor/parler/main.js` l.209-212 -- `openReport` verbatim, à recopier dans la fixture.
- `tests/e2e/fixtures/kramail-reception.html` ~l.98-120 -- barre réelle (`navbar-right`, cloche `onclick="javascript:openReport();return false;"`), modèle de la fixture.
- `tests/e2e/report-non-lu.mjs` -- modèle de suite : `open()`, routes Bootstrap, injection par `addInitScript`, `krReady`, `mapLimit`, bascule avec `load` attendu.
- `tests/e2e/cartes-pastilles.mjs` ~l.1250 -- ouverture du menu compact (`nav.navbar .navbar-toggle`, attente `#navbar.in` sans `.collapsing`).
- `tests/e2e/lib/router.mjs` -- `SUITES` (nouvelle suite, zone `cloche`), `KEYWORDS` (`openReport|private_report`), `SECTIONS` (titre de la nouvelle section) ; `router.test.mjs` ; `durations.json`.
- `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` -- ligne de la zone `cloche`.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- section « CLOCHE DES NOTIFICATIONS » : module InitQueue `Notifications:Popup` qui enveloppe `openReport` de la page, une seule fois, si la peau est active et la fonction native présente -- R5
- [x] `tests/e2e/fixtures/cloche-notifications.html` -- fixture synthétique : barre de jeu (bouton de menu, cloche, enveloppe, globe, menu profil), `openReport` verbatim de `main.js` en fin de body -- verify
- [x] `tests/e2e/cloche-notifications.mjs` -- fragments `barre`, `compact`, `mobile`, `bascule`, `peau` ; sonde `window.open`, comptage des requêtes `/report`, des pages ouvertes et des erreurs -- verify
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs`, deux copies du skill (`durations.json` inchangé, voir notes) -- zone `cloche` -- routeur

**Acceptance Criteria:**
- Given le bundle de la base, when la suite tourne, then les cas ordinateur échouent (600×600) et les cas mobiles passent.
- Given le bundle construit, when `test:zone -- cloche report initialisation transitions` et `test:router` tournent, then tout est vert.
- Given une mutation (garde mobile retirée, ou taille remise à 600×600), when la suite tourne, then elle échoue.

## Implementation Notes

- Assumption: les options natives sont recopiées dans la redéfinition, seules `width` et `height` changent ; la chaîne native est relevée dans `main.js` kraland-7.0.9. Si le site change ses options, la redéfinition garde les anciennes.
- Assumption: « sur ordinateur » se lit au clic par `isMobileMode()`, comme le dit l'épopée ; le passage du seuil recharge la page.
- Assumption (revue 1, acceptée) : si la largeur franchit le seuil sans rechargement, `isMobileMode()` lu au clic suit `body.mobile-mode` posé au chargement, pas la largeur courante. Le rechargement de bascule rend ce cas transitoire ; aucun code ne change.
- Assumption: peau coupée au chargement, rien n'est redéfini (garde M10) ; peau coupée au clic sans rechargement, la redéfinition rappelle la fonction native (`isThemeEnabled()` relu au clic, revue 1).
- Assumption: zone du routeur nommée `cloche` (la zone `report` reste à la page `/report`).
- Doute: sous le bac à sable Tampermonkey, une fonction du userscript posée sur `unsafeWindow` est appelée par le `onclick` de la page. La suite simule le bac à sable (window local proxifié dont `open` lève une erreur, `unsafeWindow` = page) ; Firefox passe par `exportFunction`. Vérification après fusion par console, sans clic : l'orchestrateur dans le Chrome dédié, Arnaud sous Firefox lors de sa passe finale (procédure dans `revue-manuelle.md`).
- Assumption: l'implémentation est faite directement par le constructeur, sans sous-agent : il est lui-même un sous-agent de l'orchestrateur, et le plan tient en une section du template et une suite.
- Assumption: `tests/e2e/durations.json` n'est pas modifié ; une durée manquante n'est jamais une erreur (fragment lancé en tête), elle sera mesurée par le prochain `KR_SAVE_DURATIONS=1 npm run test:all`.
- Assumption: page de la fixture servie sous `/accueil` (page relevée le 2026-10-29), contenu réduit à un paragraphe ; aucune erreur de page n'est vérifiée.
- Assumption: largeurs ajoutées au verify : 769 et 992 (seuils N+1 du mobile et du menu compact) ; deux variantes (Kraland clair, Empire Brun sombre), le comportement ne dépend pas de la couleur.
- Fichiers touchés : `kraland-userscript-template.js` (section « CLOCHE DES NOTIFICATIONS », module `Notifications:Popup`, priorité 100), bundle et `version.json` régénérés par `npm run build`, `tests/e2e/fixtures/cloche-notifications.html`, `tests/e2e/cloche-notifications.mjs`, `tests/e2e/lib/router.mjs` (suite, mot-clé `openReport|private_report`, section), `tests/e2e/lib/router.test.mjs`, les deux copies du skill `tester-kraland-css`.
- Surprise : le bundle est minifié ; les contre-épreuves mutent le motif minifié (`h()?e.apply(this,arguments):t.open(…)`).
- Routage réel du diff (`zonesFromDiff('c8c4082')`) : zones cloche, demarrage, transitions, plateau ; le commentaire « body.mobile-mode » de la section vise les zones de bascule (conservateur, sans élargissement au total).

## Review Triage Log

| # | Constat | Décision | Suite |
|---|---|---|---|
| 1 | Sous Firefox, la fonction posée sur `unsafeWindow` n'est pas appelable par la page sans `exportFunction` ; le marqueur était posé sur l'expando de la fonction locale. | Corrigé | `w.openReport = (typeof exportFunction === 'function') ? exportFunction(openReport, w) : openReport;`, puis marqueur posé sur `w.openReport` relu. Firefox vérifié par Arnaud (console). |
| 2 | La vérification hitl demandait un clic sur la cloche, qui marque les notifications lues. | Corrigé | `revue-manuelle.md` : procédure console sans clic (marqueur, `window.open` remplacé le temps d'un appel), par l'orchestrateur dans le Chrome dédié ; Firefox par Arnaud. |
| 3 | `resolved` de l'entrée 2 de `tickets.toml` affirmait sans nuance. | Corrigé | Nuance ajoutée : Chrome/Tampermonkey vérifié en contexte de page ; bac à sable et Firefox vérifiés après fusion par console. |
| 4 | Aucun test ne prouvait que le popup passe par la fenêtre de la page (`w.open`). | Corrigé | Cas « bac à sable » (fragment barre) ; rouge par mutation `window.open` à la place de `w.open`. |
| 5 | Bascule sans rechargement : `isMobileMode()` lu au clic suit `body.mobile-mode` posé au chargement. | Accepté | Documenté (Implementation Notes) ; aucun code. |
| 6 | Peau coupée sans rechargement : la redéfinition restait en 900×800. | Corrigé | `\|\| !isThemeEnabled()` ajouté à la condition lue au clic ; cas « peau coupée au clic » (rechargement retenu par beforeunload) ; rouge par mutation. |
| 7 | Dérive possible des options recopiées de main.js. | Corrigé | Test comparant les options du popup, de la fixture et du test à `tests/e2e/vendor/parler/main.js`, hors largeur et hauteur ; rouge par mutation. |
| 8 | Lien symbolique `node_modules` dans le worktree. | Hors périmètre | L'orchestrateur commite en l'excluant. |

## Verification

**Commands:**
- `npm run build` -- expected: build et validation verts
- `KR_SCRIPT=/tmp/kr82/base.user.js node tests/e2e/cloche-notifications.mjs` -- expected: rouge sur les cas ordinateur
- `npm run test:zone -- cloche report initialisation transitions demarrage confinement` -- expected: vert
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: code 0
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide

## Result

Provisoire, implémenteur, après la boucle de revue 1 ; revue indépendante à refaire. Base `c8c4082ae0c010bf946729bfe8fd050e9cf8c745`, worktree `wt/8.2`, non commité.

- Rouge avant : `KR_SCRIPT=/tmp/kr82/base.user.js node tests/e2e/cloche-notifications.mjs` (bundle de `git show c8c4082:kraland-userscript-main.user.js`) : exit 1, 146 ok / 33 FAIL ; tous sur ordinateur (768 à 1920, étapes 768 de la bascule, bac à sable, options du popup, popup avant la coupure de peau) ; mobile, peau coupée et réseau verts.
- Contre-épreuves (copies mutées du bundle construit, dans /tmp/kr82) :
  - boucle initiale : garde mobile retirée → 10 FAIL ; options en 600×600 → 28 FAIL ; garde de peau du chargement retirée → 1 FAIL ; `fetch("report")` ajouté → 24 FAIL ;
  - revue 1 : `window.open` à la place de `w.open` → exit 1, 6 FAIL (bac à sable, deux variantes) ; `|| !isThemeEnabled()` retiré → exit 1, 2 FAIL (peau coupée au clic) ; `copyhistory=no` dans les options → exit 1, 33 FAIL dont la comparaison à main.js.
- Vert : `npm run build` (validation passée) ; `node tests/e2e/cloche-notifications.mjs` 179 ok / 0 FAIL ; `npm run test:zone -- cloche report initialisation transitions demarrage confinement` 1680 ok / 0 FAIL (cloche-notifications 179, report-non-lu 1024, fin-initialisation 205, breakpoint-switch 112, demarrage-mobile 127, confinement-reseau 33) ; `npm run test:router` exit 0 ; `npm run test:unit` 56/56 ; `npm run lint:css` exit 0 ; `npm run lint:js` exit 0 (1 avertissement `no-loop-func` déjà présent, report-non-lu.mjs) ; `diff -r .hermes/skills .claude/skills` vide.
- Largeurs couvertes : 375×667, 767, 768, 769, 991, 992, 1280, 1440, 1920 ; bascule 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet ; Kraland clair et Empire Brun sombre ; peau coupée au chargement et au clic à 1280 ; bac à sable simulé à 1280.
- Doutes (aussi dans `revue-manuelle.md`, ticket 8.2) : appel depuis le `onclick` sous bac à sable réel et Firefox vérifiés après fusion par console, sans clic ; options natives recopiées (dérive détectée contre la copie de main.js) ; peau coupée native ; cloche invisible menu fermé de 768 à 991 (D12).
- `npm run test:all` et `test:changed` non lancés (interdits dans ce mandat).
