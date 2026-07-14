import { TrackRendererProps } from '../../modules/types';
import { LDConfig, LDData } from './types';
export declare function createFullLDRenderer<Config>(moduleType: string, getActiveVariantId?: (config: Config) => string | undefined, options?: {
    transformData?: (data: LDData, config: Config) => LDData;
    getPinnedVariantId?: (config: Config) => string | undefined;
}): (props: TrackRendererProps<Config, LDData>) => import("react/jsx-runtime").JSX.Element;
export declare const FullLD: (props: TrackRendererProps<LDConfig, LDData>) => import("react/jsx-runtime").JSX.Element;
