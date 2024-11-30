<template>
  <Teleport to="body">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const show = (message, type = 'success', duration = 3000) => {
  const id = toastId++
  const toast = { id, message, type }
  toasts.value.push(toast)
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  box-shadow: var(--card-shadow);
  z-index: 1000;
}

.toast.success {
  background: var(--success);
}

.toast.error {
  background: var(--error);
}

.toast.warning {
  background: var(--warning);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style> 