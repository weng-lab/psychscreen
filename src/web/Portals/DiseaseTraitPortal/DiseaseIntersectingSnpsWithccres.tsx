import React, { useState, useEffect } from "react";
import { Divider, Typography, Stack, Tab } from "@mui/material";
import { GridProps } from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GenomicRange } from "../GenePortal/AssociatedxQTL";
import { GROUPS } from "../SnpPortal/RegulatoryElements";
import { toScientificNotation } from "./utils";

export type GwasIntersectingSnpsWithCcres = {
  snpid: string;
  snp_chrom: string;
  snp_start: number;
  snp_stop: number;
  associated_gene: string;
  referenceallele: string;
  effectallele: string;
  association_p_val: any;
  ccreid: string;
  ccre_class: string;
  bcre_class: string;
};

type GwasIntersectingSnpsWithBcres = GwasIntersectingSnpsWithCcres & {
  bcre_group: string;
};

export type DiseaseIntersectingSnpsWithccresProps = GridProps & {
  disease: string;
  ccredata: GwasIntersectingSnpsWithCcres[];
  coordinates: GenomicRange;
  adult_bcredata: GwasIntersectingSnpsWithBcres[];
  fetal_bcredata: GwasIntersectingSnpsWithBcres[];
};

const formatEntry: TableColDef<GwasIntersectingSnpsWithCcres>[] = [
  {
    field: "snpid",
    headerName: "SNP ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/snp/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  { field: "snp_chrom", headerName: "Chromosome" },
  {
    field: "snp_stop",
    headerName: "Position",
    type: "number",
    valueFormatter: (value: number) => value.toLocaleString(),
  },
  { field: "referenceallele", headerName: "Reference Allele" },
  { field: "effectallele", headerName: "Effect Allele" },
  {
    field: "associated_gene",
    headerName: "Nearest Protein-Coding Gene",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/gene/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        <i>{params.value}</i>
      </a>
    ),
  },
  {
    field: "association_p_val",
    headerName: "GWAS p",
    renderHeader: () => (
      <Typography variant="body2">
        GWAS <i>P</i>
      </Typography>
    ),
    valueFormatter: (value: any) => toScientificNotation(+value, 1),
  },
  {
    field: "ccreid",
    headerName: "cCRE ID",
    renderCell: (params) =>
      params.value === "." ? (
        "NA"
      ) : (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${params.value}&page=2`}
          style={{ color: "#0000EE" }}
        >
          {params.value}
        </a>
      ),
  },
  {
    field: "ccre_class",
    headerName: "cCRE Class",
    valueFormatter: (value: string) => GROUPS.get(value) ?? value,
  },
];

const bcreformatEntry: TableColDef<GwasIntersectingSnpsWithCcres>[] = [
  {
    field: "snpid",
    headerName: "SNP ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/snp/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  { field: "snp_chrom", headerName: "Chromosome" },
  {
    field: "snp_stop",
    headerName: "Position",
    type: "number",
    valueFormatter: (value: number) => value.toLocaleString(),
  },
  { field: "referenceallele", headerName: "Reference Allele" },
  { field: "effectallele", headerName: "Effect Allele" },
  {
    field: "associated_gene",
    headerName: "Nearest Protein-Coding Gene",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/gene/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        <i>{params.value}</i>
      </a>
    ),
  },
  {
    field: "association_p_val",
    headerName: "GWAS p",
    renderHeader: () => (
      <Typography variant="body2">
        GWAS <i>P</i>
      </Typography>
    ),
    valueFormatter: (value: any) => toScientificNotation(+value, 1),
  },
  {
    field: "ccreid",
    headerName: "bCRE ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${params.value}&page=2`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  {
    field: "ccre_class",
    headerName: "bCRE Class",
    valueFormatter: (value: string) => GROUPS.get(value) ?? value,
  },
  { field: "bcre_class", headerName: "bCRE group" },
];

const DiseaseIntersectingSnpsWithccres: React.FC<
  DiseaseIntersectingSnpsWithccresProps
> = ({ ccredata, adult_bcredata, fetal_bcredata, ...props }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [intersectingSnps, setintersectingSnps] = useState<any>([]);

  useEffect(() => {
    fetch(`https://downloads.wenglab.org/${props.disease}.cCREs.txt`)
      .then((x) => x.text())
      .then((x: string) => {
        const q = x.split("\n");
        const bcres = q
          .filter((a) => !a.includes("variant id"))
          .filter((x) => x !== "")
          .map((a) => {
            let r = a.split("\t");
            let pval = r[4].split(".");
            let d =
              r[4] == "0.0"
                ? 0
                : pval.length > 1
                ? pval[0] + "." + pval[1][0] + "e" + r[4].split("e")[1]
                : pval[0];
            return {
              snpid: r[0],
              snp_chrom: r[1].split(":")[0],
              snp_start: +r[1].split(":")[1],
              snp_stop: +r[1].split(":")[1],
              associated_gene: r[5],
              referenceallele: r[2],
              effectallele: r[3],
              association_p_val: d,
              ccreid: r[6],
              ccre_class: r[7],
              bcre_class: r[8]
                .replace(" b-cCRE", "")
                .replace("shared-fetal-adult", "adult/fetal-shared"),
            };
          });
        setintersectingSnps(bcres);
      });
  }, [props.disease]);

  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography>
        {`Showing significant SNPs in locus ${
          props.coordinates.chromosome
        }: ${props.coordinates.start.toLocaleString()}-${props.coordinates.end.toLocaleString()}`}
      </Typography>

      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Significant SNPs"></Tab>
          {intersectingSnps.filter((i) => i.bcre_class !== ".").length > 0 && (
            <Tab label="Significant SNPs intersecting brain cCREs (b-cCREs)" />
          )}
        </Tabs>
        <Divider />
      </Box>
      {intersectingSnps && tabIndex === 0 && (
        <Table
          label="Significant SNPs"
          columns={formatEntry}
          rows={intersectingSnps.filter(
            (a) =>
              a.snp_chrom === props.coordinates.chromosome &&
              a.snp_start >= props.coordinates.start &&
              a.snp_start <= props.coordinates.end
          )}
          getRowId={(row) => `${row.snpid}-${row.ccreid}`}
          initialState={{
            sorting: { sortModel: [{ field: "association_p_val", sort: "asc" }] },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          divHeight={{ maxHeight: 750 }}
          emptyTableFallback="No significant SNPs found"
        />
      )}
      {intersectingSnps.filter((i) => i.bcre_class !== ".") &&
        intersectingSnps.filter((i) => i.bcre_class !== ".").length > 0 &&
        tabIndex === 1 && (
          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1}>
              {intersectingSnps.filter(
                (i) => i.bcre_class === "adult-only"
              ) && (
                <Button
                  variant={page === 0 ? "contained" : "outlined"}
                  onClick={() => setPage(0)}
                >
                  Adult
                </Button>
              )}
              {intersectingSnps.filter(
                (i) => i.bcre_class === "fetal-only"
              ) && (
                <Button
                  variant={page === 1 ? "contained" : "outlined"}
                  onClick={() => setPage(1)}
                >
                  Fetal
                </Button>
              )}
              {intersectingSnps.filter(
                (i) => i.bcre_class === "shared-fetal-adult"
              ) && (
                <Button
                  variant={page === 2 ? "contained" : "outlined"}
                  onClick={() => setPage(2)}
                >
                  Shared
                </Button>
              )}
            </Stack>

            {page === 0 && (
              <Table
                label="Significant SNPs Intersecting Adult b-cCREs"
                columns={bcreformatEntry}
                rows={intersectingSnps
                  .filter((i) => i.bcre_class === "adult-only")
                  .filter(
                    (a) =>
                      a.snp_chrom === props.coordinates.chromosome &&
                      a.snp_start >= props.coordinates.start &&
                      a.snp_start <= props.coordinates.end
                  )}
                getRowId={(row) => `${row.snpid}-${row.ccreid}`}
                initialState={{
                  sorting: { sortModel: [{ field: "association_p_val", sort: "asc" }] },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                divHeight={{ maxHeight: 750 }}
                emptyTableFallback="No significant SNPs intersecting adult b-cCREs found"
              />
            )}
            {page === 1 && (
              <Table
                label="Significant SNPs Intersecting Fetal b-cCREs"
                columns={bcreformatEntry}
                rows={intersectingSnps
                  .filter((i) => i.bcre_class === "fetal-only")
                  .filter(
                    (a) =>
                      a.snp_chrom === props.coordinates.chromosome &&
                      a.snp_start >= props.coordinates.start &&
                      a.snp_start <= props.coordinates.end
                  )}
                getRowId={(row) => `${row.snpid}-${row.ccreid}`}
                initialState={{
                  sorting: { sortModel: [{ field: "association_p_val", sort: "asc" }] },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                divHeight={{ maxHeight: 750 }}
                emptyTableFallback="No significant SNPs intersecting fetal b-cCREs found"
              />
            )}
            {page === 2 && (
              <Table
                label="Significant SNPs Intersecting Shared b-cCREs"
                columns={bcreformatEntry}
                rows={intersectingSnps
                  .filter((i) => i.bcre_class === "adult/fetal-shared")
                  .filter(
                    (a) =>
                      a.snp_chrom === props.coordinates.chromosome &&
                      a.snp_start >= props.coordinates.start &&
                      a.snp_start <= props.coordinates.end
                  )}
                getRowId={(row) => `${row.snpid}-${row.ccreid}`}
                initialState={{
                  sorting: { sortModel: [{ field: "association_p_val", sort: "asc" }] },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                divHeight={{ maxHeight: 750 }}
                emptyTableFallback="No significant SNPs intersecting shared b-cCREs found"
              />
            )}
          </Stack>
        )}
    </Stack>
  );
};
export default DiseaseIntersectingSnpsWithccres;
