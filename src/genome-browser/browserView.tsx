import { Box, Stack, Typography } from "@mui/material";
import {
  Browser,
  createBrowserStore,
  createTrackStore,
  Cytobands,
  Domain,
  Track,
} from "@weng-lab/genomebrowser";
import ControlButtons from "./controls";

export interface BrowserViewProps {
  coordinates: Domain;
  tracks: Track[];
}

export default function BrowserView({ coordinates, tracks }: BrowserViewProps) {
  const browserStore = createBrowserStore({
    domain: coordinates as Domain,
    marginWidth: 100,
    trackWidth: 1400,
    multiplier: 3,
  });
  const trackStore = createTrackStore(tracks);

  const domain = browserStore.getState().domain;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: "0rem",
        mb: "1rem",
      }}
    >
      <Stack gap={2} width={"100%"}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Typography variant="body2" pr={1}>
            {domain.chromosome +
              ":" +
              domain.start.toLocaleString() +
              "-" +
              domain.end.toLocaleString()}
          </Typography>
          <svg width={700} height={20}>
            <Cytobands assembly="hg38" currentDomain={domain} />
          </svg>
        </Box>
        <ControlButtons browserStore={browserStore} />
        <Browser trackStore={trackStore} browserStore={browserStore} />
      </Stack>
    </Box>
  );
}
