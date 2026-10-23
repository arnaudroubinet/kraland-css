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

- source_plan: `epic-palette-nation/story-refactor-sweep-plan.md`
  summary: Le contrôle « croix de fermeture, opacité 1 » de `modale-ordre.mjs` (fragment variantes) peut mesurer la croix pendant le fondu d'ouverture de la modale et échouer (opacité effective 0.937, confederation-libre, 1280 px).
  evidence: 1 FAIL au premier `test:all` du 2026-10-23 (ticket 3.8, aucun CSS changé), suite seule verte 3 fois sur 3 puis `test:all` vert (6005 ok) ; attendre la fin de la transition `.fade` avant la mesure réglerait le test.
  status: traité par `epic-modale-ordre/story-refactor-sweep-plan.md` (2026-10-24) : `CROIX` attend la fin des transitions de la croix et de ses ancêtres ; suite verte 3 fois sur 3.
- source_plan: `epic-modale-ordre/story-valider-en-couleur-de-nation-sur-mobile-et-onglet-actif-lisi-plan.md`
  summary: Règles mobiles contradictoires des modales Bootbox (`flex: 2 !important` sur `.btn-primary` ~l.7697, `flex: 1 !important` ~l.7034, pied en colonne ~l.1995, onglet actif bg-elevated ~l.7224) restent en place, battues par la section 9h pour la modale d'ordre.
  evidence: Revue quick du ticket 2.6 ; à retirer ou réconcilier au nettoyage de l'épopée 2 (2.7).
