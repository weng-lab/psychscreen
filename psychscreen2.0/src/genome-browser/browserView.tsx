import { Box, Typography } from "@mui/material";

export interface BrowserViewProps {
  browserStore?: unknown;
  trackStore?: unknown;
  dataStore?: unknown;
}

export default function BrowserView(_props: BrowserViewProps) {
  return (
    <Box
      sx={{
        border: "1px solid #d0d7de",
        color: "#57606a",
        p: 2,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        Genome browser disabled during React 19 migration.
      </Typography>
    </Box>
  );
}
