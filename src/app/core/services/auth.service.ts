import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private readonly API_URL = 'http://localhost:8081/api/v1';

    currentUser = signal<User | null>(null);

    constructor() {
        const savedUser = localStorage.getItem('luky_user');
        if (savedUser) {
            try {
                this.currentUser.set(JSON.parse(savedUser));
            } catch (e) {
                console.error('Error parsing stored user', e);
                this.logout();
            }
        }
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('luky_token', response.token);

                const user: User = {
                    id: response.id,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                    businessId: response.businessId,
                    branchId: response.branchId
                };

                localStorage.setItem('luky_user', JSON.stringify(user));
                this.currentUser.set(user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('luky_token');
        localStorage.removeItem('luky_user');
        this.currentUser.set(null);
        this.router.navigate(['/signin']);
    }
}
