# Vue d'ensemble du projet Kraland-CSS

## Objectif
Ce projet est un userscript Tampermonkey qui modernise l'interface du site Kraland (http://www.kraland.org) côté client. Il propose 9 variantes de thème basées sur les différentes nations de Kraland.

## Stack technique
- Userscript Tampermonkey
- CSS de surcharge
- Bootstrap 3
- JavaScript vanilla
- Node.js pour le build

## Structure du projet
- `kraland-userscript-template.js` : Template du userscript (fichier source à modifier)
- `kraland-theme.css` : CSS de surcharge (fichier source à modifier)
- `kraland-userscript-main.js` : Fichier généré automatiquement par le build (ne pas modifier directement)
- `build.js` : Script de build qui génère le userscript final
- `screenshots/` : Captures d'écran des différentes variantes de thème
- `images/` : Images utilisées par le thème

## Points importants
- Le fichier `kraland-userscript-main.js` est généré automatiquement et ne doit pas être modifié directement
- Les modifications doivent être faites dans `kraland-userscript-template.js` et `kraland-theme.css`
- Le script ne peut pas modifier le HTML/CSS du site directement, uniquement en surcharge côté client
- Le projet utilise Playwright MCP tools pour analyser et tester les modifications
