export interface Villa {
    id: number;
    name: string;
    position: string;
    status: VillaStatus;
    created_at: string;
    updated_at: string;
    customers_count?: number;
}

export type VillaStatus = 'available' | 'pending' | 'sold';

export interface VillaFormValues {
    name: string;
    position: string;
    status: VillaStatus;
}
