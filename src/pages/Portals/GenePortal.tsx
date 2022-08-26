/**
 * GenePortal.tsx: the gene portal page.
 */

import React from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
 
const GenePortal: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
            />
        </>
    );
};
export default GenePortal;
