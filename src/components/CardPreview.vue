<template>
  <div class="preview-container">
    <iframe
      :src="previewUrl"
      style="border: none; width: 100%; height: 160px; overflow: hidden;"
      loading="lazy"
      title="Friend Card Preview"
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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