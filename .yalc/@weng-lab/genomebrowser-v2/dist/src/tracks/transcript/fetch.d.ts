import { TrackFetchContext } from '../../modules/types';
import { TranscriptConfig, TranscriptData } from './types';
export declare function fetchTranscript({ config, region, }: TrackFetchContext<TranscriptConfig>): Promise<TranscriptData>;
