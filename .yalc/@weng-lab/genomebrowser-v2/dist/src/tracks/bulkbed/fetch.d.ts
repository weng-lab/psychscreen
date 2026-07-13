import { TrackFetchContext } from '../../modules/types';
import { BulkBedConfig, BulkBedData } from './types';
export declare function fetchBulkBed({ config, region, }: TrackFetchContext<BulkBedConfig>): Promise<BulkBedData>;
