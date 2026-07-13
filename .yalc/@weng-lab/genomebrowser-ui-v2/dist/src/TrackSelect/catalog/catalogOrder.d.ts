import { CatalogGridRow } from './catalogRows';
import { TrackSelectCatalog, TrackSelectView } from '../schema/catalogSchema';
export declare function getOrderedSelectedRows(catalog: TrackSelectCatalog, view: TrackSelectView, selectedIds: Set<string>): CatalogGridRow[];
