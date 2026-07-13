import { ReactNode } from 'react';
export declare function BrowserSvgProvider({ children, svg, }: {
    children: ReactNode;
    svg: SVGSVGElement | null;
}): import("react/jsx-runtime").JSX.Element;
export declare function useBrowserSvg(): SVGSVGElement | null;
