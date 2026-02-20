import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { TextAreaComponent } from '../../../../shared/components/form/input/text-area.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Business, BusinessRequestDTO } from '../../../../core/models/business.model';

@Component({
    selector: 'app-business-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModalComponent,
        InputFieldComponent,
        TextAreaComponent,
        LabelComponent,
        SwitchComponent,
        ButtonComponent
    ],
    templateUrl: './business-modal.component.html',
})
export class BusinessModalComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() businessToEdit: Business | null = null;
    @Input() isViewOnly = false;
    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<{ id: string | null, data: BusinessRequestDTO }>();

    private fb = inject(FormBuilder);
    businessForm!: FormGroup;

    constructor() {
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && this.isOpen) {
            this.updateFormState();
        }
    }

    private initForm() {
        this.businessForm = this.fb.group({
            taxId: ['', Validators.required],
            name: ['', Validators.required],
            businessType: ['', Validators.required],
            contactEmail: ['', [Validators.required, Validators.email]],
            phoneNumber: [''],
            address: [''],
            description: [''],
            logoUrl: [''],
            isActive: [true],
            currentCashbackPercentage: [0, [Validators.min(0), Validators.max(100)]],
            pointsExpirationDays: [365, Validators.required]
        });
    }

    private updateFormState() {
        if (this.isViewOnly) {
            this.businessForm.disable();
        } else {
            this.businessForm.enable();
        }

        if (this.businessToEdit) {
            this.patchForm(this.businessToEdit);
        } else {
            this.businessForm.reset({
                isActive: true,
                currentCashbackPercentage: 0,
                pointsExpirationDays: 365
            });
        }
    }

    private patchForm(business: Business) {
        this.businessForm.patchValue({
            taxId: business.taxId,
            name: business.name,
            businessType: business.businessType,
            contactEmail: business.contactEmail,
            phoneNumber: business.phoneNumber,
            address: business.address,
            description: business.description,
            logoUrl: business.logoUrl,
            isActive: business.isActive,
            currentCashbackPercentage: business.currentCashbackPercentage,
            pointsExpirationDays: business.pointsExpirationDays
        });
    }

    closeModal() {
        this.close.emit();
    }

    onSubmit() {
        if (this.businessForm.valid) {
            this.save.emit({
                id: this.businessToEdit?.id || null,
                data: this.businessForm.value
            });
        }
    }
}
