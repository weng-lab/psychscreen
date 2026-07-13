import { BrowserRegion } from '../../modules/utils/region';
import { BigWigData, RenderedBigWigPoint, YRange } from './types';
export declare function condenseBigWigData(data: BigWigData[], region: BrowserRegion, width: number): RenderedBigWigPoint[];
export declare function getBigWigRange(points: RenderedBigWigPoint[]): YRange;
export declare function applyFillWithZero(points: RenderedBigWigPoint[]): void;
export declare function getPointAtMouseX(points: RenderedBigWigPoint[], mouseX: number, width: number): RenderedBigWigPoint | undefined;
export declare function formatBigWigTooltip(point: RenderedBigWigPoint): string | undefined;
export declare function createYScale(range: YRange, height: number): (value: number) => number;
export declare function lighten(color: string, amount: number): string;
