'use client';

export default function TermeniPage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-4 text-center mb-5">Termeni și condiții</h1>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <section className="mb-5">
                <h2 className="h4 mb-4">1. Acceptarea termenilor</h2>
                <p>
                  Prin accesarea și utilizarea acestui site, acceptați să fiți obligat de acești termeni și condiții de utilizare. 
                  Dacă nu sunteți de acord cu oricare dintre acești termeni, vă rugăm să nu utilizați site-ul.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">2. Utilizarea serviciului</h2>
                <p>
                  Site-ul nostru oferă o platformă pentru publicarea și vizualizarea anunțurilor de vânzare auto. 
                  Utilizatorii sunt responsabili pentru:
                </p>
                <ul>
                  <li>Acuratețea informațiilor furnizate în anunțuri</li>
                  <li>Conținutul și calitatea imaginilor încărcate</li>
                  <li>Respectarea legislației în vigoare privind vânzarea vehiculelor</li>
                  <li>Păstrarea confidențialității contului</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">3. Responsabilități</h2>
                <p>
                  Nu ne asumăm responsabilitatea pentru:
                </p>
                <ul>
                  <li>Acuratețea informațiilor furnizate de utilizatori</li>
                  <li>Calitatea sau starea vehiculelor prezentate</li>
                  <li>Rezultatele tranzacțiilor între utilizatori</li>
                  <li>Pierderile sau daunele rezultate din utilizarea site-ului</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">4. Proprietate intelectuală</h2>
                <p>
                  Tot conținutul de pe acest site, inclusiv dar fără a se limita la text, imagini, logo-uri, 
                  design și software, este proprietatea noastră sau a furnizorilor noștri de licențe și este 
                  protejat de legile drepturilor de autor.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">5. Modificări ale termenilor</h2>
                <p>
                  Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările vor intra în 
                  vigoare imediat după publicarea lor pe site. Utilizarea continuă a site-ului după modificări 
                  constituie acceptarea noilor termeni.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">6. Limitarea răspunderii</h2>
                <p>
                  Site-ul este furnizat "ca atare", fără garanții de orice fel. Nu garantăm că site-ul va fi 
                  neîntrerupt, la timp, sigur sau fără erori.
                </p>
              </section>

              <section>
                <h2 className="h4 mb-4">7. Legea aplicabilă</h2>
                <p>
                  Acești termeni sunt guvernați și interpretați în conformitate cu legile României. Orice dispută 
                  va fi supusă jurisdicției exclusive a instanțelor din România.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 