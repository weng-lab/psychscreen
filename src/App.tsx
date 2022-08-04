import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@zscreen/psychscreen-ui-components/src/App.css';

import './App.css';
import { HomePage } from './pages/HomePage';
import { DownloadsPage } from './pages/DownloadsPage';

const App: React.FC = () => {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
            </Routes>
        </Router>
    );

};
export default App;
