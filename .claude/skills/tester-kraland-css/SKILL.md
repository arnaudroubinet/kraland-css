---
name: tester-kraland-css
description: Use when modifying Kraland CSS, userscript or fixture tests and choosing the smallest safe e2e run before final regression.
---

# Tests e2e sur fixtures

Depuis le dépôt, avec les dépendances déjà présentes : `KR_BOOTSTRAP_DIR` doit pointer vers le dossier contenant `bootstrap.min.css`, `bootstrap.min.js`, `jquery.min.js` (Bootstrap 3.3.7 et jQuery). Sans ce dossier, `test:all` et la zone forum refusent de prétendre à un vert incomplet. `KR_SCRIPT` permet de tester une copie jetable du bundle ; `KR_CONCURRENCY=6` plafonne le parallélisme (défaut min(8, CPU/2)). `KR_SHOTS=1` active les captures, isolées par fragment sous les journaux ; `KR_LOGDIR` permet de choisir un dossier hors dépôt, sinon un dossier temporaire unique est créé.

| Fichier ou zone touchée | Commande ciblée |
|---|---|
| Forum, BBCode, seuil du formulaire | `npm run test:zone -- forum` |
| Plateau, navigation, jauges | `npm run test:zone -- plateau` |
| Croix directionnelle | `npm run test:zone -- croix` |
| Démarrage, stockage, chargement différé | `npm run test:zone -- demarrage` |
| Transitions au seuil / resize | `npm run test:zone -- transitions` |
| Images de carte, exclusions, repli | `npm run test:zone -- images` |
| Mini-profil | `npm run test:zone -- profil` |
| Changements mixtes ou inconnus | `npm run test:changed` (l'incertitude élargit au total), puis `npm run test:all` en fin de tâche |

Boucle : reproduire le rouge sur la zone avec `npm run test:red -- forum` (succès = échec attendu détecté), corriger, vérifier le vert par `test:zone`, puis lancer `npm run test:all` UNE fois en fin de travail. Ne pas relancer le forum et les suites lourdes après chaque retouche. `npm run test:zones` affiche les correspondances. `test:changed` inspecte les fichiers et les hunks CSS/JS ; si la portée d'une modification est ambiguë, préférer le total manuellement. Les noms historiques (`test:forum-mobile`, `test:demarrage`…) fonctionnent toujours en série.

Mesure sur 79cb8bb, Chromium local, charge initiale 1,29/1,18/1,08 : avant en série 985 s pour huit suites avec assertions (forum 371, démarrage 371, transitions 112, croix 75, profil 17, qualité 9, exclusions 10, repli 20) ; audit d'inventaire hors ligne < 1 s. Après fragmentation/concurrence 6 : `test:all` 115 s au mur, 1745 ok / 0 FAIL (durées cumulées par suite dans le rapport de la carte t_37da56ab). La charge et les captures modifient ces chiffres ; les fenêtres d'observation d'une absence d'événement restent incompressibles.

Sécurité : Chromium Playwright local sur fixtures interceptées seulement ; jamais les Chrome 9222/9223, jamais le site réel, aucun clic de validation ni envoi. Les captures, journaux et TMPDIR restent hors du dépôt. Tester les seuils N−1/N/N+1 ; un faux Bootstrap sans cascade réelle peut donner un faux vert (garder la passe réelle). Pour ajouter une suite, l'enregistrer dans `tests/e2e/run.mjs` (`SUITES`, `zones`, `frags` partitionnant les assertions), associer les fichiers dans `FILE_RULES` ou élargir prudemment, puis vérifier les nombres `ok`/`FAIL` contre une exécution série et une contre-épreuve rouge. Ajouter une zone dans `zones` et le tableau ci-dessus.
