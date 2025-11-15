import React from 'react';
import { PsyGridDistortion } from '../components/ui';

const DebugGridPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Test GridDistortion in isolation */}
      <div className="absolute inset-0 z-0">
        <PsyGridDistortion
          imageSrc="/assets/grid-distortion/gerryalvrz_glitchy_white_greek_sculptures_digital_rennassainc_21f5b9da-cacd-41ee-8d39-17a15ecd36ed_0.png"
          variant="background"
          intensity="strong"
          className="w-full h-full"
          onError={() => console.error('GridDistortion Error occurred')}
        />
      </div>
      
      {/* Overlay content to test visibility */}
      <div className="relative z-10 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">GridDistortion Debug Test</h1>
        <p className="text-white/80 mb-4">You should see the glitchy Greek sculpture image with mouse distortion effects behind this text.</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="text-white">If you can see this text clearly, the GridDistortion is working as a background.</p>
          <p className="text-white">Move your mouse around to see the distortion effect.</p>
        </div>
      </div>
    </div>
  );
};

export default DebugGridPage;
