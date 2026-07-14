import { ReactElement } from 'react';
export type MousePosition = {
    clientX: number;
    clientY: number;
};
export type TooltipAnchor = {
    x: number;
    y: number;
};
export type TooltipState = {
    isVisible: boolean;
    content: ReactElement | undefined;
    anchor: TooltipAnchor;
    owner: string | undefined;
};
export type TooltipStore = TooltipState & {
    show: (owner: string, content: ReactElement, anchor: TooltipAnchor) => void;
    hide: (owner: string) => void;
};
