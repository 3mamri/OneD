<template>
  <div v-if="!isLoading" class="daily-game">
    <h2 v-if="!isGameOver">Devine le Personnage de One Piece d'Aujourd'hui !</h2>
    <h2 v-else class="message-success">{{ message }}</h2>

    <p v-if="!isGameOver" class="attempts-count">
      Tentatives : {{ guesses.length }}
    </p>

    <p v-if="message && !isGameOver && !message.includes('incorrect')" class="message">
      {{ message }}
    </p>

    <GuessInput
        v-if="!isGameOver"
        v-model="userGuess"
        :suggestions="filteredCharacters"
        @submit="checkGuess"
        @select="selectCharacter"
    />

    <GuessTable :guesses="guesses" />
  </div>

  <div v-else class="loading-state">
    <p>Chargement des données de Grand Line...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  getCharacters,
  selectDailyChallenge,
  getCharacterDetails,
  getHakiCount,
  getArcs
} from '@/api/onePieceService.js';

import GuessInput from './GuessInput.vue';
import GuessTable from './GuessTable.vue';
import '../../styles.css';

/* ---------------- STATE ---------------- */
const dailyCharacter = ref(null);
const charactersList = ref([]);
const arcsOrder = ref([]);
const userGuess = ref('');
const message = ref('');
const guesses = ref([]);
const isGameOver = ref(false);
const isLoading = ref(true);
const filteredCharacters = ref([]);

/* ---------------- LIFECYCLE ---------------- */
onMounted(async () => {
  try {
    // 1. On charge la liste et les arcs d'abord
    const [chars, arcs] = await Promise.all([getCharacters(), getArcs()]);
    charactersList.value = chars || [];
    arcsOrder.value = arcs || [];

    // 2. On sélectionne le perso du jour
    const rawDaily = selectDailyChallenge(charactersList.value);

    if (rawDaily) {
      // 3. On récupère ses détails
      const [details, hakiCount] = await Promise.all([
        getCharacterDetails(rawDaily.id),
        getHakiCount(rawDaily.id)
      ]);
      dailyCharacter.value = { ...rawDaily, ...details, haki: hakiCount };
    }
  } catch (error) {
    console.error("Erreur d'initialisation:", error);
    message.value = "Erreur de connexion aux escargots-phones.";
  } finally {
    isLoading.value = false;
  }
});

/* ---------------- WATCH ---------------- */
watch(userGuess, (newGuess) => {
  filterCharacters(newGuess);
});

/* ---------------- METHODS ---------------- */

function filterCharacters(input) {
  if (!input || input.length < 2) {
    filteredCharacters.value = [];
    return;
  }
  const lower = input.toLowerCase();

  filteredCharacters.value = charactersList.value
      .filter(char => {
        // Sécurité : on vérifie que searchNames existe
        const searchArray = char.searchNames || [char.name.toLowerCase()];
        const matches = searchArray.some(n => n.startsWith(lower));
        const alreadyGuessed = guesses.value.some(g => g.character.name === char.name);
        return matches && !alreadyGuessed;
      })
      .slice(0, 8);
}

function selectCharacter(character) {
  userGuess.value = character.name;
  filteredCharacters.value = [];
  checkGuess();
}

function formatBounty(bounty) {
  if (!bounty) return '0';
  if (bounty >= 1000000000) return (bounty / 1000000000).toFixed(1) + ' Md';
  if (bounty >= 1000000) return (bounty / 1000000).toFixed(0) + ' M';
  return bounty.toLocaleString();
}

function getClues(guessed, daily) {
  const clues = {};
  const display = {};

  const exactProps = ['type', 'devil_fruit', 'haki', 'origin', 'first_arc'];
  exactProps.forEach(prop => {
    clues[prop] = guessed[prop] === daily[prop] ? 'vert' : 'rouge';

    if (prop === 'haki') {
      display[prop] = guessed[prop] > 0 ? '✨'.repeat(guessed[prop]) : '❌';
    } else if (prop === 'devil_fruit') {
      display[prop] = guessed[prop] === 'Aucun' ? '❌' : '🔵';
    } else if (prop === 'type') {
      display[prop] = String(guessed[prop]).includes('Féminin') ? 'Féminin' : 'Masculin';
    } else if (prop === 'first_arc') {
      const gIndex = arcsOrder.value.indexOf(guessed.first_arc);
      const dIndex = arcsOrder.value.indexOf(daily.first_arc);
      if (gIndex === dIndex && gIndex !== -1) {
        display.first_arc = guessed.first_arc;
      } else {
        const arrow = gIndex > dIndex ? ' ↓' : ' ↑';
        display.first_arc = guessed.first_arc + (gIndex === -1 || dIndex === -1 ? '' : arrow);
      }
    } else {
      display[prop] = guessed[prop];
    }
  });

  const gAff = (guessed.affiliation || '').toLowerCase();
  const dAff = (daily.affiliation || '').toLowerCase();
  if (gAff === dAff) {
    clues.affiliation = 'vert';
    display.affiliation = '✔️';
  } else if (gAff.includes(dAff) || dAff.includes(gAff)) {
    clues.affiliation = 'jaune-affiliation';
    display.affiliation = '⚠️';
  } else {
    clues.affiliation = 'rouge';
    display.affiliation = '❌';
  }

  const gBounty = guessed.bounty || 0;
  const dBounty = daily.bounty || 0;
  if (gBounty === dBounty) {
    clues.bounty = 'vert';
  } else {
    clues.bounty = gBounty < dBounty ? 'jaune-up' : 'jaune-down';
  }
  display.bounty = formatBounty(gBounty);

  return { clues, display };
}

async function checkGuess() {
  if (isGameOver.value || !userGuess.value) return;

  const guessName = userGuess.value.trim().toLowerCase();
  // 1. On trouve le personnage de base dans la liste (celui qui a tout à "Inconnu")
  const baseChar = charactersList.value.find(c => c.name.toLowerCase() === guessName);

  if (!baseChar) {
    message.value = "Personnage inconnu.";
    return;
  }

  // 2. On appelle les APIs pour avoir les VRAIES infos (ID, Haki, Arc, Origine)
  const [details, hCount] = await Promise.all([
    getCharacterDetails(baseChar.id),
    getHakiCount(baseChar.id)
  ]);

  // 3. CRUCIAL : On crée un NOUVEL objet qui fusionne tout
  // On prend les infos de base (nom, image) ET on écrase les "Inconnu" par les détails
  const fullChar = {
    ...baseChar,
    ...details,
    haki: hCount
  };

  // 4. On compare avec le personnage du jour
  const result = getClues(fullChar, dailyCharacter.value);

  // 5. On ajoute au tableau (en haut de liste)
  guesses.value.unshift({
    character: fullChar,
    clues: result.clues,
    display: result.display
  });

  userGuess.value = '';
  filteredCharacters.value = [];

  if (fullChar.name.toLowerCase() === dailyCharacter.value.name.toLowerCase()) {
    message.value = `VICTOIRE ! C'était bien ${dailyCharacter.value.name}.`;
    isGameOver.value = true;
  }
}
</script>