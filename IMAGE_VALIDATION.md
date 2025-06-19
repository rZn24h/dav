# Validarea și Compresia Imaginilor

## Funcționalitate

Sistemul de validare și compresie a imaginilor asigură că toate imaginile încărcate pe site respectă anumite standarde de calitate și dimensiune.

## Restricții Implementate

### 1. Tipul de Fișier
- **Restricție**: Doar fișiere de tip imagine sunt permise
- **Formate acceptate**: JPG, PNG, GIF, WebP, etc.
- **Implementare**: Verificare `file.type.startsWith('image/')`

### 2. Dimensiunea Fișierului
- **Restricție**: Maxim 2MB per fișier
- **Implementare**: Verificare `file.size > 2 * 1024 * 1024`

### 3. Dimensiunile Imaginii
- **Restricție**: Lățimea sau înălțimea nu poate depăși 2048 pixeli
- **Implementare**: Încărcare temporară ca URL și verificare dimensiuni

### 4. Compresia Automată
- **Dimensiune maximă după compresie**: 1MB
- **Rezoluție maximă**: 1920x1920 pixeli
- **Implementare**: Folosirea bibliotecii `browser-image-compression`

## Funcții Utilitare

### `validateAndCompressImage(file: File)`
Validează și comprimă o singură imagine.

**Parametri:**
- `file`: Fișierul imagine de validat

**Returnează:**
```typescript
{
  isValid: boolean;
  error?: string;
  compressedFile?: File;
}
```

### `validateImageFiles(files: FileList | File[])`
Validează tipul pentru multiple fișiere.

**Parametri:**
- `files`: Array sau FileList de fișiere

**Returnează:**
```typescript
{
  isValid: boolean;
  error?: string;
}
```

## Integrare în Aplicație

### Pagina de Adăugare Mașini (`/admin/add`)
- Validare automată la selectarea fișierelor
- Compresie înainte de upload
- Afișare erori în timp real
- Suport pentru multiple imagini (max 8)

### Pagina de Setări (`/admin/settings`)
- Validare pentru logo și banner
- Compresie automată
- Afișare erori în timp real

## Mesaje de Eroare

1. **Tip fișier invalid**: "Doar fișierele de tip imagine sunt permise (JPG, PNG, GIF, etc.)"
2. **Dimensiune prea mare**: "Fișierul este prea mare. Dimensiunea maximă permisă este 2MB."
3. **Dimensiuni prea mari**: "Imaginea este prea mare. Dimensiunile maxime permise sunt 2048x2048 pixeli."
4. **Eroare procesare**: "A apărut o eroare la procesarea imaginii. Vă rugăm să încercați din nou."

## Dependințe

- `browser-image-compression`: Pentru compresia imaginilor
- Firebase Storage: Pentru upload-ul fișierelor

## Beneficii

1. **Performanță**: Imaginile mai mici se încarcă mai rapid
2. **Spațiu**: Economie de spațiu în Firebase Storage
3. **UX**: Feedback imediat pentru erori
4. **SEO**: Imaginile optimizate sunt mai bune pentru SEO
5. **Costuri**: Reducerea costurilor de storage și bandwidth 