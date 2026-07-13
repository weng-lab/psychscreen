import { TrackStore } from '@weng-lab/genomebrowser-v2';
import { TrackSelectCatalog } from '../schema/catalogSchema';
type TrackSelectContentProps = {
    trackCatalogs: TrackSelectCatalog[];
    tracks: TrackStore["tracks"];
    registry: TrackStore["registry"];
    applyTrackChanges: TrackStore["applyTrackChanges"];
    maxTracks: number;
    onClose: () => void;
};
export declare function TrackSelectContent(props: TrackSelectContentProps): import("react/jsx-runtime").JSX.Element;
export {};
