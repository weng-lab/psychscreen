import { ReactNode } from 'react';
import { PanDragHandlers } from '../viewport/usePanDrag';
export declare function PanTrack({ panDrag, disabled, width, height, children, }: {
    panDrag?: PanDragHandlers;
    disabled: boolean;
    width: number;
    height: number;
    children: ReactNode;
}): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import('react').ReactPortal | import('react').ReactElement<unknown, string | import('react').JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
