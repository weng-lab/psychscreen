import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@zscreen/psychscreen-ui-components/src/App.css';

import './App.css';
import { HomePage } from './pages/HomePage';
import { DownloadsPage } from './pages/DownloadsPage';
import { DiseaseTraitPortal, GenePortal, SNPPortal, SingleCellPortal } from './pages/Portals';

export const PORTALS: [ string, React.FC ][] = [
    [ "/traits", DiseaseTraitPortal ],
    [ "/gene", GenePortal ],
    [ "/snp", SNPPortal ],
    [ "/single-cell", SingleCellPortal ]
];

const App: React.FC = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                { PORTALS.map( portal => <Route path={portal[0] as string} element={React.createElement(portal[1], {})} /> )}
            </Routes>
        </Router>
    );

};
export default App;
