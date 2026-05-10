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
import { useHead } from '@vueuse/head'
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

useHead({
  title: 'Contact Us | RepWar.live',

  meta: [
    /* ------------------------------------------------ */
    /* Basic SEO */
    /* ------------------------------------------------ */

    {
      name: 'description',
      content:
        'Contact the RepWar.live team for support, feedback, partnership inquiries, bug reports, or fitness app assistance.',
    },

    {
      name: 'robots',
      content: 'index, follow',
    },

    {
      name: 'keywords',
      content:
        'RepWar contact, fitness app support, AI pushup counter support, workout tracker contact, RepWar help',
    },

    /* ------------------------------------------------ */
    /* Open Graph */
    /* ------------------------------------------------ */

    {
      property: 'og:type',
      content: 'website',
    },

    {
      property: 'og:site_name',
      content: 'RepWar.live',
    },

    {
      property: 'og:title',
      content: 'Contact Us | RepWar.live',
    },

    {
      property: 'og:description',
      content:
        'Reach out to RepWar.live for support, feature requests, bug reports, or general questions.',
    },

    {
      property: 'og:url',
      content: 'https://repwar.live/Contact-Us',
    },

    {
      property: 'og:image',
      content: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',
    },

    {
      property: 'og:image:width',
      content: '1200',
    },

    {
      property: 'og:image:height',
      content: '630',
    },

    {
      property: 'og:image:alt',
      content: 'RepWar.live Contact Support',
    },

    /* ------------------------------------------------ */
    /* Twitter / X */
    /* ------------------------------------------------ */

    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },

    {
      name: 'twitter:title',
      content: 'Contact Us | RepWar.live',
    },

    {
      name: 'twitter:description',
      content: 'Need help or want to reach the RepWar.live team? Contact us here.',
    },

    {
      name: 'twitter:image',
      content: 'https://www.repwar.live/assets/pushuplogow-CI1Ovahn.png',
    },
  ],

  /* ------------------------------------------------ */
  /* Canonical */
  /* ------------------------------------------------ */

  link: [
    {
      rel: 'canonical',
      href: 'https://repwar.live/Contact-Us',
    },
  ],

  /* ------------------------------------------------ */
  /* Structured Data */
  /* ------------------------------------------------ */

  script: [
    {
      type: 'application/ld+json',

      children: JSON.stringify({
        '@context': 'https://schema.org',

        '@type': 'ContactPage',

        name: 'Contact RepWar.live',

        description: 'Official contact and support page for RepWar.live.',

        url: 'https://repwar.live/Contact-Us',

        publisher: {
          '@type': 'Organization',

          name: 'RepWar.live',

          url: 'https://repwar.live',
        },
      }),
    },
  ],
})
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
@import '@/assets/contactview.css';
</style>
