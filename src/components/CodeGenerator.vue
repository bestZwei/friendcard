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
          style="border: none; width: 100%; height: 160px; overflow: hidden;"
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

const generateIframeCode = (url) => {
  return `<div style="max-width: 600px; margin: 0 auto;">
  <iframe 
    src="${url}"
    style="border: none; width: 100%; height: 190px; overflow: hidden;"
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

.preview-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.preview-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.code-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.code-container {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: #0f172a;
}

.copy-btn {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.copy-btn:hover {
  background: linear-gradient(135deg, #4338ca, #2563eb);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.copy-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}

h2, h3 {
  color: #1f2937;
  margin: 0;
}
</style> 