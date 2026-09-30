import { z } from "zod";

const anchorSchema = z.object({
  id: z.string().min(1),
  chromosome: z.string().min(1),
  start: z.number(),
  end: z.number(),
});

export function parseLDAnchor(value: unknown) {
  const result = anchorSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
