---
title: 'Une fenêtre étroite au chargement peut arrêter toute l''initialisation du thème'
type: 'bugfix'
ticket: 7
created: '2026-10-28'
status: 'built'
baseline_revision: '882f62a8947635485340955855c45e9f92a07de4'
route: 'full'
route_source: 'auto'
risk: high
review: ''
review_source: ''
lenses_ran: ['quick']
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** bundle exécuté avant `<body>` dans une fenêtre de moins de 768 px sans émulation mobile : `initMobileFeatures` appelle `createMobileOverlay`, qui fait `document.body.appendChild` sur `null`. L'exception remonte au `try` de `init()` (catch silencieux dans le bundle minifié, `console.error` retiré), la suite de `init()` est sautée : `runInitQueue` jamais branché, `data-kr-ready` jamais posé, pas de superposition.

**Approach:** à l'origine, `createMobileOverlay` reporte sa propre création au `DOMContentLoaded` quand `<body>` n'existe pas encore, sans try/catch.

## Boundaries & Constraints

**Always:** comportement inchangé à 768 px et plus, et sur téléphone (980 px au démarrage : `initMobileFeatures` sort avant). Une seule superposition.

**Never:** masquer l'exception par un try/catch ; toucher aux modules de modale (`trackOrderModalViewport`, `enhanceCharacterModal`, `enableModalBackdropClick`, `initCharacterModalMobile` : bug 6) ; modifier `tests/e2e/fin-initialisation.mjs` (backlog 8) ; nouvel `!important`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fenêtre étroite avant body | début de document, 375 / 767 px, sans émulation | `data-kr-ready`, `body.mobile-mode`, une `.kr-mobile-overlay` | aucune exception |
| Seuil | début de document, 768 px, sans émulation | `data-kr-ready`, ni mode mobile ni superposition | aucune exception |
| Téléphone | début de document, 375 px émulé (980 au démarrage) | inchangé (suites `moment-start`) | aucune exception |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` -- `createMobileOverlay` (section MOBILE FEATURES) : `document.body.appendChild` sans garde ; appelée par `initMobileFeatures` (seul appelant), elle-même appelée de façon synchrone dans `init()` après `await ensureTheme()`, avant le branchement de `runInitQueue`.
- `kraland-userscript-template.js` -- `initMobileMode` / `settleLoadedState` (TASK-1.1) : déjà reportés au `DOMContentLoaded`, non concernés.
- `tests/e2e/demarrage-mobile.mjs` -- suite du démarrage (moment `start` = bundle évalué avant `<body>`) ; reçoit le fragment `fenetre-etroite`.
- `tests/e2e/lib/router.mjs` -- registre `SUITES` : fragment ajouté à `demarrage-mobile`.
- `tests/e2e/modale-ordre.mjs` -- option `debut` (référence de la reproduction) ; non modifié (bug 6 la touche en parallèle).

## Tasks & Acceptance

**Execution:**
- [x] `kraland-userscript-template.js` -- `createMobileOverlay` : si `document.body` absent, se réinscrire au `DOMContentLoaded` (`{ once: true }`) et sortir -- correction à l'origine, l'écouteur passe avant celui de `runInitQueue`.
- [x] `tests/e2e/demarrage-mobile.mjs` -- option `emulate = false` de `scenario` (contexte sans `isMobile`), relevés `bodyAtStart`, `ready`, `overlay`, `errors` (pageerror + console.error) ; fragment `fenetre-etroite` : 375, 767 px (AC 1) et 768 px (frontière inchangée).
- [x] `tests/e2e/lib/router.mjs` -- fragment `['fenetre-etroite']` dans `demarrage-mobile`.

**Acceptance Criteria:**
- Given le bundle injecté avant `<body>` à 375 et 767 px sans émulation mobile, when la page se charge, then aucune exception, `data-kr-ready` posé, superposition mobile présente.
- Given le fragment `fenetre-etroite`, when il tourne sur le bundle de la base, then il échoue ; sur le bundle corrigé, il passe.

## Implementation Notes

- Reproduction rejouée sur la base (AC 3 non applicable) : `TypeError: Cannot read properties of null (reading 'appendChild')` dans `initMobileFeatures` (sonde temporaire dans une copie du bundle sous /tmp), `data-kr-ready` absent, aucune superposition, `body.mobile-mode` posé (par `initMobileMode` au DCL).
- Assumption: le bundle minifié retire `console.error` et le catch de `init()` est donc muet ; l'exception n'est pas observable de l'extérieur. Le contrôle « aucune exception » (pageerror + console.error) ne la voit pas : la preuve rouge porte sur ses symptômes (`data-kr-ready`, superposition).
- Assumption: report limité à `createMobileOverlay` plutôt que de reporter tout `initMobileFeatures` : reporter le tout réactiverait `initCharacterModalMobile` avant `<body>`, domaine du bug 6 (et repli de l'avertissement de Dormir signalé par ce ticket).
- Assumption: suite `demarrage-mobile` choisie (démarrage, moment `start`) plutôt que `modale-ordre` (modifiée par le bug 6 en parallèle).
- Non traité (hors ticket) : avant `<body>`, `initMobileSkillsPanel` et `initMobileMiniChat` ne trouvent pas leurs éléments et ne font rien, comme sur la base.

## Plan Change Log

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-userscript-template.js `createMobileOverlay` | Report au DOMContentLoaded sans try/catch ; les usages de `.kr-mobile-overlay` le cherchent au clic, donc aucun ne le lit avant sa création | sans défaut | none | grep des 4 `querySelector('.kr-mobile-overlay')` |
| 2 | quick | tests/e2e/demarrage-mobile.mjs `fenetre-etroite` | Le contrôle « aucune exception » passe aussi sur la base (exception avalée par le catch muet de `init()`) | réel, accepté | defer | le rouge est porté par `data-kr-ready` et la superposition (4 FAIL sur la base) |

## Verification

**Commands:**
- `npm run build` -- expected: VALIDATION PASSED
- `KR_FRAG=fenetre-etroite node tests/e2e/demarrage-mobile.mjs` -- expected: exit 0 ; avec `KR_SCRIPT=<bundle de la base>` : exit 1
- `npm run test:zone -- demarrage transitions` et `npm run test:zone -- plateau` -- expected: VERT
- `npm run test:router`, `npm run lint:css`, `npm run lint:js`, `npm run test:unit` -- expected: exit 0

## Result

Provisoire (implémenteur, base 882f62a, non commité) :

- Rouge avant : bundle de la base construit sous `/tmp/kr7/base` (`git archive` + `node build.js`), `KR_SCRIPT=/tmp/kr7/base/kraland-userscript-main.user.js KR_FRAG=fenetre-etroite node tests/e2e/demarrage-mobile.mjs` : exit 1, 7 ok / 4 FAIL (`data-kr-ready` et superposition, à 375 et 767 px ; 768 px ok).
- Vert après : `npm run build` VALIDATION PASSED ; même fragment sur le bundle corrigé : exit 0, 11 ok / 0 FAIL.
- `npm run test:zone -- demarrage transitions` : exit 0, 214 ok / 0 FAIL (demarrage-mobile 102, breakpoint-switch 112).
- `npm run test:zone -- plateau` : exit 0, 1027 ok / 0 FAIL.
- `npm run test:router` : exit 0 (« Routeur conforme » ; `demarrage-mobile#fenetre-etroite` sans durée mesurée, info).
- `npm run lint:css` : exit 0 ; `npm run lint:js` : exit 0 (1 avertissement préexistant dans `tests/e2e/report-non-lu.mjs`).
- `npm run test:unit` : exit 0, 56/56.
- `test:all` non lancé (réservé à la fin, hors mandat).
