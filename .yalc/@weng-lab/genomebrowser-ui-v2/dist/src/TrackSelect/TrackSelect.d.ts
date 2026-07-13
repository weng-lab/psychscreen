import { TrackStoreInstance } from '@weng-lab/genomebrowser-v2';
export type TrackSelectProps = {
    open: boolean;
    onClose: () => void;
    trackCatalogs: unknown[];
    useTrackStore: TrackStoreInstance;
    title?: string;
    maxTracks?: number;
};
export default function TrackSelect({ open, onClose, trackCatalogs, useTrackStore, title, maxTracks, }: TrackSelectProps): import("react/jsx-runtime").JSX.Element;
