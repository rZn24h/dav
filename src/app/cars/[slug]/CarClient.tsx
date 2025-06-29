"use client";

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaRoad, FaGasPump, FaCog, FaCar, FaTachometerAlt, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaCogs, FaTimes } from 'react-icons/fa';
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

  // State for lightbox
  const [isZoomed, setIsZoomed] = useState(false);

  const goToImage = (idx: number) => setCurrentImage(idx);
  const prevImage = () => setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));

  const openZoom = (index: number) => {
    setCurrentImage(index);
    setIsZoomed(true);
  };

  const closeZoom = () => setIsZoomed(false);

  // Handle keyboard navigation in zoom view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') closeZoom();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, nextImage, prevImage, closeZoom]);

  const formattedPrice = new Intl.NumberFormat('ro-RO').format(car.pret);
  const formattedKm = new Intl.NumberFormat('ro-RO').format(car.km);
  const whatsappMsg = encodeURIComponent(`Salut! Sunt interesat de anunțul cu ${car.marca} ${car.model}.`);
  const whatsappLink = `https://wa.me/4${config?.whatsapp}?text=${whatsappMsg}`;

  return (
    <>
      <div className="car-details-container">
        {/* Back button */}
        <button
          onClick={() => router.push('/')}
          className="car-details-back"
        >
          <FaChevronLeft /> Înapoi la anunțuri
        </button>

        <div className="row g-4">
          {/* Left column - Gallery and Details */}
          <div className="col-12 col-lg-8">
            {/* Image Gallery */}
            <div className="gallery-container" style={{ height: '500px' }}>
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImage]}
                    alt={`${car.marca} ${car.model} - Imagine ${currentImage + 1}`}
                    onClick={() => openZoom(currentImage)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      cursor: 'zoom-in'
                    }}
                  />
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="gallery-nav-button prev"
                        aria-label="Imaginea anterioară"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextImage}
                        className="gallery-nav-button next"
                        aria-label="Imaginea următoare"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-muted">Nu există imagini pentru acest anunț</div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="thumbnails-container">
                <div className="d-flex gap-2 overflow-auto">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Miniatură ${idx + 1}`}
                      onClick={() => goToImage(idx)}
                      className={`thumbnail-image ${idx === currentImage ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Car Details Sections */}
            <div className="car-details-section">
              <h2 className="car-details-section-title">
                <FaCar /> Detalii tehnice
              </h2>
              <div className="car-details-specs">
                {/* Kilometraj */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaRoad /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">Kilometraj</span>
                    <span className="car-spec-value">{formattedKm} km</span>
                  </div>
                </div>

                {/* An fabricație */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaCalendarAlt /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">An fabricație</span>
                    <span className="car-spec-value">{car.an}</span>
                  </div>
                </div>

                {/* Combustibil */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaGasPump /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">Combustibil</span>
                    <span className="car-spec-value">{car.combustibil}</span>
                  </div>
                </div>

                {/* Transmisie */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaCog /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">Transmisie</span>
                    <span className="car-spec-value">{car.transmisie}</span>
                  </div>
                </div>
                
                {/* Putere */}
                {car.putere && (
                  <div className="car-spec-item">
                    <div className="car-spec-icon"><FaTachometerAlt /></div>
                    <div className="car-spec-text-content">
                      <span className="car-spec-label">Putere</span>
                      <span className="car-spec-value">{car.putere} CP</span>
                    </div>
                  </div>
                )}

                {/* Capacitate cilindrica */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaCar /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">Capacitate</span>
                    <span className="car-spec-value">{car.capacitate} cm³</span>
                  </div>
                </div>

                {/* Caroserie */}
                <div className="car-spec-item">
                  <div className="car-spec-icon"><FaCar /></div>
                  <div className="car-spec-text-content">
                    <span className="car-spec-label">Caroserie</span>
                    <span className="car-spec-value">{car.caroserie}</span>
                  </div>
                </div>

                {/* Tractiune */}
                {car.tractiune && (
                  <div className="car-spec-item">
                    <div className="car-spec-icon"><FaCogs /></div>
                    <div className="car-spec-text-content">
                      <span className="car-spec-label">Tracțiune</span>
                      <span className="car-spec-value">{car.tractiune}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="car-details-section">
              <h2 className="car-details-section-title">
                📝 Descriere
              </h2>
              <div className="car-details-description">
                {car.descriere}
              </div>
            </div>

            {/* Features */}
            {car.dotari && (
              <div className="car-details-section">
                <h2 className="car-details-section-title">
                  ✨ Dotări
                </h2>
                <div className="car-details-features">
                  {car.dotari
                    .split(/[,\n]/) // Split by comma or newline
                    .map((feature, idx) => feature.trim()) // Trim whitespace
                    .filter(feature => feature.length > 0) // Remove empty items
                    .map((feature, idx) => (
                      <div key={idx} className="car-feature-item">
                        <span className="feature-bullet">•</span>
                        <span className="feature-text">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* External link */}
            {car.linkExtern && (
              <a 
                href={car.linkExtern} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline-primary w-100 mb-4"
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                Vezi anunțul și pe OLX/Autovit
              </a>
            )}
          </div>

          {/* Right column - Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="car-details-sidebar p-4 sticky-top" style={{ top: '1rem' }}>
              <h1 className="car-details-title">{car.marca} {car.model}</h1>
              <div className="car-details-subtitle">
                {car.an} • {formattedKm} km • {car.combustibil}
              </div>
              <div className="car-details-price">
                {formattedPrice} €
              </div>

              {/* Contact buttons */}
              {config?.whatsapp && (
                <div className="d-grid gap-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="car-details-contact-btn whatsapp"
                  >
                    <FaWhatsapp size={24} /> Contactează pe WhatsApp
                  </a>
                  <a
                    href={`tel:${config.whatsapp}`}
                    className="car-details-contact-btn phone"
                  >
                    <FaPhone /> Sună acum
                  </a>
                </div>
              )}

              {/* Location and contact info */}
              <div className="mt-4">
                {car.locatie && (
                  <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                    <FaMapMarkerAlt />
                    <span>{car.locatie}</span>
                  </div>
                )}
                {car.contact && (
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <FaUser />
                    <span>{car.contact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoomed View */}
      {isZoomed && images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeZoom}>
          <button className="lightbox-close" onClick={closeZoom} aria-label="Închide">
            <FaTimes />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImage]}
              alt={`${car.marca} ${car.model} - Imagine ${currentImage + 1} (mărită)`}
              className="lightbox-image"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="lightbox-nav prev"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Imaginea anterioară"
              >
                <FaChevronLeft />
              </button>
              <button
                className="lightbox-nav next"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Imaginea următoare"
              >
                <FaChevronRight />
              </button>
              <div className="lightbox-counter">
                {currentImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
} 