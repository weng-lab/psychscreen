import { TrackSelectCatalog } from '../schema/catalogSchema';
export declare function getInitialViewIds(trackCatalogs: TrackSelectCatalog[]): Map<string, string>;
export declare function getActiveView(catalog: TrackSelectCatalog, activeViewIdByCatalog: Map<string, string>): {
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
};
