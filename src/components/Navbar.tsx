'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { config, loading } = useConfig();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          {loading ? (
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
          ) : config?.logoUrl ? (
            <img
              src={config.logoUrl}
              alt={config.nume || 'Logo'}
              style={{
                width: 'auto',
                height: '40px',
                objectFit: 'contain'
              }}
              className="d-inline-block align-top"
            />
          ) : (
            <div className="text-primary">
              <i className="bi bi-car-front fs-3"></i>
            </div>
          )}
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link 
                href="/" 
                className={`nav-link px-3 py-2 ${pathname === '/' ? 'active fw-bold' : ''}`}
              >
                Acasă
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/contact" 
                className={`nav-link px-3 py-2 ${pathname === '/contact' ? 'active fw-bold' : ''}`}
              >
                Contact
              </Link>
            </li>
            {user && isAdmin && !adminLoading && (
              <li className="nav-item">
                <Link 
                  href="/admin/dashboard" 
                  className={`nav-link px-3 py-2 d-flex align-items-center ${
                    pathname.startsWith('/admin') ? 'active fw-bold' : ''
                  }`}
                >
                  <i className="bi bi-gear-fill me-2"></i>
                  <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;