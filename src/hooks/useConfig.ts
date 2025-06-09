import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useConfig() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Use a fixed document ID for public config
    const configRef = doc(db, 'config', 'public');
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(configRef, 
      (doc) => {
        if (doc.exists()) {
          setConfig(doc.data());
        } else {
          setConfig(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching config:', error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Remove user dependency since we're using a fixed document

  return { config, loading };
} 