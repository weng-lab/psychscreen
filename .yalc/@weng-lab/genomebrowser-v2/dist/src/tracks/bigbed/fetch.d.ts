import { TrackFetchContext } from '../../modules/types';
import { BrowserRegion } from '../../modules/utils/region';
import { BigBedConfig, BigBedData, BigBedSchema, InferBigBedRow } from './types';
export declare function fetchBigBed({ config, region, }: TrackFetchContext<BigBedConfig>): Promise<BigBedData>;
export declare function fetchBigBedRows<TSchema extends BigBedSchema | undefined = undefined>({ url, schema, region, }: {
    url: string;
    schema?: TSchema;
    region: BrowserRegion;
}): Promise<InferBigBedRow<TSchema>[]>;
