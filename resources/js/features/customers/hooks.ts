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

import type { CustomerSchema } from './schema';
import { customerSchema } from './schema';
import type { Customer } from './types';

export function useCustomerForm(initialData?: Customer) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<CustomerSchema, any, CustomerSchema>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(customerSchema) as any,
        defaultValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            phone_code: initialData?.phone_code ?? '+62',
            phone_number: initialData?.phone_number ?? '',
            villa_ids: initialData?.villas?.map((v) => v.id.toString()) ?? [],
        },
    });

    function onSubmit(values: CustomerSchema) {
        const payload = {
            ...values,
            email: values.email || null,
            villa_ids: values.villa_ids.map(Number),
        };

        if (initialData) {
            router.put(`/customers/${initialData.id}`, payload);
        } else {
            router.post('/customers', payload);
        }
    }

    return { form, onSubmit };
}

export function useCustomerTable(
    data: Customer[],
    columns: ColumnDef<Customer>[],
) {
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

export function useDeleteCustomer() {
    function deleteCustomer(id: number) {
        if (
            window.confirm(
                'Delete this customer? This action cannot be undone.',
            )
        ) {
            router.delete(`/customers/${id}`);
        }
    }

    return { deleteCustomer };
}
