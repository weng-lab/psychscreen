export interface TrackTemplate {
  title: string;
  url: string;
}

export interface TrackList {
  [key: string]: TrackTemplate[];
}
