import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCCREs, getGenes, getICREs, getSNPs, getStudys } from "./queries";
import {
  ccreResultList,
  geneResultList,
  getCoordinates,
  icreResultList,
  isDomain,
  snpResultList,
  studyResultList,
} from "./utils";
import {
  AutocompleteProps,
  Box,
  Button,
  ButtonProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { GenomeSearchProps, Result } from "./types";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

/**
 * An autocomplete search component for genomic landmarks such as genes, SNPs, ICRs, and CCRs.
 * The props extends the MUI Autocomplete props, so you are able to adjust that component's props as well.
 * You can also use the slots and slotProps to customize the search's internal components, such as the input, button and the bounding box.
 * To use, pass in a list of the queries you want to run, and the assembly i.e. GRCh38 or mm10.
 * You must also provide a function to call when a result is selected, which will run when the user clicks the button.
 * @param props - extends MUI AutocompleteProps and includes additional props specific to this component
 */

const Search: React.FC<GenomeSearchProps> = ({
  queries,
  assembly,
  showiCREFlag,
  geneVersion,
  geneLimit,
  snpLimit,
  icreLimit,
  ccreLimit,
  studyLimit,
  onSearchSubmit,
  defaultResults,
  style,
  sx,
  slots,
  slotProps,
  ...autocompleteProps
}) => {
  // State variables
  const [inputValue, setInputValue] = useState("");
  const [selection, setSelection] = useState<Result | null>(null);
  const [results, setResults] = useState<Result[] | null>(
    defaultResults || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const searchGene = queries.includes("Gene");
  const searchSnp = queries.includes("SNP");
  const searchICRE = queries.includes("iCRE");
  const searchCCRE = queries.includes("cCRE");
  const searchCoordinate = queries.includes("Coordinate");
  const searchStudy = queries.includes("Study");

  const {
    data: icreData,
    refetch: refetchICREs,
    isFetching: icreFetching,
  } = useQuery({
    queryKey: ["icres", inputValue],
    queryFn: () => getICREs(inputValue, icreLimit || 3),
    enabled: false,
  });

  const {
    data: ccreData,
    refetch: refetchCCREs,
    isFetching: ccreFetching,
  } = useQuery({
    queryKey: ["ccres", inputValue, assembly],
    queryFn: () =>
      getCCREs(inputValue, assembly, ccreLimit || 3, showiCREFlag || false),
    enabled: false,
  });
  const {
    data: geneData,
    refetch: refetchGenes,
    isFetching: geneFetching,
  } = useQuery({
    queryKey: ["genes", inputValue, assembly],
    queryFn: () =>
      getGenes(
        inputValue,
        assembly,
        geneLimit || 3,
        geneVersion || assembly === "GRCh38" ? 29 : 25
      ),
    enabled: false,
  });

  const {
    data: snpData,
    refetch: refetchSNPs,
    isFetching: snpFetching,
  } = useQuery({
    queryKey: ["snps", inputValue, assembly],
    queryFn: () => getSNPs(inputValue, assembly, snpLimit || 3),
    enabled: false,
  });

  const {
    data: studyData,
    refetch: refetchStudies,
    isFetching: studyFetching,
  } = useQuery({
    queryKey: ["study", inputValue],
    queryFn: () => getStudys(inputValue, studyLimit || 3),
    enabled: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inputValue.length === 0) {
      setResults(null);
    } else {
      setResults([]);
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (searchGene && !isDomain(inputValue)) refetchGenes();
      if (assembly === "GRCh38") {
        if (searchICRE && inputValue.toLowerCase().startsWith("eh"))
          refetchICREs();
        if (searchCCRE && inputValue.toLowerCase().startsWith("eh"))
          refetchCCREs();
        if (searchSnp && inputValue.toLowerCase().startsWith("rs"))
          refetchSNPs();
        if (searchStudy && !isDomain(inputValue) && inputValue !== "")
          refetchStudies();
      } else {
        if (searchCCRE && inputValue.toLowerCase().startsWith("em"))
          refetchCCREs();
      }
    }, 100);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    setIsLoading(
      icreFetching ||
        ccreFetching ||
        geneFetching ||
        snpFetching ||
        studyFetching
    );
  }, [icreFetching, ccreFetching, geneFetching, snpFetching, studyFetching]);

  useEffect(() => {
    if (isLoading) return;
    const resultsList: Result[] = [];
    if (geneData && searchGene) {
      resultsList.push(...geneResultList(geneData, geneLimit || 3));
    }
    if (assembly === "GRCh38") {
      if (icreData && searchICRE && inputValue.toLowerCase().startsWith("eh")) {
        resultsList.push(
          ...icreResultList(icreData.data.iCREQuery, icreLimit || 3)
        );
      }
      if (ccreData && searchCCRE && inputValue.toLowerCase().startsWith("eh")) {
        resultsList.push(
          ...ccreResultList(ccreData.data.cCREAutocompleteQuery, ccreLimit || 3)
        );
      }
      if (snpData && searchSnp && inputValue.toLowerCase().startsWith("rs")) {
        resultsList.push(
          ...snpResultList(snpData.data.snpAutocompleteQuery, snpLimit || 3)
        );
      }
      if (studyData && searchStudy) {
        resultsList.push(
          ...studyResultList(studyData.data.getAllGwasStudies, geneLimit || 3)
        );
      }
    } else {
      if (ccreData && searchCCRE && inputValue.toLowerCase().startsWith("em")) {
        resultsList.push(
          ...ccreResultList(ccreData.data.cCREAutocompleteQuery, ccreLimit || 3)
        );
      }
    }

    if (isDomain(inputValue) && searchCoordinate) {
      resultsList.push(...getCoordinates(inputValue, assembly));
    }

    if (resultsList.length === 0) setResults(null);
    else setResults(resultsList);
  }, [
    isLoading,
    icreData,
    ccreData,
    geneData,
    snpData,
    studyData,
    searchGene,
    searchICRE,
    searchCCRE,
    searchSnp,
    searchCoordinate,
    searchStudy,
    inputValue,
    assembly,
    geneLimit,
    icreLimit,
    ccreLimit,
    snpLimit,
    studyLimit,
  ]);

  //Clear input on assembly change
  useEffect(() => {
    setInputValue("");
    setSelection(null);
  }, [assembly]);

  // Handle submit
  const onSubmit = useCallback(() => {
    if (selection && onSearchSubmit) onSearchSubmit(selection);
  }, [onSearchSubmit, selection]);

  // Handle enter key down
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        const exactMatch = results?.find(
          (x) => x.title?.toLowerCase() === inputValue.toLowerCase()
        );
        if (exactMatch) {
          setSelection(exactMatch);
          if (onSearchSubmit) onSearchSubmit(exactMatch);
        }
      }
    },
    [results, setSelection, onSearchSubmit]
  );

  const onChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Result
  ) => {
    setSelection(newValue);
    setInputValue(newValue?.title || ""); //needed so that the matching to inputValue works on enter press after selection
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={2}
      style={{ ...style }}
      sx={{ ...sx }}
      {...slotProps?.box}
    >
      <Autocomplete
        onChange={onChange}
        value={selection as Result}
        options={inputValue === "" ? defaultResults || [] : results || []}
        getOptionLabel={(option: Result) => {
          return option.title || "";
        }}
        groupBy={(option: Result) => option.type || ""}
        renderGroup={(params) => renderGroup(params, inputValue)}
        noOptionsText={noOptionsText(inputValue, isLoading, results)}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        renderOption={renderOptions}
        filterOptions={(x) => x}
        renderInput={(params) => {
          if (slots && slots.input) {
            return React.cloneElement(
              slots.input as React.ReactElement<TextFieldProps>,
              {
                ...params,
                onKeyDown: handleKeyDown,
                value: inputValue,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(event.target.value),
              }
            );
          }
          return (
            <TextField
              {...params}
              label="Search"
              onKeyDown={handleKeyDown}
              value={inputValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(event.target.value)
              }
              {...slotProps?.input}
            />
          );
        }}
        style={style}
        sx={sx}
        {...(autocompleteProps as Partial<
          AutocompleteProps<Result, false, true, false, React.ElementType>
        >)}
      />
      {/* Submit Button */}
      {slots && slots.button ? (
        React.cloneElement(
          slots.button as React.ReactElement<
            ButtonProps,
            string | React.JSXElementConstructor<any>
          >,
          {
            onClick: () => onSubmit(),
          }
        )
      ) : (
        <Button
          variant="contained"
          onClick={() => onSubmit()}
          {...slotProps?.button}
        >
          {slotProps?.button?.children || "Go"}
        </Button>
      )}
    </Box>
  );
};

/**
 * Renders the group of options. Orders the options by relevance to the input value.
 * @param params - The params object from the Autocomplete component
 * @param inputValue - The current input value
 * @returns A rendered group of options
 */
function renderGroup(params: any, inputValue: string) {
  // Sort items within each group by title match relevance
  const sortedOptions =
    Array.isArray(params.children) && !isDomain(inputValue)
      ? params.children.sort((a: any, b: any) => {
          const aTitle = (
            a.props?.children?.props?.children?.[0]?.props?.children || ""
          ).toLowerCase();
          const bTitle = (
            b.props?.children?.props?.children?.[0]?.props?.children || ""
          ).toLowerCase();
          const query = inputValue.toLowerCase();
          // Exact matches first
          if (aTitle === query && bTitle !== query) return -1;
          if (bTitle === query && aTitle !== query) return 1;

          // Starts with query second
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;

          // Contains query third
          if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
          if (bTitle.includes(query) && !aTitle.includes(query)) return 1;

          // Alphabetical order for equal relevance
          return aTitle.localeCompare(bTitle);
        })
      : params.children;

  return (
    <div key={params.key}>
      <Typography
        variant="subtitle2"
        sx={{ color: "gray", paddingInline: 1.5, paddingBlock: 1 }}
      >
        {params.group}
      </Typography>
      {sortedOptions}
    </div>
  );
}

/**
 * Renders the "no options" text.
 * @param inputValue - The current input value
 * @param isLoading - Whether the results are still loading
 * @param results - The results from the query
 * @returns A rendered "no options" text
 */
function noOptionsText(
  inputValue: string,
  isLoading: boolean,
  results: Result[] | null
) {
  return (
    <Typography variant="caption">
      {inputValue
        ? isLoading || results?.length === 0
          ? "Loading..."
          : results === null
          ? "No results found"
          : ""
        : "Start typing for options"}
    </Typography>
  );
}

/**
 * Renders the individual options.
 * @param props - The props object from the Autocomplete component
 * @param option - The current option
 * @returns A rendered option
 */
function renderOptions(props: any, option: Result) {
  return (
    <li
      {...props}
      key={`${option.type}-${option.title || "untitled"}-${
        option.description || "no-description"
      }`}
    >
      <Box>
        <Typography
          variant="body1"
          component="div"
          fontWeight="bold"
          sx={option.type === "Gene" ? { fontStyle: "italic" } : {}}
        >
          {option.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ whiteSpace: "pre-line" }}
        >
          {option.description}
        </Typography>
      </Box>
    </li>
  );
}

/**
 * Wraps the Search component in a QueryClientProvider.
 * @param props - The props object from the Autocomplete component
 * @returns A wrapped Search component
 */
const client = new QueryClient();
function GenomeSearch(props: GenomeSearchProps) {
  return (
    <QueryClientProvider client={client}>
      <Search {...props} />
    </QueryClientProvider>
  );
}

export default GenomeSearch;
