import { BrowserRegion } from '../../modules/utils/region';
import { Highlight } from '../state/browserStore';
export type HighlightRect = {
    id: string;
    x: number;
    width: number;
    color: string;
    opacity: number;
};
export declare function getHighlightRects({ highlights, region, width, }: {
    highlights: Highlight[];
    region: BrowserRegion;
    width: number;
}): HighlightRect[];
