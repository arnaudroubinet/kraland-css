# Installation BMad — kraland-css

## Mandat et périmètre

Carte Hermes `t_a920e604`, autorisation Arnaud « b » pour la méthode complète du projet et ses composants nécessaires. Installation exécutée dans un worktree isolé depuis `origin/feature/next` au SHA `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`, branche `chore/bmad-setup`. Publication demandée en PR séparée **brouillon** vers `feature/next`, sans fusion ; revue indépendante `t_0e8fb249` après publication.

Le checkout principal et le travail Kramail concurrent ne sont pas modifiés. Aucun accès au site Kraland, aucune donnée joueur ou capture copiée, aucun changement du thème ou des tests applicatifs. `CLAUDE.md` reste identique ; `AGENTS.md` n’est ni créé ni écrit. Aucun profil Hermes n’est modifié.

## Source exacte et composants

- Source officielle : https://github.com/bmad-code-org/BMAD-METHOD
- Commit épinglé : `8f0d50e1817fdd8fcf05a20c524218222d13cd8d`.
- Version déclarée par **les deux modules** : `6.13.0-next` (préversion, pas une version stable revendiquée).
- Cette révision emploie déjà la structure documentaire v7 (TOML, initiatives, tickets) et contient une migration v6→v7. Le numéro de version n’a pas été corrigé ou normalisé artificiellement.
- Modules `core-tools` et `method`, complets : **28 skills opérationnels + 2 records de module = 30 dossiers installés** sous `.hermes/skills/`.
- `bmad-toolsmith`, `bmad-eval` et `bmod-toolsmith` ne font pas partie de ces deux modules : extension optionnelle pour fabriquer/évaluer des skills, non requise pour utiliser la méthode sur le userscript. Aucun paquet de développement applicatif n’est ajouté.
- Installateur de skills exécuté : `skills` **1.7.2**, via `npx --yes skills` en portée projet, cible `hermes-agent`, jamais `--global`.
- `uv`, Node, npm et gh étaient déjà présents. `uv` a provisionné les deux dépendances du moteur de rendu officiel dans son environnement de script isolé ; aucune modification des profils Hermes.
- `skills-lock.json` conserve le commit et les hashes des 30 entrées. **300 fichiers installés** ont été comparés aux blobs Git de ce commit : identiques, aucun fichier du sous-ensemble sélectionné manquant. Les fichiers tiers restent inchangés, y compris leur langue d’origine. Leur **index Git** a aussi été comparé aux blobs officiels. `.hermes/.gitattributes` désactive la conversion de texte sur ces sources pour préserver notamment le CSV CRLF d’origine.
- Licence MIT d’origine conservée dans `.hermes/LICENSE-BMAD` et vérifiée par hash de blob ; attribution/trademarks : voir aussi https://github.com/bmad-code-org/BMAD-METHOD/blob/8f0d50e1817fdd8fcf05a20c524218222d13cd8d/CONTRIBUTORS.md et https://github.com/bmad-code-org/BMAD-METHOD/blob/8f0d50e1817fdd8fcf05a20c524218222d13cd8d/TRADEMARK.md.

## Installation exécutée

Depuis la racine du worktree, après lecture du skill `bmad` et de sa référence `references/setup.md` :

    npx --yes skills add https://github.com/bmad-code-org/BMAD-METHOD/tree/8f0d50e1817fdd8fcf05a20c524218222d13cd8d/skills --skill bmad bmad-advanced-elicitation bmad-brainstorming bmad-customize bmad-deep-recon bmad-forge-idea bmad-party-mode bmad-review bmod-core-tools bmad-agent-analyst bmad-agent-architect bmad-agent-dev bmad-agent-pm bmad-agent-ux-designer bmad-architecture bmad-build bmad-build-auto bmad-code-review bmad-correct-course bmad-prd bmad-prfaq bmad-product-brief bmad-project-context bmad-qa-generate-e2e-tests bmad-retrospective bmad-spec bmad-ticket bmad-ux bmad-walkthrough bmod-method --agent hermes-agent --yes

L’outil a installé les copies locales `.hermes/skills/`. Aucun dossier de skills global n’est installé, supprimé ou mis à jour. Les appels réels du setup officiel :

    uv run --no-cache .hermes/skills/bmad/scripts/setup.py --project-root . --skill .hermes/skills/bmad --root .hermes/skills --status
    uv run --no-cache .hermes/skills/bmad/scripts/setup.py --project-root . --skill .hermes/skills/bmad --root .hermes/skills --list-config-questions
    uv run --no-cache .hermes/skills/bmad/scripts/setup.py --project-root . --skill .hermes/skills/bmad --root .hermes/skills

Avant setup : `bmad_exists=false`, scripts absents, `current=false`. Aucune question de module (`[]`), aucun fichier de réponses nécessaire. Exécution créatrice : scripts partagés, scripts des deux modules, configuration et protection des réponses personnelles créés ; `current=true`, `problems=[]`. Le nom de projet par défaut a ensuite été explicitement fixé à `kraland-css` (le dossier temporaire n’est pas le nom du produit).

## Configuration adaptée au dépôt existant

- `_bmad/config.toml` : `core.project_name="kraland-css"`, `core.output_folder="{project-root}/_bmad-output"`. Aucun chemin absolu de worktree stocké.
- `_bmad/custom/.gitignore`, créé officiellement, protège `*.user.toml` ; pas de réponses personnelles commitées.
- `_bmad/.gitignore` protège `render/` et les caches Python : les rendus contiennent des chemins machine et ne sont pas livrés.
- Neuf surcharges **équipe** `_bmad/custom/bmad-*.toml` chargent `CLAUDE.md` et `adoption/contexte-projet.md` : les cinq agents et les workflows build, build-auto, ticket et project-context. Aucun défaut tiers n’est édité. Le contexte fixe le français, le cadre JS/CSS brownfield, les garde-fous et la séparation implémentation/QA.
- Pas de clés de langue v6 inventées : cette révision ne les lit plus ; le français provient des instructions existantes et des faits partagés résolus par les surcharges.
- Pas d’initiative produit active choisie à la place du prochain mandat. Le store BMad est `repo` par défaut, sans connexion tracker. Le kanban Hermes reste la source des mandats opérationnels, pas un historique à convertir automatiquement.
- `_bmad-output/backlog/README.md` rend explicite l’absence de tickets créés ; la commande d’inspection avec dossier fonctionne.
- `adoption/reprises-et-preuves.md` indexe les sources historiques avec des références immuables. Aucun PRD, aucune story terminée et aucune validation préalable ne sont fabriqués après coup.

## Vérifications exécutées le 14 octobre 2026

Les preuves détaillées (commandes, codes de sortie et flux stdout/stderr) sont jointes à la carte `t_a920e604` dans `bmad-setup-preuves.zip`. Les chemins de machine y sont neutralisés. Le rapport résume la vérification finale de 19:21 UTC et la comparaison de provenance exécutée séparément.

| Contrôle réel | Résultat |
| --- | --- |
| Second setup officiel, après configuration | exit 0 ; `changed=false`, `current=true` : idempotent |
| `--status`, racine projet seule | exit 0 ; `current=true`, `problems=[]`, scripts current, aucune question/dépendance/skill requis manquant, aucun doublon projet |
| `--status`, projet puis profil dev existant | exit 0 ; `current=true`, `problems=[]` ; **30 doublons** projet/profil signalés, copie projet prioritaire pour chacun, aucun `newer_copy_unused` ; aucune suppression globale |
| Validateur officiel des manifests, `--project-root .hermes` | exit 0 : `28 skills, 2 module records, 2 knowledge documents` |
| `migrate_v6.py` en lecture seule | exit 0 ; `legacy_leftovers=[]`, `stale_config_keys=[]`, `unused_customizations=[]` |
| `knowledge.py --root .hermes/skills` | exit 0 ; 2 modules reconnus, `problems=[]` |
| Résolution config + neuf surcharges | exit 0 ; nom du projet exact, deux références `persistent_facts` par surcharge |
| Rendu officiel de `bmad-build`, `bmad-build-auto`, `bmad-retrospective` | exit 0 ; fichiers workflow réellement générés ; faits partagés présents dans les deux builds |
| Lecture du store | exit 0 ; `store=repo` |
| `tickets.py status` sans initiative | **exit 1 attendu**, diagnostic explicite sur stderr : aucune initiative active ; ce n’est pas un setup en panne |
| `tickets.py status _bmad-output/backlog` | exit 0 ; zéro ticket, aucune dépendance ou incohérence |
| Parsing Python sans génération de caches | **67 fichiers** installés/runtime parsés sans erreur |
| Copies tierces et licence vs blobs Git officiels | **300 fichiers** identiques, sous-ensemble complet ; licence identique |
| Diff hors fichiers de méthode contre la base | exit 0, vide : application, tests, dépendances et règles existantes inchangés |

La sonde scratch a eu deux erreurs propres à son harnais (parsing d’un diagnostic stderr comme stdout JSON, puis raccourci de pathspec Git mal formé). Elles ont été corrigées, puis **toute la vérification a été réexécutée**, exit 0 : 24 commandes contrôlées, dont le refus d’initiative attendu. Aucun code BMad ou applicatif n’a été modifié pour faire passer la sonde.

SHA-256 de `CLAUDE.md` inchangé : `c07ff57759075496d45c2f7cf78c822ffe25e7a527eb95c8b4b9aa109109fecf`.

## Utilisation et réserves

Les commandes ci-dessus doivent être exécutées **depuis la racine du checkout concerné**. Les chemins relatifs ne se transportent pas d’un appel parallèle ou d’un autre checkout par hypothèse ; fournir le bon répertoire de travail à l’outil terminal.

Pour diagnostiquer un agent disposant aussi de skills globaux, ajouter au statut `--root <dossier-de-skills-du-profil>` **après** `--root .hermes/skills`. Cela expose les doublons sans les supprimer. Les doublons de cette machine sont annoncés, pas cachés ; supprimer les globaux affecterait d’autres projets et sort du mandat.

Demander `bmad` pour la découverte et `bmad-ticket` pour une initiative future ; charger les copies du projet avant celles du profil. L’installation ne change pas la configuration de découverte des profils Hermes. Les rendus ont été testés comme **smoke tests**, pas exécutés comme des builds produit ou des rétrospectives : ils ne valent ni revue, ni QA, ni validation du passé.

Le contrôle officiel compare les versions aux manifests distants ; `current=true` est le résultat réel à cette date, pas une promesse sur la stabilité d’une préversion ni sur ses versions futures. Les analyses tierces affichées par l’installateur incluaient des alertes sur certains skills ; ce sont des indications de scan, pas une approbation de sécurité indépendante. Les garde-fous du dépôt, l’autorisation d’installation et la revue par `@qa` restent applicables.

Aucun `npm run build`, lint applicatif ou e2e n’est revendiqué : le diff ne touche pas l’application, et le build régénérerait inutilement ses bundles. Les vérifications pertinentes sont celles du setup et l’identité des fichiers existants. La dette de lint historique citée par `docs/MESSAGES-V3.md` n’est ni corrigée ni masquée ici.

`git diff --cached --check` global retourne **exit 2** sur des espaces/fins de ligne déjà présents dans les fichiers tiers officiels (dont le CSV CRLF). Ces fichiers restent identiques à l’amont : pas de reformatage opportuniste. Le même contrôle excluant seulement `.hermes/skills` retourne **exit 0** sur les ajouts propres au projet. La règle locale `.hermes/.gitattributes` évite en outre que Git transforme silencieusement le CSV au commit ; la vérification de provenance inclut l’index, pas seulement la copie de travail.

## Nettoyage et apprentissage

Aucun serveur, navigateur, processus applicatif ou conteneur n’est démarré. `docker ps -a` constate un daemon indisponible (socket absent) ; aucun daemon n’est lancé, aucun conteneur tiers ou Apple n’est touché. Les rendus restent ignorés dans le worktree de travail et disparaissent avec son retrait après push ; sondes et journaux sont dans le scratch. L’archive de preuves est préparée hors du worktree et transmise avec le handoff de la carte.

Leçon de ce setup, conservée dans `contexte-projet.md` : **fixer explicitement le nom du projet après un setup en worktree temporaire, car le défaut officiel reprend le nom du dossier**. Aucune proposition d’allongement d’AGENTS.md : cette règle est locale à l’adoption BMad et n’exige pas de fichier d’instructions supplémentaire.
