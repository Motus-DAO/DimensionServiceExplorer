import React from 'react';

interface BackgroundLayerProps {
  layer: 'deep' | 'mid' | 'overlay';
  children: React.ReactNode;
  className?: string;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  layer,
  children,
  className = ''
}) => {
  const zIndexMap = {
    deep: -20,
    mid: -10,
    overlay: -5
  };
  
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ 
        zIndex: zIndexMap[layer]
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundLayer;
