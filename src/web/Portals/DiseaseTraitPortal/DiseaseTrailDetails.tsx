
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import ArrowBack from '@mui/icons-material/ArrowBack'
import React, { useState } from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, GridProps } from '@mui/material';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import GeneAssociations from "./GeneAssociations";
import AssociatedSnpQtl from "./AssociatedSnpQtl";

const DiseaseTraitDetails: React.FC<GridProps> = (props) => {
    const { disease } = useParams();
    const navigate = useNavigate();  
    const [page, setPage] = useState<number>(0);
    const { state }: any = useLocation();
    const { searchvalue } = state ? state : { searchvalue: ''} 

    return (
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
            />
            <Grid container {...props}>  
                <Grid item sm={1}  md={1} lg={2} xl={3}></Grid>
                <Grid item sm={10}  md={10} lg={7} xl={6}>
                    <Container style={{marginTop: "50px", marginLeft: "100px", width: "841px" }}>
                        <ArrowBack onClick={()=>{                            
                            navigate("/psychscreen/traits", { state: { searchvalue: searchvalue } } )
                        }} style={{ width: "70px", height: "70px", color: "#E0E0E0" }}/>
                    </Container>
                </Grid>  
                <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                <Grid item sm={1}  md={1} lg={2} xl={3}></Grid>
                <Grid item  sm={10}  md={10} lg={7} xl={6}>
                    <Container style={{ marginTop: "80px", marginLeft: "100px", width: "841px" }}>
                        
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px"  }}
                        >
                            {disease}
                        </Typography>
                        <br/>
                        <Typography
                            type="body"
                            size="large"
                            style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px" }}
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus turpis a orci volutpat, id congue leo laoreet. Nulla facilisi. Duis sit amet lorem faucibus, venenatis dui a, ultricies mi. In hac habitasse platea dictumst. Vestibulum ac laoreet tortor. 
                        </Typography>
                        <br/>
                        <Button bvariant={page===0 ? "filled" : "outlined"} btheme="light" onClick={()=>{ setPage(0);}} >Overview</Button>&nbsp;&nbsp;&nbsp;
                        <Button bvariant={page===1 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(1); }} >Gene Associations</Button>&nbsp;&nbsp;&nbsp;
                        <Button bvariant={page===2 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(2)}} >{'Associated SNP & xQTL'}</Button>
                            
                    </Container>
                </Grid>
                <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                { page === 0 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={3}></Grid>
                        <Grid item sm={10}  md={10} lg={7} xl={6}>
                            <Container style={{ marginTop: "50px", marginLeft: "150px" }}>
                                <Typography
                                    type="body"
                                    size="large"
                                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "860px" }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus turpis a orci volutpat, id congue leo laoreet. Nulla facilisi. Duis sit amet lorem faucibus, venenatis dui a, ultricies mi. In hac habitasse platea dictumst. Vestibulum ac laoreet tortor. Nullam blandit velit ac leo facilisis venenatis. Vestibulum scelerisque tincidunt nisi, id volutpat lectus. Phasellus ultrices laoreet luctus. Etiam aliquet interdum lobortis. Phasellus placerat ullamcorper arcu, id elementum neque placerat ac. Duis sagittis pretium mollis. Morbi venenatis nisi dapibus ligula dignissim dapibus.
                                </Typography>
                                <Typography
                                    type="body"
                                    size="large"
                                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "860px"  }}
                                >
                                    Aliquam lacinia magna blandit odio fermentum tempor. Etiam pulvinar lacinia justo ac tempus. Donec tristique id sapien et pulvinar. Sed fermentum rutrum neque non dapibus. Pellentesque consequat dolor arcu, et tincidunt ante eleifend id. Donec lorem dolor, volutpat vel orci id, placerat dictum lectus. Proin sit amet sem nec leo dapibus rutrum cursus vel risus. Mauris ac augue placerat, vehicula mauris in, consectetur eros. Suspendisse auctor eget augue quis scelerisque. Aliquam ut ligula risus. Vivamus consequat libero est, eget sollicitudin mauris finibus sed. Curabitur consectetur ornare diam ut faucibus. Vestibulum sodales ex ac dui congue, et congue magna malesuada.
                                </Typography>
                                <Typography
                                    type="body"
                                    size="large"
                                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "860px"  }}
                                >
                                    Nulla scelerisque fermentum diam, vel mollis purus feugiat nec. Donec ac enim lorem. Nulla facilisi. Suspendisse sollicitudin suscipit est eu ullamcorper. Aliquam tempor pulvinar imperdiet. Curabitur a pretium diam, vel tempor quam. Donec vitae faucibus urna. Morbi sit amet lacus vel sem mollis ullamcorper sed quis enim. Cras semper euismod lectus nec tincidunt. Cras ullamcorper aliquet massa non tempor.
                                </Typography>
                                <br/>
                                <Box
                                    sx={{
                                    width: "860px",
                                    height: "512px",
                                    backgroundColor: '#F6F6F6'            
                                }}/>
                                <br/>
                                <Typography
                                    type="body"
                                    size="large"
                                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "860px"  }}
                                >
                                    Pellentesque nec lectus a libero luctus hendrerit vel facilisis justo. Vestibulum imperdiet augue non sodales mollis. Curabitur id lorem ac ipsum euismod mollis. Sed id felis eu risus aliquet sollicitudin. Praesent egestas arcu sollicitudin arcu tristique scelerisque. Quisque maximus blandit eros quis vulputate. Phasellus tortor arcu, eleifend non consequat eu, elementum sit amet turpis. Donec vitae blandit enim, ac congue leo. Mauris ac arcu semper, lacinia mi id, sodales eros. Cras congue hendrerit rhoncus. Fusce gravida, nulla ut gravida iaculis, mi dui consectetur ante, sit amet pharetra tortor nisi in mauris. Phasellus ac sapien massa. Aliquam pulvinar, ante eget finibus fermentum, urna sem convallis ligula, vitae laoreet nibh mauris sed quam. Fusce ut nisi id lacus gravida placerat.
                                </Typography>
                                <Typography
                                    type="body"
                                    size="large"
                                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "860px"  }}
                                >
                                    Fusce in dictum leo. Mauris luctus neque eu nisl hendrerit rhoncus. In ultricies nulla vitae pellentesque placerat. Cras aliquet, leo eget tempus fermentum, risus massa finibus urna, in congue mi nulla eu tortor. In euismod non tellus at sagittis. Sed quis iaculis leo. Quisque tincidunt mi efficitur vulputate venenatis. Praesent lacus augue, dignissim quis fringilla sit amet, sagittis id nisi. Donec bibendum orci aliquam, luctus orci sit amet, porttitor mauris. Nam nec mauris nec mi venenatis dictum et sit amet ipsum. Aenean placerat sollicitudin urna id vehicula.
                                </Typography>
                            </Container>
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>
                )}
                { page === 1 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={3}></Grid>
                        <Grid sm={10}  md={10} lg={7} xl={6}>
                            <GeneAssociations/>
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>

                )}
                { page === 2 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={3}></Grid>
                        <Grid item sm={10}  md={10} lg={7} xl={6}>
                            <AssociatedSnpQtl/>
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>
                )}
            </Grid>
        </>
    );
}
export default DiseaseTraitDetails;
