import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Typography, Button } from '@zscreen/psychscreen-ui-components';
import { PORTALS } from '../../../App';
import { Divider, Grid, TextField, Box, Tabs, Tab } from '@mui/material';
import ViolinPlot from './violin/violin';
import { gql, useQuery } from '@apollo/client';
import { groupBy } from 'queryz';
import { tissueColors } from './consts';
import OpenTarget from './OpenTarget';
import AssociatedxQTL from './AssociatedxQTL';
import GeneExpressionPage from './GeneExpression';
import Browser from './Browser/Browser';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import GeneOverview from './GeneOverview';
import SingleCell from './SingleCell';
  
type GTExGeneQueryResponse = {
    gtex_genes: {
        val: number;
        gene_id: string;
        description: string;
        tissue_type: string;
        tissue_type_detail: string;
    }[];
};

const GTEX_GENES_QUERY= gql`
  query gtexgenes( $gene_id: [String]!){
      gtex_genes(gene_id: $gene_id) {
          val 
          gene_id
          description
          tissue_type
          tissue_type_detail
      }
  }
`  

const GENE_ID_QUERY = `
query ($assembly: String!,  $name_prefix: [String!]) {
  gene(assembly: $assembly, name_prefix: $name_prefix) {
    name
    id
  }
}
`

const GeneDetails: React.FC = (props) => {
    const { gene } = useParams();
    const { state }: any = useLocation();
    console.log(useLocation())
    const navigate = useNavigate();  
    const [ tabIndex, setTabIndex ] = useState(0);
    const ref = useRef<SVGSVGElement>(null);
    const [ tissueCategory, setTissueCategory] = React.useState<string | null>('granular');
    let { geneid, chromosome, start, end } = state ? state : { geneid: '', chromosome: '', start: null, end: null };
    const [ partialGeneId, setPartialGeneId ] = useState<string | null>(null);
    const [ trueGeneId, setTrueGeneId ] = useState<string | null>(null);
    const [ trueGeneName, setTrueGeneName ] = useState<string | null>(null);
    if (trueGeneId) geneid = trueGeneId;

    const handleTissueCategory = (
        _: any,
        newTissueCategory: string | null,
    ) => {
        setTissueCategory(newTissueCategory);
    };

    const handleTabChange = (_: any, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };

    const onGeneChange = React.useCallback(
      async (value: any) => {
          
          const response = await fetch('https://ga.staging.wenglab.org/graphql', {
              method: 'POST',
              body: JSON.stringify({
                  query: GENE_ID_QUERY,
                  variables: {
                    name_prefix: [value],
                    assembly: "GRCh38"
                  },
              }),
              headers: { 'Content-Type': 'application/json' },
          });
          const geneID = (await response.json()).data?.gene;          
          setTrueGeneName(value)
          setTrueGeneId(geneID[0].id.split(".")[0])
      },
      []
  );
    const { data } = useQuery<GTExGeneQueryResponse>(GTEX_GENES_QUERY, {		
        variables: {
            gene_id: geneid
        },
        skip: geneid === ''
    });
  const grouped = useMemo(
      () =>
          groupBy(
              data?.gtex_genes || [],
              x => tissueCategory === 'granular' ? x.tissue_type_detail : x.tissue_type,
              x => x
          ),
      [ data,tissueCategory ]
  );

  const sortedKeys = useMemo(
      () => (
          [...grouped.keys()]
              .filter(x => x !== null && grouped.get(x)!)
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      ),
      [grouped]
  );

  const toPlot = useMemo(
      () => new Map(sortedKeys.map(x => [
          x,
          new Map([[
              'all',
              grouped.get(x)!.flatMap(x => x.val).filter(x => x !== undefined).map(x => Math.log10(x! + 0.01)),
          ]]),
      ] as [string, Map<string, number[]>]).filter(x => x[1].get('all')!.length > 1)),
      [sortedKeys, grouped]
  );
 
  const domain: [number, number] = useMemo(() => {
      const values = [ ...toPlot.values() ].flatMap(x => x.get('all')!);
      return [ Math.log10(0.001), Math.max(...values) + 0.5 ];
  }, [toPlot]);
  const width = useMemo(() => {
      const keys = [ ...toPlot.keys() ].length;
      return (54 + (keys < 27 ? 27 : keys)) * 200;
  }, [toPlot]);
 
  return (
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
                        <img alt="DNA" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Font_Awesome_5_solid_dna.svg/640px-Font_Awesome_5_solid_dna.svg.png" width="1.7%" />
                        &nbsp;Gene Details: {trueGeneName || gene}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        <span style={{ marginRight: "10px" }}>Switch to another gene:</span>
                        <TextField variant="standard" onChange={(e) => setPartialGeneId(e.target.value)} />
                        <Button onClick={() => onGeneChange(partialGeneId)} variant="outlined" bvariant="filled" btheme="light">Go</Button>
                    </div>
                </Grid>
                <Grid item sm={1} lg={1.5} />
                <Grid item sm={12} style={{ marginBottom: "10px" }} />
                <Grid item sm={1} lg={1.5} />  
                <Grid item sm={9}>
                  <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Brain (Epi)genome Browser" />
                        <Tab label="Brain Single Cell Expression" />
                        <Tab label="Tissue Expression (GTEx)" /> 
                        <Tab label="Brain Specificity" />                        
                        <Tab label="Brain eQTLs and bCREs" />
                        
                        { null && <Tab label="Open Target" /> }
                    </Tabs>
                    <Divider/>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    { tabIndex === 3 ? (
                      <Box>
                        <GeneOverview gene={trueGeneName || gene} />
                      </Box>
                    ) : tabIndex === 0 ? (
                      <Box>
                        <Browser
                          name={trueGeneName?.toUpperCase() || gene}
                          coordinates={{ chromosome, start: +start, end: +end }}
                        />
                      </Box>
                    ) : tabIndex === 3 && 0>1 ? (
                      <Box>
                        <GeneExpressionPage id={trueGeneId || geneid}/>
                      </Box>
                    ) : tabIndex === 4 ? (
                      <Box>
                        <AssociatedxQTL name={trueGeneName?.toUpperCase() || gene} coordinates={ {chromosome: chromosome,start: parseInt(start),end: parseInt(end)}
                        }/>
                      </Box>
                    ) : tabIndex === 5 ? (
                      <Box>
                        <Typography  type="body"
                                    size="small">
                              <OpenTarget id={trueGeneId || geneid}/>
                        </Typography>
                      </Box>
                    ) : tabIndex === 1 ? (
                      <Box>
                          <SingleCell gene={trueGeneName?.toUpperCase() || gene || "APOE"} />
                      </Box>
                    ) : tabIndex === 2 ? (
                      <Box>
                        {(data &&  data?.gtex_genes.length === 0 )  ? <Typography type="body" size="large">
                          No GTex data found for {trueGeneName?.toUpperCase() || gene}
                        </Typography> : (
                          <>
                                <Typography type="body" size="large">Group By: </Typography>
                                <br/>
                                <ToggleButtonGroup size={"small"} value={tissueCategory} exclusive onChange={handleTissueCategory}>
                                    <ToggleButton value="broad">
                                        Broad Tissue Category
                                    </ToggleButton>
                                    <ToggleButton value="granular">
                                        Granular Tissue Category
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <svg viewBox={`0 0 ${width} ${width / 2}`} style={{ width: '100%' }} ref={ref}>
                                    <ViolinPlot
                                        data={toPlot}
                                        title="log10 TPM"
                                        width={width}
                                        height={width / 2}
                                        colors={tissueColors}
                                        domain={domain}
                                        tKeys={54}
                                    />
                                </svg>
                          </>)}
                      </Box>
                    ) : null }
                  </Box>
                </Grid>
            </Grid>
      </>
  );
};
export default GeneDetails;
