import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type RowData,
  type SortingState,
  type TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useState } from "react";

// Per-column class hook so a table can drive responsive column visibility
// (container-query classes like `hidden @lg:table-cell`) without the generic
// DataTable having to know its columns. Applied to both the head and body cell.
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: TableMeta<TData>;
}

// TanStack's `flexRender(cell, cell.getContext())` hands every cell a fresh context
// object each render (table/column/row/getValue/renderValue), so the React Compiler's
// reference-equality memoization never bails a cell out — one table render re-renders
// all cells (and their Base UI dropdown menus). This boundary bails on the *semantic*
// keys instead: `row.original` is referentially stable for unchanged rows (React Query
// structural sharing), and `meta` only changes when the shared invite list does, so a
// mutation re-renders just the row(s) whose data actually changed.
function DataTableRowImpl<TData>({
  row,
}: Readonly<{ row: Row<TData>; meta: TableMeta<TData> | undefined }>) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const DataTableRow = memo(
  DataTableRowImpl,
  (prev, next) => prev.row.original === next.row.original && prev.meta === next.meta,
) as typeof DataTableRowImpl;

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    meta,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    // `@container` so columns hide/show against the card's own width (which the
    // dashboard sidebar shrinks), not the viewport — a viewport `md:` breakpoint
    // would keep columns while the open sidebar squeezes the table into a scroll.
    <div className="@container">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                  {header.isPlaceholder
                    ? undefined
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <DataTableRow key={row.id} row={row} meta={table.options.meta} />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}