---
title: "Échelle typographique du forum et du kramail"
type: 'feature'
ticket: '7'
created: '2026-10-24'
status: 'built'
baseline_revision: 'd953969'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-typographie-formes/story-echelle-typographique-du-plateau-du-mini-profil-et-des-en-te-plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur l'index, le sous-forum, le sujet, la rédaction et le kramail, les tailles de texte ne suivent pas l'échelle (DESIGN.md › Typography) : noms à 16 px sur mobile (titres de sujet, nom de forum, auteur de message), détails à 11-12 px (compteurs, dernier message, dates), valeurs hors échelle (8, 11, 12,5, 18 px), textes sous 12 px sur mobile (forum l.7900, 7944, 7977, 8592, 8632, 8663 ; kramail l.9602, 11494, 11500).

**Approach:** Réécrire en jetons les déclarations existantes de ces pages selon leur rôle : noms `var(--kr-font-name)` 15 px (nom de forum de l'index : `var(--kr-font-forum-name)` 15 px gras, ticket 6.1, gardé), détails `var(--kr-font-detail)` 13 px, texte courant `var(--kr-font-body)` 14 px sur ordinateur et `var(--kr-font-body-mobile)` 15 px sur mobile, corps des messages du forum à 16 px gardé, rien sous 12 px sur mobile. Kramail : seules les règles communes, aucune règle propre nouvelle.

## Boundaries & Constraints

**Always:**
- P1 option 4 : réécrire la valeur dans la règle d'origine, retirer les doublons morts (ex. tableau mobile en double l.7878-8049 et l.8572-8735 : garder une seule source si l'une est battue), ne pas ajouter de règle qui bat.
- Rôles : nom = titre de sujet, nom de forum, auteur d'un message, nom d'un message kramail ; détail = dates, heures, compteurs, auteur et date du dernier message, nombre de pages, fil d'Ariane, expéditeur et destinataires kramail, signature ; texte courant = descriptions, corps de message kramail (lecture), textes d'aide et d'état ; étiquettes, pastilles, boutons, boutons compacts, en-têtes de panneau : déjà traités (tickets 1 à 5), non touchés.
- Assumption : le kramail « ne reçoit que les règles communes » = aucune règle à sélecteur nouveau pour le kramail ; les valeurs de ses règles existantes passent en jetons selon le même tableau de rôles (12,5 → 12 ou 13, 11 → 12 au moins sur mobile), en vue de sa reprise par l'épopée 7.
- Assumption : hors échelle conservés et consignés : titres de page mobiles à 24 px (`.forum-subforum-title`, rôle titre de page, mobile non décidé par DESIGN), icônes et glyphes (flèches 24 px, icônes kramail 16-18 px, `.forum-tags .glyphicon` 8 px gardé par le ticket 1), champs à 16 px (anti-zoom), textes masqués à 0.
- Index et sous-forum changent ensemble (parité de `forum-index.mjs` 246-283) ; `forum-index.mjs:737` (pages sans `kr-page-forum-index` = bundle d'avant) : écart attendu consigné dans `tests/e2e/lib/variantes.mjs` en masque miroir hors couche (mêmes sélecteurs et drapeaux que le bundle, comme `ECHELLE_TICKET45`), jamais en affaiblissant une assertion.
- Suites mises à jour aux nouvelles valeurs : `sous-forum.mjs:538` (16 → 15), `forum-index`, `messages-v3`, `forum-mobile`, `kramail-redaction` (l.1217-1220 : 13 px gardé si rôle détail).
- Rouge avant sur `d953969`, contre-épreuves ; routeur : mots-clés des composants mesurés sans faire passer un repère à 4 suites citantes (MAX_CITING = 3) ; contrôler `test:router` et le nombre de suites citant chaque classe touchée.

**Never:** toucher au corps des messages du forum (16 px) ni aux champs (16 px) ; règles des pages de jeu ; accueil ; règle `:focus` ; git modifiant arbre/index/stash ; site réel ; Chrome 9222/9223.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Index | `forum-index-rp.html`, `forum-index-communaute.html`, `forum-racine.html` ; 375, 767, 768, 1280, 1440, 1920 ; clair et sombre | nom de forum 15 px gras, détails 13, aucun texte visible sous 12 à 375 | n/a |
| Sous-forum | `sous-forum-debuter.html` | titres de sujet 15, détails 13, parité avec l'index | n/a |
| Sujet | `forum-sujet.html` | auteur 15, détails 13, corps 16 mobile / natif ordinateur | n/a |
| Rédaction | HTML synthétique de `forum-mobile.mjs` / `messages-v3.mjs` ou fixture créée | libellés 13, textarea 16 | n/a |
| Kramail | `kramail-reception.html`, `kramail-lecture.html`, `kramail-nouveau.html` | noms 15, détails 13, texte courant 14/15, rien sous 12 à 375 | n/a |

</frozen-after-approval>

## Code Map

- Index : l.14722-15064 (mobile et ordinateur, `html.kr-page-forum-index`) ; tableau mobile générique en double l.7878-8049 (`body.mobile-mode:where(.page-forum, .page-forum-racine)`) et l.8572-8735 (`[nonIdx]`) ; classes l.8230-8296 (`.forum-title` 18, à vérifier : vivante ou morte).
- Sous-forum : l.8815-8922, 13744-14626 (dont 14088, 14125, 14237, 14386, 14523, 14560, 14626).
- Sujet : l.15129 (auteur 16), 15145, 15204 (corps 16, garder).
- Rédaction : l.15349, 15398.
- Kramail liste/lecture : l.9061-9663 (9384, 9594, 9602) ; formulaire `.editeur-text` l.10094-10580 ; `.kd-*` ordinateur l.11076-11320 (11190, 11235, 11241, 11304), mobile l.11359-11587 (11494, 11500, 11558).
- Tests : `tests/e2e/typographie-formes.mjs` (nouveau fragment `echelle-forum`), `forum-index.mjs`, `sous-forum.mjs`, `messages-v3.mjs`, `forum-mobile.mjs`, `kramail-redaction.mjs`, `lib/variantes.mjs`, `lib/router.mjs`, `lib/router.test.mjs`.

## Tasks & Acceptance

**Execution:**
- [x] Fragment `echelle-forum` -- rouge sur `d953969`.
- [x] `kraland-theme.css` -- valeurs en jetons par rôle ; doublons morts retirés.
- [x] Suites forum et kramail aux nouvelles valeurs ; écarts attendus en masque miroir.
- [x] `npm run build`, contre-épreuves.

**Acceptance Criteria:**
- Given les fixtures, when `npm run test:all` et `npm run test:router` tournent, then 0 FAIL et routeur conforme ; valeurs de la matrice tenues.

## Implementation Notes

- Doublons du tableau mobile : le premier bloc (`body.mobile-mode:where(.page-forum, .page-forum-racine)`) est battu partout où il s'applique (la racine porte toujours `kr-page-forum-index`) ; ses `font-size` morts sont retirés, le second bloc (`[nonIdx]`) reste la source unique, en jetons.
- Cartes de forum (`.forum-title` 18, `.forum-description`, `.forum-moderators`, `.forum-stats`, `.forum-last-activity`, `.last-time`) : créées seulement en mode mobile (`ForumCards:MobileTransform` sort si `body` n'a pas `mobile-mode`, posé sous 768 px), vivantes sur le forum Staff mobile, aucun emploi sur ordinateur ; passées en jetons (nom de forum, texte courant mobile, détail) et déplacées, avec leurs voisines `.forum-footer`, `.forum-topics`, `.forum-separator`, `.last-user`, sous `@media (max-width: 767px)` (ordre et spécificité inchangés). Rendu vérifié : Staff mobile du contrôle miroir, `forum-mobile`, `forum-index`.
- Template : style en ligne de `.permanent-topic-stats` 11 px → `var(--kr-font-detail)` (visible à 11 px sur Staff mobile) ; le masque miroir le force à 13 px, exception consignée dans sa JSDoc.
- Ajout d'une déclaration `font-size: var(--kr-font-detail) !important` aux règles ordinateur existantes de l'auteur du dernier message (sous-forum td4/td5, index td4).
- Compteurs ordinateur (index et sous-forum, td 2 et 3) : la règle d'origine partagée avec `thead th` est découpée en deux règles (td, th) ; seule celle des td reçoit `var(--kr-font-detail)`, les en-têtes restent natifs.
- Sujet sur ordinateur : aucune règle d'origine ; nouvelle règle `@media (min-width: 768px)` (comme le ticket 5) pour l'auteur (`var(--kr-font-name)`) et la cartouche (`var(--kr-font-detail)`, rôle détail de la matrice, 14 natif auparavant). Sur ordinateur, les messages n'ont pas la classe `kr-msg` : sélecteur `li.media .user-info`.
- Boutons et pastilles hors périmètre : `.kd-contacts` (`<button>`, template l.6491) et `.kd-chip` (pastille, ticket 1) gardent leurs tailles de base (13 / 13 ordinateur, 14 / 15 mobile).
- `.kd-help` (texte d'aide) : texte courant, `var(--kr-font-body)` 14 ordinateur, `var(--kr-font-body-mobile)` 15 mobile.
- Nom de forum de l'index : 15 px, graisse 400 gardée (ticket 6.1, revue-manuelle l.89), à l'écart du « 15 px gras » de la matrice ; décision renvoyée à Arnaud (revue, constat 3).
- Conservés : bouton de date « posté » mobile 16 (bouton), fil d'Ariane du sujet (style en ligne 13), libellés génériques « Options »/« Signature » et libellés du nouveau kramail mobile (14/600 natifs), glyphe `kramail-dropdown-icon` 12, titres 24, icônes, `.forum-tags .glyphicon` 8, valeurs 0, corps des messages 16.
- Plancher « rien sous 12 à 375 » mesuré dans `#col-right` : le séparateur 10 px du pied de page est hors périmètre.
- Fixture synthétique créée : `tests/e2e/fixtures/typographie-forum-redaction.html` (rédaction de réponse).
- Nouveau kramail : le fragment ouvre le panneau des destinataires état par état (`ETAPES_KD` : repos, chargement retenu 1,2 s, annuaire, déjà ajouté, aucun résultat, erreur 500, blocage par « Envoyer » sans envoi) et mesure chaque `.kd-*` réécrit dans son état, sur mobile et ordinateur ; le contrôle miroir compare chaque état. Sur mobile, le pied réduit aux touches est masqué : `.kd-foot` y est mesuré dans l'état « aucun résultat ».

## Plan Change Log

- Kramail : `.kd-*` 12,5 → détail 13, 11 → étiquette 12 ; textarea de la rédaction mobile `15px !important` → `16px !important` (champ, anti-zoom).
- Routeur : nouveau mot-clé vers `typographie-formes` ; `form-control` et `panel-default` exclus des sélecteurs du fragment pour ne pas atteindre 4 suites citantes.
- Revue (constats 1 à 7) : `.kd-contacts` et `.kd-chip` rendus à leur taille de base ; `.kd-help` en texte courant ; compteurs et sujet sur ordinateur en jetons ; cartes de forum sous le média mobile ; mots-clés `forum-title`, `forum-description`, `forum-moderators`, `last-time` et `kd-(sec|warn|empty|foot|msg)` en classes exactes (`(?<![\w-])…(?![\w-])`) ; JSDoc du masque corrigée. Ajout hors constat : cartouche du sujet sur ordinateur en détail (matrice).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|------|----------|-------|---------|-------|----------|
| 1 | quick | kraland-theme.css:11458, 11426 | `.kd-contacts` (un `<button>`) passe 14 → 13 et `.kd-chip` (pastille) 15 → 13, alors que boutons et pastilles sont hors périmètre | medium | patch (fixed) | template l.6491 `el('button', 'kd-contacts')` ; 4.1 : `.kd-chip` non touché |
| 2 | quick | typographie-formes.mjs `PAGES_FORUM.nouveau` | Valeurs `.kd-*` du panneau d'annuaire jamais mesurées ; masque miroir non exercé | medium | patch (fixed) | `nouveau` sans `kramail: true`, panneau fermé |
| 3 | quick | matrice | Compteurs ordinateur à 14, auteur du sujet ordinateur à 14 natif, rôles testés sur mobile seulement ; nom de forum en graisse 400 | medium | patch (fixed: compteurs, auteur) / defer (graisse 400 : décision du ticket 6.1, à Arnaud) | rôles `'m'` seulement |
| 4 | quick | kraland-theme.css:11284, 11559 | `.kd-help` (texte d'aide) en détail 13 alors que le plan classe l'aide en texte courant | low | patch (fixed) | tableau de rôles du plan |
| 5 | quick | kraland-theme.css:8218-8300 | Règles `.forum-*` des cartes hors media query, jeton mobile posé en global (AGENTS.md) | low | patch (fixed) | bloc mobile fermé l.8143 |
| 6 | quick | tests/e2e/lib/router.mjs:150 | Mots-clés `forum-title`, `forum-description`, `last-time` trop larges | low | patch (fixed) | `forum-subforum-title`, `forum-description-wrapper` |
| 7 | quick | tests/e2e/lib/variantes.mjs JSDoc `ECHELLE_TICKET47` | Mentionne une règle CSS de `.permanent-topic-stats` qui n'existe pas | low | patch (fixed) | grep vide |

## Verification

**Commands:**
- `npm run build` ; `npm run test:zone -- typographie-formes forum sous-forum kramail` ; `npm run test:changed` ; `npm run test:router` ; `npm run lint:css` ; `npm run lint:js` -- 0 FAIL. (`test:all` : orchestrateur.)

**Résultats (base `d953969`, arbre non commité) :**
- `lint:css` exit 0 ; `lint:js` exit 0 (avertissement préexistant dans `report-non-lu.mjs`).
- `test:router` : 87 ok, routeur conforme ; contre-épreuves : mot-clé muté rouge ; mot-clé sans bornes (`forum-subforum-title`, `forum-description-wrapper` routés) rouge ; vert après restauration.
- Fragment `echelle-forum` : 300 ok / 0 FAIL ; sur le bundle de `d953969` (`KR_SCRIPT`) : 120 FAIL / 180 ok (noms 16, compteurs 12 mobile et 14 ordinateur, auteur et cartouche du sujet ordinateur 14, `.kd-*` 11 / 12,5 / 13, textarea 15, date kramail 12).
- Contre-épreuves sur copies mutées du bundle (`KR_SCRIPT`) : `.kd-chip` mobile remis au jeton détail → 2 FAIL (miroir, pastilles 13 au lieu de 15) ; `.kd-warn` mobile à 14 → 6 FAIL ; compteurs ordinateur sans jeton → 40 FAIL ; auteur du sujet ordinateur sans jeton → 12 FAIL.
- Après revue : `test:zone -- typographie-formes forum sous-forum kramail messages` : 3520 ok / 0 FAIL.
- Après revue : `test:changed` : 7292 ok / 0 FAIL, 23 suites.

## Result

Construit le 2026-10-24 sur `d953969`. Index, sous-forum, sujet, rédaction et kramail en jetons par rôle : noms 15, détails 13 (compteurs et cartouche compris sur ordinateur), texte courant 14 / 15, corps des messages à 16 gardé, rien sous 12 px dans `#col-right` sur mobile ; doublon mort du tableau mobile retiré ; cartes de forum déplacées sous le media mobile ; boutons et pastilles du kramail inchangés. Revue quick : 7 constats, corrigés (graisse 400 du nom de forum renvoyée à Arnaud). `npm run build` validé, `lint:css`/`lint:js` exit 0, `test:router` conforme, `npm run test:all` 7292 ok, 0 FAIL.
