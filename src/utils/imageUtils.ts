import imageCompression from 'browser-image-compression';

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  compressedFile?: File;
}

export async function validateAndCompressImage(file: File): Promise<ImageValidationResult> {
  try {
    // 1. Verifică dacă fișierul este o imagine
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Doar fișierele de tip imagine sunt permise (JPG, PNG, GIF, etc.)'
      };
    }

    // 2. Verifică dimensiunea fișierului (max 2MB)
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: 'Fișierul este prea mare. Dimensiunea maximă permisă este 2MB.'
      };
    }

    // 3. Verifică dimensiunile imaginii
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const maxDimension = 2048;
    if (img.width > maxDimension || img.height > maxDimension) {
      URL.revokeObjectURL(imageUrl);
      return {
        isValid: false,
        error: `Imaginea este prea mare. Dimensiunile maxime permise sunt ${maxDimension}x${maxDimension} pixeli.`
      };
    }

    URL.revokeObjectURL(imageUrl);

    // 4. Comprimă imaginea
    const options = {
      maxSizeMB: 1, // Dimensiune maximă 1MB
      maxWidthOrHeight: 1920, // Rezoluție maximă 1920x1920
      useWebWorker: true,
      fileType: file.type
    };

    const compressedFile = await imageCompression(file, options);

    return {
      isValid: true,
      compressedFile
    };

  } catch (error) {
    console.error('Eroare la validarea/compresia imaginii:', error);
    return {
      isValid: false,
      error: 'A apărut o eroare la procesarea imaginii. Vă rugăm să încercați din nou.'
    };
  }
}

export function validateImageFiles(files: FileList | File[]): ImageValidationResult {
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Doar fișierele de tip imagine sunt permise (JPG, PNG, GIF, etc.)'
      };
    }
  }
  
  return { isValid: true };
} 