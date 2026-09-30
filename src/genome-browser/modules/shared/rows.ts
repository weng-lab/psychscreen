export type RowParser<Row, Item> = (row: Row) => Item | undefined;

export function parseRows<Row, Item>(
  rows: Row[],
  parseRow: RowParser<Row, Item>,
  source: string,
): Item[] {
  const items: Item[] = [];
  let invalid = 0;
  for (const row of rows) {
    const item = parseRow(row);
    if (item === undefined) invalid++;
    else items.push(item);
  }
  if (invalid)
    console.warn(
      `${source}: skipped ${invalid} malformed row(s) of ${rows.length}`,
    );
  return items;
}

export function parseCoordinates(
  chromosome: string | undefined,
  start: number,
  end: number,
) {
  if (
    !chromosome?.trim() ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start
  )
    return undefined;
  return { chromosome: chromosome.trim(), start, end };
}
