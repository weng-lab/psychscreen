import { ReactNode } from 'react';
type ConfirmDialogProps = {
    open: boolean;
    title: string;
    text: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onClose: () => void;
    onConfirm?: () => void;
};
export declare function ConfirmDialog({ open, title, text, confirmLabel, cancelLabel, onClose, onConfirm, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
