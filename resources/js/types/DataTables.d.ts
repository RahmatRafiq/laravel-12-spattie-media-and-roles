// Unified DataTable Types - Compatible with datatables.net-dt v2.2.2
import { Api, Config } from 'datatables.net-dt';

export type RenderFunction<T> = (
    data: T[keyof T] | null,
    type: 'display' | 'type' | 'sort' | 'export',
    row: T,
    meta: { row: number; col: number; settings: object },
) => string | number;

export interface AjaxConfig {
    url: string;
    type?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: (requestData: Record<string, unknown>) => Record<string, unknown>;
    headers?: Record<string, string>;
    dataSrc?: string | ((json: Record<string, unknown>) => unknown[]);
}

export interface ExpandConfig<T> {
    enabled: boolean;
    renderContent: (rowData: T) => string;
    expandIcon?: string;
    collapseIcon?: string;
    columnTitle?: string;
}

export interface DataTableColumn<T> {
    data: string | number | null;
    name?: string;
    title: string;
    render?: RenderFunction<T>;
    orderable?: boolean;
    searchable?: boolean;
    className?: string;
    width?: string;
    visible?: boolean;
    defaultContent?: string;
}

// Use the official DataTables Config type but make it optional
export type DataTableOptions = Partial<Config>;

export interface DataTableWrapperProps<T> {
    ajax: AjaxConfig;
    columns: DataTableColumn<T>[];
    options?: DataTableOptions;
    onRowDelete?: (id: number) => void;
    expand?: ExpandConfig<T>;
}

export interface DataTableWrapperRef {
    reload: () => void;
    dt: () => Api | null;
    updateUrl: (newUrl: string) => void;
}
