import { ReactNode } from 'react';
import { BrowserRegion } from '../../modules/utils/region';
export declare function SelectRegion({ svg, marginWidth, trackWidth, totalHeight, region, setRegion, disabled, children, }: {
    svg: SVGSVGElement | null;
    marginWidth: number;
    trackWidth: number;
    totalHeight: number;
    region: BrowserRegion;
    setRegion: (region: BrowserRegion) => void;
    disabled?: boolean;
    children?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
