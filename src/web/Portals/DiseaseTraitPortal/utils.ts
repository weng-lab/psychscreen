import { GenomicRange } from "../GenePortal/AssociatedxQTL";

function compare(a: GenomicRange, b: GenomicRange): number {
  const ca = +a
    .chromosome!.replace(/chr/g, "")
    .replace(/X/g, "23")
    .replace(/Y/g, "24");
  const cb = +b
    .chromosome!.replace(/chr/g, "")
    .replace(/X/g, "23")
    .replace(/Y/g, "24");
  if (ca < cb) return -1;
  if (ca > cb) return 1;
  return a.start < b.start ? -1 : a.start === b.start ? 0 : 1;
}

export function riskLoci(
  snps: (GenomicRange & { p: number })[],
  trait?: string
): (GenomicRange & { count: number; minimump: number })[] {
  const expandedCoordinates = snps
    .map((x) => ({
      chromosome: x.chromosome,
      start: x.start - 1500000 < 0 ? 0 : x.start - 1500000,
      end: x.end + 1500000,
      p: x.p,
    }))
    .sort(compare);

  const riskLoci: (GenomicRange & { count: number; minimump: number })[] = [];
  expandedCoordinates.forEach((r, i) => {
    if (i === 0) {
      riskLoci.push({ ...r, count: 1, minimump: r.p });
      return;
    }
    const currentLocus = riskLoci[riskLoci.length - 1];
    if (r.chromosome !== currentLocus.chromosome) {
      riskLoci.push({ ...r, count: 1, minimump: r.p });
      return;
    }
    if (r.start < currentLocus.end) {
      currentLocus.end = r.end;
      ++currentLocus.count;
      if (r.p < currentLocus.minimump) currentLocus.minimump = r.p;
    } else riskLoci.push({ ...r, count: 1, minimump: r.p });
  });
  return riskLoci;
}

export function toScientificNotation(num: number, sigFigs?: number) {
  // Convert the number to scientific notation using toExponential
  let scientific = num.toExponential(sigFigs ?? undefined);
  
  // Split the scientific notation into the coefficient and exponent parts
  let [coefficient, exponent] = scientific.split('e');
  
  // Format the exponent part
  let expSign = exponent[0];
  exponent = exponent.slice(1);
  
  // Convert the exponent to a superscript string
  let superscriptExponent = exponent
    .split('')
    .map(char => '⁰¹²³⁴⁵⁶⁷⁸⁹'[char] || char)
    .join('');
  
  // Add the sign back to the exponent
  superscriptExponent = (expSign === '-' ? '⁻' : '') + superscriptExponent;
  
  // Combine the coefficient with the superscript exponent
  return coefficient + '×10' + superscriptExponent;
}
