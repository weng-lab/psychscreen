import { SettingsStoreInstance } from './state/settingsStore';
import { BrowserStoreInstance } from './state/browserStore';
import { TrackStoreInstance } from './state/trackStore';
export type GenomeBrowserProps = {
    browserStore: BrowserStoreInstance;
    trackStore: TrackStoreInstance;
    settingsStore?: SettingsStoreInstance;
};
export declare function GenomeBrowser({ browserStore, trackStore, settingsStore }: GenomeBrowserProps): import("react/jsx-runtime").JSX.Element;
