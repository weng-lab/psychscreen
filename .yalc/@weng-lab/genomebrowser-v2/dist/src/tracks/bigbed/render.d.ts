import { TrackRendererProps } from '../../modules/types';
import { BigBedConfig, BigBedRow } from './types';
export declare function DenseBigBed<Row extends BigBedRow = BigBedRow, Config extends BigBedConfig = BigBedConfig>({ config, color, data, region, width, height, }: TrackRendererProps<Config, Row[]>): import("react/jsx-runtime").JSX.Element;
export declare function SquishBigBed<Row extends BigBedRow = BigBedRow, Config extends BigBedConfig = BigBedConfig>({ id, config, color, data, region, width, height, }: TrackRendererProps<Config, Row[]>): import("react/jsx-runtime").JSX.Element;
