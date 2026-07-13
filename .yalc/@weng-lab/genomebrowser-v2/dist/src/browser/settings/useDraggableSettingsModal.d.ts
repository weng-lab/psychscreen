import { CSSProperties, PointerEvent } from 'react';
import { SettingsPosition } from './types';
export type DraggableSettingsModalResult = {
    position: SettingsPosition;
    handleProps: {
        onPointerDown: (event: PointerEvent<HTMLElement>) => void;
        onPointerMove: (event: PointerEvent<HTMLElement>) => void;
        onPointerUp: (event: PointerEvent<HTMLElement>) => void;
        onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
        style: CSSProperties;
    };
};
export declare function useDraggableSettingsModal(initialPosition: SettingsPosition): DraggableSettingsModalResult;
