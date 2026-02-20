import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { TableDropdownComponent } from '../../shared/components/common/table-dropdown/table-dropdown.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { BusinessService } from '../../core/services/business.service';
import { Business, BusinessRequestDTO } from '../../core/models/business.model';
import { BusinessModalComponent } from './components/business-modal/business-modal.component';

@Component({
    selector: 'app-business',
    imports: [
        CommonModule,
        PageBreadcrumbComponent,
        ButtonComponent,
        TableDropdownComponent,
        BadgeComponent,
        BusinessModalComponent
    ],
    templateUrl: './business.component.html',
    styles: ``
})
export class BusinessComponent implements OnInit {
    businessService = inject(BusinessService);

    // We don't need local businessData anymore as we use the signal from the service

    currentPage = 0; // Server-side pages are 0-indexed
    pageSize = 10;

    isModalOpen = false;
    isViewOnly = false;
    businessToEdit: Business | null = null;

    ngOnInit() {
        this.loadBusinesses();
    }

    loadBusinesses() {
        this.businessService.loadBusinesses(this.currentPage, this.pageSize).subscribe();
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.loadBusinesses();
    }

    openModal() {
        this.businessToEdit = null;
        this.isViewOnly = false;
        this.isModalOpen = true;
    }

    openEditModal(business: Business) {
        this.businessToEdit = business;
        this.isViewOnly = false;
        this.isModalOpen = true;
    }

    openViewModal(business: Business) {
        this.businessToEdit = business;
        this.isViewOnly = true;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.businessToEdit = null;
        this.isViewOnly = false;
    }

    onSaveBusiness(event: { id: string | null, data: BusinessRequestDTO }) {
        if (event.id) {
            this.businessService.updateBusiness(event.id, event.data).subscribe({
                next: () => {
                    this.closeModal();
                    this.loadBusinesses(); // Reload current page to see updates
                },
                error: (err) => {
                    console.error('Error updating business', err);
                }
            });
        } else {
            this.businessService.createBusiness(event.data).subscribe({
                next: () => {
                    this.closeModal();
                    this.loadBusinesses(); // Reload to see new business (might need to go to first page?)
                    // Optionally reset to first page:
                    // this.currentPage = 0;
                    // this.loadBusinesses();
                },
                error: (err) => {
                    console.error('Error creating business', err);
                }
            });
        }
    }

    get totalPages(): number {
        return this.businessService.businesses().totalPages;
    }

    get totalElements(): number {
        return this.businessService.businesses().totalElements;
    }

    get currentItems(): Business[] {
        return this.businessService.businesses().content;
    }

    // Previous goToPage is replaced by onPageChange which handles 0-index logic internally or from template
    // But keeping a compatible method for template simplicity if needed
    goToPage(pageOneIndexed: number) {
        if (pageOneIndexed >= 1 && pageOneIndexed <= this.totalPages) {
            this.currentPage = pageOneIndexed - 1;
            this.loadBusinesses();
        }
    }

    getBadgeColor(isActive: boolean): 'success' | 'warning' | 'error' {
        return isActive ? 'success' : 'error';
    }

    getInitials(name: string): string {
        return name
            ? name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 1)
                .join('')
                .toUpperCase()
            : '?';
    }

    getAvatarColor(name: string): string {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash % colors.length);
        return colors[index];
    }
}
