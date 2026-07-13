import { MouseEvent, PointerEvent } from 'react';
export type PanDragHandlers = {
    isDragging: () => boolean;
    onPointerDown: (event: PointerEvent<SVGElement>) => boolean;
    onPointerMove: (event: PointerEvent<SVGElement>) => void;
    onPointerUp: (event: PointerEvent<SVGElement>) => void;
    onPointerCancel: (event: PointerEvent<SVGElement>) => void;
    onClickCapture: (event: MouseEvent<SVGElement>) => void;
};
type UsePanDragOptions = {
    disabled: boolean;
    svg: SVGSVGElement | null;
    getCurrentDelta: () => number;
    setDelta: (deltaPx: number) => void;
    onStart: () => void;
    onCommit: (deltaPx: number) => void;
    onCancel: () => void;
};
export declare function usePanDrag({ disabled, svg, getCurrentDelta, setDelta, onStart, onCommit, onCancel, }: UsePanDragOptions): PanDragHandlers;
export {};
