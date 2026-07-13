import { StoreApi, UseBoundStore } from 'zustand';
export type DataResult = {
    status: "success";
    data: unknown;
} | {
    status: "error";
    error: string;
};
export type DataState = {
    status: "loading";
} | DataResult;
export type DataStore = {
    data: Record<string, DataResult>;
    setData: (data: Record<string, DataResult>) => void;
    setTrackData: (trackId: string, state: DataResult) => void;
    clearTrack: (trackId: string) => void;
    clearAll: () => void;
};
export type DataStoreInstance = UseBoundStore<StoreApi<DataStore>>;
