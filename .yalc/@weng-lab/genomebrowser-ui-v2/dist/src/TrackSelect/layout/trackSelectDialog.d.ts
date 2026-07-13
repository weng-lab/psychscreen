import { ReactNode } from 'react';
type TrackSelectDialogProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
};
export declare function TrackSelectDialog({ open, title, onClose, children }: TrackSelectDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
