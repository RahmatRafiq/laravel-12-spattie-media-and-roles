import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import DataTable, { DataTableRef } from 'datatables.net-react';
import DT, { ObjectColumnData, Api } from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { 
    AjaxConfig, 
    ExpandConfig, 
    DataTableWrapperProps, 
    DataTableWrapperRef,
    DataTableOptions
} from '@/types/DataTables';

export type { DataTableWrapperRef, ExpandConfig, AjaxConfig, DataTableWrapperProps, DataTableOptions };

export function createExpandConfig<T>(config: ExpandConfig<T>): ExpandConfig<T> {
    return config;
}

const DataTableWrapperInner = forwardRef<DataTableWrapperRef, DataTableWrapperProps<unknown>>(
    function DataTableWrapper({ ajax, columns, options, onRowDelete, expand }, ref) {
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
                ...columns
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
        const handleDelete = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.btn-delete')) {
                const id = target.getAttribute('data-id');
                if (id && confirm('Are you sure to delete this item?')) {
                    onRowDelete?.(Number(id));
                }
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

        document.addEventListener('click', handleDelete);
        document.addEventListener('click', handleExpand);
        
        return () => {
            document.removeEventListener('click', handleDelete);
            document.removeEventListener('click', handleExpand);
        };
    }, [onRowDelete, expand]);

    const defaultHeaders: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
            '',
    };

    const mergedHeaders: Record<string, string> = {
        ...defaultHeaders,
        ...(ajax.headers || {}),
    };

    const defaultOptions: DataTableOptions = {
        processing: true,
        serverSide: true,
        paging: true,
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
            className="display min-w-full bg-white dark:bg-gray-800 border w-full"
            ref={(instance: DataTableRef | null) => {
                tableRef.current = instance;
            }}
        >
            <thead>
                <tr>
                    {processedColumns.map((col, index) => (
                        <th key={index}>
                            {typeof col.data === 'string'
                                ? col.data.charAt(0).toUpperCase() + col.data.slice(1)
                                : col.title || 'Actions'}
                        </th>
                    ))}
                </tr>
            </thead>
        </DataTable>
    );
});

// Generic wrapper function to handle typed expand configs
function DataTableWrapper<T = unknown>(props: DataTableWrapperProps<T> & { ref?: React.Ref<DataTableWrapperRef> }) {
    const { ref, ...otherProps } = props;
    // Type assertion to bypass the generic constraint
    const typedProps = otherProps as DataTableWrapperProps<unknown>;
    return <DataTableWrapperInner ref={ref} {...typedProps} />;
}

export default DataTableWrapper;
