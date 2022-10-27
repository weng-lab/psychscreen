import React, {useState} from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { Typography } from '@zscreen/psychscreen-ui-components';
import { SearchBoxWithSelect } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
import { PORTAL_SELECT_OPTIONS } from '../../constants/portals';
import BRAIN from '../../assets/brain.png';

const MainPanel: React.FC<GridProps> = props => {
    const [searchVal, setSearchVal] = useState<string>('')     
    const navigate = useNavigate(); 
    const [selectedPortal, setSelectedPortal] =  useState<string>('Disease/Trait');
    
    return (
    <Grid {...props} container>
        <Grid item sm={0}  md={0} lg={1} xl={2}></Grid>
        <Grid item  sm={9} md={8} lg={7} xl={5}>
            <Container style={{ marginTop: "147px", width: "741px" }}>
                <Typography
                    type="display"
                    size="medium"
                    style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
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
                    onSelectChange={(val: {name: string})=>{                    
                        setSelectedPortal(val.name)
                    }}
                    selectOptions={PORTAL_SELECT_OPTIONS}
                    style={{ marginBottom: "14px" }}
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
                            } else if(selectedPortal==='Gene/bCRE') {
                                navigate("/psychscreen/gene", { state: { searchvalue: searchVal } })
                            }
                            
                         }
                    }}
                />
            </Container>
        </Grid>
        <Grid item sm={3} md={4} lg={3} xl={3}>
            <Container style={{ marginTop: "143px" }}>
-               <img alt="PsychSCREEN" src={BRAIN} style={{ width: "85%" }} />
            </Container>
        </Grid>
        <Grid item sm={0} md={0} lg={1} xl={2} ></Grid>
    </Grid>
)};
export default MainPanel;
