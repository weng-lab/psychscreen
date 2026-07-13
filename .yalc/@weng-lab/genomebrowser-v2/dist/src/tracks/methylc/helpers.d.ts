import { BrowserRegion } from '../../modules/utils/region';
import { YRange } from '../bigwig/types';
import { MethylCData, MethylCRenderedPoint } from './types';
export declare function condenseMethylCChannels(data: MethylCData, region: BrowserRegion, width: number): MethylCRenderedPoint[][];
export declare function generateSignal2(data: MethylCRenderedPoint[], height: number, color: string, inverted?: boolean, customRange?: YRange, coverageData?: MethylCRenderedPoint[], requireCoverage?: boolean): {
    indicator: import("react/jsx-runtime").JSX.Element;
    values: import("react/jsx-runtime").JSX.Element;
} | null;
export declare function generateLineGraph(data: MethylCRenderedPoint[], height: number, color: string, inverted?: boolean, customRange?: YRange): import("react/jsx-runtime").JSX.Element | null;
export declare function getMethylCRange(channels: MethylCRenderedPoint[][]): YRange;
