import { ApolloError, gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import {
  TrackType,
  DisplayMode,
  LDTrackConfig,
  useCustomData,
  ManhattanTrackConfig,
} from "genomebrowser-test";
import {
  BrowserStoreInstance,
  DataStoreInstance,
  ManhattanPoint,
} from "genomebrowser-test";

export const ldTrack: LDTrackConfig = {
  id: "ld",
  title: "LD",
  trackType: TrackType.LDTrack,
  displayMode: DisplayMode.GenericLD,
  height: 50,
  titleSize: 12,
  color: "#7c97c4",
};

export const manhattanTrack: ManhattanTrackConfig = {
  id: "manhattan",
  title: "Manhattan",
  trackType: TrackType.Manhattan,
  displayMode: DisplayMode.Scatter,
  height: 75,
  titleSize: 12,
  color: "#7c97c4",
  cutoffLabel: "5e-8",
};

export function useManhattanData(
  url: string,
  browserStore: BrowserStoreInstance,
  dataStore: DataStoreInstance
) {
  const getDomain = browserStore((state) => state.getExpandedDomain);
  const preRenderedWidth = browserStore(
    (state) => state.trackWidth * state.multiplier
  );
  const { data, error, loading } = useQuery(BIGDATA_QUERY, {
    variables: {
      bigRequests: [
        {
          url: url,
          chr1: getDomain().chromosome,
          start: getDomain().start,
          end: getDomain().end,
          preRenderedWidth,
        },
      ],
    },
  });

  let noData = false;
  const manhattanData = useMemo(() => {
    if (!data) return [];
    if (data.bigRequests[0].error) {
      noData = true;
      return [];
    }
    const points = data.bigRequests[0].data;
    return points.map((snp: any) => {
      return {
        snpId: snp.name.split("_")[0],
        value: snp.name.split("_")[1],
        chr: snp.chr,
        start: snp.start,
        end: snp.end,
      } as ManhattanPoint;
    });
  }, [data]);

  useCustomData(
    manhattanTrack.id,
    {
      data: manhattanData,
      error: noData ? new ApolloError({ errorMessage: "No Data" }) : error,
      loading,
    },
    dataStore
  );
  useCustomData(
    ldTrack.id,
    {
      data: manhattanData,
      error: noData ? new ApolloError({ errorMessage: "No Data" }) : error,
      loading,
    },
    dataStore
  );
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
