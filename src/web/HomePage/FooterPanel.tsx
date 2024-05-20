import { Typography, Box } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import MuiLink from "@mui/material/Link"

const FooterPanel = () => {
  return (
    <Box
      sx={{ textAlign: "center", width: "100%", zIndex: -9999, backgroundColor: 'black' }}
    >
      <Grid2 container>
        <Grid2 sm={3}>
          <Typography variant="h5" color="#ffffff" align="justify">
            psychSCREEN
          </Typography>
          <Typography variant="body2" color="#ffffff" align="justify">
            Explore the genetics and epigenetics of human brain.
          </Typography>
        </Grid2>
        <Grid2 sm={3}        >
          <Typography variant="body1" color="#ffffff" align="justify">
            About Us
          </Typography>
          <Typography variant="body2" align="justify" color="#ffffff">
            <MuiLink color="inherit" href="/psychscreen/aboutus">
              Overview
            </MuiLink>
          </Typography>
          <Typography variant="body2" align="justify" color="#ffffff">
            <MuiLink color="inherit" href="https://www.umassmed.edu/wenglab/">
              Weng Lab
            </MuiLink>
          </Typography>
          <Typography variant="body2" align="justify" color="#ffffff" justifySelf={"left"} justifyContent={"left"} justifyItems={"left"}>
            <MuiLink color="inherit" href="https://psychencode.synapse.org/" justifySelf={"left"} justifyContent={"left"} justifyItems={"left"}>
              PsychENCODE Consortium
            </MuiLink>
          </Typography>
          <Typography variant="body2" align="justify" color="#ffffff" justifyContent={"left"}>
            <MuiLink color="inherit" href="https://www.umassmed.edu/">
              UMass Chan Medical School
            </MuiLink>
          </Typography>
        </Grid2>
        <Grid2 sm={2}        >
          <Typography variant="body1" color="#ffffff" align="justify">
            Portals
          </Typography>
          <br />
          <Typography variant="body2" color="#ffffff" align="justify">
            <MuiLink color="inherit" href="/psychscreen/traits">
              Disease/Trait
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="#ffffff" align="justify">
            <MuiLink color="inherit" href="/psychscreen/gene">
              Gene/b-cCRE
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="#ffffff" align="justify">
            <MuiLink color="inherit" href="/psychscreen/snp">
              SNP/QTL
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="#ffffff" align="justify">
            <MuiLink color="inherit" href="/psychscreen/single-cell">
              Single Cell
            </MuiLink>
          </Typography>
        </Grid2>
        <Grid2 sm={2}        >
          <Typography variant="body1" color="#ffffff" align="justify" >
            <MuiLink color="inherit" href="/psychscreen/downloads">
              Downloads
            </MuiLink>
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 sm={12}        >
          <Typography variant="body2" color="#ffffff" align="left">
            {"Copyright © "}
            <MuiLink color="inherit" href="https://www.umassmed.edu/wenglab/">
              Weng Lab
            </MuiLink>
            {", "}
            <MuiLink color="inherit" href="https://www.moore-lab.org/">
              Moore Lab
            </MuiLink>{" "}
            {new Date().getFullYear()}.
          </Typography>
          <Typography variant="body2" color="#ffffff" align="right">
            UI and art by &nbsp;
            <MuiLink color="inherit" href="mailto:tl842@cornell.edu">
              Elo
            </MuiLink>
            {" from "}
            <MuiLink color="inherit" href="https://co-labo.org/">
              CoLabo
            </MuiLink>
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FooterPanel;
