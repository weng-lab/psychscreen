import { StoreApi, UseBoundStore } from 'zustand';
export type ContextMenuPosition = {
    x: number;
    y: number;
};
export type ContextMenuStore = {
    open: boolean;
    trackId?: string;
    position: ContextMenuPosition;
    openContextMenu: (trackId: string, position: ContextMenuPosition) => void;
    closeContextMenu: () => void;
};
export type ContextMenuStoreInstance = UseBoundStore<StoreApi<ContextMenuStore>>;
export declare function createContextMenuStore(): ContextMenuStoreInstance;
