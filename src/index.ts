/**
 * @raxza-tech/indonesia-regions
 *
 * Data wilayah Indonesia (Provinsi & Kota/Kabupaten)
 * Sumber data: BPS (Badan Pusat Statistik) & Kemendagri
 *
 * @example
 * ```ts
 * import { indonesiaRegions, CityType, findProvinceByCode } from '@raxza-tech/indonesia-regions';
 *
 * const dki = findProvinceByCode('31');
 * console.log(dki?.name); // 'DKI Jakarta'
 * ```
 */

// Type definitions
export type { City, Province, IndonesiaRegions } from "./types.js";
export { CityType } from "./types.js";

// Raw data imports
import { indonesiaRegions as _indonesiaRegions } from "./data/index.js";
import { sumatera, jawa, kalimantan, sulawesi, baliNusra, maluku, papua } from "./data/index.js";

// Re-export data
export const indonesiaRegions = _indonesiaRegions;
export { sumatera, jawa, kalimantan, sulawesi, baliNusra, maluku, papua };

// Import types for use in functions
import type { Province, City } from "./types.js";
import { CityType } from "./types.js";

// Pre-computed indexed lookups for O(1) performance and scalability
const provinceByCodeMap = new Map<string, Province>(
  _indonesiaRegions.map((p) => [p.code, p])
);

const provinceByNameMap = new Map<string, Province>(
  _indonesiaRegions.map((p) => [p.name.toLowerCase(), p])
);

const allCitiesOnly: City[] = _indonesiaRegions
  .flatMap((p) => p.cities)
  .filter((c) => c.type === CityType.CITY);

const allRegenciesOnly: City[] = _indonesiaRegions
  .flatMap((p) => p.cities)
  .filter((c) => c.type === CityType.REGENCY);

// Utility functions
/**
 * Mendapatkan semua provinsi di Indonesia (38 provinsi)
 */
export function getProvinces(): Province[] {
  return [..._indonesiaRegions];
}

/**
 * Mencari provinsi berdasarkan kode BPS / Kemendagri (O(1))
 */
export function findProvinceByCode(code: string): Province | undefined {
  return provinceByCodeMap.get(code);
}

/**
 * Mencari provinsi berdasarkan nama (case-insensitive, O(1))
 */
export function findProvinceByName(name: string): Province | undefined {
  return provinceByNameMap.get(name.trim().toLowerCase());
}

/**
 * Mendapatkan semua kota/kabupaten dalam sebuah provinsi
 */
export function getCitiesByProvinceCode(provinceCode: string): City[] {
  const province = findProvinceByCode(provinceCode);
  return province?.cities ?? [];
}

/**
 * Mencari kota/kabupaten pertama berdasarkan nama (case-insensitive).
 * Jika mencari nama wilayah yang memiliki Kabupaten dan Kota (contoh 'Bandung'),
 * gunakan `findCitiesByName` untuk mendapatkan semua hasil.
 */
export function findCityByName(name: string): { province: Province; city: City } | undefined {
  const query = name.trim().toLowerCase();

  // 1. Exact match against full name (e.g. "Kota Bandung" or "Kabupaten Bandung")
  for (const province of _indonesiaRegions) {
    const city = province.cities.find((c) => c.name.toLowerCase() === query);
    if (city) {
      return { province, city };
    }
  }

  // 2. Base name match without prefix (e.g. "Bandung")
  for (const province of _indonesiaRegions) {
    const city = province.cities.find(
      (c) => c.name.toLowerCase().replace(/^(kota|kabupaten(\s+administrasi)?)\s+/i, "") === query
    );
    if (city) {
      return { province, city };
    }
  }

  return undefined;
}

/**
 * Mencari semua kota/kabupaten yang cocok dengan nama (case-insensitive).
 * Berguna menangani homonim (contoh: Kabupaten Bandung dan Kota Bandung).
 */
export function findCitiesByName(name: string): Array<{ province: Province; city: City }> {
  const query = name.trim().toLowerCase();
  const results: Array<{ province: Province; city: City }> = [];

  for (const province of _indonesiaRegions) {
    for (const city of province.cities) {
      const fullName = city.name.toLowerCase();
      const baseName = fullName.replace(/^(kota|kabupaten(\s+administrasi)?)\s+/i, "");
      if (fullName === query || baseName === query) {
        results.push({ province, city });
      }
    }
  }

  return results;
}

/**
 * Mendapatkan hanya kota (bukan kabupaten)
 */
export function getCitiesOnly(provinceCode?: string): City[] {
  if (provinceCode) {
    return getCitiesByProvinceCode(provinceCode).filter((c) => c.type === CityType.CITY);
  }
  return [...allCitiesOnly];
}

/**
 * Mendapatkan hanya kabupaten
 */
export function getRegenciesOnly(provinceCode?: string): City[] {
  if (provinceCode) {
    return getCitiesByProvinceCode(provinceCode).filter((c) => c.type === CityType.REGENCY);
  }
  return [...allRegenciesOnly];
}
