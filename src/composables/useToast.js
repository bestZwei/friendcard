import { inject } from 'vue'

export function useToast() {
  const toast = inject('toast')
  
  if (!toast) {
    throw new Error('Toast provider not found')
  }

  const showToastMessage = (message, type = 'success', duration = 3000) => {
    toast.show(message, type, duration)
  }

  return {
    showToastMessage
  }
} 