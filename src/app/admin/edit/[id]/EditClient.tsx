"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { updateCar } from '@/utils/apiCars';
import { validateAndCompressImage, validateImageFiles } from '@/utils/imageUtils';

interface CarData {
  id: string;
  title: string;
  marca: string;
  model: string;
  an: number;
  pret: number;
  km: number;
  caroserie: string;
  transmisie: string;
  combustibil: string;
  capacitate: string;
  putere?: string;
  descriere: string;
  dotari?: string;
  contact?: string;
  locatie?: string;
  images: string[];
  coverImage?: string;
}

export default function EditClient({ carId }: { carId: string }) {
  const router = useRouter();
  const [car, setCar] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageErrors, setImageErrors] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carDoc = await getDoc(doc(db, 'cars', carId));
        if (carDoc.exists()) {
          const data = carDoc.data();
          setCar({
            id: carDoc.id,
            title: data.title || '',
            marca: data.marca || '',
            model: data.model || '',
            an: data.an || 0,
            pret: data.pret || 0,
            km: data.km || 0,
            caroserie: data.caroserie || '',
            transmisie: data.transmisie || '',
            combustibil: data.combustibil || '',
            capacitate: data.capacitate || '',
            putere: data.putere,
            descriere: data.descriere || '',
            dotari: data.dotari,
            contact: data.contact,
            locatie: data.locatie,
            images: data.images || [],
            coverImage: data.coverImage || data.images?.[0],
          });
        } else {
          setError('Anunțul nu a fost găsit');
        }
      } catch (err) {
        setError('Eroare la încărcarea anunțului');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!car) return;
    setCar({ ...car, [name]: value });
  };

  const handleCoverImageChange = (imageUrl: string) => {
    if (!car) return;
    setCar({ ...car, coverImage: imageUrl });
  };

  const handleDeleteImage = (imageUrl: string) => {
    if (!car) return;
    
    // Verifică dacă imaginea de șters este imaginea principală
    if (car.coverImage === imageUrl) {
      // Setează prima imagine rămasă ca principală
      const remainingImages = car.images.filter(img => img !== imageUrl);
      setCar({
        ...car,
        images: remainingImages,
        coverImage: remainingImages[0] || ''
      });
    } else {
      setCar({
        ...car,
        images: car.images.filter(img => img !== imageUrl)
      });
    }
  };

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !car) return;
    
    const files = Array.from(e.target.files);
    const totalImages = car.images.length + newImages.length + files.length;
    
    // Verifică limita de 14 imagini
    if (totalImages > 14) {
      setImageErrors('Poți avea maxim 14 imagini în total');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Verifică tipul fișierelor
    const validationResult = validateImageFiles(files);
    if (!validationResult.isValid) {
      setImageErrors(validationResult.error || 'Eroare la validarea imaginilor');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Procesează fiecare imagine
    const processedImages: File[] = [];
    let hasError = false;

    for (const file of files) {
      const result = await validateAndCompressImage(file);
      if (!result.isValid) {
        setImageErrors(result.error || 'Eroare la procesarea imaginii');
        hasError = true;
        break;
      }
      if (result.compressedFile) {
        processedImages.push(result.compressedFile);
      }
    }

    if (hasError) {
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setImageErrors('');
      setNewImages(prev => [...prev, ...processedImages]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateCar(car.id, {
        ...car,
        pret: Number(car.pret),
        km: Number(car.km),
        an: Number(car.an),
        capacitate: Number(car.capacitate),
        putere: car.putere ? Number(car.putere) : null
      }, newImages.length > 0 ? newImages : undefined, car.coverImage);

      setSuccess('✅ Anunțul a fost actualizat cu succes!');
      setTimeout(() => router.push('/admin/list'), 2000);
    } catch (err) {
      setError('A apărut o eroare la salvarea anunțului');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <AdminNavbar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
        </div>
      </AdminAuthGuard>
    );
  }

  if (!car) {
    return (
      <AdminAuthGuard>
        <AdminNavbar />
        <div className="container py-5">
          <div className="alert alert-danger">{error || 'Anunțul nu a fost găsit'}</div>
        </div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1>Editare anunț</h1>
              <button
                onClick={() => router.back()}
                className="btn btn-outline-secondary"
              >
                ← Înapoi
              </button>
            </div>

            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <div className="card shadow">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Image gallery and cover image selection */}
                  <div className="mb-4">
                    <label className="form-label">Imagini ({car.images.length + newImages.length}/14)</label>
                    
                    {/* Existing images */}
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      {car.images.map((imageUrl, idx) => (
                        <div key={idx} className="position-relative" style={{ width: 150 }}>
                          <img
                            src={imageUrl}
                            alt={`Imagine ${idx + 1}`}
                            className="car-thumbnail mb-2"
                            style={{
                              width: '100%',
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 6,
                              border: imageUrl === car.coverImage ? '3px solid #0d6efd' : '1px solid #dee2e6',
                            }}
                          />
                          <div className="d-grid gap-1">
                            <button
                              type="button"
                              className={`btn btn-sm ${imageUrl === car.coverImage ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => handleCoverImageChange(imageUrl)}
                            >
                              {imageUrl === car.coverImage ? '✓ Principală' : 'Setează principală'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteImage(imageUrl)}
                            >
                              🗑️ Șterge
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New images preview */}
                    {newImages.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-muted">Imagini noi de adăugat:</h6>
                        <div className="d-flex flex-wrap gap-3">
                          {newImages.map((file, idx) => (
                            <div key={`new-${idx}`} className="position-relative" style={{ width: 150 }}>
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Imagine nouă ${idx + 1}`}
                                className="car-thumbnail mb-2"
                                style={{
                                  width: '100%',
                                  height: 100,
                                  objectFit: 'cover',
                                  borderRadius: 6,
                                  border: '2px dashed #28a745',
                                }}
                              />
                              <div className="d-grid">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleRemoveNewImage(idx)}
                                >
                                  🗑️ Elimină
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add images section */}
                    <div className="mb-3">
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handleAddImages}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={car.images.length + newImages.length >= 14}
                      >
                        📷 Adaugă imagini ({car.images.length + newImages.length}/14)
                      </button>
                      {imageErrors && (
                        <div className="text-danger mt-2 small">{imageErrors}</div>
                      )}
                      <div className="form-text">
                        Poți adăuga până la 14 imagini în total. Dimensiunea maximă: 8MB per imagine.
                      </div>
                    </div>
                  </div>

                  {/* Basic details */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Titlu anunț</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={car.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Marcă</label>
                      <input
                        type="text"
                        className="form-control"
                        name="marca"
                        value={car.marca}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Model</label>
                      <input
                        type="text"
                        className="form-control"
                        name="model"
                        value={car.model}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">An fabricație</label>
                      <input
                        type="number"
                        className="form-control"
                        name="an"
                        value={car.an}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Preț (€)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="pret"
                        value={car.pret}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Kilometraj</label>
                      <input
                        type="number"
                        className="form-control"
                        name="km"
                        value={car.km}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Caroserie</label>
                      <select
                        className="form-select"
                        name="caroserie"
                        value={car.caroserie}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Alege caroseria...</option>
                        <option value="Cabrio">Cabrio</option>
                        <option value="Berlina">Berlina</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Break">Break</option>
                        <option value="Off-road">Off-road</option>
                        <option value="Minibus">Minibus</option>
                        <option value="Monovolum">Monovolum</option>
                        <option value="SUV">SUV</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Transmisie</label>
                      <select
                        className="form-select"
                        name="transmisie"
                        value={car.transmisie}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Alege transmisia...</option>
                        <option value="Manuală">Manuală</option>
                        <option value="Automată">Automată</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Combustibil</label>
                      <select
                        className="form-select"
                        name="combustibil"
                        value={car.combustibil}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Alege combustibilul...</option>
                        <option value="Benzină">Benzină</option>
                        <option value="Motorină">Motorină</option>
                        <option value="GPL">GPL</option>
                        <option value="Electric">Electric</option>
                        <option value="Hibrid">Hibrid</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Capacitate (cm³)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="capacitate"
                        value={car.capacitate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Putere (CP)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="putere"
                        value={car.putere}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Descriere</label>
                      <textarea
                        className="form-control"
                        name="descriere"
                        value={car.descriere}
                        onChange={handleChange}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Dotări</label>
                      <textarea
                        className="form-control"
                        name="dotari"
                        value={car.dotari}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Lista de dotări, separate prin virgulă..."
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Contact</label>
                      <input
                        type="text"
                        className="form-control"
                        name="contact"
                        value={car.contact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Locație</label>
                      <input
                        type="text"
                        className="form-control"
                        name="locatie"
                        value={car.locatie}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Se salvează...
                          </>
                        ) : (
                          'Salvează modificările'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
} 