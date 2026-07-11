# Journal 007 — Commit 7 : stockage + squelette fiche.html (2 pages)

Fichiers ajoutés : `outils/js/stockage.js`, `outils/js/fiche.js`, `outils/fiche.html`.
Fichiers modifiés : `outils/js/app.js` (bouton "Terminer"), `outils/index.html`
(bouton ajouté), `outils/css/base.css` (styles fiche).

## Architecture à deux pages (décidée avec toi)

- `outils/index.html` = atelier de création (questionnaire / création libre).
- `outils/fiche.html` = feuille de jeu, pensée pour rester ouverte sur
  mobile pendant la partie. S'ouvre dans un nouvel onglet.
- Pont entre les deux : **localStorage**, clé `trynyty-personnage`. Le
  bouton "Terminer et ouvrir ma fiche" sauvegarde puis `window.open('fiche.html')`.
- `stockage.js` gère aussi l'export vers un fichier `.json` téléchargeable
  (bouton "Exporter en JSON" sur la fiche) — sauvegarde portable en plus
  du localStorage. Import prévu (`importerPersonnageJSON`) mais pas encore
  câblé à un bouton (pas demandé pour ce commit).

## fiche.html : 7 onglets, 1 seul rempli

Onglets Personnage / Compétences / Stats / Équipement / Spécialisation /
Affinités / Notes créés (nav + zones), mais seul **Personnage** a du
contenu réel pour l'instant :
- Nom du personnage, nom du joueur, archétype (= `profil.concept`,
  texte libre) — modifiables directement sur la fiche, resauvegardés en
  localStorage à chaque frappe.
- Affinité de départ : les 3 noms (Harmonie/Pureté/Suprématie) avec une
  case à cocher chacun, **une seule cochée** (celle de `personnage.affinite`),
  **non modifiable** sur la fiche (fixée à la création).

Les 6 autres onglets affichent juste "À venir" pour l'instant.

## Rappel (hors périmètre, noté pour plus tard)

Le "triangle affinité" (déplacement du personnage vers Harmonie/Pureté/
Suprématie selon ses actes en jeu) est une mécanique de campagne, pas de
création. Le jour où on l'implémente, il faudra probablement un champ
`personnage.evolutionAffinite = { harmonie, purete, suprematie }` — rien
à faire aujourd'hui.

## Tests

- Test unitaire `stockage.js` : sauvegarde/relecture/effacement localStorage
  (round-trip exact vérifié). Export JSON non testable sous jsdom
  (`URL.createObjectURL` non implémenté par ce simulateur — API standard
  de tous les navigateurs réels, pas un bug du code).
- Test d'intégration bout-en-bout via serveur HTTP réel : réponses au
  questionnaire sur `index.html` → profil renseigné → clic "Terminer" →
  vérification du contenu exact du localStorage → chargement de
  `fiche.html` → vérification que les champs et la case affinité
  affichent exactement les mêmes données → bascule d'onglet. Tout est
  passé.

Prochain commit : à toi de choisir un onglet à remplir (Compétences —
triangle + carré, Stats, ou autre), ou on avance sur l'import JSON /
le bouton prompt IA de l'onglet Personnage.
