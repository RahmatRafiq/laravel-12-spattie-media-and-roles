import { useEffect } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

interface DataTableWrapperProps {
  ajax: {
    url: string;
    type: string;
    headers?: Record<string, string>;
  };
  columns: { data: string | number | null; title: string }[];
  options?: object;
  onRowDelete?: (id: number) => void;
}

export default function DataTableWrapper({
  ajax,
  columns,
  options,
  onRowDelete,
}: DataTableWrapperProps) {
  DataTable.use(DT);

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
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
  };

  // Merge headers: props > default
  const mergedHeaders = {
    ...defaultHeaders,
    ...(ajax.headers || {}),
  };

  return (
    <DataTable
      ajax={{
        ...ajax,
        headers: mergedHeaders,
      }}
      columns={columns}
      className="display min-w-full bg-white dark:bg-gray-800 border w-full"
      options={{
        processing: true,
        serverSide: true,
        paging: true,
        ...options,
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
}
