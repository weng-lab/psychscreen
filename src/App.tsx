import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import '@zscreen/psychscreen-ui-components/src/App.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import './App.css';
import { HomePage as WebHomePage } from './web/HomePage';
import { HomePage as TabletHomePage } from './mobile-portrait/HomePage';
import { DownloadsPage } from './web/DownloadsPage';
import { DiseaseTraitPortal, GenePortal, SNPPortal, SingleCellPortal } from './web/Portals';
import  DiseaseTraitDetails from './web/Portals/DiseaseTraitPortal/DiseaseTraitDetails';
import  SingleCellDetails from './web/Portals/SingleCellPortal/SingleCellDetails';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import GeneDetails from './web/Portals/GenePortal/GeneDetails';
import GTexUMAP from './web/Portals/GenePortal/GTexUMAP';

export const PORTALS: [ string, React.FC ][] = [
    [ "/traits", DiseaseTraitPortal ],
    [ "/gene", GenePortal ],
    [ "/snp", SNPPortal ],
    [ "/single-cell", SingleCellPortal ]
];

const wengLink = new HttpLink({
    uri: "https://ga.staging.wenglab.org/graphql",
});
    
const openTargetLink = new HttpLink({
    uri: "https://api.genetics.opentargets.org/graphql",
});

const psychscreenLink = new HttpLink({
    uri: "https://psychscreen.api.wenglab.org/graphql",
});


const LINK = ApolloLink.split(
    operation => operation.getContext().clientName === "opentarget",
    openTargetLink, // <= apollo will send to this if clientName is "opentarget"
    ApolloLink.split(operation => operation.getContext().clientName === "psychscreen", psychscreenLink, wengLink)   // <= otherwise will send to this
);
      
const App: React.FC = () => {
   
    const client = useMemo( () => new ApolloClient({
        link: (LINK as any),
        cache: new InMemoryCache()
    }), []);
    
    //const { width, height } = useViewportSize();
    const theme = useTheme();
    //useMediaQuery(theme.breakpoints.down('sm'))   
    //const HomePage = useMemo( () => width < 1280 && height > width ? TabletHomePage : WebHomePage, [ width ] );

    const HomePage =  useMediaQuery(theme.breakpoints.down('sm')) ? TabletHomePage : WebHomePage;

    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/psychscreen" />} />
                    <Route path="/psychscreen" element={<HomePage />} />
                    <Route path="/psychscreen/downloads" element={<DownloadsPage />} />
                    <Route path="/psychscreen/traits/:disease" element={<DiseaseTraitDetails />} />
                    <Route path="/psychscreen/single-cell/:disease" element={<SingleCellDetails />} />
                    <Route path="/psychscreen/gene/:gene" element={<GeneDetails />} />
                    <Route path="/psychscreen/gene/gtexumap" element={<GTexUMAP/>} />
                    { PORTALS.map( portal => <Route path={`/psychscreen${portal[0] as string}`} element={React.createElement(portal[1], {})} /> )}
                </Routes>
            </Router>
        </ApolloProvider>
    );

};
export default App;
