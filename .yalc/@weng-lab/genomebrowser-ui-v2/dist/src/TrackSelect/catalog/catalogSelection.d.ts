import { TrackSelectCatalog } from '../schema/catalogSchema';
import { CatalogStoreTrack } from './catalogTypes';
export type SelectedByCatalog = Map<string, Set<string>>;
export declare function createSelectionFromTracks(trackCatalogs: TrackSelectCatalog[], tracks: CatalogStoreTrack[]): Map<string, Set<string>>;
export declare function countSelectedTracks(selectedByCatalog: SelectedByCatalog): number;
export declare function setCatalogSelection(selectedByCatalog: SelectedByCatalog, catalogId: string, selectedIds: Set<string>): Map<string, Set<string>>;
export declare function clearSelection(trackCatalogs: TrackSelectCatalog[], selectedByCatalog: SelectedByCatalog, catalogId?: string): Map<string, Set<string>>;
export declare function removeTrackIdsFromSelection(selectedByCatalog: SelectedByCatalog, trackIds: string[]): Map<string, Set<string>>;
