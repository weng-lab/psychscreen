import { ModuleRegistry } from '../../modules/registry';
import { AnyTrackInstance } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { DataResult } from './types';
export declare function fetchTrackData({ registry, track, region, }: {
    registry: ModuleRegistry;
    track: AnyTrackInstance;
    region: BrowserRegion;
}): Promise<DataResult>;
