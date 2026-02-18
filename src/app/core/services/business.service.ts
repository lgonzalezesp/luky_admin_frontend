import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Business, BusinessRequestDTO } from '../models/business.model';

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private apiUrl = 'http://localhost:8081/api/v1/businesses';

    // Public signal to hold the state of businesses
    businesses = signal<Business[]>([]);

    constructor(private http: HttpClient) { }

    /**
     * Loads all businesses from the backend and updates the signal.
     * @returns Observable<Business[]>
     */
    loadBusinesses(): Observable<Business[]> {
        return this.http.get<Business[]>(this.apiUrl).pipe(
            tap((data) => {
                this.businesses.set(data);
            })
        );
    }

    /**
     * Creates a new business and updates the signal state seamlessly.
     * @param businessData The data for the new business.
     * @returns Observable<Business>
     */
    createBusiness(businessData: BusinessRequestDTO): Observable<Business> {
        return this.http.post<Business>(this.apiUrl, businessData).pipe(
            tap((newBusiness) => {
                this.businesses.update((currentBusinesses) => [...currentBusinesses, newBusiness]);
            })
        );
    }
}
