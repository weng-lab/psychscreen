import { Box } from "@mui/material";
import { Cytobands } from "@weng-lab/genomebrowser-ui";
import { useEffect, useRef, useState } from "react";
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ width: "100%", minHeight: 14, mt: 1, mb: 0.5 }}
    >
      <Cytobands
        bands={bands}
        chromosomeLength={assembly.chromosomes[region.chromosome]}
        chromosome={region.chromosome}
        currentRegion={region}
        highlights={combineCytobandHighlights(cytobandMarkers, highlights)}
        onHighlightClick={(highlight) => {
          setRegion(cytobandHighlightRegion(highlight, region.chromosome));
        }}
        width={width}
        height={14}
      />
    </Box>
  );
}
