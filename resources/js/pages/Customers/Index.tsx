import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
    useCustomerTable,
    useDeleteCustomer,
} from '@/features/customers/hooks';
import type { Customer } from '@/features/customers/types';
import { VILLA_STATUS_VARIANT } from '@/features/villas/constants';
import AppLayout from '@/layouts/AppLayout';
import { formatPhone } from '@/lib/utils';

interface Props {
    customers: Customer[];
}

const columns: ColumnDef<Customer>[] = [
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
            const villas = row.original.villas;

            if (!villas || villas.length === 0) {
                return <span className="text-sm text-gray-400 italic">—</span>;
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {villas.map((villa) => (
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
        cell: ({ row }) => <CustomerActions customer={row.original} />,
    },
];

function CustomerActions({ customer }: { customer: Customer }) {
    const { deleteCustomer } = useDeleteCustomer();

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
                onClick={() => deleteCustomer(customer.id)}
            >
                Delete
            </Button>
        </div>
    );
}

export default function CustomersIndex({ customers }: Props) {
    const table = useCustomerTable(customers, columns);

    const withVilla = customers.filter((c) => c.villas.length > 0).length;
    const withoutVilla = customers.filter((c) => c.villas.length === 0).length;

    return (
        <AppLayout>
            <Head title="Customers" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Customers
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

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Total Customers
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-gray-900">
                                {customers.length}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                With Villa
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-gray-900">
                                {withVilla}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                            <Users className="h-5 w-5 text-emerald-600" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Without Villa
                            </p>
                            <p className="mt-1.5 text-3xl font-bold text-gray-900">
                                {withoutVilla}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                            <Users className="h-5 w-5 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                table={table}
                emptyMessage="No customers yet. Add your first customer."
            />
        </AppLayout>
    );
}
