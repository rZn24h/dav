'use client';

import { useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';

export default function PreloadBanner() {
  const { config } = useConfig();

  useEffect(() => {
    if (config?.bannerImg) {
      // Preload banner image
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.bannerImg;
      link.fetchPriority = 'high';
      document.head.appendChild(link);

      // Also preload as fetch for better caching
      fetch(config.bannerImg, { 
        method: 'HEAD',
        mode: 'cors'
      }).catch(() => {
        // Silently fail if preload fails
      });

      return () => {
        // Cleanup
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }
  }, [config?.bannerImg]);

  return null;
} 