---
title: 'La page Contacts reprend la carte de section et les boutons du forum'
type: 'feature'
ticket: '8'
created: '2026-10-29'
status: 'built'
baseline_revision: 'f48a01f'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 1
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problème :** /contacts n'a aucune garde de page. Sur mobile, le userscript lui applique par erreur la peau du sous-forum : fil d'Ariane, tête, « + Nouveau sujet » vers la catégorie 1, barre d'actions basse et style en ligne sur le h1. Les 6 boutons de catégorie sont perdus. Sur les deux supports, les boutons de catégorie portent les classes d'état de Bootstrap (danger, warning, info, success) hors de tout état (report 3.5).

**Approche :** le template pose `kr-page-contacts` sur `<html>`. Sur les deux supports, /contacts prend l'en-tête du kramail (entrée 3), la carte de section et des boutons standard ou primaire. La peau du forum posée par erreur est retirée, sans que le forum bouge.

## Boundaries & Constraints

**Always :** gardes en `:where(html.x)` ; mobile `@media (max-width: 767px)`, bureau `(min-width: 768px)` ; cibles ≥ 44 px sur mobile ; contraste tenu dans les 16 variantes ; fixture synthétique (aucun nom réel, aucun message privé, aucune capture brute).

**Never :** nouvel `!important` (compte de départ : 2958) ; modification du bundle à la main ; accès au site réel ; changement du rendu du forum ou du kramail.

## I/O & Edge-Case Matrix

| Scénario | Entrée / état | Attendu |
|---|---|---|
| Mobile 375 / 767 | /contacts | fil « Contacts › Membre fictif », titre, 6 boutons de catégorie ; ni forum-subforum-actions, ni forum-thread-actions, ni style en ligne ; en-tête et carte aux valeurs de la Réception |
| Bureau 1280 / 1440 | /contacts | h1 natif, boutons aux valeurs du bouton du kramail ; carte et contrôles aux valeurs de la Réception |
| Boutons | btn-danger, -warning, -info, -success | btn-default ; la catégorie courante en btn-primary ; aucune classe d'état dans #col-right |
| Cibles mobiles | boutons de ligne, case, pagination | ≥ 44 px atteints par elementFromPoint ; le toucher dans la cellule coche la case |
| Forum | sous-forum-debuter 375 px | en-tête mobile du forum inchangé |

</frozen-after-approval>

## Code Map

- `kraland-userscript-template.js`
  - `addPageTypeClass` (~l.821) : nouvelle branche `/^\/contacts(\/|$)/`, qui pose `kr-page-contacts`.
  - `ForumHeader:MobileBreadcrumb` / `transformForumHeader` (~l.5485) : sortie sur `kr-page-contacts`. C'est la source de la peau du forum (la route `#topics` mène à `transformSubforumHeader` : style en ligne, barre basse).
  - `ForumTopics:Pagination` / `initPagination` (~l.5183) : garde étendue à `kr-page-contacts`.
  - `Kramail:CharacterSwitcher` (~l.5743) : branche contacts sur mobile. `buildMobileHead(h1, [{label: getActiveTitleLabel() || 'Contacts', href: 'contacts'}], texte, span)`. Garde de `observeMobileMode` étendue.
  - Nouveau module `Contacts:Page` (priorité 27, après `Kramail:Liste`). Il remplace les classes d'état par `btn-default`, met la catégorie courante en `btn-primary` (chemin exact, sinon la 1re quand le chemin n'a pas de suffixe `/N`) et libelle les boutons sans texte (`data-kr-libelle` et un span de texte réel). Il nomme la recherche et « Afficher ». Sur mobile, un toucher dans la cellule de la case la coche.
- `kraland-theme.css`
  - Bloc « KRAMAIL - REFONTE MOBILE » (l.9150-9356) : `body.page-kramail` devient `:is(body.page-kramail, :where(html.kr-page-contacts) body)` (spécificité inchangée) pour l'en-tête, les boutons, le bouton primaire et la carte. Règle libellée (2 ter) étendue aux contacts.
  - Bouton mobile `h1 .btn-default` (l.9874) : même extension.
  - Fil et tête communs (l.14494-14550) : `html.kr-page-contacts` ajouté au `:where`.
  - « KRAMAIL — LISTE » : seuls l'enveloppe, les contrôles, l'info et la pagination s'étendent aux contacts (pas les lignes). Nouveau petit bloc CONTACTS sur mobile : tableau défilant dans la carte, boutons de ligne et cellule de case ≥ 44 px.
- `tests/e2e/fixtures/contacts.html` : fixture synthétique, déjà créée.
- `tests/e2e/kramail-theme.mjs` : fragments `contacts`, `contacts-boutons`, `contacts-couleurs`. Comparaison à `liste-reception`. En-tête du fichier à jour.
- `tests/e2e/lib/router.mjs` : enregistrement des fragments et de la fixture.

## Tasks & Acceptance

**Exécution :**
- [x] `tests/e2e/kramail-theme.mjs`, `router.mjs` : fragments rouges sur `/tmp/kr78/base.user.js`.
- [x] Template et CSS comme ci-dessus, puis `npm run build`.
- [x] Zones, lint, routeur ; doutes dans `revue-manuelle.md`.

**Critères d'acceptation :**
- Étant donné /contacts à 375, 767, 1280 et 1440 px, quand la page est prête, alors l'en-tête et la carte ont les mêmes valeurs calculées que la Réception.
- Étant donné les 16 variantes, alors les textes des boutons et de l'en-tête sont ≥ 4,5:1.

## Relevé de structure (lecture seule, 2026-10-28, sans capture brute)

Source : `/tmp/kr-releve-2026-10-28/releve.md`, sections « Contacts (`/contacts`) », « Contacts, personnages (`/contacts/<slug>-1`) » et « Contacts, structure native à 1280 ». La fixture `tests/e2e/fixtures/contacts.html` suit cette structure, avec des noms inventés.

- `#col-left` : `div#player-header-section.list-group` ; `span.list-group-item.active` « Contacts » ; liens `/contacts` et `/contacts/<slug>-1`.
- `h1.page-header` « <texte> » > `span.pull-right` > 6 `a.btn[data-toggle=tooltip]` à icône `i.fa.fa-user` :
  - `btn-default` `/contacts/<slug>-0` « Toutes les catégories » ;
  - `btn-danger` `/1`, `btn-warning` `/2`, `btn-info` `/3`, `btn-success` `/4` (« Catégorie n°N ») ;
  - `btn-default` `/5` « Catégories », avec texte.
- `form#list_msg.form-horizontal[action=/contacts]` (champs cachés a, t), puis un panneau `.panel.panel-default` et `#topics_wrapper` (DataTables : length, filter, `table#topics`, info, paginate).
- `thead` : `th.sorting_disabled[style=width:35px]` > `div.btn-group` (« + » : Tout sélectionner, Retirer) ; `th.sorting_asc` ; `th.sorting ×4`.
- `tbody tr[role=row][style="background: none"]` : `td.center > input[name="n[]"]` ; `td.sorting_1 > span.invisible + a.nomargin` ; `td > span#ajax-tN` ; `td ×3`. La ligne porte 4 `a.btn.btn-default` (37-42×34 px à 1280).
- Base à 375 px (défaut) : `h1[style="margin: 12px 16px !important; …"]`, `forum-mobile-breadcrumb` (lien vers `/contacts/<slug>-0`), `forum-subforum-head`, `forum-thread-actions.forum-subforum-actions-top` (« + » vers `/1`) : peau du sous-forum posée par `transformForumHeader`.

## Implementation Notes

- Déviation de méthode : la route calculée est `full` (> 100 lignes), mais la consigne demande « quick » sans checkpoint. Implémentation directe par l'agent de build, sans sous-agent d'implémentation. Revue « quick » par un relecteur indépendant, sur le diff depuis f48a01f, fichiers non suivis compris.
- Le libellé des catégories est lu dans le chemin, pas dans le `title` : `disableTooltips` retire le `title` sur mobile.
- Le contrôle statique de cartes-pastilles#kramail repère les règles du kramail par leur sélecteur. Comme la garde devient `:is(body.page-kramail, :where(html.kr-page-contacts) body)`, il lit désormais les deux écritures, pour pouvoir rejouer un bundle antérieur.
- `MESURER_CARTE` cible `.panel` et non `.panel-default`. Sinon kramail-theme deviendrait la 4e suite à citer `panel-default` : le repère deviendrait transverse et `sous-forum` sortirait du routage (test:router rouge).
- `kramail-theme#redaction-palette` est instable dès la base f48a01f : 2 FAIL « croix-focus absent » sur une variante qui change d'une exécution à l'autre, reproduits avec `KR_SCRIPT=/tmp/kr78/base.user.js`. Le fragment était vert lors de la première passe des zones. Ce défaut n'est pas lié au ticket.

## Plan Change Log

## Review Triage Log

Revue « quick » (relecteur indépendant, 2026-10-29) :
- **Moyenne, corrigé.** `Contacts:Page` ne traitait que le DOM initial. Il ignorait le redessin de DataTables, le bouton de catégorie remplacé en AJAX et les contrôles posés tard. Correctif : les lignes et les contrôles sont repris par un `MutationObserver` sur `topics.parentElement`, comme dans `Kramail:Liste`. Un nouveau contrôle « après redessin » est rouge sur le bundle d'avant le correctif (`boutons d'état : btn btn-danger, btn btn-warning`), puis vert.
- **Moyenne, écarté.** Selon le relecteur, les boutons de ligne porteraient peut-être la couleur de la catégorie. Le relevé dit le contraire : `a.btn.btn-default ×4` par ligne.
- **Basse, corrigé.** La branche « boutons de ligne » n'était pas exercée. Le redessin simulé injecte maintenant un `btn-danger` et un `btn-warning`. La fixture, elle, reste fidèle au relevé.
- **Basse, corrigé.** `min-width` sur `td` n'a pas d'effet défini. Il est remplacé par `width: 44px`, qu'une cellule de tableau traite comme un minimum.
- **Basse, écarté.** `scrollIntoView` fait défiler `#topics` : c'est voulu, le tableau défile dans la carte. Ce point est consigné dans revue-manuelle.

Revue indépendante (2026-10-29), « approuvable après correctifs » :
- **Corrigé.** `sansEtat` remettait en standard le bouton « Changer de catégorie » des lignes. Il est maintenant exclu et garde sa classe d'état native. La fixture a une ligne en `btn-warning`. Le redessin vérifie que les catégories sont gardées.
- **Corrigé.** Le fragment `contacts` a une bascule 767, puis 768, puis 767 dans le même onglet (`basculer`).
- **Corrigé.** La règle `td.center { width: 44px }` était inerte : elle est retirée. Le rendu est identique à 375 et 767 px.
- **Corrigé.** `contacts-boutons` mesure sur mobile la police et le remplissage du rang des boutons libellés : la règle « 2 ter » est couverte.
- **Corrigé.** `height` est de nouveau comparé au bureau. La référence de la Réception est le dossier standard Envoi (34 px), et non un bouton à icône seule (14 px sans Font Awesome dans les fixtures).
- **Reporté.** « Pas un contact » et le doublon `nameControls` / toucher de cellule avec `Kramail:Liste` sont notés dans deferred-work.
- **Noté.** Sur mobile, les deux boutons de la colonne Actions s'empilent (ligne d'environ 120 px) : la note est dans revue-manuelle.

## Verification

**Commandes :**
- `KR_FRAG=contacts,contacts-boutons,contacts-couleurs node tests/e2e/kramail-theme.mjs` : rouge avec `KR_SCRIPT=/tmp/kr78/base.user.js`, puis vert.
- `npm run test:zone -- kramail`, `forum`, `palette-nation`, `typographie-formes`, ainsi que les suites qui mesurent les éléments touchés : vertes.
- `npm run lint:css`, `npm run lint:js`, `npm run test:router` : code de sortie 0.
- `grep -c '!important' kraland-theme.css` ≤ 2958.

## Result

- Garde `kr-page-contacts` sur `<html>`. Sur /contacts, la peau du forum est retirée : `transformForumHeader` sort sur cette garde.
- En-tête et carte du kramail. Boutons de catégorie en standard, la courante en primaire, avec des libellés.
- Lignes, contrôles et pagination aux valeurs de la Réception. Cibles de 44 px sur mobile.
- Le bouton « Changer de catégorie » d'une ligne garde sa classe d'état native.
- Aucun nouvel `!important` : 2958.

| Preuve | Commande | Résultat |
|---|---|---|
| Rouge sur la base | `KR_SCRIPT=/tmp/kr78/base.user.js KR_FRAG=contacts,contacts-boutons,contacts-couleurs node tests/e2e/kramail-theme.mjs` | 22 ok, 47 FAIL. contacts-couleurs est vert dès la base (garde du contraste). |
| Vert | `KR_FRAG=contacts,contacts-boutons,contacts-couleurs node tests/e2e/kramail-theme.mjs` | 73 ok, 0 FAIL |
| Mutation 1 | retour contacts retiré de `transformForumHeader` | 10 FAIL |
| Mutation 2 | `min-width: 44px` des boutons de ligne retiré | 3 FAIL (18×44) |
| Mutation 3 | `ETATS` réduit à `btn-danger` | 6 FAIL |
| Redessin | bundle d'avant le correctif de revue | 4 FAIL, puis vert |
| Zones | `npm run test:zone -- kramail forum sous-forum palette-nation typographie-formes cartes-pastilles forum-activite confort-mobile`, puis `kramail cartes-pastilles` après les correctifs | Vert, hors cartes-pastilles#kramail (corrigé, voir Notes) et redaction-palette (instable dès la base) |
| Lint | `npm run lint:css`, `npm run lint:js` | 0 et 0 (1 avertissement préexistant dans report-non-lu.mjs) |
| Routeur | `npm run test:router` | 0, « Routeur conforme » |
| Correctifs de revue : vert | `KR_FRAG=contacts,contacts-boutons,contacts-couleurs node tests/e2e/kramail-theme.mjs` | 79 ok, 0 FAIL |
| Point 2 (catégorie gardée) | `KR_SCRIPT=/tmp/kr78/mut/p2.user.js` (filtre `ajax-t` retiré), `KR_FRAG=contacts-boutons` | 10 FAIL |
| Point 3 (bascule) | `KR_SCRIPT=/tmp/kr78/mut/p3.user.js` (retour contacts retiré de `transformForumHeader`), `KR_FRAG=contacts` | 6 FAIL, dont les étapes 767 et 767 retour de la bascule |
| Point 5 (règle 2 ter) | `KR_SCRIPT=/tmp/kr78/mut/p5.user.js` (= m7 du relecteur, régénérée), `KR_FRAG=contacts-boutons` | 3 FAIL « rang rempli » (375, 767, catégorie 375) |
| Zones après correctifs | `npm run test:zone -- kramail forum palette-nation` | 3048 ok, 0 FAIL |
| Lint, routeur après correctifs | `npm run lint:css`, `npm run lint:js`, `npm run test:router` | 0, 0 (même avertissement préexistant), 0 ; `!important` : 2958 |

