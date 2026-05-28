<!-- views/PushupsGuide.vue -->
<template>
  <GlassBlogLayout
    title="Pushups: Complete Beginner to Advanced Guide"
    subtitle="Learn proper pushup form, common mistakes, muscle activation, progression methods, and advanced variations."
    category="Fitness"
    author="Ayush Sinha"
    publishDate="May 19, 2026"
    lastUpdated="May 19, 2026"
    readTime="12 min read"
    sideTip="Focus on perfect form before increasing reps."
    :tableOfContents="toc"
    :sections="sections"
  />
</template>

<script setup>
import GlassBlogLayout from '@/components/GlassBlogLayout.vue'

const toc = [
  {
    id: 'benefits',
    title: 'Benefits of Pushups',
  },
  {
    id: 'form',
    title: 'Correct Pushup Form',
  },
  {
    id: 'mistakes',
    title: 'Common Mistakes',
  },
  {
    id: 'advanced',
    title: 'Advanced Variations',
  },
]

const sections = [
  {
    id: 'benefits',
    heading: 'Benefits of Pushups',
    paragraphs: [
      'Pushups are one of the most effective bodyweight exercises for building upper body strength.',
      'They activate the chest, shoulders, triceps, and core muscles together.',
      'Regular pushups improve posture, endurance, and functional strength.',
    ],
  },

  {
    id: 'form',
    heading: 'Correct Pushup Form',
    paragraphs: [
      'Keep your body straight from head to heels.',
      'Lower your chest slowly while keeping elbows slightly tucked.',
      'Push explosively while maintaining core tension.',
    ],
  },

  {
    id: 'mistakes',
    heading: 'Common Pushup Mistakes',
    paragraphs: [
      'Many beginners drop their hips which increases lower back stress.',
      'Another mistake is flaring elbows too much.',
      'Partial reps reduce effectiveness and muscle engagement.',
    ],
  },

  {
    id: 'advanced',
    heading: 'Advanced Pushup Variations',
    paragraphs: [
      'Once standard pushups become easy, try decline pushups.',
      'Archer pushups and pseudo planche pushups build serious strength.',
      'Explosive clap pushups improve athletic power.',
    ],
  },
]
</script>
