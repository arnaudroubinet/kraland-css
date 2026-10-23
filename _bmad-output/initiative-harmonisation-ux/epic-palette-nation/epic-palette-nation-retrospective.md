---
epic: epic-palette-nation
date: 2026-10-23
verdict: rejected
criteria: declared
headless: true
---

# Rétrospective : Couleurs de nation et contrastes

## Epic summary

- Épopée : `_bmad-output/initiative-harmonisation-ux/epic-palette-nation` (id 3 de l'initiative), couvre CAP-4.
- Tickets (`tickets.py status`, ordre de construction) :
  - 3.1 Jetons de rôle et liens en accent : `built` (state `review`) ;
  - 3.2 Boutons primaires et texte posé sur la couleur de nation : `built` ;
  - 3.3 Texte coloré lisible, plus de rouge Kraland ni de bleu Bootstrap : `built` ;
  - 3.4 Mode clair thémé comme le sombre, bouton standard : `built` ;
  - 3.5 Palette d'états et une seule couleur « non lu » : `built` ;
  - 3.6 Jauges, une couleur par jauge : `built` ;
  - 3.7 Une seule forme de focus clavier : `dropped` (décision d'Arnaud du 2026-10-23, `revue-manuelle.md` l.122-126 ; Done when n° 2 barré dans `epic-palette-nation.md`) ;
  - 3.8 Refactor sweep : `built`.
- `pending_tickets` : vide. Tickets encore à `built`, pas encore « faits » : 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 et 3.8.
- Plages de commits (une par plan, depuis `baseline_revision`) :
  - 3.1 : `8a3ae88..6c3eca4`, **coupée**. La plage enregistrée court jusqu'à la base de 3.2 (`52f420a`). Elle contient aussi le correctif publié de la racine du forum (`fd6b000`, `bcc7710`) et sa fusion de réconciliation (`52f420a`, seule fusion de l'épopée). Ces trois commits sont exclus, ils n'appartiennent pas à l'épopée ;
  - 3.2 : `52f420a..804c892` (1 commit) ;
  - 3.3 : `804c892..6685df5` (1 commit) ;
  - 3.4 : `6685df5..d521cc8` (1 commit) ;
  - 3.5 : `d521cc8..412f0e8` (1 commit) ;
  - 3.6 : `412f0e8..137416c` (1 commit) ;
  - 3.7 : `137416c..f3f838a`, document seul (abandon du ticket, plan sans implémentation) ;
  - 3.8 : `f3f838a..8855469`, **coupée** et déduite : `2b46ef4` (protocole P2 de l'épopée 2) est exclu.
- Commits de l'épopée : `6c3eca4`, `804c892`, `6685df5`, `d521cc8`, `412f0e8`, `137416c`, `f3f838a` et `8855469`, tous locaux sur `feature/next`. `git branch -vv` : « en avance de 29 » sur `origin/feature/next`. Rien n'est poussé.
- Volume (`git_evidence.py`, commits non fusionnés, somme des plages de l'épopée) :
  - `tests/e2e/palette-nation.mjs` : +1734/−96, créé par l'épopée ;
  - `kraland-theme.css` : environ +596/−419 (3.1 +49/−15, 3.2 +169/−190, 3.3 +62/−85, 3.4 +85/−58, 3.5 +188/−58, 3.6 +41/−6, 3.8 +2/−1) ;
  - 7 fixtures synthétiques `palette-nation*.html` (595 lignes en tout) ;
  - comparaisons figées retouchées : `forum-index.mjs`, `kramail-redaction.mjs`, `cybermonde-carte.mjs`, `modale-ordre.mjs` ;
  - template : 3 lignes de l'épopée (« + » du sous-forum sur la paire, coche en accent, « Voir l'historique » en `btn-default`).
- Preuves disponibles :
  - le fichier de l'épopée et `tickets.toml` ;
  - les 8 plans, avec Implementation Notes, Review Triage Log et Verification ;
  - `revue-manuelle.md` et `deferred-work.md` ;
  - la spec CAP-4 et DESIGN.md ;
  - des journaux de commandes hors dépôt (`/tmp/kr-3*-*.log`, volatils) ;
  - les captures de 3.1 (`.tmp/captures/validation-3-1-jetons/`).
- Preuves manquantes :
  - aucun bloc daté `## Code Review` : les revues sont des passes quick consignées dans le Review Triage Log de chaque plan ;
  - aucun journal de conversation consulté : les leçons de processus reposent sur les plans et `revue-manuelle.md` ;
  - aucune capture de validation visuelle pour 3.2 à 3.6.

## Findings

### Taille et croissance

- F1. `tests/e2e/palette-nation.mjs` fait 1638 lignes. C'est la plus grosse suite du dépôt, devant `kramail-redaction.mjs` (1421), et elle est entièrement créée par l'épopée. Elle a grossi de 150 à 300 lignes par ticket (sources : `git_evidence.py` par plage, `wc -l`). Le 3.8 a retiré les doublons de sondes, mais la suite reste un seul fichier à 29 fonctions et fragments.
  - Pour cette instance : **accepter** (suite lisible par fragments, 1322 contrôles).
  - Leçon : les épopées 4 et 5 créent leurs propres suites au lieu d'allonger celle-ci, comme le disait déjà la rétrospective de l'épopée 1 pour `jeu-identite.mjs`.
- F2. `kraland-theme.css` passe à 15 530 lignes (+227 net sur la plage complète, correctif du forum compris). Le net est faible parce que les règles sont réécrites en place, selon P1 option 4. Disposition : **accepter**.

### Divergence de conventions

- F3. Nouvelle couche de spécificité. `html.kr-theme-enabled` préfixe 76 sélecteurs (0 à la base `8a3ae88`), et `html:where(.kr-theme-enabled)` en préfixe 2 (3.4, en-têtes de panneau). Ces préfixes servent à battre les états de Bootstrap, jusqu'à (0,4,0), sans `!important` (plan 3.2, Implementation Notes). En parallèle, 18 exclusions `:where(:not(…))` ont été ajoutées (0 à la base), pour rendre la main aux règles natives ou de page : boutons du tableau de bord, PNJ, pièce courante, `.panel-body a:hover`, PLT-11. AGENTS.md ne décrit ni ce préfixe ni ces exclusions : il ne parle que des gardes de page `:where(html.x)`. Les épopées 4 et 5 devront battre cette couche sans la connaître.
  - Pour cette instance : **accepter**, la couche est cohérente et testée.
  - Leçon : documenter la couche dans les Conventions CSS d'AGENTS.md.
- F4. Les plans 3.2 et 3.6 ne consignent aucun « rouge avant » sur le bundle de leur base, seulement des contre-épreuves par mutation. Les plans 3.1, 3.3, 3.4 et 3.5 le font. Le tri de revue de 3.6 est écrit sous `## Verification`, et son `## Review Triage Log` est vide (plan 3.6, l.85-96). Disposition : **accepter**, les mutations prouvent que la suite peut rougir. Leçon : gabarit de plan.

### Doublons

- F5. Échafaudage temporaire des comparaisons figées. Chaque ticket de 3.1 à 3.5 a ajouté sa couche de neutralisation :
  - `JETONS_REDEFINIS` (3.1) ;
  - marquage `data-kr-paire` (3.2) ;
  - `data-kr-texte-colore` (3.3) ;
  - `COMPOSANTS_TICKET4` et `TEXTE_SECONDAIRE_CLAIR` (3.4) ;
  - `COMPOSANTS_TICKET5` et `AVANT_TICKET5` (3.5).

  Ces couches touchent `forum-index.mjs` (+220 net), `kramail-redaction.mjs` et `lib/variantes.mjs` (9 références dans chacun de ces deux fichiers). Le plan 3.8 les garde « jusqu'au push » (Boundaries, Never), mais aucun ticket ni aucune ligne de `deferred-work.md` ne prévoit de les retirer ensuite. `forum-index#hors-perimetre` compare à une base figée (`81512a3`), donc ses couches resteront actives tant que cette base n'est pas avancée. Disposition : **différer**, avec une action dédiée après le push.
- F6. Le 3.8 a retiré les doublons de la suite : 7 sondes, 4 recherches « couleur parmi une liste », `proche` et `mode`. La preuve : 1322 ok avant et après, lignes identiques, CSS identique hors commentaires (plan 3.8). Clean.

### Architecture

- F7. Aucune dépendance de module nouvelle : le CSS consomme des jetons et le template ne change que 3 valeurs. La chaîne de jetons est cohérente : `--kr-text-accent` (47 emplois), `--kr-arm-bg` (11 → 52), `--kr-state` (25), `color-mix(` (9 → 34). Vue dérivée par comptage, sans outil de graphe : le CSS n'en a pas. Clean.

### Spec et implémentation (CAP-4, Done when)

- F8. Done when 1, critères de CAP-4 vérifiés par l'utilitaire dans les 16 variantes : tenu pour les textes, les fonds de nation, les composants, les états, le « non lu » et les jauges (fragments de `palette-nation.mjs`, 1322 ok rejoués). Trois écarts :
  - **(a)** Rouge Kraland résiduel hors Kraland. `--kr-focus-ring: rgb(164,18,13,0.22)` et `--kr-focus-ring-light` (`kraland-theme.css` l.46-47) restent fixes dans les 16 variantes. Ils sont consommés par `.form-control:focus` (l.635-637), les cases à cocher (l.659-661) et le champ de la modale (l.1926-1928). Ce sont des `:focus` et non des `:focus-visible` : le halo rouge apparaît aussi au clic ou au toucher dans un champ, pas seulement au clavier. Leur retrait était prévu par 3.7, abandonné. Arnaud a écrit que « les effets de focus existants restent tels quels » (`revue-manuelle.md` l.124). Or CAP-4 exige « ni rouge Kraland résiduel », et H5.2 dérive aussi l'anneau de focus de la nation (`.memlog.md` l.40). Disposition : **accepter**, sur la décision d'Arnaud. Mais la contradiction avec CAP-4 doit être tranchée : voir Open questions ;
  - **(b)** Bleu Bootstrap résiduel. `#428bca` reste sur l'onglet actif de la modale d'ordre mobile (l.1746-1747, 1941, 1995), avec le dégradé vert de « Valider » (l.1965). C'est une limite explicite de l'épopée, confiée au ticket 2.6 (`planned`, épopée 2). Disposition : **différer**, suivi par 2.6 ;
  - **(c)** « Un seul anneau de focus », dans les critères success de CAP-4, ne sera pas livré (3.7 abandonné). Le critère reste écrit dans `spec-harmonisation.md` l.35, dans DESIGN.md (composant Anneau de focus l.518, jeton `focus-ring` l.178, contrastes l.243 et l.428) et dans H5.7 « VALIDÉE » (`.memlog.md` l.45). Disposition : **réconcilier la spec**.
- F9. Done when 3 (« PR fusionnée sur `feature/next` ») : **non tenu**. Aucun push, aucune PR (`revue-manuelle.md` l.97-99). Le push exige l'accord d'Arnaud (AGENTS.md › Livraison, mémoire « autonomie »). Les autres points du critère tiennent : bundle et `version.json` régénérés à chaque commit, et `test:all` vert à chaque ticket (6005 ok à 3.6 et 3.8, d'après leurs plans). Ce `test:all` n'a pas été rejoué ici. Disposition : **corriger**, en poussant après accord.
- F10. Done when 4, largeurs et variantes : les fragments `*-largeurs` testent 767, 768, 769, 1440 et 1920 px contre 375 et 1280 px, sur Kraland et Empire Brun sombre, dans chaque ticket de 3.1 à 3.6. Les fixtures sont synthétiques. Seul 3.1 a des captures de validation visuelle (`.tmp/captures/validation-3-1-jetons/`) : il n'y en a aucune pour 3.2 à 3.6, alors que leurs effets visibles sont listés dans `revue-manuelle.md` (l.38-58). Disposition : **corriger**, captures à préparer pour la revue d'Arnaud.
- F11. Description de 3.5 contre le livré : les boutons de la page Contacts et « Pas un contact » devaient passer au style standard. Ils sont reportés : ni fixture ni classe de page pour les viser (`deferred-work.md` l.24-28). Depuis 3.5, s'ils portent une classe d'état, ils prennent les couleurs d'état, ce qui n'est pas vérifié. Disposition : **différer**, l'entrée de `deferred-work.md` existe.
- F12. Description de 3.3 et note de l'épopée (« `.f4` à `.f8` éclaircies jusqu'à 4,5:1 en sombre ») contre le livré : aucune valeur n'a été changée, car toutes sont déjà ≥ 6,26:1. Un contrôle a été ajouté, avec sa contre-épreuve (plan 3.3, Implementation Notes). Disposition : **accepter**, écart de prémisse sans défaut.
- F13. Écarts tranchés en autonomie au-delà de la lettre des tickets, tous consignés pour Arnaud (`revue-manuelle.md` l.26-67) :
  - fond de `.btn-warning` sombre (3.2) ;
  - modale du changelog en texte hérité, flèche du carrousel à opacité 1, fond de la barre BBCode, alerte d'avertissement (3.3) ;
  - `text-nation` de Confédération Libre sur l'accent, avec DESIGN.md modifié par l'implémenteur ; états du bouton standard en sombre ; `hr` masqués partout, séparateur d'Événements compris (3.4) ;
  - liens d'alerte hérités, info pleine en paire d'action, pièce courante, PNJ (3.5) ;
  - reste des jauges fondu dans la piste (3.6).

  Disposition : **accepter** en attendant la décision d'Arnaud. Ces décisions sont des hypothèses, pas des acquis.

### Frontières entre tickets

- F14. Passation de l'alerte info sombre, de 3.1 à 3.5 : bouclée. `rgb(122, 82, 64)` a disparu (0 occurrence), et les liens d'alerte prennent `color: inherit !important`, soulignés (l.800-803). Deux entrées de `deferred-work.md` sont donc périmées : l.17-19 (alerte info sombre) et l.20-22 (lien dans l'aide de la modale). Même chose pour `revue-manuelle.md` l.47, « à arbitrer au ticket 3.5 », que 3.5 a tranché. Disposition : **corriger** (tenue des fichiers de suivi).
- F15. Passation de `.btn-warning` de 3.2 à 3.5 : cohérente. La règle sombre ne vise plus que la pièce courante (`:where(:has(img[src*="/bat/bat"]))`), contrôlée contre le bundle `d521cc8` (plan 3.5). Clean.
- F16. Passation du bouton standard de 3.4 à 3.5 : « Voir l'historique » passe en `btn-default` dans le template et prend la règle commune de 3.4 (fragment `etats-*`). Clean.
- F17. La piste des jauges sur mobile se distingue à peine de `bg-surface` (≈ 1,09:1, plan 3.6, tri de revue). Point de validation visuelle ouvert (`revue-manuelle.md` l.95). Disposition : **différer** à la décision d'Arnaud.
- F18. Défaut antérieur trouvé par 3.6 : PM et PP du mini-profil affichent la valeur des PV (`findGaugeInSection`). Il est versé au backlog 9 (`_bmad-output/backlog/bug-jauges-pm-et-pp-du-mini-profil-affichent-les-pv.md`). Disposition : **différer**, suivi.
- F19. Test instable : le contrôle d'opacité de la croix de `modale-ordre.mjs` peut mesurer pendant le fondu d'ouverture (1 FAIL au premier `test:all` de 3.8, `deferred-work.md` l.30-32). Disposition : **différer**, suivi.

### Leçons de processus

- F20. Pendant 3.4, l'agent a fait un `git stash`, puis un `git stash pop`, sans accord. L'arbre est revenu à l'identique (plan 3.4, Review Triage Log, « Note de processus »). C'est contraire à la règle globale « aucune interaction git sans accord explicite », hors commits autorisés en autonomie. Disposition : leçon, garde-fou à écrire.
- F21. `test:all` a parfois tourné sur une machine chargée : charge 5,1 puis 6 pour 3.5 (« pas tout à fait calme »), et 3 faux FAIL de `plateau-qualite-usage` pendant la revue de 3.1. Chaque fois, la suite rejouée seule était verte. La règle de la mémoire « test:all machine calme » est appliquée, mais pas toujours au premier passage. Disposition : **accepter**.
- F22. Visite du site réel par 3.6 (`/jouer/plateau`, CDP 9223, squelette seul) : en lecture seule, prévue par le plan et consignée (`revue-manuelle.md` l.103), dans le cadre du mandat d'autonomie. Conforme.

### Revue diff-scope

`bmad-review` n'a pas été invoqué : la consigne de cette exécution limite les écritures au seul document de rétrospective, et la skill peut produire ses propres artefacts. Les lentilles adversariale, cas limites et trous de vérification ont donc été passées en ligne, sur un périmètre réduit :

- les frontières entre tickets (F14 à F16) ;
- les jetons et sélecteurs résiduels du thème (F8) ;
- les couches de neutralisation des comparaisons figées (F5) ;
- les preuves rouge/vert des plans (F4, F10).

Il n'y a pas eu de relecture ligne à ligne des 1734 lignes de tests ni des quelque 600 lignes de CSS ajoutées.

## Behavior verification

Suites rejouées sur fixtures le 2026-10-23, une à la fois, sur HEAD `2b46ef4`, bundle commité, sans `npm run build` :

- `node tests/e2e/palette-nation.mjs` : 1322 ok, 0 FAIL (« Tous les contrôles passent. »), y compris la peau coupée (liens et boutons Bootstrap natifs) ;
- `node tests/e2e/modale-ordre.mjs` : 297 contrôles, tous passent ;
- `node tests/e2e/plateau-profil-mobile.mjs` : 60 ok, 0 FAIL ;
- `node tests/e2e/forum-index.mjs` (comparaison figée, couches F5 comprises) : 150 ok, 0 FAIL ;
- `node tests/e2e/kramail-redaction.mjs` : 340 ok, 0 FAIL.

Non exercés :

- `npm run test:all`, exclu par la consigne : la preuve reste celle des plans 3.6 et 3.8 ;
- `test:router` ;
- tout rendu sur le site réel ;
- toute validation visuelle humaine.

Le comportement est vérifié par des contrôles automatisés sur fixtures. Aucun écran n'a été regardé.

## Previous-retro follow-through

L'épopée précédente dans l'ordre, `epic-modale-ordre` (id 2), n'a **aucun fichier** de rétrospective : 2.6 et 2.7 sont encore `planned`. Il n'y a donc rien à suivre au sens strict.

À titre d'information, voici le suivi de la dernière rétrospective existante (`epic-identite-et-defauts-retrospective.md`, Action items) :

1. Barre d'onglets mobile sur `krActiveGameSection`, avec un test (agent) : **fait**, `26dcc7b`, backlog 2 `built`.
2. `applyCharacterIdentity` avec une fonction de remplacement (agent) : **fait**, `19cf473`, backlog 3 `built`.
3. Tests de CAP-1 : décor Cybermonde, « messages », zones (agent) : **fait**, `7890bca`, backlog 4 `built`.
4. Vérifier les deux points de `deferred-work.md` (Arnaud, puis agent) : **fait en partie**, `1616157`. Les sous-chemins sont infirmés. La rédaction du kramail reste ouverte (`deferred-work.md` l.7-10).
5. Plan avec `baseline_revision` dès la réintégration (agent) : **tenu**, les 8 plans de cette épopée ont un `baseline_revision`.
6. Validation visuelle à 1440 et 1920 px tracée dans chaque plan d'interface (agent) : **tenu en partie**. Les largeurs sont testées automatiquement dans chaque plan, mais les captures n'existent que pour 3.1 (F10).

## Action items

Propositions, à appliquer seulement si Arnaud le décide :

1. **Livrer** (F9) : pousser `feature/next` et ouvrir la PR, selon AGENTS.md › Livraison. Base = `origin/feature/next` ; reprendre `version.json` et le bundle de la base au rebase, relancer le build, puis un seul `test:all` sur une machine calme. Responsable : Arnaud (accord), puis agent.
2. **Réconcilier la spec** (F8c) : retirer « un seul anneau de focus » des critères success de CAP-4 (`spec-harmonisation.md` l.35). Marquer H5.7 comme retirée le 2026-10-23, et le composant et le jeton `focus-ring` de DESIGN.md comme abandonnés. Proposition, à appliquer par `bmad-spec` ou `bmad-ux`. Responsable : Arnaud.
3. **Trancher le halo de focus rouge Kraland** (F8a). Option A : dériver `--kr-focus-ring*` de la primaire de la nation (`color-mix`, 2 lignes, sans toucher au focus clavier). Option B : inscrire dans CAP-4 l'exception « halos de focus existants gardés ». Responsable : Arnaud ; ticket backlog si A.
4. **Retirer l'échafaudage des comparaisons figées** (F5) après la fusion : `JETONS_REDEFINIS`, `COMPOSANTS_TICKET4/5`, `AVANT_TICKET5`, `TEXTE_SECONDAIRE_CLAIR` et les marquages `data-kr-*`. Avancer la base figée de `forum-index#hors-perimetre`. Contre-épreuve rouge à garder. Responsable : agent, ticket backlog (ou ticket de nettoyage de l'épopée 4).
5. **Préparer les captures de validation** de 3.2 à 3.6 sur fixtures (375 × 667, 1280, 1440 et 1920 px ; Kraland clair et Empire Brun sombre ; Paladium pour l'encre), hors dépôt, et les lister dans `revue-manuelle.md` (F10). Responsable : agent ; validation par Arnaud.
6. **Tenir les fichiers de suivi** (F14) : marquer résolues les entrées de `deferred-work.md` l.17-22 et la phrase « à arbitrer au ticket 3.5 » de `revue-manuelle.md` l.47. Responsable : agent.
7. **Contacts et « Pas un contact »** (F11) : relever en lecture seule leurs classes et leur page, puis les passer au style standard ou primaire. Responsable : Arnaud (mandat de visite), puis agent ; entrée existante de `deferred-work.md`.
8. **Leçon de processus** (F20) : écrire dans le garde-fou du build (personnalisation `bmad-build` ou piège d'AGENTS.md, via `bmad-project-context`) qu'aucune commande git touchant l'arbre, l'index ou le stash n'est permise pendant un ticket, hors du commit autorisé. Responsable : Arnaud (accord), puis agent.
9. **Leçon de processus** (F3) : documenter dans AGENTS.md › Conventions CSS la couche `html.kr-theme-enabled` (préfixe contre les états de Bootstrap) et les exclusions `:where(:not(…))`, avant l'épopée 4. Responsable : agent (proposition), Arnaud (accord).
10. **Leçon de processus** (F1, F4) : les épopées suivantes créent leurs propres suites. Chaque plan consigne son « rouge avant » sur le bundle de sa base et range le tri de revue sous `## Review Triage Log`. Responsable : agent, épopées suivantes.

Les items différés déjà suivis ailleurs, sans action nouvelle : F8b (ticket 2.6), F17 (`revue-manuelle.md` l.95), F18 (backlog 9), F19 (`deferred-work.md`).

## Acceptance verdict

**rejected** (non acceptée), sur des critères déclarés (Done when de l'épopée). C'est le verdict machine, sans décision humaine.

- Aucun ticket inachevé : 7 `built`, 1 `dropped`, `pending_tickets` vide.
- Done when 1 : tenu par les contrôles automatisés, sauf deux résidus. Le halo de focus rouge Kraland (F8a) est gardé par décision d'Arnaud, mais contredit CAP-4. Le bleu de la modale d'ordre mobile (F8b) est délégué au ticket 2.6.
- Done when 2 : retiré avec 3.7.
- Done when 3 : **non tenu**. Aucun push ni PR, donc rien de fusionné (F9). C'est le motif bloquant.
- Done when 4 : tenu par les tests à toutes les largeurs et par des fixtures synthétiques. La validation visuelle n'existe que pour 3.1 (F10).

Dès que la PR sera fusionnée avec l'accord d'Arnaud et que F8a sera tranché, l'évidence soutiendrait **accepted-with-open-items** (open items : F5, F10, F11, F13, F17). Cette révision appartient à Arnaud.

## Open questions

- F8a : le halo de focus rouge Kraland des champs, visible au clic dans les 16 variantes, fait-il partie des « effets de focus existants gardés » ? Ou bien le « ni rouge Kraland » de CAP-4 l'emporte-t-il ?
- Décisions prises en autonomie de 3.1 à 3.6 (`revue-manuelle.md` l.26-67, F13) : à confirmer ou à renverser. En particulier `hr` masqués partout, `text-nation` de Confédération Libre (DESIGN.md modifié), liens d'alerte hérités, `.btn-warning` sombre et reste des jauges fondu.
- Les entrées-liens des listes latérales doivent-elles suivre R7 (accent et soulignement au survol) ? Question ouverte depuis 3.1 (`deferred-work.md` l.14-16).
- Faut-il pousser maintenant, alors que les PR sœurs (épopée 2 à `built`, 6.1) partagent `version.json` et le bundle ? Faut-il fusionner une PR à la fois, et dans quel ordre ?

## Assumptions

- Épopée résolue depuis le dossier donné à l'invocation (`-H`), puis `tickets.py status <dossier>` (8 lignes, `pending_tickets` vide). Aucune confirmation demandée.
- 3.7, `dropped`, compte comme fini selon la règle du workflow. Le Done when n° 2 barré est lu comme retiré, pas comme échoué.
- Plage de 3.1 coupée à `6c3eca4`, plage de 3.8 coupée à `8855469`. `fd6b000`, `bcc7710`, `52f420a` (correctif et fusion du forum) et `2b46ef4` (épopée 2) sont jugés hors de l'épopée, d'après leur sujet et leurs fichiers.
- Épopée précédente = `epic-modale-ordre`, d'après l'ordre de `status` ; elle n'a pas de rétrospective. Le suivi de la rétrospective de l'épopée 1 est donné à titre d'information.
- Verdict machine **rejected**, rendu sans décision humaine. Le seul critère déclaré non tenu est le Done when 3 (PR fusionnée), qui dépend d'un accord d'Arnaud que ce run ne peut pas donner.
- La phrase d'Arnaud « les effets de focus existants restent tels quels » (`revue-manuelle.md` l.124) est lue comme couvrant aussi les halos `:focus` des champs. D'où F8a accepté, mais posé en question.
- `bmad-review` est remplacé par des lentilles en ligne sur un périmètre réduit (voir Revue diff-scope), à cause de la contrainte d'écriture unique.
- Vérification du comportement limitée à 5 suites sur fixtures, une à la fois. Pas de `test:all`, pas de build, pas de site réel.
- Chaque action item est une proposition. Aucun n'a été appliqué, aucun statut n'a été changé, aucun fichier de l'arbre des tickets n'a été modifié.
