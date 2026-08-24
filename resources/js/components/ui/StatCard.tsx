import type { ElementType } from 'react';

interface StatCardProps {
    label: string;
    value: number;
    icon: ElementType;
    iconBg: string;
    iconColor: string;
}

export function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        {label}
                    </p>
                    <p className="mt-1.5 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
