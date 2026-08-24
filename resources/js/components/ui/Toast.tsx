import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error';

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

export function Toast() {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const items: ToastItem[] = [];

        if (flash?.success) {
            items.push({ id: Date.now(), message: flash.success, type: 'success' });
        }
        if (flash?.error) {
            items.push({ id: Date.now() + 1, message: flash.error, type: 'error' });
        }

        if (items.length === 0) return;

        setToasts((prev) => [...prev, ...items]);

        const timer = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => !items.find((i) => i.id === t.id)));
        }, 3500);

        return () => clearTimeout(timer);
    }, [flash]);

    if (toasts.length === 0) return null;

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    role="alert"
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
                        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    {toast.type === 'success' ? (
                        <svg
                            className="h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg
                            className="h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
