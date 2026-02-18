import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { TableDropdownComponent } from '../../shared/components/common/table-dropdown/table-dropdown.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { BusinessService } from '../../core/services/business.service';
import { Business } from '../../core/models/business.model';

@Component({
    selector: 'app-business',
    imports: [
        CommonModule,
        PageBreadcrumbComponent,
        ButtonComponent,
        TableDropdownComponent,
        BadgeComponent,
        ModalComponent,
    ],
    templateUrl: './business.component.html',
    styles: ``
})
export class BusinessComponent implements OnInit {
    businessService = inject(BusinessService);

    // We don't need local businessData anymore as we use the signal from the service

    currentPage = 1;
    itemsPerPage = 5;
    isModalOpen = false;

    ngOnInit() {
        this.businessService.loadBusinesses().subscribe();
    }

    openModal() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    get totalPages(): number {
        return Math.ceil(this.businessService.businesses().length / this.itemsPerPage);
    }

    get currentItems(): Business[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return this.businessService.businesses().slice(start, start + this.itemsPerPage);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
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
