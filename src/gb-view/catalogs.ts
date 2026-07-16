import singleCellInteractions from "./single-cell-interactions.json";
import tracks from "./tracks.json";

export const MAIN_TRACK_CATALOGS: unknown[] = [tracks];
export const SINGLE_CELL_TRACK_CATALOGS: unknown[] = [
  tracks,
  singleCellInteractions,
];
