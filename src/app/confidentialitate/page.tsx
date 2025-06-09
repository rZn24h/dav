'use client';

export default function ConfidentialitatePage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-4 text-center mb-5">Politica de confidențialitate</h1>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <section className="mb-5">
                <h2 className="h4 mb-4">1. Colectarea datelor</h2>
                <p>
                  Site-ul nostru colectează următoarele tipuri de date:
                </p>
                <ul className="mb-3">
                  <li>Date de autentificare (email) prin Firebase Authentication</li>
                  <li>Informații despre anunțurile postate (text, imagini)</li>
                  <li>Date de contact furnizate voluntar</li>
                  <li>Informații tehnice despre dispozitiv și browser</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">2. Utilizarea Firebase</h2>
                <p>
                  Folosim serviciile Google Firebase pentru:
                </p>
                <ul className="mb-3">
                  <li>Autentificarea utilizatorilor (Firebase Auth)</li>
                  <li>Stocarea datelor (Firestore Database)</li>
                  <li>Stocarea imaginilor (Firebase Storage)</li>
                </ul>
                <p>
                  Datele sunt procesate și stocate conform politicilor de securitate Google Cloud Platform.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">3. Cookie-uri</h2>
                <p>
                  Site-ul folosește cookie-uri pentru:
                </p>
                <ul className="mb-3">
                  <li>Menținerea sesiunii de autentificare</li>
                  <li>Îmbunătățirea performanței site-ului</li>
                  <li>Analiză și statistici de utilizare</li>
                </ul>
                <p>
                  Puteți controla cookie-urile prin setările browserului.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">4. Securitatea datelor</h2>
                <p>
                  Implementăm următoarele măsuri de securitate:
                </p>
                <ul className="mb-3">
                  <li>Criptarea datelor în tranzit și în repaus</li>
                  <li>Reguli de securitate Firebase pentru acces controlat</li>
                  <li>Autentificare securizată prin Firebase Auth</li>
                  <li>Backup regulat al datelor</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="h4 mb-4">5. Drepturile utilizatorilor</h2>
                <p>
                  Conform GDPR, aveți următoarele drepturi:
                </p>
                <ul className="mb-3">
                  <li>Dreptul de acces la date</li>
                  <li>Dreptul la rectificare</li>
                  <li>Dreptul la ștergerea datelor</li>
                  <li>Dreptul la restricționarea prelucrării</li>
                  <li>Dreptul la portabilitatea datelor</li>
                </ul>
                <p>
                  Pentru exercitarea acestor drepturi, ne puteți contacta la adresa de email: contact@autod.ro
                </p>
              </section>

              <section>
                <h2 className="h4 mb-4">6. Actualizări ale politicii</h2>
                <p className="mb-0">
                  Ne rezervăm dreptul de a actualiza această politică de confidențialitate în orice moment.
                  Modificările vor fi publicate pe această pagină și, dacă sunt semnificative,
                  vom furniza o notificare mai vizibilă.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 