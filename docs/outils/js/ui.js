/**
 * ui.js
 * Comportements d'interface génériques, indépendants des règles du jeu.
 * Aujourd'hui : bascule d'onglets. Pourra accueillir d'autres
 * comportements transverses (toasts, impression...) au fil des commits.
 */

/**
 * Initialise un système d'onglets.
 * Convention HTML attendue :
 *   <button class="onglet" data-onglet="xxx">...</button>
 *   <div class="onglet-contenu" id="onglet-xxx">...</div>
 *
 * @param {object} options
 * @param {HTMLElement} options.conteneurOnglets - conteneur des boutons .onglet
 * @param {HTMLElement} options.conteneurContenus - conteneur des .onglet-contenu
 * @param {(idOnglet: string) => void} [options.surChangement]
 */
export function initOnglets({ conteneurOnglets, conteneurContenus, surChangement }) {
    function activer(idOnglet) {
        conteneurOnglets.querySelectorAll('.onglet').forEach(bouton => {
            bouton.classList.toggle('actif', bouton.dataset.onglet === idOnglet);
        });
        conteneurContenus.querySelectorAll('.onglet-contenu').forEach(contenu => {
            contenu.classList.toggle('actif', contenu.id === `onglet-${idOnglet}`);
        });
        if (typeof surChangement === 'function') surChangement(idOnglet);
    }

    conteneurOnglets.querySelectorAll('.onglet').forEach(bouton => {
        bouton.addEventListener('click', () => activer(bouton.dataset.onglet));
    });

    return { activer };
}
