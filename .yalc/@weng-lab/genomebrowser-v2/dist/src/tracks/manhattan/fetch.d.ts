import { TrackFetchContext } from '../../modules/types';
import { BigBedRow } from '../bigbed/types';
import { ManhattanConfig, ManhattanData } from './types';
export declare function fetchManhattan({ config, region, }: TrackFetchContext<ManhattanConfig>): Promise<ManhattanData>;
export declare function normalizeManhattanRows(rows: BigBedRow[]): ManhattanData;
