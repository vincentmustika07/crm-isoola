import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { villaSchema } from './schema';
import type { VillaSchema } from './schema';
import type { Villa } from './types';

export function useVillaForm(initialData?: Villa) {
    const form = useForm<VillaSchema>({
        resolver: zodResolver(villaSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            position: initialData?.position ?? '',
            status: initialData?.status ?? 'available',
        },
    });

    function onSubmit(values: VillaSchema) {
        if (initialData) {
            router.put(`/villas/${initialData.id}`, values);
        } else {
            router.post('/villas', values);
        }
    }

    return { form, onSubmit };
}

export function useVillaTable(data: Villa[], columns: ColumnDef<Villa>[]) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return table;
}

export function useDeleteVilla() {
    function deleteVilla(id: number) {
        if (window.confirm('Hapus villa ini? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(`/villas/${id}`);
        }
    }

    return { deleteVilla };
}
