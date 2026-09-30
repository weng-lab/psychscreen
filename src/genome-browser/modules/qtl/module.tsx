import { createInteractionModule } from "../interactions/module";
import { parseQtlRow } from "./parse";

export const singleCellQtlModule = createInteractionModule({
  type: "singleCellQtl",
  parseRow: parseQtlRow,
  color: "#000000",
});
