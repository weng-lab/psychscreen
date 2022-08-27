import React, { useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import '@zscreen/psychscreen-ui-components/src/App.css';

import './App.css';
import { HomePage as WebHomePage } from './web/HomePage';
import { HomePage as TabletHomePage } from './tablet/HomePage';
import { DownloadsPage } from './web/DownloadsPage';
import { DiseaseTraitPortal, GenePortal, SNPPortal, SingleCellPortal } from './web/Portals';
import { useViewportSize } from './hooks/useViewportSize';

export const PORTALS: [ string, React.FC ][] = [
    [ "/traits", DiseaseTraitPortal ],
    [ "/gene", GenePortal ],
    [ "/snp", SNPPortal ],
    [ "/single-cell", SingleCellPortal ]
];

const App: React.FC = () => {

    const { width, height } = useViewportSize();
    const HomePage = useMemo( () => width >= 1280 ? WebHomePage : TabletHomePage, [ width ] );

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/psychscreen" />} />
                <Route path="/psychscreen" element={<HomePage />} />
                <Route path="/psychscreen/downloads" element={<DownloadsPage />} />
                { PORTALS.map( portal => <Route path={`/psychscreen${portal[0] as string}`} element={React.createElement(portal[1], {})} /> )}
            </Routes>
        </Router>
    );

};
export default App;
