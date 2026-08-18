import {
    flexRender,
    type HeaderGroup,
    type Row,
    type Cell,
    type Table as TanTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

interface DataTableProps<T> {
    table: TanTable<T>;
    emptyMessage?: string;
}

export function DataTable<T>({ table, emptyMessage = 'Tidak ada data.' }: DataTableProps<T>) {
    const rows = table.getRowModel().rows;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        {table.getHeaderGroups().map((hg: HeaderGroup<T>) => (
                            <tr key={hg.id} className="bg-gray-50/80">
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left"
                                        style={{
                                            width:
                                                header.getSize() !== 150
                                                    ? header.getSize()
                                                    : undefined,
                                        }}
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-500 uppercase hover:text-gray-700"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getIsSorted() === 'asc' ? (
                                                    <ChevronUp className="h-3 w-3" />
                                                ) : header.column.getIsSorted() === 'desc' ? (
                                                    <ChevronDown className="h-3 w-3" />
                                                ) : (
                                                    <ChevronsUpDown className="h-3 w-3 opacity-40" />
                                                )}
                                            </button>
                                        ) : (
                                            <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={table.getAllColumns().length}
                                    className="px-4 py-12 text-center text-sm text-gray-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row: Row<T>) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors hover:bg-gray-50/60"
                                >
                                    {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                                        <td key={cell.id} className="px-4 py-3.5">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
