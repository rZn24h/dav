'use client';

import Link from 'next/link';
import { FaRoad, FaGasPump, FaCog, FaTachometerAlt, FaCar } from 'react-icons/fa';

interface CarCardProps {
  car: {
    id: string;
    title: string;
    marca: string;
    model: string;
    an: number;
    pret: number;
    km: number;
    combustibil: string;
    transmisie: string;
    putere?: string;
    capacitate: string;
    images: string[];
    coverImage?: string;
  };
}

export default function CarCard({ car }: CarCardProps) {
  const formattedPrice = new Intl.NumberFormat('ro-RO').format(car.pret);
  const formattedKm = new Intl.NumberFormat('ro-RO').format(car.km);
  
  const displayImage = car.coverImage || car.images[0];

  return (
    <Link 
      href={`/cars/${car.id}`} 
      className="text-decoration-none card h-100 border-0 shadow-sm hover-card"
    >
      {/* Car Image */}
      <div className="position-relative">
        <img
          src={displayImage}
          alt={`${car.marca} ${car.model}`}
          className="car-image"
          loading="lazy"
        />
      </div>

      {/* Car Details */}
      <div className="card-body p-3">
        {/* Title */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 
            className="car-title mb-0" 
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            {car.marca} {car.model}
          </h3>
          <span className="text-muted">{car.an}</span>
        </div>

        {/* Specs */}
        <div className="specs-grid mb-3">
          <div className="spec-item">
            <FaRoad className="spec-icon" />
            <span className="spec-text">{formattedKm} km</span>
          </div>
          <div className="spec-item">
            <FaGasPump className="spec-icon" />
            <span className="spec-text">{car.combustibil}</span>
          </div>
          <div className="spec-item">
            <FaCar className="spec-icon" />
            <span className="spec-text">{car.capacitate} cm³</span>
          </div>
          {car.putere && (
            <div className="spec-item">
              <FaTachometerAlt className="spec-icon" />
              <span className="spec-text">{car.putere} CP</span>
            </div>
          )}
          <div className="spec-item">
            <FaCog className="spec-icon" />
            <span className="spec-text">{car.transmisie}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="price-tag">
            {formattedPrice} €
          </div>
        </div>
      </div>
    </Link>
  );
} 