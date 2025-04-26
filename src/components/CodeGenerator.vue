<template>
  <div class="code-generator">
    <div class="section-header">
      <h2>生成代码</h2>
    </div>
    
    <!-- 格式选择 -->
    <div class="format-selector">
      <label>
        <input type="radio" v-model="format" value="html">
        HTML (iframe)
      </label>
      <label>
        <input type="radio" v-model="format" value="svg">
        SVG (img)
      </label>
    </div>
    
    <!-- 预览区域 -->
    <div class="preview-section">
      <h3>预览效果</h3>
      <div class="preview-container">
        <iframe v-if="format === 'html'"
          :src="generatedUrl"
          style="border: none; width: 100%; height: 195px; overflow: hidden;"
          loading="lazy"
          title="Friend Card Preview"
        ></iframe>
        <img v-else
          :src="generatedUrl"
          alt="Friend Card Preview"
        />
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
        <h3>{{ format === 'html' ? 'iframe 嵌入代码' : 'img 标签代码' }}</h3>
        <button @click="copyToClipboard(embedCode)" class="copy-btn">
          复制代码
        </button>
      </div>
      <div class="code-container">
        <code>{{ embedCode }}</code>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useToast } from '../composables/useToast'

const { showToastMessage } = useToast()
const format = ref('html')

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const baseUrl = 'https://friendcards.zwei.de.eu.org'

// 从 URL 中提取域名
const extractDomain = (url) => {
  try {
    // 确保 URL 有协议前缀
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    const urlObj = new URL(fullUrl)
    return urlObj.hostname
  } catch (e) {
    // 如果 URL 解析失败，返回原始值
    return url
  }
}

const generatedUrl = computed(() => {
  const params = new URLSearchParams()
  
  if (format.value === 'svg') {
    params.set('format', 'svg')
  }
  
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
  } else if (props.formData.link) {
    // 如果没有提供自定义头像，但提供了链接，则使用链接的域名生成 favicon URL
    const domain = extractDomain(props.formData.link)
    params.set('avatar', `https://favicon.is-an.org/?domain=${domain}&sz=128`)
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

const embedCode = computed(() => {
  if (format.value === 'html') {
    return `<div style="max-width: 600px; margin: 0 auto;">
  <iframe 
    src="${generatedUrl.value}"
    style="border: none; width: 100%; height: 195px; overflow: hidden;"
    loading="lazy"
    title="Friend Card"
  ></iframe>
</div>`;
  } else {
    return `<img 
  src="${generatedUrl.value}"
  alt="Friend Card"
  style="width: 100%; max-width: 600px;"
/>`;
  }
})

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('复制成功！')
  } catch (err) {
    showToastMessage('复制失败，请手动复制')
  }
}

// 在组件中添加字体预加载
watch(() => props.formData.font, (newFont) => {
  // 动态加载字体
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(newFont)}`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}, { immediate: true });
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
  background: #f8fafc;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 195px;
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

.format-selector {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
}

.format-selector label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.format-selector input[type="radio"] {
  width: auto;
  margin: 0;
}

.preview-container img {
  width: 100%;
  height: auto;
  max-width: 560px;
  display: block;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 深色模式适配 */
.dark .format-selector label {
  color: var(--text-primary);
}

.dark .preview-container {
  background: var(--bg-input);
  border-color: var(--border-color);
}
</style>