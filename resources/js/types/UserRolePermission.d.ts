export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
  }

export interface Permission {
    id: number;
    name: string;
  }