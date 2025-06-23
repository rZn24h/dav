'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface Config {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  bannerImageUrl: string;
  logoUrl?: string;
  slogan?: string;
  locatie?: string;
  mapCoordinates?: {
    latitude: string;
    longitude: string;
  };
  program?: {
    luniVineri?: string;
    sambata?: string;
    duminica?: string;
  };
  whatsapp?: string;
  facebook?: string;
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'public');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as Config);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
} 