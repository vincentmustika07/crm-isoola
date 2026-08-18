import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    name?: string;
    id?: string;
    className?: string;
    disabled?: boolean;
    searchable?: boolean;
}

export function Select({
    label,
    error,
    hint,
    options,
    placeholder,
    value: controlledValue,
    defaultValue,
    onChange,
    onBlur,
    name,
    id,
    className,
    disabled,
    searchable = false,
}: SelectProps) {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [internalValue, setInternalValue] = useState<string | number>(
        controlledValue ?? defaultValue ?? '',
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLSelectElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Sync if controlled from outside
    useEffect(() => {
        if (controlledValue !== undefined) {
            setInternalValue(controlledValue);
        }
    }, [controlledValue]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (open && searchable) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
        if (!open) {
            setSearch('');
        }
    }, [open, searchable]);

    // Close on outside click
    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);

        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const allOptions: SelectOption[] = placeholder
        ? [{ value: '', label: placeholder }, ...options]
        : options;

    const filteredOptions = searchable && search
        ? allOptions.filter((o) =>
              o.label.toLowerCase().includes(search.toLowerCase()),
          )
        : allOptions;

    const selected = allOptions.find(
        (o) => String(o.value) === String(internalValue),
    );
    const displayLabel = selected
        ? selected.label
        : (placeholder ?? 'Pilih...');

    function handleSelect(opt: SelectOption) {
        setInternalValue(opt.value);
        setOpen(false);
        setSearch('');

        // Trigger onChange on the hidden select
        if (hiddenRef.current) {
            const nativeInput = hiddenRef.current;
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                HTMLSelectElement.prototype,
                'value',
            )?.set;

            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(nativeInput, String(opt.value));
                nativeInput.dispatchEvent(
                    new Event('change', { bubbles: true }),
                );
            }
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLSelectElement>) {
        onBlur?.(e);
    }

    return (
        <div className={cn('relative', className)} ref={containerRef}>
            {/* Hidden native select for form compatibility */}
            <select
                ref={hiddenRef}
                name={name}
                id={selectId}
                value={String(internalValue)}
                onChange={onChange}
                onBlur={handleBlur}
                aria-hidden="true"
                tabIndex={-1}
                className="sr-only"
            >
                {allOptions.map((opt) => (
                    <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {label && (
                <label
                    htmlFor={selectId}
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            {/* Custom trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    'flex w-full items-center justify-between rounded-md py-2 px-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-shadow focus:ring-2 focus:ring-inset focus:ring-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'ring-red-300 focus:ring-red-500',
                    open && 'ring-2 ring-inset ring-blue-600',
                )}
            >
                <span
                    className={cn(
                        'truncate',
                        !selected ||
                            (placeholder && String(internalValue) === '')
                            ? 'text-gray-400'
                            : 'text-gray-900',
                    )}
                >
                    {displayLabel}
                </span>
                <ChevronDown
                    className={cn(
                        'ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-150',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                    {/* Search input */}
                    {searchable && (
                        <div className="border-b border-gray-100 p-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full rounded border-0 bg-gray-50 py-1.5 pr-7 pl-7 text-sm text-gray-900 placeholder-gray-400 ring-1 ring-gray-200 focus:ring-blue-500 focus:outline-none"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    <ul
                        role="listbox"
                        className="max-h-56 overflow-y-auto py-1"
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-400">
                                No results found
                            </li>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected =
                                    String(opt.value) ===
                                    String(internalValue);
                                const isPlaceholder =
                                    placeholder && opt.value === '';

                                return (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelect(opt)}
                                        className={cn(
                                            'cursor-pointer px-3 py-2 text-sm transition-colors',
                                            isPlaceholder
                                                ? 'text-gray-400'
                                                : 'text-gray-900',
                                            isSelected
                                                ? 'bg-blue-50 font-medium text-blue-700'
                                                : 'hover:bg-gray-50',
                                        )}
                                    >
                                        {opt.label}
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}

            {hint && !error && (
                <p className="mt-1 text-xs text-gray-500">{hint}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
