---
title: "Fixture réaliste de l'accueil et suite e2e accueil-mobile"
type: 'chore'
ticket: '2'
created: '2026-10-30'
status: 'built'
baseline_revision: 'e2bcdd146a0333fae79f968db429178cbb87d880'
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

**Problem:** L'accueil (`/accueil`) n'a ni fixture réaliste ni suite e2e. La refonte mobile de 10.3 n'aurait aucun filet pour garder ce qui existe déjà (E10.5). Aujourd'hui, un hunk `.page-accueil` sans mot-clé élargit au total.

**Approach:** Reconstruire, d'après le relevé du spike 10.1 (squelettes assainis, hors dépôt), une fixture synthétique `tests/e2e/fixtures/accueil.html` dans l'ordre DOM NATIF (avant la peau). Écrire la suite `accueil-mobile.mjs`, qui vérifie seulement l'existant à 320, 375×667 et 1280 px. Router les repères de l'accueil vers cette suite.

## Boundaries & Constraints

**Always:**
- Données de jeu réelles, non anonymisées.
- Aucun jeton, aucun identifiant de session, aucun message privé : `#reconnect` et `#exit` sont absents.
- La suite appelle `confineNetwork(context)` juste après `newContext()`.
- La suite compare le rendu ordinateur au bundle de base e2bcdd1.
- Les mutations de contre-épreuve portent sur des copies du bundle dans `/tmp` (via `KR_SCRIPT`), jamais sur la source.

**Never:**
- Modifier `kraland-theme.css` ou le template.
- Ajouter un `!important`.
- Écrire des fragments E10.1-E10.4, des listes d'écarts attendus ou des masques (c'est l'entrée 3).
- Toucher à `palette-nation-accueil.html` ou à l'accueil en ligne de typographie-formes.
- Accéder au site réel ou à Chrome 9222/9223.
- Toute écriture git.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| mobile | accueil.html à 320 et 375×667, Kraland clair et Empire Brun sombre | `mobile-mode` ; ordre visuel Jouer < Bienvenue < Forum < Compteurs < Nouvelles ; `#col-right` en display none ; aucun débordement ; « Bienvenue Thanaël » ; `a.accueil-play-btn` juste après `.ds_user` ; `.accueil-forum-section` avec h4 et 4 `.ds_forum` ; plus aucun `hr` dans `#col-t` ; compteurs déplacés dans `#col-left .kraland-metrics` | FAIL nommé par contrôle |
| bureau | 1280 px, deux variantes | 3 colonnes côte à côte ; carte ministérielle visible ; `#myCarousel` masqué par `html.kr-hide-carousel` ; boîtes des textes égales au bundle de base | FAIL avec le premier écart |
| carrousel | 1280 px et 375 px, `kr-carousel-hide`='false' | à 1280 px, carrousel affiché et sans `kr-hide-carousel` ; à 375 px, `#col-right` reste masqué | FAIL nommé |
| réseau | tous les cas | aucune requête refusée par `confineNetwork`, aucune erreur de page | FAIL qui liste les URL |

</frozen-after-approval>

## Code Map

- `tests/e2e/fixtures/accueil.html` -- nouvelle fixture native (`#col-left` avec les Nouvelles ; `#col-right` avec le panneau ministériel et `#myCarousel` ; `#col-t` avec `.ds_user`, les compteurs, des `hr` et le forum).
- `tests/e2e/accueil-mobile.mjs` -- nouvelle suite (modèle : `confort-mobile.mjs`).
- `tests/e2e/lib/router.mjs` -- entrée SUITES, mot-clé de l'accueil, deux SECTIONS.
- `tests/e2e/lib/router.test.mjs` -- checks du routage de l'accueil.
- `tests/e2e/durations.json` -- les fragments ne sont pas mesurés, donc rien à ajouter (une durée orpheline échoue, une durée manquante n'échoue pas).
- `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` -- ligne de la suite.
- `kraland-userscript-template.js` (lecture) -- `page-accueil` l.853, Bienvenue l.2120, `Homepage:RightColumn` l.2175, `relocateKramailToLeft`, `nameLeftSidebarDivs`, `applyCarouselOption`.
- `kraland-theme.css` (lecture) -- l.1087 `kr-hide-carousel`, bloc mobile `.page-accueil` à partir de l.11501.

## Tasks & Acceptance

**Execution:**
- [ ] `tests/e2e/fixtures/accueil.html` -- reconstruire la page native d'après les squelettes du spike 10.1 -- base de 10.2 et 10.3.
- [ ] `tests/e2e/accueil-mobile.mjs` -- fragments mobile, bureau, carrousel -- garde E10.5.
- [ ] `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs` -- zone accueil-mobile, mot-clé, sections -- routage ciblé.
- [ ] skill tester-kraland-css, dans les deux copies -- ligne de la suite -- choix de zone.
- [ ] `_bmad-output/initiative-harmonisation-ux/revue-manuelle.md` -- doutes de la fixture.

**Acceptance Criteria:**
- Given le bundle de la base, when `npm run test:zone -- accueil-mobile` est lancé, then tous les fragments sont verts.
- Given une mutation de `Homepage:RightColumn`, du masquage de `#col-right` ou de Bienvenue, when la suite est lancée à 375 px, then elle est rouge.
- Given une mutation de `kr-hide-carousel`, when la suite est lancée à 1280 px, then elle est rouge.
- Given un hunk `.page-accueil` ou `Homepage:RightColumn`, when le routeur le classe, then il vise accueil-mobile, palette-nation et typographie-formes, sans élargir au total.

## Implementation Notes

- Implémentation directe, sans sous-agent : le relevé du spike (squelettes hors dépôt) n'est pas recopié dans le plan.
- Fixture : ordre natif supposé de `#col-t`, avec `.ds_user`, `<hr>`, les 3 compteurs, `<hr>`, puis « Forum » et 4 `.ds_forum`. Le bloc kramail natif est omis. Doutes consignés dans `revue-manuelle.md`.
- Relevé ordinateur : le numéro de version du pied (`\d{10,}`, horodatage du build) est masqué, comme dans confort-mobile ; sans cela, la comparaison à la base échoue à chaque build.
- Routeur : une fixture `accueil.html` modifiée lance aussi palette-nation, car son nom est une sous-chaîne de `palette-nation-accueil.html`. router.test.mjs l'acte.
- durations.json : inchangé (fragments sans durée, lancés en tête).
- Template et CSS inchangés. Le bundle ne diffère de la base que par la version.
- Revue : la vérification de version du thème (`version.json`), refusée par le confinement, est exclue du contrôle réseau.

## Plan Change Log

## Review Triage Log

Passe 1 (quick) : 0 high, 2 medium, 2 low, 0 false, 0 maybe-false ; 4 patchs, aucun report.

| Constat | Verdict | Route | Preuve / action |
|---|---|---|---|
| Contrôle réseau aveugle : la route de la fixture coupe en silence, et `horsFixture` ne garde que kraland.org | medium | patch | Exact : la dernière route gagne. Les coupures de la route sont maintenant comptées, et tous les hôtes refusés aussi, sauf `version.json` (vérification de version du thème, émise sur toute page). Contre-épreuve : un `fetch('/jouer/plateau')` ajouté au bundle donne du rouge. |
| SECTIONS Bienvenue et colonne droite routées vers accueil-mobile seul | medium | patch | Exact : un hunk du corps du module ne cite pas `Homepage:RightColumn`. Les deux sections visent maintenant les trois zones ; router.test.mjs suit. |
| `kr-ministerial-card` présentée comme vérifiée par accueil-mobile | low | patch | Exact : la fixture a un `.panel`, sans `.alert`. Commentaire du routeur et ligne du skill corrigés (deux copies, diff vide). |
| Variante appliquée non vérifiée | low | patch | Exact. Contrôle `VARIANTE_POSEE` ajouté au mobile et au bureau. |

## Result

- Livré : la fixture native `tests/e2e/fixtures/accueil.html` ; la suite `tests/e2e/accueil-mobile.mjs` (fragments mobile, bureau et carrousel, 58 contrôles) ; la zone, le mot-clé et les sections du routeur, avec leur test ; la ligne du skill, dans les deux copies. Template et CSS inchangés ; aucun `!important`.
- Vert : `npm run build` ; `test:zone -- accueil-mobile` (58 ok) ; `test:zone -- palette-nation` (1372 ok) ; `test:zone -- confinement` ; `test:router` ; `lint:css` (0) et `lint:js` (0, aucun avertissement sur les fichiers touchés) ; `test:unit` (0) ; `diff -r .hermes/skills .claude/skills` vide. Le bundle de la base e2bcdd1, passé par `KR_SCRIPT`, est vert.
- Rouge par mutation de copies du bundle dans /tmp :
  - « Bienvenue » retiré : 8 FAIL ;
  - `display:none` de `#col-right` retiré : 6 FAIL à 320 et 375 ;
  - `Homepage:RightColumn` neutralisé : 20 FAIL à 320 et 375 ;
  - règle `kr-hide-carousel` neutralisée : 4 FAIL à 1280 ;
  - requête ajoutée vers `www.kraland.org` : FAIL réseau.
- Puis vert sur le bundle normal.
- Revue indépendante (« OK avec correctifs »). Sa contre-épreuve : `margin-top: 30px` sur `.accueil-play-btn` à 768 px et plus donne 2 FAIL au bureau (position des textes), et le mobile reste vert.
- Correctifs de cette revue :
  - `.mini-submenu` masqué par une règle native simulée : l'écart Compteurs-Nouvelles passe à 15 px à 375 px, comme sur le vrai site (71 px avant) ;
  - défileur natif simulé en mobile : `ul.demo` passe à 81 px, une seule nouvelle visible, pagination masquée ; 280 px au bureau, inchangé ;
  - barre complétée d'après le squelette 1280 (Forum Communauté, Forum Débats, Statistiques, sous-entrées, Notes, Reconnexion et Déconnexion sans formulaire) ; cloche en `href=""` ;
  - logos du thème `/2/world/logo*` laissés au refus du confinement ;
  - Font Awesome servi sur option `KR_FA_DIR`, comme messages-v3 ;
  - contrôle renommé « position des textes ».
- Après ces correctifs : `npm run build` vert ; `test:zone` vert pour accueil-mobile (58 ok) et palette-nation (1372 ok) ; `test:router` conforme ; `lint:js` à 0 ; diff des skills vide. Mutation `Homepage:RightColumn` sur le bundle courant : 20 FAIL.
- Limites : aucune copie locale de Font Awesome n'existe, donc les icônes n'ont pas de glyphe par défaut. Le chevauchement de `fa-medkit` (50 px, « A l'aide ! ») n'est pas vérifié ici : 10.3 doit le reproduire, en rouge puis vert. Les hauteurs mobiles des Nouvelles sont figées à la valeur relevée à 375 px.
- Doutes : voir `revue-manuelle.md` › Ticket 10.2.

## Design Notes

Le mot-clé de l'accueil route aussi vers palette-nation et typographie-formes. Ces deux suites rendent un accueil synthétique : sans elles, un hunk `.page-accueil`, qui élargit aujourd'hui au total, perdrait leur couverture.

Le ticket demande des mesures avec `lib/marges.mjs` (marge, cibles, titres). Le mandat de l'appelant les exclut : ce sont les écarts de 10.3. Ici, seuls l'existant et le débordement sont vérifiés.

## Verification

**Commands:**
- `npm run build` -- expected: validation OK.
- `npm run test:zone -- accueil-mobile` -- expected: vert ; rouge avec chaque bundle muté passé par `KR_SCRIPT`.
- `npm run test:router` -- expected: « Routeur conforme ».
- `npm run test:zone -- palette-nation` -- expected: vert.
- `npm run lint:css` ; `npm run lint:js` ; `npm run test:unit` -- expected: code 0.
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide.

Clôture (orchestrateur, 2026-10-30) : revue indépendante faite (OK avec correctifs), correctifs appliqués, commité (e966d17) et fusionné sur `feature/next` (d00e6f2) ; `test:all` de fusion : 18497 ok, 1 FAIL `kramail-theme#confort` (`/private/tmp/kr-testall-102.log`, cas instable de la rétro 9, vert rejoué seul selon l'orchestrateur) ; `test:all` vert contenant l'épopée : 18840 ok, 0 FAIL, sur l'arbre de `697c363` (`-104.log`, SHA déduit de l'heure du journal).
