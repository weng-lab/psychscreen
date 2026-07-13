import { TooltipStore } from './types';
export type TooltipStoreInstance = ReturnType<typeof createTooltipStore>;
export declare function createTooltipStore(): import('zustand').UseBoundStore<import('zustand').StoreApi<TooltipStore>>;
