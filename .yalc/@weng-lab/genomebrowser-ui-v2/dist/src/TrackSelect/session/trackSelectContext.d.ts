import { ReactNode } from 'react';
import { TrackSelectState } from './useTrackSelectState';
export declare function TrackSelectProvider({ value, children, }: {
    value: TrackSelectState;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTrackSelect(): {
    state: {
        trackCatalogs: import('../schema/catalogSchema').TrackSelectCatalog[];
        screen: "catalog-list" | "catalog-detail";
        activeCatalog: import('../schema/catalogSchema').TrackSelectCatalog;
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
