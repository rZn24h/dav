"use client";

import { useState, useEffect } from 'react';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { migrateExistingBrands, checkBrandsCollection, getBrandsStatistics } from '@/utils/migration';
import { MigrationResult } from '@/utils/migration';
import { getBrands, deleteBrand, updateBrand, getBrandUsage, Brand } from '@/utils/brands';

export default function MigrationPage() {
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [brandsStats, setBrandsStats] = useState<{
    exists: boolean;
    count: number;
  } | null>(null);
  const [carsStats, setCarsStats] = useState<{
    totalCars: number;
    uniqueBrands: string[];
    brandCounts: Record<string, number>;
  } | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  
  // Brand management state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingBrand, setDeletingBrand] = useState<string | null>(null);
  const [brandUsage, setBrandUsage] = useState<Record<string, number>>({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [brandsInfo, carsInfo, brandsData] = await Promise.all([
        checkBrandsCollection(),
        getBrandsStatistics(),
        getBrands()
      ]);
      
      setBrandsStats(brandsInfo);
      setCarsStats(carsInfo);
      setBrands(brandsData);
      
      // Load brand usage statistics
      const usageData: Record<string, number> = {};
      for (const brand of brandsData) {
        usageData[brand.name] = await getBrandUsage(brand.name);
      }
      setBrandUsage(usageData);
    } catch (error) {
      setError('Nu s-au putut încărca statisticile');
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    if (!window.confirm('Ești sigur că vrei să migrezi toate mărcile existente? Această operațiune va adăuga toate mărcile din anunțuri în colecția globală de mărci.')) {
      return;
    }

    setMigrating(true);
    setError('');
    setSuccess('');

    try {
      const result = await migrateExistingBrands();
      setMigrationResult(result);
      
      if (result.errors.length === 0) {
        setSuccess(`✅ Migrarea completă! ${result.brandsAdded} mărci adăugate, ${result.brandsSkipped} sărite.`);
      } else {
        setSuccess(`⚠️ Migrarea parțială completă! ${result.brandsAdded} mărci adăugate, ${result.brandsSkipped} sărite, ${result.errors.length} erori.`);
      }
      
      // Reîncarcă statisticile
      await loadStats();
    } catch (error) {
      setError('Eroare la migrare: ' + (error instanceof Error ? error.message : 'Eroare necunoscută'));
    } finally {
      setMigrating(false);
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand.id);
    setEditingName(brand.name);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand || !editingName.trim()) return;
    
    try {
      await updateBrand(editingBrand, editingName.trim());
      setSuccess('✅ Marcă actualizată cu succes!');
      await loadStats(); // Reload data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Nu s-a putut actualiza marca');
    } finally {
      setEditingBrand(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingBrand(null);
    setEditingName('');
  };

  const handleDeleteBrand = async (brand: Brand) => {
    const usage = brandUsage[brand.name] || 0;
    
    if (usage > 0) {
      setError(`Nu poți șterge marca "${brand.name}" deoarece este folosită în ${usage} anunț${usage === 1 ? '' : 'uri'}.`);
      return;
    }
    
    if (!window.confirm(`Ești sigur că vrei să ștergi marca "${brand.name}"?`)) {
      return;
    }
    
    setDeletingBrand(brand.id);
    try {
      await deleteBrand(brand.id);
      setSuccess('✅ Marcă ștearsă cu succes!');
      await loadStats(); // Reload data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Nu s-a putut șterge marca');
    } finally {
      setDeletingBrand(null);
    }
  };

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="mb-4">Migrare Mărci</h1>
            
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

            <div className="row g-4">
              {/* Statistici Brands Collection */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Colecția Brands</h5>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={loadStats}
                      disabled={loading}
                    >
                      🔄 Actualizează
                    </button>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                        <span className="ms-2">Se încarcă...</span>
                      </div>
                    ) : brandsStats ? (
                      <div>
                        <p><strong>Status:</strong> {brandsStats.exists ? '✅ Există' : '❌ Nu există'}</p>
                        <p><strong>Număr mărci:</strong> {brandsStats.count}</p>
                      </div>
                    ) : (
                      <p className="text-muted">Nu s-au putut încărca datele</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistici Anunțuri */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Anunțuri Existente</h5>
                  </div>
                  <div className="card-body">
                    {loading ? (
                      <div className="text-center">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                        <span className="ms-2">Se încarcă...</span>
                      </div>
                    ) : carsStats ? (
                      <div>
                        <p><strong>Total anunțuri:</strong> {carsStats.totalCars}</p>
                        <p><strong>Mărci unice:</strong> {carsStats.uniqueBrands.length}</p>
                        {carsStats.uniqueBrands.length > 0 && (
                          <details>
                            <summary>Vezi mărcile</summary>
                            <div className="mt-2">
                              {carsStats.uniqueBrands.map((brand, index) => (
                                <span key={brand} className="badge bg-secondary me-1 mb-1">
                                  {brand} ({carsStats.brandCounts[brand]})
                                </span>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted">Nu s-au putut încărca datele</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buton Migrare */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Migrare Mărci</h5>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">
                      Această operațiune va extrage toate mărcile unice din anunțurile existente și le va adăuga în colecția globală de mărci.
                      Mărcile duplicate vor fi sărite.
                    </p>
                    
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      onClick={handleMigration}
                      disabled={migrating || loading}
                    >
                      {migrating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Se migrează...
                        </>
                      ) : (
                        '🚀 Începe Migrarea'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Rezultat Migrare */}
              {migrationResult && (
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Rezultat Migrare</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <div className="text-center">
                            <h4 className="text-primary">{migrationResult.totalCars}</h4>
                            <small className="text-muted">Anunțuri procesate</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center">
                            <h4 className="text-success">{migrationResult.brandsAdded}</h4>
                            <small className="text-muted">Mărci adăugate</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center">
                            <h4 className="text-warning">{migrationResult.brandsSkipped}</h4>
                            <small className="text-muted">Mărci sărite</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center">
                            <h4 className="text-danger">{migrationResult.errors.length}</h4>
                            <small className="text-muted">Erori</small>
                          </div>
                        </div>
                      </div>
                      
                      {migrationResult.errors.length > 0 && (
                        <div className="mt-3">
                          <h6>Erori:</h6>
                          <ul className="list-unstyled">
                            {migrationResult.errors.map((error, index) => (
                              <li key={index} className="text-danger small">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Management Section */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Gestionare Mărci</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border" role="status"></div>
                      <p className="mt-2">Se încarcă mărcile...</p>
                    </div>
                  ) : brands.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Marcă</th>
                            <th>Anunțuri</th>
                            <th>Data creării</th>
                            <th>Acțiuni</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brands.map((brand) => (
                            <tr key={brand.id}>
                              <td>
                                {editingBrand === brand.id ? (
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={editingName}
                                      onChange={(e) => setEditingName(e.target.value)}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSaveEdit();
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm"
                                      onClick={handleSaveEdit}
                                      disabled={!editingName.trim()}
                                    >
                                      ✓
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      onClick={handleCancelEdit}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <span className="fw-bold">{brand.name}</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${brandUsage[brand.name] > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                                  {brandUsage[brand.name] || 0} anunț{brandUsage[brand.name] === 1 ? '' : 'uri'}
                                </span>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {brand.createdAt.toLocaleDateString('ro-RO')}
                                </small>
                              </td>
                              <td>
                                {editingBrand === brand.id ? (
                                  <span className="text-muted">Editare...</span>
                                ) : (
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary"
                                      onClick={() => handleEditBrand(brand)}
                                      title="Editează marca"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      className={`btn btn-outline-danger ${
                                        brandUsage[brand.name] > 0 ? 'disabled' : ''
                                      }`}
                                      onClick={() => handleDeleteBrand(brand)}
                                      disabled={brandUsage[brand.name] > 0 || deletingBrand === brand.id}
                                      title={
                                        brandUsage[brand.name] > 0 
                                          ? `Nu poți șterge - folosită în ${brandUsage[brand.name]} anunț${brandUsage[brand.name] === 1 ? '' : 'uri'}`
                                          : 'Șterge marca'
                                      }
                                    >
                                      {deletingBrand === brand.id ? (
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                      ) : (
                                        '🗑️'
                                      )}
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Nu există mărci în colecție.</p>
                      <p className="small">Rulează migrarea pentru a adăuga mărcile existente din anunțuri.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
} 