# @raxza-tech/indonesia-regions

Data wilayah Indonesia (Provinsi & Kota/Kabupaten) lengkap dengan tipe data TypeScript. Sumber data dari BPS (Badan Pusat Statistik).

## Install

```bash
npm install @raxza-tech/indonesia-regions
# atau
yarn add @raxza-tech/indonesia-regions
# atau
pnpm add @raxza-tech/indonesia-regions
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
} from '@raxza-tech/indonesia-regions';

// Mendapatkan semua provinsi
const provinces = getProvinces();
console.log(provinces.length); // 38

// Mencari provinsi berdasarkan kode BPS
const dki = findProvinceByCode('31');
console.log(dki.name); // 'DKI Jakarta'

// Mendapatkan kota/kabupaten dalam provinsi
const dkiCities = getCitiesByProvinceCode('31');
console.log(dkiCities); // [{ name: 'Kota Jakarta Barat', type: 'CITY' }, ...]
```

### Filter Berdasarkan Tipe

```typescript
import { getCitiesOnly, getRegenciesOnly } from '@raxza-tech/indonesia-regions';

// Hanya Kota
const cities = getCitiesOnly('31'); // DKI Jakarta

// Hanya Kabupaten
const regencies = getRegenciesOnly('32'); // Jawa Barat
```

### Mencari Kota

```typescript
import { findCityByName } from '@raxza-tech/indonesia-regions';

const result = findCityByName('Bandung');
console.log(result.province.name); // 'Jawa Barat'
console.log(result.city.type); // 'CITY'
```

### Raw Data

```typescript
import { indonesiaRegions } from '@raxza-tech/indonesia-regions';

// Akses langsung ke data
for (const province of indonesiaRegions) {
  console.log(`${province.name} (${province.code})`);
  for (const city of province.cities) {
    console.log(`  - ${city.name} (${city.type})`);
  }
}
```

### Data per Pulau

```typescript
import { sumatera, jawa, kalimantan } from '@raxza-tech/indonesia-regions';

// Data provinsi di pulau Jawa
for (const province of jawa) {
  console.log(province.name);
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
}

interface Province {
  name: string;
  code: string;  // Kode BPS
  cities: City[];
}
```

### Functions

| Function | Description |
|----------|-------------|
| `getProvinces()` | Mendapatkan semua provinsi |
| `findProvinceByCode(code)` | Mencari provinsi berdasarkan kode BPS |
| `findProvinceByName(name)` | Mencari provinsi berdasarkan nama |
| `getCitiesByProvinceCode(code)` | Mendapatkan kota/kabupaten suatu provinsi |
| `findCityByName(name)` | Mencari kota/kabupaten berdasarkan nama |
| `getCitiesOnly(provinceCode?)` | Filter hanya kota (opsional per provinsi) |
| `getRegenciesOnly(provinceCode?)` | Filter hanya kabupaten (opsional per provinsi) |


## Data Source

Data wilayah mengacu pada kode BPS (Badan Pusat Statistik) Indonesia.

## License

MIT
