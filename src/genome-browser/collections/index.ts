import psychscreen from "./psychscreen-ccre-atlas.json";
import interactions from "./single-cell-regulatory-interactions.json";
import { ADULT_CORTEX_AGING_SEX_COLLECTION } from "./adult-cortex-aging-sex";
import { POSTNATAL_METHYLOME_DEVELOPMENT_COLLECTION } from "./postnatal-methylome-development";

export const TRACK_COLLECTIONS: unknown[] = [
  psychscreen,
  ADULT_CORTEX_AGING_SEX_COLLECTION,
  POSTNATAL_METHYLOME_DEVELOPMENT_COLLECTION,
  interactions,
];
