<template>
  <div class="card-form">
    <h2>配置信息</h2>
    <form @submit.prevent>
      <div class="form-group">
        <label for="name">名称</label>
        <input
          id="name"
          v-model="localData.name"
          type="text"
          placeholder="输入你的名字"
        >
      </div>

      <div class="form-group">
        <label for="specialty">简介</label>
        <input
          id="specialty"
          v-model="localData.specialty"
          type="text"
          placeholder="输入个性简介"
        >
      </div>

      <div class="form-group">
        <label for="link">显示链接</label>
        <input
          id="link"
          v-model="localData.link"
          type="url"
          placeholder="https://example.com"
        >
      </div>

      <div class="form-group">
        <label for="redirect">跳转链接 (可选)</label>
        <input
          id="redirect"
          v-model="localData.redirect"
          type="url"
          placeholder="默认与显示链接相同"
        >
      </div>

      <div class="form-group">
        <label for="avatar">头像链接 (可选)</label>
        <input
          id="avatar"
          v-model="localData.avatar"
          type="url"
          placeholder="默认使用网站 favicon"
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localData = useVModel(props, 'modelValue', emit)
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
</style> 