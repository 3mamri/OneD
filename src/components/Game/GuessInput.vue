<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'select']);

function updateValue(event) {
  emit('update:modelValue', event.target.value);
}

function handleKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    emit('submit');
  }
}

function handleSubmit() {
  emit('submit');
}

function handleSelect(character) {
  emit('select', character);
}
</script>

<template>
  <div class="guess-input-container">
    <label class="guess-label">Choisis un personnage</label>

    <div class="guess-input-box">
      <div class="guess-input-row">
        <input
            :value="modelValue"
            type="text"
            class="guess-input"
            placeholder="Tape au moins 2 lettres..."
            :disabled="disabled"
            @input="updateValue"
            @keydown="handleKeydown"
        />

        <button
            class="guess-submit-btn"
            :disabled="disabled || !modelValue.trim()"
            @click="handleSubmit"
        >
          Valider
        </button>
      </div>

      <ul v-if="modelValue.length >= 2 && suggestions.length" class="suggestions-list">
        <li
            v-for="character in suggestions"
            :key="character.id"
            class="suggestion-item"
            @click="handleSelect(character)"
        >
          <img
              :src="character.image"
              :alt="character.name"
              class="suggestion-image"
          />
          <span>{{ character.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>