import { TrackFetchContext } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { LDConfig, LDData } from './types';
export declare function fetchLD({ config, region }: TrackFetchContext<LDConfig>): Promise<LDData>;
export declare function normalizeLdRows(rows: unknown, region: BrowserRegion): LDData;
