'use client';

import { useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';

export default function PreloadBanner() {
  const { config } = useConfig();

  useEffect(() => {
    if (config?.bannerImageUrl) {
      // Preload banner image
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.bannerImageUrl;
      link.fetchPriority = 'high';
      document.head.appendChild(link);

      // Also preload as fetch for better caching
      fetch(config.bannerImageUrl, { 
        method: 'HEAD',
        mode: 'cors'
      }).catch(err => {
        // We can ignore errors here, as this is just an optimization
        console.warn('Failed to preload banner image:', err);
      });

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [config?.bannerImageUrl]);

  return null;
} 