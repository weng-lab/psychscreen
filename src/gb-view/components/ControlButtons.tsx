import {
  Box,
  Button,
  ButtonGroup as MuiButtonGroup,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useBrowserStore } from "../stores";

type ButtonConfig = {
  label: string;
  onClick: (value: number) => void;
  value: number;
};

function ButtonGroup({ buttons }: { buttons: ButtonConfig[] }) {
  return (
    <MuiButtonGroup>
      {buttons.map((button) => (
        <Button
          key={`${button.label}-${button.value}`}
          variant="outlined"
          size="small"
          onClick={() => button.onClick(button.value)}
          sx={{ padding: "2px 8px", minWidth: 30, fontSize: "0.8rem" }}
        >
          {button.label}
        </Button>
      ))}
    </MuiButtonGroup>
  );
}

function TwoSidedControl({
  leftButtons,
  rightButtons,
  label,
  leftLabel,
  rightLabel,
}: {
  leftButtons: ButtonConfig[];
  rightButtons: ButtonConfig[];
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <Stack alignItems="center">
      {label ? <Typography variant="body2">{label}</Typography> : null}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Stack direction="column" alignItems="center">
          {leftLabel ? (
            <Typography variant="body2">{leftLabel}</Typography>
          ) : null}
          <ButtonGroup buttons={leftButtons} />
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack direction="column" alignItems="center">
          {rightLabel ? (
            <Typography variant="body2">{rightLabel}</Typography>
          ) : null}
          <ButtonGroup buttons={rightButtons} />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default function ControlButtons() {
  const region = useBrowserStore((state) => state.region);
  const setRegion = useBrowserStore((state) => state.setRegion);
  const zoom = useBrowserStore((state) => state.zoom);

  const regionKey = `${region.chromosome}:${region.start}-${region.end}`;

  const shift = (delta: number) => {
    const roundedDelta = Math.round(delta);
    const width = region.end - region.start;

    const newStart = Math.max(0, Math.round(region.start + roundedDelta));
    const newEnd = Math.round(newStart + width);
    const nextRegion = {
      ...region,
      start: newStart,
      end: newEnd,
    };

    setRegion(nextRegion);
  };

  const width = region.end - region.start;
  const buttonGroups = {
    moveLeft: [
      { label: "◄◄◄", onClick: shift, value: -width },
      { label: "◄◄", onClick: shift, value: -Math.round(width / 2) },
      { label: "◄", onClick: shift, value: -Math.round(width / 4) },
    ],
    moveRight: [
      { label: "►", onClick: shift, value: Math.round(width / 4) },
      { label: "►►", onClick: shift, value: Math.round(width / 2) },
      { label: "►►►", onClick: shift, value: width },
    ],
    zoomIn: [
      { label: "1.5x", onClick: zoom, value: 1 / 1.5 },
      { label: "3x", onClick: zoom, value: 1 / 3 },
      { label: "10x", onClick: zoom, value: 1 / 10 },
    ],
    zoomOut: [
      { label: "10x", onClick: zoom, value: 10 },
      { label: "3x", onClick: zoom, value: 3 },
      { label: "1.5x", onClick: zoom, value: 1.5 },
    ],
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="center"
      gap={2}
    >
      <TwoSidedControl
        key={`${regionKey}-move`}
        leftButtons={buttonGroups.moveLeft}
        rightButtons={buttonGroups.moveRight}
        label="Move"
      />
      <TwoSidedControl
        key={`${regionKey}-zoom`}
        leftButtons={buttonGroups.zoomIn}
        rightButtons={buttonGroups.zoomOut}
        leftLabel="Zoom In"
        rightLabel="Zoom Out"
      />
    </Box>
  );
}
