'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/utils/firebase';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import { validateAndCompressImage } from '@/utils/imageUtils';

interface ConfigData {
  nume: string;
  slogan: string;
  logoUrl: string;
  bannerImg: string;
  locatie?: string;
  whatsapp?: string;
  facebook?: string;
  siteTitle?: string;
  siteDescription?: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<ConfigData>({
    nume: '',
    slogan: '',
    logoUrl: '',
    bannerImg: '',
    locatie: '',
    whatsapp: '',
    facebook: '',
    siteTitle: '',
    siteDescription: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'config', 'public');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ConfigData;
          setForm({
            nume: data.nume || '',
            slogan: data.slogan || '',
            logoUrl: data.logoUrl || '',
            bannerImg: data.bannerImg || '',
            locatie: data.locatie || '',
            whatsapp: data.whatsapp || '',
            facebook: data.facebook || '',
            siteTitle: data.siteTitle || '',
            siteDescription: data.siteDescription || '',
          });
        }
      } catch (err) {
        setError('Eroare la încărcarea configurației');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validează și comprimă imaginea
      const result = await validateAndCompressImage(file);
      
      if (!result.isValid) {
        setError(result.error || 'Eroare la procesarea imaginii');
        // Resetează input-ul
        e.target.value = '';
        return;
      }
      
      if (result.compressedFile) {
        if (type === 'logo') {
          setLogoFile(result.compressedFile);
        } else {
          setBannerFile(result.compressedFile);
        }
        setError(''); // Curăță erorile anterioare
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let logoUrl = form.logoUrl;
      let bannerImg = form.bannerImg;

      // Upload logo if changed
      if (logoFile) {
        const logoRef = ref(storage, `config/public/logo_${Date.now()}`);
        await uploadBytes(logoRef, logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }

      // Upload banner if changed
      if (bannerFile) {
        const bannerRef = ref(storage, `config/public/banner_${Date.now()}`);
        await uploadBytes(bannerRef, bannerFile);
        bannerImg = await getDownloadURL(bannerRef);
      }

      // Save to Firestore
      const configData = {
        ...form,
        logoUrl,
        bannerImg,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      };

      await setDoc(doc(db, 'config', 'public'), configData, { merge: true });
      setSuccess('Configurația a fost salvată cu succes!');
      setForm(prev => ({ ...prev, logoUrl, bannerImg }));
      setLogoFile(null);
      setBannerFile(null);
    } catch (err) {
      setError('Eroare la salvarea configurației');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <AdminNavbar />
        <div className="container py-4">
          <div>Se încarcă...</div>
        </div>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminNavbar />
      <div className="container py-4">
        <h1 className="mb-4">Setări</h1>
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nume site</label>
              <input
                type="text"
                className="form-control"
                name="nume"
                value={form.nume}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slogan</label>
              <input
                type="text"
                className="form-control"
                name="slogan"
                value={form.slogan}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Logo</label>
              {form.logoUrl && (
                <div className="mb-2">
                  <img
                    src={form.logoUrl}
                    alt="Logo"
                    style={{ maxHeight: '100px', maxWidth: '200px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Banner</label>
              {form.bannerImg && (
                <div className="mb-2">
                  <img
                    src={form.bannerImg}
                    alt="Banner"
                    style={{ maxHeight: '100px', maxWidth: '200px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'banner')}
              />
            </div>

            {/* Contact Information */}
            <div className="col-12">
              <hr className="my-4" />
              <h3 className="h5 mb-3">Informații de contact</h3>
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Locație</label>
              <input
                type="text"
                className="form-control"
                name="locatie"
                value={form.locatie}
                onChange={handleChange}
                placeholder="Ex: Suceava, România"
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Telefon/WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ex: 0722000000"
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Link Facebook</label>
              <input
                type="url"
                className="form-control"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Ex: https://www.facebook.com/numepagina"
              />
            </div>

            {/* SEO Settings */}
            <div className="col-12">
              <hr className="my-4" />
              <h3 className="h5 mb-3">Setări SEO</h3>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Titlu site (apare în tab browser)</label>
              <input
                type="text"
                className="form-control"
                name="siteTitle"
                value={form.siteTitle}
                onChange={handleChange}
                placeholder="Ex: AutoD - Anunțuri Auto"
              />
              <div className="form-text">
                Acest titlu va apărea în tab-ul browserului și în rezultatele căutărilor Google
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Descriere site</label>
              <input
                type="text"
                className="form-control"
                name="siteDescription"
                value={form.siteDescription}
                onChange={handleChange}
                placeholder="Ex: Cele mai bune oferte de mașini second hand din România"
              />
              <div className="form-text">
                Această descriere va apărea în rezultatele căutărilor Google
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Se salvează...' : 'Salvează'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminAuthGuard>
  );
} 