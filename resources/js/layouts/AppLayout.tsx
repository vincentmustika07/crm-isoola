import { Link, router, usePage } from '@inertiajs/react';
import { Building2, LogOut, Users } from 'lucide-react';
import type { ReactNode } from 'react';

import * as AuthController from '@/actions/App/Http/Controllers/AuthController';
import * as CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import * as VillaController from '@/actions/App/Http/Controllers/VillaController';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface Props {
    children: ReactNode;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    matchPrefix: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navGroups: NavGroup[] = [
    {
        title: 'Menu',
        items: [
            {
                href: CustomerController.index.url(),
                label: 'Customers',
                icon: Users,
                matchPrefix: '/customers',
            },
        ],
    },
    {
        title: 'Master',
        items: [
            {
                href: VillaController.index.url(),
                label: 'Villas',
                icon: Building2,
                matchPrefix: '/villas',
            },
        ],
    },
];

// Flat list for topbar label lookup
const allNavItems = navGroups.flatMap((g) => g.items);

export default function AppLayout({ children }: Props) {
    const { url } = usePage();

    function handleLogout() {
        router.post(AuthController.logout.url());
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
                {/* Brand */}
                <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-bold tracking-tight text-gray-900">
                            CRM Isoola
                        </span>
                        <p className="mt-0.5 text-[10px] leading-none text-gray-400">
                            Property Management
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-1 flex-col px-4 py-5">
                    {navGroups.map((group, gi) => (
                        <div key={group.title} className={gi > 0 ? 'mt-5' : ''}>
                            <p className="mb-2 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
                                {group.title}
                            </p>
                            <div className="flex flex-col gap-1">
                                {group.items.map((item) => {
                                    const active = url.startsWith(
                                        item.matchPrefix,
                                    );
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                                                active
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-4 w-4 flex-shrink-0',
                                                    active
                                                        ? 'text-white'
                                                        : 'text-gray-400',
                                                )}
                                            />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-200 px-4 py-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center border-b border-gray-200 bg-white px-8">
                    <h2 className="text-sm font-medium text-gray-500">
                        {allNavItems.find((n) => url.startsWith(n.matchPrefix))
                            ?.label ?? 'Dashboard'}
                    </h2>
                </header>
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
            <Toast />
        </div>
    );
}
