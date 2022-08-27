/**
 * HomePage.tsx: the app home page.
 */

import { useNavigate } from 'react-router-dom';
import { AppBar } from '@zscreen/psychscreen-ui-components';

import { PORTALS } from '../../App';
import MainPanel from './MainPanel';
import PortalsPanel from './PortalsPanel';
import AboutUsPanel from './AboutUsPanel';
import FooterPanel from './FooterPanel';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(PORTALS[index][0])}
                style={{ marginBottom: "63px" }}
            />
            <MainPanel />
            <PortalsPanel style={{ marginTop: "160px" }} />
            <AboutUsPanel style={{ marginTop: "355px" }} />
            <FooterPanel style={{ marginTop: "160px" }} />
        </>
    );
};
export default HomePage;
