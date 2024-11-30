<template>
  <div class="code-generator">
    <h2>生成代码</h2>
    
    <div class="code-section">
      <h3>URL 链接</h3>
      <div class="code-container">
        <code>{{ generatedUrl }}</code>
        <button @click="copyToClipboard(generatedUrl)" class="copy-btn">
          复制
        </button>
      </div>
    </div>

    <div class="code-section">
      <h3>iframe 嵌入代码</h3>
      <div class="code-container">
        <code>{{ iframeCode }}</code>
        <button @click="copyToClipboard(iframeCode)" class="copy-btn">
          复制
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Clipboard from 'clipboard'

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

const copyToClipboard = (text) => {
  const el = document.createElement('textarea')
  el.value = text
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  
  // 可以添加一个提示toast
  alert('已复制到剪贴板')
}
</script>

<style scoped>
.code-generator {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.code-section {
  margin-bottom: 2rem;
}

.code-section h3 {
  margin-bottom: 1rem;
  color: #374151;
}

.code-container {
  position: relative;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

code {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background: #1d4ed8;
}
</style> 