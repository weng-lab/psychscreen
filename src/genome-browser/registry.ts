import { manhattanModule } from "./modules/manhattan/module";
import { ldModule } from "./modules/ld/module";
import { singleCellGrnModule } from "./modules/grn/module";
import { singleCellQtlModule } from "./modules/qtl/module";
import { bigBedModule } from "@weng-lab/genomebrowser-tracks/bigbed";
import { bigWigModule } from "@weng-lab/genomebrowser-tracks/bigwig";
import { caveModule } from "@weng-lab/genomebrowser-tracks/cave";
import { geneModule } from "@weng-lab/genomebrowser-tracks/gene";
import { methylCModule } from "@weng-lab/genomebrowser-tracks/methylc";
import { rulerModule } from "@weng-lab/genomebrowser-tracks/ruler";

export const TRACK_MODULES = [
  rulerModule,
  bigBedModule,
  bigWigModule,
  caveModule,
  geneModule,
  methylCModule,
  manhattanModule,
  ldModule,
  singleCellGrnModule,
  singleCellQtlModule,
];
