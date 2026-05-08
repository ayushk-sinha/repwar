<template>
  <SideNavBar />
  <section class="hero-section form-root mt-10">
    <div class="hero-inner">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        REPWAR SUPPORT
      </div>

      <div class="form-header">
        <p class="form-eyebrow">Contact Us</p>
        <h2 class="form-title">We’d love to hear from you</h2>
        <p class="form-sub">
          Questions, feedback, or support — our team usually responds within 24 hours.
        </p>
      </div>

      <form class="form-body modal-box" @submit.prevent="handleSubmit">
        <!-- Name -->
        <div class="field">
          <label class="field-label">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            class="field-input"
            placeholder="Enter your name"
            required
          />
        </div>

        <!-- Email -->
        <div class="field">
          <label class="field-label">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            class="field-input"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Subject -->
        <div class="field">
          <label class="field-label">Subject</label>
          <input
            v-model="form.subject"
            type="text"
            class="field-input"
            placeholder="What is this about?"
            required
          />
        </div>

        <!-- Message -->
        <div class="field">
          <label class="field-label">Message</label>
          <textarea
            v-model="form.message"
            rows="4"
            class="field-input"
            placeholder="Write your message..."
            required
          ></textarea>
        </div>

        <!-- Trust / Compliance Note -->
        <p class="form-sub">We respect your privacy. Your information will never be shared.</p>

        <!-- Submit -->
        <button class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
        </button>

        <!-- Success Message -->
        <p v-if="success" class="form-sub" style="color: #6ee7b7">
          ✅ Your message has been sent successfully!
        </p>

        <!-- Error Message -->
        <p v-if="error" class="form-sub" style="color: #ff6b6b">
          ❌ Something went wrong. Try again.
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
//import '@/assets/contactview.css'
import SideNavBar from '@/components/SideNavBar.vue'
import { reactive, ref } from 'vue'
import { supabase } from '@/utils/supabase'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref(false)

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value = false

  try {
    const { error: insertError } = await supabase.from('contact_messages').insert([
      {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      },
    ])

    if (insertError) throw insertError

    // ✅ success
    success.value = true

    // reset form
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/contactview.css';
</style>
