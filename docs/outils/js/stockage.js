/**
 * stockage.js
 * Sauvegarde/chargement du personnage.
 * - localStorage : sert de pont entre outils/index.html (création) et
 *   outils/fiche.html (feuille de jeu), et évite de tout perdre au
 *   rafraîchissement de page.
 * - export/import JSON : sauvegarde portable, hors du navigateur.
 * Ne connaît aucune règle de jeu : ne fait que sérialiser/désérialiser
 * l'objet personnage tel quel.
 */

const CLE_STOCKAGE = 'trynyty-personnage';

export function sauvegarderPersonnage(personnage) {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(personnage));
}

export function chargerPersonnageStocke() {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return null;
    try {
        return JSON.parse(brut);
    } catch (erreur) {
        console.error('Personnage stocké invalide :', erreur);
        return null;
    }
}

export function effacerPersonnageStocke() {
    localStorage.removeItem(CLE_STOCKAGE);
}

/**
 * Déclenche le téléchargement du personnage sous forme de fichier .json.
 */
export function exporterPersonnageJSON(personnage, nomFichier) {
    const nettoyer = (texte, repli) => (texte || repli).trim().replace(/\s+/g, '-').toLowerCase() || repli;
    const joueur = nettoyer(personnage.profil.joueur, 'joueur');
    const perso = nettoyer(personnage.profil.nom, 'personnage');
    const nom = nomFichier || `${joueur}_${perso}.json`;
    const contenu = JSON.stringify(personnage, null, 2);
    const blob = new Blob([contenu], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const lien = document.createElement('a');
    lien.href = url;
    lien.download = nom;
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
    URL.revokeObjectURL(url);
}

/**
 * Lit un fichier .json choisi par le joueur (input type="file") et
 * retourne l'objet personnage qu'il contient.
 * @param {File} fichier
 * @returns {Promise<object>}
 */
export function importerPersonnageJSON(fichier) {
    return new Promise((resolve, reject) => {
        const lecteur = new FileReader();
        lecteur.onload = () => {
            try {
                resolve(JSON.parse(lecteur.result));
            } catch (erreur) {
                reject(new Error('Fichier JSON invalide.'));
            }
        };
        lecteur.onerror = () => reject(new Error('Impossible de lire le fichier.'));
        lecteur.readAsText(fichier);
    });
}