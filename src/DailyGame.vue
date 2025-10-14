<template>
  <div v-if="dailyCharacter" class="daily-game">
    <h2>Personnage du jour</h2>
    <p><strong>Nom :</strong> ???</p>
    <input v-model="userGuess" placeholder="Devinez le nom" />
    <button @click="checkGuess">Vérifier</button>
    <p v-if="message">{{ message }}</p>

    <h3>Indices :</h3>
    <ul>
      <li><strong>Genre :</strong> {{ dailyCharacter.type || "Inconnu" }}</li>
      <li><strong>Affiliation :</strong> {{ dailyCharacter.affiliation || "Inconnu" }}</li>
      <li><strong>Fruit du Démon :</strong> {{ dailyCharacter.devil_fruit || "Aucun" }}</li>
      <li><strong>Haki :</strong> {{ dailyCharacter.haki || "Aucun" }}</li>
      <li><strong>Dernière prime :</strong> {{ dailyCharacter.bounty || "Inconnu" }}</li>
      <li><strong>Hauteur :</strong> {{ dailyCharacter.height || "Inconnu" }}</li>
      <li><strong>Origine :</strong> {{ dailyCharacter.origin || "Inconnu" }}</li>
      <li><strong>Premier arc :</strong> {{ dailyCharacter.first_arc || "Inconnu" }}</li>
    </ul>
  </div>
  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCharacters, selectDailyChallenge } from '@/api/onePieceService.js';

const dailyCharacter = ref(null);
const userGuess = ref('');
const message = ref('');

onMounted(async () => {
  try {
    const charactersList = await getCharacters();
    dailyCharacter.value = selectDailyChallenge(charactersList);
  } catch (error) {
    console.error(error);
  }
});

function checkGuess() {
  if (userGuess.value.trim().toLowerCase() === dailyCharacter.value.name.toLowerCase()) {
    message.value = 'Bravo ! Vous avez deviné le bon personnage.';
  } else {
    message.value = 'Désolé, ce n\'est pas le bon personnage. Essayez encore !';
  }
}
</script>

<style scoped>
.daily-game {
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  margin: 20px auto;
}
.daily-game ul {
  list-style: none;
  padding: 0;
}
.daily-game li {
  margin: 5px 0;
}
</style>
