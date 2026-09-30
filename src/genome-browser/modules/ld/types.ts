export type LDVariant = {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  isSelected?: boolean;
};

export type LDRelationship = {
  id: string;
  rSquared: number;
};

export type LDConnection = {
  sourceId: string;
  targetId: string;
  rSquared: number;
};

export type LDData = {
  variants: LDVariant[];
  connections: LDConnection[];
};

export type LDAnchor = Pick<LDVariant, "id" | "chromosome" | "start" | "end">;

export type LDConfig = {
  url: string;
};

export type LDSelection = {
  anchor?: LDAnchor;
  relationships: LDRelationship[];
  status: "idle" | "loading" | "success" | "error";
  pinnedVariantId?: string;
};
