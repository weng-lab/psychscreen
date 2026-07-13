import { TrackSelectCatalog, TrackSelectTrack } from '../schema/catalogSchema';
import { SelectedByCatalog } from './catalogSelection';
import { CatalogStoreTrack } from './catalogTypes';
export declare function getSelectionDiff({ trackCatalogs, tracks, selectedByCatalog, activeViewIdByCatalog, }: {
    trackCatalogs: TrackSelectCatalog[];
    tracks: CatalogStoreTrack[];
    selectedByCatalog: SelectedByCatalog;
    activeViewIdByCatalog: Map<string, string>;
}): {
    idsToRemove: string[];
    tracksToAdd: {
        id: string;
        track: TrackSelectTrack;
    }[];
};
