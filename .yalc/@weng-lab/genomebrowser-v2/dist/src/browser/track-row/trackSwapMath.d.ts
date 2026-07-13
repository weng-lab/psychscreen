import { AnyTrackInstance } from '../../modules/types';
import { SwapPreview } from './swapTypes';
export declare function isSameSwapPreview(a: SwapPreview | null, b: SwapPreview): boolean;
export declare function getSwapPreview(id: string, tracks: AnyTrackInstance[], titleSize: number, deltaY: number): SwapPreview | null;
export declare function getSwapPreviewOffsetY(index: number, trackId: string, tracks: AnyTrackInstance[], titleSize: number, preview: SwapPreview | null): number;
export declare function getSwapOrder(id: string, tracks: AnyTrackInstance[], titleSize: number, deltaY: number): string[] | null;
