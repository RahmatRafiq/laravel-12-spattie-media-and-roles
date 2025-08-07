import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import DataTable, { DataTableRef } from 'datatables.net-react';
import DT, { ObjectColumnData, Api } from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

interface AjaxConfig {
  url: string;
  type: string;
  data?: (d: Record<string, unknown>) => void;
  headers?: Record<string, string>;
}

interface DataTableWrapperProps<T> {
  ajax: AjaxConfig;
  columns: Array<{
    data: string | number | ObjectColumnData | null;
    title: string;
    render?: (data: T[keyof T] | null, type: string, row: T, meta: unknown) => string;
    orderable?: boolean;
    searchable?: boolean;
  }>;
  options?: object;
  onRowDelete?: (id: number) => void;
}

// Tambahkan method dt ke interface
export interface DataTableWrapperRef {
  reload: () => void;
  dt: () => Api | null;
  updateUrl: (newUrl: string) => void;
}

const DataTableWrapper = forwardRef(function DataTableWrapper<T>(
  { ajax, columns, options, onRowDelete }: DataTableWrapperProps<T>,
  ref: React.Ref<DataTableWrapperRef>
) {
  DataTable.use(DT);
  const tableRef = useRef<DataTableRef | null>(null);

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

    document.addEventListener('click', handleDelete);
    return () => document.removeEventListener('click', handleDelete);
  }, [onRowDelete]);

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
      columns={columns}
      options={tableOptions}
      className="display min-w-full bg-white dark:bg-gray-800 border w-full"
      ref={(instance) => {
        tableRef.current = instance ? instance : null;
      }}
    >
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>
              {typeof col.data === 'string'
                ? col.data.charAt(0).toUpperCase() + col.data.slice(1)
                : 'Actions'}
            </th>
          ))}
        </tr>
      </thead>
    </DataTable>
  );
});

export default DataTableWrapper;
