<template>
  <div class="container">
    <header>
      <h1>Friend Card Generator</h1>
      <p>生成你的个性化名片，并嵌入到你的网站中</p>
    </header>

    <main>
      <div class="content-wrapper">
        <CardForm v-model="formData" />
        
        <CodeGenerator :form-data="formData" />
        
        <div class="preview-section">
          <h2>预览效果</h2>
          <div class="preview-container">
            <CardPreview :form-data="formData" />
          </div>
        </div>
      </div>
    </main>

    <footer>
      <p>Made with ❤️ by Your Name</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CardForm from './components/CardForm.vue'
import CardPreview from './components/CardPreview.vue'
import CodeGenerator from './components/CodeGenerator.vue'

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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

header h1 {
  font-size: 2.5rem;
  color: #2563eb;
  margin-bottom: 1rem;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .content-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-section {
    grid-column: 1 / -1;
    margin-top: 2rem;
  }
}

.preview-section {
  text-align: center;
}

.preview-container {
  max-width: 600px;
  margin: 0 auto;
}

footer {
  margin-top: 4rem;
  text-align: center;
  color: #666;
}
</style> 