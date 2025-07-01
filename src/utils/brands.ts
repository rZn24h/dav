import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export interface Brand {
  id: string;
  name: string;
  createdAt: Date;
}

// Fetch all brands from Firestore
export async function getBrands(): Promise<Brand[]> {
  try {
    const brandsRef = collection(db, 'brands');
    
    // First try with ordering, if it fails, get without ordering
    try {
      const q = query(brandsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const brands = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      return brands;
    } catch (orderError) {
      console.warn('Ordering failed, fetching without order:', orderError);
      // Fallback: get all brands without ordering
      const querySnapshot = await getDocs(brandsRef);
      
      const brands = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      // Sort in memory
      const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name));
      return sortedBrands;
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw new Error('Nu s-au putut încărca mărcile');
  }
}

// Add a new brand to Firestore
export async function addBrand(brandName: string): Promise<string> {
  try {
    // Check if brand already exists (case-insensitive)
    const brandsRef = collection(db, 'brands');
    const q = query(brandsRef, where('name', '==', brandName.trim()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Această marcă există deja');
    }
    
    // Add new brand
    const docRef = await addDoc(brandsRef, {
      name: brandName.trim(),
      createdAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding brand:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Nu s-a putut adăuga marca');
  }
}

// Check if a brand exists (case-insensitive)
export async function checkBrandExists(brandName: string): Promise<boolean> {
  try {
    const brandsRef = collection(db, 'brands');
    const q = query(brandsRef, where('name', '==', brandName.trim()));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking brand existence:', error);
    return false;
  }
}

// Delete a brand from Firestore
export async function deleteBrand(brandId: string): Promise<void> {
  try {
    const brandRef = doc(db, 'brands', brandId);
    await deleteDoc(brandRef);
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw new Error('Nu s-a putut șterge marca');
  }
}

// Update a brand name
export async function updateBrand(brandId: string, newName: string): Promise<void> {
  try {
    // Check if new name already exists
    const exists = await checkBrandExists(newName);
    if (exists) {
      throw new Error('Această marcă există deja');
    }
    
    const brandRef = doc(db, 'brands', brandId);
    await updateDoc(brandRef, {
      name: newName.trim(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Nu s-a putut actualiza marca');
  }
}

// Get brand usage statistics (how many cars use this brand)
export async function getBrandUsage(brandName: string): Promise<number> {
  try {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('marca', '==', brandName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('Error getting brand usage:', error);
    return 0;
  }
} 