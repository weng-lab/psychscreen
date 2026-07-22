import { Box, Stack, Typography } from "@mui/material";
import { Cytobands } from "@weng-lab/genomebrowser-ui-v2";
import type {
  BrowserStoreInstance,
  Highlight,
} from "@weng-lab/genomebrowser-v2";
import {
  combineCytobandHighlights,
  cytobandHighlightRegion,
} from "./cytobandHighlights";

export default function DomainDisplay({
  useBrowserStore,
  cytobandMarkers,
}: {
  useBrowserStore: BrowserStoreInstance;
  cytobandMarkers?: readonly Highlight[];
}) {
  const region = useBrowserStore((state) => state.region);
  const highlights = useBrowserStore((state) => state.highlights);
  const setRegion = useBrowserStore((state) => state.setRegion);

  return (
    <Stack alignItems="center" width="100%" maxWidth={700}>
      <Typography>
        {region.chromosome}:{region.start.toLocaleString()}-
        {region.end.toLocaleString()}
      </Typography>
      <Box minHeight={20} width="100%" sx={{ "& > svg": { width: "100%" } }}>
        <Cytobands
          assembly="GRCh38"
          chromosome={region.chromosome}
          currentRegion={region}
          highlights={combineCytobandHighlights(cytobandMarkers, highlights)}
          onHighlightClick={(highlight) => {
            setRegion(cytobandHighlightRegion(highlight, region.chromosome));
          }}
          width={700}
          height={20}
        />
      </Box>
    </Stack>
  );
}
