import React, { useState } from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { Typography } from '@zscreen/psychscreen-ui-components';
import { SearchBoxWithSelect } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';

import { PORTAL_SELECT_OPTIONS } from '../../constants/portals';
import { useViewportSize } from '../../hooks/useViewportSize';
import BRAIN from '../../assets/brain.png';

const MainPanel: React.FC<GridProps> = props => {
    const { width } = useViewportSize();
    const [searchVal, setSearchVal] = useState<string>('')     
    const navigate = useNavigate(); 
    const [selectedPortal, setSelectedPortal] =  useState<string>('Disease/Trait');
    return (
        <Grid {...props} container>
            <Grid item xs={6}>
                <img alt="PsychSCREEN" src={BRAIN} style={{ width: "80%", marginTop: "22px", marginLeft: "20px" }} />
            </Grid>
            <Grid item xs={6} />
            <Grid item xs={12} style={{ marginTop: "28px" }}>
                <Container style={{ marginLeft: "29px", marginRight: "29px", width: "92%" }}>
                    <Typography
                        type="display"
                        size="medium"
                        style={{ fontWeight: 700, fontSize: "28px", lineHeight: "33.6px", letterSpacing: "0.5px", marginBottom: "23px" }}
                    >
                        Explore the genetics and epigenetics of human brain development, function, and pathophysiology.
                    </Typography>
                    <Typography
                        type="body"
                        size="large"
                        style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "4px" }}
                    >
                        <BoltIcon style={{ marginRight: "9px" }} /> Powered by the PsychENCODE Consortium
                    </Typography>
                    <Typography
                        type="body"
                        size="large"
                        style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "56px" }}
                    >
                        <AccessibilityNewIcon style={{ marginRight: "9px" }} /> Accessible to all
                    </Typography>
                    <SearchBoxWithSelect
                        reactiveThreshold={600}
                        reactiveWidth={width * 0.8}
                        containerWidth={width}
                        selectOptions={PORTAL_SELECT_OPTIONS}
                        style={{ marginBottom: "14px" }}
                        onSelectChange={(val: {name: string})=>{                    
                            setSelectedPortal(val.name)
                        }}
                        onChange={e => { 
                            if(e.target.value===''){
                                
                            }
                            setSearchVal(e.target.value)                            
                        }}
                        onClick={()=>{
                            if(searchVal !== ''){   
                                if(selectedPortal==='Disease/Trait')
                                {
                                    navigate("/psychscreen/traits", { state: { searchvalue: searchVal } })
                                }
                                
                             }
                        }}
                    />
                </Container>
            </Grid>
        </Grid>
    );
};
export default MainPanel;
