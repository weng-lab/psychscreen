import { AnyTrackInstance } from '../../modules/types';
import { SwapPreview, SwapTrackRender } from './swapTypes';
export declare function SwapTrack({ track, titleSize, disabled, onPreviewChange, onPreviewEnd, children, }: {
    track: AnyTrackInstance;
    titleSize: number;
    disabled?: boolean;
    onPreviewChange: (preview: SwapPreview) => void;
    onPreviewEnd: () => void;
    children: SwapTrackRender;
}): import("react/jsx-runtime").JSX.Element;
