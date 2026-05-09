<!-- components/PlayerSubmissionForm.vue -->
<template>
  <div class="form-root">
    <!-- Header -->
    <div class="form-header">
      <p class="form-eyebrow">Session Complete</p>
      <h2 class="form-title">Submit Your Score</h2>
      <p class="form-sub">Add your details to enter the leaderboard.</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="form-body">
      <!-- Pushup Count (read-only) -->
      <div class="field">
        <label class="field-label">Pushup Count</label>
        <div class="count-display">
          <span class="count-number">{{ form.pushups }}</span>
          <span class="count-unit">reps</span>
        </div>
      </div>

      <!-- Name -->
      <div class="field">
        <label class="field-label">Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Your name"
          class="field-input"
          required
        />
      </div>

      <!-- Email -->
      <div class="field">
        <label class="field-label">Email</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="field-input"
          required
        />
      </div>

      <!-- Instagram -->
      <div class="field">
        <label class="field-label">
          Instagram Link
          <span class="field-optional">(optional)</span>
        </label>
        <input v-model="form.instagram" type="text" class="field-input" />
      </div>

      <!-- Avatar Selection -->
      <div class="field">
        <label class="field-label">Choose Avatar</label>
        <div class="avatar-grid">
          <button
            type="button"
            v-for="img in avatars"
            :key="img"
            @click="selectAvatar(img)"
            class="avatar-item"
            :class="form.avatar === img ? 'avatar-selected' : ''"
          >
            <img :src="img" :alt="'avatar'" />
          </button>
        </div>
      </div>

      <!-- Upload Photo -->
      <!-- <div class="field">
        <label class="field-label"
          >Or Upload Photo
          <div class="hero-inner">
            <div class="hero-badge">
              <span class="badge-dot" />
              premium
            </div>
          </div></label
        >

        <label class="upload-label">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload image
          <input
            type="file"
            accept="image/*"
            @change="handleUpload"
            class="upload-input"
            disabled
          />
        </label>
      </div> -->

      <!-- Preview -->
      <div v-if="form.avatar" class="avatar-preview">
        <img :src="form.avatar" alt="Preview" class="preview-img" />
        <span class="preview-label">Selected avatar</span>
      </div>

      <!-- Submit -->
      <button type="submit" :disabled="loading" class="submit-btn">
        <span v-if="loading" class="spinner" />
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ loading ? 'Submitting…' : 'Submit Score' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/utils/supabase'
import { getIndiaDate } from '@/utils/intime'

const props = defineProps({ initialPushups: { type: Number, default: 0 } })
const emit = defineEmits(['submit'])

const form = ref({
  pushups: props.initialPushups,
  name: '',
  email: '',
  instagram: '',
  avatar: '',
  file: null,
})

watch(
  () => props.initialPushups,
  (val) => {
    form.value.pushups = val
  },
)

const avatars = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8KOYbgIqTD0mnqCJ0_JtRB2pAWGAo7zU57Q&s',
  'https://png.pngtree.com/png-clipart/20240826/original/pngtree-3d-powerful-body-builder-gym-man-on-transparent-background-png-image_15851228.png',
  'https://thumbs.dreamstime.com/b/closeup-portrait-muscular-man-workout-barbell-gym-brutal-bodybuilder-athletic-six-pack-perfect-abs-shoulders-55122231.jpg',
  'https://www.shutterstock.com/image-photo/strong-bald-bodybuilder-six-pack-600w-553440583.jpg',
  'https://img.magnific.com/premium-photo/handsome-strong-bodybuilder-athletic-men-pumping-up-muscles-with-dumbbells_174475-311.jpg',
  'https://img.magnific.com/free-photo/athletic-woman-exercising-gym-keep-fit_23-2150989857.jpg?semt=ais_hybrid&w=740&q=80',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrkkv1SO1PsfTX7vBuAkCd8ehwLeeGzuupzA&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2MjzlOOmcgq7LyXOVWSTzHavr-WquGp7Zhg&s',
]

function selectAvatar(img) {
  form.value.avatar = img
  form.value.file = null
}

function handleUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  form.value.file = file
  form.value.avatar = URL.createObjectURL(file)
}

// async function uploadImage(file) {
//   const fileName = `${Date.now()}-${file.name}`
//   const { error } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true })
//   if (error) throw error
//   const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
//   return data.publicUrl
// }

const loading = ref(false)

async function submitForm() {
  if (!form.value.name.trim() || !form.value.email.trim()) return
  loading.value = true
  try {
    let avatarUrl = form.value.avatar
    if (form.value.file) avatarUrl = await uploadImage(form.value.file)

    // const { error } = await supabase.from('players').insert([
    //   {
    //     name: form.value.name,
    //     email: form.value.email,
    //     instagram: form.value.instagram,
    //     pushups: form.value.pushups,
    //     avatar_url: avatarUrl,
    //   },
    // ])

    // if (error) throw error
    const { error } = await supabase.rpc('upsert_leaderboard', {
      p_email: form.value.email,

      p_name: form.value.name,

      p_instagram: form.value.instagram,

      p_pushups: form.value.pushups,

      p_avatar_url: avatarUrl,

      p_created_at: getIndiaDate(),
    })

    if (error) console.log(error)

    emit('submit', {
      pushups: form.value.pushups,
      name: form.value.name,
      email: form.value.email,
      instagram: form.value.instagram,
      avatar: avatarUrl,
    })

    form.value = { pushups: 0, name: '', email: '', instagram: '', avatar: '', file: null }
  } catch (err) {
    console.error('Submit error details:', { err })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.hero-section {
  padding: 3rem 1.5rem 2.5rem;
  text-align: center;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 0.75rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: rgba(189, 231, 110, 0.08);
  border: 1px solid rgba(223, 231, 110, 0.2);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #e7df6e;
  font-weight: 500;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e7db6e;
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
.form-root {
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
}

/* ── Header ───────────────────────────── */
.form-header {
  margin-bottom: 1.5rem;
}

.form-eyebrow {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6ee7b7;
  font-weight: 500;
  margin: 0 0 0.4rem;
}

.form-title {
  font-family: 'Lora', serif;
  font-size: 1.4rem;
  font-weight: 500;
  color: #f0ece3;
  margin: 0 0 0.3rem;
}

.form-sub {
  font-size: 0.78rem;
  color: rgba(230, 225, 214, 0.35);
  margin: 0;
}

/* ── Form Body ────────────────────────── */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(230, 225, 214, 0.55);
  letter-spacing: 0.04em;
}

.field-optional {
  font-weight: 400;
  color: rgba(230, 225, 214, 0.3);
  margin-left: 0.3rem;
}

/* Count display */
.count-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: rgba(110, 231, 183, 0.05);
  border: 1px solid rgba(110, 231, 183, 0.15);
  border-radius: 10px;
}

.count-number {
  font-size: 1.8rem;
  font-weight: 600;
  color: #6ee7b7;
  font-variant-numeric: tabular-nums;
}

.count-unit {
  font-size: 0.8rem;
  color: rgba(110, 231, 183, 0.5);
}

/* Inputs */
.field-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: rgba(230, 225, 214, 0.85);
  outline: none;
  transition: all 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: rgba(230, 225, 214, 0.2);
}

.field-input:focus {
  border-color: rgba(110, 231, 183, 0.3);
  background: rgba(110, 231, 183, 0.03);
  box-shadow: 0 0 0 3px rgba(110, 231, 183, 0.06);
}

/* Avatar grid */
.avatar-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
}

.avatar-item {
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  background: none;
  padding: 0;
  transition: all 0.2s;
}

.avatar-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.avatar-item:hover img {
  opacity: 0.9;
}

.avatar-item.avatar-selected {
  border-color: #6ee7b7;
}

.avatar-item.avatar-selected img {
  opacity: 1;
}

/* Upload */
.upload-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.8rem;
  color: rgba(230, 225, 214, 0.4);
  cursor: pointer;
  transition: all 0.2s;
}

.upload-label:hover {
  border-color: rgba(110, 231, 183, 0.25);
  color: rgba(110, 231, 183, 0.7);
}

.upload-input {
  display: none;
}

/* Preview */
.avatar-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(110, 231, 183, 0.3);
}

.preview-label {
  font-size: 0.75rem;
  color: rgba(230, 225, 214, 0.3);
}

/* Submit */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem;
  border-radius: 10px;
  background: rgba(110, 231, 183, 0.12);
  border: 1px solid rgba(110, 231, 183, 0.25);
  color: #6ee7b7;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: rgba(110, 231, 183, 0.2);
  border-color: rgba(110, 231, 183, 0.4);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(110, 231, 183, 0.3);
  border-top-color: #6ee7b7;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
