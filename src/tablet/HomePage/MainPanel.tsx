import React from 'react';
import { Container, GridProps } from '@mui/material';
import { Typography, SearchBoxWithSelect, Button } from '@zscreen/psychscreen-ui-components';
import { PORTAL_SELECT_OPTIONS } from '../../constants/portals';
import { useViewportSize } from '../../hooks/useViewportSize';

const MainPanel: React.FC<GridProps> = () => {
    const { height, width } = useViewportSize();
    return (
        <Container style={{ marginTop: `${height / 4.2}px`, width: "100%", textAlign: "center" }}>
            <div>
                <Typography
                    type="display"
                    size="medium"
                    style={{ display: "inline-block", fontWeight: 700, fontSize: "48px", lineHeight: "37px", marginBottom: "39px", textAlign: "left" }}
                >
                    psych<br />&nbsp;screen
                </Typography>
            </div>
            <div>
                <SearchBoxWithSelect
                    reactiveThreshold={600}
                    reactiveWidth={305}
                    containerWidth={width}
                    selectOptions={PORTAL_SELECT_OPTIONS}
                />
            </div>
            <Button bvariant="filled" btheme='light' style={{ marginTop: "44px", marginBottom: `${height / 8}px` }}>
                Search
            </Button>
            <Typography
                type="display"
                size="medium"
                style={{ fontWeight: 400, fontSize: "14px", lineHeight: "24px", marginBottom: "29px", color: "#BDBDBD", letterSpacing: "0.3px" }}
            >
                Copyright &copy; 2022 Weng Lab
            </Typography>
        </Container>
    );
};
export default MainPanel;
