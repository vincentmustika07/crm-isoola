import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Edit,
    Phone,
    Tag,
    Trash2,
    User,
    Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { Customer } from '@/features/customers/types';
import {
    VILLA_STATUS_LABEL,
    VILLA_STATUS_VARIANT,
} from '@/features/villas/constants';
import { useDeleteVilla } from '@/features/villas/hooks';
import type { Villa } from '@/features/villas/types';
import AppLayout from '@/layouts/AppLayout';
import { formatPhone } from '@/lib/utils';

interface Props {
    villa: Villa & { customers: Customer[] };
}

export default function VillasShow({ villa }: Props) {
    const { state, openConfirm, closeConfirm, confirmDelete } = useDeleteVilla();

    return (
        <AppLayout>
            <Head title={`Villa — ${villa.name}`} />

            <div className="mb-6">
                <Link
                    href="/villas"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Villas
                </Link>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
                        <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {villa.name}
                        </h1>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-gray-700">
                                {villa.position}
                            </span>
                            <Badge variant={VILLA_STATUS_VARIANT[villa.status]}>
                                {VILLA_STATUS_LABEL[villa.status]}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/villas/${villa.id}/edit`}>
                        <Button variant="secondary">
                            <Edit className="h-4 w-4" />
                            Edit Villa
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={() => openConfirm(villa.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Villa
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Villa Details — full width */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                        <h2 className="text-sm font-semibold text-gray-900">
                            Villa Details
                        </h2>
                    </div>
                    <div className="grid gap-6 p-6 sm:grid-cols-3">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                <Building2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Villa Name
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-gray-900">
                                    {villa.name}
                                </p>
                            </div>
                        </div>

                        {/* Position */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                                <Tag className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Position / Code
                                </p>
                                <p className="mt-0.5 font-mono text-sm font-semibold text-gray-900">
                                    {villa.position}
                                </p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50">
                                <Users className="h-4 w-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                    Status
                                </p>
                                <div className="mt-1">
                                    <Badge
                                        variant={
                                            VILLA_STATUS_VARIANT[villa.status]
                                        }
                                    >
                                        {VILLA_STATUS_LABEL[villa.status]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customers Table */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-semibold text-gray-900">
                                Customers
                            </h2>
                            {villa.customers && villa.customers.length > 0 && (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {villa.customers.length}
                                </span>
                            )}
                        </div>
                    </div>

                    {!villa.customers || villa.customers.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <Users className="mx-auto h-8 w-8 text-gray-300" />
                            <p className="mt-2 text-sm text-gray-400">
                                No customers assigned to this villa yet.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Customer Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wide text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {villa.customers.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                                                    <User className="h-3.5 w-3.5 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {c.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                {formatPhone(
                                                    c.phone_code,
                                                    c.phone_number,
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {c.email ?? (
                                                <span className="text-gray-400 italic">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/customers/${c.id}`}>
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
                title="Delete Villa"
                description="Are you sure you want to delete this villa? This action cannot be undone and will remove all associated customer links."
                confirmLabel="Delete"
                variant="danger"
                loading={state.loading}
                onConfirm={confirmDelete}
                onCancel={closeConfirm}
            />
        </AppLayout>
    );
}
