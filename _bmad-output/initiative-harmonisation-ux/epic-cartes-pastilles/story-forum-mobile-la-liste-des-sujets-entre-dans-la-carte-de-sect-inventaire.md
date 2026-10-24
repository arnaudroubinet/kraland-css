# Entrée 5.2 : inventaire du forum mobile (en-têtes, listes, doublons A13, tests)

Annexe du plan `story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md`. Relevé sur `21fed8d` (bundle commité, Bootstrap 3.3.7 embarqué), en lecture seule. Mesures : script hors dépôt `/tmp/mesure52/mesure.mjs` (harnais de `cartes-pastilles.mjs`, `kr-theme-enabled` vérifié), sorties `/tmp/mesure52/resultats.json` et captures. Les lignes citées sont celles de `21fed8d` ; l'implémenteur les revérifie.

## 1. Mesures de la base (Kraland clair ; Empire Brun sombre identique hors couleurs)

| Fixture | Panneau (375 et 767) | En-tête | Titre | Corps | Lignes |
|---|---|---|---|---|---|
| sous-forum-debuter, `#fx-permanents` | x 0, pleine largeur, fond transparent, rayon 8, mb 16 | 45 px (min 44 + filet bas 1 px `border-default`), retrait `0 16px`, fond transparent, rayon 0 | 17 px 700 text-primary (17,97:1 clair, 15,40:1 sombre) | 0 | 5 lignes x 0, pleine largeur, 44 px, filet bas, filet gauche 4 px (`status-unread` si non lu, transparent sinon), **ombre `shadow-sm`** (A13, 1re version), rayon 0 |
| sous-forum-debuter, `#fx-sujets` | idem | idem | idem | 0 ; contient `#topics_wrapper` (recherche, longueur, tri, info, pagination) | lignes x 0 pleine largeur (85,9 à 125,6 px), sans ombre, filet gauche et bas |
| forum-index-rp, forum-index-communaute | idem | idem (45 px, filet) | idem | 0 | lignes x 0 pleine largeur, 85,9 px, sans ombre |
| forum-racine (`/forum`, ancienne structure) | x 0, transparent | 44 px, **fond surface**, sans filet (règle commune copiée pour le forum, l.7843) | idem | aucun `.panel-body` | lignes pleine largeur (139,6 px) |
| forum-racine-groupes | x 0, transparent | 44 px, fond surface, sans filet | idem | **16 px** | lignes à x 16 (largeur vw − 32) |

- Chevron natif `span.pull-right.clickable` : 44×44, à 4 px du bord droit (marge `0 -12px 0 auto`), partout sauf `forum-racine` (pas de chevron).
- Ligne : le lien du titre est étiré (`a::after`, `position: absolute; inset: 0 0 -1px 0; z-index: 1`) ; centre, haut, bas et droite répondent par le lien ; le bord gauche (filet de 4 px) répond par le `tr`. Icône d'état native masquée (`i.fa.fa-folder` « masquée ») ou affichée (`fa-lock`) selon l'état ; pastille `.kr-topic-badge` présente sur les lignes non lues.
- `scrollWidth` = viewport partout.
- À 768 px : `body.mobile-mode` absent, présentation ordinateur (panneau x 30, en-tête 43,7 px teinté, corps 8/16). Hors portée.
- Parité 6.1 : index et sous-forum ont les mêmes en-têtes, mêmes lignes (hauteur, retrait, filets).
- Écart avec l'épopée (Open question « cartes détachées avec un écart de 8 px ») : la base montre des **lignes à filet**, accolées, pas des cartes détachées (règles kr-subforum l.13929 et l.14197, `gap: 0`, rayon 0). L'option retenue « rendu actuel » = lignes à filet, ce que montre aussi la maquette h04.

## 2. Règles en jeu (mobile)

| Ligne | Sélecteur (abrégé) | Déclarations | Statut mesuré | Cible 5.2 |
|---|---|---|---|---|
| 7831-7839 | `body.mobile-mode:where(.page-forum, .page-forum-racine) .panel-default`, `… .panel-default:where(.panel-group > *, .modal *)` | fond transparent, sans bordure ni ombre (`!important`) | gagne sur la racine ; battu au sous-forum et à l'index par l.8326 (même effet) | forum retiré de la liste ; l'accordéon et les modales gardent la règle |
| 7841-7850 | même paire `> .panel-heading` | fond surface, rayon md, `padding: mobile-spacing-lg`, `margin-bottom: mobile-spacing-md` (`!important`) | gagne sur la racine (fond surface, rayon) ; battu au sous-forum/index par l.8333 | idem : forum retiré |
| 7852-7860 | même paire `> .panel-heading h3` | 17 px, 700, marge 0, text-primary | gagne (racine), battu par l.8348 / l.13648 / l.14657 ailleurs | idem |
| 7862-7892 | carte 5.1 `body.mobile-mode:where(:not(.page-forum, .page-forum-racine)) .panel-default:where(:not(.panel-group > *, .modal *))` (+ en-tête, h3, dernier corps) | carte | ne s'applique pas au forum | la garde `:where(:not(.page-forum, .page-forum-racine))` tombe : la carte vaut aussi au forum |
| 7894-7908 | A13 1re version : `:where(html:not(.kr-page-forum-index)) body.mobile-mode:where(.page-forum, .page-forum-racine) .panel-default .table > tbody > tr` (ombre `shadow-sm`), `…:active` (`scale(0.98)`) | `!important` | **ombre effective** sur les sujets permanents du sous-forum (`table.table`), pas sur `#topics` ni l'index ; `:active` effectif au tap | à trancher par mesure : l'ombre fait-elle partie du « rendu actuel » de la ligne ? (Assumption A4 du plan) |
| 8326-8331 | `body.page-forum .panel-default` | transparent, sans bordure ni ombre | gagne sur sous-forum et index (plus tard, même spécificité que la copie l.7831) | réécrit en carte ou retiré (P1) |
| 8333-8342 | `body.page-forum .panel-default > .panel-heading` | transparent, filet bas `border-default`, rayon 0, `padding: 12px 16px`, mb 0 (`!important`) | fond, filet, rayon gagnent ; `padding-top/bottom` battus par l.14180 / l.14653 | réécrit : fond surface, rayon, sans filet (Assumption A2) |
| 8344-8347 | `body.page-forum .panel-default > .panel-body` | `padding: 0` | gagne (sous-forum, index) | gardé : la liste touche les bords internes de la carte (Assumption A3) |
| 8349-8354 | `body.page-forum .panel-default > .panel-heading h3` | 17 px 700 `text-accent` | couleur battue par l.13648 (sous-forum) et l.14657 (index) | `color` retirée ou réécrite en text-primary |
| 8356-8545 env. | A13 2e version : `:where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table > tbody > tr …` (cartes de ligne `gap: 8px`, `padding: 12px`, rayon md, bordure) | `!important` | battue au sous-forum par les règles `html body.page-forum.kr-subforum.mobile-mode …` l.14192-14240 (spécificité plus forte) ; reste effective sur l'index Staff et la racine (`page-forum-racine` n'a pas `page-forum` : non concernée) | doublon : retrait un par un, rendu vérifié après chaque retrait (tâche dédiée) ; l'index Staff n'a pas de fixture (piège P5) |
| 8560+ | `body.page-forum table.dataTable tbody tr …` (cartes de sujet, colonnes masquées) | `!important` | battue au sous-forum par `body.page-forum.kr-subforum #topics …` (l.13925-14100) | hors A13 strict ; à ne retirer que si mesuré sans effet (P1, « retirer révèle un défaut natif ») |
| 13648-13660 | `body.page-forum.kr-subforum .panel-default > .panel-heading h3`, `table.dataTable tbody tr` (filet non lu) | | gagne | titre inchangé ; lignes inchangées |
| 13925-14100 | `body.page-forum.kr-subforum #topics tbody tr` et cellules | ligne flex, filet bas, filet gauche 4 px, fond surface, rayon 0, lien étiré | gagne | **inchangé** (ligne de sujet gardée) |
| 14178-14190 | `body.page-forum.kr-subforum .panel-default > .panel-heading` (min 44, padding vertical 0) ; `.panel-heading span.clickable` (44×44, `margin: 0 -12px 0 auto`) | | gagne | en-tête : min 48 (carte) ; chevron gardé 44×44, marge droite à revoir pour rester dans la carte (piège P2) |
| 14192-14240 | `html body.page-forum.kr-subforum.mobile-mode .panel-default table.table > tbody > tr …` (sujets permanents) | ligne flex 44 px, filets, rayon 0 | gagne | inchangé |
| 14580-14600 | `:where(html.kr-page-forum-index) #col-right .panel-default …` (liste combinée, l.14579) | | gagne | inchangé hors en-tête |
| 14651-14667 | `:where(html.kr-page-forum-index) #col-right .panel-default > .panel-heading` (min 44, padding vertical 0), `h3` (text-primary), `span.clickable` (44×44) | | gagne sur index et racine | même traitement que le sous-forum (parité 6.1) |
| 14671-14692 | racine : `thead > tr > th:first-child` visible (fond surface, 12 px) | | gagne sur la racine | inchangé |
| 14696-14760+ | index : table bloc, lignes flex `padding: 10px 56px 10px 12px`, filets, rayon 0 | | gagne | inchangé (lignes ≥ 72 px : épopée 6) |

Pièges de cascade relevés :
- Les règles de forum en `!important` (l.8326-8354) battent toute déclaration nouvelle sans `!important` de même spécificité placée avant : réécrire ces origines, ne pas ajouter une règle concurrente.
- La carte 5.1 porte `margin-left/right` **sans** `!important` ; au forum, aucune règle de marge latérale `!important` n'a été relevée sur `.panel-default` : à confirmer par CDP avant d'écrire.
- `racine-groupes` : corps de 16 px (l.4352) au lieu de 0 ; la racine n'a pas `page-forum`, donc l.8344 ne s'y applique pas.
- `forum-racine.html` n'a ni chevron ni `.panel-body` : le contrôle « chevron 44×44 » ne s'y applique pas.

## 3. Doublons A13 (deferred-work.md, revue 4.8)

| Doublon | État à `21fed8d` | Pages où il gagne | Action du plan |
|---|---|---|---|
| 1re version, ombre des lignes (l.7899-7902) | présent, effectif | sous-forum : sujets permanents seulement (`table.table`) | retrait par mutation : mesurer avant/après ; si seule l'ombre change, décision A4 |
| 1re version, `:active` `scale(0.98)` (l.7905-7907) | présent, effectif au tap | sous-forum (permanents), racine | même méthode |
| 2e version, cartes de ligne (l.8356-8545) | présent ; battu au sous-forum, inopérant à l'index (garde `html:not(.kr-page-forum-index)`) | index Staff (sans fixture), éventuellement `/forum/...` hors kr-subforum | retrait déclaration par déclaration seulement si une fixture prouve l'absence d'effet ; sinon gardé et consigné (Plan Change Log) |

## 4. Assertions qui figent le rendu actuel

| Suite | Lieu | Ce qu'elle fige | Sort |
|---|---|---|---|
| `forum-index.mjs` | ~l.355-357 | lignes `x <= 0 && r >= iw` (pleine largeur), 1re ligne sous l'en-tête | réécrite : lignes dans la carte (x ≥ 8, r ≤ vw − 8) |
| `forum-index.mjs` | ~l.250-275, `COMPOSANTS` (mobile) | parité index/sous-forum par propriétés calculées : panneau (rayons), en-tête de section (`min-height`, boîte, fond, filet bas), titre, chevron (`min-width`, `min-height`, `margin-right`), ligne, lien étiré | garde la parité ; les deux côtés changent ensemble. Vérifier que la liste de propriétés couvre fond et marges du panneau (sinon l'ajouter) |
| `forum-index.mjs` | `COMPOSANTS_BUREAU` | parité ordinateur | inchangé (768 et plus) |
| `sous-forum.mjs` | cibles (chevron 44×44, l.656), repli (l.674), 1er sujet `y ≤ 0,95 × vh` (l.668) ; aucune assertion d'en-tête ni de pleine largeur (voir §5) | gardées ; l.668 à surveiller |
| `typographie-formes.mjs` | ~l.1250, fragment `rayons` : `['panneau', '#fx-permanents, #fx-sujets', 'K8']`, `['entete', ':is(#fx-permanents…) > .panel-heading', …]` | K8 = conteneur `--kr-radius-md` (8 px), K7/C4 = autres rôles (table l.1205) ; l'en-tête du sous-forum est figé à rayon 0 | mis à jour : en-tête de carte à 8 px (déclaration 5.1) |
| `typographie-formes.mjs` | fragment `espacement` (retraits des en-têtes du sous-forum) | `padding 0 16px`, mb 0 | revérifié : la carte garde `0 16px` ; masque si la base diffère |
| `cartes-pastilles.mjs` | fragment `forum` (égalité à la base pour sous-forum, index RP, racine ; famille `exclus` : accordéon, modales) | forum égal à la base | forum sort de l'égalité et passe dans les fragments `carte`/`contraste` ; famille `exclus` gardée égale |
| `lib/variantes.mjs` | `CARTES_TICKET51`, `AVANT_TICKET51` (repère : absence de `.building-section-content.collapsed{opacity:0;padding-top:0` dans le bundle) | masque de la 5.1 sur bundle de base | modèle pour `CARTES_TICKET52` / `AVANT_TICKET52` ; le repère de 5.2 doit être une chaîne que les entrées 3 à 6 ne touchent pas |

Suites voisines et décompte `MAX_CITING` : §5. Non lu : `fin-initialisation.mjs` (cite ces fixtures).

## 5. Compléments (relevés croisés, lecture du code, non exécutés)

Pages et classes (template l.860-863, 3757, 5155) :
- racine `/forum` : `body.page-forum-racine` sans `page-forum`, avec `html.kr-page-forum-index` ;
- index RP, HRP, Communauté, Débats : `body.page-forum` + `html.kr-page-forum-index` ;
- **index Staff** : `body.page-forum` **sans** `kr-page-forum-index` (servi par `forum-index-rp.html` à `/forum/staff` dans `forum-index.mjs`) ;
- sous-forum : `body.page-forum.kr-subforum` (posée seulement si `#topics` existe) ;
- **fil de sujet** : `body.page-forum` seule (fixture `forum-sujet.html`).

Cascade, précisions :
- l.8329-8356 sont dans le média mobile **sans** `mobile-mode`, en `!important`, à la même spécificité que l.7835-7855, et plus loin : elles gagnent sur toute page `page-forum`, y compris Staff et le fil de sujet. Le titre en `text-accent` (l.8351) n'est effectif que sur Staff et le fil.
- En-tête de la racine : l.7843-7850 gagne (fond surface, rayon 8, `margin-bottom: mobile-spacing-md` = 12 px, sans filet) ; l.14651 y bat le padding vertical. C'est une « pastille » détachée, pas la ligne de 6.1.
- `.panel-body` de la racine-groupes : l.4353 / l.9844 (16 px, sans `!important`) ; l.8347 ne s'y applique pas (pas de `page-forum`).
- Coins bas en sombre : `html[class*="-dark"] .panel-body` (l.2873, hors média) donne un fond surface au corps.
- **`#topics`, l.13846** : `width: calc(100% + 32px) !important; margin: 4px -16px 0 !important` (sortie par marges négatives). Le relevé montre pourtant des lignes à x 0 : la compensation (probablement `#topics_wrapper`) est à localiser par CDP avant de toucher au corps.
- Index et racine : filet gauche de 4 px transparent, **aucune règle de couleur non lue** (l.14713) ; la parité 6.1 compare les lignes lues seulement.
- Index Staff : 1re version (ombre, `scale`) et 2e version (lignes en cartes à `gap 8`, rayon md, grille) **effectives en entier**. Ce n'est pas un doublon mort sur cette page.
- 2e version sur les permanents : effectives `thead` none (l.8363), `transition` (l.8382), `:active` fond hover (l.8389), `p:first-child` font-size 0 (l.8420, compensée) ; le reste est battu par L4 (l.14192-14307) ou inerte (grilles).
- `table.dataTable` (l.8603-8769) contre `#topics` : tout est battu sauf `transition` (l.8615) ; l.8636 (masquage des td 2 à 5) est **battue** par l.13967/13980.
- Icônes d'état natives : aucune règle ne les nomme ; masquées par leur `ul` (l.8682, 14025, 14246). `fa-lock` reste visible.

Tests, précisions :
- `forum-index.mjs` :
  - `COMPOSANTS_MOBILE` l.248-270 : parité relative (panneau : rayons seulement ; en-tête : display, align-items, min-height, padding×4, background-color, border-bottom, rayons ; titre ; chevron : display, min-width, min-height, margin-right ; ligne lue : flex, gaps, padding×4, border-bottom, border-left-width, background-color, position, rayons) ;
  - l.355-360 : `l.ligne.x <= 0 && l.ligne.r >= iw` (**casse**), 1re ligne `y >= entete.b - 1`, thead masqué, `overflowX 0` ;
  - l.374-383 : flèche → ≥ 44×44, `ligne.r - fleche.r <= 12` ; l.178 : cible au bord gauche `x+6` ; l.416-421 : h3 `--kr-text-primary`, chevron ≥ 44×44 ;
  - hors-périmètre l.581-613 : **empreinte** de chaque élément de `#col-right` sur sous-forum, sujet et Staff à 375 et 1440 contre `81512a3` + masques (`poserJetonsRedefinis` l.92) : **casse à 375** ;
  - racine l.654-685 : flex, 8 lignes, cibles, flèche ≥ 44, aucun x.
- `sous-forum.mjs` (`WIDTHS=[375,700,1280]`, valeurs en dur) : aucune assertion de hauteur ni de filet d'en-tête ; contraste des titres ≥ 4,5:1 (l.362) ; chevrons ≥ 44×44 (l.656) et repli (l.674) ; L4 : permanent 44 à 48 px, tableau ≤ 240 (l.646), ordre cadenas/titre/pastille/date (l.649), tap à 15/50/80 % → lien (l.636), **1er sujet réel `y ≤ 0,95 × vh`** (l.668, à surveiller : +8 px +3 px d'en-tête) ; L3 : ligne 60 à 130, flèche 44±1, `arrow.r >= row.r - 16` (l.540) ; `barOf` (l.167-174) : filet ≥ 4 px si et seulement si non lu (l.297).
- `typographie-formes.mjs` :
  - rôles l.1205-1213 : C4 = sm 4 px, K8 = conteneur md 8 px, **K7 = en-tête ou pied, md − 1 = 7 px** ; un rôle n'impose sa valeur que sur les coins non nuls de la base `5ff22d3` (l.1358), même nombre d'éléments (l.1346) ;
  - `index-rp` et `sous-forum` (l.1245-1253) : panneau K8 à toutes les largeurs (base déjà à 8 : tient) ; `entete` K7 en `b` seulement ;
  - `espacement` : forum mesuré en `b` seulement ;
  - `echelle`, `echelle-forum` : taille et graisse, aucune géométrie ;
  - **`nettoyage`** (l.1642-1700, 1861-1866) : sous-forum, staff, racine à `[375,767,768,769,1280]`, tous styles calculés égaux à `00b0786` + `CARTES_TICKET51` : **casse à 375 et 767**.
- `cartes-pastilles.mjs` : `COMMIT_AVANT='317b5b7'` ; fragment `forum` l.398-425 (`RELEVE` sur `.panel, .panel-heading, .panel-heading > *, .panel-body, .accordion-icon`, égalité ligne à ligne : **casse**) ; contrôle statique l.299-306 : `REGLES_CARTE_TICKET51` lues **textuellement** (casse si `CARTE_TICKET51` change) ; `controlerCarte` l.216-243 (valeurs en dur, jeu seulement) ; fragment `bureau` (forum compris, égal à la base).
- `palette-nation.mjs` `pages4` (l.1125-1150) : couleur, fond et bordures de `COMPOSANTS_TICKET4` (dont `.panel-default > .panel-heading`) sur sous-forum et index RP à 375 et 1280 contre le bundle d'avant : **casse** si le fond d'en-tête change.
- `jeu-identite.mjs` (l.181-200, 345-365) : classes de page, lignes en flex, aucune géométrie.
- `lib/router.mjs` : `forum-index` → zones `forum` + `sous-forum` (l.37) ; mots-clés `page-forum`, `kr-page-forum-index`, `page-forum-racine` → `forum` (l.146), `kr-subforum` → `sous-forum` (l.148), `panel-heading` → 10 zones dont `cartes-pastilles` (l.174) ; `MAX_CITING = 3` (l.210), décompte sur `SUITES` seulement.
- Citations actuelles : `kr-page-forum-index` 3, `page-forum` 3, `panel-default` 3, `fx-permanents` 3, `kr-text-primary` 3, `kr-bg-surface` 3 (cartes-pastilles comprise), `page-forum-racine` 2, `kr-subforum` 1, `fx-sujets` 1. Les écrire en clair dans `cartes-pastilles.mjs` les rend transverses.
