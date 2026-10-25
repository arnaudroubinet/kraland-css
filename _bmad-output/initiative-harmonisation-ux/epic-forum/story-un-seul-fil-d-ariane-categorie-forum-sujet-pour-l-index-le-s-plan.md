---
title: 'Un seul fil d''Ariane « Catégorie › Forum › Sujet » pour l''index, le sous-forum et le sujet (H12.3)'
type: 'feature'
ticket: '3'
created: '2026-10-25'
status: 'built'
baseline_revision: '5042afd186d0d1dd73002257030c768b85dbd2ee'
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
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s-inventaire.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/epic-forum/story-l-index-du-forum-reprend-la-presentation-du-sous-forum-plan.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/DESIGN.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/EXPERIENCE.md'
  - '_bmad-output/initiative-harmonisation-ux/ux-harmonisation/review-faisabilite.md'
  - '_bmad-output/initiative-harmonisation-ux/deferred-work.md'
  - '.claude/skills/tester-kraland-css/SKILL.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Sur mobile, le forum a aujourd'hui trois fils d'Ariane, construits par trois codes différents (inventaire §3) :

- **Index** (`createBreadcrumb` de ForumIndex:Presentation) : « ⏪ Tous les forums › Jeu (RP) ». Le courant est le texte du h1.
- **Sous-forum** (`transformSubforumHeader` de ForumHeader:MobileBreadcrumb) : « ⏪ Jeu (HRP) › Débuter ». Le lien est un clone du lien natif, icône « ⏪ » comprise. DESIGN › Fil d'Ariane veut le retrait de cette icône.
- **Sujet** (ForumThread:MobileBreadcrumb) : autre classe, `cssText`, catégorie en dur. Hors périmètre : le fil d'Ariane de l'en-tête de sujet revient à l'entrée 6.4.

Les deux premiers ont la même structure, mais leur CSS est en double (l.13700-13723 et l.14597-14621), avec deux `color: … !important` qui ne battent rien (§2.2). Deux défauts sont visibles :

- un titre long passe à la ligne, sans troncature (§1.3) ;
- la catégorie n'est pas lue dans la liste latérale native (L4). Si on renomme l'entrée active, le fil ne change pas (§1.4).

**Approach:** Une seule fonction de premier niveau, `createForumBreadcrumb(parents, currentText)`, construit la famille `forum-mobile-breadcrumb*` :

- les parents sont des liens en couleur du texte, de 44 px, sans icône ;
- le séparateur est « › » ;
- le courant est un `span` atténué, sans lien, tronqué sur une ligne.

L'index et le sous-forum appellent cette fonction. La catégorie vient de `getActiveTitleLabel()` (L4), avec un repli sur le texte natif.

Côté CSS, les deux blocs du fil deviennent une seule règle par élément, sous une garde `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right`. On y ajoute la troncature, et on retire les deux `!important` de couleur : le compte passe de 3292 à 3290.

Pour le sujet, le fil reste celui de la base. 6.4 reprendra la fonction.

La branche post/FAB garde un emploi : la page de réponse (§1.8). Elle reste donc telle quelle.

Les preuves vont dans un nouveau fragment `fil` de `forum-activite.mjs`. Les suites à base figée reçoivent un masque CSS et DOM, posé sur la base seulement.

## Boundaries & Constraints

**Always:**
- L'annexe d'inventaire fait foi (§1 mesures, §2 règles, §4 assertions). Tout écart va au Plan Change Log avec sa raison.
- P1 option 4 : réécrire les règles d'origine, sans règle concurrente plus spécifique.
  - Les deux blocs du fil (l.13700-13723, l.14597-14621) deviennent une seule série de règles, à la place du bloc de l'index. Les règles du fil du bloc sous-forum sont supprimées.
  - Aucun `!important` nouveau. Les deux `color: var(--kr-text-primary) !important` du lien sont retirés, et le compte passe à 3290. Un CDP au build doit prouver que la couleur du lien reste `--kr-text-primary` (règle gagnante (1,1,0) contre `a:link` (0,1,1)).
  - Le h1, `.forum-subforum-head` et `.forum-subforum-title` ne changent pas (§5.3).
- Mobile en `@media (max-width: 767px)`, aucune règle globale. Garde de page en `:where(…)` : `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right`.
  - Cette garde exclut la page de réponse : elle n'a ni `kr-subforum` ni `kr-page-forum-index`.
  - Le bureau ne reçoit rien et reste égal à la base `5042afd`.
- Fonction commune :
  - section de premier niveau « FIL D'ARIANE DU FORUM (H12.3) », placée avant ForumHeader (l.5409), hors InitQueue ;
  - signature `createForumBreadcrumb(parents, currentText)`, avec `parents = [{ label, href }]` ;
  - elle rend `div.forum-mobile-breadcrumb`. Chaque parent devient `a.forum-mobile-breadcrumb-link`, avec `href` et texte seuls. Chaque séparateur est un `span.forum-mobile-breadcrumb-sep` avec `aria-hidden="true"` et « › » (attribut de la base, gardé). Le courant est un `span.forum-mobile-breadcrumb-current` ;
  - aucune icône, aucun `style` en ligne, aucune lecture de la largeur.
- Catégorie (L4) : `getActiveTitleLabel()`, section IDENTITÉ l.8380.
  - Sous-forum : le lien garde le `href` natif. Son libellé est la catégorie, avec un repli sur le texte du lien natif, débarrassé de « ⏪ » et de l'icône.
  - Index : « Tous les forums › catégorie ». La catégorie a pour repli le texte du h1.
  - La liste latérale native n'est ni modifiée ni déplacée.
- Troncature : le conteneur est en `flex-wrap: nowrap`. Le lien est en `flex: 0 0 auto; white-space: nowrap`. Le courant est en `flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap`.
- Contrôles du fragment `fil` (`forum-activite.mjs`) :
  - chacun peut échouer et a une contre-épreuve nommée (Verification) ;
  - pages : `rp`, `communaute`, `debuterNatif`, `sujet` et `reponse` de l'inventaire. Les fixtures dérivées sont faites en mémoire : `#col-left` remplacé par `forum-colonne-native-hrp.html`, titre long, libellé renommé ;
  - cibles : lien ≥ 44 px de haut, et `elementFromPoint` au centre du lien tombe dans ce lien ;
  - contraste ≥ 4,5:1 dans les 16 variantes, par `CONTRASTE()` ;
  - seuils à 767, 768 et 769, et bascule 768 → 767 → 768 → 767 dans le même onglet, avec 1 300 ms entre deux rechargements.
- Repères cités par 3 suites (`forum-mobile-breadcrumb`, `aria-hidden`, `kr-page-forum-index`, `forum-sujet`, `forum-index-communaute`, `site-annonces-20101`, `min-height`, `kr-text-*`) :
  - ils ne sont jamais écrits en clair dans `forum-activite.mjs` ;
  - ils passent par `REPERES_FIL_TICKET63` et `ACTIVITE_TICKET62` de `lib/variantes.mjs` ;
  - le relevé `TOKEN_RE` est refait sur la suite finie. Aucun jeton ne passe de 3 à 4 suites citantes.
- Masques :
  - ils sont posés sur le bundle de base seulement, jamais sur le bundle courant, et seulement si `AVANT_TICKET63(base)` ;
  - chaque masque porte en commentaire sa condition de retrait : « retirer quand la base de comparaison de la suite (`COMMIT_AVANT` de `forum-index.mjs`, `COMMIT_ECHELLE_FORUM` et `COMMIT_NETTOYAGE` de `typographie-formes.mjs`) est réalignée sur un SHA qui contient 6.3 ; le réalignement est porté par le sweep 6.7 ou par l'action A4 de la rétro 5 (les deux sont des tickets à venir) ». Jamais « quand le bundle de base contient l'entrée ».
- Fixtures synthétiques du dépôt seulement. Les variantes de page sont faites en mémoire dans la suite, jamais dans une nouvelle capture HTML brute.

**Ask First:**
- Retrait de « ⏪ » sur l'index aussi. Le plan le fait, au titre du « même rendu aux trois niveaux » du `verify`. DESIGN ne le demande qu'au sous-forum. À confirmer avant le build.
- Libellé ou présence de « Tous les forums » comme premier niveau de l'index. Le plan les garde (choix de 6.1).
- Écart avec le `verify` du ticket. Celui-ci demande pour `forum-sujet` « même classe et même rendu aux trois niveaux ». Le plan laisse le sujet sur sa classe et son rendu de base, selon la consigne : « Le fil d'Ariane de l'en-tête de sujet est hors périmètre : il revient à l'entrée 6.4. » Le sujet est vérifié égal à la base. Le critère complet passe à 6.4.
- Branche post/FAB (page de réponse, FAB hors forum sur `/regles/avancees`) : la faire passer à la fonction commune, ou retirer le FAB. Le plan n'y touche pas (§1.8).
- Masques ou retouches de `forum-index.mjs` (hors-périmètre) et de `typographie-formes.mjs` (`echelle-forum`, `nettoyage`), au-delà de ce que prévoit Tasks. Tout seuil ou toute tolérance changés.
- Retirer le style en ligne `!important` du h1 du sous-forum (`forumHeading.style.cssText`), ou fusionner les règles du h1 et de `.forum-subforum-*` (M8, H6.3).
- Couleur des liens du fil en accent (Q28.1). Le plan garde la couleur du texte, comme la base.

**Never:**
- Toucher ForumThread:MobileBreadcrumb, la classe `forum-thread-mobile-breadcrumb` ou le rendu du sujet.
- `!important` nouveau ; règle `:focus` ou focus clavier ; attribut ARIA nouveau.
- Modifier, masquer ou déplacer la liste latérale native. Écrire une catégorie en dur.
- Une règle de fil hors `@media (max-width: 767px)`. Une garde qui atteint la page de réponse.
- Capture HTML brute dans le dépôt. Site réel, cloche, `/report`, Chrome 9222/9223.
- Git modifiant l'arbre, l'index ou le stash. `test:all` (orchestrateur).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Index | `rp`, `communaute`, 375 et 767 | 1 seul conteneur de fil (`forum-mobile-breadcrumb`, `forum-thread-mobile-breadcrumb` ou `.breadcrumb`) ; « Tous les forums › Jeu (RP) » / « … › Communauté », sans icône ; lien ≥ 44 de haut, `elementFromPoint` → lien ; courant `span`, sans lien, une ligne | base : icône présente (rouge) ; retrait sur l'index soumis à Ask First |
| Sous-forum | `debuterNatif`, 375 et 767 | « Jeu (HRP) › Débuter », sans « ⏪ » ni `fa-backward` ; `href` `forum/hrp` ; mêmes classes et mêmes styles calculés du fil que l'index (taille, graisse, couleurs, gap, hauteur du lien) | base : icône (rouge) |
| Sous-forum sans entrée active | `debuter`, 375 | repli : « Jeu (HRP) » lu dans le lien natif, sans « ⏪ » | libellé vide ou « undefined » : FAIL |
| Libellé L4 changé | `debuterLibelle`, `rpLibelle`, 375 | « Hors Jeu › Débuter » et « Tous les forums › Rôle Jeu » | base : fil inchangé (rouge) |
| Titre long | `debuterLong`, 375 et 767 | courant sur une ligne (hauteur ≤ 1,5 × interligne), `scrollWidth > clientWidth`, `text-overflow: ellipsis` ; conteneur ≤ 44 de haut ; aucun débordement horizontal de `#col-right` | base : 2 lignes, conteneur 76,6 (rouge) |
| Contraste | `rp`, `debuterNatif`, 375, 16 variantes | lien, séparateur et courant ≥ 4,5:1 | non-régression (base ≥ 5,44) ; contre-épreuve obligatoire |
| Sujet | `sujet`, 375 et 767 | égal à la base `5042afd` : 1 conteneur `forum-thread-mobile-breadcrumb`, même texte, mêmes styles calculés | — |
| Page de réponse | `reponse`, 375 et 768 | égale à la base : fil en `cssText`, aucun FAB, rien au bureau | garde CSS ou fonction commune qui l'atteint : FAIL |
| Hors forum | `regles`, 375 | égal à la base (fil et FAB « + ») | — |
| Seuils | 767, 768, 769 ; bascule 768 → 767 → 768 → 767 | 767 : fil commun ; 768 et 769 : aucun fil, égal à la base ; après chaque bascule, l'état attendu de la largeur | — |
| Bureau | `rp`, `debuterNatif`, `sujet`, 768, 769, 1280 | égal au bundle `5042afd` (empreinte de `#col-right`) | — |

</frozen-after-approval>

## Code Map

- Inventaire : annexe `story-un-seul-fil-d-ariane-categorie-forum-sujet-pour-l-index-le-s-inventaire.md`.
- `kraland-userscript-template.js` (lignes de `5042afd`, à revérifier) :
  - l.5409 : début de ForumHeader:MobileBreadcrumb. La nouvelle section « FIL D'ARIANE DU FORUM (H12.3) » se place juste avant ;
  - l.5434-5470 : `transformSubforumHeader` (cible : clone du lien, séparateur et courant remplacés par l'appel) ;
  - l.5512-5621 : branche post/FAB (lue, non touchée) ;
  - l.5629-5707 : ForumIndex:Presentation. `createBreadcrumb` (l.5658) est remplacé par l'appel, `ALL_FORUMS_LABEL` est gardé ;
  - l.7093-7327 : ForumThread:MobileBreadcrumb (lu, non touché) ;
  - l.8365-8384 : `findActiveTitleTextNode`, `getActiveTitleLabel` (lus, appelés).
- `kraland-theme.css` :
  - l.13694-13723 : bloc L2 du sous-forum. Les règles du fil (l.13700-13723) sont supprimées. Le h1 et `.forum-subforum-*` restent ;
  - l.14584-14621 : bloc de l'index. Les règles du fil reçoivent la garde fusionnée et la troncature, et perdent leur `!important`. Le commentaire l.14584 est mis à jour (sans « ⏪ »).
- Tests :
  - `tests/e2e/forum-activite.mjs` : nouveau fragment `fil`. Il réutilise `ouvrir`, `PAGES`, `check`, `mapLimit` et `ECART_RECHARGEMENT_MS`. Une base figée `COMMIT_FIL = '5042afd'` est ajoutée pour `fil`, à côté de `COMMIT_AVANT = '0523d7f'` ;
  - `tests/e2e/lib/variantes.mjs` : on ajoute `REPERES_FIL_TICKET63` (repères), le masque CSS `FIL_TICKET63`, le masque DOM `retirerIconeFilTicket63` et le détecteur `AVANT_TICKET63`. Modèles : `ACTIVITE_TICKET62` l.549, `LIGNE_INDEX_TICKET62` l.569, `AVANT_TICKET62` l.576, `CONTRASTE()` l.613 ;
  - `tests/e2e/forum-index.mjs` : hors-périmètre l.737-758 (`COMMIT_AVANT = '81512a3'`, `EMPREINTE` l.586) ;
  - `tests/e2e/typographie-formes.mjs` : `echelle-forum` l.1187-1205 (`COMMIT_ECHELLE_FORUM` l.1006) et `nettoyage` (`COMMIT_NETTOYAGE` l.1660, masques empilés l.1870+) ;
  - `tests/e2e/sous-forum.mjs` : `HEADER` l.372-414 (lu, vert attendu) ;
  - `tests/e2e/lib/router.mjs` : `SUITES` l.98, `KEYWORDS` l.164 / l.182 / l.209, `SECTIONS` l.214-228 ;
  - `tests/e2e/lib/router.test.mjs` : cas l.96, modèle l.522-539 ;
  - `.claude/skills/tester-kraland-css/SKILL.md` et `.hermes/skills/tester-kraland-css/SKILL.md` : ligne de zone `forum-activite`.

## Tasks & Acceptance

**Execution:**
- [ ] Rouge avant. Extraire hors dépôt le bundle de `5042afd` (`git show 5042afd:kraland-userscript-main.user.js > /tmp/kr63/base.user.js`). Écrire d'abord le fragment `fil` (tâche suivante), puis le lancer avec `KR_SCRIPT=/tmp/kr63/base.user.js KR_FRAG=fil`. `kr-theme-enabled` est vérifié avant toute mesure. Les FAIL attendus sont listés en Verification.
- [ ] `tests/e2e/forum-activite.mjs`, fragment `fil`, aux largeurs 375 et 767 :
  - un seul conteneur de fil par page (index, sous-forum, sujet) ;
  - pour l'index et le sous-forum : classes de la famille, aucune `fa-backward` ni « ⏪ », texte attendu, `href` du lien, courant `span` sans `a` ;
  - hauteur du lien ≥ 44 et `elementFromPoint` au centre du lien ;
  - parité des styles calculés du fil entre l'index et le sous-forum ;
  - repli `debuter` ; L4 (`debuterLibelle`, `rpLibelle`) ; titre long ;
  - contraste dans les 16 variantes (375) ;
  - sujet et réponse égaux à `5042afd` ;
  - seuils et bascule ;
  - bureau 768, 769, 1280 égal à `5042afd` ; `regles` égal à la base.
  Le réseau est confiné, Bootstrap vient du vendor. Les repères partagés sont importés de `lib/variantes.mjs`.
- [ ] `kraland-userscript-template.js` :
  - nouvelle section `createForumBreadcrumb(parents, currentText)` (Boundaries) ;
  - `transformSubforumHeader` : `createForumBreadcrumb([{ label: getActiveTitleLabel() || <texte du lien natif sans ⏪>, href: backLink.getAttribute('href') }], titleText)` ;
  - ForumIndex:Presentation : `createForumBreadcrumb([{ label: ALL_FORUMS_LABEL, href: allLink.getAttribute('href') }], getActiveTitleLabel() || titleText)`, puis suppression de `createBreadcrumb`.
- [ ] `kraland-theme.css` :
  - suppression des règles du fil l.13700-13723 ;
  - règles du fil de l'index : garde `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right`, troncature (Boundaries), `!important` de couleur retiré ;
  - commentaire mis à jour ;
  - CDP sur le lien et le courant (règle gagnante, couleur) ;
  - `grep -c '!important'` = 3290.
- [ ] `tests/e2e/lib/variantes.mjs` :
  - `REPERES_FIL_TICKET63` : classes de la famille, classe du fil du sujet, sélecteur de l'entrée active, chemin de la réponse, fixture de la colonne native ;
  - `FIL_TICKET63` : miroir littéral des déclarations de troncature, sous `@media (max-width: 767px)` ;
  - `retirerIconeFilTicket63` : script d'init. Un `MutationObserver` retire `i.fa-backward` dans `.forum-mobile-breadcrumb-link` dès que le fil existe, et réécrit aussi le libellé du lien du sous-forum si la base le lit autrement ;
  - `AVANT_TICKET63` : chaîne minifiée relevée dans le bundle construit (garde fusionnée ou troncature), absente de `81512a3`, `d953969`, `00b0786` et `5042afd` ;
  - condition de retrait en commentaire (Boundaries).
- [ ] Masques sur la base seulement, si `AVANT_TICKET63(base)` :
  - `forum-index.mjs` hors-périmètre (sous-forum 375, base `81512a3`) : `FIL_TICKET63` et `retirerIconeFilTicket63`. Il faut une option de `open` (CSS et script d'init) ;
  - `typographie-formes.mjs` `echelle-forum` (index RP et sous-forum 375) et `nettoyage` (sous-forum 375 et 767) : empilés sur les masques existants, avec une option de script d'init pour le masque DOM.
  Pour chaque masque : rouge sans lui, vert avec lui. La retouche des harnais (option de script d'init) est consignée au Plan Change Log.
- [ ] Suites existantes après le 1er `test:zone` : `sous-forum.mjs`, `palette-nation.mjs`, les autres fragments de `typographie-formes.mjs` et de `forum-activite.mjs`. Le vert est attendu sans retouche (prototype, inventaire §5.2). Une retouche nécessaire va au Plan Change Log. Un seuil ou une tolérance changés passent par Ask First.
- [ ] `tests/e2e/lib/router.mjs` :
  - `SUITES` : fragment `['fil']` ajouté à `forum-activite` ;
  - `KEYWORDS` : nouvelle entrée `[/forum-mobile-breadcrumb|createForumBreadcrumb/, ['forum-activite']]`, les entrées existantes restent telles quelles ;
  - `SECTIONS` : `[/^FIL D'ARIANE DU FORUM/, ['forum', 'sous-forum', 'forum-activite']]` ; `forum-activite` est ajouté à `^MODULE : ForumHeader:` et `^MODULE : ForumIndex:`.
  Ajouter un cas dans `router.test.mjs` (hunk CSS de la règle fusionnée, hunk de la nouvelle section), mettre à jour les cas existants qui changent, puis lancer `npm run test:router`.
- [ ] Skill `tester-kraland-css` : compléter la ligne `forum-activite` (fil d'Ariane commun, L4, troncature) dans les deux copies, puis `diff -r .hermes/skills .claude/skills`.
- [ ] `npm run build`, contre-épreuves, `lint:css`, `lint:js`, compte `!important`.

**Acceptance Criteria:**
- Given `forum-index-rp`, `forum-index-communaute` et `sous-forum-debuter` (colonne native en mémoire) à 375 et 767 px, when la page est prête, then il y a un seul conteneur de fil, de classe `forum-mobile-breadcrumb`. Les liens sont `forum-mobile-breadcrumb-link`, séparés par « › ». Le courant est un `span` sans lien. Il n'y a aucun « ⏪ » ni aucune `fa-backward`.
- Given le sous-forum et l'index à 375 px, when on compare les styles calculés du fil, then taille, graisse, couleurs, gap, hauteur du lien et `white-space` sont égaux.
- Given chaque lien du fil, when on mesure, then il fait au moins 44 px de haut, et `elementFromPoint` à son centre tombe dans ce lien.
- Given un titre de sous-forum de 86 caractères à 375 et 767 px, when la page est prête, then le courant tient sur une ligne et finit par des points de suspension. Le conteneur fait au plus 44 px de haut, sans débordement horizontal.
- Given l'entrée active de la liste latérale renommée « Hors Jeu » (sous-forum) ou « Rôle Jeu » (index), when la page est prête, then le fil affiche ce libellé. Sans entrée active, il affiche le texte du lien natif sans « ⏪ ».
- Given les 16 variantes à 375 px, when on mesure lien, séparateur et courant, then chacun est ≥ 4,5:1.
- Given `forum-sujet` et la page de réponse à 375 et 767 px, when on compare au bundle `5042afd`, then le rendu est égal.
- Given 768, 769 et 1280 px, then l'index, le sous-forum et le sujet sont égaux au bundle `5042afd`. La bascule 768 → 767 → 768 → 767 donne le fil à 767 et aucun fil à 768.
- Given `forum-index.mjs`, `typographie-formes.mjs` (`echelle-forum`, `nettoyage`), `sous-forum.mjs` et `palette-nation.mjs`, when ils tournent, then ils sont verts. Les masques ne sont posés que sur le bundle de base.
- Given `kraland-theme.css`, when on compte `!important`, then 3290. Les règles du fil existent une seule fois, sous `@media (max-width: 767px)`.
- Given `npm run test:router`, then vert. `diff -r .hermes/skills .claude/skills` est vide.

## Implementation Notes

Construit le 2026-10-25 sur `feature/next` (base `5042afd`, arbre non commité).

**Template (`kraland-userscript-template.js`).**
- Nouvelle section de premier niveau « FIL D'ARIANE DU FORUM (H12.3) », juste avant ForumHeader:MobileBreadcrumb, hors InitQueue. `createForumBreadcrumb(parents, currentText)` rend `div.forum-mobile-breadcrumb`, puis pour chaque parent un `a.forum-mobile-breadcrumb-link` (`href` et un seul `span.forum-mobile-breadcrumb-label` portant le texte, depuis la revue) suivi d'un `span.forum-mobile-breadcrumb-sep` (`aria-hidden="true"`, « › »), puis `span.forum-mobile-breadcrumb-current`. Aucune icône, aucun style en ligne, aucune lecture de largeur.
- `transformSubforumHeader` : le clone du lien natif, le séparateur et le courant sont remplacés par l'appel. Libellé : `getActiveTitleLabel() || backLink.textContent.trim() || CATEGORY_FALLBACK_LABEL` (`'Catégorie'`, depuis la revue). Le h1 (`cssText` en `!important`), `.forum-subforum-head` et les deux actions « + Nouveau sujet » sont inchangés.
- ForumIndex:Presentation : `createBreadcrumb` supprimé, appel `createForumBreadcrumb([{ label: ALL_FORUMS_LABEL, href }], getActiveTitleLabel() || titleText)`. `ALL_FORUMS_LABEL` est gardé (ordinateur).
- Branche post/FAB et ForumThread:MobileBreadcrumb non touchées. Commentaires d'en-tête mis à jour (plus de « ⏪ » ni de « ◀◀ »).

**CSS (`kraland-theme.css`).**
- Règles du fil du bloc L2 du sous-forum supprimées (h1, `.forum-subforum-head` et `.forum-subforum-title` gardés).
- Règles du fil du bloc de l'index réécrites sous `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right`, avec la troncature. Le séparateur et le courant ont désormais chacun leur règle. Les deux `color: var(--kr-text-primary) !important` sont retirés : `grep -c '!important'` = 3290.
- CDP (`CSS.getMatchedStylesForNode`, index RP et sous-forum à 375) : la règle gagnante pour `color` du lien est la règle fusionnée, après `a:link, a:visited => var(--kr-text-accent)`. Couleur calculée du lien = `--kr-text-primary` (rgb(15, 23, 36)), courant = `--kr-text-secondary` (rgb(99, 106, 119)).

**Tests.**
- `forum-activite.mjs` : fragment `fil` (108 contrôles depuis la revue, 104 avant). Base `COMMIT_FIL = '5042afd'`, surchargeable par `KR_SCRIPT_AVANT_FIL`. En-tête mis à jour.
- `lib/variantes.mjs` : `REPERES_FIL_TICKET63`, `FIL_TICKET63`, `retirerIconeFilTicket63`, `AVANT_TICKET63` (chaîne `:where(html.kr-page-forum-index,body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb`, absente de `81512a3`, `d953969`, `00b0786` et `5042afd`, présente une fois dans le bundle construit).
- Masques sur la base seulement : `forum-index.mjs` (option `fil` de `open`), `typographie-formes.mjs` (option `init` de `ouvrir`, `releverTailles` et `ouvrirNettoyage`).
- `lib/router.mjs` : fragment `['fil']`, entrée `KEYWORDS`, section `FIL D'ARIANE DU FORUM`, `forum-activite` ajouté à ForumHeader et ForumIndex. `router.test.mjs` : un cas nouveau, deux cas mis à jour.
- Skill `tester-kraland-css` (deux copies) : ligne « Activité du forum » complétée (`KR_FRAG=fil`).

**Preuves (commandes et codes de sortie).**
- Rouge avant : `KR_SCRIPT=/tmp/kr63/base.user.js KR_FRAG=fil node tests/e2e/forum-activite.mjs` → exit 1, 78 ok, 26 FAIL (icône de retour 18, libellé L4 4, courant sur deux lignes 2, troncature 2).
- Vert : `KR_FRAG=fil node tests/e2e/forum-activite.mjs` → exit 0, 104 ok.
- `npm run build` → exit 0 (validation passée).
- `npm run test:zone -- forum-activite forum sous-forum typographie-formes` → exit 0, 59 fragments, 0 FAIL.
- `npm run test:zone -- palette-nation` → exit 0, 1354 ok.
- `npm run test:router` → exit 0. `npm run lint:css` → exit 0. `npm run lint:js` → exit 0 (un avertissement préexistant dans `report-non-lu.mjs`).
- `diff -r .hermes/skills .claude/skills` → vide. Relevé TOKEN_RE avant/après : aucun jeton ne passe de 3 à 4 suites citantes.
- Masques : `forum-index.mjs` sans masque → exit 1 (sous-forum 375, 2 variantes : 412 éléments au lieu de 413) ; avec → hors-périmètre exit 0, 43 ok. `typographie-formes.mjs` `echelle-forum,nettoyage` sans masque → exit 1, 8 FAIL (index RP et sous-forum 375 ; sous-forum 375 et 767) ; avec → exit 0, 705 ok.
- Contre-épreuves (copies mutées du bundle, `KR_FRAG=fil`, toutes exit 1) : icône gardée (26 FAIL, « icône de retour ») ; catégorie en dur « Jeu (HRP) » (2 FAIL, L4 `debuterLibelle`) ; `min-width: 0` retiré du courant (4 FAIL, titre long) ; `white-space: nowrap` retiré (4 FAIL, titre long) ; courant en `#d0d0d0` (16 FAIL contraste, 1,54 en clair) ; `min-height` du lien retiré et `a:not(.list-group-item)` neutralisé (18 FAIL, lien de 14,3 px) ; second fil inséré à l'index (37 FAIL, « un seul conteneur ») ; garde réduite à `body.page-forum` et branche post routée vers la fonction (8 FAIL, dont réponse 375) ; fonction appelée hors `isMobileMode()` à l'index (7 FAIL, bureau 768/769/1280 et bascule) ; séparateur du fil du sujet muté (4 FAIL, sujet égal à la base).

**Corrections de revue (Review Triage Log, constats 3 à 6).**
- Constat 3 : repli final `CATEGORY_FALLBACK_LABEL = 'Catégorie'` dans `transformSubforumHeader`, `.replace('⏪', '')` retiré. Page en mémoire `debuterIcone` (sous-forum sans entrée active, bouton natif réduit à `<i class="fa fa-backward"></i>`) : fil « Catégorie › Débuter », lien non vide (2 contrôles).
- Constat 4 : règle d'origine du lien réécrite : `min-width: 0; max-width: 50%` ajoutés, `flex: 0 0 auto` et `white-space: nowrap` gardés ; nouvelle règle `.forum-mobile-breadcrumb-label { overflow: hidden; text-overflow: ellipsis; }`. Aucun `!important` (3290). Page en mémoire `debuterCategorieLongue` (entrée active de 80 caractères), 375 px : aucun débordement de `#col-right` ni de la page, libellé tronqué par une ellipse, lien ≤ moitié du fil, courant « Débuter » entier (2 contrôles). Titre long : le libellé court du lien n'est pas tronqué (contrôle ajouté au cas existant).
- Masques mis à jour : `FIL_TICKET63` reprend `min-width: 0; max-width: 50%` du lien et la règle du libellé ; `retirerIconeFilTicket63` place le texte du lien dans un `span.forum-mobile-breadcrumb-label`. `REPERES_FIL_TICKET63.libelle` ajouté.
- Constat 6 : libellé du contrôle `echelle-forum` de `typographie-formes.mjs` : « masques ECHELLE_TICKET47, TITRE_FORUM_BUG10, FIL_TICKET63 et retirerIconeFilTicket63 sur le bundle de base… ».
- Rouge avant les corrections : copie du bundle sans le repli final, sans `min-width`/`max-width` du lien et sans la règle du libellé (`avant-revue`) → exit 1, 104 ok, 4 FAIL (`debuterCategorieLongue` ×2, débordement de `#col-right` ; `debuterIcone` ×2).
- Vert : `KR_FRAG=fil` → exit 0, 108 ok. Base `5042afd` → exit 1, 78 ok, 30 FAIL.
- Contre-épreuves de la revue (`KR_SCRIPT=<copie> KR_SCRIPT_AVANT_FIL=<base> KR_FRAG=fil`, toutes exit 1) :
  - `sans-repli-final` (repli « Catégorie » retiré) : 2 FAIL, `debuterIcone` ;
  - `sans-max-width` (`max-width: 50%` retiré du lien) : 2 FAIL, `debuterCategorieLongue`, « débordement horizontal de #col-right » ;
  - `libelle-sans-ellipse` (`text-overflow` retiré du libellé) : 2 FAIL, `debuterCategorieLongue`, « troncature du libellé du lien » ;
  - constat 5, parité (l.671) : `parite-sous-forum` (règle ajoutée `:where(body.page-forum.kr-subforum) #col-right .forum-mobile-breadcrumb-link { font-weight: 700 }`) : 4 FAIL, « index RP et sous-forum, même fil », 375 et 767, deux variantes ;
  - constat 5, seuil (l.716) : `seuil-tactile` (détection mobile `window.innerWidth < 768 && navigator.maxTouchPoints > 0`) : 4 FAIL, « fil seuil … 767 px (non tactile) », rp et debuterNatif.
- Après corrections : `npm run build` → exit 0 ; `npm run test:zone -- forum-activite forum sous-forum typographie-formes` → exit 0, 6352 ok, 0 FAIL ; `npm run test:router` → exit 0 ; `lint:css` → 0 ; `lint:js` → 0 ; `grep -c '!important'` = 3290 ; `diff -r` des skills vide ; TOKEN_RE : aucun jeton ne passe à 4 suites. `palette-nation` non relancé (page sans fil du forum).
- Anciennes contre-épreuves rejouées sur le bundle corrigé (ancres mises à jour), toutes exit 1 : icône 30 FAIL, catégorie en dur 6, `min-width` du courant 4, `nowrap` du courant 4, gris clair 28, cible 18, second fil 37, garde post 8, hors mobile 7, sujet muté 4.

## Plan Change Log

- **Revue, constat 4 : le lien n'est plus « texte seul ».** Il porte un `span.forum-mobile-breadcrumb-label`. La règle mobile générique `a:not(.list-group-item) { display: inline-flex !important }` force le lien en flex ; `text-overflow` ne s'applique pas au texte nu d'un conteneur flex. Le contrôle de structure attend ce seul span (au lieu de 0 sous-élément).
- **Revue, constat 4 : priorité au niveau courant.** Le lien est borné à 50 % de la ligne (`max-width`), sans rétrécir en deçà de son contenu s'il est court (`flex: 0 0 auto`). Le courant garde au moins la moitié restante. `min-width: 0` sur le libellé testé inutile (`overflow: hidden` ramène le minimum automatique à 0) : non posé. `gap: 6px` du lien gardé (sans effet avec un seul enfant) : le retirer rendait rouge `nettoyage` sous-forum 375/767 (`column-gap normal au lieu de 6px`), sans masque à étendre.
- **Revue, constat 3 : repli final générique « Catégorie ».** Une catégorie réelle écrite en dur est interdite (Never). Choix consigné dans `revue-manuelle.md`.

- **Titre long de 85 caractères, pas 86.** Le titre écrit fait 85 caractères ; le contrôle cite la longueur réelle.
- **`scrollWidth > clientWidth` vérifié à 375 seulement.** À 767 px, le titre long tient en entier (environ 505 px de texte) : il n'y a rien à tronquer. À 767, le contrôle garde une ligne, `text-overflow: ellipsis`, `white-space: nowrap`, `overflow: hidden`, `min-width: 0px`, conteneur ≤ 44 et aucun débordement.
- **Ordre des contrôles du fragment.** Le contrôle commun (icône, structure) passe après le texte attendu et après les contrôles L4 et titre long. Sinon, sur la base, l'icône masquait les FAIL L4, deux lignes et troncature sous le même motif.
- **Retouche de harnais : option de script d'init.** `open` de `forum-index.mjs` reçoit `fil` (feuille `FIL_TICKET63` et script `retirerIconeFilTicket63`, si `AVANT_TICKET63(src)`). `ouvrir` de `typographie-formes.mjs` reçoit `init` ; `releverTailles` et `ouvrirNettoyage` le passent. Aucune tolérance ni aucun seuil changés.
- **`KR_SCRIPT_AVANT_FIL`.** Variable d'environnement de la base du fragment `fil`, distincte de `KR_SCRIPT_AVANT` (base `0523d7f` des autres fragments).
- **Cas du routeur mis à jour.** « couleurs de nation » : la fixture `palette-nation.html` route maintenant aussi `forum-activite` (page hors forum du fragment `fil`). « module ForumIndex » : zones `forum`, `forum-activite`, `sous-forum`.
- **P8.** `test:changed` s'élargit au total, car `lib/variantes.mjs` change (comme en 6.2). Non lancé ici.

## Design Notes

**Pourquoi une fonction de premier niveau.** `getActiveTitleLabel()` et `isMobileMode()` sont déjà au premier niveau de l'IIFE, et hissées. Une fonction au même niveau est appelable par ForumHeader (25), par ForumIndex (26) et, plus tard, par ForumThread (6.4), sans ordre de modules. Elle ne lit pas la largeur : chaque module garde sa propre décision mobile.

**Pourquoi garder la branche post/FAB.** Le ticket la retire « si elle n'a plus d'emploi ». Or la page de réponse `/forum/post/repondre…` a un h1 à deux liens, sans `#topics` (structure « réelle capturée » de `forum-mobile.mjs` l.129-131). Elle passe donc par cette branche (§1.8). La faire passer à la fonction commune changerait le rendu de la page de rédaction : c'est hors du `verify`, donc en Ask First. Le contrôle « réponse égale à la base » protège la garde CSS.

**Pourquoi `:where(html.kr-page-forum-index, body.page-forum.kr-subforum) #col-right`.** Les deux classes sont posées avant les fils : `kr-page-forum-index` dès le chemin, `kr-subforum` par ForumTopics:Status (24). `:where()` garde la spécificité (1,1,0) de `#col-right .x`. Elle reste plus forte que `a:link` (0,1,1), ce qui rend le `!important` de couleur inutile (§2.2). Le sélecteur `html :where(html.x)` est à éviter : il exige un `html` dans un `html` (§5.2).

**Pourquoi un masque DOM.** `EMPREINTE` (`forum-index.mjs`) et `MESURE_TAILLES` (`typographie-formes.mjs`) comptent tous les éléments de `#col-right`, invisibles compris. L'icône retirée fait passer le sous-forum de 413 à 412 éléments. Un `display: none` côté base ne change pas ce compte. Le masque retire donc l'icône sur la base, en plus du miroir CSS. C'est une retouche de harnais (option de script d'init), pas de seuil.

**Index et « Tous les forums ».** La fonction rend le même DOM aux deux niveaux. Garder « ⏪ » sur l'index demanderait une option d'icône, donc deux rendus. C'est en Ask First.

**Pièges :**
- P1 : MAX_CITING. Une 4e suite qui cite `forum-mobile-breadcrumb` en clair retire ce repère du routage par citation pour les trois autres.
- P2 : une feuille d'essai ajoutée au `<head>` perd à spécificité égale contre la peau. Les mesures se font sur le bundle construit.
- P3 : `sous-forum-debuter.html` n'a pas d'entrée active. Sans la colonne native en mémoire, le contrôle L4 passerait par le repli et ne prouverait rien.
- P4 : la troncature exige `min-width: 0` sur le courant, élément flexible. Sans lui, `text-overflow` n'agit pas.
- P5 : la bascule recharge la page. Il faut 1 300 ms entre deux redimensionnements (`ECART_RECHARGEMENT_MS`).
- P6 : « couvert » n'est pas « invisible ». `elementFromPoint` se mesure au centre du lien, après `scrollTo`.
- P7 : faux FAIL sous charge (rétro 4, F10). Rejouer la suite seule, machine calme.
- P8 : `test:changed` s'élargit au total quand `lib/variantes.mjs` change (comme en 6.2). C'est à consigner.

## Verification

**Commands:**
- `npm run build`.
- `npm run test:zone -- forum-activite forum sous-forum typographie-formes`.
- `npm run test:router`.
- `npm run lint:css` puis `npm run lint:js`, codes de sortie lus séparément.
- `grep -c '!important' kraland-theme.css` doit donner 3290.
- `diff -r .hermes/skills .claude/skills` doit être vide.
- Pas de `test:all` : il revient à l'orchestrateur.
- Rouge avant, sur le bundle de `5042afd` (`KR_SCRIPT`, `KR_FRAG=fil`). FAIL attendus :
  - « ⏪ » ou `fa-backward` présents (index et sous-forum, 375 et 767) ;
  - L4 : fil inchangé avec « Hors Jeu » et « Rôle Jeu » ;
  - titre long : courant sur deux lignes, conteneur de 76,6.
- Verts attendus sur la base :
  - un seul conteneur, liens de 44 et `elementFromPoint` ;
  - contraste ≥ 5,44 ;
  - parité index / sous-forum ;
  - sujet et réponse ;
  - seuils, bascule et bureau ;
  - repli du sous-forum sans entrée active : vert si le libellé est « Jeu (HRP) » sans « ⏪ » ; rouge sur la base à cause de l'icône.
- Contre-épreuves sur des copies mutées du bundle (`KR_SCRIPT`), chacune avec au moins un FAIL nommé :
  - icône gardée dans la fonction : contrôle « aucun ⏪ » rouge ;
  - catégorie en dur (« Jeu (HRP) ») au lieu de `getActiveTitleLabel()` : L4 rouge ;
  - `min-width: 0` ou `white-space: nowrap` retiré du courant : titre long rouge ;
  - couleur du courant mutée vers un gris clair : contraste rouge ;
  - `min-height: 44px` du lien retiré, et règle générique `a:not(.list-group-item)` neutralisée dans la copie : cible rouge ;
  - un second fil inséré dans l'en-tête : « un seul conteneur » rouge ;
  - garde CSS de la famille réduite à `body.page-forum`, plus la branche post routée vers `createForumBreadcrumb` : réponse rouge ;
  - fonction appelée hors `isMobileMode()` : bureau 768 rouge ;
  - texte du fil du sujet muté : « sujet égal à la base » rouge ;
  - chaque masque retiré : `forum-index.mjs` (hors-périmètre sous-forum), `typographie-formes.mjs` (`echelle-forum`, `nettoyage`) rouges.
- Largeurs : 375×667, 767, 768, 769, 1280. Bascule dans le même onglet. Variantes : Kraland clair et Empire Brun sombre partout, 16 variantes pour le contraste.

**Manual checks (if no CLI):**
- Captures hors dépôt à 375×667, en clair et en sombre : index RP, sous-forum avec la colonne native, titre long tronqué, sujet (égal à la base).
- Arnaud confirme les points Ask First, avant le build.

## Review Triage Log

| # | Lens | Location | Claim | Verdict | Route | Evidence |
|---|---|---|---|---|---|---|
| 1 | quick | revue-manuelle.md, section Ticket 6.3 | Le retrait de « ⏪ » à l'index est rangé à tort parmi les choix conservateurs : il change le rendu de l'index avant l'accord d'Arnaud | fondé | patch (fixed) | DESIGN ne le demande qu'au sous-forum. Choix gardé, car la parité est l'objet du ticket. La revue manuelle le présente maintenant comme un changement à confirmer, réversible (une icône à reposer à l'index) |
| 2 | quick | tickets.toml, entrée 3, `verify` | Le `verify` exige « même rendu aux trois niveaux », sujet compris ; le sujet passe à 6.4 sans que l'entrée soit amendée | fondé | patch (fixed) | `verify` amendé : le sujet est égal à la base ; Decision ajoutée dans epic-forum.md |
| 3 | quick | template, `transformSubforumHeader` (~l.5464) | Aucun repli final : sans entrée active et avec un bouton natif réduit à l'icône, le lien du fil est vide ; `.replace('⏪', '')` ne sert à rien | fondé | patch (fixed) | ForumIndex prévoit ce cas (l.5692) ; la base clonait le bouton |
| 4 | quick | kraland-theme.css ~l.14582-14593 | Un libellé de catégorie long déborde : le lien est en `flex: 0 0 auto; nowrap`, seul le courant rétrécit | fondé | patch (fixed) | Le libellé vient de la liste latérale du site (L4) ; les tests n'ont que des libellés courts |
| 5 | quick | forum-activite.mjs:671, :716 | Parité index/sous-forum et seuil 767 non tactile sans contre-épreuve nommée | fondé | patch (fixed) | Le plan l.82 exige une contre-épreuve par contrôle |
| 6 | quick | typographie-formes.mjs:1207 | Libellé du contrôle `echelle-forum` qui ne nomme pas `FIL_TICKET63` / `retirerIconeFilTicket63` | fondé | patch (fixed) | Masques posés l.1204-1205 |
| 7 | quick | /tmp/kr-63.diff | Diff de revue sans la copie `.hermes`, ni le bundle, ni version.json, ni revue-manuelle | écarté | dismiss | Fichiers générés ou copies : `diff -r` vide ; la revue manuelle est traitée en #1 |
| 8 | gates | cartes-pastilles.mjs, fragment `etiquettes`, contrôle statique | test:all rouge : le contrôle exige autant de priorités forcées que la base 59567f0, alors que 6.3 en retire 2 (8174 au lieu de 8176) | fondé | patch (fixed) | L'invariant de 5.5 est « aucun `!important` de plus » : contrôle passé à `<=`, libellé et commentaire d'en-tête alignés ; règles `:focus` toujours en nombre égal. Contre-épreuve : 3 `!important` injectés dans une copie du bundle, contrôle rouge |

## Result

- Index et sous-forum mobiles partagent un seul fil d'Ariane, construit par `createForumBreadcrumb` : catégorie lue dans la liste latérale (repli : bouton natif, puis « Catégorie »), courant sans lien et tronqué, lien borné à 50 % avec ellipse, aucun « ⏪ ». Une seule série de règles CSS ; 2 `!important` retirés (3290).
- Le sujet, la page de réponse (post/FAB) et le bureau sont égaux à la base. Le fil du sujet revient à 6.4 (`verify` amendé).
- Revue quick : 8 constats, 7 corrigés, 1 écarté (Review Triage Log).
- Gates (machine calme au départ) : build, lint:css, lint:js, test:router 0 ; skills identiques ; `npm run test:all` 12999 ok, 0 FAIL.
- À confirmer par Arnaud (revue-manuelle, Ticket 6.3) : « ⏪ » retiré à l'index, libellé de repli « Catégorie », lien borné à 50 %.
