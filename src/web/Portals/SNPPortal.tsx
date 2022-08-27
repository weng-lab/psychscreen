/**
 * SNPPortal.tsx: the SNP/QTL portal page.
 */

import React from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
 
const SNPPortal: React.FC = () => {
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
export default SNPPortal;
