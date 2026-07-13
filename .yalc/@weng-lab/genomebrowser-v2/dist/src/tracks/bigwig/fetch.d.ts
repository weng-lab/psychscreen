import { TrackFetchContext } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { BigWigConfig, BigWigData } from './types';
export declare function fetchBigWig({ config, region, }: TrackFetchContext<BigWigConfig>): Promise<BigWigData[]>;
export declare function fetchBigWigRaw({ url, region }: {
    url: string;
    region: BrowserRegion;
}): Promise<BigWigData[]>;
