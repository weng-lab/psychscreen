import { TrackSelectCatalog, TrackSelectTrack } from '../schema/catalogSchema';
export type CatalogGridRow = {
    id: string;
    title: string;
    type: string;
    track: TrackSelectTrack;
    [field: string]: unknown;
};
export declare function getCatalogTrackId(catalogId: string, trackId: string): string;
export declare function getCatalogRows(catalog: Pick<TrackSelectCatalog, "id" | "tracks">): CatalogGridRow[];
export declare function getCatalogTrackIds(catalog: Pick<TrackSelectCatalog, "id" | "tracks">): Set<string>;
export declare function getCatalogTrackById(trackCatalogs: TrackSelectCatalog[]): Map<string, TrackSelectTrack>;
export declare function assertUniqueCatalogTrackIds(trackCatalogs: TrackSelectCatalog[]): void;
