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
};
export type TooltipStore = TooltipState & {
    show: (content: ReactElement, anchor: TooltipAnchor) => void;
    hide: () => void;
};
