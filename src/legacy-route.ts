export const LEGACY_ROUTE_PREFIX = "/psychscreen";

type RouteLocation = Pick<Location, "pathname" | "search" | "hash">;

export function getLegacyRouteTarget({
  pathname,
  search,
  hash,
}: RouteLocation): string | null {
  if (
    pathname !== LEGACY_ROUTE_PREFIX &&
    !pathname.startsWith(`${LEGACY_ROUTE_PREFIX}/`)
  ) {
    return null;
  }

  const canonicalPath = pathname.slice(LEGACY_ROUTE_PREFIX.length) || "/";
  return `${canonicalPath}${search}${hash}`;
}
