<template>
  <div class="preview-container">
    <iframe 
      ref="previewFrame"
      :src="previewUrl"
      style="border: none; width: 100%; overflow: hidden;"
      :style="{ height: frameHeight + 'px' }"
      loading="lazy"
      title="Friend Card Preview"
    ></iframe>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const frameHeight = ref(160) // 默认高度
const previewFrame = ref(null)

// 监听来自 iframe 的消息
const handleMessage = (e) => {
  if (e.data && e.data.type === 'resize') {
    frameHeight.value = e.data.height
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const previewUrl = computed(() => {
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
</script>

<style scoped>
.preview-container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
</style> 