import { MousePosition } from './types';
export declare function useTooltip<Item, Config>({ type, config }: {
    type: string;
    config: Config;
}): {
    hide: () => void;
    show: (item: Item, position: MousePosition) => void;
};
