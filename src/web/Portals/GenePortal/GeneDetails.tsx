
import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { PORTALS } from '../../../App';
import SettingsIcon from '@mui/icons-material/Settings';
import { Divider, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ViolinPlot from './violin/violin';
import { gql, useQuery } from '@apollo/client';
import { groupBy } from 'queryz';
import { tissueColors } from './consts';
const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 100,
      label: '100',
    },
  ];

  
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
    const [tabIndex, setTabIndex] = useState(0);
    const ref = useRef<SVGSVGElement>(null);
    const { geneid } = state ? state : { geneid: ''} 


    console.log(geneid)
    const handleTabChange = (_: any, newTabIndex: number) => {
      setTabIndex(newTabIndex);
    };

    const { data } = useQuery(GTEX_GENES_QUERY, {		
      variables: {
              gene_id: geneid
          }
      })

  const grouped = useMemo(
      () =>
          groupBy(
              data?.gtex_genes || [],
              (x: any) => x.tissue_type_detail,
              x => x
          ),
      [data]
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
              
                <Grid item sm={2}>
                <Box sx={{ width: 250 }} style={{marginLeft:"20px"}}>
                <SettingsIcon />
                <Typography
                type="display"
                size="medium"
                style={{ display: "inline-block", fontWeight: 700, fontSize: "20px", textAlign:"left",  lineHeight: "15px", verticalAlign:"middle" }}
             
            >
              Visualization Settings
            </Typography>
            </Box>
            <br/>
            <Divider/>
            <br/>
            <Box sx={{ width: 250 }} style={{marginLeft:"20px"}}>
                <Typography
                        type="body"
                        size="small"
                >
                     log<sub>10</sub>FDR:
                </Typography>
                <Slider
                    aria-label="Custom marks"
                    defaultValue={100}
                //  getAriaValueText={valuetext}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={marks}
                />
            </Box>
                </Grid>
                <Grid item sm={0.5}></Grid>
                <Grid item sm={9.5}>
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
            <Typography  type="body"
                        size="small">The first tab</Typography>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            <Typography  type="body"
                        size="small">The second tab</Typography>
          </Box>
        )}
        {tabIndex === 2 && (
          <Box>
            <Typography  type="body"
                        size="small">The third tab</Typography>
          </Box>
        )}
        {tabIndex === 3 && (
          <Box>
            <Typography  type="body"
                        size="small">The fourth tab</Typography>
          </Box>
        )}
        {tabIndex === 4 && (
          <Box>
            <Typography  type="body"
                        size="small">GTex data</Typography>
                        {toPlot.size > 0 && (
                    <svg viewBox={`0 0 ${width} ${width / 2}`} style={{ width: '100%' }} ref={ref}>
                        <ViolinPlot
                            data={toPlot}
                            title="log10 TPM"
                            width={width}
                            height={width / 2}
                            colors={tissueColors
                                //new Map(sortedKeys.map((x, i) => [x, color(i)]))
                            }
                            domain={domain}
                            tKeys={54}
                           // onViolinMousedOut={() => setMousedOver({ inner: null, outer: null })}
                           // onViolinMousedOver={setMousedOver}
                           // mousedOver={mousedOver}
                        />
                    </svg>)}
          </Box>
        )}
      </Box>
                </Grid>
            </Grid>
        </>
    );
};
export default GeneDetails;