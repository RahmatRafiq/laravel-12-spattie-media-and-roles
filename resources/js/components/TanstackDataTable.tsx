import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTanstackDataTable } from '@/hooks/use-tanstack-data-table';
import type { InertiaPaginated } from '@/types';
import { Link } from '@inertiajs/react';
import type { ColumnDef, Table as TanstackTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { ArrowDown, ArrowUp, ArrowUpDown, CircleMinus, CirclePlus } from 'lucide-react';
import React, { useMemo } from 'react';

interface TanstackDataTableProps<TData> {
    columns: ColumnDef<TData>[];
    inertiaPaginated: InertiaPaginated<TData>;
    jsonUrl?: string;
    headerContent?: React.ReactNode;
}

export function TanstackDataTable<TData>({ columns, inertiaPaginated, jsonUrl, headerContent }: TanstackDataTableProps<TData>) {
    const tableColumns = useMemo<ColumnDef<TData>[]>(() => [
        {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <button
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: 'pointer' },
                        }}
                        className="flex items-center justify-center sm:hidden"
                    >
                        {row.getIsExpanded() ? (
                            <CircleMinus className="h-4 w-4 text-red-500" />
                        ) : (
                            <CirclePlus className="h-4 w-4 text-primary" />
                        )}
                    </button>
                ) : null;
            },
            meta: { className: 'w-[40px] sm:hidden' }
        },
        ...columns,
    ], [columns]);

    const { table, pagination, links } = useTanstackDataTable({
        data: inertiaPaginated.data,
        columns: tableColumns,
        meta: inertiaPaginated.meta,
        links: inertiaPaginated.links,
        jsonUrl,
    });

    const handlePreviousPage = () => {
        if (links.prev) {
            table.previousPage();
        }
    };

    const handleNextPage = () => {
        if (links.next) {
            table.nextPage();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {headerContent && (
                    <div className="flex-1 overflow-x-auto pb-1 sm:pb-0">
                        {headerContent}
                    </div>
                )}
                <div className="flex items-center sm:ml-auto">
                    <Input
                        placeholder="Search all columns..."
                        value={(table.getColumn('globalFilter')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('globalFilter')?.setFilterValue(event.target.value)}
                        className="w-full sm:w-[300px]"
                    />
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto w-full">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className={(header.column.columnDef.meta as any)?.className}>
                                            {header.isPlaceholder
                                                ? null
                                                : header.column.getCanSort() ? (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className="-ml-4 h-8 data-[state=open]:bg-accent"
                                                    >
                                                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                        {header.column.getIsSorted() === 'desc' ? (
                                                            <ArrowDown className="ml-2 h-4 w-4" />
                                                        ) : header.column.getIsSorted() === 'asc' ? (
                                                            <ArrowUp className="ml-2 h-4 w-4" />
                                                        ) : (
                                                            <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <div className="py-2">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </div>
                                                )
                                            }
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={cn("whitespace-nowrap", (cell.column.columnDef.meta as any)?.className)}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow className="bg-muted/30">
                                            <TableCell colSpan={row.getVisibleCells().length}>
                                                <div className="grid grid-cols-1 gap-2 p-4 sm:hidden">
                                                    {row.getAllCells().map((cell) => {
                                                        const meta = cell.column.columnDef.meta as any;
                                                        // Only show if it's a "hidden" column on mobile
                                                        if (meta?.className?.includes('hidden') && cell.column.id !== 'expander') {
                                                            return (
                                                                <div key={cell.id} className="flex flex-col border-b border-muted py-2 last:border-0">
                                                                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                                                                        {typeof cell.column.columnDef.header === 'string' 
                                                                            ? cell.column.columnDef.header 
                                                                            : cell.column.id}
                                                                    </span>
                                                                    <div className="mt-1 text-sm">
                                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={!links.prev}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!links.next}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
