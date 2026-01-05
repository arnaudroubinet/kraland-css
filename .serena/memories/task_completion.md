# Processus de complétion de tâche

## Workflow obligatoire
1. **Capturer le réel** : Utiliser Playwright MCP tools pour analyser le HTML/CSS existant
2. **Analyser** : Bien définir le changement à apporter
3. **Documenter** : Utiliser context7 si nécessaire pour récupérer la documentation
4. **Proposer** : Présenter un plan de modification
5. **Valider** : Attendre la validation du plan
6. **Modifier** : Faire les modifications dans les fichiers sources
7. **Builder** : Exécuter `npm run build`
8. **Attendre** : Patienter 5 secondes pour que Tampermonkey charge la mise à jour
9. **Tester** : Utiliser Playwright MCP tools pour vérifier les changements
10. **Réitérer** : Si nécessaire, recommencer le cycle

## Points de vigilance
- Toujours demander l'autorisation avant de prendre un screenshot
- Ne jamais modifier directement `kraland-userscript-main.js`
- Toujours attendre 5 secondes après le build avant de tester
- Utiliser uniquement Playwright MCP tools pour les tests (pas NPM)
- Ne pas utiliser git sauf pour reset les changements

## Validation
- Vérifier que le build passe sans erreur
- Tester la modification sur le site réel avec Playwright
- S'assurer que les autres fonctionnalités ne sont pas cassées
