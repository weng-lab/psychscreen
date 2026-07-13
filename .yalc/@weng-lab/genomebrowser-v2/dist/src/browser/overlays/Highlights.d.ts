import { BrowserRegion } from '../../modules/utils/region';
export declare function Highlights({ region, marginWidth, renderWidth, contentX, browserWidth, totalHeight, registerContentGroup, }: {
    region: BrowserRegion;
    marginWidth: number;
    renderWidth: number;
    contentX: number;
    browserWidth: number;
    totalHeight: number;
    registerContentGroup?: (node: SVGGElement) => () => void;
}): import("react/jsx-runtime").JSX.Element | null;
