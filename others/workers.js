addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

addEventListener('scheduled', event => {
  event.waitUntil(cleanUpExpiredEntries());
});

const rateLimitMap = new Map();
const RATE_LIMIT = 500;
const TIME_WINDOW = 60 * 60 * 1000;
const MAX_MAP_SIZE = 10000;

async function handleRequest(request) {
  const clientIP = request.headers.get('cf-connecting-ip');
  if (!clientIP) {
    return new Response('无法识别客户端 IP', { status: 400 });
  }

  const rateLimitResponse = checkRateLimit(clientIP);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const url = new URL(request.url);
    const friendName = sanitizeInput(url.searchParams.get('name')) || 'friend';
    const specialty = sanitizeInput(url.searchParams.get('specialty')) || 'INFO';
    const displayLink = sanitizeInput(url.searchParams.get('link')) || '#';
    const redirectLink = sanitizeInput(url.searchParams.get('redirect')) || displayLink;
    const avatarLink = sanitizeInput(url.searchParams.get('avatar'));
    const domain = displayLink !== '#' ? new URL(displayLink).hostname : 'zwei.de.eu.org';

    // 新增自定义样式参数
    const bgcolor = sanitizeInput(url.searchParams.get('bgcolor')) || 'linear-gradient(135deg, #e0e7ff, #f0f4f8)';
    const textcolor = sanitizeInput(url.searchParams.get('textcolor')) || '#1f2937';
    const linkcolor = sanitizeInput(url.searchParams.get('linkcolor')) || '#2563eb';
    const font = sanitizeInput(url.searchParams.get('font')) || 'ZCOOL KuaiLe';

    const html = generateHTML(friendName, specialty, displayLink, redirectLink, avatarLink, domain, {
      bgcolor,
      textcolor,
      linkcolor,
      font
    });

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Error processing request', { status: 500 });
  }
}

function checkRateLimit(clientIP) {
  const currentTime = Date.now();
  let record = rateLimitMap.get(clientIP);

  if (!record) {
    record = { count: 0, startTime: currentTime };
    rateLimitMap.set(clientIP, record);
  }

  if (currentTime - record.startTime >= TIME_WINDOW) {
    record.count = 0;
    record.startTime = currentTime;
  }

  if (record.count >= RATE_LIMIT) {
    return new Response('请求过多，请稍后再试。', { status: 429 });
  }

  record.count++;
  rateLimitMap.set(clientIP, record);

  return null;
}

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

function sanitizeInput(input) {
  return input ? input.replace(/[<>]/g, '') : '';
}

function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function generateHTML(name, specialty, displayLink, redirectLink, avatarLink, domain, styles) {
  const avatarURL = avatarLink || `https://api.faviconkit.com/${domain}/128`;
  const { bgcolor, textcolor, linkcolor, font } = styles;

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&family=LXGW+WenKai&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;700&family=Open+Sans:wght@400;600&family=Inter:wght@400;500;600&family=Montserrat:wght@400;500;600&family=Lato:wght@400;700&family=Source+Sans+Pro:wght@400;600&family=Ubuntu:wght@400;500&family=Fira+Sans:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Nunito+Sans:wght@400;600&family=Josefin+Sans:wght@400;500&family=Raleway:wght@400;500&family=Work+Sans:wght@400;500&family=Manrope:wght@400;500&family=DM+Sans:wght@400;500&family=Space+Grotesk:wght@400;500&family=Noto+Sans+Arabic:wght@400;500&family=Noto+Kufi+Arabic:wght@400;500&family=Amiri:wght@400;700&family=Noto+Sans+KR:wght@400;500&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+Vietnamese:wght@400;500&family=Be+Vietnam+Pro:wght@400;500&family=PT+Sans:wght@400;700&display=swap');
      
      .card {
        display: flex;
        align-items: flex-start;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 20px;
        background: ${bgcolor};
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        max-width: 600px;
        width: 100%;
        box-sizing: border-box;
        min-height: 120px;
        height: auto;
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
      }
      
      .avatar {
        flex: 0 0 80px;
        margin-right: 20px;
      }
      
      .avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .content {
        flex: 1;
        min-width: 0;
      }
      
      .content h3 {
        margin: 0;
        font-size: 1.6em;
        color: ${textcolor};
        word-wrap: break-word;
      }
      
      .content p {
        margin: 10px 0;
        color: ${textcolor};
        font-size: 1em;
        line-height: 1.5;
        font-family: '${font}', sans-serif;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      
      .content a {
        color: ${linkcolor};
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;
        word-break: break-all;
        display: inline-block;
        max-width: 100%;
      }
      
      .content a:hover {
        color: ${linkcolor}dd;
      }

      @media (max-width: 480px) {
        .card {
          padding: 15px;
        }
        
        .avatar {
          flex: 0 0 60px;
        }
        
        .avatar img {
          width: 60px;
          height: 60px;
        }
        
        .content h3 {
          font-size: 1.4em;
        }
        
        .content p {
          font-size: 0.95em;
        }
      }
      
      body {
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .card {
        margin: 0 auto;
      }
    </style>
    <div class="card">
      <div class="avatar">
        <img src="${avatarURL}" alt="${name}'s avatar" onerror="this.onerror=null;this.src='https://via.placeholder.com/80';">
      </div>
      <div class="content">
        <h3>${name}</h3>
        <p>✨${specialty}✨</p>
        <a href="${redirectLink}" target="_blank">${displayLink}</a>
      </div>
    </div>
    <script>
      function updateIframeHeight() {
        const height = document.documentElement.offsetHeight;
        window.parent.postMessage({ type: 'resize', height: height }, '*');
      }

      // 创建 ResizeObserver 实例
      const observer = new ResizeObserver(() => {
        updateIframeHeight();
      });

      // 观察 card 元素
      observer.observe(document.querySelector('.card'));

      // 图片加载完成后更新高度
      document.querySelector('img').onload = updateIframeHeight;

      // 初始更新
      updateIframeHeight();
    </script>
  `;
}