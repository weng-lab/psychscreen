import { Table, TableColDef } from "@weng-lab/ui-components";
import { GENE_CELLTYPE_CARDS } from "../SingleCellPortal/consts";

export type SingleCellExpressionRow = {
  dataset: string;
  gene: string;
  pctexp: number;
  avgexp: number;
  celltype: string;
};

type SingleCellExpressionTableProps = {
  rows: SingleCellExpressionRow[];
  onRowMouseEnter: (row: SingleCellExpressionRow) => void;
  onRowMouseLeave: () => void;
  /** Pins the table's height to match a sibling element (e.g. the paired UMAP), in px. Auto height when omitted. */
  height?: number;
};

const getCelltypeLabel = (row: SingleCellExpressionRow) =>
  GENE_CELLTYPE_CARDS.find((c) => c.val === row.celltype)?.cardLabel || row.celltype;

const columns: TableColDef<SingleCellExpressionRow>[] = [
  {
    field: "celltype",
    headerName: "Cell type",
    valueGetter: (_, row) => getCelltypeLabel(row),
    renderCell: (params) => {
      const label = getCelltypeLabel(params.row);
      const [prefix, suffix] = label.split("-expressing");
      return suffix !== undefined ? (
        <div style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 100,
            }}>
          <i>{prefix}</i>
          {" -expressing"}
          {suffix}
        </div>
      ) : (
        <div style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 100,
            }}>
          {label}
            </div>
      );
    },
  },
  {
    field: "pctexp",
    headerName: "Fraction Cells Non-Zero",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "avgexp",
    headerName: "Avg Expression",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
];

const SingleCellExpressionTable = ({ rows, onRowMouseEnter, onRowMouseLeave, height }: SingleCellExpressionTableProps) => {
  return (
    <Table
      columns={columns}
      rows={rows}
      getRowId={(row) => row.celltype}
      divHeight={height ? { height } : undefined}
      initialState={{
        sorting: { sortModel: [{ field: "avgexp", sort: "desc" }] },
      }}
      onReady={(apiRef) => [
        apiRef.current.subscribeEvent("rowMouseEnter", (params) => onRowMouseEnter(params.row)),
        apiRef.current.subscribeEvent("rowMouseLeave", () => onRowMouseLeave()),
      ]}
    />
  );
};

export default SingleCellExpressionTable;
