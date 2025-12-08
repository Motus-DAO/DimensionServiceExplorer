import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { GridDistortionProvider } from '../contexts/GridDistortionContext';
import { ArkivProvider } from '../contexts/ArkivContext';
import { HyperbridgeProvider } from '../contexts/HyperbridgeContext';
import AssistantWidget from '../components/AssistantWidget';
import { FractalCaptureProvider } from '../contexts/FractalCaptureContext';

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering components on server
  if (!mounted) {
    return (
      <div className="min-h-screen psychat-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-3xl font-bold text-white mb-4">PsyChat</h1>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ArkivProvider>
      <HyperbridgeProvider>
        <FractalCaptureProvider>
          <GridDistortionProvider>
            <Component {...pageProps} />
            <AssistantWidget />
          </GridDistortionProvider>
        </FractalCaptureProvider>
      </HyperbridgeProvider>
    </ArkivProvider>
  );
}
