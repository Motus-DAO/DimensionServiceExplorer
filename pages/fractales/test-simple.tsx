// Simple test page to diagnose Farcaster iframe issues
import { useRef, useEffect, useState } from 'react'

export default function TestSimple() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [status, setStatus] = useState('loading')

  // Test 1: Simple HTML with NO external resources, NO fonts, NO canvas
  const simpleHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        h1 {
          font-size: 48px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <h1>✅ Simple HTML Works!</h1>
      <p>If you see this, basic HTML rendering works in Farcaster.</p>
    </body>
    </html>
  `

  // Test 2: HTML with Canvas (no external resources)
  const canvasHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          background: #000;
        }
        canvas {
          display: block;
        }
      </style>
    </head>
    <body>
      <canvas id="testCanvas"></canvas>
      <script>
        const canvas = document.getElementById('testCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        
        // Simple animation
        let x = 0;
        function animate() {
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#0f0';
          ctx.fillRect(x % canvas.width, 50, 50, 50);
          x += 2;
          requestAnimationFrame(animate);
        }
        animate();
      </script>
    </body>
    </html>
  `

  // Test 3: HTML with external font (this should fail)
  const externalFontHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #000;
          color: #0f0;
          font-family: 'VT323', monospace;
          font-size: 24px;
        }
      </style>
    </head>
    <body>
      <h1>External Font Test</h1>
      <p>If font loads: You'll see VT323 font</p>
      <p>If blocked: You'll see fallback monospace</p>
    </body>
    </html>
  `

  const [testHTML, setTestHTML] = useState(simpleHTML)
  const [testName, setTestName] = useState('Simple HTML (No external resources)')

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const body = iframeDoc.body
          if (body && body.children.length > 0) {
            setStatus('✅ Loaded successfully')
            console.log('[Test] Iframe loaded, content visible')
          } else {
            setStatus('⚠️ Loaded but body is empty')
          }
        } else {
          setStatus('❌ Cannot access iframe content (CORS/CSP)')
        }
      } catch (e) {
        setStatus(`❌ Error: ${e}`)
        console.error('[Test] Iframe access error:', e)
      }
    }

    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [testHTML])

  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>Farcaster Iframe Diagnostic Tests</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>Current Test: {testName}</h2>
        <p>Status: {status}</p>
        
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => { setTestHTML(simpleHTML); setTestName('Simple HTML (No external resources)'); setStatus('loading') }}
            style={{ padding: '10px 20px', background: '#667eea', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
          >
            Test 1: Simple HTML
          </button>
          <button 
            onClick={() => { setTestHTML(canvasHTML); setTestName('Canvas Test (No external resources)'); setStatus('loading') }}
            style={{ padding: '10px 20px', background: '#764ba2', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
          >
            Test 2: Canvas
          </button>
          <button 
            onClick={() => { setTestHTML(externalFontHTML); setTestName('External Font Test'); setStatus('loading') }}
            style={{ padding: '10px 20px', background: '#f56565', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
          >
            Test 3: External Font
          </button>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        srcDoc={testHTML}
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ width: '100%', height: '80vh', border: '2px solid #667eea', borderRadius: '8px' }}
        title="Farcaster iframe test"
      />

      <div style={{ marginTop: '20px', padding: '15px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h3>What to check:</h3>
        <ul>
          <li>✅ <strong>Test 1 works:</strong> Basic HTML rendering works in Farcaster</li>
          <li>✅ <strong>Test 2 works:</strong> Canvas operations are allowed</li>
          <li>❌ <strong>Test 3 fails:</strong> External resources (fonts) are blocked</li>
        </ul>
        <p style={{ marginTop: '10px', color: '#888' }}>
          Open browser console (F12) to see detailed error messages
        </p>
      </div>
    </div>
  )
}

