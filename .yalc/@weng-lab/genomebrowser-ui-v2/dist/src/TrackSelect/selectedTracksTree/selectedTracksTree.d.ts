import { SelectedByCatalog } from '../catalog/catalogSelection';
import { TrackSelectCatalog } from '../schema/catalogSchema';
type SelectedTracksTreeProps = {
    trackCatalogs: TrackSelectCatalog[];
    selectedByCatalog: SelectedByCatalog;
    activeViewIdByCatalog: Map<string, string>;
    selectedCount: number;
    onRemoveTrackIds: (trackIds: string[]) => void;
};
export declare function SelectedTracksTree({ trackCatalogs, selectedByCatalog, activeViewIdByCatalog, selectedCount, onRemoveTrackIds, }: SelectedTracksTreeProps): import("react/jsx-runtime").JSX.Element;
export {};
