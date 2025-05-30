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
          @input="validateNameLength"
          @blur="validateField('name')"
        >
        <span class="char-count">{{ nameWidth }}/14</span>
        <span class="error-text" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="specialty">简介</label>
        <input
          id="specialty"
          v-model="localData.specialty"
          type="text"
          placeholder="一句话介绍"
          @input="validateSpecialtyLength"
        >
        <span class="char-count">{{ specialtyWidth }}/30</span>
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
        <div class="color-presets">
          <button
            v-for="preset in bgPresets"
            :key="preset.value"
            class="color-preset"
            :style="{ background: preset.value }"
            @click="localData.bgcolor = preset.value"
            :title="preset.name"
          ></button>
        </div>
        <input
          id="bgcolor"
          v-model="localData.bgcolor"
          type="text"
          placeholder="颜色值或渐变，如：#ffffff 或 linear-gradient(...)"
        >
      </div>

      <div class="form-group">
        <label for="textcolor">文字颜色</label>
        <div class="color-presets">
          <button
            v-for="preset in textPresets"
            :key="preset.value"
            class="color-preset"
            :style="{ background: preset.value }"
            @click="localData.textcolor = preset.value"
            :title="preset.name"
          ></button>
        </div>
        <input
          id="textcolor"
          v-model="localData.textcolor"
          type="color"
          :value="localData.textcolor"
        >
      </div>

      <div class="form-group">
        <label for="linkcolor">链接颜色</label>
        <div class="color-presets">
          <button
            v-for="preset in linkPresets"
            :key="preset.value"
            class="color-preset"
            :style="{ background: preset.value }"
            @click="localData.linkcolor = preset.value"
            :title="preset.name"
          ></button>
        </div>
        <input
          id="linkcolor"
          v-model="localData.linkcolor"
          type="color"
          :value="localData.linkcolor"
        >
      </div>

      <div class="form-group">
        <label for="font">简介字体</label>
        <select id="font" v-model="localData.font">
          <optgroup v-for="(fonts, category) in fontOptions" 
                    :key="category" 
                    :label="category">
            <option v-for="font in fonts"
                    :key="font.value"
                    :value="font.value">
              {{ font.label }}
            </option>
          </optgroup>
        </select>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, reactive } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
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
  }
})

const emit = defineEmits(['update:modelValue'])
const localData = reactive({ ...props.modelValue })

// 当本地数据改变时，更新父组
watch(localData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

const errors = ref({})

const validateUrl = (url) => {
  if (!url) return true
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`)
    return true
  } catch {
    return false
  }
}

const calculateCharWidth = (char) => {
  if (/[0-9a-z]/.test(char)) {
    return 0.5;
  }
  return 1;
}

const calculateStringWidth = (str) => {
  return str.split('').reduce((total, char) => total + calculateCharWidth(char), 0);
}

const nameWidth = computed(() => {
  return calculateStringWidth(localData.name).toFixed(1);
});

function validateNameLength(event) {
  const input = event.target;
  const text = input.value;
  const width = calculateStringWidth(text);
  
  if (width > 14) {
    // 如果超出最大宽度，逐个字符截取直到满足宽度要求
    let i = text.length;
    while (i > 0 && calculateStringWidth(text.slice(0, i)) > 14) {
      i--;
    }
    localData.name = text.slice(0, i);
  }
}

const specialtyWidth = computed(() => {
  return calculateStringWidth(localData.specialty).toFixed(1);
});

function validateSpecialtyLength(event) {
  const input = event.target;
  const text = input.value;
  const width = calculateStringWidth(text);
  
  if (width > 30) {
    // 如果超出最大宽度，逐个字符截取直到满足宽度要求
    let i = text.length;
    while (i > 0 && calculateStringWidth(text.slice(0, i)) > 30) {
      i--;
    }
    localData.specialty = text.slice(0, i);
  }
}

const validateField = (field) => {
  errors.value[field] = ''
  
  switch (field) {
    case 'name':
      if (!localData.name) {
        errors.value.name = '名称是必填项'
      } else if (calculateStringWidth(localData.name) > 14) {
        errors.value.name = '名称超出长度限制'
      }
      break
    case 'specialty':
      if (calculateStringWidth(localData.specialty) > 30) {
        errors.value.specialty = '简介超出长度限制'
      }
      break
    case 'link':
      if (!localData.link) {
        errors.value.link = '显示链接是必填项'
      } else if (!validateUrl(localData.link)) {
        errors.value.link = '请输入有效的URL'
      }
      break
    case 'redirect':
      if (localData.redirect && !validateUrl(localData.redirect)) {
        errors.value.redirect = '请输入有效的URL'
      }
      break
    case 'avatar':
      if (localData.avatar && !validateUrl(localData.avatar)) {
        errors.value.avatar = '请输入有效的URL'
      }
      break
    case 'bgcolor':
      if (localData.bgcolor && !isValidColor(localData.bgcolor)) {
        errors.value.bgcolor = '请输入有效的颜色值或渐变'
      }
      break
    case 'textcolor':
      if (localData.textcolor && !isValidColor(localData.textcolor)) {
        errors.value.textcolor = '请输入有效的颜色值'
      }
      break
    case 'linkcolor':
      if (localData.linkcolor && !isValidColor(localData.linkcolor)) {
        errors.value.linkcolor = '请输入有效的颜色值'
      }
      break
  }
}

const isValidColor = (color) => {
  if (!color) return true
  // 检查十六进制颜色
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true
  // 检查渐变
  if (/^linear-gradient\(([^()]+)\)$/.test(color)) return true
  return false
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
    // 合并默认值和保存的数据
    Object.assign(localData, {
      bgcolor: 'linear-gradient(135deg, #e0e7ff, #f0f4f8)',
      textcolor: '#1f2937',
      linkcolor: '#2563eb',
      font: 'ZCOOL KuaiLe',
      ...parsed
    })
  }
})

const bgPresets = [
  { name: '默认渐变', value: 'linear-gradient(135deg, #e0e7ff, #f0f4f6)' },
  { name: '暖色渐变', value: 'linear-gradient(135deg, #fef3c7, #ffe4e6)' },
  { name: '冷色渐变', value: 'linear-gradient(135deg, #dbeafe, #e0e7ff)' },
  { name: '薄荷渐变', value: 'linear-gradient(135deg, #d1fae5, #dbeafe)' },
  { name: '紫色渐变', value: 'linear-gradient(135deg, #ede9fe, #fae8ff)' },
  { name: '日落渐变', value: 'linear-gradient(135deg, #fef3c7, #fee2e2)' },
  { name: '极光渐变', value: 'linear-gradient(135deg, #a7f3d0, #93c5fd)' },
  { name: '樱花渐变', value: 'linear-gradient(135deg, #fce7f3, #dbeafe)' },
  { name: '青柠渐变', value: 'linear-gradient(135deg, #ecfccb, #d9f99d)' },
  { name: '珊瑚渐变', value: 'linear-gradient(135deg, #ffedd5, #fed7aa)' }
]

const textPresets = [
  { name: '深灰', value: '#1f2937' },
  { name: '黑色', value: '#000000' },
  { name: '深蓝', value: '#1e3a8a' },
  { name: '深棕', value: '#3f2f1f' },
  { name: '深紫', value: '#4c1d95' },
  { name: '深绿', value: '#064e3b' }
]

const linkPresets = [
  { name: '默认蓝', value: '#2563eb' },
  { name: '深蓝', value: '#1d4ed8' },
  { name: '靛青', value: '#3730a3' },
  { name: '紫色', value: '#7c3aed' },
  { name: '玫红', value: '#db2777' },
  { name: '红色', value: '#dc2626' },
  { name: '橙色', value: '#ea580c' },
  { name: '琥珀', value: '#d97706' },
  { name: '绿色', value: '#059669' },
  { name: '青色', value: '#0891b2' },
]

const fontOptions = {
  '中文字体': [
    { label: '站酷快乐体 (默认)', value: 'ZCOOL KuaiLe' },
    { label: '思源黑体', value: 'Noto Sans SC' },
    { label: '思源宋体', value: 'Noto Serif SC' },
    { label: '霞鹜文楷', value: 'LXGW WenKai' },
    { label: '站酷文艺体', value: 'ZCOOL XiaoWei' },
    { label: '站酷高端黑', value: 'ZCOOL QingKe HuangYou' },
    { label: '马善政硬笔行书', value: 'Ma Shan Zheng' },
    { label: '钟齐志莽行书', value: 'Zhi Mang Xing' }
  ],
  '英文字体': [
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Source Sans Pro', value: 'Source Sans Pro' },
    { label: 'Ubuntu', value: 'Ubuntu' }
  ],
  '德语字体': [
    { label: 'Fira Sans', value: 'Fira Sans' },
    { label: 'IBM Plex Sans', value: 'IBM Plex Sans' },
    { label: 'Nunito Sans', value: 'Nunito Sans' }
  ],
  '法语字体': [
    { label: 'Josefin Sans', value: 'Josefin Sans' },
    { label: 'Raleway', value: 'Raleway' },
    { label: 'Work Sans', value: 'Work Sans' }
  ],
  '西班牙语字体': [
    { label: 'Manrope', value: 'Manrope' },
    { label: 'DM Sans', value: 'DM Sans' },
    { label: 'Space Grotesk', value: 'Space Grotesk' }
  ],
  '阿拉伯语字体': [
    { label: 'Noto Sans Arabic', value: 'Noto Sans Arabic' },
    { label: 'Noto Kufi Arabic', value: 'Noto Kufi Arabic' },
    { label: 'Amiri', value: 'Amiri' }
  ],
  '韩文字体': [
    { label: 'Noto Sans KR', value: 'Noto Sans KR' },
    { label: 'Nanum Gothic', value: 'Nanum Gothic' },
    { label: 'Nanum Myeongjo', value: 'Nanum Myeongjo' }
  ],
  '越南语字体': [
    { label: 'Noto Sans Vietnamese', value: 'Noto Sans Vietnamese' },
    { label: 'Be Vietnam Pro', value: 'Be Vietnam Pro' },
    { label: 'Josefin Sans', value: 'Josefin Sans' }
  ],
  '俄语字体': [
    { label: 'Noto Sans', value: 'Noto Sans' },
    { label: 'PT Sans', value: 'PT Sans' },
    { label: 'Roboto', value: 'Roboto' }
  ]
}
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

.color-presets {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.color-preset {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-preset:hover {
  transform: scale(1.1);
}

optgroup {
  font-weight: 600;
}

.dark {
  --card-bg: #1f2937;
  --input-bg: #111827;
  --input-border: #374151;
  --input-text: #e5e7eb;
}

/* 添加字体预览效果 */
select option {
  padding: 8px;
  font-size: 1rem;
}

select option:hover {
  background-color: #f3f4f6;
}

/* 优化字体分组样式 */
select optgroup {
  font-weight: 600;
  color: #4b5563;
  background-color: #f8fafc;
}

/* 添加字体预加载 */
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC&family=Roboto&family=Poppins&family=Playfair+Display&family=Inter&family=Noto+Sans+JP&family=Noto+Sans+KR&family=Dancing+Script&display=swap');

.char-count {
  font-size: 0.875rem;
  color: var(--neutral-500);
  margin-left: 0.5rem;
}
</style> 