# hg38 cytobands

`hg38-cytobands.json` contains the UCSC hg38 cytoBand table, converted to genomic-reader Cytoband records from genomebrowser's `apps/standalone/public/data/hg38.cytoBand.txt`. That source was retrieved from https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/cytoBand.txt.gz on 2026-08-31. Coordinates, names, and stains are preserved.

Only canonical chromosomes supported by the runtime hg38 assembly are included; alternate and unplaced contigs are omitted. The browser overview and disease risk-locus diagrams share this static data, avoiding repeated network requests for the same assembly.
