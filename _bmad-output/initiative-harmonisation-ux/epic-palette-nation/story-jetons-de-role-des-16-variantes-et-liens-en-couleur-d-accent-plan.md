---
title: "Jetons de rôle des 16 variantes et liens en couleur d'accent"
type: 'feature'
ticket: '1'
created: '2026-10-23'
status: 'built'
baseline_revision: '8a3ae88595e8182984cceec4a06de0bff2eb22a9'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Hors Kraland, les variantes claires gardent les nuances du rouge Kraland (primaire foncée `#700b09`, accent inverse `#f9d9de`, alerte info, ombre des boutons) ; les jetons de rôle de DESIGN.md (texte d'accent, texte de nation, teintes) n'existent pas ; au survol, les liens passent en primaire foncée (clair) ou en primaire (sombre), et l'or d'Empire Brun clair colore les liens à 2,82:1.

**Approach:** Déclarer les jetons de rôle de DESIGN.md › Colors dans les 16 variantes (nuances du clair dérivées de la nation, valeurs du sombre conservées, alerte info et ombre du sombre dérivées), puis faire consommer `text-accent` par les liens, au repos et au survol, soulignés au survol (H5.2, Q1, Q2, R7 ; CAP-4). Crée la suite `palette-nation` et sa zone de test.

## Boundaries & Constraints

**Always:** valeurs = tableaux de DESIGN.md › Colors › Valeurs par variante, à 1 près par canal ; seule valeur d'action nouvelle : `--kr-arm-ink-hover: #1e1a15` en Paladium clair ; P1 option 4 : les règles de lien existantes, clair et sombre, sont réécrites en place, pas surchargées ; un texte qui consomme un jeton redéfini reste ≥ 4,5:1 ; contrastes mesurés dans les 16 variantes avec `tests/e2e/lib/variantes.mjs` ; fixture synthétique, aucune capture HTML brute dans le dépôt.

Décisions prises en autonomie le 2026-10-23 (boucle de revue 1, à confirmer par Arnaud dans `revue-manuelle.md`) :
- Texte posé sur `--kr-primary-dark` : il prend la paire de survol d'action, `--kr-arm-bg-hover` et `--kr-arm-ink-hover`, avec leurs replis actuels. Cela vaut pour 4 règles : page active de la pagination (clair), survol et focus des boutons primaires (clair), survol de `.kr-mobile-close`, survol de `.kr-changelog-view-all`. Sans cette paire, la primaire foncée de Paladium clair (`#aa8c2c`) mettrait ces textes à 3,23:1 (blanc) et 2,48:1 (accent inverse).
- Alerte info en sombre : les jetons sont déclarés, mais la règle `html[class*="-dark"] .alert-info` garde son fond et sa bordure actuels. Ses liens restent en primaire jusqu'au ticket 3.3, et la teinte de la nation les ferait passer sous 4,5:1 en Théocratie Seelienne, Paradigme Vert et Royaume de Ruthvénie sombres. Elle est reprise par le ticket 3.5, avec Q4.

**Never:** boutons primaires et texte posé sur la couleur de nation (3.2), hors des 4 règles ci-dessus ; l'état pressé de la barre d'envoi fixe reste aussi au ticket 3.2 (état bref, barre retirée par R4) ; les 44 autres textes en primaire, dont `html[class*="-dark"] .alert a` (3.3) ; en-têtes, onglets, bouton standard (3.4 : `header-tint`, `border-tint` et `text-nation` sont déclarés sans consommateur) ; états, non-lu et alerte info sombre (3.5) ; jauges (3.6) ; focus, `--kr-focus-ring*` et `outline` (3.7) ; variante high-contrast (Q16).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Jetons | 16 variantes, 375 × 667 et 1280 px | les 15 jetons du tableau (primary à btn-shadow) égaux à DESIGN.md | No error expected |
| Liens au repos | lien sur le fond de page et dans un panneau, 16 variantes | couleur `text-accent`, ≥ 4,5:1, non souligné | No error expected |
| Survol | même lien survolé, 1280 px | couleur inchangée, souligné | No error expected |
| Empire Brun clair | lien | `#8a5a00` au lieu de l'or `#c69100` | No error expected |
| Consommateurs | `btn-primary` (bordure, fond au survol, ombre), `.alert-info` en clair (fond, bordure), entrée de liste sans lien survolée (texte) | valeurs des jetons de la variante, aucun rouge Kraland hors Kraland ; texte survolé ≥ 4,5:1 | No error expected |
| Texte sur la primaire foncée | page active de la pagination (8 variantes claires) ; boutons primaires survolés, `.kr-mobile-close` et `.kr-changelog-view-all` survolés (16 variantes) | texte ≥ 4,5:1 sur son fond | No error expected |
| Alerte info, sombre | `.alert-info`, 8 variantes sombres | fond et bordure inchangés (`rgb(122, 82, 64)` à 0,15 et 0,3) | No error expected |
| Largeurs | 767, 768, 769, 1440, 1920 px ; Kraland et Empire Brun sombre | mêmes valeurs qu'à 375 et 1280 px | No error expected |
| Peau coupée | `kr-theme-enabled = false` | liens Bootstrap natifs (`#337ab7`) | No error expected |

</frozen-after-approval>

## Code Map

- Premier passage revu, sauvegardé hors dépôt : `/tmp/kr-31-pass1/`, avec `pass1.diff` et les fichiers complets. Il est à reprendre, amendé comme le dit le Plan Change Log ; son compte rendu est dans les Implementation Notes.
- `kraland-theme.css` l.5-50, `:root` : `--kr-primary-dark #700b09`, `--kr-highlight-reverse #f9d9de`, `--kr-alert-info-bg/-border rgb(164,18,13,…)`, `--kr-btn-shadow rgb(165,18,13,.12)`. Variantes claires l.140-178 ; `html[class*="-dark"]` l.181-196 ; les 8 blocs sombres l.198-390 gardent leurs primaire foncée et accent inverse.
- Liens : `a:link, a:visited` l.2006 ; `a:hover, a:focus` l.2013 (`outline: none` laissé à 3.7) ; sombre l.3169-3177.
- Texte sur `--kr-primary-dark` :
  - `.pagination > li.active > a` l.1978, texte `var(--kr-surface)` ; en sombre, `html[class*="-dark"] .pagination > .active > a` l.3516 l'emporte (`!important`) ;
  - `button.btn-primary:hover, …:focus` l.2030, texte hérité de l'accent inverse ; en sombre, les règles `html[class*="-dark"] .btn-primary:hover` l.2637 et E3 l.12512-12590 l'emportent ;
  - `.kr-mobile-close:hover` l.4554 : texte `white` au repos ; bouton créé par le template (L10349, L10386) ;
  - `.kr-changelog-view-all:hover` l.11614 : texte `white !important` au repos ;
  - hors de ce ticket : barre d'envoi fixe pressée, l.9743.
- `.list-group-item:hover` l.751 : seules les entrées sans lien suivent cette règle. `a.list-group-item:hover` de Bootstrap (0,2,1) l'emporte sur les entrées-liens, avant comme après.
- `html[class*="-dark"] .alert-info` l.2789 : inchangée.
- Tests :
  - `tests/e2e/lib/variantes.mjs` : `CONTRASTE` lit `color(srgb …)` ;
  - registre `tests/e2e/lib/router.mjs`, que vérifie `npm run test:router` ;
  - tableau des zones du skill `tester-kraland-css`, dans ses deux copies (contrôle : `diff -r`).
- Comparaisons figées :
  - `forum-index.mjs#hors-perimetre` : base fixe 81512a3 ;
  - `kramail-redaction.mjs#regression` : base `origin/feature/next`, mobile.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/fixtures/palette-nation.html`, `tests/e2e/palette-nation.mjs` -- reprendre le premier passage. Ajouter à la fixture une pagination à page active, un `button.kr-mobile-close` et un `button.kr-changelog-view-all`, puis une vérification par nouvelle ligne de la matrice. Contrôles rouges d'abord -- balle traçante de l'épopée
- [x] `kraland-theme.css` -- reprendre le premier passage, sauf la réécriture de `html[class*="-dark"] .alert-info`. Paire de survol d'action sur les 4 règles de texte posé sur la primaire foncée -- H5.2, Q1, Q2, R7 et décisions en autonomie
- [x] `tests/e2e/lib/variantes.mjs`, `tests/e2e/forum-index.mjs`, `tests/e2e/kramail-redaction.mjs`, `tests/e2e/croix-directionnelle.mjs`, `tests/e2e/forum-mobile.mjs` -- reprendre le premier passage. La surcouche des jetons redéfinis ne s'applique dans `kramail-redaction` que si le bundle « avant » est antérieur à ce ticket, c'est-à-dire s'il ne déclare pas `--kr-text-accent:` -- comparaisons figées, sans faux écart après fusion
- [x] `tests/e2e/lib/router.mjs`, `tests/e2e/lib/router.test.mjs`, les deux copies du skill `tester-kraland-css` -- inscrire la suite et sa zone `palette-nation`, sans mot-clé de jeton. Une déclaration de jeton continue d'élargir au total, comme toute déclaration de variable -- routage conservateur
- [x] `npm run build` -- bundle et `version.json`

**Acceptance Criteria:**
- Given les suites existantes, when `test:all` tourne, then tout est vert ; un écart d'une comparaison figée n'est accepté que s'il vient d'un jeton redéfini, et il est consigné.
- Given une copie mutée du bundle (formule retirée, survol en primaire, encre de Paladium absente, paire de survol retirée de la pagination), when la suite tourne, then elle est rouge.
- Given un hunk du thème qui déclare un jeton de rôle, when le routeur le classe, then il élargit au total.

## Implementation Notes

- Passage 1 (2026-10-23), annulé par la boucle de revue 1 et sauvegardé dans `/tmp/kr-31-pass1/`. Son compte rendu :
  - Rouge avant le code (bundle reconstruit sur 8a3ae88, sources inchangées) : `palette-nation` à 34 ok / 110 FAIL, seules passaient les gardes (variante posée, peau coupée) ; vert après : 144 ok / 0 FAIL.
  - Contre-épreuves sur copies mutées du bundle, hors dépôt : formule de `--kr-primary-dark` remplacée par `#700b09` → 30 FAIL ; survol des liens en primaire, clair → 8 FAIL, sombre → 8 FAIL (lightningcss fusionne les deux règles de lien sombres, recoupées pour la mutation) ; `--kr-arm-ink-hover` de Paladium clair retiré → 2 FAIL, plus `croix-directionnelle#m1` et `forum-mobile#m1-clair` (3,24:1) ; thème forcé malgré `kr-theme-enabled = false` → 2 FAIL.
  - Écarts de comparaisons figées, acceptés parce qu'ils viennent d'un jeton redéfini : `forum-index#hors-perimetre`, Kraland clair, bordure des `.label` et page active de la pagination, de `rgb(112, 11, 9)` à `#6f0c0b` (`--kr-primary-dark`) ; `kramail-redaction#regression`, Empire Brun sombre, ombre des boutons primaires (`--kr-btn-shadow`, seul jeton en cause). Mécanisme : `JETONS_REDEFINIS` et `poserJetonsRedefinis` (`tests/e2e/lib/variantes.mjs`), feuille adoptée posée sur le bundle « avant » dès le début du document ; captures identiques octet pour octet ; un écart hors de ces jetons reste rouge (`--kr-text-accent` décalé d'un cran → 16 et 12 FAIL). Une feuille ajoutée après le chargement rendait la capture du kramail instable : écartée.
  - `color-mix()` se sérialise en `color(srgb …)` (composantes de 0 à 1) : les analyseurs de `croix-directionnelle.mjs` et `forum-mobile.mjs` (m1) le lisaient comme un quasi-noir ; corrigés.
  - Variante `high-contrast`, sans CSS : elle suit `:root` (Q16).
- Passage 2 (2026-10-23), premier passage repris et amendé selon le Plan Change Log :
  - Fichiers : fixture (pagination à page active `#page-active`, `button.kr-mobile-close` dans un panneau positionné, `button.kr-changelog-view-all`) ; suite à 192 contrôles, mêmes fragments, avec trois vérifications nouvelles : `paginationActive` (8 variantes claires, 375 et 1280 px), `texteSurPrimaireFoncee` (16 variantes, 1280 px) et `alerteSombre` (8 variantes sombres, 375 et 1280 px) ; l'alerte info des consommateurs n'est plus comparée qu'en clair. Thème : premier passage sans la réécriture de `html[class*="-dark"] .alert-info`, plus la paire de survol sur les 4 règles. Routeur : entrée `SUITES` seule, sans mot-clé. Kramail : surcouche conditionnelle. Skill : ligne de zone, sans la phrase sur le mot-clé.
  - Écart au Code Map, tranché par la mesure : le texte des boutons primaires survolés n'héritait pas de l'accent inverse. `.btn-primary:hover` de Bootstrap (0,2,0) l'emporte sur `button.btn-primary` (0,1,1) et pose du blanc : `rgb(255, 255, 255)` mesuré sur la base, dans les variantes claires. Le repli du texte est donc `var(--kr-white)`, la couleur rendue jusqu'ici et le repli de `--kr-arm-ink-hover` des autres règles. En clair, seul Paladium change, comme le disent les Design Notes. Avec le premier passage, Paladium clair était donc à 3,23:1 (blanc), et non à 2,48:1.
  - Tableau `DESIGN` de la suite comparé par script aux 3 tableaux de DESIGN.md › Valeurs par variante : 16 variantes × 15 jetons, 0 écart.
  - Rouge avant le code (bundle reconstruit sur 8a3ae88, sources inchangées) : 51 ok / 141 FAIL. Passaient les gardes (variante posée, peau coupée), l'alerte info sombre inchangée (16) et le survol d'Empire Brun sombre, déjà en paire. Vert après : 192 ok / 0 FAIL.
  - Contre-épreuves sur copies mutées du bundle, hors dépôt, toutes rouges : formule de `--kr-primary-dark` remplacée par `#700b09` → 54 FAIL ; survol des liens en primaire, clair → 8 FAIL, sombre → 8 FAIL (règle fusionnée par lightningcss, recoupée) ; `--kr-arm-ink-hover` de Paladium clair retiré → 5 FAIL, plus `croix-directionnelle#m1` et `forum-mobile#m1-clair` (3,24:1, lecture de `color(srgb …)` confirmée) ; paire retirée de la pagination → 2 FAIL ; paire retirée des 3 autres règles → 8 FAIL (fragment bureau).
  - Routeur : `router.test.mjs` vérifie qu'une déclaration dans `:root`, en Paladium clair ou sous `html[class*="-dark"]`, même citant `palette-nation`, élargit au total, et qu'un changement de la fixture ne lance que `palette-nation`. Contre-épreuve : le mot-clé du premier passage remis → rouge (`:root` non élargi). `test:router` : 81 ok.
  - Comparaisons figées : aucun écart nouveau ; ceux du passage 1 restent les seuls acceptés, et la paire de survol ne change aucune valeur mesurée en Kraland clair ni en Empire Brun sombre. `forum-index#hors-perimetre` : 24 ok, surcouche toujours posée. `kramail-redaction#regression` : base `origin/feature/next` → surcouche posée, 12 ok ; même base marquée comme postérieure au ticket (commentaire `--kr-text-accent:` ajouté) → pas de surcouche, 11 FAIL, l'écart réel de l'ombre ; base = bundle de ce ticket → pas de surcouche, 12 ok.
  - `lint:css` 0 ; `lint:js` 0 erreur (1 avertissement préexistant, `report-non-lu.mjs`) ; `diff -r .hermes/skills .claude/skills` vide ; `test:all` vert. Captures hors dépôt : `/tmp/kr-31-shots/` (Kraland, Empire Brun, Paladium, clair et sombre, 375 et 1280 px).
  - Non fait : site réel (pas de mandat) ; durées de `palette-nation` absentes de `durations.json` (fragments lancés en tête, sans effet sur le résultat).

## Plan Change Log

- 2026-10-23, boucle de revue 1 (passe quick). Les constats 1 et 2 du journal de tri sont des `intent_gap` : la partie figée exigeait à la fois des textes ≥ 4,5:1 et l'absence de retouche du texte posé sur la couleur de nation. Ils ont été tranchés en autonomie, voir les décisions de la partie figée. Le constat 3 est un `bad_plan` : la tâche « mot-clé des jetons » réduisait le routage. Le constat 4 est un `patch`.
  - Amendements : la partie figée ajoute les deux décisions et deux lignes de matrice (« Texte sur la primaire foncée », « Alerte info, sombre ») et restreint « Consommateurs » à l'alerte info du clair ; le Code Map liste les textes sur la primaire foncée ; les tâches retirent la réécriture de l'alerte info sombre et le mot-clé, ajoutent la paire de survol, les éléments de fixture et la surcouche conditionnelle du kramail.
  - États mauvais évités : liens des alertes info sombres sous 4,5:1 dans 3 variantes ; en Paladium clair, texte à 3,23:1 sur la page active de la pagination, la croix mobile et « tout voir », à 2,48:1 sur les boutons primaires survolés ; `test:changed` qui oublierait les suites de la croix, du forum et des 16 variantes quand une déclaration de jeton change ; faux écart permanent du kramail après fusion.
  - KEEP, à reprendre du premier passage : formules `color-mix` et jetons de `:root`, d'Empire Brun clair, de Paladium clair et de `html[class*="-dark"]` (alerte info sombre comprise) ; liens clair et sombre réécrits en place ; `.list-group-item:hover` en `text-accent` ; fixture, tableau DESIGN et contrôles de `palette-nation.mjs` ; surcouche `JETONS_REDEFINIS` (toujours appliquée dans `forum-index`) ; lecture de `color(srgb …)` dans la croix et le forum ; entrée `SUITES` ; ligne du skill, sans la phrase sur le mot-clé.

## Review Triage Log

Passe quick du 2026-10-23 (boucle 0) : 2 medium (intent_gap), 1 medium (bad_plan), 1 low (patch), 1 low (defer).
- medium, intent_gap — liens des alertes info sombres (`html[class*="-dark"] .alert a`, primaire) sur le nouveau fond opaque de l'alerte info. Recalcul sur `bg-surface` : Théocratie Seelienne 4,83 → 4,35:1, Paradigme Vert 4,78 → 4,33:1, Royaume de Ruthvénie 4,75 → 4,31:1 ; Kraland (3,57 → 3,42) et Khanat Elmérien (4,01 → 3,76) baissent encore. Passer ces liens en `text-accent` mettrait Paladium sombre à 3,80:1 (Q4). Tranché : règle sombre de l'alerte info inchangée, reprise par 3.5.
- medium, intent_gap — Paladium clair : la primaire foncée `#aa8c2c` met à 3,23:1 le texte blanc de la page active de la pagination (au repos), de `.kr-mobile-close:hover` et de `.kr-changelog-view-all:hover`, et à 2,48:1 l'accent inverse des boutons primaires survolés. Avant, ces textes étaient au moins à 9,20:1 sur le rouge Kraland. Tranché : paire de survol d'action sur ces 4 règles.
- medium, bad_plan — le mot-clé de déclaration des jetons (`router.mjs` l.117) classait le hunk en `palette-nation` seule, sans élargissement. Or une déclaration de `--kr-arm-ink-hover`, `--kr-primary` ou `--kr-highlight` change aussi `croix-directionnelle#m1`, `forum-mobile#m1-clair` et les suites des 16 variantes. Correction : pas de mot-clé, la déclaration élargit au total.
- low, patch — la surcouche `JETONS_REDEFINIS` de `kramail-redaction` resterait posée sur `origin/feature/next` après fusion. Si un ticket suivant redéfinit l'un de ces jetons, le bundle « avant » serait forcé aux valeurs de 3.1, d'où un faux écart dans toutes les PR suivantes. Correction : surcouche appliquée seulement à une base antérieure à ce ticket.
- low, defer — les entrées-liens des listes latérales (`a.list-group-item`) prennent au survol le `#555` sans soulignement de Bootstrap (0,2,1), avant comme après ce ticket. La phrase de `revue-manuelle.md` ne vaut que pour les entrées sans lien : elle est corrigée. Savoir si ces entrées de navigation suivent R7 est une question de produit, notée dans `deferred-work.md` et dans `revue-manuelle.md`.

Passe quick du 2026-10-23 (boucle 1) : 1 low (patch), 1 low (patch, document), 1 maybe-false (defer), 2 false.
- low, patch — `tests/e2e/palette-nation.mjs` l.267 citait `list-group-item` dans un commentaire : 4 suites le citaient, au-delà de `MAX_CITING` (3). Le repère devenait transverse, et un hunk `.list-group-item` porteur d'un mot-clé (par exemple `mobile-mode`) ne lançait plus `menus-forums`. Correction : commentaire reformulé, code inchangé. Hunk `.list-group-item.forums-added` : zones `menus-forums` et `forum`, unités `plateau-profil-mobile`, `menus-forums` et `jeu-identite`.
- false — partie « `color-mix` » du même constat : `addCited` n'extrait d'un hunk que les repères précédés de `.`, `#` ou d'un guillemet. Aucune source ne contient `color-mix` sous cette forme (0 occurrence dans le template, aucune citée dans le thème) : la citation de `color-mix` par 5 suites n'a aucun effet de routage.
- low, patch (document) — `revue-manuelle.md` donnait 2,48:1 pour le texte des boutons primaires survolés en Paladium clair. Ce texte est blanc (`.btn-primary:hover` de Bootstrap, 0,2,0, l'emporte sur l'accent inverse), soit 3,23:1 : chiffre corrigé. Le 2,48:1 du journal de la boucle 0 venait de la même lecture erronée.
- false — affirmation des Design Notes « seule `.bootbox-confirm .alert-order` consomme cette alerte info sombre » : la ligne d'action cochée du mobile (`.panel-actions .row.form-group:has(input:checked)`) la consomme aussi. Ce constat est rejeté, car sa correction se limiterait au texte du plan. Son texte reste lisible (`text-secondary` ≥ 6,27:1).
- maybe-false, defer — un lien dans l'aide de la modale en sombre (`html[class*="-dark"] .alert a`, primaire) passerait sous 4,5:1 sur la teinte opaque, en Théocratie Seelienne, Paradigme Vert et Royaume de Ruthvénie. Ce serait medium si c'était vrai, mais les aides relevées (Dormir, Pouvoir) n'ont aucun lien. Pour trancher : relever, en lecture seule, l'aide d'autres ordres. Noté dans `deferred-work.md`.

Vérification après patch (arbre final) : `palette-nation` 192 ok, 0 FAIL ; `test:router` conforme ; `lint:css` 0 ; `lint:js` 0 erreur, 1 avertissement préexistant (`report-non-lu.mjs`) ; `diff -r .hermes/skills .claude/skills` vide ; `test:all` 4852 ok, 0 FAIL, RÉSULTAT : VERT. Un premier `test:all`, lancé pendant la revue, avait 3 FAIL dans `plateau-qualite-usage` (légendes, cibles tactiles), dus à la charge de la machine : la suite seule est verte 3 fois sur 3 (35 ok).

## Design Notes

Formules dans `:root`, résolues pour chaque variante parce que les classes de variante sont posées sur `html` :

```css
--kr-primary-dark: color-mix(in srgb, var(--kr-primary) 80%, #000);
--kr-header-tint: color-mix(in srgb, var(--kr-primary) 8%, #fff);
--kr-btn-shadow: color-mix(in srgb, var(--kr-primary) 12%, transparent);
--kr-text-accent: var(--kr-highlight);
```

- Les blocs sombres gardent leurs valeurs littérales. `html[class*="-dark"]` déclare `header-tint`, `border-tint`, `text-nation` et l'alerte info (primaire mêlée à `bg-surface`, à 15 % et 30 %). Dans ce ticket, seule `.bootbox-confirm .alert-order` consomme cette alerte info sombre.
- Écart des formules contre les tableaux de DESIGN.md : au plus 0,75 par canal, calculé.
- Paire de survol d'action : `background: var(--kr-arm-bg-hover, var(--kr-primary-dark))` et `color: var(--kr-arm-ink-hover, <couleur actuelle>)`.
  - En clair, seul Paladium change : encre `#1e1a15` sur `#aa8c2c`, 5,35:1.
  - En sombre, la croix mobile et « tout voir » prennent l'encre de leur variante. Paladium sombre passe ainsi de 2,10 à 8,23:1, et Confédération Libre sombre garde 5,14:1 grâce à son fond `#5f6673` ; la pagination et les boutons primaires ont leurs propres règles sombres.

## Verification

**Commands:**
- `npm run build && node tests/e2e/palette-nation.mjs` -- expected: rouge avant le code, vert après
- `npm run test:router`, `npm run lint:css`, `npm run lint:js` -- expected: conformes, 0 erreur
- `diff -r .hermes/skills .claude/skills` -- expected: sortie vide
- `npm run test:all` -- expected: RÉSULTAT : VERT
