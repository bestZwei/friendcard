<template>
  <div class="app-container" :class="{ 'dark': isDark }">
    <header class="header">
      <div class="header-content">
        <h1>Friend Card Generator</h1>
        <p>生成你的个性化名片，并嵌入到你的网站中</p>
        <button class="theme-toggle" @click="toggleDark">
          {{ isDark ? '🌞' : '🌙' }}
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="content-grid">
        <CardForm v-model="formData" />
        <CodeGenerator :form-data="formData" />
      </div>
    </main>

    <footer class="footer">
      <p>Made with ❤️ by <a href="https://github.com/yourusername" target="_blank">Your Name</a></p>
    </footer>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import CardForm from './components/CardForm.vue'
import CodeGenerator from './components/CodeGenerator.vue'
import Toast from './components/Toast.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const formData = ref({
  name: '',
  specialty: '',
  link: '',
  redirect: '',
  avatar: '',
  bgcolor: 'linear-gradient(135deg, #e0e7ff, #f0f4f8)',
  textcolor: '#1f2937',
  linkcolor: '#2563eb',
  font: 'ZCOOL KuaiLe'
})
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  font-size: 1.25rem;
  opacity: 0.9;
}

.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-top: -2rem;
}

.content-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 550px), 1fr));
}

.footer {
  text-align: center;
  padding: 2rem;
  background: var(--neutral-100);
  color: var(--neutral-600);
}

.dark .footer {
  background: var(--neutral-800);
  color: var(--neutral-400);
}

.footer a {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 500;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .header {
    padding: 3rem 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .main-content {
    padding: 1rem;
  }
}
</style> 