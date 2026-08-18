import type { Villa } from '@/features/villas/types';

export interface Customer {
    id: number;
    name: string;
    email: string | null;
    phone_code: string;
    phone_number: string;
    villas: Villa[];
    created_at: string;
    updated_at: string;
}

export interface CustomerFormValues {
    name: string;
    email: string;
    phone_code: string;
    phone_number: string;
    villa_ids: string[];
}
