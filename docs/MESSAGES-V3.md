# Messages du forum — v3 validée

## Mandat et périmètre

Carte `t_9503a580`, maquette mobile sombre validée par Arnaud : « Moins d’interface. Plus de message. ». Publication autorisée en PR vers `feature/next`, sans fusion ; aucun envoi, vote, signalement, modification de préférence ou lecture de Kramail non lu sur le site. Kramail reste hors périmètre.

Base : `7d1c533cc637084325b5849efb17caddafe82435`. Implémentation reprise, sans réécriture : `14f7dc9`, branche `feature/messages-v3`, worktree isolé `/Users/arnaud/.hermes/profiles/dev/cache/scratch/msg`. Le checkout principal, ses changements et `main` n’ont pas été modifiés.

Le dépôt ne contient ni `_bmad/` ni `AGENTS.md`. Le lancement du skill `bmad-build` a confirmé l’absence de `_bmad/scripts/render_skill.py` ; un `bmad setup` séparé est proposé, sans installation ni faux artefact de configuration dans cette tâche. Ce document tient lieu de spécification bornée, cartographie et rapport d’implémentation pour la reprise et la QA.

## Composition livrée

- Lecture : avatar de 60 px, nom/rang/date regroupés, corps immédiatement sous l’identité. Actions sous le texte : score, pouces haut/bas, flèche et texte « Répondre », puis « ••• » pour Profil, Kramail, Signaler et lien du message.
- Rédaction et édition : expéditeur et liste sur une ligne ; cinq outils courants (gras, italique, lien, citation, émoticônes), treize autres sous « Plus » ; grande zone BBCode, option Signature et validation dans le flux.
- Le texte existant, les balises, options de la liste, boutons et libellés natifs restent inchangés. « Modifier » dans la fixture d’édition n’est pas une preuve du libellé de toutes les pages réelles : le script conserve le bouton qu’il trouve, sans le renommer.
- Adaptation prudente du clair ; bureau natif conservé. La validation d’Arnaud porte sur la maquette sombre mobile, pas sur une nouvelle proposition bureau/clair.

## Cartographie native et choix technique

Sources identifiées lors de la première passe et consignées dans la carte :

| Outil | Identifiant natif | Fonction conservée |
|---|---|---|
| Fiole | `fa-flask`, titre « Couleurs » | Menu de couleurs BBCode |
| Loupe-éclair | `fa-searchengin`, `openHelp('prev')` | Prévisualisation |
| Icône de compression | `fa-compress`, balise `spoiler` | Spoiler, **pas** plein écran |

Aucun nouvel asset Font Awesome, paquet ou service n’est installé. Le code produit réutilise les icônes natives. Les copies locales Font Awesome 5.6.3 déjà présentes ne servent qu’aux captures.

Le module `Messages:V3` pose des classes et ajoute des boutons non soumis (`type="button"`, état `aria-expanded`). Il ne clone, ne déplace et ne remplace pas les nœuds natifs. Les destinations et handlers restent ceux du site ; les libellés visibles supplémentaires sont en CSS. L’ancien module `ForumPosts:Restructure`, qui clonait et reconstruisait le contenu, et son CSS devenu inutile sont retirés. Grille et ordre CSS assurent la composition.

Activation : `body.mobile-mode`, largeur inférieure à 768 px et chemin `/forum/`. Lecture limitée à `/forum/sujet/`, éditeurs reconnus par `form[name="post_msg"]`. Le bureau à 768 px et au-delà n’a aucun ajout v3. Le groupe de votes peut être remplacé par un DOM serveur simulé : la mise en forme CSS reste applicable.

Fichiers principaux : `kraland-theme.css`, `kraland-userscript-template.js`, `tests/e2e/messages-v3.mjs`, `tests/e2e/forum-mobile.mjs`, `tests/e2e/lib/router.mjs`, `package.json`, `.claude/skills/tester-kraland-css/SKILL.md`. Bundle et `version.json` régénérés par le build, pas édités à la main.

## Diagnostic de la reprise

L’ancien `logs/total-final.out` était interrompu, sans bilan global, et rapportait deux FAIL sur le retour bureau → mobile en lecture. Il ne constitue pas une preuve verte.

Le test de transitions passait seul (8/8), mais son enchaînement dépendait du temps de stabilisation du DOM. Une contre-épreuve avec stabilisation plus rapide a reproduit quatre FAIL : le deuxième changement de largeur arrivait avant le garde-fou natif `RELOAD_MIN_GAP_MS = 1200`. Le script conservait alors le document bureau et affichait correctement le bandeau manuel. Attendre 25 secondes après ce refus ne provoquait pas un nouveau resize, donc pas de nouveau rechargement.

Correction dans le test, sans désactiver ni modifier le garde-fou produit : attendre l’autorisation mesurée dans le journal des rechargements avant le retour normal. Quatre assertions supplémentaires vérifient de façon déterministe (Date figée, timers réels) le refus avant 1200 ms, puis l’autorisation sur un nouveau resize à 1200 ms, pour lecture et rédaction. Les huit assertions initiales restent présentes. Résultat ciblé : 12 ok, 0 FAIL, 26 s.

Le cadrage des captures de lecture a également été corrigé : `scrollIntoView` aligné en y=0 plaçait l’identité sous la navbar fixe. Le cadrage réserve maintenant la hauteur de la navbar ; une capture complète accompagne le viewport.

Leçon de test : un DOM calme ne prouve pas qu’un garde-fou temporel autorise une transition. Attendre la condition native et tester explicitement le chemin refusé ; ne pas supprimer le garde-fou pour rendre la suite verte.

## Vérification exécutée

Journaux dans `/Users/arnaud/.hermes/kanban/boards/kraland-css/workspaces/t_9503a580/logs/`.

| Exécution | Résultat réel | Journal |
|---|---|---|
| `npm run build` et postbuild/validate | exit 0, validation passée | `build.out` |
| Contre-épreuve transitions, stabilisation 100 ms | exit 1, 4 FAIL attendus, bandeau garde-fou relevé | `transitions-fast-red.out` |
| Transitions corrigées | exit 0, 12 ok / 0 FAIL | `transitions-green.out` |
| `npm run test:zone -- messages forum` | exit 0, 1006 ok / 0 FAIL, 79 s | `targeted-final.out` |
| `npm run test:router` | exit 0, 18 contrôles | `router.out` |
| ESLint des JS modifiés | exit 0, aucune erreur ni warning | `lint-changed-final.out` |
| `npm run test:all`, total final complet unique de la reprise | exit 0, **3290 ok / 0 FAIL**, 57 fragments, 458 s, concurrence 6 | `total-complete.out`, `total-complete.exit.json`, `total-complete/*.log` |

Le fragment sous-forum L5, long, finit réellement : 563 ok / 0 FAIL. Le processus du total a été suivi jusqu’à sa sortie, pas abandonné après un timeout d’attente.

La suite messages couvre : 320/375/700 px ; lecture, réponse et édition en sombre/clair ; seuils 767/768/769 et bascule dans les deux sens ; bureau 1280 ; 16 thèmes avec contrastes >= 4,5:1 ; cinq outils courants et treize extras ; menus natifs de couleurs/émoticônes via Bootstrap 3.3.7 et jQuery 3.3.1 embarqués ; cibles >= 44 px, débordements, non-recouvrement, texte et signatures des nœuds/actions natifs conservés. Les assertions forum historiques conservent les mesures de hit-test de la validation et du retour en haut.

### Multiset historique

- `historical-source-multiset.json` : comparaison exacte des expressions de libellés des suites préexistantes contre `7d1c533` ; **412 appels check conservés, aucun supprimé ni renommé**.
- `historical-runtime-multiset.json` : référence d’exécution conservée de `t_9ec62c77` (2982 assertions, 48 fragments) comparée au total final. Les **2982 assertions historiques** sont présentes, plus **308** assertions messages.
- Le multiset exact des libellés rendus diffère sur 17 paires : seulement des compteurs de positions de défilement calculés à l’exécution. Les différences exactes restent enregistrées ; après normalisation explicite de ces mesures, aucun ajout/retrait historique. Le nombre seul n’a pas servi de preuve.
- Les anciens libellés parlant de « barre fixe » restent des identifiants historiques pour cette comparaison, **pas la description du contrat actuel**. Les assertions ont été adaptées à la décision validée : validation dans le flux, mesure des six points quand le bouton est entièrement dans le viewport, ouverture de Plus pour mesurer les 18 outils. Les assertions v3 nommées explicitement vérifient le nouveau contrat. Aucun test historique n’est supprimé.

### Lint global : dette préexistante, pas de faux vert

`npm run lint:css` reste exit 2 : 13 erreurs. La même commande sur le CSS de `7d1c533` donne les mêmes 13 erreurs (positions déplacées par le retrait du bloc ancien). `lint-css-baseline.out` et `lint-baseline-provenance.json` enregistrent la preuve.

`npm run lint:js` reste exit 1 : 7 erreurs dans `kraland-userscript-main.js` et `validate.js`, tous deux identiques à la base, avec configuration identique. Le warning no-shadow de la nouvelle suite a été corrigé ; les fichiers JS modifiés passent le lint ciblé. La validation du bundle minifié garde un warning « use strict » préexistant. Le lint global n’est donc pas présenté comme passant.

## Captures et limites

Nouvelles captures comparables, sans état de vote simulé final :

- `captures-avant/` : 54 PNG, bundle de `7d1c533` vérifié octet pour octet et SHA-256 `c6fadd828a6562b219f7f18bd8558e238e9a6357ce236ebb017fdd7012fe7dac`.
- `captures-apres/` : 54 PNG, bundle reconstruit livré.
- `planches-finales/` : 6 HTML autonomes et 6 PNG, sombre/clair × 320/375/700, lecture/rédaction/édition et états ouverts/bas de page.
- Chaque manifeste de capture confirme un document, zéro action native et zéro navigation native. Toutes les requêtes du générateur de captures sont interceptées ; les ressources sont locales. Le logo de fixture vient d’un recadrage d’une capture déjà conservée, et les avatars sont des blocs de fixture, pas des portraits réels.

Les captures sont de vraies exécutions Chromium de fixtures, **pas** des captures de validation live ni un téléphone physique. Les contenus de fixture sont explicitement des données de test. Les handlers sensibles sont inertes ; les tests de conservation ne prouvent pas une opération serveur réelle. Aucun formulaire live, vote, envoi ou confirmation n’a été déclenché. Aucun Chrome partagé 9222/9223, serveur de développement, extension ou configuration globale n’a été utilisé/modifié dans cette reprise.

La QA et la revue de code indépendantes restent à faire par @qa. Ce rapport n’est pas leur approbation ; aucun merge n’est autorisé par cette livraison.

## Environnement et nettoyage

- Build et Chromium de fixtures terminés ; le processus suivi du total est sorti en exit 0.
- Aucun conteneur créé par cette tâche. `docker ps -a` échoue car le socket Docker est absent ; aucun daemon n’a été démarré, et aucun conteneur tiers/Apple n’a été touché.
- Sondes et scripts temporaires dans le scratch Hermes ; journaux et captures conservés comme livrables de la carte, jamais ajoutés au dépôt. Aucun paquet installé : le recadrage utilise `sips` présent sur macOS, sans Pillow.
- Le lien temporaire `node_modules` du worktree vers les dépendances déjà présentes est retiré après vérification ; les dépendances réelles ne sont pas supprimées. Dépôt de travail propre après commit. Le worktree est conservé pour la QA et la PR, sans modification du checkout principal.
