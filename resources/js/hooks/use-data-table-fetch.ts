import { router } from '@inertiajs/react';
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // Import Axios

interface DataTableFetchProps {
    jsonUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialData: any; // The initial data from Inertia props
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
    pageIndex: number;
    pageSize: number;
}

export function useDataTableFetch({ jsonUrl, initialData, sorting, columnFilters, pageIndex, pageSize }: DataTableFetchProps) {
    const [data, setData] = useState(initialData.data);
    const [meta, setMeta] = useState(initialData.meta);
    const [links, setLinks] = useState(initialData.links);

    const isFirstRender = useRef(true);

    useEffect(() => {
        // Only fetch on subsequent renders, not the initial one
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const fetchTableData = async () => {
            const params = new URLSearchParams();

            const sort = sorting[0];
            if (sort) {
                params.set('sort', sort.id);
                params.set('direction', sort.desc ? 'desc' : 'asc');
            }

            const filter = columnFilters[0];
            if (filter) {
                params.set('filter[global]', filter.value as string);
            }

            params.set('page', (pageIndex + 1).toString());
            params.set('per_page', pageSize.toString());

            try {
                // Use axios.post to our JSON endpoint
                const response = await axios.post(jsonUrl, params.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                const responseData = response.data;
                setData(responseData.data);
                setMeta(responseData.meta);
                setLinks(responseData.links);
            } catch (error) {
                console.error("Failed to fetch data from JSON endpoint:", error);
                // Handle error (e.g., show toast notification)
            }
        };

        fetchTableData();
    }, [sorting, columnFilters, pageIndex, pageSize, jsonUrl]);

    return { data, meta, links };
}
