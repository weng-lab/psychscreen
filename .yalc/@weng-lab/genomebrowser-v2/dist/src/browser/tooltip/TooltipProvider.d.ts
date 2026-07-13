import { ReactNode } from 'react';
import { TrackTooltipComponent } from '../../modules/types';
export declare function TooltipProvider({ children, isDisabled, getTooltipComponent, }: {
    children: ReactNode;
    isDisabled?: () => boolean;
    getTooltipComponent: (type: string) => TrackTooltipComponent<any, any> | undefined;
}): import("react/jsx-runtime").JSX.Element;
