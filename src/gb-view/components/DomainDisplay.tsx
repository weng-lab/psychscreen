import { Box, Stack, Typography } from "@mui/material";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser-v2";

export default function DomainDisplay({
  useBrowserStore,
}: {
  useBrowserStore: BrowserStoreInstance;
}) {
  const region = useBrowserStore((state) => state.region);

  return (
    <Stack alignItems="center" width="100%" maxWidth={700}>
      <Typography>
        {region.chromosome}:{region.start.toLocaleString()}-
        {region.end.toLocaleString()}
      </Typography>
      <Box minHeight={20} width="100%" display="flex">
        <svg
          width="100%"
          height={20}
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 700 20"
          style={{ alignSelf: "flex-end" }}
        >
          {/*
            TODO: Re-enable cytobands when v2 has a supported cytoband
            component or adapter.
            <Cytobands assembly="hg38" currentDomain={region} />
          */}
        </svg>
      </Box>
    </Stack>
  );
}
