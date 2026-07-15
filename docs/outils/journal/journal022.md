# Journal 022 — Commit 22 : refonte visuelle complète (mobile-first)

Fichiers modifiés : `outils/fiche.html`, `outils/css/base.css`,
`outils/js/tableau-competences.js`, `outils/js/stats.js`,
`outils/js/equipement.js`.

## Direction visuelle (pas de brief précis donné, j'ai tranché)

Thème "PDA de survivant" : sobre, technique, lisible — pas le
dark-mode générique à accent néon qu'on voit partout. Fond noir
légèrement verdâtre (teinte "eaux stagnantes"), accent principal
vert-de-gris/verdigris (oxydation, contamination organique — cohérent
avec l'univers), rouille/ambre réservé aux alertes (surcharge, HS).
Libellés en police monospace (JetBrains Mono, chargée via Google
Fonts — légère, seulement 2 graisses) façon "lecture d'écran
militaire", texte courant en police système (rapide, pas de
téléchargement supplémentaire).

## Ce qui change concrètement

- **Nav du bas** façon appli mobile (7 onglets, icône + libellé court),
  fixe en bas de l'écran sur téléphone ; redevient une barre d'onglets
  classique sous l'en-tête sur écran large (tablette/desktop).
- **En-tête compact et sticky** (nom du jeu + bouton export réduit à
  une icône).
- **Cartes** : chaque bloc de contenu (profil, XP, affinité, portrait,
  compétences, stats, équipement...) est maintenant visuellement
  délimité, cohérent d'un onglet à l'autre.
- **Panneaux repliables** : chevron animé, hiérarchie visuelle plus
  claire entre le panneau principal (Prompt IA) et les sous-panneaux.
- **Tableaux → cartes sur mobile** : le tableau de compétences,
  celui des compétences passives, et l'inventaire ne s'écrasent plus
  en défilement horizontal illisible — chaque ligne devient sa propre
  carte empilée, avec les libellés de colonne affichés en petit au-
  dessus de chaque valeur (technique CSS `data-label`, ajout d'un
  attribut sur les cellules concernées, aucune logique changée).
- **Dés, jauges, pips** : styles retravaillés pour une lisibilité
  immédiate (dé sélectionné en évidence, jauges de vie en cases
  cliquables plus grandes, couleurs d'état cohérentes avec la palette).

## Bug trouvé en testant (pas lié à ce commit, corrigé au passage)

`stats.js` itérait sur `config.competencesPassives.jaugeParVocation`
avec `Object.entries()`, qui incluait la clé `_commentaire` (texte
descriptif) comme si c'était une 4ᵉ jauge — produisait une jauge
fantôme vide. Filtrée, vérifié : 3 jauges affichées, pas 4.

## Non touché (comme convenu)

Spécialisation, Affinités, Notes restent de simples cartes "à venir" —
pas de travail visuel dessus pour l'instant, priorité donnée aux
onglets qui contiennent déjà du contenu réel pour tester le système.
`index.html` (page de création) n'a reçu que les styles partagés
(boutons, dés, tableau) — pas de refonte de sa structure, la priorité
étant la fiche pour l'usage en jeu sur téléphone.

## Tests

Non-régression complète bout-en-bout (création + fiche) : aucune
casse fonctionnelle malgré la restructuration HTML/CSS — bascule
d'onglets, 9 cellules de compétences, cartes bien présentes,
transformation mobile des tableaux vérifiée (attributs `data-label`
présents), 3 jauges de vie (bug corrigé), 9 compétences passives.
Tout est passé.

Prochain commit : à toi de tester en vrai sur ton téléphone et de me
dire ce qui ne va pas — c'est un premier jet, pas une version finale.