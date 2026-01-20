/**
 * Authentication & User Types
 * Domain: User authentication, roles, permissions
 */

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    profile_image?: ProfileImage;
    roles: string[];
    permissions: string[];
    role_id?: number;
    is_admin: boolean;
    trashed?: boolean;
}

export interface ProfileImage {
    file_name: string;
    size: number;
    original_url: string;
}

export interface Auth {
    user: User;
}

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
