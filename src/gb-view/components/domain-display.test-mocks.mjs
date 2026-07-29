import { createElement } from "react";

function element(tag) {
  return function MockMaterialComponent({ children }) {
    return createElement(tag, null, children);
  };
}

export const Box = element("div");
export const Stack = element("div");
export const Typography = element("span");

export function Cytobands(props) {
  globalThis.__domainDisplayCytobandsProps = props;
  return createElement("div", { "data-testid": "cytobands" });
}
