# Backlog BMad

Aucun ticket produit n’est créé par le setup. Les cartes Hermes existantes restent leur source opérationnelle ; leur historique n’est pas converti en stories « done ».

Le magasin BMad utilise le dépôt par défaut. Un futur mandat peut créer une initiative via `bmad-ticket` et sélectionner son contexte via `bmad`. Sans initiative active, les commandes qui en exigent une doivent le signaler, et non en inventer une.

Inspection explicite de ce dossier :

    uv run --no-cache _bmad/method/scripts/tickets.py --project-root . status _bmad-output/backlog

Lire `../adoption/installation-bmad.md` et `../adoption/reprises-et-preuves.md` pour la provenance du setup et les sources existantes.
