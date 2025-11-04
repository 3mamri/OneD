// src/api/onePieceService.js

import axios from 'axios';

const API_ENDPOINT = 'https://api.api-onepiece.com/v2/characters/fr';

const MAIN_AFFILIATIONS = [
    'Équipage du Chapeau de Paille',
    'Révolutionnaires',
    'Amiraux',
    'Quatre Empereurs',
    '7 Capitaines Corsaires',
    'Marine',
    'Supernovas',
    'Gouvernement Mondial',
    'Ancien équipage des Roger',
];

export async function getCharacters() {
    try {
        const response = await axios.get(API_ENDPOINT);
        const characters = response.data;

        // Filtrage pour ne conserver que les personnages pertinents
        const filteredCharacters = characters.filter(char =>  {
            const bountyNum = parseInt(char.bounty) || 0;
            const affiliationNormalized = (char.affiliation || char.status || '').trim();

            const isMainBounty = bountyNum >= 30000000;
            const isMainAffiliation = MAIN_AFFILIATIONS.some(aff =>
                affiliationNormalized.includes(aff)
            );
            const isHighRank = affiliationNormalized.includes('Amiral') ||
                affiliationNormalized.includes('Vice-Amiral') ||
                affiliationNormalized.includes('Chef d\'état-major') ||
                affiliationNormalized.includes('CP');
            const keyNames = ['Luffy', 'Zoro', 'Nami', 'Usopp', 'Sanji', 'Chopper', 'Robin', 'Franky', 'Brook', 'Jinbe', 'Shanks', 'Barbe Blanche', 'Kaido', 'Big Mom', 'Barbe Noire', 'Garp', 'Smoker', 'Sengoku', 'Dragon', 'Crocus'];
            const isKeyCharacter = keyNames.some(name => char.name.includes(name));

            return isMainBounty || isMainAffiliation || isHighRank || isKeyCharacter;
        });

        // Formatage et standardisation des données (Hauteur/height est exclu ici)
        return filteredCharacters.map(char => {
            const bountyValue = parseInt(char.bounty) || null;

            return {
                name: char.name.trim(),
                image: char.picture || char.image_url || null, // Assurez-vous d'avoir 'picture' ou 'image_url' dans votre API
                type: char.gender || char.type || 'Inconnu',
                affiliation: char.affiliation || char.status || 'Inconnu',
                devil_fruit: char.devilFruit || char.devil_fruit || 'Aucun',
                haki: (char.haki && char.haki !== 'Non') ? 'Oui' : 'Non',
                bounty: bountyValue,
                origin: char.origin || 'Inconnu',
                first_arc: char.firstArc || char.first_arc || 'Inconnu',
            };
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des personnages :", error);
        throw error;
    }
}

// Fonction utilitaire pour générer un nombre pseudo-aléatoire reproductible
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Sélectionne le personnage du jour de manière stable basée sur la date.
 */
export function selectDailyChallenge(characters) {
    if (!characters || characters.length === 0) {
        return null;
    }

    const today = new Date();
    // Crée une graine basée sur l'année, le mois et le jour actuels
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const randomIndex = Math.floor(seededRandom(seed) * characters.length);

    return characters[randomIndex];
}