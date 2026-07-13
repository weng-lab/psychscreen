import { TrackSelectCatalog, TrackSelectView } from '../schema/catalogSchema';
type CatalogGridProps = {
    catalog: TrackSelectCatalog | undefined;
    view: TrackSelectView | undefined;
    selectedIds: Set<string>;
    onSelectionChange: (selectedIds: Set<string>) => void;
};
export declare function CatalogGrid({ catalog, view, selectedIds, onSelectionChange }: CatalogGridProps): import("react/jsx-runtime").JSX.Element;
export {};
