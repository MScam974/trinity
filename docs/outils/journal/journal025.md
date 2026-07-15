# Journal 025 — Commit 25 : 5 améliorations (fiche + création)

Fichiers modifiés : `outils/index.html`, `outils/fiche.html`,
`outils/js/app.js`, `outils/js/fiche.js`, `outils/js/stockage.js`,
`outils/js/tableau-competences.js`, `outils/css/base.css`.

⚠️ Destination réelle : `docs/outils/`.

## 1. Bouton "Ouvrir la fiche" dans le panneau de gestion

Ajouté à côté de Sauvegarder/Charger, le bouton du bas ("Terminer et
ouvrir ma fiche") reste inchangé.

## 2. Menu burger sur la fiche

Le bouton flèche de téléchargement est remplacé par ☰, qui ouvre un
menu plein écran avec : Exporter, Charger un JSON (nouveau sur la
fiche — réutilise `importerPersonnageJSON`), et les 3 actions de reset
(questionnaire/création libre/total) qui redirigent vers `index.html`
avec le bon onglet préparé (même mécanisme `sessionStorage` que sur la
page de création).

## 3. Nom de fichier `joueur_personnage.json`

`exporterPersonnageJSON` génère maintenant `vincent-test_kaan.json` au
lieu de `kaan.json` — testé avec profil rempli et profil vide (repli
`joueur_personnage.json`).

## 4. Thème clair / sombre

Bouton 🌓 dans l'en-tête des deux pages (`index.html` et `fiche.html`),
préférence partagée entre les deux via `localStorage` (clé
`trynyty-theme`). Palette claire : fond parchemin, accent vert-de-gris
plus foncé pour rester lisible sur fond clair.

## 5. Aide textuelle sur le tableau de création

Au-dessus du tableau (mode éditable uniquement — n'apparaît pas sur la
fiche), un encart liste les axes encore incomplets : "Il te reste 2
compétences à choisir pour Instinct", etc. Rien affiché pour un axe
"fort" (automatique) ou déjà complet.

## Tests

Aide textuelle vérifiée avec une combinaison réelle (Instinct moyen →
"reste 2", Exploration faible → "reste 1", Habileté fort → rien) ;
bascule de thème vérifiée (classe + persistance localStorage) ; nom de
fichier d'export vérifié avec profil rempli et profil vide. Menu burger
et actions de reset non re-testées unitairement ce commit (même
mécanisme que le panneau de gestion du commit 24, déjà validé) —
vérifie quand même visuellement que le menu s'ouvre/se ferme bien.

Prochain commit : à toi de tester et de me dire la suite.