<template>
  <div class="card-form">
    <h2>配置信息</h2>
    <form @submit.prevent>
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

      <h3 class="section-title">样式配置（可选）</h3>
      
      <div class="form-group">
        <label for="bgcolor">背景颜色</label>
        <input
          id="bgcolor"
          v-model="localData.bgcolor"
          type="text"
          placeholder="颜色值或渐变，如：#ffffff 或 linear-gradient(...)"
        >
      </div>

      <div class="form-group">
        <label for="textcolor">文字颜色</label>
        <input
          id="textcolor"
          v-model="localData.textcolor"
          type="color"
          :value="localData.textcolor"
        >
      </div>

      <div class="form-group">
        <label for="linkcolor">链接颜色</label>
        <input
          id="linkcolor"
          v-model="localData.linkcolor"
          type="color"
          :value="localData.linkcolor"
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
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
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

const validateUrl = (url) => {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

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
      } else if (!validateUrl(localData.value.link)) {
        errors.value.link = '请输入有效的URL'
      }
      break
    case 'redirect':
      if (localData.value.redirect && !validateUrl(localData.value.redirect)) {
        errors.value.redirect = '请输入有效的URL'
      }
      break
    case 'avatar':
      if (localData.value.avatar && !validateUrl(localData.value.avatar)) {
        errors.value.avatar = '请输入有效的URL'
      }
      break
    case 'bgcolor':
      if (localData.value.bgcolor && 
          !localData.value.bgcolor.match(/(#[0-9A-Fa-f]{6}|linear-gradient)/)) {
        errors.value.bgcolor = '请输入有效的颜色值或渐变'
      }
      break
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

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input::placeholder {
  color: #9ca3af;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

input.error {
  border-color: #dc2626;
}

.section-title {
  margin: 2rem 0 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #374151;
  font-size: 1.25rem;
}

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  background-color: white;
}

select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input[type="color"] {
  padding: 0.25rem;
  height: 40px;
}
</style> 