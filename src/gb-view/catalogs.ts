import singleCellInteractions from "./single-cell-interactions.json";
import tracks from "./tracks.json";
import { BRAINOME_TRACK_CATALOG } from "./brainome-catalog";
import { MUKAMEL_TRACK_CATALOG } from "./mukamel-catalog";

export const MAIN_TRACK_CATALOGS: unknown[] = [
  tracks,
  MUKAMEL_TRACK_CATALOG,
  BRAINOME_TRACK_CATALOG,
];
export const SINGLE_CELL_TRACK_CATALOGS: unknown[] = [
  ...MAIN_TRACK_CATALOGS,
  singleCellInteractions,
];
