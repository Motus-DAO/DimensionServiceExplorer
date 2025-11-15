import React, { useState } from 'react';
import PsyGridDistortion from './PsyGridDistortion';

const GridDistortionDemo: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState('/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png');
  const [variant, setVariant] = useState<'hero' | 'background' | 'card' | 'overlay'>('background');
  const [intensity, setIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium');

  // Sample images - using your actual image
  const sampleImages = [
    { src: '/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png', name: 'Glitchy Greek Sculpture' },
    { src: '/assets/grid-distortion/default-bg.jpg', name: 'Default Background (Fallback)' },
  ];

  const handleError = () => {
    console.log('GridDistortion failed to load image');
    // You can add your error handling logic here
  };

  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Grid Distortion Demo</h2>
        <p className="text-slate-400">Interactive image distortion effect with mouse interaction</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-slate-300">Image</label>
          <select
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
          >
            {sampleImages.map((img) => (
              <option key={img.src} value={img.src}>
                {img.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-slate-300">Variant</label>
          <select
            value={variant}
            onChange={(e) => setVariant(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
          >
            <option value="hero">Hero</option>
            <option value="background">Background</option>
            <option value="card">Card</option>
            <option value="overlay">Overlay</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-slate-300">Intensity</label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white"
          >
            <option value="subtle">Subtle</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
          </select>
        </div>
      </div>

      {/* Demo Area */}
      <div className="relative">
        <div 
          className="relative w-full"
          style={{ 
            height: variant === 'hero' ? '100vh' : 
                   variant === 'card' ? '400px' : '600px' 
          }}
        >
          <PsyGridDistortion
            imageSrc={selectedImage}
            variant={variant}
            intensity={intensity}
            onError={handleError}
            className="w-full h-full"
          />
          
          {/* Content overlay for demonstration */}
          {variant === 'hero' && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-psy-purple to-psy-blue bg-clip-text text-transparent">
                  PsyChat
                </h1>
                <p className="text-xl text-slate-300">Interactive Grid Distortion</p>
              </div>
            </div>
          )}
          
          {variant === 'card' && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-white bg-slate-900/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-2">Card Variant</h3>
                <p className="text-slate-300">Perfect for content cards</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Usage Instructions</h3>
        <div className="space-y-2 text-slate-300">
          <p>• <strong>Mouse Interaction:</strong> Move your mouse over the image to see the distortion effect</p>
          <p>• <strong>Variants:</strong> Choose different layouts and positioning</p>
          <p>• <strong>Intensity:</strong> Adjust the strength of the distortion effect</p>
          <p>• <strong>Images:</strong> Add your own images to the <code className="bg-slate-700 px-2 py-1 rounded">/public/assets/grid-distortion/</code> folder</p>
        </div>
      </div>
    </div>
  );
};

export default GridDistortionDemo;
