import { z } from "zod";

const PSYCHSCREEN_GRAPHQL_ENDPOINT =
  "https://psychscreen.api.wenglab.org/graphql";

const transcriptQuery = `
  query Gene($chromosome: String, $assembly: String!, $start: Int, $end: Int, $version: Int) {
    gene(assembly: $assembly, chromosome: $chromosome, start: $start, end: $end, version: $version) {
      strand
      name
      id
      transcripts {
        coordinates {
          start
          end
        }
        name
        id
        exons {
          coordinates {
            start
            end
          }
          UTRs {
            coordinates {
              start
              end
            }
          }
        }
        tag
      }
    }
  }
`;

const requestSchema = z.object({
  variables: z.object({
    chromosome: z.string().trim().min(1).max(100),
    assembly: z.literal("GRCh38"),
    start: z.number().int().nonnegative(),
    end: z.number().int().positive(),
    version: z.number().int().positive(),
  }),
});

export async function POST(request: Request) {
  const input = requestSchema.safeParse(
    await request.json().catch(() => undefined),
  );
  if (!input.success) {
    return Response.json(
      { errors: [{ message: "Invalid GraphQL request" }] },
      { status: 400 },
    );
  }

  return proxyScreenRequest({
    body: JSON.stringify({
      query: transcriptQuery,
      variables: input.data.variables,
    }),
    signal: request.signal,
  });
}

async function proxyScreenRequest({
  body,
  signal,
}: {
  body: string;
  signal: AbortSignal;
}) {
  try {
    const response = await fetch(PSYCHSCREEN_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
    });
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    if (signal.aborted) return new Response(null, { status: 499 });
    console.error("Failed to proxy SCREEN GraphQL", error);
    return Response.json(
      { errors: [{ message: "SCREEN request failed" }] },
      { status: 502 },
    );
  }
}
