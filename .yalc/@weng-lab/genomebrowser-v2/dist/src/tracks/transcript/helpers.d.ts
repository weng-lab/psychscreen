import { RenderedTranscript, Transcript, TranscriptList } from './types';
type Feature<T> = T & {
    coordinates: {
        start: number;
        end: number;
    };
    name: string;
};
export declare function isManeSelectTranscript(tag: string | undefined | null): boolean;
export declare function mergeTranscripts(gene: TranscriptList): Transcript;
export declare function sortedTranscripts(genes: TranscriptList[]): Transcript[];
export declare function renderTranscript(transcript: Transcript, x: (value: number) => number, rowHeight: number, width: number): RenderedTranscript;
export declare function groupFeatures<T extends Feature<unknown>>(features: T[], x: (value: number) => number, fontSize: number, margin?: number): T[][];
export {};
