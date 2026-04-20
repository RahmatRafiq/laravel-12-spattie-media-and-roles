import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTanstackDataTable } from '@/hooks/use-tanstack-data-table';
import type { InertiaPaginated } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { ArrowDown, ArrowUp, ArrowUpDown, CircleMinus, CirclePlus, Loader2 } from 'lucide-react';
import React, { useMemo } from 'react';

interface TanstackDataTableProps<TData> {
    columns: ColumnDef<TData>[];
    inertiaPaginated: InertiaPaginated<TData> | undefined;
    headerContent?: React.ReactNode;
}

export function TanstackDataTable<TData>({ columns, inertiaPaginated, headerContent }: TanstackDataTableProps<TData>) {
    const tableColumns = useMemo<ColumnDef<TData>[]>(() => [
        {
            id: 'expander',
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <button
                        type="button"
                        onClick={row.getToggleExpandedHandler()}
                        style={{ cursor: 'pointer' }}
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
        data: inertiaPaginated?.data ?? [],
        columns: tableColumns,
        meta: inertiaPaginated?.meta,
        links: inertiaPaginated?.links,
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between overflow-hidden">
                {headerContent && (
                    <div className="flex-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {headerContent}
                    </div>
                )}
                <div className="flex items-center sm:ml-auto">
                    <Input
                        placeholder="Search all columns..."
                        value={table.getState().globalFilter ?? ''}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="w-full sm:w-[300px]"
                    />
                </div>
            </div>
            <div className="relative rounded-md border w-full overflow-x-auto overflow-y-hidden">
                {!inertiaPaginated && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <Table className="min-w-full table-fixed md:table-auto">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as { className?: string } | undefined;
                                    return (
                                        <TableHead key={header.id} className={meta?.className}>
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
                                        {row.getVisibleCells().map((cell) => {
                                            const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                                            return (
                                                <TableCell key={cell.id} className={cn("py-3", meta?.className)}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow className="bg-muted/30">
                                            <TableCell colSpan={row.getVisibleCells().length}>
                                                <div className="grid grid-cols-1 gap-2 p-4 sm:hidden">
                                                    {row.getAllCells().map((cell) => {
                                                        const meta = cell.column.columnDef.meta as { className?: string } | undefined;
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
                                    {inertiaPaginated ? "No results." : "Loading..."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {pagination.pageIndex + 1} of {table.getPageCount() > 0 ? table.getPageCount() : 1}
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
