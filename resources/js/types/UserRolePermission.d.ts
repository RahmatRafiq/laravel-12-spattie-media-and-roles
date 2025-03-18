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

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    roles: { name: string }[];
}