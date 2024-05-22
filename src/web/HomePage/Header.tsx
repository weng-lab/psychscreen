import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../App";

const Header: React.FC = () => {
    const navigate = useNavigate();
    return (
        <AppBar
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onHomepageClicked={() => navigate("/")}
            onPortalClicked={(index) =>
                navigate(`/psychscreen${PORTALS[index][0]}`)
            }
            style={{ marginBottom: "63px" }}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
        />
    );
};
export default Header;
