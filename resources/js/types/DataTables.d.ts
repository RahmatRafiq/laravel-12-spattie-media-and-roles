// Unified DataTable Types
export type RenderFunction<T> = (
    data: T[keyof T] | null,
    type: string,
    row: T,
    meta: unknown
) => string;

export interface AjaxConfig {
    url: string;
    type: string;
    data?: (d: Record<string, unknown>) => void;
    headers?: Record<string, string>;
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
    title: string;
    render?: RenderFunction<T>;
    orderable?: boolean;
    searchable?: boolean;
    className?: string;
}

export interface DataTableWrapperProps<T> {
    ajax: AjaxConfig;
    columns: DataTableColumn<T>[];
    options?: object;
    onRowDelete?: (id: number) => void;
    expand?: ExpandConfig<T>;
}

export interface DataTableWrapperRef {
    reload: () => void;
    dt: () => any | null;
    updateUrl: (newUrl: string) => void;
}