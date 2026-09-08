import { bigBedModule } from "@weng-lab/genomebrowser-tracks/bigbed";
import { bigWigModule } from "@weng-lab/genomebrowser-tracks/bigwig";
import { caveModule } from "@weng-lab/genomebrowser-tracks/cave";
import { geneModule } from "@weng-lab/genomebrowser-tracks/gene";
import { methylCModule } from "@weng-lab/genomebrowser-tracks/methylc";

export const TRACK_MODULES = [
  bigBedModule,
  bigWigModule,
  caveModule,
  geneModule,
  methylCModule,
];
