import { MouseEvent, ReactNode } from 'react';
export type SwapPreview = {
    draggedId: string;
    currentIndex: number;
    targetIndex: number;
};
export type TrackFrameSwapProps = {
    onSwapMouseDown?: (event: MouseEvent<SVGRectElement>) => void;
    swapping: boolean;
    isDragClone: boolean;
};
export type SwapTrackRender = (props: TrackFrameSwapProps) => ReactNode;
