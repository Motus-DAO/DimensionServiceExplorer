import React from 'react';
import { useRouter } from 'next/router';
import { PsyGridDistortion } from './ui';
import { useGridDistortion } from '../contexts/GridDistortionContext';

interface PageGridDistortionProps {
  className?: string;
  isActive?: boolean;
  onError?: () => void;
}

const PageGridDistortion: React.FC<PageGridDistortionProps> = ({
  className = '',
  isActive = true,
  onError
}) => {
  const router = useRouter();
  const { getConfigForPage } = useGridDistortion();
  
  // Get current page name from router
  const currentPage = router.pathname.split('/')[1] || 'home';
  
  // Get configuration for current page
  const config = getConfigForPage(currentPage);

  return (
    <PsyGridDistortion
      imageSrc={config.imageSrc}
      variant={config.variant}
      intensity={config.intensity}
      className={className}
      isActive={isActive}
      onError={onError}
    />
  );
};

export default PageGridDistortion;
