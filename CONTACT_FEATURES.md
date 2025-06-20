# Funcționalități Pagină Contact - Configurare Admin

## Descriere
Pagina de contact a fost îmbunătățită cu funcționalități de configurare pentru administrator, permițând personalizarea informațiilor de contact și a hărții.

## Funcționalități Noi

### 1. Configurare Email și Program
- **Email**: Administratorul poate seta adresa de email de contact
- **Program de funcționare**: Configurare separată pentru:
  - Luni - Vineri
  - Sâmbătă  
  - Duminică

### 2. Configurare Hartă
- **Coordonate personalizabile**: Latitudine și longitudine pentru poziția exactă pe hartă
- **Click pe hartă**: Deschide Google Maps în tab nou cu locația exactă
- **Overlay interactiv**: Mesaj informativ care dispare la hover

## Cum să configurezi

### Accesare Setări Admin
1. Navighează la `/admin/settings`
2. Autentifică-te cu contul de administrator

### Configurare Informații Contact
În secțiunea "Informații de contact":
- Completează câmpul **Email** cu adresa de contact
- Completează câmpurile **Program de funcționare**:
  - Luni - Vineri: ex. "09:00 - 18:00"
  - Sâmbătă: ex. "10:00 - 14:00"  
  - Duminică: ex. "Închis"

### Configurare Hartă
În secțiunea "Coordonate hartă":
- **Latitudine**: ex. "44.4268" (pentru București)
- **Longitudine**: ex. "26.1024" (pentru București)

### Obținerea Coordonatelor
1. Mergi pe [Google Maps](https://maps.google.com)
2. Caută adresa parcului tău
3. Click dreapta pe locația exactă
4. Selectează coordonatele din meniul contextual
5. Copiază latitudinea și longitudinea în câmpurile din admin

## Funcționalități Frontend

### Pagina de Contact
- Afișează automat informațiile configurate de admin
- Email-ul este clickabil (deschide clientul de email)
- Programul se afișează dinamic în funcție de configurație
- Harta se actualizează automat cu coordonatele setate

### Interacțiune cu Harta
- **Hover**: Overlay-ul dispare pentru a permite vizualizarea hărții
- **Click**: Deschide Google Maps în tab nou cu locația exactă
- **Responsive**: Harta se adaptează la toate dimensiunile de ecran

## Tehnologii Folosite
- **Firebase Firestore**: Stocarea configurației
- **Google Maps Embed API**: Afișarea hărții
- **Bootstrap Icons**: Iconițe pentru interfață
- **React Hooks**: Gestionarea stării și efectelor

## Note Importante
- Configurația este salvată în timp real în Firebase
- Modificările sunt vizibile imediat pe pagina de contact
- Coordonatele implicite sunt pentru București (44.4268, 26.1024)
- Harta folosește Google Maps Embed API cu cheie publică 