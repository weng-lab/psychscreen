import { ModuleRegistry } from '../../modules/registry';
import { AnyTrackInstance } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { DataState, DataStoreInstance } from './types';
export declare function useTrackData({ useDataStore, registry, tracks, region, onSettled, }: {
    useDataStore: DataStoreInstance;
    registry: ModuleRegistry;
    tracks: AnyTrackInstance[];
    region: BrowserRegion;
    onSettled?: () => void;
}): {
    dataStates: Record<string, DataState>;
    isFetching: boolean;
};
