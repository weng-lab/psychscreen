import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useMemo, useEffect } from "react";
import {
  TrackType,
  DisplayMode,
  LDTrackConfig,
  useCustomData,
  BigBedConfig,
  SNP,
  TrackStoreInstance,
} from "genomebrowser-test";
import { BrowserStoreInstance, DataStoreInstance } from "genomebrowser-test";

// Custom tooltip component for eQTL LD track (SVG-based)
const QTLLDTooltip: React.FC<
  SNP & { targetGene?: string }
> = (props) => {
  const lines = [
    `Position: ${
      props.chromosome
    }:${props.start.toLocaleString()}-${props.stop.toLocaleString()}`,
  ];

  if (props.targetGene) {
    lines.push(`Target Gene: ${props.targetGene}`);
  }

  const lineHeight = 16;
  const padding = 8;
  const width = 300;
  const height = lines.length * lineHeight + padding * 2;

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="white"
        stroke="#333"
        strokeWidth={1}
        rx={4}
      />
      {lines.map((line, index) => (
        <text
          key={index}
          x={padding}
          y={padding + (index + 1) * lineHeight}
          fontSize={12}
          fill="#333"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export function createQtlLDTrack(trackId: string, title: string): LDTrackConfig {
  return {
    id: trackId,
    title: title,
    trackType: TrackType.LDTrack,
    displayMode: DisplayMode.LDBlock,
    height: 50,
    titleSize: 12,
    color: "#000000",
    show: [], // Will be updated via editTrack callback
    tooltip: QTLLDTooltip,
  };
}

export const BIGDATA_QUERY = gql`
  query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
      data
      error {
        errortype
        message
      }
    }
  }
`;

/**
 * Parses BigBed eQTL data and transforms it into LD block format.
 * - Original rects are the lead SNPs (eQTL variants)
 * - Parsed target regions from name field are the non-lead SNPs
 * Each BigBed rect has a name field with format: chr:start-end:targetGene
 */
function parseQTLToLDBlocks(bigBedData: any[]): {
  entries: any[];
  leadSnps: string[];
} {
  if (!bigBedData || bigBedData.length === 0)
    return { entries: [], leadSnps: [] };

  const ldEntries: any[] = [];
  const leadSnps: string[] = [];

  bigBedData.forEach((entry) => {
    // Parse the name field to extract target region info
    const nameParts = entry.name?.split(":") || [];

    // Check if this is a valid interaction (not NA:)
    if (entry.name?.includes("NA:")) {
      // Self-interaction - add as lead SNP but don't add to leadSnps array
      // This prevents arcs from being shown for self-interactions
      const targetGene = nameParts[2] || "Unknown";
      const leadSnpId = `${entry.chr}:${entry.start}`;

      ldEntries.push({
        chromosome: entry.chr,
        ldblock: 1,
        ldblocksnpid: leadSnpId,
        snpid: leadSnpId,
        start: entry.start,
        stop: entry.end,
        rsquare: "1.0",
        targetGene,
      });
      // Note: NOT adding to leadSnps array so no arc is shown
    } else {
      // Real interaction - create both lead and target entries
      const targetChr = nameParts[0] || entry.chr;
      const targetRange = nameParts[1]?.split("-") || [];
      const targetStart = targetRange[0]
        ? parseInt(targetRange[0])
        : entry.start;
      const targetEnd = targetRange[1] ? parseInt(targetRange[1]) : entry.end;
      // For eQTL data, target gene is in position 2 (no TF field)
      const targetGene = nameParts[2] || "Unknown";

      // Lead SNP (eQTL variant) - marked with asterisk in rsquare and "Lead" in ldblocksnpid
      const leadSnpId = `${entry.chr}:${entry.start}`;
      ldEntries.push({
        chromosome: entry.chr,
        ldblock: 1,
        ldblocksnpid: `Lead_${leadSnpId}`, // Contains "Lead" to identify as lead SNP
        snpid: leadSnpId,
        start: entry.start,
        stop: entry.end,
        rsquare: "1.0*", // Asterisk marks this as a lead SNP
        targetGene,
      });
      leadSnps.push(leadSnpId);

      // Non-lead SNP (target region) - links to lead but NO "Lead" marker
      const targetSnpId = `${targetChr}:${targetStart}`;
      ldEntries.push({
        chromosome: targetChr,
        ldblock: 1,
        ldblocksnpid: leadSnpId, // Links to lead SNP (no "Lead_" prefix)
        snpid: targetSnpId,
        start: targetStart,
        stop: targetEnd,
        rsquare: entry.score ? (entry.score / 1000).toFixed(2) : "0.8", // No asterisk
        targetGene,
      });
    }
  });

  return { entries: ldEntries, leadSnps };
}

/**
 * Hook to fetch and parse eQTL BigBed data for LD block visualization
 */
export function useQTLLDData(
  tracks: BigBedConfig[],
  browserStore: BrowserStoreInstance,
  dataStore: DataStoreInstance,
  trackStore: TrackStoreInstance
) {
  const getDomain = browserStore((state) => state.getExpandedDomain);
  const preRenderedWidth = browserStore(
    (state) => state.trackWidth * state.multiplier
  );
  const editTrack = trackStore((state) => state.editTrack);

  // Create BigRequests for all eQTL tracks
  const bigRequests = useMemo(
    () =>
      tracks.map((track) => ({
        url: track.url,
        chr1: getDomain().chromosome,
        start: getDomain().start,
        end: getDomain().end,
        preRenderedWidth,
      })),
    [tracks, getDomain, preRenderedWidth]
  );

  const { data, error, loading } = useQuery(BIGDATA_QUERY, {
    variables: { bigRequests },
    skip: tracks.length === 0,
  });

  const ldDataByTrack = useMemo(() => {
    if (!data || !data.bigRequests) return [];

    // Parse each track separately
    return data.bigRequests.map((response: any, index: number) => {
      if (!response.data)
        return {
          entries: [],
          leadSnps: [],
          trackId: tracks[index]?.id || `track-${index}`,
        };

      const parsed = parseQTLToLDBlocks(response.data);
      return {
        ...parsed,
        trackId: tracks[index]?.id || `track-${index}`,
        trackTitle: tracks[index]?.title || `Track ${index + 1}`,
      };
    });
  }, [data, tracks]);

  // Create custom data for track 0
  useCustomData(
    ldDataByTrack[0] ? `qtl-ld-${ldDataByTrack[0].trackId}` : "qtl-ld-0",
    {
      data: ldDataByTrack[0]?.entries || [],
      error,
      loading,
    },
    dataStore
  );

  // Create custom data for track 1
  useCustomData(
    ldDataByTrack[1] ? `qtl-ld-${ldDataByTrack[1].trackId}` : "qtl-ld-1",
    {
      data: ldDataByTrack[1]?.entries || [],
      error,
      loading,
    },
    dataStore
  );

  // Create custom data for track 2
  useCustomData(
    ldDataByTrack[2] ? `qtl-ld-${ldDataByTrack[2].trackId}` : "qtl-ld-2",
    {
      data: ldDataByTrack[2]?.entries || [],
      error,
      loading,
    },
    dataStore
  );

  // Update lead SNPs via editTrack when data changes
  useEffect(() => {
    ldDataByTrack.forEach((trackData) => {
      if (trackData.trackId) {
        editTrack(`qtl-ld-${trackData.trackId}`, {
          show: trackData.leadSnps,
        });
      }
    });
  }, [ldDataByTrack, editTrack]);
}
