import { TrackRendererProps } from '../../modules/types';
import { BigWigConfig, BigWigData, RenderedBigWigPoint, YRange } from './types';
export declare function FullBigWig({ config, color, data, width, height, region, }: TrackRendererProps<BigWigConfig, BigWigData[]>): import("react/jsx-runtime").JSX.Element;
export declare function DenseBigWig({ config, color, data, width, height, region, }: TrackRendererProps<BigWigConfig, BigWigData[]>): import("react/jsx-runtime").JSX.Element;
export declare function getRenderedPoints(config: BigWigConfig, data: BigWigData[], region: TrackRendererProps<BigWigConfig, BigWigData[]>["region"], width: number): RenderedBigWigPoint[];
export declare function createSignalPaths(points: RenderedBigWigPoint[], range: YRange, height: number): {
    minPath: string;
    maxPath: string;
    clampHighPath: string;
    clampLowPath: string;
};
export declare function clamp(value: number, range: YRange): number;
