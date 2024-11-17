addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const friendName = sanitizeInput(url.searchParams.get('name')) || 'friend';
    const specialty = sanitizeInput(url.searchParams.get('specialty')) || 'INFO';
    const link = sanitizeInput(url.searchParams.get('link')) || '#';

    // Validate URL
    const validLink = isValidURL(link) ? link : '#';
    const domain = validLink !== '#' ? new URL(validLink).hostname : 'zwei.de.eu.org';

    const html = generateHTML(friendName, specialty, validLink, domain);

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    return new Response('Error processing request', { status: 500 });
  }
}

function sanitizeInput(input) {
  return input ? input.replace(/[<>]/g, '') : '';
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

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
        box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
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
        word-break: break-all; /* 防止长链接溢出 */
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
