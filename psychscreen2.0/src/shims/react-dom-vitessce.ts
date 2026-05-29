import * as ReactDOM from "react-dom";

export default ReactDOM;

const reactDomLegacy = ReactDOM as typeof ReactDOM & Record<string, unknown>;

export const createPortal = ReactDOM.createPortal;
export const flushSync = ReactDOM.flushSync;
export const unstable_batchedUpdates = ReactDOM.unstable_batchedUpdates;

export function render(...args: unknown[]) {
  const legacyRender = reactDomLegacy["render"];
  return typeof legacyRender === "function"
    ? (legacyRender as (...args: unknown[]) => unknown)(...args)
    : null;
}

export function unmountComponentAtNode(...args: unknown[]) {
  const legacyUnmount = reactDomLegacy["unmountComponentAtNode"];
  return typeof legacyUnmount === "function"
    ? (legacyUnmount as (...args: unknown[]) => unknown)(...args)
    : false;
}

export function findDOMNode(componentOrElement: unknown) {
  const legacyFindDOMNode = reactDomLegacy["findDOMNode"];

  if (typeof legacyFindDOMNode === "function") {
    return (legacyFindDOMNode as (componentOrElement: unknown) => unknown)(
      componentOrElement
    );
  }

  if (
    componentOrElement instanceof Element ||
    componentOrElement instanceof Document
  ) {
    return componentOrElement;
  }

  return null;
}
