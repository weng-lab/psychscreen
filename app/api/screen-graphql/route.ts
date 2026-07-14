const PSYCHSCREEN_GRAPHQL_ENDPOINT =
  "https://psychscreen.api.wenglab.org/graphql";

export async function POST(request: Request) {
  const apiKey = process.env.SCREEN_API_KEY;
  if (!apiKey) {
    console.error("SCREEN_API_KEY is not configured");
    return Response.json(
      { errors: [{ message: "SCREEN API is not configured" }] },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(PSYCHSCREEN_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(15_000)]),
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
    if (request.signal.aborted) return new Response(null, { status: 499 });
    console.error("Failed to proxy SCREEN GraphQL", error);
    return Response.json(
      { errors: [{ message: "SCREEN request failed" }] },
      { status: 502 },
    );
  }
}
