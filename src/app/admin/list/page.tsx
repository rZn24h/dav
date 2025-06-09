'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '@/utils/firebase';
import { useRouter } from 'next/navigation';

interface CarData {
  id: string;
  marca: string;
  model: string;
  an: number;
  pret: number;
  km: number;
  combustibil: string;
  images?: string[];
  coverImage?: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function ListCarsPage() {
  const { user } = useAuth();
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const carsRef = collection(db, 'cars');
      const querySnapshot = await getDocs(carsRef);
      const carsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CarData[];
      
      // Sort the data in memory
      carsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setCars(carsData);
    } catch (err) {
      setError('Eroare la încărcarea anunțurilor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm('Ești sigur că vrei să ștergi acest anunț? Această acțiune nu poate fi anulată.')) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      const car = cars.find(c => c.id === carId);
      if (!car) {
        throw new Error('Anunțul nu a fost găsit');
      }

      const imageUrls = [...(car.images || [])];
      if (car.coverImage && !imageUrls.includes(car.coverImage)) {
        imageUrls.push(car.coverImage);
      }

      for (const imageUrl of imageUrls) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (err) {
          console.error('Eroare la ștergerea imaginii:', err);
        }
      }

      await deleteDoc(doc(db, 'cars', carId));
      
      setCars(cars.filter(car => car.id !== carId));
      setSuccess('✅ Anunțul a fost șters cu succes!');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Eroare la ștergerea anunțului');
      console.error(err);
    }
  };

  const handleEdit = (carId: string) => {
    router.push(`/admin/edit/${carId}`);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ro-RO').format(num);
  };

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Listă anunțuri</h1>
          <button 
            onClick={() => router.push('/admin/add')}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Adaugă anunț nou
          </button>
        </div>

        {success && (
          <div className="alert alert-success d-flex align-items-center">
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
          </div>
        ) : cars.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Nu există anunțuri adăugate.
          </div>
        ) : (
          <div className="row g-4">
            {cars.map(car => (
              <div className="col-md-6 col-lg-4" key={car.id}>
                <div className="card h-100 shadow-sm">
                  {(car.coverImage || (car.images && car.images.length > 0)) && (
                    <img 
                      src={car.coverImage || car.images![0]} 
                      className="card-img-top" 
                      alt={`${car.marca} ${car.model}`}
                      style={{
                        objectFit: 'cover',
                        height: '200px',
                        borderRadius: '8px 8px 0 0'
                      }} 
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">
                      {car.marca} {car.model}
                      <span className="text-muted ms-2">{car.an}</span>
                    </h5>
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Preț:</span>
                        <span className="fw-bold text-primary">{formatNumber(car.pret)} €</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Kilometraj:</span>
                        <span>{formatNumber(car.km)} km</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Combustibil:</span>
                        <span>{car.combustibil}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button 
                        onClick={() => handleEdit(car.id)} 
                        className="btn btn-outline-primary flex-grow-1"
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Editează
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id)} 
                        className="btn btn-outline-danger flex-grow-1"
                      >
                        <i className="bi bi-trash me-2"></i>
                        Șterge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminAuthGuard>
  );
} 