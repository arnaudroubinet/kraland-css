---
title: 'La carte de Cybermonde est centrée sur ordinateur et défile dans un cadre sur mobile'
type: 'feature'
ticket: 'story-carte-cybermonde-centree-et-defilante'
created: '2026-10-21'
status: 'built'
baseline_revision: '7a6370592da2179bc575931eb82e280f773913c3'
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

**Problem:** Dans la fenêtre Cybermonde, la carte du monde (`/map`) et la carte d'une province ou d'une ville (`/map/province/…`, `/map/ville/…`) sont collées à gauche sur ordinateur et débordent de l'écran sur mobile (document de 825 px et 1017 px pour 375 px d'écran).

**Approach:** Sur ordinateur, centrer chaque carte à sa taille réelle. Sur mobile (< 768 px), la placer à taille réelle dans un cadre pleine largeur qui défile horizontalement, ouvert au milieu de la carte. Zones cliquables, tuiles et panneaux intacts. Critères : ceux du ticket `_bmad-output/backlog/story-carte-cybermonde-centree-et-defilante.md`.

## Boundaries & Constraints

**Always:** surcharge seulement ; ne jamais modifier une image, une `<map>` ni ses `<area>` ; mobile en `@media (max-width: 767px)`, ordinateur en `@media (min-width: 768px)` ; garde de page à spécificité nulle.

**Decision (Arnaud, 2026-10-21):** entre 768 et 1016 px, la carte de région reste centrée à sa taille réelle et la page défile en largeur ; pas de cadre défilant sur ordinateur.

**Decision (Arnaud, 2026-10-21):** sur mobile, la carte du monde passe sous les sélecteurs (elle recouvrait le sélecteur Ville, à `top:120px` fixe) ; critère 4 ajouté au ticket.

**Never:** réduire la carte ; recalculer des coordonnées de zones ; ajouter bordure ou fond au cadre ; toucher aux autres pages.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Monde, ordinateur | `/map`, 768 à 1920 px | carte 625 px centrée, aucun défilement du document | No error expected |
| Région, ordinateur | `/map/province/…` ou `/map/ville/…`, 1280 à 1920 px | bloc de 1017 px (tuiles et zones) centré | No error expected |
| Région, ordinateur étroit | 768 et 769 px (< 1017) | bloc à sa taille réelle, centré s'il tient, sinon calé à gauche ; le document défile en largeur (décision d'Arnaud, 2026-10-21) | No error expected |
| Mobile | 320, 375, 767 px | cadre pleine largeur, défilement horizontal, ouvert au milieu | No error expected |
| Pas de carte | page `/map…` sans `img[usemap]` | rien ne change | aucune exception |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js` `addPageTypeClass` (~l.843) -- ajouter `page-cybermonde` pour `/map` et `/map/…` (pas `/maps`).
- `kraland-userscript-template.js` nouveau module InitQueue `Cybermonde:Carte` -- repère les deux formes natives et pose des classes ; règle la hauteur du cadre et sa position de défilement initiale (milieu).
  - Monde : `body > div[style*="position:absolute"] > img[usemap]` (625 × 530, `left:200px; top:120px` en style en ligne), suivi d'une série de `<br>` qui lui réservent la place dans le flux.
  - Région : `body > div[style*="width:678px"]` (relatif, 678 × 522 en ligne) contenant des tuiles `div#cX-Y` (54 × 54, absolues), des `div#pathN` et un `div` absolu avec `img[usemap="#map1"]` (1017 × 549, 545 zones) : le contenu déborde la boîte.
- `kraland-theme.css` -- règles sous `:where(body.page-cybermonde)` : ordinateur, centrage (monde : `left`/`transform` qui battent le style en ligne ; région : largeur de la boîte portée à celle de l'image, marges automatiques) ; mobile, cadre (`overflow-x: auto`, largeur 100 %, hauteur de l'image).
- `tests/e2e/fixtures/cybermonde-monde.html`, `cybermonde-region.html` -- nouvelles fixtures synthétiques reprenant ces deux formes (images locales générées, `<map>` réduite à quelques zones).
- `tests/e2e/jeu-identite.mjs` -- non : nouvelle suite `tests/e2e/cybermonde-carte.mjs` (même squelette), enregistrée dans `tests/e2e/lib/router.mjs`.
- Ne pas toucher : `enrichPermanentTopicsStats` (ticket 1.6), panneaux de la page.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/cybermonde-monde.html`, `cybermonde-region.html` -- fixtures des deux formes -- base des tests
- [x] `tests/e2e/cybermonde-carte.mjs` + `tests/e2e/lib/router.mjs` -- suite rouge d'abord : centrage, cadre, position initiale, zones cliquables (`elementFromPoint` sur une `<area>` après défilement), document sans défilement, panneaux inchangés -- critères 1 à 4 du ticket
- [x] `kraland-userscript-template.js` -- classe de page et module `Cybermonde:Carte`
- [x] `kraland-theme.css` -- règles ordinateur et mobile
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:** ceux du ticket (1 à 4), plus : sans `img[usemap]`, aucune exception et aucun changement.

## Implementation Notes

- Monde, mobile : le div absolu reste absolu (les `<br>` natifs gardent sa place dans le flux), porté à `left: 0; right: 0`, et devient le cadre (`overflow: auto hidden`). À 767 px la carte (625 px) tient dans le cadre : rien à faire défiler, elle y est centrée (`text-align: center` ; une carte plus large que le cadre reste calée au début, vérifié par la position initiale au milieu). Le critère 2 du ticket (« défile horizontalement » à 767 px pour le monde) est donc lu comme « centrée dans le cadre » à cette largeur.
- Région : la boîte elle-même devient le cadre (mobile) ou est élargie à l'étendue réelle de ses enfants (ordinateur), mesurée par le module (`--kr-cybermonde-largeur`, `--kr-cybermonde-hauteur`) après chargement de l'image (tâche suivie par `InitQueue.hold`). Aucun élément ajouté ni déplacé.
- Le `<body>` est en flex colonne (thème) : marges automatiques = centrage ; boîte plus large que le body = calée à gauche (décision du 2026-10-21).
- Formes natives non relues sur le DOM réel (aucun mandat d'accès) : sélecteurs repris du plan ; la validation visuelle d'Arnaud reste nécessaire.
- Suite enregistrée en zone `cybermonde` (mot-clé `cybermonde`, section `CYBERMONDE`) ; tableau du skill `tester-kraland-css` complété (deux copies).
- Panneaux comparés au bundle « avant » sans leur hauteur : les panneaux repliables du mobile la font varier d'une ouverture à l'autre avec le même bundle.

## Verification

**Commands:**
- `npm run build && node tests/e2e/cybermonde-carte.mjs` -- expected: rouge avant le code, vert après
- `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: conformes, 0 erreur
- `npm run test:all` -- expected: RÉSULTAT : VERT

**Manual checks (if no CLI):**
- Validation visuelle d'Arnaud sur le site réel (monde et une région), 375, 767, 768, 1280, 1440, 1920 px, Kraland clair et Empire Brun sombre.

## Review Triage Log

Passe quick du 2026-10-21 : 2 medium, 3 low, 1 false, 1 low rejeté.
- medium, patch — repli « monde » sur tout parent absolu de `img[usemap]` : une boîte de région non reconnue aurait vu son image décalée de ses tuiles ; le div doit être enfant direct de `<body>`, cas de contre-épreuve ajouté (2 FAIL sans la garde).
- medium, patch — `var()` sans repli avec `!important` : la boîte de région perdait ses 678 × 522 px natifs avant la mesure (saut au chargement) ; repli sur les valeurs natives.
- low, patch — cadre mobile en `overflow: auto hidden` à la hauteur exacte du contenu : bas de carte rogné sous une barre classique ; `overflow: auto`.
- low, patch — chemin `/map/province/…` non testé : cas province ajouté aux 8 largeurs.
- low, patch — aucun cas de forme non reconnue : cas « boîte à 700 px » ajouté (fragment `sans-carte`).
- false — monde à 767 px « sans défilement » : la carte (625 px) tient dans le cadre, rien ne peut défiler ; elle y est centrée et le cadre s'ouvre au milieu (position 0), ce qui remplit le critère 2.
- low, rejet — pas de recentrage après rotation sous 768 px : rare, le critère porte sur l'ouverture, la correction ajouterait un écouteur.

Vérification après correctifs : suite `cybermonde-carte` 116 ok ; `test:router` conforme ; `lint:css`, `lint:js` 0 erreur ; `test:all` 4212 ok, 0 FAIL.

Validation sur le site réel (2026-10-21) : carte du monde à 375 px en Kraland clair ouverte à 0 au lieu du milieu (centrage unique calculé avant l'application du CSS par le chargeur de développement). Correctif : recentrage par ResizeObserver tant que le joueur n'a pas fait défiler le cadre ; fragment `recentrage` (contre-épreuves : 2 FAIL sans l'observateur, 2 FAIL sans l'arrêt après action du joueur). Recontrôle réel : 8 ouvertures sur 8 au milieu (monde 125/250, province 321/642, deux variantes).

Critère 4 (2026-10-21, décision d'Arnaud) : sur mobile, la carte du monde passe dans le flux sous `div.center` et les 26 `<br>` natifs qui la suivent sont masqués. Contre-épreuves : 3 FAIL sans `position: relative`, 3 FAIL sans le masquage des `<br>` (vide de 520 px sous la carte). Recontrôle réel à 320, 375 et 767 px, deux variantes : 0 sélecteur recouvert, écart 0 px au-dessus et au-dessous, cadre ouvert au milieu ; 1280 px inchangé (la carte chevauche de 19 px le bas du bloc des sélecteurs, sans en recouvrir aucun, comme avant).
