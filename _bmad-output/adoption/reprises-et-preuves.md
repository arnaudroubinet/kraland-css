# Références existantes — reprise sans réécriture de l’histoire

Ce document est un index rédigé lors du setup, pas une revue rétroactive ni une approbation produit. Aucun contenu joueur, capture privée ou pièce jointe n’est recopié.

## Base du setup

- Dépôt : https://github.com/arnaudroubinet/kraland-css
- Base `origin/feature/next` vérifiée : `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`.
- Mandat d’installation : carte Hermes `t_a920e604`, décision Arnaud « b » pour installer la méthode complète ; PR séparée en brouillon, aucune fusion.
- Revue indépendante prévue : `t_0e8fb249`, dépendante du setup. Ce document ne préjuge pas son verdict.

## Sources dans cette base

| Source | Ce qu’elle apporte | Limite |
| --- | --- | --- |
| `CLAUDE.md` | Contraintes de langue, userscript, architecture InitQueue, CSS mobile/bureau, sources/générés et commandes | Documentation existante ; le setup ne la modifie ni ne la ratifie de nouveau |
| `package.json` | Commandes de build, validation, lint, routeur et suites de tests | Présence d’une commande ≠ exécution verte |
| `docs/MESSAGES-V3.md` | Mandat de la maquette mobile sombre, périmètre, composition, choix natifs et preuves rapportées | Rapport historique, pas nouvelle approbation ; avertissements et dettes de lint à conserver |
| `docs/AUDIT-MAP-IMAGES.md` | Audit existant des images | À consulter si le mandat porte sur les images ; aucune nouvelle conclusion ici |

Liens immuables :

- Contraintes : https://github.com/arnaudroubinet/kraland-css/blob/ac0e63810c1cc1367aaacfdb413a8c55c9da4100/CLAUDE.md
- Messages : https://github.com/arnaudroubinet/kraland-css/blob/ac0e63810c1cc1367aaacfdb413a8c55c9da4100/docs/MESSAGES-V3.md
- PR messages consultée via GitHub : https://github.com/arnaudroubinet/kraland-css/pull/15 ; état MERGED, commit de fusion `ac0e63810c1cc1367aaacfdb413a8c55c9da4100`.

## Décisions et preuves à retrouver, non à extrapoler

`docs/MESSAGES-V3.md`, sections « Mandat et périmètre » et « Composition livrée », attribue à Arnaud la maquette mobile sombre « Moins d’interface. Plus de message. » pour la carte `t_9503a580`. Cela ne valide pas un nouveau bureau ni l’ensemble du thème clair.

Ses sections « Vérification exécutée » et « Confinement réseau » rapportent notamment un total final M-1 de 3322 contrôles verts, 58 fragments, et une dette de lint préexistante. Ce sont des résultats historiques attribués à ce rapport, non des tests réexécutés par le setup. Les archives citées restent dans les attachments de `t_9503a580` : aucune copie dans cette PR et aucun nouveau contrôle de leur contenu ici.

La PR #15 fusionnée est vérifiée sur GitHub. Une fusion ne constitue pas, à elle seule, une preuve de toutes les validations UX ou de tests. Le rapport conserve lui-même les limites du confinement des autres suites et la nécessité d’une QA indépendante.

## Travail concurrent non importé

Le mandat signale `t_71e4af53` comme travail Kramail en cours. Aucun fichier de son checkout, aucune spécification de sa branche et aucun statut produit ne sont importés ici. Les changements locaux PLT du checkout principal ne sont pas non plus une source publiée de cette installation.

## Suite

Pour le prochain mandat, choisir l’initiative et produire seulement les artefacts nécessaires à son périmètre. Le setup n’invente ni brief/PRD approuvé pour l’application existante, ni backlog historique de stories terminées. Les décisions réellement nouvelles restent à Arnaud et aux spécialistes concernés.
