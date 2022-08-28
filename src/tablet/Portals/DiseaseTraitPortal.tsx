/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';

const DiseaseTraitPortal: React.FC = () => {
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
export default DiseaseTraitPortal;
