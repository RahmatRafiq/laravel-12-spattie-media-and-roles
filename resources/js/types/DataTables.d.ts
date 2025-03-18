type RenderFunction<T> = (
    data: T[keyof T] | null,
    type: string,
    row: T,
    meta: unknown
  ) => string;
  
  interface DataTableColumn<T> {
    data: keyof T | null;
    title: string;
    render?: RenderFunction<T>;
    orderable?: boolean;
    searchable?: boolean;
  }