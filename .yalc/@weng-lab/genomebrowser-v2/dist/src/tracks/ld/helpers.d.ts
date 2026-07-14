import { BrowserRegion } from '../../modules/utils/region';
import { LDConnection, LDVariant } from './types';
export type RenderedLDVariant = {
    variant: LDVariant;
    centerX: number;
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function layoutLdVariants(variants: LDVariant[], region: BrowserRegion, width: number, height: number, options?: {
    minWidth?: number;
    prominentId?: string;
}): RenderedLDVariant[];
export declare function getActiveLdConnections(connections: LDConnection[], activeId: string | null): LDConnection[];
export declare function createLdArcPath(source: RenderedLDVariant, target: RenderedLDVariant, trackHeight: number): string;
export declare function togglePinnedLdVariant(pinnedId: string | null, clickedId: string): string | null;
