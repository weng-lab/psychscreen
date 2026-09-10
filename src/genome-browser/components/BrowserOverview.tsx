import { Box, Stack, Typography } from "@mui/material";
import { Cytobands } from "@weng-lab/genomebrowser-ui";
import bands from "../data/hg38-cytobands.json";
import type { BrowserStoreInstance, Highlight } from "@weng-lab/genomebrowser";
import {
  combineCytobandHighlights,
  cytobandHighlightRegion,
} from "../highlights";

export default function BrowserOverview({
  useBrowserStore,
  cytobandMarkers,
}: {
  useBrowserStore: BrowserStoreInstance;
  cytobandMarkers?: readonly Highlight[];
}) {
  const region = useBrowserStore((state) => state.region);
  const assembly = useBrowserStore((state) => state.assembly);
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
          bands={bands}
          chromosomeLength={assembly.chromosomes[region.chromosome]}
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
