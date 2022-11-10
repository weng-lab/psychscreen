import React, { useState, useMemo } from 'react';
import { GridProps, Grid, Divider } from '@mui/material';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { PORTALS } from "../../../App";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GwasPage from './GwasPage';
import { gql, useQuery } from '@apollo/client';
import EGeneTable from './EGeneTable';
import RegulatoryElements from './RegulatoryElements';

export const QUERY = gql`
query SNP(
  $coordinates: [GenomicRangeInput]
  $rSquaredThreshold: Float!
  $id: [String]
  $population: Population!
  $chromosome: String
  $start: Int
  $end: Int
) {
  snpQuery(assembly: "hg38", coordinates: $coordinates, common: true) {
    id
    coordinates {
      chromosome
      start
      end
    }
  }
  fetal_eQTLQuery(population: SHARED, snp: $id) {
    gene
    nominal_pval
    fdr
    slope
  }
  snp: snpQuery(assembly: "hg38", snpids: $id) {
    linkageDisequilibrium(rSquaredThreshold: $rSquaredThreshold, population: $population) {
      id
      rSquared
      coordinates(assembly: "hg38") {
        chromosome
        start
        end
      }
    }
  }
  gene(chromosome: $chromosome, start: $start, end: $end, assembly: "GRCh38") {
    name
    strand
    transcripts {
      name
      strand
      exons {
          coordinates {
              chromosome
              start
              end
          }
      }
      coordinates {
        chromosome
        start
        end
      }
    }
  }
}
`;

export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
}
export type Transcript = {
    id: string;
    name: string;
    strand: string;
    coordinates: GenomicRange;
};

export type SNPQueryResponse = {
    snpQuery: {
        id: string;
        coordinates: GenomicRange;
    }[];
    gene: {
        name: string;
        strand: string;
        transcripts: Transcript[];
    }[];
};

export type EGene = {
    gene: string;
    nominal_pval: number;
    fdr: number;
    slope: number;
};

type QueryResponse = {
    snpQuery: {
        id: string;
        coordinates: GenomicRange;
    }[];
    snp: {
        linkageDisequilibrium: {
            id: string;
            rSquared: number;
            coordinates: GenomicRange;
        }[];
    }[];
    fetal_eQTLQuery: EGene[];
} & SNPQueryResponse;

export function expandCoordinates(coordinates: GenomicRange, l = 20000): GenomicRange {
    return {
        chromosome: coordinates.chromosome,
        start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
        end: coordinates.end + l
    };
}

const SNPDetails: React.FC<GridProps> = (props) => {
    const { snpid } = useParams();
    const navigate = useNavigate(); 
    const [ tabIndex, setTabIndex] = useState(0);
    const { state }: any = useLocation();
    const { chromosome, start, end } = state ? state : { chromosome: '', start: null, end: null } 
    const coordinates = useMemo( () => ({chromosome: chromosome,start: parseInt(start),end: parseInt(end)}), [ chromosome, start, end ]);
    const expandedCoordinates = useMemo( () => expandCoordinates(coordinates, 25000), [ coordinates ]);

    const handleTabChange = (_: any, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };
    const { data  } = useQuery<QueryResponse>(QUERY, {
        variables: {
            coordinates: expandedCoordinates,
            population:  "AFRICAN",
            rSquaredThreshold: 0.7,
            id: snpid,
            ...expandedCoordinates
        }, context: {
			clientName: 'psychscreen'
		}
    });
    return(
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid container {...props}> 
                <Grid item sm={1} lg={1.5} />
                <Grid item sm={9}>
                    <Typography type="headline" size="large" style={{ marginTop: "-0.6em", marginBottom: "0.2em" }}>
                        SNP Details: {snpid}
                    </Typography>
                </Grid>
                <Grid item sm={1} lg={1.5} />
                <Grid item sm={1} lg={1.5} />  
                <Grid item sm={9}>
                  <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        
                        <Tab label="eGenes" />
                        <Tab label="Regulatory Elements" />
                        <Tab label="GWAS" />
                    </Tabs>
                    <Divider/>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    {tabIndex===0 && snpid && <EGeneTable genes={data?.fetal_eQTLQuery || []} snp={snpid} />}
                    {tabIndex===1 && snpid &&  <RegulatoryElements
                            coordinates={expandCoordinates(coordinates, 0)}
                            assembly="grch38"
                        />}
                   { tabIndex===2 && snpid && <GwasPage id={snpid}/> }
                  </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default SNPDetails;