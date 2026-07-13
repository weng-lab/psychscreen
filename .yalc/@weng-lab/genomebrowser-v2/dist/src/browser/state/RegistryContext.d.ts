import { ReactNode } from 'react';
import { ModuleRegistry } from '../../modules/registry';
export declare const RegistryContext: import('react').Context<ModuleRegistry | null>;
export declare function RegistryProvider({ registry, children, }: {
    registry: ModuleRegistry;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
