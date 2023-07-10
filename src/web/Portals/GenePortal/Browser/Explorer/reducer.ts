import { GenomeExplorerState, GenomicRange } from "./GenomeExplorer";

export enum GenomeExplorerActions {
  GENOME_EXPLORER_DOMAIN_CHANGED = "GENOME_EXPLORER_DOMAIN_CHANGED",
  GENOME_EXPLORER_REGION_HIGHLIGHTED = "GENOME_EXPLORER_REGION_HIGHLIGHTED",
}

export type GenomeExplorerDomainChangedAction = {
  type: GenomeExplorerActions.GENOME_EXPLORER_DOMAIN_CHANGED;
  domain: GenomicRange;
};

export type GenomeExplorerRegionHighlightedAction = {
  type: GenomeExplorerActions.GENOME_EXPLORER_REGION_HIGHLIGHTED;
  region: GenomicRange;
};

export type GenomeExplorerAction =
  | GenomeExplorerDomainChangedAction
  | GenomeExplorerRegionHighlightedAction;

export function genomeExplorerReducer(
  state: GenomeExplorerState,
  action: GenomeExplorerAction
): GenomeExplorerState {
  switch (action.type) {
    case GenomeExplorerActions.GENOME_EXPLORER_DOMAIN_CHANGED:
      return {
        ...state,
        position: {
          chromosome: action.domain.chromosome,
          start: Math.floor(action.domain.start),
          end: Math.ceil(action.domain.end),
        },
      };
    case GenomeExplorerActions.GENOME_EXPLORER_REGION_HIGHLIGHTED:
      return {
        ...state,
        nextHighlight: action.region,
      };
  }
}
