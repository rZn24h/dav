"use client";

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaRoad, FaGasPump, FaCog, FaCar, FaTachometerAlt, FaWhatsapp, FaPhone } from 'react-icons/fa';
import { useConfig } from '@/hooks/useConfig';
import { useRouter } from 'next/navigation';

interface CarDetails {
  id: string;
  title: string;
  marca: string;
  model: string;
  an: number;
  pret: number;
  km: number;
  combustibil: string;
  transmisie: string;
  caroserie: string;
  capacitate: string;
  putere?: string;
  tractiune?: string;
  linkExtern?: string;
  descriere: string;
  dotari?: string;
  images: string[];
  coverImage?: string;
  contact?: string;
  locatie?: string;
}

export default function CarClient({ car }: { car: CarDetails }) {
  const { config } = useConfig();
  const router = useRouter();
  const images: string[] = car.images || [];
  const [currentImage, setCurrentImage] = useState(0);

  const goToImage = (idx: number) => setCurrentImage(idx);
  const prevImage = () => setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));

  const formattedPrice = new Intl.NumberFormat('ro-RO').format(car.pret);
  const whatsappMsg = encodeURIComponent(`Salut! Sunt interesat de anunțul cu ${car.marca} ${car.model}.`);
  const whatsappLink = `https://wa.me/4${config?.whatsapp}?text=${whatsappMsg}`;

  return (
    <div className="container py-4">
      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="btn btn-link text-decoration-none mb-3 ps-0"
      >
        <FaChevronLeft /> Înapoi la anunțuri
      </button>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          {/* Main content */}
          <div className="row g-0">
            {/* Image gallery */}
            <div className="col-12 col-lg-8">
              <div className="position-relative bg-light">
                {images.length > 0 ? (
                  <>
                    <div className="gallery-container position-relative" style={{ 
                      backgroundColor: '#f8f9fa',
                      width: '100%',
                      height: '500px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={images[currentImage]}
                        alt={`${car.marca} ${car.model} - Imagine ${currentImage + 1}`}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                      
                      {/* Navigation arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3 shadow-sm"
                            style={{ width: '40px', height: '40px', padding: 0, zIndex: 10 }}
                          >
                            <FaChevronLeft />
                          </button>
                          <button
                            onClick={nextImage}
                            className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-3 shadow-sm"
                            style={{ width: '40px', height: '40px', padding: 0, zIndex: 10 }}
                          >
                            <FaChevronRight />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    <div className="container-fluid bg-white py-2 border-top">
                      <div className="row g-2 justify-content-start px-2" style={{ 
                        overflowX: 'auto', 
                        flexWrap: 'nowrap',
                        scrollbarWidth: 'thin'
                      }}>
                        {images.map((img, idx) => (
                          <div key={idx} className="col-auto">
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              onClick={() => goToImage(idx)}
                              className="cursor-pointer"
                              style={{
                                width: '100px',
                                height: '75px',
                                objectFit: 'cover',
                                border: idx === currentImage ? '2px solid #0d6efd' : '2px solid transparent',
                                opacity: idx === currentImage ? 1 : 0.7,
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                    <div className="text-muted">Nu există imagini pentru acest anunț</div>
                  </div>
                )}
              </div>
            </div>

            {/* Car details sidebar */}
            <div className="col-12 col-lg-4">
              <div className="p-4">
                {/* Title and basic info */}
                <h1 className="h3 mb-2 fw-bold">{car.marca} {car.model}</h1>
                <p className="text-muted mb-3 fs-5">
                  {car.an} · {new Intl.NumberFormat('ro-RO').format(car.km)} km · {car.combustibil}
                </p>

                {/* Price */}
                <div className="h2 text-primary mb-4 fw-bold">
                  {formattedPrice} €
                </div>

                {/* Contact buttons */}
                {config?.whatsapp && (
                  <div className="d-grid gap-2 mb-4">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success btn-lg d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaWhatsapp size={24} /> Contactează pe WhatsApp
                    </a>
                    <a
                      href={`tel:${config.whatsapp}`}
                      className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaPhone /> Sună acum
                    </a>
                  </div>
                )}

                {/* Quick specs */}
                <div className="row g-2 text-center mb-4">
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light h-100 d-flex flex-column align-items-center justify-content-center">
                      <FaRoad className="text-primary mb-1" size={18} />
                      <div className="small text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Kilometraj</div>
                      <div className="fw-bold" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{new Intl.NumberFormat('ro-RO').format(car.km)} km</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light h-100 d-flex flex-column align-items-center justify-content-center">
                      <FaGasPump className="text-primary mb-1" size={18} />
                      <div className="small text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Combustibil</div>
                      <div className="fw-bold" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{car.combustibil}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 rounded-3 bg-light h-100 d-flex flex-column align-items-center justify-content-center">
                      <FaCog className="text-primary mb-1" size={18} />
                      <div className="small text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Transmisie</div>
                      <div className="fw-bold" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{car.transmisie}</div>
                    </div>
                  </div>
                </div>

                {/* Location and contact */}
                <div className="text-muted">
                  {car.locatie && (
                    <p className="mb-2">
                      <i className="bi bi-geo-alt me-2"></i>
                      Locație: {car.locatie}
                    </p>
                  )}
                  {car.contact && (
                    <p className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Contact: {car.contact}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External link button */}
      {car.linkExtern && (
        <div className="container mt-3">
          <div className="row">
            <div className="col-lg-8">
              <a 
                href={car.linkExtern} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-primary w-100"
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                Vezi anunțul și pe OLX/Autovit
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Description and technical details */}
      <div className="row g-4">
        <div className="col-lg-8">
          {/* Description */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="h5 mb-4">📝 Descriere</h3>
              <div className="description" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                {car.descriere.split('\n').map((line: string, idx: number) => (
                  <p key={idx} className="mb-3">{line}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          {car.dotari && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="h5 mb-4">✨ Dotări</h3>
                <div className="row g-3">
                  {car.dotari.split(',').map((feature: string, idx: number) => (
                    <div key={idx} className="col-md-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 text-primary me-2"></i>
                        {feature.trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical details */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-4">🔧 Detalii tehnice</h3>
              <table className="table table-sm">
                <tbody>
                  <tr><th className="text-muted border-0">Marcă</th><td className="border-0">{car.marca}</td></tr>
                  <tr><th className="text-muted">Model</th><td>{car.model}</td></tr>
                  <tr><th className="text-muted">An fabricație</th><td>{car.an}</td></tr>
                  <tr><th className="text-muted">Kilometraj</th><td>{new Intl.NumberFormat('ro-RO').format(car.km)} km</td></tr>
                  <tr><th className="text-muted">Caroserie</th><td>{car.caroserie}</td></tr>
                  <tr><th className="text-muted">Combustibil</th><td>{car.combustibil}</td></tr>
                  <tr><th className="text-muted">Transmisie</th><td>{car.transmisie}</td></tr>
                  <tr><th className="text-muted">Capacitate</th><td>{car.capacitate} cm³</td></tr>
                  {car.putere && <tr><th className="text-muted">Putere</th><td>{car.putere} CP</td></tr>}
                  {car.tractiune && <tr><th className="text-muted">Tracțiune</th><td>{car.tractiune}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 