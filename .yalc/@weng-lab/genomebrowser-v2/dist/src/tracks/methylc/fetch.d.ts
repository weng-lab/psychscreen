import { TrackFetchContext } from '../../modules/types';
import { MethylCConfig, MethylCData } from './types';
export declare function fetchMethylC({ config, region, }: TrackFetchContext<MethylCConfig>): Promise<MethylCData>;
