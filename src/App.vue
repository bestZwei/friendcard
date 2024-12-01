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
      <p>
        Made with ❤️ by <a href="https://zwei.de.eu.org" target="_blank">Zwei</a> | 
        <a href="https://github.com/bestZwei/friendcard" target="_blank">
          <span class="github-link">Code</span>
        </a>
      </p>
    </footer>

    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
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

const toast = ref(null)
provide('toast', toast)
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  background-image: 
    linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0)),
    linear-gradient(135deg, #4f46e5, #3b82f6);
  color: white;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #ffffff, rgba(255,255,255,0.9));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
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
  background: linear-gradient(135deg, #f8faff, #eef2ff);
  color: #4b5563;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  margin-top: 2rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.footer p {
  margin: 0;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

.footer a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  background: linear-gradient(to right, #4f46e5, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}

.footer a:hover {
  background: linear-gradient(to right, #4338ca, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  transform: translateY(-1px);
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.github-link:before {
  content: "⭐";
  font-size: 1.1em;
  background: none;
  -webkit-text-fill-color: currentColor;
}

.dark .footer {
  background: var(--neutral-800);
  color: var(--neutral-400);
}

@media (max-width: 768px) {
  .header {
    padding: 2rem 1rem;
  }

  .header h1 {
    font-size: 1.75rem;
  }

  .header p {
    font-size: 1rem;
  }

  .main-content {
    padding: 1rem;
  }
}

.copy-btn, 
.btn-primary,
button[type="submit"] {
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.copy-btn:hover, 
.btn-primary:hover,
button[type="submit"]:hover {
  background: linear-gradient(135deg, #4338ca, #2563eb);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.copy-btn:active, 
.btn-primary:active,
button[type="submit"]:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:focus,
select:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.toast {
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 