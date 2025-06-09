'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          <h1 className="display-1 text-danger mb-4">404</h1>
          <h2 className="h3 mb-4">Pagina nu a fost găsită</h2>
          <p className="lead mb-5">
            Ne pare rău, pagina pe care o căutați nu există sau a fost mutată.
            Vă rugăm să verificați adresa URL sau să reveniți la pagina principală.
          </p>
          <Link href="/" className="btn btn-primary btn-lg">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
} 