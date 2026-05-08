<!-- UnitConverter.vue -->
<template>
  <div class="converter">
    <p class="converter-label">Quick Unit Converter</p>

    <div class="converter-row">
      <input
        v-model.number="inputValue"
        type="number"
        placeholder="Enter value"
        class="converter-input"
      />
      <select v-model="type" class="converter-select">
        <option value="height" class="bg-gray-900">Height</option>
        <option value="weight" class="bg-gray-900">Weight</option>
      </select>
    </div>

    <div class="converter-result">
      <template v-if="type === 'height'">
        <span class="result-from">{{ inputValue || 0 }} cm</span>
        <span class="result-eq">=</span>
        <span class="result-to">{{ heightFt }} ft</span>
      </template>
      <template v-if="type === 'weight'">
        <span class="result-from">{{ inputValue || 0 }} kg</span>
        <span class="result-eq">=</span>
        <span class="result-to">{{ weightLb }} lb</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref(0)
const type = ref('height')

const heightFt = computed(() => {
  if (!inputValue.value) return '0.00'
  return (inputValue.value / 30.48).toFixed(2)
})

const weightLb = computed(() => {
  if (!inputValue.value) return '0.00'
  return (inputValue.value * 2.20462).toFixed(2)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

.converter {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-family: 'DM Sans', sans-serif;
}

.converter-label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(230, 225, 214, 0.35);
  font-weight: 500;
  margin: 0;
}

.converter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.converter-input,
.converter-select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: rgba(230, 225, 214, 0.75);
  outline: none;
  transition: border-color 0.2s;
}

.converter-input::placeholder {
  color: rgba(230, 225, 214, 0.2);
}
.converter-input:focus,
.converter-select:focus {
  border-color: rgba(110, 231, 183, 0.25);
}

.converter-select {
  appearance: none;
  cursor: pointer;
}

.converter-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
}

.result-from {
  color: rgba(230, 225, 214, 0.45);
}

.result-eq {
  color: rgba(230, 225, 214, 0.2);
}

.result-to {
  color: #6ee7b7;
  font-weight: 500;
}
</style>
