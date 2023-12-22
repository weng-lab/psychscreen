import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../../App";
import GenomeExplorer from "./GenomeExplorer";
import { GenomicRange } from "../GenePortal/AssociatedxQTL";
import { Container, Grid } from "semantic-ui-react";
import FooterPanel from "../../HomePage/FooterPanel";

type GenomicRangeParams = {
  chromosome: string;
  start: string;
  end: string;
  trackset?: string;
};

function useCoordinates() {
  const { chromosome, start, end, trackset } = useParams<GenomicRangeParams>();
  return {
    chromosome,
    start: +start!,
    end: +end!,
    trackset,
  };
}

const GenomeExplorerPage: React.FC = () => {
  /* page navigation */
  const navigate = useNavigate();

  /* genome browser coordinates */
  const { chromosome, start, end, trackset } = useCoordinates();
  const onDomainChanged = useCallback(
    (coordinates: GenomicRange) => {
      if (+coordinates.end - +coordinates.start > 10) {
        navigate(
          `/psychscreen/genomebrowser/${coordinates.chromosome}/${coordinates.start}/${coordinates.end}/${trackset}`
        );
      }
    },
    [navigate]
  );

  return (
    <>
      <AppBar
        centered={true}
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
      />
      <Container style={{ width: "70%", marginLeft: "15%", marginTop: "2em" }}>
        <GenomeExplorer
          coordinates={{ chromosome, start, end }}
          onDomainChanged={onDomainChanged}
          defaultTrackset={trackset}
        />
      </Container>
      <FooterPanel style={{ marginTop: "160px" }} />

    </>
  );
};
export default GenomeExplorerPage;
