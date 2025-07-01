import { db } from './firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { addBrand, checkBrandExists } from './brands';

export interface MigrationResult {
  totalCars: number;
  uniqueBrands: string[];
  brandsAdded: number;
  brandsSkipped: number;
  errors: string[];
}

/**
 * Migrează toate mărcile existente din anunțurile de mașini în colecția brands
 */
export async function migrateExistingBrands(): Promise<MigrationResult> {
  const result: MigrationResult = {
    totalCars: 0,
    uniqueBrands: [],
    brandsAdded: 0,
    brandsSkipped: 0,
    errors: []
  };

  try {
    console.log('Începe migrarea mărcilor existente...');
    
    // 1. Obține toate anunțurile de mașini
    const carsRef = collection(db, 'cars');
    const carsSnapshot = await getDocs(carsRef);
    
    result.totalCars = carsSnapshot.docs.length;
    console.log(`Găsite ${result.totalCars} anunțuri de mașini`);
    
    // 2. Extrage toate mărcile unice
    const brandsSet = new Set<string>();
    
    carsSnapshot.docs.forEach(doc => {
      const carData = doc.data();
      const marca = carData.marca?.trim();
      
      if (marca && marca.length > 0) {
        brandsSet.add(marca);
      }
    });
    
    result.uniqueBrands = Array.from(brandsSet).sort();
    console.log(`Găsite ${result.uniqueBrands.length} mărci unice:`, result.uniqueBrands);
    
    // 3. Adaugă fiecare marcă în colecția brands (dacă nu există deja)
    for (const brandName of result.uniqueBrands) {
      try {
        const exists = await checkBrandExists(brandName);
        
        if (exists) {
          console.log(`Marcă "${brandName}" există deja, se sare peste`);
          result.brandsSkipped++;
        } else {
          await addBrand(brandName);
          console.log(`Marcă "${brandName}" adăugată cu succes`);
          result.brandsAdded++;
        }
      } catch (error) {
        const errorMsg = `Eroare la adăugarea mărcii "${brandName}": ${error instanceof Error ? error.message : 'Eroare necunoscută'}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }
    
    console.log('Migrarea completă!', result);
    return result;
    
  } catch (error) {
    const errorMsg = `Eroare generală la migrare: ${error instanceof Error ? error.message : 'Eroare necunoscută'}`;
    console.error(errorMsg);
    result.errors.push(errorMsg);
    return result;
  }
}

/**
 * Verifică dacă există mărci în colecția brands
 */
export async function checkBrandsCollection(): Promise<{ exists: boolean; count: number }> {
  try {
    const brandsRef = collection(db, 'brands');
    const brandsSnapshot = await getDocs(brandsRef);
    return {
      exists: !brandsSnapshot.empty,
      count: brandsSnapshot.docs.length
    };
  } catch (error) {
    console.error('Eroare la verificarea colecției brands:', error);
    return { exists: false, count: 0 };
  }
}

/**
 * Obține statistici despre mărcile existente în anunțuri
 */
export async function getBrandsStatistics(): Promise<{
  totalCars: number;
  uniqueBrands: string[];
  brandCounts: Record<string, number>;
}> {
  try {
    const carsRef = collection(db, 'cars');
    const carsSnapshot = await getDocs(carsRef);
    
    const brandCounts: Record<string, number> = {};
    const brandsSet = new Set<string>();
    
    carsSnapshot.docs.forEach(doc => {
      const carData = doc.data();
      const marca = carData.marca?.trim();
      
      if (marca && marca.length > 0) {
        brandsSet.add(marca);
        brandCounts[marca] = (brandCounts[marca] || 0) + 1;
      }
    });
    
    return {
      totalCars: carsSnapshot.docs.length,
      uniqueBrands: Array.from(brandsSet).sort(),
      brandCounts
    };
  } catch (error) {
    console.error('Eroare la obținerea statisticilor:', error);
    throw error;
  }
} 