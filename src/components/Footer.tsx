'use client';

import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';

const Footer = () => {
  const { config } = useConfig();

  return (
    <footer className="footer mt-auto py-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-2">© 2025 {config?.nume || 'AutoHausDAVID'} – Toate drepturile rezervate</p>
            <div className="footer-links mb-3">
              <Link href="/termeni" className="text-decoration-none me-3">
                Termeni și condiții
              </Link>
              <Link href="/confidentialitate" className="text-decoration-none">
                Politică de confidențialitate
              </Link>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            {config?.locatie && (
              <p className="mb-2">
                📍 <span className="fw-medium">Locație:</span> {config.locatie}
              </p>
            )}
            {config?.whatsapp && (
              <p className="mb-2">
                📞 <span className="fw-medium">Telefon:</span>{' '}
                <a 
                  href={`tel:${config.whatsapp}`} 
                  className="text-decoration-none"
                  style={{ color: 'inherit' }}
                >
                  {config.whatsapp}
                </a>
              </p>
            )}
            {config?.facebook && (
              <p className="mb-2">
                🔗 <span className="fw-medium">Facebook:</span>{' '}
                <a 
                  href={config.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-decoration-none"
                  style={{ color: 'inherit' }}
                >
                  {config?.nume || 'AutoHausDAVID'}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 