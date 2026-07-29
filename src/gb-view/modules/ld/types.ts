export type LDVariant = {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  isLead?: boolean;
};

export type LDConnection = {
  sourceId: string;
  targetId: string;
};

export type LDData = {
  variants: LDVariant[];
  connections: LDConnection[];
};

export type LDAnchor = Pick<LDVariant, "id" | "chromosome" | "start" | "end">;

export type LDConfig = {
  url: string;
  anchor?: LDAnchor;
  associatedVariantIds: string[];
  pinnedVariantId?: string;
};
