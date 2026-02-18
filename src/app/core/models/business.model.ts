export interface BusinessRequestDTO {
    taxId: string;
    name: string;
    description: string;
    businessType: string;
    logoUrl: string;
    address: string;
    contactEmail: string;
    phoneNumber: string; // Changed from number to string as per common practice for phone numbers, but requested as number? No, requested as string.
    currentCashbackPercentage: number;
    pointsExpirationDays: number | null;
}

export interface Business extends BusinessRequestDTO {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}
