import { z } from "zod";

const PSYCHSCREEN_GRAPHQL_ENDPOINT =
  "https://psychscreen.api.wenglab.org/graphql";
const R_SQUARED_THRESHOLD = 0.7;
// Temporary: keep the upstream query unchanged while testing whether this filter hides prod arcs.
const CLIENT_R_SQUARED_THRESHOLD = 0;

const requestSchema = z.object({
  id: z.string().trim().min(1).max(100),
});

const payloadSchema = z.object({
  data: z
    .object({
      snp: z
        .array(
          z.object({
            linkageDisequilibrium: z
              .array(
                z.object({
                  id: z.string().min(1),
                  rSquared: z.coerce.number(),
                }),
              )
              .nullish(),
          }),
        )
        .nullish(),
    })
    .optional(),
  errors: z.array(z.object({ message: z.string().optional() })).optional(),
});

// Centralize LD population/threshold so the browser track stays consistent.
const query = `
  query PsychscreenLD($ids: [String!]!) {
    snp: snpQuery(assembly: "hg38", snpids: $ids) {
      linkageDisequilibrium(rSquaredThreshold: ${R_SQUARED_THRESHOLD}, population: EUROPEAN) {
        id
        rSquared
      }
    }
  }
`;

export async function POST(request: Request) {
  const input = requestSchema.safeParse(
    await request.json().catch(() => undefined),
  );
  if (!input.success) {
    return Response.json(
      { error: "A valid SNP ID is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(PSYCHSCREEN_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(15_000)]),
      body: JSON.stringify({ query, variables: { ids: [input.data.id] } }),
    });

    if (!response.ok) {
      return Response.json(
        { error: `SCREEN request failed with ${response.status}` },
        { status: 502 },
      );
    }

    const payload = payloadSchema.parse(await response.json());
    if (payload.errors?.length) {
      return Response.json(
        {
          error: payload.errors
            .map((error) => error.message ?? "GraphQL error")
            .join("; "),
        },
        { status: 502 },
      );
    }
    if (!payload.data) {
      return Response.json(
        { error: "SCREEN response did not include data" },
        { status: 502 },
      );
    }

    const associatedVariantIds = [
      ...new Set(
        (payload.data.snp?.[0]?.linkageDisequilibrium ?? [])
          .filter(
            (relationship) =>
              relationship.rSquared >= CLIENT_R_SQUARED_THRESHOLD,
          )
          .map((relationship) => relationship.id),
      ),
    ];

    return Response.json({ associatedVariantIds });
  } catch (error) {
    console.error("Failed to fetch PsychSCREEN LD", error);
    return Response.json(
      { error: "Unable to fetch linkage disequilibrium" },
      { status: 502 },
    );
  }
}
