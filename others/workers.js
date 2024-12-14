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
    const format = url.searchParams.get('format')?.toLowerCase() || 'html';
    const friendName = sanitizeInput(url.searchParams.get('name')) || '友链卡片生成器';
    const specialty = sanitizeInput(url.searchParams.get('specialty')) || '生成一个类似我这样的卡片';
    const displayLink = sanitizeInput(url.searchParams.get('link')) || 'https://friendcard.is-an.org';
    const redirectLink = sanitizeInput(url.searchParams.get('redirect')) || 
      (displayLink.startsWith('http') ? displayLink : `https://${displayLink}`);
    const avatarLink = sanitizeInput(url.searchParams.get('avatar'));
    const domain = displayLink !== 'https://friendcard.is-an.org' ? 
      (new URL(displayLink.startsWith('http') ? displayLink : `https://${displayLink}`)).hostname : 
      'friendcard.is-an.org';

    const styles = {
      bgcolor: sanitizeInput(url.searchParams.get('bgcolor')) || 'linear-gradient(135deg, #e0e7ff, #f0f4f8)',
      textcolor: sanitizeInput(url.searchParams.get('textcolor')) || '#1f2937',
      linkcolor: sanitizeInput(url.searchParams.get('linkcolor')) || '#2563eb',
      font: sanitizeInput(url.searchParams.get('font')) || 'ZCOOL KuaiLe'
    };

    let response;
    if (format === 'svg') {
      const svg = await generateSVG(friendName, specialty, displayLink, redirectLink, avatarLink, domain, styles);
      response = new Response(svg, {
        headers: { 
          'content-type': 'image/svg+xml',
          'cache-control': 'public, max-age=3600'
        },
      });
    } else {
      const html = generateHTML(friendName, specialty, displayLink, redirectLink, avatarLink, domain, styles);
      response = new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }

    return response;
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

function generateHTML(name, specialty, displayLink, redirectLink, avatarLink, domain, styles = {}) {
  const { 
    bgcolor = 'linear-gradient(135deg, #e0e7ff, #f0f4f8)', 
    textcolor = '#1f2937', 
    linkcolor = '#2563eb', 
    font = 'ZCOOL KuaiLe' 
  } = styles;
  
  let avatarURL;
  if (avatarLink) {
    avatarURL = avatarLink;
  } else if (displayLink && displayLink !== 'https://friendcard.is-an.org') {
    avatarURL = `https://api.faviconkit.com/${domain}/128`;
  } else {
    avatarURL = 'https://friendcard.is-an.org/favicon.svg';
  }

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&family=LXGW+WenKai&family=ZCOOL+XiaoWei&family=ZCOOL+QingKe+HuangYou&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600&family=Open+Sans:wght@400;600&family=Inter:wght@400;500;600&family=Montserrat:wght@400;500;600&family=Lato:wght@400;700&family=Source+Sans+Pro:wght@400;600&family=Ubuntu:wght@400;500&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Nunito+Sans:wght@400;600;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&family=Raleway:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&family=Noto+Kufi+Arabic:wght@400;500;700&family=Amiri:wght@400;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Nanum+Gothic:wght@400;700&family=Nanum+Myeongjo:wght@400;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Vietnamese:wght@400;500;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&family=PT+Sans:wght@400;700&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 16px;
      }
      
      .card {
        display: flex;
        align-items: center;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        padding: 20px;
        background: ${bgcolor};
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        width: 100%;
        max-width: 600px;
        gap: 20px;
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.2);
      }
      
      .avatar {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .avatar img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        object-fit: cover;
      }
      
      .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .content h3 {
        margin: 0 0 10px 0;
        font-size: 1.6em;
        color: #1f2937;
        word-wrap: break-word;
      }
      
      .content p {
        margin: 0 0 10px 0;
        color: ${textcolor};
        font-size: 1em;
        line-height: 1.5;
        font-family: '${font}', sans-serif;
        word-wrap: break-word;
      }
      
      .content a {
        color: ${linkcolor};
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;
        display: block;
        word-wrap: break-word;
        word-break: break-all;
      }
      
      .content a:hover {
        color: ${linkcolor}dd;
      }

      @media (max-width: 480px) {
        .card {
          padding: 16px;
        }
        
        .avatar {
          width: 60px;
          height: 60px;
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
    </style>
    <div class="card">
      <div class="avatar">
        <img src="${avatarURL}" alt="${name}'s avatar" onerror="this.onerror=null;this.src='https://friendcard.is-an.org/favicon.svg';">
      </div>
      <div class="content">
        <h3>${name}</h3>
        <p>✨${specialty}✨</p>
        <a href="${redirectLink}" target="_blank">${displayLink}</a>
      </div>
    </div>
  `;
}

function parseCSSGradient(gradient) {
  // 提取角度
  const angleMatch = gradient.match(/(\d+)deg/);
  const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
  
  // 提取所有颜色值和位置
  const colorStops = gradient.match(/(#[a-fA-F0-9]{3,8}|rgba?\([^)]+\))(\s+\d+%)?/g) || [];
  
  return {
    angle,
    stops: colorStops.map(stop => {
      const [color, position] = stop.split(/\s+/);
      return {
        color,
        offset: position || null
      };
    })
  };
}

// 文本换行函数移到外部
function wrapText(text, maxWidth, fontSize) {
  const words = text.split('');
  let lines = [];
  let currentLine = '';
  
  const charWidth = fontSize * 1.2;
  const charsPerLine = Math.floor(maxWidth / charWidth);
  
  for (let i = 0; i < words.length; i++) {
    currentLine += words[i];
    
    if (currentLine.length >= charsPerLine || i === words.length - 1) {
      lines.push(currentLine);
      currentLine = '';
    }
  }
  
  return lines;
}

async function generateSVG(name, specialty, displayLink, redirectLink, avatarLink, domain, styles = {}) {
  const { 
    bgcolor = 'linear-gradient(135deg, #e0e7ff, #f0f4f8)', 
    textcolor = '#1f2937', 
    linkcolor = '#2563eb', 
    font = 'ZCOOL KuaiLe' 
  } = styles;

  let avatarURL;
  let avatarBase64;
  
  try {
    if (avatarLink) {
      const response = await fetch(avatarLink);
      const buffer = await response.arrayBuffer();
      avatarBase64 = `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
    } else if (displayLink && displayLink !== 'https://friendcard.is-an.org') {
      const response = await fetch(`https://api.faviconkit.com/${domain}/128`);
      const buffer = await response.arrayBuffer();
      avatarBase64 = `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
    } else {
      // 默认头像也转为base64
      const response = await fetch('https://friendcard.is-an.org/favicon.svg');
      const buffer = await response.arrayBuffer();
      avatarBase64 = `data:${response.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(buffer)))}`;
    }
  } catch (error) {
    console.error('Error loading avatar:', error);
    // 如果加载失败，使用一个简单的内嵌SVG作为默认头像
    avatarBase64 = 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <rect width="128" height="128" fill="#e5e7eb"/>
        <text x="64" y="64" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="64">?</text>
      </svg>
    `);
  }

  // 修改 defs 部分
  let defs = `
    <defs>
      <!-- 卡片阴影 -->
      <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
        <feOffset dx="0" dy="4" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.15"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- 头像阴影 -->
      <filter id="avatar-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="0" dy="2" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.15"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;

    // 如果是渐变背景,添加静态渐变定义
    if (bgcolor.includes('linear-gradient')) {
      const gradient = parseCSSGradient(bgcolor);
      const [x1, y1, x2, y2] = calculateGradientPoints(gradient.angle);
      
      defs += `
        <linearGradient id="cardGradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${gradient.stops.map((stop, index) => `
            <stop offset="${stop.offset || (index === 0 ? '0%' : '100%')}" 
                  style="stop-color:${stop.color};stop-opacity:1"/>
          `).join('')}
        </linearGradient>
      `;
    }

    defs += `</defs>`;

    // 处理名称长度
    const truncatedName = name.length > 14 ? name.slice(0, 14) : name;

    // 处理简介文本换行和星星显示
    const specialtyLines = wrapText(specialty, 320, 16);
    const specialtyText = specialtyLines.map((line, index) => {
      const prefix = index === 0 ? '✨' : '';
      const suffix = index === specialtyLines.length - 1 ? '✨' : '';
      return `<text x="180" y="${100 + index * 20}" class="card-text" font-size="16" fill="${textcolor}">${prefix}${line}${suffix}</text>`;
    }).join('');

    // 调整链接位置，基于简介行数
    const linkY = 100 + (specialtyLines.length * 20) + 20;

    // 头像相关的尺寸和位置（移到这里）
    const AVATAR_SIZE = 100;
    const AVATAR_RADIUS = AVATAR_SIZE / 2;
    const AVATAR_X = 40;
    const AVATAR_Y = Math.max(80, (linkY + 40) / 2 - AVATAR_RADIUS);

    // 简化字体处理
    const fontWithFallback = `${font}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="100%" height="100%" viewBox="0 0 560 ${Math.max(160, linkY + 40)}" 
           xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink">
        ${defs}
        <style>
          .card-text { 
            font-family: ${fontWithFallback};
            font-weight: 400;
          }
          .card-title {
            font-family: ${fontWithFallback};
            font-weight: 700;
          }
          .card-link {
            font-family: ${fontWithFallback};
            font-weight: 400;
          }
        </style>
        
        <!-- 卡片背景 -->
        <rect x="0" y="0" width="560" height="${Math.max(160, linkY + 40)}" rx="20" 
              fill="${bgcolor.includes('linear-gradient') ? 'url(#cardGradient)' : bgcolor}"
              stroke="#e2e8f0" stroke-width="1"
              filter="url(#card-shadow)"/>
        
        <!-- 头像背景和图片 -->
        <g filter="url(#avatar-shadow)" transform="translate(-10, -10)">
          <circle cx="${AVATAR_X + AVATAR_RADIUS}" cy="${AVATAR_Y + AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="white"/>
          <image x="${AVATAR_X}" y="${AVATAR_Y}" 
                 width="${AVATAR_SIZE}" height="${AVATAR_SIZE}" 
                 href="${avatarBase64}" 
                 clip-path="circle(${AVATAR_RADIUS}px at ${AVATAR_RADIUS}px ${AVATAR_RADIUS}px)"/>
        </g>
        
        <!-- 文本内容 -->
        <text x="180" y="60" class="card-title" font-size="24" fill="${textcolor}">${truncatedName}</text>
        ${specialtyText}
        <a xlink:href="${redirectLink}" target="_blank">
          <text x="180" y="${linkY}" class="card-link" font-size="14" fill="${linkcolor}">${displayLink}</text>
        </a>
      </svg>`;
}

// 辅助函数：计算渐变角度对应的坐标点
function calculateGradientPoints(angle) {
  const radian = (angle - 90) * Math.PI / 180;
  const x1 = 50 + Math.cos(radian) * 50;
  const y1 = 50 + Math.sin(radian) * 50;
  const x2 = 50 - Math.cos(radian) * 50;
  const y2 = 50 - Math.sin(radian) * 50;
  return [x1, y1, x2, y2];
}