/**
 * SingleCellPortal.tsx: the single cell portal page.
 */

import React from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
import { PORTALS } from '../../App';
 
const SingleCellPortal: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
                centered={true}
            />
        </>
    );
};
export default SingleCellPortal;
