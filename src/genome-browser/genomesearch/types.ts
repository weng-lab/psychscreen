import {
  AutocompleteProps,
  BoxProps,
  ButtonProps,
  TextFieldProps,
} from "@mui/material";

// Props for the GenomeSearch component
export type GenomeSearchProps = Partial<
  AutocompleteProps<Result, false, true, false, React.ElementType>
> & {
  assembly: "GRCh38" | "mm10";
  onSearchSubmit: (result: Result) => void;
  defaultResults?: Result[];
  showiCREFlag?: boolean;
  geneVersion?: number;
  // queries
  queries: ResultType[];
  geneLimit?: number;
  snpLimit?: number;
  icreLimit?: number;
  ccreLimit?: number;
  studyLimit?: number;

  // slot props for internal MUI components
  slotProps?: {
    input?: Partial<TextFieldProps>;
    button?: Partial<ButtonProps>;
    box?: Partial<BoxProps>;
  };

  // slots to replace internal MUI components
  slots?: {
    input?: React.ReactElement<TextFieldProps>;
    button?: React.ReactElement<ButtonProps>;
    box?: React.ReactElement<BoxProps>;
  };
};

export type Domain = {
  chromosome: string;
  start: number;
  end: number;
};

// Result types used to distinguish between different types of results
export type ResultType =
  | "Gene"
  | "SNP"
  | "Coordinate"
  | "iCRE"
  | "cCRE"
  | "Study";

// Result object used to display in the autocomplete dropdown
export type Result = {
  title?: string;
  description?: string;
  type?: ResultType;
  id?: string;
  name?: string;
  domain?: Domain;
};

// Response from the SNP GraphQL query
export interface SnpResponse {
  id: string;
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
}

// Response from the Gene GraphQL query
export interface GeneResponse {
  id: string;
  name: string;
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
  description: string;
}

// Response from the ICRE GraphQL query
export interface ICREResponse {
  accession: string;
  coordinates: Domain;
  celltypes: string[];
  rdhs: string;
}

// Response from the CCRE GraphQL query
export interface CCREResponse {
  accession: string;
  coordinates: Domain;
  celltypes: string[];
  isiCRE: boolean;
}

// Response from the GWAS GraphQL query
export interface StudyResponse {
  study: string;
  studyname: string;
  author: string;
  pubmedid: string;
  totalldblocks: number;
}
