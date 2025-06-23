'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HydrationSuppressorProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const HydrationSuppressor = ({ children, fallback = null }: HydrationSuppressorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HydrationSuppressor; 