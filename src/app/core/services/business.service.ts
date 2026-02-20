import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Business, BusinessRequestDTO } from '../models/business.model';
import { Page } from '../models/page.model';

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private apiUrl = 'http://localhost:8081/api/v1/businesses';

    // Public signal to hold the state of businesses metadata
    businesses = signal<Page<Business>>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false
        },
        last: true,
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        first: true,
        numberOfElements: 0,
        empty: true
    });

    constructor(private http: HttpClient) { }

    /**
     * Loads businesses from the backend with pagination and updates the signal.
     * @param page Zero-based page index (default: 0)
     * @param size The size of the page to be returned (default: 10)
     * @param sort Sorting criteria in the format: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.
     * @returns Observable<Page<Business>>
     */
    loadBusinesses(page: number = 0, size: number = 10, sort: string = 'name,asc'): Observable<Page<Business>> {
        const params = {
            page: page.toString(),
            size: size.toString(),
            sort: sort
        };

        return this.http.get<Page<Business>>(this.apiUrl, { params }).pipe(
            tap((data) => {
                this.businesses.set(data);
            })
        );
    }

    /**
     * Creates a new business. 
     * Note: We don't automatically update the list here because we might be on a different page.
     * The component should decide whether to reload the list.
     * @param businessData The data for the new business.
     * @returns Observable<Business>
     */
    createBusiness(businessData: BusinessRequestDTO): Observable<Business> {
        return this.http.post<Business>(this.apiUrl, businessData);
    }

    /**
     * Updates an existing business.
     * Note: We don't automatically update the list locally because the sort order might change.
     * The component should reload the current page.
     * @param id The ID of the business to update.
     * @param businessData The updated data for the business.
     * @returns Observable<Business>
     */
    updateBusiness(id: string, businessData: BusinessRequestDTO): Observable<Business> {
        return this.http.put<Business>(`${this.apiUrl}/${id}`, businessData);
    }
}
