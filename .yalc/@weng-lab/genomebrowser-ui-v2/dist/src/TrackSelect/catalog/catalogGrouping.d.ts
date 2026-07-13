export declare function groupRowsByField<Row extends Record<string, unknown>>(rows: Row[], field: string, getFallback: (row: Row) => string): Map<string, Row[]>;
export declare function formatCatalogValue(value: unknown, fallback: string): string;
