import { BrowserRegion } from '../../modules/utils/region';
export declare function expandRegion(region: BrowserRegion, multiplier: number): BrowserRegion;
export declare function getPanCommitRegion(region: BrowserRegion, width: number, deltaPx: number): BrowserRegion;
export declare function usePanController({ svg, region, trackWidth, getContentOffset, setContentOffset, setRegion, onPanStart, }: {
    svg: SVGSVGElement | null;
    region: BrowserRegion;
    trackWidth: number;
    getContentOffset: () => number;
    setContentOffset: (deltaPx: number) => void;
    setRegion: (region: BrowserRegion) => void;
    onPanStart: () => void;
}): {
    isPanLocked: boolean;
    panDrag: import('./usePanDrag').PanDragHandlers;
    unlockPan: () => void;
};
