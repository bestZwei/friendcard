<template>
  <div class="card-form">
    <h2>配置信息</h2>
    <form @submit.prevent>
      <!-- 基础信息 -->
      <div class="form-section">
        <h3>基础信息</h3>
        <div class="form-group">
          <label for="name">名称 *</label>
          <input
            id="name"
            v-model="localData.name"
            type="text"
            placeholder="输入你的名字"
            maxlength="50"
            @blur="validateField('name')"
          >
          <span class="error-text" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="specialty">简介 *</label>
          <input
            id="specialty"
            v-model="localData.specialty"
            type="text"
            placeholder="输入个性简介"
            maxlength="100"
            @blur="validateField('specialty')"
          >
          <span class="error-text" v-if="errors.specialty">{{ errors.specialty }}</span>
        </div>

        <div class="form-group">
          <label for="link">显示链接 *</label>
          <input
            id="link"
            v-model="localData.link"
            type="url"
            placeholder="https://example.com"
            @blur="validateField('link')"
          >
          <span class="error-text" v-if="errors.link">{{ errors.link }}</span>
        </div>

        <div class="form-group">
          <label for="redirect">跳转链接 (可选)</label>
          <input
            id="redirect"
            v-model="localData.redirect"
            type="url"
            placeholder="默认与显示链接相同"
            @blur="validateField('redirect')"
          >
          <span class="error-text" v-if="errors.redirect">{{ errors.redirect }}</span>
        </div>

        <div class="form-group">
          <label for="avatar">头像链接 (可选)</label>
          <input
            id="avatar"
            v-model="localData.avatar"
            type="url"
            placeholder="默认使用网站 favicon"
            @blur="validateField('avatar')"
          >
          <span class="error-text" v-if="errors.avatar">{{ errors.avatar }}</span>
        </div>
      </div>

      <!-- 样式设置 -->
      <div class="form-section">
        <h3>样式设置</h3>
        <div class="form-group">
          <label for="bgcolor">背景颜色/渐变</label>
          <input
            id="bgcolor"
            v-model="localData.bgcolor"
            type="text"
            placeholder="linear-gradient(135deg, #e0e7ff, #f0f4f8)"
          >
          <div class="helper-text">支持颜色值或渐变，例如: #ffffff 或 linear-gradient(...)</div>
        </div>

        <div class="form-group">
          <label for="textcolor">文字颜色</label>
          <input
            id="textcolor"
            v-model="localData.textcolor"
            type="color"
            :value="localData.textcolor || '#1f2937'"
          >
        </div>

        <div class="form-group">
          <label for="linkcolor">链接颜色</label>
          <input
            id="linkcolor"
            v-model="localData.linkcolor"
            type="color"
            :value="localData.linkcolor || '#2563eb'"
          >
        </div>

        <div class="form-group">
          <label for="font">字体</label>
          <select id="font" v-model="localData.font">
            <option value="ZCOOL KuaiLe">ZCOOL KuaiLe</option>
            <option value="Roboto">Roboto</option>
            <option value="Poppins">Poppins</option>
          </select>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])
const localData = useVModel(props, 'modelValue', emit)
const errors = ref({})

const validateField = (field) => {
  errors.value[field] = ''
  
  switch (field) {
    case 'name':
      if (!localData.value.name) {
        errors.value.name = '名称是必填项'
      }
      break
    case 'specialty':
      if (!localData.value.specialty) {
        errors.value.specialty = '简介是必填项'
      }
      break
    case 'link':
      if (!localData.value.link) {
        errors.value.link = '显示链接是必填项'
      } else if (!isValidURL(localData.value.link)) {
        errors.value.link = '请输入有效的URL'
      }
      break
    case 'redirect':
      if (localData.value.redirect && !isValidURL(localData.value.redirect)) {
        errors.value.redirect = '请输入有效的URL'
      }
      break
    case 'avatar':
      if (localData.value.avatar && !isValidURL(localData.value.avatar)) {
        errors.value.avatar = '请输入有效的URL'
      }
      break
  }
}

const isValidURL = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// 保存到本地存储
watch(localData, (newVal) => {
  localStorage.setItem('friendCardData', JSON.stringify(newVal))
}, { deep: true })

// 加载本地存储的数据
onMounted(() => {
  const savedData = localStorage.getItem('friendCardData')
  if (savedData) {
    const parsed = JSON.parse(savedData)
    Object.assign(localData.value, parsed)
  }
})
</script>

<style scoped>
.card-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section h3 {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type="color"] {
  height: 40px;
  padding: 0.25rem;
}

select {
  background-color: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.helper-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style> 