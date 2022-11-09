
import { gql, useQuery } from '@apollo/client';
import { associateBy } from 'queryz';
import React, { useMemo } from 'react';
import { EGene } from './SNPDetails';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography, CustomizedTable } from '@zscreen/psychscreen-ui-components';
const QUERY = gql`
    query q($id: [String!]) {
        gene(name_prefix: $id, assembly: "GRCh38") {
            name
            id
        }
    }
`;

type QueryResponse = {
    gene: {
        name: string;
        id: string;
    }[];
};
const EGeneTable: React.FC<{ genes: EGene[], snp: string }> = props => {
    
    const { data, loading } = useQuery<QueryResponse>(QUERY, { variables: { id: props.genes.map(x => x.gene.split('.')[0]) } });
    const genemap = useMemo( () => associateBy(props.genes, x => x.gene, x => x ), [ props ]);
    const genes = useMemo( () => associateBy(
        data?.gene || [],
        x => x.id,
        x => ({ ...genemap.get(x.id.split(".")[0]), name: x.name }) as EGene & { name: string }
    ), [ data, genemap ]);
    
    const egeneData  = data && data.gene && [ ...genes.keys() ].map(k => genes.get(k)! ).map((d)=>{
        return [{header: 'gene', value: d.name},
        {header: 'p-value', value: d.nominal_pval, render: <span> {d.nominal_pval < 0.001 ? d.nominal_pval.toExponential(3) : d.nominal_pval.toFixed(3)}</span> },
        {header: 'FDR', value: d.fdr, render:<span>{d.fdr < 0.001 ? d.fdr.toExponential(3) : d.fdr.toFixed(3)}</span>},
        {header: 'slope', value: d.slope, render:<span>{d.slope.toFixed(3)}</span>}
    ]
    })
    return (loading || (!egeneData)) ? <>
    <Typography
            type="body"
            size="large"
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
        >
                Loading Data...
        </Typography>
                        <br/>
    <CircularProgress color="inherit"/>
    </> : egeneData && egeneData.length>0 ? (
        <>

            <Typography  type="display" style={{ fontWeight: 500, fontSize: "28px" }}
            size="small">eGenes for {props.snp}:</Typography>
             
                <CustomizedTable style={{ width: "max-content" }}  tabledata={egeneData} />
              
            </>) : <>
            <Typography
                    type="display"
                    size="small"
                    style={{ fontWeight: 500, fontSize: "28px" }}
                > No eGenes have been identified for this SNP.</Typography>
            
            </>
            
        
    
}
export default EGeneTable;