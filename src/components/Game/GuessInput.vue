<template>
  <div class="input-area-wrapper">
    <div class="input-area">
      <input
          v-model="localGuess"
          placeholder="Entrez le nom du personnage"
          @keyup.enter="$emit('submit', localGuess)"
      />
      <button @click="$emit('submit', localGuess)" :disabled="!localGuess">
        Vérifier
      </button>
    </div>

    <ul v-if="suggestions.length > 0" class="autocomplete-list">
      <li
          v-for="char in suggestions"
          :key="char.name"
          @click="$emit('select', char)"
      >
        {{ char.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  suggestions: Array
});

const emit = defineEmits(['submit', 'select']);

const localGuess = ref('');
</script>
