import { DataState } from '../data/types';
import { AnyTrackInstance } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { PanDragHandlers } from '../viewport/usePanDrag';
export declare function TrackStack({ tracks, dataStates, region, marginWidth, trackWidth, contentX, contentWidth, registerContentGroup, panDrag, isPanLocked, titleSize, startY, }: {
    tracks: AnyTrackInstance[];
    dataStates: Record<string, DataState>;
    region: BrowserRegion;
    marginWidth: number;
    trackWidth: number;
    contentX?: number;
    contentWidth?: number;
    registerContentGroup?: (node: SVGGElement) => () => void;
    panDrag?: PanDragHandlers;
    isPanLocked?: boolean;
    titleSize: number;
    startY: number;
}): import("react/jsx-runtime").JSX.Element[];
