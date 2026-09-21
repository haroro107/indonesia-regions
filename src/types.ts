/**
 * Tipe wilayah administratif di Indonesia
 */
export enum CityType {
  /** Kabupaten */
  REGENCY = "REGENCY",
  /** Kota */
  CITY = "CITY",
}

/**
 * Representasi kota/kabupaten
 */
export interface City {
  /** Nama kota/kabupaten */
  name: string;
  /** Tipe wilayah (Kabupaten atau Kota) */
  type: CityType;
  /** Kode kota/kabupaten (BPS/Kemendagri) */
  code?: string;
}

/**
 * Representasi provinsi
 */
export interface Province {
  /** Nama provinsi */
  name: string;
  /** Kode provinsi (BPS) */
  code: string;
  /** Daftar kota/kabupaten dalam provinsi */
  cities: City[];
}

/**
 * Data seluruh wilayah Indonesia
 */
export type IndonesiaRegions = Province[];
