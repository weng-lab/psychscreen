export type InteractionRole = "enhancer" | "promoter" | "variant" | "gene";

export type InteractionEndpoint = {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  role: InteractionRole;
};

export type GenomicInteraction = {
  id: string;
  source: InteractionEndpoint;
  target?: InteractionEndpoint;
  targetGene: string;
  targetTF?: string;
};

export type InteractionTooltipItem = {
  endpoint: InteractionEndpoint;
  relationships: GenomicInteraction[];
};

export type InteractionConfig = {
  url: string;
};
