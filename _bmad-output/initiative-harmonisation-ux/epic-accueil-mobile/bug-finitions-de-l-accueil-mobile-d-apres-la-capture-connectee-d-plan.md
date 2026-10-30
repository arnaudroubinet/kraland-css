---
title: "Finitions de l'accueil mobile d'après la capture connectée d'Arnaud"
type: 'bugfix'
ticket: '6'
created: '2026-10-30'
status: 'built'
baseline_revision: '2736d5e48efd070969deb2e9c916a832110f33dc'
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

**Problem:** Sur le vrai /accueil connecté (capture d'Arnaud du 2026-10-30, hors dépôt : `kraland-css-captures/10.3-arnaud/accueil-connecte-mobile.jpg`), « Les drapeaux sont tronqués et l'image illisible » : les 6 drapeaux (50×35) des onglets du message du ministre sont rognés en carrés et l'image du message (500×333, dans un lien) est réduite à une vignette ; s'y ajoutent l'icône du `.genmsg` rognée par ses filets, un vide sous la dernière nouvelle, l'avatar de Bienvenue collé au haut de la carte et un vide d'environ 70 px sous la barre. La fixture servait des GIF 1×1 : aucun contrôle ne voyait le rognage.

**Approach:** Fixture servie avec des images de taille réelle (drapeaux 50×35, images du message 500×333) ; règles mobiles génériques qui rognent ou rapetissent gardées par `:where(html.kr-page-accueil)` (retrait, pas de surenchère) ; nouveau fragment `finitions` d'`accueil-mobile.mjs`, rouge sur la base puis vert. Points 3 à 6 reproduits si la cause est identifiable, sinon documentés dans `revue-manuelle.md` (section 10.6).

## Boundaries & Constraints

**Always:** mobile seul, `@media (max-width: 767px)` ; gardes `:where(...)` de spécificité nulle ; cibles ≥ 44 px ; bureau égal à la base (768 à 1920) ; `!important` ≤ 2898 ; bundle par `npm run build`.

**Never:** nouvel `!important` ; structure native inventée sans indice ; écriture git ; site réel ; Chrome 9222/9223 ; `test:all`, `test:changed`, `npm install`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| drapeaux | images 50×35, 320, 375, 767 ; Kraland clair, Empire Brun sombre | chaque drapeau rendu à 50×35, boîte contenue dans son onglet, onglet ≥ 44 px | FAIL nommé |
| image du message | 500×333 dans un lien | largeur ≥ 90 % du contenu de la carte, ratio conservé | FAIL nommé |
| .genmsg | icône de fond plus haute que la ligne (règle native imitée) | icône entière dans la boîte, texte à ≥ 16 px du bord de la carte | FAIL nommé |
| défileur | `ul.demo` à hauteur en ligne (81 px) | aucun vide sous la nouvelle visible (≤ 1 px) | FAIL nommé |
| avatar | Bienvenue | avatar à ≥ 8 px du haut et du bas de la carte, même avec une marge basse native sur l'image | FAIL nommé |
| bureau | 768 à 1920 | égal à la base | premier écart |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.4723-4727 -- `[id^="c"] img` (images de la carte, mobile, `max-width: none; height: auto` en `!important`) : `#col-right` y correspond, l'image du message déborde à 500 px quand la vignette disparaît ; garde du panneau de l'accueil.
- `kraland-theme.css` l.4777-4799 -- `.panel-body a` (flex, padding 8) et `.panel-body a img:not(.icon)` (32×32 `!important`) du « PANNEAU COMMERCE » : cause des drapeaux et de l'image rognés en carrés de 32 px ; garde `:where(:not(:where(html.kr-page-accueil) #col-right *))`.
- `kraland-theme.css` l.4911 -- `.nav-tabs > li > a` (12/16 `!important`) : laissé, onglets de 84×61 (cibles ≥ 44).
- `kraland-theme.css` l.1177-1182 -- `.ds_user .pull-right` absolu, centré par `top: 50%` + `translateY(-50%)` (`!important`) : centre la boîte, pas l'image.
- `kraland-theme.css` section « PAGE ACCUEIL - MOBILE » (l.11496+) -- `.genmsg`, Bienvenue (`.pull-right`), `ul.demo` du défileur : correctifs ici.
- `tests/e2e/fixtures/accueil.html` -- règle native `.genmsg` imitée (déduite de la capture), icône servie.
- `tests/e2e/accueil-mobile.mjs` l.115-120 -- route des images : PNG de taille réelle ; nouveau fragment `finitions`.
- `tests/e2e/lib/router.mjs` l.125, `router.test.mjs` l.603 -- frag `finitions`. Skill `tester-kraland-css` (deux copies) -- ligne Accueil.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/accueil-mobile.mjs`, `tests/e2e/fixtures/accueil.html` -- images réelles, fragment `finitions` -- rouge sur le bundle de 2736d5e.
- [x] `kraland-theme.css` -- gardes et correctifs mobiles -- vert, contre-épreuve par mutation.
- [x] `tests/e2e/lib/router.mjs`, `router.test.mjs`, skill (2 copies) -- enregistrement du fragment.
- [x] `revue-manuelle.md` section 10.6 -- points non reproduits.

**Acceptance Criteria:**
- Given la fixture à 320, 375 et 767 px, when le fragment `finitions` tourne, then il est rouge sur la base et vert après, et une mutation de chaque correctif le rend rouge.
- Given les suites accueil-mobile, palette-nation, typographie-formes, confort-mobile, cloche, test:router, test:unit, lint:css, lint:js, when elles tournent, then elles passent.

## Implementation Notes

- Causes : `.panel-body a img:not(.icon)` (32×32 `!important`, « PANNEAU COMMERCE », l.~4797) rognait drapeaux et image ; `[id^="c"] img` (l.~4724, `max-width: none`) faisait déborder l'image une fois la vignette retirée, car `#col-right` correspond à `[id^="c"]`. `.panel-body a img` porte la garde `:where(:not(:where(html.kr-page-accueil) #col-right *))`. `[id^="c"] img` est gardé sur tout l'accueil, `:where(:not(:where(html.kr-page-accueil) *))`, car `#col-t` y correspond aussi : son `height: auto` battait `.img-circle`, et un avatar non carré sortait de la boîte (correctif de la revue indépendante). Le lien `.panel-body a` lui-même reste sans garde (garde non nécessaire, et sélecteur figé par typographie-formes#espacement).
- `.genmsg` : `background-size: auto min(100%, 32px)`. Avec `contain`, l'icône montait à 45 px quand le texte passait sur deux lignes à 320 px, et chevauchait le texte.
- Défileur : `max-height: max-content` sur `ul.demo` plafonne la hauteur posée en ligne.
- Avatar : `.pull-right` à `height: var(--kr-avatar-size); padding: 0`.
- Fixture : PNG unis générés (zlib) en taille réelle. La règle `.genmsg` native est recopiée de main.css (relevé du coordinateur, 2026-10-30), avec `gen.gif` 32 × 32. Variantes `HTML_AVATAR_MARGE` et `HTML_AVATAR_PORTRAIT` (80 × 120). L'image du volet sans lien `#empire1` est mesurée. Le contrôle « texte à 16 px du bord » est retiré : il était vrai par construction.
- Rouge sur la base 2736d5e : 56 FAIL. Mutations : garde img 12 FAIL, background-size 4 (avec la règle native exacte), max-height 6, height/padding de l'avatar 6. Garde `[id^="c"]` : 12 FAIL si elle est ramenée à `#col-right` seul, 34 si elle est retirée.

## Plan Change Log

## Review Triage Log

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Avatar : cause inventée ; `[id^="c"] img { height: auto }` laisserait un avatar haut dépasser | maybe-false | defer (doute) | Dans la capture, l'avatar n'est rogné qu'en haut et reste à environ 18 px CSS du bas de la carte : ce n'est pas un débordement symétrique d'une boîte centrée. Ça colle à un espace sous l'image. Pour trancher : relever le DOM réel. Noté dans revue-manuelle. |
| Image : seuil de 90 % de min(naturel, contenu) au lieu de 90 % du contenu | medium | doute pour Arnaud | La matrice dit « largeur ≥ 90 % du contenu », l'intention dit « image illisible » et la spec dit `max-width: 100 %` (pas d'agrandissement). Mode autonome : question posée dans revue-manuelle, pas de boucle. |
| Garde de `.panel-body a`, `background-position`, `padding-right` du `.genmsg` sans contre-épreuve | medium | patch | Les trois sont retirés. En plus, la garde de `.panel-body a` faisait échouer typographie-formes#espacement (sélecteur figé). |
| Drapeaux : `objectFit` collecté non vérifié, aucun ancêtre en overflow contrôlé | low | rejeté | Le rendu est égal au naturel (50×35), donc `object-fit` ne rogne rien. La boîte du drapeau est contrôlée contenue dans son onglet. |
| `max-height: max-content` mal supporté hors Chromium | false | rejeté | Supporté par Safari 11+, Firefox 66+ et Chrome 46+. |
| Fond de survol `.panel-body a:hover` encore appliqué aux onglets | low | defer | Préexistant, hors intention. |
| Règle native du `.genmsg` inventée | low | documenté | Limite consignée dans revue-manuelle, point 3. |

## Verification

**Commands:**
- `KR_SCRIPT=/tmp/kr106/base.user.js KR_FRAG=finitions node tests/e2e/accueil-mobile.mjs` -- expected: FAIL
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes confort-mobile cloche` -- expected: 0 FAIL
- `npm run test:router`, `npm run test:unit`, `npm run lint:css`, `npm run lint:js` -- expected: exit 0
- `grep -c '!important' kraland-theme.css` -- expected: ≤ 2898

## Result

- Arrêt en `in-review`, sans commit (consigne du coordinateur). Revue quick : 3 retraits non prouvés. Revue indépendante (approuvé avec correctifs) : garde `[id^="c"] img` sur tout l'accueil, avatar en portrait, règle native `.genmsg` relevée, image du volet sans lien, contrôle du bord retiré, risque du défileur décrit.
- Fragment `finitions` : 56 FAIL sur la base 2736d5e (KR_SCRIPT), vert après. Chaque correctif muté le rend rouge.
- `npm run test:zone -- accueil-mobile palette-nation typographie-formes confort-mobile cloche forum menus-forums sous-forum messages plateau profil kramail cybermonde modale-ordre cartes-pastilles forum-activite` : 17247 ok, 0 FAIL.
- `test:router` et `test:unit` passent ; `lint:css` et `lint:js` sortent à 0 (3 avertissements préexistants) ; 2898 `!important` (inchangé) ; skills identiques.
- Points 4 et 5 et l'écart du lien de l'image : voir `revue-manuelle.md`, section 10.6.
