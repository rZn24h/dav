'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      {/* Optimized Car Image */}
      <div className="car-image-wrapper">
        <Image
          src={displayImage}
          alt={`${car.marca} ${car.model}`}
          width={400}
          height={300}
          className="car-image"
          sizes="(max-width: 768px) 100vw, 280px"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAEAAYDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAfEAABBQEAAwEAAAAAAAAAAAABAAIDBAUGBxITIVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AnU3W3V5pksvR5Bvj3xXGv1Jb2TwSMLXNe4EEeQRCMlJ//2Q=="
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Car Details */}
      <div className="card-body">
        {/* Top part: Title and Year */}
        <div>
          <h3 className="car-title">
            {car.marca} {car.model}
          </h3>
          <div className="d-flex align-items-center gap-2 text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            <FaCalendarAlt size={14} />
            <span>{car.an}</span>
          </div>
        </div>
        
        {/* Middle part: Specs in their own container */}
        <div className="specs-grid-container">
          <div className="specs-grid">
            <div className="spec-item" title={`${formattedKm} km`}>
              <FaRoad className="spec-icon" />
              <span className="spec-text">{formattedKm} km</span>
            </div>
            <div className="spec-item" title={car.combustibil}>
              <FaGasPump className="spec-icon" />
              <span className="spec-text">{car.combustibil}</span>
            </div>
            <div className="spec-item" title={`${car.capacitate} cm³`}>
              <FaCar className="spec-icon" />
              <span className="spec-text">{car.capacitate} cm³</span>
            </div>
            {car.putere && (
              <div className="spec-item" title={`${car.putere} CP`}>
                <FaTachometerAlt className="spec-icon" />
                <span className="spec-text">{car.putere} CP</span>
              </div>
            )}
            <div className="spec-item" title={car.transmisie}>
              <FaCog className="spec-icon" />
              <span className="spec-text">{car.transmisie}</span>
            </div>
          </div>
        </div>

        {/* Bottom part: Price */}
        <div className="price-tag">
          {formattedPrice} €
        </div>
      </div>
    </Link>
  );
} 