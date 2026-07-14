# Journal 013 — Commit 13 : prompt IA affiné (affinité optionnelle, compétences notables, traits sans ambiguïté)

Fichiers modifiés : `outils/js/prompt-ia.js`, `outils/js/fiche.js`,
`outils/fiche.html`.

1. **Affinité optionnelle** : case à cocher "Inclure l'affinité dans le
   prompt", **décochée par défaut** (`personnage.inclureAffiniteDansPrompt = false`).
   Tu avais raison, l'afficher systématiquement poussait vers des
   résultats trop extrêmes — elle reste maintenant sous-entendue sauf
   activation volontaire.
2. **Compétences notables par axe** : les lignes Vocations/Attributs
   listent maintenant, entre parenthèses, les compétences fort/faible
   de cet axe (ex: `Interaction Moyen (Persuasion : faible, Bluff : faible)`).
3. **Traits fusionnés, sans ambiguïté** : une seule section (plus de
   doublon "Traits de caractère" côté compétences ET côté portrait),
   séparée en deux lignes claires : "Traits marqués" (mots qualité +
   traits du panneau Portrait) et "Traits peu présents" (mots défaut) —
   fini le "(fort)/(faible)" collé à chaque mot qui pouvait se lire
   comme un degré d'intensité du trait lui-même plutôt qu'une catégorie.

## Tests

Vérifié : sans case cochée, aucune ligne "Affinité :" ; case cochée,
la ligne apparaît avec la description courte ; compétences notables
correctement listées par axe ; plus aucune occurrence de l'ancien
format ambigu `mot (fort)`. Texte complet relu, conforme.

---

# Prochain chantier (en cours) : tableau unifié Vocation × Attribut

Tu demandes de fusionner en **un seul tableau** ce qui est aujourd'hui
réparti en plusieurs blocs séparés :
- le choix des dés (Attributs/Vocations, aujourd'hui `creation.js`)
- la répartition des points de compétences (aujourd'hui `competences.js`)
- l'affichage en lecture seule côté fiche (aujourd'hui `fiche-competences.js`)

Un seul tableau 4x4 (visuel), avec les dés en radio dans les en-têtes de
ligne/colonne, et 2 cases à cocher par compétence (une pour le point
Vocation, une pour le point Attribut). Je pars sur ce chantier tout de
suite dans la foulée (commit 14).