# Journal 020 — Commit 20 : onglet Stats (compétences passives + jauges de vie)

Fichier ajouté : `outils/data/competences-passives.json`.
Fichiers modifiés : `outils/data/config.json`, `outils/js/stats.js` (nouveau),
`outils/js/loader.js`, `outils/js/fiche.js`, `outils/fiche.html`,
`outils/css/base.css`.

## Compétences passives (résistances)

Grille en lecture seule, reflet automatique confirmé : même niveau que
la compétence active correspondante (Athlétisme fort → Résistance
forte automatiquement), pas de répartition séparée. Seuil affiché dans
l'autre sens ("Seuil adverse") — table `config.competencesPassives.seuilsResistance`
(0+ à 7+, croissant avec le niveau, comme confirmé).

## Jauges de vie

3 jauges (Endurance/Intégrité/Ténacité), chacune liée au dé de sa
Vocation (Exploration/Interaction/Action) — taille réelle (6, 8 ou 10
cases selon d6/d8/d10 déjà choisi). Cases cliquables, comportement
classique de jauge de vie : cliquer sur une case va "jusque-là" (perd
toutes les cases jusqu'à celle cliquée si elle est plus loin, ou
soigne jusqu'à elle si elle est plus proche que l'état actuel).

Zones affichées selon tes paliers exacts (vérifiées par test) :
- d6 : 3 cases "Ça va", 1 case "+1", 1 case "+2", 1 case "HS"
- d8 : 4/2/1/1
- d10 : 4/3/2/1

Rien n'est automatisé (dégâts, soins) — géré en jeu, comme convenu.

## Prochain chantier (noté, pas commencé)

Restructuration de la page de création (`index.html`) en parcours
linéaire : Questionnaire ou Création libre → tableau 3x3 → objets →
Terminer — à faire une fois que tu valides qu'on enchaîne dessus.

## Tests

Bout-en-bout : niveau Athlétisme 2 → Résistance reflète bien 2 (seuil
adverse 4+) ; jauge Endurance = 10 cases car dé Exploration = d10,
jauge Intégrité = 6 cases car dé Interaction = d6 ; clic sur la 5e case
d'une jauge d10 → zone "+1 au seuil" (cases 1-5 perdues, 4 "rien" + 1
"malus1", conforme) ; reclic sur la même case → retour à "Ça va" (4
perdues) ; clic sur la dernière case → "HS" ; persistance en
localStorage vérifiée. Tout est passé.

Prochain commit : à toi de choisir — la restructuration de la création,
ou autre chose.