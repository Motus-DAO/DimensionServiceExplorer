import React, { createContext, useContext } from 'react';

interface GridDistortionConfig {
  imageSrc: string;
  variant: 'hero' | 'background' | 'card' | 'overlay';
  intensity: 'subtle' | 'medium' | 'strong';
}

interface GridDistortionContextType {
  getConfigForPage: (page: string) => GridDistortionConfig;
}

const GridDistortionContext = createContext<GridDistortionContextType | null>(null);

export const GridDistortionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getConfigForPage = (page: string): GridDistortionConfig => {
    const configs: Record<string, GridDistortionConfig> = {
      // Home and Chat - same image
      home: {
        imageSrc: '/assets/grid-distortion/hero-chat.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      chat: {
        imageSrc: '/assets/grid-distortion/hero-chat.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      // Video and Marketplace - same image
      video: {
        imageSrc: '/assets/grid-distortion/video-marketplace.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      videochat: {
        imageSrc: '/assets/grid-distortion/video-marketplace.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      marketplace: {
        imageSrc: '/assets/grid-distortion/video-marketplace.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      // Dashboard and Profile - same image
      dashboard: {
        imageSrc: '/assets/grid-distortion/dashboard-profile.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      profile: {
        imageSrc: '/assets/grid-distortion/dashboard-profile.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      },
      // Default fallback
      default: {
        imageSrc: '/assets/grid-distortion/hero-chat.png',
        variant: 'background' as const,
        intensity: 'medium' as const
      }
    };

    return configs[page] || configs.default;
  };

  return (
    <GridDistortionContext.Provider value={{ getConfigForPage }}>
      {children}
    </GridDistortionContext.Provider>
  );
};

export const useGridDistortion = () => {
  const context = useContext(GridDistortionContext);
  if (!context) {
    throw new Error('useGridDistortion must be used within a GridDistortionProvider');
  }
  return context;
};
