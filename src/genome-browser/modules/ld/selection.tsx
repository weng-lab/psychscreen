import { createContext, useContext, useSyncExternalStore } from "react";
import type { LDSelection } from "./types";

export function createLDSelectionStore() {
  let selection: LDSelection = { associatedVariantIds: [] };
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => selection,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(next: LDSelection) {
      selection = next;
      listeners.forEach((listener) => listener());
    },
  };
}
export type LDSelectionStore = ReturnType<typeof createLDSelectionStore>;
const LDSelectionContext = createContext<LDSelectionStore | null>(null);
export const LDSelectionProvider = LDSelectionContext.Provider;

export function useLDSelection() {
  const store = useContext(LDSelectionContext);
  if (!store)
    throw new Error("LD tracks require a session-owned LDSelectionProvider");
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}

const EMPTY_SELECTION: LDSelection = { associatedVariantIds: [] };
const emptySnapshot = () => EMPTY_SELECTION;
const emptySubscribe = () => () => {};

// Standalone Manhattan tracks work without a linked LD session.
export function useOptionalLDSelection() {
  const store = useContext(LDSelectionContext);
  return useSyncExternalStore(
    store?.subscribe ?? emptySubscribe,
    store?.getSnapshot ?? emptySnapshot,
    store?.getSnapshot ?? emptySnapshot,
  );
}
