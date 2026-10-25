---
title: 'En-tête de sujet mobile dans Communauté, Débats et Staff (H12.4)'
type: 'feature'
ticket: '4'
created: '2026-10-25'
status: 'built'
baseline_revision: 'ef0e4d4df2d036034df11a9065625428393a1799'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - 'AGENTS.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/epic-forum.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/tickets.toml'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/review-faisabilite.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '_bmad-output/initiative-harmonisation-ux/revue-manuelle.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, l'en-tête de sujet (fil d'Ariane, puis « Répondre » et « Nouveau sujet ») n'existe que dans RP et HRP. ForumThread:MobileBreadcrumb cherche le lien parent avec `a[href*="forum/rp/"], a[href*="forum/hrp/"]` et écrit la catégorie en dur (L4, inventaire §2.1). Dans Communauté et Débats, le module rend la main : les cinq boutons natifs restent, sans fil ni barre (relevé §1.6). Staff est inaccessible à ce compte (§1.1).

Là où l'en-tête existe, il s'écarte de DESIGN › En-tête de sujet (mobile) :

- le fil est une autre classe (`forum-thread-mobile-breadcrumb`), en `cssText`, liens atténués de 13 px sans hauteur minimale (Q28) ;
- « Nouveau sujet » est transparent bordé en primaire, pas un bouton standard ;
- la règle porte `min-height: 48px`, battue par une règle générique à 44 px (§3) ;
- le h1 et les `.forum-top` reçoivent des styles en ligne `!important`.

**Approach:** ForumThread:MobileBreadcrumb devient indépendant de la catégorie :

- lien parent : le premier `a[href^="forum/"]` de la `.pull-right` du premier `.forum-top` qui contient `i.fa-backward`. Aucune liste de catégories ;
- catégorie : `getActiveTitleLabel()` (L4), avec repli sur le segment de chemin du lien parent, puis « Catégorie » ; `href` de la catégorie : `forum/<segment>` ;
- fil : `createForumBreadcrumb([{ label: catégorie, href }, { label: nom du forum, href: lien natif }], titre)`, la fonction commune de 6.3. L'ancienne classe disparaît ;
- barres du haut et du bas : DOM inchangé (`forum-thread-actions`, `forum-thread-action-reply`, `forum-thread-action-new`), « Répondre » si et seulement si le lien natif existe.

Côté CSS, sous `@media (max-width: 767px)` et une garde de sujet en `:where(…)` :

- le fil commun reçoit la garde du sujet dans sa liste de gardes (l.14571-14615) ;
- les règles du bloc « FORUM MOBILE : actions » (l.13338-13396) sont réécrites en place : 44 px au lieu de 48, « Nouveau sujet » en bouton standard (`--kr-bg-surface`, `--kr-border-tint`, `--kr-text-nation`) limité au sujet, « Répondre » inchangé (primaire `--kr-arm-*`) ;
- les styles en ligne du h1 et des `.forum-top` sortent du JS vers des règles de la feuille, sans `!important`.

Les preuves vont dans un nouveau fragment `entete` de `forum-activite.mjs`, sur quatre fixtures synthétiques construites d'après le relevé (Communauté, Débats, Staff supposé, sujet fermé) plus `forum-sujet.html` inchangée.

## Boundaries & Constraints

**Always:**
- L'inventaire fait foi (§1 relevé, §2 règles, §4 assertions, §5 masques et repères). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire les règles d'origine, sans règle concurrente plus spécifique. **Aucun nouvel `!important`** : `grep -c '!important' kraland-theme.css` ≤ 3290 (compte de `ef0e4d4`). Aucun `:focus`, aucun focus clavier, aucun attribut ARIA nouveau (l'`aria-hidden` du séparateur vient de la fonction commune).
- Mobile en `@media (max-width: 767px)`, bureau en `@media (min-width: 768px)`, aucune règle globale. Le bureau ne reçoit rien et reste égal à la base `ef0e4d4`.
- Garde de page en `:where(…)`, spécificité nulle. Le JS ne pose aujourd'hui aucune classe de sujet (`.page-forum-sujet` est une règle morte, §2.1). Le module pose sur `body` une classe `kr-forum-sujet` au moment où il transforme l'en-tête (aucune autre classe de page nouvelle). Garde : `:where(body.page-forum.kr-forum-sujet) #col-right`. Elle n'atteint ni le sous-forum (`kr-subforum`), ni l'index, ni la page de réponse.
- Cibles de 44 px : chaque lien du fil, « Répondre » et « Nouveau sujet » ≥ 44 px de haut, `elementFromPoint` au centre tombe dans la cible (après `scrollTo`).
- Rayon `{rounded.sm}` (`--kr-radius-sm`, 4 px mesuré) gardé.
- « Répondre » affiché si et seulement si `a[href*="post/repondre"]` existe dans la page native. Aucune capacité retirée, aucune inventée.
- Fixtures synthétiques construites d'après le relevé, sans contenu de message réel ni identifiant de session : `forum-sujet-communaute.html`, `forum-sujet-debats.html`, `forum-sujet-staff.html` (structure RP supposée), `forum-sujet-ferme.html` (cadenas, sans lien répondre). Structure complète du §1.4 : deux `.forum-top`, deux paginations, `#col-left` avec entrée active. Les variantes (cadenas + lien, `img.icon`, libellé L4 renommé, titre long) sont faites en mémoire dans la suite. `forum-sujet.html` n'est pas modifiée.
- Repères cités par 3 suites (`forum-top`, `nouveau-sujet`, `forum-sujet`, `forum-mobile-breadcrumb`, `fa-comments`, `media-list`, `site-annonces-20101`, `aria-hidden`, `min-height`, `forum-index-communaute`) : jamais écrits en clair dans `forum-activite.mjs`, toujours par `lib/variantes.mjs` (`REPERES_ENTETE_TICKET64`, `REPERES_FIL_TICKET63`, `ACTIVITE_TICKET62`). Relevé `TOKEN_RE` refait sur la suite finie : aucun jeton ne passe de 3 à 4.
- Masques posés sur le bundle de base seulement, si `AVANT_TICKET64(base)`, jamais sur le bundle courant. Chaque masque porte sa condition de retrait (inventaire §5.1) : réalignement des bases par le sweep 6.7 ou l'action A4 de la rétro 5, tickets à venir. Jamais « quand le bundle de base contient l'entrée ».
- Chaque contrôle du fragment peut échouer et a une contre-épreuve nommée (Verification).
- Les Ask First ci-dessous sont **tranchés dans le sens prudent par l'implémenteur**, sans attendre : le choix prudent est écrit à côté de chacun, appliqué tel quel et consigné dans `revue-manuelle.md` (section Ticket 6.4) pour Arnaud.

**Ask First:**
1. **Sujet fermé avec lien « répondre » natif.** Le relevé montre, pour ce compte, le cadenas et le lien « répondre » sur tous les sujets fermés (§1.5), alors que EXPERIENCE dit « pas de Répondre » sur un sujet fermé. Prudent : « Répondre » suit la présence du lien natif, pas le cadenas. La fixture fermée n'a pas de lien (compte sans droits supposé) : aucun « Répondre ». La variante en mémoire cadenas + lien garde « Répondre ».
2. **« Nouveau sujet » partagé avec le sous-forum.** `.forum-thread-action-new` sert aussi au sous-forum (§2.2). Prudent : le style standard n'est posé que sous la garde du sujet ; le sous-forum reste égal à la base (`sous-forum.mjs` l.407, `typographie-formes.mjs` `sous-forum` `nouveau`). L'harmonisation du sous-forum reste à décider.
3. **Styles en ligne `!important` du h1 et des `.forum-top`.** Prudent : ils sortent du JS vers la feuille, à rendu égal (marge 12px 16px, padding 0, fond transparent) ; tout écart mesuré de position va au Plan Change Log. Si une règle de la feuille ne peut pas battre une règle native sans `!important`, garder le style en ligne et le consigner.
4. **Couleur des liens du fil (Q28.1).** Prudent : couleur du texte, comme le fil commun de 6.3.
5. **Méta du `.forum-top` du haut (« Par … », « N messages », cadenas).** Prudent : gardée telle quelle (visible aujourd'hui en RP/HRP, 375×35).
6. **Structure Staff supposée.** Aucun accès (§1.1). Prudent : fixture Staff = structure RP, parent `forum/staff/<slug>-<id>`, entrée active « Staff ». Le code ne lit aucune catégorie en dur ; la fixture ne prouve que l'indépendance à la catégorie.
7. **Seuils et tolérances.** Aucun changé dans les suites existantes. Un seuil ou une tolérance à changer arrête le build et passe à Arnaud.
8. **Fixture `forum-sujet.html`.** Prudent : inchangée ; nouvelles fixtures à côté. Ses écarts (§1.8) restent consignés.
9. **Barre du bas (Q28.3).** Prudent : la barre du bas suit le même rendu que celle du haut (hypothèse de l'épopée), avec sa marge droite de 52 px (N-1).
10. **Variante `locked` de `forum-mobile.mjs`.** Elle ne pose pas de cadenas. Prudent : la laisser telle quelle ; la nouvelle fixture fermée couvre le cadenas.

**Never:**
- Écrire une catégorie, un slug ou une liste de catégories en dur dans le JS. Modifier, masquer ou déplacer la liste latérale native.
- Retirer ou inventer « Répondre » ou « Nouveau sujet » par rapport à la page native.
- Nouvel `!important` ; règle `:focus` ; attribut ARIA nouveau ; règle de mobile hors `@media (max-width: 767px)` ; garde qui atteint le sous-forum, l'index ou la page de réponse.
- Toucher aux messages (`ul.media-list.forum`), à la pagination, à la page de réponse (post/FAB), au bureau.
- Modifier `forum-sujet.html`. Capture HTML brute dans le dépôt. Contenu de message réel, identifiant ou jeton CSRF dans une fixture.
- Site réel, cloche, `/report`, Chrome 9222/9223 pendant le build.
- Git qui modifie l'arbre, l'index ou le stash sans accord. `test:all` (orchestrateur).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Communauté ouvert | `forum-sujet-communaute`, 375 et 767 | 1 seul conteneur de fil (`forum-mobile-breadcrumb`) « Communauté › Bavardage divers › titre » ; `href` `forum/communaute` et lien natif du forum ; barre du haut et du bas : « Répondre » primaire, « Nouveau sujet » standard, ≥ 44, `href` natifs ; boutons natifs masqués | base : aucun fil, aucune barre (rouge) |
| Débats ouvert | `forum-sujet-debats`, 375 et 767 | idem, « Débats › Politique & société › … » | base : rouge |
| Staff (supposé) | `forum-sujet-staff`, 375 | idem, « Staff › <forum> › … » | base : rouge |
| RP/HRP | `forum-sujet` (HRP), 375 et 767 | fil commun « Jeu (HRP) › … » ; plus aucune `forum-thread-mobile-breadcrumb` ; barres comme ci-dessus | base : ancienne classe (rouge) |
| Sujet fermé | `forum-sujet-ferme`, 375 | cadenas présent dans la méta ; aucun « Répondre » ; 2 « Nouveau sujet » (haut et bas) | « Répondre » inventé : FAIL |
| Fermé + lien natif | `forum-sujet-ferme` + lien répondre en mémoire, 375 | 2 « Répondre » (le lien natif existe) | « Répondre » retiré : FAIL |
| L4 renommé | `forum-sujet-communaute`, entrée active renommée en mémoire | fil « <libellé renommé> › … » | base / catégorie en dur : rouge |
| Sans entrée active | `forum-sujet` (`#col-left` vide) | repli : libellé lu du segment de chemin (`hrp` → libellé de `FORUM_MENUS`) ou « Catégorie » ; jamais vide ni « undefined » | libellé vide : FAIL |
| Titre long / `img.icon` | variantes en mémoire, 375 | courant tronqué sur une ligne ; `img.icon` gardé ou ignoré sans casser le fil ; aucun débordement horizontal | débordement : FAIL |
| Pagination vide | fixtures d'une page (pagination 0 `li`) | rien de visible en plus ; aucun débordement | — |
| Contraste | `forum-sujet-communaute`, 375, 16 variantes | fil, « Répondre », « Nouveau sujet » ≥ 4,5:1 | contre-épreuve obligatoire |
| Sous-forum | `sous-forum-debuter`, 375 | « Nouveau sujet » égal à la base `ef0e4d4` | style standard qui fuit : FAIL |
| Seuils | 767, 768, 769 ; bascule 768 → 767 → 768 → 767 | 767 : en-tête mobile ; 768/769 : égal à la base | — |
| Bureau | 4 nouvelles fixtures + `forum-sujet`, 768, 1280 | égal au bundle `ef0e4d4` (boutons natifs, empreinte de `#col-right`) | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-en-tete-de-sujet-mobile-dans-communaute-debats-et-staff-h12-inventaire.md`.
- `kraland-userscript-template.js` (lignes de `ef0e4d4`, à revérifier) :
  - l.86-92 : `FORUM_MENUS` (libellés de repli par segment, lus seulement) ;
  - l.5410-5437 : `createForumBreadcrumb` (appelée, non modifiée) ;
  - l.7097-7331 : ForumThread:MobileBreadcrumb (cible) : `taverneLink` et `categoryName/Url` remplacés, `createBreadcrumb` remplacé par l'appel commun, `cssText` du h1 et des `.forum-top` retirés au profit de classes, pose de `kr-forum-sujet` sur `body` ;
  - l.8384 : `getActiveTitleLabel()` (appelée) ;
  - l.863 : classes de page (lue, non touchée).
- `kraland-theme.css` :
  - l.13338-13396 : « FORUM MOBILE : actions » (réécrit : 48 → 44, « Nouveau sujet » standard sous la garde du sujet, h1 et `.forum-top` hors `cssText`) ;
  - l.13694-13730 : bloc L2 du sous-forum (lu, non touché) ;
  - l.14571-14615 : fil commun (garde du sujet ajoutée à la liste `:where(…)`) ;
  - l.11509 : `.page-forum-sujet` (règle morte, lue ; non retirée, hors périmètre).
- Tests :
  - `tests/e2e/fixtures/` : 4 nouvelles fixtures (Boundaries) ;
  - `tests/e2e/forum-activite.mjs` : nouveau fragment `entete`, base `COMMIT_ENTETE = 'ef0e4d4'` (`KR_SCRIPT_AVANT_ENTETE`) ; fragment `fil`, cas `sujet` 375/767 de `casB` (l.721-742) retiré de « égal à `5042afd` » et repris par `entete` (le bureau du sujet reste) ;
  - `tests/e2e/lib/variantes.mjs` : `REPERES_ENTETE_TICKET64`, `ENTETE_TICKET64`, `filSujetTicket64`, `AVANT_TICKET64`, à côté de `REPERES_FIL_TICKET63` l.579-600 ;
  - `tests/e2e/typographie-formes.mjs` : `PAGES_FORUM.sujet` l.431, fragments `boutons`, `echelle-forum` (l.1008), `rayons` (l.1226, l.1246), `espacement` (l.1485), `nettoyage` (l.1666) — masques selon le rouge avant ;
  - `tests/e2e/forum-mobile.mjs` F-01 l.226-266, N-1 l.665 (lus, vert attendu) ;
  - `tests/e2e/sous-forum.mjs` l.407 (vert exigé) ; `messages-v3.mjs`, `palette-nation.mjs` (vert attendu) ;
  - `tests/e2e/lib/router.mjs` : `SUITES` l.98, `KEYWORDS` l.164/l.211, `SECTIONS` l.224 ;
  - `tests/e2e/lib/router.test.mjs` : l.352, l.566-574 ;
  - `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` : ligne `forum-activite`.

## Tasks & Acceptance

**Execution:**
- [ ] Rouge avant. `git show ef0e4d4:kraland-userscript-main.user.js > /tmp/kr64/base.user.js`. Écrire les fixtures et le fragment `entete` d'abord, puis `KR_SCRIPT=/tmp/kr64/base.user.js KR_FRAG=entete node tests/e2e/forum-activite.mjs`. `kr-theme-enabled` vérifié avant toute mesure. FAIL attendus en Verification.
- [ ] Fixtures synthétiques (Boundaries), d'après inventaire §1.4 : titres et auteurs inventés, slugs relevés (`bavardage-divers-30101`, `politique-societe-40101`, `forum/staff/<slug>-<id>` supposé), `#col-left` avec entrée active, deux `.forum-top`, deux paginations vides, 2 ou 3 messages courts inventés. `forum-sujet-ferme` : Communauté (`entraide-30102`), cadenas, aucun lien répondre.
- [ ] `tests/e2e/forum-activite.mjs`, fragment `entete`, à 375 et 767 (tactile), Kraland clair et Empire Brun sombre :
  - un seul conteneur de fil, famille commune, aucune `forum-thread-mobile-breadcrumb` ;
  - texte attendu du fil, `href` de la catégorie et du forum, courant `span` sans lien ;
  - barre en haut (premier écran) et en bas (dernier écran) ;
  - « Répondre » : fond `--kr-arm-bg`, texte `--kr-arm-ink` ; « Nouveau sujet » : fond `--kr-bg-surface`, bordure `--kr-border-tint`, texte `--kr-text-nation` (valeurs calculées comparées aux jetons résolus) ; ≥ 44 de haut, rayon `--kr-radius-sm`, `elementFromPoint` au centre, `href` natifs ;
  - boutons natifs de `.pull-right` invisibles ;
  - fermé sans lien : 0 « Répondre », 2 « Nouveau sujet », cadenas visible ; fermé + lien : 2 « Répondre » ;
  - L4 renommé, repli sans entrée active, titre long, `img.icon` ;
  - aucun débordement horizontal (`scrollWidth ≤ clientWidth` de `document.documentElement` et `#col-right`) ;
  - contraste ≥ 4,5:1 dans les 16 variantes (375, `CONTRASTE()`) ;
  - sous-forum `sous-forum-debuter` 375 : « Nouveau sujet » égal à la base ;
  - seuils 767/768/769 et bascule 768 → 767 → 768 → 767 (`ECART_RECHARGEMENT_MS`) ;
  - bureau 768 et 1280 égal à `ef0e4d4` sur les 5 fixtures.
  Réseau confiné, Bootstrap du vendor, repères partagés importés de `lib/variantes.mjs`.
- [ ] `kraland-userscript-template.js`, ForumThread:MobileBreadcrumb :
  - lien parent : `a[href^="forum/"]` de la `.pull-right` du premier `.forum-top` qui contient `i.fa-backward` ; absent : retour sans transformer, comme aujourd'hui ;
  - catégorie : `getActiveTitleLabel()`, repli libellé de `FORUM_MENUS` pour le segment de chemin (lecture d'une table existante, pas de liste nouvelle), puis « Catégorie » ; `href` `forum/<segment>` ;
  - nom du forum : `title` du lien natif, sinon son texte sans icône ;
  - fil : `createForumBreadcrumb(parents, titre)` ; suppression de `createBreadcrumb` et de la classe `forum-thread-mobile-breadcrumb` ;
  - `cssText` du h1 et des `.forum-top` remplacés par des classes (`forum-thread-heading`, `forum-thread-top-bottom`, noms à fixer au build) et `body.classList.add('kr-forum-sujet')` ;
  - DOM des barres inchangé ; « Répondre » si `replyLink`.
- [ ] `kraland-theme.css` :
  - l.13338-13396 : `min-height: 44px` à la place de 48 ; règle « Nouveau sujet » standard sous `:where(body.page-forum.kr-forum-sujet) #col-right`, en réécrivant la déclaration d'origine (le sous-forum garde la sienne, égale à la base) ; règles du h1 et des `.forum-top` (ex-`cssText`) ;
  - l.14571-14615 : garde du fil étendue à `body.page-forum.kr-forum-sujet` ;
  - CDP au build sur « Nouveau sujet » : règle gagnante et couleur calculée (l'ancien `color: … !important` d'origine est réécrit en place, pas doublé) ;
  - `grep -c '!important'` ≤ 3290.
- [ ] `tests/e2e/lib/variantes.mjs` : `REPERES_ENTETE_TICKET64` (classes des barres, garde, fixtures, sélecteurs natifs), `ENTETE_TICKET64` (miroir CSS), `filSujetTicket64` (masque DOM), `AVANT_TICKET64` (chaîne minifiée du build, absente des 9 bases de l'inventaire §5.1), conditions de retrait en commentaire.
- [ ] Fragment `fil` : cas `sujet` 375/767 de `casB` retiré (il passe à `entete`) ; bureau du sujet gardé. Consigné au Plan Change Log.
- [ ] Masques sur la base, si `AVANT_TICKET64(base)` et seulement là où le rouge avant les rend nécessaires : `typographie-formes.mjs` (`boutons`, `echelle-forum`, `rayons`, `espacement`, `nettoyage`, page sujet mobile) et `forum-activite.mjs` (`ancres`, `seuil`, `bureau` si la position du message bouge). Pour chaque masque : rouge sans lui, vert avec lui.
- [ ] Suites existantes après le 1er `test:zone` : `forum-mobile.mjs`, `sous-forum.mjs`, `messages-v3.mjs`, `palette-nation.mjs`, `forum-index.mjs`. Vert attendu sans retouche ; une retouche va au Plan Change Log ; un seuil ou une tolérance → arrêt (Ask First 7).
- [ ] `tests/e2e/lib/router.mjs` :
  - `SUITES` : fragment `['entete']` ajouté à `forum-activite` ;
  - `SECTIONS` l.224 : `forum-activite` ajouté à `^MODULE : (ForumThread|Messages):` (ou entrée séparée pour ForumThread) ;
  - `KEYWORDS` : `[/forum-thread-action|kr-forum-sujet/, ['forum-activite']]` en plus des entrées existantes ;
  - cas dans `router.test.mjs` (hunk ForumThread, hunk CSS de la garde du sujet) ; cas existants l.352, l.566-574 mis à jour ;
  - `npm run test:router`.
- [ ] Skill `tester-kraland-css` : ligne `forum-activite` (en-tête de sujet, fragment `entete`) dans les deux copies ; `diff -r .hermes/skills .claude/skills`.
- [ ] `revue-manuelle.md`, section Ticket 6.4 : Ask First tranchés (choix prudent de chacun), relevé à valider par Arnaud.
- [ ] `npm run build`, contre-épreuves, `lint:css`, `lint:js`, compte `!important`, relevé `TOKEN_RE`.

**Acceptance Criteria:**
- Given `forum-sujet-communaute`, `forum-sujet-debats`, `forum-sujet-staff` et `forum-sujet` à 375 et 767 px, when la page est prête, then il y a un seul fil, de la famille `forum-mobile-breadcrumb`, « Catégorie › Forum › titre », catégorie lue dans la liste latérale, sans `forum-thread-mobile-breadcrumb`.
- Given ces pages, then une barre en haut et une en bas portent « Répondre » (primaire, `--kr-arm-*`) et « Nouveau sujet » (standard : `--kr-bg-surface`, `--kr-border-tint`, `--kr-text-nation`), chacun ≥ 44 px de haut, rayon `--kr-radius-sm`, `href` natif, atteignable par `elementFromPoint`.
- Given `forum-sujet-ferme`, then aucun « Répondre » et deux « Nouveau sujet ». Given la même page avec un lien répondre natif ajouté, then deux « Répondre ».
- Given l'entrée active renommée, then le fil affiche le libellé renommé ; sans entrée active, un libellé non vide.
- Given chaque page à 375 et 767 px, then aucun débordement horizontal.
- Given 16 variantes à 375 px, then fil, « Répondre » et « Nouveau sujet » ≥ 4,5:1.
- Given `sous-forum-debuter` à 375 px, then « Nouveau sujet » égal à la base `ef0e4d4`.
- Given 768 et 1280 px, then les 5 pages sont égales au bundle `ef0e4d4`. La bascule 768 → 767 → 768 → 767 donne l'en-tête à 767 et le rendu natif à 768.
- Given `forum-mobile.mjs`, `sous-forum.mjs`, `messages-v3.mjs`, `palette-nation.mjs`, `typographie-formes.mjs`, `forum-index.mjs`, then verts ; les masques ne sont posés que sur la base.
- Given `kraland-theme.css`, then `grep -c '!important'` ≤ 3290.
- Given `npm run test:router`, then vert ; aucun jeton de `TOKEN_RE` ne passe de 3 à 4 suites ; `diff -r .hermes/skills .claude/skills` vide.
- Given le relevé (inventaire §1), then Arnaud le valide (hitl, consigné, non bloquant pour le build).

## Implementation Notes

Build du 2026-10-25, arbre de travail sur `feature/next` (base `ef0e4d4`, rien de commité).

**Fichiers touchés :** `kraland-userscript-template.js` (module `ForumThread:MobileBreadcrumb`), `kraland-theme.css` (barre d'actions, garde du fil, h1), bundle et `version.json` régénérés par `npm run build`, `tests/e2e/forum-activite.mjs` (fragment `entete`), `tests/e2e/forum-index.mjs`, `tests/e2e/typographie-formes.mjs`, `tests/e2e/lib/variantes.mjs` (masques), `tests/e2e/lib/router.mjs` et `router.test.mjs`, 4 fixtures `tests/e2e/fixtures/forum-sujet-{communaute,debats,staff,ferme}.html`, skill `tester-kraland-css` (2 copies), `revue-manuelle.md` (section « Ticket 6.4 »).

**Rouge avant** (`KR_SCRIPT=/tmp/kr64/base.user.js KR_FRAG=entete node tests/e2e/forum-activite.mjs`, bundle de `ef0e4d4`) : exit 1, 28 ok, 142 FAIL au premier build ; 28 ok, 144 FAIL après les correctifs de revue (2 contrôles de survol de plus). Communauté, Débats, Staff et fermé sans fil ni barre ; `forum-sujet` sur l'ancien conteneur ; « Nouveau sujet » transparent ; L4 inchangé.

**Vert après :**
- `npm run build` : VALIDATION PASSED.
- `npm run test:zone -- forum forum-activite sous-forum typographie-formes messages palette-nation` : exit 0, 8109 ok, 0 FAIL (forum-activite 389 ok sur 7 fragments, `entete` compris ; forum-index 150 ok). Après le dernier correctif du survol (base sans barre), `KR_FRAG=entete` seul : exit 0, 172 ok. Après le constat 7 : `npm run test:zone -- forum forum-activite sous-forum typographie-formes messages palette-nation cartes-pastilles` : exit 0, 10375 ok, 0 FAIL, RÉSULTAT VERT (cartes-pastilles 2266 ok).
- `node tests/e2e/forum-index.mjs` : exit 0, 150 ok.
- `npm run test:router` : exit 0, « Routeur conforme ».
- `npm run lint:css` : exit 0. `npm run lint:js` : exit 0 (1 avertissement préexistant, `no-loop-func`).
- `grep -c '!important' kraland-theme.css` : 3290. `diff -r .hermes/skills .claude/skills` : vide, exit 0.
- Relevé `TOKEN_RE` : aucun jeton de 3 à 4. `btn-default` (7 vers 8) et `en-t` (11 vers 12) étaient déjà au-delà avant ce ticket.

**Contre-épreuves sur copies mutées du bundle** (`KR_SCRIPT=/tmp/kr64/mut/<nom>.user.js KR_FRAG=entete`, toutes exit 1). Nombres du premier build ; rejouées sur le bundle corrigé, toutes encore exit 1 avec le même contrôle rouge (2 de plus en ok par mutant, sauf `selecteur-rp-hrp` 16 / 126 et `gris-clair` 132 / 40) :

| Mutation | ok / FAIL | Contrôle rouge nommé |
|---|---|---|
| `selecteur-rp-hrp` (parent limité à `forum/rp/`, `forum/hrp/`) | 42 / 128 | « un seul fil… » et barres de eCommunaute, eDebats, eStaff, eFerme (64 FAIL sur les trois catégories) |
| `categorie-en-dur` | 139 / 31 | eLibelle (L4) et « un seul fil » de eCommunaute |
| `repli-vide` | 158 / 12 | eInconnu (repli « Catégorie ») et `sujet` |
| `ancien-conteneur` | 136 / 34 | « un seul fil, de la famille commune » |
| `reply-force` | 162 / 8 | eFerme : « 0 « Répondre » (aucun lien natif) » |
| `reply-cadenas` | 166 / 4 | eFermeLien : « 2 « Répondre » (lien natif présent) » |
| `garde-elargie` | 168 / 2 | debuter : « sous-forum, « Nouveau sujet »… égaux au bundle de base » |
| `nouveau-transparent` | 140 / 30 | « « Nouveau sujet » standard (fond de surface…) » |
| `repondre-fond` | 132 / 38 | « « Répondre » primaire (fond et texte --kr-arm-*) » |
| `min-height-neutralise` (44 px retiré et règle générique neutralisée, P3) | 138 / 32 | « au moins 44 px de haut » |
| `min-width-400` | 148 / 22 | « aucun débordement horizontal » |
| `gris-clair` | 132 / 38 | « d'au moins 4,5:1 » (8 variantes rouges) et « standard » |
| `hors-mobile` | 147 / 23 | « 768 px / 769 px (non tactile) : aucun en-tête mobile » |
| `seuil-767` | 126 / 44 | eCommunaute 767 px : fil et barres |
| `barre-bas-absente` | 118 / 52 | « une barre en haut… et une en bas » |
| `regle-h1-generique` | 168 / 2 | eHrp : « h1… et bandeau natif du bas égaux au bundle de base » |
| `courant-deux-lignes` (revue 3 : `white-space: normal` sur le courant) | 158 / 14 | « courant sur une ligne » : 10 FAIL « lignes du courant » sur des titres moyens à 2 lignes et ≤ 44 px (eCommunaute, eIcone, eInconnu, eLibelle, sujet), que `h <= 44` laissait verts ; 2 « hauteur » (eLong) ; 2 sous-forum |
| `cadenas-masque` (revue 4 : `.forum-top i.fa-lock` masqué) | 166 / 6 | « sujet fermé, cadenas visible dans la méta » seul (eFerme 375 et 767, eFermeLien), message « cadenas » |
| `survol-absent` (revue 6 : règle de survol retirée) | 170 / 2 | « « Nouveau sujet » survolé en fond header-tint… » : fond de repos au survol |
| `survol-souligne` (revue 6 : `text-decoration: none` retiré) | 170 / 2 | même contrôle : « soulignement » |

**Masques** (bundles de base uniquement, `AVANT_TICKET64(src)`) : `ENTETE_TICKET64` (CSS par `poserJetonsRedefinis`) et `filSujetTicket64` (DOM par MutationObserver, P5), dans `forum-index.mjs`, `typographie-formes.mjs` (echelle-forum, nettoyage) et `forum-activite.mjs` (bascule seulement, option `entete64`). En plus, dans `forum-index.mjs`, quand la base ne connaît pas `--kr-text-nation`, `.forum-thread-action-new` du sujet est neutralisé sur la base seulement (`EMPREINTE`, option `sujet`). Sur le bundle courant (option `verifier`), il n'est neutralisé que s'il porte les jetons du bouton standard (`REPERES_ENTETE_TICKET64.jetons`), sinon ses valeurs réelles sont comparées. Contre-épreuves (revue 2), `KR_FRAG=hors-perimetre` : mutants `gris-clair` et `nouveau-transparent`, exit 1, 2 FAIL « sujet 375 px… rendu identique » ; la même mutation `gris-clair` avec l'ancienne neutralisation des deux côtés (`verifier: false`) : exit 0, 0 FAIL, ce qui confirme le constat. Condition de retrait : retirer quand `COMMIT_AVANT` (forum-index, forum-activite), `COMMIT_ECHELLE_FORUM` et `COMMIT_NETTOYAGE` (typographie-formes) sont réalignés sur un SHA qui contient 6.4. Ce réalignement est porté par le sweep 6.7 ou par l'action A4 de la rétro 5. Contre-épreuves, chaque masque retiré :
- forum-index sans `filSujetTicket64` : exit 1, 2 FAIL « classes de body » ;
- forum-index sans `ENTETE_TICKET64` : exit 1, 2 FAIL (éléments décalés) ;
- forum-index sans neutralisation de la base (`sujet: ''`, revue 2) : exit 1, 2 FAIL (élément 13, couleur de « Nouveau sujet ») ;
- echelle-forum sans `filSujetTicket64` : 2 FAIL « nombre d'éléments » ;
- echelle-forum sans `ENTETE_TICKET64` : 2 FAIL (fil en 17 px) ;
- nettoyage sans `filSujetTicket64` : 4 FAIL ;
- nettoyage sans `ENTETE_TICKET64` : 4 FAIL (hauteurs) ;
- forum-activite `seuil` sans `entete64` : 1 FAIL « scrollY 694,694,694 / base 694,694,659 ».
Les suites boutons, rayons, espacement, ancres et bureau sont vertes sans masque.

**Masque `ORIGINE_TICKET64` (`cartes-pastilles.mjs`, constat 7).** Le test:all de l'orchestrateur échouait sur 4 contrôles « forum sujet {kraland, empire-brun-dark} {375, 767} px : messages égaux au bundle de base (140 éléments) ». Seule l'ordonnée différait (`LI.media.well.kr-msg` à 316 contre 328 sur la base `21fed8d`), conséquence voulue du fil 12 px plus bas. Sur la page sujet et une base d'avant 6.4 seulement, `RELEVE` prend ses ordonnées par rapport au premier `.media`, des deux côtés. Les styles ne sont pas masqués. Retrait : quand `COMMIT_AVANT` de `cartes-pastilles.mjs` est réaligné sur un SHA qui contient 6.4 (sweep 6.7 ou action A4 de la rétro 5). Preuves :
- `KR_FRAG=forum node tests/e2e/cartes-pastilles.mjs` : exit 0, 89 ok ;
- masque retiré (`ORIGINE_TICKET64 = () => null`) : exit 1, 4 FAIL ;
- mutant `message-decale` (un `::before` de 20 px dans le 2e message, sans translation globale ni changement de style relevé) : exit 1, 4 FAIL « élément 48 LI.media.well.kr-msg », hauteur 722,5 contre 702,5.

**Non lancé :** `npm run test:all`, qui revient à l'orchestrateur. `test:changed` non lancé non plus : il s'élargit au total parce que `lib/variantes.mjs` change (P9).

## Plan Change Log

- Libellé HRP : « Forum HRP » (table du menu du site), au lieu de « Jeu (HRP) ».
- Libellés de sous-forum des fixtures : « Bavardage & Divers » et « Politique & Société », comme sur le site.
- `AVANT_TICKET63` corrigé dans `lib/variantes.mjs` : il cherche maintenant le préfixe de la garde, commun à 6.3 et à 6.4. Sinon, la garde élargie au sujet le rendait vrai sur le bundle courant.
- Cas sujet 375/767 retirés de `casB` du fragment `fil` : le sujet n'est plus égal à la base, et `entete` le couvre.
- `forum-sujet.html` n'a qu'une barre native : 1 barre attendue, 2 pour les nouvelles fixtures.
- La règle `h1.page-header` est réécrite en place en `h1.page-header:where(:not(.forum-thread-heading))`. Elle ne gagne aucun `!important`.
- Le fond transparent du h1 et du `.forum-top` du bas s'écrit en `background-color`. Le minifieur réécrit `background: transparent` en `0 0`, ce qui change `background-position`.
- Le fil du sujet est 12 px plus bas que l'ancien (marge 4 contre 16), aligné sur l'index et le sous-forum.
- Courant du fil en texte seul : l'`img.icon` du titre natif est ignorée.
- Bascule transitoire du sujet dans `forum-activite` (`seuil`) : masque `entete64`.
- `composantsSujet` ajouté dans `forum-index.mjs` : les jetons manquent sur la base 81512a3.
- La taille du fil est en littéral 13 px dans `ENTETE_TICKET64` : `--kr-font-detail` manque sur les bases anciennes.
- `init` en tableau dans `ouvrir` de `typographie-formes.mjs`, pour poser deux scripts.
- `new URL(...)` est remplacé par `.pathname` de l'ancre dans le template et dans `variantes.mjs`. `URL` donnait `no-undef` au lint.
- Routeur : fragment `entete`, `SECTIONS` ForumThread et Messages, mot-clé `forum-thread-action|kr-forum-sujet` vers forum-activite.
- Jetons `btn-default` et `en-t` déjà au-delà de 3 avant ce ticket, hors du périmètre de MAX_CITING pour ce ticket.
- Revue 2 : `composantsSujet` remplacé par les options `sujet`, `verifier` et `jetons` d'`EMPREINTE` (forum-index). La base est neutralisée ; le courant est vérifié contre les jetons du bouton standard. Les expressions des jetons viennent de `REPERES_ENTETE_TICKET64.jetons`, pour ne pas porter `kr-bg-surface` à 4 suites.
- Revue 3 : le contrôle « courant sur une ligne » compte les lignes (sommets distincts des boîtes d'un Range sur le courant, champ `lignes`) en plus de `h <= 44`. Le `rgb()` partagé du fragment ramène `color(srgb …)` à 0..255 : sans cela, la tolérance de 1 rendait toute bordure en `color-mix()` « proche ».
- Revue 4 : contre-épreuve `cadenas-masque` ajoutée (tableau ci-dessus).
- Revue 5 : `AVANT_TICKET63` cible de nouveau le fil lui-même. Regex `GARDE_FIL_TICKET63` : un `:where(…)` contenant `html.kr-page-forum-index` et `body.page-forum.kr-subforum` dans n'importe quel ordre, suivi de `#col-right .forum-mobile-breadcrumb` sans suffixe. Vérifié hors suite (`/tmp/kr64/t63.mjs`) : faux sur le bundle courant, sur `ef0e4d4`, sur le courant à membres inversés et à espaces doublés ; vrai sur `5042afd`, `81512a3`, `d953969`, `00b0786`, et sur un courant dont la garde ne porte plus que des dérivés (`-x`).
- Constat 7 : masque `ORIGINE_TICKET64` dans `cartes-pastilles.mjs` (ordonnées des messages du sujet relatives au premier message sur la base d'avant 6.4). `cartes-pastilles` ajouté au `test:zone` final.
- Revue 6 : « Nouveau sujet » standard du sujet : `text-decoration: none` dans la règle d'origine et une règle `:is(:hover, :active)` en `--kr-header-tint`, sans `!important` (3290). Nouveau contrôle de survol dans `entete` (`page.hover`, 2 variantes, 375 px) : fond header-tint différent du repos, bordure teintée, texte de la nation, aucun soulignement. Repère `fondSurvol` ajouté à `REPERES_ENTETE_TICKET64.jetons`. Sur une base sans barre, le contrôle échoue sur « absent » sans interrompre la suite.

## Design Notes

**Pourquoi la `fa-backward` et pas une liste de catégories.** Le relevé (§1.4) montre un seul lien de retour au forum par `.pull-right`, toujours avec `i.fa.fa-backward` et un `href` `forum/<cat>/<slug>-<id>`, dans les 4 catégories. Le reconnaître par l'icône supprime L4 sans écrire de catégorie. Staff, inaccessible, est couvert par construction.

**Pourquoi une classe `kr-forum-sujet` posée par le module.** Le sujet n'a aujourd'hui aucune classe de page (§2.1). La garde du fil commun et du « Nouveau sujet » standard doit atteindre le sujet sans atteindre le sous-forum, qui partage `.forum-thread-action-new`. Posée seulement quand l'en-tête est transformé, la classe n'existe qu'en mobile et que si le lien parent existe : la feuille ne peut pas styler un en-tête absent. `:where()` garde la spécificité (1,1,0) de `#col-right .x`.

**Pourquoi « Répondre » suit le lien natif.** Le userscript ne connaît pas les droits du compte. Le relevé montre un lien « répondre » sur des sujets fermés (§1.5) : le masquer retirerait une capacité réelle ; l'inventer quand il manque mènerait à une page refusée. La règle « présence du lien natif » est la seule sûre ; elle respecte EXPERIENCE pour un compte sans droits.

**Pourquoi sortir les styles en ligne.** Un `cssText` `!important` ne peut être réécrit par la feuille sans `!important` concurrent (P1 option 4). La garde du sujet rend la règle de feuille suffisante.

**Pièges :**
- P1 : MAX_CITING. `forum-top`, `nouveau-sujet`, `forum-sujet`, `forum-mobile-breadcrumb`, `fa-comments`, `media-list`, `site-annonces-20101` sont à 3 suites (§5.2). Une écriture en clair dans `forum-activite.mjs` les fait passer à 4.
- P2 : `.forum-thread-action-new` partagé : toute règle sans garde du sujet change le sous-forum.
- P3 : la règle générique `min-height: 44px !important` cache aujourd'hui le 48 px : le contrôle de hauteur doit être doublé d'une contre-épreuve qui neutralise cette règle dans une copie du bundle.
- P4 : la pagination vide existe sur le site et pas dans `forum-sujet.html` : les nouvelles fixtures la portent.
- P5 : `MESURE_TAILLES` et les empreintes comptent les éléments ; un masque CSS seul ne suffit pas (masque DOM).
- P6 : la bascule recharge la page : 1 300 ms entre deux redimensionnements.
- P7 : « couvert » n'est pas « invisible » : `elementFromPoint` après `scrollTo`.
- P8 : faux FAIL sous charge : rejouer la suite seule, machine calme.
- P9 : `test:changed` s'élargit au total quand `lib/variantes.mjs` change ; à consigner, non lancé.

## Verification

**Commands:**
- `npm run build`.
- `npm run test:zone -- forum-activite forum sous-forum typographie-formes messages`.
- `npm run test:router`.
- `npm run lint:css` puis `npm run lint:js`, codes de sortie lus séparément.
- `grep -c '!important' kraland-theme.css` ≤ 3290.
- `diff -r .hermes/skills .claude/skills` vide.
- Relevé `TOKEN_RE` des suites (script hors dépôt, sur le modèle de `/tmp/kr64/tokens2.mjs`) : aucun jeton de 3 à 4.
- Pas de `test:all` : il revient à l'orchestrateur.
- Rouge avant sur le bundle de `ef0e4d4` (`KR_SCRIPT`, `KR_FRAG=entete`). FAIL attendus :
  - Communauté, Débats, Staff : aucun fil, aucune barre, boutons natifs visibles ;
  - `forum-sujet` : conteneur `forum-thread-mobile-breadcrumb`, pas de famille commune ; liens du fil < 44 px ;
  - « Nouveau sujet » transparent (fond ≠ `--kr-bg-surface`) ;
  - L4 renommé : fil inchangé (catégorie en dur) ;
  - `forum-sujet-ferme` (Communauté, sous-forum `entraide-30102`, comme `entraide-ferme` du relevé) : aucun fil ni barre, donc « 2 Nouveau sujet » rouge ; « 0 Répondre » vert sur la base (contrôle prouvé par sa contre-épreuve).
- Verts attendus sur la base : sous-forum égal, bureau 768/1280 égal, aucun débordement, « Répondre » primaire en RP/HRP.
- Contre-épreuves sur copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - sélecteur parent remis à `forum/rp/|forum/hrp/` : Communauté, Débats, Staff rouges ;
  - catégorie en dur au lieu de `getActiveTitleLabel()` : L4 rouge ;
  - repli final vidé : « sans entrée active » rouge ;
  - ancien `createBreadcrumb` rétabli : « un seul fil, famille commune » rouge ;
  - `replyLink` forcé à vrai : fermé sans lien rouge ; « Répondre » conditionné au cadenas : fermé + lien rouge ;
  - garde « Nouveau sujet » élargie à `body.page-forum` : sous-forum rouge ;
  - fond de « Nouveau sujet » remis à `transparent` : « standard » rouge ; fond de « Répondre » muté : « primaire » rouge ;
  - `min-height: 44px` retiré et règle générique neutralisée : cible rouge ;
  - un `.forum-thread-action` élargi à `min-width: 400px` : débordement rouge ;
  - couleur du texte de « Nouveau sujet » mutée vers un gris clair : contraste rouge ;
  - module appelé hors `isMobileMode()` : bureau 768 rouge ; seuil 767 sans transformation : seuil rouge ;
  - barre du bas non insérée : « barre en bas » rouge ;
  - chaque masque retiré : la suite masquée rouge.
- Largeurs : 375×667, 767, 768, 769, 1280 ; bascule dans le même onglet. Variantes : Kraland clair et Empire Brun sombre, 16 variantes pour le contraste.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, clair et sombre : Communauté, Débats, Staff, fermé, `forum-sujet`.
- **hitl :** Arnaud valide le relevé (inventaire §1), notamment Staff inaccessible et « répondre » présent sur les sujets fermés. Consigné dans `revue-manuelle.md` ; le build ne l'attend pas.
- Arnaud relit les Ask First tranchés (prudents) dans `revue-manuelle.md`.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | template :7202, :7217-7219 | En Communauté, Débats et Staff mobiles, les liens natifs « lien » (`fa-link`) et « liste des messages » (`fa-th-list`) disparaissent, alors que la Boundary dit « aucune capacité retirée » | fondé | defer | C'est déjà le rendu RP/HRP de la base, et le ticket étend ce rendu. Les rendre ici seulement casserait la parité des catégories. Choix produit : question posée à Arnaud (revue-manuelle, Ticket 6.4), report dans deferred-work |
| 2 | quick | forum-index.mjs:746-747, :761 | `composantsSujet` neutralise aussi le bundle courant : forum-index ne voit plus une régression de couleur de « Nouveau sujet » | fondé | patch (fixed) | Même argument d'`EMPREINTE` pour la base et le courant ; la Boundary veut des masques sur la base seulement |
| 3 | quick | forum-activite.mjs:979 | `k.h <= 44` ne prouve pas que le courant tient sur une ligne : 2 lignes en 13 px font environ 36 px | fondé | patch (fixed) | Seul `eLong` détecte la perte du `nowrap` |
| 4 | quick | forum-activite.mjs:984 | `m.cadenas == [true]` n'a pas de contre-épreuve propre | fondé | patch (fixed) | Boundary l.71 |
| 5 | quick | lib/variantes.mjs:643 | `AVANT_TICKET63` ne détecte plus que le préfixe de garde, plus le fil lui-même | fondé | patch (fixed) | Robustesse : une règle future sous la même garde le fausserait |
| 6 | quick | kraland-theme.css:13401-13405 | « Nouveau sujet » standard n'a pas d'état de survol ; `a:hover` (0,1,1) le souligne | fondé | patch (fixed) | DESIGN, bouton standard au survol `header-tint` (`.btn-default` l.2391-2413) |
| 7 | gates | cartes-pastilles.mjs, fragment `forum` | test:all : 4 FAIL « messages égaux au bundle de base », sujet à 375 et 767 px ; les messages sont 12 px plus haut (316 contre 328) | fondé | patch (fixed) | Écart voulu du Plan Change Log (marge du fil 16 → 4 px) ; tous les styles égaux ; la suite compare des positions absolues |

## Result

- Le sujet mobile de Communauté, Débats et Staff a le même en-tête que RP/HRP : fil commun (`createForumBreadcrumb`, catégorie lue dans la liste latérale), barre « Répondre » primaire et « Nouveau sujet » standard de 44 px, en haut et en bas. « Répondre » n'apparaît que si le lien natif existe. Le bureau est égal à la base. Aucun `!important` ajouté (3290).
- 4 fixtures synthétiques (communaute, debats, staff, ferme), construites sur le relevé en lecture seule du site réel. Staff a une structure supposée (accès refusé pour ce compte).
- Revue quick et gates : 7 constats, 6 corrigés, 1 reporté (liens « lien » et « liste des messages » absents du sujet mobile : question posée à Arnaud, deferred-work).
- Gates : build, lint:css, lint:js, test:router 0 ; skills identiques ; `npm run test:all` 13167 ok, 0 FAIL.
- Hitl en attente : validation du relevé (inventaire §1) et captures manuelles par Arnaud.
