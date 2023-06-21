/**
 * HomePage.tsx: the app home page.
 */

import { useNavigate } from 'react-router-dom';
import { TabletAppBar } from '@weng-lab/psychscreen-ui-components';

import { PORTALS } from '../../App';
import MainPanel from './MainPanel';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <TabletAppBar
                onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <MainPanel />
        </>
    );
};
export default HomePage;
