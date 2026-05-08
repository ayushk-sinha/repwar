<!-- components/BmiCalulator.vue -->
<template>
  <div class="bmi-root">
    <!-- Header -->
    <div class="bmi-header">
      <p class="bmi-eyebrow">Health Check</p>
      <h2 class="bmi-title">BMI Calculator</h2>
      <p class="bmi-sub">BMI, weight range, waist context &amp; age-based guidance</p>
    </div>

    <!-- Scrollable body -->
    <div class="bmi-body">
      <!-- Unit Toggle -->
      <div class="field">
        <label class="field-label">Measurement Unit</label>
        <div class="toggle-row">
          <button
            type="button"
            class="toggle-btn"
            :class="unitSystem === 'metric' ? 'toggle-active' : ''"
            @click="unitSystem = 'metric'"
          >
            Metric
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="unitSystem === 'imperial' ? 'toggle-active' : ''"
            @click="unitSystem = 'imperial'"
          >
            Imperial
          </button>
        </div>
      </div>

      <!-- Age / Sex -->
      <div class="field-row">
        <div class="field">
          <label class="field-label">Age</label>
          <input
            v-model="age"
            type="number"
            min="1"
            max="120"
            placeholder="Years"
            class="field-input"
          />
        </div>
        <div class="field">
          <label class="field-label">Sex</label>
          <select v-model="sex" class="field-input">
            <option value="male" class="bg-gray-900">Male</option>
            <option value="female" class="bg-gray-900">Female</option>
          </select>
        </div>
      </div>

      <!-- Goal / Activity -->
      <div class="field-row">
        <div class="field">
          <label class="field-label">Goal</label>
          <select v-model="goal" class="field-input">
            <option value="lose" class="bg-gray-900">Lose weight</option>
            <option value="maintain" class="bg-gray-900">Maintain</option>
            <option value="gain" class="bg-gray-900">Gain weight</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Activity</label>
          <select v-model="activityLevel" class="field-input">
            <option value="sedentary" class="bg-gray-900">Sedentary</option>
            <option value="light" class="bg-gray-900">Light</option>
            <option value="moderate" class="bg-gray-900">Moderate</option>
            <option value="very" class="bg-gray-900">Very active</option>
          </select>
        </div>
      </div>

      <!-- Height -->
      <div class="field">
        <label class="field-label">
          Height
          <span class="field-unit">({{ unitSystem === 'metric' ? 'cm' : 'ft + in' }})</span>
        </label>
        <div v-if="unitSystem === 'metric'">
          <input
            v-model="heightCm"
            type="number"
            min="50"
            step="0.1"
            placeholder="cm"
            class="field-input"
          />
        </div>
        <div v-else class="field-row">
          <input
            v-model="heightFt"
            type="number"
            min="1"
            step="1"
            placeholder="ft"
            class="field-input"
          />
          <input
            v-model="heightIn"
            type="number"
            min="0"
            max="11"
            step="1"
            placeholder="in"
            class="field-input"
          />
        </div>
      </div>

      <!-- Weight -->
      <div class="field">
        <label class="field-label">
          Weight
          <span class="field-unit">({{ unitSystem === 'metric' ? 'kg' : 'lb' }})</span>
        </label>
        <input
          v-if="unitSystem === 'metric'"
          v-model="weightKg"
          type="number"
          min="10"
          step="0.1"
          placeholder="kg"
          class="field-input"
        />
        <input
          v-else
          v-model="weightLb"
          type="number"
          min="20"
          step="0.1"
          placeholder="lb"
          class="field-input"
        />
      </div>

      <!-- Waist -->
      <div class="field">
        <label class="field-label">
          Waist
          <span class="field-unit">optional ({{ unitSystem === 'metric' ? 'cm' : 'in' }})</span>
        </label>
        <input
          v-if="unitSystem === 'metric'"
          v-model="waistCm"
          type="number"
          class="field-input"
          placeholder="cm"
        />
        <input v-else v-model="waistIn" type="number" class="field-input" placeholder="in" />
      </div>

      <!-- Actions -->
      <div class="field-row">
        <button @click="calculateBMI" class="btn-calculate">Calculate BMI</button>
        <button @click="resetForm" class="btn-reset">Reset</button>
      </div>

      <!-- Error -->
      <p v-if="error" class="bmi-error">{{ error }}</p>

      <!-- Result -->
      <div v-if="result" class="bmi-result">
        <div class="result-score">
          <span class="result-number">{{ result.bmi.toFixed(1) }}</span>
          <span class="result-label" :class="categoryColorClass">{{ result.category }}</span>
        </div>

        <div class="result-meta">
          <span>{{ result.bmiClass }}</span>
          <span class="result-sep">·</span>
          <span>{{ result.formula }}</span>
        </div>

        <div v-if="result?.suggestions?.length" class="suggestions">
          <p class="suggestions-label">Recommendations</p>
          <ul class="suggestions-list">
            <li v-for="(tip, i) in result.suggestions" :key="i">{{ tip }}</li>
          </ul>
        </div>
      </div>

      <UnitConverter />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UnitConverter from './UnitConverter.vue'

const unitSystem = ref('metric')
const age = ref('')
const sex = ref('male')
const goal = ref('maintain')
const activityLevel = ref('moderate')
const heightCm = ref('')
const heightFt = ref('')
const heightIn = ref('')
const weightKg = ref('')
const weightLb = ref('')
const waistCm = ref('')
const waistIn = ref('')
const error = ref('')
const result = ref(null)

const categoryColorClass = computed(() => {
  if (!result.value) return ''
  const cat = result.value.category
  if (cat === 'Underweight') return 'cat-blue'
  if (cat === 'Normal') return 'cat-green'
  if (cat === 'Overweight') return 'cat-yellow'
  return 'cat-red'
})

function toNumber(val) {
  const num = Number(val)
  return Number.isFinite(num) ? num : null
}
function round1(n) {
  return Math.round(n * 10) / 10
}
function round2(n) {
  return Math.round(n * 100) / 100
}

function getCategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', class: 'Below healthy' }
  if (bmi < 25) return { category: 'Normal', class: 'Healthy' }
  if (bmi < 30) return { category: 'Overweight', class: 'Above healthy' }
  if (bmi < 35) return { category: 'Obesity I', class: 'Obese' }
  if (bmi < 40) return { category: 'Obesity II', class: 'Obese' }
  return { category: 'Obesity III', class: 'Severely obese' }
}

function getSuggestions(category) {
  const tips = []
  if (category === 'Underweight') {
    tips.push('Increase calorie intake')
    tips.push('Focus on strength training')
  } else if (category === 'Normal') {
    tips.push('Maintain your lifestyle')
    tips.push('Stay active')
  } else if (category === 'Overweight') {
    tips.push('Start cardio + calorie control')
    tips.push('Reduce sugar & processed food')
  } else {
    tips.push('Consult a professional')
    tips.push('Start with walking + diet control')
  }
  if (goal.value === 'lose') tips.push('Maintain calorie deficit')
  else if (goal.value === 'gain') tips.push('Increase protein + calories')
  return tips
}

function calculateBMI() {
  error.value = ''
  result.value = null

  let heightM = null,
    weightKG = null,
    waistM = null

  if (unitSystem.value === 'metric') {
    const h = toNumber(heightCm.value)
    const w = toNumber(weightKg.value)
    const waist = toNumber(waistCm.value)
    if (!h || !w) {
      error.value = 'Enter height and weight'
      return
    }
    if (h < 50 || h > 250 || w < 10 || w > 300) {
      error.value = 'Enter realistic values'
      return
    }
    heightM = h / 100
    weightKG = w
    waistM = waist ? waist / 100 : null
  } else {
    const ft = toNumber(heightFt.value)
    const inch = toNumber(heightIn.value)
    const w = toNumber(weightLb.value)
    const waist = toNumber(waistIn.value)
    if (!ft || inch === null || !w) {
      error.value = 'Enter height and weight'
      return
    }
    const totalInches = ft * 12 + inch
    if (totalInches < 20 || w < 20) {
      error.value = 'Enter realistic values'
      return
    }
    heightM = totalInches * 0.0254
    weightKG = w * 0.453592
    waistM = waist ? waist * 0.0254 : null
  }

  const bmi = weightKG / (heightM * heightM)
  const bmiRounded = round1(bmi)
  const { category, class: bmiClass } = getCategory(bmiRounded)
  const minWeight = 18.5 * heightM * heightM
  const maxWeight = 24.9 * heightM * heightM
  const waistRatio = waistM ? round2(waistM / heightM) : null
  const ageVal = toNumber(age.value)
  const ageNote = ageVal && ageVal < 20 ? 'Use BMI-for-age charts for accuracy' : ''

  result.value = {
    bmi: bmiRounded,
    category,
    bmiClass,
    minWeight: round1(minWeight),
    maxWeight: round1(maxWeight),
    waistRatio,
    ageNote,
    formula: `Healthy range: ${round1(minWeight)}–${round1(maxWeight)} kg`,
    suggestions: getSuggestions(category),
  }
}

function resetForm() {
  unitSystem.value = 'metric'
  age.value = ''
  sex.value = 'male'
  goal.value = 'maintain'
  activityLevel.value = 'moderate'
  heightCm.value = ''
  heightFt.value = ''
  heightIn.value = ''
  weightKg.value = ''
  weightLb.value = ''
  waistCm.value = ''
  waistIn.value = ''
  error.value = ''
  result.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.bmi-root {
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ───────────────────────────── */
.bmi-header {
  margin-bottom: 1.25rem;
  flex-shrink: 0;
}

.bmi-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6ee7b7;
  font-weight: 500;
  margin: 0 0 0.3rem;
}

.bmi-title {
  font-family: 'Lora', serif;
  font-size: 1.4rem;
  font-weight: 500;
  color: #f0ece3;
  margin: 0 0 0.25rem;
}

.bmi-sub {
  font-size: 0.75rem;
  color: rgba(230, 225, 214, 0.35);
  margin: 0;
}

/* ── Body ─────────────────────────────── */
.bmi-body {
  overflow-y: auto;
  padding-right: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.bmi-body::-webkit-scrollbar {
  width: 4px;
}
.bmi-body::-webkit-scrollbar-thumb {
  background: rgba(110, 231, 183, 0.15);
  border-radius: 999px;
}
.bmi-body::-webkit-scrollbar-track {
  background: transparent;
}

/* ── Fields ───────────────────────────── */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.field-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(230, 225, 214, 0.5);
  letter-spacing: 0.04em;
}

.field-unit {
  color: rgba(230, 225, 214, 0.25);
  font-weight: 400;
  margin-left: 0.3rem;
}

.field-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.83rem;
  color: rgba(230, 225, 214, 0.85);
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
}

.field-input::placeholder {
  color: rgba(230, 225, 214, 0.2);
}

.field-input:focus {
  border-color: rgba(110, 231, 183, 0.3);
  background: rgba(110, 231, 183, 0.03);
}

select.field-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(230,225,214,0.3)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.2rem;
}

/* ── Toggle ───────────────────────────── */
.toggle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 0.25rem;
}

.toggle-btn {
  padding: 0.55rem;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: rgba(230, 225, 214, 0.4);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: rgba(230, 225, 214, 0.7);
}

.toggle-active {
  background: rgba(110, 231, 183, 0.1) !important;
  color: #6ee7b7 !important;
  font-weight: 500;
}

/* ── Buttons ──────────────────────────── */
.btn-calculate {
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(110, 231, 183, 0.12);
  border: 1px solid rgba(110, 231, 183, 0.25);
  color: #6ee7b7;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-calculate:hover {
  background: rgba(110, 231, 183, 0.2);
  border-color: rgba(110, 231, 183, 0.4);
}

.btn-reset {
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: rgba(230, 225, 214, 0.4);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(230, 225, 214, 0.65);
}

/* ── Error ────────────────────────────── */
.bmi-error {
  font-size: 0.78rem;
  color: #f87171;
  margin: 0;
  padding: 0.6rem 0.9rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 8px;
}

/* ── Result ───────────────────────────── */
.bmi-result {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.result-score {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.result-number {
  font-size: 2.6rem;
  font-weight: 600;
  color: #f0ece3;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.result-label {
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.cat-green {
  background: rgba(110, 231, 183, 0.1);
  border: 1px solid rgba(110, 231, 183, 0.25);
  color: #6ee7b7;
}
.cat-blue {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.25);
  color: #60a5fa;
}
.cat-yellow {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.25);
  color: #fbbf24;
}
.cat-red {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(230, 225, 214, 0.4);
}

.result-sep {
  opacity: 0.4;
}

.suggestions {
}

.suggestions-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(230, 225, 214, 0.5);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.suggestions-list li {
  font-size: 0.8rem;
  color: rgba(230, 225, 214, 0.6);
  padding-left: 1rem;
  position: relative;
}

.suggestions-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: rgba(110, 231, 183, 0.5);
}
</style>
