
import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { PORTALS } from '../../../App';
import { Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
const GeneDetails: React.FC = (props) => {
    const { gene } = useParams();
    const { state }: any = useLocation();
    const navigate = useNavigate();  
    const [ tabIndex, setTabIndex] = useState(0);
    const ref = useRef<SVGSVGElement>(null);
    const [ tissueCategory, setTissueCategory] = React.useState<string | null>('granular');
    const { geneid, chromosome, start, end } = state ? state : { geneid: '', chromosome: '', start: null, end: null } 

    
    const handleTissueCategory = (
      _: any,
      newTissueCategory: string | null,
    ) => {
      setTissueCategory(newTissueCategory);
    };

    const handleTabChange = (_: any, newTabIndex: number) => {
      setTabIndex(newTabIndex);
    };

    const { data } = useQuery(GTEX_GENES_QUERY, {		
      variables: {
              gene_id: geneid
          },
          skip: geneid===''
      })

  const grouped = useMemo(
      () =>
          groupBy(
              data?.gtex_genes || [],
              (x: any) => tissueCategory==='granular' ? x.tissue_type_detail : x.tissue_type,
              x => x
          ),
      [data,tissueCategory]
  );


  const sortedKeys = useMemo(
      () =>
          [...grouped.keys()]
              .filter(
                  x =>
                      x !== null &&
                      grouped
                          .get(x)!
              )
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
      [grouped]
  );

  const toPlot = useMemo(
      () =>
          new Map(
              sortedKeys
                  .map(
                      x =>
                          [
                              x,
                              new Map([
                                  [
                                      'all',
                                      grouped
                                          .get(x)!
                                          .flatMap(x =>
                                              x.val
                                          )
                                          .filter(x => x !== undefined)
                                          .map(x => Math.log10(x! + 0.01)),
                                  ],
                              ]),
                          ] as [string, Map<string, number[]>]
                  )
                  .filter(x => x[1].get('all')!.length > 1)
          ),
      [sortedKeys, grouped]
  );
 
  const domain: [number, number] = useMemo(() => {
      const values = [...toPlot.values()].flatMap(x => x.get('all')!);
      return [Math.log10(0.001), Math.max(...values)+0.5];
  }, [toPlot]);
  const width = useMemo(() => {
      const keys = [...toPlot.keys()].length;
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
                <Grid item sm={12}>
                  <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Genome Browser" ></Tab>
                        <Tab label={gene + " Expression"} />
                        <Tab label="Associated xQTLs" />
                        <Tab label="Open Target" />
                        <Tab label="GTex" />
                    </Tabs>
                    <Divider/>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                    {tabIndex === 0 && (
                      <Box>
                        <Browser name={gene} coordinates={ {chromosome: chromosome,start: parseInt(start),end: parseInt(end)}}/>
                      </Box>
                    )}
                    {tabIndex === 1 && (
                      <Box>
                        <GeneExpressionPage id={geneid}/>
                      </Box>
                    )}
                    {tabIndex === 2 && (
                      <Box>
                        <AssociatedxQTL name={gene} coordinates={ {chromosome: chromosome,start: parseInt(start),end: parseInt(end)}
                        }/>
                      </Box>
                    )}
                    {tabIndex === 3 && (
                      <Box>
                        <Typography  type="body"
                                    size="small">
                              <OpenTarget id={geneid}/>
                        </Typography>
                      </Box>
                    )}
                    {tabIndex === 4 && (
                      <Box>
                        {(data &&  data?.gtex_genes.length === 0 )  ? <Typography type="body" size="large">
                          No GTex data found for {gene}
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
                    )}
                  </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default GeneDetails;