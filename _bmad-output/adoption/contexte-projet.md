# Contexte d’adoption BMad — kraland-css

## Avertissement : chargement et setup

- **Hermes ne charge pas `.hermes/skills/` de ce dépôt** tant que la racine (et chaque worktree) n’est pas dans `skills.trusted_project_dirs`. Les agents utilisent leurs copies de profil, qui diffèrent des copies du projet (11 skills sur 30 sous la même étiquette `6.13.0-next`). L’activation du mode projet est la question Q1 d’Arnaud (voir `installation-bmad.md`) : **non décidée, non vérifiée**. Ne pas présenter la méthode du projet comme effective.
- **Ne jamais lancer `bmad setup` ni `bmad update` depuis une copie de profil dans ce dépôt**, même si le statut propose `next="bmad setup"` : dégradation démontrée par la QA (fichiers réécrits, `_bmad/scripts/migrate_v6.py` supprimé, statut projet `current=false`). Seul `--status` (lecture seule) est sûr.
- La référence d’identité des copies est le `ref` de `skills-lock.json`, pas l’étiquette de version.
- Le skill `bmad` n’a pas de `customize.toml` : ce fichier n’est pas lu automatiquement par `bmad status`/`setup`. Cet avertissement est donc aussi en tête de `installation-bmad.md`.

## Sources et autorité

- Lire `CLAUDE.md` avant toute tâche : règles existantes, conservées sans modification par le setup.
- Le produit existe déjà : userscript Tampermonkey, JavaScript vanilla et CSS de surcharge sur Bootstrap 3 ; pas une application serveur à recréer.
- Langue des échanges, commentaires et nouveaux artefacts : français. Les sources tierces BMad restent dans leur langue d’origine.
- Arnaud est le product owner et tranche les décisions produit. Une configuration technique du setup n’est pas une validation produit.
- Le kanban Hermes porte les mandats et les validations humaines ; les fichiers du dépôt portent les spécifications, plans et références durables. Mentionner les identifiants des cartes, SHA et liens de PR dans les artefacts, sans recopier les données privées de leurs pièces jointes.

## Garde-fous de travail

- Ne pas créer ni modifier `AGENTS.md` sans autorisation distincte et procédure de quorum de l’équipe. Le setup BMad n’est pas cette autorisation. `bmad-project-context` est disponible, mais son écriture est différée.
- Garder la revue finale et la QA indépendantes chez `@qa` ; la vérification de l’implémenteuse ne vaut pas leur approbation. Respecter le graphe kanban existant plutôt que créer une deuxième voie de revue.
- Aucune installation additionnelle sans autorisation explicite pour cette installation. Ne pas modifier les profils Hermes depuis un mandat limité au dépôt.
- Ne pas utiliser le site Kraland, ses comptes ou des données joueurs comme test implicite. Préférer les fixtures confinées ; tout accès réel exige un mandat explicite.
- Travailler en worktree isolé quand un autre agent occupe le checkout principal. Ne jamais nettoyer, stasher ou déplacer ses changements.
- Respecter les sources et fichiers générés indiqués dans `CLAUDE.md`. Un changement de méthode seul ne justifie pas de régénérer le bundle applicatif.

## Démarrage de la méthode

- La configuration partagée nomme le projet `kraland-css` et écrit les artefacts dans `{project-root}/_bmad-output`.
- Aucune initiative produit active n’est choisie par cette installation ; ce choix appartient à chaque mandat. Le magasin de tickets BMad reste celui du dépôt par défaut, sans connexion à un tracker ni migration du kanban Hermes.
- Pour une tâche nouvelle : lire le mandat et les références existantes, produire le plan/spec approprié, exécuter les vérifications réelles et transmettre à `@qa` sur un SHA exact. Les commandes de découverte et de setup sont dans `installation-bmad.md`.
- Pour le passé : consulter `reprises-et-preuves.md`. Ne pas reconstituer des statuts « done », des PRD approuvés ou des validations préalables à partir d’une synthèse rédigée après coup.

## Leçon d’adoption

Configurer le nom du projet explicitement après un setup dans un worktree temporaire : le défaut officiel reprend le nom du dossier, pas celui du dépôt.

Pour les mises à jour des copies BMad, préserver leurs octets via `.hermes/.gitattributes` et comparer aussi les blobs de l’index à la source épinglée : la copie de travail seule ne détecte pas une conversion CRLF lors du commit.
