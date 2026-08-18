import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

export interface MultiSelectOption {
    value: string;
    label: string;
    /** Secondary label shown in dropdown (e.g. full name) */
    sublabel?: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;
    name?: string;
}

export function MultiSelect({
    options,
    value,
    onChange,
    label,
    placeholder = 'Select...',
    hint,
    error,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.filter((o) => value.includes(o.value));

    const filtered = options.filter(
        (o) =>
            !value.includes(o.value) &&
            (o.label.toLowerCase().includes(search.toLowerCase()) ||
                (o.sublabel ?? '').toLowerCase().includes(search.toLowerCase())),
    );

    function toggle(optionValue: string) {
        if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
        setSearch('');
        inputRef.current?.focus();
    }

    function remove(optionValue: string, e: React.MouseEvent) {
        e.stopPropagation();
        onChange(value.filter((v) => v !== optionValue));
    }

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {/* Trigger box */}
            <div
                className={cn(
                    'min-h-[42px] w-full cursor-text rounded-lg border bg-white px-3 py-2 text-sm transition',
                    'flex flex-wrap items-center gap-1.5',
                    open
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-300',
                    error && 'border-red-400 ring-2 ring-red-400/20',
                )}
                onClick={() => {
                    setOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {/* Pills */}
                {selected.map((opt) => (
                    <span
                        key={opt.value}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700"
                    >
                        {opt.label}
                        <button
                            type="button"
                            onClick={(e) => remove(opt.value, e)}
                            className="ml-0.5 rounded hover:text-blue-900 focus:outline-none"
                            aria-label={`Remove ${opt.label}`}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}

                {/* Search input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder={selected.length === 0 ? placeholder : ''}
                    className="min-w-[60px] flex-1 border-none bg-transparent p-0 text-sm placeholder-gray-400 outline-none"
                />

                <ChevronDown
                    className={cn(
                        'ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform',
                        open && 'rotate-180',
                    )}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2.5 text-sm text-gray-400 italic">
                            {search
                                ? 'No options found'
                                : 'All options selected'}
                        </div>
                    ) : (
                        <ul className="max-h-56 overflow-y-auto py-1">
                            {filtered.map((opt) => (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(opt.value)}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50"
                                    >
                                        <span className="font-medium text-gray-900">
                                            {opt.label}
                                        </span>
                                        {opt.sublabel && (
                                            <span className="ml-auto text-xs text-gray-400">
                                                {opt.sublabel}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {hint && !error && (
                <p className="mt-1 text-xs text-gray-400">{hint}</p>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
