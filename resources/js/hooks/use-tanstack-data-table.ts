import { router } from '@inertiajs/react';
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
import { useEffect, useMemo, useState, useRef } from 'react';

interface UseTanstackDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    links: any;
}

export function useTanstackDataTable<TData>({ 
    data, 
    columns, 
    meta, 
    links: _links, 
}: UseTanstackDataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: meta.current_page - 1,
        pageSize: meta.per_page,
    });
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const isFirstRender = useRef(true);

    // Sync state with props when they change (e.g. on external navigation or initial load)
    useEffect(() => {
        setPaginationState({
            pageIndex: meta.current_page - 1,
            pageSize: meta.per_page,
        });
    }, [meta.current_page, meta.per_page]);

    // Inertia Mode URL Synchronization
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params: any = {
            page: paginationState.pageIndex + 1,
            per_page: paginationState.pageSize,
        };

        if (sorting.length > 0) {
            params.sort = sorting[0].id;
            params.direction = sorting[0].desc ? 'desc' : 'asc';
        }

        if (globalFilter) {
            params['filter[global]'] = globalFilter;
        }

        // Add any existing column filters
        columnFilters.forEach(filter => {
            params[`filter[${filter.id}]`] = filter.value;
        });

        // Merge with existing query parameters to preserve other filters (e.g. status tabs)
        const currentParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
        const allParams = {
            ...currentParams,
            ...params
        };

        router.get(window.location.pathname, allParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [sorting, columnFilters, globalFilter, paginationState.pageIndex, paginationState.pageSize]);

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
            globalFilter,
            pagination,
            expanded,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
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

    return { table, pagination, sorting, columnFilters, globalFilter, links: _links };
}
