import { Typography, Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import MuiLink from "@mui/material/Link";

const FooterPanel = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        zIndex: -9999,
        backgroundColor: "black",
      }}
    >
      <Grid2
        container
        pt={5}
        pb={5}
        spacing={3}
        maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }}
        margin={"auto"}
      >
        <Grid2 color="white" textAlign={"left"} flexGrow={1}>
          <Typography variant="h4">psychSCREEN</Typography>
          <Typography variant="body2" mb={2}>
            Explore the genetics and epigenetics
            <br />
            of the human brain.
          </Typography>
          <Typography variant="body2">
            {"Copyright © "}
            <MuiLink color="inherit" href="https://www.umassmed.edu/wenglab/">
              Weng Lab
            </MuiLink>
            {", "}
            <MuiLink color="inherit" href="https://www.moore-lab.org/">
              Moore Lab
            </MuiLink>
            {", and "}
            <MuiLink color="inherit" href="https://co-labo.org/">
              Colubri Lab
            </MuiLink>
            {" "}
            {new Date().getFullYear()}.
          </Typography>
          <Typography variant="body2">
            UI and art by&ensp;
            <MuiLink color="inherit" href="mailto:tl842@cornell.edu">
              Elo
            </MuiLink>
            {" from "}
            <MuiLink color="inherit" href="https://co-labo.org/">
              CoLabo
            </MuiLink>
          </Typography>
        </Grid2>
        <Grid2 color="white" textAlign={"left"} flexGrow={1}>
          <Typography variant="h5" mb={1}>
            <MuiLink
              color="inherit"
              href="/psychscreen/aboutus"
              underline="hover"
            >
              About Us
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              color="inherit"
              href="https://www.umassmed.edu/zlab/"
              underline="hover"
            >
              Weng Lab
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              color="inherit"
              href="https://psychencode.synapse.org/"
              underline="hover"
            >
              PsychENCODE Consortium
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              color="inherit"
              href="https://www.umassmed.edu/"
              underline="hover"
            >
              UMass Chan Medical School
            </MuiLink>
          </Typography>
        </Grid2>
        <Grid2 color="white" textAlign={"left"} flexGrow={1}>
          <Typography variant="h5" mb={1}>
            Portals
          </Typography>
          <Typography variant="body2">
            <MuiLink
              color="inherit"
              href="/psychscreen/traits"
              underline="hover"
            >
              Disease/Trait
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink color="inherit" href="/psychscreen/gene" underline="hover">
              Gene/b-cCRE
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink color="inherit" href="/psychscreen/snp" underline="hover">
              SNP/QTL
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              color="inherit"
              href="/psychscreen/single-cell"
              underline="hover"
            >
              Single-Cell
            </MuiLink>
          </Typography>
        </Grid2>
        <Grid2 color="white" textAlign={"left"} flexGrow={1}>
          <Typography variant="h5">
            <MuiLink
              color="inherit"
              href="/psychscreen/downloads"
              underline="hover"
            >
              Downloads
            </MuiLink>
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FooterPanel;
