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
import type { InertiaPaginated } from '@/types';

interface UseTanstackDataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    meta: InertiaPaginated<TData>['meta'] | undefined;
    links: InertiaPaginated<TData>['links'] | undefined;
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
        pageIndex: meta ? meta.current_page - 1 : 0,
        pageSize: meta ? meta.per_page : 10,
    });
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const isFirstRender = useRef(true);

    // Sync state with props when they change (e.g. on external navigation or initial load)
    useEffect(() => {
        if (meta) {
            setPaginationState({
                pageIndex: meta.current_page - 1,
                pageSize: meta.per_page,
            });
        }
    }, [meta]);

    // Inertia Mode URL Synchronization
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params: Record<string, string | number> = {
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
            params[`filter[${filter.id}]`] = filter.value as string;
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
            pageIndex: meta ? meta.current_page - 1 : 0,
            pageSize: meta ? meta.per_page : 10,
        }),
        [meta]
    );

    const table = useReactTable({
        data,
        columns,
        pageCount: meta ? meta.last_page : -1,
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

    return { 
        table, 
        pagination, 
        sorting, 
        columnFilters, 
        globalFilter, 
        links: _links || { first: '', last: '', prev: null, next: null } 
    };
}
