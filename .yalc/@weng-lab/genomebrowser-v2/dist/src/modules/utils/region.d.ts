export type BrowserRegion = {
    chromosome: string;
    start: number;
    end: number;
};
export declare function parseRegion(region: BrowserRegion | string): BrowserRegion;
export declare function formatLength(length: number): string;
