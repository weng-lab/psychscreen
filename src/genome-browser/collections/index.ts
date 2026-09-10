import interactions from "./single-cell-interactions.json";
import tracks from "./psychscreen.json";
import { BRAINOME_COLLECTION } from "./brainome";
import { MUKAMEL_COLLECTION } from "./mukamel";

export const TRACK_COLLECTIONS: unknown[] = [
  tracks,
  interactions,
  MUKAMEL_COLLECTION,
  BRAINOME_COLLECTION,
];
