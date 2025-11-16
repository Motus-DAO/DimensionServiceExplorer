import { GetServerSideProps } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { useFractalCapture } from '../../contexts/FractalCaptureContext'
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
  var go = function() {
    var el = document.body;
    window.html2canvas(el, {useCORS:true, scale:1}).then(function(canvas) {
      var maxW = 128, maxH = 128;
      var w = canvas.width, h = canvas.height;
      var ratio = Math.min(maxW / w, maxH / h);
      var nw = Math.max(1, Math.floor(w * ratio));
      var nh = Math.max(1, Math.floor(h * ratio));
      var out = document.createElement('canvas');
      out.width = nw; out.height = nh;
      var ctx = out.getContext('2d');
      ctx.drawImage(canvas, 0, 0, w, h, 0, 0, nw, nh);
      var dataUrl = out.toDataURL('image/png');
      parent.postMessage({type:'fractales-capture-result', name: e.data.name, dataUrl: dataUrl}, '*');
    });
  };
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
  const ref = useRef<HTMLIFrameElement>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  useEffect(() => {
    registerFrame(name, ref.current)
    return () => registerFrame(name, null)
  }, [name, registerFrame])
  const chainParams = {
    chainId: '0x190f1b46',
    chainName: 'Polkadot Hub TestNet',
    nativeCurrency: { name: 'Paseo', symbol: 'PAS', decimals: 18 },
    rpcUrls: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    blockExplorerUrls: ['https://blockscout-passet-hub.parity-testnet.parity.io/']
  }
  const getMetaMaskProvider = () => {
    const w: any = window as any
    const eth = w.ethereum
    if (!eth) return null
    if (eth.providers && Array.isArray(eth.providers)) {
      const mm = eth.providers.find((p: any) => p && p.isMetaMask)
      if (mm) return mm
    }
    return eth.isMetaMask ? eth : null
  }
  const ensureChain = async () => {
    const eth = getMetaMaskProvider()
    if (!eth) throw new Error('MetaMask not found')
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainParams.chainId }] })
    } catch {
      await eth.request({ method: 'wallet_addEthereumChain', params: [chainParams] })
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainParams.chainId }] })
    }
  }
  const onConnect = async () => {
    try {
      setStatus('')
      await ensureChain()
      const eth = getMetaMaskProvider()
      const accs: string[] = await eth.request({ method: 'eth_requestAccounts' })
      setAccount(accs[0] || '')
    } catch (e: any) {
      setStatus('Connect failed')
    }
  }
  const onCopy = async () => {
    if (busy) return
    setBusy(true)
    try {
      const iframe = ref.current
      if (!iframe) throw new Error('no iframe')
      const dataUrl = await capture(name)
      const base64 = dataUrl.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
      await navigator.clipboard.writeText(base64)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
    setBusy(false)
  }
  const onMint = async () => {
    if (!account) { setStatus('Wallet not connected'); return }
    const addr = process.env.NEXT_PUBLIC_FRACTALES_NFT_ADDRESS || ''
    if (!addr) { setStatus('Contract address missing'); return }
    setBusy(true)
    setStatus('')
    try {
      const dataUrl = await capture(name)
      const base64 = dataUrl.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '')
      const mm = getMetaMaskProvider()
      if (!mm) throw new Error('MetaMask not found')
      const provider = new ethers.BrowserProvider(mm)
      const signer = await provider.getSigner()
      const abi = ['function publicMint(string name, string imageBase64) external returns (uint256)']
      const c = new ethers.Contract(addr, abi, signer)
      const gas = await c.publicMint.estimateGas(name, base64)
      const gasNum = Math.max(8000000, Math.floor(Number(gas) * 3))
      const tx = await c.publicMint(name, base64, { gasLimit: gasNum })
      const rec = await tx.wait()
      setStatus(String(rec?.hash || 'Minted'))
    } catch (e: any) {
      setStatus('Mint failed')
    }
    setBusy(false)
  }
  return (
    <main className="min-h-screen bg-black">
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        <HoloPanel variant="elevated" size="lg" className="p-4">
          <HoloText size="base" weight="bold" className="text-cyan-400">{name}</HoloText>
          <div className="mt-3 flex items-center space-x-3">
            <HoloButton variant="primary" onClick={onCopy} disabled={busy}>{busy ? 'Capturing...' : copied ? 'Copied' : 'Copy Image Base64'}</HoloButton>
          </div>
          <div className="mt-3 flex items-center space-x-3">
            <HoloButton variant="primary" onClick={onConnect}>{account ? 'Connected' : 'Connect Wallet'}</HoloButton>
            <HoloButton variant="secondary" onClick={onMint} disabled={busy || !account}>Mint NFT</HoloButton>
          </div>
          {status && (
            <div className="mt-3 text-white/80 text-xs break-all">
              {status.startsWith('0x') ? (
                <a href={`https://blockscout-passet-hub.parity-testnet.parity.io/tx/${status}`} target="_blank" rel="noreferrer" className="text-cyan-400 underline">View Tx</a>
              ) : (
                status
              )}
            </div>
          )}
        </HoloPanel>
      </div>
      <iframe ref={ref} srcDoc={html} style={{ width: '100%', height: '100vh', border: 'none' }} />
    </main>
  )
}
