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

import * as VillaController from '@/actions/App/Http/Controllers/VillaController';
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
            router.put(VillaController.update.url({ villa: initialData.id }), values);
        } else {
            router.post(VillaController.store.url(), values);
        }
    }

    return { form, onSubmit };
}

export function useVillaTable(data: Villa[], columns: ColumnDef<Villa>[]) {
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

export interface DeleteVillaState {
    open: boolean;
    id: number | null;
    loading: boolean;
}

export function useDeleteVilla() {
    const [state, setState] = useState<DeleteVillaState>({
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
        router.delete(VillaController.destroy.url({ villa: id }), {
            onSuccess: () => {
                router.visit(VillaController.index.url(), {
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

