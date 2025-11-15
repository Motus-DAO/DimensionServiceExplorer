import React, { useState } from 'react';
import { PsyGridDistortion, GridDistortionDemo } from '@/components/ui';

const TestGridDistortionPage: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Grid Distortion Test</h1>
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="px-4 py-2 bg-psy-purple hover:bg-psy-purple/80 rounded-lg transition-colors"
          >
            {showDemo ? 'Hide Demo' : 'Show Interactive Demo'}
          </button>
        </div>
      </div>

      {showDemo ? (
        <GridDistortionDemo />
      ) : (
        <div className="space-y-8 p-8">
          {/* Hero Section Test */}
          <section className="relative h-screen">
            <h2 className="text-3xl font-bold mb-8 text-center">Hero Section Test</h2>
            <div className="relative h-full">
              <PsyGridDistortion
                imageSrc="/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png"
                variant="hero"
                intensity="strong"
                className="w-full h-full"
                onError={() => console.log('Hero image failed to load')}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-psy-purple to-psy-blue bg-clip-text text-transparent">
                    PsyChat
                  </h1>
                  <p className="text-xl text-slate-300">Move your mouse to see the distortion effect!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Background Test */}
          <section className="relative h-96 mb-8">
            <h2 className="text-2xl font-bold mb-4">Background Test</h2>
            <div className="relative h-full">
              <PsyGridDistortion
                imageSrc="/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png"
                variant="background"
                intensity="medium"
                className="w-full h-full"
                onError={() => console.log('Background image failed to load')}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Background Effect</h3>
                  <p className="text-slate-300">This content sits on top of the distorted background</p>
                </div>
              </div>
            </div>
          </section>

          {/* Card Test */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-80">
              <h2 className="text-2xl font-bold mb-4">Card Test</h2>
              <PsyGridDistortion
                imageSrc="/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png"
                variant="card"
                intensity="subtle"
                className="w-full h-full"
                onError={() => console.log('Card image failed to load')}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg p-4 text-center">
                  <h3 className="text-lg font-bold mb-2">Card Component</h3>
                  <p className="text-sm text-slate-300">Perfect for content cards</p>
                </div>
              </div>
            </div>

            <div className="relative h-80">
              <h2 className="text-2xl font-bold mb-4">Overlay Test</h2>
              <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg">
                <PsyGridDistortion
                  imageSrc="/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png"
                  variant="overlay"
                  intensity="medium"
                  className="w-full h-full"
                  onError={() => console.log('Overlay image failed to load')}
                />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 text-center">
                    <h3 className="text-lg font-bold mb-2">Overlay Effect</h3>
                    <p className="text-sm text-slate-300">Layered on top of content</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Testing Instructions</h2>
            <div className="space-y-2 text-slate-300">
              <p>• <strong>Mouse Interaction:</strong> Move your mouse over the images to see the distortion effect</p>
              <p>• <strong>Check Console:</strong> Open browser dev tools to see any error messages</p>
              <p>• <strong>Image Loading:</strong> Verify the image loads correctly (should see your image, not a placeholder)</p>
              <p>• <strong>Performance:</strong> Check if the animation runs smoothly without lag</p>
              <p>• <strong>Responsive:</strong> Try resizing the browser window to test responsiveness</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TestGridDistortionPage;
