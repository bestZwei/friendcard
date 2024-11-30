<template>
  <Teleport to="body">
    <div v-if="isVisible" class="toast" :class="type">
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const isVisible = ref(false)
const message = ref('')
const type = ref('success')

const show = (msg, msgType = 'success') => {
  message.value = msg
  type.value = msgType
  isVisible.value = true
  
  setTimeout(() => {
    isVisible.value = false
  }, 3000)
}

defineExpose({ show })
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

.success {
  background-color: #10b981;
}

.error {
  background-color: #dc2626;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style> 