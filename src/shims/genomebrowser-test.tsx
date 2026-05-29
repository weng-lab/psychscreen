import React from "react";

export enum TrackType {
  Transcript = "Transcript",
  BigBed = "BigBed",
  BigWig = "BigWig",
  LDTrack = "LDTrack",
  Manhattan = "Manhattan",
}

export enum DisplayMode {
  Squish = "Squish",
  Dense = "Dense",
  Full = "Full",
  GenericLD = "GenericLD",
  LDBlock = "LDBlock",
  Scatter = "Scatter",
}

export type Chromosome = string;
export type Domain = { chromosome: Chromosome; start: number; end: number };
export type SNP = {
  id?: string;
  chromosome: string;
  start: number;
  stop: number;
  [key: string]: unknown;
};
export type ManhattanPoint = {
  snpId: string;
  value: string | number;
  chr: string;
  start: number;
  end: number;
  [key: string]: unknown;
};

export type Track = Record<string, unknown> & { id: string; title?: string };
export type BigBedConfig = Track;
export type BigWigConfig = Track;
export type TranscriptConfig = Track;
export type LDTrackConfig = Track & { show?: SNP[] };
export type ManhattanTrackConfig = Track;

type Store<State> = (<T>(selector: (state: State) => T) => T) & {
  getState: () => State;
};

function createStore<State>(state: State): Store<State> {
  const store = ((selector) => selector(state)) as Store<State>;
  store.getState = () => state;
  return store;
}

const noop = (..._args: unknown[]) => undefined;
const DEFAULT_DOMAIN: Domain = {
  chromosome: "chr1",
  start: 0,
  end: 1,
};

export type BrowserStoreInstance = Store<Record<string, any>>;
export type TrackStoreInstance = Store<Record<string, any>>;
export type DataStoreInstance = Store<Record<string, any>>;

export function createBrowserStore(config: Record<string, any> = {}) {
  const domain = config.domain || DEFAULT_DOMAIN;
  return createStore({
    ...config,
    domain,
    marginWidth: config.marginWidth || 100,
    trackWidth: config.trackWidth || 1400,
    multiplier: config.multiplier || 1,
    addHighlight: noop,
    setDomain: noop,
    getDomain: () => domain,
    getExpandedDomain: () => domain,
  });
}

export function createTrackStore(tracks: Track[] = []) {
  return createStore({
    tracks,
    addTrack: noop,
    editTrack: noop,
    removeTrack: noop,
    getTrack: (id: string) => tracks.find((track) => track.id === id),
  });
}

export function createDataStore() {
  return createStore({
    setCustomData: noop,
    clearCustomData: noop,
  });
}

export function useCustomData(..._args: unknown[]) {
  return undefined;
}

export function Browser(_props: Record<string, unknown>) {
  return (
    <div
      style={{
        border: "1px solid #d0d7de",
        color: "#57606a",
        padding: 16,
        width: "100%",
      }}
    >
      Genome browser disabled during React 19 migration.
    </div>
  );
}

export function Cytobands(_props: Record<string, unknown>) {
  return null;
}
