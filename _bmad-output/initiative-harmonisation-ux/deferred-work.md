## Deferred from: code review of epic-identite-et-defauts, tickets 1.1 à 1.5 (2026-10-20)

- Rédaction kramail sans `textarea#dest[name="c[3]"]` : jamais classée page-kramail-compose, donc privée de la barre fixe « Envoyer » qu'elle avait avant le lot 1 (template l.851). Non vérifié : lister les formulaires /kramail/post/… réels.
- Sous-chemins /jouer/bat/<id> et /jouer/materiel/<x> acceptés comme source du nom (template l.296-305) : un libellé actif autre que le nom serait mémorisé. Non vérifié : relever le titre actif de ces sous-pages réelles ; medium si vrai.
- Clé unique kr-character-name pour tous les personnages et comptes : nom périmé jusqu'à la prochaine page plateau, matériel ou bâtiments. Limite acceptée par R1 ; question ouverte Q23.

## Résultat de l'exploration backlog 5 (2026-10-22)

- Sous-chemins `/jouer/bat/<id>` et `/jouer/materiel/<x>` : infirmé, aucune page réelle n'y mène (point clos).
- Rédaction kramail sans `textarea#dest[name="c[3]"]` : toujours ouvert, non vérifiable sans marquer un message comme lu (boîte d'envoi vide, un seul message reçu non lu).

## Deferred from: revue du ticket 3.1, jetons de rôle (2026-10-23)

- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: Les entrées-liens des listes latérales (`a.list-group-item`) prennent au survol le `#555` de Bootstrap, sans soulignement ; décider si ces entrées de navigation suivent R7 (accent et soulignement au survol).
  evidence: `a.list-group-item:hover` de Bootstrap 3.3.7 (spécificité 0,2,1) l'emporte sur `a:hover` (0,1,1) et `.list-group-item:hover` (0,2,0), avant comme après le ticket 3.1 ; en sombre, la couleur d'accent tient (`html[class*="-dark"] a:hover`), le soulignement non. Question de produit, listée dans `revue-manuelle.md`.
- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: Alerte info en sombre : faire consommer `--kr-alert-info-bg` et `--kr-alert-info-border` par `html[class*="-dark"] .alert-info` (fond et bordure encore en dur, `rgb(122, 82, 64)`), en même temps que la couleur des liens d'alerte (ticket 3.3) et Q4 (ticket 3.5).
  evidence: Avec les liens d'alerte en primaire, la teinte de la nation les met sous 4,5:1 en Théocratie Seelienne (4,35), Paradigme Vert (4,33) et Royaume de Ruthvénie (4,31) sombres ; en `text-accent`, Paladium sombre tombe à 3,80:1 (Q4). Calcul de la revue du ticket 3.1.
- source_plan: `epic-palette-nation/story-jetons-de-role-des-16-variantes-et-liens-en-couleur-d-accent-plan.md`
  summary: En sombre, l'aide de la modale d'ordre (`.bootbox-confirm .alert-order`) et la ligne d'action cochée du mobile (`.panel-actions .row.form-group:has(input:checked)`) consomment déjà `--kr-alert-info-bg`, qui passe du rouge Kraland à 6 % à la teinte opaque de la nation ; un lien dans l'aide, en primaire (`html[class*="-dark"] .alert a`), tomberait sous 4,5:1 en Théocratie Seelienne (4,35), Paradigme Vert (4,33) et Royaume de Ruthvénie (4,31) sombres.
  evidence: Non vérifié (maybe-false, medium si vrai) : les aides relevées sur le site (Dormir, Pouvoir) n'ont aucun lien. À trancher en relevant, en lecture seule, l'aide d'autres ordres ; à traiter avec la couleur des liens d'alerte (ticket 3.3). Le texte de la ligne cochée reste ≥ 6,27:1.

## Deferred from: ticket 3.5, palette d'états (2026-10-23)

- source_plan: `epic-palette-nation/story-palette-d-etats-reservee-aux-etats-et-une-seule-couleur-non-plan.md`
  summary: Boutons de la page Contacts et « Pas un contact » (orange) : relever, en lecture seule, leurs classes et leur page, puis les passer au style standard ou primaire (DESIGN.md › Palette d'états : actions ordinaires).
  evidence: Ni fixture ni classe de page pour les viser. Depuis le ticket 3.5, s'ils portent `.btn-warning`, `.btn-success`, `.btn-danger` ou `.btn-info`, ils prennent les règles communes des boutons d'état (ou la paire d'action pour `.btn-info`), sans vérification.
  status: repris par l'entrée 7.8 (`epic-kramail-mobile/tickets.toml`, 2026-10-28).

- source_plan: `epic-palette-nation/story-refactor-sweep-plan.md`
  summary: Le contrôle « croix de fermeture, opacité 1 » de `modale-ordre.mjs` (fragment variantes) peut mesurer la croix pendant le fondu d'ouverture de la modale et échouer (opacité effective 0.937, confederation-libre, 1280 px).
  evidence: 1 FAIL au premier `test:all` du 2026-10-23 (ticket 3.8, aucun CSS changé), suite seule verte 3 fois sur 3 puis `test:all` vert (6005 ok) ; attendre la fin de la transition `.fade` avant la mesure réglerait le test.
  status: traité par `epic-modale-ordre/story-refactor-sweep-plan.md` (2026-10-24) : `CROIX` attend la fin des transitions de la croix et de ses ancêtres ; suite verte 3 fois sur 3.
- source_plan: `epic-modale-ordre/story-valider-en-couleur-de-nation-sur-mobile-et-onglet-actif-lisi-plan.md`
  summary: Règles mobiles contradictoires des modales Bootbox (`flex: 2 !important` sur `.btn-primary` ~l.7697, `flex: 1 !important` ~l.7034, pied en colonne ~l.1995, onglet actif bg-elevated ~l.7224) restent en place, battues par la section 9h pour la modale d'ordre.
  evidence: Revue quick du ticket 2.6 ; à retirer ou réconcilier au nettoyage de l'épopée 2 (2.7).
  status: non repris par 2.7 (retrait sans effet hors ordre non démontré) ; reporté à l'épopée 4, qui reprend « Valider » (taille normale) et les boutons des modales (rétro épopée 2, A2, 2026-10-24) ; traité par `epic-typographie-formes/story-modales-bootbox-mobiles-valider-de-taille-normale-et-regles-plan.md` (2026-10-24) : `flex: 1`, `flex: 2`, tailles 16 px / 50-56 px retirés, pied en colonne porté par la seule section 9h élargie à toute Bootbox ; onglet actif bg-elevated gardé, avec sa raison (modales à onglets hors ordre).

## Deferred from: ticket 4.8, trois rayons (2026-10-24)

- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: Éditeur du kramail sous des médias hors convention, `@media (min-width: 769px)` (~l.10098-10271) et `@media (max-width: 768px)` (~l.10287-10589) ; à 768 px, les règles mobiles du formulaire s'appliquent sur ordinateur. Mêmes médias à ~l.1704, ~l.1982 et ~l.11931.
  evidence: Signalés seulement (Never du ticket 4.8) ; rayons réécrits au jeton sans toucher aux médias. Pour l'entrée 10 : passer en `max-width: 767px` / `min-width: 768px`, puis tester 767, 768 et 769 px.
- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: Doublons réécrits au jeton sans retrait (A13) : Bootbox ordinateur (~l.1191-2036 du plan) contre Bootbox mobile (~l.6856-7659 du plan) ; cartes de ligne du forum, 1re version (~l.7848) et 2e version (~l.8542) ; `.modal` l.1287 battu par l.7319 ; bouton l.5500 battu par l.4085 (lignes du plan).
  evidence: Retirer un doublon peut révéler un défaut natif ; hors objet du ticket 4.8 (Ask First). Pour l'entrée 10 : retrait un par un, rendu vérifié après chaque retrait.
  status: traité par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D1, la 1re version des cartes de ligne du forum est déjà retirée par 5.2 ; seul un commentaire subsiste (feuille l.7911-7913), aucun code. D2, la 2e version, n'est pas touchée (rejeté : depuis 6.1 elle ne vaut plus que pour Staff et les pages `/forum/*` hors fixtures ; revient à l'alignement de Staff, question en attente d'Arnaud). Autres doublons de cette entrée : hors épopée 6.
- source_plan: `epic-typographie-formes/story-trois-rayons-4-px-8-px-et-plein-plan.md`
  summary: `.kramail-character-dropdown` porte son rayon deux fois : `style.cssText` du template (~l.5793, `border-radius: var(--kr-radius-md)`) et `kraland-theme.css` ~l.9474 (`border-radius: var(--kr-radius-md) !important`), qui bat le style en ligne.
  evidence: Les deux déclarations réécrites au même jeton (8 px mesuré, fragment `rayons`, cas `accordeon` › `menu-personnage`). Pour l'entrée 10 : garder une seule source, de préférence la feuille.
  status: repris par l'entrée 7.3 (2026-10-28).

## Deferred from: ticket 4.9, grille d'espacement au pas de 4 px (2026-10-24)

- source_plan: `epic-typographie-formes/story-grille-d-espacement-au-pas-de-4-px-plan.md`
  summary: 21 déclarations d'espacement hors du pas de 4 px, laissées telles quelles (A9 ; annexe d'inventaire, section 5, lignes du plan) : l.599-600 `(min-width: 3840px)` `#player-actions-section .btn` (14 px) ; l.769 `html.kr-page-report … td:first-child` (`padding-left: 10px`) ; l.1625-1626 menu BBCode des modales (`4px 6px`, `margin: 2px`) ; l.4312 `.panel-heading` mobile (`10px 15px`, toujours battue, A12) ; l.4508 `.panel-body:has([id^="c"])` (10 px) ; l.4646 `.btn-xs` mobile (`6px 12px`) ; l.4654 `.form-control` mobile (`10px 12px`, battue par l.9885) ; l.6852 `.panel-group .panel-body` (`10px 0`) ; l.7034 `.modal-body table th` (`10px 8px`) ; l.8011 et l.8695 cellules du forum mobile (`padding-top: 3px`) ; l.9441 `#topics_wrapper .btn-group .btn` du kramail (10 px) ; l.10476-10477 menu BBCode du kramail sous `(max-width: 768px)` (`4px 6px`, `margin: 2px`) ; l.13107 et l.13241 `.kr-icon-cell.btn` (`4px 2px`) ; l.15615 `.kr-tools-plus` sous `(max-width: 359px)` (`0 6px`) ; l.14109 et l.14114 flèches de tri `::after` (`margin-left: 6px`).
  evidence: Aucune n'avait de cas mesuré gagnant sur les fixtures à l'inventaire (battue, page, largeur, tactile ou menu fermé absents des fixtures) ; les réécrire sans cas mesuré violait la règle « chaque élément a un cas mesuré ». Exception constatée à l'implémentation : l.4508 gagne sur la fixture `typographie-echelle.html` (mobile, corps de panneau qui contient `#champ-essai`, 10 px dans la base comme après) ; laissée telle quelle (hors des 13 déclarations du plan) et gardée égale à la base par le fragment `espacement` (cas `corps-champ`). Pour l'entrée 10 : fixture ou émulation pour chaque ligne (page `/report` exclue : jamais chargée), puis réécriture au jeton avec rouge/vert.
  status: traité par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D4, flèches de tri `::after` du sous-forum mobile (feuille l.13904 et l.13909) réécrites en `var(--kr-space-1)` (4 px) ; rouge sur 810901f (`npm run test:red -- sous-forum`, valeur lue 6px), vert après (`sous-forum.mjs`, fragment `l3-liste`, 375, 700 et 767 px, deux sens de tri). D3 rejeté : `padding-top: 3px` l.8011 a disparu avec la 1re version, celle de l.8496 est dans la 2e version (Staff, exclu). Les autres déclarations de cette entrée restent inchangées. ; l.769 `html.kr-page-report … td:first-child` (`padding-left: 10px`) : repris par l'entrée 8.1 (`epic-notifications/tickets.toml`, 2026-10-28), règle réécrite au jeton `--kr-space-*`. ; l.9441 repris par l'entrée 7.4, l.10476-10477 par l'entrée 7.5 (2026-10-28).

## Deferred from: ticket 4.10, nettoyage de fin d'épopée (2026-10-24)

- source_plan: `epic-typographie-formes/story-refactor-sweep-plan.md`
  summary: `.form-control { height: 44px !important; }` (`kraland-theme.css` l.4674, `@media (max-width: 767px)`) est une candidate morte. Elle est gardée (R4 ne retire que `padding` et `font-size`) et sortie du sweep.
  evidence: Contre-épreuve sans FAIL (bundle sans la déclaration, fragment `nettoyage`). Sonde CDP `CSS.getMatchedStylesForNode` sur toutes les pages du fragment à 375 et 767 px : chaque `input`/`select.form-control` garde 44 px. Raison : hauteur native de Bootstrap `34px`, battue par `.form-control { min-height: var(--mobile-touch-target) !important }` (l.9653, même média ; `--mobile-touch-target: 44px` défini sur `:root` seulement, l.129). Seul cas où la déclaration déciderait : un `.form-control` à hauteur propre au-dessus de 44 px, ramené à 44 (`input-lg` de Bootstrap à 46 px, `height` en ligne). Aucun dans les fixtures (37 `class="form-control"` nus), ni dans le template et la feuille. Pour la suite : vérifier sur le site réel (lecture seule) l'absence d'`input-lg` et de hauteur en ligne, puis retirer avec rouge/vert ; sinon, ajouter le cas réel à une fixture.

## Défauts d'initialisation relevés par la fiabilisation du fragment `nettoyage` (2026-10-24)

Relevés en test (A10 de la rétro de l'épopée 4), non corrigés : le template était hors périmètre.
- `initCharacterModalMobile` est appelé deux fois : `.kr-tabs-indicator` en double, deux passes d'`enhanceCharacterModal`.
- La place du bouton palette (`insertToggleCSSButton`) dépend de l'avancée de l'analyse HTML : `navRight` ou `.navbar-header-buttons-left`.
- `insertChangelogButton` et le `setTimeout` de 150 ms de la modale d'ordre mobile tournent hors `InitQueue` : `data-kr-ready` ne les attend pas.
- `.kr-mobile-overlay` est ajouté en fin de `body` pendant l'analyse HTML, à un rang variable parmi les enfants de `body`.
- Le fragment `nettoyage` injecte maintenant le bundle à un point fixe (fin de `body`) ; les autres fragments qui comparent des chemins DOM restent exposés à ce timing.

## Reports de la revue du ticket 5.1 (2026-10-24)

- Cybermonde, panneau « Fonctionnaires » : le chevron natif est dans le `h3`, juste après le texte (~222 px du bord), au lieu d'être à 16 px du bord droit de l'en-tête. Identique à la base. Le contrôle de `cartes-pastilles.mjs` ne lit que les enfants directs, et la police Font Awesome est coupée dans la fixture (`i.fa` à 0 px).
- Module « Panel Sections Collapse » : le retrait du corps (`padding-top/bottom: 0` au repli) change sans transition, ce qui fait sauter le contenu de 32 px avant l'animation. Option : ajouter `padding` à la `transition`.

## Reports du ticket 5.2, liste des sujets du forum dans la carte (2026-10-24)

- source_plan: `epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md`
  summary: A13, 2e version des cartes de ligne (section « INDEX DU FORUM », `:where(html:not(.kr-page-forum-index)) body.page-forum .panel-default .table …`) : gardée, elle gagne sur Staff (A6). 17 déclarations prouvées inertes retirées ; restent le fond de ligne, la couleur du lien de titre et 3 `display` (inertes une à une, effectives ensemble : leur retrait groupé masque des cellules).
  evidence: Bisection, une déclaration à la fois : styles calculés complets égaux avant et après sur 7 pages × 375/767 × clair/sombre. Pour l'alignement de Staff sur l'index (autre ticket) : retirer la 2e version entière et mesurer Staff.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D2, la retirer change Staff, exclu par 6.1 ; revient à l'alignement de Staff (question en attente d'Arnaud).
- source_plan: `epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md`
  summary: Staff (`/forum/staff`) : chevron natif de 10 × 14 px (pas de règle de sous-forum ni d'index, A6), sous la cible tactile de 44 px. Identique à la base. La croix de `.alert-dismissible` sort de l'écran de 5 px (`scrollWidth` 380 à 375 px, 772 à 767 px), hors panneau, identique à la base.
  evidence: Mesures `cartes-pastilles.mjs`, fragment `forum` (chevron égal à la base, largeur défilable égale à la base). À traiter avec l'alignement de Staff.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D5, index Staff exclu par 6.1 ; revient à l'alignement de Staff (question en attente d'Arnaud).
- source_plan: `epic-cartes-pastilles/story-forum-mobile-la-liste-des-sujets-entre-dans-la-carte-de-sect-plan.md`
  summary: Racine du forum (`forum-racine.html`, sans `.panel-body`) en sombre : la dernière ligne, opaque et à coins carrés, recouvre les coins bas arrondis de la carte (A8). Rendu de base gardé, aucun `overflow: hidden` ajouté.
  evidence: Option à trancher : rayon bas sur la dernière ligne, ou `overflow: hidden` sur la carte de la racine (vérifier alors le chevron et les cibles).
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D6, changement visible, deux options écrites, aucune tranchée ; décision d'Arnaud en attente.

## Reports de la revue du ticket 5.2 (2026-10-24)

- Accordéon (`.panel-group`) ou modale `.panel-default` posé sur une page `/forum/*` : la règle forum ne bat plus la copie de base, il prendrait fond surface et rayon md. Aucune fixture du forum n'en contient ; à vérifier sur le site réel.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D7, faisable sur une page dérivée en mémoire, hors du périmètre du sweep, reporté à la rétro de l'épopée 6.
  status: traité par le ticket 12 (`backlog/story-envoyer-et-panneaux-du-forum-sur-page-derivee-plan.md`, 2026-10-28) : règles du panneau forum gardées par `:where(:not(.panel-group > *, .modal *))` ; mesuré par `forum-activite.mjs`, fragment `panneaux` (page dérivée en mémoire).
- Bascule 767 ↔ 768 du forum non couverte par `cartes-pastilles` (fragment `bascule` sur Bâtiments). Risque faible : le forum recharge la page au changement de seuil.
  status: traité par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D8, couverte depuis 6.2 par `forum-activite.mjs`, fragment `seuil` (`bascule`, sujet et index RP, 767 ↔ 768 dans le même onglet) ; aucun code.
- Pages `/forum/*` hors fixtures (réponse, nouveau sujet, recherche, modération) : leurs `.panel-default` entrent dans la carte (48 px, corps à 0). À regarder sur capture.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D9, revient à l'épopée 9 (`epic-forum.md`).

## Reports du ticket 5.3, groupes du plateau dans la carte (2026-10-24)

- source_plan: `epic-cartes-pastilles/story-groupes-du-plateau-mobile-dans-la-carte-de-section-plan.md`
  summary: P10 : les boutons de groupe de l'en-tête (`.dashboard-group-buttons a.btn`) mesurent 28 px, sous la cible tactile de 44 px. Hors périmètre (épopée 9), sans correctif.
  evidence: Mesure sur `plateau-qualite-usage.html` à 375 px. Le fragment `groupes` de `cartes-pastilles.mjs` les touche par `elementFromPoint` sans changer l'état du groupe.
- source_plan: `epic-cartes-pastilles/story-groupes-du-plateau-mobile-dans-la-carte-de-section-plan.md`
  summary: Chevron de l'accordéon : le retrait vertical de la grille (`padding-top/bottom: 0` au repli) change sans transition, comme pour le module (report 5.1). La grille saute de 16 px avant l'animation.
  evidence: Option : ajouter `padding` à la `transition` des deux accordéons en même temps.

## Reports du ticket 5.4, pastilles d'état de la cloche et de l'enveloppe (2026-10-24)

- source_plan: `epic-cartes-pastilles/story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-plan.md`
  summary: A5 : `--kr-badge-danger-border` n'est plus lu par la peau depuis 5.4 (la règle de la cloche et de l'enveloppe ne pose plus de `border-color`). Son retrait, et le sort de `--kr-badge-danger` (encore lu par `.kd-field.is-invalid`), reviennent au sweep 5.6.
  evidence: Bordures de largeur 0 avant comme après (mesure à 375 et 1280 px) : seule la couleur de bordure calculée change (`--kr-primary-dark` hérité), sans effet visible. Sweep 5.6, avant : `grep -n -- '--kr-badge-danger-border\|--kr-badge-pnj' kraland-theme.css kraland-userscript-template.js` → l.76 et l.77 (déclarations, aucun `var(`), `grep -rn` dans `tests` vide ; après : même commande vide, `grep -c` dans le bundle → 0, `grep -n 'var(--kr-badge-danger' kraland-theme.css` → l.10575.
  status: traité par le sweep 5.6 (`epic-cartes-pastilles/story-refactor-sweep-plan.md`, 2026-10-24) : `--kr-badge-danger-border` retiré de `:root` ; `--kr-badge-danger` gardé (nom et valeur), seul lecteur `.kd-field.is-invalid` du kramail. ; `--kr-badge-danger` repris par l'entrée 7.6 (2026-10-28).
- source_plan: `epic-cartes-pastilles/story-pastilles-d-etat-cloche-et-enveloppe-en-couleur-non-lu-r3-plan.md`
  summary: Bureau compact (768 à 991 px, PLT-04) : la cloche et l'enveloppe sont dans le menu repliable, sans clone ; menu fermé, aucune n'est visible (comme la base). Un message non lu ne se voit qu'en ouvrant le menu. Hors périmètre de 5.4.
  evidence: Fragment `pastilles` de `cartes-pastilles.mjs` à 768 et 769 px : menu fermé, boîte 0 × 0 ; menu ouvert (bouton de la barre), pastille d'état visible.

## Reports du ticket 5.5, étiquettes de catégorie (2026-10-24)

- source_plan: `epic-cartes-pastilles/story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-plan.md`
  summary: `--kr-badge-pnj` (`#d9534f`) n'est plus lu par la peau (P12) ; son retrait revient au sweep 5.6, avec `--kr-badge-danger-border`.
  evidence: « PNJ » des cartes et marque native PNJ lisent `--kr-arm-bg` / `--kr-arm-ink` depuis 5.5. Sweep 5.6, même relevé `grep` que l'entrée A5 de 5.4 : aucune occurrence après, ni dans la feuille, ni dans le template, ni dans le bundle, ni dans `tests`.
  status: traité par le sweep 5.6 (`epic-cartes-pastilles/story-refactor-sweep-plan.md`, 2026-10-24) : `--kr-badge-pnj` retiré de `:root`.
- source_plan: `epic-cartes-pastilles/story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-plan.md`
  summary: A4 : les tags natifs du forum (`span.tagforum`, « · #tag ») gardent leur rendu, hors famille des étiquettes. `.forum-tags` n'existe que dans la fixture synthétique. Décision de famille à prendre par Arnaud.
  evidence: Fragment `etiquettes` de `cartes-pastilles.mjs`, page `sous-forum` : `span.tagforum` égal à la base `59567f0`.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D10, `span.tagforum` non touché (`epic-forum.md`) ; décision d'Arnaud en attente.
- source_plan: `epic-cartes-pastilles/story-etiquettes-de-categorie-un-seul-style-pnj-compris-h8-1-plan.md`
  summary: Marque native PNJ sous 768 px : 14 px et 46 px de haut (règle `.btn` mobile de la peau en priorité forcée), au lieu des 12 px de la famille.
  evidence: Fragment `etiquettes`, page `etats` : taille égale à la base à 375 et 767 px ; 12 px au bureau.

## Reports du ticket 6.2, index mobile : ligne de 72 px, flèche et « premier non lu » (2026-10-25)

- source_plan: `epic-forum/story-index-mobile-dans-la-carte-de-section-la-fleche-et-premier-n-plan.md`
  summary: Le correctif d'ancres mobile ne retire plus que `#flap`. Les autres ancres (kramail, plateau, etc.) ne sont plus effacées quand la largeur lue à l'évaluation est < 768. Seul le fil de sujet (`#msg…`) le prouve ; aucune suite ne vérifie une ancre du kramail ou du plateau.
  evidence: Ce comportement est déjà celui du vrai téléphone : la largeur lue à l'évaluation y vaut 981, donc l'ancienne condition n'effaçait rien (H10, inventaire §1.1 et §1.3). Aucun autre code ne dépend de l'effacement (revue du ticket 6.2, constat 4). Fragment `ancres` de `forum-activite.mjs` : fil de sujet seulement.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D11, garder ou retirer le correctif en entier est une question en attente d'Arnaud (`revue-manuelle.md`). ; ancres du kramail : sweep 7.10, si D11 est tranchée (2026-10-28).

## Reports du ticket 6.4, en-tête de sujet mobile (2026-10-25)

- Sur le sujet mobile, la barre native est masquée. Avec elle disparaissent le lien « lien » (`fa-link`) et le lien « liste des messages » (`fa-th-list`, `…-999`). C'était déjà le cas en RP et HRP avant 6.4. Depuis 6.4, c'est aussi le cas en Communauté, Débats et Staff. Ces liens sont-ils à rendre (dans le menu « ••• » de 6.5 ?) ou à laisser hors du mobile ? Choix produit d'Arnaud. Candidat naturel : 6.5 (bouton « ••• » commun au forum et au kramail). Source : revue quick de 6.4, constat 1.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D12, choix produit ; décision d'Arnaud en attente.

## Reports du ticket 6.5, bouton « ••• » commun (2026-10-25)

- La barre d'un message ouvert passe en z-index 991 sur mobile, pour rester au-dessus de `.dropdown-backdrop` (990). Elle pourrait donc passer au-dessus de la barre « Envoyer » fixe (z-index 90, `:where(body.page-forum) button.btn-primary.pull-right`), alors que sur la base elle passait dessous. Aucune fixture ne porte à la fois des messages et cette barre, donc rien ne l'a mesuré. À vérifier sur un vrai sujet qui a un formulaire de réponse, en lecture seule. Source : revue quick de 6.5, constat 1.
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D13, faisable sur une page dérivée en mémoire, hors du périmètre du sweep, reporté à la rétro de l'épopée 6.
  status: traité par le ticket 12 (`backlog/story-envoyer-et-panneaux-du-forum-sur-page-derivee-plan.md`, 2026-10-28) : z-index 991 réservé à l'état « voile présent » (`body.mobile-mode:has(.dropdown-backdrop)`) ; mesuré par `forum-activite.mjs`, fragment `envoyer` (page dérivée en mémoire).

## Reports du ticket 6.6, ligne de forum (2026-10-25)

- Course du harnais sur les infobulles en mobile, peau coupée. Quand la suite injecte le script à l'apparition de `<body>`, `observeTooltips` pose un observateur. `disableTooltips` ne retire ensuite les attributs d'infobulle que si `body.mobile-mode` est déjà posé, c'est-à-dire après `DOMContentLoaded`. Le résultat dépend donc de l'ordre de livraison des mutations. Sur le site réel (`@run-at document-start`), cette course n'existe pas. Le fragment `forum-activite#ligne` injecte maintenant au début du document. D'autres contrôles « peau coupée » mobiles injectent encore à l'apparition de `<body>` : `forum-index#peau-coupee`, `palette-nation#largeurs+peau-coupee`. S'ils comparent des attributs d'infobulle, ils peuvent échouer au hasard sous charge. À auditer au sweep 6.7. Source : `test:all` de 6.6, deux FAIL au caractère 430.
  status: traité par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D14, audit des sept contrôles en peau coupée (inventaire §4) sur l'arbre fini : `forum-index#peau-coupee` retire les quatre attributs d'infobulle des deux côtés avant comparaison (`COLONNE`) ; `palette-nation#largeurs+peau-coupee` ne lit que des couleurs, ou tourne peau active ; les autres ne lisent aucun attribut d'infobulle ou tournent à 1280 px. Aucun contrôle exposé, aucune modification de suite.
  status: corrigé par le backlog 11 (`backlog/story-suites-e2e-sur-bases-a-jour-sans-masque-plan.md`, 2026-10-25) : `forum-index` injecte le userscript en début de document des deux côtés (option `debut`) et compare `#col-right` tel quel, sans retirer les attributs d'infobulle (`COLONNE` retiré, Ask First 4). `peau-coupee` est vert deux fois sous charge (`KR_CONCURRENCY=8`, zones cartes-pastilles et typographie-formes en parallèle, 16 ok, 0 FAIL), après le réalignement et sur l'arbre fini. Le bundle d'écart retardé le rend rouge (8 FAIL « #col-right identique à la page native »).
- `pathKey` ne garde que le `pathname` et ignore l'origine. Une entrée de la liste latérale pointant vers un autre hôte serait confondue avec un forum local, alors que `menus-forums` filtre les entrées de même origine. Cas improbable sur Kraland. Source : revue quick de 6.6, constat 4 (écarté).
  status: rejeté par le sweep 6.7 (`epic-forum/story-refactor-sweep-plan.md`, 2026-10-25) : D15, écarté par la revue 6.6 (cas improbable sur Kraland).

## Reports du ticket 6.7, sweep de l'épopée 6 (2026-10-25)

- Règles mortes d'avant 6.2 (inventaire du ticket, §3.2). `forum-topic-stats-mobile` (et `.stats-sep`) : traitée, règles retirées de `kraland-theme.css` (9 `!important` en moins, 3290 → 3281). La classe était propre au userscript, posée par le template jusqu'à `ce0b012` ; plus aucune pose ni assertion dans le template, le bundle ou `tests/`. Restent signalées : `forum-description-wrapper`, `forum-stats-wrapper`, `forum-thread-detail`, `forum-thread-metadata`. Aucune fixture ne les porte, mais certaines peuvent être natives sur des pages hors fixtures. Non retirées (Ask First 3). Pour les retirer : relevé sur le site réel, sous mandat, en lecture, puis retrait un par un avec vérification du rendu. Source : `epic-forum/story-refactor-sweep-inventaire.md` §3.2.
- Masques 3/4 inertes de `kramail-redaction.mjs` (`ESPACEMENT_AVANT` et voisins) : le bundle « avant » de la suite est auto-référent, ces masques ne sont plus posés. Non touchés (Ask First 6) : leur retrait revient à l'action A4 de la rétro 5.
  status: renvoyé à l'action A9 par le backlog 11 (`backlog/story-suites-e2e-sur-bases-a-jour-sans-masque-plan.md`, Ask First 8, 2026-10-25) : la base de `kramail-redaction` est auto-référente, hors périmètre ; ces masques ne sont pas touchés, et les constantes qu'elle importe de `lib/variantes.mjs` sont gardées, avec la condition « Retrait : à la décision d'Arnaud sur les bases auto-référentes (action A9) ».
- Action A4 de la rétro 5 (extinction des masques 3 à 6) non portée par 6.7 (Ask First 1). Les bases partagées (`forum-index` 81512a3, `cartes-pastilles` 21fed8d, `typographie-formes` d953969, 62fd47d et 00b0786, `palette-nation` 6685df5) ne bougent pas ; leurs masques 6.x sont gardés, avec une condition de retrait qui nomme le ticket A4, à créer à la rétro de l'épopée 6. Le nouveau masque `FLECHES_TICKET67` (flèches de tri à 4 px, posé sur les bases d'avant 6.7 de `forum-activite` 810901f, `forum-index` 81512a3 et `typographie-formes` 00b0786) suit la même condition pour les bases partagées. Pour `forum-activite`, il se retire au réalignement de ses bases sur un SHA qui contient 6.7, action de la rétro de l'épopée 6.
  status: traité par le backlog 11 (`backlog/story-suites-e2e-sur-bases-a-jour-sans-masque-plan.md`, 2026-10-25) : bases partagées réalignées sur `6270c81` (identique à HEAD), masques 6.x et `FLECHES_TICKET67` retirés, 31 exports orphelins retirés de `lib/variantes.mjs`. Restent les masques des bases dédiées (TF1, TF2, TF3, TF7, CP5, CP6), chacun avec une condition « au prochain ticket qui modifie <zone> ».

- source_plan: `_bmad-output/backlog/bug-caracteristiques-du-plateau-sur-fond-vert-plan.md`
  summary: Comparer la pastille VOL 0 des caractéristiques à une vraie pastille de compétence à 0 au lieu de jetons recopiés à la main dans `tests/e2e/lib/variantes.mjs`.
  evidence: revue quick du backlog 13, constat 3 ; `typographie-formes.html` n'a aucune compétence à 0.

- source_plan: `_bmad-output/backlog/bug-modules-de-modale-inactifs-au-demarrage-plan.md`
  summary: `initModalTabScroll` garde `document.body` sans report au DOMContentLoaded, comme les modules du bug 6 ; au document-start sur téléphone (largeur 980 px), `initMobileFeatures` ne tourne pas non plus avant la bascule.
  evidence: relevé de l'implémenteur du backlog 6 (2026-10-28), hors périmètre des trois modules du ticket.
  status: repris par l'entrée 9.6 (`epic-plateau-confort-mobile/tickets.toml`, 2026-10-28).

- source_plan: `epic-plateau-confort-mobile/spike-releve-des-pages-mobiles-hors-fixtures-marge-cibles-et-carte-plan.md`
  summary: Sur mobile, la règle « PHASE 5 » (`kraland-theme.css` ~l.4671-4681) pose `display: inline-flex !important`, qui bat le `.hidden` de Bootstrap. Les `input#mySubmit1…6.hidden` d'Événements s'affichent alors en 24×44.
  evidence: relevé du spike 9.3 sur le site réel, en lecture seule, à 375×667 (2026-10-28) ; à reprendre par l'entrée 9.4 (cibles des pages secondaires).
- source_plan: `epic-plateau-confort-mobile/spike-releve-des-pages-mobiles-hors-fixtures-marge-cibles-et-carte-plan.md`
  summary: Relevé incomplet, faute de session connectée dans le Chrome dédié : Interface, Contacts, recherche et modération du forum, liste des Membres ; retrait de `height: 44px !important` sur `.form-control` non confirmé.
  evidence: le spike n'a tenté aucune connexion (2026-10-28).
- source_plan: `epic-kramail-mobile/story-gardes-de-page-du-kramail-suite-kramail-theme-et-dossiers-en-plan.md`
  summary: Les gardes `kr-page-kramail*` ne sont posées qu'au DOMContentLoaded. Avec une injection en tête sur mobile, les dossiers s'affichent en carrés jusque-là. Les gardes qui se déduisent du chemin pourraient être posées dès le document-start.
  evidence: revue du 7.1, constat 4 (2026-10-28).
- source_plan: `epic-kramail-mobile/story-gardes-de-page-du-kramail-suite-kramail-theme-et-dossiers-en-plan.md`
  summary: Sur la lecture d'un message à 375 px, le bouton Réception (`btn-default`) s'affiche avec le fond primaire et une ombre. L'état est antérieur au 7.1 et à reprendre par 7.3 (en-tête).
  evidence: revue du 7.1, constat 12 (2026-10-28).
- source_plan: `epic-plateau-confort-mobile/story-marge-laterale-de-16-px-socle-et-pages-de-jeu-plan.md`
  summary: Le nettoyage des styles en ligne `.row` / `[class*="col-"]` de `.panel-info` (modale d'ordre, template ~l.9361) ne retire peut-être plus aucun style posé par le script depuis la suppression de applyMobileCriticalStyles. Vérifier si le site pose ces styles lui-même, sinon retirer ce code mort.
  evidence: revue du 9.1, constat 12 (2026-10-28).
