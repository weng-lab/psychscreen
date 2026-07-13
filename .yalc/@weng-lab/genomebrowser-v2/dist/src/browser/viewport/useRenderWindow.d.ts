import { AnyTrackInstance } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
export declare function getRenderWindow(region: BrowserRegion, trackWidth: number, overscanMultiplier: number): {
    targetRenderRegion: BrowserRegion;
    renderWidth: number;
};
export declare function createRenderWindowSignature(region: BrowserRegion, tracks: AnyTrackInstance[]): string;
export declare function useRenderWindow({ region, tracks, trackWidth, overscanMultiplier, }: {
    region: BrowserRegion;
    tracks: AnyTrackInstance[];
    trackWidth: number;
    overscanMultiplier: number;
}): {
    targetRenderRegion: BrowserRegion;
    displayedRenderRegion: BrowserRegion;
    renderWidth: number;
    dataKey: string;
    settleData: (key: string) => boolean;
};
