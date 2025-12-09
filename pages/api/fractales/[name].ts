import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

const allowed = ['brainmelt','cosmic','entropy','glitchy','iterate','jazzdimension','matrixchat','neuroreality','planet','psyched','quantum','ripples','transform']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name } = req.query
  const nameRaw = (name as string) || ''
  const cleanName = nameRaw.replace(/[^a-z0-9_-]/gi, '').toLowerCase()
  
  if (!allowed.includes(cleanName)) {
    return res.status(404).json({ error: 'Fractal not found' })
  }

  let html = ''
  const localPath = path.join(process.cwd(), 'fractales', `${cleanName}.html`)
  
  try {
    html = await fs.promises.readFile(localPath, 'utf8')
  } catch {
    // Fallback to GitHub
    try {
      const githubRes = await fetch(`https://raw.githubusercontent.com/gerryalvrz/brahma101/main/DES/${cleanName}.html`)
      if (!githubRes.ok) {
        return res.status(404).send('<html><body>Error loading fractal</body></html>')
      }
      html = await githubRes.text()
    } catch (e) {
      return res.status(500).send('<html><body>Error loading fractal</body></html>')
    }
  }

  // Fix for Farcaster: Remove external font imports and replace with system fonts
  html = html.replace(
    /@import\s+url\(['"]https?:\/\/fonts\.googleapis\.com[^)]+\);/gi,
    ''
  )
  // Replace Google Fonts references with system monospace fonts
  html = html.replace(
    /font-family:\s*['"]?([^'";,]+)['"]?/gi,
    (match, fontName) => {
      // If it's a Google Font, replace with system font
      if (fontName.includes('VT323') || fontName.includes('Share Tech Mono') || fontName.includes('Press Start 2P')) {
        return `font-family: 'Courier New', Courier, monospace`
      }
      return match
    }
  )
  
  // Mobile fixes: Ensure viewport meta tag is present and correct
  if (!html.includes('viewport')) {
    html = html.replace(
      /<head>/i,
      '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
    )
  } else {
    // Update existing viewport for mobile
    html = html.replace(
      /<meta\s+name=["']viewport["'][^>]*>/i,
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
    )
  }
  
  // Add mobile-specific CSS fixes
  const mobileCSS = `
    <style>
      /* Mobile viewport fixes */
      html, body {
        height: 100%;
        height: 100dvh; /* Dynamic viewport height for mobile */
        overflow: hidden;
        position: fixed;
        width: 100%;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      /* Prevent iOS bounce scrolling */
      body {
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
      }
      /* Fix canvas sizing on mobile */
      canvas {
        touch-action: none;
        display: block;
        width: 100vw !important;
        height: 100vh !important;
        height: 100dvh !important;
      }
    </style>
  `
  
  // Inject mobile CSS before closing head or after opening head
  if (html.includes('</head>')) {
    html = html.replace('</head>', mobileCSS + '</head>')
  } else if (html.includes('<head>')) {
    html = html.replace('<head>', '<head>' + mobileCSS)
  } else {
    html = mobileCSS + html
  }

  // Inject Farcaster SDK and ready() call
  const farcasterSDK = `
    <script type="module">
      // Dynamically import Farcaster SDK
      import('https://cdn.jsdelivr.net/npm/@farcaster/miniapp-sdk@latest/dist/index.min.js').then((module) => {
        const sdk = module.sdk || module.default?.sdk || window.sdk;
        
        if (sdk && sdk.actions) {
          // Check if we're in a Farcaster miniapp environment
          sdk.isInMiniApp().then((isInMiniApp) => {
            if (isInMiniApp) {
              // Wait for content to be ready
              const checkReady = () => {
                // Check if canvas or main content is loaded
                const canvas = document.querySelector('canvas');
                const body = document.body;
                
                if (canvas || (body && body.children.length > 0)) {
                  // Content is ready, signal to Farcaster
                  sdk.actions.ready().catch((e) => {
                    console.warn('[Fractal] SDK ready() error:', e);
                  });
                  console.log('[Fractal] SDK ready() called');
                } else {
                  // Wait a bit and try again
                  setTimeout(checkReady, 100);
                }
              };
              
              // Start checking after a short delay to let content load
              setTimeout(checkReady, 500);
              
              // Also try on window load
              window.addEventListener('load', () => {
                setTimeout(() => {
                  sdk.actions.ready().catch((e) => {
                    console.warn('[Fractal] SDK ready() error on load:', e);
                  });
                }, 100);
              });
            } else {
              console.log('[Fractal] Not in Farcaster miniapp, skipping SDK ready()');
            }
          }).catch((e) => {
            console.warn('[Fractal] SDK isInMiniApp() error:', e);
          });
        } else {
          console.warn('[Fractal] Farcaster SDK not found');
        }
      }).catch((e) => {
        console.warn('[Fractal] Failed to load Farcaster SDK:', e);
      });
    </script>
  `

  // Inject the capture script (same as before)
  const injection = `
<script>
window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'fractales-capture') return;
  var brightness = function(dataUrl) {
    var img = new Image();
    return new Promise(function(res){
      img.onload = function(){
        var c = document.createElement('canvas');
        c.width = 16; c.height = 16;
        var x = c.getContext('2d');
        x.drawImage(img, 0, 0, 16, 16);
        var d = x.getImageData(0,0,16,16).data;
        var s = 0;
        for (var i=0;i<d.length;i+=4){ s += d[i] + d[i+1] + d[i+2]; }
        res(s / (16*16*3*255));
      };
      img.src = dataUrl;
    });
  };
  var downscale = function(source) {
    var maxW = 384, maxH = 384;
    var w = source.width, h = source.height;
    var r = Math.min(maxW / w, maxH / h);
    var nw = Math.max(1, Math.floor(w * r));
    var nh = Math.max(1, Math.floor(h * r));
    var out = document.createElement('canvas');
    out.width = nw; out.height = nh;
    var ctx = out.getContext('2d');
    if (ctx) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; }
    ctx.drawImage(source, 0, 0, w, h, 0, 0, nw, nh);
    return out.toDataURL('image/png', 0.6);
  };
  var tryCanvas = function() {
    var target = document.querySelector('#fractalCanvas') || document.querySelector('canvas');
    if (!target) return null;
    try {
      var url;
      if (e.data && e.data.hq) {
        if (e.data && e.data.crop && e.data.crop > 0) {
          var s = Math.min(e.data.crop, Math.min(target.width, target.height));
          var sx = Math.max(0, Math.floor((target.width - s) / 2));
          var sy = Math.max(0, Math.floor((target.height - s) / 2));
          var out = document.createElement('canvas');
          out.width = s; out.height = s;
          var cx = out.getContext('2d');
          if (cx) { cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; }
          cx.drawImage(target, sx, sy, s, s, 0, 0, s, s);
          url = out.toDataURL('image/png');
        } else {
          url = target.toDataURL('image/png');
        }
      } else {
        url = downscale(target);
      }
      return url;
    } catch(err) {
      return null;
    }
  };
  var goHtml2 = function(){
    var el = document.body;
    window.html2canvas(el, {useCORS:true, scale:1}).then(function(canvas) {
      var url;
      if (e.data && e.data.hq) {
        if (e.data && e.data.crop && e.data.crop > 0) {
          var s = Math.min(e.data.crop, Math.min(canvas.width, canvas.height));
          var sx = Math.max(0, Math.floor((canvas.width - s) / 2));
          var sy = Math.max(0, Math.floor((canvas.height - s) / 2));
          var out = document.createElement('canvas');
          out.width = s; out.height = s;
          var cx = out.getContext('2d');
          if (cx) { cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high'; }
          cx.drawImage(canvas, sx, sy, s, s, 0, 0, s, s);
          url = out.toDataURL('image/png');
        } else {
          url = canvas.toDataURL('image/png');
        }
      } else {
        url = downscale(canvas);
      }
      parent.postMessage({type:'fractales-capture-result', name: e.data.name, dataUrl: url}, '*');
    });
  };
  var attempt = function(n){
    var url = tryCanvas();
    if (url){
      brightness(url).then(function(b){
        if (b > 0.02){
          parent.postMessage({type:'fractales-capture-result', name: e.data.name, dataUrl: url}, '*');
        } else if (n < 5){
          setTimeout(function(){ attempt(n+1); }, 200);
        } else {
          goHtml2();
        }
      });
    } else if (n < 3){
      setTimeout(function(){ attempt(n+1); }, 200);
    } else {
      goHtml2();
    }
  };
  var go = function(){ attempt(0); };
  if (!(window.html2canvas)) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.onload = go;
    document.head.appendChild(s);
  } else {
    go();
  }
}, false);
</script>`

  // Inject both scripts before closing body or head
  let injected = ''
  if (html.includes('</body>')) {
    injected = html.replace('</body>', farcasterSDK + injection + '</body>')
  } else if (html.includes('</html>')) {
    injected = html.replace('</html>', farcasterSDK + injection + '</html>')
  } else {
    injected = html + farcasterSDK + injection
  }

  // Set proper headers for HTML content
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  
  return res.status(200).send(injected)
}

