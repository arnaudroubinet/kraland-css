---
epic: epic-identite-et-defauts
date: 2026-10-21
verdict: accepted-with-open-items
criteria: declared
headless: false
---

# Rétrospective : Identité du personnage et pages sans décor emprunté

## Epic summary

- Tickets (`tickets.py status`) : 1.1 à 1.8, tous `done`. Aucun ticket inachevé, aucun encore à `built`.
- Plages de commits :
  - 1.1 à 1.5 : `a6ccd2e..df0d75a`, **déduite**. Leurs plans ont été créés après coup par `tickets.py mark` et n'ont pas de `baseline_revision` (travail fait avec superpowers puis réintégré). La plage comprend 12 commits, revue de code incluse.
  - 1.6 : `2c31521..1ca3ed0` (1 commit).
  - 1.7 : `4488aa7..04fc3d5` (document seul).
  - 1.8 : `a1ae6d5..b2321d0` (1 commit).
  - Commits exclus : ceux du ticket de la carte de Cybermonde (`b69e911`, `5da533a`, `92677ae`), qui appartient au backlog et non à l'épopée.
- Volume de changement (`git_evidence.py`) :
  - `tests/e2e/jeu-identite.mjs` : +655/−55 (1.1 à 1.5), +51 (1.6), +8/−7 (1.8) ;
  - `kraland-theme.css` : +109/−100, puis −5 ;
  - template : +107/−24, puis +3, puis +12/−14 ;
  - 4 fixtures synthétiques et `tests/unit/identite.test.mjs` (+38).
- Preuves disponibles :
  - la spec et son journal (`spec-harmonisation/.memlog.md`) ;
  - les plans ;
  - la revue de code des tickets 1.1 à 1.5 (blocs `## Code Review` des plans 1.2, 1.3 et 1.4) ;
  - les journaux de tri des tickets 1.6, 1.7 et 1.8 ;
  - les captures du site réel pour 1.6 (`.tmp/captures/validation-1-6-cybermonde/`, hors git).
- Preuves manquantes :
  - les plans 1.1 et 1.5 sont vides (frontmatter seul) ;
  - aucun journal de session n'est conservé : l'analyse des leçons de processus repose sur les plans et le journal de la spec ;
  - aucune rétrospective précédente : c'est la première épopée.

## Findings

### Doublons

- Les gardes de page sont écrites sous trois formes, `body.mobile-mode:where(.page-forum, .page-forum-racine)`, `:where(body.page-kramail-compose, body.page-forum)` et `body:where(…)`, et aucune ne suit la forme `:where(html.x)` d'AGENTS.md (`kraland-theme.css` l.7494-7739, 9662-9684, 13516). Unifier change la spécificité (le ticket 1.8 l'a écarté) ; P1 fixe la forme cible (`note-options-cascade-p1.md`). Disposition : **différer**, la reprise se fera épopée par épopée (P1, option 4).
- La section active est calculée deux fois avec des règles différentes : `krActiveGameSection` (template l.295, égalité ou préfixe suivi de `/`) et la barre d'onglets mobile (template l.1793, `includes`). Un chemin comme `/jouer/plateaux` serait marqué actif sur mobile seulement (déduit). Disposition : **corriger** (petit), la barre mobile doit appeler `krActiveGameSection`.
- Certaines URL de sections sont recopiées en dur au lieu de venir de `KR_GAME_SECTIONS` : `['/jouer/plateau', '/jouer/materiel', '/jouer/bat']` (bloc `identite`) et `['/jouer/perso', '/jouer/pnj']` (`applyCharacterIdentity`). Disposition : **accepter**. Ce sont des sous-ensembles avec un sens propre (pages qui affichent le nom, pages qui ne l'affichent pas), testés en unitaire.

### Taille

- `tests/e2e/jeu-identite.mjs` fait 651 lignes, entièrement créées par l'épopée : 6 fragments, 7 mesures et un en-tête de 37 lignes. C'est la 4e suite par taille, encore lisible. Disposition : **accepter**. Les prochaines épopées feront de nouvelles suites plutôt que d'allonger celle-ci.

### Conventions

- Les media queries respectent AGENTS.md (l.7429, 9449, 13433, 13026). Le bloc pur respecte ses interdits.
- Aucune garde n'est en `:where(html.x)`, voir les doublons ci-dessus.

### Spec et implémentation (CAP-1, CAP-2, Done when)

- CAP-1, Personnage : testé (`perso : aucune cellule…`, `hors-forum-js`).
- CAP-1, Cybermonde :
  - le module JS est testé (`hors-forum-js`) et validé sur le site réel ;
  - le décor CSS (« sujets », « → ») n'est jamais mesuré sur la fixture Cybermonde : sa couverture repose sur la garde ;
  - le motif de détection `/→|sujets/` ne détecte pas « messages » (`MESURE_PERSO`).

  Disposition : **corriger** dans les tests.
- CAP-1, « chaque valeur une seule fois » : aucune assertion contre les doublons, on vérifie seulement l'absence de blocs et de cellules masquées. Disposition : **différer**.
- CAP-2, onglet mobile actif (`li.active`) : il n'est vérifié par aucun test. Disposition : **corriger** dans les tests, avec le doublon « section active ».
- CAP-2, nom lu sur Matériel et Bâtiments, sous-chemins du plateau : couverts seulement en unitaire. Disposition : **accepter**, rejet déjà consigné dans le plan 1.2.
- Done when 3 (« livré, `test:all` vert ») :
  - tickets 1.1 à 1.5 : `test:all` vert sur `5bf2984` le 2026-10-20 (journal de la spec, ligne 10), puis à chaque ticket suivant ;
  - tickets 1.6 et 1.8 : tracé dans leurs plans.

  Livraison : commits sur `feature/next`, non poussés, comme Arnaud l'a décidé.
- Done when 4 (vérification à 1280, 1440, 1920 et 375 px, deux variantes) : tracée pour 1.6 seulement. Les tests des tickets 1.1 à 1.5 couvrent 375, 700, 767, 768 et 1280 px, et aucune validation visuelle à 1440 ni 1920 n'est enregistrée pour eux. Disposition : **différer**. Arnaud a marqué ces tickets « fait ».

### Frontières entre tickets

- Frontière 1.2/1.6 : cohérente. Les mêmes classes (`page-forum`, `page-forum-racine`) servent en CSS et en JS. Les pages de sujet `/forum/sujet/…` portent aussi `page-forum`, mais l'effet du module n'y est pas testé (déduit). Disposition : **différer**.
- Frontière 1.3 : la garde de la barre d'envoi ne dépend pas de `body.mobile-mode`, contrairement à celle du pied de page. Les deux peuvent donc diverger sous 768 px quand le mode mobile n'est pas actif (déduit). Disposition : **différer** à l'épopée 7, qui supprime la barre (R4).
- Zones de test : la suite `jeu-identite` n'est pas rattachée aux zones `sous-forum` ni `cybermonde` (`router.mjs` l.46). Une modification du module des sujets permanents, dont la section porte la zone `sous-forum`, peut donc ne pas relancer `hors-forum-js`. Disposition : **corriger** en ajoutant les zones.
- Cas limite : dans `applyCharacterIdentity` (template l.8312), `replace(textNode.data.trim(), name)` est appelé avec une chaîne de remplacement. Les motifs `$&`, `$'` et `` $` `` y sont interprétés, donc un nom contenant `$` serait altéré. Disposition : **corriger** en passant une fonction de remplacement.
- Contre-épreuves : elles sont documentées pour 1.6, la carte et la revue ; aucune pour les fragments d'origine des tickets 1.1 à 1.5. Disposition : **accepter**. Ils sont passés au rouge sur le bundle d'avant le lot (memlog), mais la trace manque.

### Points connus encore ouverts (`deferred-work.md`)

- Une rédaction kramail sans `textarea#dest[name="c[3]"]` n'est pas classée `page-kramail-compose`. Non vérifié.
- Les sous-chemins `/jouer/bat/<id>` et `/jouer/materiel/<x>` sont acceptés comme source du nom. Non vérifié ; gravité moyenne si c'est vrai.
- Une seule clé `kr-character-name` sert pour tous les personnages : limite acceptée par R1, question ouverte Q23.

## Behavior verification

- Site réel, le 2026-10-21 :
  - Cybermonde à 375, 1280, 1440 et 1920 px, dans les deux variantes : 0 bloc de compteurs, 0 cellule masquée (ticket 1.6) ;
  - Événements, Membres, Contacts et Statistiques, visités le 2026-10-20 : non touchés par le lot 1.
- Non vérifiés sur le site réel pendant cette épopée : le nom du personnage, la section active, les icônes et le « ok » des Règles. Ils ne sont couverts que par des fixtures.

## Previous-retro follow-through

Aucune rétrospective précédente : c'est la première épopée de l'initiative, et aucun fichier `*-retrospective.md` n'existe.

## Action items

Propositions, à appliquer seulement si Arnaud le décide :

1. **Corriger** : la barre d'onglets mobile utilise `krActiveGameSection`, et un test vérifie l'onglet actif (`li.active`) sur le plateau, un sous-chemin du plateau et Personnage. Responsable : agent, ticket backlog.
2. **Corriger** : `applyCharacterIdentity` remplace le texte du titre par une fonction, pour que les `$` d'un nom ne soient pas interprétés, avec un test sur un nom contenant `$&`. Responsable : agent, ticket backlog.
3. **Corriger** les tests de CAP-1 :
   - mesurer le décor CSS sur la fixture Cybermonde ;
   - ajouter « messages » au motif de détection ;
   - rattacher `jeu-identite` aux zones `sous-forum` et `cybermonde`.

   Responsable : agent, ticket backlog.
4. **Vérifier** les deux points non vérifiés de `deferred-work.md` (rédaction kramail, sous-chemins Matériel et Bâtiments) par une visite en lecture seule. Responsable : Arnaud (mandat), puis agent.
5. **Leçon de processus** : un travail repris d'un autre outil doit recevoir un plan BMad avec `baseline_revision` dès sa réintégration ; sinon, la plage de commits n'est plus que déduite. Responsable : agent, à chaque réintégration.
6. **Leçon de processus** : la validation visuelle à 1440 et 1920 px (Done when 4) doit être tracée dans le plan de chaque ticket d'interface, et pas seulement pour les bugs. Responsable : agent, épopées suivantes.

## Acceptance verdict

**accepted-with-open-items**, sur des critères déclarés (Done when de l'épopée).

- Tous les tickets sont `done`, et la décision P1 est consignée.
- Les critères de CAP-1 et CAP-2 sont tenus par des tests ou une validation sur le site réel.
- Points restés ouverts et suivis :
  - les lacunes de tests ci-dessus ;
  - la validation à 1440 et 1920 px non tracée pour les tickets 1.1 à 1.5 ;
  - trois constats différés.

  Aucun ne bloque l'épopée.

Il n'y a pas encore de décision humaine sur ce verdict.

## Open questions

- Faut-il faire les points 1 à 3 avant d'ouvrir l'épopée 2, ou les traiter au fil de l'eau ?
- Les tickets 1.1 à 1.5 doivent-ils être revalidés visuellement à 1440 et 1920 px, ou leur marquage « fait » vaut-il acceptation ?
