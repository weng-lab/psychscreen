import { createTheme, ThemeProvider, type Theme } from "@mui/material/styles";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import { ControlToolbar } from "@weng-lab/genomebrowser-ui";
import { SCREEN_GRAPHQL_PATH } from "../../graphql/client";

// Keep menus from changing the responsive browser width and redrawing tracks.
const toolbarTheme = (theme: Theme) =>
  createTheme(theme, {
    components: {
      MuiSelect: { defaultProps: { MenuProps: { disableScrollLock: true } } },
    },
  });

export default function BrowserControls({
  browserStore,
  onManageHighlights,
  onSelectTracks,
}: {
  browserStore: BrowserStoreInstance;
  onManageHighlights: () => void;
  onSelectTracks: () => void;
}) {
  return (
    <ThemeProvider theme={toolbarTheme}>
      <ControlToolbar
        browserStore={browserStore}
        search={{
          assembly: "GRCh38",
          graphqlUrl: SCREEN_GRAPHQL_PATH,
          queries: ["Gene", "SNP", "Coordinate"],
        }}
        onManageHighlights={onManageHighlights}
        onSelectTracks={onSelectTracks}
      />
    </ThemeProvider>
  );
}
