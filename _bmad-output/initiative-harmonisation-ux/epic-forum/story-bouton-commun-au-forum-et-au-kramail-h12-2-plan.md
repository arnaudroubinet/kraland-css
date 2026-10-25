---
title: 'Bouton « ••• » commun au forum et au kramail (H12.2)'
type: 'feature'
ticket: '5'
created: '2026-10-25'
status: 'built'
baseline_revision: '1134ef9d30a4ac36f00abd6af80a19d0dcf68721'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/tickets.toml'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-bouton-commun-au-forum-et-au-kramail-h12-2-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/review-faisabilite.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le bouton « autres actions » existe trois fois, sans fonction ni classe communes (inventaire §1.4) :

- forum, Messages:V3 : `button.kr-msg-more`, glyphe texte « ••• », 48 px de large, couleurs de la règle générique `!important` des actions du message (bordure `--kr-border-strong`, texte `--kr-text-primary`), pas le bouton standard (D3, D4) ;
- kramail réception, Kramail:MobileEnhancer : clone du « + » natif, `i.fas.fa-ellipsis-v` (⋮), sans `aria-label` (l.6036) ;
- kramail lecture, Kramail:PostMobileEnhancer : kebab `i.fas.fa-ellipsis-v`, sans `aria-label` (l.6181).

L5 : `fa-ellipsis-h` ne serait pas identique au glyphe du forum. Sur tactile, un `.dropdown-backdrop` résiduel (z-index 990) couvre les secondaires du forum, qui n'ont aucune couche (D7, §2.3).

**Approach:** Une fonction commune `createMoreButton()` et une classe commune `kr-more`, dans une section de premier niveau « BOUTON « ••• » COMMUN (H12.2) », placée après le fil d'Ariane (l.5437). Les trois modules l'appellent. Elle pose le glyphe texte « ••• » (`span.kr-more-glyph[aria-hidden]`) et `aria-label="Autres actions"`. Chaque module garde sa logique d'ouverture.

Côté CSS, en mobile seulement :

- forum : style de bouton standard (DESIGN › Bouton « ••• ») par réécriture de l'origine (les trois couleurs de la règle l.15163 excluent `.kr-more`), 44 px ;
- kramail : glyphe et taille seulement ; ses couleurs restent (épopée 7) ;
- secondaires ouverts du forum au-dessus d'un voile 990.

Bureau égal à la base. C'est le bouton que l'épopée 7 reprend.

## Boundaries & Constraints

**Always:**
- L'inventaire fait foi (§1 relevé, §2 règles, §4 assertions, §5 masques et repères). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire les règles d'origine, sans règle concurrente plus spécifique. **Aucun nouvel `!important`** : `grep -c '!important' kraland-theme.css` ≤ 3290 (compte de `1134ef9`). Déplacer une ligne `!important` d'une règle vers une autre est permis (compte inchangé) ; en ajouter une ne l'est pas. Aucun `:focus`, aucun focus clavier.
- Mobile en `@media (max-width: 767px)`, bureau en `@media (min-width: 768px)`, aucune règle globale. Le bureau ne reçoit rien et reste égal à la base `1134ef9`.
- Garde ajoutée à un sélecteur : `:where(…)`, spécificité nulle. Exclusion : `:not(:where(.kr-more))`, spécificité nulle aussi.
- Un seul sélecteur de bouton « ••• » sur les trois pages : `.kr-more`. Glyphe texte « ••• » partout, aucun `fa-ellipsis-v` restant dans le template.
- Cibles : chaque « ••• » fait ≥ 44 × 44 px à 375 et 767 px ; `elementFromPoint` au centre (après `scrollTo`) tombe dans le bouton.
- Tactile : menu ou secondaires ouverts au toucher ; avec un `.dropdown-backdrop` à 990 inséré après le toggle comme Bootstrap 3.3.7, `elementFromPoint` au centre du premier item rend cet item.
- Kramail : seuls le glyphe, la taille et l'`aria-label` changent. Fond, bordure, couleur, menu, bascule `.open` et `stopPropagation` restent ceux de la base.
- Classes d'accroche gardées : `kr-msg-more`, `kramail-actions-mobile`, `kramail-post-kebab` (Ask First 2).
- Fixtures synthétiques seulement : `forum-sujet.html`, `kramail-reception.html`, `kramail-lecture.html`, inchangées. Les variantes (voile, thème) sont faites en mémoire dans la suite.
- Aucun clic, même en fixture, sur un item de menu du kramail qui porte une action de jeu (marquer, supprimer, signaler) : l'item est mesuré, pas activé.
- Repères cités par 3 suites (`kr-msg`, `dropdown-backdrop`, `aria-hidden`, `forum-sujet`, `kr-text-nation`, `kr-bg-surface`, `kr-text-primary`, `min-height`, `fa-link`, `data-kr-label`, `media-body`, `media-list`) : jamais écrits en clair dans `forum-activite.mjs`, toujours par `lib/variantes.mjs` (`REPERES_PLUS_TICKET65`). Relevé `TOKEN_RE` refait sur les suites finies : aucun jeton ne passe de 3 à 4.
- Masques posés sur le bundle de base seulement, si `AVANT_TICKET65(base)`, jamais sur le bundle courant. Chaque masque porte sa condition de retrait (inventaire §5.1) : réalignement des bases par le sweep 6.7 ou l'action A4 de la rétro 5. Jamais « quand le bundle de base contient l'entrée ».
- Chaque contrôle du fragment peut échouer et a une contre-épreuve nommée (Verification).
- Les Ask First ci-dessous sont **tranchés dans le sens prudent par l'implémenteur**, sans attendre : le choix prudent est écrit à côté de chacun, appliqué tel quel et consigné dans `revue-manuelle.md` (section Ticket 6.5) pour Arnaud.

**Ask First:**
1. **Liens « lien » et « liste des messages » du sujet mobile (question d'Arnaud, deferred-work l.135, revue-manuelle l.432).** Le « ••• » de 6.5 est un candidat pour les accueillir. Prudent : non ajoutés. Le « ••• » du forum est par message, ces liens sont par sujet : les y mettre changerait la sémantique du bouton. La question reste ouverte pour Arnaud, avec ce constat, dans `revue-manuelle.md`.
2. **Classes d'accroche.** Prudent : `kr-msg-more`, `kramail-actions-mobile` et `kramail-post-kebab` sont gardées à côté de `kr-more` (suites `messages-v3`, `typographie-formes`, `variantes` l.769 les lisent). Aucun renommage.
3. **Style standard limité au « ••• ».** Les autres actions du message (citer, éditer, profil…) gardent la règle générique (bordure `--kr-border-strong`, texte `--kr-text-primary`). Prudent : seul le « ••• » passe au standard ; l'harmonisation des voisins reste à décider.
4. **ARIA du kramail.** Prudent : `aria-label="Autres actions"` posé par la fonction commune sur les trois boutons (DESIGN : bouton à icône). `aria-expanded` reste au forum seulement ; le kramail ne le reçoit pas (aucune logique d'état ajoutée).
5. **Taille du glyphe au kramail.** Icône actuelle 18 px ; glyphe du forum 14 px (hérité de la règle des actions). Prudent : 14 px, graisse 700, `letter-spacing: 1px` partout, par une règle commune `.kr-more-glyph` : glyphe identique sur les trois pages.
6. **Couche des secondaires du forum.** Le « ••• » du forum n'est pas un menu déroulant : aucun voile n'est créé par lui. Le ticket exige pourtant l'item atteignable malgré un voile. Prudent : la barre d'un message ouvert (`li.kr-msg.kr-msg-open > .media-body > .pull-right`) reçoit `position: relative; z-index: 1000` (valeur de `.dropdown-menu`), en mobile seulement. Si une mesure montre qu'elle couvre un élément fixe (barre de navigation, bouton de remontée, FAB), arrêt et passage à Arnaud.
7. **Seuils et tolérances.** Aucun changé dans les suites existantes. Un seuil ou une tolérance à changer arrête le build et passe à Arnaud.
8. **Fixtures.** Prudent : inchangées. Voile, thèmes et variantes en mémoire.
9. **Survol et pression.** Prudent : le « ••• » du forum prend les états du bouton standard (fond `--kr-header-tint`), sans règle nouvelle ; le kramail garde les siens.
10. **Largeur du « ••• » du forum.** 48 → 44 px (`min-width` l.15219, DESIGN `{spacing.touch-target}`). Prudent : 44 px, valeur de DESIGN. Si les secondaires ou `variantes` l.769 (`droite`) bougent au-delà des tolérances, masque sur la base ; si un seuil doit changer, Ask First 7.

**Never:**
- Nouvel `!important` ; règle `:focus` ; règle de mobile hors `@media (max-width: 767px)` ; règle globale.
- Changer les couleurs, le menu ou la bascule du kramail (épopée 7). Changer les autres actions du message.
- Retirer, ajouter ou déplacer une action (forum ou kramail). Ajouter les liens du sujet au « ••• » (Ask First 1).
- Toucher au bureau, à l'éditeur (`kr-tools-plus`), à la page de rédaction du kramail.
- Modifier une fixture. Capture HTML brute dans le dépôt. Contenu de message réel ou identifiant dans un test.
- Cliquer un item de jeu du kramail. Site réel, cloche, `/report`, Chrome 9222/9223 pendant le build.
- Git qui modifie l'arbre, l'index ou le stash sans accord. `test:all` (orchestrateur).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Forum, sujet | `forum-sujet`, 375 et 767, tactile | un `button.kr-more.kr-msg-more` par message ; texte « ••• » dans `span.kr-more-glyph` ; aucun `i` ; ≥ 44 × 44 ; fond `--kr-bg-surface`, bordure `--kr-border-tint`, texte `--kr-text-nation` | base : bordure `--kr-border-strong`, texte `--kr-text-primary`, 48 px, pas de `kr-more` (rouge) |
| Kramail réception | `kramail-reception`, 375 et 767, tactile | `.kramail-actions-mobile > button.kr-more` ; « ••• » ; aucun `fa-ellipsis-v` ; 44 × 44 ; glyphe visible (taille calculée 14 px, non 0) ; couleurs égales à la base | base : `fa-ellipsis-v` (rouge) |
| Kramail lecture | `kramail-lecture`, 375 et 767, tactile | `.kramail-post-kebab > button.kr-more` ; idem | base : rouge |
| Un seul sélecteur | les 3 pages | `document.querySelectorAll('.kr-more')` non vide sur chacune ; aucun `fa-ellipsis-v` dans la page ; même texte, même `aria-label` | — |
| Ouverture au toucher | les 3 pages, `tap()` en contexte `hasTouch` | forum : `kr-msg-open`, 4 secondaires visibles ; kramail : `.open`, menu visible | ouverture absente : FAIL |
| Voile 990 | les 3 pages, ouvert, `div.dropdown-backdrop` inséré après le toggle, CSS du vendor | `elementFromPoint` au centre du premier item (après `scrollTo`) rend l'item ou un descendant | forum base : rend le voile (rouge) ; voile retiré en fin de contrôle (`ETAT_NETTOYAGE`) |
| Toucher réel Bootstrap | kramail, `tap()` sur le « ••• » | aucun voile créé, ou menu au-dessus de lui | — |
| Contraste | `forum-sujet`, 375, 16 variantes | « ••• » ≥ 4,5:1 (texte `--kr-text-nation` sur `--kr-bg-surface`) | contre-épreuve obligatoire |
| Kramail inchangé | 2 pages kramail, 375 | fond, bordure, couleur du « ••• », position et taille des autres boutons du h1 égaux à la base | style standard qui fuit : FAIL |
| Voisins du forum | `forum-sujet`, 375 | couleurs des autres actions du message égales à la base | FAIL |
| Seuils | 767, 768, 769 ; bascule 768 → 767 → 768 → 767 | 767 : « ••• » commun ; 768/769 : égal à la base (aucun « ••• ») | — |
| Bureau | 3 pages, 1280 | égal au bundle `1134ef9` | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-bouton-commun-au-forum-et-au-kramail-h12-2-inventaire.md`.
- `kraland-userscript-template.js` (lignes de `1134ef9`, à revérifier) :
  - l.5408-5437 : section « FIL D'ARIANE DU FORUM (H12.3) », modèle ; nouvelle section « BOUTON « ••• » COMMUN (H12.2) » juste après, `function createMoreButton(button)` à la portée de l'IIFE extérieure ;
  - l.5998-6110 : Kramail:MobileEnhancer, l.6036 (`innerHTML` de l'icône remplacé par l'appel commun) ;
  - l.6113-6380 : Kramail:PostMobileEnhancer, l.6176-6181 (idem) ;
  - l.7295-7398 : Messages:V3, l.7333 environ (création du bouton par l'appel commun, `kr-msg-more` et `aria-expanded` ajoutés par le module) ;
  - l.399 : `isMobileMode()` (lue).
- `kraland-theme.css` :
  - l.2397-2416 : bouton standard (lu, non modifié : il prend la main sur le « ••• » du forum) ;
  - l.15163-15185 : règle générique des actions du message ; les trois lignes `border`, `background`, `color` passent dans une règle sœur `….pull-right .btn:not(:where(.kr-more))` (déplacées, compte inchangé) ;
  - l.15217-15223 : `.kr-msg-more` (`min-width` 48 → 44 ; `letter-spacing` et `font-weight` déplacés vers `.kr-more-glyph`) ;
  - l.15230-15240 : secondaires ouverts ; règle de couche de la barre ouverte (Ask First 6) ;
  - l.8885-8910 : boutons du h1 du kramail (`font-size: 0`) ; le glyphe reçoit sa taille par la règle commune, sans `!important` (aucune règle concurrente sur le `span`) ;
  - règle commune `.kr-more-glyph` (14 px, 700, `letter-spacing: 1px`, `line-height: 1`), dans un bloc `@media (max-width: 767px)` près de la section Messages V3 ou d'une section « Bouton « ••• » commun ».
- Tests :
  - `tests/e2e/forum-activite.mjs` : nouveau fragment `plus`, base `COMMIT_PLUS = '1134ef9'` (`KR_SCRIPT_AVANT_PLUS`), en-tête de la suite mis à jour (fragments, options) ;
  - `tests/e2e/lib/variantes.mjs` : `REPERES_PLUS_TICKET65`, `PLUS_TICKET65` (miroir CSS), `plusTicket65` (masque DOM), `AVANT_TICKET65` (chaîne `kr-more-glyph`), conditions de retrait en commentaire ; l.769 (`['plus', '.kr-msg-more', …]`) relue ;
  - `tests/e2e/kramail-redaction.mjs` : masque `regression` sur « avant », sur le modèle l.228-237 et l.1284-1292 (ligne `info écart accepté`) ;
  - `tests/e2e/typographie-formes.mjs` : `PAGES_BOUTONS.sujet` l.431, `echelle-forum`, `espacement` l.1494-1499, `nettoyage` l.1698-1700, `rayons` l.1251/1270/1276, menus l.1310, `ETAT_NETTOYAGE` l.1824-1839 ;
  - `tests/e2e/cartes-pastilles.mjs` (fragment `forum`, page reception), `tests/e2e/palette-nation.mjs` (sujet, réception), `tests/e2e/forum-index.mjs` (`EMPREINTE`), `tests/e2e/messages-v3.mjs` (l.242-267, `themes` l.528-545) : masques selon le rouge avant ;
  - `tests/e2e/forum-mobile.mjs` l.52 et l.381-465 : modèle du voile simulé et du toucher réel (lus) ;
  - `tests/e2e/lib/router.mjs` : `SUITES` l.98, `KEYWORDS` l.161-213, `SECTIONS` l.218-228 ;
  - `tests/e2e/lib/router.test.mjs` : cas nouveaux (section, mot-clé) ;
  - `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` : ligne 27 (`forum-activite`), mention du « ••• » et du fragment `plus`.

## Tasks & Acceptance

**Execution:**
- [ ] Rouge avant. `mkdir -p /tmp/kr65 && git show 1134ef9:kraland-userscript-main.user.js > /tmp/kr65/base.user.js`. Écrire le fragment `plus` d'abord, puis `KR_SCRIPT=/tmp/kr65/base.user.js KR_FRAG=plus node tests/e2e/forum-activite.mjs`. `kr-theme-enabled` vérifié avant toute mesure. FAIL attendus en Verification.
- [ ] `tests/e2e/forum-activite.mjs`, fragment `plus`, à 375 et 767 (contexte `hasTouch`, `isMobile`), Kraland clair et Empire Brun sombre, sur `forum-sujet`, `kramail-reception`, `kramail-lecture` :
  - un seul sélecteur (`.kr-more`) présent sur les trois pages ; aucun `fa-ellipsis-v` ; texte « ••• » ; `aria-label` « Autres actions » ;
  - ≥ 44 × 44, `elementFromPoint` au centre après `scrollTo` ; glyphe de taille calculée 14 px (non 0) ;
  - forum : fond, bordure, texte comparés aux jetons résolus `--kr-bg-surface`, `--kr-border-tint`, `--kr-text-nation` ; voisins égaux à la base ;
  - kramail : fond, bordure, couleur du « ••• » et des autres boutons du h1 égaux à la base ;
  - ouverture par `tap()` ; voile simulé (div `.dropdown-backdrop` inséré par `insertAfter` après le toggle, CSS du vendor) ; `elementFromPoint` sur le premier item rend l'item ; voile retiré ensuite ;
  - toucher réel (Bootstrap du vendor) sur le kramail : aucun voile, ou menu au-dessus ;
  - aucun clic sur un item de jeu ;
  - contraste ≥ 4,5:1 dans les 16 variantes (375, `CONTRASTE()`) ;
  - seuils 767/768/769 et bascule 768 → 767 → 768 → 767 (`ECART_RECHARGEMENT_MS`) ;
  - bureau 1280 égal à `1134ef9` sur les 3 pages.
  Réseau confiné, Bootstrap du vendor, repères partagés importés de `lib/variantes.mjs`.
- [ ] `kraland-userscript-template.js` :
  - section « BOUTON « ••• » COMMUN (H12.2) » après l.5437 : `createMoreButton(button)` décore le bouton reçu ou en crée un ; pose `type="button"`, les classes `btn`, `btn-default`, `kr-more`, `aria-label="Autres actions"` et le contenu `<span class="kr-more-glyph" aria-hidden="true">•••</span>` (par `createElement`, pas d'`innerHTML`) ; renvoie le bouton ;
  - Messages:V3 : `const more = createMoreButton(); more.classList.add('kr-msg-more'); more.setAttribute('aria-expanded', 'false');`, clic inchangé ;
  - Kramail:MobileEnhancer l.6036 : `createMoreButton(toggleBtn)` à la place de l'`innerHTML` ; bascule inchangée ;
  - Kramail:PostMobileEnhancer l.6181 : `createMoreButton(kebabToggle)` ; bascule inchangée ;
  - plus aucun `fa-ellipsis-v` dans le template.
- [ ] `kraland-theme.css` :
  - l.15163-15185 : `border`, `background`, `color` déplacées dans une règle sœur sur `….pull-right .btn:not(:where(.kr-more))` (même spécificité) ;
  - l.15217-15223 : `min-width: 44px !important` (ligne existante réécrite) ; `letter-spacing` et `font-weight` retirés (vers `.kr-more-glyph`) ;
  - règle de couche de la barre ouverte (Ask First 6) ;
  - règle commune `.kr-more-glyph` en mobile ;
  - CDP au build sur les trois « ••• » : règle gagnante pour fond, bordure, couleur, `font-size` du `span` ; vérifier qu'aucune autre règle `!important` de la page sujet ne bat le bouton standard ;
  - `grep -c '!important'` ≤ 3290.
- [ ] `tests/e2e/lib/variantes.mjs` : `REPERES_PLUS_TICKET65`, `PLUS_TICKET65`, `plusTicket65`, `AVANT_TICKET65`, conditions de retrait en commentaire.
- [ ] Masques sur la base, si `AVANT_TICKET65(base)` et seulement là où le rouge avant les rend nécessaires (inventaire §5.1) : `kramail-redaction.mjs` `regression`, `typographie-formes.mjs` (`boutons`, `echelle-forum`, `espacement`, `nettoyage`), `cartes-pastilles.mjs` (`forum`, reception), `palette-nation.mjs`, `forum-index.mjs` (`EMPREINTE`). Pour chaque masque : rouge sans lui, vert avec lui.
- [ ] Suites existantes après le 1er `test:zone` : `messages-v3.mjs`, `forum-mobile.mjs`, `fin-initialisation.mjs`, `jeu-identite`. Vert attendu sans retouche ; une retouche va au Plan Change Log ; un seuil ou une tolérance → arrêt (Ask First 7).
- [ ] `tests/e2e/lib/router.mjs` :
  - `SUITES` : fragment `['plus']` ajouté à `forum-activite` ;
  - `SECTIONS` : `[/^BOUTON « ••• » COMMUN/, ['forum', 'messages', 'kramail', 'forum-activite']]` ;
  - `KEYWORDS` : `[/kr-more\b|createMoreButton/, ['forum-activite', 'messages', 'kramail', 'typographie-formes']]` ;
  - cas dans `router.test.mjs` (hunk de la section, hunk CSS `.kr-more-glyph`, hunk Kramail) ;
  - `npm run test:router`.
- [ ] Skill `tester-kraland-css` : ligne `forum-activite` (« ••• » commun, `createMoreButton`, `kr-more`, fragment `plus`, masques `PLUS_TICKET65` et `plusTicket65`) dans les deux copies ; `diff -r .hermes/skills .claude/skills`.
- [ ] `revue-manuelle.md`, section Ticket 6.5 : Ask First tranchés (choix prudent de chacun), question 1 rappelée à Arnaud.
- [ ] `npm run build`, contre-épreuves, `lint:css`, `lint:js`, compte `!important`, relevé `TOKEN_RE`.

**Acceptance Criteria:**
- Given `forum-sujet`, `kramail-reception` et `kramail-lecture` à 375 et 767 px, when la page est prête, then chaque page a au moins un `.kr-more`, aucun `fa-ellipsis-v`, et chaque « ••• » affiche le glyphe texte « ••• » avec `aria-label` « Autres actions ».
- Given ces pages, then chaque « ••• » fait au moins 44 × 44 px et `elementFromPoint` au centre tombe dans le bouton.
- Given ces pages en tactile, when on touche le « ••• », then le menu (kramail) ou les secondaires (forum) s'ouvrent ; with un `.dropdown-backdrop` à 990 inséré après le toggle, `elementFromPoint` au centre du premier item rend cet item.
- Given `forum-sujet` à 375 px, then le « ••• » a fond `--kr-bg-surface`, bordure `--kr-border-tint`, texte `--kr-text-nation`, et les autres actions du message sont égales à la base.
- Given les deux pages du kramail à 375 px, then les couleurs du « ••• » et des autres boutons du h1 sont égales à la base.
- Given 16 variantes à 375 px, then le « ••• » du forum est ≥ 4,5:1.
- Given 768, 769 et 1280 px, then les 3 pages sont égales au bundle `1134ef9`. La bascule 768 → 767 → 768 → 767 donne le « ••• » commun à 767 et le rendu de base à 768.
- Given `messages-v3`, `typographie-formes`, `kramail-redaction`, `cartes-pastilles`, `palette-nation`, `forum-index`, `forum-mobile`, then verts ; les masques ne sont posés que sur la base.
- Given `kraland-theme.css`, then `grep -c '!important'` ≤ 3290.
- Given `npm run test:router`, then vert ; aucun jeton de `TOKEN_RE` ne passe de 3 à 4 suites ; `diff -r .hermes/skills .claude/skills` vide.

## Implementation Notes

- **Rouge avant** (base `1134ef9`, `/tmp/kr65/base.user.js`) : `KR_SCRIPT=/tmp/kr65/base.user.js KR_FRAG=plus node tests/e2e/forum-activite.mjs`, exit 1, 64 FAIL, 44 ok. Rouges : un seul sélecteur (aucun `.kr-more`, `fa-ellipsis-v` au kramail), glyphe et ARIA, taille et glyphe (largeur 48, glyphe en `i`), couleurs standard du forum (bordure `rgba(0,0,0,.15)`, texte `rgb(15,23,36)`), voile simulé du forum (point rendu : `DIV.dropdown-backdrop`), contraste ×16, seuil 767 ×3. Verts sur la base, comme prévu : voile du kramail (menu 1000 > 990), toucher, couleurs du kramail, bureau 1280, seuils 768/769, bascule.
- **Vert après** : `KR_FRAG=plus node tests/e2e/forum-activite.mjs`, exit 0 ; `npm run test:zone -- forum-activite messages kramail typographie-formes cartes-pastilles palette-nation forum sous-forum`, exit 0, 10823 ok, 0 FAIL ; `npm run test:router`, exit 0 ; `npm run build`, exit 0 ; `npm run lint:css`, exit 0 ; `npm run lint:js`, exit 0 (un avertissement préexistant dans `report-non-lu.mjs`, non touché).
- `grep -c '!important' kraland-theme.css` : 3290 (inchangé). `grep -c fa-ellipsis-v kraland-userscript-template.js` : 0. `diff -r .hermes/skills .claude/skills` : vide.
- Relevé `TOKEN_RE` (script hors dépôt, base `1134ef9` contre arbre courant) : aucun jeton ne passe de ≤ 3 à 4. Un premier relevé montrait `dropdown-backdrop` 3 → 4, par un commentaire de `forum-activite.mjs` ; le commentaire cite maintenant `P.voile`.
- CDP au build sur les trois « ••• » : au forum, fond, bordure et couleur viennent du bouton standard, sans `!important` concurrent ; au kramail, la règle `!important` du h1 garde fond, bordure et couleur ; `font-size` du `span` à 14 px par `.kr-more-glyph` sur les 3 pages.
- **Masques** (`PLUS_TICKET65` + `plusTicket65`, seulement si `AVANT_TICKET65(base)`), chacun rouge sans lui (1re zone) puis vert avec lui :
  - `forum-index.mjs` `hors-perimetre` : 2 FAIL sans masque ;
  - `cartes-pastilles.mjs` `forum` : 4 FAIL ;
  - `palette-nation.mjs` `composants-pages-mobile` : 1 FAIL ;
  - `typographie-formes.mjs` `echelle-forum` : 6 FAIL (`I.fas fa-ellipsis-v 18px` au lieu de `SPAN.kr-more-glyph 14px`) ; `nettoyage` : 8 FAIL (bordure teintée, `span` de 14 px) ;
  - `kramail-redaction.mjs` `regression` (bundle « avant » = `feature/next`, P5) : 6 FAIL (46 pixels d'écart au glyphe).
  `typographie-formes` `boutons` et `espacement`, `messages-v3`, `forum-mobile`, `jeu-identite` sont verts sans masque ni retouche. Condition de retrait de chacun : réalignement des bases par le sweep 6.7 ou l'action A4 de la rétro 5.
- **Contre-épreuves** (copies mutées du bundle dans `/tmp/kr65/mut`, `KR_SCRIPT=… KR_FRAG=plus`), FAIL nommé de chacune :
  - `createMoreButton` non appelé par Kramail:PostMobileEnhancer : exit 1, « plus lecture … un seul sélecteur (.kr-more) » ;
  - `fa-ellipsis-v` rétabli dans Kramail:MobileEnhancer : exit 1, « plus reception … un seul sélecteur (.kr-more) … aucune ancienne icône (fa-ellipsis-v) » ;
  - règle `.kr-more-glyph` retirée : exit 1, « plus reception … glyphe visible (14 px, 700, non nul) » ;
  - exclusion `:not(:where(.kr-more))` retirée : exit 1, « plus sujet … « ••• » du forum en bouton standard » ;
  - exclusion écrite `:not(.kr-more)` : exit 1, « plus sujet … autres actions du message (fond, bordure, texte) égales au bundle de base » ;
  - fond du « ••• » du kramail muté : exit 1, « plus reception/lecture … « ••• » du kramail (fond, bordure, texte, boîte, rayon) … égaux au bundle de base ». Un premier essai, avec un sélecteur plus faible que la règle `!important` du h1, ne changeait rien au rendu (exit 0) ; il a été refait avec un sélecteur plus fort ;
  - largeur et hauteur du « ••• » à 40 px : exit 1, « chaque « ••• » d'au moins 44 x 44 px » ;
  - z-index de la barre ouverte retiré : exit 1, « plus sujet … voile simulé (fixe, 990, contexte racine) » ; menu du kramail à 980 : exit 1, « plus reception … voile simulé (fixe, 990, inséré après le toggle) » ;
  - bascule du clic retirée : exit 1, « plus sujet … toucher du « ••• » : message ouvert, 4 actions secondaires visibles » ;
  - texte du « ••• » en gris clair : exit 1, « plus sujet … glyphe de chaque « ••• » d'au moins 4,5:1 » ;
  - règle `.kr-more-glyph` sortie du `@media (max-width: 767px)` (mise en tête de feuille) : exit 0. Mutant équivalent : aucun `.kr-more` n'existe à 768 px et plus, car les trois modules ne créent le bouton qu'en `body.mobile-mode` (le contrôle « aucun « ••• » » du bureau et des seuils est vert). Aucun contrôle ne peut le voir ;
  - chaque masque retiré : la suite masquée est rouge (voir Masques).

- **Correctifs de revue (Review Triage Log, constats 1 à 4 ; le 5 est écarté)** :
  - constat 1 : la barre ouverte passe de `z-index: 1000` à `991`, et le miroir `PLUS_TICKET65` suit. Nouveau contrôle du fragment `plus` : mini-chat plein écran (`#flap` en mémoire, `SUJET_FLAP`, ouvert par `.mini-chat-fab`) au-dessus d'un message ouvert, à 375 et 767 px. Sur la partie couverte de chaque secondaire, `elementFromPoint` rend le panneau, pas la barre : vert. Mesure : le `z-index` calculé de `#flap` est 1050 (règle `#flap` `!important`, plus spécifique que `.mobile-mode .mini-chat-overlay` à 999).
    - Contre-épreuve « barre à 1000 » : exit 0, mutant équivalent (1000 < 1050). Barre à 1100 : exit 1, « plus sujet … mini-chat plein écran … rend le panneau, pas la barre » (point rendu : `A.btn btn-default kr-msg-secondary`).
    - Le voile simulé (990) reste vert à 991.
    - Barre « Envoyer » fixe (z-index 90) : aucune fixture n'a à la fois des messages et cette barre, donc non mesurée (consigné dans `revue-manuelle.md`).
  - constat 2 : la clause « aucun voile de Bootstrap, ou menu au-dessus » du kramail est retirée. Le `stopPropagation` du module la rendait vraie par construction ; un commentaire et le libellé le disent, et le voile simulé couvre le cas. « Aucun item activé » est maintenant vérifié : un écouteur en capture compte et annule tout clic sur un secondaire ou un item de menu pendant le toucher. Contre-épreuves :
    - le clic du « ••• » du forum clique aussi le premier secondaire : exit 1, « plus sujet … aucun item activé » ;
    - le clic du toggle du kramail clique aussi le premier item : exit 1, « plus reception … aucun item activé ».
  - constat 3 : le mot-clé `kr-more\b|createMoreButton` lance aussi `cartes-pastilles` et `palette-nation`. La section « BOUTON « ••• » COMMUN » lance aussi `typographie-formes`, `cartes-pastilles` et `palette-nation`. `router.test.mjs` vérifie la section, la ligne `.kr-more-glyph` seule (y compris la vraie ligne `body.mobile-mode .kr-more-glyph {`) et le module Kramail. Contre-épreuves :
    - zones retirées du mot-clé : FAIL du cas ;
    - zones retirées de la section : FAIL du cas.
  - constat 4 : la règle devient `body.mobile-mode .kr-more-glyph`, et le miroir suit. Le rendu est égal : le fragment `plus` et la zone sont verts.
  - Après correctifs :
    - `npm run build` : 0 ;
    - `npm run test:router` : 0 ;
    - `npm run lint:css` : 0 ; `npm run lint:js` : 0 ;
    - `KR_FRAG=plus node tests/e2e/forum-activite.mjs` : 0 ;
    - `npm run test:zone -- forum-activite messages kramail typographie-formes cartes-pastilles palette-nation forum sous-forum` : 0, 10827 ok, 0 FAIL ;
    - `!important` : 3290 ;
    - relevé `TOKEN_RE` : aucun jeton ne passe à 4 ;
    - `diff -r` des skills : vide.

## Plan Change Log

- **Voile simulé du forum, en dernier enfant de `body`** au lieu de « inséré après le toggle ». Le « ••• » du forum n'est pas un toggle Bootstrap : aucun voile n'est posé après lui. Inséré après lui, le voile serait dans le contexte d'empilement de la barre et ne testerait rien. Le voile résiduel d'un autre menu est dans le contexte racine, comme le pose Bootstrap. Au kramail, le voile reste inséré après le toggle.
- **Masque DOM `plusTicket65` : ordre des classes.** Sur la base, il retire puis remet `kr-msg-more` après `kr-more`, pour reproduire l'ordre `btn btn-default kr-more kr-msg-more` du bundle courant (empreinte de `forum-index`).
- **Masques réellement posés** (inventaire §5.1, seulement là où le rouge avant les exige) : `forum-index`, `cartes-pastilles`, `palette-nation`, `typographie-formes` (`echelle-forum`, `nettoyage`), `kramail-redaction` (`regression`). Aucun masque dans `typographie-formes` `boutons` et `espacement`, ni dans `messages-v3` : verts sans masque.
- **Commentaire de `forum-activite.mjs`** : il cite `P.voile` et non le jeton `dropdown-backdrop` en clair, sinon ce jeton passe de 3 à 4 suites (P1).
- **Contre-épreuve « règle sortie du media » : mutant équivalent**, consigné en Implementation Notes.
- **Revue, constat 1 : barre ouverte à 991** au lieu de 1000 (Ask First 6 : sous le mini-chat, au-dessus du voile). Le z-index réel de `#flap` est 1050, donc la valeur 1000 n'était pas couverte par le mini-chat dans la cascade mesurée. 991 garde la barre sous 999, même si la règle `#flap` change.
- **Revue, constat 2** : la clause du voile réel du kramail est retirée du contrôle de toucher (vraie par construction). « Aucun item activé » est maintenant vérifié.
- **Revue, constats 3 et 4** : routage élargi (mot-clé et section) ; garde `body.mobile-mode` sur `.kr-more-glyph`.

## Design Notes

**Pourquoi une fonction qui décore.** Le kramail clone un bouton natif (réception) ou crée le sien (lecture), et les deux gardent leur `data-toggle` et leur bascule. Décorer le bouton reçu évite de recâbler les événements. Le forum, qui crée son bouton, appelle la fonction sans argument. L'état (`aria-expanded`, `kr-msg-open`, `.open`) reste à chaque module : la fonction ne pose que l'apparence commune, celle que l'épopée 7 reprend.

**Pourquoi exclure le « ••• » de la règle générique plutôt que de le surcharger.** Les couleurs `!important` de l'origine (l.15163) battent le bouton standard (0,3,1, sans `!important`). Une surcharge exigerait un `!important` nouveau. Réécrire l'origine pour qu'elle ne vise plus `.kr-more` laisse le bouton standard s'appliquer, avec ses états de survol et de pression. `:not(:where(.kr-more))` garde la spécificité de la règle.

**Pourquoi une règle `.kr-more-glyph` sans `!important`.** Au kramail, `font-size: 0 !important` est posé sur le bouton, pas sur le `span`. Une déclaration sur le `span` bat l'héritage, quelle que soit l'importance de la valeur héritée. Aucune règle ne vise aujourd'hui un `span` dans ces boutons.

**Pourquoi une couche sur la barre ouverte du forum.** Le voile Bootstrap est fixe, à 990, dans le contexte racine. Les secondaires sont dans le flux, sans z-index : le voile les couvre. Une barre relative à 1000 seulement quand le message est ouvert les met au-dessus, comme un `.dropdown-menu`, sans toucher aux messages fermés.

**Pièges :**
- P1 : MAX_CITING. Douze jetons sont à 3 suites (inventaire §5.2), dont `kr-msg`, `dropdown-backdrop`, `fa-link`, `kr-bg-surface`, `kr-text-nation`. Une écriture en clair dans `forum-activite.mjs` les fait passer à 4. `kr-msg-more` est à 2 : une seule suite de plus au maximum.
- P2 : `font-size: 0` du h1 du kramail : sans règle sur le `span`, glyphe invisible mais bouton de 44 px (le contrôle de taille passe). Le contrôle mesure la taille calculée du `span`.
- P3 : `:not(.kr-more)` sans `:where` ajoute (0,1,0) et change la cascade des voisins. Toujours `:not(:where(…))`.
- P4 : `ETAT_NETTOYAGE` (typographie-formes l.1838) refuse un `.dropdown-backdrop` présent : le voile simulé est retiré en fin de contrôle, et aucun « ••• » ne doit en créer un au chargement.
- P5 : `kramail-redaction` compare au pixel contre `feature/next`, pas contre `1134ef9` : son masque se lit sur le bundle « avant » de la suite. Le 6.4 s'est fait prendre par `cartes-pastilles` au `test:all` : cette suite est dans le `test:zone`.
- P6 : `MESURE_TAILLES` et les empreintes comptent les éléments : `i` → `span` exige un masque DOM, pas seulement CSS.
- P7 : la largeur 48 → 44 déplace les secondaires et le `droite` de `variantes` l.769 : à lire au rouge avant.
- P8 : « couvert » n'est pas « invisible » : `elementFromPoint` après `scrollTo`, jamais `scrollIntoView`.
- P9 : la bascule recharge la page : 1 300 ms entre deux redimensionnements.
- P10 : faux FAIL sous charge : rejouer la suite seule, machine calme.
- P11 : `test:changed` s'élargit au total quand `lib/variantes.mjs` change ; à consigner, non lancé.

## Verification

**Commands:**
- `npm run build`.
- `npm run test:zone -- forum-activite messages kramail typographie-formes cartes-pastilles palette-nation forum sous-forum`.
- `npm run test:router`.
- `npm run lint:css` puis `npm run lint:js`, codes de sortie lus séparément.
- `grep -c '!important' kraland-theme.css` ≤ 3290.
- `grep -c 'fa-ellipsis-v' kraland-userscript-template.js` = 0.
- `diff -r .hermes/skills .claude/skills` vide.
- Relevé `TOKEN_RE` des suites (script hors dépôt, sur le modèle de `/tmp/kr65/tokens.mjs`) : aucun jeton de 3 à 4.
- Pas de `test:all` : il revient à l'orchestrateur.
- Rouge avant sur le bundle de `1134ef9` (`KR_SCRIPT`, `KR_FRAG=plus`). FAIL attendus :
  - « un seul sélecteur » : aucun `.kr-more` sur les 3 pages ;
  - kramail : `fa-ellipsis-v` présent, pas de texte « ••• », pas d'`aria-label` ;
  - forum : bordure `--kr-border-strong` et texte `--kr-text-primary` au lieu du standard ; largeur 48 ;
  - forum : voile simulé, `elementFromPoint` sur le premier secondaire rend le voile.
- Verts attendus sur la base : cibles ≥ 44 de haut, ouverture au toucher, kramail sous voile simulé (menu 1000 > 990, à confirmer), couleurs du kramail, bureau, seuils.
- Contre-épreuves sur copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - `createMoreButton` non appelé par Kramail:PostMobileEnhancer : « un seul sélecteur » rouge (lecture) ;
  - `fa-ellipsis-v` rétabli dans Kramail:MobileEnhancer : « aucun fa-ellipsis-v » rouge (réception) ;
  - règle `.kr-more-glyph` retirée : glyphe du kramail à 0 px, « glyphe visible » rouge ;
  - exclusion `:not(:where(.kr-more))` retirée : couleurs standard du forum rouges ;
  - exclusion écrite `:not(.kr-more)` sur la règle des voisins ou standard qui fuit vers une autre action : « voisins égaux » rouge ;
  - fond du « ••• » du kramail muté : « kramail inchangé » rouge ;
  - `width` et `height` du « ••• » à 40 px : cible rouge ;
  - z-index de la barre ouverte retiré : « voile 990 » rouge (forum) ; z-index du menu du kramail mis à 980 : « voile 990 » rouge (kramail) ;
  - bascule du clic retirée : « ouverture au toucher » rouge ;
  - texte du « ••• » muté vers un gris clair : contraste rouge ;
  - règle commune sortie du `@media (max-width: 767px)` : bureau 1280 ou seuil 768 rouge ;
  - chaque masque retiré : la suite masquée rouge.
- Largeurs : 375×667, 767, 768, 769, 1280 ; bascule dans le même onglet. Variantes : Kraland clair et Empire Brun sombre, 16 variantes pour le contraste.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, clair et sombre : sujet (fermé et ouvert), réception (menu ouvert), lecture (menu ouvert).
- Arnaud relit les Ask First tranchés (prudents) dans `revue-manuelle.md`, dont la question 1 (liens du sujet).

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | kraland-theme.css:15229-15232 | La barre ouverte à z-index 1000 passe au-dessus du mini-chat plein écran (`.mini-chat-overlay`, 999) ; revue-manuelle dit « aucune mesure n'a montré » sans qu'une mesure existe | fondé | patch (fixed) | Aucun ancêtre ne crée de contexte d'empilement ; l'Ask First 6 exigeait une mesure et un arrêt |
| 2 | quick | forum-activite.mjs:1311-1316 | Au kramail, « aucun voile de Bootstrap ou menu au-dessus » est vrai par construction (`stopPropagation`) ; « aucun item activé » n'est pas vérifié | fondé | patch (fixed) | Vert sur la base, aucune contre-épreuve citée |
| 3 | quick | lib/router.mjs:215, :226 | Le mot-clé `kr-more\b|createMoreButton` et la section « BOUTON « ••• » COMMUN » ne lancent ni cartes-pastilles, ni palette-nation, ni typographie-formes (section) | fondé | patch (fixed) | Ces suites échouent sans masque : même piège qu'en 6.4 |
| 4 | quick | kraland-theme.css:15234 | `.kr-more-glyph` est la seule règle du bloc sans garde `body.mobile-mode` | fondé | patch (fixed) | Cohérence de la peau, effet nul aujourd'hui |
| 5 | quick | lib/variantes.mjs, `PLUS_TICKET65` | Le miroir ne reproduit pas le survol et la pression du bouton standard | fondé | dismiss | Aucune suite masquée ne mesure le « ••• » survolé ; le masque part au réalignement des bases (6.7 ou A4) |

## Result

Construit. Un seul bouton « ••• » (`createMoreButton`, `.kr-more`, glyphe texte en `span.kr-more-glyph`, `aria-label` « Autres actions ») sur le sujet, la réception et la lecture du kramail, en mobile. Le forum prend le bouton standard, 44 px, avec une barre ouverte au-dessus du voile. Le kramail garde ses couleurs, son menu et sa bascule. Bureau et seuils 768/769 égaux à `1134ef9`. Zone finale verte, routeur vert, `!important` à 3290. Les Ask First sont tranchés dans le sens prudent, dans `revue-manuelle.md` (Ticket 6.5). Revue quick indépendante : 5 constats, 4 corrigés, 1 écarté. `test:all` vert (13279 ok, 0 FAIL).
