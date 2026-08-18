import type { VillaStatus } from './types';

export const VILLA_NAME_OPTIONS: { value: string; label: string }[] = [
    { value: 'One Bedroom Suite', label: 'One Bedroom Suite' },
    { value: 'One Bedroom Studio', label: 'One Bedroom Studio' },
    { value: 'One Bedroom Villa', label: 'One Bedroom Villa' },
    { value: 'Two Bedroom Studio', label: 'Two Bedroom Studio' },
    { value: 'Three Bedroom Studio', label: 'Three Bedroom Studio' },
];

export const VILLA_STATUS_OPTIONS: { value: VillaStatus; label: string }[] = [
    { value: 'available', label: 'Available' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
];

export const VILLA_STATUS_LABEL: Record<VillaStatus, string> = {
    available: 'Available',
    pending: 'Pending',
    sold: 'Sold',
};

export const VILLA_STATUS_VARIANT: Record<VillaStatus, 'success' | 'warning' | 'danger'> = {
    available: 'success',
    pending: 'warning',
    sold: 'danger',
};
