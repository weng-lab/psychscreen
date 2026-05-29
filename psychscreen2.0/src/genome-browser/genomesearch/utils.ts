import {
  CCREResponse,
  GeneResponse,
  ICREResponse,
  Result,
  ResultType,
  SnpResponse,
  StudyResponse,
} from "./types";

/**
 * Get the coordinates from a string input.
 * @param input - The input string to search for coordinates
 * @param assembly - The assembly to search for coordinates
 * @returns An array of results with the coordinates
 */
export function getCoordinates(input: string, assembly: string): Result[] {
  const results: Result[] = [];
  input = input.replace(/,/g, "");

  let chromosome: string, start: number, end: number;

  if (input.includes(":") && input.includes("-")) {
    chromosome = input.split(":")[0];
    start = parseInt(input.split(":")[1].split("-")[0]) || 0;
    end = parseInt(input.split(":")[1].split("-")[1]) || start + 1000;
  } else if (input.includes("\t")) {
    const [chr, startStr, endStr] = input.split("\t");
    chromosome = chr;
    start = parseInt(startStr);
    end = parseInt(endStr);
  } else {
    return results;
  }

  // Normalize chromosome name to use capital X and Y
  const normalizedChromosome = chromosome
    .replace(/chrx$/, "chrX")
    .replace(/chry$/, "chrY");

  const chrLength = chromosomeLengths[assembly][chromosome];
  if (end > start && chrLength && end <= chrLength) {
    results.push({
      title: `${normalizedChromosome}:${start.toLocaleString()}-${end.toLocaleString()}`,
      domain: {
        chromosome: normalizedChromosome,
        start: start,
        end: end,
      },
      description: `${normalizedChromosome}:${start.toLocaleString()}-${end.toLocaleString()}`,
      type: "Coordinate",
    });
  }

  return results;
}

// Common interface for result formatting options
interface ResultFormatterOptions<T> {
  getTitle: (result: T) => string;
  getDescription: (result: T) => string;
  type: string;
}

// Generic formatter function
function formatResults<
  T extends { coordinates: { chromosome: string; start: number; end: number } }
>(
  results: T[] | null,
  limit: number,
  options: ResultFormatterOptions<T>
): Result[] {
  if (!results) {
    return [];
  }
  return results.slice(0, limit).map((result) => ({
    title: options.getTitle(result),
    description: options.getDescription(result),
    domain: {
      chromosome: result.coordinates.chromosome,
      start: result.coordinates.start,
      end: result.coordinates.end,
    },
    type: options.type as ResultType,
  }));
}

// Specific formatters using the generic function
export function snpResultList(results: SnpResponse[], limit: number): Result[] {
  return formatResults(results, limit, {
    getTitle: (result) => result.id,
    getDescription: (result) =>
      `${result.coordinates.chromosome}:${result.coordinates.start}-${result.coordinates.end}`,
    type: "SNP",
  });
}

export function geneResultList(
  results: GeneResponse[],
  limit: number
): Result[] {
  return formatResults(results, limit, {
    getTitle: (result) => result.name,
    getDescription: (result) => {
      return `${result.description}\n${result.id}\n${result.coordinates.chromosome}:${result.coordinates.start}-${result.coordinates.end}`;
    },
    type: "Gene",
  });
}

export function studyResultList(
  results: StudyResponse[],
  limit: number
): Result[] {
  return results.slice(0, limit).map((result) => ({
    title: result.studyname,
    description: `${result.author.replace("_", " ")}.\n${result.pubmedid}`,
    domain: undefined,
    id: result.study,
    type: "Study",
  }));
}

export function icreResultList(
  results: ICREResponse[],
  limit: number
): Result[] {
  return formatResults(results, limit, {
    getTitle: (result) => result.accession,
    getDescription: (result) =>
      `${result.coordinates.chromosome}:${result.coordinates.start}-${result.coordinates.end}`,
    type: "iCRE",
  });
}

export function ccreResultList(
  results: CCREResponse[],
  limit: number
): Result[] {
  return formatResults(results, limit, {
    getTitle: (result) => result.accession,
    getDescription: (result) =>
      `${result.coordinates.chromosome}:${result.coordinates.start}-${
        result.coordinates.end
      }${result.isiCRE ? ", iCRE" : ""}`,
    type: "cCRE",
  });
}

// Object to store chromosome lengths for GRCh38 and mm10
const chromosomeLengths: { [key: string]: { [key: string]: number } } = {
  GRCh38: {
    chr1: 248956422,
    chr2: 242193529,
    chr3: 198295559,
    chr4: 190214555,
    chr5: 181538259,
    chr6: 170805979,
    chr7: 159345973,
    chr8: 145138636,
    chr9: 138394717,
    chr10: 133797422,
    chr11: 135086622,
    chr12: 133275309,
    chr13: 114364328,
    chr14: 107043718,
    chr15: 101991189,
    chr16: 90338345,
    chr17: 83257441,
    chr18: 80373285,
    chr19: 58617616,
    chr20: 64444167,
    chr21: 46709983,
    chr22: 50818468,
    chrX: 156040895,
    chrx: 156040895,
    chrY: 57227415,
    chry: 57227415,
  },
  mm10: {
    chr1: 195471971,
    chr2: 182113224,
    chr3: 160039680,
    chr4: 156508116,
    chr5: 151834684,
    chr6: 149736546,
    chr7: 145441459,
    chr8: 129401213,
    chr9: 124595110,
    chr10: 130694993,
    chr11: 122082543,
    chr12: 120129022,
    chr13: 120421639,
    chr14: 124902244,
    chr15: 104043685,
    chr16: 98207768,
    chr17: 94987271,
    chr18: 90702639,
    chr19: 61431566,
    chrX: 171031299,
    chrx: 171031299,
    chrY: 91744698,
    chry: 91744698,
  },
};

export function isDomain(input: string) {
  const hasTabs = input.includes("\t");
  const hasHyphens = input.includes("-");
  const hasChromosomeNumber = input.length >= 4 && /^[0-9xyXY]$/.test(input[3]);
  return (
    (hasTabs || hasHyphens) && input.startsWith("chr") && hasChromosomeNumber
  );
}
