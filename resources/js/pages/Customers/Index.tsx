import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import {
    useCustomerTable,
    useDeleteCustomer,
} from '@/features/customers/hooks';
import type { Customer } from '@/features/customers/types';
import { VILLA_STATUS_VARIANT } from '@/features/villas/constants';
import AppLayout from '@/layouts/AppLayout';
import type { Paginator } from '@/lib/types';
import { formatPhone } from '@/lib/utils';

interface Props {
    customers: Paginator<Customer>;
}

function CustomerActions({
    customer,
    onDelete,
}: {
    customer: Customer;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/customers/${customer.id}`}>
                <Button variant="secondary" size="sm">
                    Detail
                </Button>
            </Link>
            <Link href={`/customers/${customer.id}/edit`}>
                <Button variant="secondary" size="sm">
                    Edit
                </Button>
            </Link>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(customer.id)}
            >
                Delete
            </Button>
        </div>
    );
}

export default function CustomersIndex({ customers }: Props) {
    const { state, openConfirm, closeConfirm, confirmDelete } =
        useDeleteCustomer();
    const [search, setSearch] = useState('');
    const [villaFilter, setVillaFilter] = useState<'all' | 'with' | 'without'>(
        'all',
    );
    const filtered = customers.data.filter((c) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
            !q ||
            c.name.toLowerCase().includes(q) ||
            (c.email ?? '').toLowerCase().includes(q) ||
            c.phone_number.toLowerCase().includes(q);

        const villaCount = c.villas?.length ?? 0;
        const matchesVillaFilter =
            villaFilter === 'all' ||
            (villaFilter === 'with' && villaCount > 0) ||
            (villaFilter === 'without' && villaCount === 0);

        return matchesSearch && matchesVillaFilter;
    });
    const columns = useMemo<ColumnDef<Customer>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <Link
                        href={`/customers/${row.original.id}`}
                        className="font-medium text-gray-900 transition-colors hover:text-blue-600"
                    >
                        {row.original.name}
                    </Link>
                ),
            },
            {
                accessorKey: 'phone_number',
                header: 'Phone Number',
                cell: ({ row }) => (
                    <span className="text-sm text-gray-600">
                        {formatPhone(
                            row.original.phone_code,
                            row.original.phone_number,
                        )}
                    </span>
                ),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) =>
                    row.original.email ? (
                        <span className="text-sm text-gray-600">
                            {row.original.email}
                        </span>
                    ) : (
                        <span className="text-sm text-gray-400 italic">—</span>
                    ),
            },
            {
                accessorKey: 'villas',
                header: 'Villas',
                cell: ({ row }) => {
                    const v = row.original.villas;

                    if (!v || v.length === 0) {
                        return (
                            <span className="text-sm text-gray-400 italic">
                                —
                            </span>
                        );
                    }

                    return (
                        <div className="flex flex-wrap gap-1">
                            {v.map((villa) => (
                                <Badge
                                    key={villa.id}
                                    variant={VILLA_STATUS_VARIANT[villa.status]}
                                >
                                    {villa.position}
                                </Badge>
                            ))}
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                size: 120,
                cell: ({ row }) => (
                    <CustomerActions
                        customer={row.original}
                        onDelete={openConfirm}
                    />
                ),
            },
        ],
        [openConfirm],
    );
    const table = useCustomerTable(filtered, columns);
    const withVilla = customers.data.filter(
        (c) => c.villas && c.villas.length > 0,
    ).length;
    const withoutVilla = customers.data.filter(
        (c) => !c.villas || c.villas.length === 0,
    ).length;
    const showCount = search.trim() !== '' || villaFilter !== 'all';

    return (
        <AppLayout>
            <Head title="Customers" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Customers test
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage customer data and villa purchases
                        </p>
                    </div>
                    <Link href="/customers/create">
                        <Button>
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <StatCard
                        label="Total"
                        value={customers.total}
                        icon={Users}
                        iconBg="bg-blue-50"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        label="With Villa"
                        value={withVilla}
                        icon={Users}
                        iconBg="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                    <StatCard
                        label="Without Villa"
                        value={withoutVilla}
                        icon={Users}
                        iconBg="bg-gray-100"
                        iconColor="text-gray-500"
                    />
                </div>
                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <div className="relative w-full sm:w-[220px]">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 pr-8 pl-9 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset"
                                />
                                {search.trim() !== '' && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            {showCount && (
                                <span className="text-xs text-gray-500">
                                    {filtered.length} of {customers.total}{' '}
                                    customers
                                </span>
                            )}
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                options={[
                                    { value: 'all', label: 'All' },
                                    { value: 'with', label: 'With Villa' },
                                    {
                                        value: 'without',
                                        label: 'Without Villa',
                                    },
                                ]}
                                value={villaFilter}
                                onChange={(e) =>
                                    setVillaFilter(
                                        e.target.value as
                                            'all' | 'with' | 'without',
                                    )
                                }
                            />
                        </div>
                    </div>
                    <DataTable
                        table={table}
                        emptyMessage="No customers match your search and filter."
                    />
                </div>
            </div>
            <ConfirmModal
                open={state.open}
                title="Delete Customer"
                description="Are you sure you want to delete this customer? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                loading={state.loading}
                onConfirm={confirmDelete}
                onCancel={closeConfirm}
            />
        </AppLayout>
    );
}
