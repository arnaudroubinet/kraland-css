---
title: 'La palette privée --kd-* est retirée au profit des jetons de rôle'
type: 'refactor'
ticket: '6'
created: '2026-10-29'
status: 'built'
baseline_revision: '0b27dc2e9a1113e97f6a746b123e18c062520d1e'
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

**Problem:** Le champ Destinataires de la rédaction du kramail lit une palette privée `--kd-*` (13 variables posées sur `form[name="post_msg"]`) et `--kr-badge-danger` (`#dc3545`, dernier lecteur `.kd-field.is-invalid`), hors des jetons de rôle de l'épopée 3. En Empire Brun clair, ses filets d'état et ses contours de focus sont dorés (`#C69100`, 2,82:1 sur blanc) et son texte de section est un mélange privé.

**Approach:** Chaque `var(--kd-*)` est réécrit sur un jeton de rôle ; les mélanges lus par deux règles ou plus deviennent des jetons partagés `--kr-*` de `:root`, les autres s'écrivent sur le jeton ; `--kr-badge-danger` est retiré au profit de `--kr-danger` ; les tailles de police en dur de la zone qui ont un jeton exact passent au jeton. Les tailles prennent le jeton de même valeur plutôt que celui de leur rôle, parce qu'un jeton de rôle de valeur différente changerait le rendu, hors du périmètre de ce ticket de couleur. Couleurs égales à la base hors écarts listés.

## Boundaries & Constraints

**Always:** P1 option 4 (retirer, pas empiler) ; aucun nouvel `!important` (total ≤ 2958, base 0b27dc2) ; gardes `:where(html.x)` pour toute garde ajoutée ; mobile `max-width: 767px`, bureau `min-width: 768px` ; cibles ≥ 44 px ; Destinataires inchangé (ajout, doublon, suppression d'une pastille, champ invalide) ; texte ≥ 4,5:1, filets et contours d'état ≥ 3:1 dans les 16 variantes ; `grep -- '--kd-' kraland-theme.css kraland-userscript-template.js` vide.

**Never:** « Envoyer » et barre fixe (entrée 7) ; contacts (entrée 8) ; classes `.kd-*` du module `Kramail:Destinataires` (seule la palette change) ; tailles, hauteurs et espacements sans jeton exact ; bundle édité ; site réel ; écriture git.

**Décisions (autonome, doutes dans revue-manuelle.md, « Ticket 7.6 ») :**
- B1 Correspondance : `--kd-bg` → `var(--kr-form-bg, var(--kr-bg-elevated))` ; `--kd-panel` → `--kr-bg-elevated` ; `--kd-border` → `--kr-border-strong` ; `--kd-text` → `--kr-text-primary` ; `--kd-muted` → `--kr-text-secondary`.
- B2 `--kd-accent` en filet, contour, icône ou soulignement → `--kr-text-accent` (anneau de focus H5.7, Q2) ; en fond ou lueur → `--kr-highlight`. Écart : Empire Brun clair seul (`#8a5a00` au lieu de `#C69100`).
- B3 `--kd-accent-text` → `--kr-text-accent` (texte coloré, Q2). Écart dans les 16 variantes (titre de section `.kd-sec`).
- B4 `.kd-field.is-invalid` → `--kr-danger` (blocage d'envoi, H5.5) ; `--kr-badge-danger` retiré de `:root`. Écart dans les 16 variantes.
- B5 Jetons partagés (deux lecteurs ou plus) : `--kr-accent-tint` (16 %, pastille et Ajouter), `--kr-accent-tint-strong` (32 %, doublon et croix survolée), `--kr-accent-line` (60 %, filet de pastille et du panneau), `--kr-accent-active` (24 % sur `bg-elevated`, survol de Contacts, option active, survol des boutons) ; le survol d'option (10 %) et les lueurs s'écrivent sur le jeton.
- B7 Filet du doublon et contour de la croix ciblée → `--kr-text-primary` (décision du coordinateur après revue, 2026-10-29) : l'accent sur la teinte appuyée du même accent tombait sous 3:1 en sombre ; les fonds ne changent pas. Écart dans les 16 variantes.
- B6 Filets de repos (champ, Contacts, panneau, pastille, pied) : hors du 3:1, comme les champs natifs du formulaire.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Palette | Nouveau et Répondre, 16 variantes, 375 et 1280 | couleurs calculées du champ, des pastilles, de Contacts, du panneau et du blocage égales à la base 0b27dc2, hors B2-B4 | — |
| États | focus, invalide, doublon, sélection, option active | filet ou contour ≥ 3:1 sur son fond | — |
| Textes | pastilles, saisie, sections, options, aide, messages, boutons | ≥ 4,5:1 | — |
| Destinataires | ajout, doublon, retrait, envoi bloqué | comportement inchangé, champ invalide en `--kr-danger` | — |

</frozen-after-approval>

## Code Map

- `kraland-theme.css` l.44-75 `:root` -- jetons B5 près de `--kr-text-accent` ; retrait de `--kr-badge-danger` (l.75).
- `kraland-theme.css` l.10130-10497 « KRAMAIL RÉDACTION — champ Destinataires », universel -- bloc `--kd-*` retiré, chaque `var(--kd-*)` réécrit (B1-B5), commentaire d'en-tête mis à jour.
- `kraland-theme.css` l.10525-10904 bureau et mobile -- polices en dur à jeton exact : 13 px → `--kr-font-detail`, 14 px (saisie) → `--kr-font-body`, 14 px (Contacts) → `--kr-font-button`, 15 px (pastille) → `--kr-font-name`. Restent en dur : 11, 12, 16 px (anti-zoom iOS), hauteurs 24-40 px.
- `kraland-userscript-template.js` -- aucune `--kd-` ; rien à changer.
- `tests/e2e/kramail-theme.mjs` -- nouveau fragment `redaction-palette` ; en-tête et options mis à jour.
- `tests/e2e/lib/router.mjs` -- fragment enregistré si le routeur l'exige (`npm run test:router`).
- Suites à surveiller (grep `kd-`, `post_msg`, kramail) : kramail-redaction (`themes`, `regression`), typographie-formes, palette-nation, cartes-pastilles, messages-v3, forum-*, confort-mobile, jeu-identite, modale-ordre, parler-viewport.

## Tasks & Acceptance

**Execution:**
- [x] `tests/e2e/kramail-theme.mjs` -- fragment `redaction-palette` : source sans `--kd-`, aucune variable `--kd-*` calculée sur le formulaire, couleurs égales à la base 0b27dc2 hors B2-B4, écarts à leur jeton, contrastes (texte, états) -- rouge sur 0b27dc2.
- [x] `kraland-theme.css` -- jetons B5, réécriture B1-B4, polices, retrait de `--kr-badge-danger`.
- [x] `tests/e2e/lib/router.mjs` -- fragment déclaré si nécessaire.
- [x] Suites sœurs -- masques conditionnés à la base si une comparaison « égale à la base » voit B2-B4.

**Acceptance Criteria:**
- Given le bundle de base, when `KR_SCRIPT=/tmp/kr76/base.user.js KR_FRAG=redaction-palette`, then rouge ; une mutation de chaque contrôle le rend rouge.
- Given la feuille, when `grep -o '!important' kraland-theme.css | wc -l`, then ≤ 2958.

## Implementation Notes

- Implémenté directement par l'agent de build (déjà sous-agent dédié du ticket), sans sous-agent d'implémentation.
- Feuille : bloc `--kd-*` retiré ; 4 jetons partagés `--kr-accent-tint`, `--kr-accent-tint-strong`, `--kr-accent-line`, `--kr-accent-active` ajoutés à `:root` après `--kr-border-tint` ; `--kr-badge-danger` retiré ; 56 déclarations réécrites (B1-B4) ; survol d'option (10 %) et lueurs (30 %, 55 %) écrits sur `--kr-highlight`. Polices : bureau pastille et Contacts 13 px → `--kr-font-detail`, saisie 14 px → `--kr-font-body` ; mobile pastille 15 px → `--kr-font-name`, Contacts 14 px → `--kr-font-button`. Après revue : icônes mobiles 13 px (croix, option) → `--kr-font-detail`, 14 px (Contacts) → `--kr-font-button`. Restent en dur : 11 et 12 px, et la saisie mobile à 16 px. `!important` : 2958 (inchangé). Template : aucune modification.
- Test : fragment `redaction-palette` (129 contrôles : 1 statique + 2 × 64 cas). Filets, contours et icônes : 3:1 sur leurs deux fonds (élément et parent, le plus faible). Doublon et croix ciblée étaient sous 3:1 dès la base dans 4 variantes sombres (2,43 à 2,84:1) ; ils passent en `--kr-text-primary` (B7) et l'exception `HERITES_CONTRASTE` est supprimée. La croix ciblée compare aussi son fond (`backgroundColor`) à la base.
- Routeur : fragment déclaré dans `SUITES` (kramail-theme), sans quoi `test:zone -- kramail` ne le lançait pas.
- Aucun masque : aucune comparaison « égale à la base » des suites sœurs n'a vu B2-B4.

## Plan Change Log

## Review Triage Log

| # | Constat (revue quick) | Verdict | Route |
|---|---|---|---|
| 1 | Doublon sous 3:1 sur son fond en sombre | medium : réel, mais identique sur la base (2,43 à 2,84:1, 4 variantes) ; le corriger change le remplissage, ce que l'intention interdit hors écarts | patch (revue indépendante, décision du coordinateur) : filet et contour en `--kr-text-primary` (B7), fonds inchangés ; exception `HERITES_CONTRASTE` supprimée |
| 2 | La mesure « parent seul » ignore le fond voisin réel (croix à contour intérieur, doublon, focus, glyphe survolé) | medium : vrai, la mesure parent seul laissait passer la croix | patch : mesure sur les deux fonds (min) ; exceptions héritées nommées, sans recul (contre-épreuve : teinte à 45 %, 108 FAIL) |
| 3 | Contrastes absents : saisie, icônes d'option, survols de Contacts, d'option et d'Effacer | low : cibles promises par la matrice | patch : cibles ajoutées (contre-épreuve : saisie #bbb, 96 FAIL) |
| 4 | Icônes mobiles 13 et 14 px en dur alors que la Code Map ne garde que 11, 12 et 16 px | low : écart à la Code Map | patch : passent au jeton (même valeur calculée) |
| 5 | Section « Ticket 7.6 » absente de revue-manuelle.md, l.368 périmée | low | patch : section ajoutée ; elle note la caducité de l.368 (historique non réécrit) |

## Verification

**Commands:**
- `npm run build` -- validation verte.
- `KR_SCRIPT=/tmp/kr76/base.user.js KR_FRAG=redaction-palette node tests/e2e/kramail-theme.mjs` -- rouge.
- `npm run test:zone --` kramail, palette-nation, cartes-pastilles, typographie-formes, forum, forum-activite, confort-mobile, messages, parler, modale-ordre, plateau (jeu-identite) -- 0 FAIL ou FAIL attribués.
- `npm run lint:css`, `npm run lint:js`, `npm run test:unit`, `npm run test:router` -- verts ; `diff -r .hermes/skills .claude/skills` vide.

**Résultats (2026-10-29, worktree wt76, base 0b27dc2) :**
- `npm run build` : VALIDATION PASSED.
- Rouge : `KR_SCRIPT=/tmp/kr76/base.user.js KR_FRAG=redaction-palette` → 60 ok, 69 FAIL. Vert → 129 ok, 0 FAIL.
- Après revue : vert 129 ok, 0 FAIL ; rouge 101 FAIL ; contre-épreuves teinte appuyée 45 % (108 FAIL) et saisie #bbb (96 FAIL) ; kramail 1064, typographie-formes 4453, cartes-pastilles 2302, palette-nation 1372, 0 FAIL ; lint, unit et routeur verts.
- Contre-épreuves (bundle muté) : tinte 16→18 % (68 FAIL), icône Contacts en highlight (8), section en ancien mélange (64), invalide en #dc3545 (64), aide #bbb (96), focus du champ en highlight (8), `--kd-accent` dans le bundle (1), `--kd-panel` sur le formulaire (65), `.kd-help` absent (128).
- Zones (0 FAIL chacune) : kramail 1064, palette-nation 1372, cartes-pastilles 2302, typographie-formes 4453, forum-activite 1385, confort-mobile 912, forum 639, messages 235, parler 86, modale-ordre 371, plateau 1959, sous-forum 1374, cybermonde 229, profil 187, confinement 33, initialisation 205, demarrage 127, menus-forums 254.
- Après revue indépendante (B7, DESIGN.md, commentaire de `:root`, `backgroundColor` de la croix ciblée) : build VALIDATION PASSED ; vert 129 ok, 0 FAIL ; rouge sur la base 101 FAIL ; contre-épreuves : filet du doublon remis en `--kr-text-accent` (80 FAIL : 64 écarts au jeton, 16 contrastes de 2,43 à 2,84:1), contour de la croix ciblée remis en `--kr-text-accent` (80 FAIL, même répartition) ; zones kramail 1064, palette-nation 1372 et typographie-formes 4453, 0 FAIL ; lint:css 0, lint:js 0, test:router 0 ; `!important` 2958.
- lint:css 0, lint:js 0 (1 avertissement préexistant, report-non-lu.mjs), test:unit 0, test:router 0 ; `diff -r .hermes/skills .claude/skills` vide ; `grep -- '--kd-' kraland-theme.css kraland-userscript-template.js` vide.

## Result

La palette privée `--kd-*` (12 variables) et `--kr-badge-danger` sont retirées. Le champ Destinataires lit désormais les jetons de rôle et 4 mélanges partagés de `:root`. Ses couleurs sont égales à la base 0b27dc2, hors écarts B2 à B4 vérifiés jeton par jeton. Fragment `kramail-theme#redaction-palette` : rouge sur la base, vert après, contre-épreuves par mutation. Toutes les zones listées sont à 0 FAIL. Doublon et croix ciblée, sous 3:1 dès la base dans 4 variantes sombres, passent en `--kr-text-primary` (B7) : l'exception du test est retirée. Doutes restants dans revue-manuelle.md, « Ticket 7.6 ».
