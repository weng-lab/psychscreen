import React, { useState, useEffect, useMemo, useRef } from "react";
import { Chart, Scatter } from "jubilant-carnival";
import { Grid } from "@mui/material";
import Legend from "./scatterplot/legend";
import { tissueTypeColors } from "./consts";
import { TabletAppBar, Typography } from "@weng-lab/psychscreen-ui-components";
import { useTheme, useMediaQuery } from "@material-ui/core";
import { PORTALS } from "../../../App";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { Logo } from "../../../mobile-portrait/HomePage/HomePage";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import FooterPanel from "../../HomePage/FooterPanel";

const dictionaryInvert = (obj) =>
  Object.fromEntries(Object.entries(obj).map((a) => a.reverse()));

const legendContent = dictionaryInvert(tissueTypeColors);

export type GTexumap = {
  tissueid: string;
  color: string;
  tissuetype: string;
  tissuedetail: string;
  coordinates: [number, number];
};

export function lower5(x: number): number {
  return Math.floor(x / 5) * 5;
}

export function upper5(x: number): number {
  return Math.ceil(x / 5) * 5;
}

export const range = (min: number, max: number, by: number = 1) => {
  let newVals: number[] = [];
  for (let i = min; i < max; i = i + by) {
    newVals.push(i);
  }
  return newVals;
};

const GTexUMAP: React.FC = () => {
  const [data, setData] = useState<GTexumap[]>([]);
  const [pcdata, setPcData] = useState<GTexumap[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://downloads.wenglab.org/GTEx_v8_RNAseq_gene_tpm_matrix.txt")
      .then((x) => x.text())
      .then((x) =>
        x
          .split("\n")
          .map((l) => {
            const vals = l.split("\t");
            if (vals.length <= 1) return undefined;
            return {
              tissueid: vals[0],
              tissuetype: vals[1],
              color: tissueTypeColors[vals[2]] as string,
              tissuedetail: vals[2],
              coordinates: [+vals[3], +vals[4]] as [number, number],
            };
          })
          .filter((x) => x !== undefined)
          .map((x) => x!)
      )
      .then((x) => setData(x));
  }, []);
  const points = useMemo(
    () =>
      data.map((x) => ({
        x: x.coordinates[0],
        y: x.coordinates[1],
        svgProps: { fill: x.color },
      })),
    [data]
  );
  const domain = useMemo(
    () =>
      points.length === 0
        ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } }
        : {
            x: {
              start: lower5(Math.min(...points.map((x) => x.x)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.x)) * 1.1),
            },
            y: {
              start: lower5(Math.min(...points.map((x) => x.y)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.y)) * 1.1),
            },
          },
    [points]
  );

  useEffect(() => {
    fetch("https://downloads.wenglab.org/GTEx_v8_RNAseq_gene_tpm_matrix_pc.txt")
      .then((x) => x.text())
      .then((x) =>
        x
          .split("\n")
          .map((l) => {
            const vals = l.split("\t");
            if (vals.length <= 1) return undefined;
            return {
              tissueid: vals[0],
              tissuetype: vals[1],
              color: tissueTypeColors[vals[2]] as string,
              tissuedetail: vals[2],
              coordinates: [+vals[3], +vals[4]] as [number, number],
            };
          })
          .filter((x) => x !== undefined)
          .map((x) => x!)
      )
      .then((x) => setPcData(x));
  }, []);

  const pcpoints = useMemo(
    () =>
      pcdata.map((x) => ({
        x: x.coordinates[0],
        y: x.coordinates[1],
        svgProps: { fill: x.color },
      })),
    [pcdata]
  );
  const pcdomain = useMemo(
    () =>
      pcpoints.length === 0
        ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } }
        : {
            x: {
              start: lower5(Math.min(...pcpoints.map((x) => x.x)) * 1.1),
              end: upper5(Math.max(...pcpoints.map((x) => x.x)) * 1.1),
            },
            y: {
              start: lower5(Math.min(...pcpoints.map((x) => x.y)) * 1.1),
              end: upper5(Math.max(...pcpoints.map((x) => x.y)) * 1.1),
            },
          },
    [pcpoints]
  );

  const uref = useRef<SVGSVGElement>(null);
  const pcuref = useRef<SVGSVGElement>(null);
  const llegendref = useRef<SVGSVGElement>(null);

  return (
    <>
      {
        //show vertical app bar only for mobile view
        useMediaQuery(theme.breakpoints.down("xs")) ? (
          <TabletAppBar
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onHomepageClicked={() => navigate("/")}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
            style={{ marginBottom: "63px" }}
            title={(<Logo />) as any}
          />
        ) : (
          <AppBar
            centered={true}
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onHomepageClicked={() => navigate("/")}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
          />
        )
      }
      <Grid container>
        <Grid item sm={6} md={6} lg={6} xl={6}>
          {data && data.length > 0 ? (
            <>
              <Typography
                type="display"
                size="small"
                style={{
                  marginTop: "90px",
                  marginLeft: "250px",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "57.6px",
                  letterSpacing: "0.5px",
                }}
              >
                UMAP of GTEx v8 RNA-seq (All genes)
              </Typography>
              <Chart
                marginFraction={0.28}
                innerSize={{ width: 2100, height: 2000 }}
                domain={domain}
                xAxisProps={{
                  ticks: range(domain.x.start, domain.x.end, 5),
                  title: "UMAP-1",
                }}
                yAxisProps={{
                  ticks: range(domain.y.start, domain.y.end, 5),
                  title: "UMAP-2",
                }}
                scatterData={[points]}
                ref={uref}
              >
                <Scatter data={points} />
              </Chart>
            </>
          ) : null}
        </Grid>
        <Grid item sm={6} md={6} lg={6} xl={6}>
          {pcdata && pcdata.length > 0 ? (
            <>
              <Typography
                type="display"
                size="small"
                style={{
                  marginTop: "90px",
                  marginLeft: "250px",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "57.6px",
                  letterSpacing: "0.5px",
                }}
              >
                UMAP of GTEx v8 RNA-seq (PC genes)
              </Typography>
              <Chart
                marginFraction={0.28}
                innerSize={{ width: 2100, height: 2000 }}
                domain={pcdomain}
                xAxisProps={{
                  ticks: range(pcdomain.x.start, pcdomain.x.end, 5),
                  title: "UMAP-1",
                }}
                yAxisProps={{
                  ticks: range(pcdomain.y.start, pcdomain.y.end, 5),
                  title: "UMAP-2",
                }}
                scatterData={[pcpoints]}
                ref={pcuref}
              >
                <Scatter data={pcpoints} />
              </Chart>
            </>
          ) : null}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sm={12} md={12} lg={12} xl={12}>
          {data.length === 0 || pcdata.length === 0 ? (
            <>
              <Typography
                type="body"
                size="large"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "19px",
                }}
              >
                Loading Data...
              </Typography>
              <br />
              <CircularProgress color="inherit" />
            </>
          ) : null}
          {data.length > 0 && pcdata.length > 0 ? (
            <svg viewBox="0 0 800 800" ref={llegendref}>
              <Legend
                x={350}
                y={0}
                width={200}
                title={""}
                content={legendContent}
                fontSize={8}
                fill="#ffffff"
                stroke="#ffffff"
              />
            </svg>
          ) : null}
        </Grid>
      </Grid>
      <FooterPanel style={{ marginTop: "160px" }} />

    </>
  );
};
export default GTexUMAP;
