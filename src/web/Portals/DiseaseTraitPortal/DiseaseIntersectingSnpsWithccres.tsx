import React, { useState, useEffect } from "react";
import { Grid, Container, GridProps, Divider, Link } from "@mui/material";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";

import { StyledButton, StyledTab } from "../../Portals/styles";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { GenomicRange } from "./Browser";
import { GROUPS } from "../SnpPortal/RegulatoryElements";

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

const formatEntry = [
  { header: "SNP ID", value: (d) => d.snpid },
  { header: "Chromosome", value: (d) => d.snp_chrom },
  { header: "Position", value: (d) => d.snp_stop.toLocaleString() },
  { header: "Reference Allele", value: (d) => d.referenceallele },
  { header: "Effect Allele", value: (d) => d.effectallele },
  { header: "Nearest Protein-Coding Gene", value: (d) => d.associated_gene },
  { header: "GWAS p-value", value: (d) => d.association_p_val },
  {
    header: "cCRE ID",
    value: (d) => d.ccreid,
    render: (d) => {  
      if(d.ccreid==".")
      {
        return <>{"NA"}</>
      }
      return(
      <Link
        rel="noopener noreferrer"
        target="_blank"
        href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${d.ccreid}&page=2`}
      >
        {d.ccreid}
      </Link>
    )},
  },
  { header: "cCRE class", value: (d) => GROUPS.get(d.ccre_class) },
];

const bcreformatEntry = [
  { header: "SNP ID", value: (d) => d.snpid },
  { header: "Chromosome", value: (d) => d.snp_chrom },
  { header: "Position", value: (d) => d.snp_stop.toLocaleString() },
  { header: "Reference Allele", value: (d) => d.referenceallele },
  { header: "Effect Allele", value: (d) => d.effectallele },
  { header: "Nearest Protein-Coding Gene", value: (d) => d.associated_gene },
  { header: "GWAS pe", value: (d) => d.association_p_val  },
  {
    header: "bCRE ID",
    value: (d) => d.ccreid,
    render: (d) => (
      <Link
        rel="noopener noreferrer"
        target="_blank"
        href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${d.ccreid}&page=2`}
      >
        {d.ccreid}
      </Link>
    ),
  },
  { header: "bCRE class", value: (d) => d.ccre_class },
  { header: "bCRE group", value: (d) => d.bcre_class },
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
              snp_start: r[1].split(":")[1],
              snp_stop: r[1].split(":")[1],
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
    <Grid container {...props}>
      <Grid item sm={12}>
        <Container style={{ marginTop: "30px", marginLeft: "100px" }}>
          {`Showing Significant SNPs in locus ${props.coordinates.chromosome}: ${props.coordinates.start}- ${props.coordinates.end}`}
          <br />
          <br />
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <StyledTab label="Significant SNPs"></StyledTab>
              {intersectingSnps.filter((i) => i.bcre_class !== ".").length >
                0 && (
                <StyledTab label="Significant SNPs Intersecting brain cCREs (b-cCREs)" />
              )}
            </Tabs>
            <Divider />
          </Box>
          {intersectingSnps && tabIndex === 0 && (
            <DataTable
              columns={formatEntry}
              rows={intersectingSnps.filter(
                (a) =>
                  a.snp_chrom === props.coordinates.chromosome &&
                  a.snp_start >= props.coordinates.start &&
                  a.snp_start <= props.coordinates.end
              )}
              searchable
              itemsPerPage={10}
              sortColumn={6}
            />
          )}
          {intersectingSnps.filter((i) => i.bcre_class !== ".") &&
            intersectingSnps.filter((i) => i.bcre_class !== ".").length > 0 &&
            tabIndex === 1 && (
              <>
                <br />
                {intersectingSnps.filter(
                  (i) => i.bcre_class === "adult-only"
                ) && (
                  <StyledButton
                    bvariant={page === 0 ? "filled" : "outlined"}
                    btheme="light"
                    onClick={() => setPage(0)}
                  >
                    Adult
                  </StyledButton>
                )}
                &nbsp;&nbsp;&nbsp;
                {intersectingSnps.filter(
                  (i) => i.bcre_class === "fetal-only"
                ) && (
                  <StyledButton
                    bvariant={page === 1 ? "filled" : "outlined"}
                    btheme="light"
                    onClick={() => setPage(1)}
                  >
                    Fetal
                  </StyledButton>
                )}
                &nbsp;&nbsp;&nbsp;
                {intersectingSnps.filter(
                  (i) => i.bcre_class === "shared-fetal-adult"
                ) && (
                  <StyledButton
                    bvariant={page === 2 ? "filled" : "outlined"}
                    btheme="light"
                    onClick={() => setPage(2)}
                  >
                    Shared
                  </StyledButton>
                )}
                <br />
                <br />
                {page === 0 && (
                  <DataTable
                    columns={bcreformatEntry}
                    rows={intersectingSnps
                      .filter((i) => i.bcre_class === "adult-only")
                      .filter(
                        (a) =>
                          a.snp_chrom === props.coordinates.chromosome &&
                          a.snp_start >= props.coordinates.start &&
                          a.snp_start <= props.coordinates.end
                      )}
                    itemsPerPage={10}
                    searchable
                    sortColumn={6}
                  />
                )}
                {page === 1 && (
                  <DataTable
                    columns={bcreformatEntry}
                    rows={intersectingSnps
                      .filter((i) => i.bcre_class === "fetal-only")
                      .filter(
                        (a) =>
                          a.snp_chrom === props.coordinates.chromosome &&
                          a.snp_start >= props.coordinates.start &&
                          a.snp_start <= props.coordinates.end
                      )}
                    itemsPerPage={10}
                    searchable
                    sortColumn={6}
                  />
                )}
                {page === 2 && (
                  <DataTable
                    columns={bcreformatEntry}
                    rows={intersectingSnps
                      .filter((i) => i.bcre_class === "adult/fetal-shared")
                      .filter(
                        (a) =>
                          a.snp_chrom === props.coordinates.chromosome &&
                          a.snp_start >= props.coordinates.start &&
                          a.snp_start <= props.coordinates.end
                      )}
                    itemsPerPage={10}
                    sortColumn={6}
                    searchable
                  />
                )}
              </>
            )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default DiseaseIntersectingSnpsWithccres;
