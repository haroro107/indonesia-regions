# indonesia-regions

Data wilayah Indonesia lengkap: **38 Provinsi** dan **514 Kabupaten/Kota** (416 Kabupaten, 98 Kota) dengan tipe data TypeScript dan indexing berkecepatan tinggi ($O(1)$).

Sumber data resmi mengacu pada **Kemendagri (Keputusan Menteri Dalam Negeri)** dan **BPS (Badan Pusat Statistik)** Indonesia.

## Install

```bash
npm install indonesia-regions
# atau
yarn add indonesia-regions
# atau
pnpm add indonesia-regions
```

## Penggunaan

### Import Dasar

```typescript
import {
  indonesiaRegions,
  CityType,
  getProvinces,
  findProvinceByCode,
  getCitiesByProvinceCode
} from 'indonesia-regions';

// Mendapatkan semua provinsi (38 provinsi)
const provinces = getProvinces();
console.log(provinces.length); // 38

// Mencari provinsi berdasarkan kode (O(1) lookup)
const dki = findProvinceByCode('31');
console.log(dki?.name); // 'DKI Jakarta'

// Mendapatkan kota/kabupaten dalam provinsi
const dkiCities = getCitiesByProvinceCode('31');
console.log(dkiCities); 
// [
//   { name: 'Kabupaten Administrasi Kepulauan Seribu', type: 'REGENCY' },
//   { name: 'Kota Jakarta Selatan', type: 'CITY' },
//   ...
// ]
```

### Filter Berdasarkan Tipe

```typescript
import { getCitiesOnly, getRegenciesOnly } from 'indonesia-regions';

// Semua Kota di Indonesia (98 Kota)
const allCities = getCitiesOnly();
console.log(allCities.length); // 98

// Semua Kabupaten di Indonesia (416 Kabupaten)
const allRegencies = getRegenciesOnly();
console.log(allRegencies.length); // 416

// Filter per provinsi
const dkiCitiesOnly = getCitiesOnly('31'); // 5 Kota
const dkiRegenciesOnly = getRegenciesOnly('31'); // 1 Kabupaten (Kepulauan Seribu)
const jabarRegencies = getRegenciesOnly('32'); // 18 Kabupaten
```

### Mencari Kota / Kabupaten

```typescript
import { findCityByName, findCitiesByName } from 'indonesia-regions';

// 1. Mencari kecocokan pertama
const result = findCityByName('Bandung');
console.log(result?.province.name); // 'Jawa Barat'
console.log(result?.city.name);     // 'Kabupaten Bandung'

// 2. Mencari semua kecocokan (menangani homonim seperti Kab & Kota Bandung)
const matches = findCitiesByName('Bandung');
matches.forEach((item) => {
  console.log(`${item.city.name} (${item.city.type}) di ${item.province.name}`);
});
// 'Kabupaten Bandung (REGENCY) di Jawa Barat'
// 'Kota Bandung (CITY) di Jawa Barat'
```

### Raw Data & Data per Gugus Pulau

```typescript
import {
  indonesiaRegions,
  sumatera,
  jawa,
  baliNusra,
  kalimantan,
  sulawesi,
  maluku,
  papua
} from 'indonesia-regions';

// Akses langsung seluruh data wilayah
for (const province of indonesiaRegions) {
  console.log(`${province.name} (${province.code}) - ${province.cities.length} kab/kota`);
}

// Data provinsi di pulau Jawa (6 provinsi)
for (const province of jawa) {
  console.log(province.name);
}

// Data provinsi di pulau Papua (6 provinsi DOB)
for (const province of papua) {
  console.log(`${province.name} (${province.code})`);
}
```

## API Reference

### Types

```typescript
enum CityType {
  REGENCY = 'REGENCY',  // Kabupaten
  CITY = 'CITY'         // Kota
}

interface City {
  name: string;
  type: CityType;
  code?: string;        // Kode wilayah BPS / Kemendagri (opsional)
}

interface Province {
  name: string;
  code: string;         // Kode provinsi (BPS / Kemendagri)
  cities: City[];
}
```

### Functions

| Function | Description | Performa |
|----------|-------------|----------|
| `getProvinces()` | Mendapatkan seluruh 38 provinsi | $O(1)$ |
| `findProvinceByCode(code)` | Mencari provinsi berdasarkan kode wilayah (misal `'31'`, `'96'`) | $O(1)$ indexed |
| `findProvinceByName(name)` | Mencari provinsi berdasarkan nama (case-insensitive) | $O(1)$ indexed |
| `getCitiesByProvinceCode(code)` | Mendapatkan seluruh kota/kabupaten di suatu provinsi | $O(1)$ |
| `findCityByName(name)` | Mencari kota/kabupaten pertama berdasarkan nama | $O(N)$ |
| `findCitiesByName(name)` | Mencari seluruh kota/kabupaten yang cocok dengan nama (mendukung homonim) | $O(N)$ |
| `getCitiesOnly(provinceCode?)` | Filter hanya kota (opsional per provinsi, default: seluruh 98 kota) | $O(1)$ / $O(M)$ |
| `getRegenciesOnly(provinceCode?)` | Filter hanya kabupaten (opsional per provinsi, default: seluruh 416 kabupaten) | $O(1)$ / $O(M)$ |

## Data Summary (Standar Resmi Terbaru)

| Wilayah | Provinsi | Kabupaten | Kota | Total Daerah |
|---------|:--------:|:---------:|:----:|:------------:|
| Sumatera | 10 | 120 | 34 | 154 |
| Jawa | 6 | 85 | 34 | 119 |
| Bali & Nusa Tenggara | 3 | 37 | 4 | 41 |
| Kalimantan | 5 | 47 | 9 | 56 |
| Sulawesi | 6 | 70 | 11 | 81 |
| Maluku | 2 | 17 | 4 | 21 |
| Papua | 6 | 40 | 2 | 42 |
| **Total Indonesia** | **38** | **416** | **98** | **514** |

## License

MIT
