'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import CarCard from '@/components/CarCard';

type SortOption = 'price-asc' | 'price-desc';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [marca, setMarca] = useState('');
  const [searchMarca, setSearchMarca] = useState('');
  const [filteredMarci, setFilteredMarci] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pretMin, setPretMin] = useState('');
  const [pretMax, setPretMax] = useState('');
  const [sortBy, setSortBy] = useState<SortOption | null>(null);
  const [loading, setLoading] = useState(true);
  const { config, loading: loadingConfig } = useConfig();

  // Extract unique brands from cars
  const allMarci = useMemo(() => {
    return Array.from(new Set(cars.map(car => car.marca).filter(Boolean))).sort();
  }, [cars]);

  // Filter brands based on search input
  useEffect(() => {
    const searchTerm = searchMarca.trim().toLowerCase();
    if (searchTerm) {
      const filtered = allMarci.filter(marca => 
        marca.toLowerCase().includes(searchTerm)
      );
      setFilteredMarci(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredMarci(allMarci);
      setShowSuggestions(false);
    }
  }, [searchMarca, allMarci]);

  // Handle brand selection
  const handleBrandSelect = (selectedMarca: string) => {
    setMarca(selectedMarca);
    setSearchMarca(selectedMarca);
    setShowSuggestions(false);
  };

  // Handle input change
  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchMarca(value);
    setShowSuggestions(true);
    if (!value.trim()) {
      setMarca('');
      setFilteredMarci(allMarci);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-bar-item')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCars(data);
      setFiltered(data);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const handleSort = (option: SortOption) => {
    setSortBy(current => current === option ? null : option);
  };

  useEffect(() => {
    let result = cars;
    
    // Apply filters
    if (marca) {
      result = result.filter(car => 
        car.marca?.toLowerCase().includes(marca.toLowerCase())
      );
    }
    if (pretMin) result = result.filter(car => Number(car.pret) >= Number(pretMin));
    if (pretMax) result = result.filter(car => Number(car.pret) <= Number(pretMax));
    
    // Apply sorting if selected
    if (sortBy) {
      result = [...result].sort((a, b) => {
        const priceA = Number(a.pret);
        const priceB = Number(b.pret);
        return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
    }
    
    setFiltered(result);
  }, [marca, pretMin, pretMax, cars, sortBy]);

  const handleReset = () => {
    setMarca('');
    setSearchMarca('');
    setPretMin('');
    setPretMax('');
    setSortBy(null);
    setShowSuggestions(false);
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section with Banner */}
      <section 
        className="hero-section position-relative d-flex align-items-center justify-content-center text-white"
        style={{
          minHeight: '40vh',
          backgroundColor: '#f8f9fa',
          marginTop: '-56px'
        }}
      >
        {/* Banner Image */}
        {config?.bannerImg ? (
          <img 
            src={config.bannerImg} 
            alt="Banner" 
            className="position-absolute w-100 h-100"
            style={{
              objectFit: 'cover',
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
        ) : (
          <div 
            className="position-absolute w-100 h-100"
            style={{
              backgroundColor: '#002f34',
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
        )}
        
        {/* Overlay for better text readability */}
        <div 
          className="position-absolute w-100 h-100" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
        
        {/* Centered Content */}
        <div className="container position-relative text-center px-4" style={{ zIndex: 2 }}>
          {loadingConfig ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Se încarcă configurarea...</span>
            </div>
          ) : (
            <>
              <h1 className="display-4 fw-bold mb-4">{config?.nume || 'Anunțuri Auto'}</h1>
              <p className="lead mb-0">{config?.slogan || 'Descoperă mașina perfectă pentru tine!'}</p>
            </>
          )}
        </div>
      </section>

      {/* Search Section */}
      <div className="container">
        <div className="search-container">
          <div className="row g-3">
            {/* Brand Search */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="position-relative search-bar-item">
                <label className="form-label">Marcă</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Caută marcă..."
                  value={searchMarca}
                  onChange={handleBrandInputChange}
                  onFocus={() => {
                    setShowSuggestions(true);
                    if (!searchMarca.trim()) {
                      setFilteredMarci(allMarci);
                    }
                  }}
                />
                {showSuggestions && (
                  <div className="brand-suggestions">
                    <ul>
                      {filteredMarci.map((marca, index) => (
                        <li
                          key={index}
                          onClick={() => handleBrandSelect(marca)}
                          className="suggestion-item"
                        >
                          {marca}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="search-bar-item">
                <label className="form-label">Preț minim</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Preț minim"
                  value={pretMin}
                  onChange={(e) => setPretMin(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="search-bar-item">
                <label className="form-label">Preț maxim</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Preț maxim"
                  value={pretMax}
                  onChange={(e) => setPretMax(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Controls */}
            <div className="col-12 col-lg-3">
              <div className="search-bar-item">
                <label className="form-label">Sortare după preț</label>
                <div className="d-flex gap-2">
                  <button
                    className={`btn flex-grow-1 ${
                      sortBy === 'price-asc' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => handleSort('price-asc')}
                  >
                    Crescător
                  </button>
                  <button
                    className={`btn flex-grow-1 ${
                      sortBy === 'price-desc' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => handleSort('price-desc')}
                  >
                    Descrescător
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            {(marca || pretMin || pretMax || sortBy) && (
              <div className="col-12">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={handleReset}
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Listings Section */}
        <div className="listings-container">
          <div className="listings-header">
            <h2>
              {filtered.length} {filtered.length === 1 ? 'anunț' : 'anunțuri'} disponibile
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Se încarcă anunțurile...</span>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="listings-grid">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h3 className="text-muted">Nu am găsit anunțuri care să corespundă criteriilor tale.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
