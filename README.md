# 友情链接卡片生成器

## 简介

这是一个部署在 **Cloudflare Workers** 上的 **友情链接卡片生成器**。通过提供 `name`、`specialty` 和 `link` 参数，您可以动态生成一个精美的卡片展示 HTML 页面，包含头像、简介和链接信息。该工具支持嵌入 `iframe`，方便用户将卡片集成到任意网站。

## 功能特性

- **动态卡片生成**：根据 URL 参数生成带有头像、简介、链接的友链卡片。
- **自动头像抓取**：通过链接域名自动抓取站点头像（使用第三方服务）。
- **请求速率限制**：每个 IP 每小时最多允许 500 次请求，防止滥用。
- **嵌入方便**：无需复杂配置，通过 `iframe` 即可轻松嵌入。
- **轻量高效**：基于 Cloudflare Workers，快速响应，无需额外依赖。

---

## 使用方法

### 1. 嵌入友链卡片

通过以下 HTML 代码，将友链卡片嵌入您的网页。替换 `name`、`specialty` 和 `link` 参数以生成您需要的卡片：

```html
<div style="max-width: 600px; margin: 0 auto;">
  <iframe src="https://friendcards.zwei.de.eu.org/?name=Zwei&specialty=一只野生的大学生&link=https://zwei.de.eu.org" 
          style="border:none; width:100%; height:160px;" 
          scrolling="no"></iframe>
</div>
```

#### 参数说明

- **`name`**: 卡片中的名称（例如：`Zwei`）。
- **`specialty`**: 卡片中的简介（例如：`一只野生的大学生`）。
- **`link`**: 展示的链接（例如：`https://zwei.de.eu.org`）。
- **`redirect`** *(可选)*: 实际跳转的链接（例如：`https://zwei.de.eu.org/blog`）。

**注意**：如果 `redirect` 参数未提供，默认跳转到 `link` 参数指定的地址。

---

### 2. 显示与跳转链接分离

如果需要显示与跳转链接分离，可以通过 `redirect` 参数指定实际跳转链接。例如：

```html
<iframe src="https://friendcards.zwei.de.eu.org/?name=Zwei&specialty=一只野生的大学生&link=https://zwei.de.eu.org&redirect=https://zwei.de.eu.org/blog" 
        style="border:none; width:100%; height:160px;" 
        scrolling="no"></iframe>
```

- **显示链接**: `https://zwei.de.eu.org`
- **跳转链接**: `https://zwei.de.eu.org/blog`

---

## 部署说明

如果您希望在自己的 Cloudflare Worker 中部署此服务，请按以下步骤操作：

### 1. 配置 Cloudflare Workers

1. 登录您的 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 创建一个新的 Cloudflare Worker。
3. 将以下代码粘贴到 Worker 的代码编辑器中：
   [完整代码点此查看](https://github.com/your-repo-link)

### 2. 定时清理缓存

为确保内存不超过限制，可以在 Cloudflare 的 **Cron Triggers** 中配置定时清理任务。定时触发器会清理过期的 IP 速率限制记录。

**建议配置：**
- 每小时运行一次。

---

## 示例效果

嵌入后的卡片效果如下：

<div style="max-width: 600px; margin: 0 auto;">
  <iframe src="https://friendcards.zwei.de.eu.org/?name=Zwei&specialty=一只野生的大学生&link=https://zwei.de.eu.org" 
          style="border:none; width:100%; height:160px;" 
          scrolling="no"></iframe>
</div>

### 示例代码

```html
<div style="max-width: 600px; margin: 0 auto;">
  <iframe src="https://friendcards.zwei.de.eu.org/?name=Zwei&specialty=一只野生的大学生&link=https://zwei.de.eu.org" 
          style="border:none; width:100%; height:160px;" 
          scrolling="no"></iframe>
</div>
```

---

## 请求速率限制

为防止滥用，系统对每个 IP 的请求频率进行了限制：
- **限制**: 每个 IP 每小时最多请求 **500 次**。
- **超限响应**: 如果超过限制，返回 HTTP 状态码 `429`，并提示用户稍后再试。

---

## 注意事项

- 如果提供的 `link` 或 `redirect` 不是有效的 HTTP 或 HTTPS 链接，系统会自动替换为默认值 `#`。
- `name` 和 `specialty` 参数会自动过滤 HTML 特殊字符以避免 XSS 攻击。

