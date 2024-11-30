<template>
  <div class="code-generator">
    <div class="section-header">
      <h2>生成代码</h2>
      <div class="theme-switch">
        <button 
          @click="toggleTheme" 
          class="theme-btn"
          :title="isDark ? '切换到浅色主题' : '切换到深色主题'"
        >
          {{ isDark ? '🌞' : '🌙' }}
        </button>
      </div>
    </div>
    
    <div class="code-section">
      <div class="section-header">
        <h3>URL 链接</h3>
        <button @click="copyToClipboard(generatedUrl)" class="copy-btn">
          复制链接
        </button>
      </div>
      <div class="code-container">
        <code>{{ generatedUrl }}</code>
      </div>
    </div>

    <div class="code-section">
      <div class="section-header">
        <h3>iframe 嵌入代码</h3>
        <button @click="copyToClipboard(iframeCode)" class="copy-btn">
          复制代码
        </button>
      </div>
      <div class="code-container">
        <code>{{ iframeCode }}</code>
      </div>
    </div>
  </div>

  <!-- Toast 提示 -->
  <Teleport to="body">
    <div 
      v-if="showToast" 
      class="toast"
      :class="{ 'show': showToast }"
    >
      {{ toastMessage }}
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleTheme = useToggle(isDark)

// Toast 状态
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const generatedUrl = computed(() => {
  const baseUrl = 'https://friendcards.zwei.de.eu.org/'
  const params = new URLSearchParams()
  
  if (props.formData.name) params.set('name', props.formData.name)
  if (props.formData.specialty) params.set('specialty', props.formData.specialty)
  if (props.formData.link) params.set('link', props.formData.link)
  if (props.formData.redirect) params.set('redirect', props.formData.redirect)
  if (props.formData.avatar) params.set('avatar', props.formData.avatar)
  
  if (props.formData.bgcolor !== 'linear-gradient(135deg, #e0e7ff, #f0f4f8)') {
    params.set('bgcolor', props.formData.bgcolor)
  }
  if (props.formData.textcolor !== '#1f2937') {
    params.set('textcolor', props.formData.textcolor)
  }
  if (props.formData.linkcolor !== '#2563eb') {
    params.set('linkcolor', props.formData.linkcolor)
  }
  if (props.formData.font !== 'ZCOOL KuaiLe') {
    params.set('font', props.formData.font)
  }
  
  return `${baseUrl}?${params.toString()}`
})

const iframeCode = computed(() => {
  return `<div style="max-width: 600px; margin: 0 auto;">
  <iframe 
    src="${generatedUrl.value}"
    style="border: none; width: 100%; height: 160px; overflow: hidden;"
    loading="lazy"
    title="Friend Card"
  ></iframe>
</div>`
})

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('复制成功！')
  } catch (err) {
    showToastMessage('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.code-generator {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.code-section {
  margin-bottom: 2rem;
}

.code-container {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

code {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--code-color);
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background: var(--primary-dark);
}

.theme-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: var(--toast-bg);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}

:root {
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --card-bg: white;
  --code-bg: #f3f4f6;
  --code-color: #1f2937;
  --toast-bg: #1f2937;
}

:root.dark {
  --card-bg: #1f2937;
  --code-bg: #111827;
  --code-color: #e5e7eb;
  --toast-bg: #4b5563;
}
</style> 