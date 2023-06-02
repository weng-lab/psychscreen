import React, {useState, useCallback, useMemo, useEffect} from 'react';
import { ValuedPoint } from 'umms-gb/dist/utils/types';
import { RequestError } from 'umms-gb/dist/components/tracks/trackset/types';
import { GridProps } from '@mui/material';
import { GenomeBrowser, RulerTrack, UCSCControls, EmptyTrack, DenseBigBed } from 'umms-gb';
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

const grns = [
    [ "Astrocytes Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Ast_enhancer.bigbed" ],
    [ "Astrocytes Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Ast_promoter.bigbed" ],
    
    [ "Chandelier Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Chandelier_enhancer.bigbed" ],
    [ "Chandelier Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Chandelier_promoter.bigbed" ],
    
    [ "Endothelial cells Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/End_enhancer.bigbed" ],
    [ "Endothelial cells Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/End_promoter.bigbed" ],
    
    [ "Immune Cells Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Immune_enhancer.bigbed" ],
    [ "Immune Cells Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Immune_promoter.bigbed" ],
    
    [ "Vascular Leptomeningeal Cells Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/VLMC_enhancer.bigbed" ],
    [ "Vascular Leptomeningeal Cells Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/VLMC_promoter.bigbed" ],
    
    [ "Sncg Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Sncg_enhancer.bigbed" ],
    [ "Sncg Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Sncg_promoter.bigbed" ],
    
    [ "Vip Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Vip_enhancer.bigbed" ],
    [ "Vip Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Vip_promoter.bigbed" ],
    
    [ "Sst Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Sst_enhancer.bigbed" ],
    [ "Sst Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Sst_promoter.bigbed" ],
    
    [ "Pvalb Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Pvalb_enhancer.bigbed" ],
    [ "Pvalb Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Pvalb_promoter.bigbed" ],
    
    [ "Pax6 Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Pax6_enhancer.bigbed" ],
    [ "Pax6 Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Pax6_promoter.bigbed" ],
    
    [ "Oligodendrocytes Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Oli_enhancer.bigbed" ],
    [ "Oligodendrocytes Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Oli_promoter.bigbed" ],
    
    [ "Oligodendrocyte Precursor Cells Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/OPC_enhancer.bigbed" ],
    [ "Oligodendrocyte Precursor Cells Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/OPC_promoter.bigbed" ],
    
    [ "Microglia Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Mic_enhancer.bigbed" ],
    [ "Microglia Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Mic_promoter.bigbed" ],
    
    [ "Lamp5.Lhx6 Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Lamp5.Lhx6_enhancer.bigbed" ],
    [ "Lamp5.Lhx6 Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Lamp5.Lhx6_promoter.bigbed" ],
    
    [ "Lamp5 Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Lamp5_enhancer.bigbed" ],
    [ "Lamp5 Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/Lamp5_promoter.bigbed" ],
    
    [ "L6b Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6b_enhancer.bigbed" ],
    [ "L6b Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6b_promoter.bigbed" ],
    
    [ "Layer 6 Intratelencephalic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.IT_enhancer.bigbed" ],
    [ "Layer 6 Intratelencephalic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.IT_promoter.bigbed" ],
    
    [ "Layer 5 Intratelencephalic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.IT_enhancer.bigbed" ],
    [ "Layer 5 Intratelencephalic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.IT_promoter.bigbed" ],
    
    [ "Layer 4 Intratelencephalic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L4.IT_enhancer.bigbed" ],
    [ "Layer 4 Intratelencephalic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L4.IT_promoter.bigbed" ],
    
    [ "Layer 2/3 Intratelencephalic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L2.3.IT_enhancer.bigbed" ],
    [ "Layer 2/3 Intratelencephalic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L2.3.IT_promoter.bigbed" ],
    
    [ "Layer 5 Extratelencephalic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.ET_enhancer.bigbed" ],
    [ "Layer 5 Extratelencephalic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.ET_promoter.bigbed" ],
    
    [ "Layer 5/6 Near projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.6.NP_enhancer.bigbed" ],
    [ "Layer 5/6 Near projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L5.6.NP_promoter.bigbed" ],
    
    [ "Layer 6 Intratelencephalic projecting Car3 Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.IT.Car3_enhancer.bigbed" ],
    [ "Layer 6 Intratelencephalic projecting Car3 Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.IT.Car3_promoter.bigbed" ],
    
    [ "Layer 6 Corticothalamic projecting Enhancer", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.CT_enhancer.bigbed" ],
    [ "Layer 6 Corticothalamic projecting Promoter", "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/GRNs/L6.CT_promoter.bigbed" ],
]
    

const SingleCellGRNBrowser: React.FC<GridProps> = (props) => {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [ coordinates, setCoordinates ] = useState<GenomicRange>({chromosome:"chr11", start: 6080547, end: 6680547});
  
    const onDomainChanged = useCallback(
        (d: GenomicRange) => {
            const chr = d.chromosome === undefined ? coordinates.chromosome : d.chromosome;
            setCoordinates({ chromosome: chr, start: Math.round(d.start), end: Math.round(d.end) });
        }, [ ]
    );
    return(
    <>
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
                <Trackset coordinates={coordinates} tracks={grns}/>
            </GenomeBrowser>
        </>
    </>)
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
                        id="atc"
                        transform="translate(0,40)"
                        data={data as BigBedData[]}
                        svgRef={svgRef}
                        tooltipContent={rect => { 
                            console.log(rect)
                            return (
                                <div style={{ border: "1px solid", borderColor: "#000000", backgroundColor: "#ffffff", padding: "5px" }}>
                                  {`TF:${rect.name!!.split("_")[0]}`}
                                  <br/>
                                  {`TG:${rect.name!!.split("_")[1]}`}
                                </div>
                              )
                        }}
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

export default SingleCellGRNBrowser;