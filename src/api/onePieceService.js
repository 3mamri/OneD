import axios from 'axios';

const API_BASE_URL = 'https://api.api-onepiece.com/v2';

// Récupère tous les personnages (FR)
export async function getCharacters() {
    try {
        const response = await axios.get(`${API_BASE_URL}/characters/fr`);
        return response.data; // JSON avec la liste des personnages
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages :", error);
        throw error;
    }
}

// Sélectionne un personnage aléatoire pour le Daily Challenge
export function selectDailyChallenge(charactersList) {
    if (!charactersList || charactersList.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * charactersList.length);
    return charactersList[randomIndex];
}
