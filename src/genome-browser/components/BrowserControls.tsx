import { Box, ButtonGroup, Stack, Typography } from "@mui/material";
import type { BrowserStoreInstance } from "@weng-lab/genomebrowser";
import {
  BrowserNavigationButton,
  type BrowserNavigationAction,
} from "@weng-lab/genomebrowser-ui";

const groups: {
  label: string;
  buttons: {
    label: string;
    ariaLabel: string;
    action: BrowserNavigationAction;
  }[];
}[] = [
  {
    label: "Move",
    buttons: [
      {
        label: "◄◄◄",
        ariaLabel: "Move left one viewport",
        action: { type: "pan", fraction: -1 },
      },
      {
        label: "◄◄",
        ariaLabel: "Move left half a viewport",
        action: { type: "pan", fraction: -0.5 },
      },
      {
        label: "◄",
        ariaLabel: "Move left a quarter viewport",
        action: { type: "pan", fraction: -0.25 },
      },
      {
        label: "►",
        ariaLabel: "Move right a quarter viewport",
        action: { type: "pan", fraction: 0.25 },
      },
      {
        label: "►►",
        ariaLabel: "Move right half a viewport",
        action: { type: "pan", fraction: 0.5 },
      },
      {
        label: "►►►",
        ariaLabel: "Move right one viewport",
        action: { type: "pan", fraction: 1 },
      },
    ],
  },
  {
    label: "Zoom In",
    buttons: [1.5, 3, 10].map((factor) => ({
      label: `${factor}x`,
      ariaLabel: `Zoom in ${factor} times`,
      action: { type: "zoom", factor: 1 / factor },
    })),
  },
  {
    label: "Zoom Out",
    buttons: [10, 3, 1.5].map((factor) => ({
      label: `${factor}x`,
      ariaLabel: `Zoom out ${factor} times`,
      action: { type: "zoom", factor },
    })),
  },
];

export default function BrowserControls({
  useBrowserStore,
}: {
  useBrowserStore: BrowserStoreInstance;
}) {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
      {groups.map(({ label, buttons }) => (
        <Stack key={label} alignItems="center">
          <Typography variant="body2">{label}</Typography>
          <ButtonGroup>
            {buttons.map((button) => (
              <BrowserNavigationButton
                key={button.ariaLabel}
                browserStore={useBrowserStore}
                action={button.action}
                aria-label={button.ariaLabel}
                variant="outlined"
                size="small"
                sx={{ padding: "2px 8px", minWidth: 30, fontSize: "0.8rem" }}
              >
                {button.label}
              </BrowserNavigationButton>
            ))}
          </ButtonGroup>
        </Stack>
      ))}
    </Box>
  );
}
