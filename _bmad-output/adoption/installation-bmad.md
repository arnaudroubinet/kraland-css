# Installation BMad — kraland-css

> **Avertissement — lire avant d’utiliser ces copies (revue QA `t_0e8fb249`, contrôle coach `t_9814331f`).**
>
> - **Hermes ne charge pas `.hermes/skills/` de ce dépôt tant que la racine du dépôt (et chaque worktree, qui est une racine distincte) n’est pas approuvée** dans `skills.trusted_project_dirs` de la configuration du profil. Aucune approbation n’existe aujourd’hui dans les profils vérifiés. Les agents Hermes utilisent donc **leurs copies de profil**, pas celles de ce dépôt.
> - Ces copies de profil **diffèrent des copies du projet** : 11 skills sur 30 (`bmad`, `bmad-brainstorming`, `bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-qa-generate-e2e-tests`, `bmad-retrospective`, `bmad-ticket`, `bmad-walkthrough`, `bmod-core-tools`, `bmod-method`) dans chacun des sept profils BMad contrôlés, sous la même étiquette `6.13.0-next`.
> - Le statut officiel calculé **sur la racine du projet** est `current=true`. Calculé avec **la racine que Hermes active réellement (le profil seul)**, il donne `current=false`, scripts partagés périmés et propose `bmad setup`.
> - **Ne jamais lancer `bmad setup` ou `bmad update` depuis une copie de profil dans ce dépôt** : la QA a démontré que cela réécrit des fichiers et **supprime `_bmad/scripts/migrate_v6.py`**, puis le statut projet repasse à `current=false`.
> - Le skill `bmad` n’a pas de `customize.toml` : l’instruction de lire `contexte-projet.md` n’est pas injectée quand on lance seulement `bmad status` ou `bmad setup`. D’où cet avertissement répété ici, dans `contexte-projet.md` et dans la PR.
> - Les neuf surcharges `_bmad/custom/` ne s’appliquent donc, comme les copies projet, que lorsque ces copies sont réellement chargées. **Le mode « méthode du projet » n’est pas effectif tant qu’Arnaud n’a pas décidé de la question Q1 (voir ci-dessous) et qu’un chargement réel n’a pas été vérifié.**

## Mandat et périmètre

Carte Hermes `t_a920e604`, autorisation « b » d’Arnaud pour la méthode complète du projet et ses composants nécessaires. **Attribution :** « b » est la réponse d’Arnaud dans le fil Discord du 14/10/2026 vers 20:58 CEST (18:58 UTC) à l’option « (b) méthode BMad complète dans le dépôt » proposée par le coach sous la question « Où ranger les décisions ? » ; cette carte n’en est qu’une **transcription**, pas la décision elle-même. Installation exécutée dans un worktree isolé depuis `origin/feature/next` au SHA `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`, branche `chore/bmad-setup`. Publication demandée en PR séparée **brouillon** vers `feature/next`, sans fusion ; revue indépendante `t_0e8fb249` après publication.

Le checkout principal et le travail Kramail concurrent ne sont pas modifiés. Aucun accès au site Kraland, aucune donnée joueur ou capture copiée, aucun changement du thème ou des tests applicatifs. `CLAUDE.md` reste identique ; `AGENTS.md` n’est ni créé ni écrit. Aucun profil Hermes n’est modifié.

## Source exacte et composants

- Source officielle : https://github.com/bmad-code-org/BMAD-METHOD
- Commit épinglé : `8f0d50e1817fdd8fcf05a20c524218222d13cd8d`.
- Version déclarée par **les deux modules** : `6.13.0-next` (préversion, pas une version stable revendiquée). **Cette étiquette n’identifie pas un contenu** : des copies de profil et du projet portent la même étiquette avec des contenus différents. La référence d’identité est le champ `ref` de `skills-lock.json` (commit `8f0d50e1817fdd8fcf05a20c524218222d13cd8d`, avec le `computedHash` de chaque skill).
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
- Neuf surcharges **équipe** `_bmad/custom/bmad-*.toml` chargent `AGENTS.md` (anciennement `CLAUDE.md`) et `adoption/contexte-projet.md` : les cinq agents et les workflows build, build-auto, ticket et project-context. Aucun défaut tiers n’est édité. Le contexte fixe le français, le cadre JS/CSS brownfield, les garde-fous et la séparation implémentation/QA.
- Pas de clés de langue v6 inventées : cette révision ne les lit plus ; le français provient des instructions existantes et des faits partagés résolus par les surcharges.
- Pas d’initiative produit active choisie à la place du prochain mandat. Le store BMad est `repo` par défaut, sans connexion tracker. Le kanban Hermes reste la source des mandats opérationnels, pas un historique à convertir automatiquement.
- `_bmad-output/backlog/README.md` rend explicite l’absence de tickets créés ; la commande d’inspection avec dossier fonctionne.
- `adoption/reprises-et-preuves.md` indexe les sources historiques avec des références immuables. Aucun PRD, aucune story terminée et aucune validation préalable ne sont fabriqués après coup.

## Vérifications exécutées le 14 octobre 2026

Les preuves détaillées (commandes, codes de sortie et flux stdout/stderr) sont jointes à la carte `t_a920e604` dans `bmad-setup-preuves.zip` (archive historique, conservée telle quelle : sa clé `archive_exhaustive_locale` contient un chemin machine de scratch, relevé par la QA comme défaut m1 et **non réécrit**). Un **supplément corrigé** les complète sans falsifier l’original : la liste complète des 300 fichiers tiers (chemin, mode, blob Git) est versionnée dans [`preuves/blobs-tiers-300.tsv`](preuves/blobs-tiers-300.tsv), et le supplément de preuves d’origine (34 fichiers) est rejoint, avec ses chemins de machine neutralisés, comme `bmad-setup-preuves-supplement-neutralise.zip` à la carte `t_7fb4daf0`. Voir `reprises-et-preuves.md`, section « Preuves de provenance durables ». Le rapport résume la vérification finale de 19:21 UTC et la comparaison de provenance exécutée séparément.

| Contrôle réel | Résultat |
| --- | --- |
| Second setup officiel, après configuration | exit 0 ; `changed=false`, `current=true` : idempotent |
| `--status`, racine projet seule | exit 0 ; `current=true`, `problems=[]`, scripts current, aucune question/dépendance/skill requis manquant, aucun doublon projet |
| `--status`, projet puis profil dev existant | exit 0 ; `current=true`, `problems=[]` ; **30 doublons** projet/profil signalés, copie projet prioritaire **pour l’ordre des `--root` de `setup.py` uniquement** (pas pour le chargement Hermes, voir l’avertissement en tête) ; aucun `newer_copy_unused` ; aucune suppression globale |
| `--status`, racine du profil seule (contrôle coach/QA du 15/10, copie profil) | `current=false`, scripts partagés et de méthode périmés, `next="bmad setup"` : c’est l’état effectif des copies de profil actuelles, **ne pas suivre ce `next`** |
| Validateur officiel des manifests, `--project-root .hermes` | exit 0 : `28 skills, 2 module records, 2 knowledge documents` |
| `migrate_v6.py` en lecture seule | exit 0 ; `legacy_leftovers=[]`, `stale_config_keys=[]`, `unused_customizations=[]` |
| `knowledge.py --root .hermes/skills` | exit 0 ; 2 modules reconnus, `problems=[]` |
| Résolution config + neuf surcharges | exit 0 ; nom du projet exact, deux références `persistent_facts` par surcharge |
| Rendu officiel de `bmad-build`, `bmad-build-auto`, `bmad-retrospective` | exit 0 ; fichiers workflow réellement générés ; faits partagés présents dans les deux builds |
| Lecture du store | exit 0 ; `store=repo` |
| `tickets.py status` sans initiative | **exit 1 attendu**, diagnostic explicite sur stderr : aucune initiative active ; ce n’est pas un setup en panne |
| `tickets.py status _bmad-output/backlog` | exit 0 ; zéro ticket, aucune dépendance ou incohérence |
| Parsing Python sans génération de caches | **67 fichiers** installés/runtime parsés sans erreur |
| Tests vendor `_bmad/scripts/tests` (mesure QA `t_0e8fb249`, Python stdlib, `unittest`, sans bytecode) | **165 lancés, 163 OK, 2 erreurs d’import** : `pytest` absent et `helpers.py` vit dans `tools/tests` d’amont, pas dans les 300 fichiers installés. Cette suite **n’est pas exécutable seule** ; aucun `pytest` ni `jinja2` n’a été installé pour la compléter (installation non autorisée) |
| Copies tierces et licence vs blobs Git officiels | **300 fichiers** identiques, sous-ensemble complet ; licence identique |
| Diff hors fichiers de méthode contre la base | exit 0, vide : application, tests, dépendances et règles existantes inchangés |

La sonde scratch a eu deux erreurs propres à son harnais (parsing d’un diagnostic stderr comme stdout JSON, puis raccourci de pathspec Git mal formé). Elles ont été corrigées, puis **toute la vérification a été réexécutée**, exit 0 : 24 commandes contrôlées, dont le refus d’initiative attendu. Aucun code BMad ou applicatif n’a été modifié pour faire passer la sonde.

SHA-256 de `CLAUDE.md` inchangé : `c07ff57759075496d45c2f7cf78c822ffe25e7a527eb95c8b4b9aa109109fecf`.

## Utilisation et réserves

**État effectif aujourd’hui (rappel de l’avertissement en tête).** Hermes ignore `.hermes/skills/` de ce dépôt tant que sa racine, et chaque worktree, n’est pas listée dans `skills.trusted_project_dirs` ; les agents travaillent avec leurs copies de profil (11/30 différentes). Cette PR **n’a modifié ni profil ni liste de répertoires approuvés**.

**Deux notions de priorité à ne pas confondre.** (1) Pour `setup.py`, l’ordre des `--root` décide quelle copie un statut considère comme prioritaire : la copie projet l’est quand `--root .hermes/skills` vient en premier. (2) Pour **le chargement par Hermes**, seule la liste d’approbation compte. Le premier point ne prouve rien sur le second.

Les commandes ci-dessus doivent être exécutées **depuis la racine du checkout concerné**. Les chemins relatifs ne se transportent pas d’un appel parallèle ou d’un autre checkout par hypothèse ; fournir le bon répertoire de travail à l’outil terminal.

Pour diagnostiquer un agent disposant aussi de skills globaux, ajouter au statut `--root <dossier-de-skills-du-profil>` **après** `--root .hermes/skills`. Cela expose les doublons sans les supprimer. Utiliser **uniquement `--status`** (lecture seule) : ne lancer aucun `setup`/`update` depuis une copie de profil dans ce dépôt. Les doublons de cette machine sont annoncés, pas cachés ; supprimer les globaux affecterait d’autres projets et sort du mandat.

Demander `bmad` pour la découverte et `bmad-ticket` pour une initiative future **une fois la méthode du projet effectivement chargée** ; en attendant, les agents utilisent les copies de profil. L’installation ne change pas la configuration de découverte des profils Hermes. Les rendus ont été testés comme **smoke tests**, pas exécutés comme des builds produit ou des rétrospectives : ils ne valent ni revue, ni QA, ni validation du passé. La QA indépendante n’a pas pu refaire ces rendus (`jinja2` absent, installation interdite).

### Question Q1 — activation de la méthode du projet (décision d’Arnaud, non tranchée)

Comment rendre les copies du projet effectives pour les agents ? Options posées par la QA et le coach :

- **(a)** approuver la racine du dépôt et chacun de ses worktrees dans `skills.trusted_project_dirs` des profils qui utilisent BMad (changement de configuration de profils, recommandé par le coach, autorisation explicite requise) ;
- **(b)** aligner les copies de profil sur le commit `8f0d50e` (modifie les profils) ;
- **(c)** garder les copies de profil comme méthode effective et ne tenir les copies du projet que pour la référence documentaire (aucun changement de profil).

**Aucune option n’est choisie ni appliquée par cette PR, y compris (c) par défaut.** Le statu quo actuel est un constat, pas une décision. Tant qu’Arnaud n’a pas répondu et qu’un chargement réel n’a pas été vérifié, ne pas présenter le mode projet comme effectif. Les options (a) et (b) sortent du périmètre de la décision « b », qui excluait les profils.

Le contrôle officiel compare les versions aux manifests distants ; `current=true` est le résultat réel à cette date, pas une promesse sur la stabilité d’une préversion ni sur ses versions futures. Les analyses tierces affichées par l’installateur incluaient des alertes sur certains skills ; ce sont des indications de scan, pas une approbation de sécurité indépendante. Les garde-fous du dépôt, l’autorisation d’installation et la revue par `@qa` restent applicables.

Aucun `npm run build`, lint applicatif ou e2e n’est revendiqué : le diff ne touche pas l’application, et le build régénérerait inutilement ses bundles. Les vérifications pertinentes sont celles du setup et l’identité des fichiers existants. La dette de lint historique citée par `docs/MESSAGES-V3.md` n’est ni corrigée ni masquée ici.

`git diff --cached --check` global retourne **exit 2** sur des espaces/fins de ligne déjà présents dans les fichiers tiers officiels (dont le CSV CRLF). Ces fichiers restent identiques à l’amont : pas de reformatage opportuniste. Le même contrôle excluant seulement `.hermes/skills` retourne **exit 0** sur les ajouts propres au projet. La règle locale `.hermes/.gitattributes` évite en outre que Git transforme silencieusement le CSV au commit ; la vérification de provenance inclut l’index, pas seulement la copie de travail.

## Nettoyage et apprentissage

Aucun serveur, navigateur, processus applicatif ou conteneur n’est démarré. `docker ps -a` constate un daemon indisponible (socket absent) ; aucun daemon n’est lancé, aucun conteneur tiers ou Apple n’est touché. Les rendus restent ignorés dans le worktree de travail et disparaissent avec son retrait après push ; sondes et journaux sont dans le scratch. L’archive de preuves est préparée hors du worktree et transmise avec le handoff de la carte.

Leçon de ce setup, conservée dans `contexte-projet.md` : **fixer explicitement le nom du projet après un setup en worktree temporaire, car le défaut officiel reprend le nom du dossier**. Aucune proposition d’allongement d’AGENTS.md : cette règle est locale à l’adoption BMad et n’exige pas de fichier d’instructions supplémentaire.
