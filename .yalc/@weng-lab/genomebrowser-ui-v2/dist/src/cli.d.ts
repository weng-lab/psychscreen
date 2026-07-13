import { AnyTrackModule } from '@weng-lab/genomebrowser-v2';
export type TrackSelectCliConfig = {
    modules: readonly AnyTrackModule[];
    schema?: {
        outFile?: string;
        id?: string;
    };
};
export declare function defineTrackSelectConfig(config: TrackSelectCliConfig): TrackSelectCliConfig;
