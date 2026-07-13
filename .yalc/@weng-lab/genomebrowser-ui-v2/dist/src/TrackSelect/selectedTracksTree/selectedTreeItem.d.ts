import { SelectedTreeNode } from './buildSelectedTree';
type SelectedTreeItemProps = {
    node: SelectedTreeNode;
    onRemove: (trackIds: string[]) => void;
};
export declare function SelectedTreeItem({ node, onRemove }: SelectedTreeItemProps): import("react/jsx-runtime").JSX.Element;
export {};
