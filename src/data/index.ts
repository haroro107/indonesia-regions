// src/data/index.ts
export { sumatera } from "./sumatera.js";
export { jawa } from "./jawa.js";
export { kalimantan } from "./kalimantan.js";
export { sulawesi } from "./sulawesi.js";
export { baliNusra } from "./bali_nusra.js";
export { maluku } from "./maluku.js";
export { papua } from "./papua.js";

import { sumatera } from "./sumatera.js";
import { jawa } from "./jawa.js";
import { kalimantan } from "./kalimantan.js";
import { sulawesi } from "./sulawesi.js";
import { baliNusra } from "./bali_nusra.js";
import { maluku } from "./maluku.js";
import { papua } from "./papua.js";

export const indonesiaRegions = [
  ...sumatera,
  ...jawa,
  ...kalimantan,
  ...sulawesi,
  ...baliNusra,
  ...maluku,
  ...papua,
] as const;
