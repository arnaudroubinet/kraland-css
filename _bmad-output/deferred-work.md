# Travail différé

## Lot A (tickets backlog 25, 26, 29), revue quick du 2026-10-31

- Ticket 25 : `accueil-mobile#defileur` ne rejoue pas les tours à 1280 px. La règle est mobile seulement et `accueil-mobile#bureau` compare l'ordinateur à la base.
- Ticket 29 : aucune autre page mobile n'est comparée à la base par `accueil-mobile#jouer`. Les règles sont gardées par `:where(html.kr-page-accueil)`.
