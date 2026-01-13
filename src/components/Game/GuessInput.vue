<template>
  <div class="input-area-wrapper">
    <div class="input-area">
      <input
          v-model="localGuess"
          placeholder="Entrez le nom du personnage"
          @keyup.enter="handleEnter"
      />
      <button @click="handleEnter" :disabled="!localGuess">
        Vérifier
      </button>
    </div>

    <ul v-if="suggestions.length > 0" class="autocomplete-list">
      <li
          v-for="char in suggestions"
          :key="char.name"
          @click="onSelect(char)"
      >
        {{ char.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Définition des propriétés reçues du parent
const props = defineProps({
  suggestions: {
    type: Array,
    default: () => []
  },
  modelValue: String // Permet le v-model si tu le souhaites plus tard
});

// Définition des événements émis
const emit = defineEmits(['submit', 'select', 'update:modelValue']);

const localGuess = ref('');

// Synchronise la saisie locale avec le parent pour la recherche
watch(localGuess, (newVal) => {
  emit('update:modelValue', newVal);
});
function handleEnter() {
  // Si l'utilisateur a tapé quelque chose
  if (localGuess.value.trim()) {
    // S'il y a des suggestions affichées, on prend la première (automatique)
    if (props.suggestions.length > 0) {
      onSelect(props.suggestions[0]);
    }
    // Sinon, on tente de valider ce qui est écrit (si le nom est déjà complet)
    else {
      emit('submit', localGuess.value);
      localGuess.value = '';
    }
  }
}

// Gère la sélection dans la liste
function onSelect(character) {
  emit('select', character);
  localGuess.value = ''; // Vide le champ après sélection
}
</script>