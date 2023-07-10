import React from "react";
import { Grid, Container, GridProps } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

const FooterPanel: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  return (
    <Grid container {...props}>
      <Grid
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        item
        sm={3}
      >
        <Container style={{ marginLeft: "220px", marginTop: "116px" }}>
          <Typography
            type="body"
            size="medium"
            style={{
              fontSize: "32px",
              lineHeight: "27px",
              fontWeight: 700,
              marginBottom: "14px",
            }}
          >
            psych
            <br />
            &nbsp;screen
          </Typography>
          <Typography
            type="body"
            size="medium"
            style={{
              fontSize: "14px",
              lineHeight: "22px",
              fontWeight: 400,
              width: "180px",
            }}
          >
            Explore the genetics and epigenetics of human brain.
          </Typography>
        </Container>
      </Grid>
      <Grid
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        item
        sm={3}
      >
        <Container style={{ marginTop: "116px" }}>
          <Typography
            type="body"
            size="medium"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: "21.5px",
            }}
          >
            About Us
          </Typography>
          <div style={{ marginLeft: "10px" }}>
            <Typography
              type="body"
              size="medium"
              onClick={() => navigate("/psychscreen/aboutus")}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              Overview
            </Typography>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={"https://www.umassmed.edu/wenglab/"}
              >
                {" "}
                Weng Lab
              </Link>
            </Typography>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              <Link href="https://psychencode.synapse.org/">
                PsychENCODE Consortium
              </Link>
            </Typography>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.umassmed.edu/"
              >
                UMass Chan Medical School
              </Link>
            </Typography>
          </div>
        </Container>
      </Grid>
      <Grid
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        item
        sm={3}
      >
        <Container style={{ marginTop: "116px" }}>
          <Typography
            type="body"
            size="medium"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: "21.5px",
            }}
          >
            Portals
          </Typography>
          <div style={{ marginLeft: "10px" }}>
            <Typography
              type="body"
              size="medium"
              onClick={() => navigate("/psychscreen/traits")}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              Disease/Trait
            </Typography>
            <Typography
              type="body"
              size="medium"
              onClick={() => navigate("/psychscreen/gene")}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              Gene/bCRE
            </Typography>
            <Typography
              type="body"
              size="medium"
              onClick={() => navigate("/psychscreen/snp")}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              SNP/QTL
            </Typography>
            <Typography
              type="body"
              size="medium"
              onClick={() => navigate("/psychscreen/single-cell")}
              style={{
                color: "#1976d2",
                textDecoration: "underline",
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 400,
                letterSpacing: "0.1px",
                marginBottom: "10px",
              }}
            >
              Single Cell
            </Typography>
          </div>
        </Container>
      </Grid>

      <Grid
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        item
        sm={1}
      >
        <Container style={{ marginTop: "116px" }}>
          <Typography
            type="body"
            size="medium"
            onClick={() => navigate("/psychscreen/downloads")}
            style={{
              color: "#1976d2",
              textDecoration: "underline",
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: "21.5px",
            }}
          >
            Downloads
          </Typography>
        </Container>
      </Grid>
      <Grid
        style={{ backgroundColor: "#000000", color: "#ffffff" }}
        item
        sm={2}
      />
      <Grid
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          paddingLeft: "160px",
          paddingRight: "205px",
          paddingBottom: "60px",
          paddingTop: "107px",
        }}
        item
        sm={12}
      >
        <hr />
        Copyright &copy; 2023 Weng Lab
      </Grid>
    </Grid>
  );
};
export default FooterPanel;
