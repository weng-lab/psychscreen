import { TrackInteraction } from '../../modules/types';
export type TranscriptDisplay = "squish" | "pack";
export type TranscriptConfig = {
    assembly: string;
    version: number;
    geneName?: string;
    canonicalColor?: string;
    highlightColor?: string;
};
export type TranscriptData = TranscriptList[];
export type TranscriptList = {
    transcripts: Transcript[];
    strand: string;
    name?: string;
    id?: string;
};
export type Transcript = {
    id: string;
    name: string;
    coordinates: {
        start: number;
        end: number;
    };
    strand: string;
    exons?: Exon[];
    color?: string;
    tag?: string;
};
export type Exon = {
    coordinates: {
        start: number;
        end: number;
    };
    UTRs?: GenomicElement[];
};
export type GenomicElement = {
    coordinates: {
        start: number;
        end: number;
    };
};
export type RenderedTranscript = {
    transcript: Transcript;
    paths: {
        introns: string;
        exons: string;
    };
};
export type TranscriptRow = {
    y: number;
    transcripts: RenderedTranscript[];
};
export type TranscriptInput = {
    id: string;
    title: string;
    display?: TranscriptDisplay;
    height?: number;
    color?: string;
    config: TranscriptConfig;
};
export type TranscriptInteraction = TrackInteraction<Transcript>;
