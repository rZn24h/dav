"use client";

import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaRoad, FaGasPump, FaCog, FaCar, FaTachometerAlt, FaWhatsapp, FaPhone, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaCogs, FaTimes, FaExpand } from 'react-icons/fa';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToImage = (idx: number) => {
    setCurrentImage(idx);
  };
  
  const prevImage = () => {
    setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const nextImage = () => {
    setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openModal = (idx: number) => {
    setCurrentImage(idx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const formattedPrice = new Intl.NumberFormat('ro-RO').format(car.pret);
  const formattedKm = new Intl.NumberFormat('ro-RO').format(car.km);
  const whatsappMsg = encodeURIComponent(`Salut! Sunt interesat de anunțul cu ${car.marca} ${car.model}.`);
  const whatsappLink = `https://wa.me/4${config?.whatsapp}?text=${whatsappMsg}`;

  return (
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
          <div className="gallery-container" style={{ height: '500px', position: 'relative' }}>
            {images.length > 0 ? (
              <>
                <div 
                  className="gallery-image-wrapper"
                  style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={images[currentImage]}
                    alt={`${car.marca} ${car.model} - Imagine ${currentImage + 1}`}
                    onClick={() => openModal(currentImage)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Expand button overlay */}
                  <div 
                    className="expand-overlay"
                    onClick={() => openModal(currentImage)}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FaExpand size={16} />
                  </div>
                </div>
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="gallery-nav-button prev"
                      aria-label="Imaginea anterioară"
                      style={{ zIndex: 15 }}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="gallery-nav-button next"
                      aria-label="Imaginea următoare"
                      style={{ zIndex: 15 }}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                <div className="image-counter" style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  zIndex: 20
                }}>
                  {currentImage + 1} / {images.length}
                </div>
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
          <div className="car-details-section mt-4">
            <h2 className="car-details-section-title">
              <FaCar /> Detalii tehnice
            </h2>
            <div className="car-details-specs">
              <div className="car-spec-item">
                <FaRoad className="car-spec-icon" />
                <span className="car-spec-label">Kilometraj</span>
                <span className="car-spec-value">{formattedKm} km</span>
              </div>
              <div className="car-spec-item">
                <FaGasPump className="car-spec-icon" />
                <span className="car-spec-label">Combustibil</span>
                <span className="car-spec-value">{car.combustibil}</span>
              </div>
              <div className="car-spec-item">
                <FaCog className="car-spec-icon" />
                <span className="car-spec-label">Transmisie</span>
                <span className="car-spec-value">{car.transmisie}</span>
              </div>
              <div className="car-spec-item">
                <FaCalendarAlt className="car-spec-icon" />
                <span className="car-spec-label">An fabricație</span>
                <span className="car-spec-value">{car.an}</span>
              </div>
              {car.putere && (
                <div className="car-spec-item">
                  <FaTachometerAlt className="car-spec-icon" />
                  <span className="car-spec-label">Putere</span>
                  <span className="car-spec-value">{car.putere} CP</span>
                </div>
              )}
              <div className="car-spec-item">
                <FaCar className="car-spec-icon" />
                <span className="car-spec-label">Capacitate</span>
                <span className="car-spec-value">{car.capacitate} cm³</span>
              </div>
              <div className="car-spec-item">
                <FaCar className="car-spec-icon" />
                <span className="car-spec-label">Caroserie</span>
                <span className="car-spec-value">{car.caroserie}</span>
              </div>
              {car.tractiune && (
                <div className="car-spec-item">
                  <FaCogs className="car-spec-icon" />
                  <span className="car-spec-label">Tracțiune</span>
                  <span className="car-spec-value">{car.tractiune}</span>
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
      {/* Modal for fullscreen image */}
      {isModalOpen && (
        <div
          className="car-image-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transition: 'background 0.3s',
          }}
          onClick={closeModal}
        >
          <button
            className="car-image-modal-close"
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: 32,
              right: 32,
              background: 'rgba(0,0,0,0.95)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              zIndex: 2100,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'background 0.2s, transform 0.2s',
            }}
            aria-label="Închide imaginea mare"
            tabIndex={0}
          >
            <FaTimes />
          </button>
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  zIndex: 2100,
                  cursor: 'pointer',
                }}
                aria-label="Imaginea anterioară"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={e => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  zIndex: 2100,
                  cursor: 'pointer',
                }}
                aria-label="Imaginea următoare"
              >
                <FaChevronRight />
              </button>
            </>
          )}
          {/* Fullscreen image */}
          <img
            src={images[currentImage]}
            alt={`Imagine mare ${currentImage + 1}`}
            style={{
              maxWidth: '96vw',
              maxHeight: '70vh',
              objectFit: 'contain',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
              borderRadius: 12,
              background: '#222',
              zIndex: 2050,
              userSelect: 'none',
              marginTop: 32,
              marginBottom: 16,
              transition: 'all 0.2s',
            }}
            onClick={e => e.stopPropagation()}
          />
          {/* Image counter */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: 20,
            fontSize: '1rem',
            zIndex: 2100,
          }}>
            {currentImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
} 