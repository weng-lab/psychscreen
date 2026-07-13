import {
  bigBedModule,
  bigWigModule,
  transcriptModule,
} from "@weng-lab/genomebrowser-v2";
import { defineTrackSelectConfig } from "@weng-lab/genomebrowser-ui-v2/cli";

export default defineTrackSelectConfig({
  modules: [bigWigModule, bigBedModule, transcriptModule],
});
