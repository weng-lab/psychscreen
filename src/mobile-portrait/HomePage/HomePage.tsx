/**
 * HomePage.tsx: the app home page.
 */

import { useNavigate } from 'react-router-dom';
import { TabletAppBar } from '@weng-lab/psychscreen-ui-components';

import { PORTALS } from '../../App';
import MainPanel from './MainPanel';
import { Typography } from '@weng-lab/psychscreen-ui-components';
import PortalsPanel from '../../web/HomePage/PortalsPanel';

export const Logo: React.FC = () => {
    const navigate = useNavigate();
    
    return(
        <div>
            <Typography
                type="display"
                size="medium"
                style={{ display: "inline-block", fontWeight: 700, fontSize: "20px", lineHeight: "15px", textAlign: "left", marginLeft: "-30px" }}
                onClick={() => navigate("/")}
            >
                psych<br />&nbsp;screen
            </Typography>
        </div>
)};

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <TabletAppBar
                onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
                title={<Logo /> as any}
            />
            <MainPanel />
            <PortalsPanel style={{ marginTop: "160px" }} />
        </>
    );
};
export default HomePage;
