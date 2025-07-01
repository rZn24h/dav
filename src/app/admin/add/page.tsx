"use client";

import { useState, useRef, useEffect } from 'react';
import { addCar } from '@/utils/apiCars';
import { useAuth } from '@/contexts/AuthContext';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { validateAndCompressImage, validateImageFiles } from '@/utils/imageUtils';
import { getBrands, addBrand, Brand } from '@/utils/brands';

const REGISTER_SECRET = process.env.NEXT_PUBLIC_REGISTER_SECRET || 'adminSecret2025';

interface FormErrors {
  title?: string;
  marca?: string;
  brandSelection?: string;
  model?: string;
  an?: string;
  pret?: string;
  km?: string;
  caroserie?: string;
  transmisie?: string;
  combustibil?: string;
  capacitate?: string;
  putere?: string;
  tractiune?: string;
  linkExtern?: string;
  descriere?: string;
  dotari?: string;
  contact?: string;
  locatie?: string;
  images?: string;
}

const caroserieOptions = [
  { value: 'Cabrio', label: 'Cabrio' },
  { value: 'Berlina', label: 'Berlina' },
  { value: 'Coupe', label: 'Coupe' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Break', label: 'Break' },
  { value: 'Off-road', label: 'Off-road' },
  { value: 'Minibus', label: 'Minibus' },
  { value: 'Monovolum', label: 'Monovolum' },
  { value: 'SUV', label: 'SUV' },
];

const initialFormState = {
  title: '',
  marca: '',
  model: '',
  an: '',
  pret: '',
  km: '',
  caroserie: '',
  transmisie: '',
  combustibil: '',
  capacitate: '',
  putere: '',
  tractiune: '',
  linkExtern: '',
  descriere: '',
  dotari: '',
  contact: '',
  locatie: '',
};

export default function AddCarPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  
  // Brand management state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [brandSelectionType, setBrandSelectionType] = useState<'existing' | 'new' | null>(null);

  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading brands:', error);
        setError('Nu s-au putut încărca mărcile');
      } finally {
        setBrandsLoading(false);
      }
    };
    
    loadBrands();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    const currentYear = new Date().getFullYear();

    // Brand selection validation
    if (brandSelectionType === null) {
      newErrors.brandSelection = 'Te rugăm să alegi o opțiune pentru marcă';
      isValid = false;
    } else if (brandSelectionType === 'existing' && !selectedBrand) {
      newErrors.brandSelection = 'Te rugăm să selectezi o marcă existentă';
      isValid = false;
    } else if (brandSelectionType === 'new' && !newBrand.trim()) {
      newErrors.brandSelection = 'Te rugăm să introduci numele mărcii noi';
      isValid = false;
    }

    // Required fields validation (excluding marca as it's handled above)
    const requiredFields = [
      { key: 'title', label: 'Titlu anunț' },
      { key: 'model', label: 'Model' },
      { key: 'an', label: 'An fabricație' },
      { key: 'pret', label: 'Preț' },
      { key: 'km', label: 'Kilometraj' },
      { key: 'caroserie', label: 'Caroserie' },
      { key: 'combustibil', label: 'Combustibil' },
      { key: 'transmisie', label: 'Transmisie' },
      { key: 'capacitate', label: 'Capacitate' },
      { key: 'descriere', label: 'Descriere' }
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!form[key as keyof typeof form]) {
        newErrors[key as keyof FormErrors] = `${label} este obligatoriu`;
        isValid = false;
      }
    });

    // Numeric validations
    if (form.pret && Number(form.pret) <= 0) {
      newErrors.pret = 'Prețul trebuie să fie mai mare decât 0';
      isValid = false;
    }

    if (form.km && Number(form.km) <= 0) {
      newErrors.km = 'Kilometrajul trebuie să fie mai mare decât 0';
      isValid = false;
    }

    if (form.capacitate && Number(form.capacitate) <= 0) {
      newErrors.capacitate = 'Capacitatea trebuie să fie mai mare decât 0';
      isValid = false;
    }

    if (form.putere && Number(form.putere) <= 0) {
      newErrors.putere = 'Puterea trebuie să fie mai mare decât 0';
      isValid = false;
    }

    // Year validation
    if (form.an) {
      const yearNum = Number(form.an);
      if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear) {
        newErrors.an = `Anul trebuie să fie între 1990 și ${currentYear}`;
        isValid = false;
      }
    }

    // Images validation
    if (images.length === 0) {
      newErrors.images = 'Trebuie să selectezi cel puțin o imagine';
      isValid = false;
    } else if (images.length > 14) {
      newErrors.images = 'Poți selecta maxim 14 imagini';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBrandSelectionChange = (type: 'existing' | 'new') => {
    setBrandSelectionType(type);
    setSelectedBrand('');
    setNewBrand('');
    setErrors(prev => ({ ...prev, brandSelection: undefined }));
  };

  const handleExistingBrandChange = (brandName: string) => {
    setSelectedBrand(brandName);
    setForm(prev => ({ ...prev, marca: brandName }));
    setErrors(prev => ({ ...prev, brandSelection: undefined }));
  };

  const handleNewBrandChange = (brandName: string) => {
    setNewBrand(brandName);
    setForm(prev => ({ ...prev, marca: brandName }));
    setErrors(prev => ({ ...prev, brandSelection: undefined }));
  };

  const handleAddNewBrand = async () => {
    if (!newBrand.trim()) {
      setErrors(prev => ({ ...prev, brandSelection: 'Te rugăm să introduci numele mărcii noi' }));
      return;
    }

    setLoading(true);
    try {
      await addBrand(newBrand.trim());
      // Refresh brands list
      const updatedBrands = await getBrands();
      setBrands(updatedBrands);
      setSuccess('✅ Marcă nouă adăugată cu succes!');
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (brandError) {
      if (brandError instanceof Error && brandError.message === 'Această marcă există deja') {
        setError('Această marcă există deja în listă');
      } else {
        setError(brandError instanceof Error ? brandError.message : 'Nu s-a putut adăuga marca');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshBrands = async () => {
    setBrandsLoading(true);
    try {
      const brandsData = await getBrands();
      setBrands(brandsData);
      setSuccess('✅ Lista de mărci a fost actualizată!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Nu s-au putut reîncărca mărcile');
    } finally {
      setBrandsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Verifică numărul de fișiere
      if (files.length > 14) {
        setErrors(prev => ({ ...prev, images: 'Poți selecta maxim 14 imagini' }));
        setImages([]);
        setCoverImageIndex(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Verifică tipul fișierelor
      const validationResult = validateImageFiles(files);
      if (!validationResult.isValid) {
        setErrors(prev => ({ ...prev, images: validationResult.error }));
        setImages([]);
        setCoverImageIndex(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Procesează fiecare imagine
      const processedImages: File[] = [];
      let hasError = false;

      for (const file of files) {
        const result = await validateAndCompressImage(file);
        if (!result.isValid) {
          setErrors(prev => ({ ...prev, images: result.error }));
          hasError = true;
          break;
        }
        if (result.compressedFile) {
          processedImages.push(result.compressedFile);
        }
      }

      if (hasError) {
        setImages([]);
        setCoverImageIndex(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setErrors(prev => ({ ...prev, images: undefined }));
        setImages(processedImages);
        setCoverImageIndex(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setErrors({});
    
    if (!validateForm()) {
      setError('Te rugăm să corectezi erorile din formular.');
      return;
    }
    
    if (!window.confirm('Ești sigur că vrei să postezi acest anunț?')) {
      return;
    }
    
    setLoading(true);
    try {
      if (!user) {
        throw new Error('Trebuie să fii autentificat pentru a adăuga o mașină');
      }

      // Handle new brand addition if needed
      if (brandSelectionType === 'new' && newBrand.trim()) {
        try {
          await addBrand(newBrand.trim());
          // Refresh brands list
          const updatedBrands = await getBrands();
          setBrands(updatedBrands);
          setSuccess('✅ Marcă nouă adăugată cu succes!');
        } catch (brandError) {
          if (brandError instanceof Error && brandError.message === 'Această marcă există deja') {
            // Brand already exists, continue with car addition
            setSuccess('ℹ️ Marcă existentă detectată, se continuă cu adăugarea anunțului...');
          } else {
            throw brandError;
          }
        }
      }

      // Add car with cover image index
      await addCar(form, images, user.uid, coverImageIndex);
      
      // Show success message
      setSuccess('✅ Anunțul a fost adăugat cu succes!');
      
      // Reset form
      setForm(initialFormState);
      setImages([]);
      setCoverImageIndex(0);
      setSelectedBrand('');
      setNewBrand('');
      setBrandSelectionType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare la adăugarea mașinii');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="mb-4">Adaugă mașină</h1>
            
            {/* Success message */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {success}
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <div className="card shadow">
              <div className="card-body p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="row g-3">
                    {/* Form fields */}
                    <div className="col-md-6">
                      <label className="form-label">Titlu anunț *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        name="title" 
                        value={form.title} 
                        onChange={handleChange} 
                        placeholder="Ex: BMW Seria 5 2.0d xDrive"
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Marcă *</label>
                      
                      {/* Brand selection type radio buttons */}
                      <div className="mb-3">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="brandSelectionType"
                            id="existingBrand"
                            checked={brandSelectionType === 'existing'}
                            onChange={() => handleBrandSelectionChange('existing')}
                          />
                          <label className="form-check-label fw-bold" htmlFor="existingBrand">
                            📋 Alege marcă existentă
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="brandSelectionType"
                            id="newBrand"
                            checked={brandSelectionType === 'new'}
                            onChange={() => handleBrandSelectionChange('new')}
                          />
                          <label className="form-check-label fw-bold" htmlFor="newBrand">
                            ➕ Adaugă marcă nouă
                          </label>
                        </div>
                      </div>

                      {/* Existing brand dropdown */}
                      {brandSelectionType === 'existing' && (
                        <div className="mb-3">
                          <select
                            className={`form-select ${errors.brandSelection ? 'is-invalid' : ''}`}
                            value={selectedBrand}
                            onChange={(e) => handleExistingBrandChange(e.target.value)}
                            disabled={brandsLoading}
                          >
                            <option value="">Alege o marcă...</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.name}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                          {brandsLoading && <div className="form-text">Se încarcă mărcile...</div>}
                          {!brandsLoading && (
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="form-text">
                                {brands.length > 0 
                                  ? `${brands.length} marcă${brands.length === 1 ? '' : 'i'} disponibilă${brands.length === 1 ? '' : 'e'}`
                                  : 'Nu există mărci în listă. Adaugă o marcă nouă!'
                                }
                              </div>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleRefreshBrands}
                                title="Reîncarcă lista de mărci"
                              >
                                🔄
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* New brand input */}
                      {brandSelectionType === 'new' && (
                        <div className="mb-3">
                          <div className="input-group">
                            <input
                              type="text"
                              className={`form-control ${errors.brandSelection ? 'is-invalid' : ''}`}
                              value={newBrand}
                              onChange={(e) => handleNewBrandChange(e.target.value)}
                              placeholder="Introduceți numele mărcii noi..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddNewBrand();
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={handleAddNewBrand}
                              disabled={loading || !newBrand.trim()}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                  Se adaugă...
                                </>
                              ) : (
                                '➕ Adaugă'
                              )}
                            </button>
                          </div>
                          <div className="form-text">
                            Apăsați Enter sau butonul pentru a adăuga marca în listă
                          </div>
                        </div>
                      )}

                      {/* Error message for brand selection */}
                      {errors.brandSelection && (
                        <div className="invalid-feedback d-block">{errors.brandSelection}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Model *</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                        name="model" 
                        value={form.model} 
                        onChange={handleChange} 
                        placeholder="Ex: Seria 5"
                      />
                      {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">An fabricație *</label>
                      <input 
                        type="number" 
                        className={`form-control ${errors.an ? 'is-invalid' : ''}`}
                        name="an" 
                        value={form.an} 
                        onChange={handleChange} 
                        placeholder={`Ex: ${new Date().getFullYear()}`}
                      />
                      {errors.an && <div className="invalid-feedback">{errors.an}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Preț (€) *</label>
                      <input 
                        type="number" 
                        className={`form-control ${errors.pret ? 'is-invalid' : ''}`}
                        name="pret" 
                        value={form.pret} 
                        onChange={handleChange} 
                        placeholder="Ex: 25000"
                      />
                      {errors.pret && <div className="invalid-feedback">{errors.pret}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Kilometraj *</label>
                      <input 
                        type="number" 
                        className={`form-control ${errors.km ? 'is-invalid' : ''}`}
                        name="km" 
                        value={form.km} 
                        onChange={handleChange} 
                        placeholder="Ex: 150000"
                      />
                      {errors.km && <div className="invalid-feedback">{errors.km}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Caroserie *</label>
                      <select 
                        className={`form-select ${errors.caroserie ? 'is-invalid' : ''}`}
                        name="caroserie" 
                        value={form.caroserie} 
                        onChange={handleChange}
                      >
                        <option value="">Alege caroseria...</option>
                        {caroserieOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.caroserie && <div className="invalid-feedback">{errors.caroserie}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Transmisie *</label>
                      <select 
                        className={`form-select ${errors.transmisie ? 'is-invalid' : ''}`}
                        name="transmisie" 
                        value={form.transmisie} 
                        onChange={handleChange}
                      >
                        <option value="">Alege transmisia...</option>
                        <option value="Manuală">Manuală</option>
                        <option value="Automată">Automată</option>
                      </select>
                      {errors.transmisie && <div className="invalid-feedback">{errors.transmisie}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Combustibil *</label>
                      <select 
                        className={`form-select ${errors.combustibil ? 'is-invalid' : ''}`}
                        name="combustibil" 
                        value={form.combustibil} 
                        onChange={handleChange}
                      >
                        <option value="">Alege combustibilul...</option>
                        <option value="Benzină">Benzină</option>
                        <option value="Motorină">Motorină</option>
                        <option value="GPL">GPL</option>
                        <option value="Electric">Electric</option>
                        <option value="Hibrid">Hibrid</option>
                      </select>
                      {errors.combustibil && <div className="invalid-feedback">{errors.combustibil}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Capacitate (cm³) *</label>
                      <input 
                        type="number" 
                        className={`form-control ${errors.capacitate ? 'is-invalid' : ''}`}
                        name="capacitate" 
                        value={form.capacitate} 
                        onChange={handleChange} 
                        placeholder="Ex: 1995"
                      />
                      {errors.capacitate && <div className="invalid-feedback">{errors.capacitate}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Putere (CP)</label>
                      <input 
                        type="number" 
                        className={`form-control ${errors.putere ? 'is-invalid' : ''}`}
                        name="putere" 
                        value={form.putere} 
                        onChange={handleChange} 
                        placeholder="Ex: 190"
                      />
                      {errors.putere && <div className="invalid-feedback">{errors.putere}</div>}
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Tracțiune *</label>
                      <select 
                        className={`form-select ${errors.tractiune ? 'is-invalid' : ''}`}
                        name="tractiune" 
                        value={form.tractiune} 
                        onChange={handleChange}
                      >
                        <option value="">Alege tracțiunea...</option>
                        <option value="4x4">4x4</option>
                        <option value="Față">Față</option>
                        <option value="Spate">Spate</option>
                      </select>
                      {errors.tractiune && <div className="invalid-feedback">{errors.tractiune}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Descriere *</label>
                      <textarea 
                        className={`form-control ${errors.descriere ? 'is-invalid' : ''}`}
                        name="descriere" 
                        value={form.descriere} 
                        onChange={handleChange} 
                        rows={4} 
                        placeholder="Descriere detaliată a mașinii..."
                      />
                      {errors.descriere && <div className="invalid-feedback">{errors.descriere}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Dotări</label>
                      <textarea 
                        className={`form-control ${errors.dotari ? 'is-invalid' : ''}`}
                        name="dotari" 
                        value={form.dotari} 
                        onChange={handleChange} 
                        rows={3} 
                        placeholder="Lista de dotări, separate prin virgulă..."
                      />
                      {errors.dotari && <div className="invalid-feedback">{errors.dotari}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Contact</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                        name="contact" 
                        value={form.contact} 
                        onChange={handleChange} 
                        placeholder="Ex: 0722 000 000"
                      />
                      {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Locație</label>
                      <input 
                        type="text" 
                        className={`form-control ${errors.locatie ? 'is-invalid' : ''}`}
                        name="locatie" 
                        value={form.locatie} 
                        onChange={handleChange} 
                        placeholder="Ex: Suceava"
                      />
                      {errors.locatie && <div className="invalid-feedback">{errors.locatie}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Link extern (OLX/Autovit)</label>
                      <input 
                        type="url" 
                        className={`form-control ${errors.linkExtern ? 'is-invalid' : ''}`}
                        name="linkExtern" 
                        value={form.linkExtern} 
                        onChange={handleChange} 
                        placeholder="Ex: https://www.olx.ro/d/oferta/..."
                      />
                      {errors.linkExtern && <div className="invalid-feedback">{errors.linkExtern}</div>}
                    </div>

                    {/* Image upload section */}
                    <div className="col-12">
                      <label className="form-label">Imagini (1-14 imagini) *</label>
                      <input
                        type="file"
                        className={`form-control ${errors.images ? 'is-invalid' : ''}`}
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      {errors.images && <div className="invalid-feedback">{errors.images}</div>}
                      
                      {/* Image previews and cover image selection */}
                      {images.length > 0 && (
                        <div className="d-flex flex-wrap gap-3 mt-3">
                          {images.map((img, idx) => {
                            const url = URL.createObjectURL(img);
                            return (
                              <div key={idx} className="position-relative" style={{ width: 100 }}>
                                <img 
                                  src={url} 
                                  alt={`thumb-${idx}`} 
                                  style={{ 
                                    width: 100, 
                                    height: 70, 
                                    objectFit: 'cover', 
                                    borderRadius: 6, 
                                    border: idx === coverImageIndex ? '2px solid #0d6efd' : '2px solid #eee',
                                    cursor: 'pointer',
                                    opacity: idx === coverImageIndex ? 1 : 0.7
                                  }} 
                                  onClick={() => setCoverImageIndex(idx)} 
                                />
                                <div style={{ position: 'absolute', top: 4, right: 4 }}>
                                  <input 
                                    type="radio" 
                                    name="coverImage" 
                                    checked={coverImageIndex === idx} 
                                    onChange={() => setCoverImageIndex(idx)} 
                                  />
                                </div>
                                <div className="text-center mt-1">
                                  <button 
                                    type="button" 
                                    className={`btn btn-sm ${coverImageIndex === idx ? 'btn-primary' : 'btn-outline-secondary'}`}
                                    onClick={() => setCoverImageIndex(idx)}
                                  >
                                    {coverImageIndex === idx ? 'Imagine principală' : 'Setează ca principală'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Submit button */}
                    <div className="col-12 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-100" 
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Se salvează...
                          </>
                        ) : (
                          'Adaugă anunț'
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