
import { gql, useQuery } from '@apollo/client';
import React, {useMemo} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { CustomizedTable, Typography } from '@zscreen/psychscreen-ui-components';

const OpenTargetQuery = gql`
query GenePageQuery($geneId: String!) {
  geneInfo(geneId: $geneId) {
    id
    symbol
    chromosome
    start
    end
    bioType
    __typename
  }
  studiesAndLeadVariantsForGeneByL2G(geneId: $geneId) {
    pval
    yProbaModel
    study {
      studyId
      traitReported
      pubAuthor
      pubDate
      pmid
      nInitial
      nReplication
      hasSumstats
      __typename
    }
    variant {
      rsId
      id
      __typename
    }
    odds {
      oddsCI
      oddsCILower
      oddsCIUpper
      __typename
    }
    beta {
      betaCI
      betaCILower
      betaCIUpper
      direction
      __typename
    }
    __typename
  }
  colocalisationsForGene(geneId: $geneId) {
    leftVariant {
      id
      rsId
      __typename
    }
    study {
      studyId
      traitReported
      pubAuthor
      pubDate
      pmid
      hasSumstats
      __typename
    }
    qtlStudyId
    phenotypeId
    tissue {
      id
      name
      __typename
    }
    h3
    h4
    log2h4h3
    __typename
  }
}
`;

type OpenTargetsQueryResponse = {
	geneInfo: {
		id: string,
		symbol: string,
		chromosome: string,
		start: number,
		end: number,
		bioType: string,
		__typename: string
	};
	studiesAndLeadVariantsForGeneByL2G: {
		pval: number,
		yProbaModel: number,
		study: {
			studyId: string,
			traitReported: string,
			pubAuthor: string,
			pubDate: string,
			pmid: string,
			nInitial: number,
			nReplication: number,
			hasSumstats: boolean,
			__typename: string
		};
		variant: {
			rsId: string,
			id: string,
			__typename: string
		};
		odds: {
			oddsCI: number,
			oddsCILower: number,
			oddsCIUpper: number,
			__typename: string,
		};
		beta: {
			betaCI: number,
			betaCILower: number,
			betaCIUpper: number,
			direction: string,
			__typename: string
		};
		__typename: string
	}[];
	colocalisationsForGene: {
		leftVariant: {
			id: string,
			rsId: string,
			__typename: string
		};
		study: {
			studyId: string,
			traitReported: string,
			pubAuthor: string,
			pubDate: string,
			pmid: string,
			hasSumstats: boolean,
			__typename: string
		};
		qtlStudyId: string;
		phenotypeId: string;
		tissue: {
			id: string,
			name: string,
			__typename: string
		};
		h3: string;
		h4: string;
		log2h4h3: string;
		__typename: string;
	}[];
};



export function useOpenTargetsData(geneID: string) {
	const { data, loading } = useQuery<OpenTargetsQueryResponse>(OpenTargetQuery, {
		variables: {
			geneId: geneID //.split('.')[0]
		}, context: {
			clientName: 'opentarget'
		}
	});

	return {
		data: { ...data },
		loading: loading
	};
}

/*


*/

const roundTo = function (num: number, places: number) {
	// https://www.reddit.com/r/typescript/comments/efid2b/comment/fc1jusw/?utm_source=share&utm_medium=web2x&context=3
	const factor = 10 ** places;
	return Math.round(num * factor) / factor;
};


const OpenTarget: React.FC<any> = (props) => { 
    const { data, loading } = useOpenTargetsData(props.id);
	//console.log("openTargetdata:", data);
    const formattedData = useMemo(() => data?.studiesAndLeadVariantsForGeneByL2G?.map(
		q =>  {
            
            return [{
                header: "Study ID",
                value: q.study.studyId,
                render:  <a  target={'_blank'} rel={'noreferrer noopener'} href={`https://genetics.opentargets.org/study/${q.study.studyId}`}>{q.study.studyId}</a>
            }, {
                header: "Trait",
                value: q.study.traitReported
            }, {
                header: "Publication",
                value: q.study.pubAuthor,
                render: (q.study.pmid ? <a  target={'_blank'} rel={'noreferrer noopener'} href={`http://europepmc.org/article/MED/${q.study.pmid}`}>{ q.study.pubAuthor}</a> :  q.study.pubAuthor)
            }, {
                header: "N initial",
                value: q.study.nInitial,
                render: <span>{q.study.nInitial.toLocaleString("en-US")}</span>
            }, {
                header: "Lead Variant",
                value:  q.variant.id,
                        render: <a  target={'_blank'} rel={'noreferrer noopener'} href={`https://genetics.opentargets.org/variant/${q.variant.id}`}>{q.variant.id}</a>
            }, {
                header: "P-value",
                value: q.pval,
                render: <span>{q.pval.toExponential(2)}</span>
            }, {
                header: "Beta",
                value: q.beta.betaCI,
                render: <span>{roundTo(q.beta.betaCI, 3)}</span>
            }, {
                header: "Odds ratio",
                value: q.odds.oddsCI,
                render: <span>{roundTo(q.odds.oddsCI, 2)}</span>
            }, {
                header: "95% confidence interval",
                value: q.beta.betaCILower,
                render: <span>{`(${roundTo(q.beta.betaCILower, 2)}, ${roundTo(q.beta.betaCIUpper, 2)})`}</span>
            }, {
                header: "L2G pipeline score",
                value: q.yProbaModel,
                render:  <span>{roundTo(q.yProbaModel, 2)}</span>
            }, {
                header: "OpenTarget Gene Prioritisation",
                value: q.study.studyId,
                        render:  <a  target={'_blank'} rel={'noreferrer noopener'} href={`https://genetics.opentargets.org/study-locus/${q.study.studyId}/${q.variant.id}`}>Gene Prioritisation</a>
            }]}
	) || [], [data]);
	if (loading) return <> 
     <Typography
                            type="body"
                            size="large"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                        >
                                Loading Open Target Data...
                        </Typography>
                        <br/>
    <CircularProgress color="inherit"/>
    
     </>;

    return(<>
    {<CustomizedTable style={{ width: "max-content" }}  tabledata={formattedData}/>}
    </>)
}

export default OpenTarget;