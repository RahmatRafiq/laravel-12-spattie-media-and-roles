import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import DataTable, { DataTableRef } from 'datatables.net-react';
import DT, { ObjectColumnData, Api } from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { 
    AjaxConfig, 
    ExpandConfig, 
    DataTableWrapperProps, 
    DataTableWrapperRef
} from '@/types/DataTables';

export type { DataTableWrapperRef, ExpandConfig, AjaxConfig, DataTableWrapperProps };

export function createExpandConfig<T>(config: ExpandConfig<T>): ExpandConfig<any> {
    return config as ExpandConfig<any>;
}

const DataTableWrapper = forwardRef<DataTableWrapperRef, DataTableWrapperProps<any>>(
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
                    render: () => `<span style="cursor: pointer;">${expand.expandIcon || '+'}</span>`,
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
        const handleDelete = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.matches('.btn-delete')) {
                const id = target.getAttribute('data-id');
                if (id && confirm('Are you sure to delete this item?')) {
                    onRowDelete?.(Number(id));
                }
            }
        };

        const handleExpand = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.closest('.details-control') && expand?.enabled) {
                const cell = target.closest('.details-control');
                if (!cell) return;
                
                const tr = cell.closest('tr');
                if (!tr) return;
                
                const table = tableRef.current?.dt();
                if (!table) return;
                
                const row = table.row(tr);
                const isShown = row.child.isShown();
                
                if (isShown) {
                    row.child.hide();
                    tr.classList.remove('shown');
                    cell.innerHTML = `<span style="cursor: pointer;">${expand.expandIcon || '+'}</span>`;
                } else {
                    const content = expand.renderContent(row.data());
                    row.child(content).show();
                    tr.classList.add('shown');
                    cell.innerHTML = `<span style="cursor: pointer;">${expand.collapseIcon || '-'}</span>`;
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

    const defaultHeaders = {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN':
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
            '',
    };

    const mergedHeaders = {
        ...defaultHeaders,
        ...(ajax.headers || {}),
    };

    const defaultOptions = {
        processing: true,
        serverSide: true,
        paging: true,
    };

    const tableOptions = { ...defaultOptions, ...options };

    return (
        <DataTable
            ajax={{
                ...ajax,
                headers: mergedHeaders,
            }}
            columns={processedColumns}
            options={tableOptions}
            className="display min-w-full bg-white dark:bg-gray-800 border w-full"
            ref={(instance) => {
                tableRef.current = instance ? instance : null;
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

export default DataTableWrapper;
