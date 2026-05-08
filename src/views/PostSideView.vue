<template>
  <div class="editor-root">
    <!-- ── SUCCESS TOAST ──────────────────────── -->
    <transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <svg
          v-if="toast.type === 'success'"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ toast.message }}
      </div>
    </transition>

    <div class="editor-layout">
      <!-- ── LEFT EDITOR PANEL ──────────────────── -->
      <div class="editor-panel" :class="{ 'panel-hidden': mode === 'preview' }">
        <!-- Title -->
        <textarea
          v-model="form.title"
          class="title-input"
          placeholder="Your story begins with a title…"
          rows="1"
          @input="autoResize($event)"
        />

        <!-- Author & Tag row -->
        <div class="meta-inputs">
          <div class="meta-field">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input v-model="form.author" class="meta-input" placeholder="Author name" />
          </div>
          <div class="meta-field">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
              />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <input
              v-model="tagInput"
              class="meta-input"
              placeholder="Add tag + Enter"
              @keydown.enter.prevent="addTag"
              @keydown.tab.prevent="addTag"
            />
          </div>
        </div>

        <!-- Tag chips -->
        <div class="tag-chips" v-if="form.tags.length">
          <span v-for="(tag, i) in form.tags" :key="tag" class="tag-chip">
            {{ tag }}
            <button class="tag-remove" @click="form.tags.splice(i, 1)">×</button>
          </span>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-group">
            <button
              v-for="tool in tools"
              :key="tool.cmd"
              class="tool-btn"
              :title="tool.label"
              @click="tool.action()"
            >
              <span v-html="tool.icon" />
            </button>
          </div>
          <div class="toolbar-sep" />
          <div class="word-count">{{ wordCount }} words</div>
        </div>

        <!-- Content Editor -->
        <div
          ref="editorRef"
          class="content-editor"
          contenteditable="true"
          :data-placeholder="'Write your story here… (We Suggest you to use desktop to post for better user experience)\n\nTip: Select text to see formatting options. Use # for headings, > for blockquotes, ` for code.'"
          @input="onEditorInput"
          @keydown="handleEditorKeys"
          @paste="onPaste"
        />
      </div>

      <!-- ── RIGHT PREVIEW PANEL ──────────────────── -->
      <div
        class="preview-panel"
        :class="{ 'panel-full': mode === 'preview', 'panel-side': mode === 'split' }"
      >
        <div class="preview-label">Preview</div>
        <div class="preview-scroller">
          <h1 class="preview-title">{{ form.title || 'Untitled' }}</h1>
          <div class="preview-byline" v-if="form.author">
            <span class="author-avatar">{{ initials(form.author) }}</span>
            {{ form.author }}
            <span class="meta-sep">·</span>
            {{ readTime }} min read
          </div>
          <div class="preview-body" v-html="renderedContent" />
        </div>
      </div>
    </div>

    <!-- ── BOTTOM BAR ─────────────────────────── -->
    <div class="bottom-bar">
      <div class="view-toggle">
        <button
          v-for="m in modes"
          :key="m.id"
          class="mode-btn"
          :class="{ active: mode === m.id }"
          @click="mode = m.id"
          :title="m.label"
        >
          <span v-html="m.icon" />
          {{ m.label }}
        </button>
      </div>

      <div class="bottom-actions">
        <button class="btn-secondary" @click="clearForm">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
          Clear
        </button>
        <button class="btn-publish" :disabled="publishing || !form.title.trim()" @click="publish">
          <span v-if="publishing" class="mini-spinner" />
          <svg
            v-else
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          {{ publishing ? 'Publishing…' : 'Publish' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { supabase } from '@/utils/supabase' // adjust path to your supabase client
import { onMounted, onUnmounted } from 'vue'
import { generateSlug } from '@/utils/slug'

onMounted(() => {
  // 1. Find existing viewport tag
  let viewport = document.querySelector('meta[name="viewport"]')

  // 2. Change it to desktop width
  if (viewport) {
    viewport.setAttribute('content', 'width=1200, initial-scale=0.5') // Or 'width=1024'
  }
})

onUnmounted(() => {
  // 3. Reset to responsive on exit
  let viewport = document.querySelector('meta[name="viewport"]')
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
  }
})

// ── Form state ─────────────────────────────────────────────────
const form = ref({ title: '', author: '', content: '', tags: [] })
const tagInput = ref('')
const editorRef = ref(null)
const publishing = ref(false)
const mode = ref('split')

const toast = ref({ show: false, type: 'success', message: '' })

// ── Computed ───────────────────────────────────────────────────
const wordCount = computed(() => {
  const text = form.value.content.replace(/<[^>]+>/g, '').trim()
  return text ? text.split(/\s+/).length : 0
})

const readTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)))

const renderedContent = computed(() => {
  return (
    form.value.content ||
    '<p style="color:rgba(230,225,214,0.25);font-style:italic">Your story will appear here…</p>'
  )
})

// ── Tag handling ───────────────────────────────────────────────
function addTag() {
  const t = tagInput.value.trim().toLowerCase()
  if (t && !form.value.tags.includes(t) && form.value.tags.length < 5) {
    form.value.tags.push(t)
  }
  tagInput.value = ''
}

// ── Editor input ───────────────────────────────────────────────
function onEditorInput(e) {
  form.value.content = e.target.innerHTML
}

function handleEditorKeys(e) {
  // Auto markdown shortcuts
  if (e.key === 'Enter' && !e.shiftKey) {
    const sel = window.getSelection()
    if (!sel.rangeCount) return
    const range = sel.getRangeAt(0)
    const node = range.startContainer.parentElement
    const text = node?.textContent || ''

    // Heading shortcuts: # ## ###
    const headingMatch = text.match(/^(#{1,3})\s(.+)/)
    if (headingMatch) {
      e.preventDefault()
      const level = headingMatch[1].length
      const content = headingMatch[2]
      const heading = document.createElement(`h${level}`)
      heading.textContent = content
      const p = document.createElement('p')
      p.innerHTML = '<br>'
      node.replaceWith(heading)
      heading.after(p)
      const newRange = document.createRange()
      newRange.setStart(p, 0)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
      form.value.content = editorRef.value.innerHTML
    }

    // Blockquote: >
    if (text.startsWith('> ') && node?.tagName !== 'BLOCKQUOTE') {
      e.preventDefault()
      const bq = document.createElement('blockquote')
      bq.textContent = text.slice(2)
      const p = document.createElement('p')
      p.innerHTML = '<br>'
      node.replaceWith(bq)
      bq.after(p)
      moveCursorTo(p, sel)
      form.value.content = editorRef.value.innerHTML
    }
  }
}

function moveCursorTo(el, sel) {
  const range = document.createRange()
  range.setStart(el, 0)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

function onPaste(e) {
  e.preventDefault()
  const text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

// ── Toolbar ────────────────────────────────────────────────────
const tools = [
  {
    cmd: 'bold',
    label: 'Bold (Ctrl+B)',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>',
    action: () => exec('bold'),
  },
  {
    cmd: 'italic',
    label: 'Italic (Ctrl+I)',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
    action: () => exec('italic'),
  },
  {
    cmd: 'h2',
    label: 'Heading',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    action: () => exec('formatBlock', 'h2'),
  },
  {
    cmd: 'blockquote',
    label: 'Blockquote',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
    action: () => exec('formatBlock', 'blockquote'),
  },
  {
    cmd: 'ul',
    label: 'Bullet List',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>',
    action: () => exec('insertUnorderedList'),
  },
  {
    cmd: 'ol',
    label: 'Numbered List',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
    action: () => exec('insertOrderedList'),
  },
  {
    cmd: 'link',
    label: 'Insert Link',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    action: () => {
      const url = prompt('Enter URL:')
      if (url) exec('createLink', url)
    },
  },
  {
    cmd: 'code',
    label: 'Inline Code',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    action: () => wrapSelection('code'),
  },
  {
    cmd: 'hr',
    label: 'Divider',
    icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    action: () => exec('insertHorizontalRule'),
  },
]

function exec(cmd, value = null) {
  editorRef.value?.focus()
  document.execCommand(cmd, false, value)
  nextTick(() => {
    form.value.content = editorRef.value?.innerHTML || ''
  })
}

function wrapSelection(tag) {
  const sel = window.getSelection()
  if (!sel.rangeCount) return
  const range = sel.getRangeAt(0)
  const el = document.createElement(tag)
  try {
    range.surroundContents(el)
    nextTick(() => {
      form.value.content = editorRef.value?.innerHTML || ''
    })
  } catch {}
}

// ── Mode toggle ────────────────────────────────────────────────
const modes = [
  {
    id: 'write',
    label: 'Write',
    icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  },
  {
    id: 'split',
    label: 'Split',
    icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
  },
  {
    id: 'preview',
    label: 'Preview',
    icon: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  },
]

// ── Publish ────────────────────────────────────────────────────
async function publish() {
  if (!form.value.title.trim()) return

  publishing.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      slug: generateSlug(form.value.title),
      content: form.value.content,
      author: form.value.author.trim() || 'Anonymous',
      tags: form.value.tags,
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('sideblogs').insert([payload])
    if (error) throw error

    showToast('success', 'Story published!')
    clearForm()
  } catch (e) {
    showToast('error', e.message || 'Failed to publish')
  } finally {
    publishing.value = false
  }
}

function clearForm() {
  form.value = { title: '', author: '', content: '', tags: [] }
  tagInput.value = ''
  if (editorRef.value) editorRef.value.innerHTML = ''
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(type, message) {
  toast.value = { show: true, type, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3200)
}

// ── Helpers ────────────────────────────────────────────────────
function autoResize(e) {
  e.target.style.height = 'auto'
  e.target.style.height = e.target.scrollHeight + 'px'
}

function initials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || '?'
  )
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Root ─────────────────────────────────────── */
.editor-root {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 57px);
  font-family: 'DM Sans', sans-serif;
  color: #e6e1d6;
  position: relative;
  background: #0d1117;
}

/* ── Layout ───────────────────────────────────── */
.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

/* ── Editor Panel ─────────────────────────────── */
.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  transition:
    flex 0.3s ease,
    opacity 0.3s ease;
}

.editor-panel.panel-hidden {
  flex: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}

.title-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  outline: none;
  resize: none;
  padding: 1.6rem 2rem 1.2rem;
  font-family: 'Lora', serif;
  font-size: 1.6rem;
  font-weight: 500;
  color: #f0ece3;
  line-height: 1.25;
  overflow: hidden;
}

.title-input::placeholder {
  color: rgba(230, 225, 214, 0.2);
  font-style: italic;
}

.meta-inputs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.meta-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.8rem;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(230, 225, 214, 0.3);
}

.meta-field:last-child {
  border-right: none;
}

.meta-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: rgba(230, 225, 214, 0.65);
}

.meta-input::placeholder {
  color: rgba(230, 225, 214, 0.25);
}

.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.55rem 1.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tag-chip {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  background: rgba(110, 231, 183, 0.08);
  border: 1px solid rgba(110, 231, 183, 0.2);
  border-radius: 999px;
  font-size: 0.68rem;
  color: #6ee7b7;
  letter-spacing: 0.06em;
  text-transform: lowercase;
}

.tag-remove {
  background: none;
  border: none;
  color: rgba(110, 231, 183, 0.5);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  font-size: 1rem;
  transition: color 0.15s;
}

.tag-remove:hover {
  color: #6ee7b7;
}

/* ── Toolbar ──────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 1.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.01);
  flex-shrink: 0;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  flex-wrap: wrap;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 5px;
  color: rgba(230, 225, 214, 0.45);
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #e6e1d6;
}

.toolbar-sep {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 0.4rem;
}

.word-count {
  margin-left: auto;
  font-size: 0.7rem;
  color: rgba(230, 225, 214, 0.22);
  letter-spacing: 0.04em;
}

/* ── Content Editor ───────────────────────────── */
.content-editor {
  flex: 1;
  padding: 1.6rem 2rem;
  overflow-y: auto;
  outline: none;
  font-family: 'Lora', serif;
  font-size: 1rem;
  line-height: 1.85;
  color: rgba(230, 225, 214, 0.8);
  caret-color: #6ee7b7;
}

.content-editor:empty::before {
  content: attr(data-placeholder);
  color: rgba(230, 225, 214, 0.18);
  font-style: italic;
  pointer-events: none;
  white-space: pre-line;
}

/* Editor inner element styles (not scoped) */
.content-editor :deep(h1),
.content-editor :deep(h2),
.content-editor :deep(h3) {
  font-family: 'Lora', serif;
  color: #f0ece3;
  font-weight: 500;
  margin: 1.5em 0 0.5em;
}

.content-editor :deep(blockquote) {
  border-left: 2px solid rgba(110, 231, 183, 0.35);
  padding-left: 1.2rem;
  color: rgba(230, 225, 214, 0.55);
  font-style: italic;
  margin: 1.2em 0;
}

.content-editor :deep(code) {
  background: rgba(255, 255, 255, 0.07);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.87em;
}

.content-editor :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 2em 0;
}

.content-editor :deep(a) {
  color: #6ee7b7;
  text-decoration: underline;
}

/* ── Preview Panel ────────────────────────────── */
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: flex 0.3s ease;
  background: #0d1117;
}

.preview-panel.panel-full {
  flex: 2;
}

.preview-label {
  padding: 0.55rem 2rem;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(230, 225, 214, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.preview-scroller {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem 3rem;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
}

.preview-title {
  font-family: 'Lora', serif;
  font-size: 1.7rem;
  font-weight: 500;
  color: #f0ece3;
  margin: 0 0 0.8rem;
  line-height: 1.2;
}

.preview-byline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: rgba(230, 225, 214, 0.4);
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(110, 231, 183, 0.12);
  color: #6ee7b7;
  font-size: 0.62rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.meta-sep {
  opacity: 0.4;
}

.preview-body {
  font-family: 'Lora', serif;
  font-size: 1rem;
  line-height: 1.85;
  color: rgba(230, 225, 214, 0.78);
}

:deep(.preview-body p) {
  margin: 0 0 1.4em;
}
:deep(.preview-body h1),
:deep(.preview-body h2),
:deep(.preview-body h3) {
  font-family: 'Lora', serif;
  color: #f0ece3;
  font-weight: 500;
  margin: 1.8em 0 0.5em;
}
:deep(.preview-body blockquote) {
  border-left: 2px solid rgba(110, 231, 183, 0.35);
  padding-left: 1.2rem;
  color: rgba(230, 225, 214, 0.55);
  font-style: italic;
  margin: 1.5em 0;
}
:deep(.preview-body code) {
  background: rgba(255, 255, 255, 0.07);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.87em;
}
:deep(.preview-body hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 2em 0;
}
:deep(.preview-body a) {
  color: #6ee7b7;
  text-decoration: underline;
}
:deep(.preview-body ul),
:deep(.preview-body ol) {
  padding-left: 1.4rem;
  margin: 0 0 1.4em;
}

/* ── Bottom Bar ───────────────────────────────── */
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(12px);
  flex-shrink: 0;
  z-index: 10;
}

.view-toggle {
  display: flex;
  gap: 0.15rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 0.2rem;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border: none;
  background: transparent;
  color: rgba(230, 225, 214, 0.35);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}

.mode-btn:hover {
  color: rgba(230, 225, 214, 0.7);
  background: rgba(255, 255, 255, 0.05);
}

.mode-btn.active {
  background: rgba(110, 231, 183, 0.1);
  color: #6ee7b7;
}

.bottom-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: transparent;
  color: rgba(230, 225, 214, 0.45);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.18);
  color: rgba(230, 225, 214, 0.7);
}

.btn-publish {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1.4rem;
  border: none;
  border-radius: 8px;
  background: rgba(110, 231, 183, 0.15);
  border: 1px solid rgba(110, 231, 183, 0.3);
  color: #6ee7b7;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-publish:hover:not(:disabled) {
  background: rgba(110, 231, 183, 0.22);
  border-color: rgba(110, 231, 183, 0.5);
}

.btn-publish:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mini-spinner {
  width: 12px;
  height: 12px;
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

/* ── Toast ────────────────────────────────────── */
.toast {
  position: fixed;
  top: 1.2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.toast.success {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(110, 231, 183, 0.3);
  color: #6ee7b7;
}

.toast.error {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #f87171;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
</style>
