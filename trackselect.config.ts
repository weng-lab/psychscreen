import {
  bigBedModule,
  bigWigModule,
  caveModule,
  methylCModule,
  transcriptModule,
} from "@weng-lab/genomebrowser-v2";
import { defineTrackSelectConfig } from "@weng-lab/genomebrowser-ui-v2/cli";
import { singleCellGrnModule } from "./src/gb-view/modules/grn/module";
import { singleCellQtlModule } from "./src/gb-view/modules/qtl/module";

export default defineTrackSelectConfig({
  modules: [
    bigWigModule,
    bigBedModule,
    transcriptModule,
    caveModule,
    methylCModule,
    singleCellGrnModule,
    singleCellQtlModule,
  ],
  schema: {
    outFile: "src/gb-view/schema.json",
  },
});
