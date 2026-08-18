import { Head, Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, CheckCircle, Clock, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
    VILLA_STATUS_LABEL,
    VILLA_STATUS_VARIANT,
} from '@/features/villas/constants';
import { useDeleteVilla, useVillaTable } from '@/features/villas/hooks';
import type { Villa } from '@/features/villas/types';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    villas: Villa[];
}

const columns: ColumnDef<Villa>[] = [
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
        size: 120,
        cell: ({ row }) => <VillaActions villa={row.original} />,
    },
];

function VillaActions({ villa }: { villa: Villa }) {
    const { deleteVilla } = useDeleteVilla();

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
                onClick={() => deleteVilla(villa.id)}
            >
                Delete
            </Button>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
}

function StatCard({
    label,
    value,
    icon: Icon,
    iconBg,
    iconColor,
}: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        {label}
                    </p>
                    <p className="mt-1.5 text-3xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
                >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}

export default function VillasIndex({ villas }: Props) {
    const table = useVillaTable(villas, columns);

    const available = villas.filter((v) => v.status === 'available').length;
    const pending = villas.filter((v) => v.status === 'pending').length;
    const sold = villas.filter((v) => v.status === 'sold').length;

    return (
        <AppLayout>
            <Head title="Villas" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Villas</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage villa data and ownership status
                    </p>
                </div>
                <Link href="/villas/create">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Villa
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard
                    label="Total Villas"
                    value={villas.length}
                    icon={Building2}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    label="Available"
                    value={available}
                    icon={CheckCircle}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    label="Pending"
                    value={pending}
                    icon={Clock}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    label="Sold"
                    value={sold}
                    icon={Building2}
                    iconBg="bg-red-50"
                    iconColor="text-red-500"
                />
            </div>

            <DataTable
                table={table}
                emptyMessage="No villas yet. Add your first villa."
            />
        </AppLayout>
    );
}
