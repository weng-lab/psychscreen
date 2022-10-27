import { gql, useQuery } from '@apollo/client';
import { groupBy } from 'queryz';
import React, { useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@zscreen/psychscreen-ui-components';
import AdultFetalScatterPlot from './scatterplot/adult-fetal';

const QUERY = gql`
query q($name: [String]) {
    biosampleQuery(dataset: "werling2020") {
        id
        age
        fetal
        sex
    }
    expressionQuery(dataset: "werling2020", gene_id: $name) {
        biosample
        expression
    }
}
`;

type WerlingQueryResponse = {
    biosampleQuery: {
        id: string;
        age: number;
        fetal: boolean;
        sex: string;
    }[];
    expressionQuery: {
        biosample: string;
        expression: number;
    }[];
};

export type GeneExpressionPageProps = {
    id: string;
};

const GeneExpressionPage: React.FC<GeneExpressionPageProps> = props => {

    const { data, loading } = useQuery<WerlingQueryResponse>(QUERY, {
        variables: { name: props.id.split(".")[0] }, context: {
			clientName: 'psychscreen'
		}
    });
    const wBiosamples = useMemo( () => groupBy(data?.biosampleQuery || [], d => d.id, x => x), [ data ]);
    const formattedExpression = useMemo( () => data?.expressionQuery.map(
        q => ({
            assay_term_name: "total RNA-seq",
            diagnosis: "Control",
            study: "Werling et. al. 2020",
            sex: wBiosamples.get(q.biosample)![0].sex === "male" ? 'M' : 'F',
            agedeath_adult: wBiosamples.get(q.biosample)![0].fetal ? null : wBiosamples.get(q.biosample)![0].age,
            agedeath_fetus: wBiosamples.get(q.biosample)![0].fetal ? wBiosamples.get(q.biosample)![0].age : null,
            gene_quantification_files: [{
                quantifications: [{
                    tpm: q.expression
                }]
            }]
        })
    ) || [], [ data ]);

    const legendContent = ( _: string[], keys: string[] ) => {
        let r: { [key: string]: string } = {};
        keys.forEach( key => {
            r["#008800"] = key
        });
        return r;
    };

    return loading ? <>
     <Typography
                            type="body"
                            size="large"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                        >
                                Loading Data...
                        </Typography>
                        <br/>
    <CircularProgress color="inherit"/>
    </> : (
        <svg width="100%" viewBox={`0 0 1900 800`}>
            <AdultFetalScatterPlot
                fx={[ formattedExpression.filter(x => !!x.agedeath_fetus).map(x => x.agedeath_fetus) ]}
                fy={[ formattedExpression.filter(x => !!x.agedeath_fetus).map(x => x.gene_quantification_files[0].quantifications[0].tpm) ]}
                ax={[ formattedExpression.filter(x => !!x.agedeath_adult).map(x => x.agedeath_adult) ]}
                ay={[ formattedExpression.filter(x => !!x.agedeath_adult).map(x => x.gene_quantification_files[0].quantifications[0].tpm) ]}
                colors={[ "#008800" ]}
                xtitle=""
                ytitle={`expression (normalized)`}
                width={1600}
                height={800}
                logScale={false}
                legendTitle={""}
                legendContent={legendContent([ "#008800" ], [ "Werling et. al. 2020" ])}
                normalized={true}
            />
        </svg>
    );

}
export default GeneExpressionPage;
