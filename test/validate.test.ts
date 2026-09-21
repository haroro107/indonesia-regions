import assert from 'node:assert/strict';
import test from 'node:test';
import {
  indonesiaRegions,
  CityType,
  getProvinces,
  findProvinceByCode,
  findProvinceByName,
  getCitiesByProvinceCode,
  findCityByName,
  findCitiesByName,
  getCitiesOnly,
  getRegenciesOnly,
  sumatera,
  jawa,
  kalimantan,
  sulawesi,
  baliNusra,
  maluku,
  papua,
} from '../dist/index.js';

test('Data Integrity: Provinces & Regions Count', () => {
  const provinces = getProvinces();
  assert.equal(provinces.length, 38, 'Must have exactly 38 provinces');
  assert.equal(indonesiaRegions.length, 38, 'indonesiaRegions must have 38 provinces');

  const allCities = provinces.flatMap((p) => p.cities);
  assert.equal(allCities.length, 514, 'Must have exactly 514 kabupaten & kota');

  const regencies = getRegenciesOnly();
  const cities = getCitiesOnly();
  assert.equal(regencies.length, 416, 'Must have exactly 416 kabupaten');
  assert.equal(cities.length, 98, 'Must have exactly 98 kota');
});

test('Data Integrity: Official Province Codes (11 to 96)', () => {
  const expectedCodes = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '21',
    '31', '32', '33', '34', '35', '36',
    '51', '52', '53',
    '61', '62', '63', '64', '65',
    '71', '72', '73', '74', '75', '76',
    '81', '82',
    '91', '92', '93', '94', '95', '96',
  ];

  const actualCodes = getProvinces().map((p) => p.code);
  assert.deepEqual(
    [...new Set(actualCodes)].sort(),
    expectedCodes.sort(),
    'Province codes must match official Kemendagri / BPS list'
  );

  // Check unique codes
  assert.equal(new Set(actualCodes).size, 38, 'Province codes must be unique');
});

test('Data Integrity: Papua Pemekaran Codes & Regencies', () => {
  const papuaProv = findProvinceByCode('91');
  const papuaBarat = findProvinceByCode('92');
  const papuaSelatan = findProvinceByCode('93');
  const papuaTengah = findProvinceByCode('94');
  const papuaPegunungan = findProvinceByCode('95');
  const papuaBaratDaya = findProvinceByCode('96');

  assert.equal(papuaProv?.name, 'Papua');
  assert.equal(papuaProv?.cities.length, 9); // 8 kab, 1 kota
  assert.ok(papuaProv?.cities.some((c) => c.name === 'Kabupaten Keerom'));

  assert.equal(papuaBarat?.name, 'Papua Barat');
  assert.equal(papuaBarat?.cities.length, 7); // 7 kab, 0 kota
  assert.ok(!papuaBarat?.cities.some((c) => c.name === 'Kota Sorong'), 'Kota Sorong must not be in Papua Barat');

  assert.equal(papuaSelatan?.name, 'Papua Selatan');
  assert.equal(papuaSelatan?.cities.length, 4); // 4 kab

  assert.equal(papuaTengah?.name, 'Papua Tengah');
  assert.equal(papuaTengah?.cities.length, 8); // 8 kab

  assert.equal(papuaPegunungan?.name, 'Papua Pegunungan');
  assert.equal(papuaPegunungan?.cities.length, 8); // 8 kab
  assert.ok(papuaPegunungan?.cities.some((c) => c.name === 'Kabupaten Pegunungan Bintang'));

  assert.equal(papuaBaratDaya?.name, 'Papua Barat Daya');
  assert.equal(papuaBaratDaya?.cities.length, 6); // 5 kab, 1 kota
  assert.ok(papuaBaratDaya?.cities.some((c) => c.name === 'Kota Sorong'));
});

test('Data Integrity: Specific Previously Missing Entities', () => {
  // 1. Kepulauan Bangka Belitung
  const babel = findProvinceByCode('19');
  assert.ok(babel, 'Kepulauan Bangka Belitung must exist');
  assert.equal(babel?.name, 'Kepulauan Bangka Belitung');
  assert.equal(babel?.cities.length, 7);

  // 2. Kepulauan Seribu in DKI Jakarta
  const dki = findProvinceByCode('31');
  assert.equal(dki?.cities.length, 6);
  assert.ok(dki?.cities.some((c) => c.name === 'Kabupaten Administrasi Kepulauan Seribu' && c.type === CityType.REGENCY));

  // 3. PALI in Sumatera Selatan
  const sumsel = findProvinceByCode('16');
  assert.equal(sumsel?.cities.length, 17);
  assert.ok(sumsel?.cities.some((c) => c.name === 'Kabupaten Penukal Abab Lematang Ilir'));

  // 4. Paser & Penajam Paser Utara in Kalimantan Timur
  const kaltim = findProvinceByCode('64');
  assert.equal(kaltim?.cities.length, 10);
  assert.ok(kaltim?.cities.some((c) => c.name === 'Kabupaten Paser'));
  assert.ok(kaltim?.cities.some((c) => c.name === 'Kabupaten Penajam Paser Utara'));

  // 5. Kepulauan Tanimbar in Maluku
  const malukuProv = findProvinceByCode('81');
  assert.equal(malukuProv?.cities.length, 11);
  assert.ok(malukuProv?.cities.some((c) => c.name === 'Kabupaten Kepulauan Tanimbar'));
});

test('Data Integrity: Island Exports', () => {
  assert.equal(sumatera.length, 10);
  assert.equal(jawa.length, 6);
  assert.equal(baliNusra.length, 3);
  assert.equal(kalimantan.length, 5);
  assert.equal(sulawesi.length, 6);
  assert.equal(maluku.length, 2);
  assert.equal(papua.length, 6);

  const totalProvincesFromIslands =
    sumatera.length +
    jawa.length +
    baliNusra.length +
    kalimantan.length +
    sulawesi.length +
    maluku.length +
    papua.length;
  assert.equal(totalProvincesFromIslands, 38);
});

test('Utility Functions: Lookups & Filtering', () => {
  // findProvinceByCode
  assert.equal(findProvinceByCode('32')?.name, 'Jawa Barat');
  assert.equal(findProvinceByCode('999'), undefined);

  // findProvinceByName
  assert.equal(findProvinceByName('jawa barat')?.code, '32');
  assert.equal(findProvinceByName('DKI JAKARTA')?.code, '31');
  assert.equal(findProvinceByName('Nonexistent'), undefined);

  // getCitiesByProvinceCode
  const jabarCities = getCitiesByProvinceCode('32');
  assert.equal(jabarCities.length, 27);
  assert.equal(getCitiesByProvinceCode('999').length, 0);

  // findCityByName (single match)
  const bandungResult = findCityByName('Bandung');
  assert.ok(bandungResult);
  assert.equal(bandungResult?.province.code, '32');

  // findCitiesByName (multiple matches: Kabupaten Bandung & Kota Bandung)
  const bandungMatches = findCitiesByName('Bandung');
  assert.equal(bandungMatches.length, 2);
  assert.ok(bandungMatches.some((m) => m.city.type === CityType.REGENCY && m.city.name === 'Kabupaten Bandung'));
  assert.ok(bandungMatches.some((m) => m.city.type === CityType.CITY && m.city.name === 'Kota Bandung'));

  // getCitiesOnly & getRegenciesOnly with filter
  const dkiCities = getCitiesOnly('31');
  const dkiRegencies = getRegenciesOnly('31');
  assert.equal(dkiCities.length, 5);
  assert.equal(dkiRegencies.length, 1);
  assert.equal(dkiRegencies[0].name, 'Kabupaten Administrasi Kepulauan Seribu');
});
