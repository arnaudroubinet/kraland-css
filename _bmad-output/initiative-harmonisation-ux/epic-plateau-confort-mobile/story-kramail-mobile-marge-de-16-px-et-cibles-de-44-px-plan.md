---
title: 'Kramail mobile : marge de 16 px et cibles de 44 px'
type: 'feature'
ticket: '9'
created: '2026-10-29'
status: 'built'
baseline_revision: 'd8c877793a2cd10f4276a10f5e38ae545b10b62e'
route: 'full'
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

**Problem:** sur mobile, les dossiers, la lecture, la rédaction du kramail et la page Contacts n'ont pas la marge de l'entrée 1 : pied de page à 0 px, texte du message lu à 15 px du bord. Le chevron de repli des panneaux natifs fait 10 × 14 px et un destinataire court (« Al ») 11 × 44 px (relevé des fixtures, base d8c8777, 320, 375 et 767 px).

**Approach:** comme au forum (entrée 8), `--kr-marge-page` posé sous les gardes `kr-page-kramail` et `kr-page-contacts`, sans `kr-marge-mobile` (en-tête, onglets et cartes déjà à 16 et 8 px). Le pied prend la marge, le message lu devient une carte à 8 px comme au forum, le chevron et les destinataires passent à 44 px. Mesures dans `kramail-theme.mjs`, fragment `confort`, avec l'aide de l'entrée 1 (`lib/marges.mjs`).

## Boundaries & Constraints

**Always:** aucun nouvel `!important` (2946) ; gardes `:where(html.x)` ; mobile en `(max-width: 767px)` seul ; marge par `var(--kr-marge-page)` ; cibles hors bouton ≥ 44 × 44 par la boîte et elementFromPoint, ou ligne touchable ; fixtures synthétiques, réseau confiné.

**Never:** site réel, Chrome 9222/9223 ; ordinateur (768 et 1280 px égaux à la base) ; boutons `.btn` et `<button>` (épopée 4) ; liens au fil du texte (H9.1).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobile | Réception, Envoi, Corbeille, 3 lectures, Nouveau, Répondre, Répondre à tous, Transférer, Contacts ; 320, 375 × 667, 767 px ; Kraland clair et Empire Brun sombre | garde posée, mode mobile, aucun débordement ; aucun texte à moins de 16 px d'un bord ; chevron, cellules de case, nom, destinataires, cases d'option à 44 × 44 aux cinq points | No error expected |
| Ordinateur | mêmes pages, 768 et 1280 px, deux variantes | boîtes de tous les textes égales au bundle d8c8777 | No error expected |
| Bascule | Réception, lecture reçue, Nouveau ; 767 → 768 → 767 et 768 → 767 → 768 dans le même onglet | marge et cibles à 767, base à 768 | No error expected |

</frozen-after-approval>

## Code Map

- `kraland-theme.css`, bloc mobile après le FORUM (l.~7097) : `--kr-marge-page` sur `:where(html.kr-page-kramail, html.kr-page-contacts) body.mobile-mode` (remplace la règle limitée au formulaire de la rédaction). La règle du formulaire `editeur-text` (padding `calc(var(--kr-marge-page) - 12px)`) est gardée. La carte `li.media` du forum est étendue à `kr-page-kramail-lecture`. Ajouts : pied, destinataires et chevron.
- Autres emplois de `--kr-marge-page`, sans effet ici : le mini-profil (absent du kramail), le `text-indent` sous 360 px (rédaction, déjà au forum) et les règles gardées par `kr-marge-mobile`.
- `tests/e2e/lib/marges.mjs` `TEXTES_HORS_MARGE_PAGE` : avec `rogne`, un ancêtre de boîte vide (`display: contents`, ici `.media-body` de la lecture) ne coupe plus. Avant ce correctif, il renvoyait une droite égale à vw, donc un faux vert.
- `tests/e2e/kramail-theme.mjs` : fragment `confort` ; `lecture` ne neutralise plus la marge du forum de référence (D3 de l'entrée 8 levé).
- `tests/e2e/confort-mobile.mjs` `hors-perimetre` : la Réception (désormais dans le périmètre) est remplacée par l'index Staff.
- `kraland-userscript-template.js`, module des destinataires : le panneau des suggestions se referme au `click` hors du champ, et non plus au `mousedown`, si l'appui (`mousedown`) est aussi tombé hors du champ.
- `tests/e2e/lib/router.mjs`, `router.test.mjs` : ajout du fragment `confort` ; `kr-marge-page` et `kr-margin-mobile` routés vers `kramail`, `kr-page-contacts` aussi.

## Tasks & Acceptance

**Execution:**
- [x] `kraland-theme.css` : marge, pied, carte du message lu, chevron et destinataires.
- [x] `tests/e2e/kramail-theme.mjs` : fragment `confort` couvrant toute la matrice ; `lecture` réaligné.
- [x] `tests/e2e/lib/marges.mjs` : correctif `rogne` pour les boîtes vides.
- [x] `tests/e2e/confort-mobile.mjs`, `router.mjs`, `router.test.mjs` : périmètre et routage.
- [x] `kraland-userscript-template.js` : fermeture du panneau des suggestions au `click` (décision de l'orchestrateur, mandat d'Arnaud), appui et click hors du champ.
- [x] Revue indépendante (« OK avec correctifs ») : test de fermeture, glissé de sélection, A9, `kr-marge-mobile`, `SANS_MARGE_PAGE_99`, 769 px.

**Acceptance Criteria:**
- Given le bundle d8c8777 (`KR_SCRIPT`), when `KR_FRAG=confort` tourne, then marge et cibles échouent et l'ordinateur passe.
- Given une mutation qui retire la règle du pied, de la carte, du chevron ou des destinataires, when le fragment tourne, then il échoue.

## Implementation Notes

- Implémentation directe par l'agent mandaté (consigne de l'appelant), sans sous-agent ; checkpoint du plan sauté (mode autonome).
- Pas de `kr-marge-mobile`, comme au forum (9.8) : en-tête et cartes sont déjà à 16 et 8 px, et la marge de ligne les doublerait.
- Le chevron natif `span.clickable` passe à 44 × 44, glyphe calé à droite (`justify-content: flex-end`, sans marge négative) : le bord droit de la boîte reste à 16 px de l'en-tête (contrat de `cartes-pastilles`) et le glyphe reste à 21 px du bord de la carte, comme dans la base.
- Routeur : le sélecteur du chevron cite `#col-right .panel-heading span.clickable`, pas `.panel-default`. Avec `.panel-default`, une 4e suite citait la classe, ce qui en fait un repère transverse : `router.test` « nettoyage » perdait alors `sous-forum`.
- Le numéro de version horodaté du pied est retiré du relevé de l'ordinateur (il change à chaque build).
- `durations.json` non modifié : le fragment neuf est lancé en tête.
- `kramail-redaction.mjs` `regression` : `MASQUE_KRAMAIL_99` (pied, carte du message lu, chevron, destinataires) posé des deux côtés au `DOMContentLoaded`, seulement contre un bundle « avant » sans la marge du kramail. Posé après le chargement, il laissait un bruit de 32 pixels sur l'avatar.
- `typographie-formes.mjs` : `SANS_MARGE_PAGE` (marge de l'épopée 9 neutralisée sur `body`) retirait désormais la marge du formulaire de rédaction, posée avant sur le seul formulaire (épopée 7, entrée 5). Le rendu réel ne change pas (4 px de retrait). La suite la rend au formulaire des deux côtés. `MASQUE_KRAMAIL_99` neutralise le chevron de la réception dans `nettoyage`, seulement contre une base sans la règle. Les deux portent « retrait au recalage de COMMIT_* ».

## Plan Change Log

- 2026-10-29 : ajout du correctif du clic perdu sur « Envoyer » à 320 px (décision de l'orchestrateur sur mandat d'Arnaud : 9.9 rend le défaut visible, pas de régression livrée). Option b retenue, la plus simple : une ligne, fermeture au `click`.

## Review Triage Log

Lentille `quick` (sous-agent sans contexte), itération 0 :

| # | Constat | Gravité | Décision |
|---|---------|---------|----------|
| 1 | `router.test` ne couvre ni `kr-page-contacts` ni le routage des jetons de marge vers `kramail` | moyenne | corrigé : deux assertions, chacune rouge sans sa règle |
| 2 | Note du chevron fausse : la marge de -12 px déplace le glyphe de 5 px | haute | corrigé : `flex-end` sans marge ; glyphe à 21 px comme la base ; `cartes-pastilles#kramail` vert |
| 3 | `RELEVE_TEXTES` de l'ordinateur ne compare que le coin haut gauche | moyenne | corrigé : largeur et hauteur ajoutées |
| 4 | Relevé de textes dupliqué entre suites | basse | rejeté : factorisation hors périmètre |
| 5 | `kramail-redaction` `reponses-*` à 320 px : clic perdu sur « Envoyer », le panneau se ferme au `mousedown` et la page remonte sous le pointeur | haute | corrigé : fermeture au `click` hors du champ (option b) |

Revue indépendante (« OK avec correctifs ») :

| # | Constat | Gravité | Décision |
|---|---------|---------|----------|
| R1 | Fermeture au clic extérieur non testée | moyenne | corrigé : `redaction-dest`, Nouveau, Contacts ouvert, clic sur le `h1` à 1280 px et tap à 320 px ; rouge sans l'écouteur |
| R2 | Glissé de sélection du champ vers l'extérieur : le `click` sur l'ancêtre commun refermait le panneau, pas la base | moyenne | corrigé : cible du `mousedown` retenue, fermeture seulement si appui et click sont hors du champ ; cas ajouté au test, rouge sans la condition |
| R3 | A9 : chevron des panneaux autres que `.panel-default` | basse | aucun sur les fixtures kramail et Contacts (tous les `span.clickable` sont dans un `.panel-default`) ; relevé site réel à la passe finale (`deferred-work.md`) |
| R4 | `mesurerConfort` ne vérifie pas l'absence de `kr-marge-mobile` | basse | corrigé : assertion ajoutée, rouge sous mutation (`kr-marge-mobile` posée sur `/kramail`) |
| R5 | Masque local de `typographie-formes.mjs` homonyme de la constante de `lib/marges.mjs` | basse | corrigé : renommé `SANS_MARGE_PAGE_99` |
| R6 | `rogne` à largeur nulle | basse | laissé de côté (consigne de l'orchestrateur) |
| R7 | (point 7 de la revue) | basse | laissé de côté (consigne de l'orchestrateur) |
| R8 | `confort` : seuil 769 px absent de l'ordinateur | basse | corrigé : 768, 769 et 1280 px |

## Verification

**Commands:**
- `npm run build` -- VALIDATION PASSED.
- `KR_SCRIPT=/tmp/kr99/base.user.js KR_FRAG=confort node tests/e2e/kramail-theme.mjs` -- rouge ; sans KR_SCRIPT -- vert.
- `npm run test:zone -- kramail confort-mobile palette-nation typographie-formes cartes-pastilles forum-activite` -- vert.
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- code 0.

## Result

Fait : marge de page du kramail et des Contacts (pied à 16 px, message lu en carte à 8 px), chevron de repli et destinataires à 44 px. Le panneau des suggestions se referme au `click` hors du champ, si l'appui est aussi hors du champ : le clic sur « Envoyer » n'est plus perdu à 320 px, et un glissé de sélection parti du champ le laisse ouvert. Ordinateur (768, 769 et 1280 px) égal à d8c8777. `!important` : 2946 (inchangé).

| Preuve | Résultat |
|--------|----------|
| `npm run build` | VALIDATION PASSED |
| `KR_FRAG=confort` contre d8c8777 (`KR_SCRIPT=/tmp/kr99/base.user.js`) | rouge : 255 ok, 111 FAIL (pied, texte lu à 15 px, chevron 10 × 14, « Al » 11 × 44) ; ordinateur vert |
| `KR_FRAG=confort` | vert : 366 ok, 0 FAIL |
| Mutations pied, carte, destinataires, chevron | rouges toutes les quatre |
| Mutation `kr-marge-mobile` posée sur `/kramail` (`mut-marge-mobile`) | rouge : 69 FAIL « kr-marge-mobile posée » |
| `kramail-redaction` `reponses-*`, fermeture au `mousedown` (`mut-clic`, comportement d'avant le correctif JS) | rouge : 6 FAIL à 320 px |
| `redaction-dest`, fermeture : sans l'écouteur (`mut-sans-fermeture`) ; sans la condition d'appui (`mut-sans-appui`) | rouge : 2 FAIL chacune (1280 et 320 px) ; vert contre d8c8777 |
| `kramail-redaction` complet | vert : 335 ok ; `regression` vert contre d8c8777 |
| `typographie-formes` nettoyage + espacement | vert (1433 ok) ; vert contre d8c8777 ; rouge sans les masques |
| `test:zone` (kramail, confort-mobile, palette-nation, typographie-formes, cartes-pastilles, forum-activite) | vert : 12090 ok, 0 FAIL |
| `lint:css`, `lint:js` | code 0 (3 avertissements antérieurs) |
| `test:router`, `test:unit` | « Routeur conforme » ; code 0 |

A9 : aucun panneau autre que `.panel-default` à `span.clickable` sur les fixtures ; relevé site réel à la passe finale. `test:all` reste à lancer.

Clôture (orchestrateur, 2026-10-29) : revue indépendante faite (« OK avec correctifs »), correctifs appliqués, commité (`225fef2`) et fusionné sur `feature/next` (`7bec452`) ; `test:all` de la fusion : 18463 ok, 0 FAIL.
