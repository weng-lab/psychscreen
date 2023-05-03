import React, {useState, useCallback, useMemo, useEffect} from 'react';
import { ValuedPoint } from 'umms-gb/dist/utils/types';
import { RequestError } from 'umms-gb/dist/components/tracks/trackset/types';

import { GridProps } from '@mui/material';
import { GenomeBrowser, RulerTrack, UCSCControls, EmptyTrack,  DenseBigBed } from 'umms-gb';
import CytobandView from '../GenePortal/Browser/Explorer/Cytobands';
import { gql, useQuery } from "@apollo/client"
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";



type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
};

export const BIG_QUERY = gql`
query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
        data
        error {
            errortype,
            message
        }
    }
}
`;

export type BigResponseData = BigWigData[] | BigBedData[] | BigZoomData[] | ValuedPoint[];

export type BigResponse = {
    data: BigResponseData;
    error: RequestError;
}

export type BigQueryResponse = {
    bigRequests: BigResponse[];
};

const qtls = [
    [ "Astrocytes", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Astro_sig_QTLs.bigbed" ],
    
    [ "Chandelier", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Chandelier__Pvalb_sig_QTLs.bigbed" ],
   
   
    [ "Vip", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Vip_sig_QTLs.bigbed" ],
    
    [ "Sst", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Sst__Sst.Chodl_sig_QTLs.bigbed" ],
    
    [ "Pericytes", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/PC_sig_QTLs.bigbed" ],
    
    [ "Layer 2/3 Intratelencephalic projecting", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L2.3.IT_sig_QTLs.bigbed" ],

    [ "Layer 4 Intratelencephalic projecting ", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L4.IT_sig_QTLs.bigbed" ],

    [ "Layer 5/6 Near projecting ", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L5.6.NP_sig_QTLs.bigbed" ],

    [ "Layer 5 Intratelencephalic projecting", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L5.IT_sig_QTLs.bigbed" ],
    
    [ "Layer 6 Corticothalamic projecting ", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L6.CT_sig_QTLs.bigbed" ],
    [ "Layer 6 Intratelencephalic projecting ", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L6.IT_sig_QTLs.bigbed" ],

    [ "L6b", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/L6b_sig_QTLs.bigbed" ],

    [ "Lamp5.Lhx6", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Lamp5.Lhx6_sig_QTLs.bigbed" ],
    [ "Lamp5", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Lamp5_sig_QTLs.bigbed" ],
    [ "Microglia", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Micro.PVM_sig_QTLs.bigbed" ],
    [ "Oligodendrocytes", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/Oligo_sig_QTLs.bigbed" ],
    [ "Oligodendrocyte Precursor Cells", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/QTLs/OPC_sig_QTLs.bigbed" ]
    
    
]
    

const SingleCellQTLBrowser: React.FC<GridProps> = (props) => {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [ coordinates, setCoordinates ] = useState<GenomicRange>({chromosome:"chr11", start:  6191422, end:  6193124});
  //chr6:152600000-152610000
    const onDomainChanged = useCallback(
        (d: GenomicRange) => {
            const chr = d.chromosome === undefined ? coordinates.chromosome : d.chromosome;
            setCoordinates({ chromosome: chr, start: Math.round(d.start), end: Math.round(d.end) });
        }, [ ]
    );
    return(
    
    <>
                        <br/>
                        <div style={{ marginTop: "1em", width: "100%", textAlign: "center" }}>{`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`} </div>
                        <br/>
            <CytobandView
                innerWidth={1000}
                height={15}
                chromosome={coordinates.chromosome!}
                assembly="hg38"
                position={coordinates}
            /><br />
            <div style={{ textAlign: "center" }}>
                <UCSCControls onDomainChanged={onDomainChanged} domain={coordinates} withInput={false} />
            </div>
            <br />
            <GenomeBrowser
                svgRef={svgRef}
                domain={coordinates}                
                innerWidth={1400}
                width="100%"
                noMargin
                onDomainChanged={x => setCoordinates({ chromosome: coordinates.chromosome, start: Math.floor(x.start), end: Math.ceil(x.end) })}
            >
                
                <RulerTrack
                    domain={coordinates}
                    height={30}
                    width={1400}
                />
                <Trackset coordinates={coordinates} tracks={qtls}/>
            </GenomeBrowser>
        </>
    )
}

const BBTrack: React.FC<{ data: BigResponseData, url: string, title: string, color?: string, height: number, transform?: string, onHeightChanged?: (height: number) => void, domain: GenomicRange, svgRef?: React.RefObject<SVGSVGElement> }>
    = ({ data, url, title, height, domain, transform, onHeightChanged, svgRef, color }) => {        
        useEffect( () => onHeightChanged && onHeightChanged(height + 40), [ height, onHeightChanged ]);
       
        return (
            <g transform={transform}>
                <EmptyTrack
                    height={40}
                    width={1400}
                    transform="translate(0,8)"
                    id=""
                    text={title}
                />
                    <DenseBigBed
                        width={1400}
                        height={height}
                        domain={domain}
                        id="qtl"
                        transform="translate(0,40)"
                        data={data as BigBedData[]}
                        svgRef={svgRef}
                       /* tooltipContent={rect => { 
                            console.log(rect)
                            return (
                                <div style={{ border: "1px solid", borderColor: "#000000", backgroundColor: "#ffffff", padding: "5px" }}>
                                  {`TF: ${rect.name!!.split("_")[0]}`}
                                  <br/>
                                  {`TG: ${rect.name!!.split("_")[1]}`}
                                </div>
                              )
                        }}*/
                    />
                
            </g>
        );
};

const Trackset: React.FC<any> = props => {
    const height = useMemo( () => props.tracks.length * 80, [ props.tracks, props.coordinates ]); 
    const bigRequests = useMemo(() =>
     props.tracks.map(
       (url) => ({
         chr1: props.coordinates.chromosome,
         start: props.coordinates.start,
         end: props.coordinates.end,
         chr2: props.coordinates.chromosome,
         url: url[1],
         preRenderedWidth: 1400,
       })
      
     ), [props.coordinates]
   )
   useEffect( () => { props.onHeightChanged && props.onHeightChanged(height); }, [ props.onHeightChanged, height, props ]);
   const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests }});
  

    return loading || (data?.bigRequests.length || 0) < 2 ? <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." /> : (
        <>
            { (data?.bigRequests || []).map( (data, i) => (
                <BBTrack
                    height={40}
                    key={props.tracks[i][0]}
                    url={props.tracks[i][1]}
                    domain={props.coordinates}
                    title={props.tracks[i][0]}
                    svgRef={props.svgRef}
                    data={data.data}
                    transform={`translate(0,${i * 70})`}
                />
            ))}
        </>
    );
}

export default SingleCellQTLBrowser;