'use client';

import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const menu = [
    {
      label: 'Adăugare anunț auto',
      route: '/admin/add',
      desc: 'Adaugă un anunț nou în parcul auto',
      icon: 'bi-plus-circle',
    },
    {
      label: 'Administrare anunțuri',
      route: '/admin/list',
      desc: 'Gestionează toate anunțurile existente',
      icon: 'bi-list-ul',
    },
    {
      label: 'Setări parc auto',
      route: '/admin/settings',
      desc: 'Configurează setările generale ale site-ului',
      icon: 'bi-gear',
    },
  ];

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <h1 className="mb-4">Dashboard Admin</h1>
        <div className="row g-4">
          {menu.map(item => (
            <div className="col-md-6 col-lg-4" key={item.route}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className={`bi ${item.icon} fs-2 me-3 text-primary`}></i>
                    <h5 className="card-title mb-0">{item.label}</h5>
                  </div>
                  <p className="card-text text-muted">{item.desc}</p>
                  <Link 
                    href={item.route} 
                    className="btn btn-primary w-100"
                  >
                    Accesează
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminAuthGuard>
  );
} 