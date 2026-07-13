import { RefObject } from 'react';
import { AnyTrackInstance } from '../../modules/types';
import { SwapPreview, TrackFrameSwapProps } from './swapTypes';
export declare function useTrackSwap({ track, titleSize, disabled, onPreviewChange, onPreviewEnd, cloneRef, }: {
    track: AnyTrackInstance;
    titleSize: number;
    disabled?: boolean;
    onPreviewChange: (preview: SwapPreview) => void;
    onPreviewEnd: () => void;
    cloneRef: RefObject<SVGGElement | null>;
}): {
    svg: SVGSVGElement | null;
    isSwapping: boolean;
    swapProps: TrackFrameSwapProps;
    cloneSwapProps: TrackFrameSwapProps;
};
