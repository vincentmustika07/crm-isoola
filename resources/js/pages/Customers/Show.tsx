import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Edit,
    Mail,
    Phone,
    Trash2,
    User,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useDeleteCustomer } from '@/features/customers/hooks';
import type { Customer } from '@/features/customers/types';
import {
    VILLA_STATUS_LABEL,
    VILLA_STATUS_VARIANT,
} from '@/features/villas/constants';
import AppLayout from '@/layouts/AppLayout';
import { formatPhone } from '@/lib/utils';

interface Props {
    customer: Customer;
}

export default function CustomersShow({ customer }: Props) {
    const { state, openConfirm, closeConfirm, confirmDelete } = useDeleteCustomer();

    return (
        <AppLayout>
            <Head title={`Customer — ${customer.name}`} />

            <div className="mb-6">
                <Link
                    href="/customers"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
                        <User className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {customer.name}
                        </h1>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                            <Phone className="h-3.5 w-3.5" />
                            {formatPhone(
                                customer.phone_code,
                                customer.phone_number,
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/customers/${customer.id}/edit`}>
                        <Button variant="secondary">
                            <Edit className="h-4 w-4" />
                            Edit Customer
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={() => openConfirm(customer.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Customer
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Customer Details — full width */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Customer Details
                        </h2>
                    </div>
                    <div className="grid gap-6 p-6 sm:grid-cols-3">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Name
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900">
                                    {customer.name}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                                <Phone className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Phone Number
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900">
                                    {formatPhone(
                                        customer.phone_code,
                                        customer.phone_number,
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                                <Mail className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Email
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900">
                                    {customer.email ?? (
                                        <span className="text-gray-400 italic">
                                            —
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Villas Table */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-semibold text-gray-900">
                                Villas
                            </h2>
                            {customer.villas.length > 0 && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {customer.villas.length}
                                </span>
                            )}
                        </div>
                    </div>

                    {customer.villas.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <Building2 className="mx-auto h-8 w-8 text-gray-300" />
                            <p className="mt-2 text-sm text-gray-400">
                                No villas assigned yet.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Villa Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {customer.villas.map((villa) => (
                                    <tr
                                        key={villa.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {villa.name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-600">
                                            {villa.position}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={
                                                    VILLA_STATUS_VARIANT[
                                                        villa.status
                                                    ]
                                                }
                                            >
                                                {
                                                    VILLA_STATUS_LABEL[
                                                        villa.status
                                                    ]
                                                }
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/villas/${villa.id}`}>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    View
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
