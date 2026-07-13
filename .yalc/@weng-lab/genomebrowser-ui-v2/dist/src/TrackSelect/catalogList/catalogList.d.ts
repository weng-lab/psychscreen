import { TrackSelectCatalog } from '../schema/catalogSchema';
type CatalogListProps = {
    catalogs: TrackSelectCatalog[];
    onCatalogSelect: (catalogId: string) => void;
};
export declare function CatalogList({ catalogs, onCatalogSelect }: CatalogListProps): import("react/jsx-runtime").JSX.Element;
export {};
