<template>
  <div v-if="!isLoading" class="daily-game">

    <h2 v-if="!isGameOver">Devine le Personnage de One Piece d'Aujourd'hui !</h2>
    <h2 v-else class="message-success">{{ message }}</h2>

    <p v-if="!isGameOver" class="attempts-count">Tentatives : {{ guesses.length }}</p>

    <div class="input-area-wrapper" v-if="!isGameOver">
      <div class="input-area">
        <input
            v-model="userGuess"
            placeholder="Entrez le nom du personnage"
            @keyup.enter="checkGuess"
        />
        <button @click="checkGuess" :disabled="!userGuess">Vérifier</button>
      </div>

      <ul v-if="filteredCharacters.length > 0" class="autocomplete-list">
        <li
            v-for="char in filteredCharacters"
            :key="char.name"
            @click="selectCharacter(char)"
        >
          {{ char.name }}
        </li>
      </ul>
    </div>

    <p v-if="message && !isGameOver && !message.includes('incorrect')" class="message">{{ message }}</p>

    <div v-if="guesses.length > 0" class="clues-grid">
      <div class="grid-row header">
        <div>Personnage</div>
        <div>Genre</div>
        <div>Affiliation</div>
        <div>Fruit du Démon</div>
        <div>Haki</div>
        <div>Dernière prime</div>
        <div>Origine</div>
        <div>Premier Arc</div>
      </div>

      <div
          v-for="(guess, index) in guesses"
          :key="index"
          class="grid-row"
      >
        <div class="character-image-cell">
          <img
              :src="guess.character.image || '/default-op-image.png'"
              :alt="guess.character.name"
              class="character-image"
          />
        </div>

        <div :class="guess.clues.type"><div class="clue-content">{{ guess.display.type }}</div></div>
        <div :class="guess.clues.affiliation"><div class="clue-content">{{ guess.display.affiliation }}</div></div>
        <div :class="guess.clues.devil_fruit"><div class="clue-content">{{ guess.display.devil_fruit }}</div></div>
        <div :class="guess.clues.haki"><div class="clue-content">{{ guess.display.haki }}</div></div>

        <div :class="guess.clues.bounty">
          <div class="clue-content">
            {{ guess.display.bounty }}
            <span class="direction-arrow">
              <span v-if="guess.clues.bounty.includes('down')" class="arrow">↓</span>
              <span v-if="guess.clues.bounty.includes('up')" class="arrow">↑</span>
            </span>
          </div>
        </div>

        <div :class="guess.clues.origin"><div class="clue-content">{{ guess.display.origin }}</div></div>
        <div :class="guess.clues.first_arc"><div class="clue-content">{{ guess.display.first_arc }}</div></div>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <p>{{ message || 'Chargement du défi quotidien...' }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import {getCharacters, selectDailyChallenge} from '@/api/onePieceService.js';
import './styles.css';

const dailyCharacter = ref(null);
const charactersList = ref([]);
const userGuess = ref('');
const message = ref('');
const guesses = ref([]);
const isGameOver = ref(false);
const isLoading = ref(true);

const filteredCharacters = ref([]);

onMounted(async () => {
  try {
    charactersList.value = await getCharacters();
    dailyCharacter.value = selectDailyChallenge(charactersList.value);

    if (!dailyCharacter.value) {
      message.value = 'Erreur : Aucun personnage n\'a pu être sélectionné.';
      isGameOver.value = true;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    message.value = 'Erreur lors du chargement du défi. Vérifiez la console.';
    isGameOver.value = true;
  } finally {
    isLoading.value = false;
  }
});

watch(userGuess, (newGuess) => {
  filterCharacters(newGuess);
});

function filterCharacters(input) {
  if (input.length < 2) {
    filteredCharacters.value = [];
    return;
  }

  const lowerCaseInput = input.toLowerCase();

  filteredCharacters.value = charactersList.value
      .filter(char =>
          !guesses.value.some(g => g.character.name === char.name) &&
          char.name.toLowerCase().startsWith(lowerCaseInput)
      )
      .slice(0, 8);
}

function selectCharacter(character) {
  userGuess.value = character.name;
  filteredCharacters.value = [];
  checkGuess();
}

function formatBounty(bounty) {
  if (bounty === null || bounty === 0) return 'Inconnu';
  const num = parseInt(bounty, 10);

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' Md';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' M';
  }
  return num.toLocaleString('fr-FR');
}

function getClues(guessed, daily) {
  const clues = {};
  const display = {};

  const exactMatchProps = ['origin', 'first_arc'];
  exactMatchProps.forEach(prop => {
    const isMatch = guessed[prop] === daily[prop];
    clues[prop] = isMatch ? 'vert' : 'rouge';
    display[prop] = guessed[prop] || 'Inconnu';
  });

  const guessedType = (guessed.type || '').toLowerCase();
  const isTypeMatch = guessedType === (daily.type || '').toLowerCase();
  clues.type = isTypeMatch ? 'vert' : 'rouge';
  if (guessedType.includes('masculin')) {
    display.type = '🧔';
  } else if (guessedType.includes('feminin')) {
    display.type = '👩';
  } else {
    display.type = guessed.type || '❓';
  }

  const guessedDF = (guessed.devil_fruit || 'Aucun').toLowerCase();
  const dailyDF = (daily.devil_fruit || 'Aucun').toLowerCase();
  clues.devil_fruit = guessedDF === dailyDF ? 'vert' : 'rouge';

  if (guessedDF === 'aucun') {
    display.devil_fruit = '❌';
  } else if (guessedDF.includes('paramecia')) {
    display.devil_fruit = '🔵';
  } else if (guessedDF.includes('zoan')) {
    display.devil_fruit = '🟡';
  } else if (guessedDF.includes('logia')) {
    display.devil_fruit = '🟢';
  } else {
    display.devil_fruit = '✔️';
  }


  const isHakiMatch = guessed.haki === daily.haki;
  clues.haki = isHakiMatch ? 'vert' : 'rouge';
  display.haki = guessed.haki === 'Oui' ? '👑' : '❌';

  const guessedAffiliation = (guessed.affiliation || '').toLowerCase();
  const dailyAffiliation = (daily.affiliation || '').toLowerCase();

  if (guessedAffiliation === dailyAffiliation) {
    clues.affiliation = 'vert';
    display.affiliation = '✔️';
  } else if (
      (guessedAffiliation.includes('chapeau de paille') && dailyAffiliation.includes('chapeau de paille')) ||
      (guessedAffiliation.includes('corsaire') && dailyAffiliation.includes('corsaire')) ||
      (guessedAffiliation.includes('marine') && dailyAffiliation.includes('marine')) ||
      (guessedAffiliation.includes('amiral') && dailyAffiliation.includes('amiral')) ||
      (guessedAffiliation.includes('yonko') && dailyAffiliation.includes('yonko')) ||
      (guessedAffiliation.includes('empereur') && dailyAffiliation.includes('empereur')) ||
      (guessedAffiliation.includes('révolutionnaire') && dailyAffiliation.includes('révolutionnaire'))
  ) {
    clues.affiliation = 'jaune-affiliation';
    display.affiliation = '⚠️';
  } else {
    clues.affiliation = 'rouge';
    display.affiliation = '❌';
  }

  const numericalProps = ['bounty'];
  numericalProps.forEach(prop => {
    const guessedValue = guessed[prop];
    const dailyValue = daily[prop];
    const formattedBounty = formatBounty(guessedValue);

    if (guessedValue === dailyValue) {
      clues[prop] = 'vert';
      display[prop] = formattedBounty;
    }
    else if (guessedValue !== null && dailyValue !== null && guessedValue !== undefined && dailyValue !== undefined) {
      clues[prop] = (guessedValue < dailyValue) ? 'jaune-up' : 'jaune-down';
      display[prop] = formattedBounty;
    }
    else {
      clues[prop] = 'rouge';
      display[prop] = formattedBounty;
    }
  });

  clues.name = 'name-cell';
  return { clues, display };
}

function checkGuess() {
  if (isGameOver.value) return;

  const guessName = userGuess.value.trim();
  if (!guessName) return;

  let guessedCharacter = null;

  guessedCharacter = charactersList.value.find(char =>
      char.name.toLowerCase() === guessName.toLowerCase()
  );

  if (!guessedCharacter) {
    guessedCharacter = charactersList.value.find(char =>
        char.name.toLowerCase().includes(guessName.toLowerCase()) ||
        guessName.toLowerCase().includes(char.name.toLowerCase())
    );
  }

  if (!guessedCharacter) {
    message.value = `Personnage "${guessName}" non trouvé dans la base.`;
    userGuess.value = '';
    return;
  }

  if (guesses.value.some(g => g.character.name === guessedCharacter.name)) {
    message.value = `Vous avez déjà deviné ${guessedCharacter.name}.`;
    userGuess.value = '';
    return;
  }

  const { clues, display } = getClues(guessedCharacter, dailyCharacter.value);
  guesses.value.push({
    character: guessedCharacter,
    clues: clues,
    display: display
  });

  userGuess.value = '';
  filteredCharacters.value = [];

  if (guessedCharacter.name.toLowerCase() === dailyCharacter.value.name.toLowerCase()) {
    message.value = `VICTOIRE ! Vous avez deviné le bon personnage : ${dailyCharacter.value.name} en ${guesses.value.length} tentatives !`;
    isGameOver.value = true;
    return;
  }

  message.value = `Personnage incorrect. Continuez d'essayer.`;
}
</script>