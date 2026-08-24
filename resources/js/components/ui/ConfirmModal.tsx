import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { Button } from './Button';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Focus cancel button when modal opens for accessibility
    useEffect(() => {
        if (open) {
            cancelRef.current?.focus();
        }
    }, [open]);

    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onCancel();
        }
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Panel */}
            <div
                className={cn(
                    'relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl',
                    'animate-in fade-in-0 zoom-in-95 duration-150',
                )}
            >
                <h2
                    id="confirm-modal-title"
                    className="text-base font-semibold text-gray-900"
                >
                    {title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">{description}</p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <Button
                        ref={cancelRef}
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
