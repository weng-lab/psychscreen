export declare function useContentTransform(baseContentX: number): {
    getContentOffset: () => number;
    setContentOffset: (nextDeltaPx: number) => void;
    registerContentGroup: (node: SVGGElement) => () => void;
};
