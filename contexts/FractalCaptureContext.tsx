import React, { createContext, useContext, useRef, useCallback } from 'react'

type FractalCaptureContextType = {
  registerFrame: (name: string, frame: HTMLIFrameElement | null) => void
  capture: (name: string) => Promise<string>
}

const Ctx = createContext<FractalCaptureContextType | null>(null)

export const FractalCaptureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const framesRef = useRef<Map<string, HTMLIFrameElement>>(new Map())

  const registerFrame = useCallback((name: string, frame: HTMLIFrameElement | null) => {
    if (!frame) {
      framesRef.current.delete(name)
      return
    }
    framesRef.current.set(name, frame)
  }, [])

  const capture = useCallback((name: string) => {
    return new Promise<string>((resolve, reject) => {
      const frame = framesRef.current.get(name)
      if (!frame || !frame.contentWindow) {
        reject(new Error('Frame not available'))
        return
      }
      const handler = (e: MessageEvent) => {
        if (!e.data || e.data.type !== 'fractales-capture-result' || e.data.name !== name) return
        window.removeEventListener('message', handler)
        resolve(e.data.dataUrl as string)
      }
      window.addEventListener('message', handler)
      frame.contentWindow.postMessage({ type: 'fractales-capture', name }, '*')
      setTimeout(() => {
        window.removeEventListener('message', handler)
        reject(new Error('Capture timeout'))
      }, 15000)
    })
  }, [])

  return <Ctx.Provider value={{ registerFrame, capture }}>{children}</Ctx.Provider>
}

export const useFractalCapture = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useFractalCapture must be used within FractalCaptureProvider')
  return v
}

