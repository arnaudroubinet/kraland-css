## Deferred from: code review of epic-identite-et-defauts, tickets 1.1 à 1.5 (2026-10-20)

- Rédaction kramail sans `textarea#dest[name="c[3]"]` : jamais classée page-kramail-compose, donc privée de la barre fixe « Envoyer » qu'elle avait avant le lot 1 (template l.851). Non vérifié : lister les formulaires /kramail/post/… réels.
- Sous-chemins /jouer/bat/<id> et /jouer/materiel/<x> acceptés comme source du nom (template l.296-305) : un libellé actif autre que le nom serait mémorisé. Non vérifié : relever le titre actif de ces sous-pages réelles ; medium si vrai.
- Clé unique kr-character-name pour tous les personnages et comptes : nom périmé jusqu'à la prochaine page plateau, matériel ou bâtiments. Limite acceptée par R1 ; question ouverte Q23.

## Résultat de l'exploration backlog 5 (2026-10-22)

- Sous-chemins `/jouer/bat/<id>` et `/jouer/materiel/<x>` : infirmé, aucune page réelle n'y mène (point clos).
- Rédaction kramail sans `textarea#dest[name="c[3]"]` : toujours ouvert, non vérifiable sans marquer un message comme lu (boîte d'envoi vide, un seul message reçu non lu).
