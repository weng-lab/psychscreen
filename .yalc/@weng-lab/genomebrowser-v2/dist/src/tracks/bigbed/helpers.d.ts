import { BigBedRow, RenderedBigBedRect } from './types';
export declare function renderDenseBigBedData<Row extends BigBedRow>(rows: Row[], x: (value: number) => number): RenderedBigBedRect<Row>[];
export declare function renderSquishBigBedData<Row extends BigBedRow>(rows: Row[], x: (value: number) => number): RenderedBigBedRect<Row>[][];
