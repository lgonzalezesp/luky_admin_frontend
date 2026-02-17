export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    businessId: string | null;
    branchId: string | null;
}

export interface LoginResponse {
    token: string;
    id: string;
    name: string;
    email: string;
    role: string;
    businessId: string | null;
    branchId: string | null;
}
