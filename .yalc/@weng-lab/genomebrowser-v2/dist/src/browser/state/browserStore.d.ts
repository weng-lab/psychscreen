import { StoreApi, UseBoundStore } from 'zustand';
import { BrowserRegion } from '../../modules/utils/region';
export type Highlight = {
    id: string;
    region: {
        chromosome?: string;
        start: number;
        end: number;
    };
    color: string;
    opacity?: number;
};
export type BrowserStoreInput = {
    region: BrowserRegion | string;
    marginWidth?: number;
    trackWidth?: number;
    fontSize?: number;
    titleSize?: number;
    highlights?: Highlight[];
};
export type BrowserStore = {
    region: BrowserRegion;
    marginWidth: number;
    trackWidth: number;
    fontSize: number;
    titleSize: number;
    highlights: Highlight[];
    setRegion: (region: BrowserRegion | string) => void;
    setTrackWidth: (trackWidth: number) => void;
    zoom: (factor: number, centerBase?: number) => void;
    addHighlight: (highlight: Highlight) => void;
    removeHighlight: (id: string) => void;
};
export type BrowserStoreInstance = UseBoundStore<StoreApi<BrowserStore>>;
export declare function createBrowserStore(input: BrowserStoreInput): BrowserStoreInstance;
