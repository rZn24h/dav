'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useConfig } from '@/hooks/useConfig';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { auth } from '@/utils/firebase';
import HydrationSuppressor from './HydrationSuppressor';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { config, loading: configLoading } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          {configLoading ? (
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

        <div className="d-flex align-items-center ms-auto">
          <HydrationSuppressor fallback={<div style={{ width: '75px' }} />}>
            {authLoading ? (
              <div style={{ width: '75px' }} /> /* Placeholder to prevent layout shift */
            ) : user ? (
              <div className="d-flex align-items-center gap-2">
                <Link href="/admin/dashboard" className="btn btn-sm btn-outline-secondary">
                  Admin
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-primary">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-sm btn-primary">
                Login
              </Link>
            )}
          </HydrationSuppressor>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;