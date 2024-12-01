<template>
  <div class="code-generator">
    <div class="section-header">
      <h2>生成代码</h2>
    </div>
    
    <!-- 预览区域 -->
    <div class="preview-section">
      <h3>预览效果</h3>
      <div class="preview-container">
        <iframe 
          :src="generatedUrl"
          style="border: none; width: 100%; height: 195px; overflow: hidden;"
          loading="lazy"
          title="Friend Card Preview"
        ></iframe>
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
</template>

<script setup>
import { computed } from 'vue'
import { useToast } from '../composables/useToast'

const { showToastMessage } = useToast()

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const baseUrl = 'https://friendcards.zwei.de.eu.org'

const generatedUrl = computed(() => {
  const params = new URLSearchParams()
  
  if (props.formData.name) {
    params.set('name', props.formData.name)
  }
  if (props.formData.specialty) {
    params.set('specialty', props.formData.specialty)
  }
  if (props.formData.link) {
    params.set('link', props.formData.link)
  }
  if (props.formData.redirect) {
    params.set('redirect', props.formData.redirect)
  }
  if (props.formData.avatar) {
    params.set('avatar', props.formData.avatar)
  }
  if (props.formData.bgcolor && props.formData.bgcolor !== 'linear-gradient(135deg, #e0e7ff, #f0f4f8)') {
    params.set('bgcolor', props.formData.bgcolor)
  }
  if (props.formData.textcolor && props.formData.textcolor !== '#1f2937') {
    params.set('textcolor', props.formData.textcolor)
  }
  if (props.formData.linkcolor && props.formData.linkcolor !== '#2563eb') {
    params.set('linkcolor', props.formData.linkcolor)
  }
  if (props.formData.font && props.formData.font !== 'ZCOOL KuaiLe') {
    params.set('font', props.formData.font)
  }
  
  return `${baseUrl}?${params.toString()}`
})

const generateIframeCode = (url) => {
  return `<div style="max-width: 600px; margin: 0 auto;">
  <iframe 
    src="${url}"
    style="border: none; width: 100%; height: 195px; overflow: hidden;"
    loading="lazy"
    title="Friend Card"
  ></iframe>
</div>`;
};

const iframeCode = computed(() => {
  return generateIframeCode(generatedUrl.value);
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
  background: white;
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

.section-header h2,
.section-header h3 {
  margin: 0;
  color: #374151;
}

.preview-section {
  margin-bottom: 2rem;
}

.preview-container {
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.code-section {
  margin-top: 2rem;
}

.code-container {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #334155;
  white-space: pre-wrap;
  word-break: break-all;
}

.dark .code-generator {
  background: var(--bg-card);
}

.dark .code-container {
  background: var(--bg-input);
}

.dark code {
  color: var(--text-primary);
}
</style> 