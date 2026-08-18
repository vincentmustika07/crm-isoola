import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Select } from '@/components/ui/Select';
import { COUNTRY_CODES } from '@/features/customers/constants';
import { useCustomerForm } from '@/features/customers/hooks';
import type { Villa } from '@/features/villas/types';
import AppLayout from '@/layouts/AppLayout';

interface Props {
    villas: Villa[];
}

// Strip non-digits and enforce max 13 digits
function maskPhoneNumber(value: string): string {
    return value.replace(/\D/g, '').slice(0, 13);
}

export default function CustomersCreate({ villas }: Props) {
    const { form, onSubmit } = useCustomerForm();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const villaOptions = villas.map((v) => ({
        value: v.id.toString(),
        label: v.position,
        sublabel: v.name,
    }));

    const phoneCodeOptions = COUNTRY_CODES.map((c) => ({
        value: c.code,
        label: `${c.flag} ${c.code} ${c.label}`,
    }));

    // Register phone_number with masking
    const phoneNumberRegister = register('phone_number');

    return (
        <AppLayout>
            <Head title="Add Customer" />

            <div className="mb-6">
                <Link
                    href="/customers"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Link>
            </div>

            <div className="mx-auto max-w-xl">
                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Add Customer
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Fill in the form below to add a new customer.
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <Input
                            label="Customer Name"
                            placeholder="e.g. John Doe"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="e.g. john@example.com"
                            hint="Optional"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="flex items-start gap-2">
                                <div className="w-52">
                                    <Controller
                                        name="phone_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                searchable
                                                options={phoneCodeOptions}
                                                error={
                                                    errors.phone_code?.message
                                                }
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={field.onBlur}
                                                name={field.name}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        placeholder="e.g. 81234567890"
                                        inputMode="numeric"
                                        maxLength={13}
                                        error={errors.phone_number?.message}
                                        {...phoneNumberRegister}
                                        onChange={(e) => {
                                            e.target.value = maskPhoneNumber(
                                                e.target.value,
                                            );
                                            phoneNumberRegister.onChange(e);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <Controller
                            name="villa_ids"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    label="Villas"
                                    options={villaOptions}
                                    placeholder="Select villas..."
                                    hint="Select one or more villas for this customer"
                                    error={errors.villa_ids?.message}
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                />
                            )}
                        />

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link href="/customers">
                                <Button variant="secondary" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" loading={isSubmitting}>
                                Save Customer
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
