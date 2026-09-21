/**
 * @indo/regions
 *
 * Data wilayah Indonesia (Provinsi & Kota/Kabupaten)
 * Sumber data: BPS (Badan Pusat Statistik)
 *
 * @example
 * ```ts
 * import { indonesiaRegions, CityType } from '@indo/regions';
 *
 * const dki = indonesiaRegions.find(p => p.code === '31');
 * console.log(dki.name); // 'DKI Jakarta'
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

// Utility functions
/**
 * Mendapatkan semua provinsi
 */
export function getProvinces(): Province[] {
  return [..._indonesiaRegions];
}

/**
 * Mencari provinsi berdasarkan kode
 */
export function findProvinceByCode(code: string): Province | undefined {
  return _indonesiaRegions.find((p) => p.code === code);
}

/**
 * Mencari provinsi berdasarkan nama (case-insensitive)
 */
export function findProvinceByName(name: string): Province | undefined {
  return _indonesiaRegions.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Mendapatkan semua kota/kabupaten dalam sebuah provinsi
 */
export function getCitiesByProvinceCode(provinceCode: string): City[] {
  const province = findProvinceByCode(provinceCode);
  return province?.cities ?? [];
}

/**
 * Mencari kota/kabupaten berdasarkan nama (case-insensitive)
 */
export function findCityByName(name: string): { province: Province; city: City } | undefined {
  for (const province of _indonesiaRegions) {
    const city = province.cities.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (city) {
      return { province, city };
    }
  }
  return undefined;
}

/**
 * Mendapatkan hanya kota (bukan kabupaten)
 */
export function getCitiesOnly(provinceCode?: string): City[] {
  const cities = provinceCode
    ? getCitiesByProvinceCode(provinceCode)
    : _indonesiaRegions.flatMap((p) => p.cities);
  return cities.filter((c) => c.type === CityType.CITY);
}

/**
 * Mendapatkan hanya kabupaten
 */
export function getRegenciesOnly(provinceCode?: string): City[] {
  const cities = provinceCode
    ? getCitiesByProvinceCode(provinceCode)
    : _indonesiaRegions.flatMap((p) => p.cities);
  return cities.filter((c) => c.type === CityType.REGENCY);
}
