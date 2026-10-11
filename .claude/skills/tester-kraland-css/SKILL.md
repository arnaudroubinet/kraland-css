---
name: tester-kraland-css
description: Use when modifying Kraland CSS, userscript or fixture tests and choosing the smallest safe e2e run before final regression.
---

# Tests e2e sur fixtures

Depuis le dépôt, avec les dépendances déjà présentes : aucun prérequis machine pour Bootstrap, les fichiers `bootstrap.min.css`, `bootstrap.min.js`, `jquery.min.js` (Bootstrap 3.3.7 et jQuery 3.3.1) sont embarqués dans `tests/e2e/vendor/` (voir son README) et utilisés par défaut. `KR_BOOTSTRAP_DIR=/dossier` permet de pointer ailleurs ; si le dossier (par défaut ou indiqué) est incomplet, `test:all` et la zone forum sortent en exit 2 au lieu de prétendre à un vert incomplet. `KR_SCRIPT` permet de tester une copie jetable du bundle ; `KR_CONCURRENCY=6` plafonne le parallélisme (défaut min(8, CPU/2)). `KR_SHOTS=1` active les captures, isolées par fragment sous les journaux ; `KR_LOGDIR` permet de choisir un dossier hors dépôt, sinon un dossier temporaire unique est créé.

| Fichier ou zone touchée | Commande ciblée |
|---|---|
| Forum, BBCode, seuil du formulaire | `npm run test:zone -- forum` |
| Plateau, navigation, jauges (le mini-profil les affiche aussi : `test:changed` vise profil ET plateau) | `npm run test:zone -- plateau` |
| Croix directionnelle | `npm run test:zone -- croix` |
| Démarrage, stockage, chargement différé | `npm run test:zone -- demarrage` (bascule 768 / resize / reload / mobile-mode : ajouter `transitions`, que `test:changed` vise aussi) |
| Transitions au seuil / resize | `npm run test:zone -- transitions` |
| Images de carte, exclusions, repli | `npm run test:zone -- images` |
| Mini-profil | `npm run test:zone -- profil` |
| Changements mixtes ou inconnus | `npm run test:changed` (l'incertitude élargit au total), puis `npm run test:all` en fin de tâche |

Boucle : reproduire le rouge sur la zone avec `npm run test:red -- forum` (succès = échec attendu détecté), corriger, vérifier le vert par `test:zone`, puis lancer `npm run test:all` UNE fois en fin de travail. Ne pas relancer le forum et les suites lourdes après chaque retouche. `npm run test:zones` affiche les correspondances. `test:changed` inspecte les fichiers et les hunks CSS/JS ; si la portée d'une modification est ambiguë, préférer le total manuellement. Un mot-clé de bascule (breakpoint, resize, reload, mobile-mode, sessionStorage…) vise demarrage ET toutes les zones de `breakpoint-switch` (transitions, plateau) ; « jauge » vise profil ET plateau ; un diff qui ne touche que le bundle généré (`kraland-userscript-main.user.js`) élargit au total. Le routage est dans `tests/e2e/lib/router.mjs`, vérifié sans navigateur par `npm run test:router` (hunks de référence, dont un commentaire sur la ligne qui crée `kr-resize-banner`) : le lancer après toute modification du routeur. Les noms historiques (`test:forum-mobile`, `test:demarrage`…) fonctionnent toujours en série.

Mesure sur 79cb8bb, Chromium local, charge initiale 1,29/1,18/1,08 : avant en série 985 s pour huit suites avec assertions (forum 371, démarrage 371, transitions 112, croix 75, profil 17, qualité 9, exclusions 10, repli 20) ; audit d'inventaire hors ligne < 1 s. Après fragmentation/concurrence 6 : `test:all` 115 s au mur, 1745 ok / 0 FAIL (durées cumulées par suite dans le rapport de la carte t_37da56ab). La charge et les captures modifient ces chiffres ; les fenêtres d'observation d'une absence d'événement restent incompressibles. Bornes actuelles : « pas de rechargement » (breakpoint-switch) 1,8 s d'état stable, comme avant ; redimensionnement avec rechargement attendu 0,9 s (la sonde voit le changement de document) ; démarrage : 2,5 s sans nouveau document après injection et chargement complet (avant : 6 s + 2 s fixes), soit davantage que l'écart minimal de 1,2 s entre deux rechargements + anti-rebond 400 ms. Un rechargement plus tardif que cette borne passerait inaperçu : l'allonger (QUIET_MS) si le script change ces délais. Les libellés `au plus 4 documents en 6 s` sont conservés tels quels (historiques) pour garder les 1745 libellés identiques.

Sécurité : Chromium Playwright local sur fixtures interceptées seulement ; jamais les Chrome 9222/9223, jamais le site réel, aucun clic de validation ni envoi. Les captures, journaux et TMPDIR restent hors du dépôt. Tester les seuils N−1/N/N+1 ; un faux Bootstrap sans cascade réelle peut donner un faux vert (garder la passe réelle). Pour ajouter une suite, l'enregistrer dans `tests/e2e/lib/router.mjs` (`SUITES`, `zones`, `frags` partitionnant les assertions), associer les fichiers dans `FILE_RULES` (même fichier) ou élargir prudemment, lancer `npm run test:router`, puis vérifier les nombres `ok`/`FAIL` contre une exécution série et une contre-épreuve rouge. Ajouter une zone dans `zones` et le tableau ci-dessus.
