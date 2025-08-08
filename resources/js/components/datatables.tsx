import { AjaxConfig, DataTableOptions, DataTableWrapperProps, DataTableWrapperRef, ExpandConfig } from '@/types/DataTables';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTable, { DataTableRef } from 'datatables.net-react';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useConfirmation } from '@/hooks/use-confirmation';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { toast } from '@/utils/toast';

export type { AjaxConfig, DataTableOptions, DataTableWrapperProps, DataTableWrapperRef, ExpandConfig };

export function createExpandConfig<T>(config: ExpandConfig<T>): ExpandConfig<T> {
    return config;
}

const DataTableWrapperInner = forwardRef<DataTableWrapperRef, DataTableWrapperProps<unknown>>(function DataTableWrapper(
    { ajax, columns, options, onRowDelete, onRowRestore, onRowForceDelete, expand, confirmationConfig },
    ref,
) {
    DataTable.use(DT);
    const tableRef = useRef<DataTableRef | null>(null);
    const { confirmationState, openConfirmation, handleConfirm, handleCancel } = useConfirmation();

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
        const handleDelete = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.btn-delete')) {
                const id = target.getAttribute('data-id');
                if (id && onRowDelete) {
                    const config = confirmationConfig?.delete || {};
                    openConfirmation({
                        title: config.title || 'Delete Confirmation',
                        message: config.message || 'Are you sure you want to delete this item?',
                        confirmText: config.confirmText || 'Delete',
                        cancelText: config.cancelText || 'Cancel',
                        variant: 'destructive',
                        onConfirm: () => {
                            onRowDelete(Number(id));
                            if (config.successMessage) {
                                toast.success(config.successMessage);
                            }
                        },
                    });
                }
            }
        };

        const handleRestore = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.btn-restore')) {
                const id = target.getAttribute('data-id');
                if (id && onRowRestore) {
                    const config = confirmationConfig?.restore || {};
                    openConfirmation({
                        title: config.title || 'Restore Confirmation',
                        message: config.message || 'Are you sure you want to restore this item?',
                        confirmText: config.confirmText || 'Restore',
                        cancelText: config.cancelText || 'Cancel',
                        variant: 'default',
                        onConfirm: () => {
                            onRowRestore(Number(id));
                            if (config.successMessage) {
                                toast.success(config.successMessage);
                            }
                        },
                    });
                }
            }
        };

        const handleForceDelete = (event: Event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.btn-force-delete')) {
                const id = target.getAttribute('data-id');
                if (id && onRowForceDelete) {
                    const config = confirmationConfig?.forceDelete || {};
                    openConfirmation({
                        title: config.title || 'Permanent Delete Confirmation',
                        message: config.message || 'Are you sure you want to permanently delete this item? This action cannot be undone!',
                        confirmText: config.confirmText || 'Delete Permanently',
                        cancelText: config.cancelText || 'Cancel',
                        variant: 'destructive',
                        onConfirm: () => {
                            onRowForceDelete(Number(id));
                            if (config.successMessage) {
                                toast.success(config.successMessage);
                            }
                        },
                    });
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
        document.addEventListener('click', handleRestore);
        document.addEventListener('click', handleForceDelete);
        document.addEventListener('click', handleExpand);

        return () => {
            document.removeEventListener('click', handleDelete);
            document.removeEventListener('click', handleRestore);
            document.removeEventListener('click', handleForceDelete);
            document.removeEventListener('click', handleExpand);
        };
    }, [expand, onRowDelete, onRowRestore, onRowForceDelete, confirmationConfig, openConfirmation]);

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
    };

    const tableOptions: DataTableOptions = { ...defaultOptions, ...options };

    return (
        <>
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
            <ConfirmationDialog
                state={confirmationState}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
});

function DataTableWrapper<T = unknown>(props: DataTableWrapperProps<T> & { ref?: React.Ref<DataTableWrapperRef> }) {
    const { ref, ...otherProps } = props;
    const typedProps = otherProps as DataTableWrapperProps<unknown>;
    return <DataTableWrapperInner ref={ref} {...typedProps} />;
}

export default DataTableWrapper;
