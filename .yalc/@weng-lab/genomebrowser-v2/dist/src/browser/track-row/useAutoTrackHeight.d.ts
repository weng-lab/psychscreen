export type AutoTrackHeightOptions = {
    rowHeight?: number;
    minHeight?: number;
};
export declare function useAutoTrackHeight(trackId: string, rowCount: number, { rowHeight, minHeight }?: AutoTrackHeightOptions): number;
