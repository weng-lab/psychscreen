import { Box, Stack, Typography } from "@mui/material";
import { Cytobands } from "@weng-lab/genomebrowser-ui-v2";
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
      <Box minHeight={20} width="100%" sx={{ "& > svg": { width: "100%" } }}>
        <Cytobands
          assembly="GRCh38"
          chromosome={region.chromosome}
          currentRegion={region}
          width={700}
          height={20}
        />
      </Box>
    </Stack>
  );
}
