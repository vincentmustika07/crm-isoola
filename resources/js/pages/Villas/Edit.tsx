import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
    VILLA_NAME_OPTIONS,
    VILLA_STATUS_OPTIONS,
} from '@/features/villas/constants';
import { useVillaForm } from '@/features/villas/hooks';
import type { VillaSchema } from '@/features/villas/schema';
import type { Villa } from '@/features/villas/types';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    villa: Villa;
}

export default function VillasEdit({ villa }: Props) {
    const { form, onSubmit } = useVillaForm(villa);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingValues, setPendingValues] = useState<VillaSchema | null>(
        null,
    );
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <AppLayout>
            <Head title={`Edit — ${villa.name}`} />

            <div className="mb-6">
                <Link
                    href="/villas"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Villas
                </Link>
            </div>

            <div className="mx-auto max-w-xl">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Edit Villa
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Update information for <strong>{villa.name}</strong>.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <form
                        onSubmit={handleSubmit((values) => {
                            setPendingValues(values);
                            setConfirmOpen(true);
                        })}
                        className="space-y-5"
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Villa Name"
                                    options={VILLA_NAME_OPTIONS}
                                    placeholder="Select villa type"
                                    error={errors.name?.message}
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    onBlur={field.onBlur}
                                    name={field.name}
                                />
                            )}
                        />
                        <Input
                            label="Position / Code"
                            hint="Letters and numbers only, no spaces"
                            error={errors.position?.message}
                            {...register('position')}
                        />
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Status"
                                    options={VILLA_STATUS_OPTIONS}
                                    error={errors.status?.message}
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                    onBlur={field.onBlur}
                                    name={field.name}
                                />
                            )}
                        />

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link href="/villas">
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" loading={isSubmitting}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="Save Changes"
                description={`Are you sure you want to save changes for ${villa.name}?`}
                confirmLabel="Save"
                variant="primary"
                onConfirm={() => {
                    if (!pendingValues) {
return;
}

                    onSubmit(pendingValues);
                    setConfirmOpen(false);
                    setPendingValues(null);
                }}
                onCancel={() => {
                    setConfirmOpen(false);
                    setPendingValues(null);
                }}
            />
        </AppLayout>
    );
}
