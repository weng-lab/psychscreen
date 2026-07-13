import { TrackStore } from '@weng-lab/genomebrowser-v2';
import { TrackSelectCatalog } from '../schema/catalogSchema';
type TrackSelectScreen = "catalog-list" | "catalog-detail";
type TrackSelectStateOptions = {
    trackCatalogs: TrackSelectCatalog[];
    tracks: TrackStore["tracks"];
    registry: TrackStore["registry"];
    applyTrackChanges: TrackStore["applyTrackChanges"];
    maxTracks: number;
    onClose: () => void;
};
export type TrackSelectState = ReturnType<typeof useTrackSelectState>;
export declare function useTrackSelectState({ trackCatalogs, tracks, registry, applyTrackChanges, maxTracks, onClose, }: TrackSelectStateOptions): {
    state: {
        trackCatalogs: TrackSelectCatalog[];
        screen: TrackSelectScreen;
        activeCatalog: TrackSelectCatalog;
        activeView: {
            id: string;
            label: string;
            columns: {
                field: string;
                label?: string | undefined;
                description?: string | undefined;
                width?: number | undefined;
                hidden?: boolean | undefined;
            }[];
            grouping: string[];
            leaf: string;
            description?: string | undefined;
        } | undefined;
        activeViewIdByCatalog: Map<string, string>;
        selectedByCatalog: Map<string, Set<string>>;
        selectedTrackCount: number;
        limitDialogOpen: boolean;
        submitError: string | undefined;
    };
    actions: {
        selectCatalog: (catalogId: string) => void;
        backToCatalogs: () => void;
        selectView: (viewId: string) => void;
        selectActiveCatalogTracks: (selectedIds: Set<string>) => void;
        removeSelectedTrackIds: (trackIds: string[]) => void;
        clearDraftSelection: () => void;
        resetDraftSelection: () => void;
        submitSelection: () => void;
        cancel: () => void;
        closeLimitDialog: () => void;
    };
    meta: {
        maxTracks: number;
    };
};
export {};
