import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, CheckCircle, Clock, Plus, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Select';
import { StatCard } from '@/components/ui/StatCard';
import {
    VILLA_STATUS_LABEL,
    VILLA_STATUS_OPTIONS,
    VILLA_STATUS_VARIANT,
} from '@/features/villas/constants';
import { useDeleteVilla, useVillaTable } from '@/features/villas/hooks';
import type { Villa, VillaStatus } from '@/features/villas/types';
import AppLayout from '@/layouts/AppLayout';
import type { Paginator } from '@/lib/types';

interface Props {
    villas: Paginator<Villa>;
}

function VillaActions({
    villa,
    onDelete,
}: {
    villa: Villa;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/villas/${villa.id}`}>
                <Button variant="secondary" size="sm">
                    Detail
                </Button>
            </Link>
            <Link href={`/villas/${villa.id}/edit`}>
                <Button variant="secondary" size="sm">
                    Edit
                </Button>
            </Link>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(villa.id)}
            >
                Delete
            </Button>
        </div>
    );
}

export default function VillasIndex({ villas }: Props) {
    const { state, openConfirm, closeConfirm, confirmDelete } = useDeleteVilla();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<VillaStatus | 'all'>('all');

    const filtered = villas.data.filter((villa) => {
        const q = search.toLowerCase();
        const matchesSearch =
            villa.name.toLowerCase().includes(q) ||
            villa.position.toLowerCase().includes(q);
        const matchesStatus =
            statusFilter === 'all' || villa.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const columns = useMemo<ColumnDef<Villa>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Villa Name',
                cell: ({ row }) => (
                    <Link
                        href={`/villas/${row.original.id}`}
                        className="font-medium text-gray-900 transition-colors hover:text-blue-600"
                    >
                        {row.original.name}
                    </Link>
                ),
            },
            {
                accessorKey: 'position',
                header: 'Position',
                cell: ({ row }) => (
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700">
                        {row.original.position}
                    </span>
                ),
                size: 120,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <Badge variant={VILLA_STATUS_VARIANT[row.original.status]}>
                        {VILLA_STATUS_LABEL[row.original.status]}
                    </Badge>
                ),
                size: 140,
            },
            {
                id: 'actions',
                header: '',
                enableSorting: false,
                size: 200,
                cell: ({ row }) => (
                    <VillaActions villa={row.original} onDelete={openConfirm} />
                ),
            },
        ],
        [openConfirm],
    );

    const table = useVillaTable(filtered, columns);

    const totalAvailable = villas.data.filter((v) => v.status === 'available').length;
    const totalSold = villas.data.filter((v) => v.status === 'sold').length;
    const totalPending = villas.data.filter((v) => v.status === 'pending').length;
    const showCount = search.trim() !== '' || statusFilter !== 'all';

    return (
        <AppLayout>
            <Head title="Villas" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Villas</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage villa data and ownership status</p>
                    </div>
                    <Link href="/villas/create">
                        <Button><Plus className="h-4 w-4" />Add Villa</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard label="Total" value={villas.total} icon={Building2} iconBg="bg-blue-50" iconColor="text-blue-600" />
                    <StatCard label="Available" value={totalAvailable} icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
                    <StatCard label="Pending" value={totalPending} icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
                    <StatCard label="Sold" value={totalSold} icon={Building2} iconBg="bg-red-50" iconColor="text-red-500" />
                </div>


                <div className="rounded-lg border border-gray-200 bg-white">
                    <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <div className="relative w-full sm:w-[220px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or position..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 pl-9 pr-8 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                            />
                            {search.trim() !== '' && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Clear search"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            </div>

                            {showCount && (
                                <span className="text-xs text-gray-500">
                                    {filtered.length} of {villas.total} villas
                                </span>
                            )}
                        </div>

                        <div className="w-full sm:w-44">
                            <Select
                                options={[
                                    { value: 'all', label: 'All' },
                                    ...VILLA_STATUS_OPTIONS,
                                ]}
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as VillaStatus | 'all',
                                    )
                                }
                            />
                        </div>
                    </div>
                    <DataTable table={table} emptyMessage="No villas match your search and filter." />
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

