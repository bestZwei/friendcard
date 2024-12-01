<template>
  <div class="preview-container">
    <iframe 
      ref="previewFrame"
      :src="previewUrl"
      style="border: none; width: 100%; height: 195px; overflow: hidden;"
      loading="lazy"
      title="Friend Card Preview"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const frameHeight = ref(195)

const handleMessage = (e) => {
  if (e.data && e.data.type === 'resize') {
    frameHeight.value = Math.max(195, e.data.height)
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
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