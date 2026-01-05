# Commandes importantes

## Développement
- `npm run build` : Générer le userscript final à partir du template
- `npm run watch` : Mode watch qui rebuild automatiquement quand les fichiers sources changent
- `npm run serve` : Démarrer un serveur HTTP local sur le port 4848 avec CORS

## Tests
- `npm run test:e2e` : Exécuter les tests Playwright (Ne PAS utiliser, utiliser plutôt Playwright MCP tools)

## Linting/Formatage
- `npm run lint:css` : Vérifier le style CSS avec stylelint
- `npm run lint:css:fix` : Corriger automatiquement les erreurs de style CSS

## Commandes système (Windows)
- PowerShell : `ls`, `cd`, `Get-Content`, `Select-String` (grep), `Get-ChildItem` (find)
- Git : Uniquement pour reset les changements (interdiction d'autres usages)

## Workflow de développement
1. Utiliser Playwright MCP tools pour analyser le site
2. Modifier `kraland-userscript-template.js` et/ou `kraland-theme.css`
3. Exécuter `npm run build` pour générer le userscript final
4. Attendre 5 secondes pour que Tampermonkey charge la mise à jour
5. Tester avec Playwright MCP tools
6. Réitérer si nécessaire
