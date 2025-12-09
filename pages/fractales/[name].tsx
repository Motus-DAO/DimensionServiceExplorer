import { GetServerSideProps } from 'next'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useFractalCapture } from '../../contexts/FractalCaptureContext'
import { useFarcaster } from '../../contexts/FarcasterContext'
import { HoloPanel, HoloButton, HoloText } from '../../components/ui/holo'
import { ethers } from 'ethers'
import path from 'path'
import fs from 'fs'

type Props = { name: string; html: string }
const allowed = ['brainmelt','cosmic','entropy','glitchy','iterate','jazzdimension','matrixchat','neuroreality','planet','psyched','quantum','ripples','transform']

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const nameRaw = (params?.name as string) || ''
  const name = nameRaw.replace(/[^a-z0-9_-]/gi, '').toLowerCase()
  if (!allowed.includes(name)) {
    return { notFound: true }
  }
  let html = ''
  const localPath = path.join(process.cwd(), 'fractales', `${name}.html`)
  try {
    html = await fs.promises.readFile(localPath, 'utf8')
  } catch {
    const res = await fetch(`https://raw.githubusercontent.com/gerryalvrz/brahma101/main/DES/${name}.html`)
    if (!res.ok) {
      html = '<html><body>Error loading</body></html>'
    } else {
      html = await res.text()
    }
  }
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
  let injected = ''
  if (html.includes('</body>')) {
    injected = html.replace('</body>', injection + '</body>')
  } else if (html.includes('</html>')) {
    injected = html.replace('</html>', injection + '</html>')
  } else {
    injected = html + injection
  }
  return { props: { name, html: injected } }
}

export default function FractalesPage({ name, html }: Props) {
  const { registerFrame, capture } = useFractalCapture()
  const { getWalletAddress, walletAddress, isConnected } = useFarcaster()
  const ref = useRef<HTMLIFrameElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(true)
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 })
  const [reopenButtonPosition, setReopenButtonPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isReopenDragging, setIsReopenDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const isReopenDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const reopenButtonRef = useRef<HTMLButtonElement>(null)
  const reopenHasDraggedRef = useRef(false)
  const reopenStartPosRef = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    registerFrame(name, ref.current)
    return () => registerFrame(name, null)
  }, [name, registerFrame])

  // Initialize modal and reopen button positions on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = window.innerWidth - 400 // Default right position
      const defaultY = (window.innerHeight / 2) - 200 // Middle of screen (assuming modal height ~400px)
      setModalPosition({ x: defaultX, y: defaultY })
      setReopenButtonPosition({ x: defaultX, y: defaultY })
    }
  }, [])

  // When modal closes, update reopen button position to modal's position
  useEffect(() => {
    if (!isModalVisible) {
      setReopenButtonPosition(modalPosition)
    }
  }, [isModalVisible, modalPosition])

  // Handle window resize to keep modal and reopen button in bounds
  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect()
        const maxX = window.innerWidth - rect.width
        const maxY = window.innerHeight - rect.height
        setModalPosition(prev => ({
          x: Math.min(Math.max(0, prev.x), maxX),
          y: Math.min(Math.max(0, prev.y), maxY)
        }))
      }
      if (reopenButtonRef.current) {
        const rect = reopenButtonRef.current.getBoundingClientRect()
        const maxX = window.innerWidth - rect.width
        const maxY = window.innerHeight - rect.height
        setReopenButtonPosition(prev => ({
          x: Math.min(Math.max(0, prev.x), maxX),
          y: Math.min(Math.max(0, prev.y), maxY)
        }))
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
      setDragOffset(offset)
      dragOffsetRef.current = offset
      setIsDragging(true)
      isDraggingRef.current = true
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current && modalRef.current) {
      const newX = e.clientX - dragOffsetRef.current.x
      const newY = e.clientY - dragOffsetRef.current.y
      const rect = modalRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      setModalPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (modalRef.current) {
      const touch = e.touches[0]
      const rect = modalRef.current.getBoundingClientRect()
      const offset = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
      setDragOffset(offset)
      dragOffsetRef.current = offset
      setIsDragging(true)
      isDraggingRef.current = true
    }
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current && modalRef.current && e.touches.length > 0) {
      const touch = e.touches[0]
      const newX = touch.clientX - dragOffsetRef.current.x
      const newY = touch.clientY - dragOffsetRef.current.y
      const rect = modalRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      setModalPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      })
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  // Reopen button drag handlers
  const handleReopenMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (reopenButtonRef.current) {
      reopenHasDraggedRef.current = false
      reopenStartPosRef.current = { x: e.clientX, y: e.clientY }
      const offset = {
        x: e.clientX - reopenButtonPosition.x,
        y: e.clientY - reopenButtonPosition.y
      }
      setDragOffset(offset)
      dragOffsetRef.current = offset
      setIsReopenDragging(true)
      isReopenDraggingRef.current = true
    }
  }

  const handleReopenMouseMove = useCallback((e: MouseEvent) => {
    if (isReopenDraggingRef.current && reopenButtonRef.current) {
      // Check if we've actually moved (dragged)
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - reopenStartPosRef.current.x, 2) +
        Math.pow(e.clientY - reopenStartPosRef.current.y, 2)
      )
      if (moveDistance > 5) {
        reopenHasDraggedRef.current = true
      }
      
      const newX = e.clientX - dragOffsetRef.current.x
      const newY = e.clientY - dragOffsetRef.current.y
      const rect = reopenButtonRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      setReopenButtonPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      })
    }
  }, [])

  const handleReopenMouseUp = useCallback((e?: MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsReopenDragging(false)
    isReopenDraggingRef.current = false
  }, [])

  const handleReopenTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (reopenButtonRef.current && e.touches.length > 0) {
      const touch = e.touches[0]
      reopenHasDraggedRef.current = false
      reopenStartPosRef.current = { x: touch.clientX, y: touch.clientY }
      const offset = {
        x: touch.clientX - reopenButtonPosition.x,
        y: touch.clientY - reopenButtonPosition.y
      }
      setDragOffset(offset)
      dragOffsetRef.current = offset
      setIsReopenDragging(true)
      isReopenDraggingRef.current = true
    }
  }

  const handleReopenTouchMove = useCallback((e: TouchEvent) => {
    if (isReopenDraggingRef.current && reopenButtonRef.current && e.touches.length > 0) {
      e.preventDefault()
      const touch = e.touches[0]
      
      // Check if we've actually moved (dragged)
      const moveDistance = Math.sqrt(
        Math.pow(touch.clientX - reopenStartPosRef.current.x, 2) +
        Math.pow(touch.clientY - reopenStartPosRef.current.y, 2)
      )
      if (moveDistance > 5) {
        reopenHasDraggedRef.current = true
      }
      
      const newX = touch.clientX - dragOffsetRef.current.x
      const newY = touch.clientY - dragOffsetRef.current.y
      const rect = reopenButtonRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height
      setReopenButtonPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      })
    }
  }, [])

  const handleReopenTouchEnd = useCallback((e?: TouchEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsReopenDragging(false)
    isReopenDraggingRef.current = false
  }, [])

  const handleReopenClick = (e: React.MouseEvent) => {
    // Only open modal if we didn't drag
    if (!reopenHasDraggedRef.current) {
      setIsModalVisible(true)
    }
    reopenHasDraggedRef.current = false
  }

  // Attach global event listeners for reopen button dragging
  useEffect(() => {
    if (isReopenDragging) {
      document.addEventListener('mousemove', handleReopenMouseMove)
      document.addEventListener('mouseup', handleReopenMouseUp)
      document.addEventListener('touchmove', handleReopenTouchMove as any)
      document.addEventListener('touchend', handleReopenTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleReopenMouseMove)
        document.removeEventListener('mouseup', handleReopenMouseUp)
        document.removeEventListener('touchmove', handleReopenTouchMove as any)
        document.removeEventListener('touchend', handleReopenTouchEnd)
      }
    }
  }, [isReopenDragging, handleReopenMouseMove, handleReopenMouseUp, handleReopenTouchMove, handleReopenTouchEnd])

  // Attach global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove as any)
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove as any)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Get wallet address from Farcaster
  useEffect(() => {
    const fetchWallet = async () => {
      if (isConnected && !account) {
        const addr = walletAddress || await getWalletAddress()
        if (addr) {
          setAccount(addr)
        }
      }
    }
    fetchWallet()
  }, [isConnected, walletAddress, account, getWalletAddress])

  // Celo Mainnet chain params
  const chainParams = {
    chainId: '0xA4EC', // 42220 in hex
    chainName: 'Celo Mainnet',
    nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
    rpcUrls: [process.env.NEXT_PUBLIC_CELO_RPC_URL || 'https://forno.celo.org'],
    blockExplorerUrls: ['https://celoscan.io']
  }

  const getFarcasterProvider = async () => {
    try {
      if (typeof window === 'undefined') return null
      const module = await import('@farcaster/miniapp-sdk')
      const sdk = module.sdk
      const isInMiniApp = await sdk.isInMiniApp()
      if (isInMiniApp) {
        return await sdk.wallet.getEthereumProvider()
      }
    } catch (e) {
      console.log('[Fractal] Farcaster SDK not available:', e)
    }
    // Fallback to window.ethereum if Farcaster not available
    const w: any = window as any
    return w.ethereum || null
  }

  const ensureChain = async () => {
    const provider = await getFarcasterProvider()
    if (!provider) throw new Error('Wallet provider not found')
    try {
      await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainParams.chainId }] })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await provider.request({ method: 'wallet_addEthereumChain', params: [chainParams] })
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainParams.chainId }] })
        } catch (addError) {
          throw new Error('Failed to add Celo network')
        }
      } else {
        throw switchError
      }
    }
  }

  const onConnect = async () => {
    try {
      setStatus('')
      await ensureChain()
      const addr = await getWalletAddress()
      if (addr) {
        setAccount(addr)
      } else {
        setStatus('Failed to get wallet address')
      }
    } catch (e: any) {
      setStatus('Connect failed: ' + (e.message || 'Unknown error'))
    }
  }
  const onCaptureScreen = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) throw new Error('no screen')
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()
      await new Promise((r) => setTimeout(r, 200))
      const w = video.videoWidth || 1280
      const h = video.videoHeight || 720
      const maxW = 384, maxH = 384
      const r = Math.min(maxW / w, maxH / h)
      const nw = Math.max(1, Math.floor(w * r))
      const nh = Math.max(1, Math.floor(h * r))
      const cvs = document.createElement('canvas')
      cvs.width = nw; cvs.height = nh
      const ctx = cvs.getContext('2d')
      if (!ctx) throw new Error('no ctx')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(video, 0, 0, nw, nh)
      const url = cvs.toDataURL('image/png')
      stream.getTracks().forEach((t) => t.stop())
      setCapturedUrl(url)
    } catch (e) {
      setStatus('Capture failed')
    }
    setBusy(false)
  }

  const onClearCapture = () => {
    setCapturedUrl(null)
  }

  const cropCenter = async (u: string, size: number) => {
    return new Promise<string>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const w = img.width
        const h = img.height
        const s = Math.min(size, Math.min(w, h))
        const sx = Math.max(0, Math.floor((w - s) / 2))
        const sy = Math.max(0, Math.floor((h - s) / 2))
        const cvs = document.createElement('canvas')
        cvs.width = s
        cvs.height = s
        const ctx = cvs.getContext('2d')
        if (!ctx) { resolve(u); return }
        ctx.imageSmoothingEnabled = true
        ;(ctx as any).imageSmoothingQuality = 'high'
        ctx.drawImage(img, sx, sy, s, s, 0, 0, s, s)
        const url = cvs.toDataURL('image/png')
        resolve(url)
      }
      img.onerror = () => resolve(u)
      img.src = u
    })
  }

  const bytesOfDataUrl = (x: string) => {
    const m = x.match(/^data:image\/png;base64,(.*)$/)
    const b = m ? m[1] : ''
    return Math.floor(b.length * 3 / 4)
  }

  const cropToFitBytes = async (u: string, maxBytes: number) => {
    const img = new Image()
    await new Promise((r) => { img.onload = r; img.src = u })
    let s = Math.min(512, Math.min(img.width, img.height))
    let url = await cropCenter(u, s)
    let b = bytesOfDataUrl(url)
    let tries = 0
    while (b > maxBytes && s > 32 && tries < 8) {
      const ratio = Math.max(0.5, Math.sqrt(maxBytes / b) * 0.95)
      s = Math.max(32, Math.floor(s * ratio))
      url = await cropCenter(u, s)
      b = bytesOfDataUrl(url)
      tries++
    }
    return url
  }

  const ensureSmallPng = async (u: string) => {
    const maxBytes = 24000
    return new Promise<string>((resolve) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width || 128
        let h = img.height || 128
        const cvs = document.createElement('canvas')
        let ctx = cvs.getContext('2d')
        if (!ctx) { resolve(u); return }
        let url = u
        const bytes = (x: string) => {
          const m = x.match(/^data:image\/png;base64,(.*)$/)
          const b = m ? m[1] : ''
          return Math.floor(b.length * 3 / 4)
        }
        if (!/^data:image\/png;base64,/.test(url)) {
          cvs.width = w; cvs.height = h
          ctx.imageSmoothingEnabled = true
          ;(ctx as any).imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, w, h)
          url = cvs.toDataURL('image/png')
        }
        while (bytes(url) > maxBytes && w > 32 && h > 32) {
          w = Math.floor(w * 0.9)
          h = Math.floor(h * 0.9)
          cvs.width = w; cvs.height = h
          ctx = cvs.getContext('2d')
          if (!ctx) break
          ctx.imageSmoothingEnabled = true
          ;(ctx as any).imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, w, h)
          url = cvs.toDataURL('image/png')
        }
        resolve(url)
      }
      img.onerror = () => resolve(u)
      img.src = u
    })
  }

  const onCopy = async () => {
    if (busy) return
    setBusy(true)
    try {
      const iframe = ref.current
      if (!iframe && !capturedUrl) throw new Error('no iframe')
      let dataUrl = capturedUrl || await capture(name, { hq: true })
      const base64 = dataUrl.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
      await navigator.clipboard.writeText(base64)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
    setBusy(false)
  }
  const onMint = async () => {
    const addr = process.env.NEXT_PUBLIC_FRACTALES_NFT_ADDRESS || ''
    if (!addr) { setStatus('Contract address missing'); return }
    if (!isConnected) { setStatus('Please connect to Farcaster first'); return }
    setBusy(true)
    setStatus('')
    try {
      await ensureChain()
      const provider = await getFarcasterProvider()
      if (!provider) throw new Error('Wallet provider not found')
      
      if (!account) {
        const addr = await getWalletAddress()
        if (addr) {
          setAccount(addr)
        } else {
          throw new Error('Failed to get wallet address')
        }
      }
      
      let dataUrl = capturedUrl || await capture(name, { hq: true, crop: 512 })
      dataUrl = await cropToFitBytes(dataUrl, 6000)
      let base64 = dataUrl.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
      
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const abi = ['function publicMint(string name, string imageBase64) external returns (uint256)']
      const c = new ethers.Contract(addr, abi, signer)
      let gasLimit: bigint
      try {
        const est = await c.publicMint.estimateGas(name, base64)
        const estBig = ethers.toBigInt(est)
        gasLimit = estBig + (estBig / BigInt(2))
      } catch {
        gasLimit = BigInt(12000000)
      }
      const tx = await c.publicMint(name, base64, { gasLimit })
      const rec = await tx.wait()
      setStatus(String(rec?.hash || 'Minted'))
    } catch (e: any) {
      setStatus('Mint failed: ' + (e.message || 'Unknown error'))
    }
    setBusy(false)
  }
  return (
    <main className="min-h-screen bg-black">
      {/* Reopen button - shown when modal is closed, draggable */}
      {!isModalVisible && (
        <button
          ref={reopenButtonRef}
          onClick={handleReopenClick}
          className="fixed z-50 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg p-3 transition-all duration-200 shadow-lg backdrop-blur-sm"
          style={{ 
            cursor: isReopenDragging ? 'grabbing' : 'grab',
            left: `${reopenButtonPosition.x}px`,
            top: `${reopenButtonPosition.y}px`,
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          onMouseDown={handleReopenMouseDown}
          onTouchStart={handleReopenTouchStart}
          aria-label="Open modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" />
            <path d="M2 17L12 22L22 17" />
            <path d="M2 12L12 17L22 12" />
          </svg>
        </button>
      )}

      {/* Draggable Modal */}
      {isModalVisible && (
        <div
          ref={modalRef}
          className="fixed z-50 max-w-sm"
          style={{
            left: `${modalPosition.x}px`,
            top: `${modalPosition.y}px`,
            cursor: isDragging ? 'grabbing' : 'default',
            touchAction: 'none',
            userSelect: 'none'
          }}
        >
          <HoloPanel variant="elevated" size="lg" className="p-4">
            {/* Drag handle and close button header */}
            <div
              className="flex items-center justify-between mb-2 pb-2 border-b border-cyan-500/20 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <HoloText size="base" weight="bold" className="text-cyan-400">{name}</HoloText>
              <button
                onClick={() => setIsModalVisible(false)}
                className="ml-2 text-white/60 hover:text-white/100 transition-colors p-1 rounded hover:bg-white/10"
                aria-label="Close modal"
                style={{ cursor: 'pointer' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mt-3 flex items-center space-x-3">
              <HoloButton variant="primary" onClick={onCopy} disabled={busy}>{busy ? 'Capturing...' : copied ? 'Copied' : 'Copy Image Base64'}</HoloButton>
            </div>
            <div className="mt-3 flex items-center space-x-3">
              <HoloButton variant="primary" onClick={onConnect}>{account ? 'Connected' : 'Connect Wallet'}</HoloButton>
              <HoloButton variant="secondary" onClick={onMint} disabled={busy}>Mint NFT</HoloButton>
              <HoloButton variant="secondary" onClick={onCaptureScreen} disabled={busy}>Capture Screen</HoloButton>
              {capturedUrl && <HoloButton variant="secondary" onClick={onClearCapture} disabled={busy}>Clear Screenshot</HoloButton>}
            </div>
            {capturedUrl && (
              <div className="mt-3">
                <img src={capturedUrl} alt="screenshot" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}
            {status && (
              <div className="mt-3 text-white/80 text-xs break-all">
                {status.startsWith('0x') ? (
                  <a href={`https://celoscan.io/tx/${status}`} target="_blank" rel="noreferrer" className="text-cyan-400 underline">View Tx on CeloScan</a>
                ) : (
                  status
                )}
              </div>
            )}
          </HoloPanel>
        </div>
      )}
      <iframe ref={ref} srcDoc={html} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </main>
  )
}
