import type { LDVariant } from "@weng-lab/genomebrowser-v2";

export type PsychscreenLDAnchor = Pick<
  LDVariant,
  "id" | "chromosome" | "start" | "end"
>;

export type PsychscreenLDConfig = {
  url: string;
  anchor?: PsychscreenLDAnchor;
  associatedVariantIds: string[];
  pinnedVariantId?: string;
};
