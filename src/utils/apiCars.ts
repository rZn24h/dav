import { db, storage } from './firebase';
import { collection, addDoc, Timestamp, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function getConfig() {
  const configRef = doc(db, 'config', 'public');
  const configDoc = await getDoc(configRef);
  return configDoc.exists() ? configDoc.data() : null;
}

export async function addCar(data: any, images: File[], userId: string, coverImageIndex: number) {
  // 1. Upload images to Firebase Storage and get URLs
  const imageUrls: string[] = [];
  for (const image of images) {
    const storageRef = ref(storage, `cars/${userId}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    imageUrls.push(url);
  }

  // 2. Prepare car data
  const carData = {
    ...data,
    images: imageUrls,
    userId,
    createdAt: Timestamp.now(),
    coverImage: imageUrls[coverImageIndex] || imageUrls[0],
  };

  // 3. Save to Firestore
  const docRef = await addDoc(collection(db, 'cars'), carData);
  return docRef.id;
}

export async function updateCar(id: string, data: any, newImages?: File[], coverImage?: string) {
  // 1. Get current car data
  const carRef = doc(db, 'cars', id);
  const carDoc = await getDoc(carRef);
  if (!carDoc.exists()) {
    throw new Error('Anunțul nu există');
  }
  const currentData = carDoc.data();

  // 2. Handle existing images - keep only the ones that are still in data.images
  let imageUrls = [...(data.images || [])];
  
  // 3. Upload new images if any
  if (newImages && newImages.length > 0) {
    for (const image of newImages) {
      const storageRef = ref(storage, `cars/${currentData.userId}/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }
  }

  // 4. Delete removed images from Storage
  const removedImages = (currentData.images || []).filter((url: string) => !imageUrls.includes(url));
  for (const url of removedImages) {
    try {
      const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    } catch (e) {
      console.warn('Could not delete image:', e);
    }
  }

  // 5. Prepare update data
  const updateData = {
    ...data,
    images: imageUrls,
    coverImage: coverImage || data.coverImage || imageUrls[0],
    updatedAt: Timestamp.now(),
  };

  // 6. Update Firestore document
  await updateDoc(carRef, updateData);
  return id;
}

export async function deleteCar(id: string) {
  // Get car document
  const carDoc = await getDoc(doc(db, 'cars', id));
  if (!carDoc.exists()) return;
  const carData = carDoc.data();
  
  // Delete images from Storage
  if (carData.images && Array.isArray(carData.images)) {
    for (const url of carData.images) {
      try {
        const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
        const imageRef = ref(storage, path);
        await deleteObject(imageRef);
      } catch (e) {
        // ignore individual image errors
      }
    }
  }
  
  // Delete Firestore doc
  await deleteDoc(doc(db, 'cars', id));
} 