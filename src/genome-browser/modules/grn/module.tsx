import { createInteractionModule } from "../interactions/module";
import { parseGrnRow } from "./parse";

export const singleCellGrnModule = createInteractionModule({
  type: "singleCellGrn",
  parseRow: parseGrnRow,
  color: "#9479bc",
});
