import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { PORTALS } from '../../../App';
import GenomeExplorer from './GenomeExplorer';
import { GenomicRange } from '../GenePortal/AssociatedxQTL';
import { Container, Grid } from 'semantic-ui-react';

type GenomicRangeParams = {
    chromosome: string;
    start: string;
    end: string;
};

function useCoordinates() {
    const { chromosome, start, end } = useParams<GenomicRangeParams>();
    return {
        chromosome,
        start: +start!,
        end: +end!
    };
}

const GenomeExplorerPage: React.FC = () => {

    /* page navigation */
    const navigate = useNavigate();
    
    /* genome browser coordinates */
    const { chromosome, start, end } = useCoordinates();
    const onDomainChanged = useCallback((coordinates: GenomicRange) => {
        navigate(`/psychscreen/genomebrowser/${coordinates.chromosome}/${coordinates.start}/${coordinates.end}`);
    }, [ navigate ]);

    return (
        <>
            <AppBar
                centered={true}
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
            />
            <Container style={{ width: "70%", marginLeft: "15%", marginTop: "2em" }}>
                <GenomeExplorer
                    coordinates={{ chromosome, start, end }}
                    onDomainChanged={onDomainChanged}
                />
            </Container>
        </>
    );

};
export default GenomeExplorerPage;
