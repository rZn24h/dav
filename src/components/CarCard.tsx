'use client';

import Link from 'next/link';
import { FaRoad, FaGasPump, FaCog, FaTachometerAlt, FaCar, FaCalendarAlt } from 'react-icons/fa';

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
      className="hover-card"
    >
      {/* Car Image */}
      <div className="car-image-wrapper">
        <img
          src={displayImage}
          alt={`${car.marca} ${car.model}`}
          className="car-image"
          loading="lazy"
        />
      </div>

      {/* Car Details */}
      <div className="card-body">
        <div className="car-details-header">
          <div className="car-title-wrapper">
            <h3 className="car-title">
              {car.marca} {car.model}
            </h3>
            <div className="car-year">
              <FaCalendarAlt size={14} />
              <span>{car.an}</span>
            </div>
          </div>
          <div className="price-tag">
            {formattedPrice} €
          </div>
        </div>

        {/* Specs */}
        <div className="specs-grid">
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
      </div>
    </Link>
  );
} 