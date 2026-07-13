import { TrackSelectCatalog, TrackSelectView } from '../schema/catalogSchema';
export type SelectedTreeNode = {
    id: string;
    label: string;
    kind: "root" | "group" | "leaf";
    trackIds: string[];
    children?: SelectedTreeNode[];
};
export declare function buildSelectedTree({ catalog, view, selectedIds, }: {
    catalog: TrackSelectCatalog;
    view: TrackSelectView;
    selectedIds: Set<string>;
}): SelectedTreeNode | undefined;
