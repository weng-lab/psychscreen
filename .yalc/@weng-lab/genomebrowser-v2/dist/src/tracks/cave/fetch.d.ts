import { TrackFetchContext } from '../../modules/types';
import { CaveConfig, CaveData } from './types';
export declare function fetchCave({ config, region, }: TrackFetchContext<CaveConfig>): Promise<CaveData>;
