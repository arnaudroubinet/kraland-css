---
description: "Guide pour travailler sur le projet"
applyTo: "**"
---

# Instructions pour contribuer au projet

Le projet est en français, tu dois échanger en français.

kraland-userscript-main.js ne doit pas être modifié directement, il est généré par build.js

Tu peux modifier kraland-userscript-template.js et kraland-theme.css pour faire tes modifications.

Ce userscript tampermonkey est destiné à être utilisé avec le site http://www.kraland.fr uniquement.
Tu ne peux pas modifier le html et le css du site directement, mais uniquement via ce userscript et ce css de surcharge.

Tu dois toujours utiliser playwright mcp tools pour analyser le site et tester les modifications.
Si tu veux tester une modificcation tu dois toujours attendre cinq secondes entre ta modification et le rechargement de la page, pour être sûr que le userscript a bien été mis à jour dans tampermonkey.

Tu en dois pas écrire ou executer de test avec playwright qui s'execute avec NPM. Tu ne peux que tester avec playwright MCP tools.