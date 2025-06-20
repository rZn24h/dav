'use client';

import { useState } from 'react';
import { useConfig } from '@/hooks/useConfig';

export default function ContactPage() {
  const { config } = useConfig();
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    mesaj: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Formularul a fost trimis cu succes!');
    setFormData({ nume: '', email: '', mesaj: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = () => {
    // Folosește coordonatele din configurație sau coordonatele implicite
    const latitude = config?.mapCoordinates?.latitude || '44.4268';
    const longitude = config?.mapCoordinates?.longitude || '26.1024';
    const address = config?.locatie || 'București, România';
    
    // Deschide Google Maps cu coordonatele exacte
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15`;
    window.open(mapsUrl, '_blank');
  };

  // Generează URL-ul pentru iframe-ul hărții
  const getMapUrl = () => {
    const latitude = config?.mapCoordinates?.latitude || '44.4268';
    const longitude = config?.mapCoordinates?.longitude || '26.1024';
    const address = config?.locatie || 'București, România';
    
    // URL mai simplu și mai precis pentru Google Maps embed
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&center=${latitude},${longitude}&zoom=15`;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-4 text-center mb-5">Contact</h1>

          <div className="row g-4">
            {/* Contact Information */}
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="h4 mb-4">Informații contact</h2>
                  
                  <div className="mb-4">
                    <h3 className="h6 mb-2">Adresă</h3>
                    <p className="mb-0">{config?.locatie || 'București, România'}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="h6 mb-2">Telefon</h3>
                    <p className="mb-0">
                      <a href={`tel:${config?.whatsapp || '0722000000'}`} className="text-decoration-none">
                        {config?.whatsapp || '0722 000 000'}
                      </a>
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="h6 mb-2">Email</h3>
                    <p className="mb-0">
                      <a href={`mailto:${config?.email || 'contact@autod.ro'}`} className="text-decoration-none">
                        {config?.email || 'contact@autod.ro'}
                      </a>
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="h6 mb-2">Program</h3>
                    {config?.program ? (
                      <>
                        {config.program.luniVineri && (
                          <p className="mb-0">Luni - Vineri: {config.program.luniVineri}</p>
                        )}
                        {config.program.sambata && (
                          <p className="mb-0">Sâmbătă: {config.program.sambata}</p>
                        )}
                        {config.program.duminica && (
                          <p className="mb-0">Duminică: {config.program.duminica}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mb-0">Luni - Vineri: 09:00 - 18:00</p>
                        <p className="mb-0">Sâmbătă: 10:00 - 14:00</p>
                        <p className="mb-0">Duminică: Închis</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body p-4">
                  <h2 className="h4 mb-4">Formular contact</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="nume" className="form-label">Nume complet</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nume"
                        name="nume"
                        value={formData.nume}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="mesaj" className="form-label">Mesaj</label>
                      <textarea
                        className="form-control"
                        id="mesaj"
                        name="mesaj"
                        rows={4}
                        value={formData.mesaj}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Trimite mesaj
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="mt-5">
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h3 className="h5 mb-0">Locația noastră</h3>
                <small className="text-muted">Click pe hartă pentru a deschide în Google Maps</small>
              </div>
              <div className="card-body p-0">
                <div 
                  className="position-relative cursor-pointer"
                  onClick={handleMapClick}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector('.map-overlay') as HTMLElement;
                    if (overlay) overlay.style.opacity = '0';
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector('.map-overlay') as HTMLElement;
                    if (overlay) overlay.style.opacity = '1';
                  }}
                >
                  <iframe
                    src={getMapUrl()}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center map-overlay"
                    style={{ transition: 'opacity 0.3s ease' }}
                  >
                    <div className="bg-dark bg-opacity-75 text-white p-3 rounded shadow">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      Click pentru a deschide în Google Maps
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 