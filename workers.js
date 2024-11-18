// Cloudflare Workers 入口，监听 fetch 事件
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// 内存缓存对象，用于存储 IP 请求计数和时间戳
const rateLimitMap = new Map();

const RATE_LIMIT = 500; // 每小时允许的最大请求次数
const TIME_WINDOW = 60 * 60 * 1000; // 时间窗口：1小时（以毫秒为单位）
const MAX_MAP_SIZE = 10000; // Map 最大容量限制

// 处理传入的请求
async function handleRequest(request) {
  const clientIP = request.headers.get('cf-connecting-ip');
  if (!clientIP) {
    console.error('无法识别客户端 IP');
    return new Response('无法识别客户端 IP', { status: 400 });
  }

  // 清理过期的条目，避免内存问题
  cleanUpExpiredEntries();

  // 检查并限制 IP 请求速率
  const rateLimitResponse = checkRateLimit(clientIP);
  if (rateLimitResponse) {
    return rateLimitResponse; // 超过请求限制时返回 429 响应
  }

  try {
    const url = new URL(request.url);
    const friendName = sanitizeInput(url.searchParams.get('name')) || 'friend';
    const specialty = sanitizeInput(url.searchParams.get('specialty')) || 'INFO';
    const link = sanitizeInput(url.searchParams.get('link')) || '#';

    // 验证链接是否有效
    const validLink = isValidURL(link) ? link : '#';
    const domain = validLink !== '#' ? new URL(validLink).hostname : 'zwei.de.eu.org';

    const html = generateHTML(friendName, specialty, validLink, domain);

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Error processing request', { status: 500 });
  }
}

// 检查并更新请求计数
function checkRateLimit(clientIP) {
  const currentTime = Date.now();
  let record = rateLimitMap.get(clientIP);

  if (!record) {
    record = { count: 0, startTime: currentTime };
    rateLimitMap.set(clientIP, record);
  }

  // 检查时间窗口是否已过期
  if (currentTime - record.startTime >= TIME_WINDOW) {
    record.count = 0;
    record.startTime = currentTime;
  }

  // 检查请求次数是否超过限制
  if (record.count >= RATE_LIMIT) {
    console.warn(`Client IP ${clientIP} 请求超过限制`);
    return new Response('请求过多，请稍后再试。', { status: 429 });
  }

  // 更新请求计数并存储回内存缓存
  record.count++;
  rateLimitMap.set(clientIP, record);

  return null; // 请求未超出限制，返回 null 继续处理
}

// 清理过期的 Map 条目
function cleanUpExpiredEntries() {
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const currentTime = Date.now();
    for (const [ip, record] of rateLimitMap) {
      if (currentTime - record.startTime >= TIME_WINDOW) {
        rateLimitMap.delete(ip);
      }
    }
  }
}

// 输入清理函数，防止 XSS 攻击
function sanitizeInput(input) {
  return input ? input.replace(/[<>"'/`]/g, '') : '';
}

// 验证 URL 是否有效
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// 生成 HTML 页面
function generateHTML(name, specialty, link, domain) {
  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;700&family=ZCOOL+KuaiLe&display=swap');
      
      .card {
        display: flex;
        align-items: center;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #e0e7ff, #f0f4f8);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        max-width: 600px;
        width: 100%;
        box-sizing: border-box;
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
      }
      
      .avatar {
        flex: 1;
        max-width: 80px;
      }
      
      .avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .content {
        flex: 2;
        margin-left: 20px;
        text-align: left;
      }
      
      .content h3 {
        margin: 0;
        font-size: 1.6em;
        color: #1f2937;
      }
      
      .content p {
        margin: 10px 0;
        color: #4b5563;
        font-size: 1em;
        line-height: 1.5;
        font-family: 'ZCOOL KuaiLe', sans-serif;
      }
      
      .content a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;
        word-break: break-all;
      }
      
      .content a:hover {
        color: #1d4ed8;
      }
    </style>
    <div class="card">
      <div class="avatar">
        <img src="https://api.faviconkit.com/${domain}/128" alt="${name}'s avatar" onerror="this.onerror=null;this.src='https://via.placeholder.com/80';">
      </div>
      <div class="content">
        <h3>${name}</h3>
        <p>简介：${specialty}</p>
        <a href="${link}" target="_blank">${link}</a>
      </div>
    </div>
  `;
}
