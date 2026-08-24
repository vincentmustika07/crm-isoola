import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {},
    });

    return table;
}

export interface DeleteCustomerState {
    open: boolean;
    id: number | null;
    loading: boolean;
}

export function useDeleteCustomer() {
    const [state, setState] = useState<DeleteCustomerState>({
        open: false,
        id: null,
        loading: false,
    });
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    function openConfirm(id: number) {
        setState({ open: true, id, loading: false });
    }

    function closeConfirm() {
        setState({ open: false, id: null, loading: false });
    }

    function confirmDelete() {
        if (state.id === null) return;
        const id = state.id;
        setState((s) => ({ ...s, loading: true }));
        router.delete(`/customers/${id}`, {
            onSuccess: () => {
                // Force refresh so the deleted item disappears.
                router.visit('/customers', {
                    replace: true,
                    preserveScroll: false,
                    preserveState: false,
                });
            },
            onFinish: () =>
                isMountedRef.current &&
                setState({ open: false, id: null, loading: false }),
        });
    }

    return { state, openConfirm, closeConfirm, confirmDelete };
}

