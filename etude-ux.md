# Mission : analyse UX d'harmonisation de la surcharge Kraland

Tu es l'agent UX de ce projet. Active le skill `bmad-agent-ux-designer` (Sally) et suis la méthode BMad. `AGENTS.md` est chargé : respecte-le, sauf pour les autorisations élargies ci-dessous.

## Objectif

Analyser comment la surcharge actuelle (userscript + `kraland-theme.css`, 9 variantes de thème) habille chaque page de Kraland. Proposer ensuite une harmonisation de toutes les pages sur le modèle de ce qui a été fait pour le forum et pour la partie « jouer » (plateau).

Ces deux zones de référence ne sont pas intouchables. Si elles posent problème, propose de les revoir aussi.

Le point de vue est celui du **joueur** : il vient pour jouer. L'interface doit être parfaitement lisible, claire, limpide et ergonomique, sur ordinateur comme sur mobile.

Le cœur du sujet :
- **couleurs** ;
- **placement** ;
- **ratios et proportions** ;
- **cohérence d'une page à l'autre** : un même élément doit avoir le même aspect et la même place partout.

## Leçon de l'essai précédent (à ne pas répéter)

Une revue UX précédente a été rejetée par Arnaud :
- elle avait mal compris le besoin ;
- elle n'a pas retouché ce qui devait l'être ;
- elle a ajouté un fil d'Ariane dont personne n'avait besoin ;
- elle a perdu de vue le jeu.

Donc :
- Pars de ce que le joueur fait pour jouer : plateau, ordres, déplacement, personnage, forum, kramail, notifications. Ne pars pas de la navigation ou de l'arborescence du site.
- N'invente aucun nouveau composant (fil d'Ariane, menu, barre…). Si tu penses qu'il en faut un, pose-le comme hypothèse et attends la validation.
- Corrige l'existant avant d'ajouter.

## Périmètre d'accessibilité

Uniquement pour les **joueurs voyants** : lisibilité, contraste, taille du texte, cibles tactiles (≥ 44 px), hiérarchie visuelle. **Hors périmètre** : lecteurs d'écran, ARIA, synthèse vocale, navigation non visuelle. La section « Accessibility Floor » d'EXPERIENCE.md se limite à cela.

## Étape 0 : vérifier ton outillage avant tout

Avant d'activer Sally, vérifie que tu peux étudier, tester et valider **en autonomie**, sans dépendre d'Arnaud pour une manipulation. Teste chaque point réellement, sans te contenter de supposer :

1. **Claude in Chrome** : les outils `mcp__claude-in-chrome__*` se chargent, le Chrome d'Arnaud est connecté, un onglet s'ouvre sur http://www.kraland.org, et la session est connectée (présence de `#exit`).
2. **Userscript actif** : sur une page de jeu, `<html>` porte bien `kr-theme-enabled` et `kr-theme-variant-*`. Le bouton de bascule du thème fonctionne, pour comparer avec le rendu natif.
3. **Changer de variante de thème** : trouve comment passer d'une variante à l'autre (page `/profil/interface`, ou clé `localStorage` `kr-theme-variant` puis rechargement), et vérifie que ça marche.
4. **Mobile** : vérifie que tu peux obtenir un vrai rendu mobile (375×667) qui déclenche `body.mobile-mode` et les media queries `max-width: 767px`. Si le redimensionnement de Chrome ne suffit pas, essaie le MCP Playwright (`mcp__playwright__browser_resize`) sur le site réel, ou une autre méthode. Indique laquelle tu retiens.
5. **Mesures** : tu peux lire les styles calculés (couleurs, tailles, marges, positions) via JavaScript dans la page (`getComputedStyle`, `getBoundingClientRect`).
6. **Captures** : tu peux prendre des captures d'écran en bureau et en mobile, et les ranger hors du dépôt, dans le scratchpad de la session.
7. **Maquettes** : tu peux produire une maquette HTML avant/après et l'afficher dans un navigateur pour la vérifier.
8. **BMad** : `uv` est disponible, et `uv run _bmad/scripts/resolve_config.py --project-root . --key core.output_folder` ainsi que `memlog.py` répondent.
9. **Dépôt** : `npm run build` passe et les fixtures Playwright se lancent (`npm run test:zone -- forum`). Ce n'est pas indispensable pour l'analyse, mais c'est utile pour vérifier une hypothèse sur une fixture.

Rends à Arnaud un tableau court : outil, statut (OK / KO / partiel), méthode retenue, et ce qui manque. Si un point bloque ton autonomie, propose une solution et **attends son accord avant d'installer quoi que ce soit**. Ne passe à la méthode BMad qu'une fois l'outillage validé par Arnaud.

## Méthode BMad à suivre

1. Active `bmad-agent-ux-designer` (Sally).
2. Aucune initiative n'est active. Passe par le skill `bmad` pour en créer une nommée `harmonisation-ux`. **Ne lance jamais `bmad setup` ni `bmad update`** (voir `AGENTS.md`). Seul `--status` est sûr.
3. Lance `bmad-ux` en mode **Create**, avec le **coaching path**, et le slug `harmonisation`. Livrables attendus dans `_bmad-output/harmonisation-ux/ux-harmonisation/` :
   - `DESIGN.md` : couleurs, typographie, espacements, formes, composants, à faire / à éviter ;
   - `EXPERIENCE.md` : architecture de l'information centrée sur la boucle de jeu, patterns de composants, états, interactions, réactivité ordinateur/mobile, parcours clés ;
   - `.memlog.md` : chaque décision et chaque hypothèse, via `memlog.py append`, jamais éditée à la main ;
   - `.working/` : maquettes HTML avant/après.
4. **Adaptation de `bmad-ux` voulue par Arnaud.** Le skill dit d'éliciter la vision de l'utilisateur sans proposer de directions. Ici, un thème existe déjà, et Arnaud attend de toi **des hypothèses argumentées** qu'il validera ou rejettera.
   - Tu proposes, il tranche.
   - Présente une hypothèse à la fois, ou un petit lot cohérent.
   - Chaque hypothèse contient :
     - **Constat** : page(s), élément, mesure ou capture (couleur, taille, position, ratio), écart avec la référence ;
     - **Hypothèse** : ce que tu proposes de changer, et sur quelles pages ;
     - **Bénéfice joueur** : en une phrase ;
     - **Maquette** : avant/après dans `.working/` quand voir aide plus que lire.
   - Attends le verdict d'Arnaud (validée / rejetée / à reformuler) et enregistre-le dans le memlog avant de passer à la suivante.
   - Une question d'Arnaud (« Et si la date était colorée ? ») est une piste à évaluer, pas une décision.
5. **Arrête-toi après Finalize** (DESIGN.md + EXPERIENCE.md). Pas de PRD, pas d'epics, pas de tickets, pas de code CSS/JS : l'implémentation attend le go explicite d'Arnaud.

## Déroulé suggéré

1. **Comprendre la surcharge.** Lis `kraland-theme.css` (variables `--kr-*`, variantes `html.kr-theme-variant-*`, media queries mobile/bureau) et la structure de `kraland-userscript-template.js` : modules `InitQueue`, `applyDOMTransformations`. Délègue la lecture de ces gros fichiers à des sous-agents. Repère comment forum et plateau ont été traités : composants, couleurs, espacements, comportements mobiles. C'est la référence de départ.
2. **Inventorier les pages réelles.** Fais-le du point de vue du joueur, en priorisant celles de la boucle de jeu, puis les pages secondaires. Pour chaque page :
   - quels styles s'appliquent ;
   - ce qui est cohérent ou incohérent avec la référence ;
   - ce qui gêne la lecture ou le jeu.
   Vérifie chaque page en bureau (1280×720) et en mobile (375×667), et sur au moins deux variantes de thème contrastées.
3. **Synthétiser les incohérences** en familles : palette, typographie, espacements, cartes/panneaux, boutons, tableaux, en-têtes, comportement mobile. Puis dérouler les hypothèses (étape 4 de la méthode).
4. **Finaliser** DESIGN.md et EXPERIENCE.md à partir du memlog.

## Accès au site réel (autorisation d'Arnaud)

Arnaud autorise la navigation sur le vrai site http://www.kraland.org avec son compte, via Claude in Chrome (son Chrome, déjà connecté, avec le userscript actif). Les autres interdictions d'`AGENTS.md` sur le site réel sont levées pour cette mission, **sauf une** :

- **INTERDIT :** valider un formulaire qui envoie un kramail ou qui fait une action de jeu (ordre, déplacement, achat, vote, envoi de message, etc.). Tu peux ouvrir les formulaires et les modales pour les observer, mais ne clique jamais sur le bouton qui les valide.

À savoir :
- Ouvrir `/report` marque toutes les notifications comme lues. C'est autorisé, mais visite-la une seule fois, en connaissance de cause.
- Le site est en HTTP uniquement.
- Le bouton de bascule du thème permet de comparer la surcharge avec le rendu natif.
- Les captures d'écran et les relevés du site réel restent **hors du dépôt**. Seules les maquettes de `.working/` y entrent.

## Style de travail

- Échanges et documents en français. Kraland est un jeu parodique : pas de ton dramatique.
- Sois concis avec Arnaud. Les détails vont dans les fichiers BMad, et tu cites le chemin du fichier produit.
- Aucun commit sans accord explicite.
