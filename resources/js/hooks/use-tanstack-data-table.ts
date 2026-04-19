import {
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    PaginationState,
    SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useDataTableFetch } from './use-data-table-fetch';

interface UseTanstackDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links: any;
    jsonUrl?: string;
}

export function useTanstackDataTable<TData>({ 
    data: initialData, 
    columns, 
    meta: initialMeta, 
    links: initialLinks, 
    jsonUrl 
}: UseTanstackDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: initialMeta.current_page - 1,
        pageSize: initialMeta.per_page,
    });
    const [expanded, setExpanded] = useState<ExpandedState>({});

    // If jsonUrl is provided, fetch data via AJAX. Otherwise, use initial props.
    const { data, meta, links } = jsonUrl
        ? useDataTableFetch({
            jsonUrl,
            initialData: { data: initialData, meta: initialMeta, links: initialLinks },
            sorting,
            columnFilters,
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
        })
        : { data: initialData, meta: initialMeta, links: initialLinks };

    const pagination = useMemo<PaginationState>(
        () => ({
            pageIndex: meta.current_page - 1,
            pageSize: meta.per_page,
        }),
        [meta.current_page, meta.per_page]
    );

    const table = useReactTable({
        data,
        columns,
        pageCount: meta.last_page,
        state: {
            sorting,
            columnFilters,
            pagination,
            expanded,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater(paginationState);
                setPaginationState(newState);
            } else {
                setPaginationState(updater);
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return { table, pagination, sorting, columnFilters, links };
}
