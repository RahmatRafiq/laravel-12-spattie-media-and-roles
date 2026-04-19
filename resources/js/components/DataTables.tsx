import { AjaxConfig, DataTableOptions, DataTableWrapperProps, DataTableWrapperRef, ExpandConfig } from '@/types/DataTables';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import DataTable, { DataTableRef } from 'datatables.net-react';
import { router } from '@inertiajs/react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export type { AjaxConfig, DataTableOptions, DataTableWrapperProps, DataTableWrapperRef, ExpandConfig };

export function createExpandConfig<T>(config: ExpandConfig<T>): ExpandConfig<T> {
    return config;
}

const DataTableWrapperInner = forwardRef<DataTableWrapperRef, DataTableWrapperProps<unknown>>(function DataTableWrapper(
    { ajax, columns, options, onRowDelete, onRowRestore, onRowForceDelete, expand },
    ref,
) {
    DataTable.use(DT);
    const tableRef = useRef<DataTableRef | null>(null);

    const processedColumns = expand?.enabled
        ? [
            {
                data: null,
                title: expand.columnTitle || '',
                orderable: false,
                searchable: false,
                className: 'details-control',
                render: (): string => `<span style="cursor: pointer;">${expand.expandIcon || '+'}</span>`,
            },
            ...columns,
        ]
        : columns;

    useImperativeHandle(ref, () => ({
        reload: () => {
            if (tableRef.current) {
                tableRef.current.dt()?.ajax.reload(undefined, false);
            }
        },
        dt: () => (tableRef.current ? tableRef.current.dt() : null),
        updateUrl: (newUrl: string) => {
            if (tableRef.current) {
                const dt = tableRef.current.dt();
                if (dt) {
                    dt.ajax.url(newUrl).load();
                }
            }
        },
    }));

    useEffect(() => {
        const handleAction = (event: Event) => {
            const target = event.target as HTMLElement;
            const id = target.getAttribute('data-id');
            
            // 1. Intercept internal links for SPA navigation (even without data-id)
            const anchor = target.closest('a');
            if (anchor && !anchor.getAttribute('target')) {
                const href = anchor.getAttribute('href');
                if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
                    event.preventDefault();
                    router.visit(href);
                    return;
                }
            }

            // 2. Handle specific row actions (requires data-id)
            if (!id) return;

            if (target.matches('.btn-delete') && onRowDelete) {
                onRowDelete(Number(id));
            } else if (target.matches('.btn-restore') && onRowRestore) {
                onRowRestore(Number(id));
            } else if (target.matches('.btn-force-delete') && onRowForceDelete) {
                onRowForceDelete(Number(id));
            }
        };

        const handleExpand = (event: Event) => {
            const target = event.target as HTMLElement;
            const detailsControl = target.closest('.details-control');

            if (detailsControl && expand?.enabled) {
                const tr = detailsControl.closest('tr');
                if (!tr) return;

                const table = tableRef.current?.dt();
                if (!table) return;

                const row = table.row(tr);
                const isShown = row.child.isShown();

                if (isShown) {
                    row.child.hide();
                    tr.classList.remove('shown');
                    detailsControl.innerHTML = `<span style="cursor: pointer;">${expand.expandIcon || '+'}</span>`;
                } else {
                    const content = expand.renderContent(row.data());
                    row.child(content).show();
                    tr.classList.add('shown');
                    detailsControl.innerHTML = `<span style="cursor: pointer;">${expand.collapseIcon || '-'}</span>`;
                }
            }
        };

        document.addEventListener('click', handleAction);
        document.addEventListener('click', handleExpand);

        return () => {
            document.removeEventListener('click', handleAction);
            document.removeEventListener('click', handleExpand);
        };
    }, [expand, onRowDelete, onRowRestore, onRowForceDelete]);

    const defaultHeaders: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    };

    const mergedHeaders: Record<string, string> = {
        ...defaultHeaders,
        ...(ajax.headers || {}),
    };

    const defaultOptions: DataTableOptions = {
        processing: true,
        serverSide: true,
        paging: true,
        searchDelay: 500,
        responsive: {
            breakpoints: [
                { name: 'desktop', width: Infinity },
                { name: 'tablet-l', width: 1024 },
                { name: 'tablet-p', width: 768 },
                { name: 'mobile-l', width: 640 },
            ],
            details: {
                type: 'inline',
                target: 'tr'
            }
        },
    };

    const tableOptions: DataTableOptions = { ...defaultOptions, ...options };

    return (
        <DataTable
            ajax={{
                ...ajax,
                headers: mergedHeaders,
            }}
            columns={processedColumns}
            options={tableOptions}
            className="display w-full min-w-full border bg-white dark:bg-gray-800"
            ref={(instance: DataTableRef | null) => {
                tableRef.current = instance;
            }}
        >
            <thead>
                <tr>
                    {processedColumns.map((col, index) => (
                        <th key={index}>
                            {typeof col.data === 'string' ? col.data.charAt(0).toUpperCase() + col.data.slice(1) : col.title || 'Actions'}
                        </th>
                    ))}
                </tr>
            </thead>
        </DataTable>
    );
});

function DataTableWrapper<T = unknown>(props: DataTableWrapperProps<T> & { ref?: React.Ref<DataTableWrapperRef> }) {
    const { ref, ...otherProps } = props;
    const typedProps = otherProps as DataTableWrapperProps<unknown>;
    return <DataTableWrapperInner ref={ref} {...typedProps} />;
}

export default DataTableWrapper;
