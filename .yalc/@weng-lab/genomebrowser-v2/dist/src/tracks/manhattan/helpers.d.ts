import { ManhattanPoint, ManhattanYDomain } from './types';
type ResolvedYDomain = {
    min: number;
    max: number;
};
export declare function resolveManhattanYDomain(points: ManhattanPoint[], configured?: ManhattanYDomain): ResolvedYDomain;
export declare function createManhattanYScale(domain: ResolvedYDomain, height: number): (value: number) => number;
export {};
